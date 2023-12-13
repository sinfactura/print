
import { app, BrowserWindow, Menu } from 'electron';
import { mainMenu } from './helpers/main';
import { createMainWindow } from './windows';
import { ipcMainHandler } from './helpers/main/ipcMainHandler';

const isWin = process.platform === 'win32';
if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {
	Menu.setApplicationMenu(mainMenu);
	ipcMainHandler();
	createMainWindow();
	console.log(process);
});

app.on('window-all-closed', () => {
	isWin && app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});

