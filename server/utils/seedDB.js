const dotenv = require("dotenv");

const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const db = require("../config/connection");
const { User } = require("../models");

db.once("open", async () => {
  // clean database
  await User.deleteMany({});

  console.log("all done!");
  process.exit(0);
});
