const supabase = window.supabaseClient;

const signupForm = document.getElementById("signup-form");

if (!signupForm) {
  console.error("Formulaire #signup-form introuvable.");
} else {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!supabase) {
      alert("Connection error. Refresh and try again.");
      return;
    }

    const getValue = (...names) => {
      for (const name of names) {
        const field =
          signupForm.elements.namedItem(name) ||
          document.getElementById(name);
        if (field && field.value) return field.value.trim();
      }
      return "";
    };

    const firstName = getValue("first-name", "firstName", "first_name");
    const lastName = getValue("last-name", "lastName", "last_name");
    const email = getValue("email").toLowerCase();
    const password = getValue("password");
    const confirmPassword = getValue("confirm-password", "confirm_password", "confirmPassword");
    const company = getValue("company");
    const city = getValue("city");
    const state = getValue("state");

    if (!email || !password) {
      alert("Enter your email and password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const submitButton = signupForm.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "CREATING ACCOUNT...";
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company_name: company || null,
            city: city || null,
            state: state || null
          }
        }
      });

      if (error) {
        const message = String(error.message || "");
        if (/already/i.test(message) || /registered/i.test(message)) {
          alert("This email already has an account. Please sign in.");
          window.location.href = "signin.html";
          return;
        }
        throw error;
      }

      if (!data?.user || (data.user.identities && data.user.identities.length === 0)) {
        alert("This email already has an account. Please sign in.");
        window.location.href = "signin.html";
        return;
      }

      signupForm.reset();
      window.location.href = "account-created.html";
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to create your account.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}

document.querySelectorAll(".password-toggle").forEach((toggleButton) => {
  toggleButton.addEventListener("click", () => {
    const passwordField = toggleButton.closest(".password-field");
    const passwordInput = passwordField?.querySelector("input");
    if (!passwordInput) return;
    const hidden = passwordInput.type === "password";
    passwordInput.type = hidden ? "text" : "password";
    toggleButton.textContent = hidden ? "HIDE" : "SHOW";
  });
});