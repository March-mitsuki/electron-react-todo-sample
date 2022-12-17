// dependencies lib
import { contextBridge, ipcRenderer } from "electron";

import type { CustomeElectronAPI } from "../../shared/interfaces/global";

const api: CustomeElectronAPI = {
  const: {
    nodeVersion: process.versions.node,
    chromeVersion: process.versions.chrome,
    electronVersion: process.versions.electron,
  },
  send: {
    close: () => ipcRenderer.send("close-window"),
  },
  invoke: {
    getAppMode: () => ipcRenderer.invoke("get:appMode"),
  },
};

contextBridge.exposeInMainWorld("electronAPI", api);
