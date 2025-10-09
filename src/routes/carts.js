import express from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const cartManager = new CartManager('./src/data/carts.json');
const productManager = new ProductManager('./src/data/products.json');

// Obtener todos los carritos
router.get('/', (req, res) => {
  const carts = cartManager.getAllCarts();
  res.json(carts);
});

// Crear un nuevo carrito vacío
router.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener un carrito por ID
router.get('/:cid', (req, res) => {
  const cart = cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const cart = cartManager.getCartById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  const product = productManager.getProductById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  // Evitar duplicados
  const existingProduct = cart.products.find(p => p.product === pid);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  cartManager.saveCarts();
  res.json(cart);
});

// Eliminar un carrito por ID
router.delete('/:cid', (req, res) => {
  const deletedCart = cartManager.deleteCartById(parseInt(req.params.cid));
  if (!deletedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json({ message: 'Carrito eliminado', cart: deletedCart });
});

export default router;
