import { gql } from "apollo-server";

const UserSchema = gql`
  type User {
    id: String!
    username: String!
    email: String!
    lists: [List!]!
  }

  input UserInsertInput {
    username: String!
    email: String!
  }

  input UserUpdateInput {
    username: String
    email: String
  }

  extend type Query {
    users: [User!]!
    user(id: String!): User!
  }

  extend type Mutation {
    updateUser(id: String!, update: UserUpdateInput): User!
  }
`;

export default UserSchema;
