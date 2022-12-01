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
  underLine = "\x1b[4m",
  reset = "\x1b[0m",
}

type LogLevel = "err" | "warn" | "info" | "nomal";

const luxonFmt = "yyyy'-'LL'-'dd HH'-'mm'-'ss Z";

const logger = (color: ansiFont, level: LogLevel) => {
  return (prefix: string, filename: string, ...args: unknown[]) => {
    let filePath = "no/filename/input";
    // 判断第二个引数是否为path, 若不是则交给args作为普通信息处理
    const testFilename = filename.match(/(.*\/.*\..*)\s?/);
    if (testFilename) {
      filePath = path.relative(process.cwd(), testFilename[1]);
    } else {
      args = [filename, ...args];
    }

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
        ` ${parsedArgs}` +
        ` ${ansiFont.underLine}${filePath}${ansiFont.reset}`,
    );

    if (process.env.DOIT_ROOT) {
      let logFilePath = "logs/server.log";
      switch (level) {
        case "err":
          logFilePath = "logs/server_err.log";
          break;
        case "warn":
          logFilePath = "logs/server_warn.log";
          break;
        case "nomal":
          logFilePath = "logs/server_nomal.log";
          break;
        case "info":
          logFilePath = "logs/server_info.log";
          break;
      }

      const writeLogData = `[${prefix}]-[${DateTime.now().toFormat(luxonFmt)}] ${parsedArgs}\n`;

      writeFile(path.resolve(process.env.DOIT_ROOT, logFilePath), writeLogData, {
        flag: "a",
      }).catch((err) => {
        console.log(`[${ansiFont.red}writeLogToFile${ansiFont.reset}]`, err);
      });
    }

    return;
  };
};

export const err = logger(ansiFont.red, "err");
export const warn = logger(ansiFont.yellow, "warn");
export const nomal = logger(ansiFont.green, "nomal");
export const info = logger(ansiFont.blue, "info");
