import { DateTime } from "luxon";
import { serverTimestamp } from "firebase/firestore";

import { ToDoit } from "@doit/shared";
import { FirestoreTodoType, CreateFirestoreTodo } from "@doit/shared/interfaces/firestore";

import type { DocumentData, QuerySnapshot } from "firebase/firestore";

export const todoConverter = {
  toFirestore: (todo: ToDoit.Todo): CreateFirestoreTodo => {
    return {
      locale: todo.locale,
      timezome: todo.timezone,
      create_date: todo.create_date.toISO(),
      finish_date: todo.finish_date.toISO(),
      finish_date_obj: todo.finish_date_obj,
      priority: todo.priority,
      content: todo.content,
      is_finish: todo.is_finish,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: QuerySnapshot<DocumentData>): ToDoit.Todo[] => {
    const todos: ToDoit.Todo[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreTodoType;
      const parsedTodo = new ToDoit.Todo({
        id: doc.id,
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
