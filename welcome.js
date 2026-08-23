const supabase = window.supabaseClient;

function goToSignIn() {
  window.location.href = "signin.html";
}

function getFirstName(user) {
  const meta = user?.user_metadata || {};

  if (meta.first_name) return String(meta.first_name).trim();
  if (meta.firstName) return String(meta.firstName).trim();
  if (meta.full_name) return String(meta.full_name).trim().split(" ")[0];

  if (user?.email) {
    return user.email.split("@")[0];
  }

  return "CLIENT";
}

async function protectWelcomePage() {
  if (!supabase) {
    console.error("Supabase client missing. Check supabase-config.js script order.");
    goToSignIn();
    return;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    goToSignIn();
    return;
  }

  const firstName = getFirstName(data.session.user);
  const nameEl = document.getElementById("member-first-name");

  if (nameEl) {
    nameEl.textContent = firstName.toUpperCase();
  }
}

async function signOutMember() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  goToSignIn();
}

document.addEventListener("DOMContentLoaded", function () {
  protectWelcomePage();

  const signOutButton = document.getElementById("signout-button");
  if (signOutButton) {
    signOutButton.addEventListener("click", signOutMember);
  }
});