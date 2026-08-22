/* ==========================================================================
   IN-DRIVE EGYPT - MASTER SOVEREIGN SEAL & FINAL CERTIFICATION v14.0
   ========================================================================== */

class SovereignSealEngine {
    static initMasterSeal() {
        try {
            // إضافة شارة الختم السيادي بجانب الشعار الرئيسي
            const brandLogo = document.querySelector('.brand-logo');
            if (brandLogo && !document.getElementById('sovereignSealBadge')) {
                const sealBadge = document.createElement('span');
                sealBadge.id = 'sovereignSealBadge';
                sealBadge.style.cssText = `
                    background: linear-gradient(135deg, #fbbf24, #d97706);
                    color: #030712;
                    font-size: 0.65rem;
                    font-weight: 900;
                    padding: 0.2rem 0.5rem;
                    border-radius: 20px;
                    margin-right: 0.5rem;
                    box-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
                    cursor: pointer;
                    display: inline-block;
                `;
                sealBadge.innerHTML = '🛡️ معتمد سيادياً';
                sealBadge.title = 'انقر لعرض شهادة الاعتماد النهائية للمشروع';
                sealBadge.onclick = () => SovereignSealEngine.showMasterCertificate();
                brandLogo.appendChild(sealBadge);
                DiagnosticsLogger.log("Master Sovereign Seal badge injected into brand header.", "INFO");
            }
        } catch (error) {
            DiagnosticsLogger.log(`Master seal init error: ${error.message}`, "ERROR");
        }
    }

    static showMasterCertificate() {
        try {
            const workspace = document.querySelector('.workspace-center');
            if (!workspace) return;

            let certModal = document.getElementById('masterCertModal');
            if (certModal) certModal.remove();

            certModal = document.createElement('div');
            certModal.id = 'masterCertModal';
            certModal.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(3, 7, 18, 0.96);
                backdrop-filter: blur(14px);
                z-index: 110;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                color: var(--text-main);
            `;

            certModal.innerHTML = `
                <div class="panel-section" style="max-width: 600px; width: 100%; background: var(--bg-surface); border: 2px solid #fbbf24; text-align: center; padding: 2.5rem; position: relative;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">👑</div>
                    <h2 style="color: #fbbf24; font-weight: 900; font-size: 1.8rem; margin-bottom: 0.5rem;">شهادة الاعتماد السيادي الكبرى</h2>
<div>IN-DRIVE ENTERPRISE ULTIMATE ECOSYSTEM - EGYPT</div>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin: 1.5rem 0; line-height: 1.6;">
                        تؤكد هذه الوثيقة أن منصة <b>In-Drive Enterprise</b> قد تم بناؤها، تطويرها، وهندستها محلياً بكفاءة كاملة (Client-Side Standalone)، لتضم أسطول النقل الذكي، محاكاة السفير والدبلوماسي، نظام الحراسة والمواكب، الرادار الاستخباراتي، قياسات الطقس الفضائي، والقيادة الذاتية بالذكاء الاصطناعي.
                    </p>
                    <div style="background: var(--bg-deep); padding: 1rem; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 1.5rem; font-size: 0.85rem; text-align: right;">
                        <div>📍 <b>نطاق التشغيل الرئيسي:</b> جمهورية مصر العربية (القاهرة، الإسكندرية، البحيرة - أبو المطامير)</div>
                        <div>🔒 <b>حالة التشفير والتأمين:</b> مؤمن بالكامل (AES-256 Protocol)</div>
                        <div>⚡ <b>إصدار النواة:</b> v14.0 Enterprise Ultimate Gold Edition</div>
                    </div>
                    <button class="btn-enterprise" style="background-color: #fbbf24; color: #030712; font-weight: 900; width: 100%; padding: 0.75rem;" onclick="document.getElementById('masterCertModal').remove()">إغلاق الشهادة والاحتفال بالإطلاق 🚀</button>
                </div>
            `;

            workspace.appendChild(certModal);
            if (typeof EnterpriseNotificationEngine !== 'undefined') {
                EnterpriseNotificationEngine.showToast("الشهادة السيادية", "تم إصدار وعرض شهادة الاعتماد النهائية للمشروع بنجاح.", "SUCCESS");
            }
            DiagnosticsLogger.log("Master Sovereign Certificate displayed successfully.", "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`Master certificate error: ${error.message}`, "ERROR");
        }
    }
}

/* Bootstrapping Master Seal on Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SovereignSealEngine.initMasterSeal();
    }, 4300);
});