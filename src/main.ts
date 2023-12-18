
import { app, BrowserWindow, nativeImage } from 'electron';
import { MainMenu } from './helpers/main/menu';
import { createMainWindow, mainWindow } from './windows/main';
import { ipcMainHandler } from './helpers/main/ipcMainHandler';
import path from 'node:path';

const isWin = process.platform === 'win32';
if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {
	MainMenu();
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

