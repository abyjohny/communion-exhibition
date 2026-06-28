document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // Dynamic Dust Particles Generator
    // ------------------------------------------
    const dustContainer = document.getElementById('hero-dust');
    if (dustContainer) {
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('dust-particle');
            
            // Random styling for natural organic motion
            const size = Math.random() * 3 + 1.5; // 1.5px to 4.5px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`;
            
            const duration = Math.random() * 12 + 10; // 10s to 22s
            particle.style.animationDuration = `${duration}s`;
            
            const delay = Math.random() * -20; // Pre-warm the animation
            particle.style.animationDelay = `${delay}s`;
            
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            
            dustContainer.appendChild(particle);
        }
    }

    // Custom Cursor tracking with smooth lerp
    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const speed = 0.15; // Easing speed

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Linear interpolation (lerp) for smooth lag effect
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        if (cursor) {
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }

        // Mouse Parallax for light rays
        const rays = document.querySelector('.light-rays');
        if (rays) {
            const parallaxX = (mouseX - window.innerWidth / 2) * 0.025;
            const parallaxY = (mouseY - window.innerHeight / 2) * 0.025;
            rays.style.transform = `rotate(-15deg) translate3d(${parallaxX}px, ${parallaxY}px, 0)`;
        }

        // Dynamic Glass Reflections
        const overlays = document.querySelectorAll('.glass-overlay');
        overlays.forEach(overlay => {
            const parallaxX = (mouseX - window.innerWidth / 2) * -0.012;
            const parallaxY = (mouseY - window.innerHeight / 2) * -0.012;
            overlay.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(1.05)`;
        });

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const hoverables = document.querySelectorAll('button, a, .scroll-dot, .hotspot-trigger, .cross-icon, .indicator');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });

    // Cursor click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
    });

    // ------------------------------------------
    // Scroll Snapping & Section Entrance Observers
    // ------------------------------------------
    const sections = document.querySelectorAll('.story-section');
    const dots = document.querySelectorAll('.scroll-dot');
    const container = document.querySelector('.story-container');
    const videoIframe = document.getElementById('zacchaeus-video');

    const observerOptions = {
        root: container,
        threshold: 0.55 // Section must be 55% visible to trigger active state
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = Array.from(sections).indexOf(entry.target);
            
            if (entry.isIntersecting) {
                // Set active class on target section
                sections.forEach(sec => sec.classList.remove('active'));
                entry.target.classList.add('active');
                
                // Update navigation dots
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
                
                // YouTube Iframe controls: play when inside, pause when leaving
                if (videoIframe && videoIframe.contentWindow) {
                    if (index === 1) {
                        // Play video on Slide 2
                        videoIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    } else {
                        // Pause video on other slides
                        videoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Navigation Dots click to scroll
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const secIndex = parseInt(dot.getAttribute('data-section'));
            sections[secIndex].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ------------------------------------------
    // Saint Patrick & Saint Brigid Interactive Hotspots
    // ------------------------------------------
    const hotspots = document.querySelectorAll('.hotspot-trigger');
    const backButtons = document.querySelectorAll('.card-back-btn');

    let activePortrait = null; // Track which portrait is currently focused

    function activateCard(cardId, section) {
        if (!section) return;
        const sectionCards = section.querySelectorAll('.interactive-card');
        sectionCards.forEach(card => {
            if (card.id === cardId) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    function resetPortraitFocus(portrait) {
        if (!portrait) return;
        portrait.className = "portrait-container gallery-frame"; // Reset class names (removes focus-*)
        const section = portrait.closest('.story-section');
        const isBrigid = portrait.id === 'brigid-portrait';
        const defaultCardId = isBrigid ? 'card-brigid-default' : 'card-default';
        activateCard(defaultCardId, section);
        activePortrait = null;
    }

    hotspots.forEach(hotspot => {
        const type = hotspot.id.replace('hs-', ''); // 'mitre', 'staff', 'shamrock', 'brigid-cross' etc.
        const cardId = `card-${type}`;
        const portrait = hotspot.closest('.portrait-container');
        const section = hotspot.closest('.story-section');

        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // If another portrait was active, reset it first
            if (activePortrait && activePortrait !== portrait) {
                resetPortraitFocus(activePortrait);
            }
            
            activePortrait = portrait;
            
            // Apply zoom/pan class on portrait container
            portrait.className = "portrait-container gallery-frame";
            portrait.classList.add(`focus-${type}`);
            
            // Activate details card
            activateCard(cardId, section);
        });
    });

    // Back to overview buttons
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activePortrait) {
                resetPortraitFocus(activePortrait);
            }
        });
    });

    // Click outside portrait/hotspots to reset focus
    document.addEventListener('click', (e) => {
        if (activePortrait && !activePortrait.contains(e.target) && !e.target.closest('.interactive-card')) {
            resetPortraitFocus(activePortrait);
        }
    });
});
