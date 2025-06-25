export default function renderRegisterPage() {
  return `
    <div class="register-container">
      <h2>Register</h2>
      <form id="register-form" class="register-form">
        <div class="form-group">
          <label for="reg-email">Email</label>
          <input type="email" id="reg-email" required placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label for="reg-name">Full Name</label>
          <input type="text" id="reg-name" required placeholder="Enter your full name">
        </div>
        <div class="form-group">
          <label for="reg-phone">Phone Number</label>
          <input type="tel" id="reg-phone" required placeholder="Enter your phone number">
        </div>
        <div class="form-group">
          <label for="reg-address">Address</label>
          <input type="text" id="reg-address" required placeholder="Enter your address">
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input type="password" id="reg-password" required placeholder="Enter your password">
        </div>
        <div class="form-group">
          <label for="reg-confirm-password">Confirm Password</label>
          <input type="password" id="reg-confirm-password" required placeholder="Confirm your password">
        </div>
        <button type="submit" class="register-btn">Register</button>
      </form>
      <p id="register-error" class="error-message"></p>
      <p class="signup-link">Already have an account? <a href="#" data-nav="login">Login</a></p>
    </div>
  `;
}
