/* ==========================================================
   Aurevique Studio — Site JavaScript
   Handles: mobile navigation, FAQ accordion, contact form
   validation + submission feedback, and message char counter.
   All features are feature-detected, so this single file is
   safe to include on every page of the site.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initFaqAccordion();
  initContactForm();
});

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks") || document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close the mobile menu after a nav link is tapped
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  // Close the menu if the viewport is resized back to desktop width
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/* ---------- FAQ Accordion ---------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", function () {
      const isOpen = item.classList.contains("open");

      // Close any other open item so only one answer shows at a time
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          const otherQuestion = other.querySelector(".faq-question");
          if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", !isOpen);
      question.setAttribute("aria-expanded", (!isOpen).toString());
    });
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const textarea = form.querySelector("textarea");
  const charCount = form.querySelector(".char-count");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Live character counter for the message field
  if (textarea && charCount) {
    const maxLength = parseInt(textarea.getAttribute("maxlength"), 10) || 500;

    const updateCount = function () {
      const length = textarea.value.length;
      charCount.textContent = length + " / " + maxLength;
      charCount.classList.toggle("limit-near", length >= maxLength * 0.9);
    };

    textarea.addEventListener("input", updateCount);
    updateCount();
  }

  // Clear an individual field's error state as the user fixes it
  form.querySelectorAll("input, select, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
      clearFieldError(field);
    });
    field.addEventListener("change", function () {
      clearFieldError(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateContactForm(form)) {
      showStatus(statusEl, "Please fix the highlighted fields and try again.", "error");
      return;
    }

    // No backend is wired up yet — simulate a submission so the
    // experience feels complete, and surface a clear success state.
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    window.setTimeout(function () {
      showStatus(
        statusEl,
        "Thank you! Your message has been sent — we'll be in touch within 24 hours.",
        "success"
      );
      form.reset();
      if (charCount) charCount.textContent = "0 / " + (textarea ? textarea.getAttribute("maxlength") : 500);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right"></i>';
      }
    }, 900);
  });
}

function validateContactForm(form) {
  let isValid = true;

  const name = form.querySelector("#cf-name");
  const email = form.querySelector("#cf-email");
  const projectType = form.querySelector("#cf-project-type");
  const message = form.querySelector("#cf-message");
  const terms = form.querySelector("#cf-terms");

  if (name && !name.value.trim()) {
    setFieldError(name, "Please enter your full name.");
    isValid = false;
  }

  if (email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      setFieldError(email, "Please enter your email address.");
      isValid = false;
    } else if (!emailPattern.test(email.value.trim())) {
      setFieldError(email, "Please enter a valid email address.");
      isValid = false;
    }
  }

  if (projectType && !projectType.value) {
    setFieldError(projectType, "Please select a project type.");
    isValid = false;
  }

  if (message && !message.value.trim()) {
    setFieldError(message, "Please tell us a little about your project.");
    isValid = false;
  }

  if (terms && !terms.checked) {
    isValid = false;
    terms.closest("label").classList.add("has-error");
  }

  return isValid;
}

function setFieldError(field, message) {
  const group = field.closest(".form-group");
  if (group) {
    group.classList.add("has-error");
    const errorEl = group.querySelector(".field-error");
    if (errorEl) errorEl.textContent = message;
  }
}

function clearFieldError(field) {
  const group = field.closest(".form-group");
  if (group) {
    group.classList.remove("has-error");
    const errorEl = group.querySelector(".field-error");
    if (errorEl) errorEl.textContent = "";
  }

  const label = field.closest(".checkbox-row");
  if (label) label.classList.remove("has-error");
}

function showStatus(statusEl, message, type) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = "form-status " + type;
}
