// dependencies lib
import { contextBridge, ipcRenderer } from "electron";

import type { costomeElectronAPI } from "../../shared/interfaces/global";

const api: costomeElectronAPI = {
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  send: {
    close: () => ipcRenderer.send("close-window"),
    getAppMode: () => ipcRenderer.invoke("get:appMode"),
  },
};

contextBridge.exposeInMainWorld("electronAPI", api);
