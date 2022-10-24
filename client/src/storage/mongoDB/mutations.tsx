import { gql } from '@apollo/client';

export const CREATE_USER = gql`

mutation createUser(
  $username: String!,
  $email: String!,
  $password: String!
)
{
  createUser(username: $username, email: $email, password: $password) {
    email
    username
    _id
    gameData
    token
  }
}
`;

export const LOGIN_USER = gql`
mutation loginUser(
  $username: String!,
  $password: String!
)
{
  loginUser(username: $username, password: $password) {
    username
    gameData
    _id
    token
  }
}
`;

export const SAVE_GAME_MONGODB = gql`
mutation saveGame(
  $username: String!,
  $gameData: String!
)
{
  saveGame(username: $username, gameData: $gameData){
    username
    gameData
  }
}
`;

export const LOAD_GAME_MONGODB = gql`
mutation loadGame(
  $username: String!
)
{
  loadGame(username: $username){
    gameData
  }
}
`;
