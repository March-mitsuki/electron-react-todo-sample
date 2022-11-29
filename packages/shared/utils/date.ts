import { DateObj } from "../interfaces/todo_type";
import type { DateTime } from "luxon";

export const dateToObj = ({
  date,
  timezone,
  locale,
}: {
  date: DateTime;
  timezone: string;
  locale: string;
}): DateObj => {
  const dateObj = {
    year: date.setZone(timezone).year,
    month: date.setZone(timezone).month,
    day: date.setZone(timezone).day,
    weekday: date.setLocale(locale).weekdayShort,
  };
  return dateObj;
};
