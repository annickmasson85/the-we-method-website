const STORAGE_KEY = "twm-owner-command-desk-v1";
const OWNER_EMAIL = "annickmasson85@gmail.com";
const LANG_KEY = "twm-principal-lang";

const I18N = {
  en: {
    masthead: "OWNER COMMAND DESK",
    ownerProfile: "OWNER PROFILE",
    welcomeLine: "WELCOME BACK",
    welcomeNote: "Your week, your books, your team\nand your documents are ready.",
    motto: "LEAD WITH CLARITY. OPERATE WITH INTENTION.",
    thisWeek: "THIS WEEK",
    privateAccess: "YOUR PRIVATE ACCESS",
    tasksTitle: "THIS WEEK’S TASKS",
    open: "open",
    completed: "completed",
    openTasks: "OPEN TASKS",
    appointmentsTitle: "APPOINTMENTS",
    viewCalendar: "VIEW CALENDAR",
    docsTitle: "DOCUMENTS PENDING",
    awaiting: "awaiting review",
    reviewFiles: "REVIEW FILES",
    workingBooks: "THE WORKING BOOKS",
    quickTools: "QUICK TOOLS",
    calendar: "CALENDAR",
    teamDesk: "TEAM DESK",
    documents: "DOCUMENTS",
    messages: "MESSAGES",
    reports: "REPORTS",
    atAGlance: "AT A GLANCE",
    tasksOpen: "TASKS\nOPEN",
    appointmentsWord: "APPOINTMENTS",
    docsPending: "DOCS PENDING",
    weekComplete: "WEEK COMPLETE",
    menuTitle: "OWNER DESK",
    menuTasks: "This week’s tasks",
    menuAppt: "Appointments",
    menuDocs: "Documents pending",
    menuUpdates: "Updates",
    menuTeam: "Team desk",
    menuMessages: "Messages",
    menuReports: "Reports",
    menuPreview: "Client preview",
    menuProfile: "Owner profile",
    logout: "Log out"
  },
  fr: {
    masthead: "BUREAU DE COMMANDE",
    ownerProfile: "PROFIL PRINCIPALE",
    welcomeLine: "BON RETOUR",
    welcomeNote: "Votre semaine, vos livres, votre équipe\net vos documents sont prêts.",
    motto: "DIRIGER AVEC CLAIRTÉ. OPÉRER AVEC INTENTION.",
    thisWeek: "CETTE SEMAINE",
    privateAccess: "VOTRE ACCÈS PRIVÉ",
    tasksTitle: "TÂCHES DE LA SEMAINE",
    open: "ouvertes",
    completed: "terminées",
    openTasks: "OUVRIR",
    appointmentsTitle: "RENDEZ-VOUS",
    viewCalendar: "VOIR LE CALENDRIER",
    docsTitle: "DOCUMENTS EN ATTENTE",
    awaiting: "à relire",
    reviewFiles: "RELIRE",
    workingBooks: "LES LIVRES DE TRAVAIL",
    quickTools: "OUTILS RAPIDES",
    calendar: "CALENDRIER",
    teamDesk: "BUREAU ÉQUIPE",
    documents: "DOCUMENTS",
    messages: "MESSAGES",
    reports: "RAPPORTS",
    atAGlance: "EN UN REGARD",
    tasksOpen: "TÂCHES\nOUVERTES",
    appointmentsWord: "RENDEZ-VOUS",
    docsPending: "DOCS EN ATTENTE",
    weekComplete: "SEMAINE FAITE",
    menuTitle: "BUREAU OWNER",
    menuTasks: "Tâches de la semaine",
    menuAppt: "Rendez-vous",
    menuDocs: "Documents en attente",
    menuUpdates: "Mises à jour",
    menuTeam: "Bureau équipe",
    menuMessages: "Messages",
    menuReports: "Rapports",
    menuPreview: "Aperçu client",
    menuProfile: "Profil",
    logout: "Déconnexion"
  }
};

const initialState = {
  ownerName: "Owner",
  weekly: { completed: 17, total: 25 },
  tasks: [
    { id: 1, title: "Review this week's priorities", done: false },
    { id: 2, title: "Approve the updated rental procedure", done: false },
    { id: 3, title: "Prepare the fleet review", done: false },
    { id: 4, title: "Follow up with the operations team", done: false },
    { id: 5, title: "Review pending documents", done: false },
    { id: 6, title: "Update the maintenance checklist", done: false },
    { id: 7, title: "Plan next week's appointments", done: false },
    { id: 8, title: "Confirm this week's schedule", done: true },
    { id: 9, title: "Publish the owner update", done: true },
    { id: 10, title: "Complete the desk review", done: true }
  ],
  appointments: [
    { id: 1, when: "Tue 10:00", title: "Fleet review" },
    { id: 2, when: "Thu 13:30", title: "Operations check-in" },
    { id: 3, when: "Fri 09:00", title: "Weekly planning" }
  ],
  documents: [
    { id: 1, title: "Fleet inspection report", type: "Fleet", reviewed: false },
    { id: 2, title: "Updated rental agreement", type: "Documents", reviewed: false },
    { id: 3, title: "Team training checklist", type: "Operations", reviewed: false },
    { id: 4, title: "Maintenance log", type: "Fleet", reviewed: false }
  ]
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.tasks)) return saved;
  } catch (_) {}
  return structuredClone(initialState);
}

let state = loadState();
let activePanel = "";
let lang = localStorage.getItem(LANG_KEY) === "fr" ? "fr" : "en";

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.innerHTML = t(node.getAttribute("data-i18n")).replace(/\n/g, "<br>");
  });
  const welcome = document.querySelector(".welcome h1");
  if (welcome) {
    const first = document.querySelector("[data-owner-first]");
    const name = first ? first.textContent : "OWNER";
    welcome.innerHTML = t("welcomeLine") + "<br><span data-owner-first>" + name + "</span>";
  }
  document.querySelectorAll(".desk-lang button").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-lang") === lang);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function setAll(selector, value) {
  document.querySelectorAll(selector).forEach((element) => { element.textContent = value; });
}

function counts() {
  const open = state.tasks.filter((task) => !task.done).length;
  const completed = state.tasks.length - open;
  const pending = state.documents.filter((doc) => !doc.reviewed).length;
  const percent = Math.round(Math.min(100, Math.max(0, state.weekly.completed / Math.max(1, state.weekly.total) * 100)));
  return { open, completed, pending, percent };
}

function renderDashboard() {
  const { open, completed, pending, percent } = counts();
  const firstName = (state.ownerName || "Owner").trim().split(/\s+/)[0] || "OWNER";
  setAll("[data-owner-first]", firstName.toLocaleUpperCase("en-US"));
  setAll("[data-owner-full]", state.ownerName);
  setAll("[data-task-open]", open);
  setAll("[data-task-completed]", completed);
  setAll("[data-docs-pending]", pending);
  setAll("[data-appointment-count]", state.appointments.length);
  setAll("[data-week-percent]", percent + "%");
  setAll("[data-next-appointment]", state.appointments[0] ? state.appointments[0].when + " · " + state.appointments[0].title : "—");
  const ring = document.querySelector(".progress-ring");
  if (ring) ring.style.setProperty("--progress", percent + "%");
  applyLang();
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  renderDashboard();
  if (dialog.open) renderPanel(activePanel);
}

const dialog = document.getElementById("desk-dialog");
const dialogTitle = document.getElementById("dialog-title");
const dialogBody = document.getElementById("dialog-body");
const sideMenu = document.getElementById("main-menu");
const backdrop = document.getElementById("menu-backdrop");
const menuToggle = document.getElementById("menu-toggle");

function openMenu() {
  backdrop.hidden = false;
  sideMenu.inert = false;
  sideMenu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  sideMenu.classList.remove("is-open");
  sideMenu.inert = true;
  backdrop.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
}
function openPanel(name) {
  closeMenu();
  activePanel = name;
  renderPanel(name);
  if (dialog && !dialog.open) dialog.showModal();
}

function renderPanel(name) {
  const { open, completed, pending, percent } = counts();
  const titles = {
    tasks: t("tasksTitle"),
    appointments: t("appointmentsTitle"),
    documents: t("docsTitle"),
    team: t("teamDesk"),
    messages: t("messages"),
    reports: t("atAGlance"),
    profile: t("menuProfile")
  };
  dialogTitle.textContent = titles[name] || t("masthead");

  if (name === "tasks" || name === "team") {
    dialogBody.innerHTML = `<p class="panel-intro">${open} ${t("open")} · ${completed} ${t("completed")}</p>
      <ul class="panel-list">${state.tasks.map((task) => `<li class="panel-row ${task.done ? "is-done" : ""}"><div><strong>${escapeHtml(task.title)}</strong><small>${task.done ? "DONE" : "TO DO"}</small></div><button type="button" class="row-action" data-toggle-task="${task.id}">${task.done ? "UNDO" : "COMPLETE"}</button></li>`).join("")}</ul>
      <form class="panel-form" data-form="task"><label for="new-task">ADD</label><input id="new-task" name="title" maxlength="100" required><button class="gold-button" type="submit">ADD</button></form>`;
  } else if (name === "appointments") {
    dialogBody.innerHTML = `<ul class="panel-list">${state.appointments.map((item) => `<li class="panel-row"><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.when)}</small></div><button type="button" class="row-action" data-remove-appointment="${item.id}">REMOVE</button></li>`).join("")}</ul>
      <form class="panel-form" data-form="appointment"><input name="title" maxlength="100" placeholder="Title" required><input name="date" type="date" required><input name="time" type="time" required><button class="gold-button" type="submit">ADD</button></form>`;
  } else if (name === "documents") {
    dialogBody.innerHTML = `<p class="panel-intro">${pending} ${t("awaiting")}</p>
      <ul class="panel-list">${state.documents.map((doc) => `<li class="panel-row ${doc.reviewed ? "is-done" : ""}"><div><strong>${escapeHtml(doc.title)}</strong><small>${escapeHtml(doc.type)}</small></div><button type="button" class="row-action" data-toggle-document="${doc.id}">${doc.reviewed ? "UNDO" : "REVIEW"}</button></li>`).join("")}</ul>`;
  } else if (name === "messages") {
    dialogBody.innerHTML = `<p class="panel-intro">${lang === "fr" ? "La messagerie d’équipe sera branchée ici." : "Team messages will be connected here."}</p>`;
  } else if (name === "reports") {
    dialogBody.innerHTML = `<div class="metric-stack"><div class="metric-box"><strong>${open}</strong><span>${t("tasksOpen").replace("<br>", " ")}</span></div><div class="metric-box"><strong>${state.appointments.length}</strong><span>${t("appointmentsWord")}</span></div><div class="metric-box"><strong>${pending}</strong><span>${t("docsPending")}</span></div><div class="metric-box"><strong>${percent}%</strong><span>${t("weekComplete")}</span></div></div>`;
  } else {
    dialogBody.innerHTML = `<p class="panel-intro">${t("masthead")}</p>`;
  }
}

document.addEventListener("click", (event) => {
  const panelButton = event.target.closest("[data-panel]");
  if (panelButton) openPanel(panelButton.dataset.panel);
  const taskButton = event.target.closest("[data-toggle-task]");
  if (taskButton) {
    const task = state.tasks.find((item) => item.id === Number(taskButton.dataset.toggleTask));
    if (task) { task.done = !task.done; state.weekly.completed = Math.max(0, state.weekly.completed + (task.done ? 1 : -1)); saveState(); }
  }
  const docButton = event.target.closest("[data-toggle-document]");
  if (docButton) {
    const doc = state.documents.find((item) => item.id === Number(docButton.dataset.toggleDocument));
    if (doc) { doc.reviewed = !doc.reviewed; saveState(); }
  }
  const appointmentButton = event.target.closest("[data-remove-appointment]");
  if (appointmentButton) {
    state.appointments = state.appointments.filter((item) => item.id !== Number(appointmentButton.dataset.removeAppointment));
    saveState();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const title = String(data.get("title") || "").trim();
  const id = Date.now();
  if (form.dataset.form === "task" && title) state.tasks.unshift({ id, title, done: false });
  if (form.dataset.form === "appointment" && title) {
    const date = String(data.get("date") || "");
    const time = String(data.get("time") || "");
    if (date && time) {
      const day = new Date(date + "T" + time + ":00");
      const when = new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(day);
      state.appointments.unshift({ id, title, when });
    }
  }
  saveState();
});

async function guardOwner() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    window.location.href = "signin.html";
    return false;
  }
  const session = await supabase.auth.getSession();
  if (!session.data || !session.data.session) {
    window.location.href = "signin.html";
    return false;
  }
  const userRes = await supabase.auth.getUser();
  const user = (userRes.data && userRes.data.user) || session.data.session.user || {};
  const meta = user.user_metadata || {};
  const email = String(user.email || "").toLowerCase();
  const isOwner = meta.role === "owner" || email === OWNER_EMAIL;
  if (!isOwner) {
    window.location.href = "owners-suite.html";
    return false;
  }
  const fullName = [meta.first_name, meta.last_name].filter(Boolean).join(" ");
  if (fullName) state.ownerName = fullName;
  if (meta.avatar_url) {
    const photo = document.getElementById("header-photo");
    if (photo) photo.src = meta.avatar_url;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", async () => {
  const ok = await guardOwner();
  if (!ok) return;
  menuToggle.addEventListener("click", () => sideMenu.classList.contains("is-open") ? closeMenu() : openMenu());
  document.getElementById("menu-close").addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  document.querySelectorAll(".desk-lang button").forEach((button) => {
    button.addEventListener("click", () => {
      lang = button.getAttribute("data-lang") === "fr" ? "fr" : "en";
      localStorage.setItem(LANG_KEY, lang);
      renderDashboard();
    });
  });
  document.getElementById("desk-signout").addEventListener("click", async () => {
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
  renderDashboard();
});