
import path from 'node:path';
import fs from 'node:fs';

export const handleWriteFile = (event: unknown, printer: string, name: string): void => {
	const file = path.join(__dirname, `${printer}.txt`);
	fs.writeFileSync(file, name);
};