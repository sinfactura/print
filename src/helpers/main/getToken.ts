
import { decodeJwt } from 'jose';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const getToken = async (name: 'refreshToken' | 'accessToken') => {
	const filePath = join(__dirname, `${name}.txt`);
	if (!existsSync(filePath)) return '';
	const token = readFileSync(filePath).toString();
	const exp = token ? decodeJwt(token).exp ?? 0 : 0;
	const isTokenExpired = ((new Date().getTime() / 1000) > exp);
	return isTokenExpired ? undefined : token;
};