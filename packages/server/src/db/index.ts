import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export * as prismaMiddleware from "./midlleware";
