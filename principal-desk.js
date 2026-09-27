document.addEventListener("DOMContentLoaded", async function () {
  var supabase = window.supabaseClient;
  if (!supabase) return;

  var session = await supabase.auth.getSession();
  if (!session.data || !session.data.session) {
    window.location.href = "signin.html";
    return;
  }

  var userRes = await supabase.auth.getUser();
  var user = (userRes.data && userRes.data.user) || session.data.session.user;
  var meta = (user && user.user_metadata) || {};
  var role = meta.role || "client";

  if (role !== "owner") {
    window.location.href = "owners-suite.html";
    return;
  }

  var name = document.getElementById("member-profile-name");
  if (name) {
    name.textContent = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Owner";
  }
  if (meta.avatar_url) {
    var photo = document.getElementById("header-photo");
    var icon = document.getElementById("header-icon");
    if (photo) {
      photo.src = meta.avatar_url;
      photo.hidden = false;
    }
    if (icon) icon.style.display = "none";
  }

  var files = [
    { client: "Client Preview", system: "Business Launcher", stage: "Questionnaire", next: "Review answers" },
    { client: "Port O’Connor Guest", system: "Operation Bundle", stage: "Appointment", next: "Tue 10:00" },
    { client: "Noely Mercier", system: "International Launcher", stage: "New request", next: "Send questionnaire" },
    { client: "Coastal Fleet Co.", system: "Fleet Care", stage: "In delivery", next: "On-site day 2" }
  ];

  var list = document.getElementById("desk-files");
  files.forEach(function (item) {
    var row = document.createElement("div");
    row.className = "desk-row";
    row.innerHTML =
      "<span>" + item.client + "</span>" +
      "<span>" + item.system + "</span>" +
      "<span class=\"desk-stage\">" + item.stage + "</span>" +
      "<span>" + item.next + "</span>";
    list.appendChild(row);
  });
});