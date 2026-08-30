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
  const location = [meta.city, meta.state].filter(Boolean).join(", ") || "—";

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  set("member-profile-name", fullName);
  set("profile-card-name", fullName.toUpperCase());
  set("full-name", fullName);
  set("email", user.email || "—");
  set("phone", meta.phone || "—");
  set("company", meta.company_name || "—");
  set("location", location);
  set("stage", meta.business_stage || "—");
  set("member-since", "MEMBER SINCE " + year);

  document.getElementById("signout-button")?.addEventListener("click", async (event) => {
    event.preventDefault();
    await supabase.auth.signOut();
    window.location.href = "signin.html";
  });
});