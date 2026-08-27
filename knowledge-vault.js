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

    bookImage.src = system.openImage || system.bookImage;
    bookImage.alt = system.bookAlt;

    hero.classList.add("is-book-open");
    openingLayer.hidden = false;
    openingLayer.setAttribute("aria-hidden", "false");
    if (openingFrame) {
      openingFrame.src = system.openImage || system.bookImage;
      openingFrame.alt = system.bookAlt;
    }

    bookIsOpen = true;
    animationInProgress = false;
    openButton.removeAttribute("aria-busy");
    updateNavigationAvailability();
    closeButton.focus({ preventScroll: true });
  }

  async function closeBook() {
    if (animationInProgress || !bookIsOpen) return;

    const system = systems[currentIndex];
    animationInProgress = true;

    hero.classList.remove("is-book-open", "is-book-opening");
    openingLayer.hidden = true;
    openingLayer.setAttribute("aria-hidden", "true");
    openInformation.hidden = true;
    openInformation.classList.remove("is-visible");

    bookImage.src = system.bookImage;
    bookImage.alt = system.bookAlt;

    bookIsOpen = false;
    animationInProgress = false;
    updateNavigationAvailability();

    if (lastOpenTrigger instanceof HTMLElement) {
      lastOpenTrigger.focus({ preventScroll: true });
    }
  }