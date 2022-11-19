import luxon from "luxon";

export class Todo {
  id: number;
  locale: string;
  timezone: string;
  create_date: luxon.DateTime;
  finish_date: luxon.DateTime;
  finish_date_str: string;
  weekday: string;
  content: string;

  constructor({
    id = 0,
    locale = "zh",
    timezone = "Asia/Tokyo",
    create_date,
    finish_date,
    content,
  }: {
    id?: number;
    locale?: string;
    timezone?: string;
    create_date: luxon.DateTime;
    finish_date: luxon.DateTime;
    content: string;
  }) {
    this.id = id;
    this.locale = locale;
    this.timezone = timezone;
    this.create_date = create_date;
    this.finish_date = finish_date;
    this.finish_date_str = finish_date.setZone(this.timezone).toISODate();
    this.weekday = finish_date.setLocale(this.locale).weekdayShort;
    this.content = content;
  }
}
