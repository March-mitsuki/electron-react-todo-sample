import luxon from "luxon";

export type DateObj = {
  year: number;
  month: number;
  day: number;
  weekday: string;
};

export type Priority = 1 | 2 | 3 | 4 | 5;
export type PriorityStr = "S" | "A" | "B" | "C" | "D";

export const luxonDateFmt = "yyLLdd";

export class Todo {
  id: string;
  user_id: string;
  // locale: string;
  // timezone: string;
  create_date: luxon.DateTime;
  finish_date: luxon.DateTime;
  priority: Priority;
  content: string;
  is_finish: boolean;

  constructor({
    id,
    user_id,
    create_date,
    finish_date,
    priority = 1,
    content,
    is_finish = false,
  }: {
    id: string;
    user_id: string;
    create_date: luxon.DateTime;
    finish_date: luxon.DateTime;
    priority?: Priority;
    content: string;
    is_finish?: boolean;
  }) {
    this.id = id;
    this.user_id = user_id;
    this.create_date = create_date;
    this.finish_date = finish_date;
    this.priority = priority;
    this.content = content;
    this.is_finish = is_finish;
  }

  /**
   * convert priority to string
   * @param p Priority
   * @returns stringify priority OR empty string(when p out of range)
   */
  sPriority(): PriorityStr {
    switch (this.priority) {
      case 1:
        return "S";
      case 2:
        return "A";
      case 3:
        return "B";
      case 4:
        return "C";
      case 5:
        return "D";
      default:
        return "S";
    }
  }

  parseDate({
    timezone,
    locale,
  }: {
    timezone: string;
    locale: string;
  }): DateObj {
    return {
      year: this.finish_date.setZone(timezone).year,
      month: this.finish_date.setZone(timezone).month,
      day: this.finish_date.setZone(timezone).day,
      weekday: this.finish_date.setLocale(locale).weekdayShort,
    };
  }
}

export const toPriority = (s: PriorityStr): Priority => {
  switch (s) {
    case "S":
      return 1;
    case "A":
      return 2;
    case "B":
      return 3;
    case "C":
      return 4;
    case "D":
      return 5;
    default:
      return 1;
  }
};

export const toPriorityStr = (p: Priority): PriorityStr => {
  switch (p) {
    case 1:
      return "S";
    case 2:
      return "A";
    case 3:
      return "B";
    case 4:
      return "C";
    case 5:
      return "D";
    default:
      return "S";
  }
};
