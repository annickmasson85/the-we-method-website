const CAL_KEY = "twm-command-calendar-v1";
const TASK_KEY = "twm-weekly-desk-v2";
const DESK_KEY = "twm-owner-command-desk-v1";
const LANG_KEY = "twm-principal-lang";
const OWNER_EMAIL = "annickmasson85@gmail.com";
const TYPES = [
  ["call", "Call", "Appel"],
  ["meeting", "Meeting", "Réunion"],
  ["visit", "On-site visit", "Visite"],
  ["delivery", "Delivery", "Livraison"],
  ["follow", "Follow-up", "Suivi"],
  ["other", "Other", "Autre"]
];
const $ = (id) => document.getElementById(id);
const ui = {
  page: "calendar",
  view: "week",
  anchor: new Date(),
  team: "all",
  type: "all",
  selected: null,
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
  const map = { "&": "&" + "amp;", "<": "&" + "lt;", ">": "&" + "gt;", '"': "&" + "quot;", "'": "&" + "#39;" };
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
  $("page-subtitle").textContent = t("Calls, meetings and tasks, in one place.", "Appels, réunions et tâches, au même endroit.");
  $("today-button").textContent = t("Today", "Aujourd'hui");
  document.querySelector(".calendar-hint").textContent = t("Select a time to add an appointment.", "Choisissez une heure pour ajouter un rendez-vous.");
  document.querySelector(".language-badge").textContent = lang === "fr" ? "FR" : "EN";
  document.querySelector(".language-badge").classList.toggle("is-fr", lang === "fr");
  document.querySelector(".profile-menu p").textContent = t("Saved in this browser. Nothing is added until you write it.", "Enregistré dans ce navigateur. Rien n'est ajouté tant que vous ne l'écrivez pas.");
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
  const teamButtons = ['<button class="filter-chip' + (ui.team === "all" ? " active" : "") + '" type="button" data-team="all">' + t("Everyone", "Tout le monde") + "</button>"]
    .concat(db.team.map((item) => '<button class="filter-chip' + (ui.team === item.id ? " active" : "") + '" type="button" data-team="' + item.id + '"><i class="dot" style="background:' + item.color + '"></i>' + escapeHtml(item.name) + "</button>"));
  $("team-filters").innerHTML = teamButtons.join("");
  $("type-filters").innerHTML = ['<button class="filter-chip' + (ui.type === "all" ? " active" : "") + '" type="button" data-type="all">' + t("All types", "Tous les types") + "</button>"]
    .concat(TYPES.map((item) => '<button class="filter-chip' + (ui.type === item[0] ? " active" : "") + '" type="button" data-type="' + item[0] + '">' + escapeHtml(lang === "fr" ? item[2] : item[1]) + "</button>")).join("");
  $("team-filters").querySelectorAll("[data-team]").forEach((button) => button.addEventListener("click", () => { ui.team = button.dataset.team; render(); }));
  $("type-filters").querySelectorAll("[data-type]").forEach((button) => button.addEventListener("click", () => { ui.type = button.dataset.type; render(); }));
  $("quick-add-types").innerHTML = TYPES.map((item) => '<button class="button" type="button" data-quick-type="' + item[0] + '">' + escapeHtml(lang === "fr" ? item[2] : item[1]) + "</button>").join("");
  $("quick-add-types").querySelectorAll("[data-quick-type]").forEach((button) => button.addEventListener("click", () => openAppointment(null, { type: button.dataset.quickType })));
}

function eventButton(item) {
  const person = member(item.assignedId);
  const who = client(item.clientId);
  return '<button class="cal-event' + (ui.selected && ui.selected.kind === "appointment" && ui.selected.id === item.id ? " is-selected" : "") + (item.status === "completed" ? " is-done" : "") + '" type="button" data-open-appointment="' + item.id + '" style="border-left-color:' + person.color + '"><strong>' + escapeHtml(item.title) + "</strong><small>" + item.start + " · " + escapeHtml(who ? who.name : typeName(item.type)) + "</small></button>";
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
      const faded = day.getMonth() === first.getMonth() ? "" : " style=\"opacity:.45\"";
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
      const head = '<div class="day-head' + (key === stamp(new Date()) ? " is-today" : "") + '">' + day.toLocaleDateString(locale, { weekday: "short", day: "numeric" }).toUpperCase() + "</div>";
      const chips = tasksOn(day).map((task) => '<button class="task-chip" type="button" data-open-task="' + task.id + '">' + escapeHtml(task.title) + "</button>").join("");
      const slots = hours.map((hour) => '<button class="hour-slot" type="button" data-slot="' + key + "T" + String(hour).padStart(2, "0") + ':00" aria-label="' + key + " " + hour + '"></button>').join("");
      const events = appointments.filter((item) => item.date === key).map((item) => {
        const top = Math.max(0, (minutes(item.start) - 7 * 60) / 60 * 48);
        const height = Math.max(28, (minutes(item.end) - minutes(item.start)) / 60 * 48);
        return eventButton(item).replace('class="cal-event', 'style="top:' + top + 'px;height:' + height + 'px;border-left-color:' + member(item.assignedId).color + '" class="cal-event');
      }).join("");
      return '<div class="day-column" data-day="' + key + '">' + head + chips + '<div style="position:relative">' + slots + events + "</div></div>";
    }).join("");
    const labels = '<div><div class="day-head"></div>' + hours.map((hour) => '<div class="hour-label">' + String(hour).padStart(2, "0") + ":00</div>").join("") + "</div>";
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
  $("upcoming-list").innerHTML = rows.length ? rows.map((item) => '<button class="upcoming-row" type="button" data-open-appointment="' + item.id + '"><span>' + item.date.slice(5) + " · " + item.start + "</span><strong>" + escapeHtml(item.title) + "</strong></button>").join("") : '<p class="empty">' + t("No appointment in the next 7 days.", "Aucun rendez-vous dans les 7 prochains jours.") + "</p>";
  bindOpeners($("upcoming-list"));
}

function renderDetail() {
  const box = $("appointment-detail");
  if (!ui.selected) {
    box.innerHTML = '<p class="eyebrow">COMMAND CENTER</p><h2>' + t("Nothing selected", "Rien de sélectionné") + "</h2><p class=\"muted\">" + t("Choose an appointment or a task.", "Choisissez un rendez-vous ou une tâche.") + "</p>";
    return;
  }
  if (ui.selected.kind === "task") {
    const task = taskList().find((item) => item.id === ui.selected.id);
    if (!task) { ui.selected = null; renderDetail(); return; }
    box.innerHTML = '<p class="eyebrow">' + t("TASK", "TÂCHE") + "</p><h2>" + escapeHtml(task.title) + "</h2><p>" + task.due + "</p><p class=\"muted\">" + escapeHtml(task.assignee || t("Personal", "Personnelle")) + "</p><p>" + escapeHtml(task.notes || "") + '</p><div class="detail-actions"><button class="button" type="button" id="detail-edit">' + t("EDIT", "MODIFIER") + '</button><button class="button button-gold" type="button" id="detail-done">' + t("COMPLETE", "TERMINER") + '</button><button class="button button-danger" type="button" id="detail-delete">' + t("DELETE", "SUPPRIMER") + "</button></div>";
    $("detail-edit").addEventListener("click", () => openTask(task));
    $("detail-done").addEventListener("click", () => {
      const tasks = taskList().map((item) => item.id === task.id ? Object.assign({}, item, { status: "done" }) : item);
      saveTasks(tasks); toast(t("Task completed.", "Tâche terminée.")); render();
    });
    $("detail-delete").addEventListener("click", async () => {
      if (!await askConfirm(t("Delete this task?", "Supprimer cette tâche ?"), task.title, t("Delete", "Supprimer"))) return;
      saveTasks(taskList().filter((item) => item.id !== task.id));
      ui.selected = null; render();
    });
    return;
  }
  const item = db.appointments.find((entry) => entry.id === ui.selected.id);
  if (!item) { ui.selected = null; renderDetail(); return; }
  const who = client(item.clientId);
  const person = member(item.assignedId);
  box.innerHTML = '<p class="eyebrow">' + escapeHtml(typeName(item.type)).toUpperCase() + "</p><h2>" + escapeHtml(item.title) + "</h2><p>" + item.date + " · " + item.start + "–" + item.end + "</p><p>" + escapeHtml(person.name) + "</p>" + (who ? "<p><strong>" + escapeHtml(who.name) + "</strong><br>" + escapeHtml(who.phone || "") + "<br>" + escapeHtml(who.email || "") + "</p>" : "") + "<p>" + escapeHtml(item.location || "") + "</p><p class=\"muted\">" + escapeHtml(item.notes || "") + '</p><div class="detail-actions"><button class="button" type="button" id="detail-edit">' + t("EDIT", "MODIFIER") + '</button><button class="button button-gold" type="button" id="detail-done">' + t("COMPLETE", "TERMINER") + '</button><button class="button" type="button" id="detail-cancel">' + t("CANCEL", "ANNULER") + '</button><button class="button button-danger" type="button" id="detail-delete">' + t("DELETE", "SUPPRIMER") + "</button></div>";
  $("detail-edit").addEventListener("click", () => openAppointment(item));
  $("detail-done").addEventListener("click", () => { item.status = "completed"; saveCalendar(); toast(t("Appointment completed.", "Rendez-vous terminé.")); render(); });
  $("detail-cancel").addEventListener("click", () => { item.status = "cancelled"; saveCalendar(); toast(t("Appointment cancelled.", "Rendez-vous annulé.")); render(); });
  $("detail-delete").addEventListener("click", async () => {
    if (!await askConfirm(t("Delete this appointment?", "Supprimer ce rendez-vous ?"), item.title, t("Delete", "Supprimer"))) return;
    db.appointments = db.appointments.filter((entry) => entry.id !== item.id);
    ui.selected = null; saveCalendar(); render();
  });
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
  $("client-dialog-content").innerHTML = "<p>" + escapeHtml(item.contact || "") + "<br>" + escapeHtml(item.phone || "") + "<br>" + escapeHtml(item.email || "") + "<br>" + escapeHtml(item.location || "") + "</p><h3>" + t("Appointments", "Rendez-vous") + "</h3>" + (appointments.map((entry) => "<p>" + entry.date + " · " + entry.start + " · " + escapeHtml(entry.title) + "</p>").join("") || "<p class=\"muted\">" + t("No appointment yet.", "Pas encore de rendez-vous.") + "</p>") + "<h3>" + t("Notes", "Notes") + "</h3><textarea class=\"field\" id=\"client-file-notes\">" + escapeHtml(item.notes || "") + "</textarea><h3>" + t("Files", "Fichiers") + "</h3>" + files.map((file) => '<p class="file-row">' + escapeHtml(file.name) + "</p>").join("") + '<label>' + t("File name", "Nom du fichier") + '<input class="field" id="client-file-name" maxlength="120"></label><div class="modal-actions"><button class="button" type="button" id="client-add-file">' + t("ADD FILE NAME", "AJOUTER LE NOM") + '</button><button class="button button-gold" type="button" id="client-save-notes">' + t("SAVE NOTES", "ENREGISTRER") + "</button></div>";
  $("client-dialog").showModal();
  $("client-save-notes").addEventListener("click", () => {
    item.notes = $("client-file-notes").value.trim();
    saveCalendar(); toast(t("Notes saved.", "Notes enregistrées."));
  });
  $("client-add-file").addEventListener("click", () => {
    const name = $("client-file-name").value.trim();
    if (!name) return;
    item.files = (item.files || []).concat({ id: crypto.randomUUID(), name });
    saveCalendar(); openClientFile(item);
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
    saveTasks(tasks); render();
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
    if (ui.page !== "calendar") { ui.page = "calendar"; }
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
      document.querySelector(".profile strong").textContent = full;
      document.querySelector(".avatar").textContent = full.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
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
  document.querySelectorAll("[data-action='manage-team']").forEach((button) => button.addEventListener("click", () => { $("profile-menu").hidden = true; renderTeamManager(); }));
  document.querySelector("[data-action='export']").addEventListener("click", exportData);
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
  $("profile-button").addEventListener("click", () => { $("profile-menu").hidden = !$("profile-menu").hidden; });
  $("menu-button").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("is-open"));
  document.querySelector(".language-badge").addEventListener("click", () => {
    lang = lang === "fr" ? "en" : "fr";
    localStorage.setItem(LANG_KEY, lang);
    render();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile") && !event.target.closest(".profile-menu")) $("profile-menu").hidden = true;
  });
});