
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'node:path';
import { handleGetPrinter, handlePrint, handleSetPrinter, mainMenu } from './helpers';


if (require('electron-squirrel-startup')) app.quit();

const isDev = process.env.NODE_ENV === 'development';
const isWin = process.platform === 'win32';
let mainWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: isDev ? 1000 : 500,
    resizable: false,
    // icon: '/src/icons/1024x1024.png', // only linux
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  // load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  isDev && mainWindow.webContents.openDevTools();
  mainWindow.on('close', () => {
    mainWindow = null;
  })
};

app.whenReady().then(() => {
  ipcMain.on('set-printer', handleSetPrinter)
  ipcMain.on('get-printer', handleGetPrinter)
  ipcMain.on('print-buffer', handlePrint)
  Menu.setApplicationMenu(mainMenu);
  createWindow();
})

app.on('window-all-closed', () => {
  isWin && app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

