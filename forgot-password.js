const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const forgotForm = document.getElementById("forgot-form");
const emailInput = document.getElementById("reset-email");
const resetButton = document.getElementById("reset-button");
const statusMessage = document.getElementById("forgot-status");

forgotForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();

  if (!email) {
    showStatus("Enter your e-mail address.", "error");
    return;
  }

  const originalText = resetButton.textContent;

  resetButton.disabled = true;
  resetButton.textContent = "SENDING...";

  const currentFolder = window.location.pathname.replace(
    /[^/]*$/,
    ""
  );

  const redirectUrl =
    window.location.origin +
    currentFolder +
    "reset-password.html";

  try {
    const { error } =
      await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

    if (error) {
      throw error;
    }

    showStatus(
      "A secure reset link has been sent. Check your e-mail.",
      "success"
    );

    forgotForm.reset();
  } catch (error) {
    console.error("Password reset error:", error);

    showStatus(
      error.message ||
        "We could not send the reset link. Please try again.",
      "error"
    );
  } finally {
    resetButton.disabled = false;
    resetButton.textContent = originalText;
  }
});

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
}