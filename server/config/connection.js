const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI ||
    `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

module.exports = mongoose.connection;
