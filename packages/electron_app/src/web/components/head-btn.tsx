import { browserlogger as logger } from "white-logger/esm/browser";
import { useState } from "react";
import { signOut } from "firebase/auth";

import type { MouseEventHandler } from "react";
import { useAppCtx } from "../store/store";

const HeadBtn: React.FC<{
  displayOnly?: boolean;
}> = (props) => {
  const { state } = useAppCtx();
  const [isHover, setIsHover] = useState(false);

  const handleSignOut: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!state.auth || !state.auth.currentUser) {
      logger.err("head-btn", "state.auth is undefinde");
      return;
    }
    signOut(state.auth)
      .then(() => logger.nomal("head-btn", "sign out successfully"))
      .catch((err) => logger.err("head-btn", "sign out err", err));
  };

  if (props.displayOnly) {
    return (
      <div className=" text-NRyellow select-none text-sm ">
        <span>Welcome to YouDoya</span>
      </div>
    );
  } else {
    return (
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className=" electron-no-drag text-NRyellow select-none text-sm "
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
  }
};

export default HeadBtn;
