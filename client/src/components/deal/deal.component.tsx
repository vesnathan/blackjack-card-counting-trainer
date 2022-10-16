// import './scoreBar.component.css';
import { useEffect, useState } from 'react';
import PlayingCard from "../playingCard/playingCard.component";
import PlayingCardAnimation from "../playingCardAnimation/playingCardAnimation.component";

import { useGameContext } from "../../utils/GameStateContext";

import { 
  UPDATE_PLAYER_HAND_CARDS, 
  UPDATE_PLAYER_HAND_COUNT,
  UPDATE_CARDS_DEALT,
  SET_PLAYERS_TURN,
  UPDATE_DEAL_COUNT,
  SHOW_PLAYER_TURN_ICON,
  UPDATE_PLAYER_HAND_RESULT,
  PLAYER_BUSTED,
  RESET_PLAYER_HAND,
  SET_HIT_CARD,
  SET_TABLE_MESSAGE,
  BET_AMOUNT,
  SET_USER_HAD_TURN,
  UPDATE_DEAL_HAND,
  SET_DEALER_DOWN_CARD,
  USER_DOUBLED,
  UPDATE_PLAYERS,
  UPDATE_BET_BUTTONS,
  SHOW_BET_BUTTONS,
  UPDATE_PLAY_BUTTONS,
  AWAITING_INPUT,
  UPDATE_SHOE,
  RESHUFFLE,
  UPDATE_COUNT,
  UPDATE_DEALER_CUT_CARD,
  RESET_CARDS_DEALT,
  SHOW_PLAY_BUTTONS
} from "../../utils/actions";

const Deal = (): JSX.Element => {

  const [dealing, setDealing] = useState(true);
  const state: any = useGameContext();
  const { players } = state.state;
  const { 
    shoeCards, 
    cardsDealt,
    dealerDownCardShow,
    dealCounter,
    awaitingUserInput,
    playersTurn,
    reshuffleDue,
    numDecks,
    hitCard,
    count,
    playerPosition
  } = state.state.appStatus;



  const dealCard = (dealCounter: number) => {
    // this decides what player position the card gets dealt to. dealCounter is the number of cards drealt this hand.
    // So if dealCounter is 3, and numPlayers is 2, 3%2=1, the card will be dealt to player 1
    let player = dealCounter % players.filter((obj: any) => obj.playerType !== "").length; 

    let addToCount = true;

    // if it's not the dealer, find the next seated player.
    if (player !== 0) {
      while (players[player].playerType === "") {
        player += 1;
      }
    }
    else {
      // if this is the dealer, and it's their first card, don't add to the count as the players can't yet see it
      if (players[0].hand.length === 0) {
        addToCount = false;
      }
    }
    state.updateGameState(
      { newDispatches: 
        [ 
          // push the card to the players hand
          { which: UPDATE_PLAYER_HAND_CARDS,    data: { card: shoeCards[cardsDealt], player: player } },
          // calculate players hand
          //{ which: UPDATE_PLAYER_HAND_COUNT,    data: {card: shoeCards[cardsDealt], player: player }},
          // count the number of cards dealt this shoe
          { which: UPDATE_CARDS_DEALT,  data:  { card: shoeCards[cardsDealt], addToCount: addToCount } },
        ]
      }
    );
  }

  const recalcHand = (whichPlayer: number) => {

    const newCount =  players[whichPlayer].hand.reduce((accumulator: any, card: any) => {
      return accumulator + card.points;
    }, 0);    
    return newCount;
  }

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
      { which: RESET_CARDS_DEALT },
      { which: UPDATE_COUNT, data: 0 }, 
      { which: UPDATE_DEALER_CUT_CARD, data:  (numDecks*10)-Math.floor(Math.random()*52)+26 } 
    ] } );
  }

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
          { which: AWAITING_INPUT, data: true  }
        ] } );
       

    },3000);
  }  

  
  const playersHand = (whichPlayer: number) => {
    switch (players[whichPlayer].playerType) {
      
      case "user":
        console.log(players[whichPlayer].handCount);
        let userBusted = false;
        state.updateGameState({ 
          newDispatches: [ 
            { which: AWAITING_INPUT, data: true },
            { which: SHOW_PLAY_BUTTONS, data: true },
            { which: SHOW_PLAYER_TURN_ICON, data: false },
          ] 
        });
        if (players[whichPlayer].handCount === 21) {
          if (players[whichPlayer].hand.length === 2) {
            state.updateGameState({ newDispatches: [
              { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: whichPlayer, data: "BLACKJACK!!!" } }
            ]});
          }
        }
        
        if (players[whichPlayer].handCount > 21) {
            const acesInHandWorthEleven: Array<any> = players[whichPlayer].hand.filter((card: any) => card.pip === "A" && card.points === 11);
            if (acesInHandWorthEleven.length > 0) {
              acesInHandWorthEleven[0].points = 1;
              const newTotal = recalcHand(whichPlayer);
              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_COUNT, data: { player: whichPlayer, newTotal: newTotal } }
              ]});
              if(newTotal > 21) {
                userBusted = true;
              }
            }
            else {
              userBusted = true;
            }
            if (userBusted) {            
              state.updateGameState({ newDispatches: [
                { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: whichPlayer, data: "BUSTED" } },
                { which: PLAYER_BUSTED, data: { whichPlayer: whichPlayer, data: true } }
              ]});
            }
        }
      break;


      case "dealer":
        let dealerBusted = false;
        state.updateGameState( { newDispatches: [
          { which: SHOW_PLAYER_TURN_ICON, data: false }
        ]});

        if (players[0].hand.length === 2) {
          const newCount = count + players[0].hand[0].count;
          state.updateGameState({ 
            newDispatches: [ 
              { which: SET_DEALER_DOWN_CARD, data: true },
              { which: UPDATE_COUNT, data: newCount } 
            ] 
          });
        }
        if (players[0].handCount > 21) {
          const acesInHandWorthEleven: Array<any> = players[whichPlayer].hand.filter((card: any) => card.pip === "A" && card.points === 11);
          if (acesInHandWorthEleven.length > 0) {
            acesInHandWorthEleven[0].points = 1;
            const newTotal = recalcHand(0);
            state.updateGameState({ newDispatches: [
              { which: UPDATE_PLAYER_HAND_COUNT, data: { player: 0, newTotal: newTotal } }
            ]});
            if(newTotal > 21) {
              dealerBusted = true;
            }
          }
          else {
            dealerBusted = true;
          }
          if (dealerBusted) {
            state.updateGameState({ 
              newDispatches: [
                { which: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: "BUSTED" } }
              ] 
            });
          }
        }
        if (players[0].handCount === 21) {
          if (players[0].hand.length === 2) {
            state.updateGameState(
              { newDispatches: [
                { whichPlayer: UPDATE_PLAYER_HAND_RESULT, data: { whichPlayer: 0, data: "BLACKJACK!!!" } }
              ]}
            );
          }
        }
        setTimeout(() => {
          if (players[0].handCount > 16) {
            if (dealerBusted) {
              state.updateGameState({ newDispatches: [{ which: RESET_PLAYER_HAND, data:  0 }] });
            }
            //calcPayout();
            resetHand();
            state.updateGameState(
              { newDispatches: 
                [
                  { which: RESET_PLAYER_HAND, data:  0 },
                  { which: UPDATE_DEAL_HAND, data:  false }
                ] 
              }
            );
            
          }
          else { 
            // If the hand is less than 16, deal another card, then use setHitCard and useEffect to
            // call this function (playersHand) again with the same player, 
            
              state.updateGameState( 
                { newDispatches: 
                  [ 
                    { which: SET_HIT_CARD, data: true } 
                  ] 
                } 
              );
             
          }
        }, 2000);

      break;






      case "ai":
        if (whichPlayer > playerPosition ) {
          state.updateGameState( { newDispatches: [
            { which: SET_USER_HAD_TURN, data: true }
          ]});
        }
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
      
      if (players[whichPlayer].handCount > 21) {
          const acesInHandWorthEleven: Array<any> = players[whichPlayer].hand.filter((card: any) => card.pip === "A" && card.points === 11);
          
          if (acesInHandWorthEleven.length > 0) {
            acesInHandWorthEleven[0].points = 1;
            const newTotal = recalcHand(whichPlayer);
            state.updateGameState({ newDispatches: [
              { which: UPDATE_PLAYER_HAND_COUNT, data: { player: whichPlayer, newTotal: newTotal } }
            ]});
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
     
      
      setTimeout(()=>{
       
        if (players[whichPlayer].handCount > 16) {
            
          if (playerBusted) {             
            state.updateGameState({ newDispatches: [
              { which: RESET_PLAYER_HAND, data: whichPlayer }
            ]});
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
        else {  
                   
            state.updateGameState({ newDispatches: [
              { which: SET_HIT_CARD, data: true }
            ]});
        }
      },2000);
      break;





      default:
    
        whichPlayer+=1;
        // player 5 is the last player, so if it's 6 then it's the dealers turn
        if (whichPlayer === 6) { whichPlayer = 0; }
        // set the playersTurn state var, then the useEffect will trigger this function again
        state.updateGameState({ newDispatches: [
          { which: SET_PLAYERS_TURN, data: whichPlayer }
        ]});
      break;

    }
  }

  const dealACard = (whichPlayer: number) => {
    state.updateGameState({ newDispatches: [
      { which: UPDATE_PLAYER_HAND_CARDS,  data: { player: whichPlayer, card: shoeCards[cardsDealt] } },
      { which: UPDATE_CARDS_DEALT,  data:  { card: shoeCards[cardsDealt], addToCount: true } }
    ]}); 
  }

  useEffect(()=>{
    if (!awaitingUserInput && !dealing){
      playersHand(playersTurn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[playersTurn]);



  useEffect( ()=>{
    if(hitCard){
      state.updateGameState( { newDispatches: [ { which: SET_HIT_CARD, data: false } ] } );
      const asyncFunction = async () => {
        await dealACard(playersTurn);
        playersHand(playersTurn);
      }
      asyncFunction();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[hitCard]);



  useEffect(() => {

    // if cards dealt is less than or equal to the number of players x 2 
    if (dealCounter <= players.filter((obj: any) => obj.playerType !== "").length*2) { 

      // if it's equal to, the deal is finished
      if (dealCounter === players.filter((obj: any) => obj.playerType !== "").length*2) {       
        state.updateGameState({ newDispatches: [{ which: UPDATE_DEAL_COUNT }]});
        setDealing(false);
        setTimeout(()=> {
          state.updateGameState( { newDispatches: [ { which: SET_PLAYERS_TURN, data: 1 } ] } );
        }, 3000);
      }
      else {
        // this timer creates a delay between the card deals
        const timer1 = setTimeout(() => { 

          // add 1 to the number of cards dealt this hand
          state.updateGameState({ newDispatches: [{ which: UPDATE_DEAL_COUNT}]});

          // deal a card, the +1 is to make it start with player 1, not the dealer (player0)
          dealCard(dealCounter+1);

        }, 505);
        return () => {
          clearTimeout(timer1);
        };
      }
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