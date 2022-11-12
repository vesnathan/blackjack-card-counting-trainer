import React, { useEffect } from 'react';

import './casinoTable.component.css';

import { useMutation } from "react-query";
import { API_URL } from "../../config/aws.config";
import { gql, request  } from "graphql-request";

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

// classes
import Auth from "../../utils/auth";

import { useGameContext } from "../../utils/GameStateContext";

import { 
  UPDATE_CHIPS,       UPDATE_SCORE,               UPDATE_POSITION,          UPDATE_LEVEL, 
  SHOW_PICK_SPOT,     SHOW_BET_BUTTONS,           GAME_RULES,               POPUP_MESSAGE,
  SHOW_POPUP,         SHOW_JOIN_FORM_OK,          SHOW_JOIN_FORM,           POPUP_TITLE,        
  UPDATE_SHOE,        UPDATE_COUNT,               UPDATE_DEALER_CUT_CARD, 
  UPDATE_STREAK,      RESHUFFLE,                  SHOW_PLAYER_TURN_ICON,    BET_AMOUNT,
  SET_TABLE_MESSAGE,  SET_USER_HAD_TURN,          UPDATE_DEAL_HAND,         SET_DEALER_DOWN_CARD,
  USER_DOUBLED,       UPDATE_PLAYERS,             UPDATE_PLAY_BUTTONS,      
  RESET_DEAL_COUNTER, SET_ONLINE_STATUS,          UPDATE_USER_TYPE,         LOGGED_IN,
  RESET_CARDS_DEALT
} from "../../utils/actions";

const CasinoTable = (): JSX.Element => {
  const headers = {
    Authorization: `Bearer ${Auth.getToken()}` 
  }
  const saveGameQuery = gql`
  mutation saveGame(
    $username: String!,
    $gameData: String!
  )
  {
    saveGame(username: $username, gameData: $gameData){
      username
      gameData
    }
  }
`;
  const mutation = useMutation(async (data) => {
    request(
        API_URL, 
        saveGameQuery,
        data,
        headers,
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
    gameLevel
  } = state.state.appStatus;

  const { gameRules } = state.state;

  useEffect(() => {
    const onlineCheck = setInterval(()=> {
      
      if (navigator.onLine !== onlineStatus) {
        state.updateGameState({ newDispatches: [{ which: SET_ONLINE_STATUS,    data: navigator.onLine }] });
        if (navigator.onLine) {
          console.log("here");
          const jsonObjStr = JSON.stringify( { 
            chipsTotal: chipsTotal, 
            scoreTotal: scoreTotal, 
            playerPosition: playerPosition, 
            userStreak: userStreak, 
            gameLevel: gameLevel, 
            gameRules: gameRules 
          });
          const user = Auth.getProfile();
          //saveGameMongoDB({variables: {gameData: jsonObjStr, username: user.data.username }});
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
      /*
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
      { suit: "H", pip: "K", count: -1, points: 10 },
      // P4 C2
      { suit: "H", pip: "K", count: -1, points: 10 },
      // P5 C2
      { suit: "H", pip: "A", count: -1, points: 11 },
      // D C2
      { suit: "H", pip: "K", count: -1, points: 10 },
      // P1 C3
      { suit: "H", pip: "A", count: -1,  points: 11  },     
      */
    ];  // for testing

    const newTempShoe = [ ...stackDeck, ...tempShoe ];
    state.updateGameState({ newDispatches: [{ which: UPDATE_SHOE,    data: newTempShoe }] });
    state.updateGameState({ newDispatches: [{ which: SHOW_PICK_SPOT, data: true }]});
    const checkGames = async () => {
      const gameExists = await checkIndexedDBGamesExist();
      // if the game data exists in indexedDB load it
      if (gameExists) {
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: UPDATE_CHIPS,     data: gameExists.game.chipsTotal },
              { which: UPDATE_SCORE,     data: gameExists.game.scoreTotal },
              { which: UPDATE_POSITION,  data: gameExists.game.playerPosition },
              { which: UPDATE_STREAK,    data: gameExists.game.userStreak },
              { which: UPDATE_LEVEL,     data: gameExists.game.gameLevel },
              { which: SHOW_PICK_SPOT,   data: false },
              { which: SHOW_BET_BUTTONS, data: true },
              { which: GAME_RULES,       data: gameExists.game.gameRules },
              { which: UPDATE_USER_TYPE, data: { whichPlayer: gameExists.game.playerPosition, playerType: "user" }},
            ]
          }
        );
        setUpShoe(numDecks);
      }
      else {
        // if there is no game data in IndexedDB, this may be a new user, or they may have deleted local data.
        // first, check to see if they are logged in with a valid token
        if (Auth.loggedIn()) {
          // firstly, show the logout button
          state.updateGameState({ newDispatches: [{ which: LOGGED_IN, data: true }]});
          // if they are logged in, then they likely have deleted local storage
          // check if they are online
          if (navigator.onLine) {  
            // try to fetch game data from server
            const user = Auth.getProfile();
            //const userDataFromMongo = loadGameMongoDB({variables: {username: user.data.username }});
            //console.log(userDataFromMongo);
          }
          else {
            // if they are logged in, and have no local game data
            // show game unavailable till they get a connection
            // If we don't do this, they could just keep resetting local storage and never have to pay
            // we assume if they are actually a new user they would still have an internet connection as they just downloaded the app.
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
        else {
          // if they aren't logged in, and have no local game data, they may be new
          // are they online?
          if (navigator.onLine) {
            console.log("online");
            // if they are online, show the join form
            state.updateGameState(
              { newDispatches: 
                [ 
                  { which: POPUP_MESSAGE,     data: WELCOME_MESSAGE() },
                  { which: POPUP_TITLE,       data: "WELCOME" },
                  { which: SHOW_POPUP,        data: true },
                  { which: SHOW_PICK_SPOT,    data: false },
                  { which: SHOW_JOIN_FORM_OK, data: false },
                  { which: SHOW_JOIN_FORM,    data: true },
                ]
              }
            );
          }
          else {
            // if they aren't online, show unavailable until they get a connection
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
      }
    }
    checkGames();

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
      console.log("resetHand");
      console.log("dealerCutCard", (numDecks*52-dealerCutCard));
      console.log("cardsDealt", cardsDealt);
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
        const gameData = JSON.stringify({chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel, gameRules})
        // @ts-ignore
        mutation.mutate({username: "vesnathan@gmail.com", gameData })
  
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