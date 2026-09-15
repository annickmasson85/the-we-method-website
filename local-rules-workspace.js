document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-local-rules";
  const standardPath = "images/local-rules-standard.pdf";
  const cardPath = "images/guest-rules-card.pdf";
  const recordPath = "images/local-rules-control-record.pdf";

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
    "Local Rules Standard",
    "Reading document. Print for the operations file. Staff do not invent a rule from memory. Do not download or circulate.",
    "PRINT LOCAL RULES STANDARD"
  );

  const cardPlate = printPlate(
    cardPath,
    "GUEST DOCUMENT",
    "Guest Rules Card",
    "What the customer is shown before the key. Edition must match the current Standard. Print only.",
    "PRINT GUEST RULES CARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "OPERATIONS RECORD",
    "Local Rules Control Record",
    "Sources, versions, acknowledgment, private warning and termination. Print only. Not a government form.",
    "PRINT CONTROL RECORD"
  );

  const chapters = [
    {
      id: 1,
      title: "What these rules govern",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What these rules govern</h2>
        <p>Local rules are the guest-facing restrictions for this site and this activity. They are not the whole operation. They are the current boundary the customer must see before the key moves.</p>
        <h3>Three documents, three jobs</h3>
        <ul>
          <li><strong>Local Rules Standard</strong> — current rules and method. Read.</li>
          <li><strong>Guest Rules Card</strong> — what the customer is shown.</li>
          <li><strong>Control Record</strong> — sources, versions, acknowledgment, private notices.</li>
        </ul>
        <p class="ws-note">This package does not create police power. A private notice is not a citation. Field steps live in the SOP. Money lives in the Agreement.</p>
      `
    },
    {
      id: 2,
      title: "Three kinds of rule",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Three kinds of rule</h2>
        <p>The source decides how the rule is said. Staff do not upgrade a house policy into a statute by tone or decal.</p>
        <ul>
          <li><strong>Government requirement</strong> — only to the extent the current official source supports the words.</li>
          <li><strong>Property or site rule</strong> — named as a site restriction, not as a crime.</li>
          <li><strong>House policy</strong> — company rule. Never sold as a fine schedule unless a current official source sits in the Control Record and the wording is approved.</li>
        </ul>
        <p class="ws-note">A leftover sign is not a source.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "How a rule becomes current",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>How a rule becomes current</h2>
        <p>Verify. Write it in the Standard. Same sense on the Card if the guest must see it. Same sense in the Agreement. Train. Display only through approved channels.</p>
        <p>Verbal habit, a social post, last season’s card, an old map, or a vendor proof is not current.</p>
        <p class="ws-note">When one layer changes, the named authority checks every downstream layer before the next release.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Who may explain or stop",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Who may explain or stop</h2>
        <p>Authority is assigned. It is not created by two summers on the desk.</p>
        <ul>
          <li>Trained release / reception may explain the current Card — not rewrite it.</li>
          <li>Named authority declares and lifts a hold.</li>
          <li>Named authority or a designated trained role issues a private warning.</li>
          <li>Named authority terminates under the Agreement and directs recovery.</li>
        </ul>
        <p class="ws-note">A chalkboard is not authority. Field staff do not invent a rule on the sand.</p>
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Area and restricted use",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Area and restricted use</h2>
        <p>The business completes the plate from verified sources. No highway, beach, or path is carved into the template.</p>
        <p>Each line carries the rule, the source type, the guest channel, and the SOP plate if breached.</p>
        <p class="ws-note">Do not write a local exception onto the Standard until the Control Record holds the source.</p>
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Hold and counter",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Hold and counter</h2>
        <p>A hold protects the release gate while a rule or condition is unresolved. It is not a refund.</p>
        <h3>Counter order</h3>
        <ol>
          <li>File complete</li>
          <li>Inspection cited</li>
          <li>Current Guest Card explained</li>
          <li>Signatures complete</li>
          <li>Correct key</li>
        </ol>
        <p class="ws-note">There is no “just this once” at the counter. Exceptions go to the named authority.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "Agreement and field",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Agreement and field</h2>
        <p>Standard, Card, and Agreement must say the same restriction in the same sense. If they conflict, stop the key.</p>
        <p>This Standard names the rule in force. The SOP owns confirm, classify, contact, disengage, document. A photo or a GPS ping does not replace confirmation of the asset and the active rental.</p>
        <p class="ws-note">This package sets no amounts. A charge exists only if the current Agreement discloses it.</p>
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "After a breach",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>After a breach</h2>
        <p>Facts first. Then the private notice from the Control Record. Then the incident record in the SOP.</p>
        <ul>
          <li>Do not announce a charge at the bumper.</li>
          <li>Do not present the notice as a government order.</li>
          <li>Do not confront, block, or promise arrest.</li>
          <li>If staff invented a rule or used last season’s card, retrain the same day.</li>
        </ul>
        <p class="ws-note">Display is a reminder. Source control creates the rule.</p>
        ${standardPlate}
      `
    },
    {
      id: 9,
      title: "The Guest Card",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>The Guest Card</h2>
        <p>One to two pages. The customer sees this before the key. Edition matches the Standard. A leftover card is void.</p>
        <p>Acknowledgment on the Card does not replace the Agreement signature plate. It only proves the rules were shown.</p>
        <p class="ws-note">No fine amount on this card unless a current official source sits in the Control Record and the wording is approved.</p>
        ${cardPlate}
      `
    },
    {
      id: 10,
      title: "Verification and version",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>Verification and version</h2>
        <p>The Control Record holds the sources, the rule register, the review log, the optional decal plan, and the acknowledgment log.</p>
        <p>When a rule changes : Record first, then Standard, Card, Agreement, training, display — before the next affected release.</p>
        <p class="ws-note">Verification stays in the operations file. A signed Card copy may sit in the customer rental file.</p>
        ${recordPlate}
      `
    },
    {
      id: 11,
      title: "Private notices",
      html: `
        <p class="ws-kicker">SECTION 11</p>
        <h2>Private notices</h2>
        <p>Warning and termination live here. One page each. Signatures on the same page. Receipt is not agreement with the facts.</p>
        <ul>
          <li>Not a citation. Not a court order. Not a recovery command of the state.</li>
          <li>Cite the current Standard / Agreement rule — not a carved highway name in the template.</li>
          <li>Suspected impairment is observed and escalated. The employee does not declare an offence.</li>
          <li>Declined, unavailable, or unsafe to obtain a signature is recorded.</li>
        </ul>
        <p class="ws-note">Copies : operations file and customer file. Never only in a text thread.</p>
        ${recordPlate}
      `
    },
    {
      id: 12,
      title: "Close the file",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Close the file</h2>
        <p>The documents were printed where they belong. Standard through the method. Card at the guest plate. Record at verification and notices. This page only reprints if a plate was missed.</p>
        <p class="ws-note">Current source. Clear message. Controlled authority.</p>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" data-print="${standardPath}">PRINT LOCAL RULES STANDARD</button>
          <button class="ws-ghost" type="button" data-print="${cardPath}">PRINT GUEST RULES CARD</button>
          <button class="ws-ghost" type="button" data-print="${recordPath}">PRINT CONTROL RECORD</button>
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