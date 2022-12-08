import { initDotenv } from "./utils";
import { prisma, prismaMiddleware } from "./db";
import { startServer, initFirebaseApp } from "./server";

async function main() {
  await initDotenv(".env.local");
  await initFirebaseApp();

  prisma.$use(prismaMiddleware.softDelete);

  if (!process.env.DOYA_SERVER_PORT) {
    throw new Error("server port is undefined, please see the readme.");
  }
  const port = Number(process.env.DOYA_SERVER_PORT);
  if (isNaN(port)) {
    throw new Error("server port is not a number, please check your setting.");
  }
  startServer(port);
}

main(); // eslint-disable-line
