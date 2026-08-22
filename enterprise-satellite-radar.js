/* ==========================================================================
   IN-DRIVE EGYPT - SATELLITE ORBITAL & RADAR TRACKING ENGINE v11.0
   ========================================================================== */

class SatelliteRadarEngine {
    static initSatelliteRadar() {
        try {
            // إضافة زر تفعيل رادار الأقمار الصناعية في الهيدر
            const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
            if (headerContainer && !document.getElementById('satelliteRadarBtn')) {
                const satBtn = document.createElement('button');
                satBtn.id = 'satelliteRadarBtn';
                satBtn.className = 'btn-enterprise btn-secondary';
                satBtn.style.borderColor = '#a855f7';
                satBtn.style.color = '#c084fc';
                satBtn.innerHTML = '🛰️ رادار الأقمار الصناعية (Sat-Radar)';
                satBtn.onclick = () => SatelliteRadarEngine.toggleSatelliteOverlay();
                headerContainer.insertBefore(satBtn, headerContainer.firstChild);
                DiagnosticsLogger.log("Satellite Orbital Radar engine initialized.", "INFO");
            }
        } catch (error) {
            DiagnosticsLogger.log(`Satellite radar init error: ${error.message}`, "ERROR");
        }
    }

    static toggleSatelliteOverlay() {
        try {
            const workspaceMap = document.getElementById('simulationMap');
            if (!workspaceMap) return;

            let radarContainer = document.getElementById('orbitalRadarScanlines');
            if (radarContainer) {
                radarContainer.remove();
                if (typeof EnterpriseNotificationEngine !== 'undefined') {
                    EnterpriseNotificationEngine.showToast("إيقاف الرادار المداري", "تم إيقاف مسح الأقمار الصناعية الحي.", "WARN");
                }
                return;
            }

            radarContainer = document.createElement('div');
            radarContainer.id = 'orbitalRadarScanlines';
            radarContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5;
                background: radial-gradient(circle at center, rgba(168, 85, 247, 0.05) 0%, rgba(3, 7, 18, 0.4) 80%);
                overflow: hidden;
            `;

            // إضافة خط المسح الراداري المتحرك (Scanline)
            const scanline = document.createElement('div');
            scanline.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, transparent, #c084fc, transparent);
                box-shadow: 0 0 15px #a855f7;
                animation: scanlineMove 4s linear infinite;
            `;

            // حقنkeyframes للحركة في المستند إذا لم تكن موجودة
            if (!document.getElementById('satKeyframes')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'satKeyframes';
                styleSheet.textContent = `
                    @keyframes scanlineMove {
                        0% { top: 0%; }
                        50% { top: 100%; }
                        100% { top: 0%; }
                    }
                `;
                document.head.appendChild(styleSheet);
            }

            radarContainer.appendChild(scanline);
            workspaceMap.appendChild(radarContainer);

            if (typeof EnterpriseNotificationEngine !== 'undefined') {
                EnterpriseNotificationEngine.showToast("تم تفعيل الأقمار الصناعية", "جاري تتبع المتاجر والمركبات عبر القمر الصناعي المصري EGY-SAT 7.", "SUCCESS");
            }
            DiagnosticsLogger.log("Orbital satellite radar overlay activated on map workspace.", "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`Toggle satellite overlay error: ${error.message}`, "ERROR");
        }
    }
}

/* Bootstrapping Satellite Radar on Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SatelliteRadarEngine.initSatelliteRadar();
    }, 3400);
});