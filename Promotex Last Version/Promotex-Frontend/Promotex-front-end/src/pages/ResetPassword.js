export default function renderRestPassword() {
  return `<div class="reset-container">
    <div class="reset-box">
      <h2>Reset Your Password</h2>
      <p>Please enter your new password below.</p>

      <form onsubmit="">
        <div class="input-group">
          <label for="newPassword">New Password</label>
          <div class="password-wrapper">
            <input type="password" id="newPassword" required />
            <i class="fa-solid fa-eye toggle-password" onclick=""></i>
          </div>
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirm New Password</label>
          <div class="password-wrapper">
            <input type="password" id="confirmPassword" required />
            <i class="fa-solid fa-eye toggle-password" onclick=""></i>
          </div>
        </div>

        <div id="password-error" class="error-message" style="display: none;">
          <i class="fas fa-exclamation-circle"></i> Passwords do not match.
        </div>

        <div id="reset-success" class="success-message" style="display: none;">
          <i class="fas fa-check-circle"></i> Password has been reset successfully.
        </div>

        <div id="reset-fail" class="error-message" style="display: none;">
          <i class="fas fa-exclamation-circle"></i> Failed to reset password.
        </div>

        <button type="submit" class="reset-btn">
           <a href="#" data-nav="login">Reset Password</a>
          <span class="btn-text"></span>
          <span class="btn-loader"></span>
        </button>
      </form>
    </div>
  </div>
  `;
}

 