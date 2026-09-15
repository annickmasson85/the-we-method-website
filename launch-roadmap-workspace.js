document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-launch-roadmap";
  const standardPath = "images/launch-roadmap-standard.pdf";
  const recordPath = "images/launch-control-record.pdf";

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
    "Launch Roadmap Standard",
    "Reading document. Print for the launch file. A gate is not a diploma. Do not download or circulate.",
    "PRINT LAUNCH STANDARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "LAUNCH RECORD",
    "Launch Control Record",
    "This house’s gates, readiness, first operations, and thirty-day review. Print only.",
    "PRINT LAUNCH RECORD"
  );

  const chapters = [
    {
      id: 1,
      title: "What the roadmap is",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What the roadmap is</h2>
        <p>The roadmap connects planning to first operations. It is a sequence of gates. It is not a mandatory calendar and it is not a school.</p>
        <h3>Two documents</h3>
        <ul>
          <li><strong>Launch Roadmap Standard</strong> — order of gates, capital rules, readiness language.</li>
          <li><strong>Launch Control Record</strong> — this house’s written path to first operations.</li>
        </ul>
        <p class="ws-note">Overlap is allowed. Skipping a capital gate is not.</p>
      `
    },
    {
      id: 2,
      title: "Status language",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Status language</h2>
        <p>Not started · Researching · In progress · Waiting third party · Professional review · Completed · Not applicable.</p>
        <p class="ws-note">A blank line is not completed. Waiting on a third party is not the same as done.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "The gates",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>The gates</h2>
        <p>Feasibility. Capital picture. Plan and forecast cited. Formation and compliance. Site. Public identity. Operating systems cited. Fleet. Team if needed. Readiness test. First operations and the thirty-day review.</p>
        <p class="ws-note">Cite the Plan, Forecasting, SOP, Fleet, Local Rules, Agreement, Training. Do not rebuild them here.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Capital gates",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Capital gates</h2>
        <p>No major fleet spend while site, insurance availability, or the funding path is still open.</p>
        <p>No public prices or availability while the readiness test is still open.</p>
        <p class="ws-note">GO at an early gate is not permission to skip a later condition.</p>
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Site before fleet",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Site before fleet</h2>
        <p>Storage, access, customer arrival, preparation space, permission to operate. Then assets.</p>
        <p class="ws-note">A delivered vehicle is not a ready unit. Fleet Record still owns status after arrival.</p>
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Systems already built",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Systems already built</h2>
        <p>Office, SOP, Pickup and Return, Agreement, Local Rules, Training, Fleet — the operating house already exists as controlled files.</p>
        <p>This roadmap asks whether they are in force for this site. It does not reprint them.</p>
        <p class="ws-note">A configured reservation tool is not a tested customer journey.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "Readiness test",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Readiness test</h2>
        <p>Walk the journey before the public calendar opens. Then walk the exceptions the house actually faces.</p>
        <p>READY · READY WITH CONDITIONS · ADDITIONAL PREPARATION · NOT READY.</p>
        <p class="ws-note">A signed checklist is not readiness. The test is.</p>
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "First operations",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>First operations</h2>
        <p>First reservation. First release. First return. What the live day showed that the simulation did not.</p>
        <p class="ws-note">Launch is controlled first operations. It is not a certificate that the system is finished.</p>
        ${standardPlate}
      `
    },
    {
      id: 9,
      title: "Thirty-day review",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>Thirty-day review</h2>
        <p>Compare the plan with the first live period. Continue, adjust, pause an activity, or seek review.</p>
        <p class="ws-note">After this plate, growth questions move to Road Beyond Launch.</p>
        ${standardPlate}
      `
    },
    {
      id: 10,
      title: "The Record",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>The Record</h2>
        <p>One plate per gate. Readiness. First operations. Thirty-day review. Owner and date on every close.</p>
        <p class="ws-note">Owner / launch file. Not the customer drawer. Not the unit file.</p>
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
          <li>Business Plan and Forecasting — concept and numbers.</li>
          <li>Formation counsel — entity and filings.</li>
          <li>The operating books — SOP, Fleet, Local Rules, Agreement, Training, Office.</li>
          <li>Road Beyond Launch — after the first live period.</li>
        </ul>
        <p class="ws-note">Research before committing. Organize before purchasing. Test before launching.</p>
        ${standardPlate}
      `
    },
    {
      id: 12,
      title: "Close the file",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Close the file</h2>
        <p>The Standard was printed through the method. The Record at section 10. This page only reprints if a plate was missed.</p>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" data-print="${standardPath}">PRINT LAUNCH STANDARD</button>
          <button class="ws-ghost" type="button" data-print="${recordPath}">PRINT LAUNCH RECORD</button>
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