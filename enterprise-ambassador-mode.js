/* ==========================================================================
   IN-DRIVE EGYPT - AMBASSADOR & VIP PROTOCOL ENGINE v8.0
   ========================================================================== */

class AmbassadorProtocolEngine {
    static initAmbassadorMode() {
        try {
            // إضافة زر التبديل لوضع السفير بجانب الأزرار السابقة في الهيدر
            const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
            if (headerContainer && !document.getElementById('ambassadorModeBtn')) {
                const ambBtn = document.createElement('button');
                ambBtn.id = 'ambassadorModeBtn';
                ambBtn.className = 'btn-enterprise btn-secondary';
                ambBtn.style.borderColor = '#d97706';
                ambBtn.style.color = '#fbbf24';
                ambBtn.innerHTML = '🛡️ وضع السفير (VIP Protocol)';
                ambBtn.onclick = () => AmbassadorProtocolEngine.toggleAmbassadorMode();
                headerContainer.insertBefore(ambBtn, headerContainer.firstChild);
                DiagnosticsLogger.log("Ambassador & VIP Protocol button injected successfully.", "INFO");
            }
        } catch (error) {
            DiagnosticsLogger.log(`Ambassador mode init error: ${error.message}`, "ERROR");
        }
    }

    static toggleAmbassadorMode() {
        const isAmbassadorActive = window.isAmbassadorMode || false;
        window.isAmbassadorMode = !isAmbassadorActive;

        const mainContainer = document.querySelector('.enterprise-main-container');
        const brandLogo = document.querySelector('.brand-logo');

        if (window.isAmbassadorMode) {
            DiagnosticsLogger.log("System switched to AMBASSADOR & VIP PROTOCOL MODE.", "INFO");
            
            // تخصيص الهوية البصرية للوضع الدبلوماسي (ألوان ذهبية وملكية)
            document.documentElement.style.setProperty('--primary-color', '#fbbf24');
            document.documentElement.style.setProperty('--primary-hover', '#d97706');
            document.documentElement.style.setProperty('--primary-glow', 'rgba(251, 191, 36, 0.25)');

            if (brandLogo) {
                brandLogo.innerHTML = `<span>🏛️</span> In-Drive VIP / Ambassador Core`;
            }

            // تعديل واجهة الحجز لتناسب نقل الوفود والسفراء
            const panelTitle = document.querySelector('.panel-section .panel-title');
            if (panelTitle) {
                panelTitle.innerHTML = "🏛️ حجز موكب ومركبة سفير (VIP Fleet)";
            }

            const pickupSelect = document.getElementById('pickupSelect');
            if (pickupSelect) {
                pickupSelect.innerHTML = `
                    <option value="embassy_cairo">السفارة الدبلوماسية، الزمالك</option>
                    <option value="ministry_foreign">وزارة الخارجية، كورنيش النيل</option>
                    <option value="cairo_airport_vip">مطار القاهرة الدولي - صالة كبار الزوار (VIP)</option>
                    <option value="beheira_protocol">استراحة محافظة البحيرة البروتوكولية</option>
                `;
            }

            const dropoffSelect = document.getElementById('dropoffSelect');
            if (dropoffSelect) {
                dropoffSelect.innerHTML = `
                    <option value="new_capital_gov">العاصمة الإدارية - الحي الدبلوماسي</option>
                    <option value="un_hq">مقر المنظمات الدولية، المعادي</option>
                    <option value="alex_library">مكتبة الإسكندرية - قاعة المؤتمرات</option>
                `;
            }

            if (typeof EnterpriseNotificationEngine !== 'undefined') {
                EnterpriseNotificationEngine.showToast("تفعيل البروتوكول الدبلوماسي", "تم تفعيل نظام السفراء والمواكب الرسمية بمعايير أمان وتشفير عالية.", "SUCCESS");
            }
            
            alert("تم التحويل بنجاح إلى 'وضع السفير / الوفود الرسمية'. تم تفعيل أسطول السيارات الفاخرة وبروتوكولات الحراسة والمتابعة المركزية.");

        } else {
            DiagnosticsLogger.log("System reverted from Ambassador mode to standard layout.", "INFO");
            
            // استعادة الألوان الأصلية
            document.documentElement.style.setProperty('--primary-color', '#00e676');
            document.documentElement.style.setProperty('--primary-hover', '#00c853');
            document.documentElement.style.setProperty('--primary-glow', 'rgba(0, 230, 118, 0.25)');

            if (brandLogo) {
                brandLogo.innerHTML = `<span>🛡️</span> In-Drive Enterprise`;
            }

            if (typeof EnterpriseNotificationEngine !== 'undefined') {
                EnterpriseNotificationEngine.showToast("العودة للوضع العادي", "تم الخروج من وضع السفير والعودة للتشغيل القياسي.", "WARN");
            }
        }
    }
}

/* Bootstrapping Ambassador Mode on Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        AmbassadorProtocolEngine.initAmbassadorMode();
    }, 2500);
});