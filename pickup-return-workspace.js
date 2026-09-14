document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const storageKey = "twm-workspace-pickup-return";
  const pdfPath = "images/pickup-return-inspection-template.pdf";

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
      title: "Why This Template Exists",
      html: `
        <p class="ws-kicker">CHAPTER 01</p>
        <h2>Why This Template Exists</h2>
        <p>This template creates a clear record of the golf cart at two moments: when it leaves, and when it returns.</p>
        <p>Before a rental begins, your team inspects the cart and notes its condition. When the cart comes back, the same points are checked again. Pickup and return sit on one sheet so any new damage, missing item, or change in condition is visible immediately.</p>
        <p>It is not a legal opinion and it is not a substitute for your rental agreement. It is an operating document. Used the same way on every departure and every return, it protects the business, the team, and the customer with one paper trail.</p>
        <h3>What the sheet holds</h3>
        <ul>
          <li>Page 1 records the rental, mileage, fuel or battery, cleanliness, exterior, controls, seats, and safety items.</li>
          <li>Page 2 maps visible condition on the cart body, stores custody details, and collects customer and staff sign-off.</li>
        </ul>
        <p class="ws-note">For your convenience, print the working sheet double-sided so both pages fit on a single leaf. This keeps pickup and return together and simplifies the return process at the end of the rental.</p>
      `
    },
    {
      id: 2,
      title: "How To Complete It",
      html: `
        <p class="ws-kicker">CHAPTER 02</p>
        <h2>How To Complete It</h2>
        <h3>At pickup</h3>
        <ol>
          <li>Enter the business, cart number, reservation, customer name, date, and staff initials.</li>
          <li>Record pickup date and time, odometer or miles, and fuel or battery level.</li>
          <li>Mark cleanliness: Clean, Average, or Needs service.</li>
          <li>Walk the checklist. Use OK, !, X, or N/A. Add a note number when something needs explanation.</li>
          <li>On page 2, circle any existing mark on the cart views and write the matching note.</li>
          <li>Record where the cart will be housed. Have the customer and staff sign the pickup condition.</li>
        </ol>
        <h3>At return</h3>
        <ol>
          <li>Complete the Return row for time, miles, fuel or battery, and cleanliness.</li>
          <li>Repeat the same checklist in the Return column.</li>
          <li>Mark any new damage on the condition map and add a fresh note.</li>
          <li>Compare pickup against return before the customer leaves.</li>
          <li>Collect the return signatures and keep the sheet with the rental record.</li>
        </ol>
        <p>Complete every line, even when the item is acceptable. An empty box is not a record.</p>
      `
    },
    {
      id: 3,
      title: "Print The Working Sheet",
      html: `
        <p class="ws-kicker">CHAPTER 03</p>
        <h2>Print The Working Sheet</h2>
        <p>The official template stays inside this workspace. Print it for the shift. Do not download or share the file.</p>
        <p class="ws-note">Print double-sided, pages 1 and 2 on one sheet.</p>
        <object class="ws-sheet" data="${pdfPath}" type="application/pdf">
          <p>The template could not be displayed in the browser. Use Print Sheet below.</p>
        </object>
        <div class="ws-actions">
          <button class="ws-ghost" type="button" id="ws-print">PRINT SHEET</button>
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

  const chapterNav = document.getElementById("ws-chapters");
  const stage = document.getElementById("ws-stage");

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
      button.innerHTML = "<span>0" + chapter.id + "  " + chapter.title + "</span><small>" + (done ? "DONE" : open ? "OPEN" : "LOCKED") + "</small>";
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
      window.open(pdfPath, "_blank");
    });
  }

  function renderProgress() {
    const done = state.completed.length;
    document.getElementById("ws-progress-count").textContent = Math.min(done + 1, 3) + " / 3";
    document.getElementById("ws-progress-label").textContent = done >= 3 ? "Template ready for use" : "Chapter 0" + state.current + " open";
    document.getElementById("ws-bar-fill").style.width = Math.round((done / 3) * 100) + "%";
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