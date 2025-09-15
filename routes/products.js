import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const manager = new ProductManager('./data/products.json');

router.get('/', (req, res) => {
    res.json(manager.getProducts());
});

router.get('/:pid', (req, res) => {
    const product = manager.getProductById(req.params.pid);
    product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', (req, res) => {
    const newProduct = manager.addProduct(req.body);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const updated = manager.updateProduct(req.params.pid, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
});

router.delete('/:pid', (req, res) => {
    const deleted = manager.deleteProduct(req.params.pid);
    deleted ? res.json(deleted) : res.status(404).json({ error: 'Producto no encontrado' });
});

export default router;
