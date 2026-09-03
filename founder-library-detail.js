(function () {
  "use strict";

  const products = window.TWM_LIBRARY_PRODUCTS || [];
  const config = window.TWM_LIBRARY_CONFIG || {};

  const contentCatalog = {
    businessFoundry: {
      collection: "SIGNATURE SYSTEM",
      mode: "valued",
      items: [
        { name: "Business Launch — 10 Phases", price: "$1,500" },
        { name: "Business Launch Roadmap", price: "$250" },
        { name: "The Road Beyond Launch", price: "$197" },
        { name: "Three-Year Revenue Forecasting", price: "$397" },
        { name: "Employee Training Guide", price: "$495" },
        { name: "Rental Agreement & Liability Waiver", price: "$450" },
        { name: "Fleet Cleaning & Preventive Maintenance Toolkit", price: "$297" },
        { name: "Local Rules Communication & Rental Enforcement Toolkit", price: "$397" },
        { name: "Business Plan Template & Example", price: "$297" },
        { name: "Standard Operating Procedures (SOP)", price: "$497" },
        { name: "Golf Cart Pickup & Return Template", price: "$99" },
        { name: "Essential Office Setup & Equipment Checklist", price: "$147" }
      ]
    },

    internationalBusinessLauncher: {
      collection: "SIGNATURE SYSTEM",
      mode: "valued",
      items: [
        { name: "Business Launch — 10 Phases", price: "$1,500" },
        { name: "E-2 Business Package Organizer", price: "$397" },
        { name: "Business Launch Roadmap", price: "$250" },
        { name: "The Road Beyond Launch", price: "$197" },
        { name: "Three-Year Revenue Forecasting", price: "$397" },
        { name: "Employee Training Guide", price: "$495" },
        { name: "Rental Agreement & Liability Waiver", price: "$450" },
        { name: "Fleet Cleaning & Preventive Maintenance Toolkit", price: "$297" },
        { name: "Local Rules Communication & Rental Enforcement Toolkit", price: "$397" },
        { name: "Business Plan Template & Example", price: "$297" },
        { name: "Essential Office Setup & Equipment Checklist", price: "$147" },
        { name: "Standard Operating Procedures (SOP)", price: "$497" },
        { name: "Golf Cart Pickup & Return Template", price: "$99" }
      ]
    },

    operationBundle: {
      collection: "SIGNATURE SYSTEM",
      mode: "valued",
      items: [
        { name: "Standard Operating Procedures (SOP)", price: "$497" },
        { name: "Employee Training Guide", price: "$495" },
        { name: "Rental Agreement & Liability Waiver", price: "$450" },
        { name: "Fleet Cleaning & Preventive Maintenance Toolkit", price: "$297" },
        { name: "Golf Cart Pickup & Return Template", price: "$99" },
        { name: "Local Rules Communication & Rental Enforcement Toolkit", price: "$397" }
      ]
    },

    businessLaunchRoadmap: {
      collection: "FOUNDATION",
      mode: "details",
      items: [
        "Business idea & concept",
        "Market research",
        "Target customer",
        "Location research",
        "Competitor analysis",
        "Business model",
        "Startup preparation",
        "Business formation",
        "Financial preparation",
        "Operations setup",
        "Technology setup",
        "Launch preparation",
        "Growth direction"
      ]
    },

    businessPlanTemplate: {
      collection: "FOUNDATION",
      mode: "details",
      items: [
        "Executive Summary",
        "Company Description",
        "Business Concept",
        "Market Analysis",
        "Target Customer",
        "Competitive Analysis",
        "Products & Services",
        "Pricing Strategy",
        "Marketing Strategy",
        "Operations Plan",
        "Management & Staffing",
        "Startup Costs",
        "Revenue Forecast",
        "Financial Plan",
        "Risk & Growth Strategy",
        "Complete example business plan"
      ]
    },

    employeeTrainingGuide: {
      collection: "OPERATION",
      mode: "details",
      items: [
        "Hiring preparation",
        "Employee orientation",
        "Roles & responsibilities",
        "Customer service standards",
        "Daily operating procedures",
        "Rental procedures",
        "Equipment / fleet procedures",
        "Safety expectations",
        "Incident procedures",
        "Employee performance review",
        "Disciplinary documentation",
        "Employee exit process",
        "Training forms & checklists"
      ]
    },

    essentialOfficeSetup: {
      collection: "OPERATION",
      mode: "details",
      items: [
        "Front desk setup",
        "Office equipment",
        "Computer & technology needs",
        "Printer / scanner setup",
        "Payment equipment",
        "Reservation system equipment",
        "Communication tools",
        "Customer-facing materials",
        "Administrative supplies",
        "Safety supplies",
        "Opening checklist"
      ]
    },

    standardOperatingProcedures: {
      collection: "OPERATION",
      mode: "details",
      items: [
        "Opening procedures",
        "Closing procedures",
        "Reservation procedures",
        "Customer check-in",
        "Customer check-out",
        "Payment procedures",
        "Equipment inspection",
        "Fleet preparation",
        "Damage procedures",
        "Incident response",
        "Customer service standards",
        "Cleaning procedures",
        "Maintenance coordination",
        "Staff responsibilities",
        "Emergency procedures",
        "Operational checklists"
      ]
    },

    golfCartPickupReturn: {
      collection: "OPERATION",
      mode: "details",
      items: [
        "Customer information",
        "Golf cart information",
        "Pickup inspection",
        "Existing damage documentation",
        "Fuel / battery condition",
        "Accessories & equipment check",
        "Customer acknowledgment",
        "Return inspection",
        "New damage documentation",
        "Return condition",
        "Employee verification",
        "Signature sections"
      ]
    },

    threeYearRevenueForecasting: {
      collection: "FINANCE",
      mode: "details",
      items: [
        "Year 1 revenue projection",
        "Year 2 revenue projection",
        "Year 3 revenue projection",
        "Monthly revenue estimates",
        "Rental volume assumptions",
        "Pricing assumptions",
        "Seasonal projections",
        "Operating expenses",
        "Fixed expenses",
        "Variable expenses",
        "Growth assumptions",
        "Cash-flow planning",
        "Profit projections",
        "Break-even planning",
        "Three-year forecasting worksheets"
      ]
    },

    rentalAgreementLiabilityWaiver: {
      collection: "DOCUMENT",
      mode: "details",
      items: [
        "Rental agreement",
        "Customer information",
        "Authorized driver information",
        "Rental dates & equipment",
        "Payment terms",
        "Security / damage responsibility",
        "Rules of operation",
        "Prohibited use",
        "Customer responsibilities",
        "Risk acknowledgment",
        "Liability waiver",
        "Damage responsibility",
        "Accident / incident obligations",
        "Signature sections"
      ]
    },

    localRulesToolkit: {
      collection: "DOCUMENT",
      mode: "details",
      items: [
        "Local rules communication",
        "Customer rule acknowledgment",
        "Restricted-road information",
        "Operating restrictions",
        "Driver requirements",
        "Alcohol / drug restrictions",
        "Violation warnings",
        "Rental enforcement procedures",
        "Rule violation documentation",
        "Warning documentation",
        "Immediate rental termination documentation",
        "Staff enforcement guidance",
        "Customer-facing notices"
      ]
    },

    fleetCleaningMaintenance: {
      collection: "FLEET",
      mode: "details",
      items: [
        "Daily fleet inspection",
        "Cleaning procedures",
        "Cleaning checklist",
        "Pre-rental inspection",
        "Post-rental inspection",
        "Preventive maintenance schedule",
        "Battery checks",
        "Tire checks",
        "Brake checks",
        "Lights & safety equipment",
        "Maintenance tracking",
        "Repair documentation",
        "Damage tracking",
        "Vehicle service history",
        "Fleet condition monitoring"
      ]
    },

    roadBeyondLaunch: {
      collection: "GROWTH",
      mode: "details",
      items: [
        "Post-launch business review",
        "Stabilizing operations",
        "Tracking business performance",
        "Identifying operational weaknesses",
        "Customer experience review",
        "Revenue growth opportunities",
        "Improving existing systems",
        "Fleet growth planning",
        "Team development",
        "Marketing growth",
        "Partnership opportunities",
        "Expansion preparation",
        "Protecting profitability",
        "Long-term business direction"
      ]
    }
  };

  const contentAliases = {
    "business-foundry": "businessFoundry",
    "business-launcher": "businessFoundry",
    "international-business-launcher": "internationalBusinessLauncher",
    "operation-bundle": "operationBundle",
    "business-launch-roadmap": "businessLaunchRoadmap",
    "business-plan-template-example": "businessPlanTemplate",
    "business-plan-template-and-example": "businessPlanTemplate",
    "employee-training-guide": "employeeTrainingGuide",
    "essential-office-setup-equipment-checklist": "essentialOfficeSetup",
    "essential-office-setup-and-equipment-checklist": "essentialOfficeSetup",
    "standard-operating-procedures": "standardOperatingProcedures",
    "standard-operating-procedures-sop": "standardOperatingProcedures",
    "golf-cart-pickup-return-template": "golfCartPickupReturn",
    "golf-cart-pickup-and-return-template": "golfCartPickupReturn",
    "three-year-revenue-forecasting": "threeYearRevenueForecasting",
    "rental-agreement-liability-waiver": "rentalAgreementLiabilityWaiver",
    "rental-agreement-and-liability-waiver": "rentalAgreementLiabilityWaiver",
    "local-rules-communication-rental-enforcement-toolkit": "localRulesToolkit",
    "local-rules-communication-and-rental-enforcement-toolkit": "localRulesToolkit",
    "fleet-cleaning-preventive-maintenance-toolkit": "fleetCleaningMaintenance",
    "fleet-cleaning-and-preventive-maintenance-toolkit": "fleetCleaningMaintenance",
    "the-road-beyond-launch": "roadBeyondLaunch",
    "road-beyond-launch": "roadBeyondLaunch"
  };

  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  }

  function getOwnedProducts() {
    if (Array.isArray(window.TWM_OWNED_PRODUCTS)) {
      return new Set(window.TWM_OWNED_PRODUCTS);
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(config.ownershipStorageKey || "twm-owned-products") || "null"
      );
      if (Array.isArray(saved)) return new Set(saved);
    } catch (error) {
      console.warn("The saved library access list could not be read.", error);
    }

    return new Set(config.defaultOwned || []);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value || "—";
  }

  function findRequestedProduct() {
    const params = new URLSearchParams(window.location.search);
    const requestedSlug = params.get("product") || "business-foundry";
    const possibleSlugs = [requestedSlug];

    if (requestedSlug === "business-foundry") possibleSlugs.push("business-launcher");
    if (requestedSlug === "business-launcher") possibleSlugs.push("business-foundry");

    return (
      products.find((item) => possibleSlugs.includes(item.slug)) ||
      products.find((item) => slugify(item.title) === slugify(requestedSlug)) ||
      products[0]
    );
  }

  function getDisplayTitle(product) {
    const productSlug = slugify(product.slug);
    const productTitle = slugify(product.title);

    if (
      productSlug === "business-launcher" ||
      productSlug === "business-foundry" ||
      productTitle === "business-launcher"
    ) {
      return "Business Foundry";
    }

    return product.title;
  }

  function getProductContent(product, displayTitle) {
    const candidates = [slugify(product.slug), slugify(displayTitle), slugify(product.title)];

    for (const candidate of candidates) {
      const catalogKey = contentAliases[candidate];
      if (catalogKey && contentCatalog[catalogKey]) return contentCatalog[catalogKey];
    }

    const fallbackItems = Array.isArray(product.includes) ? product.includes : [];
    const hasPrices = fallbackItems.some((item) => {
      const value = typeof item === "string" ? item : item && item.price;
      return /\$[\d,]+/.test(String(value || ""));
    });

    return {
      collection: product.collection || "THE WE METHOD LIBRARY",
      mode: hasPrices ? "valued" : "details",
      items: fallbackItems
    };
  }

  function renderIncludes(product, displayTitle) {
    const list = document.getElementById("product-includes-list");
    if (!list) return;

    const content = getProductContent(product, displayTitle);
    setText("includes-collection", content.collection);
    setText("includes-title", "WHAT’S INCLUDED");

    list.innerHTML = "";
    list.className = content.mode === "valued" ? "is-valued-list" : "is-detail-list";
    list.style.setProperty("--include-rows", String(Math.ceil(content.items.length / 2)));

    content.items.forEach((item) => {
      const li = document.createElement("li");

      if (typeof item === "object" && item !== null) {
        const name = document.createElement("span");
        const price = document.createElement("strong");
        name.textContent = item.name || item.title || "";
        price.textContent = item.price || "";
        li.append(name, price);
      } else {
        li.textContent = item;
      }

      list.appendChild(li);
    });
  }

  function setupSlider() {
    const panel = document.getElementById("product-panel");
    const toggle = document.getElementById("includes-toggle");
    const overview = document.querySelector(".product-overview");
    const includes = document.getElementById("product-includes");

    if (!panel || !toggle || !overview || !includes) return;

    const label = toggle.querySelector(".includes-toggle__label");
    let startX = null;

    function setOpen(open) {
      panel.classList.toggle("is-showing-includes", open);
      toggle.setAttribute("aria-expanded", String(open));
      overview.setAttribute("aria-hidden", String(open));
      includes.setAttribute("aria-hidden", String(!open));
      if (label) label.textContent = open ? "BACK TO DETAILS" : "SEE WHAT’S INSIDE";
    }

    toggle.addEventListener("click", () => {
      setOpen(!panel.classList.contains("is-showing-includes"));
    });

    panel.addEventListener(
      "touchstart",
      (event) => {
        startX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );

    panel.addEventListener(
      "touchend",
      (event) => {
        if (startX === null) return;

        const distance = event.changedTouches[0].clientX - startX;
        if (distance < -55) setOpen(true);
        if (distance > 55) setOpen(false);
        startX = null;
      },
      { passive: true }
    );

    setOpen(false);
  }

  function renderProduct() {
    const product = findRequestedProduct();
    if (!product) return;

    const displayTitle = getDisplayTitle(product);
    document.title = displayTitle + " | Founder Library";

    const image = document.getElementById("product-image");
    if (image) {
      image.src = product.image;
      image.alt = displayTitle;
    }

    setText("product-method", product.method);
    setText("product-title", displayTitle);
    setText("product-summary", product.summary);
    setText("product-value", product.totalValue);
    setText("product-investment", product.investment);
    setText("product-type", product.type);
    setText("product-audience", product.audience);
    setText("product-focus", product.focus);
    setText("product-level", product.level);
    setText("product-duration", product.duration);
    setText("product-format", product.format);
    renderIncludes(product, displayTitle);

    const owned = getOwnedProducts().has(product.slug);
    const lockedState = document.getElementById("locked-state");
    const ownedState = document.getElementById("owned-state");
    const action = document.getElementById("product-action");

    if (lockedState) lockedState.hidden = owned;
    if (ownedState) ownedState.hidden = !owned;

    if (action) {
      action.textContent = owned ? "OPEN SYSTEM" : "ADD TO CART";
      action.href = owned
        ? product.openUrl || "founder-library.html"
        : product.cartUrl || "my-cart.html";
      action.setAttribute(
        "aria-label",
        owned ? "Open " + displayTitle : "Add " + displayTitle + " to cart"
      );
    }

    setupSlider();
  }

  document.addEventListener("DOMContentLoaded", renderProduct);
})();