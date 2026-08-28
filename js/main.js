/* HMG Arabia — shared site behavior */
(function () {
  "use strict";

  var STORAGE_KEY = "hmg-lang";

  function getNested(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function applyTranslations(lang) {
    var dict = TRANSLATIONS[lang];
    if (!dict) return;

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = getNested(dict, key);
      if (val !== null && typeof val === "string") el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var val = getNested(dict, key);
      if (val !== null && typeof val === "string") el.setAttribute("placeholder", val);
    });

    var pageTitleKey = document.documentElement.getAttribute("data-page-title");
    if (pageTitleKey) {
      var titleVal = getNested(dict, pageTitleKey);
      if (titleVal) document.title = titleVal;
    }

    document.querySelectorAll(".lang-option").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang") === lang);
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function initLang() {
    var saved = localStorage.getItem(STORAGE_KEY) || "en";
    applyTranslations(saved);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();

    var langToggle = document.getElementById("langToggle");
    if (langToggle) {
      langToggle.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("lang") || "en";
        applyTranslations(current === "en" ? "ar" : "en");
      });
    }

    var hamburger = document.getElementById("hamburger");
    var navLinks = document.getElementById("navLinks");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("open");
        hamburger.classList.toggle("open");
      });
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          navLinks.classList.remove("open");
          hamburger.classList.remove("open");
        });
      });
    }

    var navbar = document.getElementById("navbar");
    if (navbar) {
      window.addEventListener("scroll", function () {
        navbar.classList.toggle("scrolled", window.scrollY > 10);
      });
    }

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;

        form.querySelectorAll("[required]").forEach(function (input) {
          var isEmpty = !input.value.trim();
          var isBadEmail = input.type === "email" && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
          if (isEmpty || isBadEmail) {
            valid = false;
            input.classList.add("invalid");
          } else {
            input.classList.remove("invalid");
          }
        });

        var errorEl = document.getElementById("formError");
        var successEl = document.getElementById("formSuccess");

        if (!valid) {
          if (errorEl) errorEl.classList.add("show");
          if (successEl) successEl.classList.remove("show");
          return;
        }

        if (errorEl) errorEl.classList.remove("show");
        form.reset();
        form.style.display = "none";
        if (successEl) successEl.classList.add("show");
      });

      form.querySelectorAll("input, textarea").forEach(function (input) {
        input.addEventListener("input", function () {
          input.classList.remove("invalid");
        });
      });
    }
  });
})();
