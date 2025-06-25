export default function renderPaymentgetwaypage() {
  return `<div id="container">
    <!-- Order Summary -->
    <div class="order-summary">
      <h2>Order Summary</h2>

      <div id="item">
        <img src="/src/Assets/IMG-20250210-WA0002.jpg" alt="Winter Haven Coat" />
        <div class="details">
          <h4>Winter Haven</h4>
          <p>Color: Beige</p>
          <p>Items: 2</p>
          <p class="price">1000$</p>
        </div>
      </div>

      <div id="item">
        <img src="/src/Assets/IMG-20250210-WA0001.jpg" alt="Winter Haven Jacket" />
        <div class="details">
          <h4>Winter Haven</h4>
          <p>Color: Beige</p>
          <p>Items: 2</p>
          <p class="price">1000$</p>
        </div>
      </div>

      <div class="summary">
        <p>Balance amount: <span>2000</span></p>
        <p>Vat(14%): <span>280</span></p>
        <hr />
        <p class="total">Total (incl vat): <span>2280$</span></p>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="payment-method">
      <h2>Payment method</h2>
      <div class="logos">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
       
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" />
        

      </div>

      <form>
        <label>Cardholder name</label>
        <input type="text" placeholder="Enter the name" required />

        <label>Card Number</label>
        <input type="password" placeholder="#### #### #### ####" required />

        <div class="row">
          <div>
            <label>Date</label>
            <input type="text" placeholder="MM/YY" />
          </div>
          <div>
            <label>CVV</label>
            <input type="password" placeholder="###" />
          </div>
        </div>

        <label class="save">
          <input type="checkbox" /> Save card information for the future use
        </label>

        <div class="buttons">
          <button type="submit" class="confirm" data-nav="home">Confirm Your Order</button>
          <button type="button" class="cancel" data-nav="home">Cancel</button>
        </div>
      </form>

      <div class="secure-note">
        <p>🔒 Secure and Trusted Payments</p>
        <small>Your payment is protected with SSL encryption and trusted by leading payment gateways.</small>
      </div>
    </div>
  </div>
`;
}