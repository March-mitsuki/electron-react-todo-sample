import { DateTime } from "luxon";
import { nodelogger as logger } from "white-logger/node";

import { ToDoit } from "@doit/shared";

// type
import type { ParamsDictionary } from "express-serve-static-core";
import type { RequestHandler } from "express";
import type { TodoGetAllResType } from "@doit/shared/interfaces/api/todo";

export const getAllTodosDummy: RequestHandler<ParamsDictionary, TodoGetAllResType> = (req, res) => {
  const sleep = new Promise<ToDoit.Todo[]>((resolve, reject) => {
    setTimeout(() => {
      try {
        const todoList = [
          new ToDoit.Todo({
            id: "",
            priority: 3,
            content: "项目1",
            create_date: DateTime.now(),
            finish_date: DateTime.fromFormat("221228", "yyLLdd"),
          }),
          new ToDoit.Todo({
            id: "",
            priority: 1,
            content: "ミッション2",
            create_date: DateTime.now(),
            finish_date: DateTime.fromFormat("230102", "yyLLdd"),
          }),
          new ToDoit.Todo({
            id: "",
            priority: 2,
            content: "task3",
            create_date: DateTime.now(),
            finish_date: DateTime.fromFormat("221209", "yyLLdd"),
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
      logger.err("api", __filename, "getall dummy", err);
    });
  return;
};
