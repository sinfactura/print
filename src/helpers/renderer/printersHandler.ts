
const selects = Array.from(document.getElementsByClassName('printer')) as HTMLInputElement[];

export const printersHandler = async () => {
	const printers = await window.data.getPrinters();

	selects.map(async (select) => {
		select.addEventListener('change', () => {
			window.data.setPrinter(select.id, select.value);
		});
		const printerSelected = await window.data.loadPrinter(select.id);

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