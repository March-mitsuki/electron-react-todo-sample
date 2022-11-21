import { ToDoit } from "@doit/shared";
import { Dispatch } from "react";

export enum PageType {
  ongoing = 1,
  finish = 2,
  all = 3,
}

export type TodoMeneType = { id: number; x: number; y: number };

// close 和 add 用不到 id 所以 null 就行
export type todoFormTypes =
  | { formType: "close" | "add"; id: null }
  | { formType: "edit"; id: number };

export type AppState = {
  todo: ToDoit.Todo[];
  isInit: boolean;
  todoMenu: TodoMeneType;
  pageType: PageType;
  changeTodoForm: todoFormTypes;
};

export type AppActionType<T, P> = {
  type: T;
  paylod: P;
};

export type AppAction =
  | AppActionType<"addTodo", ToDoit.Todo>
  | AppActionType<"deleteTodo", number>
  | AppActionType<"setTodo", ToDoit.Todo[]>
  | AppActionType<"toggleFinish", { id: number; nowFinish: boolean }>
  | AppActionType<"changePageType", PageType>
  | AppActionType<"changeTodoForm", todoFormTypes>
  | AppActionType<"setTodoMenu", TodoMeneType>;

export type AppReducer<T, A> = (state: T, actioin: A) => AppState;

export type AppCtx = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};
