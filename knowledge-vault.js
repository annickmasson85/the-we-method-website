document.addEventListener("DOMContentLoaded", () => {
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
  const detailDescription = document.querySelector("[data-vault-description]");
  const detailType = document.querySelector("[data-vault-type]");
  const detailAudience = document.querySelector("[data-vault-audience]");
  const detailValue = document.querySelector("[data-vault-value]");
  const detailInvestment = document.querySelector("[data-vault-investment]");

  const upNextLink = document.querySelector("[data-vault-next-link]");
  const upNextTitle = document.querySelector("[data-vault-next-title]");

  const openingLayer = document.querySelector("[data-vault-opening-layer]");
  const openingFrame = document.querySelector("[data-vault-opening-frame]");
  const openInformation = document.querySelector("[data-vault-open-information]");
  const closeButton = document.querySelector("[data-vault-close-book]");

  const openEyebrow = document.querySelector(".vault-open-eyebrow");
  const openTitle = document.querySelector("#vault-open-title");
  const openSubtitle = document.querySelector(".vault-open-subtitle");
  const openLists = document.querySelectorAll(".vault-open-list");
  const openPageFooter = document.querySelector(".vault-open-page-footer");
  const openSummaryValues = document.querySelectorAll(".vault-open-summary dd");
  const openDetailsButton = document.querySelector(".vault-open-details-button");
  const openMotto = document.querySelector(".vault-open-motto");

  const sideTitle = document.querySelector(".vault-side-title");
  const sideDescription = document.querySelector(".vault-side-description");
  const sideSystemNumber = document.querySelector(".vault-side-system strong");
  const sideAudience = document.querySelector(".vault-side-audience");
  const sideCard = document.querySelector(".vault-open-side-card");
  const categoryButtons = document.querySelectorAll("[data-vault-category]");

  if (!hero || !openButton || !bookImage || !openingLayer || !openingFrame || !openInformation || !closeButton) {
    console.warn("Knowledge Vault : un élément nécessaire est manquant.");
    return;
  }

  const allSystems = [
    {
      id: "business-launcher",
      category: "signature-systems",
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
      bookImage: "images/knowledge-vault-business-launcher-book.png",
      openImage: "images/knowledge-vault-business-launcher-open.png",
      bookAlt: "Business Launcher Signature System",
      detailHref: "business-launcher.html",
      openSubtitleHTML: "THE COMPLETE METHOD<br>FOR U.S. CITIZENS",
      openFooter: "COMPLETE DIGITAL BUSINESS LAUNCH SYSTEM",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "The complete method created to help entrepreneurs prepare, build and launch a golf cart rental business in the United States.",
      sideNumberHTML: "01 <span>OF</span> 03",
      sideAudience: "FOR U.S. CITIZENS"
    },
    {
      id: "international-business-launcher",
      category: "signature-systems",
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
      bookImage: "images/knowledge-vault-international-business-launcher-book.png",
      openImage: "images/knowledge-vault-international-business-launcher-open.png",
      bookAlt: "International Business Launcher Signature System",
      detailHref: "international-business-launcher.html",
      openSubtitleHTML: "BUILD YOUR U.S. BUSINESS<br>FROM ANYWHERE<br>IN THE WORLD",
      openFooter: "COMPLETE INTERNATIONAL BUSINESS LAUNCH SYSTEM",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A complete system for international entrepreneurs preparing to build, own and operate a golf cart rental business in the United States.",
      sideNumberHTML: "02 <span>OF</span> 03",
      sideAudience: "FOR INTERNATIONAL ENTREPRENEURS"
    },
    {
      id: "operation-bundle",
      category: "signature-systems",
      number: "03",
      eyebrow: "SIGNATURE SYSTEM",
      title: "OPERATION BUNDLE",
      titleHTML: "OPERATION<br>BUNDLE",
      description:
        "A complete internal documentation system designed to strengthen, standardize and improve your existing rental business.",
      type: "COMPLETE INTERNAL OPERATIONS SYSTEM",
      audience: "EXISTING U.S. BUSINESS OWNERS",
      value: "$2,235",
      investment: "$1,495",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-operation-bundle-book.png",
      openImage: "images/knowledge-vault-operation-bundle-open.png",
      bookAlt: "Operation Bundle Signature System",
      detailHref: "operation-bundle.html",
      openSubtitleHTML: "THE INTERNAL OPERATIONS SYSTEM<br>FOR EXISTING U.S. BUSINESSES",
      openFooter: "COMPLETE INTERNAL OPERATIONS SYSTEM",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A complete internal documentation system designed to strengthen, standardize and improve your existing rental business.",
      sideNumberHTML: "03 <span>OF</span> 03",
      sideAudience: "FOR EXISTING U.S. BUSINESSES"
    },
    {
      id: "business-launch-roadmap",
      category: "foundation",
      number: "01",
      eyebrow: "FOUNDATION COLLECTION",
      title: "BUSINESS LAUNCH ROADMAP",
      titleHTML: "BUSINESS LAUNCH<br>ROADMAP",
      description:
        "A strategic roadmap designed to organize the journey from early research to launch readiness — with clear checkpoints, decision points, and direction for what should happen next.",
      type: "FOUNDATION COLLECTION 01 OF 02",
      audience: "ASPIRING & NEW RENTAL BUSINESSES",
      value: "$250",
      investment: "$250",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-business-launch-roadmap-book.png",
      openImage: "images/knowledge-vault-business-launch-roadmap-open.png",
      bookAlt: "Business Launch Roadmap",
      detailHref: "",
      openSubtitleHTML: "BUILD WITH DIRECTION<br>FROM THE BEGINNING",
      openFooter: "FOUNDATION COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A strategic roadmap designed to organize the journey from early research to launch readiness — with clear checkpoints, decision points, and direction for what should happen next.",
      sideNumberHTML: "01 <span>OF</span> 02",
      sideAudience: "FOR ASPIRING & NEW RENTAL BUSINESSES"
    },
    {
      id: "business-plan-template",
      category: "foundation",
      number: "02",
      eyebrow: "FOUNDATION COLLECTION",
      title: "BUSINESS PLAN TEMPLATE & EXAMPLE",
      titleHTML: "BUSINESS PLAN<br>TEMPLATE & EXAMPLE",
      description:
        "A guided planning resource designed to transform your research, ideas, financial assumptions, and operating plans into a clear, structured, and professionally organized business plan.",
      type: "FOUNDATION COLLECTION 02 OF 02",
      audience: "ASPIRING & NEW RENTAL BUSINESSES",
      value: "$297",
      investment: "$297",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-business-plan-template-book.png",
      openImage: "images/knowledge-vault-business-plan-template-open.png",
      bookAlt: "Business Plan Template & Example",
      detailHref: "",
      openSubtitleHTML: "TURN YOUR BUSINESS IDEA INTO<br>A CLEAR AND ORGANIZED PLAN",
      openFooter: "FOUNDATION COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A guided planning resource designed to transform your research, ideas, financial assumptions, and operating plans into a clear, structured, and professionally organized business plan.",
      sideNumberHTML: "02 <span>OF</span> 02",
      sideAudience: "FOR ASPIRING & NEW RENTAL BUSINESSES"
    },
    {
      id: "employee-training-guide",
      category: "operation",
      number: "01",
      eyebrow: "OPERATION COLLECTION",
      title: "EMPLOYEE TRAINING GUIDE",
      titleHTML: "EMPLOYEE<br>TRAINING GUIDE",
      description:
        "A structured training and reference system designed to prepare your team for daily responsibilities, customer service, documentation, safety awareness, and consistent operations.",
      type: "OPERATION COLLECTION 01 OF 04",
      audience: "RENTAL BUSINESS OWNERS & TEAMS",
      value: "$495",
      investment: "$495",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-employee-training-guide-book.png",
      openImage: "images/knowledge-vault-employee-training-guide-open.png",
      bookAlt: "Employee Training Guide",
      detailHref: "",
      openSubtitleHTML: "BUILD A CONSISTENT AND<br>PREPARED TEAM",
      openFooter: "OPERATION COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A structured training and reference system designed to prepare your team for daily responsibilities, customer service, documentation, safety awareness, and consistent operations.",
      sideNumberHTML: "01 <span>OF</span> 04",
      sideAudience: "FOR RENTAL BUSINESS OWNERS & TEAMS"
    },
    {
      id: "sop",
      category: "operation",
      number: "02",
      eyebrow: "OPERATION COLLECTION",
      title: "STANDARD OPERATING PROCEDURES — SOP",
      titleHTML: "STANDARD OPERATING<br>PROCEDURES — SOP",
      description:
        "A documented operating system designed to standardize daily procedures, define responsibilities, strengthen consistency, and keep your rental operation organized across every shift.",
      type: "OPERATION COLLECTION 02 OF 04",
      audience: "RENTAL BUSINESS OWNERS & TEAMS",
      value: "$497",
      investment: "$497",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-sop-book.png",
      openImage: "images/knowledge-vault-sop-open.png",
      bookAlt: "Standard Operating Procedures SOP",
      detailHref: "",
      openSubtitleHTML: "CREATE CLEAR AND REPEATABLE<br>PROCEDURES",
      openFooter: "OPERATION COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A documented operating system designed to standardize daily procedures, define responsibilities, strengthen consistency, and keep your rental operation organized across every shift.",
      sideNumberHTML: "02 <span>OF</span> 04",
      sideAudience: "FOR RENTAL BUSINESS OWNERS & TEAMS"
    },
    {
      id: "office-setup-checklist",
      category: "operation",
      number: "03",
      eyebrow: "OPERATION COLLECTION",
      title: "ESSENTIAL OFFICE SETUP & EQUIPMENT CHECKLIST",
      titleHTML: "ESSENTIAL OFFICE SETUP<br>& EQUIPMENT CHECKLIST",
      description:
        "A practical setup and organization resource designed to create a functional workspace for customers, reservations, payments, documents, equipment, employees, and daily operations.",
      type: "OPERATION COLLECTION 03 OF 04",
      audience: "ASPIRING & ESTABLISHED RENTAL BUSINESSES",
      value: "$147",
      investment: "$147",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-office-setup-checklist-book.png",
      openImage: "images/knowledge-vault-office-setup-checklist-open.png",
      bookAlt: "Essential Office Setup & Equipment Checklist",
      detailHref: "",
      openSubtitleHTML: "CREATE AN ORGANIZED AND<br>PROFESSIONAL WORKSPACE",
      openFooter: "OPERATION COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A practical setup and organization resource designed to create a functional workspace for customers, reservations, payments, documents, equipment, employees, and daily operations.",
      sideNumberHTML: "03 <span>OF</span> 04",
      sideAudience: "FOR ASPIRING & ESTABLISHED RENTAL BUSINESSES"
    },
    {
      id: "pickup-return-template",
      category: "operation",
      number: "04",
      eyebrow: "OPERATION COLLECTION",
      title: "GOLF CART PICKUP & RETURN TEMPLATE",
      titleHTML: "GOLF CART PICKUP<br>& RETURN TEMPLATE",
      description:
        "A structured inspection and documentation system designed to create a clear chain of responsibility from vehicle departure through inspection and final return.",
      type: "OPERATION COLLECTION 04 OF 04",
      audience: "GOLF CART RENTAL BUSINESSES",
      value: "$99",
      investment: "$99",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-pickup-return-template-book.png",
      openImage: "images/knowledge-vault-pickup-return-template-open.png",
      bookAlt: "Golf Cart Pickup & Return Template",
      detailHref: "",
      openSubtitleHTML: "FROM VEHICLE DEPARTURE<br>TO FINAL RETURN",
      openFooter: "OPERATION COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A structured inspection and documentation system designed to create a clear chain of responsibility from vehicle departure through inspection and final return.",
      sideNumberHTML: "04 <span>OF</span> 04",
      sideAudience: "FOR GOLF CART RENTAL BUSINESSES"
    },
    {
      id: "revenue-forecasting",
      category: "finance",
      number: "01",
      eyebrow: "FINANCE COLLECTION",
      title: "THREE-YEAR REVENUE FORECASTING",
      titleHTML: "THREE-YEAR REVENUE<br>FORECASTING",
      description:
        "A complete forecasting guide and worksheet system to help you estimate revenue, plan for seasonal demand, organize financial assumptions and evaluate potential growth over a three-year period.",
      type: "FINANCE COLLECTION 01 OF 01",
      audience: "ASPIRING & ESTABLISHED RENTAL BUSINESSES",
      value: "$397",
      investment: "$397",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-revenue-forecasting-book.png",
      openImage: "images/knowledge-vault-revenue-forecasting-open.png",
      bookAlt: "Three-Year Revenue Forecasting",
      detailHref: "",
      openSubtitleHTML: "BUILD REALISTIC REVENUE<br>PROJECTIONS",
      openFooter: "FINANCE COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A complete forecasting guide and worksheet system to help you estimate revenue, plan for seasonal demand, organize financial assumptions and evaluate potential growth over a three-year period.",
      sideNumberHTML: "01 <span>OF</span> 01",
      sideAudience: "FOR ASPIRING & ESTABLISHED RENTAL BUSINESSES"
    },
    {
      id: "rental-agreement",
      category: "document",
      number: "01",
      eyebrow: "DOCUMENT COLLECTION",
      title: "RENTAL AGREEMENT & LIABILITY WAIVER",
      titleHTML: "RENTAL AGREEMENT<br>& LIABILITY WAIVER",
      description:
        "A structured document template designed to organize rental terms, customer responsibilities, payment obligations, vehicle-use rules, and risk acknowledgments in one professional resource.",
      type: "DOCUMENT COLLECTION 01 OF 02",
      audience: "GOLF CART RENTAL BUSINESSES",
      value: "$450",
      investment: "$450",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-rental-agreement-book.png",
      openImage: "images/knowledge-vault-rental-agreement-open.png",
      bookAlt: "Rental Agreement & Liability Waiver",
      detailHref: "",
      openSubtitleHTML: "ORGANIZE RENTAL TERMS<br>IN ONE DOCUMENT",
      openFooter: "DOCUMENT COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A structured document template designed to organize rental terms, customer responsibilities, payment obligations, vehicle-use rules, and risk acknowledgments in one professional resource.",
      sideNumberHTML: "01 <span>OF</span> 02",
      sideAudience: "FOR GOLF CART RENTAL BUSINESSES"
    },
    {
      id: "local-rules-toolkit",
      category: "document",
      number: "02",
      eyebrow: "DOCUMENT COLLECTION",
      title: "LOCAL RULES COMMUNICATION & RENTAL ENFORCEMENT TOOLKIT",
      titleHTML: "LOCAL RULES<br>COMMUNICATION TOOLKIT",
      description:
        "A communication and documentation toolkit designed to research local rules, explain them clearly to customers, document policy violations, and support consistent internal responses.",
      type: "DOCUMENT COLLECTION 02 OF 02",
      audience: "GOLF CART RENTAL BUSINESSES",
      value: "$397",
      investment: "$397",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-local-rules-toolkit-book.png",
      openImage: "images/knowledge-vault-local-rules-toolkit-open.png",
      bookAlt: "Local Rules Communication & Rental Enforcement Toolkit",
      detailHref: "",
      openSubtitleHTML: "COMMUNICATE CLEARLY<br>DOCUMENT CONSISTENTLY",
      openFooter: "DOCUMENT COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A communication and documentation toolkit designed to research local rules, explain them clearly to customers, document policy violations, and support consistent internal responses.",
      sideNumberHTML: "02 <span>OF</span> 02",
      sideAudience: "FOR GOLF CART RENTAL BUSINESSES"
    },
    {
      id: "fleet-maintenance-toolkit",
      category: "fleet",
      number: "01",
      eyebrow: "FLEET COLLECTION",
      title: "FLEET CLEANING & PREVENTIVE MAINTENANCE TOOLKIT",
      titleHTML: "FLEET CLEANING &<br>PREVENTIVE MAINTENANCE",
      description:
        "A complete cleaning and preventive maintenance system to help you protect your investment, extend vehicle life, and deliver a clean, safe and professional experience to every customer.",
      type: "FLEET COLLECTION 01 OF 01",
      audience: "OWNERS, MANAGERS & MAINTENANCE STAFF",
      value: "$297",
      investment: "$297",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-fleet-maintenance-toolkit-book.png",
      openImage: "images/knowledge-vault-fleet-maintenance-toolkit-open.png",
      bookAlt: "Fleet Cleaning & Preventive Maintenance Toolkit",
      detailHref: "",
      openSubtitleHTML: "CLEAN. INSPECT.<br>DOCUMENT. PREPARE.",
      openFooter: "FLEET COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A complete cleaning and preventive maintenance system to help you protect your investment, extend vehicle life, and deliver a clean, safe and professional experience to every customer.",
      sideNumberHTML: "01 <span>OF</span> 01",
      sideAudience: "FOR OWNERS, MANAGERS & MAINTENANCE STAFF"
    },
    {
      id: "road-beyond-launch",
      category: "growth",
      number: "01",
      eyebrow: "GROWTH COLLECTION",
      title: "THE ROAD BEYOND LAUNCH",
      titleHTML: "THE ROAD<br>BEYOND LAUNCH",
      description:
        "A post-launch review and growth-planning system designed to evaluate performance, strengthen operations, prepare for seasonal changes, and make informed decisions about future growth.",
      type: "GROWTH COLLECTION 01 OF 01",
      audience: "LAUNCHED & GROWING RENTAL BUSINESSES",
      value: "$197",
      investment: "$197",
      purchaseType: "SECURE ACCESS",
      bookImage: "images/knowledge-vault-road-beyond-launch-book.png",
      openImage: "images/knowledge-vault-road-beyond-launch-open.png",
      bookAlt: "The Road Beyond Launch",
      detailHref: "",
      openSubtitleHTML: "REVIEW. ADAPT. GROW.",
      openFooter: "GROWTH COLLECTION",
      leftResources: [],
      rightResources: [],
      disclaimer: "",
      sideDescription:
        "A post-launch review and growth-planning system designed to evaluate performance, strengthen operations, prepare for seasonal changes, and make informed decisions about future growth.",
      sideNumberHTML: "01 <span>OF</span> 01",
      sideAudience: "FOR LAUNCHED & GROWING RENTAL BUSINESSES"
    }
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let activeCategory = "signature-systems";
  let systems = allSystems.filter((item) => item.category === activeCategory);
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

  function preloadImage(source) {
    if (!source) return Promise.resolve(false);
    if (imagePromises.has(source)) return imagePromises.get(source);

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

  function preloadSystem(system, includeOpenImage = false) {
    const sources = [system.bookImage];
    if (includeOpenImage && system.openImage) sources.push(system.openImage);
    return Promise.all(sources.map(preloadImage));
  }

  function renderResourceList(listElement, resources) {
    if (!listElement) return;
    listElement.replaceChildren();
    (resources || []).forEach(([number, name, price]) => {
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

  let openDisclaimer = document.querySelector(".vault-open-disclaimer");
  if (!openDisclaimer && openMotto) {
    openDisclaimer = document.createElement("p");
    openDisclaimer.className = "vault-open-disclaimer";
    openMotto.before(openDisclaimer);
  }

  function nextSystem() {
    return systems[currentIndex + 1] || null;
  }

  function renderOpenInformation(system) {
    if (openEyebrow) openEyebrow.textContent = system.eyebrow;
    if (openTitle) openTitle.innerHTML = system.titleHTML;
    if (openSubtitle) openSubtitle.innerHTML = system.openSubtitleHTML;
    renderResourceList(openLists[0], system.leftResources);
    renderResourceList(openLists[1], system.rightResources);
    if (openPageFooter) openPageFooter.textContent = system.openFooter;
    if (openSummaryValues[0]) openSummaryValues[0].textContent = system.value;
    if (openSummaryValues[1]) openSummaryValues[1].textContent = system.investment;
    if (openSummaryValues[2]) openSummaryValues[2].textContent = system.purchaseType;
    if (openDetailsButton) {
      openDetailsButton.href = system.detailHref || "#";
      openDetailsButton.style.display = system.detailHref ? "" : "none";
    }
    if (openDisclaimer) {
      openDisclaimer.textContent = system.disclaimer;
      openDisclaimer.hidden = !system.disclaimer;
    }
    if (sideTitle) sideTitle.innerHTML = system.titleHTML;
    if (sideDescription) sideDescription.textContent = system.sideDescription;
    if (sideSystemNumber) sideSystemNumber.innerHTML = system.sideNumberHTML;
    if (sideAudience) sideAudience.textContent = system.sideAudience;
    if (sideCard) sideCard.setAttribute("aria-label", `${system.title} overview`);
    openingLayer.dataset.vaultSystem = system.id;
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.replaceChildren();
    systems.forEach((system, index) => {
      const dot = document.createElement("button");
      dot.className = "vault-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `View ${system.title}`);
      if (index === currentIndex) {
        dot.classList.add("is-active");
        dot.setAttribute("aria-current", "true");
      }
      dot.addEventListener("click", () => {
        changeSystem(index, index > currentIndex ? "next" : "previous");
      });
      dotsContainer.append(dot);
    });
  }

  function updateNavigationAvailability() {
    if (previousButton) {
      previousButton.disabled = animationInProgress || bookIsOpen || currentIndex === 0;
    }
    if (nextButton) {
      nextButton.disabled =
        animationInProgress || bookIsOpen || currentIndex >= systems.length - 1;
    }
    if (upNextLink) {
      const available = Boolean(nextSystem());
      upNextLink.classList.toggle("is-disabled", !available);
      upNextLink.setAttribute("aria-disabled", available ? "false" : "true");
    }
  }

  function renderSystem(index) {
    const system = systems[index];
    if (!system) return;
    currentIndex = index;

    if (systemLayout) systemLayout.dataset.vaultSystem = system.id;

    bookImage.src = system.bookImage;
    bookImage.alt = system.bookAlt;
    bookImage.setAttribute("aria-label", `Open the ${system.title} system`);

    if (detailEyebrow) detailEyebrow.textContent = system.eyebrow;
    if (detailTitle) detailTitle.innerHTML = system.titleHTML;
    if (detailDescription) detailDescription.textContent = system.description;
    if (detailType) detailType.textContent = system.type;
    if (detailAudience) detailAudience.textContent = system.audience;
    if (detailValue) detailValue.textContent = system.value;
    if (detailInvestment) detailInvestment.textContent = system.investment;

    openButton.href = system.detailHref || "#";

    if (currentCounter) currentCounter.textContent = String(index + 1).padStart(2, "0");
    if (totalCounter) totalCounter.textContent = String(systems.length).padStart(2, "0");

    const upcoming = nextSystem();
    if (upNextTitle) upNextTitle.textContent = upcoming ? upcoming.title : "";
    if (upNextLink) upNextLink.href = upcoming ? `#${upcoming.id}` : "#";

    renderOpenInformation(system);
    renderDots();
    updateNavigationAvailability();
  }

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
      direction === "next" ? "is-sliding-out-left" : "is-sliding-out-right";
    const incomingClass =
      direction === "next" ? "is-preparing-from-right" : "is-preparing-from-left";

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

  async function openBook(event) {
    event.preventDefault();
    if (animationInProgress || bookIsOpen) return;

    const system = systems[currentIndex];
    animationInProgress = true;
    lastOpenTrigger = event.currentTarget || openButton;
    openButton.setAttribute("aria-busy", "true");
    updateNavigationAvailability();

    await preloadSystem(system, true);
    renderOpenInformation(system);

    openingFrame.src = system.openImage || system.bookImage;
    openingFrame.alt = system.bookAlt;

    openInformation.hidden = true;
    openInformation.classList.remove("is-visible");
    openingLayer.hidden = false;
    openingLayer.setAttribute("aria-hidden", "false");
    hero.classList.remove("is-book-opening");
    hero.classList.add("is-book-open");

    bookIsOpen = true;
    animationInProgress = false;
    openButton.removeAttribute("aria-busy");
    updateNavigationAvailability();
    closeButton.focus({ preventScroll: true });
  }

  async function closeBook() {
    if (animationInProgress || !bookIsOpen) return;

    animationInProgress = true;
    openInformation.classList.remove("is-visible");
    openInformation.hidden = true;
    hero.classList.remove("is-book-open", "is-book-opening");
    openingLayer.setAttribute("aria-hidden", "true");
    openingLayer.hidden = true;

    bookIsOpen = false;
    animationInProgress = false;
    updateNavigationAvailability();

    if (lastOpenTrigger instanceof HTMLElement) {
      lastOpenTrigger.focus({ preventScroll: true });
    }
  }

  function setCategory(category) {
    if (animationInProgress) return;
    if (bookIsOpen) closeBook();

    activeCategory = category;
    systems = allSystems.filter((item) => item.category === category);
    currentIndex = 0;

    categoryButtons.forEach((button) => {
      const isActive = button.dataset.vaultCategory === category;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    renderSystem(0);
    if (systems[0]) preloadSystem(systems[0], true);
  }

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
    if (nextSystem()) changeSystem(currentIndex + 1, "next");
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.vaultCategory);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookIsOpen) closeBook();
    if (!bookIsOpen && !animationInProgress && event.key === "ArrowRight") {
      changeSystem(currentIndex + 1, "next");
    }
    if (!bookIsOpen && !animationInProgress && event.key === "ArrowLeft") {
      changeSystem(currentIndex - 1, "previous");
    }
  });

  function startFromHash() {
    const id = window.location.hash.replace("#", "");
    const match = allSystems.find((item) => item.id === id);
    if (match) {
      setCategory(match.category);
      const index = systems.findIndex((item) => item.id === id);
      renderSystem(index >= 0 ? index : 0);
      return;
    }
    setCategory("signature-systems");
  }

  window.addEventListener("hashchange", () => {
    if (!bookIsOpen && !animationInProgress) startFromHash();
  });

  startFromHash();
});