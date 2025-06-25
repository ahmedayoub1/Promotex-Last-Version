import { getCart, removeProductFromCart } from "../services/cartService.js";

export default function renderCartPage() {
  return `<div class="cart-container">
  <div><button class="buy-now-btn" data-nav="paymentgetway">Buy All Now</button></div>
    <h2 class="cart-title">My Cart</h2>
    <div id="cart-list" class="cart-list">Loading...</div>
  </div>`;
}

export async function setupCartPage() {
  const cartList = document.getElementById("cart-list");
  try {
    const raw = await getCart();
    const cart = Array.isArray(raw) ? raw : (raw?.data || raw?.cart || raw?.items || []);
    console.log("Cart items:", cart);
    if (!cart.length) {
      cartList.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
    cartList.innerHTML = cart.map(item => {
      const id = item.id || item.productId || item.ProductId;
      const imageUrl = item.imageUrl
        ? `http://localhost:5015/${item.imageUrl.replace(/^\/+/, '')}`
        : '/src/Assets/placeholder.jpg';
      return `
        <div class="cart-card" data-product-id="${id}">
          <img src="${imageUrl}" alt="${item.name}" onerror="this.onerror=null;this.src='/src/Assets/placeholder.jpg';">
          <div class="cart-info">
            <h4>${item.name}</h4>
            <span class="cart-qty">Qty: ${item.quantity}</span>
            <span class="cart-price">Unit: $${item.price}</span>
            <span class="cart-total">Total: $${item.price * item.quantity}</span>
            <div class="cart-actions">
              <button class="buy-now-btn" data-nav="paymentgetway">Buy Now</button>
              <button class="delete-btn" data-product-id="${id}">Delete</button>
            </div>
          </div>
          
        </div>
        
      `;
    }).join("");

    // Add event listeners for delete buttons
    cartList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const productId = btn.getAttribute('data-product-id');
        console.log("Deleting productId:", productId, typeof productId);
        if (!productId) {
          alert("Invalid product ID");
          return;
        }
        btn.disabled = true;
        btn.textContent = "Deleting...";
        try {
          await removeProductFromCart(productId);
          await setupCartPage(); // Refresh cart
        } catch (err) {
          alert(err.message || "Failed to remove product.");
          btn.disabled = false;
          btn.textContent = "Delete";
        }
      });
    });
  } catch (err) {
    cartList.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}