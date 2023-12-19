
const selects = Array.from(document.getElementsByClassName('printer')) as HTMLInputElement[];

export const printersHandler = async () => {
	const printers = await window.ipc.getPrinters();

	selects.map(async (select) => {
		select.addEventListener('change', () => {
			window.ipc.writeFile(select.id, select.value);
		});
		const printerSelected = await window.ipc.loadFile(select.id);

		printers.map(({ description, printer, name, deviceId }) => {
			const option = document.createElement('option');
			option.text = description ?? name;
			option.value = printer ?? deviceId;
			option.selected = (printer ?? deviceId) === printerSelected;
			// option.disabled = status == 'idle' s? true : false;
			select.appendChild(option);
		});

	});

};