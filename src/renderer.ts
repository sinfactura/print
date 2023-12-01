
import './index.css';

const selects = Array.from(document.getElementsByClassName('printer')) as HTMLInputElement[];

(async () => {
	const printers = await window.data.printers();

	selects.map(async (select) => {
		select.addEventListener('change', () => {
			window.data.setPrinter(select.id, select.value)
		})
		const printerSelected = await window.data.getPrinter(select.id);

		printers.map(({ description, printer }) => {
			const option = document.createElement("option");
			option.text = description;
			option.value = printer;
			option.selected = printer === printerSelected;
			// option.disabled = status == 'idle' s? true : false;
			select.appendChild(option);
		});

	});

})();

const userId = 'USR002';
const storeId = 'STO001';
const baseUrl = `wss://wss.sinfactura.com?userId=${userId}&storeId=${storeId}`;

const connectWs = () => {
	const ws = new WebSocket(baseUrl, [])

	// HANDLE ERRORS
	ws.onerror = (event) => {
		console.log('error event', event);
	}

	// CONNECT
	ws.onopen = () => {
		console.log('socket open');
	}
	// DISCONNECT
	ws.onclose = () => {
		console.log('socket closed');
		connectWs();
	}

	ws.onmessage = async (event) => {
		const { action, data } = JSON.parse(event?.data) as { action: string, data: Record<string, string | number> };
		const printerTag = await window.data.getPrinter('printer3');
		const printerOrder = await window.data.getPrinter('printer1');
		const printerInvoice = await window.data.getPrinter('printer2');

		switch (action) {
			case 'print-tag':
				console.log('print tag');
				console.log(printerTag);
				console.log(data);
				break;

			case 'print-order':
				console.log('print order');
				console.log(printerOrder);
				console.log(data);
				break;

			case 'print-invoice':
				console.log('print invoice');
				console.log(printerInvoice);
				console.log(data);
				break;
			default:
				break;
		}
	}

	// KEEP ALIVE
	setInterval(() => {
		if (ws.readyState === 1) ws.send('live')
	}, 1000 * 60 * 2)

	// setInterval(() => {
	// 	// FORCE CLOSE TO TEST IT
	// 	ws.close();
	// }, 1000 * 5 * 1)

};

connectWs();