import { configLogger } from "white-logger/node";
import { initDotenv } from "./utils";
import { prisma, prismaMiddleware } from "./db";
import { startServer, initFirebaseApp } from "./server";
import path from "path";

async function main() {
  await initDotenv(".env.local");

  if (!process.env.DOYA_ROOT) {
    throw new Error("DOYA_ROOT is undefined, please see the readme.");
  }
  configLogger({
    logPath: path.resolve(process.env.DOYA_ROOT, "logs"),
  });

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
