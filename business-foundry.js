document.addEventListener("DOMContentLoaded", () => {
  const vault = document.getElementById("foundryVault");
  const door = vault?.querySelector(".foundry-vault-door");
  const lock = vault?.querySelector(".foundry-vault-lock");
  const button = vault?.querySelector(".foundry-vault-button");

  if (!vault || !door || !lock || !button) {
    console.error("Une pièce du coffre est introuvable.");
    return;
  }

  let isOpening = false;

  function openVault() {
    if (isOpening) return;

    isOpening = true;
    vault.classList.add("is-opening");
setTimeout(() => {
  vault.classList.add("is-door-opening");
}, 650);
    setTimeout(() => {
      window.location.href = "knowledge-vault.html#business-launcher";
    }, 2300);
  }

  vault.addEventListener("click", openVault);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openVault();
  });

  vault.setAttribute("tabindex", "0");
  vault.setAttribute("role", "button");
  vault.setAttribute("aria-label", "Enter the Knowledge Vault");

  vault.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openVault();
    }
  });
});