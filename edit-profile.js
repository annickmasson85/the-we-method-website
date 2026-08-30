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

  document.getElementById("member-profile-name").textContent = fullName;
  document.getElementById("full-name").value = fullName;
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = meta.phone || "";
  document.getElementById("company").value = meta.company_name || "";
  document.getElementById("location").value = [meta.city, meta.state].filter(Boolean).join(", ");
  document.getElementById("stage").value = meta.business_stage || "";

  document.getElementById("edit-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("edit-status");
    status.textContent = "Saving...";

    const parts = document.getElementById("location").value.split(",");
    const { error } = await supabase.auth.updateUser({
      data: {
        phone: document.getElementById("phone").value.trim(),
        company_name: document.getElementById("company").value.trim(),
        city: (parts[0] || "").trim(),
        state: (parts[1] || "").trim(),
        business_stage: document.getElementById("stage").value
      }
    });

    if (error) {
      status.textContent = error.message || "Unable to save.";
      return;
    }

    window.location.href = "profile.html";
  });
});