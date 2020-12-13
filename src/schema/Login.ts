import { gql } from "apollo-server";

const LoginSchema = gql`
  extend type Mutation {
    login(email: String!): String
    signin(email: String!, code: String!): String
  }
`;

export default LoginSchema;
