import { apiRequest } from "./api.js";

export async function getCart() {
  try {
    const response = await apiRequest("/api/Cart/View", {
      method: "GET",
      credentials: "include"
    });
    // Handle both array and wrapped object
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.data)) return response.data;
    if (response && Array.isArray(response.cart)) return response.cart;
    if (response && Array.isArray(response.items)) return response.items;
    return [];
  } catch (error) {
    throw new Error(error.message || "Failed to fetch cart.");
  }
}

export async function addProductToCart(productId, quantity = 1) {
  return apiRequest("/api/Cart/add", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ProductId: productId, Quantity: quantity }),
  });
}

// Remove a product from the cart by product ID
export async function removeProductFromCart(productId) {
  await apiRequest(`/api/Cart/remove/${productId}`, {
    method: "DELETE",
    credentials: "include"
  });
}