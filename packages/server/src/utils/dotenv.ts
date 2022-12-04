import path from "path";

export async function initDotenv(filename: string) {
  const dotenv = await import("dotenv");
  const dotenvResult = dotenv.config({ path: path.resolve(process.cwd(), filename) });
  if (dotenvResult.error) {
    throw dotenvResult.error;
  } else {
    console.log("\x1b[32m" + "dotenv init successfully" + "\x1b[0m");
    console.log("[dotenv]", `${filename} loaded:`, dotenvResult.parsed);
  }
}
