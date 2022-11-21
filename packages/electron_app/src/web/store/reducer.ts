import { DateTime } from "luxon";

// type
import { AppAction, AppReducer, AppState } from "./types";
import { ToDoit } from "@doit/shared";

export const appReducer: AppReducer<AppState, AppAction> = (state, action) => {
  const { type, paylod } = action;
  switch (type) {
    case "addTodo":
      state.todo.push(paylod);
      return { ...state, todo: state.todo, isInit: true };
    case "deleteTodo": {
      const idx = state.todo.findIndex((x) => x.id === paylod);
      state.todo.splice(idx, 1);
      return { ...state, todo: state.todo };
    }
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
    case "setTodoMenu":
      return { ...state, todoMenu: paylod };
    default:
      throw new Error(`undefined action`);
  }
};

export const initialState: AppState = {
  todo: [
    new ToDoit.Todo({
      id: -1,
      content: "正在连接服务器...",
      create_date: DateTime.now(),
      finish_date: DateTime.now(),
    }),
  ],
  isInit: false,
  todoMenu: { id: -1, x: 0, y: 0 },
  pageType: "ongoing",
  // isTaskAdding: false,
  isTaskAdding: true,
};

export const initReducer = (): AppState => {
  return initialState;
};
