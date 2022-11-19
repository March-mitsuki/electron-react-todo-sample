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
}
