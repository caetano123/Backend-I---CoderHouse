import Product from "../models/product.model.js";

class ProductManager {
  async getProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error("Error al obtener productos: " + error.message);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error("Error al buscar el producto: " + error.message);
    }
  }

  async addProduct(data) {
    try {
      const newProduct = new Product(data);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar producto: " + error.message);
    }
  }

  async updateProduct(id, data) {
    try {
      return await Product.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar producto: " + error.message);
    }
  }
}

export default ProductManager;
