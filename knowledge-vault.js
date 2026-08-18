document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".vault-hero");
  const openButton = document.querySelector("[data-vault-link]");
  const bookImage = document.querySelector("[data-vault-book]");
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

  /*
    Si un élément important manque dans le HTML,
    le JavaScript s'arrête sans briser la page.
  */
  if (
    !hero ||
    !openButton ||
    !openingLayer ||
    !openingFrame ||
    !openInformation ||
    !closeButton
  ) {
    console.warn(
      "Knowledge Vault : un élément nécessaire à l’animation est manquant."
    );
    return;
  }

  const openingFrames = [
    "images/knowledge-vault-opening-01.png",
    "images/knowledge-vault-opening-02.png",
    "images/knowledge-vault-opening-03.png",
    "images/knowledge-vault-opening-04.png",
    "images/knowledge-vault-opening-05.png"
  ];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let animationInProgress = false;
  let bookIsOpen = false;

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

  /*
    Préchargement des cinq images pour éviter
    un clignotement pendant l'ouverture.
  */
  const preloadFrames = Promise.all(
    openingFrames.map((source) => {
      return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => resolve(true);

        image.onerror = () => {
          console.warn(`Image introuvable : ${source}`);
          resolve(false);
        };

        image.src = source;
      });
    })
  );

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
      /*
        L'image est déjà préchargée dans la majorité
        des navigateurs. Aucune action supplémentaire
        n'est nécessaire si decode() échoue.
      */
    }

    openingFrame.classList.remove("is-changing-frame");

    await wait(pause);
  }

  async function openBook(event) {
    event.preventDefault();

    if (animationInProgress || bookIsOpen) {
      return;
    }

    animationInProgress = true;
    openButton.setAttribute("aria-busy", "true");

    await preloadFrames;

    /*
      Préparation de la première image.
    */
    openingFrame.src = openingFrames[0];

    openInformation.hidden = true;
    openInformation.classList.remove("is-visible");

    openingLayer.hidden = false;
    openingLayer.setAttribute("aria-hidden", "false");

    hero.classList.remove("is-book-open");
    hero.classList.add("is-book-opening");

    await waitForPaint();

    /*
      Lecture des images 01 à 05.
    */
    if (reducedMotion.matches) {
      openingFrame.src = openingFrames[4];
    } else {
      await wait(170);

      for (let index = 1; index < openingFrames.length; index += 1) {
        await displayFrame(openingFrames[index]);
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

    closeButton.focus({
      preventScroll: true
    });
  }

  async function closeBook() {
    if (animationInProgress || !bookIsOpen) {
      return;
    }

    animationInProgress = true;

    /*
      Les informations disparaissent avant
      que le livre commence à se refermer.
    */
    openInformation.classList.remove("is-visible");

    if (!reducedMotion.matches) {
      await wait(220);
    }

    openInformation.hidden = true;

    hero.classList.remove("is-book-open");
    hero.classList.add("is-book-opening");

    if (reducedMotion.matches) {
      openingFrame.src = openingFrames[0];
    } else {
      /*
        Lecture inverse : 05 vers 01.
      */
      for (
        let index = openingFrames.length - 2;
        index >= 0;
        index -= 1
      ) {
        await displayFrame(openingFrames[index], 180);
      }
    }

    hero.classList.remove("is-book-opening");

    openingLayer.setAttribute("aria-hidden", "true");
    openingLayer.hidden = true;

    bookIsOpen = false;
    animationInProgress = false;

    openButton.focus({
      preventScroll: true
    });
  }

  openButton.addEventListener("click", openBook);
  closeButton.addEventListener("click", closeBook);
if (bookImage) {
  bookImage.setAttribute("role", "button");
  bookImage.setAttribute("tabindex", "0");
  bookImage.setAttribute(
    "aria-label",
    "Open the Business Launcher system"
  );

  bookImage.addEventListener("click", openBook);

  bookImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBook(event);
    }
  });
}
  /*
    La touche Échap permet également de fermer le livre.
  */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookIsOpen) {
      closeBook();
    }
  });

  /*
    Le préchargement commence dès l'arrivée sur la page.
  */
  preloadFrames;
});