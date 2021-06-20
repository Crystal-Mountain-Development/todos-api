import { IResolvers } from "apollo-server";
import { OAuth2Client } from "google-auth-library";
import { User } from "../entity/User";
import {
  generateToken,
  secret,
  validateToken,
} from "../utils/authenticationToken";
import { IContext } from "../context";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import {
  ALREADY_ACCOUNT,
  EMAIL_VALIDATE,
  INVALID_EMAIL,
  INVALID_TOKEN,
} from "../constants/errors";
import {
  EMAIL,
  AUTHORIZATION_TOKEN_MESSAGE,
  VALIDATION_CODE_EMAIL,
} from "../constants/email";
import ms from "ms";

const googleClient = new OAuth2Client(process.env.GOOGLE_AUTH_PUBLIC);

const signinResolvers: IResolvers<any, IContext> = {
  Mutation: {
    signin: async (_, { email, username }) => {
      const user = await User.findOne({ where: { email } });

      if (user) throw new Error(ALREADY_ACCOUNT);

      const newUser = new User();
      newUser.email = email;
      newUser.username = username;
      await newUser.save();

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

    googleEmailValidation: async (_, { token }, context) => {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_AUTH_PUBLIC,
      });
      const payload = ticket.getPayload();

      if (!payload) throw new Error(INVALID_TOKEN);

      const { name, email } = payload;

      if (!name || !email) throw new Error(INVALID_TOKEN);

      let user = await User.findOne({
        where: [{ email }],
      });

      if (!user) {
        user = new User();
        user.email = email;
        user.username = name;
        user.isValidated = true;

        await user.save();
      }

      const authorization = jwt.sign({ id: user.id, email: email }, secret, {
        expiresIn: "1y",
      });

      context.res.cookie("token", authorization, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: ms("1y"),
      });

      return { authorization };
    },

    emailValidation: async (_, { email, token }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error(INVALID_EMAIL);

      const isValid = validateToken(token);

      if (!isValid) throw new Error(INVALID_TOKEN);

      if (user.isValidated) throw new Error(EMAIL_VALIDATE);

      user.isValidated = true;
      await user.save();

      const authorization = jwt.sign(
        { id: user.id, email: user.email },
        secret
      );

      return { authorization };
    },
    resendEmailValidation: async (_, { email }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error(INVALID_EMAIL);

      if (user.isValidated) throw new Error(EMAIL_VALIDATE);

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
        message: "Authorization Token Re-Sent",
        token: (globalThis as any).__IS_PRODUCTION__ ? email : token,
      };
    },
  },
};

export default signinResolvers;
