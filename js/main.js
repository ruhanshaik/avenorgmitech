// Main JavaScript for Avenor - Dark Mode, Animations, Form Handlers

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // DARK MODE TOGGLE
    // ============================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Check for saved preference
        const savedTheme = localStorage.getItem('avenor-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            darkModeToggle.checked = true;
        }
        
        // Toggle theme
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('avenor-theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('avenor-theme', 'dark');
            }
        });
    }
    
    // ============================================
    // SPLIT TEXT ANIMATION (GSAP)
    // ============================================
    const splitTextElements = document.querySelectorAll('.split-text-target');
    if (splitTextElements.length > 0 && typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        splitTextElements.forEach(el => {
            const text = el.innerText;
            // Wrap each character in a span
            el.innerHTML = text.split('').map(char => {
                if (char === ' ') return '<span style="display: inline-block;">&nbsp;</span>';
                return `<span style="display: inline-block; opacity: 0; transform: translateY(40px);">${char}</span>`;
            }).join('');
            
            // Animate each character with stagger
            gsap.to(el.querySelectorAll('span:not(:has(&nbsp;))'), {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.03,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
    
    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealElements = document.querySelectorAll('.problem-card, .feature-card, .step-card, .testimonial-card, .stat-card, .team-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            header.style.background = 'rgba(var(--bg-primary-rgb, 10, 10, 10), 0.95)';
            header.style.backdropFilter = 'blur(16px)';
        } else {
            header.style.background = 'rgba(var(--bg-primary-rgb, 10, 10, 10), 0.85)';
            header.style.backdropFilter = 'blur(12px)';
        }
        lastScroll = currentScroll;
    });
    
    // ============================================
    // DYNAMIC YEAR IN FOOTER
    // ============================================
    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
        const year = new Date().getFullYear();
        footerBottom.innerHTML = footerBottom.innerHTML.replace('2026', year);
    }
    
    // ============================================
    // MOBILE MENU HANDLING
    // ============================================
    if (window.innerWidth <= 768) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const btn = dropdown.querySelector('.dropdown-btn');
            const content = dropdown.querySelector('.dropdown-content');
            if (btn && content) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const isOpen = content.style.display === 'block';
                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown-content').forEach(c => {
                        c.style.display = 'none';
                    });
                    content.style.display = isOpen ? 'none' : 'block';
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-content').forEach(c => {
                c.style.display = 'none';
            });
        });
    }
    
    console.log('Avenor platform initialized successfully!');
});