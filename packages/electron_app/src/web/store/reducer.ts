import { DateTime } from "luxon";

// type
import { AppAction, AppReducer, AppState, PageType } from "./types";
import { ToDoit } from "@doit/shared";

export const appReducer: AppReducer<AppState, AppAction> = (state, action) => {
  const { type, paylod } = action;
  if (type === "addTodo") {
    //
    state.todo.push(paylod);
    return { ...state, todo: state.todo, isInit: true };
  } else if (type === "deleteTodo") {
    //
    const idx = state.todo.findIndex((x) => x.id === paylod);
    state.todo.splice(idx, 1);
    return { ...state, todo: state.todo };
  } else if (type === "setTodo") {
    //
    return { ...state, todo: paylod };
  } else if (type === "toggleFinish") {
    //
    const idx = state.todo.findIndex((x) => x.id === paylod.id);
    state.todo[idx].is_finish = !paylod.nowFinish;
    return { ...state, todo: state.todo };
  } else if (type === "changePageType") {
    //
    return { ...state, pageType: paylod };
  } else if (type === "changeTodoForm") {
    //
    return { ...state, changeTodoForm: paylod };
  } else if (type === "setTodoMenu") {
    //
    return { ...state, todoMenu: paylod };
  } else {
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
  pageType: PageType.ongoing,
  //   changeTodoForm: { formType: "close", id: null },
  changeTodoForm: { formType: "add", id: null },
};

export const initReducer = (): AppState => {
  return initialState;
};
