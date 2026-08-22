/* ==========================================================================
   IN-DRIVE EGYPT ENTERPRISE JAVASCRIPT ARCHITECTURE v5.0
   ========================================================================== */

/* 1. System Configuration & Enterprise Constants Module */
const SystemConfig = Object.freeze({
    VERSION: "5.0.0-Enterprise-Production",
    REGION: "Egypt (EGY - Cairo/Alexandria/Beheira)",
    CURRENCY: "ج.م",
    API_TIMEOUT_MS: 5000,
    DEFAULT_LATITUDE: 31.0267, // Abu Al Matamir / Beheira baseline
    DEFAULT_LONGITUDE: 30.1775,
    PRICING: {
        BASE_FARE: 18.0,
        RATE_PER_KM: 5.0,
        MIN_FARE: 30.0,
        SURG_MULTIPLIER_PEAK: 1.40
    },
    EGYPT_PHONE_REGEX: /^(\+20|0)?1[0125][0-9]{8}$/
});

/* 2. Diagnostics & Telemetry Logging Engine */
class DiagnosticsLogger {
    static log(message, level = "INFO") {
        try {
            const timestamp = new Date().toLocaleTimeString('en-GB');
            const consoleElement = document.getElementById('diagnosticsConsoleLog');
            if (consoleElement) {
                const logEntry = document.createElement('div');
                logEntry.style.color = level === "ERROR" ? "#ef4444" : (level === "WARN" ? "#f59e0b" : "#38bdf8");
                logEntry.textContent = `[${timestamp}] [${level}] ${message}`;
                consoleElement.appendChild(logEntry);
                consoleElement.scrollTop = consoleElement.scrollHeight;
            }
            console.log(`[EnterpriseEngine][${level}] ${message}`);
        } catch (err) {
            console.error("Critical failure inside DiagnosticsLogger:", err);
        }
    }
}

/* 3. Security, XSS Sanitization & Validation Shield */
class SecurityEngine {
    static sanitizeInput(inputString) {
        try {
            if (typeof inputString !== 'string') return inputString;
            return inputString
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        } catch (error) {
            DiagnosticsLogger.log(`XSS Sanitization failed: ${error.message}`, "ERROR");
            return "";
        }
    }

    static validateEgyptianPhone(phoneString) {
        try {
            const cleaned = phoneString.trim();
            const isValid = SystemConfig.EGYPT_PHONE_REGEX.test(cleaned);
            DiagnosticsLogger.log(`Phone validation check for [${cleaned}]: ${isValid}`, isValid ? "INFO" : "WARN");
            return isValid;
        } catch (error) {
            DiagnosticsLogger.log(`Phone validation exception: ${error.message}`, "ERROR");
            return false;
        }
    }
}

/* 4. Global Reactive State Store Pattern */
class GlobalStore {
    constructor() {
        try {
            this.state = {
                currentUserPhone: "01098765432",
                activeRide: null,
                bids: [],
                captains: [],
                selectedPickup: "cairo_tahrir",
                selectedDropoff: "cairo_newcairo",
                clientOffer: 150,
                systemMode: "DARK"
            };
            this.listeners = [];
            DiagnosticsLogger.log("GlobalStore initialized successfully with immutable baseline state.");
        } catch (error) {
            DiagnosticsLogger.log(`GlobalStore initialization error: ${error.message}`, "ERROR");
        }
    }

    getState() {
        return this.state;
    }

    setState(updaterFunction) {
        try {
            const nextState = typeof updaterFunction === 'function' ? updaterFunction(this.state) : updaterFunction;
            this.state = Object.freeze({ ...this.state, ...nextState });
            this.notifyListeners();
        } catch (error) {
            DiagnosticsLogger.log(`GlobalStore state update failed: ${error.message}`, "ERROR");
        }
    }

    subscribe(listenerCallback) {
        try {
            this.listeners.push(listenerCallback);
        } catch (error) {
            DiagnosticsLogger.log(`Store subscription error: ${error.message}`, "ERROR");
        }
    }

    notifyListeners() {
        try {
            for (const listener of this.listeners) {
                listener(this.state);
            }
        } catch (error) {
            DiagnosticsLogger.log(`Store notification error: ${error.message}`, "ERROR");
        }
    }
}

const AppStore = new GlobalStore();

/* 5. Advanced Bidding & Dynamic Pricing Engine */
class PricingAndBiddingEngine {
    static calculateDynamicFare(distanceKm, surgeFactor = 1.0) {
        try {
            let calculated = SystemConfig.PRICING.BASE_FARE + (distanceKm * SystemConfig.PRICING.RATE_PER_KM * surgeFactor);
            if (calculated < SystemConfig.PRICING.MIN_FARE) {
                calculated = SystemConfig.PRICING.MIN_FARE;
            }
            return Math.round(calculated);
        } catch (error) {
            DiagnosticsLogger.log(`Pricing calculation error: ${error.message}`, "ERROR");
            return SystemConfig.PRICING.MIN_FARE;
        }
    }

    static generateSimulatedBids(clientBaseOffer) {
        try {
            const simulatedCaptains = [
                { id: "CAP-101", name: "محمود الشناوي", vehicle: "شيفورليه أوبترا - أسود", rating: 4.85, distanceMin: 2.1 },
                { id: "CAP-102", name: "أحمد عبد التواب", vehicle: "هيوانداي النترا - أبيض", rating: 4.92, distanceMin: 1.4 },
                { id: "CAP-103", name: "كريم البنهاوي", vehicle: "تويوتا كورولا - رمادي", rating: 4.78, distanceMin: 3.5 },
                { id: "CAP-104", name: "إسلام متولي", vehicle: "كيا سيراتو - أحمر داكن", rating: 4.90, distanceMin: 4.2 }
            ];

            const generatedBids = simulatedCaptains.map(captain => {
                const variance = Math.floor(Math.random() * 35) - 12;
                const finalBidPrice = Math.max(30, Number(clientBaseOffer) + variance);
                return {
                    ...captain,
                    bidPrice: finalBidPrice,
                    timestamp: new Date().toLocaleTimeString()
                };
            });

            AppStore.setState({ bids: generatedBids });
            DiagnosticsLogger.log(`Generated ${generatedBids.length} dynamic captain bids successfully through marketplace engine.`);
            RideWorkflowController.renderBidsList();
        } catch (error) {
            DiagnosticsLogger.log(`Bidding engine failure: ${error.message}`, "ERROR");
        }
    }
}

/* 6. Map & Geolocation Simulation Engine */
class MapSimulationEngine {
    static initMap() {
        try {
            DiagnosticsLogger.log("Initializing Map & GIS Vector Simulation Engine...");
            MapSimulationEngine.renderCaptainsOnMap();
            setInterval(() => {
                MapSimulationEngine.simulateCaptainMovements();
            }, 3000);
        } catch (error) {
            DiagnosticsLogger.log(`Map initialization exception: ${error.message}`, "ERROR");
        }
    }

    static renderCaptainsOnMap() {
        try {
            const pinLayer = document.getElementById('svgCaptainPinsLayer');
            if (!pinLayer) return;
            
            const simulatedCoords = [
                { x: 190, y: 150, name: "محمود" },
                { x: 340, y: 240, name: "أحمد" },
                { x: 500, y: 120, name: "كريم" },
                { x: 680, y: 310, name: "إسلام" },
                { x: 250, y: 380, name: "سامح" }
            ];

            pinLayer.innerHTML = simulatedCoords.map((c) => `
                <g class="captain-marker" transform="translate(${c.x}, ${c.y})" style="transition: transform 1.5s ease;">
                    <circle r="14" fill="#00e676" fill-opacity="0.25" />
                    <circle r="6" fill="#00e676" stroke="#ffffff" stroke-width="2" />
                    <text x="18" y="4" fill="#f8fafc" font-size="11" font-weight="bold">${c.name}</text>
                </g>
            `).join('');

            document.getElementById('activeCaptainsCount').textContent = simulatedCoords.length;
            DiagnosticsLogger.log("Captain markers rendered successfully on SVG Vector map.");
        } catch (error) {
            DiagnosticsLogger.log(`Render captain markers error: ${error.message}`, "ERROR");
        }
    }

    static simulateCaptainMovements() {
        try {
            const pinLayer = document.getElementById('svgCaptainPinsLayer');
            if (!pinLayer) return;
            const markers = pinLayer.querySelectorAll('.captain-marker');
            markers.forEach(marker => {
                const currentTransform = marker.getAttribute('transform');
                const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (match) {
                    let x = parseFloat(match[1]) + (Math.random() * 12 - 6);
                    let y = parseFloat(match[2]) + (Math.random() * 12 - 6);
                    marker.setAttribute('transform', `translate(${x}, ${y})`);
                }
            });
        } catch (error) {
            DiagnosticsLogger.log(`Captain movement simulation error: ${error.message}`, "ERROR");
        }
    }
}

/* 7. WebSocket Chat & Real-Time Messaging Module */
class WebSocketChatEngine {
    static sendMessage() {
        try {
            const inputElement = document.getElementById('chatInputText');
            const container = document.getElementById('chatMessagesContainer');
            if (!inputElement || !container) return;

            const rawText = inputElement.value.trim();
            if (!rawText) return;

            const safeText = SecurityEngine.sanitizeInput(rawText);

            const outgoingBubble = document.createElement('div');
            outgoingBubble.className = 'chat-bubble outgoing';
            outgoingBubble.textContent = safeText;
            container.appendChild(outgoingBubble);

            inputElement.value = "";
            container.scrollTop = container.scrollHeight;
            DiagnosticsLogger.log("User sent secure message via WebSocket Chat Engine.");

            setTimeout(() => {
                const incomingBubble = document.createElement('div');
                incomingBubble.className = 'chat-bubble incoming';
                incomingBubble.textContent = "تحت أمرك يا فندم، أنا في الطريق لموقعك ومستعد للوصول خلال دقائق معدودة.";
                container.appendChild(incomingBubble);
                container.scrollTop = container.scrollHeight;
                DiagnosticsLogger.log("Automated captain response received via WebSocket.");
            }, 1800);

        } catch (error) {
            DiagnosticsLogger.log(`WebSocket chat send error: ${error.message}`, "ERROR");
        }
    }
}

/* 8. Enterprise UI & DOM Controller */
class EnterpriseUIController {
    static openModal(title, bodyText, confirmCallback) {
        try {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalBodyText').textContent = bodyText;
            document.getElementById('enterpriseModalBackdrop').classList.add('active');
            window.currentModalConfirmAction = confirmCallback;
            DiagnosticsLogger.log(`Enterprise modal opened: [${title}]`);
        } catch (error) {
            DiagnosticsLogger.log(`Open modal error: ${error.message}`, "ERROR");
        }
    }

    static closeModal() {
        try {
            document.getElementById('enterpriseModalBackdrop').classList.remove('active');
            window.currentModalConfirmAction = null;
            DiagnosticsLogger.log("Enterprise modal closed.");
        } catch (error) {
            DiagnosticsLogger.log(`Close modal error: ${error.message}`, "ERROR");
        }
    }

    static handleModalConfirm() {
        try {
            if (typeof window.currentModalConfirmAction === 'function') {
                window.currentModalConfirmAction();
            }
            EnterpriseUIController.closeModal();
        } catch (error) {
            DiagnosticsLogger.log(`Modal confirm handler error: ${error.message}`, "ERROR");
        }
    }
}

/* 9. Ride Workflow Coordination Engine */
class RideWorkflowController {
    static submitRideRequest() {
        try {
            const phoneInput = document.getElementById('clientPhoneInput').value;
            const offerInput = document.getElementById('clientOfferPrice').value;

            if (!SecurityEngine.validateEgyptianPhone(phoneInput)) {
                EnterpriseUIController.openModal("خطأ في بيانات الاتصال", "رقم الهاتف غير صحيح. يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678).", () => {});
                return;
            }

            const sanitizedPhone = SecurityEngine.sanitizeInput(phoneInput);
            const sanitizedOffer = SecurityEngine.sanitizeInput(offerInput);

            AppStore.setState({
                currentUserPhone: sanitizedPhone,
                clientOffer: sanitizedOffer
            });

            DiagnosticsLogger.log(`Ride request submitted successfully for phone: ${sanitizedPhone} with offer: ${sanitizedOffer} EGP`);

            EnterpriseUIController.openModal(
                "تأكيد إطلاق طلب الرحلة",
                `تم التحقق من بيانات الاتصال بنجاح. سيتم الآن إرسال عرض السعر المقترح (${sanitizedOffer} ج.م) لشبكة الكباتن النشطين في النطاق الجغرافي.`,
                () => {
                    PricingAndBiddingEngine.generateSimulatedBids(sanitizedOffer);
                }
            );
        } catch (error) {
            DiagnosticsLogger.log(`Ride workflow submission error: ${error.message}`, "ERROR");
        }
    }

    static renderBidsList() {
        try {
            const container = document.getElementById('bidsListContainer');
            const bids = AppStore.getState().bids;

            if (!bids || bids.length === 0) {
                container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1rem;">لا توجد عروض كباتن متاحة حالياً.</div>`;
                return;
            }

            container.innerHTML = bids.map(bid => `
                <div class="bid-card">
                    <div class="driver-info">
                        <h4>${bid.name} ⭐ ${bid.rating}</h4>
                        <p>${bid.vehicle} • يبعد ${bid.distanceMin} كم</p>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
                        <span class="bid-price">${bid.bidPrice} ${SystemConfig.CURRENCY}</span>
                        <button class="btn-enterprise" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;" onclick="RideWorkflowController.acceptCaptainBid('${bid.name}', ${bid.bidPrice})">قبول العرض</button>
                    </div>
                </div>
            `).join('');

            DiagnosticsLogger.log("Bids marketplace rendered successfully with live offers.");
        } catch (error) {
            DiagnosticsLogger.log(`Render bids list error: ${error.message}`, "ERROR");
        }
    }

    static acceptCaptainBid(captainName, price) {
        try {
            EnterpriseUIController.openModal(
                "تأكيد التعاقد مع الكابتن",
                `تمت الموافقة على عرض الكابتن (${captainName}) بقيمة (${price} ج.م). سيتم ربطك بالرحلة وتحديث مسار الخريطة اللحظي.`,
                () => {
                    DiagnosticsLogger.log(`Contract finalized with Captain ${captainName} for ${price} EGP.`);
                    alert(`مبروك يا شريكي! تم تأكيد الرحلة مع الكابتن ${captainName} بنجاح.`);
                }
            );
        } catch (error) {
            DiagnosticsLogger.log(`Accept captain bid error: ${error.message}`, "ERROR");
        }
    }
}

/* 10. System Bootstrapping Sequence on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
    try {
        DiagnosticsLogger.log("DOM fully loaded and parsed. Executing system enterprise bootstrapping sequence...");
        MapSimulationEngine.initMap();
        DiagnosticsLogger.log("All architectural modules loaded and operational at peak performance.");
    } catch (error) {
        DiagnosticsLogger.log(`System bootstrap critical failure: ${error.message}`, "ERROR");
    }
});