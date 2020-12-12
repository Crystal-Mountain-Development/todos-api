import "reflect-metadata";
import { createConnection } from "typeorm";
import { List } from "./entity/List";
import { Todo } from "./entity/Todo";
import { User } from "./entity/User";

import { ApolloServer, IResolvers, makeExecutableSchema } from "apollo-server";
import QuerySchema from "./schema/Query";
import MutationSchema from "./schema/Mutation";
import UserSchema from "./schema/User";
import TodoSchema from "./schema/Todo";
import ListSchema from "./schema/List";
import userResolvers from "./resolver/User";

const resolvers: IResolvers = {
  Query: {
    lists: () => List.find(),
    list: (_, { id }) => List.findOne(id),
    todos: () => Todo.find(),
    todo: (_, { id }) => Todo.findOne(id),
  },
  Mutation: {
    addList: async (_, { insert }) => {
      const list = new List();
      list.title = insert.title;
      list.isComplete = false;
      list.userId = insert.userId;

      await list.save();

      return list;
    },
    updateList: async (_, { id, update }) => {
      const list = await List.findOne(id);

      if (!list) throw new Error("No List Found");

      list.title = update.title || list.title;
      list.isComplete = update.isComplete || list.isComplete;

      await list.save();

      return list;
    },
    deleteList: async (_, { id }) => {
      const list = await List.findOne(id);

      if (!list) throw new Error("No List Found");

      await list.remove();

      return { ...list, id };
    },
    addTodo: async (_, { insert }) => {
      const todo = new Todo();
      todo.summary = insert.summary;
      todo.isComplete = false;
      todo.listId = insert.listId;

      await todo.save();

      return todo;
    },
    updateTodo: async (_, { id, update }) => {
      const todo = await Todo.findOne(id);

      if (!todo) throw new Error("No ToDo Found");

      todo.summary = update.title || todo.summary;
      todo.isComplete = update.isComplete || todo.isComplete;

      await todo.save();

      return todo;
    },
    deleteTodo: async (_, { id }) => {
      const todo = await Todo.findOne(id);

      if (!todo) throw new Error("No ToDo Found");

      await todo.remove();

      return { ...todo, id };
    },
  },
  List: {
    todos: (parent) => Todo.find({ where: { listId: parent.id } }),
  },
};

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [QuerySchema, MutationSchema, TodoSchema, ListSchema, UserSchema],
    resolvers: [userResolvers, resolvers],
  }),
});

createConnection()
  .then(async () => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => console.log(error));
