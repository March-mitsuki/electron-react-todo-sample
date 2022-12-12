import { ToDoit } from "@doit/shared";
import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { DateTime } from "luxon";
import { weblogger } from "..";
import { FirestoreDataType, TodoDataFromFIrestore } from "./converter_types";

export const todoConverter = {
  toFirestore: (todo: ToDoit.Todo): FirestoreDataType => {
    return {
      locale: todo.locale,
      timezome: todo.timezone,
      create_date: todo.create_date.toISO(),
      finish_date: todo.finish_date.toISO(),
      finish_date_obj: todo.finish_date_obj,
      priority: todo.priority,
      content: todo.content,
      is_finish: todo.is_finish,
    };
  },
  fromFirestore: (snapshot: QuerySnapshot<DocumentData>): ToDoit.Todo[] => {
    const todos: ToDoit.Todo[] = [];
    snapshot.forEach((doc) => {
      weblogger.info("firestore converter", doc.data());
      const data = doc.data() as TodoDataFromFIrestore;
      const parsedTodo = new ToDoit.Todo({
        id: data.id,
        locale: data.locale,
        timezone: data.timezome,
        create_date: DateTime.fromISO(data.create_date),
        finish_date: DateTime.fromISO(data.finish_date),
        priority: data.priority,
        content: data.content,
        is_finish: data.is_finish,
      });
      todos.push(parsedTodo);
    });
    return todos; // eslint-disable-line
  },
};
