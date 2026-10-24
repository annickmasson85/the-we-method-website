(() => {
  "use strict";
  const STORAGE_KEY = "twm.applications.workspace.v1";
  const PAGE_SIZE = 5;
  const SERVICES = ["Implementation Services", "Operation Insight", "Implementation Services & Operation Insight", "Fleet Solution", "Fleet Builder"];
  const STATUSES = { "to-review": "To Review", "in-progress": "In Progress", approved: "Approved", completed: "Completed", declined: "Declined" };
  const STEPS = ["Application Received", "Document Verification", "Analysis and Approval", "Document Creation", "Configuration and Implementation", "Team Preparation and Support", "File Closure"];
  const TEMPLATES = ["Implementation Plan", "Observation Notes", "Service Checklist", "Custom Document", "Contract"];
  const TITLES = { applications: "Applications Management", tracking: "Implementation Tracking", files: "Client Files", clients: "Clients", documents: "Document Workspace", contracts: "Contract Library", tasks: "Tasks", team: "Team & Assignments", templates: "Document Templates", overview: "Workspace Overview", reports: "Reports" };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const html = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const uid = () => globalThis.crypto?.randomUUID?.() || `twm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const text = (value, limit = 1000) => typeof value === "string" ? value.slice(0, limit) : "";
  const dateValid = value => typeof value === "string" && Number.isFinite(Date.parse(value));
  const idValid = value => typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
  const clone = value => JSON.parse(JSON.stringify(value));
  const blankState = () => ({ version: 1, applications: [], team: [], tasks: [], documents: [], settings: { ownerName: "", businessName: "The We Method" } });
  let storageAvailable = true;
  function validateState(raw) {
    if (!raw || typeof raw !== "object" || raw.version !== 1 || !Array.isArray(raw.applications)) throw new Error("Select a valid TWM workspace backup.");
    const next = blankState();
    for (const key of ["applications", "team", "tasks", "documents"]) {
      if (raw[key] !== undefined && !Array.isArray(raw[key])) throw new Error(`Invalid ${key} data.`);
      if ((raw[key] || []).length > 10000) throw new Error("The backup contains too many records.");
      const ids = new Set();
      for (const row of raw[key] || []) {
        if (!row || !idValid(row.id) || ids.has(row.id)) throw new Error(`Invalid or duplicate ${key} record.`);
        ids.add(row.id);
        if (key === "applications") {
          if (!text(row.business).trim() || !text(row.client).trim() || !SERVICES.includes(row.service) || !Object.hasOwn(STATUSES, row.status) || !dateValid(row.createdAt)) throw new Error("An application has missing or invalid fields.");
          const steps = Array.from({ length: STEPS.length }, (_, index) => row.status === "completed" || index === 0 || row.steps?.[index] === true);
          for (let i = 1; i < steps.length; i++) if (!steps[i - 1]) steps[i] = false;
          next.applications.push({ id: row.id, code: text(row.code, 40) || row.id, business: text(row.business, 200), client: text(row.client, 200), email: text(row.email, 254), phone: text(row.phone, 60), service: row.service, status: row.status, assignedTo: text(row.assignedTo, 100), notes: text(row.notes, 10000), createdAt: row.createdAt, updatedAt: dateValid(row.updatedAt) ? row.updatedAt : row.createdAt, steps, stepDates: Array.from({ length: STEPS.length }, (_, i) => dateValid(row.stepDates?.[i]) ? row.stepDates[i] : null) });
        } else if (key === "team") {
          if (!text(row.name).trim()) throw new Error("A team member has no name.");
          next.team.push({ id: row.id, name: text(row.name, 200), email: text(row.email, 254), role: text(row.role, 120) });
        } else if (key === "tasks") {
          if (!text(row.title).trim()) throw new Error("A task has no title.");
          next.tasks.push({ id: row.id, title: text(row.title, 300), applicationId: text(row.applicationId, 100), assignedTo: text(row.assignedTo, 100), dueDate: /^\d{4}-\d{2}-\d{2}$/.test(row.dueDate || "") ? row.dueDate : "", done: row.done === true });
        } else {
          if (!text(row.title).trim()) throw new Error("A document has no title.");
          next.documents.push({ id: row.id, title: text(row.title, 200), applicationId: text(row.applicationId, 100), type: TEMPLATES.includes(row.type) ? row.type : "Custom Document", content: text(row.content, 100000), dueDate: /^\d{4}-\d{2}-\d{2}$/.test(row.dueDate || "") ? row.dueDate : "", updatedAt: dateValid(row.updatedAt) ? row.updatedAt : new Date().toISOString() });
        }
      }
    }
    const teamIds = new Set(next.team.map(member => member.id));
    const applicationIds = new Set(next.applications.map(app => app.id));
    for (const app of next.applications) if (!teamIds.has(app.assignedTo)) app.assignedTo = "";
    for (const task of next.tasks) { if (!teamIds.has(task.assignedTo)) task.assignedTo = ""; if (!applicationIds.has(task.applicationId)) task.applicationId = ""; }
    for (const doc of next.documents) if (!applicationIds.has(doc.applicationId)) doc.applicationId = "";
    next.settings = { ownerName: text(raw.settings?.ownerName, 200), businessName: text(raw.settings?.businessName, 200) || "The We Method" };
    return next;
  }
  function loadState() { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? validateState(JSON.parse(raw)) : blankState(); } catch (error) { storageAvailable = false; return blankState(); } }
  let state = loadState();
  let view = "applications";
  let selectedId = state.applications[0]?.id || "";
  let page = 1;
  let query = "";
  let statusFilter = "all";
  let dateFilter = "all";
  let serviceFilter = "all";
  let sortFilter = "newest";
  let toastTimer;
  const dialog = $("#workspace-dialog");
  function notify(message) { const toast = $("#toast"); if (!toast) return; clearTimeout(toastTimer); toast.textContent = message; toast.hidden = false; toastTimer = setTimeout(() => { toast.hidden = true; }, 4500); }
  function commit(message) { let saved = false; if (storageAvailable) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); saved = true; } catch (error) {} } render(); document.dispatchEvent(new CustomEvent("twm:workspace:changed", { detail: clone(state) })); notify(saved ? message : "Saved for this session only. Download a backup before leaving this page."); }
  const getApp = id => state.applications.find(app => app.id === id);
  const memberName = id => state.team.find(member => member.id === id)?.name || "Unassigned";
  const progress = app => Math.round(app.steps.filter(Boolean).length / STEPS.length * 100);
  const nextStep = app => app.steps.findIndex(done => !done);
  const currentStep = app => STEPS[nextStep(app) === -1 ? STEPS.length - 1 : nextStep(app)];
  const dateLabel = iso => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeLabel = iso => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const badge = app => `<span class="status status-${app.status}">${html(STATUSES[app.status])}</span>`;
  const progressBar = app => `<div class="progress"><span class="progress-track"><span class="progress-fill ${app.status === "completed" ? "is-green" : app.status === "in-progress" ? "is-blue" : ""}" style="width:${progress(app)}%"></span></span><span>${progress(app)}%</span></div>`;
  const empty = (title, message, action = "", button = "") => `<div class="empty-state">${icon("folder")}<h2>${html(title)}</h2><p>${html(message)}</p>${action ? `<button class="button button-outline" data-action="${action}">${html(button)}</button>` : ""}</div>`;
  const heading = (title, description, action = "", label = "") => `<div class="workspace-heading"><div><h2>${html(title)}</h2><p>${html(description)}</p></div>${action ? `<button class="button button-outline" data-action="${action}">${icon("plus")}${html(label)}</button>` : ""}</div>`;
  const options = (values, selected) => values.map(value => `<option value="${html(value)}"${value === selected ? " selected" : ""}>${html(value)}</option>`).join("");
  const applicationOptions = selected => `<option value="">No linked application</option>${state.applications.map(app => `<option value="${html(app.id)}"${app.id === selected ? " selected" : ""}>${html(app.business)} — ${html(app.code)}</option>`).join("")}`;
  const teamOptions = selected => `<option value="">Unassigned</option>${state.team.map(member => `<option value="${html(member.id)}"${member.id === selected ? " selected" : ""}>${html(member.name)}</option>`).join("")}`;
  function filteredApplications() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return state.applications.filter(app => {
      const linkedTitles = state.documents.filter(doc => doc.applicationId === app.id).map(doc => doc.title).join(" ");
      const haystack = [app.code, app.business, app.client, app.service, app.email, app.phone, memberName(app.assignedTo), linkedTitles].join(" ").toLowerCase();
      const created = new Date(app.createdAt);
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (serviceFilter !== "all" && app.service !== serviceFilter) return false;
      if (dateFilter === "today" && (created < today || created >= new Date(today.getTime() + 86400000))) return false;
      if (dateFilter === "month" && (created.getMonth() !== now.getMonth() || created.getFullYear() !== now.getFullYear())) return false;
      if (["7", "30"].includes(dateFilter)) { const cutoff = new Date(today); cutoff.setDate(cutoff.getDate() - Number(dateFilter) + 1); if (created < cutoff || created > now) return false; }
      return true;
    }).sort((a, b) => sortFilter === "client" ? a.business.localeCompare(b.business) : sortFilter === "oldest" ? Date.parse(a.createdAt) - Date.parse(b.createdAt) : Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
  function renderCounters() {
    const now = new Date();
    const received = $("#metric-received"), review = $("#metric-review"), progressEl = $("#metric-progress"), completed = $("#metric-completed");
    if (received) received.textContent = state.applications.filter(app => { const d = new Date(app.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
    if (review) review.textContent = state.applications.filter(app => app.status === "to-review").length;
    if (progressEl) progressEl.textContent = state.applications.filter(app => app.status === "in-progress").length;
    if (completed) completed.textContent = state.applications.filter(app => app.status === "completed").length;
    $$("[data-count]").forEach(element => { element.textContent = element.dataset.count === "all" ? state.applications.length : state.applications.filter(app => app.status === element.dataset.count).length; });
    const note = $("#notification-count");
    if (note) { const reviews = state.applications.filter(app => app.status === "to-review").length; note.textContent = reviews; note.hidden = reviews === 0; }
    const taskCount = $("#task-count");
    if (taskCount) taskCount.textContent = state.tasks.filter(task => !task.done).length;
    const owner = $("#owner-name");
    if (owner) owner.textContent = state.settings.ownerName || "Annick Masson";
  }
  function dueTone(due) {
    if (!due) return "none";
    const days = Math.ceil((new Date(due + "T12:00:00") - new Date()) / 86400000);
    if (days <= 3) return "red";
    if (days <= 7) return "orange";
    return "green";
  }
  function renderJourney() {
    const journey = $("#journey-content");
    if (!journey) return;
    const app = getApp(selectedId);
    if (!app) {
      journey.innerHTML = `<div class="journey-empty">${icon("shield")}<p>Select a client file</p><small>Documents and due dates will appear here.</small></div>`;
      return;
    }
    const docs = state.documents.filter(doc => doc.applicationId === app.id);
    journey.innerHTML = `<p class="journey-client">${html(app.business)} · ${html(app.code)}</p>` + (docs.length
      ? `<ul class="doc-due-list">${docs.map(doc => `<li class="doc-due is-${dueTone(doc.dueDate)}"><span class="due-dot"></span><div><strong>${html(doc.title)}</strong><small>${doc.dueDate ? "Due " + html(dateLabel(doc.dueDate + "T12:00:00")) : "No due date"}</small></div></li>`).join("")}</ul>`
      : `<div class="journey-empty">${icon("folder")}<p>No documents yet</p><small>Create a document for this client to see its due date.</small></div>`);
  }
  function render() {
    renderCounters();
    let salesYear = window.salesYear || new Date().getFullYear();
    const chart = $("#sales-chart");
    if (chart) {
      const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
      const counts = months.map((_, i) => state.applications.filter(app => {
        if (app.service !== "Implementation Services") return false;
        const d = new Date(app.createdAt);
        return d.getFullYear() === salesYear && d.getMonth() === i;
      }).length);
      const max = Math.max(1, ...counts);
      chart.innerHTML = counts.map((n, i) => `<div class="chart-col"><span class="chart-value">${n}</span><div class="chart-bar" style="height:${Math.round(n / max * 210)}px"></div><span class="chart-label">${months[i]}</span></div>`).join("");
    }
    $$(".year-btn").forEach(btn => {
      btn.classList.toggle("is-active", (btn.dataset.year === "current" && salesYear === new Date().getFullYear()) || (btn.dataset.year === "previous" && salesYear === new Date().getFullYear() - 1));
    });
    renderJourney();
  }
  function closeSidebar() { document.body.classList.remove("sidebar-open"); const btn = $("#menu-button"); if (btn) btn.setAttribute("aria-expanded", "false"); const scrim = $("#sidebar-scrim"); if (scrim) scrim.hidden = true; }
  document.addEventListener("click", event => {
    const button = event.target.closest("button"); if (!button) return;
    if (button.classList.contains("year-btn")) {
      window.salesYear = button.dataset.year === "previous" ? new Date().getFullYear() - 1 : new Date().getFullYear();
      render();
      return;
    }
  });
  render();
  if (!storageAvailable) notify("Browser storage is unavailable or an existing backup could not be read. Import a valid backup or download your work before leaving.");
  (async function () {
    var supabase = window.supabaseClient;
    if (!supabase) return;
    var session = await supabase.auth.getSession();
    if (!session.data || !session.data.session) return;
    var userRes = await supabase.auth.getUser();
    var user = (userRes.data && userRes.data.user) || session.data.session.user;
    var meta = (user && user.user_metadata) || {};
    var name = document.getElementById("owner-name");
    if (name) name.textContent = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Annick Masson";
    if (meta.avatar_url) {
      var photo = document.getElementById("header-photo");
      var icon = document.getElementById("header-icon");
      if (photo) { photo.src = meta.avatar_url; photo.hidden = false; }
      if (icon) icon.style.display = "none";
    }
  })();
})();