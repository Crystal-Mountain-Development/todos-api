import { IResolvers } from "apollo-server";
import { List } from "../entity/List";
import { Todo } from "../entity/Todo";

const listResolvers: IResolvers = {
  Query: {
    lists: () => List.find(),
    list: (_, { id }) => List.findOne(id),
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

      const todo = await Todo.find({ where: { listId: id } });

      await Todo.remove(todo);

      await list.remove();

      return { ...list, id };
    },
  },
  List: {
    todos: (parent) => Todo.find({ where: { listId: parent.id } }),
  },
};

export default listResolvers;
