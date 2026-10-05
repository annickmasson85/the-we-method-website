document.addEventListener("DOMContentLoaded", async function () {
  var supabase = window.supabaseClient;
  var user = null;
  var button = document.getElementById("club-remind");

  function markSaved() {
    if (!button) return;
    button.classList.add("is-saved");
    button.querySelector("span").textContent = "REMINDER SAVED";
    button.disabled = true;
  }

  if (supabase) {
    var sessionResponse = await supabase.auth.getSession();
    var session = sessionResponse.data && sessionResponse.data.session;
    if (!session) {
      window.location.href = "signin.html";
      return;
    }

    var userResponse = await supabase.auth.getUser();
    user = (userResponse.data && userResponse.data.user) || session.user;
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

    if (user) {
      var existing = await supabase
        .from("twm_club_reminders")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing.data) markSaved();
    }
  }

  var stage = document.querySelector(".private-club");
  var target = Date.parse(stage && stage.dataset.revealDate);
  var fields = ["days", "hours", "minutes", "seconds"].map(function (unit) {
    return document.querySelector("[data-" + unit + "]");
  });

  function paint() {
    var total = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    var values = [
      Math.floor(total / 86400),
      Math.floor((total % 86400) / 3600),
      Math.floor((total % 3600) / 60),
      total % 60
    ];
    fields.forEach(function (field, index) {
      if (field) field.textContent = String(values[index]).padStart(2, "0");
    });
  }

  if (Number.isFinite(target) && fields.every(Boolean)) {
    paint();
    setInterval(paint, 1000);
  }

  if (button) {
    button.addEventListener("click", async function () {
      if (!supabase || !user || !user.email) return;
      var result = await supabase.from("twm_club_reminders").insert({
        user_id: user.id,
        email: user.email
      });
      if (!result.error) markSaved();
    });
  }
});