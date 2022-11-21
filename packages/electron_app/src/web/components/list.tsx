import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// local dependencies
import { useAppCtx } from "../store/store";

// type
import type { Todo } from "@doit/shared/interfaces/todo_type";
import { DateTime } from "luxon";

const TodoList: React.FC = () => {
  const { state, dispatch } = useAppCtx();

  const listCtxMenuHandler = (e: React.MouseEvent, elem: Todo) => {
    e.preventDefault();
    console.log("right click", elem.id);
    dispatch({
      type: "setTodoMenu",
      paylod: {
        id: elem.id,
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  const listNode = (elem: Todo, idx: number) => {
    return (
      <label
        key={idx}
        htmlFor={`todo${idx}`}
        onContextMenu={(e) => listCtxMenuHandler(e, elem)}
        className=" flex gap-1 items-center justify-between cursor-pointer "
      >
        {state.todoMenu.id === elem.id ? (
          <>
            <div className="flex items-center gap-1">
              <div className="h-[11px] w-[11px] mx-[2px] bg-NRorange rotate-45"></div>
              <div className="text-NRorange">{elem.content}</div>
            </div>
          </>
        ) : (
          <div className="relative flex items-center gap-1">
            <input
              id={`todo${idx}`}
              type="checkbox"
              checked={elem.is_finish}
              onChange={() =>
                dispatch({
                  type: "toggleFinish",
                  paylod: { id: elem.id, nowFinish: elem.is_finish },
                })
              }
              className="peer appearance-none border-2 h-[15px] w-[15px] border-NRblack hover:outline-[2px] hover:outline hover:outline-NRorange"
            />
            <FontAwesomeIcon
              icon={faCheck}
              className="text-NRblack absolute text-opacity-0 peer-checked:text-opacity-100"
            />
            <div className="text-NRblack truncate w-[calc(100vw/2)] ">{elem.content}</div>
          </div>
        )}
        <div
          className={
            state.todoMenu.id === elem.id
              ? "text-NRorange w-[90px] truncate"
              : "text-NRblack w-[90px] truncate"
          }
        >
          {elem.finish_date_obj.year > DateTime.now().year
            ? `${elem.finish_date_obj.year}-${elem.finish_date_obj.month}-${elem.finish_date_obj.day}(${elem.finish_date_obj.weekday})`
            : `${elem.finish_date_obj.month}-${elem.finish_date_obj.day}(${elem.finish_date_obj.weekday})`}
        </div>
      </label>
    );
  };

  return (
    <>
      {state.todo.map((elem, idx) => {
        console.log("map render once");
        if (state.pageType === "ongoing") {
          if (!elem.is_finish) {
            return listNode(elem, idx);
          }
        } else if (state.pageType === "finish") {
          if (elem.is_finish) {
            return listNode(elem, idx);
          }
        } else {
          return listNode(elem, idx);
        }
      })}
    </>
  );
};

export default TodoList;
