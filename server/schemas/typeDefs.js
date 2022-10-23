const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Game {
    _id: ID!
    gameData: GraphQLObjectType!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    token: String
    game: gameData
  }

  type Query {
    games: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    loginUser(username: String!, password: String!): User
    saveGame(username: String!, game: GraphQLObjectType!): User
  }
`;

module.exports = typeDefs;
