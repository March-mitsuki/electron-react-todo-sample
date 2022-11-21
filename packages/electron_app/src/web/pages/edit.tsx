import { Link, useParams } from "react-router-dom";
const Edit = () => {
  const { todoId } = useParams<"todoId">();
  return (
    <>
      <div>EditPageHere - {todoId}</div>
      <Link to={"/"}>Back Home</Link>
    </>
  );
};

export default Edit;
