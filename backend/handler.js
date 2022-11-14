/* eslint-disable no-unused-vars */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export function autoConfirmUser(event, context, callback) {
  // eslint-disable-next-line no-param-reassign
  event.response.autoConfirmUser = true;
  callback(null, event);
}

export async function getStripePaymentIntent(event, context, callback) {
  // const { amount, currency = "aud" } = JSON.parse(event.body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "aud",
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentIntent,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: `ERROR 238.415: ${err}`,
    };
  }
}
