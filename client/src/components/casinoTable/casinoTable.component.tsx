import React, { useEffect, useState } from 'react';
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
  SHOW_POPUP,         SHOW_JOIN_FORM_OK,          SHOW_JOIN_FORM,           UPDATE_DEAL_HAND,
  POPUP_TITLE,        UPDATE_SHOE,                SET_HIT_CARD,             AWAITING_INPUT,
  UPDATE_COUNT,       UPDATE_PLAYER_HAND_RESULT,  RESET_PLAYER_HAND,        UPDATE_CARDS_DEALT,
  SET_TABLE_MESSAGE,  RESHUFFLE,                  UPDATE_DEALER_CUT_CARD,   SHOW_PLAYER_TURN_ICON,
  SET_USER_HAD_TURN,  SET_DEALER_DOWN_CARD,       BET_AMOUNT,               USER_DOUBLED,
  UPDATE_PLAYERS,     UPDATE_STREAK,              UPDATE_BET_BUTTONS,       UPDATE_PLAY_BUTTONS,
  SET_PLAYERS_TURN,   PLAYER_BUSTED,              SHOW_PLAY_BUTTONS,        UPDATE_PLAYER_HAND_CARDS,
  UPDATE_PLAYER_HAND_COUNT

} from "../../utils/actions";

const CasinoTable = (): JSX.Element => {
  // TODO: Fix the use of "any" type below
  const state: any = useGameContext();
  const { betButtons, playButtons } = state.state;
  const { numDecks, tableOverlays } = state.state.gameRules;
  const { players } = state.state;
  const { 
    firstVisit, 
    autoPlay, 
    dealerCutCard, 
    cardsDealt, 
    showPopup, 
    showPickSpot,
    betButtonsShow,
    dealHand,
    playersTurn,
    showPlayerTurnIcon,
    hitCard,
    awaitingUserInput,
    count,
    playerPosition,
    userHitCard,
    shoeCards,
    chipsTotal,
    betAmount,
    reshuffleDue,
    userDoubled,
    playButtonsShow,
    tableMessage,
    userScoreMessage
  } = state.state.appStatus;

  // useEffect entry point
  useEffect( () => {
    const tempShoe = setUpShoe(numDecks);
    //shuffleShoe(tempShoe);
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
    // checkGames();

  },[]);

  /*
  useEffect(()=>{
    if(hitCard){
      state.updateGameState( { newDispatches: [ { which: SET_HIT_CARD, data: false } ] } );
      dealACard(playersTurn);
      playersHand(playersTurn);

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[hitCard]);
*/
/*
  useEffect(()=>{
    if (!awaitingUserInput){
      playersHand(playersTurn);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[playersTurn]);
*/
/*
  const recalcHand = (whichPlayer: number) => {

    const newCount =  players[whichPlayer].hand.reduce((accumulator: any, card: any) => {
     return accumulator + card.points;
    }, 0);    
    state.updateGameState({ newDispatches: [
      { which: UPDATE_PLAYER_HAND_COUNT, data: { player: whichPlayer, card: { points: -10 } } }
    ]});
    return newCount;
  }
  */
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
  /*
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
  
        if (autoPlay) {
          // reset some stuff ready for the new hand
          setTimeout(()=>{
            state.updateGameState( { newDispatches: [
              { which: UPDATE_DEAL_HAND, data: true }
            ] } );
          },0);
        }
        else {
          
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
            { which: AWAITING_INPUT, data: true  }
          ] } );
        } 
  
      },3000);
    }
    
  const calcPayout = () => {
    if (players[playerPosition].handCount === 21 && players[playerPosition].hand.length === 2){
      // user has BJ
      if (players[0].handCount === 21 && players[0].hand.length === 2){
        //dealer has BJ, bet is returned
        let tempChipsTotal = chipsTotal;
        tempChipsTotal = 
        tempChipsTotal + 
        ((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50));
        state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: tempChipsTotal } ] } );
      }
      else {
        // bet is paid 3:2 
        let tempChipsTotal = chipsTotal;
        tempChipsTotal = 
        tempChipsTotal + 
        (((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50))*2.5);  
        state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: tempChipsTotal } ] } );      
      }
    }
    if (players[0].busted && !players[playerPosition].busted) {
      let tempChipsTotal = chipsTotal;
      tempChipsTotal = 
        tempChipsTotal + 
        ((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50))*2;
        state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: tempChipsTotal } ] } );
    }  
    if (players[0].handCount < players[playerPosition].handCount) { 
      let tempChipsTotal = chipsTotal;
      tempChipsTotal = 
        tempChipsTotal + 
        ((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50))*2;
      state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: tempChipsTotal } ] } );
    }
    switch (players[0].busted) {
      case true:
        if (!players[playerPosition].busted) {
          state.updateGameState({ newDispatches: [
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: "BUSTED" } },
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
          ]});

        }
        break;
      case false:
        if (players[0].handCount === 21) {        
          state.updateGameState({ newDispatches: [
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: "DEALER WINS" } },
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU LOSE" } }
          ]});
        }
        else {
          if (players[0].handCount < players[playerPosition].handCount && !players[playerPosition].busted) {
            if (players[0].handCount === 21) {        
              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: `PAYING ${players[0].handCount+1}` } },
                { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
              ]});
            }
          }
          if (players[0].handCount >= players[playerPosition].handCount && !players[playerPosition].busted) {
            state.updateGameState({ newDispatches: [
              { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: `PAYING ${players[0].handCount+1}` } },
              { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU LOSE" } }
            ]});
          }
        }
        break;
    }   
  }

*/
    // deals a hit card to the players, also calls upodateCardsDealt to keep
  // track of count and number of cards dealt from shoe.
  /*
  const dealACard = (whichPlayer: number) => {
    state.updateGameState({ newDispatches: [
      { which: UPDATE_PLAYER_HAND_CARDS,  data: { player: whichPlayer, card: shoeCards[cardsDealt] } },
      { which: UPDATE_CARDS_DEALT,  data:  true }
    ]});
    
  }

*/
/*
    // this is the main game function. It decides whether or not the player needs a new card
  // shows and hides the waiting icon, indicates when players bust
  // Decides when the hand is over and calls the calcPayout function 
  const playersHand = (whichPlayer: number) => {
    
    // if player is the dealer, show their down card and switch player turn icon off
    if (whichPlayer === 0) {

      const newCount = count + players[0].hand[0].count;

      state.updateGameState({ 
        newDispatches: [ 
          { which: SET_DEALER_DOWN_CARD, data: true },
          { which: UPDATE_COUNT, data: newCount } 
        ] 
      });
      
      let dealerBusted = false;
      if (players[0].handCount === 21) {
        if (players[0].hand.length === 2) {
          state.updateGameState({ newDispatches: [{ which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: "BLACKJACK!!!" } }] });
        }
      }
      else {
        if (players[0].handCount > 21) {
          const acesInHandWorthEleven: Array<any> = players[whichPlayer].hand.filter((card: any) => card.pip === "A" && card.points === 11);
          if (acesInHandWorthEleven.length > 0) {
            acesInHandWorthEleven[0].points = 1;
            const newTotal = recalcHand(0);
            if(newTotal > 21) {
              dealerBusted = true;
            }
          }
          else {
            dealerBusted = true;
          }
          if (dealerBusted) {
            state.updateGameState({ newDispatches: [{ which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: "BUSTED" } }] });
          }
        }
      }

      setTimeout(()=>{
        if (players[0].handCount > 16) {
          if (dealerBusted) {
            state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data:  0 }] });
          }
          // if whichPlayer === 0 (the dealer) here then the hand is finished, reset everything
          if (whichPlayer === 0) {
            calcPayout();
            state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data:  0 }] });
            resetHand();
          }
        }
        else { 
          // If the hand is less than 16, deal another card, then use setHitCard and useEffect to
          // call this function (playersHand) again with the same player, 
            dealACard(0);
            state.updateGameState( { newDispatches: [ { which: SET_HIT_CARD, data: true } ] } );
        }
      },2000);
    }
      
    
    // if this is our user, show the play buttons and set awaiting user input
    else if (whichPlayer === playerPosition && !autoPlay) {
      let userBusted = false;   


          //dealACard(whichPlayer);
          console.log(players[whichPlayer].hand);
          state.updateGameState({ newDispatches: [
            { which: SET_HIT_CARD, data: false }
          ]});       

        
        state.updateGameState( { newDispatches: [
          { which: SHOW_PLAY_BUTTONS, data: true },
          { which: AWAITING_INPUT, data: true },
        ]});
        
    }
  
    else  {

      // if this player is greater than our user, set userHadTurn to true. This is used to stop the user from peeking at the strategy card for free before their turn
      if (whichPlayer > playerPosition ) {
        state.updateGameState( { newDispatches: [
          { which: SET_USER_HAD_TURN, data: true }
        ]});
      }

      // check if this is an active player
      if (players[whichPlayer].playerType === "ai") {
      
        // check if the player has busted with an Ace worth 11
        // if so change the Ace value to 1
        let playerBusted = false;
        state.updateGameState( { newDispatches: [
          { which: SHOW_PLAYER_TURN_ICON, data: true }
        ]});
        if (players[whichPlayer].handCount === 21) {
          if (players[whichPlayer].hand.length === 2) {
            state.updateGameState({ newDispatches: [
              { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: whichPlayer, data: "BLACKJACK!!!" } }
            ]});
          }
        }
        else {
          if (players[whichPlayer].handCount > 21) {
            const acesInHandWorthEleven: Array<any> = players[whichPlayer].hand.filter((card: any) => card.pip === "A" && card.points === 11);
            if (acesInHandWorthEleven.length > 0) {
              acesInHandWorthEleven[0].points = 1;
              const newTotal = recalcHand(whichPlayer);
              if(newTotal > 21) {
                playerBusted = true;
              }
            }
            else {
              playerBusted = true;
            }
            if (playerBusted) {            
              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: whichPlayer, data: "BUSTED" } },
                { which: PLAYER_BUSTED, data: { whichPlayer: whichPlayer, data: true } }
              ]});
            }
          }
        }
        
        setTimeout(()=>{
          if (players[whichPlayer].handCount > 16) {
            if (playerBusted) {             
              state.updateGameState({ newDispatches: [
                { which: RESET_PLAYER_HAND, data: whichPlayer }
              ]});
            }
            // if whichPlayer === 0 (the dealer) here then the hand is finished, reset everything
            if (whichPlayer === 0) {
              resetHand();
            }
            // else this isn't the dealer, so move to the next player
            else {
              whichPlayer+=1;
              // player 5 is the last player, so if it's 6 then it's the dealers turn
              if (whichPlayer === 6) { whichPlayer = 0; }
              // set the playersTurn state var, then the useEffect will trigger this function again
              state.updateGameState({ newDispatches: [
                { which: SET_PLAYERS_TURN, data: whichPlayer }
              ]});
            }
          }
          else { 
            // If the hand is less than 16, deal another card, then use setHitCard and useEffect to
            // call this function (playersHand) again with the same player, 
              //dealACard(whichPlayer);              
              state.updateGameState({ newDispatches: [
                { which: SET_HIT_CARD, data: true }
              ]});
          }
          state.updateGameState({ newDispatches: [
            { which: SHOW_PLAYER_TURN_ICON, data: false }
          ]});
        },2000);
      }
      else {              
        whichPlayer+=1;
        // player 5 is the last player, so if it's 6 then it's the dealers turn
        if (whichPlayer === 6) { whichPlayer = 0; }
        // set the playersTurn state var, then the useEffect will trigger this function again
        state.updateGameState({ newDispatches: [
          { which: SET_PLAYERS_TURN, data: whichPlayer }
        ]});

      }
    } 
  }
*/
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
        { dealHand                ? <Deal /> : null }
        { showPlayerTurnIcon      ? <PlayerTurn playerPosition={players[playersTurn].position} /> : null }
        { tableMessage !== ""     ? <TableMessage tableMessage={tableMessage} /> : null  }
        { userScoreMessage !== 0  ? <UserScoreMessage userScoreMessage={userScoreMessage} position={players[playerPosition].position}/> : null }
        { players.map((player: Object) => {
          return (
            // @ts-ignore
            player.playerHandResult !== "" ? <PlayerHandResult playerPosition={player.position} positionAdjust={[50,0]} playerHandResult={player.playerHandResult}/> : null 
          )
        })}
      </div>
    </div>
  )
}

export default CasinoTable;