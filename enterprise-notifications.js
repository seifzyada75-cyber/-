/* ==========================================================================
   IN-DRIVE EGYPT - REAL-TIME NOTIFICATION & TOAST ENGINE v5.4
   ========================================================================== */

class EnterpriseNotificationEngine {
    static initNotificationContainer() {
        if (!document.getElementById('enterpriseToastContainer')) {
            const container = document.createElement('div');
            container.id = 'enterpriseToastContainer';
            container.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 24px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(container);
            DiagnosticsLogger.log("Enterprise Notification Toast Container initialized.", "INFO");
        }
    }

    static showToast(title, message, type = "INFO") {
        try {
            EnterpriseNotificationEngine.initNotificationContainer();
            const container = document.getElementById('enterpriseToastContainer');
            if (!container) return;

            const toast = document.createElement('div');
            
            let borderColor = "#3b82f6";
            let icon = "ℹ️";
            if (type === "SUCCESS") {
                borderColor = "#00e676";
                icon = "✅";
            } else if (type === "WARN") {
                borderColor = "#f59e0b";
                icon = "⚠️";
            } else if (type === "ERROR") {
                borderColor = "#ef4444";
                icon = "❌";
            }

            toast.style.cssText = `
                background: var(--bg-surface, #0f172a);
                color: var(--text-main, #f8fafc);
                padding: 1rem 1.25rem;
                border-radius: 12px;
                border: 1px solid var(--border-color, #334155);
                border-right: 4px solid ${borderColor};
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                min-width: 300px;
                max-width: 380px;
                pointer-events: auto;
                transform: translateX(-120%);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: var(--font-main, 'Cairo', sans-serif);
            `;

            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 0.95rem;">
                    <span>${icon}</span>
                    <span>${title}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted, #94a3b8); line-height: 1.4;">
                    ${message}
                </div>
            `;

            container.appendChild(toast);

            // Trigger slide-in animation
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 50);

            // Auto dismiss after 4.5 seconds
            setTimeout(() => {
                toast.style.transform = 'translateX(-120%)';
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 4500);

            DiagnosticsLogger.log(`Toast Notification Triggered: [${type}] ${title}`, "INFO");
        } catch (error) {
            DiagnosticsLogger.log(`Toast notification error: ${error.message}`, "ERROR");
        }
    }

    static triggerSimulatedAlertsSequence() {
        setTimeout(() => {
            EnterpriseNotificationEngine.showToast("تحديث النظام الجغرافي", "تم ربط شبكة الطرق في مصر (القاهرة، الإسكندرية، والبحيرة) بنجاح.", "SUCCESS");
        }, 2000);

        setTimeout(() => {
            EnterpriseNotificationEngine.showToast("عرض كابتن جديد", "الكابتن محمود الشناوي قدم عرضاً جديداً برحلتك القادمة بمبلغ 140 ج.م.", "INFO");
        }, 6000);
    }
}

// تشغيل نظام الإشعارات تلقائياً
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        EnterpriseNotificationEngine.initNotificationContainer();
        EnterpriseNotificationEngine.triggerSimulatedAlertsSequence();
    }, 1500);
});