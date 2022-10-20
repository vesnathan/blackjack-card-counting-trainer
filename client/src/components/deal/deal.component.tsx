// import './scoreBar.component.css';
import { useEffect } from 'react';
import PlayingCard from "../playingCard/playingCard.component";
import PlayingCardAnimation from "../playingCardAnimation/playingCardAnimation.component";
import { useFirstRender } from "../../utils/firstRender";
import { useGameContext } from "../../utils/GameStateContext";
import saveGame from "../../functions/saveGame";
import Spacey from "../../assets/images/characters/spacey.png";
import { WHAT_COUNT }  from "../../consts/whatCountMessage";
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
    if (players[playerPosition].handCount === 21 && players[playerPosition].hand.length === 2){
      // user has BJ
      if (players[0].handCount === 21 && players[0].hand.length === 2){
        
        //dealer has BJ, bet is returned
        const chipsWon =  
        ((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50));
        console.log("PAYOUT 1");
        state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: chipsWon } ] } );
      }
      else {
        
        // bet is paid 3:2 
        const chipsWon =
        (((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50))*2.5); 
        console.log("PAYOUT 2"); 
        state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: chipsWon } ] } );      
      }
    }
    if (players[0].busted && !players[playerPosition].busted) {
      const chipsWon = 
        ((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50))*2;
        console.log("PAYOUT 3");
        state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: chipsWon } ] } );
    }  
    if (players[0].handCount < players[playerPosition].handCount  && !players[playerPosition].busted) { 
      const chipsWon = 
        ((betAmount[0] * 5) + 
        (betAmount[1] * 25) + 
        (betAmount[2] * 50))*2;
        console.log("PAYOUT 4");
      state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: chipsWon } ] } );
    }
    switch (players[0].busted) {
      case true:
        if (!players[playerPosition].busted) {
          state.updateGameState({ newDispatches: [
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
  const checkBusted = () => {
    if (players[playersTurn].handCount > 21) {
      const acesInHandWorthEleven: Array<any> = players[playerPosition].hand.filter((card:any) => card.pip === "A" && card.points === 11);    
      if (acesInHandWorthEleven.length > 0) {
        const newPlayersHand = players[playersTurn].hand.map(
          (obj:any) => {
            if (obj.points === 11) {
              return {...obj, points: 1}
            }
            return obj;
          }
        );
        const newHandCount = players[playersTurn].hand.reduce((accumulator: number, card: any) => {
          return accumulator + ((card.points === 11)? 1 : card.points) ;
        }, 0);
        state.updateGameState({ newDispatches: [
          { which: OVERWRITE_PLAYERS_HAND,  data: { whichPlayer: playersTurn, data: { hand: newPlayersHand, handCount: newHandCount } } }
        ]});
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
    return false;
  }
  useEffect(()=>{
    if (!firstRender) {
      state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: false }]});
      if (players[playersTurn].hand.length < 2) {

        state.updateGameState({ newDispatches: [
          { which: UPDATE_PLAYER_HAND_CARDS,  data: { player: playersTurn, card: shoeCards[cardsDealt] } },
        ]}); 
        state.updateGameState({ newDispatches: [
          { which: UPDATE_PLAYER_HAND_COUNT,  data: { player: playersTurn, card: shoeCards[cardsDealt] } }
        ]}); 

        state.updateGameState({ newDispatches: [{ which: UPDATE_DEAL_COUNT }]});
      }
      else {
        switch (players[playersTurn].playerType) {
          case "ai":
            console.log("ai "+playersTurn+": ", players[playersTurn].handCount );
            state.updateGameState({ newDispatches: [{ which: SHOW_PLAYER_TURN_ICON,  data: true }]});
            if (players[playersTurn].handCount < 17) {

              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_CARDS,  data: { player: playersTurn, card: shoeCards[cardsDealt] } },
              ]});
              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_COUNT,  data: { player: playersTurn, card: shoeCards[cardsDealt] } }
              ]}); 

            }

            setTimeout(()=> { 
              const aiBusted = checkBusted();
              if (!aiBusted) {
                if (players[playersTurn].handCount > 16) { 
                  state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: (playersTurn === 5) ? 0 : playersTurn+1 } ] } );
                }
                else {
                  setTimeout(()=>{
                      state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: true }]});
                    }, 1000)
                  }
              }
              else {
                setTimeout(() => {
                  state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: playersTurn }]});
                  state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: (playersTurn === 5) ? 0 : playersTurn+1 } ] } );
                },2000);
              }
            },2000);
            break;
            

          case "user":         
            console.log("user: ", players[playersTurn].handCount );
            
            // Randomly show Spacey Popup
            if (Math.random() < 1) {
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

            // check if player has a hard 9-11 and can double
            if (players[playersTurn].hand.length === 2 && players[playersTurn].handCount >=9 && players[playersTurn].handCount <= 11) {
              state.updateGameState({ newDispatches: [{ which: UPDATE_PLAY_BUTTONS, data: { whichButton: 2, whichProperty: "buttonDisabled", data: false }}]});
            }
            state.updateGameState({ newDispatches: [{ which: SHOW_PLAYER_TURN_ICON,  data: false }]});
            state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: true }]});

            if (hitCard) {
              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_CARDS,  data: { player: playersTurn, card: shoeCards[cardsDealt] } },
              ]});  
              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_COUNT,  data: { player: playersTurn, card: shoeCards[cardsDealt] } }
              ]}); 
            }
             
            const playerBusted = checkBusted();

            if (playerBusted) {
              state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: false }]});
              setTimeout(() => {
                state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: playersTurn }]});
                state.updateGameState({ newDispatches: [{ which: BET_AMOUNT, data: [[0],[0],[0]] }]});
                state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: (playersTurn === 5) ? 0 : playersTurn+1 } ] } );
              },2000);
            }
            else if (userDoubled) {
              state.updateGameState({ newDispatches: [{ which: SHOW_PLAY_BUTTONS, data: false }]});
              state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: (playersTurn === 5) ? 0 : playersTurn+1 } ] } );
            }
          break;

          case "dealer":            
          console.log("dealer: ", players[playersTurn].handCount );
          state.updateGameState({ newDispatches: [{ which: SHOW_PLAYER_TURN_ICON,  data: false }]});
          state.updateGameState({ newDispatches: [{ which: SET_DEALER_DOWN_CARD,  data: true }]});
          
          if (players[playersTurn].handCount < 17) {             
            state.updateGameState({ newDispatches: [
              { which: UPDATE_PLAYER_HAND_CARDS,  data: { player: playersTurn, card: shoeCards[cardsDealt] } },
            ]});
            state.updateGameState({ newDispatches: [
              { which: UPDATE_PLAYER_HAND_COUNT,  data: { player: playersTurn, card: shoeCards[cardsDealt] } }
            ]}); 
          }      
          setTimeout(()=> { 
            const dealerBusted = checkBusted();
            if (!dealerBusted) {
              if (players[playersTurn].handCount > 16) { 
                setTimeout(()=> { 
                  calcPayout();
                  resetHand();
                },2000);
              }
              else {
                state.updateGameState({ newDispatches: [{ which: SET_HIT_CARD,  data: true }]});
              }
            }
            else {
              setTimeout(() => {
                state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data: playersTurn }]});
                calcPayout();
                resetHand();
                },2000);
            }
          },2000);
          break;   
        }
        saveGame(chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel, gameRules);
      }
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[firstRender, playersTurn, hitCard]);

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