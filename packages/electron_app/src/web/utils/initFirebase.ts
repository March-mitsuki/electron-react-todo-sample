import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";

import type { FirebaseApp } from "@firebase/app";
import type { Auth } from "firebase/auth";

// init firebase app
const config = {
  apiKey: "AIzaSyDik441PceFFsvEbqXlODPKS9QtTsZc1Zc",
  authDomain: "gcp-leaning-01-web.firebaseapp.com",
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
