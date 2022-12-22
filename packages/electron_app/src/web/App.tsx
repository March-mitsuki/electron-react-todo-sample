import "./index.css";

import { useEffect, useMemo, useReducer } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { browserlogger as logger } from "white-logger/esm/browser";
import { getDocs, getDoc, query, where } from "firebase/firestore";

// local dependencies
import { appReducer, initialState, initReducer } from "./store/reducer";
import { appCtx } from "./store/store";
import Edit from "./pages/edit";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Routine from "./pages/routine";

import { Doya } from "@doit/shared";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    // element: <Routine />,
  },
  {
    path: "edit/:todoId",
    element: <Edit />,
  },
  {
    path: "signin",
    element: <Signin />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "routine",
    element: <Routine />,
  },
]);

const App = () => {
  const [appState, appDispatch] = useReducer(appReducer, initialState);
  const ctxProviderState = { state: appState, dispatch: appDispatch };

  useMemo(() => {
    initReducer()
      .then((result) => {
        appDispatch({ type: "init", payload: result });
        logger.normal("App", "init reducer successfully");
      })
      .catch((err) => logger.err("App", "init reducer err:", err));
  }, []);

  useEffect(() => {
    if (!appState.auth) {
      logger.err("App", "appState.auth is undefinded");
      return;
    }
    appState.auth.onAuthStateChanged((user) => {
      if (user) {
        logger.info("App", "user sign in successfully");
        if (!appState.fdb) {
          logger.err("on user signin", "fdb is undefined");
          return;
        }
        if (
          !appState.fdbTodoCollRef ||
          !appState.fdbRoutineCollRef ||
          !appState.fdbUserDocRef
        ) {
          logger.err("on user signin", "fdb ref is undefiend");
          return;
        }

        const todoQuery = query(
          appState.fdbTodoCollRef,
          where("user_id", "==", user.uid),
        );
        getDocs(todoQuery)
          .then((snap) => {
            const todos: Doya.Todo[] = [];
            snap.docs.forEach((doc) => {
              todos.push(doc.data());
            });
            appDispatch({ type: "setTodos", payload: todos });
          })
          .catch((err) => {
            logger.err("on user signin", "get todos err:", err);
          });

        const routineQuery = query(
          appState.fdbRoutineCollRef,
          where("user_id", "==", user.uid),
        );
        getDocs(routineQuery)
          .then((snap) => {
            const routines: Doya.Routine[] = [];
            snap.docs.forEach((doc) => {
              routines.push(doc.data());
            });
            appDispatch({ type: "setRoutines", payload: routines });
          })
          .catch((err) => {
            logger.err("on user signin", "get routines err:", err);
          });

        getDoc(appState.fdbUserDocRef(user.uid))
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
            appDispatch({ type: "changeUserSetting", payload: data });
          })
          .catch((err) => {
            logger.err("on user signin", "get user setting err:", err);
          });
        location.href = "#/";
      } else {
        location.href = "#/signin";
      }
    });
  }, [appState.auth]); // eslint-disable-line

  return (
    <appCtx.Provider value={ctxProviderState}>
      <RouterProvider router={router} />
    </appCtx.Provider>
  );
};

export default App;
