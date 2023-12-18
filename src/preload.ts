
import { contextBridge, ipcRenderer } from 'electron';
import { getPrinters as getPrintersUnix } from 'unix-print';
import { getPrinters as getPrintersWin } from 'pdf-to-printer';
import path from 'node:path';
import fs from 'node:fs';

const isWin = process.platform === 'win32';

declare global {
	interface Window {
		ipc: {
			getPrinters: () => Promise<Record<string, string>[]>,
			setPrinter: (printer: string, name: string) => void,
			loadPrinter: (printer: string) => Promise<string>,
			print: (data: string, printer: string, isTag?: boolean) => Promise<void>,
			// LOGIN
			login: (email: string, password: string) => void,
		},
	}
}

const handleLoadPrinter = async (printer: string) => {
	const file = path.join(__dirname, `${printer}.txt`);
	if (!fs.existsSync(file)) return '';
	const data = fs.readFileSync(file).toString();
	return data;
};

contextBridge.exposeInMainWorld('ipc', {
	getPrinters: () => isWin ? getPrintersWin() : getPrintersUnix(),
	setPrinter: (printer: string, name: string) => ipcRenderer.send('set-printer', printer, name),
	loadPrinter: (printer: string) => handleLoadPrinter(printer),
	print: (data: string, printer: string, isTag?: boolean) => ipcRenderer.send('print', data, printer, isTag),
	// LOGIN
	login: (email: string, password: string) => ipcRenderer.send('set-email', { email, password }),

});
