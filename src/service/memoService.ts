import _ from 'lodash'
import { Tool } from '../types'
import { getRoomData, getRoomRef } from './firebase'

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
