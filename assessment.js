document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.location.href = "signin.html";
      return;
    }
    const user = (await supabase.auth.getUser()).data.user || data.session.user;
    const meta = user.user_metadata || {};
    const name = document.getElementById("member-profile-name");
    if (name) name.textContent = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Client";
    if (meta.avatar_url) {
      const photo = document.getElementById("header-photo");
      const icon = document.getElementById("header-icon");
      if (photo) { photo.src = meta.avatar_url; photo.hidden = false; }
      if (icon) icon.style.display = "none";
    }
  }

  const questions = [...document.querySelectorAll(".as-question")];
  const bar = document.getElementById("as-progress-bar");
  const label = document.getElementById("as-step-label");
  const error = document.getElementById("as-error");
  const back = document.getElementById("as-back");
  const next = document.getElementById("as-next");
  let step = 1;

  function show() {
    questions.forEach((q) => q.classList.toggle("is-active", Number(q.dataset.step) === step));
    label.textContent = "QUESTION 0" + step + " OF 07";
    bar.style.width = (step / 7) * 100 + "%";
    back.style.visibility = step === 1 ? "hidden" : "visible";
    next.textContent = step === 7 ? "SEE YOUR RESULT" : "CONTINUE";
    error.hidden = true;
  }

  function valid() {
    const current = questions[step - 1];
    const inputs = [...current.querySelectorAll("input")];
    if (inputs[0].type === "checkbox" && inputs[0].name === "have") return true;
    return inputs.some((input) => input.checked);
  }

  function collect() {
    const form = document.getElementById("assessment-form");
    const have = [...form.querySelectorAll('input[name="have"]:checked')].map((i) => i.value);
    const support = [...form.querySelectorAll('input[name="support"]:checked')].map((i) => i.value);
    return {
      journey: form.journey.value,
      fleet: form.fleet.value,
      international: form.international.value,
      have,
      goal: form.goal.value,
      support,
      timing: form.timing.value
    };
  }

  back.addEventListener("click", () => {
    if (step > 1) { step -= 1; show(); }
  });

  next.addEventListener("click", () => {
    if (!valid()) {
      error.hidden = false;
      return;
    }
    if (step < 7) {
      step += 1;
      show();
      return;
    }
    localStorage.setItem("twm-assessment", JSON.stringify(collect()));
    window.location.href = "assessment-result.html";
  });

  show();
});