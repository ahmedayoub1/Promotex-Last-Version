export default function renderProductsTable(products) {
  if (!products || !products.length) {
    return `<div>No products found.</div>`;
  }
  return `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Store</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${products.map((p, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${p.name}</td>
            <td>${p.brand}</td>
            <td>${p.categoryName}</td>
            <td>${p.storeName}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}