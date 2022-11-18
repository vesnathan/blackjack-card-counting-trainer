import React, { useEffect, useState } from 'react';

import './casinoTable.component.css';

import { useMutation } from "react-query";
import { AWS_USER_POOL_ID, AWS_CLIENT_ID, GRAPHQL_URL } from "../../config/aws.config";
import { gql, request  } from "graphql-request";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';

// import custom components
import TableOverlay     from "../tableOverlay/tableOverlay.component";
import Shoe             from "../shoe/shoe.component";
import PickSpot         from "../pickSpot/pickSpot.component";
import ButtonBar        from "../buttonBar/buttonBar.component";
import ChipStack        from "../chipStack/chipStack.component";
import Deal             from "../deal/deal.component";
import PlayerTurn       from "../playerTurn/playerTurn.component";
import UserScoreMessage from "../userScoreMessage/userScoreMessage.component";
import TableMessage     from "../tableMessage/tableMessage.component";
import PlayerHandResult from "../playerHandResult/playerHandResult.component";

import { WELCOME_MESSAGE } from "../../consts/welcomeMessage";
import { NEED_CONNECTION } from "../../consts/needConnectionMessage";

// functions
import setUpShoe from "../../functions/setUpShoe";
import checkIndexedDBGamesExist from "../../functions/checkIndexedDBGamesExist";

import { useGameContext } from "../../utils/GameStateContext";

import { 
  UPDATE_CHIPS,       UPDATE_SCORE,               UPDATE_POSITION,          UPDATE_LEVEL, 
  SHOW_PICK_SPOT,     SHOW_BET_BUTTONS,           GAME_RULES,               POPUP_MESSAGE,
  SHOW_POPUP,         SHOW_JOIN_FORM_OK,          SHOW_JOIN_FORM,           POPUP_TITLE,        
  UPDATE_SHOE,        UPDATE_COUNT,               UPDATE_DEALER_CUT_CARD,   SHOW_LOGIN_FORM,
  UPDATE_STREAK,      RESHUFFLE,                  SHOW_PLAYER_TURN_ICON,    BET_AMOUNT,
  SET_TABLE_MESSAGE,  SET_USER_HAD_TURN,          UPDATE_DEAL_HAND,         SET_DEALER_DOWN_CARD,
  USER_DOUBLED,       UPDATE_PLAYERS,             UPDATE_PLAY_BUTTONS,      JOIN_BUTTON_TEXT,
  RESET_DEAL_COUNTER, SET_ONLINE_STATUS,          UPDATE_USER_TYPE,         LOGGED_IN,
  RESET_CARDS_DEALT,  LOGIN_BUTTON_TEXT,          SET_SESSION_DATA
} from "../../utils/actions";

const CasinoTable = (): JSX.Element => {

  const saveGameQuery = gql`
    mutation saveGame(
      $userId: String!,
      $gameData: String!
    )
    {
      saveGame(userId: $userId, gameData: $gameData){
        userId
        gameData
      }
    }
  `;
  const mutation = useMutation(async (data) => {
    request(
        GRAPHQL_URL, 
        saveGameQuery,
        // @ts-ignore
        { userId: data.userId, gameData: data.gameData }, 
        // @ts-ignore
        data.headers,
      )
    }
  )

  // TODO: Fix the use of "any" type below
  const state: any = useGameContext();
  const { betButtons, playButtons } = state.state;
  const { numDecks, tableOverlays } = state.state.gameRules;
  const { players } = state.state;

  const {  
    dealerCutCard, 
    cardsDealt, 
    showPopup, 
    showPickSpot,
    betButtonsShow,
    dealHand,
    playersTurn,
    showPlayerTurnIcon,
    playerPosition,
    playButtonsShow,
    tableMessage,
    userScoreMessage,
    shoeCards,
    onlineStatus,
    chipsTotal,
    scoreTotal,
    userStreak,
    gameLevel,
    sessionData
  } = state.state.appStatus;

  const { gameRules } = state.state;
  const checkGames = async (loggedIn: boolean) => {
    const gameExists = await checkIndexedDBGamesExist();
    if (gameExists) {
      // if game exist, show login form or need connection
      
      console.log("found local game");
      if (loggedIn) {
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: UPDATE_CHIPS,      data: gameExists.game.chipsTotal },
              { which: UPDATE_SCORE,      data: gameExists.game.scoreTotal },
              { which: UPDATE_POSITION,   data: gameExists.game.playerPosition },
              { which: UPDATE_STREAK,     data: gameExists.game.userStreak },
              { which: UPDATE_LEVEL,      data: gameExists.game.gameLevel },
              { which: GAME_RULES,        data: gameExists.game.gameRules },
              { which: SHOW_PICK_SPOT,    data: true },
              { which: UPDATE_USER_TYPE,  data: { whichPlayer: gameExists.game.playerPosition, playerType: "user" }},
            ]
          }
        );
      }
      else {
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: SHOW_JOIN_FORM,    data: false },
              { which: SHOW_LOGIN_FORM,   data: true },
              { which: JOIN_BUTTON_TEXT,  data: "OR JOIN" },
              { which: LOGIN_BUTTON_TEXT, data: "LOG IN" },
              { which: UPDATE_CHIPS,      data: gameExists.game.chipsTotal },
              { which: UPDATE_SCORE,      data: gameExists.game.scoreTotal },
              { which: UPDATE_POSITION,   data: gameExists.game.playerPosition },
              { which: UPDATE_STREAK,     data: gameExists.game.userStreak },
              { which: UPDATE_LEVEL,      data: gameExists.game.gameLevel },
              { which: GAME_RULES,        data: gameExists.game.gameRules },
              { which: UPDATE_USER_TYPE,  data: { whichPlayer: gameExists.game.playerPosition, playerType: "user" }},                  
              { which: POPUP_TITLE,       data: "LOG BACK IN" },
              { which: SHOW_POPUP,        data: true },
              { which: SHOW_PICK_SPOT,    data: false },
            ]
          }
        );
      }
      setUpShoe(numDecks);  
    }
    else {
      // if game doesn't exist, show join form
      console.log("no local game stored");
      state.updateGameState(
        { newDispatches: 
          [ 
            { which: SHOW_JOIN_FORM,    data: true },
            { which: SHOW_LOGIN_FORM,   data: false },
            { which: JOIN_BUTTON_TEXT,  data: "JOIN" },
            { which: LOGIN_BUTTON_TEXT, data: "OR LOG IN" },
            { which: POPUP_MESSAGE,     data: WELCOME_MESSAGE() },                  
            { which: POPUP_TITLE,       data: "WELCOME" },
            { which: SHOW_POPUP,        data: true },
            { which: SHOW_PICK_SPOT,    data: false },
          ]
        }
      );  
    }
  }
  
  useEffect(() => {
    const onlineCheck = setInterval(()=> {
      
      if (navigator.onLine !== onlineStatus) {
        state.updateGameState({ newDispatches: [{ which: SET_ONLINE_STATUS,    data: navigator.onLine }] });
        if (navigator.onLine) {
         // SAVE GAME
        }
      }
    }, 10000);

    return () => {
      clearInterval(onlineCheck)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // useEffect entry point
  useEffect( () => {
    let tempShoe = setUpShoe(numDecks);
    shuffleShoe(tempShoe);

    const stackDeck: Array<Object> = [
      
      // P1 C1
      { suit: "H", pip: "A", count: -1, points: 11 },
      // P2 C1
      { suit: "H", pip: "5", count: -1, points: 5 },
      // P3 C1
      { suit: "H", pip: "A", count: -1,  points: 11 },
      // P4 C1
      { suit: "H", pip: "4", count: -1, points: 4 },
      // P5 C1
      { suit: "H", pip: "5", count: -1, points: 5 },
      // D C1
      { suit: "H",  pip: "A", count: -1, points: 11 },
      // P1 C2
      { suit: "H", pip: "K", count: -1, points: 10 },
      // P2 C2
      { suit: "H",  pip: "8", count: -1, points: 8 },
      // P3 C2
      { suit: "H", pip: "A", count: -1, points: 11 },
      // P4 C2
      { suit: "H", pip: "K", count: -1, points: 10 },
      // P5 C2
      { suit: "H", pip: "A", count: -1, points: 11 },
      // D C2
      { suit: "H", pip: "K", count: -1, points: 10 },
      // P1 C3
      { suit: "H", pip: "A", count: -1,  points: 11  },     
      
    ];  // for testing

    const newTempShoe = [ ...stackDeck, ...tempShoe ];
    state.updateGameState({ newDispatches: [{ which: UPDATE_SHOE,    data: newTempShoe }] });
    state.updateGameState({ newDispatches: [{ which: SHOW_PICK_SPOT, data: true }]});

    // try to authenticate user
    var poolData = {
      UserPoolId: AWS_USER_POOL_ID,
      ClientId: AWS_CLIENT_ID,
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      console.log("found local cognito user");
      //@ts-ignore
      cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log('session validity: ' + session.isValid());
        // try session.accessToken.jwtToken
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: SET_SESSION_DATA, data: session },
            ] 
          }
        );
        checkGames(session.isValid());      
        state.updateGameState( { newDispatches: [ { which: LOGGED_IN, data: true } ] } );
      });
    }
    else {
      // can't authenticate user, show login or join depending on gameExists in local and online status
      
      console.log("unable to find local cognito user");
      if (navigator.onLine) { 
        console.log("user is online");     
        checkGames(false);
      } 
      else {
        // user is offline
        console.log("user is offline"); 
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: POPUP_MESSAGE,     data: NEED_CONNECTION() },
              { which: SHOW_JOIN_FORM,    data: false },                  
              { which: POPUP_TITLE,       data: "NO INTERNET CONNECTION" },
              { which: SHOW_POPUP,        data: true },
              { which: SHOW_PICK_SPOT,    data: false },
              { which: SHOW_JOIN_FORM_OK, data: false },
            ]
          }
        );  
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);



  const shuffleShoe = (currentShoe: Array<object>) => {
    for (let i = currentShoe.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let tempCard = currentShoe[i];
      currentShoe[i] = currentShoe[j];
      currentShoe[j] = tempCard;
    }
    state.updateGameState( { newDispatches: [ 
      { which: UPDATE_SHOE, data: currentShoe } ,
      { which: RESHUFFLE, data: false } ,
      { which: RESET_CARDS_DEALT, data: true },
      { which: UPDATE_COUNT, data: 0 }, 
      { which: UPDATE_DEALER_CUT_CARD, data:  (numDecks*10)-Math.floor(Math.random()*52)+26 } 
    ] } );
  }
  
    // this function resets everything ready for the next hand
    const resetHand = () => {
      if ( (numDecks*52-dealerCutCard) <= cardsDealt) {
        console.log("resetHand reShuffle");
        shuffleShoe(shoeCards);
        state.updateGameState( { newDispatches: [ { which: SET_TABLE_MESSAGE, data: "SHUFFLING..." } ] } );
        setTimeout(()=>{state.updateGameState( { newDispatches: [ { which: SET_TABLE_MESSAGE, data: "" } ] } )},3000);
      }
      
      state.updateGameState( { newDispatches: [
        { which: SHOW_PLAYER_TURN_ICON, data: false },
        { which: BET_AMOUNT, data: [0,0,0] },
        { which: SET_USER_HAD_TURN, data: false }
      ] } );

      setTimeout(() => {    
        // reset all the players hand details
        for (let i = 0; i <= 5; i++) {
          players[i].handCount = 0; 
          players[i].hand = []; 
          players[i].busted = false;
          players[i].playerHandResult = "";
        }

        // unmount the dealHand component
        state.updateGameState( { newDispatches: [
          { which: UPDATE_DEAL_HAND, data: false },
          { which: SET_DEALER_DOWN_CARD, data: false },
          { which: USER_DOUBLED, data: false },
          { which: UPDATE_PLAYERS, data: players },
          { which: SHOW_BET_BUTTONS, data: true },
          { which: UPDATE_PLAY_BUTTONS, data: { whichButton: 2, whichProperty: "buttonDisabled", data: true } },
          { which: UPDATE_PLAY_BUTTONS, data: { whichButton: 3, whichProperty: "buttonDisabled", data: true } },
          { which: RESET_DEAL_COUNTER  }
        ] } );
        console.log("sessionData", sessionData);
        const gameData = JSON.stringify({chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel, gameRules})
        const headers = {
          // @ts-ignore
          Authorization: sessionData.accessToken.jwtToken 
        }
        // @ts-ignore
        console.log(sessionData.idToken.payload.sub);
        // @ts-ignore
        mutation.mutate({headers, userId: sessionData.idToken.payload.sub, gameData });
  
      },3000);
    }
    
  return (
    <div className="casinoTableHolder" >
      <div id="casinoTable" className={(showPopup)?"casinoTable popupBG":"casinoTable"}>
        <TableOverlay message={ tableOverlays[0] } messageSizeClass="h1" />
        <TableOverlay message={ tableOverlays[1]+tableOverlays[2] } messageSizeClass="h2"/> 
        <ChipStack />
        <Shoe numDecks={numDecks} cardsDealt={cardsDealt} dealerCutCard={dealerCutCard}/>
        { showPickSpot            && <PickSpot /> }
        { betButtonsShow          && <ButtonBar key="betButtons" buttons={betButtons} /> }
        { playButtonsShow         && <ButtonBar key="playButtons" buttons={playButtons} /> }
        { dealHand                && <Deal resetHand={resetHand}/> }
        { showPlayerTurnIcon      && <PlayerTurn playerPosition={players[playersTurn].position} /> }
        { tableMessage !== ""     && <TableMessage tableMessage={tableMessage} /> }
        { userScoreMessage !== 0  && <UserScoreMessage userScoreMessage={userScoreMessage} position={players[playerPosition].position}/> }
        { players.map((player: Object) => {
          return (
            // @ts-ignore
            player.playerHandResult !== "" && <PlayerHandResult key={`${player.position}-result`} playerPosition={player.position} positionAdjust={[50,0]} playerHandResult={player.playerHandResult}/>
          )
        })}
      </div>
      <div id="devInfo">Dealer Cut Card: {(numDecks*52-dealerCutCard)}, Cards dealt: {cardsDealt}</div>
    </div>  
  )
}

export default CasinoTable;