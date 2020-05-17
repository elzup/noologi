import { Typography } from '@material-ui/core'
import { LoginInfo } from '../types'

type Props = {
  login: LoginInfo
}
function Header({ login }: Props) {
  return (
    <header>
      <Typography variant="h3">のーろじっくルーム</Typography>
      <Typography>
        オンラインで遊べる道具が揃うサービスです。
        トランプカードの共有や、相手に見えないように配役設定など。自動同期対応。
      </Typography>
      {login.status === 'comp' && <Typography>{login.user.id}</Typography>}
    </header>
  )
}
export default Header
