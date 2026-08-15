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