import _ from 'lodash'
import { Tool, Room, MemoTool } from '../types'
import { getRoomData, getRoomRef, getFirestore } from './firebase'

export async function addMemoTool(roomId: string) {
  const room = await getRoomData(roomId)
  const newToolId =
    (_.max<number>(Object.keys(room.tools).map(Number)) || 0) + 1
  const tool: Tool = { tooltype: 'memo', text: '' }

  await getRoomRef(roomId).update({
    tools: {
      ...room.tools,
      [newToolId]: tool,
    },
  })
}

export async function updateMemo(roomId: string, toolId: string, text: string) {
  const db = getFirestore()
  const roomRef = getRoomRef(roomId)
  const memoTool: MemoTool = { tooltype: 'memo', text }

  await db.runTransaction(async (t) => {
    const snap = await t.get(roomRef)

    if (!snap.exists) return
    const room = snap.data() as Room

    t.update(roomRef, {
      tools: Object.assign({}, room.tools, { [toolId]: memoTool }),
    })
  })
}
