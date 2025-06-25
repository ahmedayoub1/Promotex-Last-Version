import { getMyOrders } from "../services/orderService.js";

export default function renderProfilePage(user) {
  if (!user) {
    return `<p>User not found or not logged in.</p>`;
  }

  return `
  <div class="container">
    <aside class="sidebar">
      <div class="profile">
        <div class="avatar">
          <img src="mariam.jpg" alt="Profile Picture" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="fallback-avatar">${user.fullName?.charAt(0) || "U"}</div>
        </div>
        <div class="username">${user.fullName}</div>
      </div>
    </aside>

    <div class="main-content">
      <section class="personal-info">
        <div class="info-header">
          <h3>Personal Info</h3>
          <div class="buttons">
            <button class="save-btn">Save</button>
            <button class="edit-btn">Edit</button>
          </div>
        </div>

        <form>
          <div class="row">
            <div style="flex: 1;">
              <label for="first-name">Full Name</label>
              <input type="text" id="first-name" value="${user.fullName}" disabled>
            </div>
          </div>

          <label for="email">Email</label>
          <input type="email" id="email" value="${user.email}" disabled>

          <label for="address">Address</label>
          <input type="text" id="address" value="${user.fullAddress}" disabled>

          <label for="phone">Phone number</label>
          <input type="text" id="phone" value="${user.phoneNumber || ''}" disabled>
        </form>
      </section>

      <section class="order-history">
        <h3>Order History</h3>
        <div id="profile-orders-list">Loading...</div>
      </section>
    </div>
  </div>
  `;
}

export async function setupProfileOrderHistory() {
  console.log("setupProfileOrderHistory called");
  const ordersList = document.getElementById("profile-orders-list");
  if (!ordersList) return;
  try {
    const orders = await getMyOrders(); // This will always be an array
    console.log("Orders from getMyOrders:", orders);
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
            <strong>Status:</strong> ${order.Status ?? "N/A"}<br>
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
