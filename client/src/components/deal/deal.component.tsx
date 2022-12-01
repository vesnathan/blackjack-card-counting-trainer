// import './scoreBar.component.css';
import { useEffect, useRef } from 'react';
import PlayingCard from "../playingCard/playingCard.component";
import PlayingCardAnimation from "../playingCardAnimation/playingCardAnimation.component";
import { useFirstRender } from "../../utils/firstRender";
import { useGameContext } from "../../utils/GameStateContext";
import Spacey from "../../assets/images/characters/spacey.webp";
import { WHAT_COUNT }  from "../../consts/whatCountMessage";
import { saveGameIndexedDB } from "../../storage/indexedDB/functions";


import { useWhatChanged } from '@simbathesailor/use-what-changed';

import { 
  UPDATE_PLAYER_HAND_CARDS, 
  UPDATE_PLAYER_HAND_COUNT,
  SET_PLAYERS_TURN,
  UPDATE_DEAL_COUNT,
  SHOW_PLAYER_TURN_ICON,
  UPDATE_PLAYER_HAND_RESULT,
  RESET_PLAYER_HAND,
  SET_HIT_CARD,
  BET_AMOUNT,
  SET_DEALER_DOWN_CARD,
  SHOW_PLAY_BUTTONS,
  OVERWRITE_PLAYERS_HAND,
  UPDATE_CHIPS,
  PLAYER_BUSTED,
  UPDATE_PLAY_BUTTONS,
  POPUP_MESSAGE,
  POPUP_TITLE,
  SHOW_POPUP,
  POPUP_CHARACTER,
  SHOW_SPACEY_FORM,
  SHOW_COUNT
} from "../../utils/actions";

type DealProps = {
  resetHand: Function;
};

const Deal = ({ resetHand }: DealProps): JSX.Element => {
  const handPaidOut = useRef(false);

  const firstRender = useFirstRender();
  const state: any = useGameContext();
  const { players } = state.state;
  const { 
    shoeCards, 
    cardsDealt,
    dealerDownCardShow,
    dealCounter,
    playersTurn,
    playerHandNumber,
    hitCard,
    playerPosition,
    betAmount,
    userDoubled,
    chipsTotal,
    scoreTotal,
    userStreak,
    gameLevel,
  } = state.state.appStatus;

  const { gameRules } = state.state;



  const calcPayout = () => {
    if (!handPaidOut.current) { 
      for (let i = 0; i < players[playerPosition].hand.length; i++){
        // if user has BJ
        if (players[playerPosition].handCount[i] === 21 && players[playerPosition].hand[i].length === 2  && !handPaidOut.current){
          // if dealer has BJ
          if (players[0].handCount[0] === 21 && players[0].hand[0].length === 2){
            // user bet returned
            const chipsWon =  
            ((betAmount[0] * 5) + 
            (betAmount[1] * 25) + 
            (betAmount[2] * 50));

            state.updateGameState( { newDispatches: [ 
              { which: UPDATE_CHIPS, data: chipsWon } ,
              { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "BET RETURNED" } }
            ]}); 
            handPaidOut.current = true;
          }
          else {    
            // user wins bet is paid 3:2 

            const chipsWon =
            (((betAmount[0] * 5) + 
            (betAmount[1] * 25) + 
            (betAmount[2] * 50))*2.5); 

            state.updateGameState( { newDispatches: [ 
              { which: UPDATE_CHIPS, data: chipsWon } ,
              { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
            ]}); 
            handPaidOut.current = true;
          }
        }

        // if dealer busted and user didnt bust
        if (players[0].busted[0] && !players[playerPosition].busted[i]  && !handPaidOut.current) {

          const chipsWon = 
            ((betAmount[0] * 5) + 
            (betAmount[1] * 25) + 
            (betAmount[2] * 50))*2;
            state.updateGameState( { newDispatches: [ 
              { which: UPDATE_CHIPS, data: chipsWon },
              { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
            ]});
            handPaidOut.current = true;
        } 
        
        // if neither busted and dealer handcount is < user handcount
        if (!players[0].busted[0] && players[0].handCount[0] < players[playerPosition].handCount[i]  && !players[playerPosition].busted[i]  && !handPaidOut.current) { 

          const chipsWon = 
            ((betAmount[0] * 5) + 
            (betAmount[1] * 25) + 
            (betAmount[2] * 50))*2;
          state.updateGameState( { newDispatches: [ 
            { which: UPDATE_CHIPS, data: chipsWon } ,
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: `PAYING ${players[0].handCount+1}` } },
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
          ]});
          handPaidOut.current = true; 
          
        }

        // if neither busted and dealer hand count >= user hand count
        if (!players[0].busted[0] && players[0].handCount[0] >= players[playerPosition].handCount[i]  && !players[playerPosition].busted[i]  && !handPaidOut.current) { 

          state.updateGameState({ newDispatches: [
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: (players[0].handCount[0] === 21)?"DEALER WINS":`PAYING ${players[0].handCount[0]+1}` } },
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU LOSE" } }
          ]});
        }
      }
    }   
  }

  const checkBusted = () => {
    if (players[playersTurn].handCount[playerHandNumber]  > 21) {

      const acesInHandWorthEleven: Array<any> = players[playersTurn].hand[playerHandNumber].filter((card:any) => card.points === 11);   
      if (acesInHandWorthEleven.length > 0) {

        let changedOneAceAlready = false;
        const newPlayersHand = players[playersTurn].hand[playerHandNumber].map(
          (obj:any) => {
            if (obj.points === 11 && !changedOneAceAlready) {
            
              changedOneAceAlready = true;
              return {...obj, points: 1}
            }
            return obj;
          }
        );
        const newHandCount = newPlayersHand.reduce((accumulator: number, card: any) => {
          return accumulator + card.points;
        }, 0);
        state.updateGameState({ newDispatches: [
          { which: OVERWRITE_PLAYERS_HAND,  data: { whichPlayer: playersTurn, data: { hand: newPlayersHand, playerHandNumber: playerHandNumber, handCount: newHandCount } } }
        ]});
        if (newHandCount <= 21) {
          return false; 
        }
        else {        
          state.updateGameState({ newDispatches: [
          { which: UPDATE_PLAYER_HAND_RESULT,  data: { whichPlayer: playersTurn, data: "BUSTED" } },
          { which: PLAYER_BUSTED,  data: { whichPlayer: playersTurn, data: true } },
          { which: SHOW_PLAYER_TURN_ICON,  data: false }
        ]}); 
          return true;
        } 
      }
      else {

        state.updateGameState({ newDispatches: [
          { which: UPDATE_PLAYER_HAND_RESULT,  data: { whichPlayer: playersTurn, data: "BUSTED" } },
          { which: PLAYER_BUSTED,  data: { whichPlayer: playersTurn, data: true } },
          { which: SHOW_PLAYER_TURN_ICON,  data: false }
        ]}); 
        return true;
      }
    }
    return false;
  }

  const checkBJ = () => {

    // check if player has BJ
    if (players[playersTurn].handCount[playerHandNumber] === 21 && players[playersTurn].hand[playerHandNumber].length === 2) {
      state.updateGameState({ newDispatches: [{ which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playersTurn, data: "BLACKJACK!!!" } }]});
      setTimeout(()=>{
        if (playersTurn !== 0) {
          nextPlayer();
        }
      }, 2000) ;
      return true;    
    }
    return false;  
  }

  const dealCard = (caller: string) => {
    state.updateGameState({ newDispatches: [
      { which: UPDATE_PLAYER_HAND_CARDS,  data: { playerNumber: playersTurn, playerHandNumber: playerHandNumber, card: shoeCards[cardsDealt] } },
      { which: UPDATE_PLAYER_HAND_COUNT,  data: { playerNumber: playersTurn, playerHandNumber: playerHandNumber, card: shoeCards[cardsDealt] } },
      { which: UPDATE_DEAL_COUNT },
      { which: SET_HIT_CARD,  data: false }
    ]}); 
  }
  
  const nextPlayer = () => {
    // state.updateGameState({ newDispatches: [{ which: SHOW_PLAYER_TURN_ICON,  data: false }]});
    state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: (playersTurn === 5) ? 0 : playersTurn+1 } ] } );
  }

  let deps = [playersTurn, hitCard]
  useWhatChanged(deps, 'playersTurn, hitCard');
  useEffect(()=>{
    if (!firstRender) {
      
      if (players[playersTurn].hand[0].length < 2) {
        dealCard("!firstRender"); 
      }
      else {
        console.log("%c ------------- PLAYER " + playersTurn + " -------------" ,'background: #222; color: #bada55');
        // eslint-disable-next-line array-callback-return
        // players[playersTurn].hand.map((card: string, index: number) => {
        // });
        switch (players[playersTurn].playerType) {

          // ------------------------------------------------------------------------------------------------------- AI
          case "ai":
            
            state.updateGameState({ newDispatches: [
              { which: SHOW_PLAYER_TURN_ICON,  data: true },
              { which: SHOW_PLAY_BUTTONS, data: false }
            ]});
            const aiHasBJ = checkBJ();
            if (!aiHasBJ) {
              const aiBusted = checkBusted();

              setTimeout(()=> {  
                if (!aiBusted) {
                  if (players[playersTurn].handCount[0] > 16) {
                    setTimeout(()=>{nextPlayer()},1000);
                  }
                  else {
                    if (hitCard) { console.log("Hit Card Set");}
                    state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: true }]})
                  }
                }
                else {   
                  state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: { playersTurn: playersTurn, playerHandNumber: playerHandNumber } }]});
                    setTimeout(()=>{nextPlayer()},1000);
                }
              },2000);
            }
            break;
            

          // ------------------------------------------------------------------------------------------------------- USER
          case "user":         

            const playerHasBJ = checkBJ();

            state.updateGameState({ newDispatches: [{ which: SHOW_PLAYER_TURN_ICON,  data: false }]});

            // check if player has a hard 9-11 and can double
            if (players[playersTurn].hand.length === 2 && players[playersTurn].handCount >=9 && players[playersTurn].handCount <= 11) {
              state.updateGameState({ newDispatches: [{ which: UPDATE_PLAY_BUTTONS, data: { whichButton: 2, whichProperty: "buttonDisabled", data: false }}]});
            }
            else {
              state.updateGameState({ newDispatches: [{ which: UPDATE_PLAY_BUTTONS, data: { whichButton: 2, whichProperty: "buttonDisabled", data: true }}]});
            }
            
            // can player split
            if (players[playersTurn].hand[playerHandNumber].length === 2 && players[playersTurn].hand[playerHandNumber][0].pip === players[playersTurn].hand[playerHandNumber][1].pip) {
              state.updateGameState({ newDispatches: [{ which: UPDATE_PLAY_BUTTONS, data: { whichButton: 3, whichProperty: "buttonDisabled", data: false }}]});
            }
           
            if (playerHasBJ ) {
              state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: false }]});
            }
            else {
              const playerBusted = checkBusted();
              if (playerBusted) {
                state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: false }]});
                setTimeout(() => {
                  state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: { playersTurn: playersTurn, playerHandNumber: playerHandNumber  }}]});
                  state.updateGameState({ newDispatches: [{ which: BET_AMOUNT, data: [0,0,0] }]});
                  nextPlayer();
                },2000);
              }
              else if (userDoubled || (players[playersTurn].hand.length > 2 && players[playersTurn].handCount === 21)) {
                state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: false }]});
                nextPlayer();
              }
              // Randomly show Spacey Popup
              else if (Math.random() < .01) {
                state.updateGameState(
                  { newDispatches: 
                    [ 
                      { which: POPUP_MESSAGE,     data: WHAT_COUNT() },
                      { which: POPUP_TITLE,       data: "WHAT'S THE COUNT?" },
                      { which: SHOW_POPUP,        data: true },
                      { which: POPUP_CHARACTER,   data: Spacey },
                      { which: SHOW_SPACEY_FORM,  data: true },
                      { which: SHOW_PLAY_BUTTONS, data: false },
                      { which: SHOW_COUNT,        data: false },
                    ]
                  }
                );
              }
              else {
                state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: true }]});
              }
            }
          break;

          // ------------------------------------------------------------------------------------------------------- DEALER
          case "dealer":            
          state.updateGameState({ newDispatches: [{ which: SHOW_PLAYER_TURN_ICON,  data: false }]});
          state.updateGameState({ newDispatches: [{ which: SET_DEALER_DOWN_CARD,  data: true }]});
          
          const dealerHasBJ = checkBJ(); 
          if (!dealerHasBJ) {

            const dealerBusted = checkBusted();
            setTimeout(()=> { 
              if (!dealerBusted ) {
                

                if (players[0].handCount <= 16) { 
                  state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: true }]});
                } 
                else {
                  calcPayout(); 
                  resetHand();
                }
              }
              else {
                state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: { playersTurn: playersTurn, playerHandNumber: playerHandNumber  }}]});
                calcPayout(); 
                resetHand();
              }
            },2000);
          }
          else {
            setTimeout(()=>{
              calcPayout(); 
              resetHand();
            },2000);
          }

          break;   
        }
        saveGameIndexedDB({chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel, gameRules});
      }
      
    }
    console.log("=================================================");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },deps);

  useEffect(()=>{
    if (hitCard) {
      dealCard("hitCard");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hitCard])

  // this useEffect takes care of the deal
  useEffect(() => {
    if (dealCounter <= 12) {
      if (dealCounter === 12) {
        state.updateGameState({ newDispatches: [{ which: UPDATE_DEAL_COUNT }]});
        state.updateGameState({ newDispatches: [ { which: SET_PLAYERS_TURN, data: 1 } ] });
      }
      const timer1 = setTimeout(() => { 
        let player = dealCounter % 6;
        player = player + 1;
        if (player > 5) { player = 0 }
          state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: player } ] } );
      }, 505);
      return () => {
        clearTimeout(timer1);
      };
    }  
  });


  return (
    <>
      {
      
        players.map((player: any, playerIndex: number) => {
          return player.hand.map((thisHand: any, handIndex: number) => {
            return (
              <div id={`Player-${playerIndex}-Hand${handIndex}`} key={`${player.position[0]}-${player.position[1]}-${playerIndex}-${handIndex}-PlayingCardWrapperDiv`}>
                {
                  thisHand.map((card: any, cardIndex: number) => {
                    let offset: number = 0;
                    let posx: number = 0;
                    let posy: number = 0;
                    if (player.hand.length > 1) {
                      let splitHandPositionAdjustment: number = 9;
                      posx=player.position[0] + (splitHandPositionAdjustment/(splitHandPositionAdjustment/player.hand.length)) - (handIndex * splitHandPositionAdjustment);
                      posy=player.position[1]-(cardIndex * (splitHandPositionAdjustment/2));
                    }
                    else {
                      offset = cardIndex + 1;
                      posx=player.position[0];
                      posy=player.position[1];
                    }

                    
                    if (playerIndex === 0 ) { 
                      if (cardIndex===0) {
                        offset = cardIndex;
                        posx=player.position[0];
                        posy=player.position[1];
                      }
                      if (cardIndex===1) {
                        offset = 0;
                        posx=player.position[0] - 9;
                        posy=player.position[1];
                      }
                    }
                    return ( 
                      <PlayingCardAnimation 
                        key={`${player.position[0]}-${player.position[1]}-${cardIndex}-${playerIndex}-${handIndex}-PlayingCardAnimation`}
                        posx={posx} 
                        posy={posy} 
                        offset={offset} >
                        <PlayingCard 
                          key={`${player.position[0]}-${player.position[1]}-${cardIndex}-${playerIndex}-${handIndex}-PlayingCard`}
                          cardSuit={card.suit} 
                          cardPip={card.pip} 
                          showDealerDownCard={dealerDownCardShow} 
                          dealerDownCard={(playerIndex === 0 && cardIndex === 0)? true:false}
                        />
                      </PlayingCardAnimation> 
                    )  
                  })
                }
              </div>
            )
          })
        })
      }
    </> 
  )
}
  
export default Deal;