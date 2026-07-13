/* =============================================
   TEEN 2 TYCOON - T2T
   3D Effects and Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initTiltEffect();
    init3DCards();
    initFloatingElements();
    initScroll3D();
});

/* =============================================
   3D Tilt Effect
   ============================================= */
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt], .feature-item');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', handleTilt);
        element.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetTilt(e) {
    const element = e.currentTarget;
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

/* =============================================
   3D Card Effects
   ============================================= */
function init3DCards() {
    const cards = document.querySelectorAll('.vmc-card, .service-card-3d, .team-card-3d, .event-card-3d');
    
    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '1000px';
    });
    
    // Add depth on scroll
    window.addEventListener('scroll', () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const scrolled = window.scrollY;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const depth = (rect.top - scrolled) * 0.01;
                card.style.transform = `translateZ(${depth}px)`;
            }
        });
    });
}

/* =============================================
   Floating Elements Animation
   ============================================= */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-card, .floating-element');
    
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
        el.style.animationDuration = `${3 + index * 0.5}s`;
    });
}

/* =============================================
   Scroll-based 3D Effects
   ============================================= */
function initScroll3D() {
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const speed = 0.3;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(rect.top * speed);
                section.style.backgroundPositionY = `${yPos}px`;
            }
        });
        
        // Parallax for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroRect = hero.getBoundingClientRect();
            if (heroRect.bottom > 0) {
                hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            }
        }
    });
}

/* =============================================
   Mouse Follower Effect
   ============================================= */
class MouseFollower {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor-follower';
        this.cursor.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            border: 2px solid rgba(102, 126, 234, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease, opacity 0.1s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(this.cursor);
        
        this.dot = document.createElement('div');
        this.dot.className = 'cursor-dot';
        this.dot.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: rgba(240, 147, 251, 1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(this.dot);
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.animate();
        
        // Add hover effects
        const hoverElements = document.querySelectorAll('a, button, .team-card-3d, .service-card-3d, .vmc-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                this.cursor.style.borderColor = 'rgba(240, 147, 251, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                this.cursor.style.borderColor = 'rgba(102, 126, 234, 0.8)';
            });
        });
    }
    
    animate() {
        this.cursorX += (this.mouseX - this.cursorX) * 0.1;
        this.cursorY += (this.mouseY - this.cursorY) * 0.1;
        
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';
        this.dot.style.left = this.mouseX + 'px';
        this.dot.style.top = this.mouseY + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

// Uncomment to enable mouse follower
// new MouseFollower();

/* =============================================
   WebGL Background Effect
   ============================================= */
function initWebGLBackground() {
    const canvas = document.createElement('canvas');
    canvas.className = 'webgl-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        pointer-events: none;
    `;
    
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        particles = [];
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                color: `rgba(102, 126, 234, ${Math.random() * 0.5 + 0.2})`
            });
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - distance / 150)})`;
                    ctx.stroke();
                }
            });
        });
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    resize();
    createParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// Uncomment to enable WebGL background
// initWebGLBackground();

/* =============================================
   Card 3D Rotation on Hover
   ============================================= */
function initCard3D() {
    const cards = document.querySelectorAll('.vmc-card, .service-card-3d, .team-card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

initCard3D();

/* =============================================
   Spline Scene Loader
   ============================================= */
function loadSplineScene() {
    const splineViewer = document.querySelector('spline-viewer');
    
    if (splineViewer) {
        splineViewer.addEventListener('load', () => {
            console.log('Spline 3D Scene Loaded Successfully');
        });
        
        splineViewer.addEventListener('error', () => {
            console.log('Spline scene failed to load, using fallback');
            document.querySelector('.3d-background').style.display = 'none';
        });
    }
}

loadSplineScene();

console.log('3D Effects Initialized Successfully!');
