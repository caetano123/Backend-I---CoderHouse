document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".addToCartBtn");
  const cartSelect = document.getElementById("cartSelect");
  const viewCartBtn = document.getElementById("viewCartBtn");
  const emptyCartBtn = document.getElementById("emptyCartBtn");

  // Agregar productos al carrito desde la lista de productos
  if (addButtons.length > 0) {
  addButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.productid;
      const cartId = cartSelect.value;

      if (!cartId) {
        alert("Por favor selecciona un carrito primero.");
        return;
      }

      try {
        // Obtener cantidad si existe el input
        let quantity = 1;
        const qtyInput = document.getElementById("quantity");
        if (qtyInput) quantity = parseInt(qtyInput.value);

        // Obtener datos del producto
        const productRes = await fetch(`/api/products/${productId}`);
        if (!productRes.ok) throw new Error("No se pudo obtener el producto");
        const productData = await productRes.json();

        // Verificar stock
        if (productData.payload.stock < quantity) {
          alert("No hay stock suficiente para este producto");
          return;
        }

        // Agregar al carrito
        const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity })
        });

        if (res.ok) {
          alert("Producto agregado al carrito!");
        } else {
          const data = await res.json();
          alert("Error: " + (data.error || "No se pudo agregar el producto"));
        }
      } catch (error) {
        console.error(error);
        alert("Error al agregar producto al carrito");
      }
    });
  });
}


  // Botón para ver carrito seleccionado
  if (viewCartBtn) {
    viewCartBtn.addEventListener("click", () => {
      const cartId = cartSelect.value;
      if (!cartId) {
        alert("Selecciona un carrito para verlo");
        return;
      }
      window.location.href = `/carts/${cartId}`;
    });
  }

  // Botón para vaciar carrito
  if (emptyCartBtn) {
    emptyCartBtn.addEventListener("click", async () => {
      const cartId = emptyCartBtn.dataset.cartid; // se debe pasar con data-cartid desde Handlebars
      if (!cartId) return;

      if (!confirm("¿Seguro querés vaciar el carrito?")) return;

      try {
        const res = await fetch(`/api/carts/${cartId}`, {
          method: "DELETE"
        });

        if (res.ok) {
          alert("Carrito vaciado!");
          window.location.reload();
        } else {
          const data = await res.json();
          alert("Error: " + (data.error || "No se pudo vaciar el carrito"));
        }
      } catch (error) {
        console.error(error);
        alert("Error al vaciar el carrito");
      }
    });
  }
});
