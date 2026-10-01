(() => {
  "use strict";

  const STORAGE_KEY = "twm.weeklyTasks.v1";
  const CATEGORIES = {
    fleet: { label: "Fleet", icon: "cart" },
    clients: { label: "Clients", icon: "document" },
    marketing: { label: "Marketing", icon: "globe" },
    operations: { label: "Operations", icon: "users" },
    purchase: { label: "Purchase", icon: "fleet" },
    finance: { label: "Finance", icon: "chart" },
    planning: { label: "Planning", icon: "calendar" },
    maintenance: { label: "Maintenance", icon: "tool" }
  };
  const STATUSES = {
    todo: "To Do",
    progress: "In Progress",
    completed: "Completed"
  };
  const PRIORITIES = { high: "High", medium: "Medium", low: "Low" };

  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  const icon = (name, extra = "") =>
    `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const uid = () =>
    globalThis.crypto?.randomUUID?.() ||
    `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  function fromISO(value) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    return date;
  }
  function toISO(date) {
    return [
      String(date.getFullYear()).padStart(4, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }
  function validDate(value) {
    return (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      Number(value.slice(0, 4)) >= 1900 &&
      toISO(fromISO(value)) === value
    );
  }
  function today() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const get = (type) => parts.find((part) => part.type === type).value;
    return `${get("year")}-${get("month")}-${get("day")}`;
  }
  function addDays(value, days) {
    const date = fromISO(value);
    date.setDate(date.getDate() + days);
    return toISO(date);
  }
  function weekStart(value) {
    return addDays(value, -((fromISO(value).getDay() + 6) % 7));
  }
  function formatDate(value, year = false) {
    return fromISO(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(year ? { year: "numeric" } : {})
    });
  }
  function weekLabel(value) {
    const end = addDays(value, 6);
    const startDate = fromISO(value);
    const endDate = fromISO(end);
    const month = (date) => date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    if (startDate.getFullYear() !== endDate.getFullYear()) {
      return `${formatDate(value, true)} – ${formatDate(end, true)}`.toUpperCase();
    }
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${month(startDate)} ${startDate.getDate()} – ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    return `${month(startDate)} ${startDate.getDate()} – ${month(endDate)} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  function normalizeTasks(items) {
    if (!Array.isArray(items)) throw new Error("Invalid task list");
    const ids = new Set();
    return items.filter((task) => {
      const valid =
        task &&
        typeof task.id === "string" && task.id && !ids.has(task.id) &&
        (task.scope === "personal" || task.scope === "team") &&
        typeof task.title === "string" && task.title.trim() && task.title.length <= 180 &&
        validDate(task.due) &&
        Object.hasOwn(STATUSES, task.status) &&
        Object.hasOwn(PRIORITIES, task.priority) &&
        Object.hasOwn(CATEGORIES, task.category) &&
        (task.scope !== "team" || (typeof task.assignee === "string" && task.assignee.trim()));
      if (valid) ids.add(task.id);
      return valid;
    }).map((task) => ({
      id: task.id,
      scope: task.scope,
      title: task.title.trim(),
      priority: task.priority,
      category: task.category,
      due: task.due,
      status: task.status,
      assignee: task.scope === "team" ? task.assignee.trim().slice(0, 80) : "",
      notes: typeof task.notes === "string" ? task.notes.slice(0, 1500) : "",
      previousStatus: task.previousStatus === "progress" ? "progress" : "todo"
    }));
  }

  let storageAvailable = true;
  let lastSavedText = "Nothing saved yet";

  function readTasks() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === null) return [];
      const data = JSON.parse(value);
      if (!data || data.version !== 1 || !Array.isArray(data.tasks)) return [];
      if (data.isDemo === true) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      return normalizeTasks(data.tasks);
    } catch {
      storageAvailable = false;
      return [];
    }
  }

  let tasks = readTasks();
  let currentWeek = weekStart(today());
  const filters = { personal: "all", team: "all" };
  let searchTerm = "";
  let pendingDelete = null;
  let toastTimer;
  const taskDialog = $("#task-dialog");
  const taskForm = $("#task-form");
  const viewDialog = $("#view-dialog");

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    clearTimeout(toastTimer);
    node.textContent = message;
    node.hidden = false;
    toastTimer = setTimeout(() => { node.hidden = true; }, 4200);
  }
  function persistTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, isDemo: false, tasks }));
      storageAvailable = true;
      lastSavedText = "Saved in this browser";
    } catch {
      storageAvailable = false;
      lastSavedText = "Saved for this session only";
    }
    render();
    return storageAvailable;
  }
  function commit(message) {
    toast(persistTasks() ? message : `${message} This change stays for this visit only.`);
  }
  function weekTasks(scope) {
    const end = addDays(currentWeek, 6);
    return tasks.filter((task) => (!scope || task.scope === scope) && task.due >= currentWeek && task.due <= end);
  }
  function visibleTasks(scope) {
    return weekTasks(scope).filter((task) => {
      const matchesStatus = filters[scope] === "all" || task.status === filters[scope];
      const haystack = [task.title, task.assignee, CATEGORIES[task.category].label, task.notes, PRIORITIES[task.priority]].join(" ").toLowerCase();
      return matchesStatus && haystack.includes(searchTerm);
    }).sort((a, b) => a.due.localeCompare(b.due) || a.title.localeCompare(b.title));
  }
  function categoryTag(task) {
    return `<span class="category-tag category-${task.category}">${CATEGORIES[task.category].label.toUpperCase()}</span>`;
  }
  function taskDate(task) {
    const overdue = task.due < today() && task.status !== "completed";
    return `<time class="task-date ${overdue ? "is-overdue" : ""}" datetime="${task.due}">${formatDate(task.due)}</time>`;
  }
  function actionButton(task, action, label, glyph) {
    return `<button type="button" class="icon-button" data-action="${action}" data-id="${escapeHtml(task.id)}" aria-label="${label}: ${escapeHtml(task.title)}" title="${label}">${icon(glyph)}</button>`;
  }
  function personalRow(task) {
    const completed = task.status === "completed";
    return `
      <div class="personal-row ${completed ? "is-complete" : ""}">
        <input type="checkbox" class="task-check" data-id="${escapeHtml(task.id)}" ${completed ? "checked" : ""} aria-label="${completed ? "Reopen" : "Complete"} task: ${escapeHtml(task.title)}">
        <span class="priority priority-${task.priority}"><span class="dot"></span>${PRIORITIES[task.priority]}</span>
        ${icon(CATEGORIES[task.category].icon, "category-icon")}
        <button class="task-title" data-action="edit" data-id="${escapeHtml(task.id)}">${escapeHtml(task.title)}</button>
        ${categoryTag(task)}
        ${taskDate(task)}
        <div class="row-actions">
          ${actionButton(task, "edit", "Edit task", "edit")}
          ${actionButton(task, "duplicate", "Duplicate task", "copy")}
          ${actionButton(task, "delete", "Delete task", "trash")}
        </div>
      </div>`;
  }
  function initials(name) {
    return name.split(/\s+/).filter(Boolean).map((word) => word[0]).slice(0, 2).join("").toUpperCase() || "•";
  }
  function teamRow(task) {
    const completed = task.status === "completed";
    return `
      <div class="team-row ${completed ? "is-complete" : ""}">
        <div class="assignee">
          <span class="avatar" aria-hidden="true">${escapeHtml(initials(task.assignee))}</span>
          <span>${escapeHtml(task.assignee)}</span>
        </div>
        <div class="team-task-copy">
          <button class="task-title" data-action="edit" data-id="${escapeHtml(task.id)}">${escapeHtml(task.title)}</button>
          ${categoryTag(task)}
          ${taskDate(task)}
        </div>
        <button class="team-status status-${task.status}" data-action="cycle-status" data-id="${escapeHtml(task.id)}">
          <span class="dot"></span>${STATUSES[task.status]}
        </button>
        <div class="row-actions">
          ${actionButton(task, "edit", "Edit task", "edit")}
          ${actionButton(task, "delete", "Delete task", "trash")}
        </div>
      </div>`;
  }
  function renderFilters(scope) {
    const current = weekTasks(scope);
    const counts = { all: current.length, todo: 0, progress: 0, completed: 0 };
    current.forEach((task) => { counts[task.status] += 1; });
    const labels = { all: "ALL", todo: "TO DO", progress: "IN PROGRESS", completed: "COMPLETED" };
    $(`#${scope}-filters`).innerHTML = Object.entries(labels).map(([key, label]) =>
      `<button type="button" class="filter-button" data-filter="${key}" data-scope="${scope}" aria-pressed="${filters[scope] === key}">${label} (${counts[key]})</button>`
    ).join("");
  }
  function emptyState(scope) {
    const hasTasks = weekTasks(scope).length > 0;
    return `<div class="empty-state">${icon(scope === "team" ? "users" : "calendar")}<p>${hasTasks ? "No matching tasks" : "Nothing scheduled"}</p><small>${hasTasks ? "Try another filter or search." : "Add a task when you are ready."}</small></div>`;
  }
  function render() {
    $("#week-label").textContent = weekLabel(currentWeek);
    ["personal", "team"].forEach((scope) => {
      renderFilters(scope);
      const visible = visibleTasks(scope);
      $(`#${scope}-list`).innerHTML = visible.length ? visible.map(scope === "personal" ? personalRow : teamRow).join("") : emptyState(scope);
    });
    const personal = weekTasks("personal");
    const done = personal.filter((task) => task.status === "completed").length;
    const percent = personal.length ? Math.round((done / personal.length) * 100) : 0;
    $("#personal-percent").textContent = `${percent}%`;
    $("#personal-progress-text").textContent = `${done} of ${personal.length} complete`;
    $("#personal-progress").setAttribute("aria-valuenow", String(percent));
    $("#personal-progress").firstElementChild.style.width = `${percent}%`;
    $("#reminder-dot").hidden = !tasks.some((task) => task.status !== "completed" && task.due <= today());
    const indicator = $("#save-indicator");
    if (indicator) indicator.textContent = storageAvailable ? lastSavedText : "Saved for this session only";
  }
  function defaultDue() {
    const now = today();
    return weekStart(now) === currentWeek ? now : currentWeek;
  }
  function changeWeek(value) {
    currentWeek = weekStart(value);
    $("#quick-date").value = defaultDue();
    render();
  }
  function fillOptions(select, options, label) {
    select.innerHTML = options.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(label ? label(value) : value)}</option>`).join("");
  }
  ["#quick-category", "#edit-category"].forEach((id) => {
    fillOptions($(id), Object.keys(CATEGORIES), (value) => CATEGORIES[value].label);
  });

  const assigneeField = $("#edit-assignee");
  if (assigneeField && assigneeField.tagName === "SELECT") {
    const input = document.createElement("input");
    input.id = "edit-assignee";
    input.name = assigneeField.name || "assignee";
    input.maxLength = 80;
    input.placeholder = "Type a name";
    input.autocomplete = "name";
    assigneeField.replaceWith(input);
  }
  function syncScope() {
    const isTeam = taskForm.elements.scope.value === "team";
    const field = $("#assignee-field");
    if (field) field.hidden = !isTeam;
    taskForm.elements.assignee.required = isTeam;
  }
  function openTask(scope, task = null) {
    taskForm.reset();
    $("#task-form-error").hidden = true;
    const fields = task || {
      id: "", title: "", scope, priority: "medium",
      category: scope === "team" ? "fleet" : "planning",
      due: defaultDue(), status: "todo", assignee: "", notes: ""
    };
    ["id", "title", "scope", "priority", "category", "due", "status", "assignee", "notes"].forEach((key) => {
      if (taskForm.elements[key]) taskForm.elements[key].value = fields[key] || "";
    });
    syncScope();
    $("#task-dialog-title").textContent = task ? "Edit a task" : (scope === "team" ? "Assign a team task" : "Add a task");
    taskDialog.showModal();
    $("#edit-title").focus();
  }
  function setStatus(task, status) {
    if (status === "completed" && task.status !== "completed") task.previousStatus = task.status;
    task.status = status;
    commit(status === "completed" ? "Task completed." : "Task status updated.");
  }
  function handleAction(action, task) {
    if (action === "edit") {
      if (viewDialog.open) viewDialog.close();
      openTask(task.scope, task);
    }
    if (action === "cycle-status") {
      setStatus(task, { todo: "progress", progress: "completed", completed: "todo" }[task.status]);
    }
    if (action === "duplicate") {
      tasks.push({ ...task, id: uid(), title: `${task.title.slice(0, 173)} (copy)`, status: "todo", previousStatus: "todo" });
      filters[task.scope] = "all";
      commit("Task duplicated.");
    }
    if (action === "delete") {
      pendingDelete = task.id;
      $("#delete-task-name").textContent = task.title;
      $("#delete-dialog").showModal();
    }
  }

  document.addEventListener("click", (event) => {
    const close = event.target.closest("[data-close-dialog]");
    if (close) { close.closest("dialog").close(); return; }
    const filter = event.target.closest("[data-filter]");
    if (filter) {
      filters[filter.dataset.scope] = filter.dataset.filter;
      render();
      return;
    }
    const button = event.target.closest("[data-action][data-id]");
    if (!button) return;
    const task = tasks.find((item) => item.id === button.dataset.id);
    if (task) handleAction(button.dataset.action, task);
  });
  $("#personal-list").addEventListener("change", (event) => {
    if (!event.target.matches(".task-check")) return;
    const task = tasks.find((item) => item.id === event.target.dataset.id);
    if (!task) return;
    setStatus(task, event.target.checked ? "completed" : task.previousStatus || "todo");
  });
  $("#add-personal").addEventListener("click", () => openTask("personal"));
  $("#add-team").addEventListener("click", () => openTask("team"));
  $("#assign-task").addEventListener("click", () => openTask("team"));
  $("#edit-scope").addEventListener("change", syncScope);
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(taskForm));
    fields.title = fields.title.trim();
    fields.notes = (fields.notes || "").trim();
    fields.assignee = (fields.assignee || "").trim();
    const error = $("#task-form-error");
    if (!fields.title || !validDate(fields.due)) {
      error.textContent = "Enter a task title and a valid due date.";
      error.hidden = false;
      return;
    }
    if (fields.scope === "team" && !fields.assignee) {
      error.textContent = "Type the name of the person you are assigning.";
      error.hidden = false;
      return;
    }
    if (fields.scope === "personal") fields.assignee = "";
    const existing = tasks.find((task) => task.id === fields.id);
    if (existing) {
      const previousStatus = fields.status === "completed" && existing.status !== "completed" ? existing.status : existing.previousStatus;
      Object.assign(existing, fields, { previousStatus });
    } else {
      tasks.push({ ...fields, id: uid(), previousStatus: "todo" });
    }
    filters[fields.scope] = "all";
    searchTerm = "";
    $("#task-search").value = "";
    currentWeek = weekStart(fields.due);
    $("#quick-date").value = defaultDue();
    taskDialog.close();
    commit(existing ? "Task updated." : "Task added.");
  });
  $("#quick-add-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (!fields.title.trim() || !validDate(fields.due)) {
      form.elements.title.setCustomValidity("Enter a task title and a valid due date.");
      form.reportValidity();
      return;
    }
    tasks.push({
      ...fields, title: fields.title.trim(), id: uid(), scope: "personal",
      status: "todo", previousStatus: "todo", assignee: "", notes: ""
    });
    filters.personal = "all";
    searchTerm = "";
    $("#task-search").value = "";
    changeWeek(fields.due);
    form.elements.title.value = "";
    commit("Task added.");
    form.elements.title.focus();
  });
  $("#quick-add-form").elements.title.addEventListener("input", (event) => event.target.setCustomValidity(""));
  $("#confirm-delete").addEventListener("click", () => {
    tasks = tasks.filter((task) => task.id !== pendingDelete);
    pendingDelete = null;
    $("#delete-dialog").close();
    commit("Task deleted.");
  });
  $("#task-search").addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    render();
  });
  $("#previous-week").addEventListener("click", () => changeWeek(addDays(currentWeek, -7)));
  $("#next-week").addEventListener("click", () => changeWeek(addDays(currentWeek, 7)));
  $("#today-button").addEventListener("click", () => changeWeek(today()));
  $("#choose-week").addEventListener("click", () => {
    $("#week-date").value = currentWeek;
    $("#week-dialog").showModal();
  });
  $("#week-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validDate($("#week-date").value)) return;
    changeWeek($("#week-date").value);
    $("#week-dialog").close();
  });
  function openView(title, subtitle, content) {
    $("#view-dialog-title").textContent = title;
    $("#view-dialog-subtitle").textContent = subtitle;
    $("#view-dialog-content").innerHTML = content;
    viewDialog.showModal();
  }
  $("#view-calendar").addEventListener("click", () => {
    const current = weekTasks();
    const content = Array.from({ length: 7 }, (_, day) => {
      const date = addDays(currentWeek, day);
      const items = current.filter((task) => task.due === date);
      const heading = fromISO(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
      const rows = items.length
        ? items.map((task) => `<button class="calendar-task" data-action="edit" data-id="${escapeHtml(task.id)}"><span>${escapeHtml(task.title)}</span><small>${task.scope === "team" ? escapeHtml(task.assignee) : "Personal"} · ${STATUSES[task.status]}</small></button>`).join("")
        : "<p>No tasks scheduled.</p>";
      return `<section class="calendar-day"><h3>${heading}</h3>${rows}</section>`;
    }).join("");
    openView("Weekly calendar", weekLabel(currentWeek), content);
  });
  $("#team-report").addEventListener("click", () => {
    const current = weekTasks("team");
    const done = current.filter((task) => task.status === "completed").length;
    const percent = current.length ? Math.round((done / current.length) * 100) : 0;
    const names = [...new Set(current.map((task) => task.assignee))];
    const summary = `<div class="report-summary"><strong>${percent}%</strong><p>${done} of ${current.length} team tasks completed<br><span class="optional">For the selected week</span></p></div>`;
    const members = names.length
      ? names.map((name) => {
          const items = current.filter((task) => task.assignee === name);
          const complete = items.filter((task) => task.status === "completed").length;
          const inProgress = items.filter((task) => task.status === "progress").length;
          const value = Math.round((complete / items.length) * 100);
          return `<div class="report-member"><div class="assignee"><span class="avatar">${escapeHtml(initials(name))}</span>${escapeHtml(name)}</div><div><div class="progress-track"><span style="width:${value}%"></span></div><small>${complete} completed · ${inProgress} in progress · ${items.length - complete - inProgress} to do</small></div><strong>${complete}/${items.length}</strong></div>`;
        }).join("")
      : `<p class="dialog-description">No team tasks this week.</p>`;
    openView("Team report", weekLabel(currentWeek), summary + members);
  });
  $("#notifications-button").addEventListener("click", () => {
    const now = today();
    const pending = tasks.filter((task) => task.status !== "completed" && task.due <= now).sort((a, b) => a.due.localeCompare(b.due));
    const content = pending.length
      ? pending.map((task) => `<div class="calendar-day"><button class="calendar-task" data-action="edit" data-id="${escapeHtml(task.id)}"><span>${escapeHtml(task.title)}</span><small>${task.due < now ? "Overdue" : "Due today"} · ${formatDate(task.due, true)}</small></button></div>`).join("")
      : `<p class="dialog-description">Nothing is overdue or due today.</p>`;
    openView("Task reminders", formatDate(now, true).toUpperCase(), content);
  });
  function toggleSidebar(open) {
    $("#sidebar").classList.toggle("is-open", open);
    $("#sidebar-shade").hidden = !open;
    $("#menu-toggle").setAttribute("aria-expanded", String(open));
  }
  $("#menu-toggle").addEventListener("click", () => toggleSidebar(!$("#sidebar").classList.contains("is-open")));
  $("#sidebar-shade").addEventListener("click", () => toggleSidebar(false));
  window.addEventListener("resize", () => { if (window.innerWidth > 900) toggleSidebar(false); });
  $("#quick-date").value = defaultDue();
  if (typeof window.twmSignOut === "function") {
    const signOut = $("#log-out");
    signOut.disabled = false;
    signOut.addEventListener("click", async () => {
      signOut.disabled = true;
      try { await window.twmSignOut(); }
      catch { toast("Sign-out could not be completed. Please try again."); signOut.disabled = false; }
    });
  }
  render();
})();