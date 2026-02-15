// Main JavaScript for DeHorizon Holidays Premium

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');

            // Animate Links
            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `fadeInUp 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
                links.forEach(l => l.style.animation = '');
            });
        });
    }

    // Initialize Swiper for Destinations
    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: true
    });

    // GSAP Header Animation
    gsap.from(".logo", {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power4.out"
    });

    gsap.from(".nav-links li", {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.2
    });

    // Parallax Effect for Hero
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateX(${x}px) translateY(${y}px)`;
        }
    });

    // Typing Effect for Hero Subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.innerText;
        heroSubtitle.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 1000);
    }

    // Counter Animation for Stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCount();
        });
    }

    // Trigger Counter Animation on Scroll
    let counterSection = document.querySelector('.stats');
    let counterStarted = false;

    if (counterSection) {
        window.addEventListener('scroll', () => {
            if (window.scrollY + window.innerHeight > counterSection.offsetTop && !counterStarted) {
                animateCounters();
                counterStarted = true;
            }
        });
    }

    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX - 10,
                y: e.clientY - 10,
                duration: 0.1
            });
            gsap.to(follower, {
                x: e.clientX - 4,
                y: e.clientY - 4,
                duration: 0.3
            });
        });

        const links = document.querySelectorAll('a, button, .feature-card, .swiper-slide');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.borderColor = 'transparent';
                cursor.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            link.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--accent-gold)';
                cursor.style.background = 'transparent';
            });
        });
    }
});

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Enforce a minimum display time of 1.5 seconds for the "Cinematic" feel
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';

            // Enable scrolling after preloader is gone (optional, if you hid overflow)
            document.body.style.overflow = 'visible';
        }, 1500);
    }
});
