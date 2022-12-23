import { browserlogger as logger } from "white-logger/esm/browser";
import { getDocs, getDoc, query, where } from "firebase/firestore";
import { User } from "firebase/auth";

import { AppAction, AppState } from "../store/types";
import { Doya } from "@doit/shared";

export const initAppStore = (
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  user: User,
) => {
  if (!state.fdb) {
    logger.err("on user signin", "fdb is undefined");
    return;
  }
  if (
    !state.fdbTodoCollRef ||
    !state.fdbRoutineCollRef ||
    !state.fdbUserDocRef
  ) {
    logger.err("on user signin", "fdb ref is undefiend");
    return;
  }

  const todoQuery = query(
    state.fdbTodoCollRef,
    where("user_id", "==", user.uid),
  );
  getDocs(todoQuery)
    .then((snap) => {
      const todos: Doya.Todo[] = [];
      snap.docs.forEach((doc) => {
        todos.push(doc.data());
      });
      dispatch({ type: "setTodos", payload: todos });
    })
    .catch((err) => {
      logger.err("on user signin", "get todos err:", err);
    });

  const routineQuery = query(
    state.fdbRoutineCollRef,
    where("user_id", "==", user.uid),
  );
  getDocs(routineQuery)
    .then((snap) => {
      const routines: Doya.Routine[] = [];
      snap.docs.forEach((doc) => {
        routines.push(doc.data());
      });
      dispatch({ type: "setRoutines", payload: routines });
    })
    .catch((err) => {
      logger.err("on user signin", "get routines err:", err);
    });

  getDoc(state.fdbUserDocRef(user.uid))
    .then((snap) => {
      const data = snap.data();
      if (!data) {
        logger.err(
          "on user signin",
          "get user setting:",
          "snap.data() is undefined.",
        );
        return;
      }
      dispatch({ type: "changeUserSetting", payload: data });
    })
    .catch((err) => {
      logger.err("on user signin", "get user setting err:", err);
    });
};
