import { AuthenticationError, IResolvers } from "apollo-server";
import { IContext } from "../context";
import { List } from "../entity/List";
import { User } from "../entity/User";

const userResolvers: IResolvers<any, IContext> = {
  Query: {
    user: (_, __, context) => {
      if (!context.user) throw new AuthenticationError("You must login");

      return User.findOne(context.user.id);
    },
  },
  Mutation: {
    updateUser: async (_, { update }, context) => {
      if (!context.user) throw new AuthenticationError("You must login");

      const user = await User.findOne(context.user?.id);

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
