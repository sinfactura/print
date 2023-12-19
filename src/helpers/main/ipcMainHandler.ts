
import { ipcMain } from 'electron';
import { handleWriteFile } from './handleWriteFile';
import { handlePrint } from './handlePrint';
import { handleLogin } from './handleLogin';


export const ipcMainHandler = () => {
	ipcMain.on('write-file', handleWriteFile);
	ipcMain.on('print', handlePrint);
	ipcMain.on('login', handleLogin);
};