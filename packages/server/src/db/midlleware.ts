import { DateTime } from "luxon";
import type { Prisma } from "@prisma/client";

export const softDelete: Prisma.Middleware = async (params, next) => {
  if (params.action === "delete") {
    params.action = "update";
    params.args["data"] = { deleted_at: DateTime.now() };
  }
  if (params.action === "deleteMany") {
    params.action = "updateMany";
    if (params.args.data != undefined) {
      params.args.data["deleted_at"] = DateTime.now();
    } else {
      params.args["data"] = { deleted_at: DateTime.now() };
    }
  }
  return next(params);
};
