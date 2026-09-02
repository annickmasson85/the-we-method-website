(function () {
  "use strict";

  const products = window.TWM_LIBRARY_PRODUCTS || [];
  const config = window.TWM_LIBRARY_CONFIG || {};

  function getOwnedProducts() {
    if (Array.isArray(window.TWM_OWNED_PRODUCTS)) {
      return new Set(window.TWM_OWNED_PRODUCTS);
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(config.ownershipStorageKey || "twm-owned-products") || "null"
      );
      if (Array.isArray(saved)) return new Set(saved);
    } catch (error) {
      console.warn("The saved library access list could not be read.", error);
    }

    return new Set(config.defaultOwned || []);
  }

  function text(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value || "—";
  }

  function renderProduct() {
    const params = new URLSearchParams(window.location.search);
    const requestedSlug = params.get("product") || "business-launcher";
    const product = products.find((item) => item.slug === requestedSlug) || products[0];
    if (!product) return;

    document.title = product.title + " | Founder Library";

    const image = document.getElementById("product-image");
    if (image) {
      image.src = product.image;
      image.alt = product.title;
    }

    text("product-method", product.method);
    text("product-title", product.title);
    text("product-summary", product.summary);
    text("product-value", product.totalValue);
    text("product-investment", product.investment);
    text("product-type", product.type);
    text("product-audience", product.audience);
    text("product-focus", product.focus);
    text("product-level", product.level);
    text("product-duration", product.duration);
    text("product-format", product.format);

    const includes = document.getElementById("product-includes-list");
    if (includes) {
      includes.innerHTML = "";
      (product.includes || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        includes.appendChild(li);
      });
    }

    const owned = getOwnedProducts().has(product.slug);
    const lockedState = document.getElementById("locked-state");
    const ownedState = document.getElementById("owned-state");
    const action = document.getElementById("product-action");

    if (lockedState) lockedState.hidden = owned;
    if (ownedState) ownedState.hidden = !owned;

    if (action) {
      action.textContent = owned ? "OPEN SYSTEM" : "ADD TO CART";
      action.href = owned ? product.openUrl : product.cartUrl;
      action.setAttribute(
        "aria-label",
        owned ? "Open " + product.title : "Add " + product.title + " to cart"
      );
    }
  }

  document.addEventListener("DOMContentLoaded", renderProduct);
})();