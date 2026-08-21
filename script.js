/* ==========================================================================
   INDRIVE CLONE - PRODUCTION LEVEL WITH LEAFLET INTERACTIVE MAPS & AUDIO
   ========================================================================== */

// 1. Locations Coordinates (Alexandria)
const locationsData = {
    "محطة الرمل، الإسكندرية": [31.2001, 29.8997],
    "سيدي بشر، الإسكندرية": [31.2642, 30.0028],
    "سموحة، الإسكندرية": [31.2155, 29.9553],
    "ميامي، الإسكندرية": [31.2683, 30.0105],
    "الشاطبي، الإسكندرية": [31.2118, 29.9161],
    "العجمي، الإسكندرية": [31.1090, 29.7820]
};

// 2. Initialize Leaflet Map (Dark Tile Style)
const alexCoords = [31.2001, 29.8997];
const map = L.map('real-map', { zoomControl: false }).setView(alexCoords, 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap & CartoDB'
}).addTo(map);

// Map Custom Markers
let pickupMarker = L.marker([31.2001, 29.8997]).addTo(map).bindPopup("موقع الانطلاق");
let dropoffMarker = L.marker([31.2642, 30.0028]).addTo(map).bindPopup("جهة الوصول");

// Live Moving Drivers
const driverMarkers = [
    L.marker([31.2050, 29.9050]).addTo(map),
    L.marker([31.2100, 29.8950]).addTo(map),
    L.marker([31.1980, 29.9100]).addTo(map)
];

// Move Drivers Randomly
setInterval(() => {
    driverMarkers.forEach(m => {
        const latLng = m.getLatLng();
        m.setLatLng([
            latLng.lat + (Math.random() - 0.5) * 0.002,
            latLng.lng + (Math.random() - 0.5) * 0.002
        ]);
    });
}, 2000);

// Populate Location Options
const pickupSelect = document.getElementById('pickup-select');
const dropoffSelect = document.getElementById('dropoff-select');

Object.keys(locationsData).forEach(loc => {
    pickupSelect.add(new Option(loc, loc));
    dropoffSelect.add(new Option(loc, loc));
});
pickupSelect.selectedIndex = 0;
dropoffSelect.selectedIndex = 1;

// Update map markers when user changes select
pickupSelect.addEventListener('change', (e) => {
    const coords = locationsData[e.target.value];
    if (coords) {
        pickupMarker.setLatLng(coords);
        map.panTo(coords);
    }
});

dropoffSelect.addEventListener('change', (e) => {
    const coords = locationsData[e.target.value];
    if (coords) {
        dropoffMarker.setLatLng(coords);
    }
});

// Sound Effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    }
}

function triggerHaptic() {
    if (navigator.vibrate) navigator.vibrate(40);
}

// App Logic & State
let currentFare = 50;
let searchTimer = null;
let etaInterval = null;

const fareDisplay = document.getElementById('fare-amount');
const minusBtn = document.getElementById('minus-btn');
const plusBtn = document.getElementById('plus-btn');
const searchBtn = document.getElementById('search-btn');
const cancelSearchBtn = document.getElementById('cancel-search-btn');
const cancelTripBtn = document.getElementById('cancel-trip-btn');

const stepRequest = document.getElementById('step-request');
const stepSearching = document.getElementById('step-searching');
const stepBids = document.getElementById('step-bids');
const stepTracking = document.getElementById('step-tracking');

const mockDrivers = [
    { name: "أحمد محمود", car: "تويوتا كورولا • أبيض", rating: "4.9 ★", priceOffset: 0, img: "https://i.pravatar.cc/100?img=11" },
    { name: "محمد السيد", car: "نيسان صني • أسود", rating: "4.8 ★", priceOffset: 10, img: "https://i.pravatar.cc/100?img=12" },
    { name: "محمود حسن", car: "هيونداي إلانتيرا • فضي", rating: "4.7 ★", priceOffset: -5, img: "https://i.pravatar.cc/100?img=13" }
];

// Fare Controls
plusBtn.addEventListener('click', () => {
    playSound('click');
    triggerHaptic();
    currentFare += 5;
    fareDisplay.textContent = currentFare;
});

minusBtn.addEventListener('click', () => {
    if (currentFare > 15) {
        playSound('click');
        triggerHaptic();
        currentFare -= 5;
        fareDisplay.textContent = currentFare;
    }
});

// Vehicle Selector
document.querySelectorAll('.vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
        playSound('click');
        triggerHaptic();
        document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const type = card.dataset.type;
        if (type === 'economy') currentFare = 50;
        if (type === 'comfort') currentFare = 80;
        if (type === 'bike') currentFare = 25;
        fareDisplay.textContent = currentFare;
    });
});

// Steps Handlers
searchBtn.addEventListener('click', () => {
    playSound('click');
    triggerHaptic();
    stepRequest.classList.add('hidden');
    stepSearching.classList.remove('hidden');

    searchTimer = setTimeout(() => {
        showBids();
    }, 3000);
});

cancelSearchBtn.addEventListener('click', () => {
    playSound('click');
    clearTimeout(searchTimer);
    stepSearching.classList.add('hidden');
    stepRequest.classList.remove('hidden');
});

function showBids() {
    playSound('success');
    triggerHaptic();
    stepSearching.classList.add('hidden');
    stepBids.classList.remove('hidden');

    const bidsList = document.getElementById('bids-list');
    const bidsCount = document.getElementById('bids-count');
    document.getElementById('current-user-price').textContent = currentFare;
    
    bidsList.innerHTML = '';
    bidsCount.textContent = mockDrivers.length;

    mockDrivers.forEach(driver => {
        const finalPrice = Math.max(15, currentFare + driver.priceOffset);
        const card = document.createElement('div');
        card.className = 'bid-card';
        card.innerHTML = `
            <div class="driver-info">
                <img src="${driver.img}" class="driver-img" alt="${driver.name}">
                <div class="driver-details">
                    <h5>${driver.name}</h5>
                    <span class="rating">${driver.rating}</span>
                    <p class="car-details">${driver.car}</p>
                </div>
                <div class="bid-price">
                    <span class="price-val">${finalPrice} <small>ج.م</small></span>
                    ${driver.priceOffset > 0 ? '<span class="counter-tag">عرض مضاد</span>' : ''}
                </div>
            </div>
            <div class="bid-actions">
                <button class="btn-accept" onclick="acceptBid('${driver.name}', '${driver.car}', '${driver.img}', ${finalPrice})">قبول العرض</button>
                <button class="btn-decline" onclick="this.closest('.bid-card').remove()">رفض</button>
            </div>
        `;
        bidsList.appendChild(card);
    });
}

window.acceptBid = function(name, car, img, price) {
    playSound('success');
    triggerHaptic();
    stepBids.classList.add('hidden');
    stepTracking.classList.remove('hidden');

    document.getElementById('accepted-driver-card').innerHTML = `
        <div class="driver-info">
            <img src="${img}" class="driver-img" alt="${name}">
            <div class="driver-details">
                <h5>${name}</h5>
                <p class="car-details">${car}</p>
                <strong style="color: var(--primary); font-size: 13px;">الأجرة المتفق عليها: ${price} ج.م</strong>
            </div>
        </div>
    `;

    startETATimer(210);
};

function startETATimer(seconds) {
    let timer = seconds;
    const display = document.getElementById('eta-timer');
    
    clearInterval(etaInterval);
    etaInterval = setInterval(() => {
        const mins = String(Math.floor(timer / 60)).padStart(2, '0');
        const secs = String(timer % 60).padStart(2, '0');
        display.textContent = `${mins}:${secs}`;
        
        if (--timer < 0) {
            clearInterval(etaInterval);
            display.textContent = "وصل الكابتن!";
        }
    }, 1000);
}

cancelTripBtn.addEventListener('click', () => {
    playSound('click');
    clearInterval(etaInterval);
    stepTracking.classList.add('hidden');
    stepRequest.classList.remove('hidden');
});