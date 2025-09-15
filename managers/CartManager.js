import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.loadCarts();
    }

    loadCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = fs.readFileSync(this.path, 'utf-8');
                this.carts = JSON.parse(data);
            }
        } catch (err) {
            console.error('Error loading carts:', err);
        }
    }

    saveCarts() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
    }

    createCart() {
        const newId = this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1;
        const newCart = { id: newId, products: [] };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(c => c.id == id);
    }

    addProductToCart(cid, pid) {
        const cart = this.getCartById(cid);
        if (!cart) return null;

        const productInCart = cart.products.find(p => p.product == pid);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        this.saveCarts();
        return cart;
    }

    deleteCartById(id) {
    const index = this.carts.findIndex(c => c.id == id);
    if (index === -1) return null;

    const deletedCart = this.carts.splice(index, 1)[0]; // elimina y guarda el carrito eliminado
    this.saveCarts();
    return deletedCart;
    }

    getAllCarts() {
        return this.carts;
    }

}
