import { Button, Container } from "@material-ui/core";
import { useRouter } from "next/router";
import App from "../App";
import { genRandomStr } from "../../utils";

function TopPage() {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push(`/room/${genRandomStr(5)}`);
      }}
    >
      部屋を作る
    </Button>
  );
}

function TopPageContainer() {
  return (
    <Container>
      <App>
        <TopPage />
      </App>
    </Container>
  );
}

export default TopPageContainer;
