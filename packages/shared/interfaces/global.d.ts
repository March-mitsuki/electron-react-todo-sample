// prettier-ignore
export type ArgumentTypes<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never; // eslint-disable-line @typescript-eslint/no-explicit-any

export type RendererInvokeType<E extends keyof R2MIpcInvokeEventMap> = (
  ...args: ArgumentTypes<R2MIpcInvokeEventMap[E]>
) => Promise<ReturnType<R2MIpcInvokeEventMap[E]>>;

export interface CustomeElectronAPI {
  const: {
    nodeVersion: string;
    chromeVersion: string;
    electronVersion: string;
  };
  send: {
    close: R2MIpcMainEventMap["close-window"];
  };
  invoke: {
    getAppMode: RendererInvokeType<"get:appMode">;
  };
}

export interface R2MIpcInvokeEventMap {
  "get:appMode": () => "production" | "development";
}

export interface R2MIpcMainEventMap {
  "close-window": () => void;
}

export interface M2RIpcEventMap {
  "display-tip": () => void;
}

declare global {
  interface Window {
    electronAPI: CustomeElectronAPI;
  }
  namespace Electron {
    interface IpcRenderer {
      invoke<E extends keyof R2MIpcInvokeEventMap>(
        channel: E,
        ...args: ArgumentTypes<R2MIpcInvokeEventMap[E]>
      ): Promise<ReturnType<R2MIpcInvokeEventMap[E]>>;

      send<E extends keyof R2MIpcMainEventMap>(
        channel: E,
        ...args: ArgumentTypes<R2MIpcMainEventMap[E]>
      ): void;
    }

    interface IpcMain {
      handle<E extends keyof R2MIpcInvokeEventMap>(
        channel: E,
        listener: (
          event: IpcMainInvokeEvent,
          args: ArgumentTypes<R2MIpcInvokeEventMap[E]>,
        ) => ReturnType<R2MIpcInvokeEventMap[E]>,
      ): void;
      handleOnce<E extends keyof R2MIpcInvokeEventMap>(
        channel: E,
        listener: R2MIpcInvokeEventMap[E],
      ): void;

      on<E extends keyof R2MIpcMainEventMap>(
        channel: E,
        listener: (
          event: IpcMainEvent,
          args: ArgumentTypes<R2MIpcMainEventMap[E]>,
        ) => void,
      ): this;
      once<E extends keyof R2MIpcMainEventMap>(
        channel: E,
        listener: (
          event: IpcMainEvent,
          args: ArgumentTypes<R2MIpcMainEventMap[E]>,
        ) => void,
      ): this;
    }
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
