import { ToDoit } from "@doit/shared";
import { FieldValue, Timestamp } from "firebase/firestore";

// id is doc.id, not in doc.data
export type FirestoreTodoType = {
  user_id: string;
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
};

export type ClientFirestoreTodo = Omit<FirestoreTodoType, "id" | "created_at" | "updated_at"> & {
  created_at: FieldValue | Date;
  updated_at: FieldValue | Date;
};
