
import axios from 'axios';



export const wssHandler = async () => {
	const userId = await window.ipc.loadFile('userId');
	const storeId = await window.ipc.loadFile('storeId');
	const accessToken = await window.ipc.getToken('accessToken');

	if (!userId || !storeId || !accessToken) {
		console.log('cancel socket connection!');
		return;
	}

	const baseUrl = `wss://wss.sinfactura.com?userId=${userId}&storeId=${storeId}`;
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
		const printerOrder = await window.ipc.loadFile('printer1');
		const printerInvoice = await window.ipc.loadFile('printer2');
		const printerTag = await window.ipc.loadFile('printer3');

		const baseUrl = 'https://api.sinfactura.com';
		const Authorization = `Bearer ${accessToken}`;

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
		if (ws.readyState === 1) ws.send('ping');
	}, 1000 * 60 * 1);

	// setInterval(() => {
	// 	// FORCE CLOSE TO TEST IT
	// 	ws.close();
	// }, 1000 * 5 * 1);

};