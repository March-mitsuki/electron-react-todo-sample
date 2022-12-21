import { DateTime } from "luxon";
import { serverTimestamp } from "firebase/firestore";

import { Doya } from "@doit/shared";
import {
  FirestoreTodoType,
  ClientFirestoreTodo,
} from "@doit/shared/interfaces/firestore";

import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  ClientFirestoreRoutine,
  FirestoreRoutineType,
  FirestoreUserType,
} from "@doit/shared/interfaces/firestore/convert_types";

export const todoConverter: FirestoreDataConverter<Doya.Todo> = {
  toFirestore: (todo: Doya.Todo): ClientFirestoreTodo => {
    return {
      user_id: todo.user_id,
      create_date: todo.create_date.toISO(),
      finish_date: todo.finish_date.toISO(),
      priority: todo.priority,
      content: todo.content,
      is_finish: todo.is_finish,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  },
  fromFirestore: (snap: QueryDocumentSnapshot<FirestoreTodoType>, options) => {
    const data = snap.data(options);
    const parsedTodo = new Doya.Todo({
      id: snap.id,
      user_id: data.user_id,
      create_date: DateTime.fromISO(data.create_date),
      finish_date: DateTime.fromISO(data.finish_date),
      priority: data.priority,
      content: data.content,
      is_finish: data.is_finish,
    });
    return parsedTodo;
  },
};

export const routineConverter: FirestoreDataConverter<Doya.Routine> = {
  toFirestore: (routine: Doya.Routine): ClientFirestoreRoutine => {
    return {
      user_id: routine.user_id,
      cron_str: routine.cron_str,
      content: routine.content,
      time_unit: routine.time_unit,
      time_num: routine.time_num,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  },
  fromFirestore(snap: QueryDocumentSnapshot<FirestoreRoutineType>, options) {
    const data = snap.data(options);
    return new Doya.Routine({
      id: snap.id,
      user_id: data.user_id,
      cron_str: data.cron_str,
      content: data.content,
      time_unit: data.time_unit,
      time_num: data.time_num,
    });
  },
};

export const userConverter: FirestoreDataConverter<FirestoreUserType> = {
  toFirestore: (userSetting: FirestoreUserType) => {
    return userSetting;
  },
  fromFirestore: (snap: QueryDocumentSnapshot<FirestoreUserType>, options) => {
    return snap.data(options);
  },
};
