export default function renderLoginPage() {
  return `
    <div class="login-wrapper" id="login-page">
      <div class="login-left">
        <h1>login to Promotex</h1>
        <form id="login-form" class="login-form">
          <div class="form-group">
            <label for="email">E-mail</label>
            <div class="input-icon">
              <input type="email" id="email" required placeholder="Enter your e-mail">
            </div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-icon">
              <input type="password" id="password" required placeholder="Enter your password">
              <span class="icon-eye"></span>
            </div>
          </div>
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" id="remember-me"> Remember me
            </label>
            <a href="#" class="forgot-password" data-nav="forgetpasssword">Forget password?</a>
          </div>
          <button type="submit" class="login-btn">Login</button>
        </form>
        <p id="login-error" class="error-message"></p>
        <div class="signup-link">
          Don't have an account ? <a href="#" data-nav="register"><b>Sign Up</b></a>
        </div>
      </div>
      <div class="login-right">
        <img src="/src/Assets/Choosing clothes-cuate.svg" alt="Fashion Model" />
      </div>
    </div>
  `;
}
