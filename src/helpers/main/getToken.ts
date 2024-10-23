
import { decodeJwt } from 'jose';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const getToken = async (fileName: 'refreshToken' | 'accessToken') => {
	const filePath = path.join(__dirname, `${fileName}.txt`);

	if (!existsSync(filePath)) return '';
	const token = readFileSync(filePath).toString();
	const exp = token ? decodeJwt(token).exp ?? 0 : 0;
	const isTokenExpired = ((new Date().getTime() / 1000) > exp);
	return isTokenExpired ? undefined : token;
};