import { nodelogger as logger } from "white-logger/node";

import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

export const initFirebaseApp = async () => {
  const rootDir = process.env.DOYA_ROOT;
  const credentialJsonFilename = process.env.DOYA_FIREBASE_SECRET_JSON;
  if (!rootDir) {
    throw new Error("project root dir is undefined");
  }
  if (!credentialJsonFilename) {
    throw new Error("project firebase json name is undefined");
  }

  const secretFirebaseJson = (await import(
    rootDir + "/packages/server/" + credentialJsonFilename
  )) as object;

  initializeApp({
    credential: credential.cert(secretFirebaseJson),
  });

  logger.nomal("server-firebase-admin", __filename, "init firebase admin app successfully.");
};

export default initFirebaseApp;
