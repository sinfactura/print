
import axios from 'axios';
import { wssHandler } from './wssHandler';

export const loginHandler = async () => {

	// REFERENCES
	const emailNode = document.getElementById('email');
	const passNode = document.getElementById('password');
	const frmLogin = document.getElementById('frm-login');
	const mainDiv = document.getElementById('main-div');
	const loginDiv = document.getElementById('login-div');
	const loading = document.getElementById('loading');
	const message = document.getElementById('message');
	const logoutButton = document.getElementById('btn-logout');

	let email = '';
	let password = '';
	const baseUrl = 'https://api.sinfactura.com';

	// LISTENERS
	emailNode?.addEventListener('change', ({ target }: { target: unknown }) => {
		const { value } = target as { value: string };
		email = value;
	});
	passNode?.addEventListener('change', ({ target }: { target: unknown }) => {
		const { value } = target as { value: string };
		password = value;
	});

	logoutButton.addEventListener('click', () => {
		showLoading(true);
		window.ipc.writeFile('accessToken', '');
		window.ipc.writeFile('refreshToken', '');

		setTimeout(() => {
			wssHandler();
			showMain(false);
			showLoading(false);
		}, 1000);
	});

	// HANDLERS
	const showLoading = (on: boolean) => on ? loading.classList.remove('hidden') : loading.classList.add('hidden');
	const showError = (on: boolean, msg?: string) => {
		message.innerText = msg ? msg : 'Email o contraseña incorrectos!';
		on ? message.classList.remove('hidden') : message.classList.add('hidden');
	};

	const showMain = (on: boolean) => {
		on ? loginDiv.classList.add('hidden') : loginDiv.classList.remove('hidden');
		on ? mainDiv.classList.remove('hidden') : mainDiv.classList.add('hidden');
	};

	// VALIDATE TOKENS
	const accessToken = await window.ipc.getToken('accessToken');
	const refreshToken = await window.ipc.getToken('refreshToken');

	// GO HOME
	if (accessToken) {
		wssHandler();
		return showMain(true);
	}

	// GO AUTO LOGIN
	if (refreshToken) {
		showLoading(true);

		await axios({
			url: `${baseUrl}/auth/refresh`,
			method: 'post',
			headers: {
				Authorization: `${refreshToken}`
			}
		}).then(async ({ data: { data = {} } }) => {

			const {
				roles,
				accessToken,
			} = data;
			if (!`${roles}`.includes('ADMIN')) return (
				showError(true, 'No tiene permisos administrativos!'),
				showLoading(false)
			);

			window.ipc.writeFile('accessToken', accessToken);
			showError(false);
			showMain(true);
			showLoading(false);
			wssHandler();
		})
			.catch(() => {
				showError(true);
				showMain(false);
				showLoading(false);
			});
		return;
	}

	frmLogin.addEventListener('submit', async (e) => {
		e.preventDefault();
		showError(false);
		showLoading(true);

		const validateEmail = (email: string): boolean => {
			const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			return regex.test(email);
		};

		if (!validateEmail(email) ?? (password.length < 8)) {
			showError(true);
			showLoading(false);
			return;
		}

		await axios({
			url: `${baseUrl}/auth/login`,
			method: 'POST',
			data: { email, password },
		}).then(({ data: { data = {} } }) => {

			const {
				roles,
				accessToken,
				fullName,
				refreshToken,
				storeId,
				userId,
			} = data;

			if (!`${roles}`.includes('ADMIN')) return (
				showError(true, 'No tiene permisos administrativos!'),
				showLoading(false)
			);

			window.ipc.login({ accessToken, refreshToken, fullName, storeId, userId });
			showError(false);
			showMain(true);
			showLoading(false);
			setTimeout(() => {
				wssHandler();
			}, 500);
		})
			.catch(() => {
				showError(true);
				showMain(false);
				showLoading(false);
			});

	});

};