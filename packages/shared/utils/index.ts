export * as todoDate from "./date";

export const sleep = (msec: number) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(`sleep ${msec}`);
      }, msec);
    } catch (err) {
      reject(err);
    }
  });
};
