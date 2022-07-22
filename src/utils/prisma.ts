import { PrismaClient } from "@prisma/client";

//By declaring prisma as a global type we make sure that we only have on instance of prisma running at a time.
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
