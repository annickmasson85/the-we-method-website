const WORKSPACE_KEY = "twm.applications.workspace.v1";
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function loadWorkspace() {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    return raw ? JSON.parse(raw) : { applications: [] };
  } catch {
    return { applications: [] };
  }
}

function saveWorkspace(state) {
  try { localStorage.setItem(WORKSPACE_KEY, JSON.stringify(state)); } catch {}
}

function mapStatus(status) {
  if (status === "approved" || status === "completed" || status === "in-progress") return "accepted";
  if (status === "declined") return "declined";
  return "pending";
}

function initials(name) {
  return (name || "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}

function getApps() {
  const state = loadWorkspace();
  return (state.applications || []).map(app => ({
    id: app.id,
    name: app.client || app.business || "Client",
    initials: initials(app.client || app.business),
    company: app.business || "",
    service: app.service || "",
    date: new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    email: app.email || "",
    phone: app.phone || "",
    notes: app.notes || "",
    status: mapStatus(app.status),
    rawStatus: app.status
  }));
}

let filter = "pending";
let selected = "";
let confirmation = null;

function render() {
  const apps = getApps();
  const counts = { pending: 0, accepted: 0, declined: 0 };
  apps.forEach(a => counts[a.status]++);
  Object.keys(counts).forEach(s => $(s + "-count").textContent = counts[s]);
  $("queue-count").textContent = counts.pending + " to review";
  document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b.dataset.filter === filter));
  const query = $("search").value.trim().toLowerCase();
  const visible = apps.filter(a => (filter === "all" || a.status === filter) && [a.name, a.company, a.service].join(" ").toLowerCase().includes(query));
  if (!selected && visible.length) selected = visible[0].id;
  $("application-list").innerHTML = visible.length
    ? visible.map(a => `<button class="request ${selected === a.id ? "selected" : ""}" data-id="${esc(a.id)}"><span class="avatar">${esc(a.initials)}</span><span class="request-main"><span class="name">${esc(a.name)}</span><span class="company" style="display:block">${esc(a.company)}</span><span class="service" style="display:block">${esc(a.service)}</span>${a.status !== "pending" ? `<span class="status ${a.status}" style="margin-top:8px">${a.status === "accepted" ? "Accepted" : "Declined"}</span>` : ""}</span><span style="text-align:right"><span class="arrow">›</span><span class="request-date" style="display:block">${esc(a.date.slice(0, 6))}</span></span></button>`).join("")
    : '<div class="empty">No applications in this category.</div>';
  document.querySelectorAll("[data-id]").forEach(b => b.addEventListener("click", () => { selected = b.dataset.id; confirmation = null; render(); }));
  renderDetail();
}

function field(label, value) {
  return `<div><span class="field-label">${esc(label)}</span><div class="field-value">${esc(value || "—")}</div></div>`;
}

function renderDetail() {
  const apps = getApps();
  const a = apps.find(v => v.id === selected);
  if (!a) { $("detail").innerHTML = '<div class="empty">Select an application to review.</div>'; return; }
  const label = a.status === "pending" ? "Awaiting decision" : a.status === "accepted" ? "Accepted" : "Declined";
  $("detail").innerHTML = `<div class="detail-top"><span>APPLICATION REVIEW</span><span>${esc(a.id)}</span></div><h2>${esc(a.name)}</h2><p class="company-detail">${esc(a.company)}</p><span class="status ${esc(a.status)}">${label}</span><div class="section"><div class="detail-grid">${field("SERVICE REQUESTED", a.service)}${field("EMAIL", a.email)}${field("PHONE", a.phone)}${field("REQUEST DATE", a.date)}</div></div><div class="section"><h3>Notes</h3><p>${esc(a.notes || "No notes yet.")}</p></div><div class="section" id="decision"><h3>Final decision</h3>${a.status === "pending" ? decisionMarkup() : "<p>Review completed. Final status: " + label + ".</p>"}</div>`;
  bindDecision();
}

function decisionMarkup() {
  if (!confirmation) return '<p>Review the complete application before selecting a decision.</p><div class="button-row"><button class="btn danger" id="decline">Decline Application</button><button class="btn" id="accept">Accept Application</button></div>';
  return `<div class="confirm"><strong>Confirm ${confirmation === "accepted" ? "acceptance" : "decline"}?</strong><p>This will update the application status in your workspace.</p><div class="button-row"><button class="btn secondary" id="cancel">Cancel</button><button class="btn ${confirmation === "declined" ? "danger-solid" : ""}" id="confirm">Confirm Decision</button></div></div>`;
}

function bindDecision() {
  const accept = $("accept"), decline = $("decline"), cancel = $("cancel"), confirm = $("confirm");
  if (accept) accept.onclick = () => { confirmation = "accepted"; renderDetail(); };
  if (decline) decline.onclick = () => { confirmation = "declined"; renderDetail(); };
  if (cancel) cancel.onclick = () => { confirmation = null; renderDetail(); };
  if (confirm) confirm.onclick = () => {
    const state = loadWorkspace();
    const app = (state.applications || []).find(v => v.id === selected);
    if (app && mapStatus(app.status) === "pending") {
      app.status = confirmation === "accepted" ? "approved" : "declined";
      app.updatedAt = new Date().toISOString();
      saveWorkspace(state);
    }
    confirmation = null;
    render();
  };
}

document.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => { filter = b.dataset.filter; confirmation = null; render(); }));
$("search").addEventListener("input", render);
render();