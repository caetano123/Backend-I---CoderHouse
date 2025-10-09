const socket = io();

// --- ELEMENTOS DEL DOM ---
const productsList = document.getElementById('productsList');
const addProductForm = document.getElementById('addProductForm');

const createCartForm = document.getElementById('createCartForm');
const cartSelect = document.getElementById('cartSelect');
const cartProductsList = document.getElementById('cartProductsList');

// --- FUNCIONES AUXILIARES ---
function renderProducts(products) {
  const selectedCart = cartSelect.value;

  productsList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong data-id="${p.id}" data-stock="${p.stock}">${p.title}</strong> - $${p.price} <br>
      ${p.description} <br>
      Código: ${p.code} | Stock: ${p.stock} | Categoría: ${p.category}
    `;

    if (p.thumbnails && p.thumbnails.length) {
      p.thumbnails.forEach(img => {
        const image = document.createElement('img');
        image.src = img;
        image.width = 100;
        li.appendChild(image);
      });
    }

    // Botón "Agregar al carrito"
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Agregar al carrito';
    addBtn.classList.add('addToCart');
    addBtn.dataset.id = p.id;

    // Botón "Eliminar producto"
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Eliminar de Lista';
    delBtn.classList.add('deleteProduct');
    delBtn.dataset.id = p.id;

    li.appendChild(addBtn);
    li.appendChild(delBtn);
    productsList.appendChild(li);
  });

  cartSelect.value = selectedCart;
}

function renderCarts(carts) {
  const selectedCart = cartSelect.value;

  cartSelect.innerHTML = '<option value="">-- Selecciona un carrito --</option>';
  carts.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = `Carrito #${c.id}`;
    cartSelect.appendChild(option);
  });

  if (selectedCart) cartSelect.value = selectedCart;
}

function renderCartProducts(cart) {
  cartProductsList.innerHTML = '';
  if (!cart || !cart.products.length) {
    cartProductsList.innerHTML = '<li>No hay productos en este carrito</li>';
    return;
  }

  cart.products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.product;
    li.dataset.quantity = p.quantity; // <- aquí guardamos la cantidad
    li.textContent = `Producto ID: ${p.product} | Cantidad: ${p.quantity}`;

    // Botón "Eliminar del carrito"
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar del carrito';
    removeBtn.classList.add('removeFromCart');
    removeBtn.dataset.id = p.product;

    li.appendChild(removeBtn);
    cartProductsList.appendChild(li);
  });
}

// --- SOCKET EVENTS ---
socket.on('updateProducts', renderProducts);
socket.on('updateCarts', renderCarts);
socket.on('updateCartProducts', renderCartProducts);

// --- AGREGAR PRODUCTO ---
addProductForm.addEventListener('submit', e => {
  e.preventDefault();

  const thumbnailsArray = document.getElementById('thumbnails').value
    .split(',')
    .map(t => t.trim())
    .filter(t => t !== '');

  const prod = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
    thumbnails: thumbnailsArray,
    status: true
  };

  socket.emit('newProduct', prod);
  addProductForm.reset();
});

// --- CREAR CARRITO ---
createCartForm.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('newCart');
});

// --- SELECCIONAR CARRITO ---
cartSelect.addEventListener('change', () => {
  const selectedId = parseInt(cartSelect.value);
  if (!selectedId) {
    cartProductsList.innerHTML = '';
    return;
  }
  socket.emit('getCartProducts', selectedId);
});

// --- AGREGAR AL CARRITO / ELIMINAR PRODUCTO ---
productsList.addEventListener('click', e => {
  const selectedCart = parseInt(cartSelect.value);
  if (e.target.classList.contains('addToCart')) {
    if (!selectedCart) return alert('Selecciona primero un carrito');

    const productId = Number(e.target.dataset.id);
    const li = e.target.parentElement;
    const stock = Number(li.querySelector('strong').dataset.stock);

    // Verificar cantidad actual en carrito usando dataset.quantity
    const existingLi = Array.from(cartProductsList.children)
      .find(item => Number(item.dataset.id) === productId);
    const currentQuantity = existingLi ? Number(existingLi.dataset.quantity) : 0;

    if (currentQuantity >= stock) {
      return alert('No se puede agregar más unidades, stock alcanzado');
    }

    socket.emit('addProductToCart', { cid: selectedCart, pid: productId });
  }

  if (e.target.classList.contains('deleteProduct')) {
    const productId = Number(e.target.dataset.id);
    socket.emit('deleteProduct', productId);
  }
});

// --- ELIMINAR DEL CARRITO ---
cartProductsList.addEventListener('click', e => {
  const selectedCart = parseInt(cartSelect.value);
  if (!selectedCart) return;

  if (e.target.classList.contains('removeFromCart')) {
    const productId = Number(e.target.dataset.id);
    socket.emit('removeProductFromCart', { cid: selectedCart, pid: productId });
  }
});
