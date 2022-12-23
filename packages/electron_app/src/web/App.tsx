import "./index.css";

import { useEffect, useMemo, useReducer } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { browserlogger as logger } from "white-logger/esm/browser";
import { sendEmailVerification } from "firebase/auth";

// local dependencies
import Edit from "./pages/edit";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Routine from "./pages/routine";
import Verification from "./pages/verification";

import { appReducer, initialState, initReducer } from "./store/reducer";
import { appCtx } from "./store/store";
import { initAppStore } from "./utils";

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
  {
    path: "verification",
    element: <Verification />,
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
    appState.auth.onIdTokenChanged((user) => {
      if (user) {
        logger.info("App", "user sign in successfully");
        if (user.emailVerified === false) {
          sendEmailVerification(user, {
            url: "doyaptcl://open",
          }).catch((err) => {
            logger.err("App", "send email verification err:", err);
          });
          location.href = "#/verification";
          return;
        }

        initAppStore(appState, appDispatch, user);
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
