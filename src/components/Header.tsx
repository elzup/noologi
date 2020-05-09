import { Typography } from "@material-ui/core";
import { LoginInfo } from "../types";

type Props = {
  login: LoginInfo;
};
function Header({ login }: Props) {
  return (
    <header>
      <Typography variant="h3">のーろじっくルーム</Typography>
      <Typography>オンラインで遊べる道具が揃うサービスです</Typography>
      {login.status === "comp" && <Typography>{login.user.id}</Typography>}
    </header>
  );
}
export default Header;
