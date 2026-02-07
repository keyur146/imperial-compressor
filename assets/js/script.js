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

// Hero Slider Functionality
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
let currentSlide = 0;
const slideInterval = 5000; // 5 seconds

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-advance slides
let autoSlide = setInterval(nextSlide, slideInterval);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);

        // Reset auto-advance timer
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, slideInterval);
    });
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

const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const submitBtn = this.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const formMessage = document.getElementById('quoteFormMessage');

        // Validate file size if file is selected
        const fileInput = document.getElementById('quote_file');
        if (fileInput.files.length > 0) {
            const fileSize = fileInput.files[0].size;
            if (fileSize > 5242880) { // 5MB in bytes
                formMessage.className = 'form-message error';
                formMessage.textContent = 'File size exceeds 5MB limit. Please choose a smaller file.';
                return;
            }
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        formMessage.style.display = 'none';

        try {
            const response = await fetch('./mail/quote-mail.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();

            if (response.ok) {
                formMessage.className = 'form-message success';
                formMessage.textContent = result;
                quoteForm.reset();
            } else {
                formMessage.className = 'form-message error';
                formMessage.textContent = result;
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Network error. Please check your connection and try again.';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
}


// Accordian js

const accordionItems = document.querySelectorAll('.why-accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.why-accordion-header');
    const body = item.querySelector('.why-accordion-body');

    header.addEventListener('click', () => {

        // Close others
        accordionItems.forEach(i => {
            if (i !== item) {
                i.classList.remove('active');
                i.querySelector('.why-accordion-body').style.maxHeight = null;
            }
        });

        item.classList.toggle('active');

        if (item.classList.contains('active')) {
            body.style.maxHeight = body.scrollHeight + 'px';
        } else {
            body.style.maxHeight = null;
        }
    });
});

// 🔥 AUTO OPEN FIRST ITEM
if (accordionItems.length) {
    const firstItem = accordionItems[0];
    const firstBody = firstItem.querySelector('.why-accordion-body');

    firstItem.classList.add('active');
    firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
}