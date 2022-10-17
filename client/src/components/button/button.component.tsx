import './button.component.css';

import { useGameContext } from "../../utils/GameStateContext";
import { STRATEGY_HARD, STRATEGY_SOFT, STRATEGY_PAIRS } from "../../consts/strategyCard";

import { 
  SHOW_BET_BUTTONS,
  UPDATE_DEAL_HAND,
  AWAITING_INPUT,
  UPDATE_CHIPS,
  BET_AMOUNT,
  UPDATE_BET_BUTTONS,
  SET_HIT_CARD,
  SET_USER_HIT_CARD,
  SHOW_PLAY_BUTTONS,
  UPDATE_SCORE,
  UPDATE_STREAK,
  SET_USER_SCORE_MESSAGE,
  UPDATE_PLAY_BUTTONS,
  USER_DOUBLED,
  SET_PLAYERS_TURN,
  SHOW_STRIPE_FORM
} from "../../utils/actions";




type ButtonProps = {
  buttonString: string;
  bgColor: string;
  buttonDisabled: boolean;
  buttonType: string;
};



const Button = ({ buttonString, bgColor, buttonDisabled, buttonType }: ButtonProps): JSX.Element =>  {
  
  const state: any = useGameContext();
  let { betAmount, chipsTotal, playerPosition, userStreak, scoreTotal } = state.state.appStatus;
  const { players } = state.state;

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement>, buttonType: string ) => {
    if (buttonType === "betButton") { 
      switch ((e.target as HTMLElement).id) {
        case "5":
          betAmount[0] += 1;
          chipsTotal -= 5;
          break;      
        case "25":
          betAmount[1] += 1;
          chipsTotal -= 25;
          break;      
        case "50":
          betAmount[2] += 1;
          chipsTotal -= 50;
          break;     
        case "DEAL":
          state.updateGameState(
            { newDispatches: 
              [ 
                { which: AWAITING_INPUT,  data: false },
                { which: UPDATE_DEAL_HAND,  data: true },
                { which: SHOW_BET_BUTTONS,  data: false }
              ]
            }
          ); 
          break;
      }
      state.updateGameState(
        { newDispatches: 
          [ 
            { which: UPDATE_CHIPS,  data: chipsTotal },
            { which: BET_AMOUNT,  data: [betAmount[0],betAmount[1],betAmount[2]] },
            { which: UPDATE_BET_BUTTONS,  data: {whichButton: 3, whichProperty: "buttonDisabled", data: false } },
          ]
        }
      ); 
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
        const dealerUpCard = players[0].hand[1]?.points;
        const playerHand = players[playerPosition];
        let strategyButtonName = "";
        const acesInHandWorthEleven: Array<any> = players[playerPosition].hand.filter((card: any) => card.pip === "A" && card.points === 11);
        let playerHandRow: Array<string> = [];
        console.log("playerHand in buttons",playerHand);
        // soft hand, the -4 adjusts for the fact that the array starts at 4
        if (acesInHandWorthEleven.length > 0) {
          playerHandRow = STRATEGY_SOFT[playerHand.handCount-14];
        }
        else {
          playerHandRow = STRATEGY_HARD[playerHand.handCount-4];
        }

        const dealerCol = dealerUpCard-2;
        const strategy = playerHandRow[dealerCol];
        switch (strategy) {
          case "H":
            strategyButtonName = "HIT";
          break;
          case "D":
            strategyButtonName = "DOUBLE";
          break;
          case "S":
            strategyButtonName = "STAND";
          break;
          case "SP":
            strategyButtonName = "SPLIT";
          break;
        }
        
        
        let newScore = 0;

        switch (whichButton) {
          case "HIT":
            if (strategyButtonName === "HIT") {
              newScore = 10*userStreak;
            }
            else {
              newScore = -5*userStreak;
            }
            state.updateGameState( { newDispatches: [ 
              { which: SET_HIT_CARD, data: true }, 
              { which: SET_USER_HIT_CARD, data: true }, 
              { which: SHOW_PLAY_BUTTONS, data: false }, 
              { which: UPDATE_SCORE, data: scoreTotal+newScore }, 
              { which: SET_USER_SCORE_MESSAGE, data: newScore }, 
              { which: UPDATE_STREAK, data: (newScore < 0)?1:userStreak+=1  },
              { which: AWAITING_INPUT, data: false } 
            ] } );
  ;
          break;
          case "STAND":
            if (strategyButtonName === "STAND") {
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
              { which: AWAITING_INPUT, data: false } 
            ]}); 


          break;
          case "SPLIT":
            if (strategyButtonName === "SPLIT") {
              newScore = 10*userStreak;
            }
            else {
              newScore = -5*userStreak;
            }

            /*
            setPlayersTurn(appStatus.playerPosition+1);
            setAppStatus((prevState: Object) => ({ ...prevState, 
              playButtonsShow: false, 
              scoreTotal: appStatus.scoreTotal+newScore, 
              userScoreMessage: newScore, 
              userStreak: (newScore < 0)?1:appStatus.userStreak+=1  }));
            setAwaitingUserInput(false);
            */
          break;
          case "DOUBLE":
            if (strategyButtonName === "DOUBLE") {
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
                { which: SET_USER_HIT_CARD, data: true },
                { which: SET_HIT_CARD, data: true },
                { which: AWAITING_INPUT, data: false }, 
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