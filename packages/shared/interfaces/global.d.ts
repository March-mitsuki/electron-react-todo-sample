export interface costomeElectronAPI {
  versions: { node: () => string; chrome: () => string; electron: () => string };
  send: {
    close: () => void;
    getAppMode: () => Promise<"production" | "development">;
  };
}

declare global {
  interface Window {
    electronAPI: costomeElectronAPI;
  }
  namespace Electron {
    // interface IpcRenderer {}
  }
  namespace NodeJS {
    interface ProcessEnv {
      DOYA_ROOT: string | undefined;
      DOYA_MODE: "production" | "development" | undefined;
      DOYA_SERVER_PORT: string | undefined;
      DOYA_FIREBASE_SECRET_JSON: string | undefined;
      WEB_APIKEY: string | undefined;
      WEB_AUTH_DOMAIN: string | undefined;
      WEB_PROJECT_ID: string | undefined;
      WEB_STORAGE_BUCKET: string | undefined;
      WEB_MSG_SENDER_ID: string | undefined;
      WEB_APP_ID: string | undefined;
    }
  }
}
