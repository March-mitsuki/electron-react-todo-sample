/**
 * please do NOT run this script directly
 * this file should be run by `yarn dev:electron:webpack` in root workspace
 */

import { spawn } from "child_process";
import fs from "fs";

const isWin = process.platform === "win32";

if (isWin) {
  const distPath = ".\\packages\\electron_app\\dist";
  if (fs.existsSync(distPath)) {
    spawn(
      "powershell",
      ["yarn", "workspace", "@doit/electron_app", "dev:webpack:win"],
      { stdio: "inherit" },
    );
  } else {
    spawn(
      "powershell",
      ["yarn", "workspace", "@doit/electron_app", "dev:webpack:only"],
      { stdio: "inherit" },
    );
  }
} else {
  spawn("yarn", ["workspace", "@doit/electron_app", "dev:webpack"], {
    stdio: "inherit",
  });
}
