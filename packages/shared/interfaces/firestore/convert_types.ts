import { Doya } from "@doit/shared";
import { FieldValue, Timestamp } from "firebase/firestore";

/**
 * For clinet use `serverTimestamp()`
 */
export type ClientMetaData = {
  created_at: FieldValue | Date;
  updated_at: FieldValue | Date;
};
/**
 * Server return value will be a real Timestamp
 */
export type ServerMetaData = {
  created_at: Timestamp;
  updated_at: Timestamp;
};
/**
 * Soft delete data will be add `deleted_at` & `expire_at`
 */
export type SoftDeletedMetaData = {
  deleted_at: Timestamp;
  expire_at: Timestamp;
};
/**
 * Omit unnecessary property
 * and change `created_date` & `finish_date` type to string. (ISOstring)
 */
export type OmitTodoForConvert = Omit<
  Doya.Todo,
  "id" | "create_date" | "finish_date" | "sPriority"
> & { create_date: string; finish_date: string };

export type FirestoreTodoType = OmitTodoForConvert & ServerMetaData;
export type ClientFirestoreTodo = OmitTodoForConvert & ClientMetaData;
export type DeletedFirestoreTodoType = FirestoreTodoType & SoftDeletedMetaData;

export type OmitRoutineForConvert = Omit<Doya.Routine, "id" | "sTime">;

export type FirestoreRoutineType = OmitRoutineForConvert & ServerMetaData;

export type ClientFirestoreRoutine = Omit<
  FirestoreRoutineType,
  "id" | "created_at" | "updated_at"
> &
  ClientMetaData;
