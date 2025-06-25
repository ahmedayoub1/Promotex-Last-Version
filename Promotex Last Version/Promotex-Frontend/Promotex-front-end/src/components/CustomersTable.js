export default function renderCustomersTable(users) {
  return `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>User ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Roles</th>
        </tr>
      </thead>
      <tbody>
        ${users.map((user, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${user.id}</td>
            <td>${user.fullName || user.userName || ""}</td>
            <td>${user.email}</td>
            <td>${Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}