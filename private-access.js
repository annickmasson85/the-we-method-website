const supabase = window.supabaseClient;

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabase) {
    window.location.href = "signin.html";
    return;
  }

  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = "signin.html";
    return;
  }

  const meta = data.session.user.user_metadata || {};
  const firstName = (meta.first_name || "Client").trim();
  const lastName = (meta.last_name || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const welcome = document.getElementById("member-first-name");
  const profile = document.getElementById("member-profile-name");

  if (welcome) welcome.textContent = firstName.toUpperCase();
  if (profile) profile.textContent = fullName;

  document.getElementById("signout-button")?.addEventListener("click", async (event) => {
    event.preventDefault();
    await supabase.auth.signOut();
    window.location.href = "signin.html";
  });
});