document.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;
  const form = document.getElementById("signin-form");
  const toggle = document.querySelector(".password-toggle");
  const password = document.getElementById("password");

  if (toggle && password) {
    toggle.addEventListener("click", () => {
      const hidden = password.type === "password";
      password.type = hidden ? "text" : "password";
      toggle.textContent = hidden ? "HIDE" : "SHOW";
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!supabase) {
      alert("Connection error. Refresh the page.");
      return;
    }

    const email = (document.getElementById("email")?.value || "").trim().toLowerCase();
    const value = document.getElementById("password")?.value || "";

    const button = form.querySelector('button[type="submit"]');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "SIGNING IN...";

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: value
      });

      if (error) throw error;
      if (!data.session) throw new Error("Unable to open your private access.");

      window.location.href = "private-access.html";
    } catch (error) {
      const text = String(error.message || "");
      if (/confirm/i.test(text)) {
        alert("Confirm your email first, then sign in.");
      } else if (/invalid/i.test(text) || /credentials/i.test(text)) {
        alert("Email or password is incorrect.");
      } else {
        alert(text || "Unable to sign in.");
      }
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
});