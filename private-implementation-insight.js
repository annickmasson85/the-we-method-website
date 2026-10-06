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
  var name = document.getElementById("member-profile-name");

  if (name) {
    name.textContent = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Client";
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
});