import { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const paleteType = darkMode ? 'dark' : 'light';

  const theme = createTheme({
    palette: {
      mode: paleteType,
      background:{
        default: paleteType == 'light' ? '#eaeaea' : '#121212'
      }
    }

  });

  function onChangeDarkMode(){
    setDarkMode(!darkMode);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header isDarkMode={darkMode} darkModeChange={onChangeDarkMode}/>
        <Container>
          <Catalog />
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
