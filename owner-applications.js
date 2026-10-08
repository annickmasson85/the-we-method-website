var applications = [
  { id: "APP-001", client: "Coastal Rides LLC", service: "Implementation Services", language: "english", received: "May 15", status: "To review", step: 1 },
  { id: "APP-002", client: "Sunset Rentals", service: "Operation Insight", language: "french", received: "May 14", status: "In progress", step: 2 }
];

var selected = null;
var docs = [
  { name: "Roadmap", due: "May 22" },
  { name: "Document system", due: "May 18" },
  { name: "Service procedures", due: "May 15" },
  { name: "Team plan", due: "May 25" },
  { name: "Follow-up plan", due: "May 19" }
];

function dueTone(due) {
  var today = new Date();
  var date = new Date(due + ", " + today.getFullYear());
  var days = Math.ceil((date - today) / 86400000);
  if (days <= 0) return "red";
  if (days <= 7) return "orange";
  return "green";
}

function render() {
  var filter = document.getElementById("language-filter").value;
  var rows = applications.filter(function (item) {
    return filter === "all" || item.language === filter;
  });
  document.getElementById("application-rows").innerHTML = rows.map(function (item) {
    return "<tr data-id=\"" + item.id + "\"><td><i class=\"lang-dot " + item.language + "\"></i>" + item.client + "</td><td>" + item.service + "</td><td>" + item.received + "</td><td>" + item.status + "</td><td><button type=\"button\" data-open=\"" + item.id + "\">Open</button></td></tr>";
  }).join("");
  document.getElementById("count-received").textContent = applications.length;
  document.getElementById("count-review").textContent = applications.filter(function (item) { return item.status === "To review"; }).length;
  document.getElementById("count-implementation").textContent = applications.filter(function (item) { return item.service === "Implementation Services" && item.status === "In progress"; }).length;
  document.getElementById("count-done").textContent = applications.filter(function (item) { return item.status === "Completed"; }).length;
  var review = document.getElementById("review-count");
  var waiting = applications.filter(function (item) { return item.status === "To review"; }).length;
  review.hidden = waiting === 0;
  review.textContent = waiting;
}

function openFile(id) {
  selected = applications.find(function (item) { return item.id === id; });
  if (!selected) return;
  var panel = document.getElementById("owner-file");
  panel.hidden = false;
  document.getElementById("file-client").textContent = selected.client;
  document.getElementById("file-service").textContent = selected.service;
  document.getElementById("file-language").innerHTML = "<i class=\"lang-dot " + selected.language + "\"></i>" + (selected.language === "french" ? "Français" : "English");
  var list = document.getElementById("doc-list");
  if (selected.service !== "Implementation Services") {
    list.innerHTML = "<li>This document path is for Implementation Services only.</li>";
    return;
  }
  list.innerHTML = docs.map(function (doc) {
    return "<li><i class=\"due-dot " + dueTone(doc.due) + "\"></i>" + doc.name + " <span>due " + doc.due + "</span></li>";
  }).join("");
}

document.addEventListener("DOMContentLoaded", async function () {
  var supabase = window.supabaseClient;
  if (supabase) {
    var session = await supabase.auth.getSession();
    if (!session.data || !session.data.session) {
      window.location.href = "signin.html";
      return;
    }
    var userRes = await supabase.auth.getUser();
    var user = (userRes.data && userRes.data.user) || session.data.session.user;
    var meta = (user && user.user_metadata) || {};
    var name = document.getElementById("member-profile-name");
    if (name) name.textContent = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Client";
    if (meta.avatar_url) {
      var photo = document.getElementById("header-photo");
      var icon = document.getElementById("header-icon");
      if (photo) { photo.src = meta.avatar_url; photo.hidden = false; }
      if (icon) icon.style.display = "none";
    }
  }
  render();
  document.getElementById("language-filter").addEventListener("change", render);
  document.getElementById("application-rows").addEventListener("click", function (event) {
    var id = event.target.getAttribute("data-open");
    if (id) openFile(id);
  });
});