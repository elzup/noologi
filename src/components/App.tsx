import { createContext, Dispatch, SetStateAction, useState } from "react";
import { LoginInfo } from "../types";
import Header from "./Header";

export const LoginContext = createContext<
  [LoginInfo, Dispatch<SetStateAction<LoginInfo>>]
>([
  { status: "none" },
  () => {
    //
  },
]);

const App = ({ children }: { children?: unknown }) => {
  const [login, setLogin] = useState<LoginInfo>({ status: "none" });

  return (
    <LoginContext.Provider value={[login, setLogin]}>
      <main>
        <Header login={login} />
        {children}
      </main>
    </LoginContext.Provider>
  );
};

export default App;
