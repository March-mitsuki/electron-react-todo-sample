import { RequestHandler } from "express";
import { DateTime } from "luxon";

import { serverlogger } from "../../utils";
import { ToDoit } from "@doit/shared";

// type
import type { ParamsDictionary } from "express-serve-static-core";
import type { TodoGetAllResType } from "@doit/shared/interfaces/api/todo";

export const getAllTodosDummy: RequestHandler<ParamsDictionary, TodoGetAllResType> = (req, res) => {
  serverlogger.nomal({ prefix: "api", filename: __filename, msgs: ["/todo/getall"] });
  const sleep = new Promise<ToDoit.Todo[]>((resolve, reject) => {
    setTimeout(() => {
      try {
        const todoList = [
          new ToDoit.Todo({
            id: 1,
            content: "项目1",
            create_date: DateTime.now(),
            finish_date: DateTime.now(),
          }),
          new ToDoit.Todo({
            id: 2,
            content: "ミッション2",
            create_date: DateTime.now(),
            finish_date: DateTime.now(),
          }),
        ];
        resolve(todoList);
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
  sleep
    .then((todos) => {
      res.json({
        todos: todos,
      });
    })
    .catch((err) => {
      serverlogger.err({ prefix: "api", filename: __filename, msgs: ["getall dummy", err] });
    });
  return;
};
