import { updateCurrentUser } from "firebase/auth";
import { browserlogger as logger } from "white-logger/esm/browser";

// local dependencies
import { BackGroundCanvas } from "../components";
import AppHeader from "../components/header";
import { useAppCtx } from "../store/store";

const Verification: React.FC = () => {
  const { state } = useAppCtx();

  const handleUpdateUser: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!state.auth || !state.auth.currentUser) {
      logger.err("verification", "current user is undefined");
      return;
    }
    updateCurrentUser(state.auth, state.auth.currentUser).catch((err) => {
      logger.err("verification", "update current user err:", err);
    });
  };

  return (
    <div className="font-semibold bg-NRyellow/80 w-screen h-screen">
      <BackGroundCanvas></BackGroundCanvas>
      <AppHeader></AppHeader>
      <div>
        感谢您的注册,我们会发送一份邮件到您注册时输入的邮箱,请查看您的邮箱并完成验证。
        <br />
        完成验证后应用将自动跳转,若没有自动跳转请点击下方的手动刷新按钮刷新应用。
      </div>
      <button onClick={handleUpdateUser}>手动刷新</button>
    </div>
  );
};

export default Verification;
