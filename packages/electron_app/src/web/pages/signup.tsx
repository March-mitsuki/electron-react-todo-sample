import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  return (
    <>
      <div>Signin Page</div>
      <Link to={"/"}>Back Home</Link>
    </>
  );
};

export default Signup;
