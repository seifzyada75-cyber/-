/* ==========================================================================
   IN-DRIVE EGYPT - CYBER-OPS & LIVE SIMULATION ENGINE v7.0
   ========================================================================== */

class CyberOpsSimulator {
    static initCyberOpsButton() {
        try {
            const headerContainer = document.querySelector('header.enterprise-header > div:last-child');
            if (headerContainer && !document.getElementById('cyberOpsSimBtn')) {
                const simBtn = document.createElement('button');
                simBtn.id = 'cyberOpsSimBtn';
                simBtn.className = 'btn-enterprise';
                simBtn.style.backgroundColor = '#8b5cf6';
                simBtn.style.color = '#ffffff';
                simBtn.innerHTML = '⚡ محاكاة العمليات الحية';
                simBtn.onclick = () => CyberOpsSimulator.toggleSimulationEngine();
                headerContainer.appendChild(simBtn);
                DiagnosticsLogger.log("Cyber-Ops Simulation button injected into enterprise header.", "INFO");
            }
        } catch (error) {
            DiagnosticsLogger.log(`Cyber-Ops init error: ${error.message}`, "ERROR");
        }
    }

    static toggleSimulationEngine() {
        const isActive = window.isCyberOpsRunning || false;
        window.isCyberOpsRunning = !isActive;

        const simBtn = document.getElementById('cyberOpsSimBtn');

        if (window.isCyberOpsRunning) {
            if (simBtn) {
                simBtn.style.backgroundColor = '#10b981';
                simBtn.innerHTML = '⏹️ إيقاف المحاكاة الحية';
            }
            EnterpriseNotificationEngine.showToast("بدء التشغيل الآلي", "تم تفعيل محرك المحاكاة الحية. ستتلقى طلبات وعروض كباتن تلقائياً الآن.", "SUCCESS");
            DiagnosticsLogger.log("Cyber-Ops Live Simulation Engine STARTED.", "INFO");

            // حلقة محاكاة مستمرة
            window.cyberOpsInterval = setInterval(() => {
                const randomNames = ["إبراهيم الدسوقي", "مصطفى أبو الفتوح", "سعيد الصعيدي", "هشام بركات", "وائل الألفي"];
                const randomVehicles = ["كيا سيراتو - أبيض", "هيوانداي فيرنا - فضي", "شيفورليه أوبترا - أسود", "تويوتا كورولا - أبيض"];
                const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
                const randomVehicle = randomVehicles[Math.floor(Math.random() * randomVehicles.length)];
                const randomPrice = Math.floor(60 + Math.random() * 180);
                const randomDist = (0.8 + Math.random() * 4.5).toFixed(1);

                // إحقان عرض جديد في السوق
                const currentBids = AppStore.getState().bids || [];
                const newBid = {
                    id: `SIM-${Math.floor(100 + Math.random() * 900)}`,
                    name: randomName,
                    vehicle: randomVehicle,
                    rating: (4.7 + Math.random() * 0.25).toFixed(2),
                    distanceMin: randomDist,
                    bidPrice: randomPrice,
                    timestamp: new Date().toLocaleTimeString()
                };

                AppStore.setState({ bids: [newBid, ...currentBids] });
                RideWorkflowController.renderBidsList();

                // إظهار إشعار عائم
                EnterpriseNotificationEngine.showToast("عرض سعر جديد!", `الكابتن ${randomName} قدم عرضاً بقيمة ${randomPrice} ج.م لرحلتك الحالية.`, "INFO");
                DiagnosticsLogger.log(`Cyber-Ops simulated new incoming bid from Captain ${randomName} for ${randomPrice} EGP.`, "INFO");

            }, 7000); // كل 7 ثوانٍ عرض جديد

        } else {
            if (simBtn) {
                simBtn.style.backgroundColor = '#8b5cf6';
                simBtn.innerHTML = '⚡ محاكاة العمليات الحية';
            }
            clearInterval(window.cyberOpsInterval);
            EnterpriseNotificationEngine.showToast("إيقاف المحاكاة", "تم إيقاف محرك المحاكاة الحية بنجاح.", "WARN");
            DiagnosticsLogger.log("Cyber-Ops Live Simulation Engine STOPPED.", "WARN");
        }
    }
}

/* Bootstrapping Cyber-Ops on Load */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        CyberOpsSimulator.initCyberOpsButton();
    }, 2200);
});