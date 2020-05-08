import { Button } from '@material-ui/core'
import { useContext } from 'react'
import { getAuth } from '../service/firebase'
import { LoginContext } from './App'

const { login, logout } = getAuth()

function LoginButton() {
  const [logins] = useContext(LoginContext)

  if (logins.status === 'none') {
    return <Button onClick={() => login()}>Google ログイン</Button>
  }
  return <Button onClick={() => logout()}>ログアウト</Button>
}

export default LoginButton
