
import { ipcMain } from 'electron';
import { handleSetPrinter } from './handleSetPrinter';
import { handlePrint } from './handlePrint';
import { handleLogin } from './handleLogin';


export const ipcMainHandler = () => {
	ipcMain.on('set-printer', handleSetPrinter);
	ipcMain.on('print', handlePrint);
	ipcMain.on('login', handleLogin);
};