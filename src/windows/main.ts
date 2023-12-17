
import { BrowserWindow } from 'electron';
import windowStateKeeper from 'electron-window-state';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';


export let mainWindow: BrowserWindow;
export const createMainWindow = async () => {

	const { width, height, x, y, manage } = windowStateKeeper({
		defaultWidth: isDev ? 1000 : 400,
		defaultHeight: 560,
	});

	mainWindow = new BrowserWindow({
		x, y, height, width,
		minHeight: 560,
		minWidth: 400,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
		show: false,
		backgroundColor: '#333',
	});

	const ses = mainWindow.webContents.session;
	await ses.cookies.set({ url: 'https://api.sinfactura.com', name: 'jwt', value: 'Samuel', expirationDate: 2191212121 });

	const cookieJwt = await ses.cookies.get({ url: 'https://api.sinfactura.com', name: 'jwt' });
	const isAuthenticated = cookieJwt.length > 0;


	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		if (isAuthenticated) {
			mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		} else {
			mainWindow.loadFile('login.html');
		}
	} else {
		if (isAuthenticated) return mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
		mainWindow.loadFile('login.html');
	}


	isDev && mainWindow.webContents.openDevTools();
	mainWindow.on('ready-to-show', mainWindow.show);
	mainWindow.on('close', () => mainWindow = null);
	manage(mainWindow);
};