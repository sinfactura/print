
import { session } from 'electron';
import { decodeJwt } from 'jose';

export const getAccessToken = async () => {
	const url = 'https://api.sinfactura.com';
	const cookies = await session?.defaultSession.cookies.get({ url, name: 'accessToken' });
	const accessToken = cookies[ 0 ]?.value ?? undefined;
	const exp = accessToken ? decodeJwt(accessToken).exp ?? 0 : 0;
	const isTokenExpired = ((new Date().getTime() / 1000) > exp);
	return isTokenExpired ? undefined : accessToken;
};