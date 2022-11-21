import { useRef, useEffect, useMemo } from "react";

// local dependencies
import { useAppCtx } from "../store/store";
import { CtxMenu, AddTask, MenuBar, FootBtn, TodoList } from "../components";

const Home: React.FC = () => {
  const { state, dispatch } = useAppCtx();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eleAPI = window.electronAPI;

  useMemo(() => {
    if (state.isInit) {
      return;
    }
    eleAPI.send
      .getAllTodo()
      .then((data) => {
        dispatch({ type: "setTodo", paylod: data });
      })
      .catch((err) => console.log("get all todo err", err));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) {
      return;
    }
    canvasCtx.strokeStyle = "#9d9986";
    canvasCtx.beginPath();
    for (let w = 5; w < window.screen.height; w += 5) {
      // 竖线
      canvasCtx.moveTo(w, 0);
      canvasCtx.lineTo(w, window.screen.height);
    }
    for (let h = 5; h < window.screen.width; h += 5) {
      // 横线
      canvasCtx.moveTo(0, h);
      canvasCtx.lineTo(window.screen.width, h);
    }
    canvasCtx.stroke();
  }, []); // eslint-disable-line

  return (
    <div className="font-semibold bg-NRyellow/80">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="absolute -z-10 h-screen w-screen"
      ></canvas>
      {state.todoMenu.id > 0 && <CtxMenu></CtxMenu>}
      <div className="h-6 bg-NRblack flex justify-center items-center">
        <div className="text-NRyellow select-none text-sm">人类荣光永存</div>
      </div>
      <div className="h-[calc(100vh-1.5rem)] overflow-auto">
        <MenuBar></MenuBar>
        <div className="select-none electron-no-drag px-5 pt-1">
          <TodoList></TodoList>
        </div>
        <div className="flex justify-between px-5 py-3">
          <FootBtn></FootBtn>
        </div>
        {(state.taskFormType === "add" || state.taskFormType === "edit") && <AddTask></AddTask>}
      </div>
    </div>
  );
};

export default Home;
