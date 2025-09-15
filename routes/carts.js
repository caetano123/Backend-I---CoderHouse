import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const manager = new CartManager('./data/carts.json');

router.get('/', (req, res) => {
    const carts = manager.getAllCarts();
    res.json(carts);
});

router.post('/', (req, res) => {
    const cart = manager.createCart();
    res.status(201).json(cart);
});

router.get('/:cid', (req, res) => {
    const cart = manager.getCartById(req.params.cid);
    cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

router.post('/:cid/product/:pid', (req, res) => {
    const updatedCart = manager.addProductToCart(req.params.cid, parseInt(req.params.pid));
    updatedCart ? res.json(updatedCart) : res.status(404).json({ error: 'Carrito no encontrado' });
});

router.delete('/:cid', (req, res) => {
    const deletedCart = manager.deleteCartById(req.params.cid);
    if (deletedCart) {
        res.json({ message: 'Carrito eliminado', cart: deletedCart });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});



export default router;
