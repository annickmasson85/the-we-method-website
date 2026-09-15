document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-forecasting";
  const standardPath = "images/forecasting-standard.pdf";
  const recordPath = "images/forecast-control-record.pdf";

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
    "Forecasting Standard",
    "Reading document. Print for the planning file. A modeled total is not a promise. Do not download or circulate.",
    "PRINT FORECAST STANDARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "FORECAST RECORD",
    "Forecast Control Record",
    "This house’s model, assumption register, stress, decision, and actuals. Print only.",
    "PRINT FORECAST RECORD"
  );

  const chapters = [
    {
      id: 1,
      title: "What the forecast is",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What the forecast is</h2>
        <p>A working model of labeled assumptions over a planning horizon. It is not a prediction and it is not a guarantee.</p>
        <h3>Two documents</h3>
        <ul>
          <li><strong>Forecasting Standard</strong> — method, assumption control, stress, decision.</li>
          <li><strong>Forecast Control Record</strong> — this house’s written model.</li>
        </ul>
        <p class="ws-note">A finished-looking page of totals is not a forecast. The sources are.</p>
      `
    },
    {
      id: 2,
      title: "Assumption control",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Assumption control</h2>
        <p>Verified quote. Owner estimate. Unlabeled. Unlabeled figures are not decision-grade.</p>
        <p>A year-over-year change has a written reason. Momentum is not a reason.</p>
        <p class="ws-note">Repeating last year’s estimate does not make it verified.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "The model",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>The model</h2>
        <p>Capacity. Utilization or occupancy. Rate. Operating days and season shape. Other revenue if used. Operating costs. Reserve note.</p>
        <p>The house names the pattern it actually uses. One published formula is not the only lawful model.</p>
        <p class="ws-note">The Plan states the picture. This file owns the working model.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Year 1",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Year 1</h2>
        <p>No house history. Conservative. Do not dress Year 1 as a mature operation.</p>
        <p class="ws-note">If Year 1 only works at an optimistic utilization the house has never seen, the model is not ready.</p>
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Years 2 and 3",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Years 2 and 3</h2>
        <p>Change only what evidence or a named decision supports: capacity, rate, season, cost, people.</p>
        <p>Revenue growth is not profit. Cost often moves with scale.</p>
        <p class="ws-note">Adding units because the calendar advanced is not a forecast decision.</p>
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Stress",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Stress</h2>
        <p>Run at least one lower case. The house names the factor — volume, rate, days, or cost.</p>
        <p>If the lower case cannot carry the fixed load the house must carry, the base case is not supportable.</p>
        <p class="ws-note">A single 75 percent haircut is a method, not a rule of nature. Name the factor you used.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "The decision",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>The decision</h2>
        <p>Supportable on current assumptions. Adjust. Continue researching. Too aggressive. Not ready.</p>
        <p class="ws-note">This decision does not replace the Plan’s GO. It tells the Plan whether the numbers can be defended.</p>
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "Actuals close the year",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>Actuals close the year</h2>
        <p>When a year ends, modeled versus actual. Variance noted. Model edition updated.</p>
        <p class="ws-note">After launch, the living review sits in Road Beyond. This file keeps the model honest.</p>
        ${standardPlate}
      `
    },
    {
      id: 9,
      title: "Relation of documents",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>Relation of documents</h2>
        <ul>
          <li>Business Plan — the planning picture and the planning decision.</li>
          <li>Forecasting — the model and the stress.</li>
          <li>Launch Roadmap — sequence to first operations.</li>
          <li>Road Beyond Launch — evidence after the business exists.</li>
        </ul>
        <p class="ws-note">Do not paste three years of invented months into the Plan to make it look complete.</p>
        ${standardPlate}
      `
    },
    {
      id: 10,
      title: "The Record",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>The Record</h2>
        <p>Model plate. Assumption register. Year plates. Stress. Decision. Actuals when a year closes.</p>
        <p class="ws-note">Finance / planning file. Not the customer drawer. Not the unit file.</p>
        ${recordPlate}
      `
    },
    {
      id: 11,
      title: "What this does not replace",
      html: `
        <p class="ws-kicker">SECTION 11</p>
        <h2>What this does not replace</h2>
        <p>Accountant. Tax. Lender file. Insurance pricing. The operating books. The Plan’s decision. Road Beyond after opening.</p>
        <p class="ws-note">A forecast is a planning tool. It is not a promise of what will happen.</p>
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
          <button class="ws-ghost" type="button" data-print="${standardPath}">PRINT FORECAST STANDARD</button>
          <button class="ws-ghost" type="button" data-print="${recordPath}">PRINT FORECAST RECORD</button>
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