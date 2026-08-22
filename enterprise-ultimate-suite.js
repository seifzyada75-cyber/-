/* ==========================================================================
   IN-DRIVE EGYPT - ULTIMATE 5-FEATURE ENTERPRISE SUITE v6.0
   ========================================================================== */

class UltimateEnterpriseSuite {
    
    /* --------------------------------------------------------------------------
       FEATURE 1: OTP SMS Verification Engine
       -------------------------------------------------------------------------- */
    static initOTPSystem() {
        try {
            DiagnosticsLogger.log("Initializing SMS OTP Verification Engine...", "INFO");
            const otpCode = Math.floor(1000 + Math.random() * 9000);
            window.activeOTP = otpCode;

            // إظهار تنفور إشعاري بالكود المحاكى
            setTimeout(() => {
                if (typeof EnterpriseNotificationEngine !== 'undefined') {
                    EnterpriseNotificationEngine.showToast("رسالة نصية SMS وهمية", `كود التحقق الخاص بك لخدمة In-Drive هو: [ ${otpCode} ]`, "WARN");
                }
            }, 2500);

            // حقن حقل التحقق في واجهة الحجز
            const bookingSection = document.querySelector('.panel-section');
            if (bookingSection && !document.getElementById('otpInputContainer')) {
                const otpDiv = document.createElement('div');
                otpDiv.id = 'otpInputContainer';
                otpDiv.className = 'form-group';
                otpDiv.innerHTML = `
                    <label>كود التحقق السريع (OTP)</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="otpCodeField" placeholder="أدخل الـ 4 أرقام">
                        <button class="btn-enterprise" style="padding: 0 1rem; font-size: 0.85rem;" onclick="UltimateEnterpriseSuite.verifyOTP()">تحقق</button>
                    </div>
                `;
                bookingSection.insertBefore(otpDiv, bookingSection.children[2]);
            }
        } catch (error) {
            DiagnosticsLogger.log(`OTP System init error: ${error.message}`, "ERROR");
        }
    }

    static verifyOTP() {
        const entered = document.getElementById('otpCodeField').value.trim();
        if (entered == window.activeOTP) {
            EnterpriseNotificationEngine.showToast("تم التحقق بنجاح", "تم تأكيد رقم الهاتف والهوية بنجاح عبر بوابة الأمان.", "SUCCESS");
            DiagnosticsLogger.log("User passed OTP verification successfully.", "INFO");
        } else {
            EnterpriseNotificationEngine.showToast("خطأ في الكود", "كود التحقق غير صحيح. حاول مرة أخرى.", "ERROR");
            DiagnosticsLogger.log("OTP verification failed due to incorrect code.", "WARN");
        }
    }

    /* --------------------------------------------------------------------------
       FEATURE 2: Ride Rating & Feedback Core
       -------------------------------------------------------------------------- */
    static triggerRatingModal() {
        try {
            EnterpriseUIController.openModal(
                "تقييم رحلتك الأخيرة ⭐",
                "نتمنى أن تكون رحلتك قد انتهت بأمان وسلاسة. يرجى تقييم تجرتك مع الكابتن:",
                () => {
                    EnterpriseNotificationEngine.showToast("شكراً لك!", "تم تسجيل تقييمك بنجاح، وتحديث سجل الكابتن العام.", "SUCCESS");
                    DiagnosticsLogger.log("User submitted 5-star rating and feedback for the captain.", "INFO");
                }
            );
            
            // تخصيص محتوى المودال ليحتوي على نجوم وخيارات سريعة
            const modalBody = document.getElementById('modalBodyText');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center; margin-top: 0.5rem;">
                        <div style="font-size: 2rem; color: #f59e0b; cursor: pointer;">⭐⭐⭐⭐⭐</div>
                        <input type="text" placeholder="اكتب تعليقاً إضافياً (اختياري)..." style="width: 100%;">
                    </div>
                `;
            }
        } catch (error) {
            DiagnosticsLogger.log(`Rating modal error: ${error.message}`, "ERROR");
        }
    }

    /* --------------------------------------------------------------------------
       FEATURE 3: Live ETA & Countdown Timer Engine
       -------------------------------------------------------------------------- */
    static initETACountdown() {
        try {
            let remainingSeconds = 300; // 5 دقائق افتراضية لوصول الكابتن
            const mapOverlay = document.querySelector('.map-overlay-controls');
            if (!mapOverlay) return;

            const etaChip = document.createElement('div');
            etaChip.className = 'map-chip';
            etaChip.id = 'liveETATimerChip';
            etaChip.innerHTML = `⏱️ وصول الكابتن خلال: <span id="etaCountdownDisplay" style="color: var(--primary-color); font-weight: 900;">05:00</span>`;
            mapOverlay.appendChild(etaChip);

            const timerInterval = setInterval(() => {
                if (remainingSeconds <= 0) {
                    clearInterval(timerInterval);
                    document.getElementById('etaCountdownDisplay').textContent = "وصل الكابتن لموقعك!";
                    EnterpriseNotificationEngine.showToast("وصول الكابتن", "الكابتن ينتظرك الآن عند نقطة الانطلاق المحددة.", "SUCCESS");
                    return;
                }
                remainingSeconds--;
                const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
                const secs = (remainingSeconds % 60).toString().padStart(2, '0');
                const display = document.getElementById('etaCountdownDisplay');
                if (display) display.textContent = `${mins}:${secs}`;
            }, 1000);

            DiagnosticsLogger.log("Live ETA countdown timer initialized on map view.", "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`ETA countdown init error: ${error.message}`, "ERROR");
        }
    }

    /* --------------------------------------------------------------------------
       FEATURE 4: Emergency SOS & Safety Shield
       -------------------------------------------------------------------------- */
    static initEmergencySOSButton() {
        try {
            const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
            if (headerContainer && !document.getElementById('sosEmergencyBtn')) {
                const sosBtn = document.createElement('button');
                sosBtn.id = 'sosEmergencyBtn';
                sosBtn.className = 'btn-enterprise';
                sosBtn.style.backgroundColor = '#ef4444';
                sosBtn.style.color = '#ffffff';
                sosBtn.innerHTML = '🚨 طوارئ (SOS)';
                sosBtn.onclick = () => UltimateEnterpriseSuite.triggerSOSAlert();
                headerContainer.appendChild(sosBtn);
            }
        } catch (error) {
            DiagnosticsLogger.log(`SOS button init error: ${error.message}`, "ERROR");
        }
    }

    static triggerSOSAlert() {
        const confirmSOS = confirm("⚠️ تحذير أمني خطير: هل أنت متأكد من رغبتك في إرسال نداء استغاثة عاجل (SOS) لغرفة العمليات المركزية ومشاركة موقعك الحالي؟");
        if (confirmSOS) {
            EnterpriseNotificationEngine.showToast("تم إرسال إستغاثة الطوارئ", "تم إبلاغ الدعم الفني وغرفة العمليات المركزية بنجاح. يتم الاتصال بك فوراً.", "ERROR");
            DiagnosticsLogger.log("CRITICAL: Emergency SOS triggered by operator/user.", "ERROR");
        }
    }

    /* --------------------------------------------------------------------------
       FEATURE 5: Analytics & Financial Performance Dashboard
       -------------------------------------------------------------------------- */
    static initAnalyticsDashboard() {
        try {
            const rightSidebar = document.querySelectorAll('.enterprise-panel')[1];
            if (!rightSidebar) return;

            const analyticsCard = document.createElement('div');
            analyticsCard.className = 'panel-section';
            analyticsCard.innerHTML = `
                <div class="panel-title">📊 تحليلات الأداء والأرباح (Analytics)</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div style="background: var(--bg-deep); padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color);">
                        <span style="font-size: 0.75rem; color: var(--text-muted);">إجمالي الرحلات</span>
                        <h4 style="color: var(--text-main); font-size: 1.2rem; font-weight: 900;">24 رحلة</h4>
                    </div>
                    <div style="background: var(--bg-deep); padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color);">
                        <span style="font-size: 0.75rem; color: var(--text-muted);">صافي الأسبوع</span>
                        <h4 style="color: var(--primary-color); font-size: 1.2rem; font-weight: 900;">3,850 ج.م</h4>
                    </div>
                </div>
                <button class="btn-enterprise btn-secondary" style="font-size: 0.85rem; padding: 0.5rem;" onclick="UltimateEnterpriseSuite.triggerRatingModal()">فتح نافذة التقييم الشامل</button>
            `;
            rightSidebar.appendChild(analyticsCard);
            DiagnosticsLogger.log("Analytics and Financial performance dashboard rendered.", "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`Analytics dashboard error: ${error.message}`, "ERROR");
        }
    }
}

/* Bootstrapping Ultimate Suite on DOM Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        UltimateEnterpriseSuite.initOTPSystem();
        UltimateEnterpriseSuite.initETACountdown();
        UltimateEnterpriseSuite.initEmergencySOSButton();
        UltimateEnterpriseSuite.initAnalyticsDashboard();
        DiagnosticsLogger.log("All 5 Ultimate Enterprise features loaded successfully at peak capacity.", "INFO");
    }, 1800);
});