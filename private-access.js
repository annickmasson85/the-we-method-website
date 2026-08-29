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

  const firstName = data.session.user.user_metadata?.first_name || "Client";
  const nameEl = document.getElementById("member-first-name");
  if (nameEl) nameEl.textContent = firstName;

  document.getElementById("signout-button")?.addEventListener("click", async (event) => {
    event.preventDefault();
    await supabase.auth.signOut();
    window.location.href = "signin.html";
  });
});