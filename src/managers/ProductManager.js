import fs from 'fs';

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  // Carga los productos desde el archivo
  loadProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = fs.readFileSync(this.path, 'utf-8');
        this.products = JSON.parse(data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    }
  }

  // Guarda los productos en el archivo
  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  // Obtener todos los productos
  getProducts() {
    return this.products;
  }

  // Obtener un producto por ID
  getProductById(id) {
    return this.products.find(p => p.id == id) || null;
  }

  // Agregar un producto
  addProduct(product) {
    const newId = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...product };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  // Actualizar un producto por ID
  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id == id);
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...updatedFields, id: this.products[index].id };
    this.saveProducts();
    return this.products[index];
  }

  // Eliminar un producto por ID
  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id == id);
    if (index === -1) return null;

    const deletedProduct = this.products.splice(index, 1)[0];
    this.saveProducts();
    return deletedProduct;
  }
}
