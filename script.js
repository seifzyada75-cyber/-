/**
 * ============================================================================
 * IN-DRIVE EGYPT - MASTER ENTERPRISE APPLICATION CONTROLLER (script.js)
 * Architecture: Modular Enterprise Vanilla JavaScript Client Engine
 * Version: 4.5.0-Enterprise
 * Date: 2026
 * ============================================================================
 */

'use strict';

(function(window, document, undefined) {
    
    // Global Namespace for InDrive Enterprise Application
    window.InDriveApp = window.InDriveApp || {};

    /* ======================================================================== */
    /* 1. APPLICATION STATE & CONFIGURATION OBJECTS                             */
    /* ======================================================================== */
    const EnterpriseState = {
        version: '4.5.0',
        environment: 'production',
        currentStep: 1,
        selectedCity: 'alex',
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
            status: 'idle', // idle, searching, matched, active, completed, cancelled
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
    /* 2. EXTENSIVE METADATA & CITIES DATABASE                                  */
    /* ======================================================================== */
    const EgyptGovernoratesDatabase = {
        alex: {
            key: 'alex',
            name: 'الإسكندرية',
            code: 'ALX',
            center: { lat: 31.2001, lng: 29.9187 },
            zoomLevel: 14,
            activeCaptainsCount: 412,
            popularLandmarks: [
                'محطة الرمل', 'ميامي', 'سيدي بشر', 'العجمي', 'سموحة', 'لوران', 'البورصة'
            ]
        },
        cairo: {
            key: 'cairo',
            name: 'القاهرة الكبرى',
            code: 'CAI',
            center: { lat: 30.0444, lng: 31.2357 },
            zoomLevel: 13,
            activeCaptainsCount: 1250,
            popularLandmarks: [
                'ميدان التحرير', 'مدينة نصر', 'التجمع الخامس', 'المعادي', 'الزمالك', 'المهندسين'
            ]
        },
        giza: {
            key: 'giza',
            name: 'الجيزة',
            code: 'GIZ',
            center: { lat: 30.0131, lng: 31.2089 },
            zoomLevel: 13,
            activeCaptainsCount: 830,
            popularLandmarks: [
                'الدقي', 'المهندسين', 'الهرم', 'فيصل', 'الشيخ زايد', 'السادس من أكتوبر'
            ]
        },
        mansoura: {
            key: 'mansoura',
            name: 'المنصورة',
            code: 'MNS',
            center: { lat: 31.0409, lng: 31.3785 },
            zoomLevel: 14,
            activeCaptainsCount: 215,
            popularLandmarks: [
                'الشارع الجديد', 'جامعة المنصورة', 'توليب', 'سوق الحرفيين'
            ]
        },
        tanta: {
            key: 'tanta',
            name: 'طنطا',
            code: 'TNT',
            center: { lat: 30.7865, lng: 31.0004 },
            zoomLevel: 14,
            activeCaptainsCount: 160,
            popularLandmarks: [
                'محطة الطريق السريع', 'السد العالي', 'شارع البحر'
            ]
        },
        asyut: {
            key: 'asyut',
            name: 'أسيوط',
            code: 'ASY',
            center: { lat: 27.1810, lng: 31.1837 },
            zoomLevel: 14,
            activeCaptainsCount: 110,
            popularLandmarks: [
                'جامعة أسيوط', 'شارع الهلالي', 'الجمهورية'
            ]
        }
    };

    /* ======================================================================== */
    /* 3. MOCK DRIVERS DATA POOL FOR DYNAMIC BIDDING                           */
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
    let DOM = {};

    function cacheDomElements() {
        DOM.citySelect = document.getElementById('citySelect');
        DOM.step1 = document.getElementById('step1');
        DOM.step2 = document.getElementById('step2');
        DOM.step3 = document.getElementById('step3');
        DOM.pickupInput = document.getElementById('pickupInput');
        DOM.dropoffInput = document.getElementById('dropoffInput');
        DOM.clearPickupBtn = document.getElementById('clearPickupBtn');
        DOM.clearDropoffBtn = document.getElementById('clearDropoffBtn');
        DOM.swapLocationsBtn = document.getElementById('swapLocationsBtn');
        DOM.vehicleCards = document.querySelectorAll('.vehicle-option-card');
        DOM.bidAmountDisplay = document.getElementById('bidAmount');
        DOM.increaseBidBtn = document.getElementById('increaseBidBtn');
        DOM.decreaseBidBtn = document.getElementById('decreaseBidBtn');
        DOM.requestRideBtn = document.getElementById('requestRideBtn');
        DOM.cancelSearchBtn = document.getElementById('cancelSearchBtn');
        DOM.driverBidsContainer = document.getElementById('driverBidsContainer');
        DOM.tripProgressBar = document.getElementById('tripProgressBar');
        DOM.activeStatusText = document.getElementById('activeStatusText');
        DOM.acceptedDriverName = document.getElementById('acceptedDriverName');
        DOM.acceptedVehicleInfo = document.getElementById('acceptedVehicleInfo');
        DOM.acceptedFareBadge = document.getElementById('acceptedFareBadge');
        DOM.callDriverBtn = document.getElementById('callDriverBtn');
        DOM.chatDriverBtn = document.getElementById('chatDriverBtn');
        DOM.shareTripBtn = document.getElementById('shareTripBtn');
        DOM.sosEmergencyBtn = document.getElementById('sosEmergencyBtn');
        DOM.cancelTripBtn = document.getElementById('cancelTripBtn');
        DOM.modalBackdrop = document.getElementById('modalBackdrop');
        DOM.paymentModal = document.getElementById('paymentModal');
        DOM.chatModal = document.getElementById('chatModal');
        DOM.chatMessagesBox = document.getElementById('chatMessagesBox');
        DOM.chatInputField = document.getElementById('chatInputField');
        DOM.sendChatMsgBtn = document.getElementById('sendChatMsgBtn');
        DOM.recenterBtn = document.getElementById('recenterBtn');
        DOM.notificationsBtn = document.getElementById('notificationsBtn');
        DOM.supportCenterBtn = document.getElementById('supportCenterBtn');
    }

    /* ======================================================================== */
    /* 5. LEAFLET MAP ENGINE CORE INITIALIZER & UTILITIES                       */
    /* ======================================================================== */
    let MapManager = {
        mapInstance: null,
        markersLayerGroup: null,
        polylineLayer: null,
        
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
            
            console.log('MapManager: Leaflet map initialized successfully.');
        },

        renderDefaultMarkers: function(lat, lng) {
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
                .bindPopup('<b>نقطة الركوب الحالية</b>');

            L.marker([lat + 0.04, lng + 0.05], { icon: dropoffIcon })
                .addTo(this.markersLayerGroup)
                .bindPopup('<b>الوجهة النهائية المقترحة</b>');
        },

        panToCity: function(cityKey) {
            const cityData = EgyptGovernoratesDatabase[cityKey];
            if (cityData && this.mapInstance) {
                this.mapInstance.setView([cityData.center.lat, cityData.center.lng], cityData.zoomLevel);
                this.renderDefaultMarkers(cityData.center.lat, cityData.center.lng);
                console.log(`MapManager: Panned view to governorate -> ${cityData.name}`);
            }
        },

        resetViewToCurrentLocation: function() {
            const currentCityKey = EnterpriseState.selectedCity;
            this.panToCity(currentCityKey);
        }
    };

    /* ======================================================================== */
    /* 6. EVENT LISTENERS BINDING LOGIC                                         */
    /* ======================================================================== */
    function bindApplicationEventListeners() {
        
        // City selection change listener
        if (DOM.citySelect) {
            DOM.citySelect.addEventListener('change', function(event) {
                const selectedKey = event.target.value;
                EnterpriseState.selectedCity = selectedKey;
                MapManager.panToCity(selectedKey);
                
                const govObj = EgyptGovernoratesDatabase[selectedKey];
                if (govObj) {
                    showEnterpriseToast(`تم تحديث الخريطة والمناطق النشطة في ${govObj.name}`);
                }
            });
        }

        // Input clearing tools
        if (DOM.clearPickupBtn) {
            DOM.clearPickupBtn.addEventListener('click', function() {
                DOM.pickupInput.value = '';
                DOM.pickupInput.focus();
                EnterpriseState.pickupLocation.name = '';
            });
        }

        if (DOM.clearDropoffBtn) {
            DOM.clearDropoffBtn.addEventListener('click', function() {
                DOM.dropoffInput.value = '';
                DOM.dropoffInput.focus();
                EnterpriseState.dropoffLocation.name = '';
            });
        }

        // Swap locations functionality
        if (DOM.swapLocationsBtn) {
            DOM.swapLocationsBtn.addEventListener('click', function() {
                const tempVal = DOM.pickupInput.value;
                DOM.pickupInput.value = DOM.dropoffInput.value;
                DOM.dropoffInput.value = tempVal;
                
                const tempObj = { ...EnterpriseState.pickupLocation };
                EnterpriseState.pickupLocation = { ...EnterpriseState.dropoffLocation };
                EnterpriseState.dropoffLocation = tempObj;

                showEnterpriseToast('تم تبديل مواقع نقطة الانطلاق والوصول بنجاح');
            });
        }

        // Vehicle selection cards click handlers
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
                    
                    if (DOM.bidAmountDisplay) {
                        DOM.bidAmountDisplay.textContent = defaultPrice;
                    }

                    console.log(`VehicleCategoryChanged: Selected -> ${vehicleId}, BasePrice -> ${defaultPrice}`);
                });
            });
        }

        // Bidding Price Adjustment Buttons (+ / -)
        if (DOM.increaseBidBtn) {
            DOM.increaseBidBtn.addEventListener('click', function() {
                if (EnterpriseState.bidding.userProposedFare < EnterpriseState.bidding.maxAllowedFare) {
                    EnterpriseState.bidding.userProposedFare += EnterpriseState.bidding.stepIncrement;
                    updateBidDisplayView();
                }
            });
        }

        if (DOM.decreaseBidBtn) {
            DOM.decreaseBidBtn.addEventListener('click', function() {
                if (EnterpriseState.bidding.userProposedFare > EnterpriseState.bidding.minAllowedFare) {
                    EnterpriseState.bidding.userProposedFare -= EnterpriseState.bidding.stepIncrement;
                    updateBidDisplayView();
                }
            });
        }

        // Request Ride Trigger Button (Transitions to Step 2)
        if (DOM.requestRideBtn) {
            DOM.requestRideBtn.addEventListener('click', function() {
                const pickupVal = DOM.pickupInput.value.trim();
                const dropoffVal = DOM.dropoffInput.value.trim();

                if (!pickupVal || !dropoffVal) {
                    alert('تنبيه هام: يرجى إدخال عنوان نقطة الانطلاق والوجهة المطلوبة بدقة للمتابعة.');
                    return;
                }

                transitionWorkflowStep(2);
            });
        }

        // Cancel Search and return to Step 1
        if (DOM.cancelSearchBtn) {
            DOM.cancelSearchBtn.addEventListener('click', function() {
                transitionWorkflowStep(1);
                showEnterpriseToast('تم إلغاء عملية البحث عن الكباتن');
            });
        }

        // Global delegation for accepting/declining driver bids
        document.addEventListener('click', function(event) {
            const acceptBtn = event.target.closest('.btn-accept-offer');
            if (acceptBtn) {
                const card = acceptBtn.closest('.driver-offer-card');
                const captainName = card.querySelector('.driver-name').textContent;
                const vehicleDetails = card.querySelector('.car-details').textContent;
                const agreedPriceVal = card.querySelector('.price-val').textContent;

                EnterpriseState.trip.agreedPrice = parseInt(agreedPriceVal) || 35;
                
                if (DOM.acceptedDriverName) DOM.acceptedDriverName.textContent = captainName;
                if (DOM.acceptedVehicleInfo) DOM.acceptedVehicleInfo.textContent = vehicleDetails;
                if (DOM.acceptedFareBadge) DOM.acceptedFareBadge.textContent = `الأجرة المتفق عليها: ${agreedPriceVal} ج.م`;

                transitionWorkflowStep(3);
                showEnterpriseToast('تم قبول عرض الكابتن بنجاح! جاري تحضير تفاصيل الرحلة');
            }
        });

        // Chat modal trigger
        if (DOM.chatDriverBtn) {
            DOM.chatDriverBtn.addEventListener('click', function() {
                openEnterpriseModal('chatModal');
            });
        }

        // Send chat message action
        if (DOM.sendChatMsgBtn && DOM.chatInputField) {
            DOM.sendChatMsgBtn.addEventListener('click', handleChatDispatchMessage);
            DOM.chatInputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleChatDispatchMessage();
                }
            });
        }

        // Modal backdrops and close events
        if (DOM.modalBackdrop) {
            DOM.modalBackdrop.addEventListener('click', closeAllEnterpriseModals);
        }

        const closeModalsTriggerList = document.querySelectorAll('.close-modal-btn');
        closeModalsTriggerList.forEach(btn => {
            btn.addEventListener('click', closeAllEnterpriseModals);
        });

        // SOS Emergency Button
        if (DOM.sosEmergencyBtn) {
            DOM.sosEmergencyBtn.addEventListener('click', function() {
                triggerSosEmergencyProtocol();
            });
        }

        // Cancel Active Trip Button
        if (DOM.cancelTripBtn) {
            DOM.cancelTripBtn.addEventListener('click', function() {
                if (confirm('تحذير: هل أنت متأكد من رغبتك في إلغاء الرحلة الجارية حالياً؟ قد يتم تطبيق رسم إلغاء بسيط.')) {
                    transitionWorkflowStep(1);
                    showEnterpriseToast('تم إلغاء الرحلة النشطة بنجاح');
                }
            });
        }

        // Recenter Map Button
        if (DOM.recenterBtn) {
            DOM.recenterBtn.addEventListener('click', function() {
                MapManager.resetViewToCurrentLocation();
                showEnterpriseToast('تمت إعادة ضبط تمركز الخريطة');
            });
        }
    }

    /* ======================================================================== */
    /* 7. WORKFLOW STEP MANAGEMENT & CONTROLLER ENGINE                          */
    /* ======================================================================== */
    function transitionWorkflowStep(targetStepNumber) {
        EnterpriseState.currentStep = targetStepNumber;

        // Hide all steps first
        if (DOM.step1) DOM.step1.classList.add('hidden-step');
        if (DOM.step2) DOM.step2.classList.add('hidden-step');
        if (DOM.step3) DOM.step3.classList.add('hidden-step');

        // Show appropriate step according to parameter
        switch (targetStepNumber) {
            case 1:
                if (DOM.step1) DOM.step1.classList.remove('hidden-step');
                EnterpriseState.trip.status = 'idle';
                break;
            case 2:
                if (DOM.step2) DOM.step2.classList.remove('hidden-step');
                EnterpriseState.trip.status = 'searching';
                initializeRadarScanSimulation();
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

    /* ======================================================================== */
    /* 8. RADAR SCANNING & TRIP TRACKING SIMULATION ENGINE                      */
    /* ======================================================================== */
    function initializeRadarScanSimulation() {
        EnterpriseState.radar.isScanning = true;
        console.log('RadarEngine: Scanning active zone for available captains...');
        
        // Simulate dynamic bid cards population if container exists
        setTimeout(() => {
            if (EnterpriseState.currentStep === 2) {
                console.log('RadarEngine: Found 2 matched captains. Displaying bids.');
            }
        }, 2500);
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
                    DOM.activeStatusText.textContent = 'لقد وصلت إلى وجهتك بسلام!';
                }
                showEnterpriseToast('تم إتمام الرحلة بنجاح. شكراً لاستخدامك إنـدرايف!');
                
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
        userBubbleNode.style.alignSelf = 'flex-end';
        userBubbleNode.style.background = '#e6f9f0';
        userBubbleNode.innerHTML = `
            <div class="bubble-sender-name" style="color:#00a859;">أنت</div>
            <div class="bubble-text">${escapeHtmlString(messageText)}</div>
        `;

        DOM.chatMessagesBox.appendChild(userBubbleNode);
        DOM.chatInputField.value = '';
        DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;

        // Automated simulated captain reply after 1.8 seconds
        setTimeout(() => {
            const captainReplyNode = document.createElement('div');
            captainReplyNode.className = 'chat-bubble driver-bubble';
            captainReplyNode.innerHTML = `
                <div class="bubble-sender-name">الكابتن أحمد</div>
                <div class="bubble-text">تمام يا فندم، وصلني ردك وأنا في الطريق إليك حالياً.</div>
            `;
            DOM.chatMessagesBox.appendChild(captainReplyNode);
            DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;
        }, 1800);
    }

    function triggerSosEmergencyProtocol() {
        const emergencyAlertConfirmed = confirm('⚠️ تفعيل نظام الطوارئ (SOS): هل تريد الاتصال المباشر بالخط الساخن للأمن ومشاركة تفاصيل الرحلة الحالية فوراً؟');
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
    function initializeEnterpriseApplication() {
        cacheDomElements();
        MapManager.init();
        bindApplicationEventListeners();
        
        console.log(`InDrive Egypt Enterprise Application v${EnterpriseState.version} booted successfully.`);
    }

    // Execute boot on DOMContentLoaded state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEnterpriseApplication);
    } else {
        initializeEnterpriseApplication();
    }

})(window, document);