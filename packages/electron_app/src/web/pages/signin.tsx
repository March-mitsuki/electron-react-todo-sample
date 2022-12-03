import { weblogger } from "../utils";
import { signInWithEmailAndPassword } from "firebase/auth";

import { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import { useAppCtx } from "../store/store";

const Signin: React.FC = () => {
  const { state } = useAppCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!state.auth) {
      weblogger.err("signin", "auth is undefinde");
      return;
    }
    signInWithEmailAndPassword(state.auth, email, password)
      .then(() => {
        weblogger.nomal("signin", "user signin successfully");
        location.href = "";
      })
      .catch((err) => weblogger.err("signin", err));
  };

  return (
    <>
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
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => weblogger.info("now herf", state.auth?.currentUser)}>SEE</button>
      <Link to="signup">我也想为人类出一份力</Link>
      <Link to="/">{" back home"}</Link>
    </>
  );
};

export default Signin;
