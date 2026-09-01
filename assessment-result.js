document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.location.href = "signin.html";
      return;
    }
    const user = (await supabase.auth.getUser()).data.user || data.session.user;
    const meta = user.user_metadata || {};
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

  const answers = JSON.parse(localStorage.getItem("twm-assessment") || "null");
  if (!answers) {
    window.location.href = "assessment.html";
    return;
  }

  const have = (answers.have || []).filter((item) => item !== "nothing");
  const support = answers.support || [];

  let stage = {
    explore: "Foundation",
    plan: "Launch",
    operate: "Growth",
    expand: "Expansion"
  }[answers.journey] || "Foundation";

  if (stage === "Foundation" && (answers.fleet === "established" || answers.fleet === "upgrade")) {
    stage = "Launch";
  }
  if (stage === "Launch" && answers.fleet === "established" && have.length >= 7) {
    stage = "Growth";
  }
  if (stage === "Growth" && answers.fleet === "upgrade" && answers.goal === "custom-fleet") {
    stage = "Expansion";
  }

  const score = Math.min(100, Math.round((have.length / 13) * 100));
  const summary = score <= 30
    ? "The vision is there. The operating structure is not in place yet."
    : score <= 60
    ? "A foundation exists. Key systems still need to be installed."
    : score <= 85
    ? "The business is moving. The next gain is consistency."
    : "The structure is strong. The next chapter is growth.";

  const timing = {
    "30": "Within 30 days",
    "90": "Within 3 months",
    "180": "Within 6 months",
    explore: "Still exploring"
  }[answers.timing] || "—";

  const opsItems = ["sops", "training", "pickup", "office", "agreement", "waiver", "rules", "reservations", "maintenance", "fleet-system"];
  const weakOps = opsItems.filter((item) => have.includes(item)).length < 3;

  let system = {
    title: "Business Launcher",
    href: "business-launcher.html",
    text: "The right starting system for building a rental business with structure before the doors open."
  };

  if (answers.international === "yes") {
    system = {
      title: "International Business Launcher",
      href: "international-business-launcher.html",
      text: "Built for founders organizing a U.S. rental business from an international starting point."
    };
  } else if (answers.goal === "operations" || answers.goal === "documents" || (stage === "Growth" && weakOps)) {
    system = {
      title: "Operation Bundle",
      href: "operation-bundle.html",
      text: "The operating system for daily consistency, team clarity, and documented procedures."
    };
  } else if (answers.goal === "grow" || stage === "Expansion") {
    system = {
      title: "The Road Beyond Launch",
      href: "the-road-beyond-launch.html",
      text: "A post-launch system for reviewing performance and planning the next chapter of growth."
    };
  } else if (answers.goal === "custom-fleet") {
    system = {
      title: "Fleet Cleaning & Maintenance Toolkit",
      href: "fleet-cleaning-preventive-maintenance-toolkit.html",
      text: "The working resource for keeping the fleet consistent while the next vehicles are planned."
    };
  }

  const catalog = [
    ["business-plan", "Foundation", "Business Plan Template & Example", "business-plan-template-example.html"],
    ["registered", "Foundation", "Business Launch Roadmap", "business-launch-roadmap.html"],
    ["training", "Operation", "Employee Training Guide", "employee-training-guide.html"],
    ["sops", "Operation", "Standard Operating Procedures", "standard-operating-procedures-sop.html"],
    ["office", "Operation", "Essential Office Setup Checklist", "essential-office-setup-equipment-checklist.html"],
    ["pickup", "Operation", "Pickup & Return Template", "golf-cart-pickup-return-template.html"],
    ["agreement", "Document", "Rental Agreement & Liability Waiver", "rental-agreement-liability-waiver.html"],
    ["waiver", "Document", "Rental Agreement & Liability Waiver", "rental-agreement-liability-waiver.html"],
    ["rules", "Document", "Local Rules Toolkit", "local-rules-rental-enforcement-toolkit.html"],
    ["maintenance", "Fleet", "Fleet Cleaning & Maintenance Toolkit", "fleet-cleaning-preventive-maintenance-toolkit.html"]
  ];

  const resources = [];
  const used = new Set();
  catalog.forEach(([key, collection, title, href]) => {
    if (!have.includes(key) && !used.has(href) && resources.length < 5) {
      used.add(href);
      resources.push({ collection, title, href });
    }
  });
  if ((stage === "Growth" || stage === "Expansion") && resources.length < 5) {
    resources.push({
      collection: "Growth",
      title: "The Road Beyond Launch",
      href: "the-road-beyond-launch.html"
    });
  }
  if (answers.goal === "grow" && resources.length < 5) {
    resources.push({
      collection: "Finance",
      title: "Three-Year Revenue Forecasting",
      href: "three-year-revenue-forecasting.html"
    });
  }

  const missingLabels = {
    "business-plan": "Business plan",
    registered: "Registered business",
    insurance: "Commercial insurance",
    sops: "Standard operating procedures",
    training: "Employee training",
    pickup: "Pickup and return process",
    office: "Office setup",
    agreement: "Rental agreement",
    waiver: "Liability waiver",
    rules: "Local rules communication",
    reservations: "Reservations and booking",
    maintenance: "Maintenance and inspection",
    "fleet-system": "Fleet management",
    marketing: "Marketing and branding"
  };

  let service = null;
  if (support.includes("operations") || answers.timing === "30") {
    service = {
      title: "Implementation Services",
      href: "implementation-services.html",
      text: "On-site guidance to install the system inside the real operation."
    };
  } else if (support.includes("growth") || answers.goal === "grow") {
    service = {
      title: "Fleet Solution",
      href: "fleet-solution.html",
      text: "Private support for the fleet the business needs next."
    };
  } else if (answers.goal === "custom-fleet") {
    service = {
      title: "Fleet Builder",
      href: "fleet-builder.html",
      text: "Custom fleet development designed around the brand."
    };
  }

  document.getElementById("ar-summary").textContent = summary;
  document.getElementById("ar-stage").textContent = stage;
  document.getElementById("ar-score").textContent = score + " / 100";
  document.getElementById("ar-timing").textContent = timing;
  document.getElementById("ar-system-title").textContent = system.title;
  document.getElementById("ar-system-text").textContent = system.text;
  document.getElementById("ar-system-link").href = system.href;

  document.getElementById("ar-resources").innerHTML = resources.map((item) =>
    `<a class="ar-resource" href="${item.href}"><small>${item.collection}</small>${item.title}</a>`
  ).join("") || "<p>Your current structure is already well covered.</p>";

  const missing = Object.keys(missingLabels).filter((key) => !have.includes(key)).slice(0, 6);
  const missingBox = document.getElementById("ar-missing");
  if (!missing.length) {
    missingBox.innerHTML = "<li>You already appear to have a strong operating foundation.</li>";
  } else {
    missingBox.innerHTML = missing.map((key) => `<li>${missingLabels[key]}</li>`).join("");
  }

  if (service) {
    document.getElementById("ar-service-title").textContent = service.title;
    document.getElementById("ar-service-text").textContent = service.text;
    const link = document.getElementById("ar-service-link");
    link.hidden = false;
    link.href = service.href;
  }

  localStorage.setItem("twm-assessment-result", JSON.stringify({
    stage,
    score,
    system: system.title
  }));
});