
import { BrowserWindow } from 'electron';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

export const createMainWindow = () => {
	let mainWindow = new BrowserWindow({
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
	});
};