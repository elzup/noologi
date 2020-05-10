import { useRouter } from 'next/router'
import { Container, Button, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useState } from 'react'
import { useRoom, drawCard, resetMountCards } from '../../service/firebase'
import App from '../App'
import PlayerBox, { MyPlayerBox } from './PlayerBox'

const Style = styled.div`
  display: grid;
  .players-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 4px;
  }
`

function RoomMain({ roomId }: { roomId: string }) {
  const [room, playerId] = useRoom(roomId)
  const [loading, setLoading] = useState<boolean>(false)

  if (!room || !playerId) return <p>loading</p>

  const playerIds = Object.keys(room.players).filter((v) => v !== playerId)
  const me = room.players[playerId]

  return (
    <Style>
      <div className="share">
        URLを共有して友達と遊べます。
        <pre>{window.location.href}</pre>
      </div>
      <div className="players">
        <Typography variant="h5">Players</Typography>
        <div className="players-box">
          {playerIds.map((id) => (
            <PlayerBox key={id} player={room.players[id]} />
          ))}
        </div>
      </div>
      <div className="stage">
        <div>Cards: {Object.values(room.mountCards).length}</div>
        <Button
          disabled={Object.values(room.mountCards).length === 0}
          onClick={() => {
            setLoading(true)
            drawCard(room, roomId, playerId).then(() => setLoading(false))
          }}
        >
          カードを引く
        </Button>
        <Button
          onClick={() => {
            setLoading(true)

            resetMountCards(roomId).then(() => setLoading(false))
          }}
        >
          Reset: カードを集める
        </Button>
      </div>
      <div className="stage">
        <Typography variant="h5">You</Typography>
        {me && (
          <div>
            <Typography variant="h6">{me.name}</Typography>
            <MyPlayerBox player={me} />
          </div>
        )}
      </div>
    </Style>
  )
}

const RoomPage = () => {
  const router = useRouter()
  const roomId = router.query['id'] as string

  if (!roomId) return <p>loading</p>

  return (
    <Container>
      <App>
        <RoomMain roomId={roomId} />
      </App>
    </Container>
  )
}

export default RoomPage
