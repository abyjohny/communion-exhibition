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
                    if (index !== 1) {
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

    // ------------------------------------------
    // Stained Glass Activity Logic
    // ------------------------------------------
    const svgSegmentsGroup = document.getElementById('svg-glass-segments');
    const svgLabelsGroup = document.getElementById('svg-glass-labels');
    
    if (svgSegmentsGroup && svgLabelsGroup) {
        // State tracking
        const coloredCategories = new Set();
        const totalCategories = 6;
        let activeCategory = null;
        
        // Mappings
        // Inner Petals (12 petals): distribution of categories
        const innerPetalCategories = [
            'friends', 'school', 'pets', 'church', 'teachers', 'school',
            'friends', 'school', 'pets', 'church', 'teachers', 'friends'
        ];
        
        // Outer Leaves (8 leaves): distribution of categories
        const outerLeafCategories = [
            'school',    // 0 deg (Right)
            'pets',      // 45 deg (Bottom-Right)
            'teachers',  // 90 deg (Bottom)
            'school',    // 135 deg (Bottom-Left)
            'friends',   // 180 deg (Left)
            'pets',      // 225 deg (Top-Left)
            'church',    // 270 deg (Top)
            'friends'    // 315 deg (Top-Right)
        ];
        
        // Build Center Circle (Home)
        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', '250');
        centerCircle.setAttribute('cy', '250');
        centerCircle.setAttribute('r', '70');
        centerCircle.setAttribute('class', 'glass-segment');
        centerCircle.setAttribute('data-category', 'home');
        svgSegmentsGroup.appendChild(centerCircle);
        
        // Build 12 Inner Petals
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6; // 30 degrees each
            const pathData = getInnerPetalPath(angle);
            const category = innerPetalCategories[i];
            
            const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            petal.setAttribute('d', pathData);
            petal.setAttribute('class', 'glass-segment');
            petal.setAttribute('data-category', category);
            svgSegmentsGroup.appendChild(petal);
        }
        
        // Build 8 Outer Leaves
        for (let j = 0; j < 8; j++) {
            const angle = (j * Math.PI) / 4; // 45 degrees each
            const pathData = getOuterLeafPath(angle);
            const category = outerLeafCategories[j];
            
            const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leaf.setAttribute('d', pathData);
            leaf.setAttribute('class', 'glass-segment');
            leaf.setAttribute('data-category', category);
            svgSegmentsGroup.appendChild(leaf);
        }
        
        // Build 16 Border Arches
        for (let k = 0; k < 16; k++) {
            const startAngle = (k * Math.PI) / 8;
            const endAngle = ((k + 1) * Math.PI) / 8;
            const pathData = getBorderArchPath(startAngle, endAngle);
            
            // Map each of the 16 border arches to the category of the nearest outer leaf (each leaf covers 2 arches)
            const leafIndex = Math.floor(k / 2) % 8;
            const category = outerLeafCategories[leafIndex];
            
            const arch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            arch.setAttribute('d', pathData);
            arch.setAttribute('class', 'glass-segment');
            arch.setAttribute('data-category', category);
            svgSegmentsGroup.appendChild(arch);
        }
        
        // Add Static SVG Text Labels
        const labelsData = [
            { text: 'Home', x: 250, y: 250, isCenter: true, category: 'home' },
            { text: 'Church', x: 250, y: 95, isCenter: false, category: 'church' },
            { text: 'Teachers', x: 250, y: 405, isCenter: false, category: 'teachers' },
            { text: 'Friends', x: 95, y: 250, isCenter: false, category: 'friends' },
            { text: 'School', x: 405, y: 250, isCenter: false, category: 'school' },
            { text: 'Pets', x: 140, y: 140, isCenter: false, category: 'pets' }
        ];
        
        labelsData.forEach(item => {
            const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelText.setAttribute('x', item.x.toString());
            labelText.setAttribute('y', item.y.toString());
            
            let classes = 'glass-text-label';
            if (item.isCenter) classes += ' center-label';
            labelText.setAttribute('class', classes);
            labelText.setAttribute('id', `svg-label-${item.category}`);
            labelText.textContent = item.text;
            svgLabelsGroup.appendChild(labelText);
        });
        
        // Math helpers for SVG generation
        function getInnerPetalPath(centerAngle) {
            const r0 = 70;
            const r1 = 120;
            const dAngle = Math.PI / 12; // 15 degrees
            
            const a1 = centerAngle - dAngle;
            const a2 = centerAngle + dAngle;
            
            const x1 = 250 + r0 * Math.cos(a1);
            const y1 = 250 + r0 * Math.sin(a1);
            const x2 = 250 + r0 * Math.cos(a2);
            const y2 = 250 + r0 * Math.sin(a2);
            const xtip = 250 + r1 * Math.cos(centerAngle);
            const ytip = 250 + r1 * Math.sin(centerAngle);
            
            const xc1 = 250 + (r0 + 25) * Math.cos(centerAngle - dAngle * 0.4);
            const yc1 = 250 + (r0 + 25) * Math.sin(centerAngle - dAngle * 0.4);
            const xc2 = 250 + (r0 + 25) * Math.cos(centerAngle + dAngle * 0.4);
            const yc2 = 250 + (r0 + 25) * Math.sin(centerAngle + dAngle * 0.4);
            
            return `M ${x1} ${y1} Q ${xc1} ${yc1} ${xtip} ${ytip} Q ${xc2} ${yc2} ${x2} ${y2} A ${r0} ${r0} 0 0 0 ${x1} ${y1} Z`;
        }
        
        function getOuterLeafPath(centerAngle) {
            const r0 = 120;
            const r1 = 190;
            const dAngle = Math.PI / 8; // 22.5 degrees
            
            const a1 = centerAngle - dAngle;
            const a2 = centerAngle + dAngle;
            
            const x1 = 250 + r0 * Math.cos(a1);
            const y1 = 250 + r0 * Math.sin(a1);
            const x2 = 250 + r0 * Math.cos(a2);
            const y2 = 250 + r0 * Math.sin(a2);
            const xtip = 250 + r1 * Math.cos(centerAngle);
            const ytip = 250 + r1 * Math.sin(centerAngle);
            
            const xc1 = 250 + (r0 + 35) * Math.cos(centerAngle - dAngle * 0.5);
            const yc1 = 250 + (r0 + 35) * Math.sin(centerAngle - dAngle * 0.5);
            const xc2 = 250 + (r0 + 35) * Math.cos(centerAngle + dAngle * 0.5);
            const yc2 = 250 + (r0 + 35) * Math.sin(centerAngle + dAngle * 0.5);
            
            return `M ${x1} ${y1} Q ${xc1} ${yc1} ${xtip} ${ytip} Q ${xc2} ${yc2} ${x2} ${y2} A ${r0} ${r0} 0 0 0 ${x1} ${y1} Z`;
        }
        
        function getBorderArchPath(startAngle, endAngle) {
            const r0 = 190;
            const r1 = 220;
            
            const x1 = 250 + r0 * Math.cos(startAngle);
            const y1 = 250 + r0 * Math.sin(startAngle);
            const x2 = 250 + r0 * Math.cos(endAngle);
            const y2 = 250 + r0 * Math.sin(endAngle);
            
            const x3 = 250 + r1 * Math.cos(endAngle);
            const y3 = 250 + r1 * Math.sin(endAngle);
            const x4 = 250 + r1 * Math.cos(startAngle);
            const y4 = 250 + r1 * Math.sin(startAngle);
            
            return `M ${x1} ${y1} A ${r0} ${r0} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
        }
        
        // Interaction Logic
        const glassSegments = document.querySelectorAll('.glass-segment');
        const activitySection = document.getElementById('sec-6');
        
        function focusCategory(category) {
            activeCategory = category;
            
            // Highlight matching segments in SVG
            glassSegments.forEach(seg => {
                if (seg.getAttribute('data-category') === category) {
                    seg.classList.add('focused-category');
                } else {
                    seg.classList.remove('focused-category');
                }
            });
            
            // Show corresponding card
            if (activitySection) {
                const cards = activitySection.querySelectorAll('.interactive-card');
                cards.forEach(card => {
                    if (card.id === `card-activity-${category}`) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            }
        }
        
        function resetActivityFocus() {
            activeCategory = null;
            glassSegments.forEach(seg => seg.classList.remove('focused-category'));
            
            if (activitySection) {
                const cards = activitySection.querySelectorAll('.interactive-card');
                const defaultCardId = coloredCategories.size === totalCategories ? 'card-activity-complete' : 'card-activity-default';
                
                cards.forEach(card => {
                    if (card.id === defaultCardId) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            }
        }
        
        function colorCategory(category) {
            if (!category) return;
            
            coloredCategories.add(category);
            
            // Color segments
            glassSegments.forEach(seg => {
                if (seg.getAttribute('data-category') === category) {
                    seg.classList.add(`colored-${category}`);
                }
            });
            
            // Highlight/Color SVG label
            const label = document.getElementById(`svg-label-${category}`);
            if (label) {
                label.classList.add('colored');
            }
            
            // Update scoreboard
            const counter = document.getElementById('score-counter');
            if (counter) {
                counter.textContent = `${coloredCategories.size} / ${totalCategories}`;
            }
            
            // Check if completed
            if (coloredCategories.size === totalCategories) {
                // Apply completion class to entire SVG group
                svgSegmentsGroup.classList.add('stained-glass-celebration');
                
                // Show completion card
                setTimeout(() => {
                    focusCategory('complete');
                }, 800);
            } else {
                // Go back to overview
                resetActivityFocus();
            }
        }
        
        // Attach Event Listeners to Glass segments
        glassSegments.forEach(seg => {
            seg.addEventListener('click', (e) => {
                e.stopPropagation();
                const category = seg.getAttribute('data-category');
                
                if (coloredCategories.size === totalCategories) {
                    // All completed, just keep show celebration
                    focusCategory('complete');
                } else {
                    focusCategory(category);
                }
            });
            
            // Add custom hover listener to link up custom cursor state
            seg.addEventListener('mouseenter', () => {
                const cursor = document.getElementById('custom-cursor');
                if (cursor) cursor.classList.add('hovering');
            });
            seg.addEventListener('mouseleave', () => {
                const cursor = document.getElementById('custom-cursor');
                if (cursor) cursor.classList.remove('hovering');
            });
        });
        
        // Attach Event Listeners to Coloring Buttons inside Cards
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const category = btn.getAttribute('data-color-category');
                colorCategory(category);
            });
            
            // Link custom cursor
            btn.addEventListener('mouseenter', () => {
                const cursor = document.getElementById('custom-cursor');
                if (cursor) cursor.classList.add('hovering');
            });
            btn.addEventListener('mouseleave', () => {
                const cursor = document.getElementById('custom-cursor');
                if (cursor) cursor.classList.remove('hovering');
            });
        });
        
        // Attach Event Listeners to Back/Overview links in Activity Section
        if (activitySection) {
            const backBtns = activitySection.querySelectorAll('.card-back-btn');
            backBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    resetActivityFocus();
                });
                
                // Link custom cursor
                btn.addEventListener('mouseenter', () => {
                    const cursor = document.getElementById('custom-cursor');
                    if (cursor) cursor.classList.add('hovering');
                });
                btn.addEventListener('mouseleave', () => {
                    const cursor = document.getElementById('custom-cursor');
                    if (cursor) cursor.classList.remove('hovering');
                });
            });
        }
        
        // Click outside glass window to reset activity card (only within section 6)
        document.addEventListener('click', (e) => {
            if (activeCategory && activeCategory !== 'complete') {
                const wrapper = document.querySelector('.glass-window-wrapper');
                const cardsContainer = document.getElementById('activity-cards-container');
                if (wrapper && !wrapper.contains(e.target) && cardsContainer && !cardsContainer.contains(e.target)) {
                    resetActivityFocus();
                }
            }
        });
    }
});
