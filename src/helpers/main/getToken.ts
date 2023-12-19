
import { session } from 'electron';
import { decodeJwt } from 'jose';

export const getToken = async (name: 'refreshToken' | 'accessToken') => {
	const url = 'https://api.sinfactura.com';
	const cookies = await session?.defaultSession.cookies.get({ url, name });
	const token = cookies[ 0 ]?.value ?? undefined;
	const exp = token ? decodeJwt(token).exp ?? 0 : 0;
	const isTokenExpired = ((new Date().getTime() / 1000) > exp);
	return isTokenExpired ? undefined : token;
};