import { initDotEnv } from "@doit/shared";
import { prisma, prismaMiddleware } from "./db";
import { startServer } from "./server";

async function main() {
  await initDotEnv();
  prisma.$use(prismaMiddleware.softDelete);
  startServer();
}

main(); // eslint-disable-line
