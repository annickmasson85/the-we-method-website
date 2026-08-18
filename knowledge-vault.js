document.addEventListener("DOMContentLoaded", () => {
  /* ==================================================
     ÉLÉMENTS PRINCIPAUX
  ================================================== */

  const hero = document.querySelector(".vault-hero");
  const systemLayout = document.querySelector(".vault-system-layout");
  const detailsPanel = document.querySelector(".vault-details");

  const openButton = document.querySelector("[data-vault-link]");
  const bookImage = document.querySelector("[data-vault-book]");
  const previousButton = document.querySelector("[data-vault-previous]");
  const nextButton = document.querySelector("[data-vault-next]");

  const currentCounter = document.querySelector("[data-vault-current]");
  const totalCounter = document.querySelector("[data-vault-total]");
  const dotsContainer = document.querySelector("[data-vault-dots]");

  const detailEyebrow = document.querySelector("[data-vault-eyebrow]");
  const detailTitle = document.querySelector("[data-vault-title]");
  const detailDescription = document.querySelector(
    "[data-vault-description]"
  );
  const detailType = document.querySelector("[data-vault-type]");
  const detailAudience = document.querySelector("[data-vault-audience]");
  const detailValue = document.querySelector("[data-vault-value]");
  const detailInvestment = document.querySelector(
    "[data-vault-investment]"
  );

  const upNextLink = document.querySelector("[data-vault-next-link]");
  const upNextTitle = document.querySelector("[data-vault-next-title]");

  /* ==================================================
     LIVRE OUVERT
  ================================================== */

  const openingLayer = document.querySelector(
    "[data-vault-opening-layer]"
  );
  const openingFrame = document.querySelector(
    "[data-vault-opening-frame]"
  );
  const openInformation = document.querySelector(
    "[data-vault-open-information]"
  );
  const closeButton = document.querySelector(
    "[data-vault-close-book]"
  );

  const openEyebrow = document.querySelector(".vault-open-eyebrow");
  const openTitle = document.querySelector("#vault-open-title");
  const openSubtitle = document.querySelector(".vault-open-subtitle");
  const openLists = document.querySelectorAll(".vault-open-list");
  const openPageFooter = document.querySelector(
    ".vault-open-page-footer"
  );
  const openSummaryValues = document.querySelectorAll(
    ".vault-open-summary dd"
  );
  const openDetailsButton = document.querySelector(
    ".vault-open-details-button"
  );
  const openMotto = document.querySelector(".vault-open-motto");

  const sideTitle = document.querySelector(".vault-side-title");
  const sideDescription = document.querySelector(
    ".vault-side-description"
  );
  const sideSystemNumber = document.querySelector(
    ".vault-side-system strong"
  );
  const sideAudience = document.querySelector(
    ".vault-side-audience"
  );

  if (
    !hero ||
    !openButton ||
    !bookImage ||
    !openingLayer ||
    !openingFrame ||
    !openInformation ||
    !closeButton
  ) {
    console.warn(
      "Knowledge Vault : un élément nécessaire est manquant."
    );
    return;
  }

  /* ==================================================
     DONNÉES DES SYSTÈMES
  ================================================== */

  const systems = [
    {
      id: "business-launcher",
      number: "01",
      eyebrow: "SIGNATURE SYSTEM",
      title: "BUSINESS LAUNCHER",
      titleHTML: "BUSINESS<br>LAUNCHER",
      description:
        "The complete method created to help entrepreneurs prepare, build and launch a golf cart rental business in the United States.",
      type: "COMPLETE BUSINESS LAUNCH SYSTEM",
      audience: "U.S. CITIZENS",
      value: "$5,023",
      investment: "$1,997",
      purchaseType: "SECURE ACCESS",
      bookImage:
        "images/knowledge-vault-business-launcher-book.png",
      bookAlt: "Business Launcher Signature System",
      detailHref: "business-launcher.html",
      openingFrames: [
        "images/knowledge-vault-opening-01.png",
        "images/knowledge-vault-opening-02.png",
        "images/knowledge-vault-opening-03.png",
        "images/knowledge-vault-opening-04.png",
        "images/knowledge-vault-opening-05.png"
      ],
      openSubtitleHTML:
        "THE COMPLETE METHOD<br>FOR U.S. CITIZENS",
      openFooter: "COMPLETE DIGITAL BUSINESS LAUNCH SYSTEM",
      leftResources: [
        ["01", "Business Launch — 10 Phases", "$1,500"],
        ["02", "Business Launch Roadmap", "$250"],
        ["03", "The Road Beyond Launch", "$197"],
        ["04", "Three-Year Revenue Forecasting", "$397"],
        ["05", "Business Plan Template & Example", "$297"],
        [
          "06",
          "Essential Office Setup & Equipment Checklist",
          "$147"
        ]
      ],
      rightResources: [
        ["07", "Employee Training Guide", "$495"],
        ["08", "Rental Agreement & Liability Waiver", "$450"],
        [
          "09",
          "Fleet Cleaning & Preventive Maintenance Toolkit",
          "$297"
        ],
        [
          "10",
          "Local Rules Communication & Rental Enforcement Toolkit",
          "$397"
        ],
        ["11", "Standard Operating Procedures — SOP", "$497"],
        ["12", "Golf Cart Pickup & Return Template", "$99"]
      ],
      disclaimer: "",
      sideDescription:
        "The complete method created to help entrepreneurs prepare, build and launch a golf cart rental business in the United States.",
      sideNumberHTML: "01 <span>OF</span> 03",
      sideAudience: "FOR U.S. CITIZENS",
      nextTitle: "INTERNATIONAL BUSINESS LAUNCHER",
      nextIndex: 1
    },
    {
      id: "international-business-launcher",
      number: "02",
      eyebrow: "SIGNATURE SYSTEM",
      title: "INTERNATIONAL BUSINESS LAUNCHER",
      titleHTML: "INTERNATIONAL<br>BUSINESS<br>LAUNCHER",
      description:
        "A complete step-by-step system for international entrepreneurs preparing to build, own and operate a golf cart rental business in the United States.",
      type: "COMPLETE INTERNATIONAL BUSINESS LAUNCH SYSTEM",
      audience: "INTERNATIONAL ENTREPRENEURS",
      value: "$5,420",
      investment: "$2,197",
      purchaseType: "SECURE ACCESS",
      bookImage:
        "images/knowledge-vault-international-business-launcher-book.png",
      bookAlt: "International Business Launcher Signature System",
      detailHref: "international-business-launcher.html",
      openingFrames: [
        "images/knowledge-vault-international-opening-01.png",
        "images/knowledge-vault-international-opening-02.png",
        "images/knowledge-vault-international-opening-03.png",
        "images/knowledge-vault-international-opening-04.png",
        "images/knowledge-vault-international-opening-05.png"
      ],
      openSubtitleHTML:
        "BUILD YOUR U.S. BUSINESS<br>FROM ANYWHERE<br>IN THE WORLD",
      openFooter:
        "COMPLETE INTERNATIONAL BUSINESS LAUNCH SYSTEM",
      leftResources: [
        ["01", "Business Launch — 10 Phases", "$1,500"],
        ["02", "E-2 Business Package Organizer", "$397"],
        ["03", "Business Launch Roadmap", "$250"],
        ["04", "The Road Beyond Launch", "$197"],
        ["05", "Three-Year Revenue Forecasting", "$397"],
        ["06", "Employee Training Guide", "$495"],
        ["07", "Rental Agreement & Liability Waiver", "$450"]
      ],
      rightResources: [
        [
          "08",
          "Fleet Cleaning & Preventive Maintenance Toolkit",
          "$297"
        ],
        [
          "09",
          "Local Rules Communication & Rental Enforcement Toolkit",
          "$397"
        ],
        ["10", "Business Plan Template & Example", "$297"],
        [
          "11",
          "Essential Office Setup & Equipment Checklist",
          "$147"
        ],
        ["12", "Standard Operating Procedures — SOP", "$497"],
        ["13", "Golf Cart Pickup & Return Template", "$99"]
      ],
      disclaimer:
        "ORGANIZATIONAL RESOURCE ONLY. ATTORNEY REVIEW REQUIRED. NO IMMIGRATION OUTCOME IS GUARANTEED.",
      sideDescription:
        "A complete system for international entrepreneurs preparing to build, own and operate a golf cart rental business in the United States.",
      sideNumberHTML: "02 <span>OF</span> 03",
      sideAudience: "FOR INTERNATIONAL ENTREPRENEURS",
      nextTitle: "OPERATION BUNDLE",
      nextIndex: null
    }
  ];

  const TOTAL_SYSTEMS = 14;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentIndex = 0;
  let animationInProgress = false;
  let bookIsOpen = false;
  let lastOpenTrigger = openButton;

  const imagePromises = new Map();

  const wait = (duration) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, duration);
    });

  const waitForPaint = () =>
    new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
      });
    });

  /* ==================================================
     PRÉCHARGEMENT DES IMAGES
  ================================================== */

  function preloadImage(source) {
    if (imagePromises.has(source)) {
      return imagePromises.get(source);
    }

    const promise = new Promise((resolve) => {
      const image = new Image();

      image.onload = () => resolve(true);

      image.onerror = () => {
        console.warn(`Image introuvable : ${source}`);
        resolve(false);
      };

      image.src = source;
    });

    imagePromises.set(source, promise);
    return promise;
  }

  function preloadSystem(system, includeOpeningFrames = false) {
    const sources = [system.bookImage];

    if (includeOpeningFrames) {
      sources.push(...system.openingFrames);
    }

    return Promise.all(sources.map(preloadImage));
  }

  /* ==================================================
     AFFICHAGE DES INFORMATIONS
  ================================================== */

  function renderResourceList(listElement, resources) {
    if (!listElement) {
      return;
    }

    listElement.replaceChildren();

    resources.forEach(([number, name, price]) => {
      const item = document.createElement("li");

      const numberElement = document.createElement("span");
      numberElement.className = "vault-open-number";
      numberElement.textContent = number;

      const nameElement = document.createElement("span");
      nameElement.className = "vault-open-item-name";
      nameElement.textContent = name;

      const priceElement = document.createElement("span");
      priceElement.className = "vault-open-price";
      priceElement.textContent = price;

      item.append(numberElement, nameElement, priceElement);
      listElement.append(item);
    });
  }

  let openDisclaimer = document.querySelector(
    ".vault-open-disclaimer"
  );

  if (!openDisclaimer && openMotto) {
    openDisclaimer = document.createElement("p");
    openDisclaimer.className = "vault-open-disclaimer";
    openMotto.before(openDisclaimer);
  }

  function renderOpenInformation(system) {
    if (openEyebrow) {
      openEyebrow.textContent = system.eyebrow;
    }

    if (openTitle) {
      openTitle.innerHTML = system.titleHTML;
    }

    if (openSubtitle) {
      openSubtitle.innerHTML = system.openSubtitleHTML;
    }

    renderResourceList(openLists[0], system.leftResources);
    renderResourceList(openLists[1], system.rightResources);

    if (openPageFooter) {
      openPageFooter.textContent = system.openFooter;
    }

    if (openSummaryValues[0]) {
      openSummaryValues[0].textContent = system.value;
    }

    if (openSummaryValues[1]) {
      openSummaryValues[1].textContent = system.investment;
    }

    if (openSummaryValues[2]) {
      openSummaryValues[2].textContent = system.purchaseType;
    }

    if (openDetailsButton) {
      openDetailsButton.href = system.detailHref;
    }

    if (openDisclaimer) {
      openDisclaimer.textContent = system.disclaimer;
      openDisclaimer.hidden = !system.disclaimer;
    }

    if (sideTitle) {
      sideTitle.innerHTML = system.titleHTML;
    }

    if (sideDescription) {
      sideDescription.textContent = system.sideDescription;
    }

    if (sideSystemNumber) {
      sideSystemNumber.innerHTML = system.sideNumberHTML;
    }

    if (sideAudience) {
      sideAudience.textContent = system.sideAudience;
    }

    openInformation.classList.toggle(
      "is-international-system",
      system.id === "international-business-launcher"
    );
  }

  function renderDots() {
    if (!dotsContainer) {
      return;
    }

    dotsContainer.replaceChildren();

    for (let index = 0; index < TOTAL_SYSTEMS; index += 1) {
      const dot = document.createElement("button");
      dot.className = "vault-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `View system ${index + 1}`);

      if (index === currentIndex) {
        dot.classList.add("is-active");
        dot.setAttribute("aria-current", "true");
      }

      if (index < systems.length) {
        dot.addEventListener("click", () => {
          const direction = index > currentIndex ? "next" : "previous";
          changeSystem(index, direction);
        });
      } else {
        dot.disabled = true;
        dot.setAttribute("aria-label", `System ${index + 1} coming soon`);
      }

      dotsContainer.append(dot);
    }
  }

  function updateNavigationAvailability() {
    if (previousButton) {
      previousButton.disabled =
        animationInProgress || bookIsOpen || currentIndex === 0;
    }

    if (nextButton) {
      nextButton.disabled =
        animationInProgress ||
        bookIsOpen ||
        currentIndex === systems.length - 1;
    }

    const nextIndex = systems[currentIndex].nextIndex;

    if (upNextLink) {
      const isAvailable = Number.isInteger(nextIndex);
      upNextLink.classList.toggle("is-disabled", !isAvailable);
      upNextLink.setAttribute(
        "aria-disabled",
        isAvailable ? "false" : "true"
      );
    }
  }

  function renderSystem(index) {
    const system = systems[index];

    currentIndex = index;

    if (systemLayout) {
      systemLayout.dataset.vaultSystem = system.id;
    }

    bookImage.src = system.bookImage;
    bookImage.alt = system.bookAlt;
    bookImage.setAttribute(
      "aria-label",
      `Open the ${system.title} system`
    );

    if (detailEyebrow) {
      detailEyebrow.textContent = system.eyebrow;
    }

    if (detailTitle) {
      detailTitle.innerHTML = system.titleHTML;
    }

    if (detailDescription) {
      detailDescription.textContent = system.description;
    }

    if (detailType) {
      detailType.textContent = system.type;
    }

    if (detailAudience) {
      detailAudience.textContent = system.audience;
    }

    if (detailValue) {
      detailValue.textContent = system.value;
    }

    if (detailInvestment) {
      detailInvestment.textContent = system.investment;
    }

    openButton.href = system.detailHref;

    if (currentCounter) {
      currentCounter.textContent = system.number;
    }

    if (totalCounter) {
      totalCounter.textContent = String(TOTAL_SYSTEMS).padStart(2, "0");
    }

    if (upNextTitle) {
      upNextTitle.textContent = system.nextTitle;
    }

    if (upNextLink) {
      upNextLink.href = system.nextIndex === null
        ? "#operation-bundle"
        : `#${systems[system.nextIndex].id}`;
    }

    renderOpenInformation(system);
    renderDots();
    updateNavigationAvailability();
  }

  /* ==================================================
     GLISSEMENT ENTRE LES LIVRES
  ================================================== */

  async function changeSystem(targetIndex, direction = "next") {
    if (
      animationInProgress ||
      bookIsOpen ||
      targetIndex === currentIndex ||
      targetIndex < 0 ||
      targetIndex >= systems.length
    ) {
      return;
    }

    animationInProgress = true;
    updateNavigationAvailability();

    await preloadSystem(systems[targetIndex]);

    if (reducedMotion.matches) {
      renderSystem(targetIndex);
      animationInProgress = false;
      updateNavigationAvailability();
      return;
    }

    const outgoingClass =
      direction === "next"
        ? "is-sliding-out-left"
        : "is-sliding-out-right";

    const incomingClass =
      direction === "next"
        ? "is-preparing-from-right"
        : "is-preparing-from-left";

    bookImage.classList.add(outgoingClass);
    detailsPanel?.classList.add(outgoingClass);

    await wait(330);

    bookImage.classList.remove(outgoingClass);
    detailsPanel?.classList.remove(outgoingClass);

    renderSystem(targetIndex);

    bookImage.classList.add(incomingClass);
    detailsPanel?.classList.add(incomingClass);

    await waitForPaint();

    bookImage.classList.remove(incomingClass);
    detailsPanel?.classList.remove(incomingClass);

    await wait(520);

    animationInProgress = false;
    updateNavigationAvailability();
  }

  /* ==================================================
     ANIMATION D’OUVERTURE
  ================================================== */

  async function displayFrame(source, pause = 210) {
    if (reducedMotion.matches) {
      openingFrame.src = source;
      return;
    }

    openingFrame.classList.add("is-changing-frame");
    await wait(45);

    openingFrame.src = source;

    try {
      await openingFrame.decode();
    } catch (error) {
      // L'image a déjà été préchargée dans la majorité des navigateurs.
    }

    openingFrame.classList.remove("is-changing-frame");
    await wait(pause);
  }

  async function openBook(event) {
    event.preventDefault();

    if (animationInProgress || bookIsOpen) {
      return;
    }

    const system = systems[currentIndex];

    animationInProgress = true;
    lastOpenTrigger = event.currentTarget || openButton;
    openButton.setAttribute("aria-busy", "true");
    updateNavigationAvailability();

    await preloadSystem(system, true);

    renderOpenInformation(system);
    openingFrame.src = system.openingFrames[0];

    openInformation.hidden = true;
    openInformation.classList.remove("is-visible");

    openingLayer.hidden = false;
    openingLayer.setAttribute("aria-hidden", "false");

    hero.classList.remove("is-book-open");
    hero.classList.add("is-book-opening");

    await waitForPaint();

    if (reducedMotion.matches) {
      openingFrame.src = system.openingFrames[4];
    } else {
      await wait(170);

      for (
        let index = 1;
        index < system.openingFrames.length;
        index += 1
      ) {
        await displayFrame(system.openingFrames[index]);
      }
    }

    hero.classList.remove("is-book-opening");
    hero.classList.add("is-book-open");

    openInformation.hidden = false;

    await waitForPaint();
    openInformation.classList.add("is-visible");

    bookIsOpen = true;
    animationInProgress = false;
    openButton.removeAttribute("aria-busy");
    updateNavigationAvailability();

    closeButton.focus({
      preventScroll: true
    });
  }

  async function closeBook() {
    if (animationInProgress || !bookIsOpen) {
      return;
    }

    const system = systems[currentIndex];

    animationInProgress = true;
    openInformation.classList.remove("is-visible");
    updateNavigationAvailability();

    if (!reducedMotion.matches) {
      await wait(220);
    }

    openInformation.hidden = true;

    hero.classList.remove("is-book-open");
    hero.classList.add("is-book-opening");

    if (reducedMotion.matches) {
      openingFrame.src = system.openingFrames[0];
    } else {
      for (
        let index = system.openingFrames.length - 2;
        index >= 0;
        index -= 1
      ) {
        await displayFrame(system.openingFrames[index], 180);
      }
    }

    hero.classList.remove("is-book-opening");
    openingLayer.setAttribute("aria-hidden", "true");
    openingLayer.hidden = true;

    bookIsOpen = false;
    animationInProgress = false;
    updateNavigationAvailability();

    if (lastOpenTrigger instanceof HTMLElement) {
      lastOpenTrigger.focus({
        preventScroll: true
      });
    }
  }

  /* ==================================================
     ÉVÉNEMENTS
  ================================================== */

  openButton.addEventListener("click", openBook);
  closeButton.addEventListener("click", closeBook);

  bookImage.setAttribute("role", "button");
  bookImage.setAttribute("tabindex", "0");
  bookImage.addEventListener("click", openBook);

  bookImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBook(event);
    }
  });

  previousButton?.addEventListener("click", () => {
    changeSystem(currentIndex - 1, "previous");
  });

  nextButton?.addEventListener("click", () => {
    changeSystem(currentIndex + 1, "next");
  });

  upNextLink?.addEventListener("click", (event) => {
    event.preventDefault();

    const nextIndex = systems[currentIndex].nextIndex;

    if (Number.isInteger(nextIndex)) {
      changeSystem(nextIndex, "next");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookIsOpen) {
      closeBook();
    }

    if (
      !bookIsOpen &&
      !animationInProgress &&
      event.key === "ArrowRight"
    ) {
      changeSystem(currentIndex + 1, "next");
    }

    if (
      !bookIsOpen &&
      !animationInProgress &&
      event.key === "ArrowLeft"
    ) {
      changeSystem(currentIndex - 1, "previous");
    }
  });

  /* ==================================================
     DÉMARRAGE
  ================================================== */

  renderSystem(0);
  preloadSystem(systems[0], true);

  window.setTimeout(() => {
    preloadSystem(systems[1], true);
  }, 800);
});