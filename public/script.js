const socket = io();

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    let price = parseFloat(document.getElementById('price').value.trim());

    if (!name || isNaN(price) || price <= 0) {
        alert("Por favor, ingresa un nombre válido y un precio mayor a 0.");
        return;
    }

    price = price.toFixed(2);

    socket.emit('newProduct', { name, price: price });

    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
});
