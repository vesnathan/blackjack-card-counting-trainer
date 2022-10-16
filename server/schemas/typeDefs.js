const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    token: String
  }

  type Query {
    games: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    loginUser(username: String!, password: String!): User
  }
`;

module.exports = typeDefs;
