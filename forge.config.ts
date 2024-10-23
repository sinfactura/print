
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'node:path';


const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const iconFile = isMac
	? 'icon.icns'
	: isWin
		? 'icon.ico'
		: 'icon.png';

const config: ForgeConfig = {
	packagerConfig: {
		icon: path.join(__dirname, 'build', iconFile),
		asar: false,
	},
	makers: [
		// windows distributable
		new MakerSquirrel({
			authors: 'SINFACTURA LLC',
			description: 'Cloud print app',
			setupIcon: path.join(__dirname, 'build', 'icon.ico')
		}),
		// darwin and win32 ZIP file
		new MakerZIP({}, [ 'darwin', 'win32' ]),
		// macOs distributable
		new MakerDMG({
			appPath: '',
			icon: path.join(__dirname, 'build', 'icon.icns'),
		}),
		new MakerRpm({}), new MakerDeb({})
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
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[ FuseV1Options.RunAsNode ]: false,
			[ FuseV1Options.EnableCookieEncryption ]: true,
			[ FuseV1Options.EnableNodeOptionsEnvironmentVariable ]: false,
			[ FuseV1Options.EnableNodeCliInspectArguments ]: false,
			[ FuseV1Options.EnableEmbeddedAsarIntegrityValidation ]: true,
			[ FuseV1Options.OnlyLoadAppFromAsar ]: true,
		}),
	],
};

export default config;
