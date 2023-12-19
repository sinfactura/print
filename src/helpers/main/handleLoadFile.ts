
import path from 'node:path';
import fs from 'node:fs';

export const handleLoadFile = (fileName: string) => {
	const filePath = path.join(__dirname, `${fileName}.txt`);
	if (!fs.existsSync(filePath)) return '';
	const data = fs.readFileSync(filePath).toString();
	return data;
};