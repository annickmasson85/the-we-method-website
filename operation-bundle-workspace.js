document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-operation-bundle";

  const sopStandard = "images/sop-operating-standard.pdf";
  const trainingStandard = "images/employee-training-standard.pdf";
  const trainingRecord = "images/employee-training-record.pdf";
  const employmentRegister = "images/employment-control-register.pdf";
  const agreementRegister = "images/rental-agreement-control-register.pdf";
  const agreementPacket = "images/rental-agreement-execution-packet.pdf";
  const fleetStandard = "images/fleet-standard.pdf";
  const fleetRecord = "images/fleet-unit-record.pdf";
  const localStandard = "images/local-rules-standard.pdf";
  const guestCard = "images/guest-rules-card.pdf";
  const localRecord = "images/local-rules-control-record.pdf";

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
      title: "What this bundle is",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What this bundle is</h2>
        <p>The operating rooms of a rental house that already takes customers — or is about to. There is no ten-phase launch guide here.</p>
        <p>Each section names one room. The manual that belongs to that room prints after the explanation. The explanation itself is not printed.</p>
        <h3>Rooms in this bundle</h3>
        <ul>
          <li>SOP — how the floor moves and how an incident is handled</li>
          <li>Agreement — what the guest signs</li>
          <li>Pickup &amp; Return — the handoff at the cart</li>
          <li>Local Rules — what this site allows, and what the guest sees</li>
          <li>Fleet — the unit before it goes out again</li>
          <li>People — training if someone other than the owner works the floor</li>
        </ul>
        <p class="ws-note">Templates wait for professional review where the activity, site, or employment law requires it. We share the method. You decide how to build it.</p>
      `
    },
    {
      id: 2,
      title: "SOP",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>SOP</h2>
        <p>The floor cannot improvise the same incident two different ways. Reception, departure, risk class, field response, difficult guest, documentation — one sequence.</p>
        <p>Staff overrides a rental when safety requires it. Calm language. Immediate record. Escalate when the plate says escalate.</p>
        <p class="ws-note">This page is not printed. The SOP Standard prints below.</p>
        ${openRow([
          { href: "sop-workspace.html", label: "OPEN SOP" }
        ])}
        ${printPlate(sopStandard, "PRINT THIS MANUAL", "SOP Operating Standard", "Safety and incident control for the floor.", "PRINT SOP STANDARD")}
      `
    },
    {
      id: 3,
      title: "Agreement",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Agreement</h2>
        <p>The guest is not on the cart until the house can show what was disclosed and what was signed. Edition control lives in the register. The packet the guest sees lives separately.</p>
        <p>This bundle does not make the template enforceable. Counsel adapts it to the site, the equipment, the insurer, and the law that applies.</p>
        <p class="ws-note">This page is not printed. The Agreement manuals print below.</p>
        ${openRow([
          { href: "rental-agreement-workspace.html", label: "OPEN AGREEMENT" }
        ])}
        ${printPlate(agreementPacket, "PRINT THIS MANUAL", "Agreement Execution Packet", "Customer-facing rental packet.", "PRINT AGREEMENT PACKET")}
        ${printPlate(agreementRegister, "PRINT THIS MANUAL", "Agreement Control Register", "Edition and execution control.", "PRINT AGREEMENT REGISTER")}
      `
    },
    {
      id: 4,
      title: "Pickup & Return",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Pickup &amp; Return</h2>
        <p>The handoff is where damage, fuel, keys, and the guest’s understanding of the rules are either recorded or lost. Departure and return are two plates of the same room — not a conversation in the parking lot.</p>
        <p class="ws-note">This page is not printed. Open the Pickup &amp; Return room to print that house’s plates.</p>
        ${openRow([
          { href: "pickup-return-workspace.html", label: "OPEN PICKUP &amp; RETURN" }
        ])}
      `
    },
    {
      id: 5,
      title: "Local Rules",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Local Rules</h2>
        <p>What the cart may do on this site is not the same as what another county allows. Verify current official information. Show the guest a short card. Keep a record that the rule was stated.</p>
        <p>The house does not issue citations and does not pretend a private notice is a government order.</p>
        <p class="ws-note">This page is not printed. The Local Rules manuals print below.</p>
        ${openRow([
          { href: "local-rules-workspace.html", label: "OPEN LOCAL RULES" }
        ])}
        ${printPlate(localStandard, "PRINT THIS MANUAL", "Local Rules Standard", "How operating limits are verified and shown.", "PRINT LOCAL RULES STANDARD")}
        ${printPlate(guestCard, "PRINT THIS MANUAL", "Guest Rules Card", "What the guest sees at the vehicle and at check-in.", "PRINT GUEST RULES CARD")}
        ${printPlate(localRecord, "PRINT THIS MANUAL", "Local Rules Control Record", "Verification and acknowledgment trail.", "PRINT LOCAL RULES RECORD")}
      `
    },
    {
      id: 6,
      title: "Fleet",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Fleet</h2>
        <p>A cart that just came back is not automatically ready. Clean. Inspect. Record. Hold out of service when a defect is found. Return to service only when authorized.</p>
        <p>Manufacturer instructions remain the mechanical authority. This toolkit organizes the house; it does not certify a repair.</p>
        <p class="ws-note">This page is not printed. The Fleet manuals print below.</p>
        ${openRow([
          { href: "fleet-workspace.html", label: "OPEN FLEET" }
        ])}
        ${printPlate(fleetStandard, "PRINT THIS MANUAL", "Fleet Standard", "Care, turnaround, service control.", "PRINT FLEET STANDARD")}
        ${printPlate(fleetRecord, "PRINT THIS MANUAL", "Fleet Unit Record", "One plate per unit.", "PRINT UNIT RECORD")}
      `
    },
    {
      id: 7,
      title: "People",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>People</h2>
        <p>If someone other than the owner works the floor, they represent the house. Training before independent work. A record of what was shown. An employment file that can be closed when they leave.</p>
        <p>Wages, classification, and authorization to work are professional questions.</p>
        <p class="ws-note">This page is not printed. The Training manuals print below.</p>
        ${openRow([
          { href: "employee-training-workspace.html", label: "OPEN TRAINING" }
        ])}
        ${printPlate(trainingStandard, "PRINT THIS MANUAL", "Employee Training Standard", "How this house trains.", "PRINT TRAINING STANDARD")}
        ${printPlate(trainingRecord, "PRINT THIS MANUAL", "Employee Training Record", "This person’s plates.", "PRINT TRAINING RECORD")}
        ${printPlate(employmentRegister, "PRINT THIS MANUAL", "Employment Control Register", "Who is authorized and current.", "PRINT EMPLOYMENT REGISTER")}
      `
    },
    {
      id: 8,
      title: "Close the file",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>Close the file</h2>
        <p>The explanations stay on screen. Each manual was offered in the room where the subject was named. Open that section if a plate was missed.</p>
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
      ? "Bundle ready for the floor"
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