// ========================================
// Imperial Compressors - JAVASCRIPT
// ========================================

// ========== INITIALIZE ========== 
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize Navigation
    initSmoothScroll();
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const overlay = document.getElementById('mobileOverlay');

// Toggle mobile menu
mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close menu when clicking on a nav link (only for non-dropdown links)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't close if it's a dropdown parent on mobile
        if (window.innerWidth <= 768) {
            const parent = link.parentElement;
            if (parent.classList.contains('has-dropdown') || parent.classList.contains('has-subdropdown')) {
                return; // Let the dropdown toggle handler deal with it
            }
        }

        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Close menu when clicking overlay
overlay.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
});

// Mobile dropdown toggle - improved for better UX
const dropdownParents = document.querySelectorAll('.has-dropdown, .has-subdropdown');

dropdownParents.forEach(parent => {
    const link = parent.querySelector(':scope > a');
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();

            // Close other dropdowns at the same level
            const siblings = Array.from(parent.parentElement.children).filter(child => child !== parent);
            siblings.forEach(sibling => {
                if (sibling.classList.contains('has-dropdown') || sibling.classList.contains('has-subdropdown')) {
                    sibling.classList.remove('active');
                }
            });

            // Toggle current dropdown
            parent.classList.toggle('active');
        }
    });
});

// Re-initialize on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');

        // Remove active class from dropdowns
        dropdownParents.forEach(parent => {
            parent.classList.remove('active');
        });
    }
});

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}