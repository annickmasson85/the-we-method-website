const CART_KEY = "twmCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function money(n) {
  return "$" + Number(n || 0).toLocaleString("en-US");
}

function renderCart() {
  const cart = getCart();
  const list = document.getElementById("cart-items");
  const empty = document.getElementById("cart-empty");
  const count = document.getElementById("cart-count");
  if (!list) return;

  list.innerHTML = "";
  if (count) count.textContent = "(" + cart.length + " item" + (cart.length === 1 ? "" : "s") + ")";
  if (empty) empty.hidden = cart.length > 0;

  let subtotal = 0;
  cart.forEach((item, index) => {
    const qty = Math.max(1, Number(item.qty || 1));
    const line = Number(item.price || 0) * qty;
    subtotal += line;

    const article = document.createElement("article");
    article.className = "cart-item";
    article.innerHTML = `
      <div class="cart-item-info">
        <p class="cart-item-category">${item.category || "The We Method"}</p>
        <h3>${item.name}</h3>
        <p>${item.note || ""}</p>
        <button class="cart-remove" type="button" data-remove="${index}">Remove</button>
      </div>
      <div class="cart-item-price">${money(item.price)}</div>
      <div class="cart-item-quantity">
        <div class="quantity-control">
          <button type="button" data-qty="${index}" data-dir="-1">−</button>
          <input type="number" min="1" value="${qty}" data-qty-input="${index}">
          <button type="button" data-qty="${index}" data-dir="1">+</button>
        </div>
      </div>
      <div class="cart-item-total">${money(line)}</div>
    `;
    list.appendChild(article);
  });

  const sub = document.getElementById("cart-subtotal");
  const total = document.getElementById("cart-total");
  if (sub) sub.textContent = money(subtotal);
  if (total) total.textContent = money(subtotal);
}

document.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  const qtyBtn = event.target.closest("[data-qty]");
  const cart = getCart();

  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    saveCart(cart);
    renderCart();
  }

  if (qtyBtn) {
    const i = Number(qtyBtn.dataset.qty);
    cart[i].qty = Math.max(1, Number(cart[i].qty || 1) + Number(qtyBtn.dataset.dir));
    saveCart(cart);
    renderCart();
  }
});

document.addEventListener("change", (event) => {
  const input = event.target.closest("[data-qty-input]");
  if (!input) return;
  const cart = getCart();
  cart[Number(input.dataset.qtyInput)].qty = Math.max(1, Number(input.value || 1));
  saveCart(cart);
  renderCart();
});

document.addEventListener("DOMContentLoaded", renderCart);