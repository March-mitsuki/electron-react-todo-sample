import { Todo } from "./todo_type";

export interface costomeElectronAPI {
  versions: { node: () => string; chrome: () => string; electron: () => string };
  send: { close: () => void; getAllTodo: () => Promise<Todo[]> };
}

declare global {
  interface Window {
    electronAPI: costomeElectronAPI;
  }
  namespace Electron {}
  namespace NodeJS {
    interface ProcessEnv {
      DOYA_ROOT: string | undefined;
      DOYA_SERVER_PORT: string | undefined;
      WEB_APIKEY: string | undefined;
      WEB_AUTH_DOMAIN: string | undefined;
      DOYA_FIREBASE_SECRET_JSON: string | undefined;
    }
  }
}
