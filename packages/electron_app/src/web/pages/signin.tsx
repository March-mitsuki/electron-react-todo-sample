import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import { browserlogger as logger } from "white-logger/esm/browser";

// local dependencies
import { FirebaseErrObj } from "@doit/shared/interfaces";
import { useAppCtx } from "../store/store";
import { BackGroundCanvas } from "../components";
import AppHeader from "../components/header";

const Signin: React.FC = () => {
  const { state } = useAppCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!state.auth) {
      logger.err("signin", "auth is undefinde");
      return;
    }
    signInWithEmailAndPassword(state.auth, email, password)
      .then(() => {
        logger.normal("signin", "user signin successfully");
      })
      .catch((err: FirebaseErrObj) => {
        logger.err("sign-in", err);

        if (
          err.code === "auth/user-not-found" &&
          err.name === "FirebaseError"
        ) {
          alert("不存在此用户");
        }
        if (
          err.code === "auth/wrong-password" &&
          err.name === "FirebaseError"
        ) {
          alert("密码不正确");
        }
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className=" bg-gray-500 "
          />
        </label>
        <label>
          <div>密码</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className=" bg-gray-500 "
          />
        </label>
        <button type="submit">登录</button>
      </form>
      <Link to="/signup">{"还没有账号(注册一个)"}</Link>
    </div>
  );
};

export default Signin;
