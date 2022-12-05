import path from "path";
import { BrowserWindow, app, ipcMain } from "electron";
import got from "got";

// type
import { TodoGetAllResType } from "@doit/shared/interfaces/api/todo";

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
    await app.whenReady();
    const mainWindow = await createWindow();
    await mainWindow.loadFile("dist/index.html");
    mainWindow.webContents.openDevTools();

    ipcMain.handle("get:allTodo", async () => {
      const data = (await (
        await got.get("http://127.0.0.1:3194/todo/getall", { responseType: "json" })
      ).body) as TodoGetAllResType;
      return data.todos;
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
