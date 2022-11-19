import { DateTime } from "luxon";

// type
import { ToDoit } from "../../../../shared";
// import { todoType } from "@doit/sha";

export const appReducer: AppReducer<AppState, AppActionType> = (state, action) => {
  switch (action.type) {
    case "addTodo":
      state.todo.push(action.paylod);
      return { todo: state.todo };
    case "deleteTodo":
      state.todo.pop();
      return { todo: state.todo };
    case "setTodo":
      return { todo: action.paylod };
    default:
      throw new Error(`undefined action`);
  }
};

export const initialState = {
  todo: [
    new ToDoit.Todo({
      content: "尚未连接服务器",
      create_date: DateTime.now(),
      finish_date: DateTime.now(),
    }),
  ],
};

export const initReducer = (): AppState => {
  return {
    todo: [
      new ToDoit.Todo({
        content: "已重置",
        create_date: DateTime.now(),
        finish_date: DateTime.now(),
      }),
    ],
  };
};

export type AppState = typeof initialState;

type AppAction<T, P> = {
  type: T;
  paylod: P;
};
type AppActionType =
  | AppAction<"addTodo", ToDoit.Todo>
  | AppAction<"deleteTodo", number>
  | AppAction<"setTodo", ToDoit.Todo[]>;

type AppReducer<T, A> = (state: T, actioin: A) => AppState;
