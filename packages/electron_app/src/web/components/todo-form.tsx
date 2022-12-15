import { DateTime } from "luxon";
import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { browserlogger as logger } from "white-logger/esm/browser";

import { ToDoit } from "@doit/shared";
import { useAppCtx } from "../store/store";
import { EditTodoData } from "../store/types";
import { todoConverter } from "../utils/firestore/converter";
import { dateToObj } from "@doit/shared/utils/date";
import { ClientFirestoreTodo } from "@doit/shared/interfaces/firestore";

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
      const _year = currentTodo.finish_date_obj.year.toString();
      const year = _year[_year.length - 2] + _year[_year.length - 1];
      logger.info("edit-form", "date obj:", currentTodo.finish_date_obj);

      const _month = currentTodo.finish_date_obj.month;
      let month = "";
      if (_month > 0 && _month < 10) {
        month = "0" + _month.toString();
      }

      const _day = currentTodo.finish_date_obj.day;
      let day = "";
      if (_day > 0 && _day < 10) {
        day = "0" + _day.toString();
      }
      return {
        todo: currentTodo.content,
        date: `${year}${month}${day}`,
      };
    } else {
      return {
        todo: "",
        date: "",
      };
    }
  });

  const submitNewTodo = () => {
    if (todoIptData.date === "" || todoIptData.todo === "") {
      alert("不可添加空白任务");
      return;
    }
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
      finish_date.year < DateTime.now().year &&
      finish_date.month < DateTime.now().month &&
      finish_date.day < DateTime.now().day
    ) {
      alert("你难道要穿越到过去完成这个任务吗? 请检查你的时间");
      return;
    }
    const newTodo = new ToDoit.Todo({
      id: Date.now().toString(),
      create_date: DateTime.now(),
      finish_date: finish_date,
      content: todoIptData.todo,
    });

    if (state.changeTodoForm.formType === "add") {
      if (!state.fdb) {
        logger.err("todoForm - addTodo", "fdb is undefined");
        return state;
      }
      if (!state.auth?.currentUser) {
        logger.err("todoForm - addTodo", "auth is undefined");
        return state;
      }
      const collectionRef = collection(
        state.fdb,
        "todos",
        "v1",
        state.auth.currentUser.uid,
      ).withConverter(todoConverter);
      addDoc(collectionRef, newTodo)
        .then((data) => {
          logger.nomal("form - addTodo", "doc write successfully:", data.id);
          newTodo.id = data.id;
          dispatch({ type: "addTodo", payload: newTodo });
        })
        .catch((err) => logger.err("reducer - addTodo", "firebase add doc err:", err));
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
      if (!state.fdb) {
        logger.err("todoForm - addTodo", "fdb is undefined");
        return state;
      }
      if (!state.auth?.currentUser) {
        logger.err("tofoForm - addTodo", "auth is undefined");
        return state;
      }
      const newFinishDate = DateTime.fromFormat(editData.date, "yyLLdd");
      const updateData: Partial<ClientFirestoreTodo> = {
        content: editData.todo,
        finish_date: newFinishDate.toISO(),
        finish_date_obj: dateToObj({
          date: newFinishDate,
          timezone: "Asia/Tokyo",
          locale: "zh",
        }),
      };
      const docRef = doc(
        state.fdb,
        "todos",
        "v1",
        state.auth.currentUser.uid,
        state.changeTodoForm.id,
      );
      updateDoc(docRef, updateData)
        .then(() => {
          logger.nomal("todo-from", "updated successfullt");
          dispatch({ type: "editTodo", payload: editData });
          dispatch({ type: "changeTodoForm", payload: { formType: "close", id: null } });
        })
        .catch((err) => {
          logger.err("todo - form", "edit todo err:", err);
        });
    } else {
      logger.err("todo-from", "incurrent from type", state.changeTodoForm);
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
