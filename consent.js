// ---------------- Analytics Consent Banner ----------------
// Works with the Consent Mode defaults set inline in each page's <head>.
// The visitor's choice is stored in localStorage as "granted" or "denied".
(function () {
    const STORAGE_KEY = "tt_analytics_consent";

    function readChoice() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function saveChoice(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable: choice applies to this page view only */ }
        if (typeof gtag === "function") gtag("consent", "update", { analytics_storage: value });
    }

    const style = document.createElement("style");
    style.textContent = `
        #tt-consent { position: fixed; left: 1rem; right: 1rem; bottom: 1rem; z-index: 2000; max-width: 34rem;
            margin-left: auto; margin-right: auto; padding: 1.1rem 1.25rem; border-radius: 1rem;
            background: #111827; color: #d1d5db; border: 1px solid #374151; box-shadow: 0 20px 40px rgba(0,0,0,.45);
            font: 14px/1.55 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
        #tt-consent p { margin: 0 0 .85rem; }
        #tt-consent a { color: #e9d5ff; text-decoration: underline; }
        #tt-consent .tt-consent-actions { display: flex; flex-wrap: wrap; gap: .5rem; }
        #tt-consent button { cursor: pointer; border-radius: 999px; padding: .55rem 1.15rem; font: 600 13px/1 system-ui, sans-serif; border: 1px solid #4b5563; background: transparent; color: #f9fafb; }
        #tt-consent button.tt-accept { background: #7e22ce; border-color: #7e22ce; }
        #tt-consent button:hover { filter: brightness(1.15); }
        #tt-consent button:focus-visible { outline: 2px solid #c084fc; outline-offset: 2px; }
    `;
    document.head.appendChild(style);

    function showBanner() {
        if (document.getElementById("tt-consent")) return;
        const banner = document.createElement("div");
        banner.id = "tt-consent";
        banner.setAttribute("role", "region");
        banner.setAttribute("aria-label", "Cookie consent");
        banner.innerHTML =
            '<p>We use Google Analytics cookies to understand how visitors use this website. You can accept or decline analytics cookies. See our <a href="privacy.html#cookies">Privacy Policy</a>.</p>' +
            '<div class="tt-consent-actions">' +
            '<button type="button" class="tt-accept">Accept analytics</button>' +
            '<button type="button" class="tt-decline">Decline</button>' +
            "</div>";
        banner.querySelector(".tt-accept").addEventListener("click", () => { saveChoice("granted"); banner.remove(); });
        banner.querySelector(".tt-decline").addEventListener("click", () => { saveChoice("denied"); banner.remove(); });
        document.body.appendChild(banner);
    }

    function init() {
        if (!readChoice()) showBanner();
        document.querySelectorAll("[data-consent-open]").forEach(btn => {
            btn.addEventListener("click", () => {
                showBanner();
                const accept = document.querySelector("#tt-consent .tt-accept");
                if (accept) accept.focus();
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
