import { apiRequest } from './api.js';

export async function login(email, password) {
  try {
    const { data } = await apiRequest("/api/Account/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong during login.");
  }
}

export function logout() {
  localStorage.removeItem('user');
}

export function isLoggedIn() {
  return !!localStorage.getItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export async function register({ email, fullName, phoneNumber, password, confirmPassword, fullAddress }) {
  try {
    const response = await apiRequest('/api/Account/Register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fullName,
        phoneNumber,
        password,
        confirmPassword,
        fullAddress
      })
    });
    return response;
  } catch (error) {
    if (error.message.includes('400')) {
      throw new Error('Registration failed. Please check your input and try again.');
    }
    throw error;
  }
}

export async function createSellerStore({ Name, Description, PhoneNumber, Address, LogoUrl }) {
  try {
    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("PhoneNumber", PhoneNumber);
    formData.append("Address", Address);
    if (LogoUrl) formData.append("LogoUrl", LogoUrl);

    const { data } = await apiRequest("/api/Store", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to create store.");
  }
}

export async function getPendingRoleRequests() {
  try {
    const { data } = await apiRequest("/api/User/pending-role-requests", {
      method: "GET",
      credentials: "include"
    });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch pending requests.");
  }
}

// ✅ UPDATED handleRoleRequest function
export async function handleRoleRequest(requestId, approve) {
  try {
    const url = `/api/User/handle-role-request?requestId=${requestId}&approve=${approve}`;

    const { data } = await apiRequest(url, {
      method: "POST",
      credentials: "include",
    });

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to handle role request.");
  }
}

export async function getAllUsersWithRoles() {
  try {
    const { data } = await apiRequest("/api/User/all-users-with-roles", {
      method: "GET",
      credentials: "include"
    });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch users.");
  }
}