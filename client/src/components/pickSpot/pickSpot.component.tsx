import { useGameContext } from "../../utils/GameStateContext";
import './pickSpot.component.css';

import {
  UPDATE_POSITION,
  SHOW_BET_BUTTONS,
  SHOW_PICK_SPOT,
  UPDATE_USER_TYPE
} from "../../utils/actions";

const PickSpot = (): JSX.Element => {

  const state: any = useGameContext();

  const { 
    players
  } = state.state;

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    // @ts-ignore
    const whichSpot = parseInt(e.target.id);

    state.updateGameState(
      { newDispatches: 
        [ 
          { which: UPDATE_POSITION,  data: whichSpot },
          { which: SHOW_BET_BUTTONS, data: true },
          { which: SHOW_PICK_SPOT,   data: false },
          { which: UPDATE_USER_TYPE, data: {whichPlayer: whichSpot, playerType: "user" } },
       ]
      }
    );   
  }

  return (
    <>
    <div className="spot" id="5" style={{top: players[1].position[1]+2+"%", left: players[1].position[0]-5+"%"}} onClick={(e) => {clickHandler(e)}}>PICK SPOT</div>
    <div className="spot" id="4" style={{top: players[2].position[1]+2+"%", left: players[2].position[0]-5+"%"}} onClick={(e) => {clickHandler(e)}}>PICK SPOT</div>
    <div className="spot" id="3" style={{top: players[3].position[1]+2+"%", left: players[3].position[0]-5+"%"}} onClick={(e) => {clickHandler(e)}}>PICK SPOT</div>
    <div className="spot" id="2" style={{top: players[4].position[1]+2+"%", left: players[4].position[0]-5+"%"}} onClick={(e) => {clickHandler(e)}}>PICK SPOT</div>
    <div className="spot" id="1" style={{top: players[5].position[1]+2+"%", left: players[5].position[0]-5+"%"}} onClick={(e) => {clickHandler(e)}}>PICK SPOT</div>
    </>
  )
}
 
export default PickSpot;