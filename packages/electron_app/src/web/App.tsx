import "./index.css";

import { useEffect, useReducer, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";

// local dependencies
import { appReducer, initialState, initReducer } from "./store/reducer";

// type
import { ToDoit } from "../../../shared";

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState, initReducer);

  const eleAPI = window.electronAPI;
  const closeHandler = () => {
    eleAPI.send.close();
  };

  useEffect(() => {
    eleAPI.send
      .getAllTodo()
      .then((data) => dispatch({ type: "setTodo", paylod: data }))
      .catch((err) => console.log("get all todo err", err));
    if (!canvasRef.current) {
      return;
    }
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) {
      return;
    }
    canvasCtx.strokeStyle = "#9d9986";
    canvasCtx.lineWidth = 0.5;
    canvasCtx.beginPath();
    for (let w = 5; w < window.screen.height; w += 5) {
      // 竖线
      canvasCtx.moveTo(w, 0);
      canvasCtx.lineTo(w, window.screen.width);
    }
    for (let h = 5; h < window.screen.width; h += 5) {
      // 横线
      canvasCtx.moveTo(0, h);
      canvasCtx.lineTo(window.screen.width, h);
    }
    canvasCtx.stroke();
  }, [eleAPI.send]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <div className="font-semibold bg-NRyellow/80">
        <canvas ref={canvasRef} className="absolute -z-10 h-screen w-screen"></canvas>
        <div className="h-6 bg-NRblack/80 text-center">
          <div className="text-NRyellow select-none">Become a superman</div>
        </div>
        <div className="h-[calc(100vh-1.5rem)] overflow-auto">
          <div className="grid grid-cols-3 gap-2 pb-2 px-5 pt-2">
            <div className="text-NRblack bg-NRgray">
              <div className="flex items-center justify-center gap-1">
                <div className="h-[10px] w-[10px] bg-NRblack"></div>
                <div className="truncate">未完成</div>
              </div>
            </div>
            <div className="text-NRblack bg-NRgray">
              <div className="flex items-center justify-center gap-1">
                <div className="h-[10px] w-[10px] bg-NRblack"></div>
                <div className="truncate">已结束</div>
              </div>
            </div>
            <div className="text-NRblack bg-NRgray">
              <div className="flex items-center justify-center gap-1">
                <div className="h-[10px] w-[10px] bg-NRblack"></div>
                <div className="truncate">新任务</div>
              </div>
            </div>
          </div>
          <div className="w-screen h-1 bg-NRblack"></div>
          <div className="select-none electron-no-drag px-5 pt-1">
            {state.todo.map((elem, idx) => (
              <label
                key={idx}
                htmlFor={`todo${idx}`}
                className="flex gap-1 items-center justify-between"
              >
                <div className="relative flex items-center gap-1">
                  <input
                    id={`todo${idx}`}
                    type="checkbox"
                    className="peer appearance-none border-2 h-[15px] w-[15px] rounded-sm border-NRblack hover:outline-[1px] hover:outline hover:outline-NRorange"
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-NRblack absolute text-opacity-0 peer-checked:text-opacity-100"
                  />
                  <div className="text-NRblack">{elem.content}</div>
                </div>
                <div className="text-NRblack">{elem.finish_date_str}</div>
              </label>
            ))}
          </div>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-sm text-NRblack hover:bg-NRblack hover:text-NRyellow "
            onClick={() =>
              dispatch({
                type: "addTodo",
                paylod: new ToDoit.Todo({
                  content: "新建",
                  create_date: DateTime.now(),
                  finish_date: DateTime.now(),
                }),
              })
            }
          >
            push
          </button>
          <div>{JSON.stringify(state.todo[0].weekday)}</div>
          <div className="flex justify-end px-5 pb-3">
            <button
              onClick={closeHandler}
              className="flex items-center gap-1 px-2 py-1 rounded-sm text-NRblack hover:bg-NRblack hover:text-NRyellow "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
