import "./index.css";

import { useEffect, useMemo, useReducer } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

// local dependencies
import { appReducer, initialState, initReducer } from "./store/reducer";
import { appCtx } from "./store/store";
import Edit from "./pages/edit";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import { weblogger } from "./utils";
import { collection, getDocs } from "firebase/firestore";
import { todoConverter } from "./utils/firestore/converter";

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
    initReducer()
      .then((result) => {
        appDispatch({ type: "init", payload: result });
        weblogger.nomal("App", "init reducer successfully");
      })
      .catch((err) => weblogger.err("App", err));
  }, []);

  useEffect(() => {
    if (!appState.auth) {
      weblogger.err("App", "appState.auth is undefinded");
      return;
    }
    appState.auth.onAuthStateChanged((user) => {
      if (user) {
        weblogger.info("App", "user sign in successfully");
        if (!appState.fdb) {
          weblogger.err("on user signin", "fdb is undefined");
          return;
        }
        getDocs(collection(appState.fdb, "todos", "v1", user.uid))
          .then((snapshot) => {
            const todos = todoConverter.fromFirestore(snapshot);
            appDispatch({ type: "setTodo", payload: todos });
          })
          .catch((err) => {
            weblogger.err("on user signin", err);
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
