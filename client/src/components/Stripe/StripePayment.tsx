import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "./Stripe.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe("pk_live_51LvezMATqsXJH0231Y8UHVlidJkDo201Vp2Who3ldZOe3sPlEwiTQJxhrgLZM6SJZDeD4qd7G3mZSZdCRYuONZLP00LPhXESXT");

export default function StripePayment() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "1000-chips" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
    rules: {
      ".Error": {
        fontSize: "0px",
        lineHeight: "0px"
      },
      ".Label": {
        fontSize: "0px",
        lineHeight: "0px"
      },
    }
  };
  const options: any = {
    clientSecret,
    appearance,
  };

  return (
<>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
</>
  );
}