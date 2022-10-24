const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    token: String
    gameData: String
  }

  type Query {
    games: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    loginUser(username: String!, password: String!): User
    saveGame(username: String!, gameData: String!): User
    loadGame(username: String!): User
  }
`;

module.exports = typeDefs;
