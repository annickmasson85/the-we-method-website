const supabase = window.supabaseClient;

const passwordToggle = document.querySelector(".password-toggle");
const passwordInput = document.querySelector("#password");

if (passwordToggle && passwordInput) {
  passwordToggle.addEventListener("click", () => {
    const passwordIsHidden = passwordInput.type === "password";

    passwordInput.type = passwordIsHidden ? "text" : "password";
    passwordToggle.textContent = passwordIsHidden ? "HIDE" : "SHOW";
    passwordToggle.setAttribute(
      "aria-label",
      passwordIsHidden ? "Hide password" : "Show password"
    );
  });
}

function showSignInMessage(text) {
  const el = document.getElementById("signin-message");
  if (el) {
    el.textContent = text;
    return;
  }
  alert(text);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signin-form") || document.querySelector("form");

  if (!form) {
    console.error("Sign in form not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!supabase) {
      showSignInMessage("Connection error. Refresh and try again.");
      return;
    }

    const email = (form.elements.namedItem("email")?.value || "").trim().toLowerCase();
    const password = form.elements.namedItem("password")?.value || "";

    if (!email || !password) {
      showSignInMessage("Enter your email and password.");
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

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error("Unable to open your private access.");
      }

      window.location.href = "welcome.html";
    } catch (error) {
      console.error("Sign in error:", error);

      const message = String(error.message || "");
      if (/confirm/i.test(message) || /not confirmed/i.test(message)) {
        showSignInMessage("Confirm your email first, then sign in.");
      } else if (/invalid/i.test(message) || /credentials/i.test(message)) {
        showSignInMessage("Email or password is incorrect.");
      } else {
        showSignInMessage(message || "Unable to sign in.");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
});