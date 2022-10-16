import Dealer from "../assets/images/characters/dealer.png";

export const APP_STATUS = () => {
  const appStatusArray: any = {
    firstVisit: true, // cookie not found
    dealerDownCardShow: false,
    showPopup: false,
    popupMessage: "",
    popupTitle: "WELCOME",
    welcomeMessageFinished: false,
    popupCharacter: Dealer,
    chipsTotal: 0,
    scoreTotal: 0,
    count: 0,
    betAmount: [0,0,0],
    playerPosition: 3,
    showPlayerTurnIcon: false,
    cardsDealt: 0,
    dealerCutCard: (80)-Math.floor(Math.random()*52)+26, 
    showJoinForm: false,
    showJoinFormOk: false,
    showJoinFormButtonSpinner: false,
    showJoinFormOkMessage: "",
    showJoinFormOkStatus: "",
    showLoginFormButtonSpinner: false,
    showLoginForm: false,
    showLoginFormStatus: "false",
    loginFormMessage: "",
    showPickSpot: false,
    joinButtonText: "JOIN",
    loginButtonText: "OR LOGIN",
    dealHand: false,
    playButtonsShow: false,
    betButtonsShow: false,
    shoeCards: [],
    autoPlay: false,
    userDoubled: false,
    userScoreMessage: 0,
    userStreak: 1,
    userHadTurn: false,
    gameLevel: 1,
    reshuffleDue: false,
    tableMessage: "",
    loggedIn: false,
    awaitingUserInput: true,
    dealCounter: 0,
    playersTurn: 0,
    hitCard: false,
    userHitCard: false,
  }

  return appStatusArray;
}