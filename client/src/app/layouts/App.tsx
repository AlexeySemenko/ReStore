import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/BasketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  //const [darkMode, setDarkMode] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
});

function onChangeDarkMode(){
  setDarkMode(prev => {
    localStorage.setItem("darkMode", String(!prev)); // Save new preference
    return !prev;
});
}
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



  

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
        <CssBaseline />
        <Header isDarkMode={darkMode} darkModeChange={onChangeDarkMode}/>
        {loading ? 
          <LoadingComponent message="Initializing app..."/> 
          : 
            location.pathname === "/" ? <HomePage /> 
              : 
            <Container  sx={{ mt: 4 }}>
              <Outlet />
            </Container>
        }
      </ThemeProvider>
    </>
  )
}

export default App
