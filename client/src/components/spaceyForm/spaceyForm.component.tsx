import React, { useState } from 'react'
import { useGameContext } from "../../utils/GameStateContext";
import "./spaceyForm.component.css";
// Material UI Components
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { 
  SHOW_SPACEY_FORM_BUTTON_SPINNER,
  SHOW_POPUP,
  SHOW_SPACEY_FORM,
  SHOW_COUNT,
  SPACEY_FORM_MESSAGE,
  UPDATE_SCORE,
  SHOW_PLAY_BUTTONS
} from "../../utils/actions";

const SpaceyForm = () => {

  const state: any = useGameContext();

  const { 
    showSpaceyFormButtonSpinner,
    spaceyFormMessage,
    count,
    scoreTotal
  } = state.state.appStatus;

  const [inputCount, setInputCount] = useState<number>();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var regex = /[0-9]|\./;
    if( !regex.test(e.target.value) ) {
      e.target.value = "";
    }
    else {
      setInputCount(parseInt(e.target.value));
    }
  }
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputCount !== undefined) {
      state.updateGameState({ newDispatches: [{ which: SHOW_SPACEY_FORM_BUTTON_SPINNER,  data: true }]}); 
      if (count === inputCount) {
        state.updateGameState({ newDispatches: [
          { which: SPACEY_FORM_MESSAGE, data: "That's correct! Have 1000 points!" },
          { which: UPDATE_SCORE,        data: scoreTotal + 1000 },
        ]});
        setTimeout(()=>{
          state.updateGameState({ newDispatches: [
            { which: SHOW_SPACEY_FORM_BUTTON_SPINNER,   data: false },
            { which: SHOW_POPUP,                        data: false },
            { which: SHOW_SPACEY_FORM,                  data: false },
            { which: SHOW_PLAY_BUTTONS,                 data: true }, 
            { which: SPACEY_FORM_MESSAGE,               data: "" },
          ]});
        },2000);
      }
      else {
        console.log("guess incorrect");
        // @ts-ignore
        const countUserInputed: number = parseInt(inputCount);
        const scoreAdjustment = 
          (count - countUserInputed > -1)
            ? -(count - countUserInputed)*100
            : (count - countUserInputed)*100;
        
        console.log("countUserInputed", countUserInputed);
        console.log("scoreAdjustment", scoreAdjustment);
        console.log("score", scoreTotal);
        console.log("score - scoreAdjustment", scoreTotal - scoreAdjustment);

        state.updateGameState({ newDispatches: [
          { which: SHOW_SPACEY_FORM_BUTTON_SPINNER,   data: false },
          { which: SPACEY_FORM_MESSAGE,               data: `

Not correct, Kevin is unhappy...
You lose ${(scoreAdjustment > -1)?scoreAdjustment:-scoreAdjustment} points.

` }, 
          { which: UPDATE_SCORE,                      data: scoreTotal + scoreAdjustment },
        ]}); 
        setTimeout(()=>{
          state.updateGameState({ newDispatches: [
            { which: SHOW_SPACEY_FORM_BUTTON_SPINNER,   data: false },
            { which: SHOW_POPUP,                        data: false },
            { which: SHOW_SPACEY_FORM,                  data: false },
            { which: SHOW_PLAY_BUTTONS,                 data: true }, 
            { which: SPACEY_FORM_MESSAGE,               data: "" },
          ]});
        },2000);       
      } 
      
      
      state.updateGameState({ newDispatches: [
        { which: SHOW_COUNT,   data: true },
      ]});   
    }
    else {
      console.log("guess no input");
      state.updateGameState({ newDispatches: [
        { which: SPACEY_FORM_MESSAGE, data: "There's no getting out of this..." }, 
      ]});  
    }   
  }
  return (
    <>
      <div className="popupForm">
        <FormGroup className="marginBottom">
          <input type="tel" id="count-Input" name="count" placeholder="Count:" value={inputCount} onChange={handleChange}/> 
          <Grid container  sx={{mt: 2}} >
            <Grid item sm={6} container justifyContent="left">
            <Button id="guessButton" variant="contained" color="primary" sx={{width: "90%", height: "40px"}} onClick={(e) => {handleSubmit(e)}}>
                  {
                    (showSpaceyFormButtonSpinner)
                    ? <CircularProgress color="info" size={12}/>
                    : "GUESS"
                  }
                </Button>
            </Grid>
          </Grid>
        </FormGroup>
      </div>
      <div className="spaceyFormMessage">{spaceyFormMessage}</div>
    </>
  )
}

export default SpaceyForm;