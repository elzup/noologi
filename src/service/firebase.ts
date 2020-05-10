import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { Card, Player, Room, RoomRaw } from '../types'
import { genRandomStrWhite } from '../utils'

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

export function makeCards() {
  const nums = [...Array(100).keys()].map((v) => v + 1)

  const obj: { [id: string]: Card } = {}

  nums.forEach((v) => {
    obj[v] = { text: String(v), open: false }
  })
  return obj
}

export const getRoom = async (roomId: string) => {
  const fdb = getFirestore()
  const room = await fdb.collection('room').doc(roomId).get()

  if (room.exists) {
    return room.ref
  }
  const newRoom = {
    mountCards: makeCards(),
  }

  room.ref.set(newRoom)
  return room.ref
}

const isOfflineForFirestore = {
  state: 'offline',
  lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
}

const isOnlineForFirestore = {
  state: 'online',
  lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
}

export const updatePlayer = (
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
  const players = ((await roomRef.get()).data() as RoomRaw).players || {}

  updatePlayer(roomId, {
    ...players,
    [playerId]: { name: 'Player-' + playerId, cards: {} },
  })
}
export const initPlayer = async (roomId: string, playerId: string) => {
  const rdbRef = firebase.database().ref(`/status/${roomId}/${playerId}`)

  firebase
    .database()
    .ref(`.info/connected`)
    .on('value', (snapshot) => {
      if (snapshot.val() == false) {
        // Instead of simply returning, we'll also set Firestore's state
        // to 'offline'. This ensures that our Firestore cache is aware
        // of the switch to 'offline.'
        exitPlayer(roomId, playerId)
        return
      }

      rdbRef
        .onDisconnect()
        .set(isOfflineForFirestore)
        .then(function () {
          rdbRef.set(isOnlineForFirestore)
          joinPlayer(roomId, playerId)
        })
    })
}

export const exitPlayer = async (roomId: string, playerId: string) => {
  const fdb = getFirestore()
  const roomRef = fdb.collection('room').doc(roomId)
  const room = (await roomRef.get()).data()

  if (!room) return
  const players = (room as RoomRaw).players || {}

  delete players[playerId]

  return updatePlayer(roomId, players)
}

function compRoom(raw: RoomRaw): Room {
  const room: Room = { players: {}, mountCards: raw.mountCards }

  Object.entries(raw.players || {}).forEach(([k, v]) => {
    if (!v) return
    room.players[k] = v
  })
  return room
}
const getRoomRef = (roomId: string) => {
  const fdb = getFirestore()

  return fdb.collection('room').doc(roomId)
}

const sample = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export async function drawCard(room: Room, roomId: string, playerId: string) {
  const cardKey = sample(Object.keys(room.mountCards))
  const newRoom = _.cloneDeep(room)
  const mountCards = { ...room.mountCards }

  const card = mountCards[cardKey]

  delete mountCards[cardKey]
  newRoom.mountCards = mountCards
  newRoom.players[playerId].cards[cardKey] = card

  const roomRef = getRoomRef(roomId)

  return roomRef.update(newRoom)
}

export function useRoom(roomId: string): [Room | null, string | null] {
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  useEffect(() => {
    getRoom(roomId).then((ref) =>
      ref.onSnapshot((snap) => {
        setRoom(compRoom(snap.data() as RoomRaw))
      })
    )
  }, [])
  useEffect(() => {
    console.log('effect')

    if (!room) return
    const newPlayerId = genRandomStrWhite(room.players, 5)

    initPlayer(roomId, newPlayerId).then(() => {
      setPlayerId(newPlayerId)
    })
    return () => {
      // exitPlayer(roomId, newPlayerId)
    }
  }, [!!room])

  return [room, playerId]
}
