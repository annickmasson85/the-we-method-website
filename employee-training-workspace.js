document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-employee-training";
  const standardPath = "images/employee-training-standard.pdf";
  const recordPath = "images/employee-training-record.pdf";
  const registerPath = "images/employment-control-register.pdf";

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
    "Training Standard",
    "Reading document. Print for the trainer file. Do not download or circulate. Staff do not write in this book.",
    "PRINT TRAINING STANDARD"
  );

  const recordPlate = printPlate(
    recordPath,
    "EMPLOYEE DOCUMENT",
    "Training Record",
    "One record per person in post. The authority initials each module. The employee signs acknowledgment and solo authorization. Print only.",
    "PRINT TRAINING RECORD"
  );

  const registerPlate = printPlate(
    registerPath,
    "EMPLOYMENT FILE",
    "Employment Control Register",
    "Hire to exit. Application, decision, employment orientation, performance, corrective action, separation. Not a training module. Print only.",
    "PRINT EMPLOYMENT REGISTER"
  );

  const chapters = [
    {
      id: 1,
      title: "What training is here",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What training is here</h2>
        <p>Training is how this house makes the rental day repeatable when the person at the counter changes. It is not an introduction speech. It is a controlled path from observation to solo authorization.</p>
        <h3>Three documents, three lives</h3>
        <ul>
          <li><strong>Training Standard</strong> — the method. Read. Do not write in it.</li>
          <li><strong>Training Record</strong> — evidence for this employee. Modules, scenarios, acknowledgment, solo authorization.</li>
          <li><strong>Employment Control Register</strong> — the employment file. Hire to last key. It does not train and it does not authorize a role.</li>
        </ul>
        <p class="ws-note">This package is not an employment contract, not HR advice, and not a safety certificate. Receipt of a manual is not permission to release a key.</p>
        <h3>The SOP remains the reference</h3>
        <p>This guide trains <em>to</em> the Standard Operating Procedures. It does not rewrite opening, release, return, or field response. If the two disagree, the current approved SOP governs the step. The Record only proves the person was taught that step.</p>
      `
    },
    {
      id: 2,
      title: "Method and authority",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Method and authority</h2>
        <p>Every procedure is taught in five stages. Skipping a stage is not speed. It is an unauthorized person on the floor.</p>
        <h3>Five stages</h3>
        <ol>
          <li><strong>Explain</strong> — purpose, when, owner, documents, risk, when to escalate.</li>
          <li><strong>Demonstrate</strong> — the trainer performs and names each action.</li>
          <li><strong>Assisted practice</strong> — the employee performs with correction in the moment.</li>
          <li><strong>Observed independent performance</strong> — no step-by-step help.</li>
          <li><strong>Verify and record</strong> — ready, more practice, or not authorized.</li>
        </ol>
        <h3>Who may do what</h3>
        <ul>
          <li>A named trainer may explain, demonstrate, and recommend.</li>
          <li>Only the written authority may mark a module verified and grant or retract solo work.</li>
          <li>A verbal habit, seniority, or “they have been here two summers” is not authority.</li>
        </ul>
        <p class="ws-note">Gates, not a carved calendar. Day 1 and Week 2 belong in the Record for this person. They do not belong in the Standard as law.</p>
        ${standardPlate}
      `
    },
    {
      id: 3,
      title: "Roles that can be authorized",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Roles that can be authorized</h2>
        <p>A hire is authorized for the roles in scope. Unused roles are struck in the Record. Teaching everything “just in case” creates a person who has heard it all and owns nothing.</p>
        <h3>Operating roles</h3>
        <ul>
          <li><strong>Counter / reception</strong> — voice of the house. Accurate information. No invented terms.</li>
          <li><strong>File and eligibility</strong> — the file exists before the key moves. Refusal is a written gate.</li>
          <li><strong>Release</strong> — inspection cited, rules explained, signatures complete, key matched.</li>
          <li><strong>Return</strong> — time, key, condition, evidence, no promised outcome.</li>
          <li><strong>Field response</strong> — confirm, contact, disengage, document. Never chase.</li>
          <li><strong>Opening lead</strong> — the location is declared ready, or it is in hold.</li>
          <li><strong>Closing lead</strong> — keys, files, open items named, premises secured.</li>
        </ul>
        <p class="ws-note">Solo work on release or field requires the Training Record to show the matching plates verified. The Employment Register never grants that right.</p>
        ${standardPlate}
      `
    },
    {
      id: 4,
      title: "Counter, file, release, return",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Counter, file, release, return</h2>
        <p>These four roles are the guest-facing spine. The trainee learns the SOP plates, then proves them on the Record.</p>
        <h3>What mastery looks like</h3>
        <ul>
          <li>Company first, name second, then how may I help. Policy from the written record.</li>
          <li>Reservation, identity, agreement, inspection reference — assembled before handoff.</li>
          <li>Release order is file, inspection, rules, signatures, key. Never the reverse.</li>
          <li>Return is evidence. A charge exists only if disclosed and supported. Fault is not announced at the bumper.</li>
        </ul>
        <p class="ws-note">Inspection technique lives in Pickup &amp; Return. This path only proves the person can use that document in the right order.</p>
        ${standardPlate}
      `
    },
    {
      id: 5,
      title: "Field, opening, closing",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Field, opening, closing</h2>
        <p>These roles protect the house when there is no guest at the desk — and when the guest is already gone.</p>
        <h3>Field</h3>
        <p>Confirm the asset and the active rental. Contact. Disengage. Document. Classification before volume. 911 is never delayed for a supervisor’s callback when someone is in immediate danger.</p>
        <h3>Opening and closing</h3>
        <p>Opening is declared. Closing names every exception. A shift handoff transfers files and counts, not stories. An employee who cannot close is not an opening lead.</p>
        <p class="ws-note">Field is not a default role. If it is not in scope on the Record, it is not taught as independent work.</p>
        ${standardPlate}
      `
    },
    {
      id: 6,
      title: "Documents and escalation",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Documents and escalation</h2>
        <p>A trained person can put a hand on the current document without asking the owner. A trained person knows the moment the decision is no longer theirs.</p>
        <h3>Must locate</h3>
        <ul>
          <li>Current SOP</li>
          <li>Customer Execution Packet</li>
          <li>Pickup &amp; Return</li>
          <li>Local Rules</li>
          <li>Incident record</li>
          <li>Key control</li>
          <li>Supervisor · Owner · 911</li>
        </ul>
        <h3>Must escalate without guessing</h3>
        <p>Missing identification. Unsigned documents. Suspected impairment. Possible new damage. Accident. Disabled asset. Threat. Disputed payment. Restricted-use breach. Suspected fraud. Emergency services. Any exception to written policy.</p>
        <p class="ws-note">Guessing is how a house collects two versions of the truth.</p>
        ${standardPlate}
      `
    },
    {
      id: 7,
      title: "Scenarios and retraining",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Scenarios and retraining</h2>
        <p>Scenarios exist so the first time is not the real customer. Retraining exists so an incident does not become the new unofficial procedure.</p>
        <h3>Five scenarios</h3>
        <ol>
          <li>Missing identification</li>
          <li>Possible new damage at return</li>
          <li>Mechanical interruption</li>
          <li>Policy or charge complaint</li>
          <li>Suspected impairment before release</li>
        </ol>
        <p>Each uses one mould : situation, what must be demonstrated, which SOP plate, pass or more practice.</p>
        <h3>Retrain when</h3>
        <p>The procedure, asset class, system, or document changes. The role changes. A performance concern, incident, or recurring error appears. A seasonal return. Law or insurer direction changes.</p>
        <p class="ws-note">After retraining, the Record is updated the same day. A restricted role that still appears authorized on the floor is a control failure.</p>
        ${standardPlate}
      `
    },
    {
      id: 8,
      title: "The Training Record",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>The Training Record</h2>
        <p>One person in post, one Record. Identity, scope, orientation, modules, scenarios, authorization, retraining. That is the entire operational evidence.</p>
        <h3>How it is used</h3>
        <ul>
          <li>Strike every role that is not in scope.</li>
          <li>Complete only the module plates that remain.</li>
          <li>Status is Ready, More practice, or Not authorized — never “good enough for now”. </li>
          <li>File it in the employee family. Not in the customer drawer.</li>
        </ul>
        <p class="ws-note">A copy of the solo-authorization plate may sit with the opening lead so the floor knows who may release a key this morning.</p>
        ${recordPlate}
      `
    },
    {
      id: 9,
      title: "Acknowledgment and modules",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>Acknowledgment and modules</h2>
        <p>The SOP acknowledgment proves access and duty. It does not prove skill. The module plates prove skill.</p>
        <h3>Acknowledgment says</h3>
        <p>Access received. Assigned procedures will be followed. Exceptions will not be invented. Escalation will be used. Receipt of the manual is understood not to be solo authorization.</p>
        <h3>Each module plate carries five marks</h3>
        <p>Explained. Demonstrated. Practiced. Performed under observation. Verified. Then a status and a date.</p>
        <p class="ws-note">Inspection is trained on Pickup &amp; Return. The module does not become a second inspection checklist.</p>
        ${recordPlate}
      `
    },
    {
      id: 10,
      title: "Solo authorization",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>Solo authorization</h2>
        <p>This is the only plate that answers the floor’s question : may this person release a key, close the house, or go into the field alone.</p>
        <h3>The plate names</h3>
        <ul>
          <li>Roles authorized alone.</li>
          <li>Roles still supervised.</li>
          <li>Any restriction.</li>
          <li>The authority, the date, the next review.</li>
        </ul>
        <p>If an incident retracts a role, this plate and the retraining plate are updated the same day. Performance notes in the Employment Register are not a substitute.</p>
        <p class="ws-note">No independent release or field work exists until this plate is signed. The training gate in the SOP points here.</p>
        ${recordPlate}
      `
    },
    {
      id: 11,
      title: "Employment file",
      html: `
        <p class="ws-kicker">SECTION 11</p>
        <h2>Employment file</h2>
        <p>The Employment Control Register is adjacent. It does not train. It does not authorize a role. It holds the employment life of the person : application, interview record, hire decision, employment orientation, performance, corrective action, separation, access removal.</p>
        <h3>File rule</h3>
        <ul>
          <li>Hire decision does not issue a key or a login.</li>
          <li>Employment orientation issues policies and property. Operational training stays in the Record.</li>
          <li>If a review restricts a role, the Training Record is updated the same day.</li>
          <li>Separation recovers property and removes access. Would-rehire is a fact for the file, not a speech.</li>
        </ul>
        <p class="ws-note">Customer files never live here. Training modules never live here. Three drawers. Three truths.</p>
        ${registerPlate}
      `
    },
    {
      id: 12,
      title: "Print the three documents",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Print the three documents</h2>
        <p>Standard for the trainer. Record for the person in post. Register for the employment file. Print each for its drawer. None is downloaded or circulated outside this workspace.</p>
        <p class="ws-note">A person may be hired and still unauthorized to release a key. That is control. That is not a delay.</p>
        <div class="ws-print-grid">
          ${standardPlate}
          ${recordPlate}
          ${registerPlate}
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