import {
  login,
  logout,
  isLoggedIn,
  getCurrentUser,
  register,
} from "./services/userService.js";
import renderHomePage from "./pages/HomePage.js";
import renderProductsPage from "./pages/ProductsPage.js";
import renderCartPage, { setupCartPage } from "./pages/CartPage.js";
import renderLoginPage from "./pages/LoginPage.js";
import renderNotFoundPage from "./pages/NotFoundPage.js";
import { getState, setState, subscribe } from "./state/store.js";
import renderRegisterPage from "./pages/RegisterPage.js";
import renderNavbar from "./components/Navbar.js";
import renderWomanCategoriePage from "./pages/WomanCategoriePage.js";
import renderManCategoriePage from "./pages/ManCategoriePage.js";
import renderSellerSignupPage from "./pages/SellerSignupPage.js";
import renderForgetPaasword from "./pages/ForgetPassword.js";
import renderOTPPage from "./pages/OTPPage.js";
import renderRestPassword from "./pages/ResetPassword.js";
import renderPaymentgetwaypage from "./pages/pymentgetway.js";
import renderProductViewMore from "./pages/ProductViewMore.js";
import renderSellerDashboardPage, { setupSellerDashboardSidebar } from "./pages/SallerDashboard.js";
import renderAddProductFormPage, { setupAddProductForm } from "./pages/AddProductForm.js";
import renderAdminDashboardPage, { setupAdminDashboardPage } from "./pages/Admin-Dashboard-Page.js";

import { setupDropdownMenu, setActiveNav } from './components/Navbar.js';
import { apiRequest } from './services/api.js';
import renderProfilePage from "./pages/ProfilePage.js";
import { setupSellerSignupForm } from "./pages/SellerSignupPage.js";
import { getAllProductsByCategory, getProductById } from "./services/productService.js";
import { addProductToCart } from "./services/cartService.js";

// Page renderers
const pages = {
  home: renderHomePage,
  products: renderProductsPage,
  cart: renderCartPage,
  login: renderLoginPage,
  register: renderRegisterPage,
  man: renderManCategoriePage,
  woman: renderWomanCategoriePage,
  profile: renderProfilePage,
  sellersignup: renderSellerSignupPage,
  forgetpasssword: renderForgetPaasword,
  otp: renderOTPPage,
  resetpassword: renderRestPassword,
  sellerdashboard : renderSellerDashboardPage,
  addproduct : renderAddProductFormPage,
  admindashboard : renderAdminDashboardPage,
  paymentgetway : renderPaymentgetwaypage,
  productviewmore : renderProductViewMore,
  
};

// Initialize the application
export function initializeApp() {
  setupNavigation();
  loadCartFromStorage();
  loadUserFromStorage();
  renderPage(getState().currentPage);
  updateNavigation();
  // setupDropdownMenu();
  // setActiveNav(getState().currentPage);
  // setupSellerSignupForm();


  // Subscribe to state changes if you want to auto-update UI
  subscribe(() => {
    renderPage(getState().currentPage);
    updateNavigation();
  });
}

// Navigation setup
function setupNavigation() {
  document.addEventListener("click", async (e) => {
    const nav = e.target.closest("[data-nav]");
    if (nav) {
      e.preventDefault();
      const page = nav.dataset.nav;
      if (page === "logout") {
        handleLogout();
      } else if (page === "man" || page === "woman") {
        // Fetch products by category and render the category page
        const mainContent = document.getElementById("main-content");
        try {
          const products = await getAllProductsByCategory(page === "man" ? "Man" : "Woman");
          if (page === "man") {
            mainContent.innerHTML = renderManCategoriePage(products);
          } else {
            mainContent.innerHTML = renderWomanCategoriePage(products);
          }
        } catch (err) {
          mainContent.innerHTML = `<p class="error">Failed to load products: ${err.message}</p>`;
        }
      } else if (page === "productviewmore") {
        // Find the product ID from the clicked element or its parent
        const item = e.target.closest(".item");
        const productId = item?.dataset.productId;
        const mainContent = document.getElementById("main-content");
        if (productId) {
          try {
            const product = await getProductById(productId);
            mainContent.innerHTML = renderProductViewMore(product);
            setupProductViewMoreEvents(product); // <-- Add this line
          } catch (err) {
            mainContent.innerHTML = `<p class="error">Failed to load product: ${err.message}</p>`;
          }
        }
        return;
      } else {
        setState({ currentPage: page });
      }
    }
  });
}

// Load cart from localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    setState({ cart: JSON.parse(savedCart) });
  }
}

// Load user from localStorage
function loadUserFromStorage() {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    setState({ user: JSON.parse(savedUser) });
  }
}


// Render layout
function renderLayout() {
  const user = getState().user;
  const currentPage = getState().currentPage;
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const maincontent = document.getElementById("main-content")
  if (currentPage === "login" || currentPage === "register" ||currentPage === "otp" ||currentPage === "forgetpasssword" ||currentPage === "resetpassword") {
    header.innerHTML = "";
    header.style.display = "none";
    maincontent.style.marginTop="0";
    if (footer) footer.style.display = "none";
  } else {
    header.innerHTML = `
    <nav>
      ${renderNavbar(user)}
    </nav>
  `;
    header.style.display = "";
    if (footer) footer.style.display = "";
    // 👇 Add these lines after rendering the navbar
    setupDropdownMenu();
    setActiveNav(currentPage);
  }
}

// Main page rendering dispatcher
function renderPage(page) {
  renderLayout();
  const mainContent = document.getElementById("main-content");
if (page === "profile") {
  const cachedUser = localStorage.getItem("user");

  if (cachedUser) {
    const userData = JSON.parse(cachedUser);
    mainContent.innerHTML = renderProfilePage(userData);
  }

  apiRequest("/api/User/User-Profile", {
    method: "GET",
    credentials: "include",
  })
    .then(({ data }) => {
      localStorage.setItem("user", JSON.stringify(data));
      mainContent.innerHTML = renderProfilePage(data);
      setupProfileOrderHistory(); // <-- This is correct
    })
    .catch((err) => {
      if (!cachedUser) {
        mainContent.innerHTML = `<p class="error">Failed to load profile: ${err.message}</p>`;
      }
    });

    

  return;
}


  const renderFn = pages[page] || renderNotFoundPage;
  mainContent.innerHTML = renderFn();

  if (page === "login") setupLoginForm();
  if (page === "register") setupRegisterForm();
  if (page === "sellersignup") setupSellerSignupForm();
  if (page === "admindashboard") setupAdminDashboardPage(); // <-- Add this line
  if (page === "sellerdashboard") {
    const user = getState().user;
    document.getElementById("main-content").innerHTML = renderSellerDashboardPage(user);
    setupSellerDashboardSidebar(); // <-- Add this line
  }
  if (page === "addproduct") {
    document.getElementById("main-content").innerHTML = renderAddProductFormPage();
    setupAddProductForm(); // <-- Add this line
  }
  if (page === "cart") setupCartPage();
}

// Setup login form
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const user = await login(email, password);

        // تحقق من إذا كان من ضمن الرولز "Admin"
        const isAdmin = Array.isArray(user.role) && user.role.includes("Admin");
       
       
        

        if (isAdmin) {
          setState({ user, currentPage: "admindashboard" }); // أو admindashboard لو موجود
        } else {
          setState({ user, currentPage: "home" });
        }

        const isSeller = Array.isArray(user.role) && user.role.includes("Seller");
       
       
        

        if (isSeller) {
          setState({ user, currentPage: "sellerdashboard" }); 
          setState({ user, currentPage: "home" });
        }
        

      } catch (error) {
        const errorElement = document.getElementById("login-error");
        errorElement.textContent = error.message;
        console.log("Login error:", errorElement.textContent);
      }
    });
  }

  
}



// Setup register form
function setupRegisterForm() {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("reg-email").value;
      const fullName = document.getElementById("reg-name").value;
      const phoneNumber = document.getElementById("reg-phone").value;
      const fullAddress = document.getElementById("reg-address").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById(
        "reg-confirm-password"
      ).value;

      const errorElement = document.getElementById("register-error");
      errorElement.textContent = "";

      if (password !== confirmPassword) {
        errorElement.textContent = "Passwords do not match.";
        return;
      }

      try {
        const registerationData = await register({
          email,
          fullName,
          phoneNumber,
          password,
          confirmPassword,
          fullAddress,
        });
        console.log("Registration successful:", registerationData);
        
        setState({ currentPage: "login" });
      } catch (error) {
        errorElement.textContent = error.message;
      }
    });
  }
}


// ///////////////////////////////////////////////////////////////
// Setup seller sign up steps form

//////////////////////////////////////////

// Handle logout
function handleLogout() {
  logout();
  setState({ user: null, currentPage: "home" });
}

// Update navigation based on auth state
function updateNavigation() {
  renderLayout(); // Re-render Navbar on state change
}

// Smooth page load animation
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');
  revealOnScroll(); // Reveal elements visible on load
});

// Scroll reveal logic
function revealOnScroll() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 60) {
      el.classList.add('revealed');
    }
  });
}

// تشغيل عند التحميل مباشرة (حتى لو مفيش scroll)
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(revealOnScroll);
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('resize', revealOnScroll);


// If you re-render content dynamically, call revealOnScroll() after rendering.

// Attach event listener for Add to Cart in ProductViewMore
function setupProductViewMoreEvents(product) {
  const addToCartBtn = document.querySelector(".cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      try {
        await addProductToCart(product.id, 1);
        addToCartBtn.textContent = "Added!";
        addToCartBtn.disabled = true;
        setTimeout(() => {
          addToCartBtn.textContent = "Add to cart";
          addToCartBtn.disabled = false;
        }, 1500);
      } catch (err) {
        alert("Failed to add to cart: " + err.message);
      }
    });
  }
}


