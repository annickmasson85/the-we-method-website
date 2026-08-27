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

  if (!hero || !openButton || !bookImage || !openingLayer || !openingFrame || !openInformation || !closeButton) {
    console.warn("Knowledge Vault : un élément nécessaire est manquant.");
    return;
  }

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
      bookImage: "images/knowledge-vault-business-launcher-book.png",
      openImage: "images/knowledge-vault-business-launcher-open.png",
      bookAlt: "Business Launcher Signature System",
      detailHref: "business-launcher.html",
      openSubtitleHTML: "THE COMPLETE METHOD<br>FOR U.S. CITIZENS",
      openFooter: "COMPLETE DIGITAL BUSINESS LAUNCH SYSTEM",
      leftResources: [
        ["01", "Business Launch — 10 Phases", "$1,500"],
        ["02", "Business Launch Roadmap", "$250"],
        ["03", "The Road Beyond Launch", "$197"],
        ["04", "Three-Year Revenue Forecasting", "$397"],
        ["05", "Business Plan Template & Example", "$297"],
        ["06", "Essential Office Setup & Equipment Checklist", "$147"]
      ],
      rightResources: [
        ["07", "Employee Training Guide", "$495"],
        ["08", "Rental Agreement & Liability Waiver", "$450"],
        ["09", "Fleet Cleaning & Preventive Maintenance Toolkit", "$297"],
        ["10", "Local Rules Communication & Rental Enforcement Toolkit", "$397"],
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
      bookImage: "images/knowledge-vault-international-business-launcher-book.png",
      openImage: "images/knowledge-vault-international-business-launcher-open.png",
      bookAlt: "International Business Launcher Signature System",
      detailHref: "international-business-launcher.html",
      openSubtitleHTML: "BUILD YOUR U.S. BUSINESS<br>FROM ANYWHERE<br>IN THE WORLD",
      openFooter: "COMPLETE INTERNATIONAL BUSINESS LAUNCH SYSTEM",
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
        ["08", "Fleet Cleaning & Preventive Maintenance Toolkit", "$297"],
        ["09", "Local Rules Communication & Rental Enforcement Toolkit", "$397"],
        ["10", "Business Plan Template & Example", "$297"],
        ["11", "Essential Office Setup & Equipment Checklist", "$147"],
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
      nextIndex: 2
    },
    {
      id: "operation-bundle",
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
      leftResources: [
        ["01", "Standard Operating Procedures — SOP", "$497"],
        ["02", "Employee Training Guide", "$495"],
        ["03", "Rental Agreement & Liability Waiver", "$450"]
      ],
      rightResources: [
        ["04", "Fleet Cleaning & Preventive Maintenance Toolkit", "$297"],
        ["05", "Golf Cart Pickup & Return Template", "$99"],
        ["06", "Local Rules Communication & Rental Enforcement Toolkit", "$397"]
      ],
      disclaimer:
        "ORGANIZATIONAL RESOURCE ONLY. PROFESSIONAL REVIEW AND BUSINESS-SPECIFIC CUSTOMIZATION MAY BE REQUIRED.",
      sideDescription:
        "A complete internal documentation system designed to strengthen, standardize and improve your existing rental business.",
      sideNumberHTML: "03 <span>OF</span> 03",
      sideAudience: "FOR EXISTING U.S. BUSINESSES",
      nextTitle: "BUSINESS LAUNCH ROADMAP",
      nextIndex: null
    }
  ];

  const TOTAL_SYSTEMS = 14;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    if (!source) {
      return Promise.resolve(false);
    }

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

  function preloadSystem(system, includeOpenImage = false) {
    const sources = 