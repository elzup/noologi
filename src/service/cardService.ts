import _ from 'lodash'
import { CardFields } from '../components/RoomPage/CreateCardForm'
import { Card, CardTool, Player, Room } from '../types'
import { sample } from '../utils'
import { getFirestore, getRoomData, getRoomRef } from './firebase'

export async function drawCard(
  room: Room,
  roomId: string,
  playerId: string,
  toolId: string
) {
  const tool = room.tools[toolId]

  if (tool.tooltype !== 'card') throw Error('invalid tooltype')

  const cardKey = sample(
    Object.keys(_.pickBy(tool.mountCards, (v) => !v.removed))
  )
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
  const tool: CardTool = { tooltype: 'card', mountCards, template }

  await getRoomRef(roomId).update({
    tools: {
      ...room.tools,
      [newToolId]: tool,
    },
  })
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
