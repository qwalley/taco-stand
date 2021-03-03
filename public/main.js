const updateButton = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');

updateButton.addEventListener('click', _ => {
	fetch('/tacos', {
		method: 'put',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: 'Edgar',
			toppings: 'Edgar\'s Poop'
		})
	})
		.then(res => {
			if(res.ok) return res.json()
		})
		.then(response => {
			window.location.reload(true);
		});
});

deleteButton.addEventListener('click', _ => {
	fetch('/tacos', {
		method: 'delete',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: 'Edgar',
		})
	})
		.then(res => {
			if(res.ok) return res.json();
		})
		.then(response => {
			if (response === 'No poop to clean up') {
				messageDiv.textContent = response;
			}
			else {
				window.location.reload(true);
			}

		});
});