import type { IpcRendererEvent } from "electron";

// prettier-ignore
export type ArgumentTypes<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never; // eslint-disable-line @typescript-eslint/no-explicit-any

export type RendererInvokeType<E extends keyof IpcInvokeEventMap> = (
  ...args: ArgumentTypes<IpcInvokeEventMap[E]>
) => Promise<ReturnType<IpcInvokeEventMap[E]>>;

export type CustomeElectronAPI = {
  const: {
    nodeVersion: string;
    chromeVersion: string;
    electronVersion: string;
  };
  send: {
    [key in keyof IpcMainEventMap]: IpcMainEventMap[keyof IpcMainEventMap];
  };
  invoke: {
    [key in keyof IpcInvokeEventMap]: RendererInvokeType<
      keyof IpcInvokeEventMap
    >;
  };
  on: {
    emailVarification: (
      listener: (event: IpcRendererEvent, ...data: unknown[]) => void,
    ) => Electron.IpcRenderer;
  };
};

export type IpcInvokeEventMap = {
  getAppMode: () => "production" | "development";
  getOsLocale: () => string;
};

export type IpcMainEventMap = {
  closeWindow: () => void;
};

declare global {
  interface Window {
    electronAPI: CustomeElectronAPI;
  }
  namespace Electron {
    interface IpcRenderer {
      invoke<E extends keyof IpcInvokeEventMap>(
        channel: E,
        ...args: ArgumentTypes<IpcInvokeEventMap[E]>
      ): Promise<ReturnType<IpcInvokeEventMap[E]>>;

      send<E extends keyof IpcMainEventMap>(
        channel: E,
        ...args: ArgumentTypes<IpcMainEventMap[E]>
      ): void;
    }

    interface IpcMain {
      handle<E extends keyof IpcInvokeEventMap>(
        channel: E,
        listener: (
          event: IpcMainInvokeEvent,
          args: ArgumentTypes<IpcInvokeEventMap[E]>,
        ) => ReturnType<IpcInvokeEventMap[E]>,
      ): void;
      handleOnce<E extends keyof IpcInvokeEventMap>(
        channel: E,
        listener: IpcInvokeEventMap[E],
      ): void;

      on<E extends keyof IpcMainEventMap>(
        channel: E,
        listener: (
          event: IpcMainEvent,
          args: ArgumentTypes<IpcMainEventMap[E]>,
        ) => void,
      ): this;
      once<E extends keyof IpcMainEventMap>(
        channel: E,
        listener: (
          event: IpcMainEvent,
          args: ArgumentTypes<IpcMainEventMap[E]>,
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
