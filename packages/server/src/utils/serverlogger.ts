import { writeFile } from "fs/promises";
import { DateTime } from "luxon";
import path from "path";

enum ansiFont {
  black = "\x1b[30m",
  red = "\x1b[31m",
  green = "\x1b[32m",
  yellow = "\x1b[33m",
  blue = "\x1b[34m",
  white = "\x1b[37m",
  brightBlack = "\x1b[90m",
  fontBold = "\x1b[1m",
  underLine = "\x1b[4m",
  reset = "\x1b[0m",
}

enum ansiBack {
  black = "\x1b[40m",
  red = "\x1b[41m",
  green = "\x1b[42m",
  yellow = "\x1b[43m",
  blue = "\x1b[44m",
  white = "\x1b[47m",
  brightBlack = "\x1b[100m",
}

type LogLevel = "err" | "warn" | "info" | "nomal";

type LoggerArg = {
  prefix: string;
  filename: string;
  writeOnly?: boolean;
  msgs: unknown[];
};

const luxonFmt = "yyyy'-'LL'-'dd HH'-'mm'-'ss Z";

const replacer = () => {
  const seen = new WeakSet();
  return (_: unknown, v: unknown) => {
    if (typeof v === "object" && v != null) {
      if (seen.has(v)) {
        return;
      }
      seen.add(v);
    }
    return v;
  };
};

const logger = (backColor: ansiBack, level: LogLevel) => {
  return ({ prefix, filename, writeOnly = false, msgs }: LoggerArg) => {
    let filePath = "no/filename/input";
    // 判断第二个引数是否为path, 若不是则交给msgs作为普通信息处理
    const testFilename = filename.match(/(.*\/.*\..*)\s?/);
    if (testFilename) {
      filePath = path.relative(process.cwd(), testFilename[1]);
    } else {
      msgs = [filename, ...msgs];
    }

    const parsedmsgs = msgs
      .map((elem) => {
        if (elem instanceof Object) {
          return JSON.stringify(elem, replacer(), 2);
        } else if (typeof elem === "string") {
          return elem;
        } else {
          return JSON.stringify(elem);
        }
      })
      .join(` `);

    if (!writeOnly) {
      console.log(
        `${backColor} ${prefix} ${ansiFont.reset}` +
          ` ${ansiFont.fontBold}${ansiFont.brightBlack}${DateTime.now().toFormat(luxonFmt)}${
            ansiFont.reset
          }` +
          ` ${parsedmsgs}` +
          ` ${ansiFont.underLine}${filePath}${ansiFont.reset}`,
      );
    }

    if (process.env.DOYA_ROOT) {
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

      const writeLogData = `[${prefix}]-[${DateTime.now().toFormat(luxonFmt)}] ${parsedmsgs}\n`;

      writeFile(path.resolve(process.env.DOYA_ROOT, logFilePath), writeLogData, {
        flag: "a",
      }).catch((err) => {
        console.log(`[${ansiFont.red}writeLogToFile${ansiFont.reset}]`, err);
      });
    }

    return;
  };
};

export const err = logger(ansiBack.red, "err");
export const warn = logger(ansiBack.yellow, "warn");
export const nomal = logger(ansiBack.green, "nomal");
export const info = logger(ansiBack.blue, "info");
