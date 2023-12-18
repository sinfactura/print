
export const loginHandler = () => {

	// REFERENCES
	const emailNode = document.getElementById('email');
	const passNode = document.getElementById('password');
	const buttonNode = document.getElementById('buttonSend');
	const mainDiv = document.getElementById('main-div');
	const loginDiv = document.getElementById('login-div');

	let email = '';
	let password = '';

	// LISTENERS
	emailNode?.addEventListener('change', ({ target }: { target: unknown }) => {
		const { value } = target as { value: string };
		email = value;
	});
	passNode?.addEventListener('change', ({ target }: { target: unknown }) => {
		const { value } = target as { value: string };
		password = value;
	});


	buttonNode.addEventListener('click', (e) => {
		e.preventDefault();
		window.ipc.login(email, password);
		mainDiv.style.display = 'block';
		loginDiv.style.display = 'none';
	});

};