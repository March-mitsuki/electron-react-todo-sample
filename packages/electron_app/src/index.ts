import path from "path";
import { BrowserWindow, app, ipcMain } from "electron";
import got from "got";

// type
import { TodoGetAllResType } from "@doit/shared/interfaces/api/todo";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 600,
    frame: false,
    // opacity: 0.8,
    // alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile("dist/index.html").catch((err) => console.log(err));
  return mainWindow;
};

app
  .whenReady()
  .then(() => {
    ipcMain.handle("get:allTodo", async () => {
      const data = (await (
        await got.get("http://127.0.0.1:3194/todo/getall", { responseType: "json" })
      ).body) as TodoGetAllResType;
      return data.todos;
    });

    const mainWindow = createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    ipcMain.on("close-window", () => {
      mainWindow.close();
    });
  })
  .catch((err) => console.log(err));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
