document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-sop";
  const pdfPath = "images/sop-operating-standard.pdf";

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

  const printPlate = `
    <div class="ws-print-plate">
      <p class="ws-kicker">INTERNAL STANDARD</p>
      <h3>Operating Standard</h3>
      <p>This is a reading document. Print it for the location file. Do not download or circulate. Staff do not write in this book.</p>
      <object class="ws-sheet" data="${pdfPath}" type="application/pdf">
        <p>The standard could not be displayed in the browser. Use Print Standard below.</p>
      </object>
      <div class="ws-actions">
        <button class="ws-ghost" type="button" data-print="${pdfPath}">PRINT STANDARD</button>
      </div>
    </div>
  `;

  const chapters = [
    {
      id: 1,
      title: "What this standard is",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What this standard is</h2>
        <p>This standard governs how a location opens, serves, releases equipment, recovers it, and responds when the day leaves the routine. It is the written line the team follows when memory would improvise.</p>
        <p class="ws-note">It is an internal operating standard. It is not legal advice, not an insurance policy, not a police order, and not a substitute for the Agreement, Pickup &amp; Return, Fleet, Local Rules, Training Guide, or Office Standard.</p>
        <h3>Every procedure uses the same anatomy</h3>
        <ul>
          <li><strong>Purpose</strong> — why the procedure exists.</li>
          <li><strong>Owner</strong> — who is accountable for execution.</li>
          <li><strong>When</strong> — the moment it starts.</li>
          <li><strong>Steps</strong> — the order that may not be rearranged at the counter.</li>
          <li><strong>Record</strong> — what is created before the shift ends.</li>
          <li><strong>If this fails</strong> — the named escalation, not a personal invention.</li>
        </ul>
        <h3>A spoken instruction is not a procedure</h3>
        <p>If it is not in the approved edition, it is not how this house operates. Exceptions are written, dated, and owned.</p>
      `
    },
    {
      id: 2,
      title: "Principles and authority",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Principles and authority</h2>
        <p>Safety overrides the rental. The written procedure overrides improvisation. Confirmation overrides enforcement. Documentation overrides recollection.</p>
        <h3>Non-negotiable principles</h3>
        <ul>
          <li>Confirm the asset and the active rental before any field action.</li>
          <li>Document immediately.</li>
          <li>Escalate by classification, not by mood.</li>
          <li>Staff never chase, touch, argue, post, or admit fault for the company.</li>
        </ul>
        <h3>Authority line</h3>
        <ul>
          <li><strong>Counter</strong> — file, eligibility, release, return, disclosed charges with evidence.</li>
          <li><strong>Field</strong> — observe, contact, disengage, record. No physical intervention.</li>
          <li><strong>Supervisor</strong> — termination, replacement unit, hostile guest, charge review.</li>
          <li><strong>Owner</strong> — edition of this standard, exceptions, unresolved risk.</li>
        </ul>
        <p class="ws-note">Who may refuse a rental, end a rental, call law enforcement, or authorize a replacement unit is written here. If the name is missing, the action waits.</p>
        ${printPlate}
      `
    },
    {
      id: 3,
      title: "Documents in play",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Documents in play</h2>
        <p>This standard directs other controlled documents. It does not reprint them.</p>
        <h3>Use, do not duplicate</h3>
        <ul>
          <li><strong>Agreement Control Register</strong> — ages, zone, hours, disclosed charges.</li>
          <li><strong>Customer Execution Packet</strong> — what the guest signs.</li>
          <li><strong>Pickup &amp; Return</strong> — condition before release and at recovery.</li>
          <li><strong>Local Rules</strong> — what is explained before the key leaves.</li>
          <li><strong>Fleet toolkit</strong> — maintenance, out-of-service, return-to-service.</li>
          <li><strong>Office Standard</strong> — filing families and retention.</li>
          <li><strong>Incident record</strong> — named in this standard, stored in the customer or incident file.</li>
          <li><strong>Employee acknowledgment</strong> — signed before the first field shift, stored in the staff file.</li>
        </ul>
        <p class="ws-note">A procedure that rewrites the inspection or the contract creates two truths. This house keeps one.</p>
        ${printPlate}
      `
    },
    {
      id: 4,
      title: "Opening the day",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Opening the day</h2>
        <p>Opening is a declared state. The first guest is not the test.</p>
        <h3>Opening sequence</h3>
        <ol>
          <li>Access the premises under named credentials.</li>
          <li>Confirm the room: hazards, public information, private screens inward.</li>
          <li>Confirm reservation, payment, and tracking systems.</li>
          <li>Count keys. Every exception has an owner before the door opens to the public.</li>
          <li>Confirm the first units marked ready are actually ready.</li>
          <li>Emergency contacts visible to the team, not to the waiting line.</li>
          <li>Declare the location open.</li>
        </ol>
        <h3>Phone and reception</h3>
        <p>Company first, then name, then how may I assist. Price, refund, and rule answers come from the approved documents — never from a personal version of fairness. A complaint is heard, cited to the agreement, and escalated when it leaves the counter’s authority.</p>
        <p class="ws-note">If a system, a key, or a ready unit fails the opening sequence, the location is not open. It is in hold.</p>
        ${printPlate}
      `
    },
    {
      id: 5,
      title: "File and eligibility",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>File and eligibility</h2>
        <p>No key moves until the file exists. The file is assembled in the order the execution packet will later present.</p>
        <h3>File assembly</h3>
        <ul>
          <li>Reservation confirmed in the approved platform.</li>
          <li>Identity and, where required, insurance captured as the register demands.</li>
          <li>Agreement and acknowledgments completed.</li>
          <li>House copy and guest copy separated.</li>
          <li>Inspection number ready to enter — not invented at the door.</li>
        </ul>
        <h3>Refusal</h3>
        <p>Age, licence, capacity, fitness to operate, conduct. The grounds live in the register. The counter applies them. The refusal is documented. The debate does not move into the yard.</p>
        <p class="ws-note">Eligibility is a gate. Charm is not a gate.</p>
        ${printPlate}
      `
    },
    {
      id: 6,
      title: "Release",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Release</h2>
        <p>Release is the moment control of the asset passes to the renter. It is executed, not approximated.</p>
        <h3>Release sequence</h3>
        <ol>
          <li>Condition recorded on Pickup &amp; Return. Packet cites the inspection number.</li>
          <li>Local rules and operating envelope explained.</li>
          <li>Late-return and restricted-area rules stated as written — not as a warning tone.</li>
          <li>Signatures complete.</li>
          <li>Key issued against the reservation and the unit number.</li>
        </ol>
        <h3>During the rental</h3>
        <p>Observation may come from staff, GPS, or a witness. An observation is recorded before it becomes an incident. Contact follows the field script. No enforcement without confirmation that the unit is ours and the rental is active.</p>
        <p class="ws-note">A key handed over without a reservation number is not hospitality. It is a loss of control.</p>
        ${printPlate}
      `
    },
    {
      id: 7,
      title: "Return and close",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Return and close</h2>
        <p>Return closes the rental. Close closes the house. They are different procedures.</p>
        <h3>Return</h3>
        <ul>
          <li>Time against the scheduled return.</li>
          <li>Inspection and accessories.</li>
          <li>Key recovered to the numbered hook.</li>
          <li>Photographs when the condition has changed.</li>
          <li>Return signature.</li>
          <li>Disclosed charges only, with evidence, applied under supervisor authority when required.</li>
          <li>Unit prepared for the next release or tagged out of service.</li>
        </ul>
        <h3>Close and handoff</h3>
        <p>Keys reconciled. Transactions reconciled. Day files in the customer drawer. Open incidents named. Down units tagged. Premises secured. If two shifts meet, the handoff names: keys, units down, guests still out, open incidents, manager messages.</p>
        <p class="ws-note">Nothing material is left as “tomorrow” without an owner.</p>
        ${printPlate}
      `
    },
    {
      id: 8,
      title: "Risk and field response",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>Risk and field response</h2>
        <p>Classification decides the next move before anyone raises their voice.</p>
        <h3>Three levels</h3>
        <ul>
          <li><strong>Low</strong> — operational or administrative. The rental may continue. Record required.</li>
          <li><strong>Medium</strong> — unsafe behavior or policy breach. Stop or warn. Record required. Recurrence escalates.</li>
          <li><strong>High</strong> — immediate danger, impairment, or a violation that ends the rental. Supervisor. Record. Law enforcement when the threshold is met.</li>
        </ul>
        <h3>Four steps — always</h3>
        <ol>
          <li>Confirm the asset and the active rental.</li>
          <li>Contact the renter.</li>
          <li>Disengage. Escalate only when the classification demands it.</li>
          <li>Document: unit, time, place, observation, method of confirmation.</li>
        </ol>
        <p class="ws-note">No confirmation, no enforcement. Distance is a control. Pursuit is not.</p>
        ${printPlate}
      `
    },
    {
      id: 9,
      title: "Low · Medium · High",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>Low · Medium · High</h2>
        <p>Each case in the standard uses one mould: situation, action, script, record, close or escalate. Amounts are never invented here. They come from the signed agreement and the control register.</p>
        <h3>Low</h3>
        <p>Late return. Fuel or charge assistance. Restricted parking. Correct, document, apply only a disclosed charge, close.</p>
        <h3>Medium</h3>
        <p>Standing passenger. Phone while driving. Child on the driver’s lap. Stop or warn as the plate requires. A second event is no longer medium.</p>
        <h3>High</h3>
        <p>Suspected impairment. Child driving. Reckless operation. Immediate public danger. The rental ends. The script is short. The file is long.</p>
        <p class="ws-note">Scripts live in the standard so the team does not write policy in a text message.</p>
        ${printPlate}
      `
    },
    {
      id: 10,
      title: "Police, breakdown, hostility",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>Police, breakdown, hostility</h2>
        <p>Three interruptions. Three owners. No improvisation at the edge of the road.</p>
        <h3>Law enforcement</h3>
        <p>911 when there is injury, violence, theft in progress, a child in danger, an impaired or uncontrollable operator, or a refusal to leave that creates immediate risk. Non-emergency for unreturned equipment, documented damage, repeated illegal operation, vandalism. The caller gives company, exact location, type, unit, immediate risk.</p>
        <h3>Mechanical interruption</h3>
        <p>Stop. Anyone injured. Questions. Replace only if a unit is ready and a supervisor authorizes it. The unit change is dated on the reservation. Negligence is a management finding after evidence — not an accusation delivered beside the cart.</p>
        <h3>Hostile guest or refused payment</h3>
        <p>Calm. Policy. Supervisor. Service suspends. Police if there is a threat or a refusal to leave. The argument is not a procedure.</p>
        <p class="ws-note">Staff do not block a vehicle with their body. They do not follow it into traffic. They record and they call.</p>
        ${printPlate}
      `
    },
    {
      id: 11,
      title: "Records, charges, training",
      html: `
        <p class="ws-kicker">SECTION 11</p>
        <h2>Records, charges, training</h2>
        <p>The day is not finished when the last guest leaves. It is finished when the file is honest.</p>
        <h3>Charges</h3>
        <p>This standard contains no tariffs. A charge exists only if it was disclosed, signed, and supported. Late, service, cleaning, damage — application procedure, not a new price list.</p>
        <h3>Records before the shift ends</h3>
        <ul>
          <li>Completed rental file in the customer family.</li>
          <li>Incident record, photographs, screenshots, witness names where they exist.</li>
          <li>Asset status updated before the next release is possible.</li>
        </ul>
        <h3>Training gate</h3>
        <p>No field assignment until the acknowledgment is signed and filed in the employee record. The signature is not stored in this book.</p>
        <p class="ws-note">Who may edit this standard: the owner. An oral revision has no force.</p>
        ${printPlate}
      `
    },
    {
      id: 12,
      title: "Print the standard",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Print the standard</h2>
        <p>Print the approved edition for the location file. Staff read it. They do not write in it. The next review date lives on the control plate.</p>
        <p class="ws-note">Experience-based operating standard. Not legal advice. Not a substitute for insurer, counsel, or emergency authority.</p>
        ${printPlate}
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
      ? "Standard ready for the file"
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