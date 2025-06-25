export default function renderProductViewMore(product) {
  if (!product) {
    return `<p>Product not found.</p>`;
  }
  const imageSrc = product.imageUrl
    ? `http://localhost:5015/${product.imageUrl.replace(/^\/+/, '')}`
    : '/src/Assets/placeholder.jpg';

  return `<div class="container">
    <main class="product-page">
      <div class="image-section">
        <img src="${imageSrc}" alt="${product.name}">
      </div>
      <div class="info-section">
        <h2>${product.name} <span class="price">${product.price} EGP</span></h2>
        <div class="details">
          <h3>Product Details:</h3>
          <p><strong>ID:</strong> ${product.id}</p>
          <p><strong>Description:</strong> ${product.description || ''}</p>
          <p><strong>Brand:</strong> ${product.brand || ''}</p>
          <p><strong>Colors:</strong> ${product.colors && product.colors.length ? product.colors.join(', ') : 'N/A'}</p>
          <p><strong>Sizes:</strong> ${product.sizes && product.sizes.length ? product.sizes.join(', ') : 'N/A'}</p>
          <p><strong>Quantity:</strong> ${product.quantity}</p>
          <p><strong>Available:</strong> ${product.isAvailable ? 'Yes' : 'No'}</p>
          <p><strong>Category ID:</strong> ${product.categoryId}</p>
          <p><strong>Category Name:</strong> ${product.categoryName || ''}</p>
          <p><strong>Store ID:</strong> ${product.storeId}</p>
          <p><strong>Seller Store:</strong> ${product.storeName || ''}</p>
          <div class="actions">
            <button class="buy" data-nav="paymentgetway">Buy Now</button>
            <button class="cart">Add to cart <i class="fas fa-cart-shopping"></i></button>
          </div>
        </div>
      </div>
    </main>
    <button class="back"><i class="fas fa-arrow-left"></i></button>
  </div>`;
}