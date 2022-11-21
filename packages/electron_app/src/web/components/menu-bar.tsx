import { useAppCtx } from "../store/store";

const MenuBar: React.FC = () => {
  const { state, dispatch } = useAppCtx();

  return (
    <>
      <div className="grid grid-cols-3 gap-2 px-5 pt-2 select-none">
        <div
          onClick={() => dispatch({ type: "changePageType", paylod: "ongoing" })}
          className={
            state.pageType === "ongoing"
              ? "text-NRgray bg-NRblack cursor-pointer"
              : "text-NRblack bg-NRgray mb-2 cursor-pointer"
          }
        >
          <div className="flex items-center justify-center gap-1">
            <div
              className={
                state.pageType === "ongoing"
                  ? "h-[10px] w-[10px] bg-NRgray"
                  : "h-[10px] w-[10px] bg-NRblack"
              }
            ></div>
            <div className="truncate">进行中</div>
          </div>
        </div>
        <div
          onClick={() => dispatch({ type: "changePageType", paylod: "finish" })}
          className={
            state.pageType === "finish"
              ? "text-NRgray bg-NRblack cursor-pointer"
              : "text-NRblack bg-NRgray mb-2 cursor-pointer"
          }
        >
          <div className="flex items-center justify-center gap-1">
            <div
              className={
                state.pageType === "finish"
                  ? "h-[10px] w-[10px] bg-NRgray"
                  : "h-[10px] w-[10px] bg-NRblack"
              }
            ></div>
            <div className="truncate">已完成</div>
          </div>
        </div>
        <div
          onClick={() => dispatch({ type: "changePageType", paylod: "all" })}
          className={
            state.pageType === "all"
              ? "text-NRgray bg-NRblack cursor-pointer"
              : "text-NRblack bg-NRgray mb-2 cursor-pointer"
          }
        >
          <div className="flex items-center justify-center gap-1">
            <div
              className={
                state.pageType === "all"
                  ? "h-[10px] w-[10px] bg-NRgray"
                  : "h-[10px] w-[10px] bg-NRblack"
              }
            ></div>
            <div className="truncate">足迹</div>
          </div>
        </div>
      </div>
      <div className="w-screen h-1 bg-NRblack"></div>
    </>
  );
};

export default MenuBar;
