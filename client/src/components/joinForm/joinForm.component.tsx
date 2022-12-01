import React from 'react';
import { useState } from 'react';
import { useGameContext } from "../../utils/GameStateContext";

import './joinForm.component.css';
import { saveGameIndexedDB } from "../../storage/indexedDB/functions";

// Material UI Components
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import { AWS_USER_POOL_ID, AWS_CLIENT_ID } from "../../config/aws.config";

import { 
  UPDATE_CHIPS,
  SHOW_JOIN_FORM_OK,
  SHOW_JOIN_FORM_OK_MESSAGE,
  SHOW_JOIN_FORM_OK_STATUS,
  SHOW_JOIN_FORM,
  SHOW_JOIN_FORM_BUTTON_SPINNER,
  SHOW_LOGIN_FORM,
  JOIN_BUTTON_TEXT,
  LOGIN_BUTTON_TEXT,
  LOGGED_IN,
  SET_SESSION_DATA,
  // SET_USER_ID,   
  // SET_USER_EMAIL,
  // SET_USER_PASSWORD
} from "../../utils/actions";

const JoinForm = (): React.ReactElement  => {
  const state: any = useGameContext();
  // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars 

  const { 
    joinButtonText, 
    loginButtonText,
    showJoinFormOkMessage,
    showJoinFormButtonSpinner,
    chipsTotal,
    scoreTotal,
    playerPosition,
    userStreak,
    gameLevel
  } = state.state.appStatus;

  const { gameRules } = state.state;
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmpassword: ""
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.id.split("-");
    switch (name[0]) {
      case "email":
        setEmailError("");
        break;
      case "password":
        setPasswordError("");
        break;    
      case "confirmPassword":
        setConfirmPasswordError("");
        break;
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const showLoginFormFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_JOIN_FORM,  data: false },
          { which: SHOW_LOGIN_FORM,  data: true },
          { which: JOIN_BUTTON_TEXT,  data: "OR JOIN" },
          { which: LOGIN_BUTTON_TEXT,  data: "LOG IN" },
        ]
      }
    );  
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_JOIN_FORM_BUTTON_SPINNER,  data: true },
        ]
      }
    );   
    let continueProcessingForm = true;
    if (!inputs.email) { setEmailError("Please enter your email address."); continueProcessingForm = false;}
    else {
      if (
        // @ts-ignore
        !inputs.email.toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ){
        setEmailError("Please enter a valid email address."); continueProcessingForm = false;
      }
    }

    if (!inputs.password) { setPasswordError("Please enter a password"); continueProcessingForm = false;}
    else {
      if (
        // @ts-ignore
        !inputs.password.match(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
        )
      ){
        setPasswordError("Please enter a stronger password."); continueProcessingForm = false;
      }
    }
    if (!inputs.confirmpassword) { setConfirmPasswordError("Please confirm your password."); continueProcessingForm = false;}
    else {
      if (inputs.confirmpassword !== inputs.password) {
        setConfirmPasswordError("Please re-type your password."); continueProcessingForm = false;
      }
    }
    
    if (continueProcessingForm) {
      const poolData = {
        UserPoolId: AWS_USER_POOL_ID,
        ClientId: AWS_CLIENT_ID
      }
      
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const attributeList : AmazonCognitoIdentity.CognitoUserAttribute[] = [];
      const dataEmail = {
        Name: 'email',
        Value: inputs.email,
      };
      const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
      attributeList.push(attributeEmail);
      // @ts-ignore
      userPool.signUp(inputs.email, inputs.password, attributeList, null, function(
        err,
        result
      ) {
        if (err) {
          setEmailError(err.message);
          return;
        }
        // @ts-ignore
        var user = result.user;
        var userData = {
          Username : user.getUsername(),
          Pool : userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        const authenticationData = {
          Username : inputs.email,
          Password : inputs.password,
        };
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function(result) {

            // @ts-ignore
            cognitoUser.getSession(function(err, session) {
              if (err) {
                alert(err.message || JSON.stringify(err));
                return;
              }

              state.updateGameState(
                { newDispatches: 
                  [ 
                    { which: SET_SESSION_DATA, data: session },
                  ] 
                }
              );
            });




            // var accessToken = result.getAccessToken().getJwtToken();
            state.updateGameState(
              { newDispatches: 
                [ 
                  { which: SHOW_JOIN_FORM_OK_MESSAGE,     data: "Successfully joined! Enjoy your 1000 free chips!" },
                  { which: SHOW_JOIN_FORM_OK_STATUS,      data: "success" },
                  { which: UPDATE_CHIPS,                  data: 1000 },
                  { which: SHOW_JOIN_FORM,                data: false },
                  { which: SHOW_JOIN_FORM_OK,             data: true },
                  { which: LOGGED_IN,                     data: true },
                ] 
              }
            );
            saveGameIndexedDB({chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel, gameRules}); 

          }, 
          onFailure: function(err) {
            setEmailError(err.message);
          },
        });
      });
    }
    state.updateGameState(
      { newDispatches: 
        [ 
          { which: SHOW_JOIN_FORM_BUTTON_SPINNER, data: false },
        ]
      }
    );
  }
  
  return (
    <div className="popupForm">
      <FormGroup className="marginBottom">

        <input type="text" id="email-Input" name="email" placeholder="Email:" onFocus={handleFocus} onChange={handleChange} value={inputs.email} /> 
        {emailError ? <div className="joinFormErrorWrapper"><div className="joinFormError">{emailError}</div></div> : null }
        
        <input type="password" id="password-Input" name="password" placeholder="Password:" onFocus={handleFocus} onChange={handleChange}  value={inputs.password} />
        {passwordError ? <div className="joinFormErrorWrapper"><div className="joinFormError">{passwordError}</div></div> : null }
        
        <input type="password" id="confirmPassword-Input" name="confirmpassword" placeholder="Confirm Password:" onFocus={handleFocus} onChange={handleChange}  />
        {confirmPasswordError ? <div className="joinFormErrorWrapper"><div className="joinFormError">{confirmPasswordError}</div></div> : null }
        
        <Grid container  sx={{mt: 2}} >
          <Grid item sm={6} container justifyContent="left">
            <Button id="joinButton" variant="contained" color="primary" sx={{width: "90%"}} onClick={(e) => {showLoginFormFunction(e)}}>{loginButtonText}</Button>
          </Grid>
          <Grid item sm={6} container justifyContent="right">
            <Button id="joinButton" variant="contained" color="primary" sx={{width: "90%"}} onClick={(e) => { handleSubmit(e)}}>
              {
                (showJoinFormButtonSpinner)
                ? <CircularProgress color="info" size={12}/>
                : joinButtonText
              }
            </Button>
          </Grid>
        </Grid>
      </FormGroup>
      {showJoinFormOkMessage}
    </div>
  )
}

export default JoinForm;