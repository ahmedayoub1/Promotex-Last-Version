import { apiRequest } from "./api.js";

export async function addProduct(product) {
  const formData = new FormData();
  formData.append("Name", product.name);
  formData.append("Description", product.description);
  formData.append("Price", product.price);
  formData.append("ImageUrl", product.image); // file input
  formData.append("Brand", product.brand);
  formData.append("Quantity", product.quantity);
  formData.append("StoreName", product.storeName);
  formData.append("CategoryName", product.categoryName);

  // Optional arrays
  if (product.colors && product.colors.length) {
    product.colors.forEach(color => formData.append("Colors", color));
  }
  if (product.sizes && product.sizes.length) {
    product.sizes.forEach(size => formData.append("Sizes", size));
  }

  return apiRequest("/api/Product/products", {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type, browser will set it with boundary
    credentials: "include"
  });
}

export async function getAllProducts() {
  try {
    const { data } = await apiRequest("/api/Product/products", {
      method: "GET",
      credentials: "include"
    });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch products.");
  }
}

export async function getAllProductsByCategory(categoryName) {
  try {
    const { data } = await apiRequest(`/api/Product/products/by-category/${encodeURIComponent(categoryName)}`, {
      method: "GET",
      credentials: "include"
    });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch products by category.");
  }
}

export async function getProductById(productId) {
  try {
    const { data } = await apiRequest(`/api/Product/products/${encodeURIComponent(productId)}`, {
      method: "GET",
      credentials: "include"
    });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch product details.");
  }
}

export async function getMyProducts() {
  try {
    const { data } = await apiRequest("/api/Product/my-products", {
      method: "GET",
      credentials: "include"
    });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch your products.");
  }
}
