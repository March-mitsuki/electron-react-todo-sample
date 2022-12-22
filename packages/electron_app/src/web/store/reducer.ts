import { DateTime } from "luxon";
import { collection, doc } from "firebase/firestore";
import {
  parseCronExpression,
  TimerBasedCronScheduler as scheduler,
} from "cron-schedule";

// local dependencies
import { browserlogger as logger } from "white-logger/esm/browser";
import { initFirebase } from "../utils/initFirebase";

// type
import { AppAction, AppReducer, AppState, PageType } from "./types";
import { Doya } from "@doit/shared";
import {
  routineConverter,
  todoConverter,
  userConverter,
} from "../utils/firestore/converter";
import { httpsCallable } from "firebase/functions";

export const appReducer: AppReducer<AppState, AppAction> = (state, action) => {
  const { type, payload } = action;
  if (type === "addTodo") {
    state.todos.push(payload);
    return { ...state, todos: state.todos };
    //
  } else if (type === "deleteTodo") {
    const idx = state.todos.findIndex((x) => x.id === payload);
    state.todos.splice(idx, 1);
    return { ...state, todos: state.todos };
    //
  } else if (type === "editTodo") {
    const changeTodoIdx = state.todos.findIndex((x) => x.id === payload.id);
    const dc = state.todos.map((x) => x);
    if (changeTodoIdx < 0) {
      logger.err(
        "edit-task",
        "can not find edit task index",
        state.changeTodoForm,
      );
      return state;
    }
    const changeTodo = dc[changeTodoIdx];
    const newFinishDate = DateTime.fromFormat(payload.date, "yyLLdd");
    changeTodo.finish_date = newFinishDate;
    changeTodo.content = payload.todo;
    return { ...state, todos: dc };
    //
  } else if (type === "setTodos") {
    return { ...state, todos: payload };
    //
  } else if (type === "toggleFinish") {
    const idx = state.todos.findIndex((x) => x.id === payload.id);
    state.todos[idx].is_finish = !payload.nowFinish;
    return { ...state, todos: state.todos };
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
  } else if (type === "setRoutines") {
    logger.info("reducer", "setRoutines called", payload);

    payload.forEach((elem) => {
      const cron = parseCronExpression(elem.cron_str);
      scheduler.setInterval(cron, () => {
        new Notification("YouDoya", { body: elem.content });
      });
    });
    return { ...state, routines: payload };
    //
  } else if (type === "addRoutine") {
    logger.info("reducer", "setRoutines called", payload);

    const cron = parseCronExpression(payload.cron_str);
    scheduler.setInterval(cron, () => {
      new Notification("YouDoya", { body: payload.content });
    });
    state.routines.push(payload);
    return { ...state, routines: state.routines };
  } else if (type === "changeUserSetting") {
    return { ...state, userSetting: payload };
  } else if (type === "init") {
    return payload;
  } else {
    throw new Error(`undefined action`);
  }
};

export const initialState: AppState = {
  todos: [
    new Doya.Todo({
      id: "",
      user_id: "",
      content: "正在连接服务器...",
      create_date: DateTime.now(),
      finish_date: DateTime.now(),
    }),
  ],
  routines: [
    new Doya.Routine({
      id: "",
      user_id: "",
      content: "正在连接服务器...",
      cron_str: "",
      time_num: -1,
      time_unit: Doya.timeUnitMin,
    }),
  ],
  isInit: false,
  todoMenu: { id: "", x: 0, y: 0 },
  pageType: PageType.ongoing,
  changeTodoForm: { formType: "close", id: null },
  auth: undefined,
  func: undefined,
  createUserRecordFunc: undefined,
  fdb: undefined,
  fdbUserDocRef: undefined,
  fdbTodoCollRef: undefined,
  fdbTodoDocRef: undefined,
  fdbRoutineCollRef: undefined,
  fdbRoutineDocRef: undefined,
  userSetting: undefined, // will init when user sign in.
};

export const initReducer = async (): Promise<AppState> => {
  const eleAPI = window.electronAPI;
  const mode = await eleAPI.invoke.getAppMode();
  const { auth, fdb, func } = await initFirebase(mode);

  const createUserRecord = httpsCallable(func, "createUserRecord");

  const userDocRef: AppState["fdbUserDocRef"] = (uid) => {
    return doc(fdb, "private", "v1", "users", uid).withConverter(userConverter);
  };
  const todoCollRef = collection(fdb, "private", "v1", "todos").withConverter(
    todoConverter,
  );
  const todoDocRef: AppState["fdbTodoDocRef"] = (todoId) => {
    return doc(fdb, "private", "v1", "todos", todoId).withConverter(
      todoConverter,
    );
  };

  const routineCollRef = collection(
    fdb,
    "private",
    "v1",
    "routines",
  ).withConverter(routineConverter);
  const routineDocRef: AppState["fdbRoutineDocRef"] = (routineId) => {
    return doc(fdb, "private", "v1", "routines", routineId).withConverter(
      routineConverter,
    );
  };

  return {
    ...initialState,
    isInit: true,
    auth: auth,
    func: func,
    createUserRecordFunc: createUserRecord,
    fdb: fdb,
    fdbUserDocRef: userDocRef,
    fdbTodoCollRef: todoCollRef,
    fdbTodoDocRef: todoDocRef,
    fdbRoutineCollRef: routineCollRef,
    fdbRoutineDocRef: routineDocRef,
  };
};
