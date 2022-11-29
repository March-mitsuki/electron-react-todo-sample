import { useRef } from "react";
import { useAppCtx } from "../store/store";

const CtxMenu: React.FC = () => {
  const { state, dispatch } = useAppCtx();

  const ctxMenuWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={() => dispatch({ type: "setTodoMenu", payload: { id: -1, x: 0, y: 0 } })}
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
            onClick={() => dispatch({ type: "deleteTodo", payload: state.todoMenu.id })}
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
