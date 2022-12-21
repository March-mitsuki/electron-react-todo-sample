import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { DateTime } from "luxon";
import { useState } from "react";
import { Link } from "react-router-dom";
import { browserlogger as logger } from "white-logger/esm/browser";

import { BackGroundCanvas } from "../components";
import AppHeader from "../components/header";
import { useAppCtx } from "../store/store";

const Signup: React.FC = () => {
  const { state } = useAppCtx();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    logger.info("signup", "will post", email, username, password);
    if (!state.auth) {
      logger.err("signup", "auth is undefined");
      return;
    }
    createUserWithEmailAndPassword(state.auth, email, password)
      .then(async (userCredential) => {
        try {
          await updateProfile(userCredential.user, { displayName: username });
          if (!state.createFdbUserRecordFunc) {
            logger.err("signup", "cloud function is undefined");
            return;
          }
          const eleApi = window.electronAPI;
          const osLocale = await eleApi.invoke.getOsLocale();
          await state.createFdbUserRecordFunc({
            timezone: DateTime.now().toFormat("z"),
            locale: osLocale,
          });
          // 需要讨论是否需要暂停一会儿等待服务器保存结果
          // 因为操作是当createUser成功时就会触发auth的变更
          // 导致initReducer会立即启动去查看现在的user设定
          // 但可能此时user的设定还没反应到服务器上
          logger.info("signup", "signup sucessfully");
        } catch (err) {
          logger.err(
            "signup",
            "create sucessfully, but update username err:",
            err,
          );
        }
      })
      .catch((err) => {
        logger.err("signup", "create user err:", err);
      });
  };

  return (
    <div className="font-semibold bg-NRyellow/80 w-screen h-screen">
      <BackGroundCanvas></BackGroundCanvas>
      <AppHeader></AppHeader>
      <form onSubmit={handleSubmit}>
        <label>
          <div>邮箱</div>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
          />
        </label>
        <label>
          <div>用户名</div>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
          />
        </label>
        <label>
          <div>密码</div>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
        </label>
        <button type="submit">注册</button>
      </form>
      <Link to="/signin">{"已有账号(去登录)"}</Link>
    </div>
  );
};

export default Signup;
