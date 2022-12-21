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
    closeWindow: () => ipcRenderer.send("closeWindow"),
  },
  invoke: {
    getAppMode: () => ipcRenderer.invoke("getAppMode"),
    getOsLocale: () => ipcRenderer.invoke("getOsLocale"),
  },
};

contextBridge.exposeInMainWorld("electronAPI", api);
