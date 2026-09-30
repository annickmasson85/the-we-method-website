(() => {
  function initTwmClub() {
    document.querySelectorAll("[data-twm-club]").forEach((section) => {
      const target = Date.parse(section.dataset.revealDate);
      const label = section.querySelector("[data-countdown-label]");

      const fields = ["days", "hours", "minutes", "seconds"].map(
        (unit) => section.querySelector(`[data-${unit}]`)
      );

      if (
        !Number.isFinite(target) ||
        !label ||
        fields.some((field) => !field)
      ) return;

      let interval;

      function update() {
        const total = Math.max(
          0,
          Math.ceil((target - Date.now()) / 1000)
        );

        const values = [
          Math.floor(total / 86400),
          Math.floor((total % 86400) / 3600),
          Math.floor((total % 3600) / 60),
          total % 60
        ];

        fields.forEach((field, index) => {
          const next = String(values[index]).padStart(2, "0");

          if (field.textContent !== next) {
            field.textContent = next;
          }
        });

        if (total === 0) {
          label.textContent = "The wait is over.";
          clearInterval(interval);
        }
      }

      interval = setInterval(update, 1000);
      update();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initTwmClub,
      { once: true }
    );
  } else {
    initTwmClub();
  }
})();