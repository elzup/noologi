import { useRouter } from 'next/router'
import { Container, Button, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useRoom } from '../../service/firebase'
import App from '../App'

const Style = styled.div`
  display: grid;
`

function RoomMain({ roomId }: { roomId: string }) {
  const [room, player] = useRoom(roomId)

  if (!room || !player) return <p>loading</p>
  console.log(room)

  return (
    <Style>
      <div className="share">
        URLを共有して友達と遊べます。
        <pre>{window.location.href}</pre>
      </div>
      <div className="players">
        <Typography variant="h5">Players</Typography>
      </div>
      <div className="stage">
        <div>Cards: </div>
        <Button
          onClick={() => {
            //
          }}
        >
          Draw
        </Button>
      </div>
      <div className="stage">
        <Typography variant="h5">You</Typography>
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
