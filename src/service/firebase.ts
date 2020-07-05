import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Player, Room } from '../types'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measumentId: process.env.FIREBASE_MEASUREMENT_ID,
}

const init = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }
}

export const getAuth = () => {
  init()

  const provider = new firebase.auth.GoogleAuthProvider()
  const auth = firebase.auth()

  if (typeof window !== undefined) {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  }

  return {
    auth,
    login: () => auth.signInWithPopup(provider),
    logout: () => auth.signOut(),
  }
}

export const getFirestore = () => {
  init()
  return firebase.firestore()
}
export const solveRef = (userId: string) => {
  return getFirestore().collection('solve').doc(userId)
}

export const usableUserId = async (userId: string) => {
  const fdb = getFirestore()
  const docs = await fdb.collection('user').where('id', '==', userId).get()

  return docs.size === 0
}

export const getRoomData = async (roomId: string) => {
  const fdb = getFirestore()
  const room = await fdb.collection('room').doc(roomId).get()

  return room.data() as Room
}
export const getRoomRef = (roomId: string) => {
  return getFirestore().collection('room').doc(roomId)
}

export const getRoom = async (roomId: string) => {
  const fdb = getFirestore()
  const room = await fdb.collection('room').doc(roomId).get()

  if (room.exists) {
    return room.ref
  }
  await room.ref.set({
    createdAt: +new Date(),
    players: {},
    tools: {},
  })
  return room.ref
}

export function useRoom(roomId: string): [Room | null, string | null] {
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  useEffect(() => {
    getRoom(roomId).then((ref) =>
      ref.onSnapshot((snap) => {
        setRoom(compRoom(snap.data() as Room))
      })
    )
  }, [])
  useEffect(() => {
    if (!room) return

    const newPlayerId = String(
      (_.max(Object.keys(room.players).map(Number)) || 0) + 1
    )

    setPlayerId(newPlayerId)
    return () => {
      // exitPlayer(roomId, newPlayerId)
    }
  }, [!!room])

  return [room, playerId]
}

export const updatePlayers = (
  roomId: string,
  players: { [id: string]: Player | false }
) => {
  const fdb = getFirestore()

  const roomRef = fdb.collection('room').doc(roomId)

  roomRef.update({ players })
  return roomRef
}
export const joinPlayer = async (roomId: string, playerId: string) => {
  const fdb = getFirestore()
  const roomRef = fdb.collection('room').doc(roomId)
  const room = (await roomRef.get()).data()

  if (!room) return
  const players = ((await roomRef.get()).data() as Room).players || {}

  updatePlayers(roomId, {
    ...players,
    [playerId]: { name: 'Player-' + playerId, tools: {} },
  })
}

export const exitPlayer = async (roomId: string, playerId: string) => {
  const fdb = getFirestore()
  const roomRef = fdb.collection('room').doc(roomId)
  const room = (await roomRef.get()).data()

  if (!room) return
  const players = (room as Room).players || {}

  delete players[playerId]

  return updatePlayers(roomId, players)
}
function compRoom(raw: Room): Room {
  const room: Room = {
    createdAt: raw.createdAt,
    players: {},
    tools: raw.tools || {},
  }

  Object.entries(raw.players || {}).forEach(([k, v]) => {
    if (!v) return
    room.players[k] = v
  })
  return room
}

export async function updatePlayer(
  roomId: string,
  playerId: string,
  player: Player
) {
  const fdb = getFirestore()
  const roomRef = fdb.collection('room').doc(roomId)
  const room = (await roomRef.get()).data()

  if (!room) return
  const players = ((await roomRef.get()).data() as Room).players || {}

  updatePlayers(roomId, Object.assign({}, players, { [playerId]: player }))
}
