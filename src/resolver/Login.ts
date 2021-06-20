import { IResolvers } from "apollo-server";
import jwt from "jsonwebtoken";
import ms from "ms";
import { User } from "../entity/User";
import sgMail from "@sendgrid/mail";
import {
  generateToken,
  secret,
  validateToken,
} from "../utils/authenticationToken";
import { IContext } from "../context";
import { INVALID_EMAIL, INVALID_TOKEN } from "../constants/errors";
import {
  EMAIL,
  AUTHORIZATION_TOKEN_MESSAGE,
  VALIDATION_CODE_EMAIL,
} from "../constants/email";

const loginResolvers: IResolvers<any, IContext> = {
  Mutation: {
    sendAuthToken: async (_, { email }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error(INVALID_EMAIL);

      const token = generateToken();

      if ((globalThis as any).__IS_PRODUCTION__) {
        await sgMail.send({
          to: email,
          from: EMAIL,
          subject: VALIDATION_CODE_EMAIL,
          html: "Validation Code: " + token,
        });
      }

      return {
        message: AUTHORIZATION_TOKEN_MESSAGE,
        token: (globalThis as any).__IS_PRODUCTION__ ? email : token,
      };
    },
    login: async (_, { email, token }, context) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error(INVALID_EMAIL);

      const isValid = validateToken(token);

      if (!isValid) throw new Error(INVALID_TOKEN);

      if (!user.isValidated) throw new Error(INVALID_EMAIL);

      const authorization = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "1y" }
      );

      context.res.cookie("token", authorization, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: ms("1y"),
      });

      return { authorization };
    },
  },
};

export default loginResolvers;
