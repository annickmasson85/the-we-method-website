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
  const emailName = (user?.email || "").split("@")[0];

  const firstName = String(meta.first_name || meta.firstName || "").trim();
  const lastName = String(meta.last_name || meta.lastName || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || emailName || "Client";
  const welcomeName = firstName || fullName;

  document.getElementById("member-first-name").textContent = welcomeName.toUpperCase();
  document.getElementById("member-profile-name").textContent = fullName;

  document.getElementById("signout-button")?.addEventListener("click", async (event) => {
    event.preventDefault();
    await supabase.auth.signOut();
    window.location.href = "signin.html";
  });
});