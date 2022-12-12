import { useEffect } from "react";

// local dependencies
import { useAppCtx } from "../store/store";
import {
  CtxMenu,
  TodoForm,
  MenuBar,
  FootBtn,
  TodoList,
  HeadBtn,
  Loading,
  BackGroundCanvas,
} from "../components";
import { weblogger } from "../utils";

const Home: React.FC = () => {
  const { state } = useAppCtx();

  useEffect(() => {
    if (!state.isInit) {
      return;
    }
    if (!state.auth?.currentUser) {
      weblogger.warn("home", "not signin");
      location.href = "#/signin";
      return;
    }
  }, [state.isInit]); // eslint-disable-line

  return (
    <div className="font-semibold bg-NRyellow/80">
      <BackGroundCanvas></BackGroundCanvas>
      {state.isInit ? (
        <>
          {state.todoMenu.id !== "" && <CtxMenu></CtxMenu>}
          <div className="h-6 bg-NRblack flex justify-center items-center">
            <HeadBtn></HeadBtn>
          </div>
          <div className="h-[calc(100vh-1.5rem)] overflow-auto">
            <MenuBar></MenuBar>
            <div className="select-none electron-no-drag px-5 pt-1">
              <TodoList></TodoList>
            </div>
            <div className="flex justify-between px-5 py-3">
              <FootBtn></FootBtn>
            </div>
            {state.changeTodoForm.formType === "add" && <TodoForm></TodoForm>}
            {state.changeTodoForm.formType === "edit" && <TodoForm></TodoForm>}
          </div>
        </>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default Home;
