import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";
import { create } from "express-handlebars";  

import Product from "./dao/models/product.model.js";
import Cart from "./dao/models/cart.model.js";

import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/api/products.router.js";
import cartsRouter from "./routes/api/carts.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Conexión a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", join(__dirname, "views"));
app.set("view engine", "handlebars");

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const hbs = create({
  extname: ".handlebars",
  helpers: {
    eq: (a, b) => a == b
  }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Socket.io (opcional si querés tiempo real)
io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviar datos iniciales
  const products = await Product.find().lean();
  const carts = await Cart.find().lean();
  socket.emit("updateProducts", products);
  socket.emit("updateCarts", carts);

  // Crear producto
  socket.on("newProduct", async (prod) => {
    await Product.create(prod);
    const updatedProducts = await Product.find().lean();
    io.emit("updateProducts", updatedProducts);
  });

  // Eliminar producto
  socket.on("deleteProduct", async (id) => {
    await Product.findByIdAndDelete(id);
    const updatedProducts = await Product.find().lean();
    io.emit("updateProducts", updatedProducts);
  });

  // Crear carrito nuevo
  socket.on("newCart", async () => {
    await Cart.create({ products: [] });
    const updatedCarts = await Cart.find().lean();
    io.emit("updateCarts", updatedCarts);
  });

  // Agregar producto a carrito con validación de stock
  socket.on("addProductToCart", async ({ cid, pid, quantity = 1 }) => {
    const cart = await Cart.findById(cid).populate("products.product");
    const product = await Product.findById(pid);
    if (!cart || !product) return;

    const existing = cart.products.find(p => p.product._id.toString() === pid);
    const currentQty = existing ? existing.quantity : 0;
    const totalQty = currentQty + quantity;

    if (totalQty > product.stock) {
      socket.emit("cartError", `No hay suficiente stock. Disponible: ${product.stock}`);
      return;
    }

    if (existing) existing.quantity += quantity;
    else cart.products.push({ product: pid, quantity });

    await cart.save();
    const updatedCart = await Cart.findById(cid).populate("products.product").lean();
    io.emit("updateCartProducts", updatedCart);
  });

  // Eliminar producto de carrito
  socket.on("removeProductFromCart", async ({ cid, pid }) => {
    const cart = await Cart.findById(cid);
    if (!cart) return;

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    const updatedCart = await Cart.findById(cid).populate("products.product").lean();
    io.emit("updateCartProducts", updatedCart);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);

