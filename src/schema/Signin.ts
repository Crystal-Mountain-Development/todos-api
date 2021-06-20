import { gql } from "apollo-server";

const signinSchema = gql`
  type SigninToken {
    authorization: String
  }

  type SigninMessage {
    message: String!
    token: String
  }

  extend type Mutation {
    signin(email: String!, username: String!): SigninMessage
    googleEmailValidation(token: String!): SigninToken
    emailValidation(email: String!, token: String!): SigninToken
    resendEmailValidation(email: String!): SigninMessage
  }
`;

export default signinSchema;
