import { Typography } from '@material-ui/core'
import { LoginInfo } from '../types'
import LoginButton from './LoginButton'

type Props = {
  login: LoginInfo
}
function Header({ login }: Props) {
  return (
    <header>
      Score Form
      {login.status === 'comp' && <Typography>{login.user.id}</Typography>}
      <LoginButton />
    </header>
  )
}
export default Header
