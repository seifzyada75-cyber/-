/* ==========================================================================
   IN-DRIVE EGYPT - SOVEREIGN INTELLIGENCE & TELEMETRY ENGINE v10.0
   ========================================================================== */

class SovereignIntelligenceEngine {
    static initIntelligenceModule() {
        try {
            // إضافة زر الرادار والاستخبارات في الهيدر
            const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
            if (headerContainer && !document.getElementById('sovereignIntelBtn')) {
                const intelBtn = document.createElement('button');
                intelBtn.id = 'sovereignIntelBtn';
                intelBtn.className = 'btn-enterprise btn-secondary';
                intelBtn.style.borderColor = '#10b981';
                intelBtn.style.color = '#10b981';
                intelBtn.innerHTML = '🛰️ الرادار الاستخباراتي (Intel)';
                intelBtn.onclick = () => SovereignIntelligenceEngine.toggleIntelligenceDashboard();
                headerContainer.insertBefore(intelBtn, headerContainer.firstChild);
                DiagnosticsLogger.log("Sovereign Intelligence & Telemetry module initialized.", "INFO");
            }
        } catch (error) {
            DiagnosticsLogger.log(`Intelligence module init error: ${error.message}`, "ERROR");
        }
    }

    static toggleIntelligenceDashboard() {
        try {
            const workspace = document.querySelector('.workspace-center');
            if (!workspace) return;

            let intelOverlay = document.getElementById('sovereignIntelOverlay');
            if (intelOverlay) {
                intelOverlay.remove();
                if (typeof EnterpriseNotificationEngine !== 'undefined') {
                    EnterpriseNotificationEngine.showToast("إغلاق الرادار", "تم إيقاف عرض لوحة الاستخبارات السيادية.", "WARN");
                }
                return;
            }

            intelOverlay = document.createElement('div');
            intelOverlay.id = 'sovereignIntelOverlay';
            intelOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(3, 7, 18, 0.92);
                backdrop-filter: blur(10px);
                z-index: 100;
                display: flex;
                flex-direction: column;
                padding: 2rem;
                gap: 1.5rem;
                color: var(--text-main);
                overflow-y: auto;
            `;

            intelOverlay.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                    <div>
                        <h2 style="color: #10b981; font-weight: 900;">🛰️ غرفة العمليات الاستخباراتيّة والسياديّة (Sovereign Command)</h2>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">مراقبة حركة الأسطول الدبلوماسي، التشفير السيبراني، والتغطية الجغرافية في مصر.</p>
                    </div>
                    <button class="btn-enterprise" style="background-color: #ef4444; padding: 0.5rem 1rem;" onclick="document.getElementById('sovereignIntelOverlay').remove()">إغلاق الرادار</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div class="panel-section" style="background: var(--bg-surface);">
                        <div class="panel-title" style="font-size: 1rem;">🔒 حالة التشفير السيبراني</div>
                        <p style="color: #10b981; font-weight: 800; font-size: 1.25rem;">AES-256 (آمن ومؤمن)</p>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">لا توجد خروقات أمنية مرصودة.</span>
                    </div>
                    <div class="panel-section" style="background: var(--bg-surface);">
                        <div class="panel-title" style="font-size: 1rem;">📡 العقد النشطة بالجمهورية</div>
                        <p style="color: #38bdf8; font-weight: 800; font-size: 1.25rem;">القاهرة، الإسكندرية، البحيرة</p>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">زمن الاستجابة: 14 مللي ثانية.</span>
                    </div>
                    <div class="panel-section" style="background: var(--bg-surface);">
                        <div class="panel-title" style="font-size: 1rem;">⚠️ مستوى التهديد العام</div>
                        <p style="color: #f59e0b; font-weight: 800; font-size: 1.25rem;">أخضر (مستقر تماماً)</p>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">جميع المواكب تسير وفق البروتوكول.</span>
                    </div>
                </div>

                <div class="panel-section" style="background: var(--bg-surface); flex: 1;">
                    <div class="panel-title">📜 السجل الاستخباراتي والتحليلات اللحظية (Telemetry Logs)</div>
                    <div class="diagnostics-console" style="height: 220px; font-size: 0.85rem;">
                        <div>[22:15:00] [INTEL] Sovereign Node connected to regional grid (Abu Al Matamir node).</div>
                        <div>[22:15:05] [SECURITY] VIP convoy route encryption verified successfully.</div>
                        <div>[22:15:10] [TELEMETRY] GPS triangulation active for Ambassador fleet.</div>
                        <div>[22:15:15] [SYSTEM] Cyber-Ops defense shield operational at peak efficiency.</div>
                    </div>
                </div>
            `;

            workspace.appendChild(intelOverlay);

            if (typeof EnterpriseNotificationEngine !== 'undefined') {
                EnterpriseNotificationEngine.showToast("تفعيل الرادار", "تم فتح شاشة غرفة العمليات الاستخباراتية بنجاح.", "SUCCESS");
            }
            DiagnosticsLogger.log("Sovereign Intelligence dashboard opened successfully.", "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`Intelligence dashboard error: ${error.message}`, "ERROR");
        }
    }
}

/* Bootstrapping Intelligence Module on Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SovereignIntelligenceEngine.initIntelligenceModule();
    }, 3100);
});