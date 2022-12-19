import { useAppCtx } from "../../store/store";
import LeftMenu from "./left-menu";
import SignOutBtn from "./signout-btn";

const AppHeader: React.FC = () => {
  const { state } = useAppCtx();
  if (state.auth?.currentUser) {
    return (
      <div className="h-6 bg-NRblack text-NRyellow px-3 flex justify-between items-center">
        <LeftMenu></LeftMenu>
        <div className=" text-xs select-none ">人类荣光永存</div>
        <SignOutBtn></SignOutBtn>
      </div>
    );
  } else {
    return (
      <div className="h-6 bg-NRblack text-NRyellow px-3 flex justify-center items-center">
        <div className=" text-xs select-none ">人类荣光永存</div>
      </div>
    );
  }
};

export default AppHeader;
