import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

// Instanciar managers
const productManager = new ProductManager(join(__dirname, '../data/products.json'));
const cartManager = new CartManager(join(__dirname, '../data/carts.json'));

// Ruta home
router.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('home', { title: 'Lista de Productos', products });
});

// Ruta realtime
router.get('/realtime', (req, res) => {
  const products = productManager.getProducts();
  const carts = cartManager.getAllCarts();

  res.render('realtime', { title: 'Productos en Tiempo Real', products, carts });
});

export default router;
