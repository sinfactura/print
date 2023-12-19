
import { session } from 'electron';
import { decodeJwt } from 'jose';

export const getRefreshToken = async () => {
	const url = 'https://api.sinfactura.com';
	const cookies = await session?.defaultSession.cookies.get({ url, name: 'refreshToken' });
	const refreshToken = cookies[ 0 ]?.value ?? undefined;
	const exp = refreshToken ? decodeJwt(refreshToken).exp ?? 0 : 0;
	const isTokenExpired = ((new Date().getTime() / 1000) > exp);
	return isTokenExpired ? undefined : refreshToken;
};