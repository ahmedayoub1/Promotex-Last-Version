import { addProductToCart } from "../services/cartService.js";

export default function renderWomanCategoriePage(products = []) {
  setTimeout(() => {
    document.querySelectorAll(".item button").forEach((btn, idx) => {
      btn.onclick = async () => {
        const product = products[idx];
        try {
          await addProductToCart(product.id, 1);
          showPop("Product added to cart!", "success");
        } catch (err) {
          showPop("Failed to add to cart: " + err.message, "error");
        }
      };
    });
  }, 0);

  return `<header>
        <div class="logo">
            <img src="/src/Assets/secondPromotex.png" alt="logo"width="100px" height="100px" />
        </div>
        <input type="text" placeholder="search" >
        <ul>
            <li><a href="#" data-nav="home">Home </a></li>
            <li><a href="#">Woman   /type of categorie/ All</a></li>
        </ul>
    </header>
    <nav>
        <ul>
            <li><a href="#" data-nav="home">Home</a></li>
            <li><a href="#">Jeans</a></li>
            <li><a href="#">Hoodie</a></li>
            <li><a href="#">Coat</a></li>
            <li><a href="#">Pullover</a></li>
            <li><a href="#">Jacket</a></li>
            <li><a href="#">Dress</a></li>
            <li><a href="#">Cardigan</a></li>
            <li><a href="#">Sweatshirt</a></li>
            <li><a href="#">Sweetpants</a></li>
            <li><a href="#">Accessories</a></li>
        </ul>
    </nav>
    <div class="container-categorie">
      ${
        products.length
          ? products.map(product => {
              const imageSrc = product.imageUrl
                ? `http://localhost:5015/${product.imageUrl.replace(/^\/+/, '')}`
                : '/src/Assets/placeholder.jpg';
              return `
                <div class="item" data-product-id="${product.id}">
                  <div class="image-container">
                    <img src="${imageSrc}" alt="product">
                  </div>
                  <h3>${product.name}</h3>
                  <p class="price">${product.price} EGP</p>
                  <button>Add To cart <i class="fa-solid fa-cart-shopping"></i></button>
                  <a href="#" data-nav="productviewmore">View More</a>
                </div>
              `;
            }).join('')
          : '<p>No products found in this category.</p>'
      }
    </div>
  `;
}

// Helper function for pop notification
function showPop(message, type = "info") {
  let pop = document.createElement("div");
  pop.className = `pop-message ${type}`;
  pop.textContent = message;
  Object.assign(pop.style, {
    position: "fixed",
    top: "30px",
    right: "30px",
    zIndex: 9999,
    background: type === "success" ? "#4caf50" : type === "error" ? "#f44336" : "#333",
    color: "#fff",
    padding: "16px 24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    fontSize: "16px",
    transition: "opacity 0.3s"
  });
  document.body.appendChild(pop);
  setTimeout(() => {
    pop.style.opacity = "0";
    setTimeout(() => pop.remove(), 300);
  }, 2000);
}

