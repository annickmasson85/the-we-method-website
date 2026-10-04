const CAL_KEY = "twm-command-calendar-v1";
const TASK_KEY = "twm-weekly-desk-v2";
const DESK_KEY = "twm-owner-command-desk-v1";
const LANG_KEY = "twm-principal-lang";
const OWNER_EMAIL = "annickmasson85@gmail.com";
const TYPES = [
  ["call", "Partnership Call", "Appel partenaire", "#e4bd77"],
  ["meeting", "Team Meeting", "Réunion d'équipe", "#7b5ea7"],
  ["visit", "Implementation Call", "Appel de mise en place", "#3d7ec9"],
  ["delivery", "Interview", "Entrevue", "#d07a3a"],
  ["follow", "Follow Up", "Suivi", "#c45b8a"],
  ["other", "Travel", "Déplacement", "#c44747"]
];
const $ = (id) => document.getElementById(id);
const ui = {
  page: "calendar",
  view: "week",
  anchor: new Date(),
  team: "all",
  type: "all",
  selected: null,
  detailTab: "details",
  query: ""
};
let db = loadCalendar();
let lang = localStorage.getItem(LANG_KEY) === "fr" ? "fr" : "en";

function loadCalendar() {
  const empty = { appointments: [], clients: [], team: [{ id: "owner", name: "Annick Masson", role: "Owner", color: "#c6a15a" }] };
  try {
    const saved = JSON.parse(localStorage.getItem(CAL_KEY) || "");
    if (!saved || !Array.isArray(saved.appointments) || !Array.isArray(saved.clients) || !Array.isArray(saved.team)) return empty;
    if (!saved.team.some((member) => member.id === "owner")) saved.team.unshift(empty.team[0]);
    return saved;
  } catch (error) {
    return empty;
  }
}
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(TASK_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((task) => task && task.id && task.title && task.due) : [];
  } catch (error) {
    return [];
  }
}
function saveTasks(tasks) {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}
function saveCalendar() {
  localStorage.setItem(CAL_KEY, JSON.stringify(db));
  syncDesk();
}
function syncDesk() {
  try {
    const desk = JSON.parse(localStorage.getItem(DESK_KEY) || "null");
    if (!desk || !Array.isArray(desk.tasks)) return;
    desk.appointments = db.appointments
      .filter((item) => item.status !== "cancelled")
      .slice()
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
      .slice(0, 12)
      .map((item) => ({ id: item.id, title: item.title, when: item.date + " " + item.start }));
    localStorage.setItem(DESK_KEY, JSON.stringify(desk));
  } catch (error) {}
}
function t(en, fr) { return lang === "fr" ? fr : en; }
function escapeHtml(value) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => map[char]);
}
function stamp(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}
function parse(value) {
  const [y, m, d] = String(value).split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(date, days) { return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days); }
function startOfWeek(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
  return copy;
}
function minutes(value) {
  const [h, m] = String(value || "0:0").split(":").map(Number);
  return h * 60 + (m || 0);
}
function typeName(id) {
  const found = TYPES.find((item) => item[0] === id);
  return found ? (lang === "fr" ? found[2] : found[1]) : id;
}
function typeColor(id) {
  const found = TYPES.find((item) => item[0] === id);
  return found ? found[3] : "#c6a15a";
}
function initials(value) {
  return String(value || "").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "•";
}
function member(id) { return db.team.find((item) => item.id === id) || db.team[0]; }
function client(id) { return db.clients.find((item) => item.id === id); }
function taskList() { return loadTasks(); }
function visibleAppointments() {
  return db.appointments.filter((item) => {
    if (item.status === "cancelled" && ui.page !== "archive") return false;
    if (ui.team !== "all" && item.assignedId !== ui.team) return false;
    if (ui.type !== "all" && item.type !== ui.type) return false;
    if (ui.query) {
      const blob = [item.title, item.location, item.notes, client(item.clientId)?.name || ""].join(" ").toLowerCase();
      if (!blob.includes(ui.query)) return false;
    }
    return true;
  });
}
function tasksOn(date) {
  const key = stamp(date);
  return taskList().filter((task) => task.due === key).filter((task) => {
    if (!ui.query) return true;
    return (task.title + " " + (task.assignee || "") + " " + (task.notes || "")).toLowerCase().includes(ui.query);
  });
}
function toast(message) {
  const node = $("toast");
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { node.hidden = true; }, 2200);
}
function askConfirm(title, description, accept) {
  return new Promise((resolve) => {
    $("confirm-title").textContent = title;
    $("confirm-description").textContent = description;
    $("confirm-accept").textContent = accept;
    const dialog = $("confirm-dialog");
    const ok = () => finish(true);
    const no = () => finish(false);
    function finish(value) {
      $("confirm-accept").removeEventListener("click", ok);
      $("confirm-cancel").removeEventListener("click", no);
      dialog.close();
      resolve(value);
    }
    $("confirm-accept").addEventListener("click", ok);
    $("confirm-cancel").addEventListener("click", no);
    dialog.showModal();
  });
}

function applyChrome() {
  document.documentElement.lang = lang;
  $("page-title").textContent = {
    calendar: t("Calendar", "Calendrier"),
    "my-tasks": t("My tasks", "Mes tâches"),
    "team-tasks": t("Team tasks", "Tâches d'équipe"),
    clients: t("Clients and leads", "Clients et prospects"),
    files: t("Client files", "Dossiers clients"),
    questionnaires: t("Questionnaires", "Questionnaires"),
    archive: t("Archive", "Archives")
  }[ui.page];
  $("page-subtitle").textContent = t("Manage calls, meetings and tasks for your operation.", "Appels, réunions et tâches, au même endroit.");
  $("today-button").textContent = t("Today", "Aujourd'hui");
  document.querySelector(".calendar-hint").textContent = t("Select a time to add an appointment.", "Choisissez une heure pour ajouter un rendez-vous.");
  document.querySelectorAll("[data-lang]").forEach((button) => button.classList.toggle("is-active", button.dataset.lang === lang));
  const labels = lang === "fr"
    ? ["Calendrier", "Mes tâches", "Tâches d'équipe", "Clients et prospects", "Dossiers clients", "Questionnaires", "Archives"]
    : ["Calendar", "My Tasks", "Team Tasks", "Clients & Leads", "Client Files", "Questionnaires", "Archive"];
  document.querySelectorAll(".navigation .nav-item").forEach((button, index) => {
    const icon = button.querySelector("svg");
    button.textContent = "";
    if (icon) button.appendChild(icon);
    button.append(labels[index] || "");
    button.classList.toggle("active", button.dataset.page === ui.page);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === ui.view);
    const names = { day: t("Day", "Jour"), week: t("Week", "Semaine"), month: t("Month", "Mois"), list: t("List", "Liste") };
    button.textContent = names[button.dataset.view];
  });
  $("view-all-button").textContent = t("View all", "Tout voir");
  document.querySelector(".upcoming-panel h2").innerHTML = t("UPCOMING APPOINTMENTS <span>(Next 7 days)</span>", "PROCHAINS RENDEZ-VOUS <span>(7 jours)</span>");
  document.querySelector(".quick-panel h2").textContent = t("CLIENT QUICK ACCESS", "ACCÈS CLIENT");
  document.querySelector(".quick-add-panel h2").textContent = t("ADD APPOINTMENT", "AJOUTER UN RENDEZ-VOUS");
  $("client-quick-search").placeholder = t("Search client, phone or email…", "Chercher un client, un téléphone ou un courriel…");
  $("global-search").placeholder = t("Search clients, phone numbers, files…", "Chercher un client, un téléphone, un dossier…");
}

function renderFilters() {
  $("team-filters").innerHTML = db.team.map((item) => {
    const on = ui.team === "all" || ui.team === item.id;
    const photo = item.id === "owner" ? '<img src="images/owner-avatar.webp" alt="">' : '<b>' + escapeHtml(initials(item.name)) + "</b>";
    return '<button class="member-row' + (on && ui.team === item.id ? " is-on" : "") + '" type="button" data-team="' + item.id + '">' + photo + '<i class="dot" style="background:' + item.color + '"></i><span>' + escapeHtml(item.name) + '</span><i class="tick"' + (on ? "" : " hidden") + "></i></button>";
  }).join("");
  $("type-filters").innerHTML = TYPES.map((item) => {
    const on = ui.type === "all" || ui.type === item[0];
    return '<button class="type-row' + (ui.type === item[0] ? " is-on" : "") + '" type="button" data-type="' + item[0] + '"><i class="dot" style="background:' + item[3] + '"></i><span>' + escapeHtml(lang === "fr" ? item[2] : item[1]) + '</span><i class="tick"' + (on ? "" : " hidden") + "></i></button>";
  }).join("");
  $("team-filters").querySelectorAll("[data-team]").forEach((button) => button.addEventListener("click", () => { ui.team = ui.team === button.dataset.team ? "all" : button.dataset.team; render(); }));
  $("type-filters").querySelectorAll("[data-type]").forEach((button) => button.addEventListener("click", () => { ui.type = ui.type === button.dataset.type ? "all" : button.dataset.type; render(); }));
  $("quick-add-types").innerHTML = TYPES.map((item) => '<button class="type-tile" type="button" data-quick-type="' + item[0] + '" style="--tile:' + item[3] + '"><span></span>' + escapeHtml(lang === "fr" ? item[2] : item[1]) + "</button>").join("");
  $("quick-add-types").querySelectorAll("[data-quick-type]").forEach((button) => button.addEventListener("click", () => openAppointment(null, { type: button.dataset.quickType })));
}

function eventButton(item) {
  const who = client(item.clientId);
  const color = typeColor(item.type);
  return '<button class="cal-event' + (ui.selected && ui.selected.kind === "appointment" && ui.selected.id === item.id ? " is-selected" : "") + (item.status === "completed" ? " is-done" : "") + '" type="button" data-open-appointment="' + item.id + '" style="--event:' + color + '"><strong>' + escapeHtml(item.title) + "</strong><small>" + escapeHtml(who ? who.name : typeName(item.type)) + "</small></button>";
}

function renderCalendar() {
  const appointments = visibleAppointments();
  const title = $("period-title");
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  if (ui.view === "month") {
    const first = new Date(ui.anchor.getFullYear(), ui.anchor.getMonth(), 1);
    const gridStart = startOfWeek(first);
    title.textContent = first.toLocaleDateString(locale, { month: "long", year: "numeric" });
    const cells = Array.from({ length: 42 }, (_, index) => {
      const day = addDays(gridStart, index);
      const key = stamp(day);
      const items = appointments.filter((item) => item.date === key).slice(0, 3).map((item) => '<button class="mini-event" type="button" data-open-appointment="' + item.id + '">' + item.start + " " + escapeHtml(item.title) + "</button>").join("");
      const tasks = tasksOn(day).slice(0, 2).map((task) => '<button class="mini-event" type="button" data-open-task="' + task.id + '">✓ ' + escapeHtml(task.title) + "</button>").join("");
      const today = stamp(day) === stamp(new Date()) ? " is-today" : "";
      const faded = day.getMonth() === first.getMonth() ? "" : ' style="opacity:.45"';
      return '<div class="month-cell' + today + '"' + faded + ' data-day="' + key + '"><strong>' + day.getDate() + "</strong>" + items + tasks + "</div>";
    }).join("");
    $("calendar-grid").innerHTML = '<div class="month-grid">' + cells + "</div>";
  } else if (ui.view === "list") {
    const start = stamp(startOfWeek(ui.anchor));
    const end = stamp(addDays(startOfWeek(ui.anchor), 27));
    title.textContent = t("Next four weeks", "Quatre prochaines semaines");
    const rows = appointments.filter((item) => item.date >= start && item.date <= end).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    $("calendar-grid").innerHTML = rows.length ? rows.map((item) => '<button class="list-row" type="button" data-open-appointment="' + item.id + '"><strong>' + escapeHtml(item.title) + "</strong><small>" + item.date + " · " + item.start + "–" + item.end + " · " + escapeHtml(member(item.assignedId).name) + "</small></button>").join("") : '<p class="empty">' + t("Nothing in this period.", "Rien sur cette période.") + "</p>";
  } else {
    const days = ui.view === "day" ? [new Date(ui.anchor.getFullYear(), ui.anchor.getMonth(), ui.anchor.getDate())] : Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(ui.anchor), index));
    const end = days[days.length - 1];
    title.textContent = days.length === 1
      ? days[0].toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" })
      : days[0].toLocaleDateString(locale, { month: "short", day: "numeric" }) + " – " + end.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
    const hours = Array.from({ length: 14 }, (_, index) => 7 + index);
    const columns = days.map((day) => {
      const key = stamp(day);
      const head = '<div class="day-head' + (key === stamp(new Date()) ? " is-today" : "") + '"><small>' + day.toLocaleDateString(locale, { weekday: "short" }) + "</small><b>" + day.toLocaleDateString(locale, { month: "short", day: "numeric" }) + "</b></div>";
      const chips = tasksOn(day).map((task) => '<button class="task-chip" type="button" data-open-task="' + task.id + '">' + escapeHtml(task.title) + "</button>").join("");
      const slots = hours.map((hour) => '<button class="hour-slot" type="button" data-slot="' + key + "T" + String(hour).padStart(2, "0") + ':00" aria-label="' + key + " " + hour + '"></button>').join("");
      const events = appointments.filter((item) => item.date === key).map((item) => {
        const top = Math.max(0, (minutes(item.start) - 7 * 60) / 60 * 48);
        const height = Math.max(28, (minutes(item.end) - minutes(item.start)) / 60 * 48);
        return eventButton(item).replace('class="cal-event', 'style="top:' + top + 'px;height:' + height + 'px;--event:' + typeColor(item.type) + '" class="cal-event');
      }).join("");
      return '<div class="day-column" data-day="' + key + '">' + head + chips + '<div style="position:relative">' + slots + events + "</div></div>";
    }).join("");
    const labels = '<div class="hour-rail"><div class="day-head"></div>' + hours.map((hour) => '<div class="hour-label">' + ((hour % 12) || 12) + (hour < 12 ? " AM" : " PM") + "</div>").join("") + "</div>";
    $("calendar-grid").innerHTML = '<div class="' + (days.length === 1 ? "day-board" : "week-board") + '">' + labels + columns + "</div>";
  }
  $("calendar-grid").querySelectorAll("[data-slot]").forEach((button) => button.addEventListener("click", () => {
    const [date, start] = button.dataset.slot.split("T");
    openAppointment(null, { date, start });
  }));
  $("calendar-grid").querySelectorAll("[data-day]").forEach((cell) => {
    if (ui.view !== "month") return;
    cell.addEventListener("dblclick", () => openAppointment(null, { date: cell.dataset.day }));
  });
  bindOpeners($("calendar-grid"));
}

function renderUpcoming() {
  const today = stamp(new Date());
  const limit = stamp(addDays(new Date(), 7));
  const rows = db.appointments.filter((item) => item.status === "scheduled" && item.date >= today && item.date <= limit)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  $("upcoming-list").innerHTML = rows.length ? rows.map((item) => {
    const who = client(item.clientId);
    return '<button class="upcoming-row" type="button" data-open-appointment="' + item.id + '"><i style="background:' + typeColor(item.type) + '"></i><span><small>' + item.date.slice(5) + "<br>" + item.start + "</small></span><strong>" + escapeHtml(item.title) + "<small>" + escapeHtml(who ? who.name : typeName(item.type)) + '</small></strong><b class="who">' + escapeHtml(initials(who ? who.name : member(item.assignedId).name)) + "</b>" + (who && who.phone ? "<em>" + escapeHtml(who.phone) + "</em>" : "") + '<svg><use href="#i-right"/></svg></button>';
  }).join("") : '<p class="empty">' + t("No appointment in the next 7 days.", "Aucun rendez-vous dans les 7 prochains jours.") + "</p>";
  bindOpeners($("upcoming-list"));
}

function clockLabel(value) {
  const total = minutes(value);
  const hour = Math.floor(total / 60);
  const min = String(total % 60).padStart(2, "0");
  return ((hour % 12) || 12) + ":" + min + (hour < 12 ? " AM" : " PM");
}
function renderDetail() {
  const box = $("appointment-detail");
  const tabs = ["details", "notes", "files", "questionnaire"];
  const tabLabels = lang === "fr" ? ["Détails", "Notes", "Fichiers", "Questionnaire"] : ["Details", "Notes", "Files", "Questionnaire"];
  const tabBar = '<div class="detail-tabs">' + tabs.map((id, index) => '<button type="button" data-tab="' + id + '"' + (ui.detailTab === id ? ' class="is-on"' : "") + ">" + tabLabels[index] + "</button>").join("") + "</div>";
  if (!ui.selected) {
    box.innerHTML = '<div class="detail-top"><div><p>' + t("No appointment selected", "Aucun rendez-vous") + "</p><small>" + t("Choose a time on the calendar.", "Choisissez une heure dans le calendrier.") + "</small></div></div>" + tabBar + '<div class="detail-empty"><h2>' + t("Your file opens here", "Le dossier s’ouvre ici") + "</h2><p>" + t("Nothing is invented. Add a real appointment and its client, notes and files stay in this panel.", "Rien n’est inventé. Ajoutez un vrai rendez-vous : le client, les notes et les fichiers restent dans ce panneau.") + "</p></div>";
    box.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => { ui.detailTab = button.dataset.tab; renderDetail(); }));
    return;
  }
  if (ui.selected.kind === "task") {
    const task = taskList().find((item) => item.id === ui.selected.id);
    if (!task) { ui.selected = null; renderDetail(); return; }
    box.innerHTML = '<div class="detail-top"><div><p>' + t("TASK", "TÂCHE") + "</p><small>" + task.due + '</small></div><button class="detail-x" type="button" id="detail-clear" aria-label="Close">×</button></div><h2 class="detail-name">' + escapeHtml(task.title) + '</h2><p class="muted">' + escapeHtml(task.notes || t("No notes.", "Aucune note.")) + '</p><div class="detail-actions"><button class="button" type="button" id="detail-edit">' + t("EDIT", "MODIFIER") + '</button><button class="button button-gold" type="button" id="detail-done">' + t("COMPLETE", "TERMINER") + '</button><button class="button button-danger" type="button" id="detail-delete">' + t("DELETE", "SUPPRIMER") + "</button></div>";
    $("detail-clear").addEventListener("click", () => { ui.selected = null; render(); });
    $("detail-edit").addEventListener("click", () => openTask(task));
    $("detail-done").addEventListener("click", () => {
      saveTasks(taskList().map((item) => item.id === task.id ? Object.assign({}, item, { status: "done" }) : item));
      toast(t("Task completed.", "Tâche terminée."));
      render();
    });
    $("detail-delete").addEventListener("click", async () => {
      if (!await askConfirm(t("Delete this task?", "Supprimer cette tâche ?"), task.title, t("Delete", "Supprimer"))) return;
      saveTasks(taskList().filter((item) => item.id !== task.id));
      ui.selected = null;
      render();
    });
    return;
  }
  const item = db.appointments.find((entry) => entry.id === ui.selected.id);
  if (!item) { ui.selected = null; renderDetail(); return; }
  const who = client(item.clientId);
  const person = member(item.assignedId);
  const when = parse(item.date);
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const dateLine = when.toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  let body = "";
  if (ui.detailTab === "notes") {
    body = "<p>" + escapeHtml(item.notes || t("No notes yet.", "Aucune note pour le moment.")) + "</p>";
  } else if (ui.detailTab === "files") {
    const files = (who && who.files) || [];
    body = files.length ? files.map((file) => "<p>" + escapeHtml(file.name) + "</p>").join("") : '<p class="muted">' + t("No file on this client yet.", "Aucun fichier sur ce client.") + "</p>";
  } else if (ui.detailTab === "questionnaire") {
    const services = (who && who.services) || [];
    body = services.length ? services.map((service) => "<p>" + escapeHtml(service) + "</p>").join("") : '<p class="muted">' + t("No questionnaire until a service is marked on the client.", "Pas de questionnaire tant qu’un service n’est pas coché sur le client.") + "</p>";
  } else {
    body = '<p class="detail-label">' + t("CLIENT INFORMATION", "CLIENT") + "</p>" + (who
      ? '<div class="client-block"><b>' + escapeHtml(initials(who.name)) + "</b><div><strong>" + escapeHtml(who.name) + "</strong><small>" + escapeHtml(who.role || who.contact || "") + "</small><small>" + escapeHtml(who.phone || "") + "</small><small>" + escapeHtml(who.email || "") + "</small><small>" + escapeHtml(who.location || "") + '</small></div></div><button class="button detail-file" type="button" id="open-client-file">' + t("OPEN CLIENT FILE", "OUVRIR LE DOSSIER") + "</button>"
      : '<p class="muted">' + t("No client linked yet.", "Aucun client lié.") + "</p>")
      + '<dl class="detail-facts"><div><dt>' + t("DATE & TIME", "DATE ET HEURE") + "</dt><dd>" + dateLine + "<br>" + clockLabel(item.start) + " – " + clockLabel(item.end) + '</dd></div><div><dt>' + t("TYPE", "TYPE") + '</dt><dd><i class="dot" style="background:' + typeColor(item.type) + '"></i> ' + escapeHtml(typeName(item.type)) + "</dd></div><div><dt>" + t("ASSIGNED TO", "ASSIGNÉ À") + "</dt><dd>" + escapeHtml(person.name) + "</dd></div><div><dt>" + t("STATUS", "STATUT") + "</dt><dd>" + escapeHtml(item.status) + "</dd></div><div><dt>" + t("REMINDER", "RAPPEL") + "</dt><dd>" + (item.reminder === "none" ? t("None", "Aucun") : item.reminder + " min") + '</dd></div></dl><p class="detail-label">' + t("NOTES", "NOTES") + "</p><p>" + escapeHtml(item.notes || t("No notes yet.", "Aucune note.")) + "</p>";
  }
  box.innerHTML = '<div class="detail-top"><div><p>' + dateLine + "</p><small>" + clockLabel(item.start) + " – " + clockLabel(item.end) + '</small></div><button class="detail-x" type="button" id="detail-clear" aria-label="Close">×</button></div><div class="detail-heading"><i style="background:' + typeColor(item.type) + '"></i><div><h2>' + escapeHtml(item.title) + "</h2><p>" + escapeHtml(who ? who.name : typeName(item.type)) + "</p></div></div>" + tabBar + body + '<div class="detail-actions"><button class="button" type="button" id="detail-edit">' + t("EDIT", "MODIFIER") + '</button><button class="button" type="button" id="detail-copy">' + t("DUPLICATE", "DUPLIQUER") + '</button><button class="button button-gold" type="button" id="detail-done">' + t("DONE", "TERMINÉ") + '</button><button class="icon-button" type="button" id="detail-delete" aria-label="Delete"><svg><use href="#i-trash"/></svg></button></div>';
  box.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => { ui.detailTab = button.dataset.tab; renderDetail(); }));
  $("detail-clear").addEventListener("click", () => { ui.selected = null; render(); });
  $("detail-edit").addEventListener("click", () => openAppointment(item));
  $("detail-copy").addEventListener("click", () => {
    const copy = Object.assign({}, item, { id: crypto.randomUUID(), title: item.title });
    db.appointments.push(copy);
    ui.selected = { kind: "appointment", id: copy.id };
    saveCalendar();
    toast(t("Appointment duplicated.", "Rendez-vous dupliqué."));
    render();
  });
  $("detail-done").addEventListener("click", () => { item.status = "completed"; saveCalendar(); toast(t("Appointment completed.", "Rendez-vous terminé.")); render(); });
  $("detail-delete").addEventListener("click", async () => {
    if (!await askConfirm(t("Delete this appointment?", "Supprimer ce rendez-vous ?"), item.title, t("Delete", "Supprimer"))) return;
    db.appointments = db.appointments.filter((entry) => entry.id !== item.id);
    ui.selected = null;
    saveCalendar();
    render();
  });
  const fileButton = $("open-client-file");
  if (fileButton && who) fileButton.addEventListener("click", () => openClientFile(who));
}

function fillPeople(select, selected) {
  select.innerHTML = db.team.map((item) => '<option value="' + item.id + '"' + (item.id === selected ? " selected" : "") + ">" + escapeHtml(item.name) + "</option>").join("");
}
function fillClients(select, selected) {
  const options = ['<option value="">' + t("No client yet", "Pas de client") + "</option>"].concat(db.clients.filter((item) => !item.archived).map((item) => '<option value="' + item.id + '"' + (item.id === selected ? " selected" : "") + ">" + escapeHtml(item.name) + "</option>"));
  select.innerHTML = options.join("");
}
function openAppointment(item, preset) {
  const form = $("appointment-form");
  form.reset();
  $("appointment-error").hidden = true;
  $("overlap-confirm").hidden = true;
  $("appointment-type").innerHTML = TYPES.map((entry) => '<option value="' + entry[0] + '">' + escapeHtml(lang === "fr" ? entry[2] : entry[1]) + "</option>").join("");
  fillClients($("appointment-client"), item ? item.clientId : "");
  fillPeople($("appointment-assigned"), item ? item.assignedId : "owner");
  $("appointment-id").value = item ? item.id : "";
  $("appointment-type").value = item ? item.type : (preset && preset.type) || "call";
  $("appointment-title").value = item ? item.title : "";
  $("appointment-date").value = item ? item.date : (preset && preset.date) || stamp(ui.anchor);
  $("appointment-start").value = item ? item.start : (preset && preset.start) || "09:00";
  const start = $("appointment-start").value;
  $("appointment-end").value = item ? item.end : String(Math.min(20, Number(start.slice(0, 2)) + 1)).padStart(2, "0") + start.slice(2);
  $("appointment-status").value = item ? item.status : "scheduled";
  $("appointment-reminder").value = item ? String(item.reminder || "none") : "30";
  $("appointment-location").value = item ? item.location || "" : "";
  $("appointment-notes").value = item ? item.notes || "" : "";
  $("appointment-modal-title").textContent = item ? t("Edit appointment", "Modifier le rendez-vous") : t("Add appointment", "Ajouter un rendez-vous");
  $("appointment-dialog").showModal();
}
function overlaps(candidate, ignoreId) {
  return db.appointments.some((item) => item.id !== ignoreId && item.status !== "cancelled" && item.assignedId === candidate.assignedId && item.date === candidate.date && minutes(item.start) < minutes(candidate.end) && minutes(candidate.start) < minutes(item.end));
}
function openTask(task, scope) {
  fillPeople($("task-assigned"), "owner");
  const assigned = task && task.scope === "team" ? (db.team.find((item) => item.name === task.assignee) || {}).id : "owner";
  $("task-id").value = task ? task.id : "";
  $("task-title").value = task ? task.title : "";
  $("task-assigned").value = assigned || "owner";
  $("task-date").value = task ? task.due : stamp(ui.anchor);
  $("task-notes").value = task ? task.notes || "" : "";
  if (!task && scope === "team" && db.team[1]) $("task-assigned").value = db.team[1].id;
  $("task-modal-title").textContent = task ? t("Edit task", "Modifier la tâche") : t("Add task", "Ajouter une tâche");
  $("task-dialog").showModal();
}
function openClientEditor(item) {
  $("client-form").reset();
  $("client-id").value = item ? item.id : "";
  $("client-name").value = item ? item.name : "";
  $("client-contact").value = item ? item.contact || "" : "";
  $("client-phone").value = item ? item.phone || "" : "";
  $("client-email").value = item ? item.email || "" : "";
  $("client-role").value = item ? item.role || "" : "";
  $("client-location").value = item ? item.location || "" : "";
  document.querySelectorAll("[name='client-service']").forEach((box) => { box.checked = item ? (item.services || []).includes(box.value) : false; });
  $("client-edit-title").textContent = item ? t("Edit client", "Modifier le client") : t("Add client", "Ajouter un client");
  $("client-edit-dialog").showModal();
}
function openClientFile(item) {
  const appointments = db.appointments.filter((entry) => entry.clientId === item.id).sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));
  const files = item.files || [];
  $("client-modal-title").textContent = item.name;
  $("client-dialog-content").innerHTML = "<p>" + escapeHtml(item.contact || "") + "<br>" + escapeHtml(item.phone || "") + "<br>" + escapeHtml(item.email || "") + "<br>" + escapeHtml(item.location || "") + "</p><h3>" + t("Appointments", "Rendez-vous") + "</h3>" + (appointments.map((entry) => "<p>" + entry.date + " · " + entry.start + " · " + escapeHtml(entry.title) + "</p>").join("") || '<p class="muted">' + t("No appointment yet.", "Pas encore de rendez-vous.") + "</p>") + "<h3>" + t("Notes", "Notes") + '</h3><textarea class="field" id="client-file-notes">' + escapeHtml(item.notes || "") + "</textarea><h3>" + t("Files", "Fichiers") + "</h3>" + files.map((file) => '<p class="file-row">' + escapeHtml(file.name) + "</p>").join("") + "<label>" + t("File name", "Nom du fichier") + '<input class="field" id="client-file-name" maxlength="120"></label><div class="modal-actions"><button class="button" type="button" id="client-add-file">' + t("ADD FILE NAME", "AJOUTER LE NOM") + '</button><button class="button button-gold" type="button" id="client-save-notes">' + t("SAVE NOTES", "ENREGISTRER") + "</button></div>";
  $("client-dialog").showModal();
  $("client-save-notes").addEventListener("click", () => {
    item.notes = $("client-file-notes").value.trim();
    saveCalendar();
    toast(t("Notes saved.", "Notes enregistrées."));
  });
  $("client-add-file").addEventListener("click", () => {
    const name = $("client-file-name").value.trim();
    if (!name) return;
    item.files = (item.files || []).concat({ id: crypto.randomUUID(), name });
    saveCalendar();
    openClientFile(item);
  });
}

function renderDirectory() {
  const directory = $("directory-section");
  const calendarMode = ui.page === "calendar";
  document.querySelector(".app-shell").classList.toggle("directory-mode", !calendarMode);
  $("calendar-section").hidden = !calendarMode;
  $("below-calendar").hidden = !calendarMode;
  $("detail-column").hidden = !calendarMode;
  directory.hidden = calendarMode;
  if (calendarMode) return;
  const add = $("directory-add-button");
  const query = ($("directory-search").value || "").trim().toLowerCase();
  if (ui.page === "my-tasks" || ui.page === "team-tasks") {
    add.querySelector("span").textContent = t("Add task", "Ajouter une tâche");
    const teamPage = ui.page === "team-tasks";
    const rows = taskList().filter((task) => teamPage ? task.scope === "team" : task.scope !== "team").filter((task) => !query || task.title.toLowerCase().includes(query));
    directory.querySelector("#directory-content").innerHTML = rows.length ? rows.map((task) => '<article class="client-card"><strong>' + escapeHtml(task.title) + "</strong><small>" + task.due + " · " + escapeHtml(task.assignee || t("Personal", "Personnelle")) + " · " + escapeHtml(task.status) + '</small><div class="detail-actions"><button class="button" type="button" data-open-task="' + task.id + '">' + t("OPEN", "OUVRIR") + '</button><button class="button" type="button" data-cycle-task="' + task.id + '">' + t("NEXT STATUS", "STATUT SUIVANT") + "</button></div></article>").join("") : '<p class="empty">' + t("Nothing here yet.", "Rien ici pour le moment.") + "</p>";
  } else if (ui.page === "clients" || ui.page === "files") {
    add.querySelector("span").textContent = t("Add client", "Ajouter un client");
    const rows = db.clients.filter((item) => !item.archived && (!query || (item.name + item.phone + item.email).toLowerCase().includes(query)));
    directory.querySelector("#directory-content").innerHTML = rows.length ? rows.map((item) => '<button class="client-card" type="button" data-client="' + item.id + '" data-client-mode="' + ui.page + '"><strong>' + escapeHtml(item.name) + "</strong><small>" + escapeHtml(item.phone || item.email || item.role || "") + "</small></button>").join("") : '<p class="empty">' + t("No client yet.", "Pas encore de client.") + "</p>";
  } else if (ui.page === "questionnaires") {
    add.hidden = true;
    const rows = db.clients.filter((item) => !item.archived && (item.services || []).length);
    directory.querySelector("#directory-content").innerHTML = rows.length ? rows.map((item) => {
      const services = (item.services || []).map((service) => {
        const value = (item.questions || {})[service] || "todo";
        return "<p><strong>" + escapeHtml(service) + "</strong> " + value + "</p>";
      }).join("");
      return '<article class="client-card"><strong>' + escapeHtml(item.name) + "</strong>" + services + "</article>";
    }).join("") : '<p class="empty">' + t("A questionnaire appears here after you mark a purchased service on a client.", "Un questionnaire apparaît ici quand un service acheté est coché sur un client.") + "</p>";
  } else {
    add.hidden = true;
    const rows = db.appointments.filter((item) => item.status === "completed" || item.status === "cancelled");
    const clients = db.clients.filter((item) => item.archived);
    directory.querySelector("#directory-content").innerHTML = "<h3>" + t("Appointments", "Rendez-vous") + "</h3>" + (rows.map((item) => '<button class="list-row" type="button" data-open-appointment="' + item.id + '">' + escapeHtml(item.title) + " · " + item.status + "</button>").join("") || '<p class="empty">' + t("No archived appointment.", "Aucun rendez-vous archivé.") + "</p>") + "<h3>" + t("Clients", "Clients") + "</h3>" + (clients.map((item) => "<p>" + escapeHtml(item.name) + "</p>").join("") || '<p class="empty">' + t("No archived client.", "Aucun client archivé.") + "</p>");
  }
  if (ui.page !== "questionnaires" && ui.page !== "archive") add.hidden = false;
  bindOpeners(directory);
  directory.querySelectorAll("[data-cycle-task]").forEach((button) => button.addEventListener("click", () => {
    const order = { todo: "progress", progress: "done", done: "todo" };
    const tasks = taskList().map((task) => task.id === button.dataset.cycleTask ? Object.assign({}, task, { status: order[task.status] || "todo" }) : task);
    saveTasks(tasks);
    render();
  }));
  directory.querySelectorAll("[data-client]").forEach((button) => button.addEventListener("click", () => {
    const item = client(button.dataset.client);
    if (!item) return;
    if (button.dataset.clientMode === "files") openClientFile(item);
    else openClientEditor(item);
  }));
}

function bindOpeners(root) {
  root.querySelectorAll("[data-open-appointment]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    ui.selected = { kind: "appointment", id: button.dataset.openAppointment };
    if (ui.page !== "calendar") ui.page = "calendar";
    render();
  }));
  root.querySelectorAll("[data-open-task]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    ui.selected = { kind: "task", id: button.dataset.openTask };
    ui.page = "calendar";
    render();
  }));
}

function renderSearch(listId, query) {
  const node = $(listId);
  if (!query) { node.hidden = true; node.innerHTML = ""; return; }
  const needle = query.toLowerCase();
  const clients = db.clients.filter((item) => (item.name + " " + item.phone + " " + item.email).toLowerCase().includes(needle)).slice(0, 5);
  const appointments = db.appointments.filter((item) => (item.title + " " + item.notes).toLowerCase().includes(needle)).slice(0, 5);
  const tasks = taskList().filter((item) => item.title.toLowerCase().includes(needle)).slice(0, 5);
  const html = clients.map((item) => '<button type="button" data-jump-client="' + item.id + '">' + escapeHtml(item.name) + "</button>").join("")
    + appointments.map((item) => '<button type="button" data-open-appointment="' + item.id + '">' + escapeHtml(item.title) + "</button>").join("")
    + tasks.map((item) => '<button type="button" data-open-task="' + item.id + '">' + escapeHtml(item.title) + "</button>").join("");
  node.innerHTML = html || '<p class="empty">' + t("No match.", "Aucun résultat.") + "</p>";
  node.hidden = false;
  bindOpeners(node);
  node.querySelectorAll("[data-jump-client]").forEach((button) => button.addEventListener("click", () => {
    ui.page = "files";
    node.hidden = true;
    render();
    const item = client(button.dataset.jumpClient);
    if (item) openClientFile(item);
  }));
}

function render() {
  applyChrome();
  renderFilters();
  renderCalendar();
  renderUpcoming();
  renderDetail();
  renderDirectory();
}

function exportData() {
  const blob = new Blob([JSON.stringify({ calendar: db, tasks: taskList() }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "we-method-command-calendar.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderTeamManager() {
  $("team-management-list").innerHTML = db.team.map((item) => '<div class="team-row"><i class="dot" style="background:' + item.color + '"></i> <strong>' + escapeHtml(item.name) + "</strong> <small>" + escapeHtml(item.role || "") + "</small>" + (item.id === "owner" ? "" : ' <button class="button" type="button" data-edit-member="' + item.id + '">' + t("EDIT", "MODIFIER") + "</button>") + "</div>").join("");
  $("team-management-list").querySelectorAll("[data-edit-member]").forEach((button) => button.addEventListener("click", () => {
    const item = db.team.find((member) => member.id === button.dataset.editMember);
    $("team-id").value = item.id;
    $("team-name").value = item.name;
    $("team-role").value = item.role || "";
    $("team-color").value = item.color;
    $("team-save-button").textContent = t("Save member", "Enregistrer");
  }));
  $("team-dialog").showModal();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.supabaseClient) {
    const session = await window.supabaseClient.auth.getSession();
    if (!session.data || !session.data.session) { window.location.href = "signin.html"; return; }
    const userRes = await window.supabaseClient.auth.getUser();
    const user = (userRes.data && userRes.data.user) || session.data.session.user || {};
    const meta = user.user_metadata || {};
    const email = String(user.email || "").toLowerCase();
    if (meta.role !== "owner" && email !== OWNER_EMAIL) { window.location.href = "owners-suite.html"; return; }
    const full = [meta.first_name, meta.last_name].filter(Boolean).join(" ");
    if (full) {
      db.team[0].name = full;
      const name = document.getElementById("profile-name");
      if (name) name.textContent = full;
    }
    if (meta.avatar_url) {
      const photo = document.getElementById("header-photo");
      if (photo) photo.src = meta.avatar_url;
    }
  }
  document.querySelector(".brand").setAttribute("href", "principal-desk.html");
  render();
  document.querySelectorAll(".nav-item, .quick-link").forEach((button) => button.addEventListener("click", () => {
    if (!button.dataset.page) return;
    ui.page = button.dataset.page;
    document.getElementById("sidebar").classList.remove("is-open");
    render();
  }));
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => { ui.view = button.dataset.view; render(); }));
  $("today-button").addEventListener("click", () => { ui.anchor = new Date(); render(); });
  $("previous-button").addEventListener("click", () => {
    ui.anchor = ui.view === "month" ? new Date(ui.anchor.getFullYear(), ui.anchor.getMonth() - 1, 1) : addDays(ui.anchor, ui.view === "day" ? -1 : -7);
    render();
  });
  $("next-button").addEventListener("click", () => {
    ui.anchor = ui.view === "month" ? new Date(ui.anchor.getFullYear(), ui.anchor.getMonth() + 1, 1) : addDays(ui.anchor, ui.view === "day" ? 1 : 7);
    render();
  });
  $("view-all-button").addEventListener("click", () => { ui.view = "list"; render(); });
  $("calendar-search-button").addEventListener("click", () => $("global-search").focus());
  $("global-search").addEventListener("input", (event) => { ui.query = event.target.value.trim().toLowerCase(); renderSearch("global-results", event.target.value.trim()); renderCalendar(); });
  $("client-quick-search").addEventListener("input", (event) => renderSearch("quick-client-results", event.target.value.trim()));
  $("directory-search").addEventListener("input", () => renderDirectory());
  $("directory-add-button").addEventListener("click", () => {
    if (ui.page === "my-tasks") openTask(null, "personal");
    else if (ui.page === "team-tasks") openTask(null, "team");
    else openClientEditor(null);
  });
  document.querySelectorAll("[data-action='new-appointment']").forEach((button) => button.addEventListener("click", () => openAppointment(null)));
  document.querySelectorAll("[data-action='manage-team']").forEach((button) => button.addEventListener("click", () => { closeMenu(); renderTeamManager(); }));
  document.querySelector("[data-action='export']").addEventListener("click", () => { closeMenu(); exportData(); });
  document.querySelector("[data-action='client-history']").addEventListener("click", () => { ui.page = "archive"; render(); });
  $("new-client-from-appointment").addEventListener("click", () => openClientEditor(null));
  $("appointment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const candidate = {
      id: $("appointment-id").value || crypto.randomUUID(),
      type: $("appointment-type").value,
      title: $("appointment-title").value.trim(),
      clientId: $("appointment-client").value,
      date: $("appointment-date").value,
      assignedId: $("appointment-assigned").value,
      start: $("appointment-start").value,
      end: $("appointment-end").value,
      status: $("appointment-status").value,
      reminder: $("appointment-reminder").value,
      location: $("appointment-location").value.trim(),
      notes: $("appointment-notes").value.trim()
    };
    const error = $("appointment-error");
    if (!candidate.title || minutes(candidate.end) <= minutes(candidate.start)) {
      error.textContent = t("Add a title and an end time after the start.", "Ajoutez un titre et une heure de fin après le début.");
      error.hidden = false;
      return;
    }
    if (overlaps(candidate, $("appointment-id").value) && !$("allow-overlap").checked) {
      error.textContent = t("This person already has something at that time.", "Cette personne a déjà quelque chose à cette heure.");
      error.hidden = false;
      $("overlap-confirm").hidden = false;
      return;
    }
    db.appointments = $("appointment-id").value ? db.appointments.map((item) => item.id === candidate.id ? candidate : item) : db.appointments.concat(candidate);
    ui.selected = { kind: "appointment", id: candidate.id };
    ui.anchor = parse(candidate.date);
    saveCalendar();
    $("appointment-dialog").close();
    toast(t("Appointment saved.", "Rendez-vous enregistré."));
    render();
  });
  $("client-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const id = $("client-id").value || crypto.randomUUID();
    const existing = client(id) || { files: [], notes: "", questions: {}, archived: false };
    const next = Object.assign(existing, {
      id,
      name: $("client-name").value.trim(),
      contact: $("client-contact").value.trim(),
      phone: $("client-phone").value.trim(),
      email: $("client-email").value.trim(),
      role: $("client-role").value.trim(),
      location: $("client-location").value.trim(),
      services: Array.from(document.querySelectorAll("[name='client-service']:checked")).map((box) => box.value)
    });
    db.clients = client(id) ? db.clients.map((item) => item.id === id ? next : item) : db.clients.concat(next);
    saveCalendar();
    $("client-edit-dialog").close();
    fillClients($("appointment-client"), id);
    toast(t("Client saved.", "Client enregistré."));
    render();
  });
  $("team-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const id = $("team-id").value || crypto.randomUUID();
    const next = { id, name: $("team-name").value.trim(), role: $("team-role").value.trim(), color: $("team-color").value };
    if (id === "owner") db.team[0] = Object.assign(db.team[0], next, { id: "owner" });
    else db.team = db.team.some((item) => item.id === id) ? db.team.map((item) => item.id === id ? next : item) : db.team.concat(next);
    $("team-id").value = "";
    event.currentTarget.reset();
    saveCalendar();
    renderTeamManager();
    render();
  });
  $("task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const assigned = member($("task-assigned").value);
    const personal = assigned.id === "owner";
    const next = {
      id: $("task-id").value || crypto.randomUUID(),
      scope: personal ? "personal" : "team",
      title: $("task-title").value.trim(),
      assignee: personal ? "" : assigned.name,
      priority: "medium",
      category: "planning",
      due: $("task-date").value,
      status: "todo",
      notes: $("task-notes").value.trim()
    };
    const current = taskList();
    const tasks = $("task-id").value ? current.map((task) => task.id === next.id ? Object.assign(task, next, { status: task.status }) : task) : [next].concat(current);
    saveTasks(tasks);
    ui.selected = { kind: "task", id: next.id };
    ui.anchor = parse(next.due);
    $("task-dialog").close();
    toast(t("Task saved to the weekly desk.", "Tâche enregistrée dans le bureau de la semaine."));
    render();
  });
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  const menu = document.getElementById("main-menu");
  const backdrop = document.getElementById("menu-backdrop");
  function closeMenu() {
    menu.classList.remove("is-open");
    backdrop.hidden = true;
    $("menu-button").setAttribute("aria-expanded", "false");
  }
  function openMenu() {
    menu.classList.add("is-open");
    backdrop.hidden = false;
    $("menu-button").setAttribute("aria-expanded", "true");
  }
  $("menu-button").addEventListener("click", () => menu.classList.contains("is-open") ? closeMenu() : openMenu());
  $("menu-close").addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => {
    lang = button.dataset.lang === "fr" ? "fr" : "en";
    localStorage.setItem(LANG_KEY, lang);
    render();
  }));
  const signout = document.getElementById("calendar-signout");
  if (signout) signout.addEventListener("click", async () => {
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
});