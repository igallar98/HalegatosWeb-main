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

  createIcons();
  setupMenu();
  document.querySelectorAll("[data-carousel]").forEach(setupCarousel);
  window.addEventListener("scroll", syncHeaderState, { passive: true });
  syncHeaderState();
});
