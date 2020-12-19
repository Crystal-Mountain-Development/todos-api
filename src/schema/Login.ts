import { gql } from "apollo-server";

const LoginSchema = gql`
  extend type Mutation {
    login(email: String!): String
    signin(email: String!, token: String!): String
  }
`;

export default LoginSchema;
