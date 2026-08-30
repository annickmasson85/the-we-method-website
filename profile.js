const supabase = window.supabaseClient;

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabase) {
    window.location.href = "signin.html";
    return;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    window.location.href = "signin.html";
    return;
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user || sessionData.session.user;
  const meta = user.user_metadata || {};
  const fullName = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Client";
  const year = new Date(user.created_at || Date.now()).getFullYear();

  document.getElementById("member-profile-name").textContent = fullName;
  document.getElementById("profile-card-name").textContent = fullName.toUpperCase();
  document.getElementById("full-name").value = fullName;
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = meta.phone || "";
  document.getElementById("company").value = meta.company_name || "";
  document.getElementById("location").value = [meta.city, meta.state].filter(Boolean).join(", ");
  document.getElementById("stage").value = meta.business_stage || "";
  document.getElementById("member-since").textContent = "MEMBER SINCE " + year;

  const photo = document.getElementById("profile-photo");
  const fallback = document.getElementById("profile-photo-fallback");
  if (meta.avatar_data) {
    photo.src = meta.avatar_data;
    photo.hidden = false;
    fallback.hidden = true;
  }

  document.getElementById("photo-input").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photo.src = reader.result;
      photo.hidden = false;
      fallback.hidden = true;
      photo.dataset.pending = reader.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("profile-status");
    status.textContent = "Saving...";

    const location = document.getElementById("location").value.split(",");
    const city = (location[0] || "").trim();
    const state = (location[1] || "").trim();

    const { error } = await supabase.auth.updateUser({
      data: {
        phone: document.getElementById("phone").value.trim(),
        company_name: document.getElementById("company").value.trim(),
        city,
        state,
        business_stage: document.getElementById("stage").value,
        avatar_data: photo.dataset.pending || meta.avatar_data || null
      }
    });

    status.textContent = error ? (error.message || "Unable to save.") : "Changes saved.";
  });

  document.getElementById("signout-button")?.addEventListener("click", async (event) => {
    event.preventDefault();
    await supabase.auth.signOut();
    window.location.href = "signin.html";
  });
});