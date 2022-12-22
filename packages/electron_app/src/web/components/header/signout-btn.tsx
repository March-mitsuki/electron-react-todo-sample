import { browserlogger as logger } from "white-logger/esm/browser";
import { signOut } from "firebase/auth";

import { useAppCtx } from "../../store/store";
import { useState } from "react";

const SignOutBtn: React.FC = () => {
  const { state } = useAppCtx();
  const [isHover, setIsHover] = useState(false);

  const handleSignOut: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!state.auth || !state.auth.currentUser) {
      logger.err("head-btn", "state.auth is undefinde");
      return;
    }
    signOut(state.auth)
      .then(() => logger.normal("head-btn", "sign out successfully"))
      .catch((err) => logger.err("head-btn", "sign out err", err));
  };
  return (
    <div
      className="electron-no-drag cursor-pointer "
      onClick={handleSignOut}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {!isHover && (
        <div className=" relative h-[12px] w-[12px] bg-NRyellow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className=" absolute -left-[1px] -top-[0.5px] text-NRblack w-[14px] h-[14px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
            />
          </svg>
        </div>
      )}
      {isHover && (
        <>
          <div className="h-[12px] w-[12px]">{/* skelton */}</div>
          <div className=" absolute right-[10px] top-[5px] bg-NRyellow h-[16px] w-[68px]">
            <div className=" absolute -top-[2px] right-[16px] text-NRblack ">
              <div className=" pt-[2px] text-xs select-none">SignOut</div>
            </div>
          </div>
          <div className=" absolute top-[7px] w-[12px] h-[12px] bg-NRblack">
            {/* icon & wrapper box */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className=" absolute -left-[1px] -top-[0.5px] text-NRyellow w-[14px] h-[14px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default SignOutBtn;
