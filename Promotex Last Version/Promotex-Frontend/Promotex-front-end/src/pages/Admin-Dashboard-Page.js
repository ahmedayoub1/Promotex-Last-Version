import { getPendingRoleRequests, handleRoleRequest, getAllUsersWithRoles } from "../services/userService.js";
import { getAllProducts } from "../services/productService.js";
import renderNewsellerHeader from "../components/New-Seller-Header.js";
import renderCustomersTable from "../components/CustomersTable.js";
import renderProductsTable from "../components/ProductsTable.js";

export default function renderAdminDashboardPage(user = {}) {
  return `<div class="dashboard">
    <aside class="sidebar">
      <div class="logo">
        <img src="secondPromotex.png" alt="Promotex Logo" />
      </div>
      
      <ul id="sidebar-menu">
        <li class="active"><a href="#">New Sellers</a></li>
        <li><a href="#">Customers</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Orders</a></li>
      </ul>
    </aside>

    <div class="main-content">
      <div class="header">
        <div class="user">
          <div class="avatar">
            <img src="${user.avatarUrl || 'default-avatar.jpg'}" alt="Profile Picture"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="fallback-avatar" style="display:none;">
              ${user.fullName?.charAt(0) || user.userName?.charAt(0) || "A"}
            </div>
          </div>
          <span>${user.fullName || user.userName || "Admin"}</span>
        </div>
      </div>

      <div id="status-message"></div>

      <div class="table-container">
        <table>
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>`;
}

export function setupAdminDashboardPage() {
  const thead = document.querySelector(".table-container thead");
  const tbody = document.querySelector(".table-container tbody");
  if (!thead || !tbody) return;

  thead.innerHTML = renderNewsellerHeader();

  const showStatusMessage = (message, isSuccess = true) => {
    const msgContainer = document.getElementById("status-message");
    msgContainer.textContent = message;
    msgContainer.style.color = isSuccess ? "green" : "red";
    msgContainer.style.fontWeight = "bold";
    msgContainer.style.padding = "10px 0";
    setTimeout(() => (msgContainer.textContent = ""), 3000);
  };

  function loadRequests() {
    getPendingRoleRequests()
      .then(requests => {
        tbody.innerHTML = requests.map((req, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${req.id}</td>
            <td>${req.userName || req.name || req.email}</td>
            <td>
              <button data-approve="${req.id}">Approve</button>
              <button data-reject="${req.id}">Reject</button>
            </td>
          </tr>
        `).join("");
      })
      .catch(err => {
        tbody.innerHTML = `<tr><td colspan="4">Error: ${err.message}</td></tr>`;
      });
  }

  loadRequests();

  tbody.addEventListener("click", async (e) => {
    const approveBtn = e.target.closest("[data-approve]");
    const rejectBtn = e.target.closest("[data-reject]");
    if (approveBtn || rejectBtn) {
      const requestId = parseInt(
        approveBtn ? approveBtn.dataset.approve : rejectBtn.dataset.reject,
        10
      );
      const approve = !!approveBtn;
      try {
        await handleRoleRequest(requestId, approve);
        showStatusMessage(`Request ${approve ? "approved" : "rejected"} successfully.`, true);
        loadRequests();
      } catch (err) {
        showStatusMessage("Error: " + err.message, false);
      }
    }
  });

  document.querySelector("#sidebar-menu").addEventListener("click", async (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    // Remove active from all, add to clicked
    document.querySelectorAll("#sidebar-menu li").forEach(item => item.classList.remove("active"));
    li.classList.add("active");

    const text = li.textContent.trim();

    if (text === "Customers") {
      const tableContainer = document.querySelector(".table-container");
      tableContainer.innerHTML = "<div>Loading...</div>";
      try {
        const users = await getAllUsersWithRoles();
        tableContainer.innerHTML = renderCustomersTable(users);
      } catch (err) {
        tableContainer.innerHTML = `<div style="color:red;">${err.message}</div>`;
      }
    } else if (text === "New Sellers") {
      // Restore the original table structure and header before loading requests
      const tableContainer = document.querySelector(".table-container");
      tableContainer.innerHTML = `
        <table>
          <thead></thead>
          <tbody></tbody>
        </table>
      `;
      const thead = tableContainer.querySelector("thead");
      const tbody = tableContainer.querySelector("tbody");
      thead.innerHTML = renderNewsellerHeader();

      // Define and call loadRequests with the new tbody
      function loadRequestsDynamic() {
        getPendingRoleRequests()
          .then(requests => {
            tbody.innerHTML = requests.map((req, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${req.id}</td>
                <td>${req.userName || req.name || req.email}</td>
                <td>
                  <button class="approve" data-approve="${req.id}">Approve</button>
                  <button class="reject" data-reject="${req.id}">Reject</button>
                </td>
              </tr>
            `).join("");
          })
          .catch(err => {
            tbody.innerHTML = `<tr><td colspan="4">Error: ${err.message}</td></tr>`;
          });
      }
      loadRequestsDynamic();

      // Re-attach event listener for approve/reject buttons on the new tbody
      tbody.addEventListener("click", async (e) => {
        const approveBtn = e.target.closest("[data-approve]");
        const rejectBtn = e.target.closest("[data-reject]");
        if (approveBtn || rejectBtn) {
          const requestId = parseInt(
            approveBtn ? approveBtn.dataset.approve : rejectBtn.dataset.reject,
            10
          );
          const approve = !!approveBtn;
          try {
            await handleRoleRequest(requestId, approve);
            showStatusMessage(`Request ${approve ? "approved" : "rejected"} successfully.`, true);
            loadRequestsDynamic();
          } catch (err) {
            showStatusMessage("Error: " + err.message, false);
          }
        }
      });
    } else if (text === "Products") {
      const tableContainer = document.querySelector(".table-container");
      tableContainer.innerHTML = "<div>Loading...</div>";
      try {
        const products = await getAllProducts();
        tableContainer.innerHTML = renderProductsTable(products);
      } catch (err) {
        tableContainer.innerHTML = `<div style="color:red;">${err.message}</div>`;
      }
    }
  });
}
