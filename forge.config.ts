import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';
import path from 'node:path';

const config: ForgeConfig = {
	packagerConfig: {
		icon: '/src/icons',
	},
	makers: [
		// windows distributable
		new MakerSquirrel({
			authors: 'SINFACTURA LLC',
			description: 'Cloud print app',
			setupIcon: path.join(__dirname, 'src', 'icons', 'icon.ico')
		}),
		// darwin and win32 ZIP file
		new MakerZIP({}, [ 'darwin', 'win32' ]),
		// macOs distributable
		new MakerDMG({
			icon: path.join(__dirname, 'src', 'icons', 'icon.icns')
		}),
	],
	plugins: [
		new VitePlugin({
			// `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
			// If you are familiar with Vite configuration, it will look really familiar.
			build: [
				{
					// `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
					entry: 'src/main.ts',
					config: 'vite.main.config.ts',
				},
				{
					entry: 'src/preload.ts',
					config: 'vite.preload.config.ts',
				},
			],
			renderer: [
				{
					name: 'main_window',
					config: 'vite.renderer.config.ts',
				},
			],
		}),
	],
};

export default config;
