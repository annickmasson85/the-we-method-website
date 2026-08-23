const supabase = window.supabaseClient;

function showStatus(text, type) {
  const el = document.getElementById("reset-status");
  if (!el) return;
  el.textContent = text;
  el.dataset.type = type || "";
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("reset-form");
  const button = document.getElementById("save-password-button");

  if (!supabase) {
    showStatus("Connection error. Refresh and try again.", "error");
    return;
  }

  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    showStatus("Open this page from the reset link in your email.", "error");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = document.getElementById("new-password").value;
    const confirm = document.getElementById("confirm-new-password").value;

    if (password.length < 8) {
      showStatus("Password must be at least 8 characters.", "error");
      return;
    }

    if (password !== confirm) {
      showStatus("Passwords do not match.", "error");
      return;
    }

    const original = button.textContent;
    button.disabled = true;
    button.textContent = "SAVING...";

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      showStatus("Password updated. You can sign in now.", "success");
      window.setTimeout(() => {
        window.location.href = "signin.html";
      }, 1200);
    } catch (error) {
      showStatus(error.message || "Unable to update password.", "error");
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
});