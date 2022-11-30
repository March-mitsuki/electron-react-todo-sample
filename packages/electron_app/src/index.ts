import path from "path";
import { BrowserWindow, app, ipcMain } from "electron";
import { DateTime } from "luxon";
// import got from "got";

// type
import { ToDoit } from "@doit/shared";
import { nodelogger } from "@doit/shared/utils";

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
      // const data = (await got.get("https://pokeapi.co/api/v2/pokemon/ditto")).body;
      const sleep = new Promise<ToDoit.Todo[]>((resolve, reject) => {
        setTimeout(() => {
          try {
            const todoList = [
              new ToDoit.Todo({
                id: 1,
                content: "项目1",
                create_date: DateTime.now(),
                finish_date: DateTime.now(),
              }),
              new ToDoit.Todo({
                id: 2,
                content: "ミッション2",
                create_date: DateTime.now(),
                finish_date: DateTime.now(),
              }),
            ];
            nodelogger.info("electron-main", "sleep resolve");
            resolve(todoList);
          } catch (err) {
            reject(err);
          }
        }, 1000);
      });
      const data = await sleep;
      return data;
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
