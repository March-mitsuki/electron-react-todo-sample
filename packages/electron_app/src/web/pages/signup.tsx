import { signInWithEmailAndPassword } from "firebase/auth";
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
    if (state.auth.currentUser) {
      logger.err("signup", "you already signin");
      return;
    }

    const createUser = async () => {
      if (!state.createUserRecordFunc) {
        logger.err("signup", "cloud function is undefined");
        return;
      }
      const eleApi = window.electronAPI;
      const osLocale = await eleApi.invoke.getOsLocale();
      await state.createUserRecordFunc({
        email: email,
        displayName: username,
        password: password,
        timezone: DateTime.now().toFormat("z"),
        locale: osLocale,
      });
      logger.info("signup", "signup sucessfully");
      return;
    };
    createUser()
      .then(() => {
        if (!state.auth) {
          logger.err(
            "signup",
            "created successfully, but on signin err:",
            "state.auth is undefined.",
          );
          return;
        }
        signInWithEmailAndPassword(state.auth, email, password).catch((err) => {
          logger.err("signup", "created successfully, but signin err:", err);
        });
      })
      .catch((err) => {
        logger.err("signup", err);
      });
  };

  return (
    <div className="font-semibold bg-NRyellow/80 w-screen h-screen">
      <BackGroundCanvas></BackGroundCanvas>
      <AppHeader></AppHeader>
      <div className="electron-no-drag">
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
    </div>
  );
};

export default Signup;
