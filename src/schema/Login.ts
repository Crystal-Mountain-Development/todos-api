import { gql } from "apollo-server";

const LoginSchema = gql`
  type LoginMessage {
    message: String!
    token: String
  }

  type LoginToken {
    authorization: String
  }

  extend type Mutation {
    sendAuthToken(email: String!): LoginMessage
    login(email: String!, token: String!): LoginToken
  }
`;

export default LoginSchema;
