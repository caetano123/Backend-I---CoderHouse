import { Router } from "express";
import Product from "../dao/models/product.model.js";
import Cart from "../dao/models/cart.model.js";

const router = Router();

// Página principal (puede listar productos o un home genérico)
router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.render("home", { title: "Inicio", products });
});

// Catálogo con paginación
router.get("/products", async (req, res) => {
  let { limit = 10, page = 1, sort, query, status } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);

  const filter = {};

  // Filtrar por categoría
  if (query) filter.category = { $regex: query, $options: "i" };

  // Filtrar por disponibilidad
  if (status === "true") filter.status = true;
  else if (status === "false") filter.status = false;

  // Ordenar
  const sortOption = {};
  if (sort === "asc") sortOption.price = 1;
  else if (sort === "desc") sortOption.price = -1;

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const carts = await Cart.find().lean();

  res.render("products", {
    title: "Catálogo de Productos",
    products,
    carts,
    query,
    status,
    sort,
    page,
    totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}&sort=${sort || ""}&query=${query || ""}&status=${status || ""}` : null,
    nextLink: page < totalPages ? `/products?page=${page + 1}&limit=${limit}&sort=${sort || ""}&query=${query || ""}&status=${status || ""}` : null
  });
});



// Detalle de producto
router.get("/products/:pid", async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  if (!product) return res.status(404).send("Producto no encontrado");

  // Traer todos los carritos
  const carts = await Cart.find().lean();

  res.render("productDetail", {
    title: product.title,
    product,
    carts
  });
});


// Vista de carrito
router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid)
    .populate("products.product")
    .lean();

  if (!cart) return res.status(404).send("Carrito no encontrado");

  // Calcular total
  const total = cart.products.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  res.render("cart", { title: `Carrito ${req.params.cid}`, cart, total });
});

// Realtime
router.get("/realtime", async (req, res) => {
  const products = await Product.find().lean();
  const carts = await Cart.find().lean();
  res.render("realtime", { title: "Realtime", products, carts });
});

export default router;
