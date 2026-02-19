// ============================================
// DeHorizon Holidays — 3D Mega Premium Engine
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. LENIS SMOOTH SCROLL (CDN-safe)
    // ============================================
    let lenis = null;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.4,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    } catch (e) { console.warn('Lenis failed:', e); }

    try {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            if (lenis) {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => lenis.raf(time * 1000));
            }
            gsap.ticker.lagSmoothing(0);
        }
    } catch (e) { console.warn('GSAP failed:', e); }

    // ============================================
    // 2. PRELOADER WITH PARTICLES
    // ============================================
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    const preloaderCanvas = document.getElementById('preloaderCanvas');
    let progress = 0;

    // Preloader particle animation
    if (preloaderCanvas) {
        const pCtx = preloaderCanvas.getContext('2d');
        preloaderCanvas.width = window.innerWidth;
        preloaderCanvas.height = window.innerHeight;

        const preloaderParticles = [];
        for (let i = 0; i < 80; i++) {
            preloaderParticles.push({
                x: Math.random() * preloaderCanvas.width,
                y: Math.random() * preloaderCanvas.height,
                size: Math.random() * 3 + 0.5,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                opacity: Math.random() * 0.6 + 0.1
            });
        }

        function animatePreloaderParticles() {
            pCtx.clearRect(0, 0, preloaderCanvas.width, preloaderCanvas.height);
            preloaderParticles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0 || p.x > preloaderCanvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > preloaderCanvas.height) p.speedY *= -1;

                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                pCtx.fill();
            });

            // Draw connecting lines
            for (let a = 0; a < preloaderParticles.length; a++) {
                for (let b = a + 1; b < preloaderParticles.length; b++) {
                    const dx = preloaderParticles[a].x - preloaderParticles[b].x;
                    const dy = preloaderParticles[a].y - preloaderParticles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        pCtx.beginPath();
                        pCtx.strokeStyle = `rgba(212, 175, 55, ${0.08 * (1 - dist / 120)})`;
                        pCtx.lineWidth = 0.5;
                        pCtx.moveTo(preloaderParticles[a].x, preloaderParticles[a].y);
                        pCtx.lineTo(preloaderParticles[b].x, preloaderParticles[b].y);
                        pCtx.stroke();
                    }
                }
            }

            if (!preloader.classList.contains('hidden')) {
                requestAnimationFrame(animatePreloaderParticles);
            }
        }
        animatePreloaderParticles();
    }

    // Progress bar
    const preloaderInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(preloaderInterval);
        }
        if (preloaderBar) preloaderBar.style.width = progress + '%';
    }, 150);

    // Bulletproof preloader hide — NEVER stay stuck
    function hidePreloader() {
        if (preloader && !preloader.classList.contains('hidden')) {
            if (preloaderBar) preloaderBar.style.width = '100%';
            clearInterval(preloaderInterval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
                animateHeroEntrance();
                // Fully remove from DOM after transition
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1200);
            }, 500);
        }
    }

    // Method 1: Hide on window load
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 300);
    });

    // Method 2: Hard timeout — 4 seconds max, no matter what
    setTimeout(hidePreloader, 4000);

    // ============================================
    // GOLDEN DUST PARTICLES — Floating Magic ✨
    // ============================================
    const dustCanvas = document.getElementById('goldenDustCanvas');
    if (dustCanvas) {
        const dCtx = dustCanvas.getContext('2d');
        let dW = dustCanvas.width = window.innerWidth;
        let dH = dustCanvas.height = window.innerHeight;

        const isMobile = window.innerWidth <= 768;
        const dustCount = isMobile ? 30 : 60;
        const dustParticles = [];

        // Golden color palette
        const goldColors = [
            'rgba(212, 175, 55,',   // Classic gold
            'rgba(223, 189, 105,',  // Light gold
            'rgba(245, 231, 163,',  // Pale gold shimmer
            'rgba(196, 155, 48,',   // Deep gold
            'rgba(170, 140, 44,',   // Warm gold
        ];

        for (let i = 0; i < dustCount; i++) {
            dustParticles.push({
                x: Math.random() * dW,
                y: Math.random() * dH,
                size: Math.random() * 3 + 1,
                speedY: -(Math.random() * 0.4 + 0.1),  // Drift upward slowly
                speedX: (Math.random() - 0.5) * 0.3,    // Gentle horizontal sway
                opacity: Math.random() * 0.5 + 0.15,
                maxOpacity: Math.random() * 0.5 + 0.2,
                fadeSpeed: Math.random() * 0.008 + 0.003,
                fadeDir: 1,
                color: goldColors[Math.floor(Math.random() * goldColors.length)],
                wobbleOffset: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.02 + 0.01,
                glowSize: Math.random() * 6 + 2,
            });
        }

        function animateGoldenDust() {
            dCtx.clearRect(0, 0, dW, dH);

            dustParticles.forEach(p => {
                // Update position — gentle upward drift with sine-wave sway
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(p.wobbleOffset) * 0.3;
                p.wobbleOffset += p.wobbleSpeed;

                // Twinkle/fade effect
                p.opacity += p.fadeSpeed * p.fadeDir;
                if (p.opacity >= p.maxOpacity) { p.fadeDir = -1; }
                if (p.opacity <= 0.05) { p.fadeDir = 1; }

                // Reset particle when it goes off screen
                if (p.y < -10) {
                    p.y = dH + 10;
                    p.x = Math.random() * dW;
                }
                if (p.x < -10) p.x = dW + 10;
                if (p.x > dW + 10) p.x = -10;

                // Draw glow
                const gradient = dCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize);
                gradient.addColorStop(0, p.color + (p.opacity * 0.6) + ')');
                gradient.addColorStop(1, p.color + '0)');
                dCtx.beginPath();
                dCtx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
                dCtx.fillStyle = gradient;
                dCtx.fill();

                // Draw core particle
                dCtx.beginPath();
                dCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                dCtx.fillStyle = p.color + p.opacity + ')';
                dCtx.fill();
            });

            requestAnimationFrame(animateGoldenDust);
        }
        animateGoldenDust();

        // Resize handler
        window.addEventListener('resize', () => {
            dW = dustCanvas.width = window.innerWidth;
            dH = dustCanvas.height = window.innerHeight;
        });
    }

    // ============================================
    // 3. MAGNETIC CURSOR WITH TRAIL
    // ============================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;
    let scrollVelocity = 0;
    let lastScrollY = 0;

    if (cursorDot && cursorRing && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.documentElement.style.setProperty('--mouse-x', mouseX + 'px');
            document.documentElement.style.setProperty('--mouse-y', mouseY + 'px');
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';

            ringX += (mouseX - ringX) * 0.08;
            ringY += (mouseY - ringY) * 0.08;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnetic effect
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovering');
                cursorRing.classList.add('hovering');
            });

            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovering');
                cursorRing.classList.remove('hovering');
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
            });

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.35;
                const deltaY = (e.clientY - centerY) * 0.35;
                gsap.to(el, { x: deltaX, y: deltaY, duration: 0.3, ease: 'power2.out' });
            });
        });

        // Hover hover on buttons/links/cards
        const interactiveElements = document.querySelectorAll('a, button, .glass-card, .swiper-slide, input, .social-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovering');
                cursorRing.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovering');
                cursorRing.classList.remove('hovering');
            });
        });
    }

    // ============================================
    // 4. SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';

        // Track scroll velocity
        scrollVelocity = Math.abs(scrollTop - lastScrollY);
        lastScrollY = scrollTop;
    });

    // ============================================
    // 5. BACK TO TOP
    // ============================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            if (lenis) { lenis.scrollTo(0); } else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
        });
    }

    // ============================================
    // 6. NAVBAR
    // ============================================
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ============================================
    // 7. MOBILE MENU
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `fadeInUp 0.5s ease forwards ${index / 7 + 0.2}s`;
                }
            });
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
                links.forEach(l => l.style.animation = '');
            });
        });
    }

    // ============================================
    // 8. SWIPER CAROUSEL
    // ============================================
    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        loop: true,
        speed: 800
    });

    // ============================================
    // 9. TEXT SCRAMBLE EFFECT
    // ============================================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            this.originalText = el.textContent;
            this.hasRun = false;
        }

        run() {
            if (this.hasRun) return;
            this.hasRun = true;
            const newText = this.originalText;
            const length = newText.length;
            let iteration = 0;
            const maxIterations = length * 3;

            const interval = setInterval(() => {
                this.el.textContent = newText.split('')
                    .map((char, index) => {
                        if (index < iteration / 3) return newText[index];
                        if (char === ' ') return ' ';
                        return this.chars[Math.floor(Math.random() * this.chars.length)];
                    })
                    .join('');

                iteration++;
                if (iteration >= maxIterations) {
                    this.el.textContent = newText;
                    clearInterval(interval);
                }
            }, 25);
        }
    }

    const scrambleElements = document.querySelectorAll('[data-scramble]');
    scrambleElements.forEach(el => {
        const scrambler = new TextScramble(el);
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => scrambler.run()
        });
    });

    // ============================================
    // 10. GSAP 3D SCROLL ANIMATIONS
    // ============================================
    function animateHeroEntrance() {
        const tl = gsap.timeline();

        tl.from('.logo', {
            duration: 1.2,
            y: -60,
            opacity: 0,
            ease: 'power4.out'
        })
            .from('.nav-links li', {
                duration: 0.8,
                y: -30,
                opacity: 0,
                ease: 'power4.out',
                stagger: 0.08
            }, '-=0.7')
            .from('.hero-badge', {
                duration: 1,
                y: 30,
                opacity: 0,
                scale: 0.8,
                ease: 'back.out(1.7)'
            }, '-=0.3')
            .from('.hero-subtitle', {
                duration: 0.8,
                y: 20,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.title-line', {
                duration: 1.2,
                y: 80,
                opacity: 0,
                rotateX: -40,
                stagger: 0.2,
                ease: 'power4.out',
                transformOrigin: 'bottom center'
            }, '-=0.5')
            .from('.hero-description', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.3')
            .from('.hero-cta-group', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.3')
            .from('.hero-stats-row', {
                duration: 1,
                y: 40,
                opacity: 0,
                scale: 0.95,
                ease: 'back.out(1.7)'
            }, '-=0.3')
            .from('.hero-float', {
                duration: 1,
                scale: 0,
                opacity: 0,
                stagger: 0.15,
                ease: 'back.out(2)'
            }, '-=0.5')
            .from('.scroll-indicator', {
                duration: 1,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.3');
    }

    // ===== SPECTACULAR SCROLL REVEAL ANIMATIONS =====
    // Multiple reveal types for visual variety — NO element animates the same

    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        /* --- Reveal Type 1: 3D Flip Up --- */
        .reveal-flip { opacity: 0; transform: perspective(1000px) rotateX(25deg) translateY(60px) scale(0.9); transition: all 0.9s cubic-bezier(0.23,1,0.32,1); transform-origin: bottom center; }
        .reveal-flip.revealed { opacity: 1 !important; transform: perspective(1000px) rotateX(0deg) translateY(0) scale(1) !important; }

        /* --- Reveal Type 2: Scale Bounce --- */
        .reveal-scale { opacity: 0; transform: scale(0.6) translateY(30px); filter: blur(8px); transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .reveal-scale.revealed { opacity: 1 !important; transform: scale(1) translateY(0) !important; filter: blur(0) !important; }

        /* --- Reveal Type 3: Slide & Rotate In --- */
        .reveal-swing { opacity: 0; transform: translateX(-80px) rotate(-6deg) scale(0.85); transition: all 0.85s cubic-bezier(0.23,1,0.32,1); }
        .reveal-swing.revealed { opacity: 1 !important; transform: translateX(0) rotate(0deg) scale(1) !important; }

        /* --- Reveal Type 4: Zoom Focus --- */
        .reveal-zoom { opacity: 0; transform: scale(1.3) translateY(-20px); filter: blur(12px); transition: all 0.9s cubic-bezier(0.23,1,0.32,1); }
        .reveal-zoom.revealed { opacity: 1 !important; transform: scale(1) translateY(0) !important; filter: blur(0) !important; }

        /* --- Reveal Type 5: Classic Slide Up (improved) --- */
        .reveal-ready { opacity: 0; transform: translateY(50px) scale(0.95); filter: blur(4px); transition: all 0.8s cubic-bezier(0.23,1,0.32,1); }
        .reveal-ready.revealed { opacity: 1 !important; transform: translateY(0) scale(1) !important; filter: blur(0) !important; }

        /* --- Reveal From Left --- */
        .reveal-left { opacity: 0; transform: translateX(-70px) rotate(-3deg); filter: blur(4px); transition: all 0.85s cubic-bezier(0.23,1,0.32,1); }
        .reveal-left.revealed { opacity: 1 !important; transform: translateX(0) rotate(0deg) !important; filter: blur(0) !important; }

        /* --- Reveal From Right --- */
        .reveal-right { opacity: 0; transform: translateX(70px) rotate(3deg); filter: blur(4px); transition: all 0.85s cubic-bezier(0.23,1,0.32,1); }
        .reveal-right.revealed { opacity: 1 !important; transform: translateX(0) rotate(0deg) !important; filter: blur(0) !important; }

        /* --- Card 3D Tilt on Hover --- */
        .card-tilt-active { transition: transform 0.15s ease-out, box-shadow 0.3s ease !important; }
        .card-tilt-active:hover { box-shadow: 0 25px 60px rgba(212,175,55,0.2), 0 5px 15px rgba(0,0,0,0.1) !important; }

        /* --- Floating Glow Pulse for Cards --- */
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 5px 20px rgba(212,175,55,0.08); } 50% { box-shadow: 0 8px 35px rgba(212,175,55,0.18); } }
        .glass-card { animation: glowPulse 4s ease-in-out infinite; }

        /* --- Icon Bounce on Card Hover --- */
        @keyframes iconBounce { 0% { transform: scale(1) rotate(0deg); } 30% { transform: scale(1.3) rotate(-15deg); } 60% { transform: scale(0.9) rotate(5deg); } 100% { transform: scale(1.2) rotate(-10deg); } }
        .feature-card:hover .feature-icon { animation: iconBounce 0.6s ease forwards; }

        /* --- Section Title Golden Underline Grow --- */
        .section-title.revealed, .section-title-left.revealed { position: relative; }
        .section-title.revealed::after, .section-title-left.revealed::after { content: ''; position: absolute; bottom: -8px; left: 50%; width: 0; height: 3px; background: var(--gold-gradient); border-radius: 3px; animation: underlineGrow 0.8s 0.4s ease forwards; }
        .section-title-left.revealed::after { left: 0; }
        @keyframes underlineGrow { to { width: 60px; left: calc(50% - 30px); } }
        .section-title-left.revealed::after { animation-name: underlineGrowLeft; }
        @keyframes underlineGrowLeft { to { width: 60px; left: 0; } }

        /* --- Stats Counter Pop Animation --- */
        @keyframes counterPop { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
        .stat-card.revealed { animation: counterPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        /* --- Testimonial Card Hover Float --- */
        .testimonial-card:hover { transform: translateY(-8px) scale(1.02) !important; border-color: rgba(212,175,55,0.5) !important; }
        .testimonial-card:hover .testimonial-author img { transform: scale(1.1); box-shadow: 0 0 20px rgba(212,175,55,0.4); }

        /* --- Blog Card Image Zoom on Hover --- */
        .blog-card:hover { transform: translateY(-10px) !important; }
        .blog-card:hover img { transform: scale(1.08); }
        .blog-card img { transition: transform 0.6s cubic-bezier(0.23,1,0.32,1); }

        /* --- Experience Badge Breathing --- */
        @keyframes badgeBreath { 0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(212,175,55,0.2); } 50% { transform: scale(1.04); box-shadow: 0 15px 45px rgba(212,175,55,0.35); } }
        .experience-badge { animation: badgeBreath 3s ease-in-out infinite; }

        /* --- CTA Button Shimmer --- */
        @keyframes btnShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .cta-section .btn-primary { background-size: 200% auto; animation: btnShimmer 3s linear infinite; }
    `;
    document.head.appendChild(revealStyle);

    // Reveal class options for variety
    const revealTypes = ['reveal-flip', 'reveal-scale', 'reveal-swing', 'reveal-zoom', 'reveal-ready'];

    // Universal IntersectionObserver for all reveals
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // Cards — each gets a DIFFERENT reveal type + 3D tilt
    document.querySelectorAll('.feature-card, .blog-card, .testimonial-card, .stat-card').forEach((card, i) => {
        const type = revealTypes[i % revealTypes.length];
        card.classList.add(type);
        card.style.transitionDelay = (i % 3 * 0.15) + 's';
        revealObserver.observe(card);

        // 3D Perspective Tilt on mouse move (desktop only)
        if (window.innerWidth > 768) {
            card.classList.add('card-tilt-active');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        }
    });

    // Section titles — scale reveal
    document.querySelectorAll('.section-title, .section-title-left').forEach(title => {
        title.classList.add('reveal-scale');
        revealObserver.observe(title);
    });

    // About section — dramatic reveals
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image-wrapper');
    if (aboutText) { aboutText.classList.add('reveal-left'); revealObserver.observe(aboutText); }
    if (aboutImage) { aboutImage.classList.add('reveal-right'); aboutImage.style.transitionDelay = '0.25s'; revealObserver.observe(aboutImage); }

    document.querySelectorAll('.about-feature-item').forEach((item, i) => {
        item.classList.add('reveal-swing');
        item.style.transitionDelay = (i * 0.12) + 's';
        revealObserver.observe(item);
    });

    // CTA section — zoom reveal
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        [ctaSection.querySelector('h2'), ctaSection.querySelector('p'), ctaSection.querySelector('.cta-buttons')].forEach((el, i) => {
            if (el) {
                el.classList.add(i === 0 ? 'reveal-zoom' : 'reveal-flip');
                el.style.transitionDelay = (i * 0.2) + 's';
                revealObserver.observe(el);
            }
        });
    }

    // Marquee section titles
    document.querySelectorAll('.marquee-section').forEach(m => {
        m.classList.add('reveal-ready');
        revealObserver.observe(m);
    });

    // SAFETY FALLBACK: Force-reveal ALL elements after 6 seconds
    setTimeout(() => {
        document.querySelectorAll('.reveal-ready:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-flip:not(.revealed), .reveal-scale:not(.revealed), .reveal-swing:not(.revealed), .reveal-zoom:not(.revealed)').forEach(el => {
            el.classList.add('revealed');
        });
    }, 6000);

    // ============================================
    // 11. IMAGE REVEAL
    // ============================================
    document.querySelectorAll('.image-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ============================================
    // 12. COUNTER ANIMATION (Slot Machine Style)
    // ============================================
    const counters = document.querySelectorAll('.counter');
    let counterStarted = false;
    const counterSection = document.querySelector('.stats');

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2500;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4); // Quartic easing
                const current = Math.ceil(eased * target);
                counter.innerText = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + '+';
                }
            }
            requestAnimationFrame(updateCount);
        });
    }

    if (counterSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterStarted) {
                    animateCounters();
                    counterStarted = true;
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        counterObserver.observe(counterSection);
    }

    // ============================================
    // 13. ROTATING TYPEWRITER TEXT
    // ============================================
    const rotatingText = document.getElementById('rotatingText');
    if (rotatingText) {
        const phrases = [
            'Premium Travel Experience',
            'Sacred Spiritual Journeys',
            'Luxury Beyond Imagination',
            'Your Dream Destination Awaits',
            'Explore the Unseen World'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeRotate() {
            const current = phrases[phraseIndex];

            if (isDeleting) {
                rotatingText.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 35;
            } else {
                rotatingText.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 75;
            }

            if (!isDeleting && charIndex === current.length) {
                typingSpeed = 2500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeRotate, typingSpeed);
        }

        setTimeout(typeRotate, 3500);
    }

    // ============================================
    // 14. GOLD PARTICLE ENGINE (Enhanced)
    // ============================================
    if (window.innerWidth > 768) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        document.body.appendChild(canvas);

        let particles = [];
        const particleCount = 70;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class GoldParticle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.15;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeDir = Math.random() > 0.5 ? 1 : -1;
                this.rotation = Math.random() * 360;
                this.rotSpeed = (Math.random() - 0.5) * 2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotSpeed;
                this.opacity += this.fadeDir * 0.003;

                if (this.opacity <= 0.05 || this.opacity >= 0.5) this.fadeDir *= -1;

                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x += (dx / dist) * force * 3;
                    this.y += (dy / dist) * force * 3;
                }

                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                    this.y = canvas.height + 10;
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);

                // Draw diamond-shaped particle
                if (this.size > 1.5) {
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size * 0.6, 0);
                    ctx.lineTo(0, this.size);
                    ctx.lineTo(-this.size * 0.6, 0);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new GoldParticle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ============================================
    // 15. 3D TILT WITH INNER LIGHT REFLECTION
    // ============================================
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        const shine = card.querySelector('.card-3d-shine');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

            // Move inner light reflection
            if (shine) {
                const gradX = (x / rect.width) * 100;
                const gradY = (y / rect.height) * 100;
                shine.style.background = `radial-gradient(circle at ${gradX}% ${gradY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)`;
                shine.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            if (shine) shine.style.opacity = '0';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // ============================================
    // 16. PARALLAX DEPTH LAYERS
    // ============================================
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Float elements parallax
        document.querySelectorAll('.hero-float').forEach((el, i) => {
            const speed = (i + 1) * 0.12;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // 3D depth layer parallax
        document.querySelectorAll('.hero-depth-layer').forEach(layer => {
            const depth = parseFloat(layer.dataset.depth) || 0.5;
            layer.style.transform = `translateY(${scrollY * depth * 0.3}px)`;
        });
    });

    // ============================================
    // 17. THREE.JS 3D FLOATING ORB (Hero)
    // ============================================
    if (typeof THREE !== 'undefined' && window.innerWidth > 768) {
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(300, 300);
            renderer.setClearAlpha(0);
            renderer.domElement.style.position = 'fixed';
            renderer.domElement.style.bottom = '120px';
            renderer.domElement.style.left = '30px';
            renderer.domElement.style.pointerEvents = 'none';
            renderer.domElement.style.zIndex = '2';
            renderer.domElement.style.opacity = '0.4';
            document.body.appendChild(renderer.domElement);

            // Create icosahedron (diamond-like shape)
            const geometry = new THREE.IcosahedronGeometry(1.5, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0xD4AF37,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Add secondary inner sphere
            const innerGeo = new THREE.SphereGeometry(1, 16, 16);
            const innerMat = new THREE.MeshBasicMaterial({
                color: 0xF5E7A3,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const innerMesh = new THREE.Mesh(innerGeo, innerMat);
            scene.add(innerMesh);

            camera.position.z = 4;

            function animateThree() {
                requestAnimationFrame(animateThree);
                mesh.rotation.x += 0.003;
                mesh.rotation.y += 0.005;
                innerMesh.rotation.x -= 0.004;
                innerMesh.rotation.y -= 0.003;

                // React to scroll
                mesh.rotation.z = window.scrollY * 0.001;
                mesh.position.y = Math.sin(Date.now() * 0.001) * 0.3;

                renderer.render(scene, camera);
            }
            animateThree();
        } catch (e) {
            console.log('Three.js not available, skipping 3D orb');
        }
    }

    // ============================================
    // 18. SCROLL-VELOCITY SKEW EFFECT
    // ============================================
    if (window.innerWidth > 768) {
        const skewSections = document.querySelectorAll('.marquee-track');
        let currentSkew = 0;

        function updateSkew() {
            const targetSkew = Math.min(scrollVelocity * 0.05, 3);
            currentSkew += (targetSkew - currentSkew) * 0.1;

            skewSections.forEach(section => {
                section.style.transform = section.style.transform
                    ? section.style.transform.replace(/skewX\([^)]*\)/, `skewX(${currentSkew}deg)`)
                    : `skewX(${currentSkew}deg)`;
            });

            requestAnimationFrame(updateSkew);
        }
        updateSkew();
    }

    // ============================================
    // 19. CLICK RIPPLE EFFECT
    // ============================================
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 0;
            height: 0;
            border: 2px solid rgba(212, 175, 55, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            animation: rippleExpand 0.6s ease-out forwards;
        `;

        // Add ripple keyframes if not exists
        if (!document.getElementById('rippleStyle')) {
            const style = document.createElement('style');
            style.id = 'rippleStyle';
            style.textContent = `
                @keyframes rippleExpand {
                    0% { width: 0; height: 0; opacity: 1; }
                    100% { width: 100px; height: 100px; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

});
