import path from "path";
import { BrowserWindow, app, ipcMain } from "electron";

async function initDotenv(filename: string) {
  const dotenv = await import("dotenv");
  const dotenvResult = dotenv.config({
    path: path.resolve(process.cwd(), filename),
  });
  if (dotenvResult.error) {
    throw dotenvResult.error;
  } else {
    console.log("\x1b[32m" + "dotenv init successfully" + "\x1b[0m");
    console.log("[dotenv]", `${filename} loaded:`, dotenvResult.parsed);
  }
}

const createWindow = () => {
  return new Promise<BrowserWindow>((resolve, reject) => {
    try {
      resolve(
        new BrowserWindow({
          width: 300,
          height: 600,
          frame: false,
          // opacity: 0.8,
          // alwaysOnTop: true,
          resizable: true,
          webPreferences: {
            preload: path.join(__dirname, "preload.js"),
          },
        }),
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const initElectronApp = async () => {
  try {
    await initDotenv(".env.local");

    await app.whenReady();
    const mainWindow = await createWindow();
    await mainWindow.loadFile("dist/index.html");
    mainWindow.webContents.openDevTools();

    ipcMain.handle("get:appMode", () => {
      const mode = process.env.DOYA_MODE;
      if (!mode) {
        throw new Error(
          "can not find DOYA_MODE in .env file, did you run `yarn init-app` command?",
        );
      }
      return mode;
    });
    ipcMain.on("close-window", () => {
      mainWindow.close();
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  } catch (err) {
    console.log("[error]", err);
    throw new Error("init electron app error");
  }

  return;
};
