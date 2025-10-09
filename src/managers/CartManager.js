import fs from 'fs';

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.loadCarts();
  }

  // Carga los carritos desde el archivo
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

  // Guarda los carritos en el archivo
  saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }

  // Crear un nuevo carrito vacío
  createCart() {
    const newId = this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  // Obtener carrito por ID
  getCartById(id) {
    return this.carts.find(c => c.id == id) || null;
  }

  // Agregar producto a un carrito
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

  // Eliminar carrito por ID
  deleteCartById(id) {
    const index = this.carts.findIndex(c => c.id == id);
    if (index === -1) return null;

    const deletedCart = this.carts.splice(index, 1)[0];
    this.saveCarts();
    return deletedCart;
  }

  // Obtener todos los carritos
  getAllCarts() {
    return this.carts;
  }
}
