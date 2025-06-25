import { state } from '../app.js';
import { addToCart } from '../services/productService.js';
import { logout } from '../services/userService.js';

// Setup all event listeners
export function setupEventListeners() {
    // Make addToCart available globally
    window.addToCart = addToCart;

    // Setup cart page listeners
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-nav="cart"]')) {
            renderCart();
        }
        
        // Handle logout
        if (e.target.matches('[data-nav="logout"]')) {
            e.preventDefault();
            logout();
        }
    });
}

// Render cart items
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    cartItems.innerHTML = `
        <h2>Your Cart</h2>
        ${state.cart.map(item => `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('')}
        <div class="cart-total">
            <h3>Total: $${calculateTotal().toFixed(2)}</h3>
            <button onclick="checkout()">Checkout</button>
        </div>
    `;
}

// Calculate cart total
function calculateTotal() {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update item quantity
window.updateQuantity = function(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const cartItem = state.cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(state.cart));
        renderCart();
    }
};

// Remove item from cart
window.removeFromCart = function(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    renderCart();
};

// Checkout function
window.checkout = function() {
    // Implement checkout logic here
    alert('Checkout functionality to be implemented');
};

