import './buttonBar.component.css';
import { useEffect } from 'react';
import { useGameContext } from "../../utils/GameStateContext";

// Material UI Components
import Grid from '@mui/material/Grid';

// Custom Components
import Button from "../button/button.component";

import { 
  SHOW_BET_BUTTONS,
  UPDATE_DEAL_HAND,
  UPDATE_CHIPS,
  BET_AMOUNT
} from "../../utils/actions";

interface ButtonObject {
  name: string,
  bgColor: string,
  buttonDisabled: boolean,
  type: string;
}
type ButtonBarProps = {
  buttons: Array<any>;
};

const ButtonBar = ({ buttons }: ButtonBarProps): React.ReactElement  => {

  const state: any = useGameContext();
  const { betAmount, autoBet, autoBetAmount } = state.state.appStatus;

  useEffect(()=>{
    if (autoBet ) {
      setTimeout(()=>{
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: UPDATE_DEAL_HAND,  data: true },
              { which: SHOW_BET_BUTTONS,  data: false },
              { which: UPDATE_CHIPS,  data: -((betAmount[0]*5)+(betAmount[1]*25)+(betAmount[2]*50)) },
              { which: BET_AMOUNT,  data: autoBetAmount }
            ]
          }
        );
      },1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const localBetAmount = (betAmount[0]*5)+(betAmount[1]*25)+(betAmount[2]*50);
  console.log("localBetAmount",localBetAmount);
  let buttonArray: React.ReactElement[] = [];
  buttons.forEach((button: ButtonObject) => {
    buttonArray.push(
    <Button 
      key={button.name} 
      buttonType={button.type} //"betButton"
      buttonString={button.name} 
      bgColor={
        ( autoBet && ((autoBetAmount[0]*5)+(autoBetAmount[1]*25)+(autoBetAmount[2]*50) > 0) && button.name === "AUTO" )
        ? "bg-color-0a"
        : button.bgColor
      } 
      
      buttonDisabled={
        ((localBetAmount > 0) && button.type === "betButton" && button.name === "DEAL")
        ? false
        : button.buttonDisabled
      } 
    />);
  });
  return (
    <Grid  container justifyContent="center">
      <div className="buttonBar" >
        {buttonArray}
      </div>
    </Grid>
  );
}

export default ButtonBar;