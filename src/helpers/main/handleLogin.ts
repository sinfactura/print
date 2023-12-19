
import { session } from 'electron';

export const handleLogin = async (event: unknown, args: Record<string, string>) => {
	const ses = session.defaultSession;
	const url = 'https://api.sinfactura.com';

	const { accessToken, refreshToken, storeId, fullName } = args ?? {};
	const date = new Date();
	const expirationDate = Math.floor(date.getTime() / 1000) + (60 * 60 * 24);
	const expirationDateRefreshToken = Math.floor(date.getTime() / 1000) + (60 * 60 * 24 * 30);
	await ses.cookies.set({ url, name: 'accessToken', value: accessToken, expirationDate });
	await ses.cookies.set({ url, name: 'refreshToken', value: refreshToken, expirationDate: expirationDateRefreshToken });
	await ses.cookies.set({ url, name: 'storeId', value: storeId, expirationDate });
	await ses.cookies.set({ url, name: 'fullName', value: fullName, expirationDate });

};