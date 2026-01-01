n// script.js
(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // ===== Tiny toast =====
  let toastTimer;
  function toast(msg) {
    clearTimeout(toastTimer);
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  }

  // ===== Copy helper =====
  async function copyText(text) {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast("تم النسخ ✅");
    } catch (e) {
      toast("فشل النسخ ❌");
      console.error(e);
    }
  }

  // ===== Mobile menu =====
  const menuBtn = $("[data-menu-btn]");
  const menu = $("[data-menu]");
  const navLinks = $$(".nav_link");

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // close when click a link
    navLinks.forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("is-open"))
    );

    // close when click outside
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      const insideMenu = menu.contains(e.target);
      const insideBtn = menuBtn.contains(e.target);
      if (!insideMenu && !insideBtn) menu.classList.remove("is-open");
    });
  }

  // ===== Smooth scroll for internal anchors =====
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ===== Active link on scroll =====
  const sections = $$("section[id], main[id]");
  function setActiveLink() {
    if (!sections.length) return;
    const y = window.scrollY + 140;
    let currentId = "";

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (y >= top && y < top + height) currentId = sec.id;
    });

    if (!currentId) return;

    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === #${currentId});
    });
  }
  window.addEventListener("scroll", setActiveLink);
  window.addEventListener("load", setActiveLink);

  // ===== Copy buttons (data-copy) =====
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => copyText(btn.dataset.copy));
  });

  // ===== WhatsApp + Social links =====
  const phone = "9613949805"; // بدون +
  const waLink = $("#waLink");
  if (waLink) {
    const msg = "مرحبا، بدي استفسر عن العطور";
    waLink.href = https://wa.me/${phone}?text=${encodeURIComponent(msg)};
    waLink.rel = "noreferrer";
  }

  // ===== Stand order WhatsApp =====
  const standBtn = $("#standWhatsBtn");
  if (standBtn) {
    standBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const shopType = $("#shopType")?.value?.trim() || "";
      const shopName = $("#shopName")?.value?.trim() || "";
      const address = $("#address")?.value?.trim() || "";
      const hasStand = $("#hasStand")?.value?.trim() || "";
      const hasExp = $("#hasExp")?.value?.trim() || "";
      const city = $("#city")?.value?.trim() || "";
      // (اختياري) تنبيه إذا ناقص شي
      if (!shopType  !shopName  !address || !city) {
        toast("عبّي نوع المحل + اسم المحل + العنوان + المدينة");
        return;
      }

      let msg = "مرحبا، بدي اطلب ستاند Victoria Mix مجانا.\n\n";
      msg += نوع المحل: ${shopType}\n;
      msg += اسم المحل: ${shopName}\n;
      msg += العنوان: ${address}\n;
      msg += المدينة/المنطقة: ${city}\n;
      msg += هل يوجد ستاند حاليا؟ ${hasStand || "غير محدد"}\n;
      msg += هل هدفك تجاري؟ ${hasExp || "غير محدد"}\n;

      const url = https://wa.me/${phone}?text=${encodeURIComponent(msg)};
      window.open(url, "_blank", "noopener");
    });
  }
})();