// import { PrismaClient as PrismaClientPostgres} from "@prisma-db-psql/client";
import { PrismaClient } from "@prisma/client";

import { env } from "~/env";
const { NODE_ENV } = env;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (NODE_ENV !== "production") globalForPrisma.prisma = db;
