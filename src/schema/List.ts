import { gql } from "apollo-server";

const ListSchema = gql`
  type List {
    id: Int!
    title: String!
    isComplete: Boolean!
    userId: String!
    todos: [Todo!]!
  }

  input ListInsertInput {
    title: String!
  }

  input ListUpdateInput {
    title: String
    isComplete: Boolean
  }

  extend type Query {
    lists: [List!]!
    list(id: Int!): List!
  }

  extend type Mutation {
    addList(insert: ListInsertInput!): List!
    updateList(id: Int!, update: ListUpdateInput): List!
    deleteList(id: Int!): List!
  }
`;

export default ListSchema;
