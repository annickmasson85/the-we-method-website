const OWNER_EMAIL = "annickmasson85@gmail.com";
const LANG_KEY = "twm-principal-lang";
const I18N = {
  en: {
    pageTitle: "OWNER PROFILE",
    ownerProfile: "OWNER PROFILE",
    kicker: "HOUSE ACCESS",
    heading: "Owner record",
    lead: "This file stays inside the owner desk. It does not open the client suite.",
    roleLabel: "FOUNDER ◆ OWNER",
    backDesk: "RETURN TO DESK",
    logout: "LOG OUT",
    fName: "NAME",
    fRole: "ACCESS",
    fEmail: "EMAIL",
    fPhone: "PHONE",
    fCompany: "HOUSE",
    fSince: "SINCE",
    accessValue: "Owner only"
  },
  fr: {
    pageTitle: "PROFIL PRINCIPALE",
    ownerProfile: "PROFIL PRINCIPALE",
    kicker: "ACCÈS MAISON",
    heading: "Dossier owner",
    lead: "Ce dossier reste dans le bureau. Il n’ouvre pas l’espace client.",
    roleLabel: "FONDATRICE ◆ OWNER",
    backDesk: "RETOUR AU BUREAU",
    logout: "DÉCONNEXION",
    fName: "NOM",
    fRole: "ACCÈS",
    fEmail: "COURRIEL",
    fPhone: "TÉLÉPHONE",
    fCompany: "MAISON",
    fSince: "DEPUIS",
    accessValue: "Owner seulement"
  }
};

let lang = localStorage.getItem(LANG_KEY) === "fr" ? "fr" : "en";
function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.getAttribute("data-i18n"));
  });
  document.querySelectorAll(".desk-lang button").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-lang") === lang);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  applyLang();
  document.querySelectorAll(".desk-lang button").forEach((button) => {
    button.addEventListener("click", () => {
      lang = button.getAttribute("data-lang") === "fr" ? "fr" : "en";
      localStorage.setItem(LANG_KEY, lang);
      applyLang();
    });
  });

  const supabase = window.supabaseClient;
  if (!supabase) {
    window.location.href = "signin.html";
    return;
  }
  const session = await supabase.auth.getSession();
  if (!session.data || !session.data.session) {
    window.location.href = "signin.html";
    return;
  }
  const userRes = await supabase.auth.getUser();
  const user = (userRes.data && userRes.data.user) || session.data.session.user || {};
  const meta = user.user_metadata || {};
  const email = String(user.email || "").toLowerCase();
  const isOwner = meta.role === "owner" || email === OWNER_EMAIL;
  if (!isOwner) {
    window.location.href = "owners-suite.html";
    return;
  }

  const fullName = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Annick Masson";
  document.querySelectorAll("[data-owner-full]").forEach((node) => { node.textContent = fullName; });
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value || "—"; };
  set("full-name", fullName);
  set("email", user.email);
  set("profile-email", user.email);
  set("phone", meta.phone);
  set("company", meta.company_name || "The We Method");
  set("member-since", new Date(user.created_at || Date.now()).getFullYear());
  if (meta.avatar_url) {
    ["header-photo", "profile-photo"].forEach((id) => {
      const img = document.getElementById(id);
      if (img) img.src = meta.avatar_url;
    });
  }

  document.getElementById("owner-signout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });
});