/**
 * please do NOT run this script directly
 * this file should be run by yarn init-app in root workspace
 */

import { spawn } from "child_process";
import os from "os";

const isWin = process.platform === "win32";
const isMac = process.platform === "darwin";

if (isWin) {
  spawn("powershell", [".\\scripts\\init_app.ps1"], { stdio: "inherit" });
} else if (isMac) {
  const arch = os.arch();
  if (arch === "arm" || arch === "arm64") {
    spawn("zsh", ["./scripts/init_app.zsh"], { stdio: "inherit" });
  } else {
    spawn("bash", ["./scripts/init_app.bash"], { stdio: "inherit" });
  }
} else {
  spawn("bash", ["./scripts/init_app.bash"], { stdio: "inherit" });
}
