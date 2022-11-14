import { GRAPHQL_URL } from "../../config/aws.config";
import { useQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";


const graphQLClient = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`
  }
});

export function useLoadGame() {
  return useQuery("get-posts", async () => {
    const { loadGame } = await graphQLClient.request(gql`
      mutation {
        loadGame {
          items {
            userName
            gameData
          }
        }
      }
    `);
    return loadGame;
  });
}