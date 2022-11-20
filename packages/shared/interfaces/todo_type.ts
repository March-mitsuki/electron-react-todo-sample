import luxon from "luxon";

export type DateObj = {
  year: number;
  month: number;
  day: number;
  weekday: string;
};

export class Todo {
  id: number;
  locale: string;
  timezone: string;
  create_date: luxon.DateTime;
  finish_date: luxon.DateTime;
  finish_date_obj: DateObj;
  content: string;
  is_finish: boolean;

  constructor({
    id,
    locale = "zh",
    timezone = "Asia/Tokyo",
    create_date,
    finish_date,
    content,
    is_finish = false,
  }: {
    id: number;
    locale?: string;
    timezone?: string;
    create_date: luxon.DateTime;
    finish_date: luxon.DateTime;
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
    this.content = content;
    this.is_finish = is_finish;
  }
}
