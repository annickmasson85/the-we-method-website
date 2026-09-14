
document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-essential-office";
  const pdfPath = "images/essential-office-setup-print-packet.pdf";

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

  const chapters = [
    {
      id: 1,
      title: "Why This Checklist Exists",
      html: `
        <p class="ws-kicker">CHAPTER 01</p>
        <h2>Why This Checklist Exists</h2>
        <p>A rental business needs more than vehicles and a reservation system. The office, the customer counter, the document-storage system, the payment equipment, the inventory area, and the security procedures all decide whether the day runs or stalls.</p>
        <p>This checklist exists so you build a workspace that can actually operate — before you spend money on how it looks.</p>
        <p>A thoughtfully organized office helps the business:</p>
        <ul>
          <li>Serve customers without searching for a form, a key, or a charger.</li>
          <li>Protect confidential information.</li>
          <li>Keep records findable months later.</li>
          <li>Control vehicle keys.</li>
          <li>Process reservations and payments without improvising.</li>
          <li>Store supplies where the team expects them.</li>
          <li>Present a professional image at the counter.</li>
          <li>Respond when something unexpected happens.</li>
        </ul>
        <p>The goal is not an expensive office on day one. The goal is a functional, secure, and organized workspace capable of supporting the operation.</p>
        <p class="ws-note">A simple office with secure records, clear procedures, dependable technology, and assigned responsibilities will outperform an expensive office that has none of those systems.</p>
      `
    },
    {
      id: 2,
      title: "How To Use the Three Priorities",
      html: `
        <p class="ws-kicker">CHAPTER 02</p>
        <h2>How To Use the Three Priorities</h2>
        <p>Every item in the print packet sits in one of three levels. Use the levels to decide what to buy now, what can wait, and what is only a later upgrade.</p>
        <div class="ws-principle">
          <strong>I</strong>
          <p><em>Required before opening.</em> Items that may be necessary to operate, protect information, receive customers, process payments, or respond to emergencies. If it is missing, the business is not ready.</p>
        </div>
        <div class="ws-principle">
          <strong>II</strong>
          <p><em>Helpful as the business develops.</em> Items that improve organization, efficiency, presentation, or inventory control. Useful, not a reason to delay opening.</p>
        </div>
        <div class="ws-principle">
          <strong>III</strong>
          <p><em>Optional or future upgrades.</em> Items that improve appearance or capacity. They are not required at launch.</p>
        </div>
        <h3>How to mark the packet</h3>
        <ol>
          <li>Tick what is already in place.</li>
          <li>Leave a line empty when the item does not apply to this location.</li>
          <li>Write a note when something is ordered, borrowed, or waiting on a landlord.</li>
          <li>Do not treat every line as a shopping list. Size, layout, volume, paper versus digital records, payment methods, and local requirements all change the final setup.</li>
        </ol>
        <p class="ws-note">Complete one chapter here before you print. The packet is the working document. This workspace is the method behind it.</p>
      `
    },
    {
      id: 3,
      title: "Documents, Filing, and Security",
      html: `
        <p class="ws-kicker">CHAPTER 03</p>
        <h2>Documents, Filing, and Security</h2>
        <p>A rental operation creates records that contain customer identification, contact details, signed agreements, payment-related information, inspection records, damage reports, maintenance history, and employee information. Those records must be stored securely and available only to authorized people.</p>
        <h3>Build the filing system first</h3>
        <p>Before opening, you need lockable storage for active customer records and a separate lockable location for business and employee records. Hanging folders, labels, a written filing procedure, a retention schedule, and a shredder are part of that system — not extras.</p>
        <p>Keep four families of files, and keep employee files away from general operations:</p>
        <ul>
          <li><strong>Customer</strong> — active rentals, completed rentals, agreements, waivers, inspections, damage and incident reports, warnings, termination notices.</li>
          <li><strong>Business</strong> — registration, licenses, insurance, vendors, tax, bank, facility, professional services.</li>
          <li><strong>Fleet</strong> — purchase documents, VIN or serial numbers, insurance, manuals, maintenance, repairs, damage history, out-of-service and return-to-service records.</li>
          <li><strong>Employee</strong> — applications, hiring papers, policy acknowledgments, training, reviews, discipline, exit files.</li>
        </ul>
        <h3>Security is a daily habit</h3>
        <p>Customer files stay locked. Screens do not face the waiting line. Payment-card data is never stored on paper or in a personal phone. Devices lock when unattended. Strong passwords and multi-factor authentication are on. Backups exist in more than one place — an external drive sitting next to the computer is not a backup. It will disappear in the same theft, fire, or flood.</p>
        <p class="ws-note">If a stranger standing at the counter can read a customer name, a card number, or an employee file, the office is not ready — no matter how new the furniture is.</p>
      `
    },
    {
      id: 4,
      title: "Furniture and the Customer Counter",
      html: `
        <p class="ws-kicker">CHAPTER 04</p>
        <h2>Furniture and the Customer Counter</h2>
        <p>Choose furniture for durability, function, accessibility, and the space you actually have. A custom reception desk is a later upgrade. A stable counter that holds the printer, the payment device, and a clipboard is required now.</p>
        <h3>Required before opening</h3>
        <ul>
          <li>A customer-service counter or reception desk.</li>
          <li>An employee work surface and an appropriate chair.</li>
          <li>A secure place for payment equipment and for customer documents.</li>
          <li>Storage for the supplies used every hour.</li>
          <li>Circulation space so a customer can reach the counter without climbing over inventory.</li>
        </ul>
        <h3>What the customer should see</h3>
        <p>The customer area makes important information easy to find and keeps confidential records out of view. Before opening, display rental rates, operating hours, essential rules, emergency contact information, and any authorized-use map. Keep a clipboard for customer documents. Keep the counter clean. Turn screens so only staff can read them.</p>
        <p>Before you hang anything, confirm it is current, matches the reservation system and the rental agreement, contains no private information, and does not block required signage.</p>
        <p class="ws-note">The counter is the face of the operation. If it is cluttered with keys, personal phones, and open files, the customer reads that as the standard of the whole business.</p>
      `
    },
    {
      id: 5,
      title: "Technology, Payments, and Reservations",
      html: `
        <p class="ws-kicker">CHAPTER 05</p>
        <h2>Technology, Payments, and Reservations</h2>
        <p>The office technology has one job: take a reservation, take a payment, print a document, and keep a copy when the power or the internet fails.</p>
        <h3>Core technology</h3>
        <p>You need a computer, laptop, or business tablet; reliable internet; a business-grade router; charging cables; surge protection; a black-and-white wireless printer; a way to scan; a password manager; multi-factor authentication; and a secure cloud backup. A guest Wi-Fi network, a mobile hotspot, a battery backup, and a lockable tablet stand become important quickly. They are not decoration.</p>
        <h3>Payment equipment</h3>
        <p>Select the device that fits this location. A small operation can open with a portable reader or a terminal. A permanent retail counter may justify a stand or a register. You do not need every device in a catalogue.</p>
        <p>Before you buy, verify current price, processing fees, compatible devices, internet requirements, offline limits, receipt-printer compatibility, subscription cost, warranty, and return policy.</p>
        <h3>Reservation technology</h3>
        <p>The platform is not installed until a test reservation, a test payment, and a test cancellation have all been completed, and a backup procedure exists for when the system is down. Configure fleet availability, durations, taxes, customer emails, documents, and employee access levels before the first real customer arrives.</p>
        <p class="ws-note">If the reservation system has not been tested end to end, the office is not open. A live first customer is not a test.</p>
      `
    },
    {
      id: 6,
      title: "Keys, Signage, and Daily Control",
      html: `
        <p class="ws-kicker">CHAPTER 06</p>
        <h2>Keys, Signage, and Daily Control</h2>
        <p>Keys are inventory. If they are kept in a drawer, on a hook by the door, or in a personal pocket, they are not controlled.</p>
        <h3>Key-control system</h3>
        <p>Each key corresponds to a clearly identified cart. Assign cart numbers and key numbers. Record duplicates. Write a release procedure, a return procedure, and a missing-key procedure. Count the keys at close. Limit employee access. Keep spare keys in a lockable wall cabinet, not in the same cup as the active set.</p>
        <p>The print packet includes a daily key-count sheet. Use it at close every operating day. A missing key discovered in the morning is already a problem from the night before.</p>
        <h3>Physical security</h3>
        <p>An entrance alert, numbered keys, lockable document cabinets, lockable storage for devices, and a written closing procedure belong in the first setup. Cameras, an alarm, and extra exterior lighting follow the layout and the risk of the site.</p>
        <h3>External signage</h3>
        <p>Signage should be visible, professional, readable, and permitted for the location. Confirm landlord approval, local permit and electrical rules, wind and weather, installation method, and sightlines before you order a main sign or a flag. A telephone number that is wrong, or a sign that blocks traffic visibility, costs more than waiting a week.</p>
        <p class="ws-note">If you cannot say where every key is at close, do not open in the morning.</p>
      `
    },
    {
      id: 7,
      title: "Safety, Inventory, and the Team",
      html: `
        <p class="ws-kicker">CHAPTER 07</p>
        <h2>Safety, Inventory, and the Team</h2>
        <h3>Operational inventory</h3>
        <p>Numbered key labels, cart labels, READY FOR RENTAL and OUT OF SERVICE tags, inspection clipboards, a flashlight, spare batteries, and a basic tool kit keep the lot from inventing a system every morning. Logs for repairs, maintenance, parts, fuel, and cleaning belong next to the work, not in a folder no one opens.</p>
        <h3>Cleanliness</h3>
        <p>Minimum of three trash cans — office, cart-preparation area, restroom — plus bags, a broom, a mop, approved cleaning products, towels, gloves, a wet-floor sign, soap, and restroom supplies. Store chemicals away from customers. Keep safety data sheets when they are required. The customer judges the fleet by the floor they walk across to reach it.</p>
        <h3>Safety equipment that is often forgotten</h3>
        <p>A first-aid kit, a fire extinguisher appropriate for the location, flashlights, emergency numbers, evacuation information, a severe-weather procedure, and incident-report forms. Record inspection dates on the print packet. Verify type, quantity, installation, and inspection rules for this specific facility. Do not guess.</p>
        <h3>When employees are involved</h3>
        <p>They need a way to record time, a schedule, an assignment board, opening and closing checklists, SOP access, training materials, a secure place for personal items, and a separate document area. A communication log and a maintenance-reporting station prevent information from living only in one person's head.</p>
        <p class="ws-note">Emergency equipment that has never been inspected is decoration. Treat the inspection date as part of opening readiness.</p>
      `
    },
    {
      id: 8,
      title: "Budget and Opening Readiness",
      html: `
        <p class="ws-kicker">CHAPTER 08</p>
        <h2>Budget and Opening Readiness</h2>
        <p>The packet contains planning ranges only. They exist to stop two mistakes: buying nothing essential, and buying a premium office before the operation can support it.</p>
        <ul>
          <li><strong>Essential setup</strong> — often $1,500 to $3,500. Previously owned furniture, a lockable cabinet, a basic printer, a portable payment device, a key cabinet, basic signage, supplies, first-aid, a fire extinguisher, cleaning equipment, a basic backup.</li>
          <li><strong>Professional setup</strong> — often $4,000 to $9,000. A proper counter, a workstation, a real filing system, a secured tablet, better payment hardware, cameras, exterior signs, shelves, backup internet, a scanner.</li>
          <li><strong>Premium setup</strong> — $10,000 to $20,000 or more. Custom millwork, a full POS, a professional security system, LED signage, multiple stations, facility work. It does not guarantee better operations.</li>
        </ul>
        <p>Fill the budget worksheet with quoted prices for this location. Add a contingency. Compare the total with the money actually available. The remaining line tells you what waits until after opening.</p>
        <h3>The opening decision</h3>
        <p>Do not open because the date on the calendar arrived. Open when customer documents can be stored securely, employee records are separated, reservations and payments have been tested, the printer works, internet is reliable, a backup exists, keys are numbered and counted, rates and rules are displayed, required licenses are available, emergency equipment is in place, confidential information is protected, and opening and closing procedures are written.</p>
        <p>If essentials remain, delay. Appearance can wait. Function cannot.</p>
        <p class="ws-note">Avoid purchasing equipment only because it looks impressive. Buy what helps the business operate, protect information, serve customers, and stay consistent.</p>
      `
    },
    {
      id: 9,
      title: "Print the Working Packet",
      html: `
        <p class="ws-kicker">CHAPTER 09</p>
        <h2>Print the Working Packet</h2>
        <p>The official packet stays inside this workspace. Print it for the setup. Do not download or share the file.</p>
        <p>Print in black and white, letter size. Work the pages in order. Tick what is in place. Write real prices on the budget. Complete the readiness check before you name an opening date.</p>
        <p class="ws-note">This packet is a planning and operating resource. It is not a safety inspection, a cybersecurity assessment, an accessibility review, a fire-code review, or a guarantee that a facility is ready to operate. Confirm current requirements with the property owner, local authorities, the insurer, and the technology and payment providers.</p>
        <object class="ws-sheet" data="${pdfPath}" type="application/pdf">
          <p>The packet could not be displayed in the browser. Use Print Packet below.</p>
        </object>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" id="ws-print">PRINT PACKET</button>
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

    document.getElementById("ws-print")?.addEventListener("click", () => {
      const frame = document.querySelector(".ws-sheet");
      if (frame && frame.contentWindow) {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        return;
      }
      const printWindow = window.open(pdfPath, "_blank");
      if (printWindow) printWindow.focus();
    });
  }

  function renderProgress() {
    const done = state.completed.length;
    document.getElementById("ws-progress-count").textContent = Math.min(done + 1, total) + " / " + total;
    document.getElementById("ws-progress-label").textContent = done >= total
      ? "Packet ready for use"
      : "Chapter " + pad(state.current) + " open";
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