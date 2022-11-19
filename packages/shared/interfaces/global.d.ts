export interface costomeElectronAPI {
  versions: { node: () => string; chrome: () => string; electron: () => string };
  send: { close: () => void };
}

declare global {
  interface Window {
    electronAPI: costomeElectronAPI;
  }
}
