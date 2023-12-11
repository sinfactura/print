
import { BrowserWindow } from 'electron';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

export const createMainWindow = () => {

	let mainWindow = new BrowserWindow({
		height: 600,
		width: isDev ? 1000 : 500,
		resizable: false,
		icon: path.join(__dirname, 'icons', 'icon.png'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
		show: false,
		backgroundColor: '#333',
	});

	let secondaryWindow = new BrowserWindow({
		height: 350,
		width: 800,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
		},
		show: false,
		backgroundColor: '#333',
		parent: mainWindow,
		modal: true,
		center: true,
	});


	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		secondaryWindow.loadFile('login.html');
	} else {
		mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
		secondaryWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/login.html`));
	}


	isDev && mainWindow.webContents.openDevTools();
	isDev && secondaryWindow.webContents.openDevTools();

	mainWindow.on('ready-to-show', mainWindow.show);
	secondaryWindow.on('ready-to-show', secondaryWindow.show);

	mainWindow.on('close', () => mainWindow = null);
	secondaryWindow.on('close', () => secondaryWindow = null);

};