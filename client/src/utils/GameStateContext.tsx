import React, { useContext, useReducer } from 'react';
// import Dealer from "./assets/images/characters/dealer.png";
import { APP_STATUS }  from "../consts/appStatus";
import { PLAY_BUTTONS }  from "../consts/playButtons";
import { GAME_RULES }  from "../consts/gameRules";
import { PLAYERS }  from "../consts/players";
import { BET_BUTTONS } from "../consts/betButtons";

function reducer(state: any, action: any) {
  let tempStatus = state.appStatus;
  let tempPlayers = state.players;
  let tempBetButtons = state.betButtons;
  let tempPlayButtons = state.playButtons;

    switch (action.type) {
      case "updatePopupTitle" : 
        tempStatus.popupTitle = action.payload;
        return { ...state, appStatus: tempStatus }

      case "updateAutoBet" : 
        tempStatus.autoBet = action.payload;
        return { ...state, appStatus: tempStatus }

      case "setAutoBetAmount" : 
        tempStatus.autoBetAmount = action.payload;
        return { ...state, appStatus: tempStatus }

      case "updateScore" :

        tempStatus.scoreTotal = action.payload;
        return { ...state, appStatus: tempStatus }

      case "updateChips" :
        tempStatus.chipsTotal = tempStatus.chipsTotal + action.payload;
        return { ...state, appStatus: tempStatus }

      case "updatePosition" :
        tempStatus.playerPosition = action.payload;
        return { ...state, appStatus: tempStatus }

      case "updateStreak" :
        tempStatus.userStreak = action.payload;
        return { ...state, appStatus: tempStatus }

      case "updateLevel" :
        tempStatus.gameLevel = action.payload;
        return { ...state, appStatus: tempStatus }

      case "showPickSpot" :
        tempStatus.showPickSpot = action.payload;
        return { ...state, appStatus: tempStatus }

      case "showBetButtons" :
        tempStatus.betButtonsShow = action.payload;
        return { ...state, appStatus: tempStatus }

      case "betAmount" :
        tempStatus.betAmount = action.payload;
        return { ...state, appStatus: tempStatus }

      case "showPopup" :  
        tempStatus.showPopup = action.payload;
          return { ...state, appStatus: tempStatus }

      case "popupMessage" :
        tempStatus.popupMessage = action.payload;
          return { ...state, appStatus: tempStatus }

      case "updateDealHand" :
        tempStatus.dealHand = action.payload;
          return { ...state, appStatus: tempStatus }

      case "showJoinForm" :
        tempStatus.showJoinForm = action.payload;
          return { ...state, appStatus: tempStatus }

      case "showJoinFormOk" :
        tempStatus.showJoinFormOk = action.payload;
          return { ...state, appStatus: tempStatus }
          
      case "showJoinFormOkMessage" :
        tempStatus.showJoinFormOkMessage = action.payload;
          return { ...state, appStatus: tempStatus }
      
      case "showJoinFormOkStatus" :
        tempStatus.showJoinFormOkStatus = action.payload;
          return { ...state, appStatus: tempStatus }

      case "showJoinFormButtonSpinner" :
        tempStatus.showJoinFormButtonSpinner = action.payload;
          return { ...state, appStatus: tempStatus }

      case "showLoginFormButtonSpinner" :
        tempStatus.showLoginFormButtonSpinner = action.payload;
          return { ...state, appStatus: tempStatus }

      case "showSpaceyFormButtonSpinner" :
        tempStatus.showSpaceyFormButtonSpinner = action.payload;
          return { ...state, appStatus: tempStatus }
          
      case "showSpaceyForm" :
        tempStatus.showSpaceyForm = action.payload;
          return { ...state, appStatus: tempStatus }

      case "showLoginForm" :
        tempStatus.showLoginForm = action.payload;
          return { ...state, appStatus: tempStatus }
      
      case "joinButtonText" :
        tempStatus.joinButtonText = action.payload;
          return { ...state, appStatus: tempStatus }

      case "loginButtonText" :
        tempStatus.loginButtonText = action.payload;
          return { ...state, appStatus: tempStatus }

      case "loginFormMessage" :
        tempStatus.loginFormMessage = action.payload;
          return { ...state, appStatus: tempStatus }

      case "loginFormStatus" :
        tempStatus.loginFormStatus = action.payload;
          return { ...state, appStatus: tempStatus }

      case "loggedIn" :
        tempStatus.loggedIn = action.payload;
          return { ...state, appStatus: tempStatus }
      
      case "updateShoe" :
        tempStatus.shoeCards = action.payload;
          return { ...state, appStatus: tempStatus }

      case "dealCounter" :
        tempStatus.dealCounter += 1;
          return { ...state, appStatus: tempStatus }

      case "updateCardsDealt" :
        tempStatus.cardsDealt += 1;
        if (action.payload.addToCount) {
          tempStatus.count += action.payload.card.count;
        }
        return { ...state, appStatus: tempStatus }

      case "resetCardsDealt" :
        tempStatus.cardsDealt = 0;
        return { ...state, appStatus: tempStatus }

        
      case "resetDealCounter" :
        tempStatus.dealCounter = 0;
        return { ...state, appStatus: tempStatus }

      case "setPlayersTurn" :
        tempStatus.playersTurn = action.payload;
        return { ...state, appStatus: tempStatus }

      case "showPlayerTurnIcon":
        tempStatus.showPlayerTurnIcon = action.payload;
        return { ...state, appStatus: tempStatus }

      case "setUserHadTurn":
        tempStatus.userHadTurn = action.payload;
        return { ...state, appStatus: tempStatus }
      
        case "userDoubled":
          tempStatus.userDoubled = action.payload;
          return { ...state, appStatus: tempStatus }

      case "setHitCard" :
        tempStatus.hitCard = action.payload;
        return { ...state, appStatus: tempStatus }

      case "setDealerDownCard" :
        tempStatus.dealerDownCardShow = action.payload;
        return { ...state, appStatus: tempStatus }

      case "updateCount" :
        tempStatus.dealerDownCardShow = action.payload;
        return { ...state, appStatus: tempStatus }

      case "setTableMessage" :
        tempStatus.setTableMessage = action.payload;
        return { ...state, appStatus: tempStatus }
      
      case "reshuffle" :
        tempStatus.reshuffleDue = action.payload;
        return { ...state, appStatus: tempStatus }

      case "showPlayButtons":
        tempStatus.playButtonsShow = action.payload;
        return { ...state, appStatus: tempStatus }

      case "userHitCard":
        tempStatus.userHitCard = action.payload;
        return { ...state, appStatus: tempStatus }

      case "userScoreMessage":
        tempStatus.userScoreMessage = action.payload;
        return { ...state, appStatus: tempStatus }

      case "showStripeForm":
        tempStatus.showStripeForm = action.payload;
        return { ...state, appStatus: tempStatus }

      case "setOnlineStatus":
        tempStatus.onlineStatus = action.payload;
        return { ...state, appStatus: tempStatus }
      
      case "popupCharacter":
        tempStatus.popupCharacter = action.payload;
        return { ...state, appStatus: tempStatus }
      
      case "showWhatCountForm":
        tempStatus.showWhatCountForm = action.payload;
        return { ...state, appStatus: tempStatus }

      case "showCount":
        tempStatus.showCount = action.payload;
        return { ...state, appStatus: tempStatus }

      case "spaceyFormMessage":
        tempStatus.spaceyFormMessage = action.payload;
        return { ...state, appStatus: tempStatus }

      case "setSessionData":
        tempStatus.sessionData = action.payload;
        return { ...state, appStatus: tempStatus }

      case "updatePlayerHandNumber":
        tempStatus.playerHandNumber = action.payload;
        return { ...state, appStatus: tempStatus }
        


      case "updatePlayerHandResult" :
        tempPlayers[action.payload.whichPlayer].playerHandResult = action.payload.data;
          return { ...state, players: tempPlayers }

      case "resetPlayerHand" :
        tempPlayers[action.payload.playersTurn].hand[action.payload.playerHandNumber] = [];
          return { ...state, players: tempPlayers }

      case "userType" :
        tempPlayers[action.payload.whichPlayer].playerType = action.payload.playerType;
          return { ...state, players: tempPlayers }

      case "updatePlayerHandCards" :
        if (action.payload.playerHandNumber > tempPlayers[action.payload.playerNumber].hand.length - 1) { 
          tempPlayers[action.payload.playerNumber].hand.push([]);
        }
        tempPlayers[action.payload.playerNumber].hand[action.payload.playerHandNumber].push(action.payload.card);
        return { ...state, players: tempPlayers }

      case "splitCards":
        // get the second card and remove from hand 1 and update hand 1 count
        const secondCard = tempPlayers[action.payload.playerNumber].hand[action.payload.playerHandNumber].pop();
        tempPlayers[action.payload.playerNumber].hand.push([secondCard]);
        tempPlayers[action.payload.playerNumber].handCount[action.payload.playerHandNumber] = parseInt(secondCard.points);
        tempPlayers[action.payload.playerNumber].handCount[action.payload.playerHandNumber+1] = parseInt(secondCard.points);
        return { ...state, players: tempPlayers }

      case "updatePlayerHandCount" :        
        if (action.payload.playerHandNumber > tempPlayers[action.payload.playerNumber].hand.length - 1) { 
          tempPlayers[action.payload.playerNumber].handCount.push(0);
        }
        tempPlayers[action.payload.playerNumber].handCount[action.payload.playerHandNumber] = parseInt(tempPlayers[action.payload.playerNumber].handCount[action.payload.playerHandNumber]) + parseInt(action.payload.card.points);
        return { ...state, players: tempPlayers }

      case "updatePlayers" :
        tempPlayers = action.payload;
          return { ...state, players: tempPlayers }

      case "playerBusted" :
        tempPlayers[action.payload.whichPlayer].busted = action.payload.data;
        return { ...state, players: tempPlayers }

      case "overwritePlayersHand" :
        tempPlayers[action.payload.whichPlayer].hand[action.payload.data.playerHandNumber] = action.payload.data.hand;
        tempPlayers[action.payload.whichPlayer].handCount[action.payload.data.playerHandNumber] = action.payload.data.handCount;
        return { ...state, players: tempPlayers }



      case "updateBetButtons" :
        tempBetButtons[action.payload.whichButton][action.payload.whichProperty] = action.payload.data;
        return { ...state, betButtons: tempBetButtons }


        


      case "updatePlayButtons":
        tempPlayButtons[action.payload.whichButton][action.payload.whichProperty] = action.payload.data;
        return { ...state, betButtons: tempBetButtons }

      case "gameRules" :
        return state;



      default:
        return state;
    }   
  }

// @ts-ignore
export const GameStateContext = React.createContext();

export const useGameState = () => useContext(GameStateContext);

export function useGameContext() {
  return useContext(GameStateContext);
}

interface thisDispatchType {
  data: Object;
  which: String;
}
const GameStateProvider = (props: any) => {

  const[state, dispatch] = useReducer(reducer, { 
    appStatus: APP_STATUS(),
    players: PLAYERS(),
    gameRules: GAME_RULES(),
    betButtons: BET_BUTTONS(),
    playButtons: PLAY_BUTTONS()
  })

  const updateGameState = (newDispatches: any) => {
    newDispatches.newDispatches.forEach((thisDispatch: thisDispatchType) => {
      dispatch({ type: thisDispatch.which, payload: thisDispatch.data });
    })
    
  }
  
  return (
    <GameStateContext.Provider value={{ state, updateGameState }} {...props} />
  )
}

export default GameStateProvider;