import "./index.css";

import { useEffect, useMemo, useReducer } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { browserlogger as logger } from "white-logger/esm/browser";
import { getDocs, query, where } from "firebase/firestore";
import {
  parseCronExpression,
  TimerBasedCronScheduler as scheduler,
} from "cron-schedule";

// local dependencies
import { appReducer, initialState, initReducer } from "./store/reducer";
import { appCtx } from "./store/store";
import Edit from "./pages/edit";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import { ToDoit } from "@doit/shared";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
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
]);

const App = () => {
  const [appState, appDispatch] = useReducer(appReducer, initialState);
  const ctxProviderState = { state: appState, dispatch: appDispatch };

  useMemo(() => {
    const cron = parseCronExpression("*/1 * * * *");
    scheduler.setInterval(cron, () => {
      logger.info("App", "corn excuted now. next will:", cron.getNextDate());
    });
    initReducer()
      .then((result) => {
        appDispatch({ type: "init", payload: result });
        logger.nomal("App", "init reducer successfully");
      })
      .catch((err) => logger.err("App", err));
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
        if (!appState.fdbTodoCollRef) {
          logger.err("on user signin", "collection ref is undefiend");
          return;
        }
        const q = query(
          appState.fdbTodoCollRef,
          where("user_id", "==", user.uid),
        );
        getDocs(q)
          .then((snap) => {
            const todos: ToDoit.Todo[] = [];
            snap.docs.forEach((doc) => {
              todos.push(doc.data());
            });
            appDispatch({ type: "setTodo", payload: todos });
          })
          .catch((err) => {
            logger.err("on user signin", err);
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
