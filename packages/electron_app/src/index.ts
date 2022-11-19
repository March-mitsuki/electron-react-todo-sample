import path from "node:path";
import { BrowserWindow, app, ipcMain } from "electron";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false,
    // transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("dist/index.html").catch((err) => console.log(err));
};

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  })
  .catch((err) => console.log(err));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("close-window", () => {
  app.quit();
});
