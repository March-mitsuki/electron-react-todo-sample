import { writeFile } from "fs/promises";
import { DateTime } from "luxon";
import path from "path";

enum ansiFont {
  black = "\x1b[30m",
  backBlack = "\x1b[40m",
  red = "\x1b[31m",
  backRed = "\x1b[41m",
  green = "\x1b[32m",
  backGreen = "\x1b[42m",
  yellow = "\x1b[33m",
  backYellow = "\x1b[43m",
  blue = "\x1b[34m",
  backBlue = "\x1b[44m",
  white = "\x1b[37m",
  backWhite = "\x1b[47m",
  brightBlack = "\x1b[90m",
  backBrightBlack = "\x1b[100m",
  fontBold = "\x1b[1m",
  reset = "\x1b[0m",
}

const luxonFmt = "yyyy'-'LL'-'dd'-'HH'-'mm'-'ss'-'Z";

const logger = (color: ansiFont) => {
  return (prefix: string, ...args: unknown[]) => {
    const parsedArgs = args
      .map((elem) => {
        if (elem instanceof Object) {
          return JSON.stringify(elem, null, 2);
        } else if (typeof elem === "string") {
          return elem;
        } else {
          return JSON.stringify(elem);
        }
      })
      .join(` `);

    console.log(
      `[${color}${prefix}${ansiFont.reset}]` +
        ` ${ansiFont.fontBold}${ansiFont.brightBlack}${DateTime.now().toFormat(luxonFmt)}${
          ansiFont.reset
        }` +
        ` ${parsedArgs}`,
    );

    if (process.env.DOIT_ROOT) {
      writeFile(
        path.resolve(process.env.DOIT_ROOT, "logs/server.log"),
        `[${prefix}]-[${DateTime.now().toFormat(luxonFmt)}] ${parsedArgs}\n`,
        {
          flag: "a",
        },
      ).catch((err) => {
        console.log(`[${ansiFont.red}writeLogToFile${ansiFont.reset}]`, err);
      });
    }

    return;
  };
};

export const err = logger(ansiFont.red);
export const warn = logger(ansiFont.yellow);
export const nomal = logger(ansiFont.green);
export const info = logger(ansiFont.blue);
