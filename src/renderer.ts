
import axios from 'axios';
import './index.css';


const selects = Array.from(document.getElementsByClassName('printer')) as HTMLInputElement[];

(async () => {
	const printers = await window.data.printers();

	selects.map(async (select) => {
		select.addEventListener('change', () => {
			window.data.setPrinter(select.id, select.value)
		})
		const printerSelected = await window.data.getPrinter(select.id);

		printers.map(({ description, printer, name, deviceId }) => {
			const option = document.createElement("option");
			option.text = description ?? name;
			option.value = printer ?? deviceId;
			option.selected = (printer ?? deviceId) === printerSelected;
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
		connectWs();
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
		const printerOrder = await window.data.getPrinter('printer1');
		const printerInvoice = await window.data.getPrinter('printer2');
		const printerTag = await window.data.getPrinter('printer3');

		const baseUrl = 'https://api.sinfactura.com';
		const Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZUlkIjoiU1RPMDAxIiwidXNlcklkIjoiVVNSMDAxIiwicm9sZXMiOiJBRE1JTiBVU0VSIFNVUEVSX1VTRVIgU1VQRVJfQURNSU4iLCJpYXQiOjE3MDE2MTg0NDAsImV4cCI6MTcwMTY4MzI0MH0.o99zWdZwika8habLcxXBj2WLNi5BmQHWKh69rOFoJoo';

		try {


			switch (action) {
				case 'print-tag':
					if (!printerTag) return;
					// eslint-disable-next-line no-case-declarations
					const { data: { data: tag } } = await axios({
						url: `${baseUrl}/orders/tag`,
						method: 'POST',
						headers: { Authorization },
						data,
					});
					await window.data.print(tag, printerTag)
					break;

				case 'print-order':
					if (!printerOrder) return;
					// eslint-disable-next-line no-case-declarations
					const { data: { data: order } } = await axios({
						url: `${baseUrl}/orders/pdf`,
						params: { orderId: data?.orderId },
						method: 'GET',
						headers: { Authorization }
					});
					await window.data.print(order, printerOrder)
					break;

				case 'print-invoice':
					if (!printerInvoice) return;
					// eslint-disable-next-line no-case-declarations
					const { data: { data: invoice } } = await axios({
						url: `${baseUrl}/invoices/pdf`,
						params: { invoiceId: data?.invoiceId },
						method: 'GET',
						headers: { Authorization }
					});
					await window.data.print(invoice, printerInvoice)
					break;
				default:
					break;
			}
		} catch (error) {
			console.log(error);
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