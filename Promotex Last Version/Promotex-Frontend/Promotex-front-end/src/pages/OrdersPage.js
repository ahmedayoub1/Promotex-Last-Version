import { getMyOrders } from "../services/orderService.js";

export default function renderOrdersPage() {
  return `<div class="orders-container"><h2>My Orders</h2><div id="orders-list">Loading...</div></div>`;
}

export async function setupOrdersPage() {
  const ordersList = document.getElementById("orders-list");
  try {
    const response = await getMyOrders();
    const orders = Array.isArray(response) ? response : response?.data || response?.orders || [];
    console.log("Orders API result:", orders);
    if (!orders.length) {
      ordersList.innerHTML = "<p>No orders found.</p>";
      return;
    }
    ordersList.innerHTML = orders.map(order => `
      <div class="order-block">
        <div class="order-header">
          <img src="${order.Store?.LogoUrl || 'default-store.png'}" alt="Store Logo" class="store-logo"/>
          <div>
            <strong>Store:</strong> ${order.Store?.Name || "N/A"}<br>
            <strong>Order Date:</strong> ${order.OrderDate ? new Date(order.OrderDate).toLocaleString() : "N/A"}<br>
            <strong>Status:</strong> ${order.Status || "N/A"}<br>
            <strong>Total:</strong> $${order.TotalPrice ?? "N/A"}
          </div>
        </div>
        <table class="order-items">
          <thead>
            <tr>
              <th>Product</th>
              <th>Image</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.Items || []).map(item => `
              <tr>
                <td>${item.Name}</td>
                <td><img src="${item.ImageUrl || 'default-product.png'}" alt="${item.Name}" style="width:40px;height:40px;object-fit:cover;"></td>
                <td>${item.Quantity}</td>
                <td>$${item.UnitPrice}</td>
                <td>$${item.Total}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `).join("");
  } catch (err) {
    ordersList.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

