import React from 'react';
import { useState } from 'react';
import { useGameContext } from "../../utils/GameStateContext";

import { AWS_USER_POOL_ID, AWS_CLIENT_ID } from "../../config/aws.config";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';

import './loginForm.component.css';

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
  SET_SESSION_DATA,
  LOGGED_IN,
  SHOW_PICK_SPOT,
  SHOW_POPUP
} from "../../utils/actions";



const LoginForm = (): React.ReactElement  => {

  const state: any = useGameContext();


  const { 
    joinButtonText, 
    loginButtonText,
    showLoginFormButtonSpinner,
    loginFormMessage,
    sessionData
  } = state.state.appStatus;
  
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.id.split("-");
    switch (name[0]) {
      case "email":
        setEmailError("");
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
    if (!inputs.email) { setEmailError("Please enter your email."); continueProcessingForm = false;  }
    if (!inputs.password) { setPasswordError("Please enter a password"); continueProcessingForm = false;  }
    
    if (continueProcessingForm) {


      var authenticationData = {
        Username : inputs.email,
        Password : inputs.password,
      };
      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
      );
      const poolData = {
        UserPoolId: AWS_USER_POOL_ID,
        ClientId: AWS_CLIENT_ID
      }
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      var userData = {
        Username: inputs.email, // 'username',
        Pool: userPool,
      };
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
          cognitoUser.getSession(function(err: { message: any; }, session: any) {
            if (err) {
              setEmailError(err.message || JSON.stringify(err));
              // alert(err.message || JSON.stringify(err));
              return;
            }
            const headers = {
              // @ts-ignore
              Authorization: sessionData.accessToken.jwtToken 
            }
            // @ts-ignore
            // @ts-ignore
            const loadedGame = loadGameMutation.mutate({headers, userId: sessionData.idToken.payload.sub });
            state.updateGameState(
              { newDispatches: 
                [ 
                  { which: SET_SESSION_DATA, data: session },
                ] 
              }
            );
          });
          state.updateGameState(
            { newDispatches: 
              [ 
                { which: LOGGED_IN,       data: true },
                { which: SHOW_LOGIN_FORM, data: false },
                { which: SHOW_POPUP,      data: false },
                { which: SHOW_PICK_SPOT,  data: true },
              ] 
            }
          );
        },
      
        onFailure: function(err) {
          setEmailError(emailError);
        },
      });
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
        <input type="text" id="email-Input" name="email" placeholder="Email:" onFocus={handleFocus} onChange={handleChange}/> 
        {emailError ? <div className="joinFormErrorWrapper"><div id="email-Error" className="joinFormError">{emailError}</div></div> : null }
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