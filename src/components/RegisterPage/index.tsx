import { useAuthState } from 'react-firebase-hooks/auth'
import Router from 'next/router'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { Typography } from '@material-ui/core'
import { getAuth, getFirestore, usableUserId } from '../../service/firebase'
import App from '../App'
import { User } from '../../types'
import RegisterUserForm from './RegisterUserForm'

const { auth } = getAuth()
const fdb = getFirestore()

function RegisterMain({ uid }: { uid: string }) {
  const [doc, loading] = useDocumentDataOnce<User | undefined>(
    fdb.collection('user').doc(uid)
  )

  if (loading) return <Typography>loading</Typography>
  if (!!doc) {
    Router.push('/') // NOTE: alraedy registered
    return null
  }
  return (
    <div>
      <RegisterUserForm
        onSubmit={async (fields, setErorrs) => {
          const usable = await usableUserId(fields.username)

          if (!usable) {
            setErorrs({ username: 'すでに使われているIDです' })
            return
          }
          await fdb.collection('user').doc(uid).set({
            id: fields.username,
          })
          alert('登録しました')
          Router.push('/')
        }}
      />
    </div>
  )
}

function RegisterPage() {
  const [user, loading] = useAuthState(auth)

  if (loading) return <Typography>loading</Typography>
  if (!user) {
    Router.push('/') // NOTE: not login
    return null
  }

  return (
    <App>
      <Typography variant="h4">ユーザ登録</Typography>
      <RegisterMain uid={user.uid} />
    </App>
  )
}

export default RegisterPage
