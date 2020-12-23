import { AuthenticationError, IResolvers } from "apollo-server";
import { LOGIN_REQUIRED } from "../constants/errors";
import { IContext } from "../context";
import { Todo } from "../entity/Todo";

const todoResolvers: IResolvers<any, IContext> = {
  Query: {
    todos: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      return Todo.createQueryBuilder("todo")
        .innerJoin("todo.list", "list")
        .where("list.userId = :userId", { userId: user.id })
        .getMany();
    },
    todo: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const todo = await Todo.createQueryBuilder("todo")
        .innerJoin("todo.list", "list")
        .where("list.userId = :userId", { userId: user.id })
        .getOneOrFail();

      return todo;
    },
  },
  Mutation: {
    addTodo: async (_, { insert }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const todo = new Todo();
      todo.summary = insert.summary;
      todo.isComplete = false;
      todo.listId = insert.listId;

      await todo.save();

      return todo;
    },
    updateTodo: async (_, { id, update }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const todo = await Todo.createQueryBuilder("todo")
        .innerJoin("todo.list", "list")
        .where("list.userId = :userId AND todo.id = :todoId", {
          userId: user.id,
          todoId: id,
        })
        .getOneOrFail();

      todo.summary = update.summary ?? todo.summary;
      todo.isComplete = update.isComplete ?? todo.isComplete;

      await todo.save();

      return todo;
    },
    deleteTodo: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const todo = await Todo.createQueryBuilder("todo")
        .innerJoin("todo.list", "list")
        .where("list.userId = :userId", { userId: user.id })
        .getOneOrFail();

      await todo.remove();

      return { ...todo, id };
    },
  },
};

export default todoResolvers;
