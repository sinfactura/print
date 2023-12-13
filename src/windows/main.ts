
import { BrowserWindow } from 'electron';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

export const createMainWindow = async () => {

	let mainWindow = new BrowserWindow({
		height: 560,
		width: isDev ? 1000 : 400,
		// resizable: false,
		icon: path.join(__dirname, 'icons', 'icon.png'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			partition: 'persist:sinfactura'
		},
		show: false,
		backgroundColor: '#333',
	});

	// const ses = mainWindow.webContents.session;
	// await ses.cookies.set({ url: 'https://api.sinfactura.com', name: 'name', value: 'Samuel', expirationDate: 191212121 });

	// ses.cookies.get({ url: 'https://api.sinfactura.com' })
	// 	.then((res) => console.log(res))
	// 	.catch(err => console.log(err));

	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		// mainWindow.loadURL('https://sinfactura.com');
	} else {
		mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
	}


	isDev && mainWindow.webContents.openDevTools();

	mainWindow.webContents.on('did-finish-load', () => {
		console.log('finish-load');

	});


	mainWindow.on('ready-to-show', mainWindow.show);

	mainWindow.on('close', () => mainWindow = null);

};