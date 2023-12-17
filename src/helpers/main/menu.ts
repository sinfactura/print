
import { Menu } from 'electron';

const customMenu = [
	{ role: 'appMenu' },
	{ role: 'viewMenu' },
	{ role: 'windowMenu' },
] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];

// if (process.platform === 'darwin') customMenu.unshift({ role: 'appMenu' });

const mainMenu = Menu.buildFromTemplate(customMenu);

export const MainMenu = () => Menu.setApplicationMenu(mainMenu);
