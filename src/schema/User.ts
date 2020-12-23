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
    user: User!
  }

  extend type Mutation {
    updateUser(update: UserUpdateInput): User!
  }
`;

export default UserSchema;
