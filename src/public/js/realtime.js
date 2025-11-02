const socket = io();

// ================================
// AGREGAR PRODUCTO
// ================================
document.getElementById("addProductForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    code: document.getElementById("code").value.trim(),
    price: Number(document.getElementById("price").value),
    stock: Number(document.getElementById("stock").value),
    category: document.getElementById("category").value.trim(),
    thumbnails: document.getElementById("thumbnails").value
      .split(",")
      .map(url => url.trim())
      .filter(url => url !== "")
  };

  socket.emit("newProduct", product);
  e.target.reset();
});

// ================================
//  ELIMINAR PRODUCTO
// ================================
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

// ================================
// CREAR CARRITO NUEVO
// ================================
document.getElementById("createCartForm").addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("newCart");
});

// ================================
// AGREGAR PRODUCTO A CARRITO
// ================================
function addProductToCart(pid) {
  const cid = document.getElementById("cartSelect").value;
  if (!cid) {
    alert("Selecciona un carrito primero");
    return;
  }

  const quantityInput = document.getElementById(`quantity-${pid}`);
  const quantity = quantityInput ? Number(quantityInput.value) : 1;

  socket.emit("addProductToCart", { cid, pid, quantity });
}


// ================================
// ➖ ELIMINAR PRODUCTO DE CARRITO
// ================================
function removeProductFromCart(pid) {
  const cid = document.getElementById("cartSelect").value;
  if (!cid) return alert("Selecciona un carrito primero");
  socket.emit("removeProductFromCart", { cid, pid });
}

// ================================
// 🔄 ACTUALIZAR PRODUCTOS EN TIEMPO REAL
// ================================
socket.on("updateProducts", (products) => {
  const list = document.getElementById("productsList");
  list.innerHTML = "";

  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price} <br>
      ${p.description} <br>
      Código: ${p.code} | Stock: ${p.stock} | Categoría: ${p.category} <br>
      ${p.thumbnails ? p.thumbnails.map(url => `<img src="${url}" width="100">`).join("") : ""}
      <button onclick="addProductToCart('${p._id}')">🛒 Agregar al carrito</button>
      <button onclick="deleteProduct('${p._id}')">🗑️ Eliminar producto</button>
    `;
    list.appendChild(li);
  });
});

// ================================
// 🔄 ACTUALIZAR CARRITOS EN TIEMPO REAL
// ================================
socket.on("updateCarts", (carts) => {
  const select = document.getElementById("cartSelect");
  select.innerHTML = '<option value="">-- Selecciona un carrito --</option>';

  carts.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c._id;
    opt.textContent = `Carrito ${c._id.slice(-4)}`;
    select.appendChild(opt);
  });
});

// ================================
// 🔄 ACTUALIZAR PRODUCTOS DE CARRITO SELECCIONADO
// ================================
socket.on("updateCartProducts", (cart) => {
  const list = document.getElementById("cartProductsList");
  list.innerHTML = "";

  if (!cart || !cart.products || cart.products.length === 0) {
    list.innerHTML = "<li>Carrito vacío</li>";
    return;
  }

  cart.products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.product.title} - Cantidad: ${p.quantity}
      <button onclick="removeProductFromCart('${p.product._id}')">❌</button>
    `;
    list.appendChild(li);
  });
});

// ================================
// ⚠️ MENSAJES DE ERROR DE STOCK
// ================================
socket.on("cartError", (msg) => {
  alert(msg);
});