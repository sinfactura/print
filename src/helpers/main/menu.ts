
import { Menu, app } from 'electron';

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';

export const mainMenu = async () => {
	const customMenu = [
		...(isMac
			? [ {
				label: app.name,
				submenu: [
					{ role: 'about', label: 'Acerca de' },
					{ type: 'separator' },
					{ role: 'hide', label: 'Ocultar' },
					{ role: 'hideOthers', label: 'Ocultar otros' },
					{ role: 'unhide', label: 'Mostrar todo' },
					{ type: 'separator' },
					{ role: 'close', label: 'Cerrar', accelerator: 'CmdOrCtrl+W' },
					{ role: 'quit', label: 'Salir' },

				]
			} ]
			: [
				{
					label: 'Archivo',
					submenu: [
						{ role: 'quit', label: 'Salir', accelerator: 'CmdOrCtrl+W' }
					],
				},
			]),
		{
			label: 'Ventana',
			visible: isDev,
			submenu: [
				{ role: 'reload', label: 'Recargar' },
				{ role: 'forceReload', label: 'Forzar recarga' },
				{ role: 'toggleDevTools', label: 'Mostrar herramientas de desarrollo' },
			]
		},
	] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];

	return Menu.setApplicationMenu(Menu.buildFromTemplate(customMenu));
};
