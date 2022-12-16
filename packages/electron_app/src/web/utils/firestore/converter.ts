import { DateTime } from "luxon";
import { serverTimestamp } from "firebase/firestore";

import { ToDoit } from "@doit/shared";
import { FirestoreTodoType, ClientFirestoreTodo } from "@doit/shared/interfaces/firestore";

import type { FirestoreDataConverter, QueryDocumentSnapshot } from "firebase/firestore";

export const todoConverter: FirestoreDataConverter<ToDoit.Todo> = {
  toFirestore: (todo: ToDoit.Todo): ClientFirestoreTodo => {
    return {
      user_id: todo.user_id,
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
  fromFirestore: (snap: QueryDocumentSnapshot<FirestoreTodoType>, options) => {
    const data = snap.data(options);
    const parsedTodo = new ToDoit.Todo({
      id: snap.id,
      user_id: data.user_id,
      locale: data.locale,
      timezone: data.timezome,
      create_date: DateTime.fromISO(data.create_date),
      finish_date: DateTime.fromISO(data.finish_date),
      priority: data.priority,
      content: data.content,
      is_finish: data.is_finish,
    });
    return parsedTodo;
  },
};
