
import { ipcMain } from 'electron';
import { handleSetPrinter } from './handleSetPrinter';
import { handlePrint } from './handlePrint';


export const ipcMainHandler = () => {
	ipcMain.on('set-printer', handleSetPrinter);
	ipcMain.on('print', handlePrint);
};