/* ==========================================================================
   IN-DRIVE EGYPT - VIP ESCORT & CONVOY MANAGEMENT ENGINE v9.0
   ========================================================================== */

class EscortConvoyEngine {
    static initConvoyModule() {
        try {
            // إضافة زر تفعيل الموكب المرافق بجانب الأزرار في الهيدر
            const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
            if (headerContainer && !document.getElementById('convoyModuleBtn')) {
                const convoyBtn = document.createElement('button');
                convoyBtn.id = 'convoyModuleBtn';
                convoyBtn.className = 'btn-enterprise btn-secondary';
                convoyBtn.style.borderColor = '#38bdf8';
                convoyBtn.style.color = '#38bdf8';
                convoyBtn.innerHTML = '🛡️ تأمين الموكب (Escort Convoy)';
                convoyBtn.onclick = () => EscortConvoyEngine.toggleConvoyPanel();
                headerContainer.insertBefore(convoyBtn, headerContainer.firstChild);
                DiagnosticsLogger.log("Escort Convoy management module initialized.", "INFO");
            }
        } catch (error) {
            DiagnosticsLogger.log(`Convoy module init error: ${error.message}`, "ERROR");
        }
    }

    static toggleConvoyPanel() {
        try {
            const rightSidebar = document.querySelectorAll('.enterprise-panel')[1];
            if (!rightSidebar) return;

            let convoyCard = document.getElementById('convoyManagementCard');
            if (convoyCard) {
                convoyCard.remove();
                EnterpriseNotificationEngine.showToast("إلغاء تفعيل الموكب", "تم إيقاف نظام الحراسة والمواكب المرافقة.", "WARN");
                return;
            }

            convoyCard = document.createElement('div');
            convoyCard.id = 'convoyManagementCard';
            convoyCard.className = 'panel-section';
            convoyCard.style.border = '1px solid #38bdf8';
            convoyCard.innerHTML = `
                <div class="panel-title" style="color: #38bdf8;">🛡️ إدارة الموكب والحراسة الأمنية</div>
                <div class="form-group">
                    <label>مستوى التهديد والبروتوكول الأمني</label>
                    <select id="securityThreatLevel" style="border-color: #38bdf8;">
                        <option value="level_1">مستوى 1: تأمين عادي (سيارة مرافقة واحدة)</option>
                        <option value="level_2">مستوى 2: تأمين مشدد (موكب من سيارتين دفع رباعي)</option>
                        <option value="level_3">مستوى 3: طوارئ ودبلوماسي قصوى (موكب كامل + تأمين مروري)</option>
                    </select>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; background: var(--bg-deep); padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                        <span style="color: var(--text-muted);">سيارة الرئاسة / السفير:</span>
                        <span style="color: var(--primary-color); font-weight: 800;">مرسيدس S-Class (نشطة)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                        <span style="color: var(--text-muted);">سيارة الحراسة الأمامية:</span>
                        <span style="color: #38bdf8; font-weight: 800;">جيب شيروكي (متصلة)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                        <span style="color: var(--text-muted);">سيارة الدعم الخلفية:</span>
                        <span style="color: #38bdf8; font-weight: 800;">تويوتا لاندكروزر (متصلة)</span>
                    </div>
                </div>
                <button class="btn-enterprise" style="background-color: #38bdf8; color: var(--bg-deep); font-size: 0.85rem;" onclick="EscortConvoyEngine.deployConvoy()">نشر وتفعيل الموكب ميدانياً</button>
            `;

            rightSidebar.insertBefore(convoyCard, rightSidebar.firstChild);
            EnterpriseNotificationEngine.showToast("جاهزية الموكب", "تم تحميل لوحة التحكم في الحراسة والموكب المرافق بنجاح.", "SUCCESS");
            DiagnosticsLogger.log("Escort Convoy panel rendered successfully.", "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`Toggle convoy panel error: ${error.message}`, "ERROR");
        }
    }

    static deployConvoy() {
        const threatLevel = document.getElementById('securityThreatLevel').value;
        EnterpriseNotificationEngine.showToast("بدء تحرك الموكب", `تم تأكيد إطلاق الموكب الأمني بنجاح بناءً على البروتوكول المختار (${threatLevel}). رصد الإحداثيات جاري...`, "SUCCESS");
        DiagnosticsLogger.log(`Convoy deployed successfully under security profile: ${threatLevel}`, "INFO");
        alert("تم نشر الموكب الأمني المرافق بنجاح! سيارات الحراسة تتابع سيارة السفير الآن على الخريطة المركزية.");
    }
}

/* Bootstrapping Convoy Module on Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        EscortConvoyEngine.initConvoyModule();
    }, 2800);
});