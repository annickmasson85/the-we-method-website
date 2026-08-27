document.addEventListener("DOMContentLoaded", () => {
  const bookImage = document.querySelector("[data-vault-book]");
  const openButton = document.querySelector("[data-vault-link]");
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
  const detailsPanel = document.querySelector(".vault-details");
  const pageTitle = document.querySelector("#vault-page-title");
  const pageIntro = document.querySelector(".vault-introduction");
  const categoryButtons = document.querySelectorAll("[data-vault-category]");

  if (!bookImage || !openButton) return;

  const titles = {
    "signature-systems": ["THE SIGNATURE SYSTEMS", "Three complete systems—presented as the most valuable works in the private collection."],
    foundation: ["FOUNDATION COLLECTION", "The planning resources created to organize the beginning of a rental business."],
    operation: ["OPERATION COLLECTION", "The internal systems created to train teams and standardize daily work."],
    finance: ["FINANCE COLLECTION", "The forecasting tools created to plan revenue with more clarity."],
    document: ["DOCUMENT COLLECTION", "The professional documents created to organize rentals and local rules."],
    fleet: ["FLEET COLLECTION", "The maintenance systems created to protect and prepare your fleet."],
    growth: ["GROWTH COLLECTION", "The post-launch tools created to review, adapt and grow."]
  };

  const allSystems = [
    {
      id: "business-launcher",
      category: "signature-systems",
      title: "BUSINESS LAUNCHER",
      titleHTML: "BUSINESS<br>LAUNCHER",
      eyebrow: "SIGNATURE SYSTEM",
      description: "The complete method created to help entrepreneurs prepare, build and launch a golf cart rental business in the United States.",
      type: "COMPLETE BUSINESS LAUNCH SYSTEM",
      audience: "U.S. CITIZENS",
      value: "$5,023",
      investment: "$1,997",
      bookImage: "images/knowledge-vault-business-launcher-book.png",
      href: "business-launcher.html"
    },
    {
      id: "international-business-launcher",
      category: "signature-systems",
      title: "INTERNATIONAL BUSINESS LAUNCHER",
      titleHTML: "INTERNATIONAL<br>BUSINESS<br>LAUNCHER",
      eyebrow: "SIGNATURE SYSTEM",
      description: "A complete step-by-step system for international entrepreneurs preparing to build, own and operate a golf cart rental business in the United States.",
      type: "COMPLETE INTERNATIONAL BUSINESS LAUNCH SYSTEM",
      audience: "INTERNATIONAL ENTREPRENEURS",
      value: "$5,420",
      investment: "$2,197",
      bookImage: "images/knowledge-vault-international-business-launcher-book.png",
      href: "international-business-launcher.html"
    },
    {
      id: "operation-bundle",
      category: "signature-systems",
      title: "OPERATION BUNDLE",
      titleHTML: "OPERATION<br>BUNDLE",
      eyebrow: "SIGNATURE SYSTEM",
      description: "A complete internal documentation system designed to strengthen, standardize and improve your existing rental business.",
      type: "COMPLETE INTERNAL OPERATIONS SYSTEM",
      audience: "EXISTING U.S. BUSINESS OWNERS",
      value: "$2,235",
      investment: "$1,495",
      bookImage: "images/knowledge-vault-operation-bundle-book.png",
      href: "operation-bundle.html"
    },
    {
      id: "business-launch-roadmap",
      category: "foundation",
      title: "BUSINESS LAUNCH ROADMAP",
      titleHTML: "BUSINESS LAUNCH<br>ROADMAP",
      eyebrow: "FOUNDATION COLLECTION",
      description: "A strategic roadmap designed to organize the journey from early research to launch readiness — with clear checkpoints, decision points, and direction for what should happen next.",
      type: "FOUNDATION COLLECTION 01 OF 02",
      audience: "ASPIRING & NEW RENTAL BUSINESSES",
      value: "$250",
      investment: "$250",
      bookImage: "images/knowledge-vault-business-launch-roadmap-book.png",
      href: "business-launch-roadmap.html"
    },
    {
      id: "business-plan-template",
      category: "foundation",
      title: "BUSINESS PLAN TEMPLATE & EXAMPLE",
      titleHTML: "BUSINESS PLAN<br>TEMPLATE & EXAMPLE",
      eyebrow: "FOUNDATION COLLECTION",
      description: "A guided planning resource designed to transform your research, ideas, financial assumptions, and operating plans into a clear, structured, and professionally organized business plan.",
      type: "FOUNDATION COLLECTION 02 OF 02",
      audience: "ASPIRING & NEW RENTAL BUSINESSES",
      value: "$297",
      investment: "$297",
      bookImage: "images/knowledge-vault-business-plan-template-book.png",
      href: "business-plan-template-example.html"
    },
    {
      id: "employee-training-guide",
      category: "operation",
      title: "EMPLOYEE TRAINING GUIDE",
      titleHTML: "EMPLOYEE<br>TRAINING GUIDE",
      eyebrow: "OPERATION COLLECTION",
      description: "A structured training and reference system designed to prepare your team for daily responsibilities, customer service, documentation, safety awareness, and consistent operations.",
      type: "OPERATION COLLECTION 01 OF 04",
      audience: "RENTAL BUSINESS OWNERS & TEAMS",
      value: "$495",
      investment: "$495",
      bookImage: "images/knowledge-vault-employee-training-guide-book.png",
      href: "employee-training-guide.html"
    },
    {
      id: "sop",
      category: "operation",
      title: "STANDARD OPERATING PROCEDURES — SOP",
      titleHTML: "STANDARD OPERATING<br>PROCEDURES — SOP",
      eyebrow: "OPERATION COLLECTION",
      description: "A documented operating system designed to standardize daily procedures, define responsibilities, strengthen consistency, and keep your rental operation organized across every shift.",
      type: "OPERATION COLLECTION 02 OF 04",
      audience: "RENTAL BUSINESS OWNERS & TEAMS",
      value: "$497",
      investment: "$497",
      bookImage: "images/knowledge-vault-sop-book.png",
      href: "standard-operating-procedures-sop.html"
    },
    {
      id: "office-setup-checklist",
      category: "operation",
      title: "ESSENTIAL OFFICE SETUP & EQUIPMENT CHECKLIST",
      titleHTML: "ESSENTIAL OFFICE SETUP<br>& EQUIPMENT CHECKLIST",
      eyebrow: "OPERATION COLLECTION",
      description: "A practical setup and organization resource designed to create a functional workspace for customers, reservations, payments, documents, equipment, employees, and daily operations.",
      type: "OPERATION COLLECTION 03 OF 04",
      audience: "ASPIRING & ESTABLISHED RENTAL BUSINESSES",
      value: "$147",
      investment: "$147",
      bookImage: "images/knowledge-vault-office-setup-checklist-book.png",
      href: "essential-office-setup-equipment-checklist.html"
    },
    {
      id: "pickup-return-template",
      category: "operation",
      title: "GOLF CART PICKUP & RETURN TEMPLATE",
      titleHTML: "GOLF CART PICKUP<br>& RETURN TEMPLATE",
      eyebrow: "OPERATION COLLECTION",
      description: "A structured inspection and documentation system designed to create a clear chain of responsibility from vehicle departure through inspection and final return.",
      type: "OPERATION COLLECTION 04 OF 04",
      audience: "GOLF CART RENTAL BUSINESSES",
      value: "$99",
      investment: "$99",
      bookImage: "images/knowledge-vault-pickup-return-template-book.png",
      href: "golf-cart-pickup-return-template.html"
    },
    {
      id: "revenue-forecasting",
      category: "finance",
      title: "THREE-YEAR REVENUE FORECASTING",
      titleHTML: "THREE-YEAR REVENUE<br>FORECASTING",
      eyebrow: "FINANCE COLLECTION",
      description: "A complete forecasting guide and worksheet system to help you estimate revenue, plan for seasonal demand, organize financial assumptions and evaluate potential growth over a three-year period.",
      type: "FINANCE COLLECTION 01 OF 01",
      audience: "ASPIRING & ESTABLISHED RENTAL BUSINESSES",
      value: "$397",
      investment: "$397",
      bookImage: "images/knowledge-vault-revenue-forecasting-book.png",
      href: "three-year-revenue-forecasting.html"
    },
    {
      id: "rental-agreement",
      category: "document",
      title: "RENTAL AGREEMENT & LIABILITY WAIVER",
      titleHTML: "RENTAL AGREEMENT<br>& LIABILITY WAIVER",
      eyebrow: "DOCUMENT COLLECTION",
      description: "A structured document template designed to organize rental terms, customer responsibilities, payment obligations, vehicle-use rules, and risk acknowledgments in one professional resource.",
      type: "DOCUMENT COLLECTION 01 OF 02",
      audience: "GOLF CART RENTAL BUSINESSES",
      value: "$450",
      investment: "$450",
      bookImage: "images/knowledge-vault-rental-agreement-book.png",
      href: "rental-agreement-liability-waiver.html"
    },
    {
      id: "local-rules-toolkit",
      category: "document",
      title: "LOCAL RULES COMMUNICATION & RENTAL ENFORCEMENT TOOLKIT",
      titleHTML: "LOCAL RULES<br>COMMUNICATION TOOLKIT",
      eyebrow: "DOCUMENT COLLECTION",
      description: "A communication and documentation toolkit designed to research local rules, explain them clearly to customers, document policy violations, and support consistent internal responses.",
      type: "DOCUMENT COLLECTION 02 OF 02",
      audience: "GOLF CART RENTAL BUSINESSES",
      value: "$397",
      investment: "$397",
      bookImage: "images/knowledge-vault-local-rules-toolkit-book.png",
      href: "local-rules-rental-enforcement-toolkit.html"
    },
    {
      id: "fleet-maintenance-toolkit",
      category: "fleet",
      title: "FLEET CLEANING & PREVENTIVE MAINTENANCE TOOLKIT",
      titleHTML: "FLEET CLEANING &<br>PREVENTIVE MAINTENANCE",
      eyebrow: "FLEET COLLECTION",
      description: "A complete cleaning and preventive maintenance system to help you protect your investment, extend vehicle life, and deliver a clean, safe and professional experience to every customer.",
      type: "FLEET COLLECTION 01 OF 01",
      audience: "OWNERS, MANAGERS & MAINTENANCE STAFF",
      value: "$297",
      investment: "$297",
      bookImage: "images/knowledge-vault-fleet-maintenance-toolkit-book.png",
      href: "fleet-cleaning-preventive-maintenance-toolkit.html"
    },
    {
      id: "road-beyond-launch",
      category: "growth",
      title: "THE ROAD BEYOND LAUNCH",
      titleHTML: "THE ROAD<br>BEYOND LAUNCH",
      eyebrow: "GROWTH COLLECTION",
      description: "A post-launch review and growth-planning system designed to evaluate performance, strengthen operations, prepare for seasonal changes, and make informed decisions about future growth.",
      type: "GROWTH COLLECTION 01 OF 01",
      audience: "LAUNCHED & GROWING RENTAL BUSINESSES",
      value: "$197",
      investment: "$197",
      bookImage: "images/knowledge-vault-road-beyond-launch-book.png",
      href: "the-road-beyond-launch.html"
    }
  ];

  let systems = [];
  let currentIndex = 0;
  let busy = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.replaceChildren();
    systems.forEach((item, index) => {
      const dot = document.createElement("button");
      dot.className = "vault-dot";
      dot.type = "button";
      if (index === currentIndex) dot.classList.add("is-active");
      dot.addEventListener("click", () => show(index, index > currentIndex ? "next" : "previous"));
      dotsContainer.append(dot);
    });
  }

  function render(index) {
    const item = systems[index];
    if (!item) return;
    currentIndex = index;
    bookImage.src = item.bookImage;
    bookImage.alt = item.title;
    if (detailEyebrow) detailEyebrow.textContent = item.eyebrow;
    if (detailTitle) detailTitle.innerHTML = item.titleHTML;
    if (detailDescription) detailDescription.textContent = item.description;
    if (detailType) detailType.textContent = item.type;
    if (detailAudience) detailAudience.textContent = item.audience;
    if (detailValue) detailValue.textContent = item.value;
    if (detailInvestment) detailInvestment.textContent = item.investment;
    openButton.href = item.href;
    if (currentCounter) currentCounter.textContent = String(index + 1).padStart(2, "0");
    if (totalCounter) totalCounter.textContent = String(systems.length).padStart(2, "0");
    const next = systems[index + 1];
    if (upNextTitle) upNextTitle.textContent = next ? next.title : "";
    if (upNextLink) {
      upNextLink.href = next ? next.href : "#";
      upNextLink.classList.toggle("is-disabled", !next);
    }
    if (previousButton) previousButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === systems.length - 1;
    renderDots();
  }

  async function show(index, direction) {
    if (busy || index === currentIndex || index < 0 || index >= systems.length) return;
    busy = true;
    if (!reducedMotion.matches && bookImage && detailsPanel) {
      const out = direction === "next" ? "is-sliding-out-left" : "is-sliding-out-right";
      const incoming = direction === "next" ? "is-preparing-from-right" : "is-preparing-from-left";
      bookImage.classList.add(out);
      detailsPanel.classList.add(out);
      await wait(280);
      bookImage.classList.remove(out);
      detailsPanel.classList.remove(out);
      render(index);
      bookImage.classList.add(incoming);
      detailsPanel.classList.add(incoming);
      await wait(30);
      bookImage.classList.remove(incoming);
      detailsPanel.classList.remove(incoming);
      await wait(400);
    } else {
      render(index);
    }
    busy = false;
  }

  function setCategory(category) {
    systems = allSystems.filter((item) => item.category === category);
    currentIndex = -1;
    categoryButtons.forEach((button) => {
      const on = button.dataset.vaultCategory === category;
      button.classList.toggle("is-active", on);
    });
    if (pageTitle && titles[category]) pageTitle.textContent = titles[category][0];
    if (pageIntro && titles[category]) pageIntro.textContent = titles[category][1];
    render(0);
  }

  previousButton?.addEventListener("click", () => show(currentIndex - 1, "previous"));
  nextButton?.addEventListener("click", () => show(currentIndex + 1, "next"));
  upNextLink?.addEventListener("click", (event) => {
    if (systems[currentIndex + 1]) {
      event.preventDefault();
      show(currentIndex + 1, "next");
    }
  });
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => setCategory(button.dataset.vaultCategory));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") show(currentIndex + 1, "next");
    if (event.key === "ArrowLeft") show(currentIndex - 1, "previous");
  });

  setCategory("signature-systems");
});