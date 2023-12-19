// GLOBAL TYPES
export { };


declare global {
	type Login = {
		accessToken: string, refreshToken: string, storeId: string, fullName: string
	}
	interface Window {
		ipc: {
			getPrinters: () => Promise<Record<string, string>[]>,
			setPrinter: (printer: string, name: string) => void,
			loadPrinter: (printer: string) => Promise<string>,
			print: (data: string, printer: string, isTag?: boolean) => Promise<void>,
			login: (login: Login) => void,
		},
	}
}