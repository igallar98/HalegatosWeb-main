document.addEventListener("DOMContentLoaded", function () {
  var body = document.body;
  var header = document.querySelector("[data-site-header]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  function createIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function syncHeaderState() {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  function setMenuState(isOpen) {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.hidden = !isOpen;
    body.classList.toggle("menu-open", isOpen);
  }

  function setupMenu() {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    mobileMenuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1000) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });
  }

  function setupCarousel(carousel) {
    var track = carousel.querySelector("[data-carousel-track]");
    var slides = carousel.querySelectorAll("[data-carousel-slide]");
    var dots = carousel.querySelectorAll("[data-carousel-dot]");
    var prevButton = carousel.querySelector("[data-carousel-prev]");
    var nextButton = carousel.querySelector("[data-carousel-next]");

    if (!track || slides.length === 0) {
      return;
    }

    var activeIndex = 0;

    function slideOffset(index) {
      return slides[index] ? slides[index].offsetLeft : 0;
    }

    function updateDots(index) {
      dots.forEach(function (dot, dotIndex) {
        var isActive = dotIndex === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
      });
    }

    function goToSlide(index) {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      track.scrollTo({
        left: slideOffset(activeIndex),
        behavior: "smooth"
      });
      updateDots(activeIndex);
    }

    function syncFromScroll() {
      var nearestIndex = 0;
      var nearestDistance = Number.POSITIVE_INFINITY;

      slides.forEach(function (slide, index) {
        var distance = Math.abs(track.scrollLeft - slide.offsetLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      activeIndex = nearestIndex;
      updateDots(activeIndex);
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        goToSlide(activeIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        goToSlide(activeIndex + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = Number(dot.getAttribute("data-index"));
        goToSlide(index);
      });
    });

    track.addEventListener("scroll", function () {
      window.requestAnimationFrame(syncFromScroll);
    }, { passive: true });

    window.addEventListener("resize", function () {
      goToSlide(activeIndex);
    });

    updateDots(activeIndex);
  }

  function setupSwimCalendar(calendar) {
    var eventNodes = Array.from(calendar.querySelectorAll("[data-calendar-event]"));
    var spotlightLabel = calendar.querySelector("[data-calendar-status-label]");
    var spotlightTitle = calendar.querySelector("[data-calendar-next-title]");
    var spotlightDate = calendar.querySelector("[data-calendar-next-date]");

    if (eventNodes.length === 0 || !spotlightLabel || !spotlightTitle || !spotlightDate) {
      return;
    }

    function parseDate(value) {
      var parts = value.split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    }

    var eventItems = eventNodes.map(function (node, index) {
      var start = parseDate(node.getAttribute("data-start"));
      var end = parseDate(node.getAttribute("data-end"));
      var endExclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1, 0, 0, 0, 0);

      return {
        index: index,
        node: node,
        title: node.querySelector("h3"),
        place: node.querySelector(".swim-event__place"),
        status: node.querySelector("[data-calendar-event-status]"),
        start: start,
        endExclusive: endExclusive
      };
    }).sort(function (left, right) {
      return left.start - right.start;
    });

    function formatDate(date) {
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }

    function formatRange(start, endExclusive) {
      var end = new Date(endExclusive.getTime() - 1);

      if (start.toDateString() === end.toDateString()) {
        return formatDate(start);
      }

      return "Del " + formatDate(start) + " al " + formatDate(end);
    }

    function refreshCalendar() {
      var now = new Date();
      var currentEvent = null;
      var nextEvent = null;

      eventItems.forEach(function (item) {
        var isCurrent = now >= item.start && now < item.endExclusive;
        var isPast = now >= item.endExclusive;

        item.node.classList.remove("is-past", "is-current", "is-next");

        if (isCurrent) {
          currentEvent = item;
          item.node.classList.add("is-current");
          item.status.textContent = "En curso";
          return;
        }

        if (isPast) {
          item.node.classList.add("is-past");
          item.status.textContent = "Disputada";
          return;
        }

        if (!nextEvent) {
          nextEvent = item;
          item.node.classList.add("is-next");
          item.status.textContent = "Siguiente";
          return;
        }

        item.status.textContent = "Programada";
      });

      if (currentEvent) {
        spotlightLabel.textContent = "En curso ahora";
        spotlightTitle.textContent = currentEvent.title ? currentEvent.title.textContent : "Competicion en curso";
        spotlightDate.textContent = formatRange(currentEvent.start, currentEvent.endExclusive) + (currentEvent.place ? " · " + currentEvent.place.textContent : "");
        return;
      }

      if (nextEvent) {
        spotlightLabel.textContent = "Proxima cita";
        spotlightTitle.textContent = nextEvent.title ? nextEvent.title.textContent : "Proxima competicion";
        spotlightDate.textContent = formatRange(nextEvent.start, nextEvent.endExclusive) + (nextEvent.place ? " · " + nextEvent.place.textContent : "");
        return;
      }

      spotlightLabel.textContent = "Temporada completada";
      spotlightTitle.textContent = "No quedan competiciones pendientes";
      spotlightDate.textContent = "Ya se han disputado todas las pruebas de la temporada 2025-26.";
    }

    refreshCalendar();
    window.setInterval(refreshCalendar, 60000);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        refreshCalendar();
      }
    });
  }

  createIcons();
  setupMenu();
  document.querySelectorAll("[data-carousel]").forEach(setupCarousel);
  document.querySelectorAll("[data-swim-calendar]").forEach(setupSwimCalendar);
  window.addEventListener("scroll", syncHeaderState, { passive: true });
  syncHeaderState();
});
