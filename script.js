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

    // Animate
    const animate = () => {
        requestAnimationFrame(animate);

        mesh.rotation.y += isMobile ? 0.01 : 0.005;
        mesh.rotation.x += isMobile ? 0.002 : 0.001;
        mesh.rotation.z += isMobile ? 0.004 : 0.002;

        particlesMesh.rotation.y += isMobile ? 0.001 : 0.0005;

        renderer.render(scene, camera);
    };

    // Resize handling
    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    animate();
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
                        behavior: 'smooth'
                    });
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
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------------- Side Navigation ----------------
    const sections = document.querySelectorAll('section');
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

    window.addEventListener('scroll', handleScroll);
};

// ---------------- Swiper Slider ----------------
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".mySwiper", {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // Use breakpoints to adjust settings
    breakpoints: {
      // For screens up to 767px wide
      0: {
        slidesPerView: 1,
        navigation: {
          enabled: false,
        },
      },
      // For screens 768px and up
      768: {
        slidesPerView: 1,
        navigation: {
          enabled: true,
        },
      },
    },
  });
});

// ---------------- Mobile Menu Toggle ----------------
document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];
    
    // Select the icons
    const barsIcon = document.getElementById("bars-icon");
    const timesIcon = document.getElementById("times-icon");

    if (menuBtn && mobileMenu) {
        // 1. Toggle the menu AND the icons when the button is clicked
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            // Toggle the visibility of the icons
            barsIcon.classList.toggle("hidden");
            timesIcon.classList.toggle("hidden");
        });

        // 2. When a menu link is clicked, hide the menu and show the bars icon again
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                // Reset the icon to the bars when the menu closes
                barsIcon.classList.remove("hidden");
                timesIcon.classList.add("hidden");
            });
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
                            break;
                        }
                    }
                }
            });
        });
    }

    // ---------------- Contact Form Submission & Lead Tracking ----------------
    const form = document.getElementById("project-inquiry-form");
    const statusDiv = document.getElementById("form-status");
    const submitBtn = document.getElementById("form-submit-btn");
    const submitText = document.getElementById("submit-btn-text");
    const submitSpinner = document.getElementById("submit-btn-spinner");

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Client-side HTML5 validation check
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // In-flight state
            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.textContent = "Sending inquiry...";
            if (submitSpinner) submitSpinner.classList.remove("hidden");
            if (statusDiv) {
                statusDiv.className = "hidden mb-6 rounded-2xl p-4 text-sm font-medium border";
                statusDiv.innerHTML = "";
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
                    // Success state
                    if (statusDiv) {
                        statusDiv.className = "mb-6 rounded-2xl p-4 text-sm font-medium border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 block";
                        statusDiv.innerHTML = '<div class="flex items-start gap-3"><i class="fas fa-check-circle text-emerald-400 text-lg mt-0.5"></i><div><p class="font-bold text-white mb-1">Inquiry Received</p><p>Thank you! Your project inquiry has been sent successfully. Our team will review your requirements and respond within 1 business day.</p></div></div>';
                    }
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
                    let errorMsg = "There was a problem submitting your inquiry. Please try again or reach out directly.";
                    if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                        errorMsg = data.errors.map(err => err.message).join(", ");
                    }
                    if (statusDiv) {
                        statusDiv.className = "mb-6 rounded-2xl p-4 text-sm font-medium border border-red-500/40 bg-red-950/40 text-red-200 block";
                        statusDiv.innerHTML = `<div class="flex items-start gap-3"><i class="fas fa-exclamation-triangle text-red-400 text-lg mt-0.5"></i><div><p class="font-bold text-white mb-1">Submission Notice</p><p>${errorMsg}</p><p class="mt-2 text-xs text-red-300">You can also email us directly at <a href="mailto:info@tattvotech.com" class="underline font-semibold text-white">info@tattvotech.com</a> or call <a href="tel:+918790340337" class="underline font-semibold text-white">+91 8790340337</a>.</p></div></div>`;
                    }
                }
            } catch (err) {
                if (statusDiv) {
                    statusDiv.className = "mb-6 rounded-2xl p-4 text-sm font-medium border border-amber-500/40 bg-amber-950/40 text-amber-200 block";
                    statusDiv.innerHTML = '<div class="flex items-start gap-3"><i class="fas fa-wifi text-amber-400 text-lg mt-0.5"></i><div><p class="font-bold text-white mb-1">Network Issue</p><p>Unable to connect to the submission service. Please email us directly at <a href="mailto:info@tattvotech.com" class="underline font-semibold text-white">info@tattvotech.com</a> or call <a href="tel:+918790340337" class="underline font-semibold text-white">+91 8790340337</a>.</p></div></div>';
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.textContent = "Send Project Inquiry";
                if (submitSpinner) submitSpinner.classList.add("hidden");
            }
        });
    }

    // ---------------- CTA & Contact Click Tracking (Non-PII) ----------------
    // 1. Primary CTAs
    document.querySelectorAll('a[href="#contact"]').forEach(cta => {
        cta.addEventListener("click", function () {
            if (typeof gtag === "function") {
                gtag("event", "cta_click", {
                    cta_location: this.closest("header") ? "header" : (this.closest("#hero") ? "hero" : "page"),
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

// 3D Tilt on Cards (respects reduced-motion preference)
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReducedMotion) {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (y / 20) * -1;
            const rotateY = x / 20;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = "rotateX(0) rotateY(0) scale(1)";
        });
    });
}