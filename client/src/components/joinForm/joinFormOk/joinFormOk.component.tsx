import React from 'react';
import './joinFormOk.component.css';

import { useGameContext } from "../../../utils/GameStateContext";

// Material UI Components
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';


import { 
  SHOW_PICK_SPOT,
  SHOW_JOIN_FORM_OK,
  SHOW_POPUP
} from "../../../utils/actions";

const JoinFormOk = (): React.ReactElement  => {

  const state: any = useGameContext();

  const { 
    showJoinFormOkMessage,
  } = state.state.appStatus;

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_PICK_SPOT,     data: true },
          { which: SHOW_POPUP,         data: false },
          { which: SHOW_JOIN_FORM_OK,  data: false },
       ]
      }
    );
  }
  
  return (
    <div className="popupForm">
      <FormGroup className="marginBottom">
      {showJoinFormOkMessage}
        <Grid container  sx={{mt: 2}} >
          <Grid item sm={6} container justifyContent="right">
            <Button 
              id="joinButton" 
              variant="contained" 
              color="primary" 
              sx={{width: "90%"}} 
              onClick={(e) => { handleSubmit(e)}}>
                OK
              </Button>
          </Grid>
        </Grid>
      </FormGroup>
    </div>
  )
}

export default JoinFormOk;