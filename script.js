/* ==========================================================================
   INDRIVE CLONE - ALL EGYPT GOVERNORATES & LOCATIONS
   ========================================================================== */

// 1. Comprehensive Database for Egypt Regions
const egyptData = {
    cairo: {
        center: [30.0444, 31.2357],
        locations: {
            "ميدان التحرير، القاهرة": [30.0444, 31.2357],
            "مدينة نصر، القاهرة": [30.0561, 31.3301],
            "مصر الجديدة، القاهرة": [30.0910, 31.3230],
            "التجمع الخامس، القاهرة الجديدة": [30.0074, 31.4290],
            "المهندسين، الجيزة": [30.0511, 31.1990],
            "الدقي، الجيزة": [30.0381, 31.2118],
            "الشيخ زايد، الجيزة": [30.0425, 30.9780],
            "6 أكتوبر، الجيزة": [29.9723, 30.9496],
            "المعادي، القاهرة": [29.9602, 31.2569]
        }
    },
    alex: {
        center: [31.2001, 29.8997],
        locations: {
            "محطة الرمل، الإسكندرية": [31.2001, 29.8997],
            "سيدي بشر، الإسكندرية": [31.2642, 30.0028],
            "سموحة، الإسكندرية": [31.2155, 29.9553],
            "ميامي، الإسكندرية": [31.2683, 30.0105],
            "الشاطبي، الإسكندرية": [31.2118, 29.9161],
            "العجمي، الإسكندرية": [31.1090, 29.7820],
            "المنتزه، الإسكندرية": [31.2883, 30.0270]
        }
    },
    mansoura: {
        center: [31.0409, 31.3785],
        locations: {
            "المشاية السفلية، المنصورة": [31.0409, 31.3785],
            "حي الجامعة، المنصورة": [31.0450, 31.3620],
            "قناة السويس، المنصورة": [31.0330, 31.3900],
            "ميدان أوم كلثوم، المنصورة": [31.0480, 31.3810]
        }
    },
    tanta: {
        center: [30.7865, 31.0004],
        locations: {
            "شارع البحر، طنطا": [30.7865, 31.0004],
            "شارع النحاس، طنطا": [30.7920, 31.0030],
            "ميدان السيد البدوي، طنطا": [30.7880, 30.9980],
            "حي الاستاد، طنطا": [30.8010, 31.0080]
        }
    },
    asyut: {
        center: [27.1783, 31.1859],
        locations: {
            "شارع النميس، أسيوط": [27.1783, 31.1859],
            "شارع يسري راغب، أسيوط": [27.1820, 31.1890],
            "جامعة أسيوط، أسيوط": [27.1890, 31.1710],
            "حي شطب، أسيوط": [27.1650, 31.2000]
        }
    },
    ismailia: {
        center: [30.5965, 32.2715],
        locations: {
            "شارع محمد علي، الإسماعيلية": [30.5965, 32.2715],
            "حي الأشجار، الإسماعيلية": [30.6020, 32.2810],
            "ميدان الفردوس، الإسماعيلية": [30.5890, 32.2650]
        }
    }
};

// 2. Initialize Leaflet Map
let currentGov = 'alex';
const map = L.map('real-map', { zoomControl: false }).setView(egyptData[currentGov].center, 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Markers
let pickupMarker = L.marker(egyptData[currentGov].center).addTo(map);
let dropoffMarker = L.marker([egyptData[currentGov].center[0] + 0.02, egyptData[currentGov].center[1] + 0.02]).addTo(map);

// Driver Markers
let driverMarkers = [
    L.marker([egyptData[currentGov].center[0] + 0.005, egyptData[currentGov].center[1] + 0.005]).addTo(map),
    L.marker([egyptData[currentGov].center[0] - 0.005, egyptData[currentGov].center[1] - 0.005]).addTo(map)
];

// Update Governorate Function
function loadGovernorate(govKey) {
    currentGov = govKey;
    const govData = egyptData[govKey];
    
    map.setView(govData.center, 13);
    
    const pickupSelect = document.getElementById('pickup-select');
    const dropoffSelect = document.getElementById('dropoff-select');
    
    pickupSelect.innerHTML = '';
    dropoffSelect.innerHTML = '';
    
    const locationNames = Object.keys(govData.locations);
    locationNames.forEach(loc => {
        pickupSelect.add(new Option(loc, loc));
        dropoffSelect.add(new Option(loc, loc));
    });

    pickupSelect.selectedIndex = 0;
    dropoffSelect.selectedIndex = Math.min(1, locationNames.length - 1);
    
    // Update map markers
    const pCoords = govData.locations[pickupSelect.value];
    const dCoords = govData.locations[dropoffSelect.value];
    
    if (pCoords) pickupMarker.setLatLng(pCoords);
    if (dCoords) dropoffMarker.setLatLng(dCoords);

    // Reposition drivers
    driverMarkers[0].setLatLng([govData.center[0] + 0.005, govData.center[1] + 0.005]);
    driverMarkers[1].setLatLng([govData.center[0] - 0.005, govData.center[1] - 0.005]);
}

// Governorate Change Listener
document.getElementById('governorate-select').addEventListener('change', (e) => {
    loadGovernorate(e.target.value);
});

// Select Listeners
const pickupSelect = document.getElementById('pickup-select');
const dropoffSelect = document.getElementById('dropoff-select');

pickupSelect.addEventListener('change', (e) => {
    const coords = egyptData[currentGov].locations[e.target.value];
    if (coords) {
        pickupMarker.setLatLng(coords);
        map.panTo(coords);
    }
});

dropoffSelect.addEventListener('change', (e) => {
    const coords = egyptData[currentGov].locations[e.target.value];
    if (coords) {
        dropoffMarker.setLatLng(coords);
    }
});

// Drivers Animation
setInterval(() => {
    driverMarkers.forEach(m => {
        const latLng = m.getLatLng();
        m.setLatLng([
            latLng.lat + (Math.random() - 0.5) * 0.0015,
            latLng.lng + (Math.random() - 0.5) * 0.0015
        ]);
    });
}, 2000);

// Initial Load
loadGovernorate('alex');

// 3. Audio & UX Flow Logic
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

// App Logic
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
                    ##### ${driver.name}
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