import { useRef } from "react";
import { doc, deleteDoc } from "firebase/firestore";

import { useAppCtx } from "../store/store";
import { weblogger } from "../utils";

const CtxMenu: React.FC = () => {
  const { state, dispatch } = useAppCtx();

  const handleDeleteTodo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!state.fdb || !state.auth?.currentUser) {
      return;
    }
    weblogger.info("ctx-menu", "will delete:", state.todoMenu.id);
    deleteDoc(doc(state.fdb, "todos", "v1", state.auth.currentUser.uid, state.todoMenu.id))
      .then(() => {
        weblogger.nomal("ctx-menu", "delete todo successfully");
        dispatch({ type: "deleteTodo", payload: state.todoMenu.id });
      })
      .catch((err) => {
        weblogger.err("ctx-menu", "delete todo:", err);
      });
  };

  const ctxMenuWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={() => dispatch({ type: "setTodoMenu", payload: { id: "", x: 0, y: 0 } })}
      className=" absolute z-20 w-screen h-screen "
    >
      <div
        ref={ctxMenuWrapperRef}
        className=" absolute bg-NRgray w-[100px] shadow-lg drop-shadow-lg "
        style={{ left: state.todoMenu.x, top: state.todoMenu.y }}
      >
        <div className=" absolute bg-NRyellow/80 h-full w-[5px] left-1 "></div>
        <div className=" absolute bg-NRyellow/80 h-full w-[2px] left-3 "></div>
        <div className=" ml-5 my-1 flex flex-col ">
          <button
            onClick={handleDeleteTodo}
            className=" z-10 text-NRblack text-left pl-2 hover:bg-NRblack/80 hover:text-NRyellow "
          >
            删除
          </button>
          <button
            onClick={() =>
              dispatch({
                type: "changeTodoForm",
                payload: { formType: "edit", id: state.todoMenu.id },
              })
            }
            className=" z-10 text-NRblack text-left pl-2 hover:bg-NRblack/80 hover:text-NRyellow "
          >
            修改
          </button>
        </div>
      </div>
    </div>
  );
};

export default CtxMenu;
