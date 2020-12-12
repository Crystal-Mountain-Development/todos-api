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
import todoResolvers from "./resolver/Todo";
import listResolvers from "./resolver/List"

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [QuerySchema, MutationSchema, TodoSchema, ListSchema, UserSchema],
    resolvers: [userResolvers, todoResolvers, listResolvers],
  }),
});

createConnection()
  .then(async () => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => console.log(error));
