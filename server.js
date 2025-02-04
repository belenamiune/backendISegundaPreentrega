const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

let products = [];

app.get('/products', (req, res) => {
  res.render('index', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
  console.log('Client online');

  socket.on('newProduct', (product) => {
    product.id = products.length + 1; 
    product.precio = parseFloat(product.price).toFixed(2);
    products.push(product);

    io.emit('productAdded', product);
  });

  
  socket.on('deleteProduct', (idProduct) => {
    products = products.filter((product) => product.id !== idProduct);
    io.emit('productDeleted', idProduct);
  });

  socket.on('disconnect', () => {
    console.log('Client offlne');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});
