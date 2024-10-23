
import { contextBridge, ipcRenderer } from 'electron';
import { getPrinters as getPrintersUnix } from 'unix-print';
import { getPrinters as getPrintersWin } from 'pdf-to-printer';
import path from 'node:path';
import fs from 'node:fs';
import { getToken } from './helpers/main/getToken';

declare global {
	type Login = {
		accessToken: string, refreshToken: string, storeId: string, userId: string, fullName: string
	}
	interface Window {
		ipc: {
			getPrinters: () => Promise<Record<string, string>[]>,
			writeFile: (fileName: string, dataToWrite: string) => void,
			loadFile: (file: string) => Promise<string>,
			getToken: (name: 'accessToken' | 'refreshToken') => Promise<string>,
			print: (data: string, printer: string, isTag?: boolean) => Promise<void>,
			login: (login: Login) => void,
		},
	}
}

const isWin = process.platform === 'win32';

const handleLoadFile = async (fileName: string) => {
	const filePath = path.join(__dirname, `${fileName}.txt`);
	console.log(filePath);

	if (!fs.existsSync(filePath)) return '';
	const data = fs.readFileSync(filePath, 'utf-8');
	return data;
};


contextBridge.exposeInMainWorld('ipc', {
	getPrinters: () => isWin ? getPrintersWin() : getPrintersUnix(),
	writeFile: (fileName: string, dataToWrite: string) => ipcRenderer.send('write-file', fileName, dataToWrite),
	loadFile: (file: string) => handleLoadFile(file),
	print: (data: string, printer: string, isTag?: boolean) => ipcRenderer.send('print', data, printer, isTag),
	login: (login: Login) => ipcRenderer.send('login', login),
	getToken: (name: 'accessToken' | 'refreshToken') => getToken(name),
});