document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("pca-menu")) return;

  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <button class="pca-menu-button" id="pca-menu-button" type="button" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div class="pca-menu-overlay" id="pca-menu-overlay"></div>
    <aside class="pca-menu" id="pca-menu">
      <nav>
        <a href="private-access.html">Dashboard</a>
        <a href="my-journey.html">My Journey</a>
        <a href="business-launcher.html">Business Launch</a>
        <a href="implementation-services.html">Implementation Service</a>
        <a href="fleet-solution.html">Fleet Solution</a>
        <a href="fleet-builder.html">Fleet Builder</a>
        <a href="assessment.html">Assessment</a>
        <a href="my-cart.html">My Cart</a>
      </nav>
      <div class="pca-menu-bottom">
        <a href="mailto:info@thewemethod.com">Support</a>
        <a href="signin.html" id="menu-signout">Log out</a>
      </div>
    </aside>
  `;
  document.body.prepend(wrap);

  document.getElementById("pca-menu-button").onclick = () => {
    document.body.classList.toggle("menu-open");
  };
  document.getElementById("pca-menu-overlay").onclick = () => {
    document.body.classList.remove("menu-open");
  };
  document.getElementById("menu-signout").onclick = async (event) => {
    event.preventDefault();
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    window.location.href = "signin.html";
  };
});