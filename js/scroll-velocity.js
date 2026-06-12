// ScrollVelocity - Smooth scrolling marquee text
(function() {
    const container = document.getElementById('scrollVelocityContainer');
    if (!container) return;
    
    const texts = [
        'RAISE SMARTER', 'INVEST SHARPER', 'CLARITY BEFORE CAPITAL', 
        'AI-POWERED INSIGHTS', 'STRUCTURED WORKFLOWS', 'LESS NOISE. BETTER DECISIONS.',
        'FUNDRAISING REIMAGINED', 'VENTURE INTELLIGENCE', 'LIVE DEAL FLOW'
    ];
    
    const track = document.getElementById('scrollTrack');
    if (!track) return;
    
    // Build track
    function buildTrack() {
        track.innerHTML = '';
        for (let copy = 0; copy < 3; copy++) {
            texts.forEach(text => {
                const span = document.createElement('span');
                span.className = 'scroll-text';
                span.textContent = text + ' ◆ ';
                track.appendChild(span);
            });
        }
    }
    buildTrack();
    
    let position = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let targetPosition = 0;
    
    function updateVelocity() {
        const currentScrollY = window.scrollY;
        scrollVelocity = (currentScrollY - lastScrollY) * 0.8;
        scrollVelocity = Math.max(-12, Math.min(12, scrollVelocity));
        lastScrollY = currentScrollY;
        targetPosition += scrollVelocity;
    }
    
    function animate() {
        position += (targetPosition - position) * 0.08;
        
        const trackWidth = track.scrollWidth / 3;
        if (trackWidth > 0) {
            let wrapped = position % trackWidth;
            track.style.transform = `translateX(${wrapped}px)`;
        }
        
        requestAnimationFrame(animate);
    }
    
    // Decay velocity
    function decay() {
        scrollVelocity *= 0.97;
        targetPosition += scrollVelocity * 0.5;
        requestAnimationFrame(decay);
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateVelocity();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    animate();
    decay();
    
    // Rebuild on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            buildTrack();
            position = 0;
            targetPosition = 0;
        }, 200);
    });
})();