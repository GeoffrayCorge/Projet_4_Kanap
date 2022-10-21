const orderId = document.getElementById('orderId');

const url = new URL(location.href);
const search_params = new URLSearchParams(url.search);

const id = search_params.get('id')

orderId.textContent = id;
