import { sortBy } from "sort-by-typescript";
import { browserlogger as logger } from "white-logger/esm/browser";

// local dependencies
import { useAppCtx } from "../store/store";

// type
import type { Todo } from "@doit/shared/interfaces/todo_type";
import { DateTime } from "luxon";
import { PageType } from "../store/types";
import { updateDoc } from "firebase/firestore";

const TodoList: React.FC = () => {
  const { state, dispatch } = useAppCtx();

  const handleListCtxMenu = (e: React.MouseEvent, elem: Todo) => {
    e.preventDefault();
    console.log("right click", elem.id);
    dispatch({
      type: "setTodoMenu",
      payload: {
        id: elem.id,
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  const handleFinishToggle = (todo: Todo) => {
    if (!state.fdbTodoDocRef) {
      logger.err("todo list", "toggle finish -> todo doc ref is undefined");
      return;
    }
    updateDoc(state.fdbTodoDocRef(todo.id), {
      is_finish: !todo.is_finish,
    })
      .then(() => {
        dispatch({
          type: "toggleFinish",
          payload: { id: todo.id, nowFinish: todo.is_finish },
        });
      })
      .catch((err) => {
        logger.err("", "toggle finish update doc err:", err);
      });
  };

  const priorityNode = (todo: Todo) => {
    if (todo.priority === 2) {
      return (
        <div className=" absolute left-[3.3px] flex items-center justify-center text-NRblack text-xs text-opacity-100 peer-checked:text-opacity-0 ">
          {todo.sPriority()}
        </div>
      );
    } else if (todo.priority === 5) {
      return (
        <div className=" absolute left-[3.1px] flex items-center justify-center text-NRblack text-xs text-opacity-100 peer-checked:text-opacity-0 ">
          {todo.sPriority()}
        </div>
      );
    } else {
      return (
        <div className=" absolute left-[3.5px] flex items-center justify-center text-NRblack text-xs text-opacity-100 peer-checked:text-opacity-0 ">
          {todo.sPriority()}
        </div>
      );
    }
  };

  const listNode = (elem: Todo) => {
    return (
      <label
        key={elem.id}
        htmlFor={`todo${elem.id}`}
        onContextMenu={(e) => handleListCtxMenu(e, elem)}
        className=" flex gap-1 items-center justify-between cursor-pointer "
      >
        {state.todoMenu.id === elem.id ? (
          <>
            <div className="flex items-center gap-1">
              <div className="h-[11px] w-[11px] mx-[2px] bg-NRorange rotate-45"></div>
              <div className="text-NRorange truncate w-[calc(100vw/3)]">
                {elem.content}
              </div>
            </div>
          </>
        ) : (
          <div className="relative flex items-center gap-1">
            <input
              id={`todo${elem.id}`}
              type="checkbox"
              checked={elem.is_finish}
              onChange={() => handleFinishToggle(elem)}
              className="peer appearance-none border-2 h-[15px] w-[15px] border-NRblack hover:outline-[2px] hover:outline hover:outline-NRorange"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-[17px] h-[17px] -left-[1px] text-NRblack absolute text-opacity-0 peer-checked:text-opacity-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            {priorityNode(elem)}
            <div className="text-NRblack truncate w-[calc(100vw/3)] ">
              {elem.content}
            </div>
          </div>
        )}
        <div
          className={
            state.todoMenu.id === elem.id
              ? " text-NRorange truncate"
              : " text-NRblack truncate"
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
      {state.todos.sort(sortBy("priority", "finish_date")).map((elem) => {
        console.log("map render once");
        if (state.pageType === PageType.ongoing) {
          if (!elem.is_finish) {
            return listNode(elem);
          }
        } else if (state.pageType === PageType.finish) {
          if (elem.is_finish) {
            return listNode(elem);
          }
        } else {
          return listNode(elem);
        }
      })}
      {state.todos.length === 0 && (
        <div className=" text-NRblack text-center ">尚未创建任务</div>
      )}
    </>
  );
};

export default TodoList;
