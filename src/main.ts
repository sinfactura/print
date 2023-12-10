
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { handleGetPrinter, handlePrint, handleSetPrinter, mainMenu } from './helpers';
import { createMainWindow } from './windows';

const isWin = process.platform === 'win32';
if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {
  ipcMain.on('set-printer', handleSetPrinter)
  ipcMain.on('get-printer', handleGetPrinter)
  ipcMain.on('print-buffer', handlePrint)
  Menu.setApplicationMenu(mainMenu);
  createMainWindow();
})

app.on('window-all-closed', () => {
  isWin && app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

