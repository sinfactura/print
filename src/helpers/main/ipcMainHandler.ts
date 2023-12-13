
import { ipcMain } from 'electron';
import { handleSetPrinter } from './handleSetPrinter';
import { handleGetPrinter } from './handleGetPrinter';
import { handlePrint } from './handlePrint';


export const ipcMainHandler = () => {
	ipcMain.on('set-printer', handleSetPrinter);
	ipcMain.on('get-printer', handleGetPrinter);
	ipcMain.on('print-buffer', handlePrint);
};