import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/BasketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

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

  const initApp = useCallback(async () => {
    try {
      
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());

    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(()=>{
    initApp().then(() => setLoading(false));
  }, [initApp])



  function onChangeDarkMode(){
    setDarkMode(!darkMode);
  }

  if(loading)
    return <LoadingComponent message="Initializing app..."/>

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
