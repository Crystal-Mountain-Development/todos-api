import { AuthenticationError, IResolvers } from "apollo-server";
import { LOGIN_REQUIRED } from "../constants/errors";
import { IContext } from "../context";
import { List } from "../entity/List";
import { Todo } from "../entity/Todo";

const listResolvers: IResolvers<any, IContext> = {
  Query: {
    lists: (_, __, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      return List.find({ where: { userId: user?.id } });
    },
    list: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const list = await List.findOneOrFail(id, {
        where: { userId: user?.id },
      });

      return list;
    },
  },
  Mutation: {
    addList: async (_, { insert }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const list = new List();
      list.title = insert.title;
      list.isComplete = false;
      list.userId = user.id;

      await list.save();

      return list;
    },
    updateList: async (_, { id, update }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const list = await List.findOneOrFail(id, {
        where: { userId: user?.id },
      });

      list.title = update.title ?? list.title;
      list.isComplete = update.isComplete ?? list.isComplete;

      await list.save();

      return list;
    },
    deleteList: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError(LOGIN_REQUIRED);

      const list = await List.findOneOrFail(id, {
        where: { userId: user?.id },
      });

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
