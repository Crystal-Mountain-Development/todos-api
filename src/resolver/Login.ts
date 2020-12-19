import { IResolvers } from "apollo-server";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import sgMail from "@sendgrid/mail";
import {
  generateToken,
  secret,
  validateToken,
} from "../utils/authenticationToken";

const loginResolvers: IResolvers = {
  Mutation: {
    login: async (_, { email }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("Invalid Email");

      const token = generateToken();

      await sgMail.send({
        to: email,
        from: "sgcg5@outlook.com",
        subject: "Validation Code",
        html: "Validation Code: " + token,
      });

      return "Email sent to " + email;
    },
    signin: async (_, { email, token }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("Invalid Email");

      const isValid = validateToken(token);

      if (!isValid) throw new Error("Invalid Code");

      const authToken = jwt.sign(
        { userId: user.id, email: user.email },
        secret
      );

      return authToken;
    },
  },
};

export default loginResolvers;
