
import path from 'node:path';
import fs from 'node:fs';

export const handleWriteFile = (event: unknown, fileName: string, name: string): void => {
	const filePath = path.join(__dirname, `${fileName}.txt`);
	fs.writeFileSync(filePath, name);
};