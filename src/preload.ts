// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron';
import { getPrinters as getPrintersUnix } from 'unix-print';
import { getPrinters as getPrintersWin } from 'pdf-to-printer';
const isWin = process.platform === 'win32';


declare global {
	interface Window {
		data: {
			printers: () => Promise<Record<string, string>[]>,
			// setPrinter: (printer: string, name: string) => void,
			// getPrinter: (printer: string) => string,
		}
	}
}

contextBridge.exposeInMainWorld('data', {
	printers: () => isWin ? getPrintersWin() : getPrintersUnix(),
	// setPrinter: (printer: string, name: string) => ipcRenderer.send('set-printer', printer, name),
	// getPrinter: (printer: string) => ipcRenderer.send('get-printer', printer),
});
