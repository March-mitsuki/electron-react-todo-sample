import { Link, useParams } from "react-router-dom";

import { useAppCtx } from "../store/store";

const Edit = () => {
  const { state } = useAppCtx();
  const { todoId } = useParams<"todoId">();
  return (
    <>
      <div>EditPageHere - {todoId}</div>
      <div>state - {JSON.stringify(state.todos)}</div>
      <Link to={"/"}>Back Home</Link>
    </>
  );
};

export default Edit;
