import { Container, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { openCard, useRoom } from '../../service/firebase'
import App from '../App'
import PlayerBox, { MyPlayerBox } from './PlayerBox'
import StageArea from './StageArea'

const Style = styled.div`
  display: grid;
  .players-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }
  .stage {
  }
  .players,
  .stage,
  .my {
    margin-top: 8px;
    padding-top: 8px;
    border-top: solid gray;
  }
`

function RoomMain({ roomId }: { roomId: string }) {
  const [room, playerId] = useRoom(roomId)

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
        <StageArea room={room} roomId={roomId} playerId={playerId} />
      </div>
      <div className="my">
        <Typography variant="h5">You</Typography>
        {me && (
          <div>
            <Typography variant="h6">{me.name}</Typography>
            <MyPlayerBox
              player={me}
              openCard={openCard.bind(null, room, roomId, playerId)}
            />
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
