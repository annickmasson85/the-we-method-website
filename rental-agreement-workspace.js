document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-rental-agreement";
  const registerPath = "images/rental-agreement-control-register.pdf";
  const packetPath = "images/rental-agreement-execution-packet.pdf";

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

  const registerPlate = printPlate(
    registerPath,
    "INTERNAL DOCUMENT",
    "Agreement Control Register",
    "Complete this register for the business before any customer packet is used. Print for the office file. Do not download or circulate.",
    "PRINT CONTROL REGISTER"
  );

  const packetPlate = printPlate(
    packetPath,
    "CUSTOMER DOCUMENT",
    "Customer Execution Packet",
    "This is the record used at the counter or in electronic signature. One reservation, one packet. Print only. Do not download or circulate.",
    "PRINT EXECUTION PACKET"
  );

  const chapters = [
    {
      id: 1,
      title: "What this package is",
      html: `
        <p class="ws-kicker">SECTION 01</p>
        <h2>What this package is</h2>
        <p>This package organizes the information, policies, acknowledgments, and authorizations a rental business may require before equipment leaves the premises. It is a method for building a controlled customer record — not a finished legal instrument.</p>
        <p class="ws-note">Draft for business customization and professional review. It must be adapted to the business, equipment, insurance, operating area, booking platform, and applicable law before any customer signs it.</p>
        <h3>Two documents, two lives</h3>
        <ul>
          <li><strong>Agreement Control Register</strong> — internal. Completed once, reviewed, filed. It records identity, eligibility, operating envelope, disclosed charges, and professional review.</li>
          <li><strong>Customer Execution Packet</strong> — operational. Issued per reservation. It carries the summary, condition reference, terms the customer initials, authorizations, and signatures.</li>
        </ul>
        <h3>What this package is not</h3>
        <ul>
          <li>Not legal advice.</li>
          <li>Not an attorney-approved agreement, waiver, release, or indemnification.</li>
          <li>Not a substitute for insurance review or payment-processor rules.</li>
          <li>Not a second inspection system. Condition is recorded through Pickup &amp; Return and cited here.</li>
        </ul>
        <p>We share the method. You decide how to build it — after qualified review.</p>
      `
    },
    {
      id: 2,
      title: "Professional review",
      html: `
        <p class="ws-kicker">SECTION 02</p>
        <h2>Professional review</h2>
        <p>No version of this package is released to customers until the controls that require counsel have been reviewed for this business and this jurisdiction.</p>
        <h3>Review is mandatory for</h3>
        <ul>
          <li>The agreement body and governing language.</li>
          <li>Assumption of risk, waiver, and release.</li>
          <li>Indemnification and any duty to defend.</li>
          <li>Payment and security-deposit authorization.</li>
          <li>GPS, telematics, and privacy disclosure.</li>
          <li>Insurance statements.</li>
          <li>Electronic-signature process and record retention.</li>
        </ul>
        <h3>Control rule</h3>
        <p>The register carries the review log: who reviewed, what was reviewed, the date, and the next review date. A missing line is a hold. Verbal confidence is not a review.</p>
        <p class="ws-note">Enforceability depends on jurisdiction, activity, presentation, disclosure, consent, consumer-protection rules, and the facts of an incident. The owner remains responsible for customization and professional review.</p>
        ${registerPlate}
      `
    },
    {
      id: 3,
      title: "Business customization",
      html: `
        <p class="ws-kicker">SECTION 03</p>
        <h2>Business customization</h2>
        <p>The register is completed before a single word is shown to a customer. Identity, activity, and eligibility decide which clauses survive and which are struck.</p>
        <h3>Identity block</h3>
        <p>Legal name, doing-business-as, address, telephone, email, website, emergency number, county, and state. These values must match insurance, banking, the booking platform, and public signage.</p>
        <h3>Rental activities</h3>
        <p>Name only the activities this location actually operates. Golf carts, kayaks, paddleboards, bicycles, boats, or another approved activity. Unused activities are removed — not left as decoration.</p>
        <h3>Eligibility</h3>
        <ul>
          <li>Minimum age to enter the agreement.</li>
          <li>Minimum age to operate each class of equipment.</li>
          <li>Required identification, licence, insurance proof, and payment card.</li>
        </ul>
        <p class="ws-note">A requirement written in the register and absent from the customer packet is an uncontrolled gap. The two documents must agree.</p>
        ${registerPlate}
      `
    },
    {
      id: 4,
      title: "Operating envelope",
      html: `
        <p class="ws-kicker">SECTION 04</p>
        <h2>Operating envelope</h2>
        <p>The envelope is the territory, the clock, and the prohibition list. If it is not written here, the team cannot enforce it at the counter.</p>
        <h3>Define in the register</h3>
        <ul>
          <li>Authorized operating area.</li>
          <li>Restricted roads, waterways, beaches, or locations.</li>
          <li>Permitted hours.</li>
          <li>Nighttime operation policy.</li>
          <li>Highway, off-road, water-exposure, and boundary rules.</li>
        </ul>
        <h3>What the customer must receive</h3>
        <p>A map or written restriction, a verbal explanation, and the local rules the business actually applies. Receipt of each is acknowledged in the execution packet.</p>
        <p class="ws-note">Local rules belong in the Local Rules toolkit. This package cites them. It does not replace them.</p>
        ${registerPlate}
      `
    },
    {
      id: 5,
      title: "Disclosed charges",
      html: `
        <p class="ws-kicker">SECTION 05</p>
        <h2>Disclosed charges</h2>
        <p>A charge that was not disclosed before signature is not a professional charge. Amounts live first in the register, then appear on the customer schedule.</p>
        <h3>Charge authority</h3>
        <ul>
          <li>Security deposit or authorization amount.</li>
          <li>Late return and additional day.</li>
          <li>Lost key and missing accessory.</li>
          <li>Excessive cleaning.</li>
          <li>Fuel or charging.</li>
          <li>Service call, recovery, and towing.</li>
          <li>Documented damage and total-loss review.</li>
        </ul>
        <h3>Discipline</h3>
        <p>Post-rental charges require documentation. Damage exceeding the authorization follows the signed agreement and the processor’s rules. Full card data is never stored outside an approved system.</p>
        <p class="ws-note">The register holds the approved figures. The packet shows the customer the same figures. Two different numbers is a failure of control.</p>
        ${registerPlate}
      `
    },
    {
      id: 6,
      title: "Customer packet order",
      html: `
        <p class="ws-kicker">SECTION 06</p>
        <h2>Customer packet order</h2>
        <p>The counter has a sequence. Changing the order mid-transaction creates unsigned gaps and contested charges.</p>
        <h3>Presentation order</h3>
        <ol>
          <li>Rental summary — who, what, when, where, rate, deposit, total due.</li>
          <li>Authorized drivers — approved or refused by the company.</li>
          <li>Equipment identity — number, VIN or serial, start miles or hours, fuel or charge, key, accessories.</li>
          <li>Condition reference — Pickup &amp; Return inspection number, photographs.</li>
          <li>Agreement body and initialled controls.</li>
          <li>Charge schedule, GPS, insurance, cancellation, e-sign or paper.</li>
          <li>Acknowledgments and signatures.</li>
          <li>Post-rental return record, completed at recovery.</li>
        </ol>
        <p class="ws-note">One reservation, one packet. The packet is not a brochure. It is the operational record of that release.</p>
        ${packetPlate}
      `
    },
    {
      id: 7,
      title: "Condition and keys",
      html: `
        <p class="ws-kicker">SECTION 07</p>
        <h2>Condition and keys</h2>
        <p>This package does not invent a second inspection. Pickup &amp; Return already records condition. The execution packet cites that record and binds the renter to it.</p>
        <h3>Before release</h3>
        <ul>
          <li>Inspection number entered on the packet.</li>
          <li>Photographs recorded — count noted.</li>
          <li>Existing damage acknowledged by renter and representative initials.</li>
          <li>Key number issued against the reservation, not against memory.</li>
          <li>Accessories listed, not assumed.</li>
        </ul>
        <h3>At return</h3>
        <p>End miles or hours, fuel or charge, key recovered, accessories recovered, new photographs, damage or incident flags. If a discrepancy exists, the packet stays open until the file is complete.</p>
        <p class="ws-note">A key that leaves without a reservation number is not a rental. It is a loss of control.</p>
        ${packetPlate}
      `
    },
    {
      id: 8,
      title: "Risk, waiver, indemnification",
      html: `
        <p class="ws-kicker">SECTION 08</p>
        <h2>Risk, waiver, indemnification</h2>
        <p>These clauses affect legal rights. The workspace states the method. Counsel writes the operative language for the jurisdiction and the activity.</p>
        <h3>Three distinct controls</h3>
        <ul>
          <li><strong>Assumption of risk</strong> — the renter is told the activity involves inherent and other risks, including collision, water, terrain, equipment failure, injury, and death.</li>
          <li><strong>Waiver and release</strong> — the final text must identify the released parties, the covered activity, the claims included or excluded, and what cannot lawfully be released.</li>
          <li><strong>Indemnification</strong> — any duty to defend or hold harmless is defined by counsel. Scope is not improvised at the counter.</li>
        </ul>
        <p class="ws-note">Until the register shows attorney review of these three controls, the execution packet is not approved for customer use.</p>
        ${packetPlate}
      `
    },
    {
      id: 9,
      title: "GPS, payment, e-sign",
      html: `
        <p class="ws-kicker">SECTION 09</p>
        <h2>GPS, payment, e-sign</h2>
        <p>Monitoring, money, and signature are three separate consents. Each is disclosed before the renter signs. None is hidden in a footnote.</p>
        <h3>GPS and telematics</h3>
        <p>If the equipment carries location technology, the packet states that fact, the operational purposes, the prohibition on tampering, and that a privacy notice was or was not provided. Provider, data collected, retention, and access belong in the register.</p>
        <h3>Deposit and payment</h3>
        <p>Authorized amount, last four of the method, and the list of charges the authorization may cover. The company does not retain raw card data outside an approved processor.</p>
        <h3>Electronic or paper</h3>
        <p>The renter consents to electronic records or requests paper. The email used to deliver the signed copy is written on the packet. Ability to access and retain the document is confirmed.</p>
        <p class="ws-note">A signature without a retained copy is an incomplete record.</p>
        ${packetPlate}
      `
    },
    {
      id: 10,
      title: "Cancellation, weather, incidents",
      html: `
        <p class="ws-kicker">SECTION 10</p>
        <h2>Cancellation, weather, incidents</h2>
        <p>Policy is written before the season, not invented during a storm or an argument at the counter.</p>
        <h3>Separate in the packet</h3>
        <ul>
          <li>Customer-requested cancellation.</li>
          <li>Company safety cancellation.</li>
          <li>Severe-weather interruption.</li>
          <li>Voluntary early return.</li>
          <li>Equipment unavailability and mechanical interruption.</li>
        </ul>
        <h3>Incidents</h3>
        <p>Accident, injury, property damage, theft, breakdown, water contact, police involvement, missing key. Emergency services first when someone is hurt. Company emergency number on the packet. The renter cooperates with documentation and does not abandon equipment unless directed.</p>
        <p class="ws-note">Late return, grace, recovery, and contact with authorities follow the disclosed policy. Early return does not create a refund unless the written policy says so.</p>
        ${packetPlate}
      `
    },
    {
      id: 11,
      title: "Signatures and records",
      html: `
        <p class="ws-kicker">SECTION 11</p>
        <h2>Signatures and records</h2>
        <p>The file is closed only when identity, condition, initials, signatures, and return are present. An unsigned acknowledgment is not an acknowledgment.</p>
        <h3>Who signs</h3>
        <ul>
          <li>Primary renter — name, signature, date, time.</li>
          <li>Each authorized driver.</li>
          <li>Company representative.</li>
        </ul>
        <h3>What the renter confirms</h3>
        <p>Summary reviewed. Equipment identified. Damage recorded. Drivers named. Area and rules explained. Charge schedule presented. Cancellation and weather presented. GPS presented. Insurance notice reviewed. Questions permitted. Copy received or accessible.</p>
        <h3>Retention</h3>
        <p>Completed packets live with the customer file, apart from employee records, with the retention schedule already set in the office standard. Digital copies are stored in the approved system, not on an unprotected device.</p>
        <p class="ws-note">The packet is evidence. Treat it as evidence.</p>
        ${packetPlate}
      `
    },
    {
      id: 12,
      title: "Print the two packets",
      html: `
        <p class="ws-kicker">SECTION 12</p>
        <h2>Print the two packets</h2>
        <p>The register governs the house. The execution packet governs the release. Print each for the use it was built for. Neither file is downloaded or circulated outside this workspace.</p>
        <p class="ws-note">If the register is not approved for customer use, the execution packet stays in the drawer.</p>
        <div class="ws-print-grid">
          ${registerPlate}
          ${packetPlate}
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