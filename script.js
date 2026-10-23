const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.onload = function () {
    const canvas = document.getElementById('hero-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const hero = document.getElementById('hero');

        const sizes = { width: window.innerWidth, height: window.innerHeight };
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

        // Detect mobile
        const isMobile = window.innerWidth < 768;

        // Adjust 3D parameters for mobile
        const torusKnotRadius = isMobile ? 0.5 : 1.5;
        const torusKnotTube = isMobile ? 0.2 : 0.5;
        const particlesCount = isMobile ? 500 : 5000;
        const cameraZ = isMobile ? 2.5 : 5;

        camera.position.z = cameraZ;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Torus Knot
        const geometry = new THREE.TorusKnotGeometry(torusKnotRadius, torusKnotTube, 100, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x8A2BE2, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * (isMobile ? 15 : 25);
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: isMobile ? 0.02 : 0.01, color: 0x6A0DAD });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Animate only while the hero is on screen, and not at all for reduced-motion users
        let heroVisible = true;
        let frameId = null;

        const animate = () => {
            frameId = null;
            if (!heroVisible) return;

            mesh.rotation.y += isMobile ? 0.01 : 0.005;
            mesh.rotation.x += isMobile ? 0.002 : 0.001;
            mesh.rotation.z += isMobile ? 0.004 : 0.002;

            particlesMesh.rotation.y += isMobile ? 0.001 : 0.0005;

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };

        // Resize handling
        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            if (prefersReducedMotion) renderer.render(scene, camera);
        });

        if (prefersReducedMotion) {
            renderer.render(scene, camera);
        } else {
            if (hero && 'IntersectionObserver' in window) {
                new IntersectionObserver(entries => {
                    heroVisible = entries[0].isIntersecting;
                    if (heroVisible && frameId === null) animate();
                }).observe(hero);
            }
            animate();
        }
    }

    // ---------------- Smooth Scrolling ----------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    targetElem.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                    history.replaceState(null, '', targetId);
                }
            }
        });
    });

    // ---------------- Scroll To Top Button ----------------
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        }, { passive: true });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    // ---------------- Side Navigation ----------------
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');

    const activateDot = (id) => {
        navDots.forEach(dot => dot.classList.remove('active'));
        const activeDot = document.querySelector(`.nav-dot[data-section="${id}"]`);
        if (activeDot) activeDot.classList.add('active');
    };

    const handleScroll = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
            }
        });
        if (currentSection) {
            activateDot(currentSection);
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
};

// ---------------- Mobile Menu Toggle ----------------
document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

    // Select the icons
    const barsIcon = document.getElementById("bars-icon");
    const timesIcon = document.getElementById("times-icon");

    const setMenuOpen = (open) => {
        mobileMenu.classList.toggle("hidden", !open);
        barsIcon.classList.toggle("hidden", open);
        timesIcon.classList.toggle("hidden", !open);
        menuBtn.setAttribute("aria-expanded", String(open));
    };

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            setMenuOpen(mobileMenu.classList.contains("hidden"));
        });

        // Close the menu when a link is chosen or Escape is pressed
        navLinks.forEach(link => {
            link.addEventListener("click", () => setMenuOpen(false));
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
                setMenuOpen(false);
                menuBtn.focus();
            }
        });
    }
});

// ---------------- Service Inquiry Auto-Selection ----------------
document.addEventListener("DOMContentLoaded", function () {
    const serviceSelect = document.getElementById("service_required");
    if (serviceSelect) {
        document.querySelectorAll("[data-service-select]").forEach(btn => {
            btn.addEventListener("click", function () {
                const requestedService = this.getAttribute("data-service-select");
                if (requestedService) {
                    for (let i = 0; i < serviceSelect.options.length; i++) {
                        if (serviceSelect.options[i].value === requestedService) {
                            serviceSelect.selectedIndex = i;
                            clearFieldError(serviceSelect);
                            break;
                        }
                    }
                }
            });
        });
    }

    // ---------------- Contact Form Validation, Submission & Lead Tracking ----------------
    const form = document.getElementById("project-inquiry-form");
    const statusDiv = document.getElementById("form-status");
    const submitBtn = document.getElementById("form-submit-btn");
    const submitText = document.getElementById("submit-btn-text");
    const submitSpinner = document.getElementById("submit-btn-spinner");
    let isSubmitting = false;

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_PATTERN = /^[+()\d\s.-]{6,30}$/;

    // Returns an error message for a field, or "" when it is valid
    function validateField(field) {
        const value = field.value.trim();
        switch (field.id) {
            case "full_name":
                return value.length < 2 ? "Please enter your name." : "";
            case "email":
                if (!value) return "Please enter your email address.";
                return EMAIL_PATTERN.test(value) ? "" : "Please enter a valid email address, for example name@company.com.";
            case "service_required":
                return value ? "" : "Please choose the type of project.";
            case "mobile":
                return !value || PHONE_PATTERN.test(value) ? "" : "Please enter a valid phone number, including the country code.";
            case "description":
                if (!value) return "Please describe your project requirements.";
                return value.length < 20 ? "Please add a little more detail (at least 20 characters)." : "";
            default:
                return "";
        }
    }

    function showFieldError(field, message) {
        const errorEl = document.getElementById(`${field.id}-error`);
        field.setAttribute("aria-invalid", "true");
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove("hidden");
        }
    }

    function clearFieldError(field) {
        const errorEl = document.getElementById(`${field.id}-error`);
        field.removeAttribute("aria-invalid");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.add("hidden");
        }
    }

    // Builds the status banner with text nodes so server messages are never parsed as HTML
    function showStatus(type, title, message) {
        if (!statusDiv) return;
        const styles = {
            success: { box: "border-emerald-500/40 bg-emerald-950/40 text-emerald-100", icon: "fa-check-circle text-emerald-400" },
            error: { box: "border-red-500/40 bg-red-950/40 text-red-100", icon: "fa-exclamation-triangle text-red-400" },
            network: { box: "border-amber-500/40 bg-amber-950/40 text-amber-100", icon: "fa-wifi text-amber-400" }
        }[type];

        statusDiv.className = `mb-6 rounded-2xl p-4 text-sm font-medium border block ${styles.box}`;
        statusDiv.replaceChildren();

        const wrapper = document.createElement("div");
        wrapper.className = "flex items-start gap-3";
        const icon = document.createElement("i");
        icon.className = `fas ${styles.icon} text-lg mt-0.5`;
        icon.setAttribute("aria-hidden", "true");
        const body = document.createElement("div");
        const heading = document.createElement("p");
        heading.className = "font-bold text-white mb-1";
        heading.textContent = title;
        const text = document.createElement("p");
        text.textContent = message;
        body.append(heading, text);

        if (type !== "success") {
            const fallback = document.createElement("p");
            fallback.className = "mt-2 text-xs";
            fallback.innerHTML = 'You can also email us at <a href="mailto:info@tattvotech.com" class="underline font-semibold text-white">info@tattvotech.com</a> or message us on <a href="https://wa.me/918790340337" target="_blank" rel="noopener noreferrer" class="underline font-semibold text-white">WhatsApp</a>.';
            body.appendChild(fallback);
        }

        wrapper.append(icon, body);
        statusDiv.appendChild(wrapper);
        statusDiv.focus({ preventScroll: true });
        statusDiv.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    }

    function setSubmitting(submitting) {
        isSubmitting = submitting;
        if (submitBtn) {
            submitBtn.disabled = submitting;
            submitBtn.setAttribute("aria-busy", String(submitting));
        }
        if (submitText) submitText.textContent = submitting ? "Sending inquiry..." : "Send Project Inquiry";
        if (submitSpinner) submitSpinner.classList.toggle("hidden", !submitting);
    }

    if (form) {
        const validatedFields = form.querySelectorAll("#full_name, #email, #service_required, #mobile, #description");

        // Re-check a field once the visitor has interacted with it
        validatedFields.forEach(field => {
            const eventName = field.tagName === "SELECT" ? "change" : "blur";
            field.addEventListener(eventName, () => {
                const message = validateField(field);
                message ? showFieldError(field, message) : clearFieldError(field);
            });
            field.addEventListener("input", () => {
                if (field.getAttribute("aria-invalid") === "true" && !validateField(field)) clearFieldError(field);
            });
        });

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Ignore repeat clicks while a request is in flight
            if (isSubmitting) return;

            let firstInvalid = null;
            validatedFields.forEach(field => {
                const message = validateField(field);
                if (message) {
                    showFieldError(field, message);
                    if (!firstInvalid) firstInvalid = field;
                } else {
                    clearFieldError(field);
                }
            });
            if (firstInvalid) {
                firstInvalid.focus();
                return;
            }

            setSubmitting(true);
            if (statusDiv) {
                statusDiv.className = "hidden mb-6 rounded-2xl p-4 text-sm font-medium border";
                statusDiv.replaceChildren();
            }

            const formData = new FormData(form);
            const selectedService = formData.get("service") || "Unspecified";

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                });

                if (response.ok) {
                    showStatus("success", "Inquiry received", "Thank you. Your project inquiry has been sent. We'll review your requirements and reply using your preferred contact method, usually within 1 business day.");
                    form.reset();

                    // GA4 Conversion Tracking - strictly non-PII
                    if (typeof gtag === "function") {
                        gtag("event", "generate_lead", {
                            event_category: "Contact",
                            service_requested: selectedService
                        });
                    }
                } else {
                    const data = await response.json().catch(() => ({}));
                    let errorMsg = "There was a problem submitting your inquiry, and it has not been sent. Please try again.";
                    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
                        errorMsg = `Your inquiry was not sent: ${data.errors.map(err => err.message).join(", ")}`;
                    }
                    showStatus("error", "Inquiry not sent", errorMsg);
                }
            } catch (err) {
                showStatus("network", "Connection problem", "We couldn't reach the submission service, so your inquiry has not been sent. Please check your connection and try again.");
            } finally {
                setSubmitting(false);
            }
        });
    }

    // ---------------- CTA & Contact Click Tracking (Non-PII) ----------------
    // 1. Primary CTAs
    document.querySelectorAll('a[href="#contact"]').forEach(cta => {
        cta.addEventListener("click", function () {
            if (typeof gtag === "function") {
                gtag("event", "cta_click", {
                    cta_location: this.closest("header") ? "header" : (this.closest("section") ? this.closest("section").id : "page"),
                    cta_text: this.innerText.trim() || "Contact"
                });
            }
        });
    });

    // 2. Service card inquire buttons
    document.querySelectorAll("[data-service-select]").forEach(btn => {
        btn.addEventListener("click", function () {
            const requestedService = this.getAttribute("data-service-select");
            if (typeof gtag === "function") {
                gtag("event", "service_inquire_click", {
                    service_name: requestedService || "Unknown"
                });
            }
        });
    });

    // 3. Direct Contact Links (phone, email, whatsapp)
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener("click", function () {
            if (typeof gtag === "function") {
                gtag("event", "contact_phone_click", {
                    event_category: "Engagement"
                });
            }
        });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener("click", function () {
            if (typeof gtag === "function") {
                gtag("event", "contact_email_click", {
                    event_category: "Engagement"
                });
            }
        });
    });

    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener("click", function () {
            if (typeof gtag === "function") {
                gtag("event", "contact_whatsapp_click", {
                    event_category: "Engagement"
                });
            }
        });
    });
});
