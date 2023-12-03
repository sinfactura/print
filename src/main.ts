// THIS FILE NEEDS TO RESTART THE APP

import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { print as printUnix } from 'unix-print';
import { print as printWin } from 'pdf-to-printer';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) app.quit();

const isDev = process.env.NODE_ENV === 'development';
const isWin = process.platform === 'win32';

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: isDev ? 1000 : 500,
    resizable: false,
    // icon: '/src/icons/1024x1024.png', // only linux
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  // Open the DevTools.
  isDev && mainWindow.webContents.openDevTools();
};

const handleSetPrinter = (event: unknown, printer: string, name: string): void => {
  const file = path.join(__dirname, `${printer}.txt`);
  fs.writeFileSync(file, name);
};

const handleGetPrinter = async (event: unknown, printer: string) => {
  const file = path.join(__dirname, `${printer}.txt`);
  if (!fs.existsSync(file)) return '';
  const data = fs.readFileSync(file).toString();
  console.log(data);
  return data;
};

const handlePrint = async (event: unknown, data: string, printer: string) => {
  const file = path.join(__dirname, `fileToPrint.pdf`);

  const formatedData = Buffer.from(data.slice(28, 999999), 'base64');

  fs.createWriteStream(file).write(formatedData, async () => {
    const options = [
      '-o landscape',
      '-o fit-to-page',
      '-o media=A4',
    ];

    isWin
      ? await printWin(file, {
        printer,
        scale: 'fit',
        sumatraPdfPath: path.join(__dirname, '..', '..', 'node_modules\\pdf-to-printer\\dist\\SumatraPDF-3.4.6-32.exe')
      })
        .then(res => {
          console.log('Archivo impreso', res);
        }).catch(err => {
          console.log('Error al imprimir', err);
        })
      : await printUnix(file, printer, options)
        .then((res) => {
          console.log('Archivo impreso', res);
          fs.unlinkSync(file);
        })
        .catch((err) => {
          console.log('Error al imprimir', err);
          fs.unlinkSync(file);
        })
  });
};

const customMenu = [
  {
    label: 'Archivo',
    submenu: [
      { role: 'quit', label: 'Salir', accelerator: 'CmdOrCtrl+W' },
    ],
  },
  {
    label: 'Vista',
    submenu: [
      { role: 'reload', label: 'Recargar' },
      { role: 'forceReload', label: 'Forzar recarga' },
      { role: 'toggleDevTools', label: 'Mostrar herramientas de desarrollo' },
    ]
  },
] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[]

app.whenReady().then(() => {
  ipcMain.on('set-printer', handleSetPrinter)
  ipcMain.on('get-printer', handleGetPrinter)
  ipcMain.on('print-buffer', handlePrint)

  const mainMenu = Menu.buildFromTemplate(customMenu);
  Menu.setApplicationMenu(mainMenu);
  createWindow();

})

app.on('window-all-closed', () => {
  isWin && app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

