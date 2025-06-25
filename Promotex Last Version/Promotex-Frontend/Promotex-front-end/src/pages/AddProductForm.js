import { addProduct } from "../services/productService.js";

export default function renderAddProductFormPage() {
  return `<div class="add-product-container">
    <h1>Promotex</h1>
    <h2>Add Product</h2>

    <div class="add-product-section">
      <div class="add-product-upload">
        <label for="product-image">Choose File</label>
        <input type="file" id="product-image" style="display: none;" required />
        <div class="add-product-upload-btn" id="file-upload-btn">Select File</div>
        <div id="file-name" class="add-product-file-name">No file selected</div>
        <div class="upload-rules">
          <strong>Follow these instructions or your upload will fail:</strong>
          <ul>
            <li>White background (primary image)</li>
            <li>1200×1200px minimum</li>
            <li>No watermarks/text</li>
          </ul>
        </div>
      </div>
    </div>

    <form id="product-form">
      <div class="add-product-section">
        <div class="add-product-input-group">
          <label for="product-name">Product Name</label>
          <input type="text" id="product-name" placeholder="Enter product name" required />
        </div>

        <div class="add-product-input-group">
          <label for="ProductDescription">Product Description</label>
          <textarea id="ProductDescription" placeholder="Enter description" required></textarea>
        </div>

        <div class="add-product-input-group">
          <label for="brand">Brand</label>
          <input type="text" id="brand" placeholder="Enter your brand name" required />
        </div>

        <div class="add-product-input-group">
          <label for="price">Price</label>
          <input type="number" id="price" placeholder="Enter the item price" required min="0"/>
        </div>

        <div class="add-product-input-group">
          <label for="seller-store">Store Name</label>
          <input type="text" id="seller-store" placeholder="Enter your store name" required />
        </div>

        <div class="add-product-input-group">
          <label for="category-name">Category Name</label>
          <input type="text" id="category-name" placeholder="Enter category name" required />
        </div>

        <div class="add-product-input-group">
          <label for="Quantity">Quantity</label>
          <input type="number" id="Quantity" placeholder="Enter your Quantity" required />
        </div>

        <div class="add-product-input-group">
          <label>Colors</label>
          <input type="text" id="colors" placeholder="Enter colors separated by comma (e.g. red,blue,green)" />
        </div>

        <div class="add-product-input-group">
          <label>Sizes</label>
          <div class="add-product-checkbox-group">
            <label><input type="checkbox" name="product-size" value="small" /> Small</label>
            <label><input type="checkbox" name="product-size" value="medium" /> Medium</label>
            <label><input type="checkbox" name="product-size" value="large" /> Large</label>
            <label><input type="checkbox" name="product-size" value="extra-large" /> Extra Large</label>
          </div>
        </div>
      </div>

      <button type="submit" class="add-product-submit-btn">Add Product</button>
    </form>
  </div>`;
}

export function setupAddProductForm() {
  const form = document.getElementById("product-form");
  const fileInput = document.getElementById("product-image");
  const fileBtn = document.getElementById("file-upload-btn");
  const fileName = document.getElementById("file-name");

  // File upload button logic
  if (fileBtn && fileInput) {
    fileBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      fileName.textContent = fileInput.files[0]?.name || "No file selected";
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Gather form data
      const name = document.getElementById("product-name").value;
      const description = document.getElementById("ProductDescription").value;
      const price = document.getElementById("price").value;
      const image = fileInput.files[0];
      const brand = document.getElementById("brand").value;
      const quantity = document.getElementById("Quantity").value;
      const storeName = document.getElementById("seller-store").value;
      const categoryName = document.getElementById("category-name").value;

      // Optional fields
      const colorsRaw = document.getElementById("colors").value;
      const colors = colorsRaw
        ? colorsRaw.split(",").map(c => c.trim()).filter(Boolean)
        : [];
      const sizes = Array.from(document.querySelectorAll('input[name="product-size"]:checked')).map(cb => cb.value);

      try {
        await addProduct({
          name,
          description,
          price,
          image,
          brand,
          quantity,
          storeName,
          categoryName,
          colors,
          sizes
        });
        showPopup("Product added successfully!", true);
        form.reset();
        fileName.textContent = "No file selected";
      } catch (err) {
        showPopup("Failed to add product: " + err.message, false);
      }
    });
  }
}

function showPopup(message, isSuccess = true) {
  let popup = document.createElement("div");
  popup.className = "custom-popup " + (isSuccess ? "success" : "error");
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 2500);
}
