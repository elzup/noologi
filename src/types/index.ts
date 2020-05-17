export type User = {
  id: string
}

export type Action = {
  name: string
}

export type Commit = {
  text: string
  timestamp: number
}

export type Question = {
  num: number
  text: string
}

export type LoginInfo =
  | {
      status: 'none'
    }
  | {
      status: 'auth'
      uid: string
    }
  | {
      status: 'comp'
      uid: string
      user: User
    }

export type Solve = {
  solvedAt: number
}

export type Solves = {
  [userId: string]: {
    [qid: string]: Solve
  }
}

export type Card = {
  open: boolean
  text: string
}

export type Player = {
  name: string
  cards: { [id: string]: Card }
}
export const tools = ['card', 'dice', 'roulette', 'memo'] as const
export type ToolType = typeof tools[number]

export type CardTool = {
  tooltype: 'card'
  template: { [key: string]: number }
  mountCards: { [id: string]: Card }
}
export type DiceTool = {
  tooltype: 'dice'
  mountCards: { [id: string]: Card }
}
export type MemoTool = {
  tooltype: 'memo'
  mountCards: { [id: string]: Card }
}
export type Tool = CardTool | DiceTool | MemoTool

export type Room = {
  createdAt: number
  players: { [id: string]: Player }
  tools: { [id: string]: Tool }
}
