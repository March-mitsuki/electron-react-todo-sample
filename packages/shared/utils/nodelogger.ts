enum ansiColor {
  red = "\x1b[31m",
  green = "\x1b[32m",
  yellow = "\x1b[33m",
  blue = "\x1b[34m",
  reset = "\x1b[0m",
}

const logger = (color: ansiColor) => {
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
    console.log(`${color}[${prefix}]${ansiColor.reset} ${parsedArgs}`);

    return;
  };
};

export const err = logger(ansiColor.red);
export const warn = logger(ansiColor.yellow);
export const nomal = logger(ansiColor.green);
export const info = logger(ansiColor.blue);
