document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "twm-proprietary-access-v1";
  const edition = "01 / SEPTEMBER 2026";

  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (existing && existing.accepted && existing.signature) return;
  } catch (error) {
    localStorage.removeItem(storageKey);
  }

  const gate = document.createElement("div");
  gate.className = "twm-gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.innerHTML = `
    <div class="twm-gate-sheet">
      <p class="ws-kicker">REQUIRED BEFORE ACCESS · ${edition}</p>
      <h1>Proprietary Resource Access &amp; Use</h1>
      <p>Limited license. Physical paper print only where a print function is provided. No ownership is transferred.</p>
      <div class="twm-gate-box">
        Read before signing. Access to this book is withheld until the required acknowledgments are checked and an electronic signature is applied. One acceptance covers the purchased collection on this account. After acceptance, this gate does not return on this browser unless the record is cleared.
      </div>
      <h2>What access is</h2>
      <p>The We Method grants a limited, revocable, non-exclusive, non-transferable license to view authorized resources in this private environment and, where a print control is provided, to make physical paper copies for the purchasing business’s internal operations. Purchase and signature do not transfer copyright or any other ownership right.</p>
      <h2>What access is not</h2>
      <ul>
        <li>Download, save, export, screenshot, screen-record, photograph, scan, OCR, or print-to-PDF.</li>
        <li>Share the account, lend the paper, post the file, resell the method, or feed the resources to an AI or document system.</li>
        <li>Use the wording, sequence, or structure to build a competing manual, course, membership, or template library.</li>
        <li>Legal, tax, immigration, insurance, or employment advice — or a promise of any business result.</li>
      </ul>
      <p>Paper copies remain restricted after printing. Notices may not be removed. Credentials may not be shared. Circumventing a control is a material breach. TWM may suspend access and pursue available remedies, subject to applicable law and the purchase terms.</p>
      <h2>Required acknowledgments</h2>
      <label class="twm-gate-check"><input type="checkbox" data-ack="read"> <span>I have read and understand this Agreement and agree to be bound by it. I have authority to accept it for myself or for the business named below.</span></label>
      <label class="twm-gate-check"><input type="checkbox" data-ack="license"> <span>I understand that access is a limited license only. I do not own the resources. Completing a template does not transfer ownership.</span></label>
      <label class="twm-gate-check"><input type="checkbox" data-ack="print"> <span>I will print only where a print control is provided, and only as a physical paper copy for this business. I will not download, save, screenshot, screen-record, scan, photograph, OCR, or print-to-PDF.</span></label>
      <label class="twm-gate-check"><input type="checkbox" data-ack="share"> <span>I will not share login credentials, redistribute resources, place them in a shared drive, or provide them to an AI, OCR, or conversion system. I will not use them to build a competing commercial product.</span></label>
      <label class="twm-gate-check"><input type="checkbox" data-ack="advice"> <span>I understand these materials are operational organization tools, not professional advice, and that no result is guaranteed. I remain responsible for professional review where the business requires it.</span></label>
      <h2>Electronic signature</h2>
      <p>Checking the boxes and typing the legal name is intended as an electronic signature. To the fullest extent permitted by applicable law, the signer agrees it may not be denied effect solely because it is electronic.</p>
      <div class="twm-gate-grid">
        <label><span>FULL LEGAL NAME *</span><input id="twm-gate-name" type="text" autocomplete="name"></label>
        <label><span>BUSINESS / ACCOUNT NAME</span><input id="twm-gate-business" type="text"></label>
        <label><span>EMAIL USED FOR ACCESS *</span><input id="twm-gate-email" type="email" autocomplete="email"></label>
        <label><span>TITLE / AUTHORITY IF SIGNING FOR A BUSINESS</span><input id="twm-gate-title" type="text"></label>
        <label><span>DATE *</span><input id="twm-gate-date" type="date"></label>
        <label class="twm-gate-sign"><span>TYPE FULL LEGAL NAME AS SIGNATURE *</span><input id="twm-gate-sign" type="text"></label>
      </div>
      <p class="twm-gate-error" id="twm-gate-error"></p>
      <div class="twm-gate-actions">
        <button class="twm-gate-submit" type="button" id="twm-gate-submit">ACCEPT AND ENTER</button>
      </div>
    </div>
  `;
  document.body.appendChild(gate);

  const dateField = document.getElementById("twm-gate-date");
  if (dateField && !dateField.value) {
    dateField.value = new Date().toISOString().slice(0, 10);
  }

  document.getElementById("twm-gate-submit").addEventListener("click", () => {
    const checks = [...gate.querySelectorAll("[data-ack]")];
    const name = document.getElementById("twm-gate-name").value.trim();
    const email = document.getElementById("twm-gate-email").value.trim();
    const sign = document.getElementById("twm-gate-sign").value.trim();
    const date = document.getElementById("twm-gate-date").value.trim();
    const error = document.getElementById("twm-gate-error");

    if (checks.some((item) => !item.checked)) {
      error.textContent = "Every acknowledgment must be checked.";
      return;
    }
    if (!name || !email || !sign || !date) {
      error.textContent = "Name, email, date, and typed signature are required.";
      return;
    }
    if (sign.toLowerCase() !== name.toLowerCase()) {
      error.textContent = "The typed signature must match the full legal name.";
      return;
    }

    const record = {
      accepted: true,
      edition,
      name,
      business: document.getElementById("twm-gate-business").value.trim(),
      email,
      title: document.getElementById("twm-gate-title").value.trim(),
      date,
      signature: sign,
      acceptedAt: new Date().toISOString(),
      acknowledgments: checks.map((item) => item.getAttribute("data-ack"))
    };
    localStorage.setItem(storageKey, JSON.stringify(record));
    gate.remove();
  });
});