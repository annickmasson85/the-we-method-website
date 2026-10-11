(() => {
  "use strict";

  // No demonstration data. Only records entered here or imported explicitly.
  // This standalone version saves to this browser, not to a shared server.
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
          // Step completion is sequential; a later step cannot skip an earlier one.
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
          next.documents.push({ id: row.id, title: text(row.title, 200), applicationId: text(row.applicationId, 100), type: TEMPLATES.includes(row.type) ? row.type : "Custom Document", content: text(row.content, 100000), updatedAt: dateValid(row.updatedAt) ? row.updatedAt : new Date().toISOString() });
        }
      }
    }
    const teamIds = new Set(next.team.map(member => member.id));
    const applicationIds = new Set(next.applications.map(app => app.id));
    for (const app of next.applications) if (!teamIds.has(app.assignedTo)) app.assignedTo = "";
    for (const task of next.tasks) {
      if (!teamIds.has(task.assignedTo)) task.assignedTo = "";
      if (!applicationIds.has(task.applicationId)) task.applicationId = "";
    }
    for (const doc of next.documents) if (!applicationIds.has(doc.applicationId)) doc.applicationId = "";
    next.settings = { ownerName: text(raw.settings?.ownerName, 200), businessName: text(raw.settings?.businessName, 200) || "The We Method" };
    return next;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? validateState(JSON.parse(raw)) : blankState();
    } catch (error) {
      // Keep an unreadable existing backup intact; do not overwrite it automatically.
      storageAvailable = false;
      return blankState();
    }
  }

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

  function notify(message) {
    const toast = $("#toast");
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
  }

  function commit(message) {
    let saved = false;
    if (storageAvailable) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); saved = true; }
      catch (error) { /* Keep the current session available for backup export. */ }
    }
    render();
    document.dispatchEvent(new CustomEvent("twm:workspace:changed", { detail: clone(state) }));
    notify(saved ? message : "Saved for this session only. Download a backup before leaving this page.");
  }

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
      if (["7", "30"].includes(dateFilter)) {
        const cutoff = new Date(today);
        cutoff.setDate(cutoff.getDate() - Number(dateFilter) + 1);
        if (created < cutoff || created > now) return false;
      }
      return true;
    }).sort((a, b) => sortFilter === "client" ? a.business.localeCompare(b.business) : sortFilter === "oldest" ? Date.parse(a.createdAt) - Date.parse(b.createdAt) : Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  function renderCounters() {
    const now = new Date();
    $("#metric-received").textContent = state.applications.filter(app => { const d = new Date(app.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
    $("#metric-review").textContent = state.applications.filter(app => app.status === "to-review").length;
    $("#metric-progress").textContent = state.applications.filter(app => app.status === "in-progress").length;
    $("#metric-completed").textContent = state.applications.filter(app => app.status === "completed").length;
    $$("[data-count]").forEach(element => { element.textContent = element.dataset.count === "all" ? state.applications.length : state.applications.filter(app => app.status === element.dataset.count).length; });
    const reviews = state.applications.filter(app => app.status === "to-review").length;
    $("#notification-count").textContent = reviews;
    $("#notification-count").hidden = reviews === 0;
    $("#task-count").textContent = state.tasks.filter(task => !task.done).length;
    $("#owner-name").textContent = state.settings.ownerName || "Owner workspace";
  }

  function renderTable(apps) {
    const pages = Math.max(1, Math.ceil(apps.length / PAGE_SIZE));
    page = Math.min(page, pages);
    const rows = apps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const tableHeader = `<div class="table-scroll"><table class="applications-table"><caption class="sr-only">Applications entered in this workspace</caption><thead><tr><th scope="col">#</th><th scope="col">Client</th><th scope="col">Type</th><th scope="col">Date Received</th><th scope="col">Status</th><th scope="col">Current Step</th><th scope="col">Actions</th></tr></thead><tbody>`;
    const body = rows.map(app => `<tr><td>${html(app.code)}</td><td><strong class="cell-title">${html(app.business)}</strong><span class="cell-subtitle">${html(app.client)}</span></td><td>${html(app.service)}</td><td>${html(dateLabel(app.createdAt))}<span class="cell-subtitle">${html(timeLabel(app.createdAt))}</span></td><td>${badge(app)}</td><td>${html(currentStep(app))}${progressBar(app)}</td><td><div class="row-actions"><button class="button button-outline" data-action="view-application" data-id="${app.id}" aria-label="View ${html(app.business)}">View</button><button class="icon-button" data-action="edit-application" data-id="${app.id}" aria-label="Edit ${html(app.business)}">${icon("more")}</button></div></td></tr>`).join("");
    const noRows = `<tr><td colspan="7">${state.applications.length ? empty("No matching applications", "Try another search or clear the filters.", "clear-filters", "Clear filters") : empty("No applications yet", "Your real applications will appear here.", "new-application", "Add an application")}</td></tr>`;
    $("#workspace-content").innerHTML = tableHeader + (body || noRows) + "</tbody></table></div>";
    $("#results-summary").textContent = apps.length ? `Showing ${(page - 1) * PAGE_SIZE + 1} to ${Math.min(page * PAGE_SIZE, apps.length)} of ${apps.length} applications` : "0 applications";
    const firstPage = Math.max(1, Math.min(page - 2, pages - 4));
    $("#pagination").innerHTML = apps.length > PAGE_SIZE ? `<button data-page="${page - 1}" aria-label="Previous page"${page === 1 ? " disabled" : ""}>‹</button>${Array.from({ length: Math.min(pages, 5) }, (_, i) => firstPage + i).map(n => `<button data-page="${n}"${n === page ? ' aria-current="page"' : ""}>${n}</button>`).join("")}<button data-page="${page + 1}" aria-label="Next page"${page === pages ? " disabled" : ""}>›</button>` : "";
  }

  function renderFiles(apps) {
    const title = view === "tracking" ? "Implementation Tracking" : view === "clients" ? "Clients" : "Client Files";
    $("#workspace-content").innerHTML = heading(title, "Open a real application to view its details and update its journey.") + (apps.length ? `<div class="record-list">${apps.map(app => `<article class="record"><div class="record-body"><h3>${html(app.business)}</h3><p>${html(app.client)} · ${html(app.service)}<br>${html(memberName(app.assignedTo))} · ${state.documents.filter(doc => doc.applicationId === app.id).length} saved documents</p>${progressBar(app)}</div><div class="row-actions"><button class="button button-outline" data-action="select-application" data-id="${app.id}">Journey</button><button class="button button-outline" data-action="view-application" data-id="${app.id}">Open File</button></div></article>`).join("")}</div>` : empty(state.applications.length ? "No matching files" : "No client files yet", "Files are created when you add an application.", "new-application", "Add an application"));
  }

  function renderDocuments() {
    const docs = state.documents.filter(doc => view !== "contracts" || doc.type === "Contract");
    $("#workspace-content").innerHTML = heading(view === "contracts" ? "Contract Library" : "Saved Documents", "Create drafts, edit your own text, and download a copy.", "new-document", "New Document") + (docs.length ? `<div class="record-list">${docs.map(doc => `<article class="record"><div class="record-body"><h3>${html(doc.title)}</h3><p>${html(getApp(doc.applicationId)?.business || "Workspace document")} · ${html(doc.type)}<br>Updated ${html(dateLabel(doc.updatedAt))}</p></div><div class="row-actions"><button class="button button-outline" data-action="edit-document" data-id="${doc.id}">Edit</button><button class="icon-button" data-action="download-document" data-id="${doc.id}" aria-label="Download ${html(doc.title)}">${icon("download")}</button></div></article>`).join("")}</div>` : empty("No saved documents", "Add your own document and link it to a client file.", "new-document", "Create a Document"));
  }

  function renderTasks() {
    $("#workspace-content").innerHTML = heading("Tasks", "Keep actual work and assignments connected to client files.", "new-task", "Add Task") + (state.tasks.length ? `<div class="record-list">${state.tasks.map(task => `<article class="record ${task.done ? "is-done" : ""}"><input type="checkbox" data-task-id="${task.id}" aria-label="Complete ${html(task.title)}"${task.done ? " checked" : ""}><div class="record-body"><h3>${html(task.title)}</h3><p>${html(memberName(task.assignedTo))}${getApp(task.applicationId) ? ` · ${html(getApp(task.applicationId).business)}` : ""}${task.dueDate ? ` · Due ${html(dateLabel(task.dueDate + "T12:00:00"))}` : ""}</p></div><button class="button button-outline" data-action="edit-task" data-id="${task.id}">Edit</button></article>`).join("")}</div>` : empty("No tasks yet", "Add the work you actually need to complete.", "new-task", "Add Task"));
  }

  function renderTeam() {
    $("#workspace-content").innerHTML = heading("Team & Assignments", "Add the people who belong to your team.", "new-member", "Add Team Member") + (state.team.length ? `<div class="record-list">${state.team.map(member => `<article class="record"><div class="record-body"><h3>${html(member.name)}</h3><p>${html(member.role || "Team member")}${member.email ? ` · ${html(member.email)}` : ""}<br>${state.applications.filter(app => app.assignedTo === member.id).length} assigned applications · ${state.tasks.filter(task => task.assignedTo === member.id && !task.done).length} open tasks</p></div><button class="button button-outline" data-action="edit-member" data-id="${member.id}">Edit</button></article>`).join("")}</div>` : empty("No team members yet", "Add team members to assign applications and tasks.", "new-member", "Add Team Member"));
  }

  function renderTemplates() {
    $("#workspace-content").innerHTML = heading("Document Templates", "Start a working draft using the details from your client file.") + `<div class="record-list">${TEMPLATES.slice(0, 3).map(type => `<article class="record"><div class="record-body"><h3>${html(type)}</h3><p>Editable outline for your own project information.</p></div><button class="button button-outline" data-action="use-template" data-template="${html(type)}">Use Template</button></article>`).join("")}</div>`;
  }

  function renderReports() {
    const total = state.applications.length;
    $("#workspace-content").innerHTML = heading(view === "reports" ? "Workspace Reports" : "Workspace Overview", "These totals use only the records saved in this workspace.") + `<div class="report-grid"><div class="report-item"><strong>${total}</strong><span>Applications</span></div><div class="report-item"><strong>${state.team.length}</strong><span>Team members</span></div><div class="report-item"><strong>${state.tasks.filter(task => !task.done).length}</strong><span>Open tasks</span></div><div class="report-item"><strong>${state.documents.length}</strong><span>Saved documents</span></div></div><div class="record-list">${Object.entries(STATUSES).map(([key, label]) => `<div class="record"><span>${html(label)}</span><strong>${state.applications.filter(app => app.status === key).length}</strong></div>`).join("")}</div><button class="button button-outline" data-action="export-backup">${icon("download")}Download Workspace Backup</button>`;
  }

  function renderJourney() {
    const app = getApp(selectedId);
    if (!app) { $("#journey-content").innerHTML = `<div class="journey-empty">${icon("shield")}<p>Select a client file</p><small>The steps and progress will appear here.</small></div>`; return; }
    const next = nextStep(app);
    $("#journey-content").innerHTML = `<p class="journey-client">${html(app.business)} · ${html(app.code)}</p><ol class="journey-steps">${STEPS.map((step, index) => `<li class="journey-step ${app.steps[index] ? "is-done" : ""} ${index === next ? "is-current" : ""}"><button class="step-button" data-step="${index}" aria-label="${html(index === 0 ? "Application received" : app.steps[index] ? "Reopen from " + step : "Complete through " + step)}"${index === 0 || app.status === "declined" ? " disabled" : ""}><span class="step-number">${app.steps[index] ? icon("check") : index + 1}</span><span class="step-copy"><strong>${html(step)}</strong><small>${app.steps[index] ? app.stepDates[index] ? html(dateLabel(app.stepDates[index])) : "Completed" : app.status === "declined" ? "On hold" : index === next ? "In progress" : "Pending"}</small></span></button></li>`).join("")}</ol>`;
  }

  function render() {
    renderCounters();
    $("#page-title").textContent = TITLES[view];
    const filterable = ["applications", "tracking", "files", "clients"].includes(view);
    $("#table-tools").hidden = !filterable;
    $("#table-footer").hidden = view !== "applications";
    if (!filterable) { $("#extra-filters").hidden = true; $("#filter-button").setAttribute("aria-expanded", "false"); }
    $("#application-search").value = query;
    $("#global-search").value = query;
    $("#status-filter").value = statusFilter;
    $("#date-filter").value = dateFilter;
    $("#service-filter").value = serviceFilter;
    $("#sort-filter").value = sortFilter;
    $$(".workspace-tabs [role='tab']").forEach(tab => {
      const active = tab.dataset.view === view;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const activeTab = $(".workspace-tabs .is-active");
    if (activeTab) { $("#workspace-content").setAttribute("role", "tabpanel"); $("#workspace-content").setAttribute("aria-labelledby", activeTab.id); }
    else { $("#workspace-content").setAttribute("role", "region"); $("#workspace-content").setAttribute("aria-label", TITLES[view]); $("#workspace-content").removeAttribute("aria-labelledby"); $("#tab-applications").tabIndex = 0; }
    let activeNavigationFound = false;
    $$(".nav-item[data-view]").forEach(button => {
      const active = !activeNavigationFound && button.dataset.view === view && (!button.dataset.status || button.dataset.status === statusFilter);
      if (active) activeNavigationFound = true;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    if (view === "applications") renderTable(filteredApplications());
    else if (["tracking", "files", "clients"].includes(view)) renderFiles(filteredApplications());
    else if (["documents", "contracts"].includes(view)) renderDocuments();
    else if (view === "tasks") renderTasks();
    else if (view === "team") renderTeam();
    else if (view === "templates") renderTemplates();
    else renderReports();
    renderJourney();
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    $("#menu-button").setAttribute("aria-expanded", "false");
    $("#sidebar-scrim").hidden = true;
  }

  function setView(next, status) {
    if (!Object.hasOwn(TITLES, next)) return;
    view = next;
    if (status !== undefined) statusFilter = status;
    else if (next !== "applications") { statusFilter = "all"; query = ""; dateFilter = "all"; serviceFilter = "all"; }
    page = 1;
    closeSidebar();
    render();
  }

  function openDialog(title, content) {
    $("#dialog-title").textContent = title;
    $("#dialog-content").innerHTML = content;
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => $("input:not([type='hidden']), select, textarea, button", $("#dialog-content"))?.focus());
  }

  function applicationForm(app) {
    openDialog(app ? "Edit Application" : "New Application", `<form data-form="application" data-id="${html(app?.id || "")}"><div class="form-grid"><label>Business / Company *<input class="form-input" name="business" value="${html(app?.business)}" required maxlength="200" autocomplete="organization"></label><label>Client Name *<input class="form-input" name="client" value="${html(app?.client)}" required maxlength="200" autocomplete="name"></label><label>Email<input class="form-input" name="email" type="email" value="${html(app?.email)}" maxlength="254" autocomplete="email"></label><label>Phone<input class="form-input" name="phone" type="tel" value="${html(app?.phone)}" maxlength="60" autocomplete="tel"></label><label class="full-width">Service *<select name="service" required><option value="">Select a service</option>${options(SERVICES, app?.service)}</select></label><label>Status<select name="status">${Object.entries(STATUSES).map(([key, label]) => `<option value="${key}"${(app?.status || "to-review") === key ? " selected" : ""}>${label}</option>`).join("")}</select></label><label>Assigned To<select name="assignedTo">${teamOptions(app?.assignedTo)}</select></label><label class="full-width">Client Notes<textarea name="notes" maxlength="10000">${html(app?.notes)}</textarea></label></div><div class="form-actions"><button type="button" class="button button-outline" data-action="close-dialog">Cancel</button><button class="button button-gold" type="submit">${app ? "Save Changes" : "Create Application"}</button></div></form>`);
  }

  function showApplication(id) {
    const app = getApp(id);
    if (!app) return;
    selectedId = id;
    renderJourney();
    const docs = state.documents.filter(doc => doc.applicationId === id);
    openDialog(app.business, `<dl class="detail-list"><dt>Application</dt><dd>${html(app.code)}</dd><dt>Client</dt><dd>${html(app.client)}</dd><dt>Service</dt><dd>${html(app.service)}</dd><dt>Email</dt><dd>${html(app.email || "—")}</dd><dt>Phone</dt><dd>${html(app.phone || "—")}</dd><dt>Received</dt><dd>${html(dateLabel(app.createdAt))} · ${html(timeLabel(app.createdAt))}</dd><dt>Status</dt><dd>${badge(app)}</dd><dt>Assigned To</dt><dd>${html(memberName(app.assignedTo))}</dd><dt>Progress</dt><dd>${html(currentStep(app))}${progressBar(app)}</dd><dt>Documents</dt><dd>${docs.length}${docs.length ? " · " + docs.map(doc => html(doc.title)).join(", ") : ""}</dd></dl>${app.notes ? `<p class="detail-notes">${html(app.notes)}</p>` : ""}<div class="form-actions"><button class="button button-danger" data-action="delete-application" data-id="${id}">Delete</button><button class="button button-outline" data-action="new-document" data-application-id="${id}">Create Document</button><button class="button button-gold" data-action="edit-application" data-id="${id}">Edit Application</button></div>`);
  }

  function documentForm(doc, type = "Implementation Plan", applicationId = selectedId) {
    const selectedType = doc?.type || (view === "contracts" ? "Contract" : type);
    openDialog(doc ? "Edit Document" : "Create Document", `<form data-form="document" data-id="${html(doc?.id || "")}"><div class="form-grid"><label class="full-width">Document Title *<input class="form-input" name="title" required maxlength="200" value="${html(doc?.title || selectedType)}"></label><label>Client File<select name="applicationId">${applicationOptions(doc?.applicationId ?? applicationId)}</select></label><label>Document Type<select name="type">${options(TEMPLATES, selectedType)}</select></label><div class="full-width"><button type="button" class="text-button" data-action="fill-document">Start from selected outline</button></div><label class="full-width">Document Content *<textarea class="document-editor" name="content" required maxlength="100000">${html(doc?.content)}</textarea></label></div><div class="form-actions"><button type="button" class="button button-outline" data-action="close-dialog">Cancel</button><button type="submit" class="button button-gold">Save Document</button></div></form>`);
  }

  function outline(type, app) {
    const header = `${state.settings.businessName}\n${type.toUpperCase()}\n\nBusiness: ${app?.business || ""}\nClient: ${app?.client || ""}\nService: ${app?.service || ""}\nApplication: ${app?.code || ""}\n\n`;
    if (type === "Implementation Plan") return header + "PROJECT OBJECTIVE\n\nPRIORITIES\n\nACTIONS AND RESPONSIBILITIES\n\nDOCUMENTS REQUIRED\n\nTIMELINE\n\nFOLLOW-UP\n";
    if (type === "Observation Notes") return header + "OBSERVATION DATE\n\nPROCESSES\n\nDOCUMENTS\n\nTEAM AND SERVICE\n\nOBSERVATIONS\n\nRECOMMENDED PRIORITIES\n";
    if (type === "Service Checklist") return header + STEPS.map(step => `[ ] ${step}`).join("\n") + "\n\nNOTES\n";
    return header;
  }

  function memberForm(member) {
    openDialog(member ? "Edit Team Member" : "Add Team Member", `<form data-form="member" data-id="${html(member?.id || "")}"><div class="form-grid"><label class="full-width">Full Name *<input class="form-input" name="name" value="${html(member?.name)}" required maxlength="200" autocomplete="name"></label><label>Email<input class="form-input" name="email" type="email" maxlength="254" value="${html(member?.email)}" autocomplete="email"></label><label>Role / Responsibilities<input class="form-input" name="role" maxlength="120" value="${html(member?.role)}"></label></div><div class="form-actions"><button class="button button-outline" type="button" data-action="close-dialog">Cancel</button><button class="button button-gold" type="submit">Save Team Member</button></div></form>`);
  }

  function taskForm(task) {
    openDialog(task ? "Edit Task" : "Add Task", `<form data-form="task" data-id="${html(task?.id || "")}"><div class="form-grid"><label class="full-width">Task *<input class="form-input" name="title" required maxlength="300" value="${html(task?.title)}"></label><label>Client File<select name="applicationId">${applicationOptions(task?.applicationId || selectedId)}</select></label><label>Assigned To<select name="assignedTo">${teamOptions(task?.assignedTo)}</select></label><label>Due Date<input class="form-input" name="dueDate" type="date" value="${html(task?.dueDate)}"></label></div><div class="form-actions"><button type="button" class="button button-outline" data-action="close-dialog">Cancel</button><button type="submit" class="button button-gold">Save Task</button></div></form>`);
  }

  function settingsForm() {
    openDialog("Workspace Configuration", `<form data-form="settings"><div class="form-grid"><label class="full-width">Business Name<input class="form-input" name="businessName" maxlength="200" required value="${html(state.settings.businessName)}"></label><label class="full-width">Your Name<input class="form-input" name="ownerName" maxlength="200" value="${html(state.settings.ownerName)}" autocomplete="name"></label></div><p class="form-note">Records are saved in this browser. Download a backup to keep a separate copy or transfer your workspace.</p><div class="form-actions"><button type="button" class="button button-outline" data-action="export-backup">Download Backup</button><button type="button" class="button button-outline" data-action="import-backup">Import Backup</button><button type="submit" class="button button-gold">Save Settings</button></div></form>`);
  }

  function download(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearFilters() {
    query = ""; statusFilter = "all"; dateFilter = "all"; serviceFilter = "all"; sortFilter = "newest"; page = 1;
    render();
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.view) { setView(button.dataset.view, button.dataset.status); return; }
    if (button.dataset.page) { page = Number(button.dataset.page); renderTable(filteredApplications()); return; }
    if (button.dataset.step !== undefined) {
      const app = getApp(selectedId);
      const index = Number(button.dataset.step);
      if (!app || index < 1 || app.status === "declined") return;
      const reopen = app.steps[index];
      const now = new Date().toISOString();
      app.steps = app.steps.map((done, i) => reopen ? i < index && done : i <= index || done);
      app.stepDates = app.stepDates.map((date, i) => reopen ? i >= index ? null : date : app.steps[i] ? date || now : null);
      app.status = app.steps.every(Boolean) ? "completed" : "in-progress";
      app.updatedAt = now;
      commit("Journey updated.");
      return;
    }
    const { action, id } = button.dataset;
    if (action === "new-application") applicationForm();
    else if (action === "edit-application") applicationForm(getApp(id));
    else if (action === "view-application") showApplication(id);
    else if (action === "select-application") { selectedId = id; renderJourney(); $("#journey-title").scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    else if (action === "close-dialog") dialog.close();
    else if (action === "clear-filters") clearFilters();
    else if (action === "new-document") documentForm(null, "Implementation Plan", button.dataset.applicationId || selectedId);
    else if (action === "edit-document") documentForm(state.documents.find(doc => doc.id === id));
    else if (action === "use-template") documentForm(null, button.dataset.template);
    else if (action === "fill-document") {
      const form = $("form[data-form='document']", dialog);
      if (form.elements.content.value.trim() && !confirm("Replace the current document text with this outline?")) return;
      form.elements.content.value = outline(form.elements.type.value, getApp(form.elements.applicationId.value));
    } else if (action === "download-document") {
      const doc = state.documents.find(item => item.id === id);
      if (doc) download(`${doc.title}.txt`, doc.content, "text/plain;charset=utf-8");
    } else if (action === "new-member") memberForm();
    else if (action === "edit-member") memberForm(state.team.find(member => member.id === id));
    else if (action === "new-task") taskForm();
    else if (action === "edit-task") taskForm(state.tasks.find(task => task.id === id));
    else if (action === "settings") settingsForm();
    else if (action === "review-summary") { const count = state.applications.filter(app => app.status === "to-review").length; notify(count ? `${count} application${count === 1 ? " is" : "s are"} waiting for review.` : "No applications are waiting for review."); }
    else if (action === "export-backup") download(`TWM_Workspace_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), "application/json");
    else if (action === "import-backup") $("#backup-input").click();
    else if (action === "delete-application") {
      const app = getApp(id);
      if (!app || !confirm(`Delete ${app.business}, its linked tasks, and its saved documents?`)) return;
      state.applications = state.applications.filter(item => item.id !== id);
      state.tasks = state.tasks.filter(task => task.applicationId !== id);
      state.documents = state.documents.filter(doc => doc.applicationId !== id);
      if (selectedId === id) selectedId = "";
      dialog.close();
      commit("Application deleted.");
    }
  });

  dialog.addEventListener("submit", event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const now = new Date().toISOString();
    const id = form.dataset.id;
    const type = form.dataset.form;
    let message;
    if (type === "application") {
      if (!values.business.trim() || !values.client.trim()) { notify("Enter the business name and the client name."); return; }
      const existing = getApp(id);
      const year = new Date().getFullYear();
      const nextCode = Math.max(0, ...state.applications.map(app => { const match = app.code.match(new RegExp(`^APP-${year}-(\\d+)$`)); return match ? Number(match[1]) : 0; })) + 1;
      const app = existing || { id: uid(), code: `APP-${year}-${String(nextCode).padStart(3, "0")}`, createdAt: now, steps: STEPS.map((_, i) => i === 0), stepDates: STEPS.map((_, i) => i === 0 ? now : null) };
      Object.assign(app, { business: values.business.trim(), client: values.client.trim(), email: values.email.trim(), phone: values.phone.trim(), service: values.service, status: values.status, assignedTo: values.assignedTo, notes: values.notes.trim(), updatedAt: now });
      if (app.status === "completed") { app.steps = STEPS.map(() => true); app.stepDates = app.stepDates.map(date => date || now); }
      else if (existing && app.steps.every(Boolean)) { app.steps[STEPS.length - 1] = false; app.stepDates[STEPS.length - 1] = null; }
      if (!existing) state.applications.unshift(app);
      selectedId = app.id;
      page = 1;
      view = "applications";
      query = ""; statusFilter = "all"; dateFilter = "all"; serviceFilter = "all";
      message = existing ? "Application updated." : "Application created.";
    } else if (type === "document") {
      if (!values.title.trim() || !values.content.trim()) { notify("Enter a document title and content."); return; }
      const doc = state.documents.find(item => item.id === id);
      const record = { id: doc?.id || uid(), title: values.title.trim(), applicationId: values.applicationId, type: values.type, content: values.content, updatedAt: now };
      if (doc) Object.assign(doc, record); else state.documents.unshift(record);
      view = "documents";
      message = "Document saved.";
    } else if (type === "member") {
      if (!values.name.trim()) { notify("Enter the team member's name."); return; }
      const member = state.team.find(item => item.id === id);
      const record = { id: member?.id || uid(), name: values.name.trim(), email: values.email.trim(), role: values.role.trim() };
      if (member) Object.assign(member, record); else state.team.push(record);
      view = "team";
      message = "Team member saved.";
    } else if (type === "task") {
      if (!values.title.trim()) { notify("Enter a task."); return; }
      const task = state.tasks.find(item => item.id === id);
      const record = { id: task?.id || uid(), title: values.title.trim(), applicationId: values.applicationId, assignedTo: values.assignedTo, dueDate: values.dueDate, done: task?.done || false };
      if (task) Object.assign(task, record); else state.tasks.push(record);
      view = "tasks";
      message = "Task saved.";
    } else if (type === "settings") {
      state.settings = { businessName: values.businessName.trim() || "The We Method", ownerName: values.ownerName.trim() };
      message = "Settings saved.";
    } else return;
    dialog.close();
    commit(message);
  });

  $("#menu-button").addEventListener("click", () => {
    if (matchMedia("(max-width: 800px)").matches) {
      const open = document.body.classList.toggle("sidebar-open");
      $("#menu-button").setAttribute("aria-expanded", String(open));
      $("#sidebar-scrim").hidden = !open;
    } else notify("Use the navigation on the left to open a workspace section.");
  });
  $("#sidebar-scrim").addEventListener("click", closeSidebar);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeSidebar(); });
  matchMedia("(max-width: 800px)").addEventListener("change", closeSidebar);
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  for (const selector of ["#global-search", "#application-search"]) $(selector).addEventListener("input", event => { query = event.target.value; page = 1; if (!["applications", "tracking", "clients", "files"].includes(view)) view = "applications"; render(); });
  $("#status-filter").addEventListener("change", event => { statusFilter = event.target.value; page = 1; render(); });
  $("#date-filter").addEventListener("change", event => { dateFilter = event.target.value; page = 1; render(); });
  $("#service-filter").addEventListener("change", event => { serviceFilter = event.target.value; page = 1; render(); });
  $("#sort-filter").addEventListener("change", event => { sortFilter = event.target.value; page = 1; render(); });
  $("#filter-button").addEventListener("click", () => { const filters = $("#extra-filters"); filters.hidden = !filters.hidden; $("#filter-button").setAttribute("aria-expanded", String(!filters.hidden)); if (!filters.hidden) $("#service-filter").focus(); });
  $("#workspace-content").addEventListener("change", event => {
    const id = event.target.dataset.taskId;
    const task = state.tasks.find(item => item.id === id);
    if (task) { task.done = event.target.checked; commit("Task updated."); }
  });
  $(".workspace-tabs").addEventListener("keydown", event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    const tabs = $$(".workspace-tabs [role='tab']");
    let index = tabs.indexOf(event.target);
    if (index < 0) return;
    event.preventDefault();
    index = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setView(tabs[index].dataset.view);
    tabs[index].focus();
  });
  $("#backup-input").addEventListener("change", async event => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error("The selected backup is too large.");
      const incoming = validateState(JSON.parse(await file.text()));
      if (!confirm("Replace the current workspace with this backup? Download your current backup first if you want to keep it.")) return;
      state = incoming;
      storageAvailable = true;
      selectedId = state.applications[0]?.id || "";
      view = "applications";
      clearFilters();
      dialog.close();
      commit("Workspace backup imported.");
    } catch (error) { notify(error instanceof SyntaxError ? "Select a valid JSON backup." : error.message); }
  });

  // Optional integration point for your existing backend. No network calls,
  // authentication, automatic form reception, or team permission logic is faked.
  window.TWMApplications = Object.freeze({
    getSnapshot: () => clone(state),
    replaceData: data => { state = validateState(data); storageAvailable = true; selectedId = state.applications[0]?.id || ""; clearFilters(); commit("Workspace synchronized."); },
    openNewApplication: () => applicationForm(),
    storageKey: STORAGE_KEY
  });

  render();
  if (!storageAvailable) notify("Browser storage is unavailable or an existing backup could not be read. Import a valid backup or download your work before leaving.");
})();