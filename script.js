document.addEventListener('DOMContentLoaded', () => {

    // remove any leftover custom cursor element from prior loads
    const leftover = document.querySelectorAll('.custom-cursor');
    leftover.forEach(el => el.remove());

    // ===================================
    // NEW: Mouse-Following Background Effect
    // ===================================
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });

    // NOTE: custom cursor removed — using default OS cursor

    // ===================================
    // NEW: Part 1: Typing Animation
    // ===================================
    function typeAnimation() {
        const text = "Yuvraj Chopra";
        const targetElement = document.getElementById('hero-title-typing');
        if (!targetElement) return;

        let index = 0;
        targetElement.innerHTML = ""; // Clear it

        function type() {
            if (index < text.length) {
                targetElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 150); // Typing speed in ms
            }
        }
        // Start typing after a short delay
        setTimeout(type, 500);
    }

    typeAnimation(); // Call the typing animation


    // ===================================
    // Part 2: three.js Hero Cube (MODIFIED)
    // ===================================
    function initThreeJS() {
        const container = document.getElementById('hero-canvas-container');
        if (!container) return;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Slightly brighter light
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);
        const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
        pointLight2.position.set(-10, -10, 5);
        scene.add(pointLight2);

        // MODIFIED: Load Textures for Cube Faces
        const textureLoader = new THREE.TextureLoader();
        
        // Use your own 6 image files (relative to the HTML page)
        const imagePaths = [
            // face-right
            'assets/images/face1.jpg',
            // face-left
            'assets/images/face2.jpg',
            // face-top
            'assets/images/face3.jpg',
            // face-bottom
            'assets/images/face4.jpg',
            // face-front
            'assets/images/face5.jpg',
            // face-back
            'assets/images/face6.jpg'
        ];

        // Create a material per face using your images
        const materials = imagePaths.map(p =>
            new THREE.MeshStandardMaterial({
            map: textureLoader.load(p),
            roughness: 0.6,
            metalness: 0.1
            })
        );

        // MODIFIED: Create Cube with 6 materials
        const geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2); // Slightly larger
        const cube = new THREE.Mesh(geometry, materials); // Pass the array of materials
        scene.add(cube);

        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5; // Slower rotation
        controls.enableDamping = true;

        // Clock for animations
        const clock = new THREE.Clock();

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Replicate the 'Float' logic
            cube.position.y = Math.sin(elapsedTime * 0.7) * 0.1; // Gentle float

            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    initThreeJS();


    // ===================================
    // Part 3: Navigation & Scrolling
    // ===================================
    const sections = ['home', 'about', 'skills', 'projects', 'education', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    let isMobileMenuOpen = false;

    // --- Mobile Menu Toggle ---
    mobileMenuButton.addEventListener('click', () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        mobileMenu.classList.toggle('is-open');
        if (menuIcon) menuIcon.classList.toggle('hidden');
        if (closeIcon) closeIcon.classList.toggle('hidden');
    });

    // --- Smooth Scroll Function ---
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const top = section.offsetTop - navHeight + 1; // +1 for pixel-perfect active state
            
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
        // Close mobile menu on click
        if (isMobileMenuOpen) {
            isMobileMenuOpen = false;
            mobileMenu.classList.remove('is-open');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        }
    }

    // --- Attach click events to nav links ---
    [...navLinks, ...mobileNavLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            scrollToSection(sectionId);
        });
    });

    // --- ScrollSpy: Update active nav link on scroll ---
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const navHeight = document.querySelector('.navbar').offsetHeight;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - navHeight - 10; // Extra offset
                if (window.scrollY >= sectionTop) {
                    currentSectionId = sectionId;
                }
            }
        });

        [...navLinks, ...mobileNavLinks].forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    // --- Floating Buttons ---
    const floatingNavBtn = document.getElementById('floating-nav-btn');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            scrollToSection('home');
        });
    }

    if (floatingNavBtn) {
        floatingNavBtn.addEventListener('click', () => {
            let currentSectionId = 'home';
            const navHeight = document.querySelector('.navbar').offsetHeight;
            
            for (const sectionId of sections) {
                const section = document.getElementById(sectionId);
                if (section && window.scrollY >= section.offsetTop - navHeight - 10) {
                    currentSectionId = sectionId;
                }
            }

            const currentIndex = sections.indexOf(currentSectionId);
            const nextIndex = (currentIndex + 1) % sections.length;
            scrollToSection(sections[nextIndex]);
        });
    }


    // ===================================
    // Part 4: Scroll Animations
    // ===================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply delay if specified in data-delay
                const delay = parseInt(entry.target.dataset.delay) || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

});