document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-international-launcher";

  const e2Standard = "images/international-launcher-standard.pdf";
  const e2Record = "images/international-control-record.pdf";
  const planStandard = "images/business-plan-standard.pdf";
  const planRecord = "images/business-plan-record.pdf";
  const forecastStandard = "images/forecasting-standard.pdf";
  const forecastRecord = "images/forecast-control-record.pdf";
  const officePacket = "images/essential-office-setup-print-packet.pdf";
  const sopStandard = "images/sop-operating-standard.pdf";
  const agreementRegister = "images/rental-agreement-control-register.pdf";
  const agreementPacket = "images/rental-agreement-execution-packet.pdf";
  const localStandard = "images/local-rules-standard.pdf";
  const guestCard = "images/guest-rules-card.pdf";
  const localRecord = "images/local-rules-control-record.pdf";
  const trainingStandard = "images/employee-training-standard.pdf";
  const trainingRecord = "images/employee-training-record.pdf";
  const employmentRegister = "images/employment-control-register.pdf";
  const fleetStandard = "images/fleet-standard.pdf";
  const fleetRecord = "images/fleet-unit-record.pdf";
  const launchStandard = "images/launch-roadmap-standard.pdf";
  const launchRecord = "images/launch-control-record.pdf";
  const growthStandard = "images/road-beyond-launch-standard.pdf";
  const growthRecord = "images/growth-control-record.pdf";

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

  const chapters = [
    {
      id: 1,
      title: "What this launcher is",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What this launcher is</h2>
        <p>The ten phases guide an international owner building a U.S. rental project. They stay on this screen. They are not printed.</p>
        <p>This is not a course, a visa service, a certification, or a promise of admission, work authorization, financing, or profit. Ownership of a company is not authorization to work in the United States.</p>
        <h3>How this house works</h3>
        <ul>
          <li>Read the phase.</li>
          <li>Make the phase decision: continue, adjust, or stop.</li>
          <li>Print only the manual that belongs to that subject — after the explanation.</li>
          <li>Pause when counsel, tax, insurance, licensing, or banking can change the next commitment.</li>
        </ul>
        <p class="ws-note">We share the method. You decide how to build it.</p>
      `
    },
    {
      id: 2,
      title: "E-2 package organizer",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>E-2 package organizer</h2>
        <p>Organize the commercial file before it is shown to qualified professionals. Index planned, committed, and paid amounts. Name the advisory team. Do not store passports, bank statements, tax returns, or immigration records in this workspace.</p>
        <p>This organizer does not determine eligibility, choose a classification, judge source of funds, or file anything.</p>
        <p class="ws-note">Print these two plates only. They are the international layer — not the ten phases.</p>
        ${printPlate(e2Standard, "PRINT THIS MANUAL", "International Launcher Standard", "Boundary, gates, pause, evidence rule.", "PRINT E-2 STANDARD")}
        ${printPlate(e2Record, "PRINT THIS MANUAL", "International Control Record", "Team, investment index, package map, counsel handoff.", "PRINT E-2 RECORD")}
      `
    },
    {
      id: 3,
      title: "Phase 1 — Plan the site",
      html: `
        <p class="ws-kicker">SECTION 03 · PHASE 1</p>
        <h2>Plan the site</h2>
        <p>Build the vision before the investment. Name the market, the place, the customer, the competition, the model, and the planning decision before a fleet, a lease, or equipment.</p>
        <h3>This phase organizes</h3>
        <ul>
          <li>Market research and seasonal demand</li>
          <li>Location and local operating limits</li>
          <li>Customer and competitor picture</li>
          <li>Commercial model and first investment picture</li>
          <li>GO / ADJUST / RECONSIDER</li>
        </ul>
        <p class="ws-note">This phase is not printed. The Plan and Local Rules manuals print below.</p>
        ${openRow([
          { href: "business-plan-workspace.html", label: "OPEN BUSINESS PLAN" },
          { href: "local-rules-workspace.html", label: "OPEN LOCAL RULES" }
        ])}
        ${printPlate(planStandard, "PRINT THIS MANUAL", "Business Plan Standard", "Planning picture and planning decision.", "PRINT PLAN STANDARD")}
        ${printPlate(planRecord, "PRINT THIS MANUAL", "Business Plan Record", "This house’s written planning plates.", "PRINT PLAN RECORD")}
        ${printPlate(localStandard, "PRINT THIS MANUAL", "Local Rules Standard", "How operating limits are verified and shown.", "PRINT LOCAL RULES STANDARD")}
      `
    },
    {
      id: 4,
      title: "Phase 2 — Foundation",
      html: `
        <p class="ws-kicker">SECTION 04 · PHASE 2</p>
        <h2>Foundation</h2>
        <p>Turn the concept into an organized foundation: proposed structure, banking, insurance questions, license index, and the house file. Forming a U.S. company is not work authorization and is not readiness to take a reservation.</p>
        <h3>This phase organizes</h3>
        <ul>
          <li>Ownership and entity questions for counsel</li>
          <li>Banking and recordkeeping</li>
          <li>Insurance questions for the intended activity</li>
          <li>Where each record lives</li>
        </ul>
        <p class="ws-note">This phase is not printed. The Office manual prints below.</p>
        ${openRow([
          { href: "essential-office-workspace.html", label: "OPEN OFFICE" },
          { href: "business-plan-workspace.html", label: "OPEN BUSINESS PLAN" }
        ])}
        ${printPlate(officePacket, "PRINT THIS MANUAL", "Office Setup Packet", "The physical and file house.", "PRINT OFFICE PACKET")}
      `
    },
    {
      id: 5,
      title: "Phase 3 — The model",
      html: `
        <p class="ws-kicker">SECTION 05 · PHASE 3</p>
        <h2>The model</h2>
        <p>Understand the numbers before committing the investment. Label assumptions. Separate working capital from startup purchases. Stress a lower case before treating the base case as supportable.</p>
        <p class="ws-note">A modeled total is not a promise and is not an immigration finding. This phase is not printed.</p>
        ${openRow([
          { href: "forecasting-workspace.html", label: "OPEN FORECASTING" }
        ])}
        ${printPlate(forecastStandard, "PRINT THIS MANUAL", "Forecasting Standard", "Assumption control, model, stress, decision.", "PRINT FORECAST STANDARD")}
        ${printPlate(forecastRecord, "PRINT THIS MANUAL", "Forecast Control Record", "This house’s written model.", "PRINT FORECAST RECORD")}
      `
    },
    {
      id: 6,
      title: "Phase 4 — Systems",
      html: `
        <p class="ws-kicker">SECTION 06 · PHASE 4</p>
        <h2>Systems</h2>
        <p>Name the tools that carry reservations, payment, books, mail, storage, backup, and access. No vendor is required by this method. Sensitive investor files do not travel on an ordinary shared folder.</p>
        <p class="ws-note">This phase is not printed. The Office packet prints below.</p>
        ${openRow([
          { href: "essential-office-workspace.html", label: "OPEN OFFICE" }
        ])}
        ${printPlate(officePacket, "PRINT THIS MANUAL", "Office Setup Packet", "Systems sit in the office file.", "PRINT OFFICE PACKET")}
      `
    },
    {
      id: 7,
      title: "Phase 5 — Operating house",
      html: `
        <p class="ws-kicker">SECTION 07 · PHASE 5</p>
        <h2>Operating house</h2>
        <p>Reservation through return. Agreement and waiver. Inspection and orientation. Local rules at check-in. Incident control. A procedure that has not been tested is not ready.</p>
        <p class="ws-note">This phase is not printed. SOP, Agreement, Pickup &amp; Return, and Local Rules print below.</p>
        ${openRow([
          { href: "sop-workspace.html", label: "OPEN SOP" },
          { href: "rental-agreement-workspace.html", label: "OPEN AGREEMENT" },
          { href: "pickup-return-workspace.html", label: "OPEN PICKUP &amp; RETURN" },
          { href: "local-rules-workspace.html", label: "OPEN LOCAL RULES" }
        ])}
        ${printPlate(sopStandard, "PRINT THIS MANUAL", "SOP Operating Standard", "Safety and incident control.", "PRINT SOP STANDARD")}
        ${printPlate(agreementPacket, "PRINT THIS MANUAL", "Agreement Execution Packet", "Customer-facing rental packet.", "PRINT AGREEMENT PACKET")}
        ${printPlate(agreementRegister, "PRINT THIS MANUAL", "Agreement Control Register", "Edition and execution control.", "PRINT AGREEMENT REGISTER")}
        ${printPlate(guestCard, "PRINT THIS MANUAL", "Guest Rules Card", "What the guest sees.", "PRINT GUEST RULES CARD")}
        ${printPlate(localRecord, "PRINT THIS MANUAL", "Local Rules Control Record", "Verification and acknowledgment trail.", "PRINT LOCAL RULES RECORD")}
      `
    },
    {
      id: 8,
      title: "Phase 7 — People",
      html: `
        <p class="ws-kicker">SECTION 08 · PHASE 7</p>
        <h2>People</h2>
        <p>Owner role, providers versus employees, training if people are hired. Hiring is not the first room. Work authorization, wages, and classification belong to qualified professionals.</p>
        <p class="ws-note">This phase is not printed. The Training manuals print below.</p>
        ${openRow([
          { href: "employee-training-workspace.html", label: "OPEN TRAINING" }
        ])}
        ${printPlate(trainingStandard, "PRINT THIS MANUAL", "Employee Training Standard", "How this house trains.", "PRINT TRAINING STANDARD")}
        ${printPlate(trainingRecord, "PRINT THIS MANUAL", "Employee Training Record", "This person’s plates.", "PRINT TRAINING RECORD")}
        ${printPlate(employmentRegister, "PRINT THIS MANUAL", "Employment Control Register", "Who is authorized and current.", "PRINT EMPLOYMENT REGISTER")}
      `
    },
    {
      id: 9,
      title: "Phase 8 — Fleet",
      html: `
        <p class="ws-kicker">SECTION 09 · PHASE 8</p>
        <h2>Fleet</h2>
        <p>Treat every unit as a business asset. A purchased cart is not an in-service cart. Manufacturer instructions remain the mechanical authority.</p>
        <p class="ws-note">This phase is not printed. The Fleet manuals print below.</p>
        ${openRow([
          { href: "fleet-workspace.html", label: "OPEN FLEET" }
        ])}
        ${printPlate(fleetStandard, "PRINT THIS MANUAL", "Fleet Standard", "Care, turnaround, service control.", "PRINT FLEET STANDARD")}
        ${printPlate(fleetRecord, "PRINT THIS MANUAL", "Fleet Unit Record", "One plate per unit.", "PRINT UNIT RECORD")}
      `
    },
    {
      id: 10,
      title: "Phase 9 — Demand",
      html: `
        <p class="ws-kicker">SECTION 10 · PHASE 9</p>
        <h2>Demand</h2>
        <p>Awareness only after the house can receive the guest. One offer, stated the same way. What is promised must match what the operation can deliver.</p>
        <p class="ws-note">This phase is not printed. There is no marketing manual in this collection yet.</p>
      `
    },
    {
      id: 11,
      title: "Phase 10 — Protection",
      html: `
        <p class="ws-kicker">SECTION 11 · PHASE 10</p>
        <h2>Protection</h2>
        <p>Risk, insurance facts as the house changes, continuity if operations stop. This is not a valuation or a sale package.</p>
        <p class="ws-note">This phase is not printed. Road Beyond prints below after the business exists.</p>
        ${openRow([
          { href: "road-beyond-launch-workspace.html", label: "OPEN ROAD BEYOND" }
        ])}
        ${printPlate(growthStandard, "PRINT THIS MANUAL", "Road Beyond Launch Standard", "Review after the business exists.", "PRINT GROWTH STANDARD")}
        ${printPlate(growthRecord, "PRINT THIS MANUAL", "Growth Control Record", "The written review plates.", "PRINT GROWTH RECORD")}
      `
    },
    {
      id: 12,
      title: "Launch sequence",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Launch sequence</h2>
        <p>The Launch Roadmap owns the order from research to first reservation and first operating review. A filing date is not a launch date. A calendar date is not readiness.</p>
        <p class="ws-note">The sequence text in this launcher is not printed. The Roadmap manuals print below.</p>
        ${openRow([
          { href: "launch-roadmap-workspace.html", label: "OPEN LAUNCH ROADMAP" }
        ])}
        ${printPlate(launchStandard, "PRINT THIS MANUAL", "Launch Roadmap Standard", "Sequence and status language.", "PRINT LAUNCH STANDARD")}
        ${printPlate(launchRecord, "PRINT THIS MANUAL", "Launch Control Record", "This house’s milestone plates.", "PRINT LAUNCH RECORD")}
      `
    },
    {
      id: 13,
      title: "Close the file",
      html: `
        <p class="ws-kicker">SECTION 13</p>
        <h2>Close the file</h2>
        <p>The ten phases stay on screen. Nothing from those phases is sent to the printer.</p>
        <p>Each manual was offered in the section where the subject was explained. Open that section if a plate was missed.</p>
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
      ? "Sequence complete"
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