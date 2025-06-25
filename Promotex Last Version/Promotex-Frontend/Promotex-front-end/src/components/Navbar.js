import { animateCSS } from './Animation.js'; // Add this import

export default function renderNavbar(user) {
  return `
    <div class="logo">
      <img src="/src/Assets/secondPromotex.png" alt="logo" width="100px" height="100px" />
    </div>
    
    <ul>
      <li><a href="#hero" data-nav="home">Home</a></li>
      <li><a href="#categories">Categories</a></li>
      <li><a href="#about">About Us</a></li>
      <li><a href="#contact">Contact Us</a></li>
      
      <li id="auth-links">
        ${
          user
            ? `<a href="#" data-nav="logout">Logout</a><span class="wlcomeUser">Welcome, ${user.userName}</span> `
            : `<a href="#" data-nav="login">Login</a>`
        }
      </li>
    </ul>

    <div class="header-right">
      <a href="#" class="cart-icon" data-nav="cart"><i class="fas fa-shopping-cart"></i></a>

          <div class="user-dropdown">
            <i id="profile-icon" class="fa-solid fa-circle-user profile-icon"></i>
     <ul id="dropdown-menu" class="dropdown-menu">
  ${
    user
      ? `
      <li><a href="#" data-nav="profile">Profile</a></li>
      <li>
  <a href="#" 
     data-nav="${user && user.role == 'Admin' 
                ? 'admindashboard' 
                : user && user.role == 'Seller' 
                  ? 'sellerdashboard' 
                  : 'sellersignup'}">
    ${user && user.role == 'Admin' 
      ? 'Admin Dashboard' 
      : user && user.role == 'Seller' 
        ? 'Seller Dashboard' 
        : 'Become a Seller'}
  </a>
</li>

      <li><a href="#" data-nav="logout">Logout</a></li>
    `
      : `
      <li><a href="#" data-nav="login">Login</a></li>
    `
  }
</ul>


          </div>
    </div>

  `;
}


export function setupDropdownMenu() {
  const profileIcon = document.getElementById("profile-icon");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (profileIcon && dropdownMenu) {
    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.add("show");
        animateCSS(dropdownMenu, "fadeInDown");
      } else {
        animateCSS(dropdownMenu, "fadeOutUp", () => {
          dropdownMenu.classList.remove("show");
        });
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-dropdown") && dropdownMenu.classList.contains("show")) {
        animateCSS(dropdownMenu, "fadeOutUp", () => {
          dropdownMenu.classList.remove("show");
        });
      }
    });

    dropdownMenu.querySelectorAll("a[data-nav]").forEach(link => {
      link.addEventListener("click", () => {
        animateCSS(dropdownMenu, "fadeOutUp", () => {
          dropdownMenu.classList.remove("show");
        });
      });
    });
  } else {
    console.error("Dropdown menu or profile icon not found!");
  }
}

export function setActiveNav(targetNav) {
  const navLinks = document.querySelectorAll('ul li a[data-nav]');

  navLinks.forEach(link => {
    const navValue = link.getAttribute('data-nav');
    if (navValue === targetNav) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}



