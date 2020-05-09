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
export type Room = {
  players: { [id: string]: Player }
  mountCards: { [id: string]: Card }
}

export type RoomRaw = {
  players?: { [id: string]: Player | false }
  mountCards: { [id: string]: Card }
}
