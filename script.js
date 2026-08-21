/* ==========================================================================
   INDRIVE ENTERPRISE COMPLETE JAVASCRIPT ENGINE
   ========================================================================== */

/**
 * 1. Global Geolocation & Egyptian Governorates Database
 */
const EGYPT_MAP_DATA = {
    cairo: {
        center: [30.0444, 31.2357],
        locations: {
            "ميدان التحرير، وسط البلد": [30.0444, 31.2357],
            "شارع عباس العقاد، مدينة نصر": [30.0561, 31.3301],
            "شارع الأهرام، مصر الجديدة": [30.0910, 31.3230],
            "شارع التسعين، التجمع الخامس": [30.0074, 31.4290],
            "شارع جامعة الدول، المهندسين": [30.0511, 31.1990],
            "ميدان الحصري، 6 أكتوبر": [29.9723, 30.9496]
        }
    },
    alex: {
        center: [31.2001, 29.8997],
        locations: {
            "محطة الرمل، وسط البلد": [31.2001, 29.8997],
            "سيدي بشر، شارع خالد بن الوليد": [31.2642, 30.0028],
            "ميدان سموحة الرئيسي": [31.2155, 29.9553],
            "شارع إسكندر إبراهيم، ميامي": [31.2683, 30.0105],
            "سان ستيفانو جراند بلازا": [31.2450, 29.9660]
        }
    },
    mansoura: {
        center: [31.0409, 31.3785],
        locations: {
            "المشاية السفلية، النيل": [31.0409, 31.3785],
            "حي الجامعة الرئيسي": [31.0450, 31.3620]
        }
    },
    tanta: {
        center: [30.7865, 31.0004],
        locations: {
            "شارع الجيش (البحر)": [30.7865, 31.0004],
            "ميدان السيد البدوي": [30.7880, 30.9980]
        }
    },
    asyut: {
        center: [27.1783, 31.1859],
        locations: {
            "شارع النميس، أسيوط": [27.1783, 31.1859],
            "جامعة أسيوط": [27.1890, 31.1710]
        }
    },
    ismailia: { center: [30.5965, 32.2715], locations: { "شارع محمد علي": [30.5965, 32.2715] } },
    zagazig: { center: [30.5877, 31.5020], locations: { "شارع القومية": [30.5877, 31.5020] } },
    suez: { center: [29.9668, 32.5498], locations: { "شارع الجيش، السويس": [29.9668, 32.5498] } }
};

const DRIVER_MOCK_POOL = [
    { id: 101, name: "كابتن/ أحمد محمود", rating: "4.95 ★", car: "تويوتا كورولا • أبيض", img: "https://i.pravatar.cc/100?img=11" },
    { id: 102, name: "كابتن/ محمد السيد", rating: "4.88 ★", car: "نيسان صني • أسود", img: "https://i.pravatar.cc/100?img=12" },
    { id: 103, name: "كابتن/ محمود حسن", rating: "4.79 ★", car: "هيونداي إلانتيرا • فضي", img: "https://i.pravatar.cc/100?img=13" }
];

/**
 * 2. Sound & Speech Synthesis Subsystem
 */
class NotificationEngine {
    constructor() {
        this.speechEnabled = true;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playClickSound() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.frequency.setValueAtTime(450, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.06);
    }

    speak(text) {
        if (!this.speechEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ar-SA';
        window.speechSynthesis.speak(msg);
    }
}

/**
 * 3. Interactive Map Core Integration Engine
 */
class MapCore {
    constructor(mapId) {
        this.map = L.map(mapId, { zoomControl: false });
        this.tileLayer = null;
        this.pickupMarker = null;
        this.dropoffMarker = null;
        this.routeLine = null;
        this.isDark = true;
    }

    init(centerCoords) {
        this.map.setView(centerCoords, 13);
        this.applyTileStyle(true);

        this.pickupMarker = L.marker(centerCoords, { draggable: true }).addTo(this.map);
        this.dropoffMarker = L.marker([centerCoords[0] + 0.015, centerCoords[1] + 0.015], { draggable: true }).addTo(this.map);
        
        this.routeLine = L.polyline([], { color: '#00e676', weight: 5, dashArray: '8, 8' }).addTo(this.map);
    }

    applyTileStyle(isDark) {
        this.isDark = isDark;
        if (this.tileLayer) this.map.removeLayer(this.tileLayer);
        const url = isDark 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.tileLayer = L.tileLayer(url, { maxZoom: 19 }).addTo(this.map);
    }

    updateRoute(pCoords, dCoords) {
        if (pCoords) this.pickupMarker.setLatLng(pCoords);
        if (dCoords) this.dropoffMarker.setLatLng(dCoords);

        const p = this.pickupMarker.getLatLng();
        const d = this.dropoffMarker.getLatLng();
        this.routeLine.setLatLngs([p, d]);

        return (p.distanceTo(d) / 1000).toFixed(2);
    }
}

/**
 * 4. Main Application Orchestration Engine
 */
class AppController {
    constructor() {
        this.notifier = new NotificationEngine();
        this.mapCore = new MapCore('real-map');
        this.currentGov = 'alex';
        this.selectedVehicle = 'economy';
        this.currentFare = 50;
        this.searchTimer = null;
        this.historyData = JSON.parse(localStorage.getItem('indrive_history') || '[]');

        this.init();
    }

    init() {
        this.mapCore.init(EGYPT_MAP_DATA[this.currentGov].center);
        this.bindEvents();
        this.loadCityData(this.currentGov);
    }

    bindEvents() {
        // Dark & Light Mode Toggle
        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            this.notifier.playClickSound();
            document.body.classList.toggle('dark-theme');
            document.body.classList.toggle('light-theme');
            this.mapCore.applyTileStyle(!this.mapCore.isDark);
        });

        // Speech Alert Controls Toggle
        document.getElementById('voice-toggle-btn').addEventListener('click', (e) => {
            this.notifier.playClickSound();
            this.notifier.speechEnabled = !this.notifier.speechEnabled;
            e.currentTarget.classList.toggle('active');
        });

        // City Selector Dropdown Event
        document.getElementById('governorate-selector').addEventListener('change', (e) => {
            this.notifier.playClickSound();
            this.loadCityData(e.target.value);
        });

        // Location Swap Action Trigger
        document.getElementById('swap-locations-btn').addEventListener('click', () => {
            this.notifier.playClickSound();
            const p = document.getElementById('pickup-select');
            const d = document.getElementById('dropoff-select');
            const temp = p.value;
            p.value = d.value;
            d.value = temp;
            this.recalculateFare();
        });

        // Vehicle Option Card Selection
        document.querySelectorAll('.vehicle-option-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.notifier.playClickSound();
                document.querySelectorAll('.vehicle-option-card').forEach(c => c.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                this.selectedVehicle = target.dataset.type;
                this.recalculateFare();
            });
        });

        // Fare Counter Bidding Buttons
        document.getElementById('fare-plus-btn').addEventListener('click', () => {
            this.notifier.playClickSound();
            this.currentFare += 5;
            document.getElementById('fare-amount-display').textContent = this.currentFare;
        });

        document.getElementById('fare-minus-btn').addEventListener('click', () => {
            if (this.currentFare > 15) {
                this.notifier.playClickSound();
                this.currentFare -= 5;
                document.getElementById('fare-amount-display').textContent = this.currentFare;
            }
        });

        // Workflow Search Triggers
        document.getElementById('start-search-btn').addEventListener('click', () => this.startSearch());
        document.getElementById('cancel-search-btn').addEventListener('click', () => this.cancelSearch());

        // Live Chat Message Send Handler
        document.getElementById('send-chat-btn').addEventListener('click', () => this.sendChatMessage());

        // Modals Toggle Handlers
        this.setupModalControls('history-modal-btn', 'close-history-modal', 'history-modal-view', () => this.renderHistory());
        this.setupModalControls('profile-modal-btn', 'close-profile-modal', 'profile-modal-view');
        this.setupModalControls('wallet-modal-btn', 'close-wallet-modal', 'wallet-modal-view');
    }

    setupModalControls(btnId, closeBtnId, modalId, onOpenCallback) {
        document.getElementById(btnId).addEventListener('click', () => {
            this.notifier.playClickSound();
            document.getElementById(modalId).classList.remove('hidden');
            if (onOpenCallback) onOpenCallback();
        });

        document.getElementById(closeBtnId).addEventListener('click', () => {
            document.getElementById(modalId).classList.add('hidden');
        });
    }

    loadCityData(cityKey) {
        this.currentGov = cityKey;
        const data = EGYPT_MAP_DATA[cityKey];
        this.mapCore.map.setView(data.center, 13);

        const pickup = document.getElementById('pickup-select');
        const dropoff = document.getElementById('dropoff-select');
        pickup.innerHTML = '';
        dropoff.innerHTML = '';

        Object.keys(data.locations).forEach(loc => {
            pickup.add(new Option(loc, loc));
            dropoff.add(new Option(loc, loc));
        });

        pickup.selectedIndex = 0;
        dropoff.selectedIndex = 1;
        this.recalculateFare();
    }

    recalculateFare() {
        const locs = EGYPT_MAP_DATA[this.currentGov].locations;
        const p = locs[document.getElementById('pickup-select').value];
        const d = locs[document.getElementById('dropoff-select').value];
        
        const dist = this.mapCore.updateRoute(p, d);
        let baseRate = 8;
        if (this.selectedVehicle === 'comfort') baseRate = 12;
        if (this.selectedVehicle === 'bike') baseRate = 5;

        this.currentFare = Math.max(15, Math.round(dist * baseRate + 15));
        document.getElementById('fare-amount-display').textContent = this.currentFare;
    }

    startSearch() {
        this.notifier.playClickSound();
        this.notifier.speak("جاري البحث عن كابتن قريب وسائقي المنطقة");

        document.getElementById('search-offered-fare').textContent = `${this.currentFare} ج.م`;
        document.getElementById('step-request').classList.add('hidden');
        document.getElementById('step-searching').classList.remove('hidden');

        const fill = document.getElementById('search-progress-fill');
        fill.style.width = '0%';
        setTimeout(() => fill.style.width = '100%', 100);

        this.searchTimer = setTimeout(() => {
            this.showBids();
        }, 3200);
    }

    cancelSearch() {
        clearTimeout(this.searchTimer);
        document.getElementById('step-searching').classList.add('hidden');
        document.getElementById('step-request').classList.remove('hidden');
    }

    showBids() {
        this.notifier.speak("وصلتك عروض مقترحة من السائقين");
        document.getElementById('step-searching').classList.add('hidden');
        document.getElementById('step-bids').classList.remove('hidden');
        document.getElementById('current-offered-price').textContent = this.currentFare;

        const list = document.getElementById('bids-container-list');
        list.innerHTML = '';

        DRIVER_MOCK_POOL.forEach(driver => {
            const card = document.createElement('div');
            card.className = 'bid-card-item';
            card.innerHTML = `
                <div class="driver-meta-row">
                    <img src="${driver.img}" class="driver-avatar-thumb" />
                    <div class="driver-info-box">
                        <h5>${driver.name}</h5>
                        <span class="driver-rating-tag">${driver.rating}</span>
                        <p class="driver-vehicle-tag">${driver.car}</p>
                    </div>
                    <div class="bid-price-display">
                        <span class="amount">${this.currentFare} <small style="font-size:10px">ج.م</small></span>
                    </div>
                </div>
                <div class="bid-action-buttons">
                    <button class="accept-bid-btn">قبول العرض</button>
                    <button class="decline-bid-btn" onclick="this.closest('.bid-card-item').remove()">رفض</button>
                </div>
            `;
            card.querySelector('.accept-bid-btn').addEventListener('click', () => this.acceptBid(driver));
            list.appendChild(card);
        });
    }

    acceptBid(driver) {
        this.notifier.speak(`تم قبول عرض ${driver.name}. الكابتن في الطريق إليك`);
        
        this.historyData.push({
            driver: driver.name,
            price: this.currentFare,
            from: document.getElementById('pickup-select').value,
            to: document.getElementById('dropoff-select').value,
            date: new Date().toLocaleDateString('ar-EG')
        });
        localStorage.setItem('indrive_history', JSON.stringify(this.historyData));

        document.getElementById('step-bids').classList.add('hidden');
        document.getElementById('step-tracking').classList.remove('hidden');

        document.getElementById('accepted-driver-details').innerHTML = `
            <div class="driver-meta-row">
                <img src="${driver.img}" class="driver-avatar-thumb" />
                <div class="driver-info-box">
                    <h5>${driver.name}</h5>
                    <p class="driver-vehicle-tag">${driver.car}</p>
                    <span class="driver-rating-tag">${driver.rating}</span>
                </div>
            </div>
        `;
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input-field');
        if (!input.value.trim()) return;

        const box = document.getElementById('chat-messages-box');
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-bubble user';
        userMsg.textContent = input.value;
        box.appendChild(userMsg);

        input.value = '';
        box.scrollTop = box.scrollHeight;
    }

    renderHistory() {
        const target = document.getElementById('trip-history-render-target');
        if (this.historyData.length === 0) {
            target.innerHTML = '<p class="empty-state-text">لا توجد رحلات مسجلة حتى الآن.</p>';
            return;
        }

        target.innerHTML = this.historyData.map(item => `
            <div style="background: var(--bg-input); padding: 12px; border-radius: 10px; margin-bottom: 10px; border: 1px solid var(--border-color);">
                <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
                    <strong style="color: var(--primary); font-size:13px;">${item.driver}</strong>
                    <strong style="font-size:13px;">${item.price} ج.م</strong>
                </div>
                <p style="font-size: 11px; color: var(--text-sub);">${item.from} ➔ ${item.to}</p>
                <small style="font-size: 9px; color: var(--text-sub);">${item.date}</small>
            </div>
        `).join('');
    }
}

// Initialize Application Lifecycle
document.addEventListener('DOMContentLoaded', () => {
    window.appContext = new AppController();
});