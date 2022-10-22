/* eslint-disable no-underscore-dangle */
const dotenv = require("dotenv");

dotenv.config();

const _SERVER_PORT = process.env.SERVER_PORT;
const _STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const express = require("express");
const stripe = require("stripe")(_STRIPE_SECRET_KEY);
const { ApolloServer } = require("apollo-server-express");
const path = require("path");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || _SERVER_PORT || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  persistedQueries: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "../client/build")));
// }

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const calculateOrderAmount = () => 500;

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "aud",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// eslint-disable-next-line no-shadow, no-unused-vars
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, "0.0.0.0", () => {
      // eslint-disable-next-line no-console
      console.log(`API server running on port ${PORT}!`);
      // eslint-disable-next-line no-console
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers);
