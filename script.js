/**
 * ==============================================================================
 * INDRIVE EGYPT ENTERPRISE APPLICATION ENGINE (v3.5.0)
 * ==============================================================================
 * Production-Grade Architecture for Ride-Hailing Platform Simulation
 * Built with vanilla JavaScript (ES6+ Strict Mode)
 * Includes: GPS Tracking Engine, Real-time Bidding Radar, Offline Storage,
 * System Sound Effects, Dynamic Map Tiles, and Custom Notification Center.
 */

'use strict';

// ==============================================================================
// 1. CONFIGURATION & CONSTANTS DATABASE
// ==============================================================================

const APP_CONFIG = Object.freeze({
    DEFAULT_CITY: 'alex',
    CURRENCY_SYMBOL: 'ج.م',
    REFRESH_INTERVAL_MS: 3000,
    MAX_BID_INCREMENT: 5,
    MIN_FARE_LIMIT: 10,
    SIMULATION_SPEED_MS: 1500,
    MAP_TILE_PROVIDER: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    MAP_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

const EGYPT_CITIES_DATABASE = Object.freeze({
    alex: {
        id: 'alex',
        name_ar: 'الإسكندرية',
        coords: [31.2001, 29.9187],
        defaultPickup: 'محطة الرمل، وسط البلد، الإسكندرية',
        defaultDropoff: 'سيدي بشر، شارع خالد بن الوليد',
        driversNearbyCount: 8,
        baseFareMultiplier: 1.0,
        hotspots: [
            { name: "محطة الرمل", coords: [31.2001, 29.9187] },
            { name: "سيدي بشر", coords: [31.2500, 30.0000] },
            { name: "سموحة", coords: [31.2150, 29.9550] },
            { name: "المنتزه", coords: [31.2880, 30.0150] }
        ]
    },
    cairo: {
        id: 'cairo',
        name_ar: 'القاهرة الكبرى',
        coords: [30.0444, 31.2357],
        defaultPickup: 'ميدان التحرير، وسط البلد، القاهرة',
        defaultDropoff: 'مدينة نصر، شارع مكرم عبيد',
        driversNearbyCount: 15,
        baseFareMultiplier: 1.25,
        hotspots: [
            { name: "ميدان التحرير", coords: [30.0444, 31.2357] },
            { name: "مدينة نصر", coords: [30.0561, 31.3301] },
            { name: "التجمع الخامس", coords: [30.0074, 31.4310] },
            { name: "المعادي", coords: [29.9602, 31.2569] }
        ]
    },
    giza: {
        id: 'giza',
        name_ar: 'الجيزة',
        coords: [30.0131, 31.2089],
        defaultPickup: 'ميدان الجيزة، بجوار محطة المترو',
        defaultDropoff: 'الشيخ زايد، مول العرب',
        driversNearbyCount: 10,
        baseFareMultiplier: 1.15,
        hotspots: [
            { name: "ميدان الجيزة", coords: [30.0131, 31.2089] },
            { name: "الشيخ زايد", coords: [30.0465, 30.9820] },
            { name: "الدقي", coords: [30.0381, 31.2120] },
            { name: "الهرم", coords: [29.9870, 31.1420] }
        ]
    },
    mansoura: {
        id: 'mansoura',
        name_ar: 'المنصورة',
        coords: [31.0409, 31.3785],
        defaultPickup: 'شارع المشاية السفلية، أمام الجامعة',
        defaultDropoff: 'حي الجامعة، الدائري',
        driversNearbyCount: 6,
        baseFareMultiplier: 0.9,
        hotspots: [
            { name: "المشاية السفلية", coords: [31.0409, 31.3785] },
            { name: "حي الجامعة", coords: [31.0350, 31.3620] },
            { name: "شارع قناة السويس", coords: [31.0480, 31.3900] }
        ]
    },
    tanta: {
        id: 'tanta',
        name_ar: 'طنطا',
        coords: [30.7865, 31.0004],
        defaultPickup: 'ميدان المحطة، وسط المدينة',
        defaultDropoff: 'شارع النادي، طنطا',
        driversNearbyCount: 5,
        baseFareMultiplier: 0.85,
        hotspots: [
            { name: "ميدان المحطة", coords: [30.7865, 31.0004] },
            { name: "شارع النادي", coords: [30.7950, 31.0080] }
        ]
    },
    asyut: {
        id: 'asyut',
        name_ar: 'أسيوط',
        coords: [27.1783, 31.1859],
        defaultPickup: 'ميدان المحافظة، أسيوط',
        defaultDropoff: 'جامعة أسيوط، البوابة الرئيسية',
        driversNearbyCount: 4,
        baseFareMultiplier: 0.8,
        hotspots: [
            { name: "ميدان المحافظة", coords: [27.1783, 31.1859] },
            { name: "جامعة أسيوط", coords: [27.1850, 31.1710] }
        ]
    }
});

const VEHICLE_CATEGORIES = Object.freeze([
    { id: 'moto', name: 'موتوسيكل', basePrice: 18, eta: '1-3 دقائق', badge: 'سريع جداً', icon: 'fa-motorcycle' },
    { id: 'economy', name: 'توفير', basePrice: 35, eta: '3-5 دقائق', badge: 'الأكثر طلباً', icon: 'fa-car' },
    { id: 'comfort', name: 'راحة', basePrice: 60, eta: '2-4 دقائق', badge: '', icon: 'fa-car-side' },
    { id: 'travel', name: 'سفر', basePrice: 150, eta: 'بين المدن', badge: '', icon: 'fa-route' },
    { id: 'delivery', name: 'شحن طرود', basePrice: 25, eta: 'توصيل سريع', badge: '', icon: 'fa-box-open' },
    { id: 'truck', name: 'شحن ثقيل', basePrice: 200, eta: 'نقل بضائع', badge: '', icon: 'fa-truck-ramp-box' }
]);

const DRIVER_SIMULATION_POOL = Object.freeze([
    {
        id: 'drv_101',
        name: 'أحمد محمود العبد',
        rating: 4.9,
        tripsCount: 1240,
        vehicleModel: 'شيفروليه أفيو - أبيض',
        plateNumber: 'أ ب ج 1234',
        phone: '01012345678',
        avatarIcon: 'fa-user'
    },
    {
        id: 'drv_102',
        name: 'محمد علي السيد',
        rating: 4.8,
        tripsCount: 850,
        vehicleModel: 'نيسان صني - أسود',
        plateNumber: 'س ص ع 5678',
        phone: '01198765432',
        avatarIcon: 'fa-user-tie'
    },
    {
        id: 'drv_103',
        name: 'حسن السيد عبد الوهاب',
        rating: 4.95,
        tripsCount: 2100,
        vehicleModel: 'هيونداي فيرنا - فضي',
        plateNumber: 'ر ط ي 9012',
        phone: '01234567890',
        avatarIcon: 'fa-id-badge'
    },
    {
        id: 'drv_104',
        name: 'محمود كمال النجار',
        rating: 4.75,
        tripsCount: 620,
        vehicleModel: 'تويوتا كورولا - كحلي',
        plateNumber: 'ط د س 4321',
        phone: '01551234567',
        avatarIcon: 'fa-user-gear'
    },
    {
        id: 'drv_105',
        name: 'إبراهيم مصطفى الفقي',
        rating: 4.88,
        tripsCount: 1430,
        vehicleModel: 'كيا سيراتو - أحمر',
        plateNumber: 'م ن هـ 8765',
        phone: '01099887766',
        avatarIcon: 'fa-user-check'
    }
]);

// ==============================================================================
// 2. AUDIO & SOUND EFFECTS ENGINE
// ==============================================================================

class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    initCtx() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    }

    playBeep(freq = 440, type = 'sine', duration = 0.15) {
        try {
            this.initCtx();
            if (!this.ctx) return;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("AudioContext playback muted by browser security policy.", e);
        }
    }

    playSuccessSound() {
        this.playBeep(523.25, 'sine', 0.1);
        setTimeout(() => this.playBeep(659.25, 'sine', 0.15), 100);
        setTimeout(() => this.playBeep(783.99, 'sine', 0.25), 200);
    }

    playNotificationSound() {
        this.playBeep(880, 'triangle', 0.08);
        setTimeout(() => this.playBeep(1174.66, 'triangle', 0.12), 90);
    }

    playClickSound() {
        this.playBeep(300, 'sine', 0.05);
    }
}

// ==============================================================================
// 3. STORAGE MANAGER (LOCAL STORAGE WRAPPER)
// ==============================================================================

class StorageManager {
    static STORAGE_KEY_PREFIX = 'indrive_egypt_';

    static setItem(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(this.STORAGE_KEY_PREFIX + key, serialized);
        } catch (err) {
            console.error("StorageManager Error saving key:", key, err);
        }
    }

    static getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.STORAGE_KEY_PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (err) {
            console.error("StorageManager Error reading key:", key, err);
            return defaultValue;
        }
    }

    static removeItem(key) {
        localStorage.removeItem(this.STORAGE_KEY_PREFIX + key);
    }

    static clearAllHistory() {
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(this.STORAGE_KEY_PREFIX)) {
                localStorage.removeItem(k);
            }
        });
    }
}

// ==============================================================================
// 4. LEAFLET GEOGRAPHIC MAP CONTROLLER ENGINE
// ==============================================================================

class MapEngine {
    constructor(containerId, initialCity) {
        this.containerId = containerId;
        this.currentCity = initialCity;
        this.map = null;
        this.pickupMarker = null;
        this.dropoffMarker = null;
        this.routeLine = null;
        this.driverMarkers = [];
        this.activeDriverMarker = null;

        this.initMap();
    }

    initMap() {
        const cityData = EGYPT_CITIES_DATABASE[this.currentCity];
        
        this.map = L.map(this.containerId, {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true
        }).setView(cityData.coords, 14);

        L.tileLayer(APP_CONFIG.MAP_TILE_PROVIDER, {
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(this.map);

        this.setupCustomIconStyles();
        this.setupInitialMarkers(cityData);
    }

    setupCustomIconStyles() {
        this.pickupIcon = L.divIcon({
            className: 'custom-map-pin pickup-pin',
            html: `<div class="pin-inner pulse-green"><i class="fa-solid fa-location-dot"></i></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        this.dropoffIcon = L.divIcon({
            className: 'custom-map-pin dropoff-pin',
            html: `<div class="pin-inner pulse-red"><i class="fa-solid fa-flag-checkered"></i></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        this.driverIcon = L.divIcon({
            className: 'custom-map-pin driver-pin',
            html: `<div class="car-pin-inner"><i class="fa-solid fa-car-side"></i></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
    }

    setupInitialMarkers(cityData) {
        const pickupCoords = cityData.coords;
        const dropoffCoords = [cityData.coords[0] + 0.025, cityData.coords[1] + 0.025];

        this.pickupMarker = L.marker(pickupCoords, { icon: this.pickupIcon, draggable: true }).addTo(this.map);
        this.dropoffMarker = L.marker(dropoffCoords, { icon: this.dropoffIcon, draggable: true }).addTo(this.map);

        this.pickupMarker.bindPopup("<b>نقطة الانطلاق</b><br>انقل الدبوس لتغيير الموقع").openPopup();
        this.dropoffMarker.bindPopup("<b>وجهة الوصول</b>");

        this.drawRoute(pickupCoords, dropoffCoords);
        this.spawnRandomNearbyDrivers(pickupCoords);

        // Marker Drag Events
        this.pickupMarker.on('dragend', (e) => {
            const newPos = e.target.getLatLng();
            this.updateRouteFromMarkers();
        });

        this.dropoffMarker.on('dragend', (e) => {
            const newPos = e.target.getLatLng();
            this.updateRouteFromMarkers();
        });
    }

    drawRoute(start, end) {
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }

        this.routeLine = L.polyline([start, end], {
            color: '#00e676',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10',
            lineCap: 'round'
        }).addTo(this.map);

        this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
    }

    updateRouteFromMarkers() {
        const p1 = this.pickupMarker.getLatLng();
        const p2 = this.dropoffMarker.getLatLng();
        this.drawRoute([p1.lat, p1.lng], [p2.lat, p2.lng]);
    }

    switchCity(cityKey) {
        if (!EGYPT_CITIES_DATABASE[cityKey]) return;
        this.currentCity = cityKey;
        const cityData = EGYPT_CITIES_DATABASE[cityKey];

        this.map.flyTo(cityData.coords, 14, { duration: 1.8 });

        const pickupCoords = cityData.coords;
        const dropoffCoords = [cityData.coords[0] + 0.025, cityData.coords[1] + 0.025];

        this.pickupMarker.setLatLng(pickupCoords);
        this.dropoffMarker.setLatLng(dropoffCoords);

        this.drawRoute(pickupCoords, dropoffCoords);
        this.clearDriverMarkers();
        this.spawnRandomNearbyDrivers(pickupCoords);
    }

    clearDriverMarkers() {
        this.driverMarkers.forEach(m => this.map.removeLayer(m));
        this.driverMarkers = [];
    }

    spawnRandomNearbyDrivers(centerCoords) {
        this.clearDriverMarkers();
        const count = EGYPT_CITIES_DATABASE[this.currentCity].driversNearbyCount;

        for (let i = 0; i < count; i++) {
            const latOffset = (Math.random() - 0.5) * 0.03;
            const lngOffset = (Math.random() - 0.5) * 0.03;
            const driverPos = [centerCoords[0] + latOffset, centerCoords[1] + lngOffset];

            const marker = L.marker(driverPos, { icon: this.driverIcon }).addTo(this.map);
            this.driverMarkers.push(marker);
        }
    }

    animateActiveDriverToPickup(callback) {
        if (this.driverMarkers.length === 0) return;

        const driverMarker = this.driverMarkers[0];
        const targetLatLng = this.pickupMarker.getLatLng();
        const startLatLng = driverMarker.getLatLng();

        let steps = 30;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const lat = startLatLng.lat + (targetLatLng.lat - startLatLng.lat) * (currentStep / steps);
            const lng = startLatLng.lng + (targetLatLng.lng - startLatLng.lng) * (currentStep / steps);

            driverMarker.setLatLng([lat, lng]);

            if (currentStep >= steps) {
                clearInterval(interval);
                if (typeof callback === 'function') callback();
            }
        }, 300);
    }

    recenterMap() {
        const p1 = this.pickupMarker.getLatLng();
        const p2 = this.dropoffMarker.getLatLng();
        const bounds = L.latLngBounds([p1, p2]);
        this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
}

// ==============================================================================
// 5. BIDDING & OFFER SIMULATOR ENGINE
// ==============================================================================

class BiddingEngine {
    constructor(soundEngine) {
        this.soundEngine = soundEngine;
        this.activeOffers = [];
        this.timerInstance = null;
    }

    generateOffersForUserBid(userBidAmount, selectedVehicle) {
        this.activeOffers = [];
        const basePool = DRIVER_SIMULATION_POOL.slice(0, 3);

        basePool.forEach((driverData, index) => {
            let variance = 0;
            if (index === 0) variance = 0; 
            else if (index === 1) variance = 5; 
            else variance = 3; 

            const calculatedPrice = userBidAmount + variance;

            this.activeOffers.push({
                offerId: 'off_' + Math.random().toString(36).substring(2, 9),
                driver: driverData,
                price: calculatedPrice,
                etaMinutes: (index + 1) * 2,
                timeCreated: new Date()
            });
        });

        return this.activeOffers;
    }

    startRealtimeBiddingFeed(containerEl, userBidAmount, onAcceptCallback) {
        containerEl.innerHTML = '';
        const offers = this.generateOffersForUserBid(userBidAmount);

        offers.forEach((offer, idx) => {
            setTimeout(() => {
                const cardHTML = this.createOfferCardElement(offer, onAcceptCallback);
                containerEl.appendChild(cardHTML);
                this.soundEngine.playNotificationSound();
            }, (idx + 1) * 1200);
        });
    }

    createOfferCardElement(offer, onAcceptCallback) {
        const card = document.createElement('div');
        card.className = 'driver-offer-card animated-fade-in';
        card.setAttribute('data-offer-id', offer.offerId);

        card.innerHTML = `
            <div class="driver-info-meta">
                <div class="driver-avatar-circle">
                    <i class="fa-solid ${offer.driver.avatarIcon}"></i>
                </div>
                <div class="driver-details">
                    <span class="driver-name">الكابتن / ${offer.driver.name}</span>
                    <div class="driver-rating-row">
                        <i class="fa-solid fa-star star-icon"></i>
                        <span class="rating-val">${offer.driver.rating}</span>
                        <span class="trips-count">(${offer.driver.tripsCount} رحلة مكتملة)</span>
                    </div>
                    <span class="driver-vehicle-info">${offer.driver.vehicleModel} | (${offer.driver.plateNumber})</span>
                    <span class="driver-distance-eta"><i class="fa-solid fa-clock"></i> يبعد ${offer.etaMinutes} دقائق عنك</span>
                </div>
                <div class="offer-price-tag">
                    <span>${offer.price}</span>
                    <span class="curr">${APP_CONFIG.CURRENCY_SYMBOL}</span>
                </div>
            </div>
            <div class="offer-action-buttons">
                <button type="button" class="accept-bid-btn">قبول العرض</button>
                <button type="button" class="decline-bid-btn">رفض</button>
            </div>
        `;

        const acceptBtn = card.querySelector('.accept-bid-btn');
        const declineBtn = card.querySelector('.decline-bid-btn');

        acceptBtn.addEventListener('click', () => {
            onAcceptCallback(offer);
        });

        declineBtn.addEventListener('click', () => {
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 250);
        });

        return card;
    }
}

// ==============================================================================
// 6. MAIN APPLICATION MASTER CONTROLLER
// ==============================================================================

class InDriveApplicationController {
    constructor() {
        this.soundEngine = new SoundEngine();
        this.mapEngine = null;
        this.biddingEngine = new BiddingEngine(this.soundEngine);

        // Application State Data
        this.state = {
            currentCity: APP_CONFIG.DEFAULT_CITY,
            selectedVehicle: 'economy',
            userProposedBid: 35,
            selectedPaymentMethod: 'cash',
            tripComment: '',
            activeWorkflowStep: 1,
            activeTripData: null,
            chatMessagesHistory: [
                { sender: 'driver', text: 'أهلاً بك يا فندم، أنا في طريقي إليك حالياً.' }
            ]
        };

        // DOM Element Registry
        this.dom = {};
    }

    init() {
        console.log("InDrive Egypt Platform Initializing...");
        this.cacheDomElements();
        this.restoreStateFromStorage();
        this.initMapEngine();
        this.bindUserEvents();
        this.renderInitialUI();
        console.log("InDrive Engine Ready.");
    }

    cacheDomElements() {
        this.dom.citySelect = document.getElementById('citySelect');
        this.dom.pickupInput = document.getElementById('pickupInput');
        this.dom.dropoffInput = document.getElementById('dropoffInput');
        this.dom.clearPickupBtn = document.getElementById('clearPickupBtn');
        this.dom.clearDropoffBtn = document.getElementById('clearDropoffBtn');
        this.dom.swapLocationsBtn = document.getElementById('swapLocationsBtn');
        
        this.dom.vehicleCards = document.querySelectorAll('.vehicle-option-card');
        this.dom.bidAmountEl = document.getElementById('bidAmount');
        this.dom.increaseBidBtn = document.getElementById('increaseBidBtn');
        this.dom.decreaseBidBtn = document.getElementById('decreaseBidBtn');

        this.dom.paymentMethodBtn = document.getElementById('paymentMethodBtn');
        this.dom.selectedPaymentText = document.getElementById('selectedPaymentText');
        this.dom.rideCommentsBtn = document.getElementById('rideCommentsBtn');
        this.dom.selectedCommentText = document.getElementById('selectedCommentText');

        this.dom.requestRideBtn = document.getElementById('requestRideBtn');
        this.dom.cancelSearchBtn = document.getElementById('cancelSearchBtn');
        this.dom.cancelTripBtn = document.getElementById('cancelTripBtn');

        this.dom.step1 = document.getElementById('step1');
        this.dom.step2 = document.getElementById('step2');
        this.dom.step3 = document.getElementById('step3');

        this.dom.driverBidsContainer = document.getElementById('driverBidsContainer');
        
        this.dom.acceptedDriverName = document.getElementById('acceptedDriverName');
        this.dom.acceptedVehicleInfo = document.getElementById('acceptedVehicleInfo');
        this.dom.acceptedFareBadge = document.getElementById('acceptedFareBadge');
        this.dom.tripProgressBar = document.getElementById('tripProgressBar');
        this.dom.activeStatusText = document.getElementById('activeStatusText');

        this.dom.callDriverBtn = document.getElementById('callDriverBtn');
        this.dom.chatDriverBtn = document.getElementById('chatDriverBtn');
        this.dom.shareTripBtn = document.getElementById('shareTripBtn');

        // Modals DOM
        this.dom.modalBackdrop = document.getElementById('modalBackdrop');
        this.dom.paymentModal = document.getElementById('paymentModal');
        this.dom.commentsModal = document.getElementById('commentsModal');
        this.dom.chatModal = document.getElementById('chatModal');
        
        this.dom.tripCommentInput = document.getElementById('tripCommentInput');
        this.dom.saveCommentBtn = document.getElementById('saveCommentBtn');
        
        this.dom.chatMessagesBox = document.getElementById('chatMessagesBox');
        this.dom.chatInputField = document.getElementById('chatInputField');
        this.dom.sendChatMsgBtn = document.getElementById('sendChatMsgBtn');

        this.dom.recenterBtn = document.getElementById('recenterBtn');
    }

    restoreStateFromStorage() {
        const savedState = StorageManager.getItem('app_state');
        if (savedState) {
            this.state.currentCity = savedState.currentCity || APP_CONFIG.DEFAULT_CITY;
            this.state.selectedVehicle = savedState.selectedVehicle || 'economy';
            this.state.userProposedBid = savedState.userProposedBid || 35;
        }
    }

    saveStateToStorage() {
        StorageManager.setItem('app_state', {
            currentCity: this.state.currentCity,
            selectedVehicle: this.state.selectedVehicle,
            userProposedBid: this.state.userProposedBid
        });
    }

    initMapEngine() {
        this.mapEngine = new MapEngine('map', this.state.currentCity);
    }

    bindUserEvents() {
        // City Switching
        if (this.dom.citySelect) {
            this.dom.citySelect.addEventListener('change', (e) => this.handleCityChange(e.target.value));
        }

        // Location Swap
        if (this.dom.swapLocationsBtn) {
            this.dom.swapLocationsBtn.addEventListener('click', () => this.handleLocationSwap());
        }

        // Clear Inputs
        if (this.dom.clearPickupBtn) {
            this.dom.clearPickupBtn.addEventListener('click', () => {
                this.dom.pickupInput.value = '';
                this.dom.pickupInput.focus();
            });
        }

        if (this.dom.clearDropoffBtn) {
            this.dom.clearDropoffBtn.addEventListener('click', () => {
                this.dom.dropoffInput.value = '';
                this.dom.dropoffInput.focus();
            });
        }

        // Vehicle Category Selection
        this.dom.vehicleCards.forEach(card => {
            card.addEventListener('click', () => this.handleVehicleSelection(card));
        });

        // Bidding Adjustments
        if (this.dom.increaseBidBtn) {
            this.dom.increaseBidBtn.addEventListener('click', () => this.adjustBidAmount(APP_CONFIG.MAX_BID_INCREMENT));
        }

        if (this.dom.decreaseBidBtn) {
            this.dom.decreaseBidBtn.addEventListener('click', () => this.adjustBidAmount(-APP_CONFIG.MAX_BID_INCREMENT));
        }

        // Workflow Navigation Buttons
        if (this.dom.requestRideBtn) {
            this.dom.requestRideBtn.addEventListener('click', () => this.transitionToStep2());
        }

        if (this.dom.cancelSearchBtn) {
            this.dom.cancelSearchBtn.addEventListener('click', () => this.transitionToStep1());
        }

        if (this.dom.cancelTripBtn) {
            this.dom.cancelTripBtn.addEventListener('click', () => this.handleTripCancellation());
        }

        // Modals Triggers
        if (this.dom.paymentMethodBtn) {
            this.dom.paymentMethodBtn.addEventListener('click', () => this.openModal(this.dom.paymentModal));
        }

        if (this.dom.rideCommentsBtn) {
            this.dom.rideCommentsBtn.addEventListener('click', () => this.openModal(this.dom.commentsModal));
        }

        if (this.dom.chatDriverBtn) {
            this.dom.chatDriverBtn.addEventListener('click', () => this.openModal(this.dom.chatModal));
        }

        if (this.dom.saveCommentBtn) {
            this.dom.saveCommentBtn.addEventListener('click', () => this.handleSaveComment());
        }

        if (this.dom.sendChatMsgBtn) {
            this.dom.sendChatMsgBtn.addEventListener('click', () => this.handleSendChatMessage());
        }

        if (this.dom.chatInputField) {
            this.dom.chatInputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSendChatMessage();
            });
        }

        // Modal Close Generic
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-close');
                const modalEl = document.getElementById(targetId);
                this.closeModal(modalEl);
            });
        });

        // Payment Items Select
        document.querySelectorAll('.modal-list-item').forEach(item => {
            item.addEventListener('click', () => this.handlePaymentMethodSelection(item));
        });

        // Driver Action Buttons
        if (this.dom.callDriverBtn) {
            this.dom.callDriverBtn.addEventListener('click', () => this.handleCallDriver());
        }

        if (this.dom.shareTripBtn) {
            this.dom.shareTripBtn.addEventListener('click', () => this.handleShareTrip());
        }

        // Recenter Map
        if (this.dom.recenterBtn) {
            this.dom.recenterBtn.addEventListener('click', () => {
                this.soundEngine.playClickSound();
                this.mapEngine.recenterMap();
            });
        }
    }

    renderInitialUI() {
        if (this.dom.citySelect) this.dom.citySelect.value = this.state.currentCity;
        const cityData = EGYPT_CITIES_DATABASE[this.state.currentCity];

        if (this.dom.pickupInput) this.dom.pickupInput.value = cityData.defaultPickup;
        if (this.dom.dropoffInput) this.dom.dropoffInput.value = cityData.defaultDropoff;

        this.updateBidDisplay();
    }

    handleCityChange(newCityKey) {
        if (!EGYPT_CITIES_DATABASE[newCityKey]) return;
        this.soundEngine.playClickSound();

        this.state.currentCity = newCityKey;
        const cityData = EGYPT_CITIES_DATABASE[newCityKey];

        this.dom.pickupInput.value = cityData.defaultPickup;
        this.dom.dropoffInput.value = cityData.defaultDropoff;

        this.mapEngine.switchCity(newCityKey);
        this.saveStateToStorage();
    }

    handleLocationSwap() {
        this.soundEngine.playClickSound();
        const temp = this.dom.pickupInput.value;
        this.dom.pickupInput.value = this.dom.dropoffInput.value;
        this.dom.dropoffInput.value = temp;

        const p1 = this.mapEngine.pickupMarker.getLatLng();
        const p2 = this.mapEngine.dropoffMarker.getLatLng();

        this.mapEngine.pickupMarker.setLatLng(p2);
        this.mapEngine.dropoffMarker.setLatLng(p1);
        this.mapEngine.drawRoute([p2.lat, p2.lng], [p1.lat, p1.lng]);
    }

    handleVehicleSelection(selectedCard) {
        this.soundEngine.playClickSound();

        this.dom.vehicleCards.forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-checked', 'false');
        });

        selectedCard.classList.add('active');
        selectedCard.setAttribute('aria-checked', 'true');

        this.state.selectedVehicle = selectedCard.getAttribute('data-vehicle');
        const defaultPrice = parseInt(selectedCard.getAttribute('data-price')) || 35;

        const multiplier = EGYPT_CITIES_DATABASE[this.state.currentCity].baseFareMultiplier;
        this.state.userProposedBid = Math.round(defaultPrice * multiplier);

        this.updateBidDisplay();
        this.saveStateToStorage();
    }

    adjustBidAmount(delta) {
        this.soundEngine.playClickSound();
        const newBid = this.state.userProposedBid + delta;

        if (newBid >= APP_CONFIG.MIN_FARE_LIMIT) {
            this.state.userProposedBid = newBid;
            this.updateBidDisplay();
            this.saveStateToStorage();
        }
    }

    updateBidDisplay() {
        if (this.dom.bidAmountEl) {
            this.dom.bidAmountEl.textContent = this.state.userProposedBid;
        }
    }

    transitionToStep1() {
        this.soundEngine.playClickSound();
        this.state.activeWorkflowStep = 1;

        this.dom.step2.classList.add('hidden');
        this.dom.step3.classList.add('hidden');
        this.dom.step1.classList.remove('hidden');
    }

    transitionToStep2() {
        this.soundEngine.playSuccessSound();
        this.state.activeWorkflowStep = 2;

        this.dom.step1.classList.add('hidden');
        this.dom.step2.classList.remove('hidden');

        this.biddingEngine.startRealtimeBiddingFeed(
            this.dom.driverBidsContainer,
            this.state.userProposedBid,
            (acceptedOffer) => this.handleAcceptDriverOffer(acceptedOffer)
        );
    }

    handleAcceptDriverOffer(offer) {
        this.soundEngine.playSuccessSound();
        this.state.activeTripData = offer;
        this.state.activeWorkflowStep = 3;

        this.dom.acceptedDriverName.textContent = `الكابتن / ${offer.driver.name}`;
        this.dom.acceptedVehicleInfo.textContent = `${offer.driver.vehicleModel} (${offer.driver.plateNumber})`;
        this.dom.acceptedFareBadge.textContent = `المبلغ المتفق عليه: ${offer.price} ${APP_CONFIG.CURRENCY_SYMBOL}`;

        this.dom.step2.classList.add('hidden');
        this.dom.step3.classList.remove('hidden');

        this.startTripAnimationAndProgress();
    }

    startTripAnimationAndProgress() {
        let progressPercent = 10;
        this.dom.tripProgressBar.style.width = `${progressPercent}%`;
        this.dom.activeStatusText.textContent = "السائق في طريقه لإقلالك...";

        this.mapEngine.animateActiveDriverToPickup(() => {
            this.dom.activeStatusText.textContent = "وصل السائق إلى موقعك الآن!";
            this.soundEngine.playNotificationSound();
        });

        const progressInterval = setInterval(() => {
            progressPercent += 20;
            if (progressPercent > 100) {
                clearInterval(progressInterval);
                this.dom.activeStatusText.textContent = "أنت الآن في الطريق إلى وجهتك.";
            } else {
                this.dom.tripProgressBar.style.width = `${progressPercent}%`;
            }
        }, APP_CONFIG.SIMULATION_SPEED_MS);
    }

    handleTripCancellation() {
        this.soundEngine.playClickSound();
        if (confirm("هل أنت تأكد من رغبتك في إلغاء الرحلة الحالية؟")) {
            this.state.activeTripData = null;
            this.transitionToStep1();
        }
    }

    openModal(modalEl) {
        this.soundEngine.playClickSound();
        this.dom.modalBackdrop.classList.remove('hidden');
        modalEl.classList.remove('hidden');
    }

    closeModal(modalEl) {
        this.soundEngine.playClickSound();
        modalEl.classList.add('hidden');
        this.dom.modalBackdrop.classList.add('hidden');
    }

    handlePaymentMethodSelection(itemEl) {
        this.soundEngine.playClickSound();

        document.querySelectorAll('.modal-list-item').forEach(i => i.classList.remove('active'));
        itemEl.classList.add('active');

        const paymentType = itemEl.getAttribute('data-payment');
        const paymentLabel = itemEl.querySelector('span').textContent;

        this.state.selectedPaymentMethod = paymentType;
        this.dom.selectedPaymentText.textContent = paymentLabel;

        this.closeModal(this.dom.paymentModal);
    }

    handleSaveComment() {
        this.soundEngine.playClickSound();
        const text = this.dom.tripCommentInput.value.trim();

        if (text !== '') {
            this.state.tripComment = text;
            this.dom.selectedCommentText.textContent = text;
        } else {
            this.dom.selectedCommentText.textContent = "تعليقات خاصة بالرحلة";
        }

        this.closeModal(this.dom.commentsModal);
    }

    handleSendChatMessage() {
        const text = this.dom.chatInputField.value.trim();
        if (text === '') return;

        this.soundEngine.playClickSound();

        const userMsgObj = { sender: 'user', text: text };
        this.state.chatMessagesHistory.push(userMsgObj);

        this.renderChatBubble(userMsgObj);
        this.dom.chatInputField.value = '';

        // Auto Driver Reply Simulator
        setTimeout(() => {
            const replies = [
                "تمام يا فندم وصلت.",
                "أنا دقيقة وأكون عند حضرتك.",
                "تم، جاري الاقتراب من الموقع المحدد."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const driverMsgObj = { sender: 'driver', text: randomReply };
            
            this.state.chatMessagesHistory.push(driverMsgObj);
            this.renderChatBubble(driverMsgObj);
            this.soundEngine.playNotificationSound();
        }, 1500);
    }

    renderChatBubble(msgObj) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msgObj.sender} animated-fade-in`;
        bubble.textContent = msgObj.text;

        this.dom.chatMessagesBox.appendChild(bubble);
        this.dom.chatMessagesBox.scrollTop = this.dom.chatMessagesBox.scrollHeight;
    }

    handleCallDriver() {
        this.soundEngine.playClickSound();
        if (this.state.activeTripData) {
            window.location.href = `tel:${this.state.activeTripData.driver.phone}`;
        } else {
            alert("لا توجد رحلة نشطة حالياً للاتصال بالسائق.");
        }
    }

    handleShareTrip() {
        this.soundEngine.playClickSound();
        if (navigator.share) {
            navigator.share({
                title: 'تتبع رحلتي على إنـدرايف مصر',
                text: 'يمكنك تتبع رحلتي المباشرة على الخريطة عبر منصة إنـدرايف.',
                url: window.location.href
            }).catch(() => {});
        } else {
            alert("تم نسخ رابط تتبع الرحلة المباشر لمرسلتها لأصدقائك.");
        }
    }
}

// ==============================================================================
// 7. APPLICATION BOOTSTRAP INITIALIZER
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.inDriveApp = new InDriveApplicationController();
    window.inDriveApp.init();
});