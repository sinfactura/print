
import { BrowserWindow } from 'electron';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

export const createLoginWindow = () => {
	let loginWindow = new BrowserWindow({
		height: 600,
		width: isDev ? 1000 : 500,
		resizable: false,
		// icon: '/src/icons/1024x1024.png', // only linux
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
	});
	// load the login.html
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		loginWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		loginWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/login.html`));
	}

	isDev && loginWindow.webContents.openDevTools();
	loginWindow.on('close', () => {
		loginWindow = null;
	});
};