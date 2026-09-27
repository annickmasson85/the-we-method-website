window.TWM_PRINCIPAL_I18N = {
  en: {
    menuBrand: "THE WE METHOD",
    house: "YOUR HOUSE",
    desk: "Principal Desk",
    insight: "Operation Insight",
    journey: "Client Journey",
    work: "CLIENT WORK",
    board: "Implementation Board",
    forms: "Questionnaires",
    appointments: "Appointments",
    ledger: "THE LEDGER",
    sold: "Resources sold",
    preview: "PREVIEW",
    suite: "Owner’s Suite",
    implPage: "Implementation page",
    logout: "LOG OUT",
    leaveTitle: "Leave the desk?",
    leaveCopy: "Sign out of the principal account and return to the public house.",
    back: "BACK",
    kicker: "COMMAND VIEW",
    title: "The house, in one look.",
    intro: "Applications, appointments, questionnaires, and resources sold. This page is not visible to clients.",
    metricSold: "Resources sold",
    metricSoldNote: "Systems currently open to buyers",
    metricOpen: "Open files",
    metricOpenNote: "Implementation dossiers in motion",
    metricAppt: "Appointments",
    metricApptNote: "Scheduled this week",
    metricForms: "Questionnaires",
    metricFormsNote: "Waiting for review",
    boardKicker: "IMPLEMENTATION BOARD",
    filesTitle: "Client files",
    demoNote: "Demonstration records until live requests are connected.",
    colClient: "Client",
    colSystem: "System",
    colStage: "Stage",
    colNext: "Next",
    principal: "PRINCIPAL"
  },
  fr: {
    menuBrand: "THE WE METHOD",
    house: "LA MAISON",
    desk: "Bureau principal",
    insight: "Lecture de l’opération",
    journey: "Parcours client",
    work: "TRAVAIL CLIENT",
    board: "Dossiers d’implantation",
    forms: "Questionnaires",
    appointments: "Rendez-vous",
    ledger: "LE REGISTRE",
    sold: "Ressources vendues",
    preview: "APERÇU",
    suite: "Owner’s Suite",
    implPage: "Page Implantation",
    logout: "DÉCONNEXION",
    leaveTitle: "Quitter le bureau ?",
    leaveCopy: "Fermer la session principale et revenir à la maison publique.",
    back: "RETOUR",
    kicker: "VUE DE COMMANDE",
    title: "La maison, d’un seul regard.",
    intro: "Demandes, rendez-vous, questionnaires et ressources vendues. Cette page n’est pas visible aux clients.",
    metricSold: "Ressources vendues",
    metricSoldNote: "Systèmes ouverts aux acheteurs",
    metricOpen: "Dossiers ouverts",
    metricOpenNote: "Implantations en cours",
    metricAppt: "Rendez-vous",
    metricApptNote: "Cette semaine",
    metricForms: "Questionnaires",
    metricFormsNote: "En attente de lecture",
    boardKicker: "DOSSIERS D’IMPLANTATION",
    filesTitle: "Dossiers clients",
    demoNote: "Exemples jusqu’à la connexion des vraies demandes.",
    colClient: "Client",
    colSystem: "Système",
    colStage: "Étape",
    colNext: "Suite",
    principal: "PRINCIPALE"
  }
};

window.TWM_PRINCIPAL_LANG = localStorage.getItem("twm-principal-lang") === "fr" ? "fr" : "en";

window.twmPrincipalText = function (key) {
  var pack = window.TWM_PRINCIPAL_I18N[window.TWM_PRINCIPAL_LANG] || window.TWM_PRINCIPAL_I18N.en;
  return pack[key] || window.TWM_PRINCIPAL_I18N.en[key] || key;
};

window.twmSetPrincipalLang = function (lang) {
  window.TWM_PRINCIPAL_LANG = lang === "fr" ? "fr" : "en";
  localStorage.setItem("twm-principal-lang", window.TWM_PRINCIPAL_LANG);
  window.location.reload();
};