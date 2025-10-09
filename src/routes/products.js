import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const manager = new ProductManager('./src/data/products.json');

// Obtener todos los productos
router.get('/', (req, res) => {
  res.json(manager.getProducts());
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  // Validaciones básicas
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (typeof price !== 'number' || typeof stock !== 'number') {
    return res.status(400).json({ error: 'Price y stock deben ser números' });
  }

  const newProduct = manager.addProduct({
    title,
    description,
    code,
    price,
    status: status !== undefined ? status : true,
    stock,
    category,
    thumbnails: thumbnails || []
  });

  res.status(201).json(newProduct);
});

// Eliminar producto por ID
router.delete('/:pid', (req, res) => {
  const deleted = manager.deleteProduct(req.params.pid);
  deleted ? res.json(deleted) : res.status(404).json({ error: 'Producto no encontrado' });
});

export default router;
