// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initAll();
});

function initAll() {
    // Core functionality
    initNavbar();
    initScrollAnimations();
    initTestimonialSlider();
    initPackageFilter();
    initFormHandler();
    initGallery();
}

// ========================================
// NAVBAR
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ========================================
// TESTIMONIAL SLIDER
// ========================================
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showSlide(currentIndex);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Pause on hover
    const testimonialsContainer = document.querySelector('.testimonials-container');
    testimonialsContainer.addEventListener('mouseenter', stopAutoSlide);
    testimonialsContainer.addEventListener('mouseleave', startAutoSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.testimonials-container').contains(document.activeElement)) {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        }
    });

    // Initialize
    showSlide(0);
    startAutoSlide();
}

// ========================================
// PACKAGE FILTER
// ========================================
function initPackageFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const packages = [
        {
            id: 'umroh-reguler',
            category: 'umroh',
            title: 'Umroh Reguler 9 Hari',
            price: 'Rp 27.500.000',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
            facilities: ['Hotel 3⭐ (10 menit Haram)', '3x Makan Harian', 'Garuda Indonesia PP', 'Visa + Asuransi', 'Ziyarah Madinah']
        },
        {
            id: 'umroh-vip',
            category: 'umroh vip',
            title: 'Umroh VIP Platinum 12 Hari',
            price: 'Rp 42.000.000',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            facilities: ['Hotel 5⭐ (3 menit Haram)', 'Fullboard Premium', 'Saudia Business Class', 'Mutawif Pribadi 24/7', 'VIP Lounge']
        },
        {
            id: 'haji-khusus',
            category: 'haji',
            title: 'Haji Khusus Superior 40 Hari',
            price: 'Rp 98.000.000',
            image: 'https://images.unsplash.com/photo-1588880365067-0e759ddeeen8?w=400&h=250&fit=crop',
            facilities: ['Hotel VIP Mina/Arafah', 'Bus AC Khusus', 'Emirates First Class', 'Dokter 24 Jam', 'Tenda Kerajaan']
        }
    ];

    function renderPackages(filteredPackages = packages) {
        const grid = document.querySelector('.packages-grid');
        grid.innerHTML = filteredPackages.map(pkg => `
            <div class="package-card ${pkg.category}" data-category="${pkg.category}">
                <div class="package-image">
                    <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
                    <div class="package-badge">${pkg.category.includes('vip') ? 'VIP' : 'BEST'}</div>
                </div>
                <div class="package-content">
                    <h3>${pkg.title}</h3>
                    <div class="package-price">${pkg.price}</div>
                    <ul class="package-facilities">
                        ${pkg.facilities.map(facility => `<li><i class="fas fa-check"></i> ${facility}</li>`).join('')}
                    </ul>
                    <div class="package-actions">
                        <a href="#contact?pkg=${pkg.id}" class="btn btn-outline">Detail Paket</a>
                        <a href="#contact" class="btn btn-primary">Pesan Sekarang</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const filtered = filter === 'all' 
                ? packages 
                : packages.filter(pkg => pkg.category.includes(filter));
            
            renderPackages(filtered);
        });
    });

    // Initial render
    renderPackages();
}

// ========================================
// CONTACT FORM
// ========================================
function initFormHandler() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        alert('✅ Terima kasih! Pesan Anda berhasil terkirim.\n\nKami akan menghubungi Anda melalui WhatsApp dalam 1x24 jam untuk konsultasi lengkap.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// GALLERY LIGHTBOX
// ========================================
function initGallery() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="modal-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Close handlers
            modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });
    });
}

function closeModal(modal) {
    document.body.style.overflow = '';
    modal.remove();
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
document.body.classList.remove('no-scroll');

// Preloader
window.addEventListener('load', () => {
    document.querySelector('.preloader').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.
