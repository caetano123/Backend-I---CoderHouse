// server.js
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  layoutsDir: join(__dirname, 'views', 'layouts')
}));
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Servidor y Socket.io
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
const io = new Server(server);

// Managers
const productManager = new ProductManager(join(__dirname, 'data', 'products.json'));
const cartManager = new CartManager(join(__dirname, 'data', 'carts.json'));

// Socket.io
io.on('connection', socket => {
  console.log('Cliente conectado');

  // Enviar datos iniciales
  socket.emit('updateProducts', productManager.getProducts());
  socket.emit('updateCarts', cartManager.getAllCarts());

  // --- PRODUCTOS ---
  socket.on('newProduct', prod => {
    productManager.addProduct(prod);
    io.emit('updateProducts', productManager.getProducts());
  });

  socket.on('deleteProduct', id => {
    productManager.deleteProduct(Number(id));
    io.emit('updateProducts', productManager.getProducts());
  });

  // --- CARRITOS ---
  socket.on('newCart', () => {
    cartManager.createCart();
    io.emit('updateCarts', cartManager.getAllCarts());
  });

  socket.on('getCartProducts', cid => {
    const cart = cartManager.getCartById(Number(cid));
    socket.emit('updateCartProducts', cart || { products: [] });
  });

  socket.on('removeProductFromCart', ({ cid, pid }) => {
  const cart = cartManager.getCartById(cid);
  if (cart) {
    cart.products = cart.products.filter(p => p.product !== pid);
    cartManager.saveCarts();
    io.emit('updateCartProducts', cart);
    io.emit('updateCarts', cartManager.getAllCarts());
  }
});

  socket.on('addProductToCart', ({ cid, pid }) => {
    const cart = cartManager.getCartById(Number(cid));
    const product = productManager.getProductById(Number(pid));
    if (cart && product) {
      const existing = cart.products.find(p => p.product == Number(pid));
      if (existing) {
        existing.quantity++;
      } else {
        cart.products.push({ product: Number(pid), quantity: 1 });
      }
      cartManager.saveCarts();
      io.emit('updateCartProducts', cart);
      io.emit('updateCarts', cartManager.getAllCarts());
    }
  });
});
