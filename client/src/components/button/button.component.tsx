import './button.component.css';

import { useGameContext } from "../../utils/GameStateContext";
import { STRATEGY_HARD, STRATEGY_PAIRS, STRATEGY_SOFT } from "../../consts/strategyCard";
import { STRIPE_MESSAGE } from "../../consts/stripeMessage";
import { 
  SHOW_BET_BUTTONS,
  UPDATE_DEAL_HAND,
  UPDATE_CHIPS,
  BET_AMOUNT,
  SET_HIT_CARD,
  SHOW_PLAY_BUTTONS,
  UPDATE_SCORE,
  UPDATE_STREAK,
  SET_USER_SCORE_MESSAGE,
  UPDATE_PLAY_BUTTONS,
  USER_DOUBLED,
  SET_PLAYERS_TURN,
  SHOW_POPUP,
  POPUP_MESSAGE,
  SHOW_STRIPE_FORM,
  UPDATE_AUTO_BET,
  SET_AUTO_BET_AMOUNT,
  UPDATE_PLAYER_HAND_CARDS,
  UPDATE_CARDS_DEALT,
  SPLIT_CARDS
} from "../../utils/actions";





type ButtonProps = {
  buttonString: string;
  bgColor: string;
  buttonDisabled: boolean;
  buttonType: string;
};



const Button = ({ buttonString, bgColor, buttonDisabled, buttonType }: ButtonProps): JSX.Element =>  {
  
  const state: any = useGameContext();
  let { betAmount, chipsTotal, playerPosition, userStreak, scoreTotal, autoBet, playersTurn, playerHandNumber, shoeCards, cardsDealt } = state.state.appStatus;
  const { players } = state.state;

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement>, buttonType: string ) => {
    if (buttonType === "betButton") { 


        switch ((e.target as HTMLElement).id) {
          case "5":
            betAmount[0] += 1;
            break;      
          case "25":
            betAmount[1] += 1;
            break;      
          case "50":
            betAmount[2] += 1;
            break;     
          case "DEAL":
            state.updateGameState(
              { newDispatches: 
                [ 
                  { which: UPDATE_DEAL_HAND,  data: true },
                  { which: SHOW_BET_BUTTONS,  data: false },
                  { which: UPDATE_CHIPS,  data: -((betAmount[0]*5)+(betAmount[1]*25)+(betAmount[2]*50)) },
                ]
              }
            ); 
            break;
          case "AUTO" :
            if (!autoBet) {
              state.updateGameState({newDispatches:[
                { which: UPDATE_AUTO_BET,  data: true },
                { which: SET_AUTO_BET_AMOUNT,  data: [betAmount[0],betAmount[1],betAmount[2]] }
              ]});
            } 
            else {
              state.updateGameState({newDispatches:[
                { which: UPDATE_AUTO_BET,  data: false },
                { which: SET_AUTO_BET_AMOUNT,  data: [0,0,0] }
              ]});
            }
            break;
        }

      state.updateGameState({newDispatches:[{ which: BET_AMOUNT,  data: [betAmount[0],betAmount[1],betAmount[2]] }]}); 
      if (chipsTotal-((betAmount[0]*5)+(betAmount[1]*25)+(betAmount[2]*50)) >= 0 ) {
        // state.updateGameState({newDispatches:[{ which: UPDATE_BET_BUTTONS,  data: {whichButton: 3, whichProperty: "buttonDisabled", data: false } }]}); 
      }
      else {
        state.updateGameState({newDispatches:[{ which: SHOW_POPUP,  data: true }]}); 
        state.updateGameState({newDispatches:[{ which: SHOW_STRIPE_FORM,  data: true }]}); 
        state.updateGameState({newDispatches:[{ which: POPUP_MESSAGE,  data: STRIPE_MESSAGE() }]}); 
      }
    }
    if (buttonType === "playButton") { 
      
      const whichButton = (e.target as HTMLElement).id;
    
      if (
        whichButton === "HIT" ||
        whichButton === "DOUBLE" ||
        whichButton === "STAND" ||
        whichButton === "SPLIT" 
      )
      {
        // calc strategy
        const dealerUpCard = players[0].hand[0][1]?.points;
        const playerHand = players[playerPosition];

        let playerHandRow: Array<string> = [];
        let logStratCardCalc: string = "";

        const acesInHandWorthEleven: Array<any> = playerHand.hand[playerHandNumber].filter((card:any) => card.points === 11);

        // First, check pairs
        if (playerHand.hand[playerHandNumber][0].pip === playerHand.hand[playerHandNumber][1].pip && playerHand.hand[playerHandNumber].length === 2) {
          playerHandRow = STRATEGY_PAIRS[playerHand.hand[playerHandNumber][1].points-2];
          logStratCardCalc += " PAIRS STRATEGY CARD";
        }
        else {

          // if the player has an ace worth 11 use the soft strat card
          // soft hand, the -14 adjusts for the fact that the array starts at 4 and give the ace a value of 1
          if (acesInHandWorthEleven.length > 0) {
            playerHandRow = STRATEGY_SOFT[playerHand.handCount[playerHandNumber]-14];
            logStratCardCalc += " SOFT STRATEGY CARD";
          }
          else {
            playerHandRow = STRATEGY_HARD[playerHand.handCount[playerHandNumber]-4];
            logStratCardCalc += " HARD STRATEGY CARD";
          }
        }
        const dealerCol = dealerUpCard-2;

        logStratCardCalc += " COLUMN: "+dealerCol;

        let strategy = playerHandRow[dealerCol];

        if (strategy === "D" && playerHand.hand[playerHandNumber].length > 2) {
          strategy = "H";
        }

        logStratCardCalc += " CORRECT: "+strategy;






        
        
        let newScore = 0;

        switch (whichButton) {
          case "HIT":
            if (strategy === "H") {
              newScore = 10*userStreak;
            }
            else {
              newScore = -5*userStreak;
            }
            state.updateGameState( { newDispatches: [ 
              { which: SET_HIT_CARD, data: true },  
              { which: SHOW_PLAY_BUTTONS, data: false }, 
              { which: UPDATE_SCORE, data: scoreTotal+newScore }, 
              { which: SET_USER_SCORE_MESSAGE, data: newScore }, 
              { which: UPDATE_STREAK, data: (newScore < 0)?1:userStreak+=1  },
            ] } );
  ;
          break;
          case "STAND":
            if (strategy === "S") {
              newScore = 10*userStreak;
            }
            else {
              newScore = -5*userStreak;
            }



            state.updateGameState( { newDispatches: [ 
              { which: SET_PLAYERS_TURN, data: (playerPosition === 5)?0:playerPosition+1 },
              { which: SHOW_PLAY_BUTTONS, data: false },
              { which: UPDATE_SCORE, data: scoreTotal+newScore },
              { which: SET_USER_SCORE_MESSAGE, data: newScore },
              { which: UPDATE_STREAK, data:  (newScore < 0)?1:userStreak+=1  },
            ]}); 


          break;
          case "SPLIT":
            if (strategy === "SP") {
              newScore = 10*userStreak;
            }
            else {
              newScore = -5*userStreak;
            }

            state.updateGameState( 
              { newDispatches: [ 
                { which: SHOW_PLAY_BUTTONS, data: false },
                { which: SPLIT_CARDS, data: { playerNumber: playersTurn, playerHandNumber: playerHandNumber} },
                { which: UPDATE_SCORE, data: scoreTotal+newScore },
                { which: SET_USER_SCORE_MESSAGE, data: newScore }, 
                { which: UPDATE_STREAK, data: (newScore < 0)?1:userStreak+=1 },
                { which: UPDATE_PLAYER_HAND_CARDS,  data: { playerNumber: playersTurn, playerHandNumber: playerHandNumber, card: shoeCards[cardsDealt] } },
                { which: UPDATE_PLAYER_HAND_CARDS,  data: { playerNumber: playersTurn, playerHandNumber: playerHandNumber+1, card: shoeCards[cardsDealt+1] } },
                { which: SET_PLAYERS_TURN, data: (playersTurn === 5) ? 0 : playersTurn+1 },
                { which: UPDATE_PLAY_BUTTONS, data: { whichButton: 3, whichProperty: "buttonDisabled", data: true }},
              ]});
          break;
          case "DOUBLE":
            if (strategy === "D") {
              newScore = 10*userStreak;
            }
            else {
              newScore = -5*userStreak;
            }
            let tempBetAmount = betAmount;
            tempBetAmount = [(betAmount[0] * 2), (betAmount[1] * 2), (betAmount[2] * 2)];
            
            let remainingChips = chipsTotal;
            betAmount.forEach((chipAmount: number, index: number)=>{
              switch (index) {
                case 0: // $5 chip
                remainingChips -= chipAmount*5;
                break;
                case 1: // $25 chip
                remainingChips -= chipAmount*25;
                break;
                case 2: // $50 chip
                remainingChips -= chipAmount*50;
                break;
              }
            })

            state.updateGameState( 
              { newDispatches: [ 
                { which: UPDATE_CHIPS, data: remainingChips }, 
                { which: SHOW_PLAY_BUTTONS, data: false }, 
                { which: USER_DOUBLED, data: true }, 
                { which: BET_AMOUNT, data: tempBetAmount }, 
                { which: UPDATE_SCORE, data: scoreTotal+newScore },
                { which: SET_USER_SCORE_MESSAGE, data: newScore }, 
                { which: UPDATE_STREAK, data: (newScore < 0)?1:userStreak+=1 },
                { which: SET_HIT_CARD, data: true },
                { which: UPDATE_PLAY_BUTTONS, data: { whichButton: 2, whichProperty: "buttonDisabled", data: true }},
            ]}); 

  
          break;
        }
        setTimeout(()=>{
          state.updateGameState( { newDispatches: [ 
            { which: SET_USER_SCORE_MESSAGE, data: 0 }, 
          ]});
        },1000);
      }
    }
  }
  return (
    <button 
      id={buttonString}
      className={`customButton ${bgColor}`} 
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {clickHandler(e, buttonType)}}
      disabled={buttonDisabled}
    >
      {buttonString}
    </button>
  )
}
  
export default Button;