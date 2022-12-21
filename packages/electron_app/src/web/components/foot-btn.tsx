import { useState } from "react";

import { useAppCtx } from "../store/store";

const FootBtn: React.FC = () => {
  const { dispatch } = useAppCtx();
  const eleAPI = window.electronAPI;

  const [createBtnHover, setCreateBtnHover] = useState(false);
  const [closeBtnHover, setCloseBtnHover] = useState(false);
  return (
    <>
      <label
        onMouseEnter={() => setCreateBtnHover(true)}
        onMouseLeave={() => setCreateBtnHover(false)}
        className={
          createBtnHover
            ? "relative select-none cursor-pointer flex items-center gap-1 pr-2 pl-5 py-1 text-NRyellow bg-NRblack"
            : "relative select-none cursor-pointer flex items-center gap-1 pr-2 pl-5 py-1 text-NRblack bg-NRgray"
        }
      >
        {createBtnHover ? (
          <>
            <div className=" absolute left-0 h-[32px] w-[5px] bg-NRgray"></div>
            <div className=" absolute left-2 h-[32px] w-[2px] bg-NRgray"></div>
          </>
        ) : (
          <>
            <div className=" absolute left-0 h-[32px] w-[5px] bg-NRblack"></div>
            <div className=" absolute left-2 h-[32px] w-[2px] bg-NRblack"></div>
          </>
        )}
        <button
          onClick={() =>
            dispatch({
              type: "changeTodoForm",
              payload: { formType: "add", id: null },
            })
          }
        >
          创建新任务
        </button>
      </label>
      <label
        onMouseEnter={() => setCloseBtnHover(true)}
        onMouseLeave={() => setCloseBtnHover(false)}
        className={
          closeBtnHover
            ? "relative select-none cursor-pointer flex items-center gap-1 pr-2 pl-5 py-1 text-NRyellow bg-NRblack"
            : "relative select-none cursor-pointer flex items-center gap-1 pr-2 pl-5 py-1 text-NRblack bg-NRgray"
        }
      >
        {closeBtnHover ? (
          <>
            <div className=" absolute left-0 h-[32px] w-[5px] bg-NRgray"></div>
            <div className=" absolute left-2 h-[32px] w-[2px] bg-NRgray"></div>
          </>
        ) : (
          <>
            <div className=" absolute left-0 h-[32px] w-[5px] bg-NRblack"></div>
            <div className=" absolute left-2 h-[32px] w-[2px] bg-NRblack"></div>
          </>
        )}
        <button onClick={() => eleAPI.send.closeWindow()}>关闭悬浮窗</button>
      </label>
    </>
  );
};

export default FootBtn;
