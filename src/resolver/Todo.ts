import { IResolvers } from "apollo-server";
import { IContext } from "../context";
import { List } from "../entity/List";
import { Todo } from "../entity/Todo";

const todoResolvers: IResolvers<any, IContext> = {
  Query: {
    todos: async (_, __, context) => {
      const list = await List.findOne(context.user?.id);

      return Todo.find({ where: { listId: list?.id } });
    },
    todo: async (_, { id }, context) => {
      const todo = await Todo.findOne(id);
      const list = await List.findOne(context.user?.id);

      if (!todo || todo.listId !== list?.id) throw new Error("No ToDo Found");

      return todo;
    },
  },
  Mutation: {
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
};

export default todoResolvers;
