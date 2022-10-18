import { useEffect } from 'react';
import './casinoTable.component.css';

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

// functions
import setUpShoe from "../../functions/setUpShoe";
import checkIndexedDBGamesExist from "../../functions/checkIndexedDBGamesExist";


import { useGameContext } from "../../utils/GameStateContext";

import { 
  UPDATE_CHIPS,       UPDATE_SCORE,               UPDATE_POSITION,          UPDATE_LEVEL, 
  SHOW_PICK_SPOT,     SHOW_BET_BUTTONS,           GAME_RULES,               POPUP_MESSAGE,
  SHOW_POPUP,         SHOW_JOIN_FORM_OK,          SHOW_JOIN_FORM,           POPUP_TITLE,        
  UPDATE_SHOE,        UPDATE_COUNT,               UPDATE_CARDS_DEALT,       UPDATE_DEALER_CUT_CARD, 
  UPDATE_STREAK,      RESHUFFLE,
  SHOW_PLAYER_TURN_ICON,
  BET_AMOUNT,
  SET_TABLE_MESSAGE,
  SET_USER_HAD_TURN,
  UPDATE_DEAL_HAND,
  SET_DEALER_DOWN_CARD,
  USER_DOUBLED,
  UPDATE_PLAYERS,
  UPDATE_PLAY_BUTTONS,
  UPDATE_BET_BUTTONS,
  RESET_DEAL_COUNTER
} from "../../utils/actions";

const CasinoTable = (): JSX.Element => {
  // TODO: Fix the use of "any" type below
  const state: any = useGameContext();
  const { betButtons, playButtons } = state.state;
  const { numDecks, tableOverlays } = state.state.gameRules;
  const { players } = state.state;
  const { 
    firstVisit,  
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
    reshuffleDue,
    shoeCards
  } = state.state.appStatus;

  // useEffect entry point
  useEffect( () => {
    const tempShoe = setUpShoe(numDecks);
    shuffleShoe(tempShoe);
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: UPDATE_SHOE,    data: tempShoe },
        ]
      }
    );

    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_PICK_SPOT, data: true },
       ]
      }
    );
    const checkGames = async () => {
      const gameExists = await checkIndexedDBGamesExist(firstVisit);
      if (gameExists) {
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: UPDATE_CHIPS,     data: gameExists.chipsTotal },
              { which: UPDATE_SCORE,     data: gameExists.scoreTotal },
              { which: UPDATE_POSITION,  data: gameExists.playerPosition },
              { which: UPDATE_STREAK,    data: gameExists.userStreak },
              { which: UPDATE_LEVEL,     data: gameExists.gameLevel },
              { which: SHOW_PICK_SPOT,   data: false },
              { which: SHOW_BET_BUTTONS, data: true },
              { which: GAME_RULES,       data: gameExists.gameRules },
            ]
          }
        );
        setUpShoe(numDecks);
      }
      else {
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
      { which: UPDATE_CARDS_DEALT, data: 0 },
      { which: UPDATE_COUNT, data: 0 }, 
      { which: UPDATE_DEALER_CUT_CARD, data:  (numDecks*10)-Math.floor(Math.random()*52)+26 } 
    ] } );
  }
  
    // this function resets everything ready for the next hand
    const resetHand = () => {
      if (reshuffleDue) {
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
        // unmount the dealHand component
        state.updateGameState( { newDispatches: [
          { which: UPDATE_DEAL_HAND, data: false },
          { which: SET_DEALER_DOWN_CARD, data: false },
          { which: USER_DOUBLED, data: false }
        ] } );
        
        // reset all the players hand details
        for (let i = 0; i <= 5; i++) {
          players[i].handCount = 0; 
          players[i].hand = []; 
          players[i].busted = false;
          players[i].playerHandResult = "";
        }


        state.updateGameState( { newDispatches: [
          { which: UPDATE_PLAYERS, data: players }
        ] } );
  

          
          // set deal button to disabled
          state.updateGameState( { newDispatches: [
            { which: UPDATE_BET_BUTTONS, data: { whichButton: 3, whichProperty: "buttonDisabled", data: true } },
            { which: SHOW_BET_BUTTONS, data: true }
          ] } );
     


          // set Double and Split buttons to disabled
          state.updateGameState( { newDispatches: [
            { which: UPDATE_PLAY_BUTTONS, data: { whichButton: 2, whichProperty: "buttonDisabled", data: true } },
            { which: UPDATE_PLAY_BUTTONS, data: { whichButton: 3, whichProperty: "buttonDisabled", data: true } },
            //{ which: SHOW_PLAY_BUTTONS, data: true }
          ] } );
  

          state.updateGameState( { newDispatches: [
            { which: RESET_DEAL_COUNTER  }
          ] } );
         
  
      },3000);
    }
    
  return (
    <div className="casinoTableHolder" >
      <div id="casinoTable" className={(showPopup)?"casinoTable popupBG":"casinoTable"}>
        <TableOverlay message={ tableOverlays[0] } messageSizeClass="h1" />
        <TableOverlay message={ tableOverlays[1]+tableOverlays[2] } messageSizeClass="h2"/> 
        <ChipStack />
        <Shoe numDecks={numDecks} cardsDealt={cardsDealt} dealerCutCard={dealerCutCard}/>
        { showPickSpot            ? <PickSpot /> : null }
        { betButtonsShow          ? <ButtonBar key="betButtons" buttons={betButtons} /> : null  }
        { playButtonsShow         ? <ButtonBar key="playButtons" buttons={playButtons} /> : null  }
        { dealHand                ? <Deal resetHand={resetHand}/> : null }
        { showPlayerTurnIcon      ? <PlayerTurn playerPosition={players[playersTurn].position} /> : null }
        { tableMessage !== ""     ? <TableMessage tableMessage={tableMessage} /> : null  }
        { userScoreMessage !== 0  ? <UserScoreMessage userScoreMessage={userScoreMessage} position={players[playerPosition].position}/> : null }
        { players.map((player: Object) => {
          return (
            // @ts-ignore
            player.playerHandResult !== "" ? <PlayerHandResult key={`${player.position}-result`} playerPosition={player.position} positionAdjust={[50,0]} playerHandResult={player.playerHandResult}/> : null 
          )
        })}
      </div>
    </div>
  )
}

export default CasinoTable;