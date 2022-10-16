import React from 'react';
import { useGameContext } from "../../utils/GameStateContext";
import './swiper.component.css';
import SwiperButton from "../swiperButton/swiperButton.component";
import StrategyCard from "../strategyCard/strategyCard.component";
import { useState } from "react";

import { UPDATE_SCORE } from "../../utils/actions";

type AppProps = {
  buttonString: string;
  buttonPosition: string;
  swiperStatus: string;
  swiperType: string;
};
const Swiper = ({ buttonString, buttonPosition, swiperStatus, swiperType }: AppProps): JSX.Element => {

  const state: any = useGameContext();
  // @ts-ignore
  const { userHadTurn, userStreak, scoreTotal } = state.state.appStatus;
  const [swipperOpen, setSwipperOpen] = useState(false);

  const swipperButtonHandler = (buttonName: string) => {
    if (!swipperOpen) {
      if (buttonName === "STRATEGY" && !userHadTurn) {
        let newScore = scoreTotal - (userStreak*20);
        state.updateGameState({ newDispatches: [{ which: UPDATE_SCORE, data: newScore }]});
      } 
      setSwipperOpen(true);
    }
    else {
      setSwipperOpen(false);
    }
  }
  return (
    <div className={`swiper ${swiperStatus}`}>
      {
        swiperType === "strategy" &&
        <StrategyCard />
      }
      {
        swiperType === "settings" &&
        <div>
          8 Decks<br />
          Double on hard 9, 10, 11<br />
          Dealer stands on soft 17 (S17)<br />
          Split to 3 hands<br />
          Aces split to 2 hands<br />
          One card only on split aces<br />
          Double after split (DAS)<br />
          Blackjack pays 3:2<br />
          Insurance pays 2:1<br />
          Dealer blackjack takes Original and Busted Bets Only (OBBO)<br />
        </div>
      }
      
      <SwiperButton buttonString={buttonString} buttonPosition={buttonPosition} swipperButtonHandler={swipperButtonHandler}/>
    </div>
  )
}
export default Swiper;