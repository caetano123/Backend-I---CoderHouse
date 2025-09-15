import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

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

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id == id);
    }

    addProduct(product) {
        const newId = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, ...product };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) return null;
        this.products[index] = { ...this.products[index], ...updatedFields, id: this.products[index].id };
        this.saveProducts();
        return this.products[index];
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) return null;
        const deleted = this.products.splice(index, 1)[0];
        this.saveProducts();
        return deleted;
    }
}
