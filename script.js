let cart = [];
let discount = 0; // Added discount variable

// DOM Elements
const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const clearCart = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCart = document.getElementById("close-cart");
const cartButton = document.getElementById("cart-btn"); // Added reference to cart button

// Promo Code Elements
const promoCodeInput = document.getElementById("promo-code");
const applyPromoButton = document.getElementById("apply-promo");
const discountInfo = document.getElementById("discount-info");

// Fetch Products
fetch("products.json")
  .then((response) => response.json())
  .then((products) => renderProducts(products))
  .catch((error) => console.error("Error loading products:", error));

// Render Products
function renderProducts(products) {
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>$${product.price}</strong></p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productCard
      .querySelector(".add-to-cart")
      .addEventListener("click", () => addToCart(product));
    productsContainer.appendChild(productCard);
  });
}

// Add to Cart
function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty!</p>";
    totalPrice.textContent = "0.00";
    return;
  }

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <p>${item.name}</p>
        <strong>$${item.price}</strong>
      </div>
      <div class="cart-item-quantity">
        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" />
      </div>
    `;
    // Add event listener for quantity change
    cartItem.querySelector("input").addEventListener("input", (event) => {
      const newQuantity = parseInt(event.target.value);
      const itemId = event.target.getAttribute("data-id");
      if (newQuantity >= 1) {
        const itemIndex = cart.findIndex(
          (item) => item.id === parseInt(itemId)
        );
        if (itemIndex !== -1) {
          cart[itemIndex].quantity = newQuantity;
          updateCartUI(); // Update the UI after the quantity change
        }
      }
    });

    cartItems.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  // Apply discount to the total
  totalPrice.textContent = (total - discount).toFixed(2);
  discountInfo.textContent =
    discount > 0 ? `Discount Applied: $${discount.toFixed(2)}` : "";
}

// Promo Code Functionality
applyPromoButton.addEventListener("click", () => {
  const promoCode = promoCodeInput.value.trim();
  let discountAmount = 0;

  if (promoCode === "ostad10") {
    discountAmount = 0.1; // 10% discount
    discountInfo.textContent = `Discount Applied: 10% off!`;
  } else if (promoCode === "ostad5") {
    discountAmount = 0.05; // 5% discount
    discountInfo.textContent = `Discount Applied: 5% off!`;
  } else {
    discountInfo.textContent = "Invalid promo code!";
    discountAmount = 0;
  }

  // Calculate the discount amount based on the total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  discount = total * discountAmount;
  updateCartUI(); // Update UI with the new discount
});

// Show Toast Notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
    document.body.removeChild(toast);
  }, 3000);
}

// Show Cart Modal
cartButton.addEventListener("click", () => {
  // Ensuring the cart button works now
  cartModal.classList.add("show");
  updateCartUI();
});

// Close Cart Modal
closeCart.addEventListener("click", () => {
  cartModal.classList.remove("show");
});

// Clear Cart
clearCart.addEventListener("click", () => {
  cart = [];
  discount = 0; // Reset discount when clearing the cart
  updateCartUI();
  showToast("Cart has been cleared!");
});

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length > 0) {
    showToast("Proceeding to checkout...");
    cart = [];
    discount = 0; // Reset discount on checkout
    updateCartUI();
  } else {
    showToast("Your cart is empty!");
  }
});
