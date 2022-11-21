import { DateTime } from "luxon";

import { ToDoit } from "@doit/shared";
import { useAppCtx } from "../store/store";

import { useRef, useState } from "react";

type TodoInputData = {
  todo: string;
  date: string;
};

const AddTodo: React.FC = () => {
  const { state, dispatch } = useAppCtx();
  const [newTodoIptData, setNewTodoIptData] = useState<TodoInputData>(() => {
    if (state.changeTodoForm.formType === "edit") {
      const idx = state.todo.findIndex((x) => x.id === state.changeTodoForm.id);
      const currentTodo = state.todo[idx];
      return {
        todo: currentTodo.content,
        date: `${currentTodo.finish_date_obj.year}${currentTodo.finish_date_obj.month}${currentTodo.finish_date_obj.day}`,
      };
    } else {
      return {
        todo: "",
        date: "",
      };
    }
  });

  const submitNewTodo = () => {
    const date = newTodoIptData.date;
    const year = Number(date.slice(0, 2));
    const month = Number(date.slice(2, 4));
    const day = Number(date.slice(4, 6));
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      alert("请按照yyLLdd的格式输入日期");
      return;
    }
    if (year === 0 || month > 12 || day > 31) {
      alert("请检查是否有不合适的日期,e.g.2月30日");
      return;
    }
    if (year % 100 !== 0 && year % 4 === 0 && month === 2 && day > 29) {
      alert("请检查是否有不合适的日期,e.g.2月30日");
      return;
    } else if (year % 100 === 0 && year % 400 === 0 && month === 2 && day > 29) {
      alert("请检查是否有不合适的日期,e.g.2月30日");
      return;
    } else if (month === 2 && day > 28) {
      alert(`${year}年没有2月29日`);
      return;
    }
    const finish_date = DateTime.fromFormat(date, "yyLLdd");
    if (finish_date < DateTime.now()) {
      alert("你难道要穿越到过去完成这个任务吗? 请检查你的时间");
      return;
    }
    const newTask = new ToDoit.Todo({
      id: Date.now(),
      create_date: DateTime.now(),
      finish_date: finish_date,
      content: newTodoIptData.todo,
    });
    dispatch({ type: "addTodo", paylod: newTask });
    setNewTodoIptData({
      todo: "",
      date: "",
    });
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
          value={newTodoIptData.todo}
          onChange={(e) =>
            setNewTodoIptData((pre) => {
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
          value={newTodoIptData.date}
          onChange={(e) => {
            setNewTodoIptData((pre) => {
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
          onClick={submitNewTodo}
          className={
            " ml-8 mt-2 mr-6 pl-2 text-NRblack bg-NRgray select-none cursor-pointer text-start " +
            " hover:mr-0 hover:bg-NRblack hover:text-NRyellow " +
            " z-10"
          }
          onMouseEnter={() => drawPointerAtCenter(90, 60, pointerCanvasRef.current)}
          onMouseLeave={() => clearCanvas(pointerCanvasRef.current)}
        >
          {state.changeTodoForm.formType === "add" && "再努努力"}
          {state.changeTodoForm.formType === "edit" && "修改任务"}
        </button>
        <button
          onClick={() =>
            dispatch({ type: "changeTodoForm", paylod: { formType: "close", id: null } })
          }
          className={
            " ml-8 mb-2 mr-6 pl-2 text-NRblack bg-NRgray select-none cursor-pointer text-start " +
            " hover:mr-0 hover:bg-NRblack hover:text-NRyellow" +
            " z-10"
          }
          onMouseEnter={() => drawPointerAtCenter(90, 155, pointerCanvasRef.current)}
          onMouseLeave={() => clearCanvas(pointerCanvasRef.current)}
        >
          {state.changeTodoForm.formType === "add" && "还是算了"}
          {state.changeTodoForm.formType === "edit" && "就按原来的"}
        </button>
      </div>
    </>
  );
};

export default AddTodo;
