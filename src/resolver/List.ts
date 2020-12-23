import { AuthenticationError, IResolvers } from "apollo-server";
import { IContext } from "../context";
import { List } from "../entity/List";
import { Todo } from "../entity/Todo";

const listResolvers: IResolvers<any, IContext> = {
  Query: {
    lists: (_, __, { user }) => {
      if (!user) throw new AuthenticationError("You must login");
      return List.find({ where: { userId: user?.id } })
    },
    list: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");
      const list = await List.findOne(id, { where: { userId: user?.id } });

      if (!list) throw new Error("No List Found");

      return list;
    },
  },
  Mutation: {
    addList: async (_, { insert }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");

      const list = new List();
      list.title = insert.title;
      list.isComplete = false;
      list.userId = user.id

      await list.save();

      return list;
    },
    updateList: async (_, { id, update }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");
      const list = await List.findOne(id, { where: { userId: user?.id } });

      if (!list) throw new Error("No List Found");

      list.title = update.title || list.title;
      list.isComplete = update.isComplete || list.isComplete;

      await list.save();

      return list;
    },
    deleteList: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError("You must login");
      const list = await List.findOne(id, { where: { userId: user?.id } });

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
