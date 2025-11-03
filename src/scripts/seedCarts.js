import mongoose from "mongoose";
import Cart from "../dao/models/cart.model.js";
import Product from "../dao/models/product.model.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/backend1";

async function seedCarts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    await Cart.deleteMany({});
    console.log("🗑️ Colección 'carts' vaciada.");

    const products = await Product.find();
    console.log(`📦 Encontrados ${products.length} productos`);

    // asignamos productos aleatorios a cada cart
    const carts = [
      {
        products: [
          { product: products[0]._id, quantity: 2 },
          { product: products[1]._id, quantity: 1 },
        ],
      },
      {
        products: [
          { product: products[2]._id, quantity: 1 },
          { product: products[3]._id, quantity: 3 },
        ],
      },
    ];

    const inserted = await Cart.insertMany(carts);
    console.log(`✅ Insertados ${inserted.length} carritos`);

    inserted.forEach((c, i) => console.log(`→ Cart ${i + 1} (${c._id})`));

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error al insertar carritos:", err);
  }
}

seedCarts();
