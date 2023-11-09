import { useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

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
        <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
        <CssBaseline />
        <Header isDarkMode={darkMode} darkModeChange={onChangeDarkMode}/>
        <Container>
          <Outlet />
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
