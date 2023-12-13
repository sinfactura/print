
import { Menu } from 'electron';

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
] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];

export const mainMenu = Menu.buildFromTemplate(customMenu);