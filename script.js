let cart = [];

// DOM Elements
const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const clearCart = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCart = document.getElementById("close-cart");

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

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.innerHTML = `
      <p>${item.name} - $${item.price} x ${item.quantity}</p>
      <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
    `;
    cartItem.querySelector(".quantity-input").addEventListener("input", (e) => {
      updateQuantity(item.id, parseInt(e.target.value));
    });
    cartItems.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  totalPrice.textContent = total.toFixed(2);
}

// Update Quantity
function updateQuantity(id, quantity) {
  const product = cart.find((item) => item.id === id);
  if (product && quantity > 0) {
    product.quantity = quantity;
    updateCartUI();
  }
}

// Clear Cart
clearCart.addEventListener("click", () => {
  cart = [];
  updateCartUI();
});

// Checkout
checkoutBtn.addEventListener("click", () => {
  alert("Thank you for your purchase!");
  cart = [];
  updateCartUI();
});

// Toggle Cart Modal
document.getElementById("cart-btn").addEventListener("click", () => {
  cartModal.classList.add("show");
});
closeCart.addEventListener("click", () => {
  cartModal.classList.remove("show");
});

// Add Toast Notification for Adding to Cart
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  document.body.appendChild(toast);
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
}

// Modified Add to Cart Function
function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  showToast(`${product.name} added to cart!`);
  updateCartUI();
}

// Improved Update Cart UI
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
          <p>${item.name} - <strong>$${item.price.toFixed(2)}</strong></p>
        </div>
        <div class="cart-item-quantity">
          <label>Qty:</label>
          <input type="number" value="${
            item.quantity
          }" min="1" class="quantity-input" data-id="${item.id}">
        </div>
      `;
    cartItem.querySelector(".quantity-input").addEventListener("input", (e) => {
      updateQuantity(item.id, parseInt(e.target.value));
    });
    cartItems.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  totalPrice.textContent = total.toFixed(2);
}
