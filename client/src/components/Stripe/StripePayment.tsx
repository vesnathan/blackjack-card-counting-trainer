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
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
      });

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
    loader: "always",
    appearance,
  };

  return (
<>
      {clientSecret &&  (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
</>
  );
}

/* paymentIntent.amount_details.charges.client_secret
{"paymentIntent":{
  "id":"pi_3M5IdEATqsXJH0233mSQiEJt",
  "object":"payment_intent",
  "amount":500,
  "amount_capturable":0,
  "amount_details":
    {
      "tip":{}},
      "amount_received":0,
      "application":null,
      "application_fee_amount":null,
      "automatic_payment_methods":null,
      "canceled_at":null,
      "cancellation_reason":null,
      "capture_method":"automatic",
      "charges":
        {
          "object":"list",
          "data":[],
          "has_more":false,
          "total_count":0,
          "url":"/v1/charges?payment_intent=pi_3M5IdEATqsXJH0233mSQiEJt"},
          "client_secret":"pi_3M5IdEATqsXJH0233mSQiEJt_secret_K2osw0YhKcgQypKCL7KyncqdE",
          "confirmation_method":"automatic",
          "created":1668732036,
          "currency":"aud",
          "customer":null,
          "description":null,
          "invoice":null,
          "last_payment_error":null,
          "livemode":false,
          "metadata":{},
          "next_action":null,
          "on_behalf_of":null,
          "payment_method":null,
          "payment_method_options":
          {
            "card":
              {
                "installments":null,
                "mandate_options":null,
                "network":null,
                "request_three_d_secure":"automatic"
              }
            },
            "payment_method_types":["card"],"processing":null,"receipt_email":null,"review":null,"setup_future_usage":null,"shipping":null,"source":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"requires_payment_method","transfer_data":null,"transfer_group":null}}
*/