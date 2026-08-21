/* ==========================================================================
   INDRIVE EGYPT ENTERPRISE ARCHITECTURE
   ========================================================================== */

/**
 * 1. Comprehensive Database Configuration for All Egyptian Governorates
 */
const EGYPT_GOVERNORATES_DATABASE = {
    cairo: {
        name: "القاهرة والجيزة",
        center: [30.0444, 31.2357],
        locations: {
            "ميدان التحرير، وسط البلد": [30.0444, 31.2357],
            "شارع عباس العقاد، مدينة نصر": [30.0561, 31.3301],
            "شارع الأهرام، الكوربة، مصر الجديدة": [30.0910, 31.3230],
            "شارع التسعين، التجمع الخامس": [30.0074, 31.4290],
            "شارع جامعة الدول العربية، المهندسين": [30.0511, 31.1990],
            "ميدان المساحة، الدقي": [30.0381, 31.2118],
            "هايبر ون، الشيخ زايد": [30.0425, 30.9780],
            "ميدان الحصري، 6 أكتوبر": [29.9723, 30.9496],
            "شارع النصر، المعادي": [29.9602, 31.2569],
            "ميدان الرماية، الهرم": [29.9880, 31.1210]
        }
    },
    alex: {
        name: "الإسكندرية",
        center: [31.2001, 29.8997],
        locations: {
            "محطة الرمل، وسط البلد": [31.2001, 29.8997],
            "شارع خالد بن الوليد، سيدي بشر": [31.2642, 30.0028],
            "ميدان سموحة، أمام النادي": [31.2155, 29.9553],
            "شارع إسكندر إبراهيم، ميامي": [31.2683, 30.0105],
            "مجمع الكليات، الشاطبي": [31.2118, 29.9161],
            "شارع البيطاش الرئيسي، العجمي": [31.1090, 29.7820],
            "بوابة قصر المنتزه": [31.2883, 30.0270],
            "محطة قطار سيدي جابر": [31.2180, 29.9410],
            "سان ستيفانو جراند بلازا": [31.2450, 29.9660]
        }
    },
    mansoura: {
        name: "المنصورة",
        center: [31.0409, 31.3785],
        locations: {
            "المشاية السفلية، النيل": [31.0409, 31.3785],
            "حي الجامعة الرئيسي": [31.0450, 31.3620],
            "شارع قناة السويس": [31.0330, 31.3900],
            "ميدان أم كلثوم، توريل": [31.0480, 31.3810],
            "شارع جيهان، أمام الجامعة": [31.0410, 31.3580]
        }
    },
    tanta: {
        name: "طنطا",
        center: [30.7865, 31.0004],
        locations: {
            "شارع الجيش (البحر)": [30.7865, 31.0004],
            "شارع النحاس": [30.7920, 31.0030],
            "ميدان ك Were السيد البدوي": [30.7880, 30.9980],
            "حي الاستاد الجديد": [30.8010, 31.0080],
            "شارع سعيد الرئيسي": [30.7950, 31.0060]
        }
    },
    asyut: {
        name: "أسيوط",
        center: [27.1783, 31.1859],
        locations: {
            "شارع النميس": [27.1783, 31.1859],
            "شارع يسري راغب": [27.1820, 31.1890],
            "البوابة الرئيسية لجامعة أسيوط": [27.1890, 31.1710],
            "حي شطب": [27.1650, 31.2000]
        }
    },
    ismailia: {
        name: "الإسماعيلية",
        center: [30.5965, 32.2715],
        locations: {
            "شارع محمد علي": [30.5965, 32.2715],
            "حي الأشجار": [30.6020, 32.2810],
            "ميدان الفردوس": [30.5890, 32.2650]
        }
    },
    zagazig: {
        name: "الزقازيق",
        center: [30.5877, 31.5020],
        locations: {
            "شارع القومية": [30.5877, 31.5020],
            "ميدان طلعت حرب": [30.5810, 31.5110],
            "محيط جامعة الزقازيق": [30.5920, 31.4980]
        }
    },
    suez: {
        name: "السويس",
        center: [29.9668, 32.5498],
        locations: {
            "شارع الجيش، السويس": [29.9668, 32.5498],
            "بورتوفيق": [29.9430, 32.5620],
            "حي الأربعين": [29.9750, 32.5380]
        }
    }
};

/**
 * 2. Mock Drivers Pool Engine
 */
const DRIVERS_DATABASE_POOL = [
    { id: 101, name: "كابتن/ أحمد محمود", rating: "4.95 ★", car: "تويوتا كورولا 2023 • أبيض", trips: 1420, phone: "01002345678", img: "https://i.pravatar.cc/100?img=11" },
    { id: 102, name: "كابتن/ محمد السيد", rating: "4.88 ★", car: "نيسان صني 2022 • أسود", trips: 980, phone: "01112345678", img: "https://i.pravatar.cc/100?img=12" },
    { id: 103, name: "كابتن/ محمود حسن", rating: "4.79 ★", car: "هيونداي إلانتيرا 2021 • فضي", trips: 650, phone: "01222345678", img: "https://i.pravatar.cc/100?img=13" },
    { id: 104, name: "كابتن/ طارق علي", rating: "4.91 ★", car: "كيا سيراتو 2020 • احمر", trips: 1100, phone: "01552345678", img: "https://i.pravatar.cc/100?img=14" },
    { id: 105, name: "كابتن/ إبراهيم خالد", rating: "4.85 ★", car: "شيري أريزو 2023 • كحلي", trips: 430, phone: "01098765432", img: "https://i.pravatar.cc/100?img=15" },
    { id: 106, name: "كابتن/ حسام مصطفى", rating: "4.98 ★", car: "شيفروليه أفيو 2019 • رمادي", trips: 2100, phone: "01198765432", img: "https://i.pravatar.cc/100?img=16" }
];

/**
 * 3. Sound Effects Engine using Web Audio API
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playClick() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playSuccess() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }
}

/**
 * 4. Text-To-Speech Voice Engine
 */
class VoiceEngine {
    constructor() {
        this.enabled = true;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    speak(text) {
        if (!this.enabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    }
}

/**
 * 5. Leaflet Interactive Map Control Engine
 */
class MapEngine {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.tileLayer = null;
        this.isDark = true;
        this.pickupMarker = null;
        this.dropoffMarker = null;
        this.routePolyline = null;
        this.driverMarkers = [];
    }

    init(center) {
        this.map = L.map(this.containerId, { zoomControl: false }).setView(center, 13);
        this.setMapStyle(true);

        this.pickupMarker = L.marker(center, { draggable: true }).addTo(this.map);
        this.dropoffMarker = L.marker([center[0] + 0.015, center[1] + 0.015], { draggable: true }).addTo(this.map);
        
        this.routePolyline = L.polyline([], {
            color: '#00e676',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10'
        }).addTo(this.map);

        this.initDriverMarkers(center);
    }

    setMapStyle(isDark) {
        this.isDark = isDark;
        if (this.tileLayer) this.map.removeLayer(this.tileLayer);

        const tileUrl = isDark 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        this.tileLayer = L.tileLayer(tileUrl, { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(this.map);
    }

    initDriverMarkers(center) {
        this.clearDrivers();
        for (let i = 0; i < 4; i++) {
            const randomLat = center[0] + (Math.random() - 0.5) * 0.02;
            const randomLng = center[1] + (Math.random() - 0.5) * 0.02;
            const marker = L.marker([randomLat, randomLng]).addTo(this.map);
            this.driverMarkers.push(marker);
        }

        setInterval(() => {
            this.driverMarkers.forEach(marker => {
                const pos = marker.getLatLng();
                marker.setLatLng([
                    pos.lat + (Math.random() - 0.5) * 0.001,
                    pos.lng + (Math.random() - 0.5) * 0.001
                ]);
            });
        }, 2500);
    }

    clearDrivers() {
        this.driverMarkers.forEach(m => this.map.removeLayer(m));
        this.driverMarkers = [];
    }

    updateMarkersAndRoute(pCoords, dCoords) {
        if (pCoords) this.pickupMarker.setLatLng(pCoords);
        if (dCoords) this.dropoffMarker.setLatLng(dCoords);

        const pPos = this.pickupMarker.getLatLng();
        const dPos = this.dropoffMarker.getLatLng();
        this.routePolyline.setLatLngs([pPos, dPos]);

        return (pPos.distanceTo(dPos) / 1000).toFixed(2); // Return Distance in KM
    }
}

/**
 * 6. Main Application Core Manager
 */
class InDriveAppCore {
    constructor() {
        this.sound = new SoundEngine();
        this.voice = new VoiceEngine();
        this.mapEngine = new MapEngine('real-map');
        
        this.currentGovKey = 'alex';
        this.selectedVehicle = 'economy';
        this.baseFare = 50;
        this.currentFare = 50;
        
        this.searchTimeout = null;
        this.etaTimerInterval = null;
        this.tripHistoryList = [];

        this.initDOM();
        this.bindEvents();
    }

    initDOM() {
        this.govSelector = document.getElementById('governorate-selector');
        this.pickupSelect = document.getElementById('pickup-select');
        this.dropoffSelect = document.getElementById('dropoff-select');
        this.fareDisplay = document.getElementById('fare-amount-display');

        this.stepRequest = document.getElementById('step-request');
        this.stepSearching = document.getElementById('step-searching');
        this.stepBids = document.getElementById('step-bids');
        this.stepTracking = document.getElementById('step-tracking');

        this.mapEngine.init(EGYPT_GOVERNORATES_DATABASE[this.currentGovKey].center);
        this.loadGovernorateData(this.currentGovKey);
    }

    bindEvents() {
        // Theme Toggle
        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            this.sound.playClick();
            const isDark = !this.mapEngine.isDark;
            this.mapEngine.setMapStyle(isDark);
            document.getElementById('theme-toggle-btn').innerHTML = isDark 
                ? '<i class="fa-solid fa-moon"></i>' 
                : '<i class="fa-solid fa-sun"></i>';
        });

        // Voice Toggle
        document.getElementById('voice-toggle-btn').addEventListener('click', () => {
            this.sound.playClick();
            const active = this.voice.toggle();
            document.getElementById('voice-toggle-btn').style.opacity = active ? "1" : "0.4";
        });

        // Governorate Selector
        this.govSelector.addEventListener('change', (e) => {
            this.sound.playClick();
            this.loadGovernorateData(e.target.value);
        });

        // Select Change Events
        this.pickupSelect.addEventListener('change', () => this.recalculateTripParams());
        this.dropoffSelect.addEventListener('change', () => this.recalculateTripParams());

        // Draggable Marker Events
        this.mapEngine.pickupMarker.on('dragend', () => this.recalculateTripParams());
        this.mapEngine.dropoffMarker.on('dragend', () => this.recalculateTripParams());

        // GPS Location Button
        document.getElementById('current-location-btn').addEventListener('click', () => {
            if (navigator.geolocation) {
                this.sound.playClick();
                navigator.geolocation.getCurrentPosition(pos => {
                    const coords = [pos.coords.latitude, pos.coords.longitude];
                    this.mapEngine.map.setView(coords, 15);
                    this.mapEngine.pickupMarker.setLatLng(coords);
                    this.recalculateTripParams();
                    this.sound.playSuccess();
                });
            }
        });

        // Fare Buttons
        document.getElementById('fare-plus-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.currentFare += 5;
            this.fareDisplay.textContent = this.currentFare;
        });

        document.getElementById('fare-minus-btn').addEventListener('click', () => {
            if (this.currentFare > 15) {
                this.sound.playClick();
                this.currentFare -= 5;
                this.fareDisplay.textContent = this.currentFare;
            }
        });

        // Vehicle Selector
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.selectedVehicle = card.dataset.type;
                this.recalculateTripParams();
            });
        });

        // Search Steps
        document.getElementById('start-search-btn').addEventListener('click', () => this.startSearchPhase());
        document.getElementById('cancel-search-btn').addEventListener('click', () => this.cancelSearchPhase());
        document.getElementById('cancel-active-trip-btn').addEventListener('click', () => this.cancelActiveTrip());

        // History Modal
        document.getElementById('history-modal-btn').addEventListener('click', () => {
            this.sound.playClick();
            document.getElementById('history-modal-view').classList.remove('hidden');
            this.renderHistory();
        });

        document.getElementById('close-history-modal').addEventListener('click', () => {
            document.getElementById('history-modal-view').classList.add('hidden');
        });
    }

    loadGovernorateData(key) {
        this.currentGovKey = key;
        const govData = EGYPT_GOVERNORATES_DATABASE[key];
        
        this.mapEngine.map.setView(govData.center, 13);
        this.mapEngine.initDriverMarkers(govData.center);

        this.pickupSelect.innerHTML = '';
        this.dropoffSelect.innerHTML = '';

        const locationNames = Object.keys(govData.locations);
        locationNames.forEach(loc => {
            this.pickupSelect.add(new Option(loc, loc));
            this.dropoffSelect.add(new Option(loc, loc));
        });

        this.pickupSelect.selectedIndex = 0;
        this.dropoffSelect.selectedIndex = Math.min(1, locationNames.length - 1);

        this.recalculateTripParams();
    }

    recalculateTripParams() {
        const govLocations = EGYPT_GOVERNORATES_DATABASE[this.currentGovKey].locations;
        const pCoords = govLocations[this.pickupSelect.value];
        const dCoords = govLocations[this.dropoffSelect.value];

        const distanceKm = this.mapEngine.updateMarkersAndRoute(pCoords, dCoords);

        // Price multiplier depending on vehicle type
        let ratePerKm = 7;
        let baseFee = 20;

        if (this.selectedVehicle === 'comfort') { ratePerKm = 11; baseFee = 35; }
        if (this.selectedVehicle === 'bike') { ratePerKm = 4; baseFee = 12; }

        this.currentFare = Math.max(15, Math.round(distanceKm * ratePerKm + baseFee));
        this.fareDisplay.textContent = this.currentFare;
    }

    startSearchPhase() {
        this.sound.playClick();
        this.stepRequest.classList.add('hidden');
        this.stepSearching.classList.remove('hidden');

        this.voice.speak("جاري البحث عن كابتن قريب");

        this.searchTimeout = setTimeout(() => {
            this.renderBidsPhase();
        }, 3000);
    }

    cancelSearchPhase() {
        this.sound.playClick();
        clearTimeout(this.searchTimeout);
        this.stepSearching.classList.add('hidden');
        this.stepRequest.classList.remove('hidden');
    }

    renderBidsPhase() {
        this.sound.playSuccess();
        this.voice.speak("وصلتك عروض جديدة من الكباتن");

        this.stepSearching.classList.add('hidden');
        this.stepBids.classList.remove('hidden');

        document.getElementById('current-offered-price').textContent = this.currentFare;
        const container = document.getElementById('bids-container-list');
        container.innerHTML = '';

        // Pick random 3 drivers
        const shuffled = [...DRIVERS_DATABASE_POOL].sort(() => 0.5 - Math.random()).slice(0, 3);
        document.getElementById('available-bids-count').textContent = shuffled.length;

        shuffled.forEach(driver => {
            const finalBid = Math.max(15, this.currentFare + (Math.floor(Math.random() * 3) - 1) * 5);
            const card = document.createElement('div');
            card.className = 'bid-card';
            card.innerHTML = `
                <div class="driver-info">
                    <img src="${driver.img}" class="driver-img" alt="${driver.name}">
                    <div class="driver-details">
                        <h5>${driver.name}</h5>
                        <span class="rating">${driver.rating} • (${driver.trips} رحلة)</span>
                        <p class="car-details">${driver.car}</p>
                    </div>
                    <div class="bid-price">
                        <span class="price-val">${finalBid} <small>ج.م</small></span>
                    </div>
                </div>
                <div class="bid-actions">
                    <button class="btn-accept" data-id="${driver.id}" data-price="${finalBid}">قبول العرض</button>
                    <button class="btn-decline" onclick="this.closest('.bid-card').remove()">رفض</button>
                </div>
            `;

            card.querySelector('.btn-accept').addEventListener('click', () => {
                this.acceptDriverBid(driver, finalBid);
            });

            container.appendChild(card);
        });
    }

    acceptDriverBid(driver, price) {
        this.sound.playSuccess();
        this.voice.speak(`تم قبول عرض ${driver.name}`);

        // Add to trip history
        this.tripHistoryList.push({
            driver: driver.name,
            car: driver.car,
            price: price,
            from: this.pickupSelect.value,
            to: this.dropoffSelect.value,
            date: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        });

        this.stepBids.classList.add('hidden');
        this.stepTracking.classList.remove('hidden');

        document.getElementById('accepted-driver-details').innerHTML = `
            <div class="driver-info">
                <img src="${driver.img}" class="driver-img" alt="${driver.name}">
                <div class="driver-details">
                    <h5>${driver.name}</h5>
                    <p class="car-details">${driver.car}</p>
                    <strong style="color: var(--primary); font-size: 13px;">الأجرة المتفق عليها: ${price} ج.م</strong>
                </div>
            </div>
        `;

        this.startETACountdown(180);
    }

    startETACountdown(durationSeconds) {
        let timer = durationSeconds;
        const display = document.getElementById('eta-countdown');

        clearInterval(this.etaTimerInterval);
        this.etaTimerInterval = setInterval(() => {
            const mins = String(Math.floor(timer / 60)).padStart(2, '0');
            const secs = String(timer % 60).padStart(2, '0');
            display.textContent = `${mins}:${secs}`;

            if (--timer < 0) {
                clearInterval(this.etaTimerInterval);
                display.textContent = "وصل الكابتن!";
                this.voice.speak("وصل الكابتن إلى موقعك");
            }
        }, 1000);
    }

    cancelActiveTrip() {
        this.sound.playClick();
        clearInterval(this.etaTimerInterval);
        this.stepTracking.classList.add('hidden');
        this.stepRequest.classList.remove('hidden');
    }

    renderHistory() {
        const target = document.getElementById('trip-history-render-target');
        if (this.tripHistoryList.length === 0) {
            target.innerHTML = '<p style="color: var(--text-sub); text-align: center;">لا توجد رحلات سابقة حتى الآن.</p>';
            return;
        }

        target.innerHTML = this.tripHistoryList.map(trip => `
            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; margin-bottom: 10px; border-right: 3px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 4px;">
                    <span>${trip.driver}</span>
                    <span style="color: var(--primary);">${trip.price} ج.م</span>
                </div>
                <div style="font-size: 12px; color: var(--text-sub);">${trip.from} ➔ ${trip.to}</div>
                <div style="font-size: 10px; color: #888; margin-top: 4px;">الساعة: ${trip.date}</div>
            </div>
        `).join('');
    }
}

// Instantiate and start app context on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    window.InDriveApp = new InDriveAppCore();
});