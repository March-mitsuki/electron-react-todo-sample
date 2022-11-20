import { DateTime } from "luxon";

// type
import { AppAction, AppReducer, AppState } from "./types";
import { ToDoit } from "@doit/shared";

export const appReducer: AppReducer<AppState, AppAction> = (state, action) => {
  const { type, paylod } = action;
  switch (type) {
    case "addTodo":
      state.todo.push(paylod);
      return { ...state, todo: state.todo };
    case "deleteTodo":
      state.todo.pop();
      return { ...state, todo: state.todo };
    case "setTodo":
      return { ...state, todo: paylod };
    case "toggleFinish": {
      const idx = state.todo.findIndex((x) => x.id === paylod.id);
      state.todo[idx].is_finish = !paylod.nowFinish;
      return { ...state, todo: state.todo };
    }
    case "changePageType":
      return { ...state, pageType: paylod };
    case "changeTaskAdding":
      return { ...state, isTaskAdding: paylod };
    default:
      throw new Error(`undefined action`);
  }
};

export const initialState: AppState = {
  todo: [
    new ToDoit.Todo({
      id: -1,
      content: "尚未连接服务器",
      create_date: DateTime.now(),
      finish_date: DateTime.now(),
    }),
  ],
  pageType: "ongoing",
  // isTaskAdding: false,
  isTaskAdding: true,
};

export const initReducer = (): AppState => {
  return initialState;
};
