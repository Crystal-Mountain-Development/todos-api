import { gql } from "apollo-server";

const TodoSchema = gql`
  type Todo {
    id: String!
    summary: String!
    isComplete: Boolean
    listId: Int!
  }

  input TodoInsertInput {
    summary: String!
    listId: Int!
  }

  input TodoUpdateInput {
    summary: String
    isComplete: Boolean
  }

  extend type Query {
    todos: [Todo!]!
    todo(id: String!): Todo!
  }

  extend type Mutation {
    addTodo(insert: TodoInsertInput!): Todo!
    updateTodo(id: String!, update: TodoUpdateInput): Todo!
    deleteTodo(id: String!): Todo!
  }
`;

export default TodoSchema;
