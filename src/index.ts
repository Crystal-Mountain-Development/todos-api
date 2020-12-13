import "reflect-metadata";
import { createConnection } from "typeorm";

import { ApolloServer, makeExecutableSchema } from "apollo-server";
import redis from "redis";
import QuerySchema from "./schema/Query";
import MutationSchema from "./schema/Mutation";
import UserSchema from "./schema/User";
import TodoSchema from "./schema/Todo";
import ListSchema from "./schema/List";
import userResolvers from "./resolver/User";
import todoResolvers from "./resolver/Todo";
import listResolvers from "./resolver/List";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import LoginSchema from "./schema/Login";
import loginResolvers from "./resolver/Login";

dotenv.config();

const client = redis.createClient({
  url: process.env.REDIS_CONNECTION_URL,
});

client.on("connect", () => console.log("Client connected"));

client.on("error", (error) => console.log("Error: " + error));

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [
      QuerySchema,
      MutationSchema,
      TodoSchema,
      ListSchema,
      UserSchema,
      LoginSchema,
    ],
    resolvers: [userResolvers, todoResolvers, listResolvers, loginResolvers],
  }),
  context: { redis: client },
});

createConnection()
  .then(async () => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => console.log(error));
