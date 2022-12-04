import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";

import type { FirebaseApp } from "@firebase/app";
import type { Auth } from "firebase/auth";

// init firebase app
const key = process.env.WEB_APIKEY;
const domain = process.env.WEB_AUTH_DOMAIN;
if (!key) {
  throw new Error("can not initialze firebase app, because apiKey is undefined");
}
if (!domain) {
  throw new Error("can not initialze firebase app, because authDomain is undefined");
}
const config = {
  apiKey: key,
  authDomain: domain,
};

export const initFirebase = () => {
  return new Promise<{ firebaseApp: FirebaseApp; auth: Auth }>((resolve, reject) => {
    try {
      const firebaseApp = initializeApp(config);
      const auth = getAuth(firebaseApp);
      resolve({ firebaseApp, auth });
    } catch (err) {
      reject(err);
    }
  });
};
