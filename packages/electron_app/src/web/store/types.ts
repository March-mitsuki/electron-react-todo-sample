import { ToDoit } from "@doit/shared";
import { Dispatch } from "react";

export type PageType = "finish" | "ongoing" | "all";

export type AppState = {
  todo: ToDoit.Todo[];
  pageType: PageType;
  isTaskAdding: boolean;
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
  | AppActionType<"changeTaskAdding", boolean>;

export type AppReducer<T, A> = (state: T, actioin: A) => AppState;

export type AppCtx = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};
