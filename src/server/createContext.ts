import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../utils/prisma";
import { verifyJwt } from "../utils/jwt";

interface CtxUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

// Extracts user from Request, while verifying the JWT
function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token;
  if (token) {
    try {
      return verifyJwt<CtxUser>(token);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  //Adds user to context from the getUserFromRequest function.
  const user = getUserFromRequest(req);
  //We are adding prisma to context as well as the req and res.
  return { req, res, prisma, user };
}

//Return whatever the type of createContext is
export type Context = ReturnType<typeof createContext>;
