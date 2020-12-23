import { AuthenticationError, IResolvers } from "apollo-server";
import { IContext } from "../context";
import { List } from "../entity/List";
import { Todo } from "../entity/Todo";

const todoResolvers: IResolvers<any, IContext> = {
  Query: {
    todos: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("You must login");

      return Todo.find({ where: { list: { userId: user.id } } });
    },
    todo: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");
      const todo = await Todo.findOne(id, {
        where: { list: { userId: user?.id } },
      });

      if (!todo) throw new Error("No ToDo Found");

      return todo;
    },
  },
  Mutation: {
    addTodo: async (_, { insert }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");
      const todo = new Todo();
      todo.summary = insert.summary;
      todo.isComplete = false;
      todo.listId = insert.listId;

      await todo.save();

      return todo;
    },
    updateTodo: async (_, { id, update }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");

      const todo = await Todo.createQueryBuilder("todo")
        .innerJoin("todo.list", "list")
        .where("list.userId = :userId AND todo.id = :todoId", { userId: user.id, todoId: id})
        .getOne();

      if (!todo) throw new Error("No ToDo Found");

      todo.summary = update.summary ?? todo.summary;
      console.log(update)
      todo.isComplete = update.isComplete ?? todo.isComplete;

      await todo.save();

      return todo;
    },
    deleteTodo: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");
      const todo = await Todo.findOne(id, {
        where: { list: { userId: user?.id } },
      });

      if (!todo) throw new Error("No ToDo Found");

      await todo.remove();

      return { ...todo, id };
    },
  },
};

export default todoResolvers;
