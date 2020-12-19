import { IResolvers } from "apollo-server";
import { List } from "../entity/List";
import { User } from "../entity/User";

const userResolvers: IResolvers = {
  Query: {
    users: () => User.find(),
    user: (_, { id }) => User.findOne(id),
  },
  Mutation: {
    addUser: async (_, { insert }) => {
      const user = new User();
      user.email = insert.email;
      user.username = insert.username;

      await user.save();

      return user;
    },
    updateUser: async (_, { id, update }) => {
      const user = await User.findOne(id);

      if (!user) throw new Error("No User Found");

      user.email = update.email || user.email;
      user.username = update.username || user.username;

      await user.save();

      return user;
    },
  },
  User: {
    lists: (parent) => List.find({ where: { userId: parent.id } }),
  },
};

export default userResolvers;
