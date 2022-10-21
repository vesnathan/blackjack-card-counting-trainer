import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import saveGame from "../../functions/saveGame";

import { useGameContext } from "../../utils/GameStateContext";

import { 
  UPDATE_CHIPS,
  SHOW_POPUP,
  UPDATE_BET_BUTTONS
} from "../../utils/actions";

import { SHOW_STRIPE_FORM } from "../../utils/actions";

export default function CheckoutForm() {
  const state: any = useGameContext();

  const { chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel } = state.state.appStatus;
  const { gameRules } = state.state;

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          // @ts-ignore
          setMessage("Your payment was successful.");
          break;
        case "processing":
          // @ts-ignore
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          // @ts-ignore
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          // @ts-ignore
          setMessage("");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    // @ts-ignore
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3002",
      },
      redirect: 'if_required',
    })
    if (!error) {
      if (paymentIntent.status === "succeeded"){
        state.updateGameState( { newDispatches: [ { which: UPDATE_CHIPS, data: 1000 } ] } );
        state.updateGameState( { newDispatches: [ { which: SHOW_POPUP, data: false } ] } );
        state.updateGameState( { newDispatches: [ { which: SHOW_POPUP, data: false } ] } );
        state.updateGameState( { newDispatches: [ { which: SHOW_STRIPE_FORM, data: false } ] } );
        state.updateGameState({newDispatches:[{ which: UPDATE_BET_BUTTONS,  data: {whichButton: 3, whichProperty: "buttonDisabled", data: false } }]});
        saveGame(
          chipsTotal, 
          scoreTotal, 
          playerPosition, 
          userStreak, 
          gameLevel, 
          gameRules,
        );
      }
    }
    else {
      if (error.type === "card_error" || error.type === "validation_error") {
        // @ts-ignore
        setMessage(error.message);
      } else {
        // @ts-ignore
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  return (
    // @ts-ignore
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}