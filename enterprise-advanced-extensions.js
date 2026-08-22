/* ==========================================================================
   IN-DRIVE EGYPT - ADVANCED EXTENSIONS (GPS & CAPTAIN MODE) v5.2
   ========================================================================== */

class AdvancedEnterpriseEngine {
    
    /* 1. Real GPS Geolocation Tracking Engine */
    static initRealGPS() {
        if ("geolocation" in navigator) {
            DiagnosticsLogger.log("Requesting real-time device GPS coordinates...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    DiagnosticsLogger.log(`Real GPS Acquired -> Lat: ${userLat.toFixed(4)}, Lng: ${userLng.toFixed(4)}`, "INFO");
                    
                    // تحديث واجهة الخريطة بالإحداثيات الحقيقية
                    const statusBadge = document.getElementById('systemStatusIndicator');
                    if (statusBadge) {
                        statusBadge.innerHTML = `<span>●</span> GPS حقيقي مفعل (${userLat.toFixed(2)}, ${userLng.toFixed(2)})`;
                    }
                },
                (error) => {
                    DiagnosticsLogger.log(`GPS Location access denied or failed: ${error.message}. Falling back to default Beheira/Cairo grid.`, "WARN");
                },
                { timeout: 10000, maximumAge: 60000 }
            );
        } else {
            DiagnosticsLogger.log("Geolocation API is not supported by this browser.", "ERROR");
        }
    }

    /* 2. Captain Mode Switcher (Driver Simulator Engine) */
    static toggleCaptainMode() {
        const isDriverModeActive = window.isDriverMode || false;
        window.isDriverMode = !isDriverModeActive;

        const bookingPanel = document.querySelector('.enterprise-panel');
        if (!bookingPanel) return;

        if (window.isDriverMode) {
            DiagnosticsLogger.log("Switched interface view to CAPTAIN MODE (Driver Portal).", "INFO");
            bookingPanel.style.borderRight = "4px solid var(--primary-color)";
            
            // تحويل لوحة الحجز إلى لوحة استقبال طلبات الركاب للكابتن
            const sectionTitle = bookingPanel.querySelector('.panel-title');
            if (sectionTitle) sectionTitle.innerHTML = "🚗 لوحة تحكم الكابتن (Driver Portal - نشط)";
            
            const submitBtn = bookingPanel.querySelector('.btn-enterprise');
            if (submitBtn) {
                submitBtn.textContent = "تحديث الحالة: متاح للطلبات (Online)";
                submitBtn.style.backgroundColor = "#3b82f6";
            }

            alert("أهلاً بك يا كابتن! تم تحويل الواجهة لبيئة عمل السائق. يمكنك الآن استقبال مزايدات الركاب في نطاقك الجغرافي.");
        } else {
            DiagnosticsLogger.log("Switched interface view back to RIDER MODE.", "INFO");
            bookingPanel.style.borderRight = "none";
            
            const sectionTitle = bookingPanel.querySelector('.panel-title');
            if (sectionTitle) sectionTitle.innerHTML = "📍 طلب رحلة جديدة (Ride Booking)";
            
            const submitBtn = bookingPanel.querySelector('.btn-enterprise');
            if (submitBtn) {
                submitBtn.textContent = "إرسال الطلب وإطلاق المزايدة";
                submitBtn.style.backgroundColor = "var(--primary-color)";
            }
        }
    }
}

/* Auto-Execute extensions on load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        AdvancedEnterpriseEngine.initRealGPS();
        
        // إضافة زر تبديل الوضع في الهيدر برمجياً
        const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
        if (headerContainer) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn-enterprise btn-secondary';
            toggleBtn.innerHTML = '🔄 تبديل وضع الكابتن';
            toggleBtn.onclick = () => AdvancedEnterpriseEngine.toggleCaptainMode();
            headerContainer.insertBefore(toggleBtn, headerContainer.firstChild);
        }
    }, 1000);
});