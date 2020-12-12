import dayjs from "dayjs";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { AuthToken } from "./entity/AuthToken";
import { List } from "./entity/List";
import { Todo } from "./entity/Todo";
import { User } from "./entity/User";

import { ApolloServer,gql } from "apollo-server"

const typeDefs = gql`

  type User {
    id: String!
    username: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }
`;

const resolvers = {
  Query: {
    users: () => User.find()
  },
};

const server = new ApolloServer({ typeDefs, resolvers });


createConnection()
  .then(async () => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => console.log(error));
