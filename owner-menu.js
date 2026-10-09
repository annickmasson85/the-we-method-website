document.addEventListener("DOMContentLoaded", function () {
  var menu = document.getElementById("main-menu");
  if (!menu) {
    menu = document.createElement("nav");
    menu.className = "side-menu";
    menu.id = "main-menu";
    menu.inert = true;
    menu.innerHTML = `
      <div class="menu-top"><span>OWNER DESK</span><button type="button" class="menu-close" id="menu-close">×</button></div>
      <p class="menu-label">Desk</p>
      <a href="principal-desk.html">Owner Desk</a>
      <a href="owners-suite.html">Client preview</a>
      <p class="menu-label">Work</p>
      <a href="weekly-tasks.html">Weekly task</a>
      <a href="calendar.html">Calendar</a>
      <a href="owner-documents.html">Document pending</a>
      <a href="owner-updates.html">Update</a>
      <a href="owner-team.html">Team desk</a>
      <a href="owner-messages.html">Message</a>
      <a href="owner-reports.html">Report</a>
      <p class="menu-label">Services</p>
      <a href="owner-applications.html">Implementation Services</a>
      <a href="private-operation-insight.html">Operation Insight</a>
      <a href="private-implementation-insight.html">Implementation &amp; Operation Insight</a>
      <a href="private-fleet-solution.html">Fleet Solution</a>
      <a href="private-twm-club.html">TWM Club</a>
      <button type="button" id="desk-signout">Log out</button>
    `;
    document.body.appendChild(menu);
  }

  var page = window.location.pathname.split("/").pop();
  menu.querySelectorAll("a").forEach(function (link) {
    if (link.getAttribute("href") === page) link.classList.add("is-active");
  });

  var button = document.getElementById("menu-toggle") || document.getElementById("menu-button");
  var backdrop = document.getElementById("menu-backdrop");
  function openMenu() {
    menu.classList.add("is-open");
    menu.inert = false;
    if (backdrop) backdrop.hidden = false;
  }
  function closeMenu() {
    menu.classList.remove("is-open");
    menu.inert = true;
    if (backdrop) backdrop.hidden = true;
  }
  if (button) button.addEventListener("click", function () {
    menu.classList.contains("is-open") ? closeMenu() : openMenu();
  });
  var close = document.getElementById("menu-close");
  if (close) close.addEventListener("click", closeMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);
});