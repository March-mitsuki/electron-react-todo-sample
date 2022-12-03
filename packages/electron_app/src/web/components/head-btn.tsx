import { weblogger } from "../utils";
import { useState } from "react";
import { signOut } from "firebase/auth";

import type { MouseEventHandler } from "react";
import { useAppCtx } from "../store/store";

const HeadBtn: React.FC = () => {
  const { state } = useAppCtx();
  const [isHover, setIsHover] = useState(false);
  const handleSignOut: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!state.auth) {
      weblogger.err("head-btn", "state.auth is undefinde");
      return;
    }
    signOut(state.auth)
      .then(() => weblogger.nomal("head-btn", "sign out successfully"))
      .catch((err) => weblogger.err("head-btn", "sign out err", err));
  };
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className=" text-NRyellow select-none text-sm "
    >
      {isHover ? (
        <button onClick={handleSignOut} className=" underline ">
          {"放弃任务(退出登录)"}
        </button>
      ) : (
        <span>人类荣光永存</span>
      )}
    </div>
  );
};

export default HeadBtn;