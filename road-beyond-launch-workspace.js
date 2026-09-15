document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-road-beyond-launch";
  const standardPath = "images/road-beyond-launch-standard.pdf";
  const recordPath = "images/growth-control-record.pdf";

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
    "Road Beyond Launch Standard",
    "Reading document. Print for the owner file. A review gate is not a hire date. Do not download or circulate.",
    "PRINT GROWTH STANDARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "GROWTH RECORD",
    "Growth Control Record",
    "This cycle’s initiatives, status, professional review, and annual decision. Print only.",
    "PRINT GROWTH RECORD"
  );

  const chapters = [
    {
      id: 1,
      title: "After launch",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>After launch</h2>
        <p>This package begins when the controlled launch is behind you. It does not tell you to get larger. It tells you how to review what actually happened and decide what happens next.</p>
        <h3>Two documents</h3>
        <ul>
          <li><strong>Road Beyond Launch Standard</strong> — method, gates, test, status language.</li>
          <li><strong>Growth Control Record</strong> — this cycle’s initiatives and the annual decision.</li>
        </ul>
        <p class="ws-note">A larger business is not automatically a stronger business.</p>
      `
    },
    {
      id: 2,
      title: "Principles",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Principles</h2>
        <ol>
          <li>Protect the existing operation.</li>
          <li>Evidence, not excitement.</li>
          <li>Strengthen before multiplying.</li>
          <li>Growth may be a no.</li>
        </ol>
        <p class="ws-note">Quarter names are convenient review points. They are not a law to hire or buy by that date.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "Status language",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Status language</h2>
        <p>Nine words. A blank line is not active. A message thread is not an initiative.</p>
        <p>Not evaluated · Researching · Professional review · Planned · Testing · Active · Adjust · Paused · Discontinued.</p>
        <p class="ws-note">Status changes live in the Record with evidence, owner, and date.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Opportunity test",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Opportunity test</h2>
        <p>Demand. Fit. Cost. Licence and insurance. People. Site. Effect on the current operation. How it is tracked — and what stops it.</p>
        <p class="ws-note">Material unknowns keep the idea in research or professional review. An attractive idea is not a plan.</p>
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Year-one gate",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Year-one gate</h2>
        <p>Compare the plan with the business that appeared. Demand. Documents. Fleet truth. Cash. Owner load.</p>
        <p>Decision : stabilize further · optimize · selective growth · reconsider.</p>
        <p class="ws-note">The question is whether continued investment is supported — not whether the calendar says Year 2.</p>
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Year-two gate",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Year-two gate</h2>
        <p>Strengthen what has value. Add only against a documented bottleneck. Fleet : add, replace, improve, or delay. New revenue passes the test first.</p>
        <p class="ws-note">Year 2 is not a hire date.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "Year-three gate",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Year-three gate</h2>
        <p>Owner dependence. Service keep / adjust / expand / pause / stop. A second site is a new business decision. Systems that survive the owner. Records that support a value conversation — they do not set a price.</p>
        <p class="ws-note">Expansion is one direction. It is not the definition of success.</p>
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "What is measured",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>What is measured</h2>
        <p>Six families return every year : financial · customer · fleet · operations · marketing · team / protection.</p>
        <p>The house names its numbers in the Record. This Standard does not invent a dashboard law.</p>
        <p class="ws-note">Forecasting owns the model. This file owns the decision method.</p>
        ${standardPlate}
      `
    },
    {
      id: 9,
      title: "The initiative plate",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>The initiative plate</h2>
        <p>One plate per objective. Why. Evidence. Cost. Owner. Professional review. Measures. Pause conditions. Status. Result. Decision.</p>
        <p class="ws-note">Reprint a plate for each initiative. Do not bury six ideas on one page.</p>
        ${recordPlate}
      `
    },
    {
      id: 10,
      title: "The annual decision",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>The annual decision</h2>
        <p>What is in for the next cycle. What is out. Who signed. The date.</p>
        <p class="ws-note">This file is the owner / operations drawer. Not the customer file. Not the unit file.</p>
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
          <li>Launch Roadmap — the path to first operations.</li>
          <li>Business Plan and Forecasting — model and numbers.</li>
          <li>SOP, Fleet, Training, Office — the operating house.</li>
        </ul>
        <p class="ws-note">Validate before expanding. Strengthen before multiplying. Measure before investing.</p>
        ${standardPlate}
      `
    },
    {
      id: 12,
      title: "Close the file",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Close the file</h2>
        <p>The Standard was printed through the method. The Record at the initiative and decision plates. This page only reprints if a plate was missed.</p>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" data-print="${standardPath}">PRINT GROWTH STANDARD</button>
          <button class="ws-ghost" type="button" data-print="${recordPath}">PRINT GROWTH RECORD</button>
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