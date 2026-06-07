// ==== SMOOTH SCROLL
// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Close mobile menu if open
        document.getElementById('mob-menu')?.classList.add('hidden');
    });
});


// ==== CAROUSEL
function goToSlide(n) {
    const prev = document.getElementById(`slide-${currentSlide}`);
    prev.style.opacity = '0';
    prev.style.zIndex = '0';

    currentSlide = ((n % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;

    const next = document.getElementById(`slide-${currentSlide}`);
    next.style.opacity = '1';
    next.style.zIndex = '1';

    document.querySelectorAll('.dot').forEach((d, i) => {
        d.style.background = i === currentSlide ? '#f4a30a' : 'rgba(255,255,255,0.4)';
    });
}

function initCarousel() {
    const dotsContainer = document.getElementById('slide-dots');
    for (let i = 0; i < TOTAL_SLIDES; i++) {
        const d = document.createElement('button');
        d.className = 'dot w-2.5 h-2.5 rounded-full transition-colors duration-300';
        d.style.background = i === 0 ? '#f4a30a' : 'rgba(255,255,255,0.4)';
        d.onclick = () => {
            clearInterval(slideInterval);
            goToSlide(i);
            slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        };
        dotsContainer.appendChild(d);
    }
    slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

// ==== SCROLL REVEAL
function triggerReveal() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
}

// ==== INIT
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    renderProducts();
    renderCart();
    triggerReveal();

    // Re-observe on scroll for late-rendered elements
    window.addEventListener('scroll', triggerReveal, { passive: true });
});

// ==== STATE
let cart = [];
let currentSlide = 0;
let slideInterval;
const TOTAL_SLIDES = 3;
const WA_NUMBER = '2348023456789'; // Replace with real number

// ==== PRODUCTS DATA
const products = [
    {
        id: 'broiler',
        name: 'Live Broiler Chicken',
        note: 'Healthy farm-raised live broiler chickens available for wholesale purchase. Our current stock consists of 3-month-old broilers weighing approximately 1 kg each. For other ages, sizes, or weights, please contact us for availability',
        image: './assets/images/broiler.png',
        emoji: '🐔',
        basePrice: 15000,
        unit: 'kg',
        unitLabel: '/ kg',
    },
    {
        id: 'layers',
        name: 'Old Layers',
        note: 'Healthy farm-raised old layer chickens available for sale. Well-fed and affordably priced, they are suitable for consumption, processing, and other poultry needs. Available for both retail and wholesale purchase.',
        image: './assets/images/layers.png',
        emoji: '🐓',
        basePrice: 9000,
        unit: 'kg',
        unitLabel: '/ kg',
    },
    {
        id: 'eggs',
        name: 'Fresh Farm Eggs',
        note: 'Naturally laid eggs, rich in protein and nutrients. Available in crates for families & businesses.',
        image: './assets/images/eggs.png',
        emoji: '🥚',
        basePrice: 5000,
        unit: 'crate',
        unitLabel: '/ crate',
    },
    {
        id: 'manure',
        name: 'Poultry Manure',
        note: 'Rich organic manure, ideal for crop farming and gardening. Boosts soil fertility naturally.',
        image: './assets/images/manure.png',
        emoji: '🌱',
        basePrice: 2000,
        unit: 'bag',
        unitLabel: 'per 50kg bag',
    }
];

// ==== Card state per product
const cardState = {};
products.forEach(p => {
    cardState[p.id] = { weight: 1, qty: 1 };
});

// ==== RENDER PRODUCTS
function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.forEach(p => {
        const s = cardState[p.id];
        const total = p.basePrice * s.weight * s.qty;
        const card = document.createElement('div');
        card.className = 'product-card rounded-2xl overflow-hidden flex flex-col reveal';
        card.id = `card-${p.id}`;
        card.innerHTML = `
        <div class="h-48 overflow-hidden">
            <img
                src="${p.image}" 
                alt="${p.name}" 
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
        </div>
        <div class="p-5 flex flex-col flex-1">
            <h3 class="font-display text-lg text-green-900 mb-0.5">${p.name}</h3>
            <p class="text-amber-600 font-semibold text-sm mb-2">₦${p.basePrice.toLocaleString()} ${p.unitLabel}</p>
            <p class="text-gray-400 text-xs leading-relaxed mb-4 italic">${p.note}</p>
            <!-- Weight selector -->
            <div class="mb-3">
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">${p.unit === 'chick' ? 'Quantity (Birds)' : p.unit === 'crate' ? 'Crates' : 'Weight (kg)'}</div>
            <div class="flex items-center gap-3">
                <button class="qty-btn" onclick="adjustCard('${p.id}','weight',-1)">−</button>
                <span class="font-bold text-green-900 text-base w-10 text-center" id="weight-${p.id}">${s.weight}</span>
                <button class="qty-btn" onclick="adjustCard('${p.id}','weight',1)">+</button>
                <span class="text-xs text-gray-400 ml-1">${p.unit}</span>
            </div>
            </div>
            <!-- Qty selector (for multi-buy) -->
            <div class="mb-4">
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">Orders</div>
            <div class="flex items-center gap-3">
                <button class="qty-btn" onclick="adjustCard('${p.id}','qty',-1)">−</button>
                <span class="font-bold text-green-900 text-base w-10 text-center" id="qty-${p.id}">${s.qty}</span>
                <button class="qty-btn" onclick="adjustCard('${p.id}','qty',1)">+</button>
            </div>
            </div>
            <!-- Total -->
            <div class="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-xl">
            <span class="text-sm text-gray-500">Total</span>
            <span class="font-display text-xl text-green-800 font-bold" id="total-${p.id}">₦${total.toLocaleString()}</span>
            </div>
            <!-- Add to cart -->
            <button onclick="addToCart('${p.id}')" class="mt-auto w-full bg-green-800 hover:bg-green-700 active:scale-95 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
            Add to Cart
            </button>
        </div>`;
        grid.appendChild(card);
    });
    triggerReveal();
}

function adjustCard(id, field, delta) {
    cardState[id][field] = Math.max(1, cardState[id][field] + delta);
    document.getElementById(`weight-${id}`).textContent = cardState[id].weight;
    document.getElementById(`qty-${id}`).textContent = cardState[id].qty;
    updateCardTotal(id);
}

function updateCardTotal(id) {
    const p = products.find(x => x.id === id);
    const s = cardState[id];
    const total = p.basePrice * s.weight * s.qty;
    document.getElementById(`total-${id}`).textContent = `₦${total.toLocaleString()}`;
}


// ==== GALLERY
const galleryPhotos = [
    { src: './assets/gallery/photo1.jpeg', caption: 'Healthy hens at feeding time' },
    { src: './assets/gallery/photo2.jpg', caption: 'Layer hens in cages' },
    { src: './assets/gallery/photo3.jpg', caption: 'Poultry manure bags' },
    { src: './assets/gallery/photo4.jpg', caption: 'Rich organic manure' },
    { src: './assets/gallery/photo5.jpg', caption: 'Fresh manure ready for sale' },
    { src: './assets/gallery/photo6.jpg', caption: 'Bagged manure closeup' },
    { src: './assets/gallery/photo7.jpg', caption: 'NAFDAC certified poultry feed' },
    { src: './assets/gallery/photo8.jpg', caption: 'Multi-tier layer cage system' }, 
];

let currentLightboxIndex = 0;

function switchTab(tab) {
    const photos = document.getElementById('gallery-photos');
    const videos = document.getElementById('gallery-videos');
    const tabPhotos = document.getElementById('tab-photos');
    const tabVideos = document.getElementById('tab-videos');

    if (tab === 'photos') {
        photos.classList.remove('hidden');
        videos.classList.add('hidden');
        tabPhotos.classList.add('active-tab');
        tabVideos.classList.remove('active-tab');
    } else {
        videos.classList.remove('hidden');
        photos.classList.add('hidden');
        tabVideos.classList.add('active-tab');
        tabPhotos.classList.remove('active-tab');
    }
    triggerReveal();
}

function openLightbox(src, caption) {
    currentLightboxIndex = galleryPhotos.findIndex(p => p.src === src);
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-caption').textContent = caption;
    document.getElementById('lightbox').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
    document.body.style.overflow = '';
}

function lightboxNav(dir) {
    currentLightboxIndex = ((currentLightboxIndex + dir) + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[currentLightboxIndex];
    document.getElementById('lightbox-img').src = photo.src;
    document.getElementById('lightbox-caption').textContent = photo.caption;
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'ArrowLeft') lightboxNav(-1);
});


// ==== CART LOGIC
function addToCart(id) {
    const p = products.find(x => x.id === id);
    const s = cardState[id];
    const total = p.basePrice * s.weight * s.qty;
    cart.push({
        id: p.id,
        name: p.name,
        image: p.image,   // ← add this line
        emoji: p.emoji,
        weight: s.weight,
        qty: s.qty,
        unit: p.unit,
        unitPrice: p.basePrice,
        total
    });
    renderCart();
    updateBadge();
    toggleCartDrawer(true);
    cardState[id] = { weight: 1, qty: 1 };
    document.getElementById(`weight-${id}`).textContent = 1;
    document.getElementById(`qty-${id}`).textContent = 1;
    updateCardTotal(id);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    updateBadge();
}

function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    const emptyEl = document.getElementById('cart-empty');
    const footerEl = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');
    const countLabel = document.getElementById('cart-count-label');

    itemsEl.innerHTML = '';
    countLabel.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;

    if (cart.length === 0) {
        emptyEl.classList.remove('hidden');
        footerEl.classList.add('hidden');
        itemsEl.classList.add('hidden');
        return;
    }

    emptyEl.classList.add('hidden');
    footerEl.classList.remove('hidden');
    itemsEl.classList.remove('hidden');

    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += item.total;
        const el = document.createElement('div');
        el.className = 'flex items-start gap-3 bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm';
        el.innerHTML = `
        <div class="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
            <img 
                src="${item.image}" 
                alt="${item.name}" 
                class="w-full h-full object-cover"
                onerror="this.parentElement.innerHTML='${item.emoji}'; this.parentElement.style.cssText='width:3rem;height:3rem;border-radius:0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;background:#f0f7f3;';"
            />
        </div>
        <div class="flex-1 min-w-0">
            <div class="font-semibold text-green-900 text-sm truncate">${item.name}</div>
            <div class="text-xs text-gray-400 mt-0.5">${item.weight} ${item.unit} × ${item.qty} order${item.qty > 1 ? 's' : ''}</div>
            <div class="font-display text-base text-green-700 font-bold mt-1">₦${item.total.toLocaleString()}</div>
        </div>
        <button onclick="removeFromCart(${i})" class="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 flex-shrink-0 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>`;
        itemsEl.appendChild(el);
    });

    subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
}

function updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function toggleCartDrawer(forceOpen) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (forceOpen === true || !drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;
    let message = '🛒 *New Order from Chidinma Eggcellent Poultry Farm*\n\n';
    cart.forEach((item, i) => {
        message += `${i + 1}. *${item.name}*\n   ${item.weight} ${item.unit} × ${item.qty} order(s) = ₦${item.total.toLocaleString()}\n\n`;
    });
    const subtotal = cart.reduce((sum, i) => sum + i.total, 0);
    message += `━━━━━━━━━━━━━━━━\n💰 *Subtotal: ₦${subtotal.toLocaleString()}*\n\nPlease confirm delivery details. Thank you! 🌿`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ==== CHECKOUT PANEL
let selectedPayment = 'whatsapp';

function openCheckout() {
    if (cart.length === 0) return;

    // Populate order summary
    const summaryEl = document.getElementById('checkout-items-summary');
    const totalEl = document.getElementById('checkout-total');
    let subtotal = 0;

    summaryEl.innerHTML = '';
    cart.forEach(item => {
        subtotal += item.total;
        summaryEl.innerHTML += `
        <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">${item.name} ×${item.qty}</span>
            <span class="font-semibold text-green-900">₦${item.total.toLocaleString()}</span>
        </div>`;
    });

    totalEl.textContent = `₦${subtotal.toLocaleString()}`;

    // Show checkout panel
    const panel = document.getElementById('checkout-panel');
    panel.classList.remove('hidden');
    setTimeout(() => panel.classList.add('open'), 10);
}

function closeCheckout() {
    const panel = document.getElementById('checkout-panel');
    panel.classList.remove('open');
    setTimeout(() => panel.classList.add('hidden'), 350);
}

function selectPayment(method) {
    selectedPayment = method;
    document.getElementById('pay-whatsapp').classList.toggle('active-payment', method === 'whatsapp');
    document.getElementById('pay-whatsapp').classList.toggle('border-green-500', method === 'whatsapp');
    document.getElementById('pay-whatsapp').classList.toggle('border-gray-200', method !== 'whatsapp');
    document.getElementById('pay-bank').classList.toggle('active-payment', method === 'bank');
    document.getElementById('pay-bank').classList.toggle('border-green-500', method === 'bank');
    document.getElementById('pay-bank').classList.toggle('border-gray-200', method !== 'bank');
    document.getElementById('bank-details').classList.toggle('hidden', method !== 'bank');
}

function submitCheckout() {
    const name = document.getElementById('co-name').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const date = document.getElementById('co-date').value;
    const address = document.getElementById('co-address').value.trim();
    const errorEl = document.getElementById('co-error');

    // Validation
    if (!name || !phone || !date || !address) {
        errorEl.textContent = 'Please fill in all required fields.';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');

    // Build WhatsApp message
    let message = `🛒 *New Order — Chidinma Eggcellent Poultry Farm*\n\n`;
    message += `👤 *Customer Details*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Delivery Date: ${date}\n`;
    message += `Address: ${address}\n\n`;
    message += `📦 *Order Summary*\n`;

    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += item.total;
        message += `${i + 1}. ${item.name} — ${item.weight} ${item.unit} × ${item.qty} = ₦${item.total.toLocaleString()}\n`;
    });

    message += `\n━━━━━━━━━━━━━━\n`;
    message += `💰 *Total: ₦${subtotal.toLocaleString()}*\n`;
    message += `💳 Payment: ${selectedPayment === 'whatsapp' ? 'Pay on Delivery / WhatsApp' : 'Bank Transfer'}\n\n`;
    message += `Thank you for ordering from Chidinma Eggcellent! 🐔🥚`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ==== Auto-update year
document.getElementById("year").textContent = new Date().getFullYear();