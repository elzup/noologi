import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { Card, Player, Room, CardTool } from '../types'
import { genRandomStrWhite } from '../utils'
import { CardFields } from '../components/RoomPage/CreateCardForm'

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

export function makeCards(template: { [key: string]: number }) {
  const obj: Card[] = []

  _.each(template, (num, k) => {
    _.range(1, num + 1).forEach((v) => {
      obj.push({ text: k + String(v), open: false, removed: false })
    })
  })

  return _.keyBy(obj, 'text')
}

export const getRoomData = async (roomId: string) => {
  const fdb = getFirestore()
  const room = await fdb.collection('room').doc(roomId).get()

  return room.data() as Room
}
const getRoomRef = (roomId: string) => {
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
export const resetMountCards = async (roomId: string, toolId: number) => {
  const fdb = getFirestore()
  const snap = await fdb.collection('room').doc(roomId).get()
  const room = snap.data() as Room
  const players: Record<string, Player> = {}

  _.each(room.players, (v, k) => {
    if (v)
      players[k] = {
        ...v,
        tools: { ...v.tools, [toolId]: { tooltype: 'card', cards: {} } },
      }
  })

  const tool = room.tools[toolId]

  if (tool.tooltype !== 'card') throw new Error('invalid tooltype')

  await snap.ref.update({
    players,
    tools: {
      ...room.tools,
      [toolId]: {
        ...room.tools[toolId],
        mountCards: makeCards(tool.template),
      },
    },
  })
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
  const players = ((await roomRef.get()).data() as Room).players || {}

  updatePlayer(roomId, {
    ...players,
    [playerId]: { name: 'Player-' + playerId, tools: {} },
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
  const players = (room as Room).players || {}

  delete players[playerId]

  return updatePlayer(roomId, players)
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

const sample = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export async function drawCard(
  room: Room,
  roomId: string,
  playerId: string,
  toolId: string
) {
  const tool = room.tools[toolId]

  if (tool.tooltype !== 'card') throw Error('invalid tooltype')
  const cardKey = sample(Object.keys(tool.mountCards))
  const newRoom = _.cloneDeep(room)
  const mountCards = { ...tool.mountCards }

  mountCards[cardKey].removed = true
  newRoom.tools[toolId] = { ...tool, mountCards }

  const playerTool = newRoom.players[playerId].tools[toolId] || {
    tooltype: 'card',
    cards: {},
  }

  if (playerTool.tooltype !== 'card') throw new Error('invalid tooltype')
  playerTool.cards[cardKey] = mountCards[cardKey]

  newRoom.players[playerId].tools[toolId] = playerTool

  return getRoomRef(roomId).update(newRoom)
}

export async function addCardTool(roomId: string, fields: CardFields) {
  const room = await getRoomData(roomId)

  console.log({ fields, room })

  const newToolId =
    (_.max<number>(Object.keys(room.tools).map(Number)) || 0) + 1

  const template: { [key: string]: number } = {}

  _.range(1, 6).forEach((i) => {
    const name = fields[`kind${i}` as keyof CardFields]

    if (fields[`kind${i}` as keyof CardFields]) {
      template[name] = Number(fields[`kind${i}Num` as keyof CardFields])
    }
  })
  const mountCards = makeCards(template)

  console.log({ template, mountCards })

  const tool: CardTool = {
    tooltype: 'card',
    mountCards,
    template,
  }

  getRoomRef(roomId).update({
    tools: {
      ...room.tools,
      [newToolId]: tool,
    },
  })
}

export async function openCard(
  room: Room,
  roomId: string,
  playerId: string,
  cardId: string,
  toolId: string
) {
  const { players } = _.cloneDeep(room)
  const roomRef = getRoomRef(roomId)
  const playerTool = players[playerId].tools[toolId]

  if (playerTool.tooltype !== 'card') throw new Error('invalid tooltype')
  playerTool.cards[cardId].open = true
  return roomRef.update({ players })
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

    initPlayer(roomId, newPlayerId).then(() => {
      setPlayerId(newPlayerId)
    })
    return () => {
      // exitPlayer(roomId, newPlayerId)
    }
  }, [!!room])

  return [room, playerId]
}
