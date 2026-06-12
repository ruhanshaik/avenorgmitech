// TargetCursor - Custom cursor (only on non-touch devices)
(function() {
    // Check if mobile/touch device
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (isMobile) return;
    
    // Create cursor elements
    const cursorWrapper = document.createElement('div');
    cursorWrapper.className = 'target-cursor-wrapper';
    cursorWrapper.innerHTML = `
        <div class="target-cursor-dot"></div>
        <div class="target-cursor-corner corner-tl"></div>
        <div class="target-cursor-corner corner-tr"></div>
        <div class="target-cursor-corner corner-br"></div>
        <div class="target-cursor-corner corner-bl"></div>
    `;
    document.body.appendChild(cursorWrapper);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .target-cursor-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transform: translate(-50%, -50%);
            transition: transform 0.08s linear;
        }
        .target-cursor-dot {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        .target-cursor-corner {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 10px;
            height: 10px;
            border: 2px solid #fff;
            transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .corner-tl { transform: translate(-160%, -160%); border-right: none; border-bottom: none; }
        .corner-tr { transform: translate(60%, -160%); border-left: none; border-bottom: none; }
        .corner-br { transform: translate(60%, 60%); border-left: none; border-top: none; }
        .corner-bl { transform: translate(-160%, 60%); border-right: none; border-top: none; }
    `;
    document.head.appendChild(style);
    
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        // Check hover on interactive elements
        const element = document.elementFromPoint(e.clientX, e.clientY);
        const isInteractive = element && (
            element.tagName === 'A' || 
            element.tagName === 'BUTTON' || 
            element.closest('a') || 
            element.closest('button') ||
            element.classList?.contains('btn-primary') ||
            element.classList?.contains('btn-outline')
        );
        
        const corners = document.querySelectorAll('.target-cursor-corner');
        if (isInteractive) {
            corners.forEach(corner => {
                if (corner.classList.contains('corner-tl')) corner.style.transform = 'translate(-180%, -180%) scale(1.15)';
                if (corner.classList.contains('corner-tr')) corner.style.transform = 'translate(80%, -180%) scale(1.15)';
                if (corner.classList.contains('corner-br')) corner.style.transform = 'translate(80%, 80%) scale(1.15)';
                if (corner.classList.contains('corner-bl')) corner.style.transform = 'translate(-180%, 80%) scale(1.15)';
            });
        } else {
            corners.forEach(corner => {
                if (corner.classList.contains('corner-tl')) corner.style.transform = 'translate(-160%, -160%)';
                if (corner.classList.contains('corner-tr')) corner.style.transform = 'translate(60%, -160%)';
                if (corner.classList.contains('corner-br')) corner.style.transform = 'translate(60%, 60%)';
                if (corner.classList.contains('corner-bl')) corner.style.transform = 'translate(-160%, 60%)';
            });
        }
    });
    
    function animate() {
        mouseX += (targetX - mouseX) * 0.12;
        mouseY += (targetY - mouseY) * 0.12;
        cursorWrapper.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    }
    animate();
    
    document.body.style.cursor = 'none';
    
    // Hide cursor on all interactive elements
    document.querySelectorAll('a, button, .btn-primary, .btn-outline, .lets-talk-btn').forEach(el => {
        el.style.cursor = 'none';
    });
})();