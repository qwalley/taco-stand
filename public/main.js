const createButton = document.querySelector('#create-button');
const updateButton = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');
const form1 = document.querySelector('#form1');


const getCheckboxValues = (parent) => {
	let values = [];
	const inputs = parent.querySelectorAll('input:checked');
	for (const elem of inputs) {
		values.push(elem.name);
	}
	if (values.length === 0) {
		values.push('empty');
	}
	return values;
}

createButton.addEventListener('click', _ => {
	const toppings = getCheckboxValues(form1);
	let name = form1.querySelector('input[name=name]');
	if (name.value.length === 0) {
		name = 'Lost Taco';
	}
	else {
		name = name.value;
	}
	fetch('/tacos', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			name: name,
			toppings: toppings
		})
	})
		.then(res => {
			if(res.ok) return res.json()
		})
		.then(response => {
			window.location.reload(true);
		});
});

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