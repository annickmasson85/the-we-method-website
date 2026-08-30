document.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;
  const form = document.getElementById("signup-form");
  const message = document.getElementById("signup-message");

  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.closest(".password-field")?.querySelector("input");
      if (!input) return;
      const hidden = input.type === "password";
      input.type = hidden ? "text" : "password";
      button.textContent = hidden ? "HIDE" : "SHOW";
    });
  });

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!supabase) {
      alert("Connection error. Refresh the page.");
      return;
    }

    const value = (id) => (document.getElementById(id)?.value || "").trim();
    const firstName = value("first-name");
    const lastName = value("last-name");
    const email = value("email").toLowerCase();
    const password = value("password");
    const confirmPassword = value("confirm-password");
    const company = value("company");
    const city = value("city");
    const state = value("state");
    const birthDate = value("birth-date");

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "CREATING ACCOUNT...";
    if (message) message.textContent = "";

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company_name: company || null,
            city,
            state,
            date_of_birth: birthDate || null
          }
        }
      });

      if (error) throw error;

      if (!data?.user || (data.user.identities && data.user.identities.length === 0)) {
        alert("This email already has an account. Please sign in.");
        window.location.href = "signin.html";
        return;
      }

      window.location.href = "private-access.html";
    } catch (error) {
      const text = String(error.message || "");
      if (/already/i.test(text) || /registered/i.test(text)) {
        alert("This email already has an account. Please sign in.");
        window.location.href = "signin.html";
        return;
      }
      alert(text || "Unable to create your account.");
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
});