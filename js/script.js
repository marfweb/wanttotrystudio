/* ==========================================================================
   script.js — shared behaviour across all pages
   Loading screen, sticky navbar, mobile menu, scroll reveal, scroll progress,
   lightbox gallery, floating WhatsApp / back-to-top buttons, FAQ accordion.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById("loading-screen");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 350);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => loader.classList.add("hidden"), 1800);
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById("scroll-progress");
  const onScrollProgress = () => {
    if (!progress) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + "%";
  };
  document.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* ---------- Sticky navbar ---------- */
  const navbar = document.querySelector(".navbar");
  const onScrollNav = () => {
    if (!navbar) return;
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  document.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Highlight active nav link ---------- */
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- Scroll reveal (fade up / zoom) ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-zoom");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 600) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    }, { passive: true });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Floating WhatsApp button ---------- */
  const waBtn = document.querySelector(".float-wa");
  if (waBtn && typeof CONFIG !== "undefined") {
    waBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo WantToTry Studio, saya ingin bertanya tentang booking studio.")}`;
    waBtn.target = "_blank";
    waBtn.rel = "noopener";
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Lightbox gallery ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    const photos = Array.from(document.querySelectorAll(".gallery-photo img"));
    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      lightboxImg.src = photos[currentIndex].src;
      lightboxImg.alt = photos[currentIndex].alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    };
    const showNext = (dir) => {
      currentIndex = (currentIndex + dir + photos.length) % photos.length;
      lightboxImg.src = photos[currentIndex].src;
      lightboxImg.alt = photos[currentIndex].alt;
    };

    photos.forEach((img, i) => {
      img.closest(".gallery-photo").addEventListener("click", () => openLightbox(i));
    });
    closeBtn && closeBtn.addEventListener("click", closeLightbox);
    prevBtn && prevBtn.addEventListener("click", () => showNext(-1));
    nextBtn && nextBtn.addEventListener("click", () => showNext(1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext(1);
      if (e.key === "ArrowLeft") showNext(-1);
    });
  }

});
