
import { BrowserWindow, ipcMain } from 'electron';
import windowStateKeeper from 'electron-window-state';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';


export let mainWindow: BrowserWindow;
export const createMainWindow = async () => {

	const { width, height, x, y, manage } = windowStateKeeper({
		defaultWidth: 400,
		defaultHeight: 520,
	});

	const iconFile = isMac ? 'icon.icns' : 'icon.ico';

	mainWindow = new BrowserWindow({
		x, y, height, width,
		minHeight: 520,
		minWidth: 400,
		icon: path.join(__dirname, 'build', iconFile),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
		show: false,
		backgroundColor: '#333',
	});

	manage(mainWindow);

	// const ses = mainWindow.webContents.session;
	// await ses.cookies.set({ url: 'https://api.sinfactura.com', name: 'jwt', value: 'Samuel', expirationDate: 2191212121 });

	// const cookieJwt = await ses.cookies.get({ url: 'https://api.sinfactura.com', name: 'jwt2' });
	// const isAuthenticated = cookieJwt.length > 0;

	// console.log(isAuthenticated);

	ipcMain.on('set-email', (e, args) => {
		console.log(args);
	});


	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
	}


	isDev && mainWindow.webContents.openDevTools();
	mainWindow.on('ready-to-show', mainWindow.show);
	mainWindow.on('close', () => mainWindow = null);
};