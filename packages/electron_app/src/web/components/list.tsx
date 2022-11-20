import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// local dependencies
import { useAppCtx } from "../store/store";

const TodoList: React.FC = () => {
  const { state, dispatch } = useAppCtx();
  return (
    <>
      {state.todo.map((elem, idx) => {
        console.log("map render once");
        if (state.pageType === "ongoing") {
          if (!elem.is_finish) {
            return (
              <label
                key={idx}
                htmlFor={`todo${idx}`}
                className="flex gap-1 items-center justify-between cursor-pointer"
              >
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
                    className="peer appearance-none border-2 h-[15px] w-[15px] rounded-sm border-NRblack hover:outline-[2px] hover:outline hover:outline-NRorange"
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-NRblack absolute text-opacity-0 peer-checked:text-opacity-100"
                  />
                  <div className="text-NRblack">{elem.content}</div>
                </div>
                <div className="text-NRblack">{`${elem.finish_date_obj.month}-${elem.finish_date_obj.day}(${elem.finish_date_obj.weekday})`}</div>
              </label>
            );
          }
        } else if (state.pageType === "finish") {
          if (elem.is_finish) {
            return (
              <label
                key={idx}
                htmlFor={`todo${idx}`}
                className="flex gap-1 items-center justify-between cursor-pointer"
              >
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
                    className="peer appearance-none border-2 h-[15px] w-[15px] rounded-sm border-NRblack hover:outline-[2px] hover:outline hover:outline-NRorange"
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-NRblack absolute text-opacity-0 peer-checked:text-opacity-100"
                  />
                  <div className="text-NRblack">{elem.content}</div>
                </div>
                <div className="text-NRblack">{`${elem.finish_date_obj.month}-${elem.finish_date_obj.day}(${elem.finish_date_obj.weekday})`}</div>
              </label>
            );
          }
        } else {
          return (
            <label
              key={idx}
              htmlFor={`todo${idx}`}
              className="flex gap-1 items-center justify-between cursor-pointer"
            >
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
                  className="peer appearance-none border-2 h-[15px] w-[15px] rounded-sm border-NRblack hover:outline-[2px] hover:outline hover:outline-NRorange"
                />
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-NRblack absolute text-opacity-0 peer-checked:text-opacity-100"
                />
                <div className="text-NRblack">{elem.content}</div>
              </div>
              <div className="text-NRblack">{`${elem.finish_date_obj.month}-${elem.finish_date_obj.day}(${elem.finish_date_obj.weekday})`}</div>
            </label>
          );
        }
      })}
    </>
  );
};

export default TodoList;
