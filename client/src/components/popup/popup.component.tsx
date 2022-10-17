import React from 'react';
import { useGameContext } from "../../utils/GameStateContext";

import './popup.component.css';

import Grid from '@mui/material/Grid';

import JoinForm from "../joinForm/joinForm.component";
import JoinFormOk from "../joinForm/joinFormOk/joinFormOk.component";
import LoginForm from "../loginForm/loginForm.component";
import StripePayment from "../Stripe/StripePayment";


const Popup = (): JSX.Element => {

  const state: any = useGameContext();

  const { 
    showPopup,
    showJoinFormOk,
    showJoinForm,
    showLoginForm,
    popupTitle, 
    popupMessage,
    popupCharacter,
    showStripeForm
  } = state.state.appStatus;

  return (
    <div className={`popup ${showPopup}`}>
      <div className="messageHolder" >
        <Grid container >
            <Grid item xs={12}  >
              <div className="popupTitle">
                {popupTitle}          
              </div>
            </Grid>
            <Grid item sm={6}  >
              <div className="popupMessage">
                {popupMessage}          
              </div>
            </Grid>
            <Grid item sm={6}  >
            {
              showJoinForm ?
                <JoinForm  />
              : null
            }
            {
              showLoginForm ?
                <LoginForm  />   
              : null
            }
            {
              showJoinFormOk ?
                <JoinFormOk />   
              : null
            }
            {
              showStripeForm ?
                <StripePayment />
              : null
            }
            
            </Grid>
        </Grid>
      </div>
      <div className="character"><img src={popupCharacter} alt=""/></div>
    </div>
  )
}
export default Popup;