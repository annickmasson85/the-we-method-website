document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-business-plan";
  const standardPath = "images/business-plan-standard.pdf";
  const recordPath = "images/business-plan-record.pdf";

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
    "Business Plan Standard",
    "Reading document. Print for the planning file. An unlabeled number is not a GO. Do not download or circulate.",
    "PRINT PLAN STANDARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "PLAN RECORD",
    "Business Plan Record",
    "This concept’s written plan. Assumptions labeled. Decision signed. Print only.",
    "PRINT PLAN RECORD"
  );

  const chapters = [
    {
      id: 1,
      title: "What the plan is for",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What the plan is for</h2>
        <p>The plan organizes the concept before capital moves. It is not a loan file and it is not a prediction.</p>
        <h3>Two documents</h3>
        <ul>
          <li><strong>Business Plan Standard</strong> — method, assumption control, planning decision.</li>
          <li><strong>Business Plan Record</strong> — this house’s written plan.</li>
        </ul>
        <p class="ws-note">A blank section is unfinished research. It is not a hidden yes.</p>
      `
    },
    {
      id: 2,
      title: "Assumption control",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Assumption control</h2>
        <p>Every number and claim is a verified quote, an owner estimate, or unlabeled. Unlabeled figures do not support a GO.</p>
        <p class="ws-note">Do not put SSN, bank credentials, or EIN on a copy that may leave the owner file.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "Concept and offer",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Concept and offer</h2>
        <p>What is offered. Who is served. Where. How money is made. What would distinguish it. Owner aim. Whether financing is contemplated.</p>
        <p>Each service line carries a price source. A shopping list of possible extras is not an offer.</p>
        <p class="ws-note">The Record holds the lines. This Standard holds the discipline.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Market",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Market</h2>
        <p>Area. The customer groups this house actually intends. Seasonal shape. Competitors and alternatives. What is still unverified.</p>
        <p class="ws-note">A hoped-for tourist season is an assumption until evidence exists.</p>
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Local constraints first",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Local constraints first</h2>
        <p>Registration, licence, site rules, insurance availability, storage, access. Named. Dated. Verified or still open.</p>
        <p class="ws-note">If the local file is open, the plan stays in research. Do not buy the fleet on an unverified road.</p>
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Operations and assets",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Operations and assets</h2>
        <p>Who owns which function. Whether a procedure will exist. Assets planned, ordered, or owned. Systems named. Still needed.</p>
        <p class="ws-note">This is a sketch. SOP, Fleet, and Office own the operating books.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "Money picture",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Money picture</h2>
        <p>Startup versus operating. Working capital. Contingency. Source on every material line.</p>
        <p>The thirty-six month model lives in Forecasting when that file is used. The plan states the picture, not a novel of invented months.</p>
        <p class="ws-note">A total without supporting lines is not a picture.</p>
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "Risk",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>Risk</h2>
        <p>The material risks this model actually faces. The planned control. Which controlled document will own it after launch.</p>
        <p class="ws-note">A list of every imaginable accident is not a risk plate. Name what this house must prepare for.</p>
        ${standardPlate}
      `
    },
    {
      id: 9,
      title: "The planning decision",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>The planning decision</h2>
        <p>GO. ADJUST. CONTINUE RESEARCHING. RECONSIDER.</p>
        <p>Who signed. The date. What must be true before capital moves.</p>
        <p class="ws-note">GO is not a launch. Launch still follows the Roadmap and the operating books.</p>
        ${standardPlate}
      `
    },
    {
      id: 10,
      title: "The Record",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>The Record</h2>
        <p>This concept, written once. Plates for concept, offer, market, constraints, operations, money, risk, decision.</p>
        <p class="ws-note">Owner / planning file. Not the customer drawer. Not the unit file.</p>
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
          <li>Launch Roadmap — sequence to first operations.</li>
          <li>Forecasting — the model and monthly numbers.</li>
          <li>Road Beyond Launch — review after the business exists.</li>
          <li>SOP, Fleet, Local Rules, Agreement, Office — the operating house.</li>
        </ul>
        <p class="ws-note">Build the plan. Verify the assumptions. Understand the investment. Then decide.</p>
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
          <button class="ws-ghost" type="button" data-print="${standardPath}">PRINT PLAN STANDARD</button>
          <button class="ws-ghost" type="button" data-print="${recordPath}">PRINT PLAN RECORD</button>
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