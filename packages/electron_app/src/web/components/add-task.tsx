import { DateTime } from "luxon";

import { ToDoit } from "@doit/shared";
import { useAppCtx } from "../store/store";

import { useRef, useState } from "react";

const AddTask: React.FC = () => {
  const { state, dispatch } = useAppCtx();
  const [newTaskIptData, setNewTaskIptData] = useState({
    task: "",
    date: "",
  });

  const submitNewTask = () => {
    console.log("再努努力:", newTaskIptData);
    return;
  };

  const drawPointerAtCenter = (x: number, y: number, c: HTMLCanvasElement | null) => {
    if (!c) {
      return;
    }
    const ctx = c.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = "#4e4b42";
    ctx.beginPath();
    ctx.moveTo(x - 50, y - 10);
    ctx.lineTo(x, y);
    ctx.lineTo(x - 50, y + 10);
    ctx.lineTo(x - 70, y);
    ctx.moveTo(x, y - 15);
    ctx.arc(x - 5, y - 15, 5, 0, Math.PI * 2);
    ctx.moveTo(x, y + 15);
    ctx.arc(x - 5, y + 15, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = (c: HTMLCanvasElement | null) => {
    if (!c) {
      return;
    }
    const ctx = c.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, c.width, c.height);
    return;
  };

  const pointerCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <div className=" w-screen h-[2px] bg-NRblack mb-1"></div>
      <label className=" relative flex flex-col electron-no-drag mb-1">
        <div className="absolute left-[10px] top-[7px] h-[10px] w-[10px] bg-NRyellow rotate-45"></div>
        <input
          type="text"
          placeholder="e.g.征服世界"
          value={newTaskIptData.task}
          onChange={(e) =>
            setNewTaskIptData((pre) => {
              return { ...pre, task: e.target.value };
            })
          }
          autoComplete="off"
          className={
            "px-2 bg-NRblack focus:ring-0 focus:outline-0 text-NRyellow pl-7 " +
            " placeholder:text-NRyellow/30"
          }
        />
        <span className=" absolute right-4 text-NRyellow/30">任务名称</span>
      </label>
      <label className=" relative flex flex-col electron-no-drag">
        <div className="absolute left-[10px] top-[7px] h-[10px] w-[10px] bg-NRyellow rotate-45"></div>
        <input
          type="text"
          placeholder={`e.g.${DateTime.now().toFormat("yyLLdd")}`}
          value={newTaskIptData.date}
          onChange={(e) => {
            setNewTaskIptData((pre) => {
              return { ...pre, date: e.target.value };
            });
          }}
          autoComplete="off"
          className={
            "px-2 bg-NRblack focus:ring-0 focus:outline-0 text-NRyellow pl-7 " +
            " placeholder:text-NRyellow/30"
          }
        />
        <span className=" absolute right-4 text-NRyellow/30">完成日期</span>
      </label>
      <div className=" w-screen h-[2px] bg-NRblack my-1"></div>
      <div className=" relative w-screen flex flex-col gap-2 mb-5">
        <div className=" absolute bg-NRgray/70 h-full w-[8px] left-2"></div>
        <div className=" absolute bg-NRgray/70 h-full w-[3px] left-5"></div>
        <canvas
          ref={pointerCanvasRef}
          width={1032}
          height={216}
          className=" absolute h-full w-screen"
        ></canvas>
        <button
          onClick={submitNewTask}
          className={
            " ml-8 mt-2 mr-6 pl-2 text-NRblack bg-NRgray select-none cursor-pointer text-start " +
            " hover:mr-0 hover:bg-NRblack hover:text-NRyellow " +
            " z-10"
          }
          onMouseEnter={() => drawPointerAtCenter(90, 60, pointerCanvasRef.current)}
          onMouseLeave={() => clearCanvas(pointerCanvasRef.current)}
        >
          再努努力
        </button>
        <button
          onClick={() => dispatch({ type: "changeTaskAdding", paylod: false })}
          className={
            " ml-8 mb-2 mr-6 pl-2 text-NRblack bg-NRgray select-none cursor-pointer text-start " +
            " hover:mr-0 hover:bg-NRblack hover:text-NRyellow" +
            " z-10"
          }
          onMouseEnter={() => drawPointerAtCenter(90, 155, pointerCanvasRef.current)}
          onMouseLeave={() => clearCanvas(pointerCanvasRef.current)}
        >
          还是算了
        </button>
      </div>
    </>
  );
};

export default AddTask;
