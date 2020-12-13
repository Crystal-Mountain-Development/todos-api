import { IResolvers } from "apollo-server";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import sgMail from "@sendgrid/mail";
import { RedisClient } from "redis";
import { promisify } from "util";

const loginResolvers: IResolvers = {
  Mutation: {
    login: async (_, { email }, { redis }: { redis: RedisClient }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("Invalid Email");

      // GENERATE CODE
      const code = "1234";

      // SAVE THE CODE IN REDIS
      redis.set(user.id, code, console.log);

      // SEND CODE FROM EMAIL
      await sgMail.send({
        to: email,
        from: "sgcg5@outlook.com",
        subject: "Validation Code",
        html: "Validation Code: " + code,
      });

      return "Email sent to " + email;
    },
    signin: async (_, { email, code }, { redis }: { redis: RedisClient }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("Invalid Email");

      const redisCode = await promisify(redis.get).bind(redis)(user.id);

      if (redisCode !== code) throw new Error("Invalid Code");

      const token = jwt.sign({ id: user.id, email: user.email }, code);

      return token;
    },
  },
};

export default loginResolvers;
