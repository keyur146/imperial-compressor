// ========== SEARCH MODAL ==========
const searchModal = document.getElementById('searchModal');
const searchBtn = document.getElementById('searchBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Search data - products and pages
const searchData = {
    products: [
        { title: 'Replacement Spare Parts (Brand-wise)', url: 'replacement-spares.html', description: 'OEM-equivalent spares for Atlas Copco, Ingersoll Rand, Chicago Pneumatic, ELGI, Kirloskar, Kaeser, AF compressors' },
        { title: 'Reciprocating Compressor', url: 'reciprocating-compressor.html', description: 'Industrial reciprocating air compressors' },
        { title: 'Screw Compressor', url: 'screw-compressor.html', description: 'Rotary screw air compressors for industrial use' },
        { title: 'Roto Synthetic Fluid ULTRA', url: 'compressor-oils/roto-ultra.html', description: 'Premium synthetic compressor oil by Atlas Copco' },
        { title: 'Roto Synthetic Fluid XTEND DUTY', url: 'compressor-oils/roto-xtend-duty.html', description: 'Extended duty synthetic compressor fluid' },
        { title: 'Roto Inject Fluid NDURANCE', url: 'compressor-oils/roto-ndurance.html', description: 'High-performance injection fluid for compressors' },
        { title: 'Roto Z Fluid', url: 'compressor-oils/roto-z.html', description: 'Specialized compressor lubricant' },
        { title: 'Ingersoll Rand Oil', url: 'compressor-oils/ingersoll-rand.html', description: 'Replacement oil for Ingersoll Rand compressors' },
        { title: 'Rotair Xtra', url: 'compressor-oils/rotair-xtra.html', description: 'Chicago Pneumatic premium compressor oil' },
        { title: 'Rotair Plus', url: 'compressor-oils/rotair-plus.html', description: 'Enhanced compressor lubricant by Chicago Pneumatic' },
        { title: 'Rotair', url: 'compressor-oils/rotair.html', description: 'Standard compressor oil for Chicago Pneumatic' },
        { title: 'Airlube', url: 'compressor-oils/airlube.html', description: 'ELGI compressor lubricant' },
        { title: 'Airlube Plus', url: 'compressor-oils/airlube-plus.html', description: 'Enhanced ELGI compressor oil' },
        { title: 'Airlube UT', url: 'compressor-oils/airlube-ut.html', description: 'Ultra-tech ELGI compressor fluid' },
        { title: 'Product Categories', url: 'spare-parts.html', description: 'Comprehensive range of compressor spare parts' }
    ],
    pages: [
        { title: 'Home', url: 'index.html', description: 'Imperial Compressors - Complete Compression Solutions' },
        { title: 'About Us', url: 'about.html', description: 'Learn about our company and engineering expertise' },
        { title: 'Products', url: 'products.html', description: 'Browse our complete range of compressors and spares' },
        { title: 'Services', url: 'services.html', description: 'Comprehensive compressor services and maintenance' },
        { title: 'Quality', url: 'quality.html', description: 'Our commitment to quality and certifications' },
        { title: 'Contact', url: 'contact.html', description: 'Get in touch with our team' },
        { title: 'Replacement Spare Parts', url: 'spare-parts.html', description: 'Brand-wise replacement spares for all major compressor brands' },
        { title: 'Compressors', url: 'compressors.html', description: 'Industrial air compressors - reciprocating and screw types' },
        { title: 'Compressor Oils', url: 'compressor-oils.html', description: 'Premium compressor oils and lubricants' },
        { title: 'Sitemap', url: 'sitemap.html', description: 'A complete overview of all pages and content on the Imperial Compressors website.' }
    ]
};

// Open search modal
searchBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
});

// Close search modal
searchCloseBtn.addEventListener('click', closeSearchModal);

// Close on clicking outside
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeSearchModal();
    }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearchModal();
    }
});

function closeSearchModal() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
    document.body.style.overflow = '';
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length === 0) {
        searchResults.innerHTML = '';
        return;
    }

    // Filter products and pages
    const productResults = searchData.products.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    const pageResults = searchData.pages.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    // Display results
    displaySearchResults(productResults, pageResults, query);
});

function displaySearchResults(products, pages, query) {
    let html = '';
    const prefix = getPathPrefix();

    if (products.length === 0 && pages.length === 0) {
        html = `
            <div class="search-no-results">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No results found for "${query}"</p>
            </div>
        `;
    } else {
        if (products.length > 0) {
            html += '<div class="search-category">';
            html += '<div class="search-category-title">Products</div>';
            products.slice(0, 5).forEach(item => {
                html += `
                    <a href="${prefix}${item.url}" class="search-result-item">
                        <div class="search-result-title">${highlightText(item.title, query)}</div>
                        <div class="search-result-description">${highlightText(item.description, query)}</div>
                    </a>
                `;
            });
            html += '</div>';
        }

        if (pages.length > 0) {
            html += '<div class="search-category">';
            html += '<div class="search-category-title">Pages</div>';
            pages.slice(0, 5).forEach(item => {
                html += `
                    <a href="${prefix}${item.url}" class="search-result-item">
                        <div class="search-result-title">${highlightText(item.title, query)}</div>
                        <div class="search-result-description">${highlightText(item.description, query)}</div>
                    </a>
                `;
            });
            html += '</div>';
        }
    }

    searchResults.innerHTML = html;
}

function getPathPrefix() {
    const path = window.location.pathname;
    // Check if the current page is in a subdirectory (compressor-oils)
    if (path.includes('/compressor-oils/') || path.includes('\\compressor-oils\\')) {
        return '../';
    }
    return './';
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}