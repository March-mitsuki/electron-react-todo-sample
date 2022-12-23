import path from "path";
import { BrowserWindow, app, ipcMain } from "electron";

async function initDotenv(filename: string) {
  const dotenv = await import("dotenv");
  const filePath = path.resolve(process.cwd(), filename);
  const dotenvResult = dotenv.config({
    path: filePath,
  });
  if (dotenvResult.error) {
    throw dotenvResult.error;
  } else {
    console.log("\x1b[32m" + "dotenv init successfully" + "\x1b[0m");
    console.log("[dotenv]", `loaded from: ${filePath}:`, dotenvResult.parsed);
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

    // deep link can only use in packaged app.
    // const youdoyaProtocol = "doyaptcl";
    // if (process.defaultApp) {
    //   console.log("[debug]", "now set protocol in process defaultApp.");
    //   if (process.argv.length >= 2) {
    //     console.log("[debug]", "process argv length >= 2", process.argv);
    //     const ok = app.setAsDefaultProtocolClient(
    //       youdoyaProtocol,
    //       process.execPath,
    //       [path.resolve(process.argv[1])],
    //     );
    //     if (!ok) {
    //       throw new Error("set as default protocol client err.");
    //     }
    //   }
    // } else {
    //   console.log("[debug]", "now set protocol in else.");
    //   const ok = app.setAsDefaultProtocolClient(youdoyaProtocol);
    //   if (!ok) {
    //     throw new Error("set as default protocol client err.");
    //   }
    // }

    // if (process.platform === "win32") {
    //   process.argv.forEach((cmd) => {
    //     const doyaRegex = /^doyaptcl:\/\//;
    //     if (doyaRegex.test(cmd)) {
    //       mainWindow.webContents.send("emailVerification", cmd);
    //       console.log("[debug]", "on open url windows:", cmd);
    //     }
    //   });
    // } else {
    //   app.on("open-url", (event, url) => {
    //     mainWindow.webContents.send("emailVerification", url);
    //     console.log("[debug]", "on open url unix:", url);
    //   });
    // }

    // const getLock = app.requestSingleInstanceLock();
    // if (!getLock) {
    //   console.log("[debug]", "now get lock is false. app will quit.");
    //   app.quit();
    //   return;
    // } else {
    //   app.on("second-instance", (evt, argv, workDir) => {
    //     console.log("[debug]", "seconed-instance", argv, workDir);
    //     if (mainWindow) {
    //       if (mainWindow.isMinimized()) {
    //         mainWindow.restore();
    //       }
    //       mainWindow.focus();
    //     }
    //   });
    // }

    await app.whenReady();
    const mainWindow = await createWindow();
    await mainWindow.loadFile("dist/index.html");
    mainWindow.webContents.openDevTools();

    ipcMain.handle("getAppMode", () => {
      const mode = process.env.DOYA_MODE;
      if (!mode) {
        throw new Error(
          "can not find DOYA_MODE in .env file, did you run `yarn init-app` command?",
        );
      }
      return mode;
    });
    ipcMain.handle("getOsLocale", () => {
      return app.getLocale();
    });
    ipcMain.on("closeWindow", () => {
      mainWindow.close();
      // app.removeAsDefaultProtocolClient(youdoyaProtocol, process.execPath, [
      //   path.resolve(process.argv[1]),
      // ]);
      // mainWindow.webContents.send("emailVerification", "something here");
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  } catch (err) {
    console.log("[init-electron-app-err]", err);
    throw new Error("init electron app error");
  }

  return;
};
