export const timeUnitMin = 1;
export const timeUnitHour = 2;
export type TimeUnit = typeof timeUnitHour | typeof timeUnitMin;

export const timeUnitStrMin_zh = "分钟";
export const timeUnitStrHour_zh = "小时";
export type TimeUnitString_Zh =
  | typeof timeUnitStrHour_zh
  | typeof timeUnitStrMin_zh;

export class Routine {
  id: string;
  user_id: string;
  cron_str: string;
  content: string;
  time_unit: TimeUnit;
  time_num: number;

  constructor({
    id,
    user_id,
    cron_str,
    content,
    time_num,
    time_unit,
  }: {
    id: string;
    user_id: string;
    cron_str: string;
    content: string;
    time_unit: TimeUnit;
    time_num: number;
  }) {
    this.id = id;
    this.user_id = user_id;
    this.cron_str = cron_str;
    this.content = content;
    this.time_unit = time_unit;
    this.time_num = time_num;
  }

  sTime() {
    switch (this.time_unit) {
      case timeUnitHour:
        return timeUnitStrHour_zh;
      case timeUnitMin:
        return timeUnitStrMin_zh;
    }
  }
}

/**
 * Convert Zh time unit string to TimeUnit.
 *
 * If the given parameter is not supported then will return -1.
 * @param s Chinese(zh) Time unit string
 * @returns TimeUint
 */
export const toTimeUnit_zh = (s: TimeUnitString_Zh): TimeUnit | -1 => {
  switch (s) {
    case timeUnitStrHour_zh:
      return timeUnitHour;
    case timeUnitStrMin_zh:
      return timeUnitMin;
    default:
      return -1;
  }
};

/**
 * Stringify TimeUnit to Chinese(zh) time unit string.
 *
 * If the given parameter is not supported then will return a Empty string.
 * @param u TimeUnit
 * @returns Chinese(zh) time unit string
 */
export const toString_zh = (u: TimeUnit): TimeUnitString_Zh | "" => {
  switch (u) {
    case timeUnitHour:
      return timeUnitStrHour_zh;
    case timeUnitMin:
      return timeUnitStrMin_zh;
    default:
      return "";
  }
};
