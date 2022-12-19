import { useState } from "react";
import { Link } from "react-router-dom";

const LeftMenu: React.FC = () => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className=" electron-no-drag "
    >
      {!isHover && (
        <div className=" relative h-[12px] w-[12px] bg-NRyellow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className=" absolute -left-[2px] -top-[1px] text-NRblack w-[14px] h-[14px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
        </div>
      )}
      {isHover && (
        <>
          <div className=" electron-no-drag relative h-[12px] w-[12px] ">
            {/* skelton & menu list */}
            <div className=" electron-no-drag absolute z-50 -left-[2px] top-[0px] bg-NRgray flex flex-col pb-1 drop-shadow-lg shadow-lg ">
              <div className=" absolute bg-NRyellow left-[4px] h-full w-[4px] "></div>
              <div className=" absolute bg-NRyellow left-[10px] h-full w-[2px] "></div>
              <div className=" ml-[17px] mb-1 pb-[1px] px-2 border-b-2 border-NRyellow text-NRyellow text-xs select-none ">
                Menu
              </div>
              <Link
                to={"/"}
                className=" ml-[17px] px-2 text-left text-sm break-keep select-none text-NRblack hover:bg-NRblack hover:text-NRyellow "
              >
                待办
              </Link>
              <Link
                to={"routine"}
                className=" ml-[17px] px-2 text-left text-sm break-keep select-none text-NRblack hover:bg-NRblack hover:text-NRyellow "
              >
                循环
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftMenu;
