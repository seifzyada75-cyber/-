/* ==========================================================================
   IN-DRIVE EGYPT - FINANCIAL WALLET & LEDGER ENGINE v5.3
   ========================================================================== */

class EnterpriseWalletEngine {
    constructor() {
        this.walletState = {
            balance: 1420.50, // رصيد المحفظة بالجنيه المصري
            currency: "ج.م",
            commissionRate: 0.10, // عمولة التطبيق 10%
            transactions: [
                { id: "TX-9021", type: "CR", amount: 150.00, desc: "رحلة: التحرير -> التجمع الخامس", time: "منذ 15 دقيقة" },
                { id: "TX-9020", type: "CR", amount: 95.00, desc: "رحلة: مدينة نصر -> المعادي", time: "منذ ساعة" },
                { id: "TX-9019", type: "DR", amount: 15.00, desc: "خصم عمولة المنصة (10%)", time: "منذ ساعتين" },
                { id: "TX-9018", type: "CR", amount: 220.00, desc: "رحلة: أبو المطامير -> الإسكندرية", time: "أمس" }
            ]
        };
    }

    getWalletSummary() {
        return this.walletState;
    }

    addTransaction(type, amount, description) {
        try {
            const newTx = {
                id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
                type: type, // 'CR' for Credit, 'DR' for Debit
                amount: Number(amount),
                desc: description,
                time: "الآن"
            };

            this.walletState.transactions.unshift(newTx);
            
            if (type === 'CR') {
                this.walletState.balance += Number(amount);
            } else {
                this.walletState.balance -= Number(amount);
            }

            DiagnosticsLogger.log(`Financial ledger updated: [${type}] ${amount} EGP - ${description}`, "INFO");
            this.renderWalletWidget();
        } catch (error) {
            DiagnosticsLogger.log(`Wallet transaction error: ${error.message}`, "ERROR");
        }
    }

    renderWalletWidget() {
        let walletContainer = document.getElementById('enterpriseWalletCard');
        
        if (!walletContainer) {
            // إنشاء الودجت برمجياً وإضافته في القائمة الجانبية اليسرى
            const leftSidebar = document.querySelector('.enterprise-panel');
            if (!leftSidebar) return;

            walletContainer = document.createElement('div');
            walletContainer.id = 'enterpriseWalletCard';
            walletContainer.className = 'panel-section';
            walletContainer.innerHTML = `
                <div class="panel-title">💳 المحفظة المالية الذكية (Wallet)</div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-deep); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">الرصيد المتاح</span>
                        <h3 id="walletBalanceDisplay" style="color: var(--primary-color); font-size: 1.5rem; font-weight: 900;">${this.walletState.balance.toFixed(2)} ${this.walletState.currency}</h3>
                    </div>
                    <button class="btn-enterprise" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="walletEngine.simulateInstantWithdrawal()">سحب الأرباح</button>
                </div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-top: 0.5rem;">سجل العمليات الأخيرة:</div>
                <div id="walletTransactionsList" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 150px; overflow-y: auto;"></div>
            `;
            leftSidebar.appendChild(walletContainer);
        } else {
            document.getElementById('walletBalanceDisplay').textContent = `${this.walletState.balance.toFixed(2)} ${this.walletState.currency}`;
        }

        // تحديث قائمة العمليات
        const txListContainer = document.getElementById('walletTransactionsList');
        if (txListContainer) {
            txListContainer.innerHTML = this.walletState.transactions.map(tx => `
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; background: var(--bg-deep); padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
                    <span style="color: var(--text-main);">${tx.desc}</span>
                    <span style="color: ${tx.type === 'CR' ? 'var(--primary-color)' : 'var(--danger-color)'}; font-weight: 800;">
                        ${tx.type === 'CR' ? '+' : '-'}${tx.amount} ج.م
                    </span>
                </div>
            `).join('');
        }
    }

    simulateInstantWithdrawal() {
        if (this.walletState.balance <= 50) {
            alert("عذراً، الرصيد المتاح لا يسمح بالسحب الفوري حالياً.");
            return;
        }
        
        const withdrawAmount = 500.00;
        this.addTransaction('DR', withdrawAmount, "تحويل فوري إلى فودافون كاش / إنستا باى");
        alert(`تم تنفيذ طلب السحب بنجاح بمبلغ (${withdrawAmount} ج.م) وتم إرساله إلى حسابك البنكي أو المحفظة الإلكترونية المرتبطة.`);
    }
}

// تفعيل المحفظة فور تحميل المستند
const walletEngine = new EnterpriseWalletEngine();
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        walletEngine.renderWalletWidget();
        DiagnosticsLogger.log("Enterprise Financial Ledger & Wallet Engine initialized successfully.", "INFO");
    }, 1200);
});