import path from 'node:path';
import fs from 'node:fs';
import { print as printUnix } from 'unix-print';
import { print as printWin } from 'pdf-to-printer';

export const handlePrint = async (event: unknown, data: string, printer: string, isTag = false) => {
	const file = path.join(__dirname, 'fileToPrint.pdf');

	const formatedData = Buffer.from(data.slice(28, 999999), 'base64');
	const isWin = process.platform === 'win32';

	fs.createWriteStream(file).write(formatedData, async () => {
		const options = [
			`-o ${isTag ? 'portrait' : 'landscape'}`,
			'-o fit-to-page',
			`-o media=${isTag ? 'A6' : 'A4'}`,
		];

		isWin
			? await printWin(file, {
				printer,
				scale: 'fit',
				orientation: `${isTag ? 'portrait' : 'portrait'}`,
				paperSize: `${isTag ? 'A6' : 'A4'}`,
				sumatraPdfPath: path.join(__dirname, '..', '..', 'node_modules\\pdf-to-printer\\dist\\SumatraPDF-3.4.6-32.exe')
			})
				.then(res => {
					console.log('Archivo impreso', res);
				}).catch(err => {
					console.log('Error al imprimir', err);
				})
			: await printUnix(file, printer, options)
				.then((res) => {
					console.log('Archivo impreso', res);
					fs.unlinkSync(file);
				})
				.catch((err) => {
					console.log('Error al imprimir', err);
					fs.unlinkSync(file);
				});
	});
};