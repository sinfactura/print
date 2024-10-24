
import { app, BrowserWindow, nativeImage } from 'electron';
import { mainMenu } from './helpers/main/menu';
import { createMainWindow, mainWindow } from './windows/main';
import { ipcMainHandler } from './helpers/main/ipcMainHandler';
import path from 'path';
import Squirrel from 'electron-squirrel-startup';

const isWin = process.platform !== 'darwin';
// if (require('electron-squirrel-startup')) app.quit();
if (Squirrel) app.quit();

app.whenReady().then(() => {
	mainMenu();
	ipcMainHandler();
	createMainWindow();
	mainWindow.on('ready-to-show', mainWindow.show);
});

app.on('window-all-closed', () => {
	isWin && app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow().then(() => {
			mainWindow.show();
		});
	} else {
		mainWindow.show();
	}
});

const dockImage = nativeImage.createFromPath(path.join(app.getAppPath(), 'build', 'icon.png'));
!isWin && app.dock.setIcon(dockImage);

