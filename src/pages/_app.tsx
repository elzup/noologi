import { AppProps } from "next/app";
import "normalize.css";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  props: {
    MuiTextField: {
      variant: "outlined",
    },
    MuiButton: {
      variant: "outlined",
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </>
);

export default App;
