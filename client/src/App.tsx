import React, { useEffect } from 'react';
import './App.css';
import './storage/indexedDB/connect';



// Material UI Components
import { ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import { useGameContext } from "./utils/GameStateContext";

// import theme
import theme from "./assets/js/theme";

// custom components
import CasinoTable from "./components/casinoTable/casinoTable.component";
import Swiper from "./components/swiper/swiper.component";
import ScoreBar from "./components/scoreBar/scoreBar.component";
import Popup from "./components/popup/popup.component";

import Auth from "./utils/auth";

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import  GameStateContext from "./utils/GameStateContext";

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {

  // useEffect for PWA install
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
    <GameStateContext>
      <ApolloProvider client={client}>
        <CssBaseline>
          <ThemeProvider theme={theme}>
            <div className="mainContainer"></div>
            <ScoreBar />
            <Container disableGutters style={{ position: "relative", overflow: "hidden" , height: "100vh", alignItems: "center"}}>
              <Grid item sm={10}  style={{ position: "relative", top: "50%", transform: "translateY(-50%)"}}>
                <CasinoTable />
                <Popup />
                <Swiper buttonString="STRATEGY" buttonPosition="top" swiperStatus="" swiperType="strategy" />
                <Swiper buttonString="SETTINGS" buttonPosition="middle" swiperStatus="" swiperType="settings" />
                <Swiper buttonString="LOGIN" buttonPosition="bottom" swiperStatus="" swiperType="login" />
              </Grid>
            </Container>
          </ThemeProvider>
        </CssBaseline>
      </ApolloProvider>
    </GameStateContext>
  );
}

export default App;
