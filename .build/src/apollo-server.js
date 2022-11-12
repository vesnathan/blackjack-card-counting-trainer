"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlHandler = void 0;
const apollo_server_lambda_1 = require("apollo-server-lambda");
const resolvers_1 = require("./resolvers");
const typeDefs_1 = require("./typeDefs");
const apolloServer = new apollo_server_lambda_1.ApolloServer({ resolvers: resolvers_1.resolvers, typeDefs: typeDefs_1.typeDefs });
exports.graphqlHandler = apolloServer.createHandler();
//# sourceMappingURL=apollo-server.js.map