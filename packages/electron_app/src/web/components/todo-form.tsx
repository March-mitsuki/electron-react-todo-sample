import { DateTime } from "luxon";
import { useState } from "react";
import { addDoc, updateDoc } from "firebase/firestore";
import { browserlogger as logger } from "white-logger/esm/browser";

import { Doya } from "@doit/shared";
import { useAppCtx } from "../store/store";
import { EditTodoData } from "../store/types";
import { ClientFirestoreTodo } from "@doit/shared/interfaces/firestore";
import {
  Priority,
  toPriority,
  toPriorityStr,
} from "@doit/shared/interfaces/todo_type";

type TodoInputData = {
  todo: string;
  date: string;
  priority: Priority;
};

const TodoForm: React.FC = () => {
  const { state, dispatch } = useAppCtx();
  const [submitBtnHover, setSubmitBtnHover] = useState(false);
  const [cancelBtnHover, setCancelBtnHover] = useState(false);
  const [changePriority, setChangePriority] = useState(false);
  const [todoIptData, setTodoIptData] = useState<TodoInputData>(() => {
    if (state.changeTodoForm.formType === "edit") {
      const idx = state.todos.findIndex(
        (x) => x.id === state.changeTodoForm.id,
      );
      if (!state.userSetting) {
        logger.err("todo-form", "user setting is undefined.");
        return {
          todo: "",
          date: "",
          priority: 1,
        };
      }
      const currentTodo = state.todos[idx];
      const dateObj = currentTodo.parseDate({
        locale: state.userSetting.locale,
        timezone: state.userSetting.timezone,
      });
      const _year = dateObj.year.toString();
      const year = _year[_year.length - 2] + _year[_year.length - 1];

      const _month = dateObj.month;
      let month: string;
      if (_month > 0 && _month < 10) {
        month = "0" + _month.toString();
      } else {
        month = _month.toString();
      }

      const _day = dateObj.day;
      let day: string;
      if (_day > 0 && _day < 10) {
        day = "0" + _day.toString();
      } else {
        day = _day.toString();
      }
      return {
        todo: currentTodo.content,
        date: `${year}${month}${day}`,
        priority: currentTodo.priority,
      };
    } else {
      return {
        todo: "",
        date: "",
        priority: 1,
      };
    }
  });

  const submitNewTodo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (todoIptData.date === "" || todoIptData.todo === "") {
      alert("不可添加空白任务");
      return;
    }
    const date = todoIptData.date;
    if (date.length !== 6) {
      alert("请按照yyLLdd的格式输入日期");
      return;
    }
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
    } else if (
      year % 100 === 0 &&
      year % 400 === 0 &&
      month === 2 &&
      day > 29
    ) {
      alert("请检查是否有不合适的日期,e.g.2月30日");
      return;
    } else if (month === 2 && day > 28) {
      alert(`${year}年没有2月29日`);
      return;
    }
    const finish_date = DateTime.fromFormat(date, Doya.luxonDateFmt);
    if (
      finish_date.year < DateTime.now().year &&
      finish_date.month < DateTime.now().month &&
      finish_date.day < DateTime.now().day
    ) {
      alert("你难道要穿越到过去完成这个任务吗? 请检查你的时间");
      return;
    }
    if (!state.auth?.currentUser) {
      alert("你尚未登录");
      return;
    }
    const newTodo = new Doya.Todo({
      id: "",
      user_id: state.auth.currentUser.uid,
      create_date: DateTime.now(),
      finish_date: finish_date,
      content: todoIptData.todo,
      priority: todoIptData.priority,
    });

    if (state.changeTodoForm.formType === "add") {
      if (!state.fdb) {
        logger.err("todoForm - addTodo", "fdb is undefined");
        return state;
      }
      if (!state.fdbTodoCollRef) {
        logger.err("todo-form", "add todo -> collectron ref is undefined");
        return;
      }

      addDoc(state.fdbTodoCollRef, newTodo)
        .then((data) => {
          logger.nomal("form - addTodo", "doc write successfully:", data.id);
          newTodo.id = data.id;
          dispatch({ type: "addTodo", payload: newTodo });
        })
        .catch((err) =>
          logger.err("reducer - addTodo", "firebase add doc err:", err),
        );

      setTodoIptData({
        todo: "",
        date: "",
        priority: 1,
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
      const newFinishDate = DateTime.fromFormat(editData.date, "yyLLdd");
      const updateData: Partial<ClientFirestoreTodo> = {
        content: editData.todo,
        finish_date: newFinishDate.toISO(),
      };
      if (!state.fdbTodoDocRef) {
        logger.err("todo-form", "fdb todo doc ref is undefined");
        return;
      }
      updateDoc(state.fdbTodoDocRef(editData.id), updateData)
        .then(() => {
          logger.nomal("todo-from", "updated successfullt");
          dispatch({ type: "editTodo", payload: editData });
          dispatch({
            type: "changeTodoForm",
            payload: { formType: "close", id: null },
          });
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
      <label className=" relative flex flex-col electron-no-drag mb-1">
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
      <label className=" relative flex flex-col electron-no-drag">
        <div className="absolute left-[10px] top-[7px] h-[10px] w-[10px] bg-NRyellow rotate-45"></div>
        {changePriority && (
          <div className=" flex px-2 gap-2 bg-NRblack text-NRyellow pl-7 cursor-pointer select-none ">
            <div
              onClick={() => {
                setTodoIptData((pre) => {
                  return { ...pre, priority: toPriority("S") };
                });
                setChangePriority(false);
              }}
              className=" hover:text-NRorange "
            >
              S
            </div>
            <div
              onClick={() => {
                setTodoIptData((pre) => {
                  return { ...pre, priority: toPriority("A") };
                });
                setChangePriority(false);
              }}
              className=" hover:text-NRorange "
            >
              A
            </div>
            <div
              onClick={() => {
                setTodoIptData((pre) => {
                  return { ...pre, priority: toPriority("B") };
                });
                setChangePriority(false);
              }}
              className=" hover:text-NRorange "
            >
              B
            </div>
            <div
              onClick={() => {
                setTodoIptData((pre) => {
                  return { ...pre, priority: toPriority("C") };
                });
                setChangePriority(false);
              }}
              className=" hover:text-NRorange "
            >
              C
            </div>
            <div
              onClick={() => {
                setTodoIptData((pre) => {
                  return { ...pre, priority: toPriority("D") };
                });
                setChangePriority(false);
              }}
              className=" hover:text-NRorange "
            >
              D
            </div>
          </div>
        )}
        {!changePriority && (
          <div
            onClick={() => {
              setChangePriority(true);
            }}
            className={
              " px-2 bg-NRblack text-NRyellow pl-7 cursor-pointer select-none " +
              " hover:text-NRorange "
            }
          >
            {toPriorityStr(todoIptData.priority)}
          </div>
        )}
        <span className=" absolute right-4 text-NRyellow/30">优先级</span>
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
            <circle
              cx="337.36"
              cy="22.5"
              r="22"
              stroke="currentColor"
              strokeMiterlimit={10}
            />
            <circle
              cx="337.36"
              cy="169.5"
              r="22"
              stroke="currentColor"
              strokeMiterlimit={10}
            />
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
            {state.changeTodoForm.formType === "add" && "新建任务"}
            {state.changeTodoForm.formType === "edit" && "提交修改"}
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
            <circle
              cx="337.36"
              cy="22.5"
              r="22"
              stroke="currentColor"
              strokeMiterlimit={10}
            />
            <circle
              cx="337.36"
              cy="169.5"
              r="22"
              stroke="currentColor"
              strokeMiterlimit={10}
            />
          </svg>
          <button
            onClick={() =>
              dispatch({
                type: "changeTodoForm",
                payload: { formType: "close", id: null },
              })
            }
            onMouseEnter={() => setCancelBtnHover(true)}
            onMouseLeave={() => setCancelBtnHover(false)}
            className={
              " flex-auto pl-2 mr-6 " +
              " text-NRblack bg-NRgray select-none cursor-pointer text-start " +
              " hover:mr-0 hover:bg-NRblack hover:text-NRyellow"
            }
          >
            {state.changeTodoForm.formType === "add" && "取消新建"}
            {state.changeTodoForm.formType === "edit" && "放弃更改"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TodoForm;
