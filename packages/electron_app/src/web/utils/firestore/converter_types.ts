import { ToDoit } from "@doit/shared";

export type FirestoreDataType = {
  locale: string;
  timezome: string;
  create_date: string; // ISO 8601 string
  finish_date: string; // ISO 8601 string
  finish_date_obj: ToDoit.DateObj;
  priority: ToDoit.Priority;
  content: string;
  is_finish: boolean;
};

export type TodoDataFromFIrestore = FirestoreDataType & { id: string };
