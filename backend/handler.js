import Stripe from "stripe";
/* eslint-disable no-unused-vars */
exports.autoConfirmUser = (event, context, callback) => {
  // eslint-disable-next-line no-param-reassign
  event.response.autoConfirmUser = true;
  callback(null, event);
};

exports.getStripePaymentIntent = async (event, context, callback) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
  // callback(null, event);
};
