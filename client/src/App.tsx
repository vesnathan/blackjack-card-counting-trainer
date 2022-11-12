import React, { useEffect } from 'react';
import './App.css';
import './storage/indexedDB/connect';

import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
} from 'amazon-cognito-identity-js';


import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// Material UI Components
import { ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

// import theme
import theme from "./assets/js/theme";

// custom components
import CasinoTable from "./components/casinoTable/casinoTable.component";
import Swiper from "./components/swiper/swiper.component";
import ScoreBar from "./components/scoreBar/scoreBar.component";
import Popup from "./components/popup/popup.component";
import  GameStateContext from "./utils/GameStateContext";

const queryClient = new QueryClient();

function App() {

  // useEffect for PWA install and start stuff, runs only once
  useEffect(() => {
    console.log('PWA useEffect');
    const butInstall = document.getElementById('buttonInstall');

    window.addEventListener('beforeinstallprompt', (event) => {
    
      console.log("beforeinstallprompt called");
      event.preventDefault();
      if (butInstall !== null) {
        butInstall.style.visibility = 'visible';
        butInstall.textContent = 'Click here to install!';
    
        butInstall.addEventListener('click', () => {
          // @ts-ignore
          event.prompt();
          butInstall.style.visibility = 'hidden';
        });
      }
    });

    window.addEventListener('appinstalled', (event) => {
      console.log('appinstalled', event);
    });
  },[]);




  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <GameStateContext>
          <CssBaseline>
            <ThemeProvider theme={theme}>
              <div className="mainContainer"><div className="vignette"></div></div>
              <ScoreBar />
              <Container disableGutters style={{ position: "relative", overflow: "hidden" , height: "100vh", alignItems: "center"}}>
                <Grid item sm={10}  style={{ position: "relative", top: "50%", transform: "translateY(-50%)"}}>
                  <CasinoTable />
                  <Popup />
                  <Swiper buttonString="STRATEGY" buttonPosition="top" swiperStatus="" swiperType="strategy" />
                  <Swiper buttonString="SETTINGS" buttonPosition="middle" swiperStatus="" swiperType="settings" />
                </Grid>
              </Container>
            </ThemeProvider>
          </CssBaseline>
      </GameStateContext>
    </QueryClientProvider>
  );
}

export default App;
