
import './index.css';

const selects = Array.from(document.getElementsByClassName('printer')) as HTMLInputElement[];

(async () => {
	const data = await window.data.printers();

	selects.map(select => {
		select.addEventListener('change', () => {
			localStorage.setItem(select.id, select.value);
		})
		data.map(({ description, printer }) => {
			const option = document.createElement("option");
			option.text = description;
			option.value = printer;
			option.selected = printer === localStorage.getItem(select.id);
			// option.disabled = status == 'idle' ? true : false;
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

	ws.onmessage = (event) => {
		const { action, data } = JSON.parse(event?.data) as { action: string, data: Record<string, string | number> };
		switch (action) {
			case 'print-tag':
				console.log('print tag');
				console.log(data);
				break;

			case 'print-order':
				console.log('print order');
				console.log(data);
				break;

			case 'print-invoice':
				console.log('print invoice');
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