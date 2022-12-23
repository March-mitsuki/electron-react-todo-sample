import { browserlogger as logger } from "white-logger/esm/browser";

// local dependencies
import { BackGroundCanvas } from "../components";
import AppHeader from "../components/header";
import { useAppCtx } from "../store/store";

const Verification: React.FC = () => {
  const { state } = useAppCtx();

  const handleUpdateUser: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!state.auth?.currentUser) {
      logger.err("verification", "current user is undefined");
      return;
    }
    state.auth.currentUser
      .getIdToken(true)
      .then(() => {
        logger.info("verificatioin", "getIdToken successfully.");
        if (!state.auth?.currentUser) {
          logger.err("verification", "current user is undefined");
          return;
        }
        state.auth.currentUser
          .reload()
          .then(() => {
            logger.info("verification", "reload current user successfully.");
          })
          .catch((err) => {
            logger.err("verification", "reload current user err:", err);
          });
      })
      .catch((err) => {
        logger.err("verification", "getIdTokenr err:", err);
      });
  };

  return (
    <div className="font-semibold bg-NRyellow/80 w-screen h-screen">
      <BackGroundCanvas></BackGroundCanvas>
      <AppHeader></AppHeader>
      <div className=" p-2 text-NRblack">
        感谢您的注册,我们会发送一份邮件到您注册时输入的邮箱,请查看您的邮箱并完成验证。
        <br />
        完成验证后应用将自动跳转,若没有自动跳转请点击下方的手动刷新按钮刷新应用。
      </div>
      <div className="electron-no-drag">
        <button onClick={handleUpdateUser}>手动刷新</button>
      </div>
    </div>
  );
};

export default Verification;
