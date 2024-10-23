
import { handleWriteFile } from './handleWriteFile';

export const handleLogin = async (event: unknown, args: Record<string, string>) => {
	console.log(event, args);
	const { accessToken, refreshToken, storeId, userId, fullName } = args ?? {};
	handleWriteFile(null, 'accessToken', accessToken);
	handleWriteFile(null, 'refreshToken', refreshToken);
	handleWriteFile(null, 'storeId', storeId);
	handleWriteFile(null, 'userId', userId);
	handleWriteFile(null, 'fullName', fullName);
};