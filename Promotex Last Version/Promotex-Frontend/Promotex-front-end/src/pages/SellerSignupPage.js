import { createSellerStore, getCurrentUser } from "../services/userService.js";
import { apiRequest } from "../services/api.js"; // <-- Add this import

export default function renderSellerSignupPage() {
  return `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

    <div class="signup-container">
      <div class="steps">
        <div class="step active">
          <span class="circle">1</span>
          <span class="step-text">Commercial Info</span>
        </div>
      </div>

      <form id="seller-signup-form">
        <div class="form-group">
          <label for="store">Store Name</label>
          <div class="input-box">
            <i class="fas fa-store icon"></i>
            <input type="text" id="store" placeholder="Enter store name" required />
          </div>
        </div>

        <div class="form-group">
          <label for="logoStore">Logo Store</label>
          <input type="file" id="logoStore"  />
        </div>

       

        <div class="form-group">
          <label for="shippingAddress">Shipping Address</label>
          <div class="input-box">
            <i class="fas fa-location-dot icon"></i>
            <input type="text" id="shippingAddress" placeholder="Shipping address" required />
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <div class="input-box">
            <i class="fas fa-info-circle icon"></i>
            <input type="text" id="description" placeholder="Description"  />
          </div>
        </div>

        <div class="form-group">
          <label for="alternateNumber">Alternate Number</label>
          <div class="input-box">
            <i class="fas fa-phone icon"></i>
            <input type="text" id="alternateNumber" placeholder="Alternate contact" />
          </div>
        </div>

        <div class="form-group">
          <label>Social Media</label>
          <div class="input-box">
            <i class="fab fa-facebook icon"></i>
            <input type="url" id="Facebook" placeholder="Facebook" />
          </div>
          <div class="input-box">
            <i class="fab fa-instagram icon"></i>
            <input type="url" id="Instagram" placeholder="Instagram" />
          </div>
          <div class="input-box">
            <i class="fab fa-twitter icon"></i>
            <input type="url" id="Twitter" placeholder="Twitter" />
          </div>
          <div class="input-box">
            <i class="fas fa-globe icon"></i>
            <input type="url" id="Website" placeholder="Website" />
          </div>
        </div>

        <button id="requestSellerRoleBtn">Request to Become a Seller</button>
        <p id="requestStatusMessage"></p>


        <div class="buttons">
          <button type="submit" class="btn">Become a Seller</button>

        </div>

        <div id="successMessage" class="success-message">
          ✅ We received your request and will contact you soon.
        </div>
      </form>
    </div>
  `;
}

export function setupSellerSignupForm() {
  const form = document.getElementById("seller-signup-form");
  const successMsg = document.getElementById("successMessage");
  const requestBtn = document.getElementById("requestSellerRoleBtn"); // <-- Get the button
  if (!form) return;

  successMsg.style.display = "none";

  // Handle "Request to Become a Seller" button click
  if (requestBtn) {
    requestBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      // Check if user is logged in
      const user = getCurrentUser();
      if (!user) {
        successMsg.style.display = "block";
        successMsg.textContent = "❌ You must be logged in to request seller role.";
        successMsg.style.color = "red";
        return;
      }

      try {
        await apiRequest("/api/User/request-role-change", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify("Seller"),
        });
        successMsg.style.display = "block";
        successMsg.textContent = "✅ Request submitted. We will contact you soon.";
        successMsg.style.color = "green";
      } catch (err) {
        successMsg.style.display = "block";
        if (err.message.includes("400")) {
          successMsg.textContent = "❌ Duplicate request or error. Please wait for approval.";
        } else {
          successMsg.textContent = "❌ " + (err.message || "Failed to submit request.");
        }
        successMsg.style.color = "red";
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
      successMsg.style.display = "block";
      successMsg.textContent = "❌ You must be logged in to become a seller.";
      successMsg.style.color = "red";
      return;
    }

    // Collect form data
    const Name = document.getElementById("store").value;
    const Description = document.getElementById("description").value;
    const Address = document.getElementById("shippingAddress").value;
    const PhoneNumber = document.getElementById("alternateNumber").value;
    const LogoUrl = document.getElementById("logoStore").files[0];

    try {
      await createSellerStore({ Name, Description, Address, PhoneNumber, LogoUrl });
      successMsg.style.display = "block";
      successMsg.textContent = "✅ We received your request and will contact you soon.";
      form.reset();
    } catch (err) {
      successMsg.style.display = "block";
      if (err.message.includes("AccessDenied")) {
        successMsg.textContent = "❌ Access denied. You do not have permission to become a seller. Please contact support.";
      } else {
        successMsg.textContent = "❌ " + (err.message || "Failed to submit. Please try again.");
      }
      successMsg.style.color = "red";
    }
  });
}
