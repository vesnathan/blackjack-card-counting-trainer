import React from 'react';
import './scoreBar.component.css';
import OnlineIcon from "../onlineIcon/onlineIcon.component";
import { useGameContext } from "../../utils/GameStateContext";

import { 
  LOGGED_IN,
  SHOW_POPUP,
  SHOW_LOGIN_FORM,
  SHOW_PICK_SPOT
} from "../../utils/actions";

const ScoreBar = (): JSX.Element => {
  // TODO: Fix the use of "any" type below
  const state: any = useGameContext();
  const { 
    count, 
    scoreTotal, 
    chipsTotal, 
    userStreak, 
    loggedIn, 
    onlineStatus,
    showCount 
  } = state.state.appStatus;

  const logoutClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: LOGGED_IN,       data: false },
          { which: SHOW_POPUP,      data: true  },
          { which: SHOW_PICK_SPOT,  data: false },
          { which: SHOW_LOGIN_FORM, data: true  },
        ]
      }
    ); 
  }

  return (

    <div className={`scoreBar mainscoreBarContainer`}>
      <>
        <button id="buttonInstall" >install</button>
        {
          (loggedIn)? 
            <button id="buttonLogout" onClick={(e) => { logoutClickHandler(e) }}>LOGOUT</button>
          : null
        }
        {
          (onlineStatus)? 
            <OnlineIcon />
          : null
        }
        {
          showCount?
          <span id="countSpan">COUNT: {count}</span>
          : null
        }
        
        <span id="scoreSpan">SCORE: {scoreTotal}</span>
        <span id="chipsSpan">CHIPS: {chipsTotal}</span>
        <span id="chipsSpan">STREAK: {userStreak-1}</span>
      </>
    </div>

  )
}
  
export default ScoreBar;