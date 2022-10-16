// @ts-nocheck
import './chipStack.component.css';

import { useGameContext } from "../../utils/GameStateContext";

import FiveStack from "./fiveStack/fiveStack.component";
import TwentyFiveStack from "./twentyFiveStack/twentyFiveStack.component";
import FiftyStack from "./fiftyStack/fiftyStack.component";


const ChipStack = (): JSX.Element =>  {

  const state: any = useGameContext();
  const { betAmount, playerPosition } = state.state.appStatus;
  
  const { players } = state.state;

  return (
    <div 
      className="chipStackHolder" 
      style={{
        right: (players[playerPosition].position[0]-3)+"%", 
        top: (players[playerPosition].position[1]+18)+"%"
      }}>
      <div className="fiveStack">
        <FiveStack betAmount={betAmount[0]}/>
      </div>
      <div className="twentyFiveStack">
        <TwentyFiveStack betAmount={betAmount[1]}/>
      </div>
      <div className="fiftyStack">
        <FiftyStack betAmount={betAmount[2]}/>
      </div>
    </div>
  )
}
  
export default ChipStack;