import { useRef } from "react";
import { deleteDoc } from "firebase/firestore";
import { browserlogger as logger } from "white-logger/esm/browser";

import { useAppCtx } from "../store/store";

const CtxMenu: React.FC = () => {
  const { state, dispatch } = useAppCtx();

  const handleDeleteTodo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!state.fdbTodoDocRef) {
      logger.err("ctx-menu", "delete todo -> doc ref is undefined");
      return;
    }
    logger.info("ctx-menu", "will delete:", state.todoMenu.id);
    deleteDoc(state.fdbTodoDocRef(state.todoMenu.id))
      .then(() => {
        logger.normal("ctx-menu", "delete todo successfully");
        dispatch({ type: "deleteTodo", payload: state.todoMenu.id });
      })
      .catch((err) => {
        logger.err("ctx-menu", "delete todo:", err);
      });
  };

  const ctxMenuWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={() =>
        dispatch({ type: "setTodoMenu", payload: { id: "", x: 0, y: 0 } })
      }
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
