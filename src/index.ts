import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { createConnection } from "typeorm";

(globalThis as any).__IS_PRODUCTION__ = process.env.NODE_ENV === "production";

import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import QuerySchema from "./schema/Query";
import MutationSchema from "./schema/Mutation";
import UserSchema from "./schema/User";
import TodoSchema from "./schema/Todo";
import ListSchema from "./schema/List";
import userResolvers from "./resolver/User";
import todoResolvers from "./resolver/Todo";
import listResolvers from "./resolver/List";
import sgMail from "@sendgrid/mail";
import LoginSchema from "./schema/Login";
import loginResolvers from "./resolver/Login";
import context from "./context";
import signinResolvers from "./resolver/Signin";
import signinSchema from "./schema/Signin";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const app = express();
const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [
      QuerySchema,
      MutationSchema,
      TodoSchema,
      ListSchema,
      UserSchema,
      LoginSchema,
      signinSchema,
    ],
    resolvers: [
      userResolvers,
      todoResolvers,
      listResolvers,
      loginResolvers,
      signinResolvers,
    ],
  }),
  context,
  playground: true,
});

console.info("Connecting to database");

createConnection()
  .then(async () => {
    console.info("Database connected");

    await server.start();
    app.use(cookieParser());
    server.applyMiddleware({
      app,
      path: "/",
      cors: {
        origin: true,
        credentials: true,
      },
    });
    server.setGraphQLPath("/");

    app.listen({ port: 4000 }, () => {
      console.info(`🚀  Server ready at ${4000}${server.graphqlPath}`);
    });
  })
  .catch(console.log);
