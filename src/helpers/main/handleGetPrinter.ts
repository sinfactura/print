import path from 'node:path';
import fs from 'node:fs';

export const handleGetPrinter = async (event: unknown, printer: string) => {
	const file = path.join(__dirname, `${printer}.txt`);
	if (!fs.existsSync(file)) return '';
	const data = fs.readFileSync(file).toString();
	console.log(data);
	return data;
};