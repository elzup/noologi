import { useRouter } from 'next/router'
import { Container } from '@material-ui/core'
import { useRoom } from '../../service/firebase'
import App from '../App'

function RoomMain({ roomId }: { roomId: string }) {
  const [room, player] = useRoom(roomId)

  if (!room || !player) return <p>loading</p>

  return (
    <div>
      URLを共有して友達と遊べます。
      <pre>{window.location.href}</pre>
    </div>
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
