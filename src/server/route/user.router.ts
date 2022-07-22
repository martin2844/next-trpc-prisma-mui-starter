import { createRouter } from "../createRouter";
import {
  createUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from "../../schema/User.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { sendLoginEmail } from "../../utils/mailer";
import { baseUrl } from "../../constants";
import { decode, encode } from "../../utils/base64";
import { signJwt } from "../../utils/jwt";
import { serialize } from "cookie";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    //Ctx is context, and we have prisma added from the createContext function.
    async resolve({ ctx, input }) {
      const { email, name } = input;
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });
        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    async resolve({ ctx, input }) {
      const { email, redirect } = input;
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
        const token = await ctx.prisma.loginToken.create({
          data: {
            redirect,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        //send email to email
        await sendLoginEmail({
          email: user.email,
          url: baseUrl,
          token: encode(`${token.id}:${user.email}`),
        });
        return true;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("verify-otp", {
    input: verifyOtpSchema,
    async resolve({ ctx, input }) {
      const { hash } = input;
      const [id, email] = decode(hash).split(":");
      console.log(id, email);
      try {
        const token = await ctx.prisma.loginToken.findFirst({
          where: {
            id,
            user: {
              email,
            },
          },
          include: {
            user: true,
          },
        });
        console.log("TOKEN ", token);
        if (!token) {
          throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "Token not found",
          });
        }

        const jwt = signJwt(token.user);
        //Sets cookie header with jwt
        ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }));
        return {
          redirect: token.redirect,
        };
      } catch (e) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("me", {
    async resolve({ ctx }) {
      return ctx.user;
    },
  });
