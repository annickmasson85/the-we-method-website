document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("pd-menu")) return;

  var wrap = document.createElement("div");
  wrap.innerHTML = `
    <button class="pca-menu-button" id="pd-menu-button" type="button" aria-label="Open principal menu">
      <span></span><span></span><span></span>
    </button>
    <div class="pca-menu-overlay" id="pd-menu-overlay"></div>
    <aside class="pca-menu" id="pd-menu">
      <div>
        <p class="pca-menu-brand">TWM</p>
        <p class="pca-menu-sub">THE WE METHOD</p>
        <div class="pca-menu-diamond"></div>
        <p class="pca-menu-label">YOUR HOUSE</p>
        <nav>
          <a href="principal-desk.html">Principal Desk</a>
          <a href="operation-insight.html">Operation Insight</a>
          <a href="client-journey.html">Client Journey</a>
        </nav>
        <div class="pca-menu-diamond"></div>
        <p class="pca-menu-label">CLIENT WORK</p>
        <nav>
          <a href="implementation-board.html">Implementation Board</a>
          <a href="questionnaires.html">Questionnaires</a>
          <a href="appointments.html">Appointments</a>
        </nav>
        <div class="pca-menu-diamond"></div>
        <p class="pca-menu-label">THE LEDGER</p>
        <nav>
          <a href="resources-sold.html">Resources sold</a>
        </nav>
        <div class="pca-menu-diamond"></div>
        <p class="pca-menu-label">PREVIEW</p>
        <nav>
          <a href="owners-suite.html">Owner’s Suite</a>
          <a href="private-implementation.html">Implementation page</a>
        </nav>
      </div>
      <a class="pca-menu-logout" href="index.html" id="pd-signout">LOG OUT</a>
    </aside>
    <div class="pca-logout-overlay" id="pd-logout-overlay">
      <div class="pca-logout-card">
        <h2>Leave the desk?</h2>
        <p>Sign out of the principal account and return to the public house.</p>
        <div class="pca-logout-actions">
          <button class="pca-logout-back" id="pd-logout-back" type="button">BACK</button>
          <button class="pca-logout-confirm" id="pd-logout-confirm" type="button">LOG OUT</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  var page = (window.location.pathname.split("/").pop() || "").toLowerCase();
  document.querySelectorAll("#pd-menu nav a").forEach(function (link) {
    var href = (link.getAttribute("href") || "").toLowerCase();
    if (href && href === page) link.classList.add("is-active");
  });

  document.getElementById("pd-menu-button").addEventListener("click", function () {
    document.body.classList.toggle("menu-open");
  });
  document.getElementById("pd-menu-overlay").addEventListener("click", function () {
    document.body.classList.remove("menu-open");
  });
  document.getElementById("pd-signout").addEventListener("click", function (event) {
    event.preventDefault();
    document.body.classList.add("logout-open");
    document.body.classList.remove("menu-open");
  });
  document.getElementById("pd-logout-back").addEventListener("click", function () {
    document.body.classList.remove("logout-open");
  });
  document.getElementById("pd-logout-overlay").addEventListener("click", function (event) {
    if (event.target.id === "pd-logout-overlay") {
      document.body.classList.remove("logout-open");
    }
  });
  document.getElementById("pd-logout-confirm").addEventListener("click", async function () {
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
});