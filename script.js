/* ==========================================================================
   INDRIVE CLONE - ADVANCED LOGIC & AUDIO/HAPTIC INTERACTION
   ========================================================================== */

// Audio FX Setup (Web Audio API - No external files needed)
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
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    }
}

// Trigger Mobile Haptic Feedback
function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(40);
    }
}

// State Management
let currentFare = 50;
let baseFare = 50;
let searchTimer = null;
let etaInterval = null;

// DOM Elements
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

// Mock Drivers Data
const mockDrivers = [
    { name: "أحمد محمود", car: "تويوتا كورولا • أبيض", rating: "4.9 ★", priceOffset: 0, img: "https://i.pravatar.cc/100?img=11" },
    { name: "محمد السيد", car: "نيسان صني • أسود", rating: "4.8 ★", priceOffset: 10, img: "https://i.pravatar.cc/100?img=12" },
    { name: "محمود حسن", car: "هيونداي إلانتيرا • فضي", rating: "4.7 ★", priceOffset: -5, img: "https://i.pravatar.cc/100?img=13" }
];

/* --- Fare Adjustment --- */
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

/* --- Vehicle Selector --- */
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

/* --- Flow Controls --- */
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

    startETATimer(210); // 3:30 mins
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

// Network Status Alert
window.addEventListener('offline', () => alert('عفواً، تم قطع الاتصال بالإنترنت'));
// تعبئة الأماكن تلقائياً
const locations = ["محطة الرمل، الإسكندرية", "سيدي بشر، الإسكندرية", "سموحة، الإسكندرية", "ميامي، الإسكندرية"];
const pickupSelect = document.getElementById('pickup-select');
const dropoffSelect = document.getElementById('dropoff-select');

locations.forEach(loc => {
    pickupSelect.add(new Option(loc, loc));
    dropoffSelect.add(new Option(loc, loc));
});
dropoffSelect.selectedIndex = 1; // اختيار مكان مختلف للوصول تلقائياً