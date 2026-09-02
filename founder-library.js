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

  function createBook(product, variant, ownedProducts) {
    const owned = ownedProducts.has(product.slug);
    const link = document.createElement("a");
    link.className = "library-item library-item--" + variant + (owned ? " is-owned" : " is-locked");
    link.href = "founder-library-detail.html?product=" + encodeURIComponent(product.slug);
    link.dataset.product = product.slug;
    link.setAttribute(
      "aria-label",
      product.title + ". " + (owned ? "Owned — open details" : "Locked — view purchase details")
    );

    const book = document.createElement("img");
    book.className = "library-book";
    book.src = product.image;
    book.alt = product.title;

    const ownedBadge = document.createElement("img");
    ownedBadge.className = "access-mark access-mark--owned";
    ownedBadge.src = "images/library-owned.png";
    ownedBadge.alt = "Owned";
    ownedBadge.hidden = !owned;

    const lock = document.createElement("img");
    lock.className = "access-mark access-mark--locked";
    lock.src = "images/library-lock.png";
    lock.alt = "Locked";
    lock.hidden = owned;

    const name = document.createElement("span");
    name.className = "visually-hidden";
    name.textContent = product.title;

    link.append(book, ownedBadge, lock, name);
    return link;
  }

  function renderLibrary() {
    const signatureContainer = document.getElementById("signature-systems");
    const resourcesContainer = document.getElementById("founder-resources");
    if (!signatureContainer || !resourcesContainer) return;

    const ownedProducts = getOwnedProducts();
    const signatureSystems = products.filter((product) => product.collection === "Signature System");
    const resources = products.filter((product) => product.collection === "Founder Resource");

    signatureSystems.forEach((product) => {
      signatureContainer.appendChild(createBook(product, "signature", ownedProducts));
    });

    [resources.slice(0, 4), resources.slice(4, 8), resources.slice(8, 11)].forEach((rowProducts, index) => {
      const row = document.createElement("div");
      row.className = "resource-row resource-row--" + (index + 1);
      rowProducts.forEach((product) => {
        row.appendChild(createBook(product, "resource", ownedProducts));
      });
      resourcesContainer.appendChild(row);
    });
  }

  document.addEventListener("DOMContentLoaded", renderLibrary);
})();