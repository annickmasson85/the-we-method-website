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
  const meta = user?.user_metadata || {};

  document.getElementById("first-name").value = meta.first_name || "";
  document.getElementById("last-name").value = meta.last_name || "";
  document.getElementById("company").value = meta.company_name || meta.company || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("city").value = meta.city || "";
  document.getElementById("state").value = meta.state || "";

  const fullName = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Client";
  const nameEl = document.getElementById("member-profile-name");
  if (nameEl) nameEl.textContent = fullName;

  document.getElementById("profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("profile-status");
    status.textContent = "Saving...";

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: document.getElementById("first-name").value.trim(),
        last_name: document.getElementById("last-name").value.trim(),
        company_name: document.getElementById("company").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value.trim()
      }
    });

    status.textContent = error ? (error.message || "Unable to save.") : "Profile saved.";
    if (!error) {
      const next = [
        document.getElementById("first-name").value.trim(),
        document.getElementById("last-name").value.trim()
      ].filter(Boolean).join(" ");
      if (nameEl) nameEl.textContent = next || "Client";
    }
  });
});