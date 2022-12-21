import { initializeApp, FirebaseOptions } from "@firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import type { FirebaseApp } from "@firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { Functions } from "firebase/functions";

// init firebase app
const key = process.env.WEB_APIKEY;
const domain = process.env.WEB_AUTH_DOMAIN;
const projectId = process.env.WEB_PROJECT_ID;
const storageBucket = process.env.WEB_STORAGE_BUCKET;
const msgSenderId = process.env.WEB_MSG_SENDER_ID;
const appId = process.env.WEB_APP_ID;
if (!key) {
  throw new Error(
    "can not initialze firebase app, because apiKey is undefined",
  );
}
if (!domain) {
  throw new Error(
    "can not initialze firebase app, because authDomain is undefined",
  );
}
if (!projectId) {
  throw new Error(
    "can not initialze firebase app, because projectId is undefined",
  );
}
if (!storageBucket) {
  throw new Error(
    "can not initialze firebase app, because storageBucket is undefined",
  );
}
if (!msgSenderId) {
  throw new Error(
    "can not initialze firebase app, because msgSenderId is undefined",
  );
}
if (!appId) {
  throw new Error("can not initialze firebase app, because appId is undefined");
}
const config: FirebaseOptions = {
  apiKey: key,
  authDomain: domain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: msgSenderId,
  appId: appId,
};

export const initFirebase = (mode: string) => {
  return new Promise<{
    firebaseApp?: FirebaseApp;
    auth: Auth;
    fdb: Firestore;
    func: Functions;
  }>((resolve, reject) => {
    try {
      if (mode === "production") {
        console.log("[initFirebase] init in production mode");

        const firebaseApp = initializeApp(config);
        const auth = getAuth(firebaseApp);
        const fdb = getFirestore(firebaseApp);
        const func = getFunctions(firebaseApp);
        resolve({ firebaseApp: firebaseApp, auth: auth, fdb: fdb, func: func });
      } else if (mode === "development") {
        console.log("[initFirebase] init in development mode");

        const firebaseApp = initializeApp(config);
        const auth = getAuth();
        connectAuthEmulator(auth, "http://127.0.0.1:9099");

        const fdb = getFirestore();
        connectFirestoreEmulator(fdb, "127.0.0.1", 8182);

        const func = getFunctions();
        connectFunctionsEmulator(func, "127.0.0.1", 5011);

        resolve({ firebaseApp: firebaseApp, auth: auth, fdb: fdb, func: func });
      } else {
        reject("the mode is not one of 'production' or 'development'.");
      }
    } catch (err) {
      reject(err);
    }
  });
};
