document.addEventListener("DOMContentLoaded", async function () {
  var supabase = window.supabaseClient;
  if (!supabase) return;

  var sessionResponse = await supabase.auth.getSession();
  var session = sessionResponse.data && sessionResponse.data.session;
  if (!session) {
    window.location.href = "signin.html";
    return;
  }

  var userResponse = await supabase.auth.getUser();
  var user = (userResponse.data && userResponse.data.user) || session.user;
  var metadata = (user && user.user_metadata) || {};
  var profileName = document.getElementById("member-profile-name");
  var fullName = [metadata.first_name, metadata.last_name].filter(Boolean).join(" ");
  if (profileName) profileName.textContent = fullName || "Client";

  if (metadata.avatar_url) {
    var profilePhoto = document.getElementById("header-photo");
    var profileIcon = document.getElementById("header-icon");
    if (profilePhoto) {
      profilePhoto.src = metadata.avatar_url;
      profilePhoto.hidden = false;
    }
    if (profileIcon) profileIcon.style.display = "none";
  }
});