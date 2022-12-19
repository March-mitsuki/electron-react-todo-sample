import { Doya } from "@doit/shared";
import { addDoc } from "firebase/firestore";
import { useState } from "react";
import { browserlogger as logger } from "white-logger/esm/browser";
import { useAppCtx } from "../store/store";

type RoutineIptData = {
  content: string;
  cronNum: number;
  cronUnit: Doya.TimeUnit;
};

const defaultCronNum = 30;
const defaultCronUnit: RoutineIptData["cronUnit"] = Doya.timeUnitMin;

const RoutineFrom: React.FC = () => {
  const { state, dispatch } = useAppCtx();
  const [submitBtnHover, setSubmitBtnHover] = useState(false);
  const [cancelBtnHover, setCancelBtnHover] = useState(false);
  const [changeCronUnit, setChangeCronUnit] = useState(false);

  const [inputData, setInputData] = useState<RoutineIptData>({
    content: "",
    cronNum: defaultCronNum,
    cronUnit: defaultCronUnit,
  });

  const submitNewRoutine: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (inputData.content === "") {
      alert("循环名称不可为空");
      return;
    }
    if (inputData.cronNum <= 0) {
      alert("时间不可小于0");
      return;
    }
    if (inputData.cronUnit === Doya.timeUnitMin && inputData.cronNum > 60) {
      alert(`不存在 [${inputData.cronNum}分钟] 这种时间`);
      return;
    }
    if (inputData.cronUnit === Doya.timeUnitHour && inputData.cronNum > 24) {
      alert("目前不支持24小时以上的时间");
      return;
    }

    let cronStr = "";
    if (inputData.cronUnit === Doya.timeUnitMin) {
      cronStr = `*/${inputData.cronNum} * * * *`;
    } else if (inputData.cronUnit === Doya.timeUnitHour) {
      cronStr = `* */${inputData.cronNum} * * *`;
    } else {
      alert("不支持的单位");
      return;
    }

    if (!state.auth?.currentUser) {
      logger.err("routine-from", "auth current user is undefined");
      return;
    }
    const newRoutine = new Doya.Routine({
      id: "",
      user_id: state.auth.currentUser.uid,
      cron_str: cronStr,
      content: inputData.content,
      time_num: inputData.cronNum,
      time_unit: inputData.cronUnit,
    });

    logger.info("routine-from", "will post:", newRoutine);
    if (!state.fdbRoutineCollRef) {
      logger.err("routine-from", "fdb routine coll ref is undefined.");
      return;
    }
    addDoc(state.fdbRoutineCollRef, newRoutine)
      .then((data) => {
        newRoutine.id = data.id;
        dispatch({ type: "addRoutine", payload: newRoutine });
      })
      .catch((err) => {
        logger.err("routine-from", "add new routine err", err);
      });

    setInputData({
      content: "",
      cronNum: defaultCronNum,
      cronUnit: defaultCronUnit,
    });
  };

  return (
    <>
      <div className=" w-screen h-[2px] bg-NRblack mb-1"></div>
      <label className=" relative flex flex-col electron-no-drag mb-1">
        <div className="absolute left-[10px] top-[7px] h-[10px] w-[10px] bg-NRyellow rotate-45"></div>
        <input
          type="text"
          placeholder="e.g. 休息一下"
          value={inputData.content}
          onChange={(e) =>
            setInputData((pre) => {
              return { ...pre, content: e.target.value };
            })
          }
          autoComplete="off"
          className={
            "px-2 bg-NRblack focus:ring-0 focus:outline-0 text-NRyellow pl-7 " +
            " placeholder:text-NRyellow/30"
          }
        />
        <span className=" absolute right-4 text-NRyellow/30">循环名称</span>
      </label>
      <div className=" relative flex flex-col electron-no-drag mb-1">
        <div className="absolute left-[10px] top-[7px] h-[10px] w-[10px] bg-NRyellow rotate-45"></div>
        <div className=" absolute left-7 text-NRyellow">每</div>
        {changeCronUnit && (
          <div className=" absolute text-NRyellow left-[75px] flex gap-2 cursor-pointer select-none ">
            <div
              onClick={() => {
                setInputData((pre) => {
                  return { ...pre, cronUnit: Doya.timeUnitMin };
                });
                setChangeCronUnit(false);
              }}
              className=" hover:text-NRorange "
            >
              分钟
            </div>
            <div
              onClick={() => {
                setInputData((pre) => {
                  return { ...pre, cronUnit: Doya.timeUnitHour };
                });
                setChangeCronUnit(false);
              }}
              className=" hover:text-NRorange "
            >
              小时
            </div>
          </div>
        )}
        {!changeCronUnit && (
          <div
            onClick={() => {
              logger.info("click");
              setChangeCronUnit(true);
            }}
            className={
              " absolute z-50 left-[75px] text-NRyellow cursor-pointer select-none " +
              " hover:text-NRorange "
            }
          >
            {Doya.toString_zh(inputData.cronUnit)}
          </div>
        )}
        <input
          type="text"
          value={inputData.cronNum}
          onChange={(e) =>
            setInputData((pre) => {
              const iptNum = Number(e.target.value);
              if (isNaN(iptNum)) {
                alert("请输入数字");
                return { ...pre, cronNum: defaultCronNum };
              }
              return { ...pre, cronNum: iptNum };
            })
          }
          autoComplete="off"
          className={
            " absolute left-[50px] w-[23px] bg-NRblack focus:ring-0 focus:outline-0 text-NRyellow "
          }
        />
        <div className="bg-NRblack h-[24px] w-screen"></div>
        <span className=" absolute right-4 text-NRyellow/30">循环时间</span>
      </div>
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
            onClick={submitNewRoutine}
            onMouseEnter={() => setSubmitBtnHover(true)}
            onMouseLeave={() => setSubmitBtnHover(false)}
            className={
              " flex-auto pl-2 mr-6 " +
              " text-NRblack bg-NRgray select-none cursor-pointer text-start " +
              " hover:mr-0 hover:bg-NRblack hover:text-NRyellow "
            }
          >
            提交循环
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
            onClick={() => logger.info("routine-from", "will close the form")}
            onMouseEnter={() => setCancelBtnHover(true)}
            onMouseLeave={() => setCancelBtnHover(false)}
            className={
              " flex-auto pl-2 mr-6 " +
              " text-NRblack bg-NRgray select-none cursor-pointer text-start " +
              " hover:mr-0 hover:bg-NRblack hover:text-NRyellow"
            }
          >
            取消新建
          </button>
        </div>
      </div>
    </>
  );
};

export default RoutineFrom;
