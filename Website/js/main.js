/* =============================================
   TEEN 2 TYCOON - T2T
   Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScrolling();
    initNavbarScroll();
});

/* =============================================
   Mobile Menu Toggle
   ============================================= */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            // Toggle hamburger animation
            hamburger.classList.toggle('active');
            
            // Toggle nav menu
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.classList.toggle('menu-open');
        });
        
        // Handle mobile dropdown clicks
        const dropdownParents = document.querySelectorAll('.nav-links .dropdown > a');
        dropdownParents.forEach(dropdownParent => {
            dropdownParent.addEventListener('click', function(e) {
                // Only handle dropdown on mobile (when hamburger menu is visible)
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = this.parentElement;
                    
                    // Close other dropdowns
                    document.querySelectorAll('.nav-links .dropdown').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // Close menu when clicking on a non-dropdown link
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                // Don't close menu if this is a dropdown parent on mobile
                const isDropdownParent = this.parentElement.classList.contains('dropdown') && this.parentElement.querySelector('.dropdown-content');
                if (!isDropdownParent || window.innerWidth > 768) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    // Close all dropdowns
                    document.querySelectorAll('.nav-links .dropdown').forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                // Close all dropdowns
                document.querySelectorAll('.nav-links .dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
        
        // Handle window resize to close dropdowns when switching to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                document.querySelectorAll('.nav-links .dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
}

/* =============================================
   Smooth Scrolling
   ============================================= */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* =============================================
   Navbar Scroll Effect
   ============================================= */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.background = '#ffffff';
            } else {
                navbar.style.padding = '15px 0';
                navbar.style.background = '#ffffff';
            }
        });
    }
}

/* =============================================
   Lazy Loading Images
   ============================================= */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, imageOptions);
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/* =============================================
   Form Validation
   ============================================= */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4757';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields');
            }
        });
    });
}

/* =============================================
   Active Navigation Link
   ============================================= */
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* =============================================
   Mobile Touch Improvements
   ============================================= */
function initTouchImprovements() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

/* =============================================
   Initialize All Functions
   ============================================= */
initLazyLoading();
initFormValidation();
initActiveNavLink();
initTouchImprovements();

console.log('Main JavaScript Initialized Successfully!');
