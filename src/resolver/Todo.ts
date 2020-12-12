import { IResolvers } from "apollo-server";
import { Todo } from "../entity/Todo";

const todoResolvers: IResolvers = {
  Query: {
    todos: () => Todo.find(),
    todo: (_, { id }) => Todo.findOne(id),
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

export default todoResolvers
