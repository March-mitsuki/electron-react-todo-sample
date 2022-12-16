import { ToDoit } from "@doit/shared";
import { Dispatch } from "react";

import type { Auth } from "firebase/auth";
import type { Firestore, CollectionReference, DocumentReference } from "firebase/firestore";
import { Todo } from "@doit/shared/interfaces/todo_type";

export enum PageType {
  ongoing = 1,
  finish = 2,
  all = 3,
}

type TodoId = ToDoit.Todo["id"];

export type TodoMeneType = { id: TodoId; x: number; y: number };

// close 和 add 用不到 id 所以 null 就行
export type TodoFormTypes =
  | { formType: "close" | "add"; id: null }
  | { formType: "edit"; id: TodoId };

export type EditTodoData = { id: TodoId; todo: string; date: string };

export type AppState = {
  todo: ToDoit.Todo[];
  isInit: boolean;
  todoMenu: TodoMeneType;
  pageType: PageType;
  changeTodoForm: TodoFormTypes;
  auth: Auth | undefined;
  fdb: Firestore | undefined;
  fdbTodoCollRef: CollectionReference<Todo> | undefined;
  fdbTodoDocRef: ((todoId: string) => DocumentReference<Todo>) | undefined;
};

export type AppActionType<T, P> = {
  type: T;
  payload: P;
};

export type AppAction =
  | AppActionType<"addTodo", ToDoit.Todo>
  | AppActionType<"deleteTodo", TodoId>
  | AppActionType<"setTodo", ToDoit.Todo[]>
  | AppActionType<"editTodo", EditTodoData>
  | AppActionType<"toggleFinish", { id: TodoId; nowFinish: boolean }>
  | AppActionType<"changePageType", PageType>
  | AppActionType<"changeTodoForm", TodoFormTypes>
  | AppActionType<"setTodoMenu", TodoMeneType>
  | AppActionType<"setAuth", Auth>
  | AppActionType<"init", AppState>;

export type AppReducer<T, A> = (state: T, actioin: A) => AppState;

export type AppCtx = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};
