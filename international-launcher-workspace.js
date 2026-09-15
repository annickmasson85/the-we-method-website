document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-international-launcher";
  const standardPath = "images/international-launcher-standard.pdf";
  const recordPath = "images/international-control-record.pdf";

  if (supabase) {
    const session = await supabase.auth.getSession();
    if (!session.data || !session.data.session) {
      window.location.href = "signin.html";
      return;
    }
    const userRes = await supabase.auth.getUser();
    const user = (userRes.data && userRes.data.user) || session.data.session.user;
    const meta = (user && user.user_metadata) || {};
    const name = document.getElementById("member-profile-name");
    if (name) {
      name.textContent = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Client";
    }
    if (meta.avatar_url) {
      const photo = document.getElementById("header-photo");
      const icon = document.getElementById("header-icon");
      if (photo) {
        photo.src = meta.avatar_url;
        photo.hidden = false;
      }
      if (icon) icon.style.display = "none";
    }
  }

  function printPlate(path, kicker, title, note, label) {
    return `
      <div class="ws-print-plate">
        <p class="ws-kicker">${kicker}</p>
        <h3>${title}</h3>
        <p>${note}</p>
        <object class="ws-sheet" data="${path}" type="application/pdf">
          <p>The document could not be displayed in the browser. Use ${label} below.</p>
        </object>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" data-print="${path}">${label}</button>
        </div>
      </div>
    `;
  }

  function openRow(links) {
    return `<div class="ws-actions">${links.map((item) =>
      `<a class="ws-ghost" href="${item.href}">${item.label}</a>`
    ).join("")}</div>`;
  }

  const standardPlate = printPlate(
    standardPath,
    "INTERNAL STANDARD",
    "International Launcher Standard",
    "Reading document. Print for the planning file. This is not an immigration filing. Do not download or circulate.",
    "PRINT LAUNCHER STANDARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "LAUNCHER RECORD",
    "International Control Record",
    "Profile, professional team, investment index, package map, and counsel handoff. Indexes only. Print only.",
    "PRINT LAUNCHER RECORD"
  );

  const chapters = [
    {
      id: 1,
      title: "What this launcher is",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What this launcher is</h2>
        <p>A preparation method for an international owner organizing a U.S. rental project before it is shown to qualified professionals.</p>
        <h3>Two documents unique to this file</h3>
        <ul>
          <li><strong>International Launcher Standard</strong> — boundary, gate order, evidence rule.</li>
          <li><strong>International Control Record</strong> — this project’s written plates.</li>
        </ul>
        <p>Every operating manual already in the collection stays itself. This hub opens those rooms. It does not rewrite them.</p>
        <p class="ws-note">Prepare the business. Organize the investment. Meet the professionals.</p>
      `
    },
    {
      id: 2,
      title: "Boundary",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Boundary</h2>
        <p>This resource does not determine eligibility, select a classification, decide whether an investment is substantial or committed, judge source of funds, prepare filings, respond to government requests, or represent anyone.</p>
        <p>Ownership of a company is not authorization to work in the United States.</p>
        <p class="ws-note">Nothing in this house is visa-approved. Nothing here is a promise of admission, financing, or profit.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "Professionals first",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Professionals first</h2>
        <p>Name the advisory team before material capital moves: immigration counsel, business counsel, CPA, insurance, banking, licensing.</p>
        <p>Record questions for counsel. Do not answer them in this file.</p>
        <p class="ws-note">Pause any commitment that changes the model until the named professional has spoken.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Site and market",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Site and market</h2>
        <p>The planning picture lives in the Business Plan. Current local operating rules live in Local Rules.</p>
        <p>This launcher does not invent a second market study.</p>
        <p class="ws-note">Unverified demand is an assumption. Label it.</p>
        ${openRow([
          { href: "business-plan-workspace.html", label: "OPEN BUSINESS PLAN" },
          { href: "local-rules-workspace.html", label: "OPEN LOCAL RULES" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Investment index",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Investment index</h2>
        <p>Planned. Committed. Paid. Evidence referenced — not stored here.</p>
        <p>Working capital and reserve sit apart from startup purchases. Office and fleet costs are taken from those rooms, not recopied.</p>
        <p class="ws-note">The Record holds the index. Counsel holds the sensitive evidence.</p>
        ${openRow([
          { href: "essential-office-setup-equipment-checklist.html", label: "OPEN OFFICE" },
          { href: "fleet-workspace.html", label: "OPEN FLEET" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Formation index",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Formation index</h2>
        <p>Proposed ownership, entity questions, and a document index for counsel. Forming a U.S. company is separate from immigration status and work authorization.</p>
        <p class="ws-note">Do not present a structure as immigration-approved.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "The model",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>The model</h2>
        <p>Assumptions, stress, and the three-year working model live in Forecasting. This launcher cites that file. It does not reprint the tables.</p>
        <p class="ws-note">A modeled total is not a promise and is not an immigration finding.</p>
        ${openRow([
          { href: "forecasting-workspace.html", label: "OPEN FORECASTING" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "The operating house",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>The operating house</h2>
        <p>Reservation through return. Agreement. Safety and incident control. Fleet care. Local rules at the cart and at check-in.</p>
        <p>Open each room. Do not paste those manuals into this file.</p>
        <p class="ws-note">Operational claims must match what has actually been prepared.</p>
        ${openRow([
          { href: "sop-workspace.html", label: "OPEN SOP" },
          { href: "rental-agreement-workspace.html", label: "OPEN AGREEMENT" },
          { href: "fleet-workspace.html", label: "OPEN FLEET" },
          { href: "local-rules-workspace.html", label: "OPEN LOCAL RULES" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 9,
      title: "The house file",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>The house file</h2>
        <p>Customer, fleet, employee, vendor, insurance, and license records sit in the drawers already built. Version and custody stay with those Records.</p>
        <p class="ws-note">Highly sensitive investor records do not share a folder with the rental drawer.</p>
        ${openRow([
          { href: "essential-office-setup-equipment-checklist.html", label: "OPEN OFFICE" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 10,
      title: "Systems",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>Systems</h2>
        <p>Reservations, payment, books, mail, storage, backup, access. Name the tools the house actually uses. No vendor is required by this method.</p>
        <p class="ws-note">Ask counsel for the transfer channel they will accept before any passport or bank file moves.</p>
        ${openRow([
          { href: "essential-office-setup-equipment-checklist.html", label: "OPEN OFFICE" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 11,
      title: "People",
      html: `
        <p class="ws-kicker">SECTION 11</p>
        <h2>People</h2>
        <p>Owner role, providers versus employees, training if people are hired. Training already has its own Standard and Records.</p>
        <p class="ws-note">Work authorization, wages, and classification are professional questions. This file does not decide them.</p>
        ${openRow([
          { href: "employee-training-workspace.html", label: "OPEN TRAINING" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 12,
      title: "Assemble the package",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Assemble the package</h2>
        <p>Ten commercial folders for professional review. The narrative sits in the Business Plan. The indexes sit in this Record. Sensitive evidence travels on the professional’s channel.</p>
        <p class="ws-note">Nothing in the package is described as visa-approved.</p>
        ${openRow([
          { href: "business-plan-workspace.html", label: "OPEN BUSINESS PLAN" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 13,
      title: "Handoff to counsel",
      html: `
        <p class="ws-kicker">SECTION 13</p>
        <h2>Handoff to counsel</h2>
        <p>Short commercial summary. Planned / committed / paid. What is paused. Questions. Request log. Revisions after advice.</p>
        <p class="ws-note">Follow the professional’s instructions. This house does not file.</p>
        ${standardPlate}
      `
    },
    {
      id: 14,
      title: "Sequence to first operations",
      html: `
        <p class="ws-kicker">SECTION 14</p>
        <h2>Sequence to first operations</h2>
        <p>The Launch Roadmap owns the order from research to first reservation and first operating review. This launcher does not invent a second calendar.</p>
        <p class="ws-note">A filing date is not a launch date.</p>
        ${openRow([
          { href: "launch-roadmap-workspace.html", label: "OPEN LAUNCH ROADMAP" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 15,
      title: "After launch",
      html: `
        <p class="ws-kicker">SECTION 15</p>
        <h2>After launch</h2>
        <p>Actuals versus model. Material change. Professional notice when facts that were shown to counsel move.</p>
        <p class="ws-note">Growth review lives in Road Beyond. Do not expand from a forecast that has not met a year of actuals.</p>
        ${openRow([
          { href: "road-beyond-launch-workspace.html", label: "OPEN ROAD BEYOND" }
        ])}
        ${standardPlate}
      `
    },
    {
      id: 16,
      title: "The Record",
      html: `
        <p class="ws-kicker">SECTION 16</p>
        <h2>The Record</h2>
        <p>Entrepreneur plate. Advisory team. Counsel questions. Commitment stop. Investment index. Source-and-path index. Formation index. Package map. Handoff. Request log. Acknowledgment.</p>
        <p class="ws-note">Owner planning file. Not the customer drawer. Not a visa file.</p>
        ${recordPlate}
      `
    },
    {
      id: 17,
      title: "What never lives here",
      html: `
        <p class="ws-kicker">SECTION 17</p>
        <h2>What never lives here</h2>
        <p>Passports. Bank statements. Tax returns. Wires. Account credentials. Immigration records. Any document counsel asked to receive on a secure channel.</p>
        <p>Index the item. Name who holds it. Transfer as instructed.</p>
        <p class="ws-note">An ordinary shared workspace is not a counsel portal.</p>
        ${standardPlate}
      `
    },
    {
      id: 18,
      title: "Close the file",
      html: `
        <p class="ws-kicker">SECTION 18</p>
        <h2>Close the file</h2>
        <p>The Standard was printed through the method. The Record at section 16. This page only reprints if a plate was missed.</p>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" data-print="${standardPath}">PRINT LAUNCHER STANDARD</button>
          <button class="ws-ghost" type="button" data-print="${recordPath}">PRINT LAUNCHER RECORD</button>
        </div>
      `
    }
  ];

  let state = { current: 1, completed: [] };
  try {
    state = JSON.parse(localStorage.getItem(storageKey) || "null") || state;
  } catch (error) {
    state = { current: 1, completed: [] };
  }

  const total = chapters.length;
  const chapterNav = document.getElementById("ws-chapters");
  const stage = document.getElementById("ws-stage");

  function pad(id) {
    return String(id).padStart(2, "0");
  }

  function isOpen(id) {
    return id === 1 || state.completed.includes(id - 1);
  }

  function bindPrintButtons() {
    stage.querySelectorAll("[data-print]").forEach((button) => {
      button.addEventListener("click", () => {
        const path = button.getAttribute("data-print");
        const frame = button.closest(".ws-print-plate")?.querySelector(".ws-sheet");
        if (frame && frame.contentWindow) {
          frame.contentWindow.focus();
          frame.contentWindow.print();
          return;
        }
        const printWindow = window.open(path, "_blank");
        if (printWindow) printWindow.focus();
      });
    });
  }

  function renderNav() {
    chapterNav.innerHTML = "";
    chapters.forEach((chapter) => {
      const button = document.createElement("button");
      const open = isOpen(chapter.id);
      const done = state.completed.includes(chapter.id);
      button.className = "ws-chapter";
      if (state.current === chapter.id) button.classList.add("is-active");
      if (!open) button.classList.add("is-locked");
      button.type = "button";
      button.innerHTML = "<span>" + pad(chapter.id) + "  " + chapter.title + "</span><small>" + (done ? "DONE" : open ? "OPEN" : "LOCKED") + "</small>";
      button.addEventListener("click", () => {
        if (!open) return;
        state.current = chapter.id;
        save();
        render();
      });
      chapterNav.appendChild(button);
    });
  }

  function renderStage() {
    const current = chapters.find((item) => item.id === state.current) || chapters[0];
    const done = state.completed.includes(current.id);
    stage.innerHTML = current.html + (done
      ? '<div class="ws-actions"><a class="ws-ghost" href="private-library.html">RETURN TO COLLECTION</a></div>'
      : '<div class="ws-actions"><button class="ws-button" type="button" id="ws-complete">MARK COMPLETE</button></div>');

    document.getElementById("ws-complete")?.addEventListener("click", () => {
      if (!state.completed.includes(current.id)) state.completed.push(current.id);
      if (current.id < chapters.length) state.current = current.id + 1;
      save();
      render();
    });

    bindPrintButtons();
  }

  function renderProgress() {
    const done = state.completed.length;
    document.getElementById("ws-progress-count").textContent = Math.min(done + 1, total) + " / " + total;
    document.getElementById("ws-progress-label").textContent = done >= total
      ? "Package ready for the file"
      : "Section " + pad(state.current) + " open";
    document.getElementById("ws-bar-fill").style.width = Math.round((done / total) * 100) + "%";
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function render() {
    renderNav();
    renderStage();
    renderProgress();
  }

  render();
});