const supabase = window.supabaseClient;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signin-form");
  const passwordToggle = document.querySelector(".password-toggle");
  const passwordInput = document.querySelector("#password");

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const hidden = passwordInput.type === "password";
      passwordInput.type = hidden ? "text" : "password";
      passwordToggle.textContent = hidden ? "HIDE" : "SHOW";
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!supabase) {
      alert("Connection error. Refresh and try again.");
      return;
    }

    const email = (form.elements.namedItem("email")?.value || "").trim().toLowerCase();
    const password = form.elements.namedItem("password")?.value || "";

    if (!email || !password) {
      alert("Enter your email and password.");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "SIGNING IN...";
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.session) throw new Error("Unable to open your private access.");

      window.location.href = "private-access.html";
    } catch (error) {
      console.error(error);
      const message = String(error.message || "");
      if (/confirm/i.test(message)) {
        alert("Confirm your email first, then sign in.");
      } else if (/invalid/i.test(message) || /credentials/i.test(message)) {
        alert("Email or password is incorrect.");
      } else {
        alert(message || "Unable to sign in.");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
});