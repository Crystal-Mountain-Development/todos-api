import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "./utils/authenticationToken";

export interface UserContext {
  id: string;
  email: string;
}

export interface IContext {
  user?: UserContext;
}

function context({ req }: { req: Request; res: Response }): IContext {
  const authToken = req.headers.authorization ?? "";

  try {
    const user = jwt.verify(authToken, secret) as UserContext;

    if (user) return { user };
  } catch (error) {
    return {};
  }

  return {};
}

export default context;
