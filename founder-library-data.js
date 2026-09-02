(function () {
  "use strict";

  const resourceDefaults = {
    collection: "Founder Resource",
    method: "FOUNDER RESOURCE",
    type: "Printable business resource",
    audience: "Golf cart rental founders",
    level: "All stages",
    duration: "Self-paced",
    format: "PDF, guide & working pages",
    includes: [
      "Complete printable resource",
      "Step-by-step guidance",
      "Working pages for implementation"
    ]
  };

  const products = [
    {
      slug: "business-launcher",
      title: "Business Launcher",
      image: "images/knowledge-vault-business-launcher-book.png",
      collection: "Signature System",
      method: "METHOD 1",
      type: "Complete business system",
      audience: "U.S. entrepreneurs",
      focus: "Business setup & launch",
      level: "Foundation to launch",
      duration: "10+ hours",
      format: "PDF, guides, templates & more",
      summary: "The complete starting system for building a structured golf cart rental business in the United States.",
      totalValue: "$5,023",
      investment: "$1,997",
      openUrl: "business-launcher.html",
      includes: [
        "Business Launch — 10 phases",
        "Business Launch Roadmap",
        "Business Plan Template & Example",
        "Essential Office Setup Checklist",
        "Employee Training Guide",
        "Standard Operating Procedures",
        "Pickup & Return Template",
        "Rental Agreement & Liability Waiver",
        "Local Rules Toolkit",
        "Fleet Cleaning & Maintenance Toolkit",
        "Three-Year Revenue Forecasting",
        "The Road Beyond Launch"
      ]
    },
    {
      slug: "international-business-launcher",
      title: "International Business Launcher",
      image: "images/knowledge-vault-international-business-launcher-book.png",
      collection: "Signature System",
      method: "METHOD 2",
      type: "Complete business system",
      audience: "International entrepreneurs",
      focus: "U.S. business setup from anywhere",
      level: "Beginner to launch",
      duration: "15+ hours",
      format: "PDF, guide, template & more",
      summary: "A complete system for international founders who want to launch and operate a U.S. golf cart rental business.",
      totalValue: "$5,420",
      investment: "$2,197",
      openUrl: "international-business-launcher.html",
      includes: [
        "Business Launch — 10 Phases",
        "E-2 Business Package Organizer",
        "Business Launch Roadmap",
        "The Road Beyond Launch",
        "Three-Year Revenue Forecasting",
        "Employee Training Guide",
        "Rental Agreement & Liability Waiver",
        "Fleet Cleaning & Preventive Maintenance Toolkit",
        "Local Rules Communication Toolkit",
        "Business Plan Template & Example",
        "Essential Office Setup Checklist",
        "Standard Operating Procedures",
        "Pickup & Return Template"
      ]
    },
    {
      slug: "operation-bundle",
      title: "Operation Bundle",
      image: "images/knowledge-vault-operation-bundle-book.png",
      collection: "Signature System",
      method: "METHOD 3",
      type: "Complete operating system",
      audience: "Existing rental businesses",
      focus: "Operations, team & consistency",
      level: "Operating to growth",
      duration: "Self-paced",
      format: "PDF, guides, templates & more",
      summary: "The operating system for daily consistency, team clarity and documented procedures.",
      totalValue: "$2,235",
      investment: "$1,495",
      openUrl: "operation-bundle.html",
      includes: [
        "Employee Training Guide",
        "Essential Office Setup Checklist",
        "Standard Operating Procedures",
        "Pickup & Return Template",
        "Rental Agreement & Liability Waiver",
        "Local Rules Toolkit",
        "Fleet Cleaning & Maintenance Toolkit"
      ]
    },
    {
      ...resourceDefaults,
      slug: "business-launch-roadmap",
      title: "Business Launch Roadmap",
      image: "images/knowledge-vault-business-launch-roadmap-book.png",
      focus: "Launch planning",
      summary: "A strategic roadmap from early research to launch readiness.",
      totalValue: "$250",
      investment: "$250",
      openUrl: "business-launch-roadmap.html"
    },
    {
      ...resourceDefaults,
      slug: "business-plan-template",
      title: "Business Plan Template & Example",
      image: "images/business-plan-template.png",
      focus: "Business planning",
      summary: "A guided resource for turning research and assumptions into a structured plan.",
      totalValue: "$297",
      investment: "$297",
      openUrl: "business-plan-template-example.html"
    },
    {
      ...resourceDefaults,
      slug: "employee-training-guide",
      title: "Employee Training Guide",
      image: "images/knowledge-vault-employee-training-guide-book.png",
      focus: "Team training",
      summary: "A training system for daily responsibilities, service and consistent operations.",
      totalValue: "$495",
      investment: "$495",
      openUrl: "employee-training-guide.html"
    },
    {
      ...resourceDefaults,
      slug: "office-setup-checklist",
      title: "Essential Office Setup Checklist",
      image: "images/office-setup-checklist.png",
      focus: "Office setup",
      summary: "A practical checklist for a functional rental workspace.",
      totalValue: "$147",
      investment: "$147",
      openUrl: "essential-office-setup-equipment-checklist.html"
    },
    {
      ...resourceDefaults,
      slug: "standard-operating-procedures",
      title: "Standard Operating Procedures",
      image: "images/standard-operating-procedures.png",
      focus: "Daily operations",
      summary: "A documented system for consistent procedures across every shift.",
      totalValue: "$497",
      investment: "$497",
      openUrl: "standard-operating-procedures-sop.html"
    },
    {
      ...resourceDefaults,
      slug: "pickup-return-template",
      title: "Pickup & Return Template",
      image: "images/knowledge-vault-pickup-return-template-book.png",
      focus: "Customer handoff",
      summary: "An inspection and documentation system from departure to return.",
      totalValue: "$99",
      investment: "$99",
      openUrl: "golf-cart-pickup-return-template.html"
    },
    {
      ...resourceDefaults,
      slug: "three-year-revenue-forecasting",
      title: "Three-Year Revenue Forecasting",
      image: "images/three-year-revenue-forecasting.png",
      focus: "Financial forecasting",
      summary: "A planning resource for revenue goals and growth scenarios.",
      totalValue: "$397",
      investment: "$397",
      openUrl: "three-year-revenue-forecasting.html"
    },
    {
      ...resourceDefaults,
      slug: "rental-agreement-liability-waiver",
      title: "Rental Agreement & Liability Waiver",
      image: "images/knowledge-vault-rental-agreement-book.png",
      focus: "Rental documents",
      summary: "A structured template for terms, responsibilities and risk acknowledgments.",
      totalValue: "$450",
      investment: "$450",
      openUrl: "rental-agreement-liability-waiver.html"
    },
    {
      ...resourceDefaults,
      slug: "local-rules-toolkit",
      title: "Local Rules Toolkit",
      image: "images/knowledge-vault-local-rules-toolkit-book.png",
      focus: "Rules & enforcement",
      summary: "A toolkit for explaining local rules and documenting policy violations.",
      totalValue: "$397",
      investment: "$397",
      openUrl: "local-rules-rental-enforcement-toolkit.html"
    },
    {
      ...resourceDefaults,
      slug: "fleet-maintenance-toolkit",
      title: "Fleet Cleaning & Maintenance Toolkit",
      image: "images/knowledge-vault-fleet-maintenance-toolkit-book.png",
      focus: "Fleet care",
      summary: "A practical system for cleaning, inspection and preventive maintenance.",
      totalValue: "$297",
      investment: "$297",
      openUrl: "fleet-cleaning-preventive-maintenance-toolkit.html"
    },
    {
      ...resourceDefaults,
      slug: "road-beyond-launch",
      title: "The Road Beyond Launch",
      image: "images/road-beyond-launch.png",
      focus: "Post-launch growth",
      summary: "A review and growth-planning system after the business is launched.",
      totalValue: "$197",
      investment: "$197",
      openUrl: "the-road-beyond-launch.html"
    }
  ].map((product) => ({
    ...product,
    cartUrl: "my-cart.html?product=" + encodeURIComponent(product.slug)
  }));

  window.TWM_LIBRARY_PRODUCTS = products;
  window.TWM_LIBRARY_CONFIG = {
    ownershipStorageKey: "twm-owned-products",
    defaultOwned: []
  };
})();