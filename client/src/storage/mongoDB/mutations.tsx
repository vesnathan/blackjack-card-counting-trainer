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
    _id
    token
  }
}
`;
