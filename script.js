"use strict";

/* Helpers */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

/* Run after DOM ready */
document.addEventListener("DOMContentLoaded", () => {
    /* =========================
        Mobile menu toggle
   ========================= */
    const menuBtn = $("[data-menu-btn]");
    const menu = $("[data-menu]");
    const navLinks = $$(".nav_link");

    if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when click any nav link
    navLinks.forEach((a) => {
        a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        });
    });

    // Close when click outside
    document.addEventListener("click", (e) => {
        if (!menu.classList.contains("is-open")) return;
        const insideMenu = menu.contains(e.target);
        const insideBtn = menuBtn.contains(e.target);
        if (!insideMenu && !insideBtn) {
        menu.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        }
    });
    }

    /* =========================
        Smooth scroll for internal anchors
  ========================= */
    $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
      if (!href || href === "#") return; // don't break buttons / placeholders
        const target = $(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    });

    /* =========================
        Active link on scroll
  ========================= */
    const sections = $$("main[id], section[id]");
    const setActiveLink = () => {
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
        a.classList.toggle("is-active", href === `#${currentId}`);
    });
    };

    window.addEventListener("scroll", setActiveLink);
    window.addEventListener("load", setActiveLink);

    /* =========================
        Tiny toast + copy buttons
  ========================= */
    let toastTimer = null;

    function toast(msg) {
    let el = $(".toast");
    if (!el) {
        el = document.createElement("div");
        el.className = "toast";
        document.body.appendChild(el);
    }

    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
    }

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
    } catch (err) {
        toast("فشل النسخ ❌");
    }
    }

    $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => copyText(btn.dataset.copy));
    });

    /* =========================
        Contact WhatsApp link
  ========================= */
    const waLink = $("#waLink");
    if (waLink) {
    const phone = "9613949805"; // نفس رقمك بصفحتك
    const msg = "مرحبا، بدي استفسر عن العطور.";
    waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }
    /* =========================
        Stand order -> WhatsApp message
  ========================= */
    const standBtn = $("#standWhatsBtn");
    if (standBtn) {
    // إذا الزر كان <a href="#"> بدل <button>، منمنع يرجّعك للهوم
    standBtn.addEventListener("click", (e) => {
        e.preventDefault();

      const phone = "9613949805"; // بدون +
        const shopType = ($("#shopType")?.value || "").trim();
        const shopName = ($("#shopName")?.value || "").trim();
        const address = ($("#address")?.value || "").trim();
        const hasStand = ($("#hasStand")?.value || "").trim();
        const hasExp = ($("#hasExp")?.value || "").trim();
        const city = ($("#city")?.value || "").trim();

      // نص الرسالة (بدون إيموجي إذا بدك أضمن 100%)
        const msg =
        "مرحبا، بدي اطلب ستاند Victoria Mix.\n\n" +
        "نوع المحل: " + (shopType || "-") + "\n" +
        "اسم المحل: " + (shopName || "-") + "\n" +
        "العنوان: " + (address || "-") + "\n" +
        "المدينة/المنطقة: " + (city || "-") + "\n" +
        "هل يوجد ستاند حاليا؟ " + (hasStand || "-") + "\n" +
        "هل هدفك تجاري؟ " + (hasExp || "-");

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
    });
    }

    /* =========================
        Footer year (optional)
  ========================= */
    const yEl = $("#y");
    if (yEl) yEl.textContent = String(new Date().getFullYear());
});