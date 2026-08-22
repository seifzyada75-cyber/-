/* ==========================================================================
   IN-DRIVE EGYPT - ORBITAL WEATHER & ATMOSPHERIC TELEMETRY v12.0
   ========================================================================== */

class OrbitalWeatherEngine {
    static initWeatherModule() {
        try {
            // إضافة زر لوحة الطقس الفضائي في الهيدر
            const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
            if (headerContainer && !document.getElementById('orbitalWeatherBtn')) {
                const weatherBtn = document.createElement('button');
                weatherBtn.id = 'orbitalWeatherBtn';
                weatherBtn.className = 'btn-enterprise btn-secondary';
                weatherBtn.style.borderColor = '#0284c7';
                weatherBtn.style.color = '#38bdf8';
                weatherBtn.innerHTML = '🌤️ الطقس الفضائي والمدار (Weather)';
                weatherBtn.onclick = () => OrbitalWeatherEngine.toggleWeatherDashboard();
                headerContainer.insertBefore(weatherBtn, headerContainer.firstChild);
                DiagnosticsLogger.log("Orbital Weather & Atmospheric Telemetry module initialized.", "INFO");
            }
        } catch (error) {
            DiagnosticsLogger.log(`Orbital weather init error: ${error.message}`, "ERROR");
        }
    }

    static toggleWeatherDashboard() {
        try {
            const workspace = document.querySelector('.workspace-center');
            if (!workspace) return;

            let weatherOverlay = document.getElementById('orbitalWeatherOverlay');
            if (weatherOverlay) {
                weatherOverlay.remove();
                if (typeof EnterpriseNotificationEngine !== 'undefined') {
                    EnterpriseNotificationEngine.showToast("إغلاق لوحة الطقس", "تم إيقاف عرض رصد الغلاف الجوي.", "WARN");
                }
                return;
            }

            weatherOverlay = document.createElement('div');
            weatherOverlay.id = 'orbitalWeatherOverlay';
            weatherOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(3, 7, 18, 0.94);
                backdrop-filter: blur(12px);
                z-index: 105;
                display: flex;
                flex-direction: column;
                padding: 2.5rem;
                gap: 1.5rem;
                color: var(--text-main);
                overflow-y: auto;
            `;

            weatherOverlay.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                    <div>
                        <h2 style="color: #38bdf8; font-weight: 900;">🌤️ محطة القياسات الجوية والمدارية (Atmospheric Core)</h2>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">رصد الظروف المناخية، تشويش الإشارات، ودرجات حرارة الأقمار فوق الأجواء المصرية.</p>
                    </div>
                    <button class="btn-enterprise" style="background-color: #ef4444; padding: 0.5rem 1rem;" onclick="document.getElementById('orbitalWeatherOverlay').remove()">إغلاق المحطة</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div class="panel-section" style="background: var(--bg-surface);">
                        <div class="panel-title" style="font-size: 1rem;">🌡️ درجة حرارة الغلاف (القاهرة)</div>
                        <p style="color: #38bdf8; font-weight: 800; font-size: 1.5rem;">34°C - مستقر</p>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">نسبة الرطوبة: 42%</span>
                    </div>
                    <div class="panel-section" style="background: var(--bg-surface);">
                        <div class="panel-title" style="font-size: 1rem;">🛰️ حالة المدار الفضائي</div>
                        <p style="color: #10b981; font-weight: 800; font-size: 1.5rem;">مثالي (Optimal)</p>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">لا توجد عواصف شمسية مؤثرة.</span>
                    </div>
                    <div class="panel-section" style="background: var(--bg-surface);">
                        <div class="panel-title" style="font-size: 1rem;">💨 سرعة واتجاه الرياح</div>
                        <p style="color: #f59e0b; font-weight: 800; font-size: 1.5rem;">14 كم/س (شمالية)</p>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">رؤية أفقية ممتازة للملاحة.</span>
                    </div>
                </div>

                <div class="panel-section" style="background: var(--bg-surface); flex: 1;">
                    <div class="panel-title">📡 بث قياسات الغلاف الجوي المباشر (Atmospheric Stream)</div>
                    <div class="diagnostics-console" style="height: 180px; font-size: 0.85rem;">
                        <div>[23:20:01] [ATMOS] EGY-SAT telemetry link verified. Atmospheric density normal.</div>
                        <div>[23:20:06] [WEATHER] Regional nodes in Beheira & Cairo reporting zero interference.</div>
                        <div>[23:20:12] [ORBIT] Satellite inclination angle locked at 98.2 degrees.</div>
                    </div>
                </div>
            `;

            workspace.appendChild(weatherOverlay);

            if (typeof EnterpriseNotificationEngine !== 'undefined') {
                EnterpriseNotificationEngine.showToast("تفعيل الطقس الفضائي", "تم تحميل محطة القياسات والتحليلات الجوية بنجاح.", "SUCCESS");
            }
            DiagnosticsLogger.log("Orbital Weather dashboard opened successfully.", "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`Orbital weather dashboard error: ${error.message}`, "ERROR");
        }
    }
}

/* Bootstrapping Weather Module on Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        OrbitalWeatherEngine.initWeatherModule();
    }, 3700);
});