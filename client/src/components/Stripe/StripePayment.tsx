import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { GET_PAYMENT_INTENT_URL } from "../../config/aws.config";
import CheckoutForm from "./CheckoutForm";
import "./Stripe.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe("pk_test_51LvezMATqsXJH023Ck7YKY2IOuoIHoRGJxJm0RXkcx4tnilmjB4GIAMRDVRvyuLgxw1N6SFtgaOSa1U6Dsb8FeO400jODd8G4n");

export default function StripePayment() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(GET_PAYMENT_INTENT_URL, {
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