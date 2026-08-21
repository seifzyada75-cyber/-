/**
 * ============================================================================
 * IN-DRIVE EGYPT - MASTER ULTRA ENTERPRISE APPLICATION CONTROLLER (script.js)
 * Architecture: Full Modular Enterprise Vanilla JavaScript Engine + Night Mode
 * Version: 5.0.0-Ultimate-Edition
 * Date: 2026
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

    /* ======================================================================== */
    /* 1. APPLICATION STATE & GLOBAL CONFIGURATION OBJECTS                      */
    /* ======================================================================== */
    const EnterpriseState = {
        version: '5.0.0',
        environment: 'production',
        currentStep: 1,
        selectedCity: 'alex',
        isDarkMode: false,
        pickupLocation: {
            name: 'محطة الرمل، وسط البلد، الإسكندرية',
            lat: 31.2001,
            lng: 29.9187,
            zoneId: 'ALX-01'
        },
        dropoffLocation: {
            name: 'سيدي بشر، شارع خالد بن الوليد',
            lat: 31.2832,
            lng: 30.0124,
            zoneId: 'ALX-05'
        },
        selectedVehicle: {
            id: 'economy',
            name: 'توفير',
            basePrice: 35,
            eta: '3-5 دقائق',
            category: 'standard'
        },
        bidding: {
            userProposedFare: 35,
            minAllowedFare: 15,
            maxAllowedFare: 500,
            stepIncrement: 5,
            negotiationActive: true
        },
        payment: {
            method: 'cash',
            isVerified: true,
            walletBalance: 1450.00,
            currency: 'ج.م'
        },
        radar: {
            isScanning: false,
            searchRadiusKm: 5,
            maxScanDurationSec: 30,
            activeDriversFound: 0
        },
        trip: {
            id: null,
            status: 'idle',
            assignedDriver: null,
            agreedPrice: 35,
            startTime: null,
            endTime: null,
            routePolyline: []
        },
        userProfile: {
            id: 'USR-882391',
            name: 'محمود الألفي',
            rating: 4.95,
            totalTrips: 184,
            phone: '+201012345678',
            isVip: true
        }
    };

    /* ======================================================================== */
    /* 2. EXTENSIVE METADATA & CITIES DATABASE (ALL GOVERNORATES)               */
    /* ======================================================================== */
    const EgyptGovernoratesDatabase = {
        alex: {
            key: 'alex',
            name: 'الإسكندرية',
            code: 'ALX',
            center: { lat: 31.2001, lng: 29.9187 },
            zoomLevel: 14,
            activeCaptainsCount: 412,
            popularLandmarks: ['محطة الرمل', 'ميامي', 'سيدي بشر', 'العجمي', 'سموحة', 'لوران', 'المنشية', 'الإبراهيمية']
        },
        cairo: {
            key: 'cairo',
            name: 'القاهرة الكبرى',
            code: 'CAI',
            center: { lat: 30.0444, lng: 31.2357 },
            zoomLevel: 13,
            activeCaptainsCount: 1250,
            popularLandmarks: ['ميدان التحرير', 'مدينة نصر', 'التجمع الخامس', 'المعادي', 'الزمالك', 'المهندسين', 'مصر الجديدة']
        },
        giza: {
            key: 'giza',
            name: 'الجيزة',
            code: 'GIZ',
            center: { lat: 30.0131, lng: 31.2089 },
            zoomLevel: 13,
            activeCaptainsCount: 830,
            popularLandmarks: ['الدقي', 'المهندسين', 'الهرم', 'فيصل', 'الشيخ زايد', 'السادس من أكتوبر', 'العجوزة']
        },
        mansoura: {
            key: 'mansoura',
            name: 'المنصورة',
            code: 'MNS',
            center: { lat: 31.0409, lng: 31.3785 },
            zoomLevel: 14,
            activeCaptainsCount: 215,
            popularLandmarks: ['الشارع الجديد', 'جامعة المنصورة', 'توليب', 'سوق الحرفيين', 'المشاية']
        },
        tanta: {
            key: 'tanta',
            name: 'طنطا',
            code: 'TNT',
            center: { lat: 30.7865, lng: 31.0004 },
            zoomLevel: 14,
            activeCaptainsCount: 160,
            popularLandmarks: ['محطة الطريق السريع', 'السد العالي', 'شارع البحر', 'استاد طنطا']
        },
        asyut: {
            key: 'asyut',
            name: 'أسيوط',
            code: 'ASY',
            center: { lat: 27.1810, lng: 31.1837 },
            zoomLevel: 14,
            activeCaptainsCount: 110,
            popularLandmarks: ['جامعة أسيوط', 'شارع الهلالي', 'الجمهورية', 'المحطة']
        },
        ismailia: {
            key: 'ismailia',
            name: 'الإسماعيلية',
            code: 'ISM',
            center: { lat: 30.5931, lng: 32.2715 },
            zoomLevel: 14,
            activeCaptainsCount: 95,
            popularLandmarks: ['المنشية', 'نمرة 6', 'شارع شبين']
        },
        suez: {
            key: 'suez',
            name: 'السويس',
            code: 'SUZ',
            center: { lat: 29.9668, lng: 32.5498 },
            zoomLevel: 14,
            activeCaptainsCount: 80,
            popularLandmarks: ['الأربعين', 'المثلث', 'بور توفيق']
        },
        port_said: {
            key: 'port_said',
            name: 'بورسعيد',
            code: 'PSD',
            center: { lat: 31.2653, lng: 32.3019 },
            zoomLevel: 14,
            activeCaptainsCount: 105,
            popularLandmarks: ['المعدية', 'الشرقي', 'طرح البحر']
        },
        sohag: {
            key: 'sohag',
            name: 'سوهاج',
            code: 'SHG',
            center: { lat: 26.5560, lng: 31.6948 },
            zoomLevel: 14,
            activeCaptainsCount: 70,
            popularLandmarks: ['الاستاد', 'ميدان الثقافة', 'المدينة الجامعية']
        },
        luxor: {
            key: 'luxor',
            name: 'الأقصر',
            code: 'LXR',
            center: { lat: 25.6872, lng: 32.6396 },
            zoomLevel: 14,
            activeCaptainsCount: 90,
            popularLandmarks: ['معبد الكرنك', 'محطة الأقصر', 'كورنيش النيل']
        },
        aswan: {
            key: 'aswan',
            name: 'أسوان',
            code: 'ASN',
            center: { lat: 24.0889, lng: 32.8998 },
            zoomLevel: 14,
            activeCaptainsCount: 85,
            popularLandmarks: ['السد العالي', 'المحطة البرية', 'شارع السوق']
        },
        hurghada: {
            key: 'hurghada',
            name: 'الغردقة',
            code: 'HRG',
            center: { lat: 27.2579, lng: 33.8116 },
            zoomLevel: 13,
            activeCaptainsCount: 140,
            popularLandmarks: ['الشارع النادي', 'الممشى السياحي', 'سقالة']
        },
        sharm: {
            key: 'sharm',
            name: 'شرم الشيخ',
            code: 'SSH',
            center: { lat: 27.9158, lng: 34.3300 },
            zoomLevel: 13,
            activeCaptainsCount: 115,
            popularLandmarks: ['خليج نعمة', 'الصحاري', 'السوق التجاري القديم']
        }
    };

    /* ======================================================================== */
    /* 3. MOCK DRIVERS POOL DATABASE                                            */
    /* ======================================================================== */
    const SimulatedDriversPool = [
        {
            id: 'DRV-101',
            name: 'الكابتن / أحمد محمود',
            rating: 4.9,
            tripsCount: 1240,
            vehicleModel: 'شيفروليه أفيو - أبيض',
            plateNumber: 'أ ب ج 1234',
            avatarIcon: 'fa-user-tie',
            estimatedArrivalMin: 2,
            baseBidOffer: 35
        },
        {
            id: 'DRV-102',
            name: 'الكابتن / مصطفى السيد',
            rating: 4.8,
            tripsCount: 850,
            vehicleModel: 'نيسان صني - أسود',
            plateNumber: 'س ص ع 5678',
            avatarIcon: 'fa-user-gear',
            estimatedArrivalMin: 3,
            baseBidOffer: 40
        },
        {
            id: 'DRV-103',
            name: 'الكابتن / إبراهيم عبد الله',
            rating: 4.95,
            tripsCount: 2100,
            vehicleModel: 'هيونداي فيرنا - فضي',
            plateNumber: 'ط د ر 9876',
            avatarIcon: 'fa-user-shield',
            estimatedArrivalMin: 4,
            baseBidOffer: 35
        },
        {
            id: 'DRV-104',
            name: 'الكابتن / محمد إسلام',
            rating: 4.7,
            tripsCount: 420,
            vehicleModel: 'رينو لوجان - أزرق',
            plateNumber: 'م ن ه 4321',
            avatarIcon: 'fa-user-ninja',
            estimatedArrivalMin: 5,
            baseBidOffer: 30
        }
    ];

    /* ======================================================================== */
    /* 4. DOM ELEMENTS REPOSITORY CACHING                                       */
    /* ======================================================================== */
    const DOM = {
        citySelect: document.getElementById('citySelect'),
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        pickupInput: document.getElementById('pickupInput'),
        dropoffInput: document.getElementById('dropoffInput'),
        clearPickupBtn: document.getElementById('clearPickupBtn'),
        clearDropoffBtn: document.getElementById('clearDropoffBtn'),
        swapLocationsBtn: document.getElementById('swapLocationsBtn'),
        vehicleCards: document.querySelectorAll('.vehicle-option-card'),
        bidAmountDisplay: document.getElementById('bidAmount'),
        increaseBidBtn: document.getElementById('increaseBidBtn'),
        decreaseBidBtn: document.getElementById('decreaseBidBtn'),
        requestRideBtn: document.getElementById('requestRideBtn'),
        cancelSearchBtn: document.getElementById('cancelSearchBtn'),
        driverBidsContainer: document.getElementById('driverBidsContainer'),
        tripProgressBar: document.getElementById('tripProgressBar'),
        activeStatusText: document.getElementById('activeStatusText'),
        acceptedDriverName: document.getElementById('acceptedDriverName'),
        acceptedVehicleInfo: document.getElementById('acceptedVehicleInfo'),
        acceptedFareBadge: document.getElementById('acceptedFareBadge'),
        callDriverBtn: document.getElementById('callDriverBtn'),
        chatDriverBtn: document.getElementById('chatDriverBtn'),
        shareTripBtn: document.getElementById('shareTripBtn'),
        sosEmergencyBtn: document.getElementById('sosEmergencyBtn'),
        cancelTripBtn: document.getElementById('cancelTripBtn'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        paymentModal: document.getElementById('paymentModal'),
        chatModal: document.getElementById('chatModal'),
        chatMessagesBox: document.getElementById('chatMessagesBox'),
        chatInputField: document.getElementById('chatInputField'),
        sendChatMsgBtn: document.getElementById('sendChatMsgBtn'),
        recenterBtn: document.getElementById('recenterBtn'),
        notificationsBtn: document.getElementById('notificationsBtn'),
        supportCenterBtn: document.getElementById('supportCenterBtn'),
        darkModeToggleBtn: document.getElementById('darkModeToggleBtn')
    };

    /* ======================================================================== */
    /* 5. LEAFLET MAP ENGINE CORE INITIALIZER & NIGHT MODE UTILITIES            */
    /* ======================================================================== */
    let MapManager = {
        mapInstance: null,
        markersLayerGroup: null,
        
        init: function() {
            const activeCity = EgyptGovernoratesDatabase.alex;
            
            this.mapInstance = L.map('map', {
                zoomControl: false,
                attributionControl: false
            }).setView([activeCity.center.lat, activeCity.center.lng], activeCity.zoomLevel);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                subdomains: ['a', 'b', 'c']
            }).addTo(this.mapInstance);

            L.control.zoom({ position: 'bottomleft' }).addTo(this.mapInstance);
            
            this.markersLayerGroup = L.layerGroup().addTo(this.mapInstance);
            this.renderDefaultMarkers(activeCity.center.lat, activeCity.center.lng);
            
            console.log('MapManager: Leaflet map initialized successfully with full enterprise interactive bindings.');
        },

        renderDefaultMarkers: function(lat, lng) {
            if (!this.markersLayerGroup) return;
            this.markersLayerGroup.clearLayers();

            const pickupIcon = L.divIcon({
                className: 'custom-leaflet-marker pickup-marker-node',
                html: '<div style="background:#00c853; width:16px; height:16px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 12px rgba(0,200,83,0.6);"></div>',
                iconSize: [20, 20]
            });

            const dropoffIcon = L.divIcon({
                className: 'custom-leaflet-marker dropoff-marker-node',
                html: '<div style="background:#ff3d00; width:16px; height:16px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 12px rgba(255,61,0,0.6);"></div>',
                iconSize: [20, 20]
            });

            L.marker([lat, lng], { icon: pickupIcon })
                .addTo(this.markersLayerGroup)
                .bindPopup('<b>نقطة الركوب الحالية (الانطلاق)</b>');

            L.marker([lat + 0.04, lng + 0.05], { icon: dropoffIcon })
                .addTo(this.markersLayerGroup)
                .bindPopup('<b>الوجهة النهائية المقترحة</b>');
        },

        panToCity: function(cityKey) {
            const cityData = EgyptGovernoratesDatabase[cityKey];
            if (cityData && this.mapInstance) {
                this.mapInstance.setView([cityData.center.lat, cityData.center.lng], cityData.zoomLevel);
                this.renderDefaultMarkers(cityData.center.lat, cityData.center.lng);
                console.log(`MapManager: Successfully panned to governorate -> ${cityData.name}`);
            }
        },

        resetViewToCurrentLocation: function() {
            const currentCityKey = EnterpriseState.selectedCity;
            this.panToCity(currentCityKey);
        }
    };

    /* ======================================================================== */
    /* 6. ADVANCED EVENT LISTENERS BINDING ENGINE (FULLY EXPANDED)              */
    /* ======================================================================== */
    function bindApplicationEventListeners() {
        
        // 1. Governorate Selection Dropdown Handler
        if (DOM.citySelect) {
            DOM.citySelect.addEventListener('change', function(event) {
                const selectedKey = event.target.value;
                EnterpriseState.selectedCity = selectedKey;
                MapManager.panToCity(selectedKey);
                
                const govObj = EgyptGovernoratesDatabase[selectedKey];
                if (govObj) {
                    showEnterpriseToast(`تم تحديث الخريطة والمناطق النشطة في محافظة ${govObj.name}`);
                }
            });
        }

        // 2. Pickup Input Clearing Tool
        if (DOM.clearPickupBtn) {
            DOM.clearPickupBtn.addEventListener('click', function() {
                if (DOM.pickupInput) {
                    DOM.pickupInput.value = '';
                    DOM.pickupInput.focus();
                    EnterpriseState.pickupLocation.name = '';
                    showEnterpriseToast('تم تفريغ حقل نقطة الانطلاق');
                }
            });
        }

        // 3. Dropoff Input Clearing Tool
        if (DOM.clearDropoffBtn) {
            DOM.clearDropoffBtn.addEventListener('click', function() {
                if (DOM.dropoffInput) {
                    DOM.dropoffInput.value = '';
                    DOM.dropoffInput.focus();
                    EnterpriseState.dropoffLocation.name = '';
                    showEnterpriseToast('تم تفريغ حقل الوجهة');
                }
            });
        }

        // 4. Locations Swapping Engine
        if (DOM.swapLocationsBtn) {
            DOM.swapLocationsBtn.addEventListener('click', function() {
                if (DOM.pickupInput && DOM.dropoffInput) {
                    const tempVal = DOM.pickupInput.value;
                    DOM.pickupInput.value = DOM.dropoffInput.value;
                    DOM.dropoffInput.value = tempVal;

                    const tempObj = { ...EnterpriseState.pickupLocation };
                    EnterpriseState.pickupLocation = { ...EnterpriseState.dropoffLocation };
                    EnterpriseState.dropoffLocation = tempObj;

                    showEnterpriseToast('تم تبديل مواقع الانطلاق والوصول بنجاح');
                }
            });
        }

        // 5. Vehicle Options Selector Cards
        if (DOM.vehicleCards) {
            DOM.vehicleCards.forEach(card => {
                card.addEventListener('click', function() {
                    DOM.vehicleCards.forEach(c => c.classList.remove('active-vehicle'));
                    this.classList.add('active-vehicle');

                    const vehicleId = this.getAttribute('data-vehicle');
                    const defaultPrice = parseInt(this.getAttribute('data-price')) || 35;

                    EnterpriseState.selectedVehicle.id = vehicleId;
                    EnterpriseState.selectedVehicle.basePrice = defaultPrice;
                    EnterpriseState.bidding.userProposedFare = defaultPrice;
                    
                    updateBidDisplayView();
                    console.log(`VehicleSelected: ${vehicleId} with Base Fare: ${defaultPrice}`);
                });
            });
        }

        // 6. Bidding Price Increment (+5 EGP)
        if (DOM.increaseBidBtn) {
            DOM.increaseBidBtn.addEventListener('click', function() {
                if (EnterpriseState.bidding.userProposedFare < EnterpriseState.bidding.maxAllowedFare) {
                    EnterpriseState.bidding.userProposedFare += EnterpriseState.bidding.stepIncrement;
                    updateBidDisplayView();
                } else {
                    showEnterpriseToast('وصلت للحد الأقصى المسموح للمزايدة');
                }
            });
        }

        // 7. Bidding Price Decrement (-5 EGP)
        if (DOM.decreaseBidBtn) {
            DOM.decreaseBidBtn.addEventListener('click', function() {
                if (EnterpriseState.bidding.userProposedFare > EnterpriseState.bidding.minAllowedFare) {
                    EnterpriseState.bidding.userProposedFare -= EnterpriseState.bidding.stepIncrement;
                    updateBidDisplayView();
                } else {
                    showEnterpriseToast('لا يمكن النزول عن الحد الأدنى للأجرة');
                }
            });
        }

        // 8. Request Ride Trigger (Step 1 -> Step 2)
        if (DOM.requestRideBtn) {
            DOM.requestRideBtn.addEventListener('click', function() {
                const pickupVal = DOM.pickupInput ? DOM.pickupInput.value.trim() : '';
                const dropoffVal = DOM.dropoffInput ? DOM.dropoffInput.value.trim() : '';

                if (!pickupVal || !dropoffVal) {
                    alert('تنبيه هام: يرجى إدخال عنوان نقطة الانطلاق والوجهة المطلوبة بدقة للمتابعة.');
                    return;
                }

                transitionWorkflowStep(2);
                showEnterpriseToast('جاري تفعيل الرادار والبحث عن أقرب الكباتن المتاحين...');
            });
        }

        // 9. Cancel Search Trigger (Step 2 -> Step 1)
        if (DOM.cancelSearchBtn) {
            DOM.cancelSearchBtn.addEventListener('click', function() {
                transitionWorkflowStep(1);
                showEnterpriseToast('تم إلغاء عملية البحث عن الكباتن بنجاح');
            });
        }

        // 10. Global Event Delegation for Accepting Driver Bids
        document.addEventListener('click', function(event) {
            const acceptBtn = event.target.closest('.btn-accept-offer');
            if (acceptBtn) {
                const card = acceptBtn.closest('.driver-offer-card');
                const captainName = card ? card.querySelector('.driver-name').textContent : 'الكابتن أحمد محمود';
                const vehicleDetails = card ? card.querySelector('.car-details').textContent : 'شيفروليه أفيو - أبيض';
                const agreedPriceVal = card ? card.querySelector('.price-val').textContent : '35';

                EnterpriseState.trip.agreedPrice = parseInt(agreedPriceVal) || 35;
                
                if (DOM.acceptedDriverName) DOM.acceptedDriverName.textContent = captainName;
                if (DOM.acceptedVehicleInfo) DOM.acceptedVehicleInfo.textContent = vehicleDetails;
                if (DOM.acceptedFareBadge) DOM.acceptedFareBadge.textContent = `الأجرة المتفق عليها: ${agreedPriceVal} ج.م`;

                transitionWorkflowStep(3);
                showEnterpriseToast('تم قبول العرض بنجاح! الكابتن في طريقه إليك الآن');
            }
        });

        // 11. Chat Modal Opener Trigger
        if (DOM.chatDriverBtn) {
            DOM.chatDriverBtn.addEventListener('click', function() {
                openEnterpriseModal('chatModal');
            });
        }

        // 12. Chat Dispatch Message Action
        if (DOM.sendChatMsgBtn && DOM.chatInputField) {
            DOM.sendChatMsgBtn.addEventListener('click', handleChatDispatchMessage);
            DOM.chatInputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleChatDispatchMessage();
                }
            });
        }

        // 13. Modals Backdrop & Closing Triggers
        if (DOM.modalBackdrop) {
            DOM.modalBackdrop.addEventListener('click', closeAllEnterpriseModals);
        }

        const closeModalsTriggerList = document.querySelectorAll('.close-modal-btn');
        closeModalsTriggerList.forEach(btn => {
            btn.addEventListener('click', closeAllEnterpriseModals);
        });

        // 14. SOS Emergency Button Trigger
        if (DOM.sosEmergencyBtn) {
            DOM.sosEmergencyBtn.addEventListener('click', function() {
                triggerSosEmergencyProtocol();
            });
        }

        // 15. Cancel Active Trip Button Trigger
        if (DOM.cancelTripBtn) {
            DOM.cancelTripBtn.addEventListener('click', function() {
                const confirmCancel = confirm('تحذير أمني: هل أنت متأكد من رغبتك في إلغاء الرحلة الجارية حالياً؟');
                if (confirmCancel) {
                    transitionWorkflowStep(1);
                    showEnterpriseToast('تم إلغاء الرحلة النشطة بنجاح');
                }
            });
        }

        // 16. Recenter Map Button
        if (DOM.recenterBtn) {
            DOM.recenterBtn.addEventListener('click', function() {
                MapManager.resetViewToCurrentLocation();
                showEnterpriseToast('تمت إعادة ضبط تمركز الخريطة على موقعك الحالي');
            });
        }

        // 17. 🌙 Dark Mode / Night Mode Master Toggle Controller
        if (DOM.darkModeToggleBtn) {
            DOM.darkModeToggleBtn.addEventListener('click', function() {
                toggleNightModeEngine();
            });
        }
    }

    /* ======================================================================== */
    /* 7. NIGHT MODE ENGINE CONTROLLER SUBSYSTEM                                */
    /* ======================================================================== */
    function toggleNightModeEngine() {
        EnterpriseState.isDarkMode = !EnterpriseState.isDarkMode;
        const bodyElement = document.body;
        const mapContainer = document.getElementById('map');

        if (EnterpriseState.isDarkMode) {
            bodyElement.classList.add('enterprise-dark-mode');
            if (mapContainer) {
                mapContainer.classList.add('map-night-filter');
            }
            if (DOM.darkModeToggleBtn) {
                DOM.darkModeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> الوضع النهاري';
            }
            showEnterpriseToast('🌙 تم تفعيل المنظور الليلي بنجاح (راحة العين القصوى)');
        } else {
            bodyElement.classList.remove('enterprise-dark-mode');
            if (mapContainer) {
                mapContainer.classList.remove('map-night-filter');
            }
            if (DOM.darkModeToggleBtn) {
                DOM.darkModeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> المنظور الليلي';
            }
            showEnterpriseToast('☀️ تم العودة للوضع النهاري القياسي الساطع');
        }
    }

    /* ======================================================================== */
    /* 8. WORKFLOW STEP MANAGEMENT & CONTROLLER ENGINE                          */
    /* ======================================================================== */
    function transitionWorkflowStep(targetStepNumber) {
        EnterpriseState.currentStep = targetStepNumber;

        if (DOM.step1) DOM.step1.classList.add('hidden-step');
        if (DOM.step2) DOM.step2.classList.add('hidden-step');
        if (DOM.step3) DOM.step3.classList.add('hidden-step');

        switch (targetStepNumber) {
            case 1:
                if (DOM.step1) DOM.step1.classList.remove('hidden-step');
                EnterpriseState.trip.status = 'idle';
                break;
            case 2:
                if (DOM.step2) DOM.step2.classList.remove('hidden-step');
                EnterpriseState.trip.status = 'searching';
                break;
            case 3:
                if (DOM.step3) DOM.step3.classList.remove('hidden-step');
                EnterpriseState.trip.status = 'active';
                initializeActiveTripTrackerSimulation();
                break;
            default:
                if (DOM.step1) DOM.step1.classList.remove('hidden-step');
                break;
        }

        console.log(`WorkflowEngine: Successfully transitioned to Step -> ${targetStepNumber}`);
    }

    function updateBidDisplayView() {
        if (DOM.bidAmountDisplay) {
            DOM.bidAmountDisplay.textContent = EnterpriseState.bidding.userProposedFare;
        }
    }

    function initializeActiveTripTrackerSimulation() {
        let currentProgressPercentage = 35;
        EnterpriseState.trip.startTime = new Date();

        const tripIntervalTimer = setInterval(() => {
            if (EnterpriseState.currentStep !== 3) {
                clearInterval(tripIntervalTimer);
                return;
            }

            currentProgressPercentage += 20;
            if (DOM.tripProgressBar) {
                DOM.tripProgressBar.style.width = `${currentProgressPercentage}%`;
            }

            if (currentProgressPercentage >= 100) {
                clearInterval(tripIntervalTimer);
                if (DOM.activeStatusText) {
                    DOM.activeStatusText.textContent = 'لقد وصلت إلى وجهتك بسلام تام!';
                }
                showEnterpriseToast('تم إتمام الرحلة بنجاح. شكراً لثقتكم في إنـدرايف!');
                
                setTimeout(() => {
                    transitionWorkflowStep(1);
                }, 3500);
            } else if (currentProgressPercentage >= 75) {
                if (DOM.activeStatusText) DOM.activeStatusText.textContent = 'أنت تقترب جداً من وجهتك النهائية...';
            } else if (DOM.activeStatusText) {
                DOM.activeStatusText.textContent = 'الكابتن يقود السيارة في الطريق الآمن...';
            }
        }, 3000);
    }

    /* ======================================================================== */
    /* 9. MODALS, CHAT & TOAST NOTIFICATIONS SUBSYSTEM                          */
    /* ======================================================================== */
    function openEnterpriseModal(modalElementId) {
        const targetModal = document.getElementById(modalElementId);
        if (targetModal && DOM.modalBackdrop) {
            targetModal.classList.remove('hidden-modal');
            DOM.modalBackdrop.classList.remove('hidden-modal');
        }
    }

    function closeAllEnterpriseModals() {
        if (DOM.paymentModal) DOM.paymentModal.classList.add('hidden-modal');
        if (DOM.chatModal) DOM.chatModal.classList.add('hidden-modal');
        if (DOM.modalBackdrop) DOM.modalBackdrop.classList.add('hidden-modal');
    }

    function handleChatDispatchMessage() {
        if (!DOM.chatInputField || !DOM.chatMessagesBox) return;
        
        const messageText = DOM.chatInputField.value.trim();
        if (!messageText) return;

        const userBubbleNode = document.createElement('div');
        userBubbleNode.className = 'chat-bubble driver-bubble';
        userBubbleNode.style.cssText = 'align-self:flex-end; background:#e6f9f0; padding:10px 14px; border-radius:12px; margin-bottom:8px; max-width:80%;';
        userBubbleNode.innerHTML = `
            <div class="bubble-sender-name" style="color:#00a859; font-weight:bold; font-size:12px;">أنت</div>
            <div class="bubble-text" style="color:#333; font-size:14px;">${escapeHtmlString(messageText)}</div>
        `;

        DOM.chatMessagesBox.appendChild(userBubbleNode);
        DOM.chatInputField.value = '';
        DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;

        setTimeout(() => {
            const captainReplyNode = document.createElement('div');
            captainReplyNode.className = 'chat-bubble driver-bubble';
            captainReplyNode.style.cssText = 'align-self:flex-start; background:#f1f1f1; padding:10px 14px; border-radius:12px; margin-bottom:8px; max-width:80%;';
            captainReplyNode.innerHTML = `
                <div class="bubble-sender-name" style="color:#555; font-weight:bold; font-size:12px;">الكابتن أحمد</div>
                <div class="bubble-text" style="color:#333; font-size:14px;">تمام يا فندم، وصلني ردك وأنا في الطريق إليك حالياً.</div>
            `;
            DOM.chatMessagesBox.appendChild(captainReplyNode);
            DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;
        }, 1800);
    }

    function triggerSosEmergencyProtocol() {
        const emergencyAlertConfirmed = confirm('⚠️ تفعيل نظام الطوارئ (SOS): هل تريد الاتصال المباشر بالخط الساخن للأمن ومشاركة إحداثيات رحلتك الحالية؟');
        if (emergencyAlertConfirmed) {
            showEnterpriseToast('تم إرسال إشارة الاستغاثة وتأمين رحلتك بنجاح.');
        }
    }

    function showEnterpriseToast(messageContent) {
        const toastElement = document.createElement('div');
        toastElement.className = 'indrive-enterprise-toast';
        toastElement.textContent = messageContent;
        toastElement.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #111111;
            color: #00dd88;
            padding: 12px 28px;
            border-radius: 35px;
            font-weight: 800;
            font-size: 13px;
            z-index: 9999;
            box-shadow: 0 12px 30px rgba(0,0,0,0.35);
            border: 1px solid #00dd88;
            direction: rtl;
            font-family: 'Cairo', sans-serif;
        `;

        document.body.appendChild(toastElement);

        setTimeout(() => {
            toastElement.style.opacity = '0';
            toastElement.style.transition = 'opacity 0.5s ease-in-out';
            setTimeout(() => {
                toastElement.remove();
            }, 500);
        }, 3200);
    }

    function escapeHtmlString(stringInput) {
        return String(stringInput)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /* ======================================================================== */
    /* 10. APPLICATION INITIALIZATION BOOTSTRAPPER                              */
    /* ======================================================================== */
    MapManager.init();
    bindApplicationEventListeners();
    
    console.log(`InDrive Egypt Enterprise Application v${EnterpriseState.version} successfully booted with full interactive controls and Night Mode engine.`);

});