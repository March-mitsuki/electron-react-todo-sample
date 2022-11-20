import "./index.css";

import { useReducer } from "react";

// local dependencies
import { appReducer, initialState, initReducer } from "./store/reducer";
import { appCtx } from "./store/store";
import Wrapper from "./components/wrapper";

const App = () => {
  const [appState, appDispatch] = useReducer(appReducer, initialState, initReducer);
  const ctxProviderState = { state: appState, dispatch: appDispatch };

  return (
    <appCtx.Provider value={ctxProviderState}>
      <Wrapper></Wrapper>
    </appCtx.Provider>
  );
};

export default App;
