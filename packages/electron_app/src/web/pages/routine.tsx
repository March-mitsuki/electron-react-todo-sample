import { browserlogger as logger } from "white-logger/esm/browser";

// local dependencies
import { useAppCtx } from "../store/store";
import { BackGroundCanvas } from "../components";
import AppHeader from "../components/header";
import RoutineFrom from "../components/routine-form";
import { Doya } from "@doit/shared";

const Routine: React.FC = () => {
  const { state } = useAppCtx();

  return (
    <div className="font-semibold bg-NRyellow/80 w-screen h-screen">
      <BackGroundCanvas></BackGroundCanvas>
      <AppHeader></AppHeader>
      <div className="electron-no-drag">
        {state.routines.map((elem) => {
          return (
            <div key={elem.id} className=" flex justify-between px-4">
              <div>{elem.content}</div>
              <div>{`每 ${elem.time_num} ${Doya.toString_zh(
                elem.time_unit,
              )}`}</div>
            </div>
          );
        })}
        {state.routines.length === 0 && state.userSetting && (
          <div className="px-4 py-2 text-NRblack text-center">尚不存在循环</div>
        )}
        {typeof state.userSetting === "undefined" && (
          <div className="px-4 py-2 text-NRblack text-center">Loading...</div>
        )}
        <RoutineFrom></RoutineFrom>
      </div>
    </div>
  );
};

export default Routine;
