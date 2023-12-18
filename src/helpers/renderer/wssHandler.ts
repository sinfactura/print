
import axios from 'axios';


const userId = 'USR002';
const storeId = 'STO001';
const baseUrl = `wss://wss.sinfactura.com?userId=${userId}&storeId=${storeId}`;

export const wssHandler = () => {
	const ws = new WebSocket(baseUrl, []);

	// HANDLE ERRORS
	ws.onerror = (event) => {
		console.log('error event', event);
		setTimeout(() => {
			wssHandler();
		}, 1000);
	};

	// CONNECT
	ws.onopen = () => {
		console.log('socket open');
	};
	// DISCONNECT
	ws.onclose = () => {
		console.log('socket closed');
		setTimeout(() => {
			wssHandler();
		}, 1000);
	};

	ws.onmessage = async (event) => {
		const { action, data } = JSON.parse(event?.data) as { action: string, data: Record<string, string | number> };
		const printerOrder = await window.ipc.loadPrinter('printer1');
		const printerInvoice = await window.ipc.loadPrinter('printer2');
		const printerTag = await window.ipc.loadPrinter('printer3');

		const baseUrl = 'https://api.sinfactura.com';
		const Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZUlkIjoiU1RPMDAxIiwidXNlcklkIjoiVVNSMDAxIiwicm9sZXMiOiJBRE1JTiBVU0VSIFNVUEVSX1VTRVIgU1VQRVJfQURNSU4iLCJpYXQiOjE3MDIwNDI0MjksImV4cCI6MTcwMjEwNzIyOX0.Lwh2XVHBNE3aUtg_aRbhpUj2XPWuMYqT35t96f_-A_k';

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
					await window.ipc.print(tag, printerTag, true);
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
					await window.ipc.print(order, printerOrder);
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
					await window.ipc.print(invoice, printerInvoice);
					break;
				default:
					break;
			}
		} catch (error) {
			console.log(error);
		}
	};

	// KEEP ALIVE
	setInterval(() => {
		if (ws.readyState === 1) ws.send('live');
	}, 1000 * 60 * 1);

	// setInterval(() => {
	// 	// FORCE CLOSE TO TEST IT
	// 	ws.close();
	// }, 1000 * 5 * 1)

};