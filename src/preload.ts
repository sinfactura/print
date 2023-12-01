// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron';
import { getPrinters as getPrintersUnix } from 'unix-print';
import { getPrinters as getPrintersWin } from 'pdf-to-printer';
import fs from 'node:fs';
import path from 'node:path';

const isWin = process.platform === 'win32';


declare global {
	interface Window {
		data: {
			printers: () => Promise<Record<string, string>[]>,
			setPrinter: (printer: string, name: string) => void,
			getPrinter: (printer: string) => Promise<string>,
		}
	}
}

const handleGetPrinter = async (printer: string) => {
	// const file = `./${printer}.txt`;
	const file = path.join(__dirname, `${printer}.txt`);
	if (!fs.existsSync(file)) return '';
	const data = fs.readFileSync(file).toString();
	return data;
};

contextBridge.exposeInMainWorld('data', {
	printers: () => isWin ? getPrintersWin() : getPrintersUnix(),
	setPrinter: (printer: string, name: string) => ipcRenderer.send('set-printer', printer, name),
	// getPrinter: (printer: string) => ipcRenderer.send('get-printer', printer),
	getPrinter: (printer: string) => handleGetPrinter(printer),
});
