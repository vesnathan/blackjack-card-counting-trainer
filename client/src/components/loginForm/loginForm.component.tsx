import React from 'react';
import { useState } from 'react';
import { useGameContext } from "../../utils/GameStateContext";

import './loginForm.component.css';
import Auth from '../../utils/auth';

// Material UI Components
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { 
  SHOW_JOIN_FORM,
  SHOW_LOGIN_FORM,
  JOIN_BUTTON_TEXT,
  LOGIN_BUTTON_TEXT,
  SHOW_LOGIN_FORM_BUTTON_SPINNER,
  LOGIN_FORM_MESSAGE,
  LOGIN_FORM_STATUS,
  LOGGED_IN,
  SHOW_PICK_SPOT
} from "../../utils/actions";

import { useMutation } from '@apollo/client';
import{ LOGIN_USER } from  "../../storage/mongoDB/mutations";

import { 
  SHOW_POPUP
} from "../../utils/actions";

const LoginForm = (): React.ReactElement  => {

  const state: any = useGameContext();

  const [loginUser] = useMutation(LOGIN_USER);

  const { 
    joinButtonText, 
    loginButtonText,
    showLoginFormButtonSpinner,
    loginFormMessage
  } = state.state.appStatus;
  
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.id.split("-");
    switch (name[0]) {
      case "username":
        setUsernameError("");
        break;
      case "password":
        setPasswordError("");
        break; 
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_LOGIN_FORM_BUTTON_SPINNER,  data: true },
        ]
      }
    );  
    let continueProcessingForm = true;
    if (!inputs.username) { setUsernameError("Please enter a user name."); continueProcessingForm = false;  }
    if (!inputs.password) { setPasswordError("Please enter a password"); continueProcessingForm = false;  }
    
    if (continueProcessingForm) {
      try {
        const response = await loginUser({
          variables: { 
            password: inputs.password,
            username: inputs.username,
          }
        });
        if (!response.data.loginUser.username) {
          throw new Error('something went wrong!');
        }
        else {
          Auth.login(response.data.loginUser.token);
          state.updateGameState(
            { newDispatches: 
              [ 
                { which: SHOW_POPUP, data: false },
                { which: LOGGED_IN, data: true },
                { which: SHOW_PICK_SPOT, data: true },
             ]
            }
          );    
        }
      } catch (err: any) {
        state.updateGameState(
          { newDispatches: 
            [ 
              { which: LOGIN_FORM_MESSAGE, data: `ERROR 394.215: LOGIN FAILED` },
              { which: LOGIN_FORM_STATUS,  data: "error" },
              { which: SHOW_LOGIN_FORM,    data: true },
            ]
          }
        );   
      }
    }
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_LOGIN_FORM_BUTTON_SPINNER,  data: false },
        ]
      }
    ); 
  }

  const showJoinFormFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_JOIN_FORM,  data: true },
          { which: SHOW_LOGIN_FORM,  data: false },
          { which: JOIN_BUTTON_TEXT,  data: "JOIN" },
          { which: LOGIN_BUTTON_TEXT,  data: "OR LOG IN" },
        ]
      }
    );  
  }
  
  return (
    <div className="popupForm">
      <FormGroup className="marginBottom">
        <input type="text" id="username-Input" name="username" placeholder="Username:" onFocus={handleFocus} onChange={handleChange}/> 
        {usernameError ? <div className="joinFormErrorWrapper"><div id="username-Error" className="joinFormError">{usernameError}</div></div> : null }
        <input type="password" id="password-Input" name="password" placeholder="Password:" onFocus={handleFocus} onChange={handleChange}/>
        {passwordError ? <div className="joinFormErrorWrapper"><div className="joinFormError">{passwordError}</div></div> : null }
        <Grid container  sx={{mt: 2}} >
          <Grid item sm={6} container justifyContent="left">
            <Button id="joinButton" variant="contained" color="primary" sx={{width: "90%"}} onClick={(e) => { showJoinFormFunction(e) }}>{joinButtonText}</Button>
          </Grid>
          <Grid item sm={6} container justifyContent="right">
            <Button id="loginButton" variant="contained" color="primary" sx={{width: "90%"}} onClick={(e) => {handleSubmit(e)}}>
              {
                (showLoginFormButtonSpinner)
                ? <CircularProgress color="info" size={12}/>
                : loginButtonText
              }
            </Button>
          </Grid>
        </Grid>
      </FormGroup>
      {loginFormMessage}
    </div>
  )
}

export default LoginForm;