import { IResolvers } from "apollo-server";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import sgMail from "@sendgrid/mail";
import {
  generateToken,
  secret,
  validateToken,
} from "../utils/authenticationToken";
import { IContext } from "../context";

const loginResolvers: IResolvers<any, IContext> = {
  Mutation: {
    sendAuthToken: async (_, { email }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("Invalid Email");

      const token = generateToken();

      if ((globalThis as any).__IS_PRODUCTION__) {
        await sgMail.send({
          to: email,
          from: "sgcg5@outlook.com",
          subject: "Validation Code",
          html: "Validation Code: " + token,
        });
      }

      return {
        message: "Authorization Token Sent",
        token: (globalThis as any).__IS_PRODUCTION__ ? email : token,
      };
    },
    login: async (_, { email, token }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("Invalid Email");

      const isValid = validateToken(token);

      if (!isValid) throw new Error("Invalid Token");

      const authorization = jwt.sign(
        { id: user.id, email: user.email },
        secret
      );

      return { authorization };
    },
  },
};

export default loginResolvers;
