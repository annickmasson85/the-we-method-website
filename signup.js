const supabaseClient = window.supabaseClient;

if (!supabaseClient) {
  console.error("Supabase client missing. Check supabase-config.js script order.");
}

const signupForm = document.getElementById("signup-form");

if (!signupForm) {
  console.error("Le formulaire #signup-form est introuvable.");
} else {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const getValue = (...names) => {
      for (const name of names) {
        const field =
          signupForm.elements.namedItem(name) ||
          document.getElementById(name);

        if (field) {
          return field.value.trim();
        }
      }

      return "";
    };

    const company = getValue("company");
    const firstName = getValue("first-name", "first_name", "firstname");
    const lastName = getValue("last-name", "last_name", "lastname");
    const dateOfBirth = getValue(
      "date-of-birth",
      "date_of_birth",
      "birth-date",
      "dob"
    );
    const email = getValue("email");
    const password = getValue("password");
    const confirmPassword = getValue(
      "confirm-password",
      "confirm_password"
    );
    const city = getValue("city");
    const state = getValue("state");

    if (!email || !password) {
      alert("Entre ton adresse e-mail et ton mot de passe.");
      return;
    }

    if (password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Les deux mots de passe ne correspondent pas.");
      return;
    }

    const submitButton = signupForm.querySelector(
      'button[type="submit"]'
    );

    const originalText = submitButton?.textContent;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "CREATING ACCOUNT...";
    }

    try {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: company || null,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth || null,
            city,
            state
          }
        }
      });
        if (error) {
          const alreadyUsed =
            /already/i.test(error.message || "") ||
            /registered/i.test(error.message || "") ||
            error.status === 422;

          if (alreadyUsed) {
            alert("This email already has an account. Please sign in.");
            window.location.href = "signin.html";
            return;
          }

          throw error;
        }

        const identities = data?.user?.identities || [];
        if (!data?.user || identities.length === 0) {
          alert("This email already has an account. Please sign in.");
          window.location.href = "signin.html";
          return;
        }

        signupForm.reset();
        window.location.href = "account-created.html";
        
    } catch (error) {
      console.error("Erreur d'inscription :", error);

      alert(
        error.message ||
          "Une erreur empêche la création du compte."
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
  }
  const passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach((toggleButton) => {
  toggleButton.addEventListener("click", () => {
    const passwordField = toggleButton.closest(".password-field");
    const passwordInput = passwordField?.querySelector("input");

    if (!passwordInput) {
      return;
    }

    const passwordIsHidden = passwordInput.type === "password";

    passwordInput.type = passwordIsHidden ? "text" : "password";
    toggleButton.textContent = passwordIsHidden ? "HIDE" : "SHOW";

    toggleButton.setAttribute(
      "aria-label",
      passwordIsHidden ? "Hide password" : "Show password"
    );
  });
});