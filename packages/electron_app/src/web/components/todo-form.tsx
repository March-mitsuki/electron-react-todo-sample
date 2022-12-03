import { DateTime } from "luxon";
import { useState } from "react";

import { ToDoit } from "@doit/shared";
import { useAppCtx } from "../store/store";
import { weblogger } from "../utils";
import { EditTodoData } from "../store/types";

type TodoInputData = {
  todo: string;
  date: string;
};

const TodoForm: React.FC = () => {
  const { state, dispatch } = useAppCtx();
  const [submitBtnHover, setSubmitBtnHover] = useState(false);
  const [cancelBtnHover, setCancelBtnHover] = useState(false);
  const [todoIptData, setTodoIptData] = useState<TodoInputData>(() => {
    if (state.changeTodoForm.formType === "edit") {
      const idx = state.todo.findIndex((x) => x.id === state.changeTodoForm.id);
      const currentTodo = state.todo[idx];
      const dateYearStr = currentTodo.finish_date_obj.year.toString();
      const dateYear = Number(
        dateYearStr[dateYearStr.length - 1] + dateYearStr[dateYearStr.length - 2],
      );
      if (isNaN(dateYear)) {
        weblogger.err("todo-form", "can not find date year", dateYearStr, dateYear);
        return {
          todo: "err",
          date: "can not get date",
        };
      }
      return {
        todo: currentTodo.content,
        date: `${dateYear}${currentTodo.finish_date_obj.month}${currentTodo.finish_date_obj.day}`,
      };
    } else {
      return {
        todo: "",
        date: "",
      };
    }
  });

  const submitNewTodo = () => {
    const date = todoIptData.date;
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
    if (
      finish_date.year < DateTime.now().year ||
      finish_date.month < DateTime.now().month ||
      finish_date.day < DateTime.now().day
    ) {
      alert("你难道要穿越到过去完成这个任务吗? 请检查你的时间");
      return;
    }
    const newTodo = new ToDoit.Todo({
      id: Date.now(),
      create_date: DateTime.now(),
      finish_date: finish_date,
      content: todoIptData.todo,
    });
    if (state.changeTodoForm.formType === "add") {
      dispatch({ type: "addTodo", payload: newTodo });
      setTodoIptData({
        todo: "",
        date: "",
      });
    } else if (state.changeTodoForm.formType === "edit") {
      const editData: EditTodoData = {
        id: state.changeTodoForm.id,
        todo: todoIptData.todo,
        date: todoIptData.date,
      };
      dispatch({ type: "editTodo", payload: editData });
      dispatch({ type: "changeTodoForm", payload: { formType: "close", id: null } });
    } else {
      weblogger.err("todo-from", "incurrent from type", state.changeTodoForm);
    }
    return;
  };

  return (
    <>
      <div className=" w-screen h-[2px] bg-NRblack mb-1"></div>
      <label className=" relative flex flex-col electron-no-drag mb-1">
        <div className="absolute left-[10px] top-[7px] h-[10px] w-[10px] bg-NRyellow rotate-45"></div>
        <input
          type="text"
          placeholder="e.g.征服世界"
          value={todoIptData.todo}
          onChange={(e) =>
            setTodoIptData((pre) => {
              return { ...pre, todo: e.target.value };
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
          value={todoIptData.date}
          onChange={(e) => {
            setTodoIptData((pre) => {
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
        <div className={" flex items-center gap-1 " + " mt-2 ml-2 z-10 "}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 370.74 192"
            className={submitBtnHover ? " h-5 w-5 " : " h-5 w-5 invisible "}
            fill="#4e4b42"
          >
            <polygon
              points="368.86 96 102.52 22.82 .86 96 102.52 169.18 368.86 96"
              stroke="currentColor"
              strokeMiterlimit={10}
            />
            <circle cx="337.36" cy="22.5" r="22" stroke="currentColor" strokeMiterlimit={10} />
            <circle cx="337.36" cy="169.5" r="22" stroke="currentColor" strokeMiterlimit={10} />
          </svg>
          <button
            onClick={submitNewTodo}
            onMouseEnter={() => setSubmitBtnHover(true)}
            onMouseLeave={() => setSubmitBtnHover(false)}
            className={
              " flex-auto pl-2 mr-6 " +
              " text-NRblack bg-NRgray select-none cursor-pointer text-start " +
              " hover:mr-0 hover:bg-NRblack hover:text-NRyellow "
            }
          >
            {state.changeTodoForm.formType === "add" && "再努努力"}
            {state.changeTodoForm.formType === "edit" && "修改任务"}
          </button>
        </div>
        <div className={" flex items-center gap-1 " + " mb-2 ml-2 z-10 "}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 370.74 192"
            className={cancelBtnHover ? " h-5 w-5" : " h-5 w-5 invisible "}
            fill="#4e4b42"
          >
            <polygon
              points="368.86 96 102.52 22.82 .86 96 102.52 169.18 368.86 96"
              stroke="currentColor"
              strokeMiterlimit={10}
            />
            <circle cx="337.36" cy="22.5" r="22" stroke="currentColor" strokeMiterlimit={10} />
            <circle cx="337.36" cy="169.5" r="22" stroke="currentColor" strokeMiterlimit={10} />
          </svg>
          <button
            onClick={() =>
              dispatch({ type: "changeTodoForm", payload: { formType: "close", id: null } })
            }
            onMouseEnter={() => setCancelBtnHover(true)}
            onMouseLeave={() => setCancelBtnHover(false)}
            className={
              " flex-auto pl-2 mr-6 " +
              " text-NRblack bg-NRgray select-none cursor-pointer text-start " +
              " hover:mr-0 hover:bg-NRblack hover:text-NRyellow"
            }
          >
            {state.changeTodoForm.formType === "add" && "还是算了"}
            {state.changeTodoForm.formType === "edit" && "就按原来的"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TodoForm;
