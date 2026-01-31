window.onload = function () {
    const canvas = document.getElementById('hero-canvas');
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

    // ---------------- Smooth Scrolling ----------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ---------------- Scroll To Top Button ----------------
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    if (scrollToTopBtn) {
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
// 3D Tilt on Cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (y / 20) * -1;
        const rotateY = x / 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
});