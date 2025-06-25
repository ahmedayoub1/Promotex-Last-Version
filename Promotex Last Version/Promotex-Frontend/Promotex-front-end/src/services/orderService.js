import { apiRequest } from "./api.js";

export async function getMyOrders() {
  const response = await apiRequest("/api/Order/my-orders", {
    method: "GET",
    credentials: "include"
  });
  console.log("getMyOrders API raw response:", response);
  
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.orders)) return response.orders; // ✅ إضافة هذا السطر
  return [];
}
