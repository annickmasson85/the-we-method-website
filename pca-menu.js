document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("pca-menu")) return;

  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <button class="pca-menu-button" id="pca-menu-button" type="button" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div class="pca-menu-overlay" id="pca-menu-overlay"></div>
    <aside class="pca-menu" id="pca-menu">
      <div>
        <p class="pca-menu-brand">TWM</p>
        <p class="pca-menu-sub">THE WE METHOD</p>
        <div class="pca-menu-diamond"></div>
        <p class="pca-menu-label">PRIVATE ACCESS</p>
        <nav>
          <a href="private-access.html">Private Client Access</a>
          <a href="owners-suite.html">Owner’s Suite</a>
          <a href="knowledge-vault.html">Founder Library</a>
          <a href="profile.html">Member Profile</a>
        </nav>
        <div class="pca-menu-diamond"></div>
        <p class="pca-menu-label">YOUR BUSINESS</p>
        <nav>
          <a href="implementation-services.html">Implementation Services</a>
          <a href="fleet-solution.html">Fleet Solution</a>
          <a href="fleet-builder.html">Fleet Builder</a>
          <a href="my-cart.html">My Cart</a>
        </nav>
      </div>
      <a class="pca-menu-logout" href="signin.html" id="menu-signout">LOG OUT</a>
    </aside>
  `;
  document.body.appendChild(wrap);

  const button = document.getElementById("pca-menu-button");
  const overlay = document.getElementById("pca-menu-overlay");

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    document.body.classList.toggle("menu-open");
  });

  overlay.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
  });

  document.getElementById("menu-signout").addEventListener("click", async (event) => {
    event.preventDefault();
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    window.location.href = "signin.html";
  });
});