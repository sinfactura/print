
import { app, BrowserWindow, Menu, nativeImage } from 'electron';
import { mainMenu } from './helpers/main';
import { createMainWindow } from './windows/main';
import { ipcMainHandler } from './helpers/main/ipcMainHandler';
import path from 'node:path';

const isWin = process.platform === 'win32';
if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {
	Menu.setApplicationMenu(mainMenu);
	ipcMainHandler();
	createMainWindow();
});

app.on('window-all-closed', () => {
	isWin && app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});

const dockImage = nativeImage.createFromPath(
	path.join(app.getAppPath(), 'src', 'icons', 'icon.png')
);
!isWin && app.dock.setIcon(dockImage);

