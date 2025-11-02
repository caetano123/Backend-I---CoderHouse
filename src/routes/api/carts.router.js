import { Router } from "express";
import Cart from "../../dao/models/cart.model.js";
import Product from "../../dao/models/product.model.js";

const router = Router();

// GET todos los carritos
router.get("/", async (req, res) => {
  const carts = await Cart.find().populate("products.product").lean();
  res.json(carts);
});

// GET carrito por ID
router.get("/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
  if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
  res.json(cart);
});

// POST crear carrito
router.post("/", async (req, res) => {
  const cart = await Cart.create({ products: [] });
  res.status(201).json(cart);
});

// POST agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  const cart = await Cart.findById(cid).populate("products.product");
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const product = await Product.findById(pid); // ahora funciona
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });

  const existing = cart.products.find(p => p.product._id.toString() === pid);
  const newQuantity = existing ? existing.quantity + quantity : quantity;

  if (newQuantity > product.stock) {
    return res.status(400).json({ 
      error: `No hay stock suficiente. Stock disponible: ${product.stock}` 
    });
  }

  if (existing) existing.quantity += quantity;
  else cart.products.push({ product: pid, quantity });

  await cart.save();
  res.json(cart);
});

// PUT actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

  const item = cart.products.find(p => p.product.toString() === pid);
  if (item) item.quantity = quantity;

  await cart.save();
  res.json(cart);
});

// PUT actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body; // Array [{product: "id", quantity: num}, ...]

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

  cart.products = products;
  await cart.save();
  res.json(cart);
});

// DELETE eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.json(cart);
});

// DELETE eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = []; // vaciar el array de productos
    await cart.save();

    res.json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
