import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "./utils/authenticationToken";

export interface UserContext {
  id: string;
  email: string;
}

export interface IContext {
  user?: UserContext;
  req: Request;
  res: Response;
}

function context({ req, res }: { req: Request; res: Response }): IContext {
  const authToken = req.cookies["token"] || req.headers["authorization"];

  try {
    const user = jwt.verify(authToken, secret) as UserContext;

    if (user) return { user, req, res };
  } catch (error) {
    return { req, res };
  }

  return { req, res };
}

export default context;
