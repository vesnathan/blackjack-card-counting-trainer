// import './scoreBar.component.css';
import { useEffect, useRef } from 'react';
import PlayingCard from "../playingCard/playingCard.component";
import PlayingCardAnimation from "../playingCardAnimation/playingCardAnimation.component";
import { useFirstRender } from "../../utils/firstRender";
import { useGameContext } from "../../utils/GameStateContext";
import Spacey from "../../assets/images/characters/spacey.png";
import { WHAT_COUNT }  from "../../consts/whatCountMessage";
import { saveGameIndexedDB } from "../../storage/indexedDB/functions";
import { SAVE_GAME_MONGODB } from "../../storage/mongoDB/mutations";
import { useMutation } from '@apollo/client';
import Auth from "../../utils/auth";
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

  const [saveGameMongoDB] = useMutation(SAVE_GAME_MONGODB);
  const firstRender = useFirstRender();
  const state: any = useGameContext();
  const { players } = state.state;
  const { 
    shoeCards, 
    cardsDealt,
    dealerDownCardShow,
    dealCounter,
    playersTurn,
    hitCard,
    playerPosition,
    betAmount,
    userDoubled,
    chipsTotal,
    scoreTotal,
    userStreak,
    gameLevel
  } = state.state.appStatus;

  const { gameRules } = state.state;



  const calcPayout = () => {
    if (!handPaidOut.current) { 
      
      // if user has BJ
      if (players[playerPosition].handCount === 21 && players[playerPosition].hand.length === 2 && !handPaidOut.current){
        // if dealer has BJ
        if (players[0].handCount === 21 && players[0].hand.length === 2){
          // user bet returned
          const chipsWon =  
          ((betAmount[0] * 5) + 
          (betAmount[1] * 25) + 
          (betAmount[2] * 50));
          console.log("PAYOUT 1: " + chipsWon);
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
          console.log("PAYOUT 2: " + chipsWon);
          state.updateGameState( { newDispatches: [ 
            { which: UPDATE_CHIPS, data: chipsWon } ,
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
          ]}); 
          handPaidOut.current = true;
        }
      }

      // if dealer busted and user didnt bust
      if (players[0].busted && !players[playerPosition].busted  && !handPaidOut.current) {
        const chipsWon = 
          ((betAmount[0] * 5) + 
          (betAmount[1] * 25) + 
          (betAmount[2] * 50))*2;
          console.log("PAYOUT 3: " + chipsWon);
          state.updateGameState( { newDispatches: [ 
            { which: UPDATE_CHIPS, data: chipsWon },
            { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
          ]});
          handPaidOut.current = true;
      } 
      
      // if neither busted and dealer handcount is < user handcount
      if (!players[0].busted && players[0].handCount < players[playerPosition].handCount  && !players[playerPosition].busted  && !handPaidOut.current) { 
        const chipsWon = 
          ((betAmount[0] * 5) + 
          (betAmount[1] * 25) + 
          (betAmount[2] * 50))*2;
          console.log("PAYOUT 4: " + chipsWon);
        state.updateGameState( { newDispatches: [ 
          { which: UPDATE_CHIPS, data: chipsWon } ,
          { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: `PAYING ${players[0].handCount+1}` } },
          { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU WIN" } }
        ]});
        handPaidOut.current = true; 
      }

      // if neither busted and dealer hand count >= user hand count
      if (!players[0].busted && players[0].handCount >= players[playerPosition].handCount  && !players[playerPosition].busted  && !handPaidOut.current) { 
        state.updateGameState({ newDispatches: [
          { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: (players[0].handCount === 21)?"DEALER WINS":`PAYING ${players[0].handCount+1}` } },
          { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: playerPosition, data: "YOU LOSE" } }
        ]});
      }
    }   
  }

  const checkBusted = () => {
    if (players[playersTurn].handCount > 21) {
      console.log(">21");
      const acesInHandWorthEleven: Array<any> = players[playersTurn].hand.filter((card:any) => card.points === 11);   
      if (acesInHandWorthEleven.length > 0) {
        console.log("Aces in hand worth 11", acesInHandWorthEleven.length);
        let changedOneAceAlready = false;
        const newPlayersHand = players[playersTurn].hand.map(
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
          { which: OVERWRITE_PLAYERS_HAND,  data: { whichPlayer: playersTurn, data: { hand: newPlayersHand, handCount: newHandCount } } }
        ]});
        if (newHandCount <= 21) {
          return false; 
        }
        else {        
          state.updateGameState({ newDispatches: [
          { which: UPDATE_PLAYER_HAND_RESULT,  data: { whichPlayer: playersTurn, data: "BUSTED" } },
          { which: PLAYER_BUSTED,  data: { whichPlayer: playersTurn, data: true } },
        ]}); 
          return true;
        } 
      }
      else {
        console.log("No aces worth 11");
        state.updateGameState({ newDispatches: [
          { which: UPDATE_PLAYER_HAND_RESULT,  data: { whichPlayer: playersTurn, data: "BUSTED" } },
          { which: PLAYER_BUSTED,  data: { whichPlayer: playersTurn, data: true } },
        ]}); 
        return true;
      }
    }
    return false;
  }

  const checkBJ = () => {

    // check if player has BJ
    if (players[playersTurn].handCount === 21 && players[playersTurn].hand.length === 2) {
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
      { which: UPDATE_PLAYER_HAND_CARDS,  data: { player: playersTurn, card: shoeCards[cardsDealt] } },
    ]}); 
    state.updateGameState({ newDispatches: [
      { which: UPDATE_PLAYER_HAND_COUNT,  data: { player: playersTurn, card: shoeCards[cardsDealt] } }
    ]});
    state.updateGameState({ newDispatches: [{ which: UPDATE_DEAL_COUNT }]});
  }
  
  const nextPlayer = () => {
    // state.updateGameState({ newDispatches: [{ which: SHOW_PLAYER_TURN_ICON,  data: false }]});
    state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: (playersTurn === 5) ? 0 : playersTurn+1 } ] } );
  }

  let deps = [playersTurn, hitCard]
  useWhatChanged(deps, 'playersTurn, hitCard');
  useEffect(()=>{
    if (!firstRender) {
      
      if (players[playersTurn].hand.length < 2) {
        dealCard("!firstRender"); 
      }
      else {
        console.log("%c ------------- PLAYER -------------" + playersTurn,'background: #222; color: #bada55');
        players[playersTurn].hand.map((card: string, index: number) => {
          console.log(card)
        });
        switch (players[playersTurn].playerType) {

          // ------------------------------------------------------------------------------------------------------- AI
          case "ai":
            
            state.updateGameState({ newDispatches: [
              { which: SHOW_PLAYER_TURN_ICON,  data: true },
              { which: SHOW_PLAY_BUTTONS, data: false }
            ]});
            const aiHasBJ = checkBJ();
            if (!aiHasBJ) {
              // if (hitCard) {
                
              //   dealCard("hitCard");
              //   state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: false }]});  
              // }
              const aiBusted = checkBusted();

              setTimeout(()=> {  
                if (!aiBusted) {
                  if (players[playersTurn].handCount > 16) {
                    setTimeout(()=>{nextPlayer()},1000);
                  }
                  else {
                    if (hitCard) { console.log("Hit Card Set");}
                    state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: true }]})
                  }
                }
                else {   
                  state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: playersTurn }]});
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
            
           
            if (playerHasBJ /*&& playersTurn === playerPosition*/) {
              state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: false }]});
            }
            else {

              // if (hitCard) {
              //   dealCard("user hit");
              //   state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: false }]});
              // }
              const playerBusted = checkBusted();
              if (playerBusted) {
                state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: false }]});
                setTimeout(() => {
                  state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: playersTurn }]});
                  state.updateGameState({ newDispatches: [{ which: BET_AMOUNT, data: [[0],[0],[0]] }]});
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
            // if (hitCard) {
            //   dealCard("hitCard");
            //   state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: false }]});  
            // }  
  
            const dealerBusted = checkBusted();
            setTimeout(()=> { 
              if (!dealerBusted) {
                if (players[playersTurn].handCount <= 16) { 
                  state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: true }]});
                } 
                else {
                  calcPayout(); 
                  resetHand();
                }
              }
              else {
                state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: playersTurn }]});
                calcPayout(); 
                resetHand();
              }
            },2000);
          }

          break;   
        }
        saveGameIndexedDB({chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel, gameRules});
        const jsonObjStr = JSON.stringify( { chipsTotal: chipsTotal, scoreTotal: scoreTotal, playerPosition: playerPosition, userStreak: userStreak, gameLevel: gameLevel, gameRules: gameRules });
        const user = Auth.getProfile();
        saveGameMongoDB({variables: {gameData: jsonObjStr, username: user.data.username }});
      }
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },deps);

  useEffect(()=>{
    if (hitCard) {
      dealCard("hitCard");
      state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: false }]});
    }
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

        if (player.hand.length > 0) {
          return (
            <div key={`${player.position[0]}-${player.position[1]}-${playerIndex}-PlayingCardWrapperDiv`}>
              {
                player.hand.map((card: any, index: number) => {
                  let offset = index + 1;
                  let posx=player.position[0]
                  let posy=player.position[1]
                  if (playerIndex === 0 ) { 
                    if (index===0) {
                      offset = index;
                      posx=player.position[0];
                      posy=player.position[1];
                    }
                    if (index===1) {
                      offset = 0;
                      posx=player.position[0] - 9;
                      posy=player.position[1];
                    }
                  }
                  return ( 
                    <PlayingCardAnimation 
                      key={`${player.position[0]}-${player.position[1]}-${index}-${playerIndex}-PlayingCardAnimation`}
                      posx={posx} 
                      posy={posy} 
                      offset={offset} >
                      <PlayingCard 
                        key={`${player.position[0]}-${player.position[1]}-${index}-${playerIndex}-PlayingCard`}
                        cardSuit={card.suit} 
                        cardPip={card.pip} 
                        showDealerDownCard={dealerDownCardShow} 
                        dealerDownCard={(playerIndex === 0 && index === 0)? true:false}
                      />
                    </PlayingCardAnimation> 
                  )  
                })
              }
            </div>
          )
        }
        return null;
      })
    }
    </> 
  )
}
  
export default Deal;