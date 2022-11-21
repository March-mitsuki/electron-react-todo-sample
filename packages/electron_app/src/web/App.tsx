import "./index.css";

import { useReducer } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

// local dependencies
import { appReducer, initialState, initReducer } from "./store/reducer";
import { appCtx } from "./store/store";
import Edit from "./pages/edit";
import Home from "./pages/home";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "edit/:todoId",
    element: <Edit />,
  },
]);

const App = () => {
  const [appState, appDispatch] = useReducer(appReducer, initialState, initReducer);
  const ctxProviderState = { state: appState, dispatch: appDispatch };

  return (
    <appCtx.Provider value={ctxProviderState}>
      <RouterProvider router={router} />
    </appCtx.Provider>
  );
};

export default App;
