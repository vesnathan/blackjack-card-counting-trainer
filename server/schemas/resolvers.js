// const { AuthenticationError } = require("apollo-server-errors");
const { User } = require("../models");

const { signToken } = require("../utils/auth");
// const { authMiddleware } = require("../utils/auth");

const resolvers = {
  Query: {},

  Mutation: {
    createUser: async (parent, args) => {
      const userData = {
        username: args.username,
        password: args.password,
        email: args.email,
      };
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        const newUser = await User.create(userData);
        if (!newUser) {
          throw new Error("User not created");
        }

        const token = signToken(newUser);
        const newObj = { token, ...newUser.toObject() };
        return newObj;
      }

      return { status: "error", message: "user exists" };
    },

    loginUser: async (parent, args) => {
      const thisUser = await User.findOne({ username: args.username });
      const correctPw = await thisUser.isCorrectPassword(args.password);
      if (correctPw) {
        const token = signToken(thisUser);
        const newObj = { token, ...thisUser.toObject() };
        return newObj;
      }
      throw new Error("User not created");
    },
  },
};

module.exports = resolvers;
