
document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-fleet";
  const standardPath = "images/fleet-standard.pdf";
  const recordPath = "images/fleet-unit-record.pdf";

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

  const standardPlate = printPlate(
    standardPath,
    "INTERNAL STANDARD",
    "Fleet Standard",
    "Reading document. Print for the operations file. Clean is not cleared. Do not download or circulate.",
    "PRINT FLEET STANDARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "UNIT DOCUMENT",
    "Fleet Unit Record",
    "One written life per asset. Status, cleaning, readiness, preventive, hold, return to service. Print only.",
    "PRINT UNIT RECORD"
  );

  const chapters = [
    {
      id: 1,
      title: "What fleet control is here",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What fleet control is here</h2>
        <p>Fleet control is the written status of each asset between rentals. It is not a wash recipe and it is not a guest inspection.</p>
        <h3>Two documents</h3>
        <ul>
          <li><strong>Fleet Standard</strong> — readiness, cleaning condition, preventive cadence, hold, return to service.</li>
          <li><strong>Unit Record</strong> — this asset’s written life.</li>
        </ul>
        <p class="ws-note">Pickup &amp; Return owns the customer bumper. The SOP owns the field. This file owns whether the unit may leave.</p>
      `
    },
    {
      id: 2,
      title: "Who may hold or release",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Who may hold or release</h2>
        <p>A cleaner does not authorize return to service. “It is fine” is not RTS.</p>
        <ul>
          <li>Trained role may review readiness and apply OOS when a listed hold exists.</li>
          <li>Cleaning restores presentation. It does not clear a hold.</li>
          <li>Named fleet authority only authorizes RTS.</li>
          <li>Release follows SOP and the Training Record — and only if the unit is not on hold.</li>
        </ul>
        <p class="ws-note">Stocked parts do not make the person who holds them qualified to install them.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "Asset classes",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Asset classes</h2>
        <p>The house names the classes it actually runs. Unused rows stay blank. No single vehicle type is carved into the book.</p>
        <p>Each class has a daily readiness owner, a preventive owner, and who may hold the unit.</p>
        <p class="ws-note">Daily answers : may this unit leave now. Preventive answers : is manufacturer-driven work current.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Daily vs preventive",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Daily vs preventive</h2>
        <p>Two controls. An asset may be clean and still overdue. An asset may be current on preventive and still fail this morning’s gate.</p>
        <p>This book does not invent intervals, tire pressures, or fluid lists. The manufacturer schedule governs.</p>
        <p class="ws-note">Keep the two statuses distinct in the Unit Record.</p>
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Cleaning",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Cleaning</h2>
        <p>Ready to show : clean, dry where required, no slippery residue on controls, belongings gone, new damage recorded <em>before</em> wash.</p>
        <p>Approved products live on a house list. They are not a shopping page in this Standard.</p>
        <p class="ws-note">Do not wash over evidence. Do not put high pressure into protected components.</p>
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Out of service",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Out of service</h2>
        <p>Availability stops first. Diagnosis comes after.</p>
        <p>Hold for safety, unresolved damage, preventive not current, missing key or ID, authority decision, or post-incident clearance.</p>
        <p class="ws-note">Write the hold. Secure access. Update availability. The opening lead reads this file.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "Return to service",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Return to service</h2>
        <p>Named authority only. Condition addressed or accepted in writing. Review complete. Presentation ready. Record updated. Access restored. OOS mark removed.</p>
        <p class="ws-note">The person who cleaned the unit does not lift the tag unless that person is also the named RTS authority.</p>
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "After an incident",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>After an incident</h2>
        <p>The SOP owns the field. This Standard owns unit status. The asset stays on hold until the required clearance exists.</p>
        <p class="ws-note">Do not clean over a condition that still needs an incident or damage record.</p>
        ${standardPlate}
      `
    },
    {
      id: 9,
      title: "Opening uses this file",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>Opening uses this file</h2>
        <p>The board and the Unit Record must say the same thing. If the board says available and the record says hold, the hold governs.</p>
        <p class="ws-note">The location is not ready if a unit shown as available is still on hold.</p>
        ${standardPlate}
      `
    },
    {
      id: 10,
      title: "The unit record",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>The unit record</h2>
        <p>One written life per asset. Identity, status, cleaning, daily readiness, preventive lines copied from the manufacturer, hold, RTS.</p>
        <p>Print extra hold and RTS plates as needed. Do not invent a second guest inspection inside this file.</p>
        <p class="ws-note">The customer rental file may cite the asset ID. It is not the maintenance book.</p>
        ${recordPlate}
      `
    },
    {
      id: 11,
      title: "What this does not replace",
      html: `
        <p class="ws-kicker">SECTION 11</p>
        <h2>What this does not replace</h2>
        <ul>
          <li>Pickup &amp; Return — guest condition.</li>
          <li>SOP — opening, field, incident steps.</li>
          <li>Agreement — charges.</li>
          <li>Training Record — who may act as opening lead or release a key.</li>
          <li>Manufacturer manual — intervals and repairs.</li>
        </ul>
        <p class="ws-note">Clean is not cleared. Stock is not qualification. RTS is authority.</p>
        ${standardPlate}
      `
    },
    {
      id: 12,
      title: "Close the file",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Close the file</h2>
        <p>The Standard was printed through the method. The Unit Record at the asset plate. This page only reprints if a plate was missed.</p>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" data-print="${standardPath}">PRINT FLEET STANDARD</button>
          <button class="ws-ghost" type="button" data-print="${recordPath}">PRINT UNIT RECORD</button>
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
    const chapter = chapters.find((item) => item.id === state.current) || chapters[0];
    const done = state.completed.includes(chapter.id);
    stage.innerHTML = chapter.html + (done
      ? '<div class="ws-actions"><a class="ws-ghost" href="private-library.html">RETURN TO COLLECTION</a></div>'
      : '<div class="ws-actions"><button class="ws-button" type="button" id="ws-complete">MARK COMPLETE</button></div>');

    document.getElementById("ws-complete")?.addEventListener("click", () => {
      if (!state.completed.includes(chapter.id)) state.completed.push(chapter.id);
      if (chapter.id < chapters.length) state.current = chapter.id + 1;
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