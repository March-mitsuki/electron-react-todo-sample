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
      } else {
        location.href = "#/signin";
      }
    });
  }, [appState.auth]);

  return (
    <appCtx.Provider value={ctxProviderState}>
      <RouterProvider router={router} />
    </appCtx.Provider>
  );
};

export default App;
