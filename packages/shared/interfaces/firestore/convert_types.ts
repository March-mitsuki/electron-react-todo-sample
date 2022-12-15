import { ToDoit } from "@doit/shared";
import { FieldValue, Timestamp } from "firebase/firestore";

// id is doc.id, not in doc.data
export type FirestoreTodoType = {
  locale: string;
  timezome: string;
  create_date: string; // ISO 8601 string, client create date
  finish_date: string; // ISO 8601 string, client create date
  finish_date_obj: ToDoit.DateObj;
  priority: ToDoit.Priority;
  content: string;
  is_finish: boolean;
  created_at: Timestamp; // serverTimestamp
  updated_at: Timestamp; // serverTimestamp
  deleted_at: Timestamp | null;
  expire_at: Timestamp | null;
};

export type ClientFirestoreTodo = Omit<
  FirestoreTodoType,
  "id" | "created_at" | "updated_at" | "deleted_at" | "expire_at"
> & {
  created_at: FieldValue | Date;
  updated_at: FieldValue | Date;
  deleted_at: FieldValue | Date | null;
  expire_at: FieldValue | Date | null;
};
