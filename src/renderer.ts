
import './index.css';
import { wssHandler } from './helpers/renderer/wssHandler';
import { printersHandler } from './helpers/renderer/printersHandler';

printersHandler();
wssHandler();

const emailNode = document.getElementById('email');


emailNode?.addEventListener('change', ({ target }: { target: unknown }) => {

	const { value } = target as { value: string };

	console.log(value);
});