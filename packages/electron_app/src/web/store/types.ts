import { Doya } from "@doit/shared";
import { Dispatch } from "react";

import type { Auth } from "firebase/auth";
import type {
  Firestore,
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type { Functions, HttpsCallable } from "firebase/functions";
import {
  FirestoreUserType,
  CreateUserRecordParams,
} from "@doit/shared/interfaces/firestore/convert_types";

export enum PageType {
  ongoing = 1,
  finish = 2,
  all = 3,
}

type TodoId = Doya.Todo["id"];

export type TodoMeneType = { id: TodoId; x: number; y: number };

// close 和 add 用不到 id 所以 null 就行
export type TodoFormTypes =
  | { formType: "close" | "add"; id: null }
  | { formType: "edit"; id: TodoId };

export type EditTodoData = { id: TodoId; todo: string; date: string };

export type AppState = {
  todos: Doya.Todo[];
  routines: Doya.Routine[];
  isInit: boolean;
  todoMenu: TodoMeneType;
  pageType: PageType;
  changeTodoForm: TodoFormTypes;
  auth: Auth | undefined;
  func: Functions | undefined;
  createUserRecordFunc:
    | HttpsCallable<CreateUserRecordParams, unknown>
    | undefined;
  fdb: Firestore | undefined;
  fdbUserDocRef:
    | ((uid: string) => DocumentReference<FirestoreUserType>)
    | undefined;
  fdbTodoCollRef: CollectionReference<Doya.Todo> | undefined;
  fdbTodoDocRef: ((todoId: string) => DocumentReference<Doya.Todo>) | undefined;
  fdbRoutineCollRef: CollectionReference<Doya.Routine> | undefined;
  fdbRoutineDocRef:
    | ((routineId: string) => DocumentReference<Doya.Routine>)
    | undefined;
  userSetting: FirestoreUserType | undefined;
};

export type AppActionType<T, P> = P extends undefined
  ? {
      type: T;
      payload?: P;
    }
  : {
      type: T;
      payload: P;
    };

export type AppAction =
  | AppActionType<"addTodo", Doya.Todo>
  | AppActionType<"deleteTodo", TodoId>
  | AppActionType<"setTodos", Doya.Todo[]>
  | AppActionType<"editTodo", EditTodoData>
  | AppActionType<"toggleFinish", { id: TodoId; nowFinish: boolean }>
  | AppActionType<"changePageType", PageType>
  | AppActionType<"changeTodoForm", TodoFormTypes>
  | AppActionType<"setTodoMenu", TodoMeneType>
  | AppActionType<"setRoutines", Doya.Routine[]>
  | AppActionType<"addRoutine", Doya.Routine>
  | AppActionType<"clearAllSchedule", undefined>
  | AppActionType<"changeUserSetting", FirestoreUserType>
  | AppActionType<"init", AppState>;

export type AppReducer<T, A> = (state: T, actioin: A) => AppState;

export type AppCtx = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};
