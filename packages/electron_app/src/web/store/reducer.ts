import { DateTime } from "luxon";

// local dependencies
import { browserlogger as logger } from "white-logger/esm/browser";
import { initFirebase } from "../utils/initFirebase";

// type
import { AppAction, AppReducer, AppState, PageType } from "./types";
import { ToDoit } from "@doit/shared";
import { dateToObj } from "@doit/shared/utils/date";
import { collection, doc } from "firebase/firestore";

export const appReducer: AppReducer<AppState, AppAction> = (state, action) => {
  const { type, payload } = action;
  if (type === "addTodo") {
    state.todo.push(payload);
    return { ...state, todo: state.todo };
    //
  } else if (type === "deleteTodo") {
    const idx = state.todo.findIndex((x) => x.id === payload);
    state.todo.splice(idx, 1);
    return { ...state, todo: state.todo };
    //
  } else if (type === "editTodo") {
    const changeTodoIdx = state.todo.findIndex((x) => x.id === payload.id);
    const dc = state.todo.map((x) => x);
    if (changeTodoIdx < 0) {
      logger.err("edit-task", "can not find edit task index", state.changeTodoForm);
      return state;
    }
    const changeTodo = dc[changeTodoIdx];
    const newFinishDate = DateTime.fromFormat(payload.date, "yyLLdd");
    changeTodo.finish_date = newFinishDate;
    changeTodo.content = payload.todo;
    changeTodo.finish_date_obj = dateToObj({
      date: newFinishDate,
      timezone: "Asia/Tokyo",
      locale: "zh",
    });
    return { ...state, todo: dc };
    //
  } else if (type === "setTodo") {
    return { ...state, todo: payload };
    //
  } else if (type === "toggleFinish") {
    const idx = state.todo.findIndex((x) => x.id === payload.id);
    state.todo[idx].is_finish = !payload.nowFinish;
    return { ...state, todo: state.todo };
    //
  } else if (type === "changePageType") {
    return { ...state, pageType: payload };
    //
  } else if (type === "changeTodoForm") {
    return { ...state, changeTodoForm: payload };
    //
  } else if (type === "setTodoMenu") {
    return { ...state, todoMenu: payload };
    //
  } else if (type === "setAuth") {
    return { ...state, auth: payload };
    //
  } else if (type === "init") {
    return payload;
  } else {
    throw new Error(`undefined action`);
  }
};

export const initialState: AppState = {
  todo: [
    new ToDoit.Todo({
      id: "",
      user_id: "",
      content: "正在连接服务器...",
      create_date: DateTime.now(),
      finish_date: DateTime.now(),
    }),
  ],
  isInit: false,
  todoMenu: { id: "", x: 0, y: 0 },
  pageType: PageType.ongoing,
  //   changeTodoForm: { formType: "close", id: null },
  changeTodoForm: { formType: "add", id: null },
  auth: undefined,
  fdb: undefined,
  fdbTodoCollRef: undefined,
  fdbTodoDocRef: undefined,
};

export const initReducer = async (): Promise<AppState> => {
  const eleAPI = window.electronAPI;
  const mode = await eleAPI.send.getAppMode();
  const { auth, fdb } = await initFirebase(mode);
  const collRef = collection(fdb, "private", "v1", "todos");
  const docRef: AppState["fdbTodoDocRef"] = (todoId) => {
    return doc(fdb, "private", "v1", "todos", todoId);
  };

  return {
    ...initialState,
    isInit: true,
    auth: auth,
    fdb: fdb,
    fdbTodoCollRef: collRef,
    fdbTodoDocRef: docRef,
  };
};
