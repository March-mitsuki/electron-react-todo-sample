import luxon from "luxon";

export type DateObj = {
  year: number;
  month: number;
  day: number;
  weekday: string;
};

export type Priority = 1 | 2 | 3 | 4 | 5;
const priorityStr = {
  1: "S",
  2: "A",
  3: "B",
  4: "C",
  5: "D",
};

export class Todo {
  id: number;
  locale: string;
  timezone: string;
  create_date: luxon.DateTime;
  finish_date: luxon.DateTime;
  finish_date_obj: DateObj;
  priority: Priority;
  content: string;
  is_finish: boolean;

  constructor({
    id,
    locale = "zh",
    timezone = "Asia/Tokyo",
    create_date,
    finish_date,
    priority = 1,
    content,
    is_finish = false,
  }: {
    id: number;
    locale?: string;
    timezone?: string;
    create_date: luxon.DateTime;
    finish_date: luxon.DateTime;
    priority?: Priority;
    content: string;
    is_finish?: boolean;
  }) {
    this.id = id;
    this.locale = locale;
    this.timezone = timezone;
    this.create_date = create_date;
    this.finish_date = finish_date;
    this.finish_date_obj = {
      year: finish_date.setZone(this.timezone).year,
      month: finish_date.setZone(this.timezone).month,
      day: finish_date.setZone(this.timezone).day,
      weekday: finish_date.setLocale(this.locale).weekdayShort,
    };
    this.priority = priority;
    this.content = content;
    this.is_finish = is_finish;
  }
}

/**
 *
 * @param p Priority
 * @returns stringify priority OR empty string(when p out of range)
 */
export const priorityToString = (p: Priority): string => {
  switch (p) {
    case 1:
      return priorityStr[1];
    case 2:
      return priorityStr[2];
    case 3:
      return priorityStr[3];
    case 4:
      return priorityStr[4];
    case 5:
      return priorityStr[5];
    default:
      return "";
  }
};
