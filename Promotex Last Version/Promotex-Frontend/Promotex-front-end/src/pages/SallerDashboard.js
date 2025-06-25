import { getMyProducts } from "../services/productService.js";

export default function renderSellerDashboardPage(user = {}) {
  return `  
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <img src="secondPromotex.png" alt="Promotex Logo" />
      </div>

      <ul id="sidebar-menu">
        <li class="active"><a href="#">Products</a></li>
        
        <li><a href="#">Orders</a></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <div class="header">
        <button class="addproduct">
          <i class="fa-solid fa-plus"></i>
          <a href="#" data-nav="addproduct">Add Product</a>
        </button>
        <div class="user">
          <div class="avatar">
            <img src="${user.avatarUrl || 'default-avatar.jpg'}" alt="Profile Picture"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="fallback-avatar" style="display:none;">
              ${user.fullName?.charAt(0) || user.userName?.charAt(0) || "U"}
            </div>
          </div>
          <span class="username">${user.fullName || user.userName || "User"}</span>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Product Name</th>
              <th>Store</th>
              <th>Brand</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <!-- rows here -->
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

// Fetch and render seller products in the table
async function renderSellerProductsTable() {
  const tableBody = document.querySelector(".table-container tbody");
  if (!tableBody) return;
  tableBody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;
  try {
    const products = await getMyProducts();
    if (!products || products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No products found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = products.map((p, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.storeName || ""}</td>
        <td>${p.brand || ""}</td>
        <td>${p.price}</td>
      </tr>
    `).join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="6">${err.message}</td></tr>`;
  }
}

export function setupSellerDashboardSidebar() {
  // Render products table on initial load
  renderSellerProductsTable();

  const menuItems = document.querySelectorAll('#sidebar-menu li');
  menuItems.forEach(item => {
    item.addEventListener('click', async () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // If "Products" is clicked
      if (item.textContent.trim() === "Products") {
        renderSellerProductsTable();
      }
      // You can add logic for "Orders" here if needed
    });
  });
}