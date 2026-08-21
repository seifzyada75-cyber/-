// قائمة المناطق المتاحة للركوب
const locations = [
    { id: 1, name: "محطة الرمل، الإسكندرية", baseFare: 40 },
    { id: 2, name: "سيدي بشر، الإسكندرية", baseFare: 65 },
    { id: 3, name: "سموحة (ميدان الممر)، الإسكندرية", baseFare: 50 },
    { id: 4, name: "المنتزه (البوابة)، الإسكندرية", baseFare: 80 },
    { id: 5, name: "العجمي (البيطاش)، الإسكندرية", baseFare: 90 },
    { id: 6, name: "ميدان التحرير، القاهرة", baseFare: 70 },
    { id: 7, name: "مدينة نصر (سيتي ستارز)، القاهرة", baseFare: 85 },
    { id: 8, name: "المعادي (شارع 9)، القاهرة", baseFare: 75 }
];

// قاعدة بيانات تضم 10 سواقين متنوعين
const mockDrivers = [
    {
        id: 101, name: "أحمد علي", rating: "4.9 ★ (1,420 رحلة)",
        car: "تويوتا كورولا 2021 • أ ب ج ١٢٣٤",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        addPrice: 0
    },
    {
        id: 102, name: "محمود حسن", rating: "4.8 ★ (890 رحلة)",
        car: "هيونداي إيلانترا • س ص ج ٥٦٧٨",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        addPrice: 15
    },
    {
        id: 103, name: "سارة سيد", rating: "4.95 ★ (2,100 رحلة)",
        car: "نيسان صني • م ن هـ ٩٠١٢",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        addPrice: 10
    },
    {
        id: 104, name: "كابتن إبراهيم فؤاد", rating: "4.7 ★ (650 رحلة)",
        car: "شيفروليه أفيو • ط ك ل ٣٤٥٦",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        addPrice: 0
    },
    {
        id: 105, name: "مصطفى الجزار", rating: "4.85 ★ (1,110 رحلة)",
        car: "بجسر حلاوة موتوسيكل • ر س ت ٧٨٩٠",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        addPrice: -10 // بيقدم خصم
    },
    {
        id: 106, name: "عمر فاروق", rating: "5.0 ★ (310 رحلة)",
        car: "كيا سيراتو • ف ص ق ١١٢٢",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
        addPrice: 20
    },
    {
        id: 107, name: "طارق الشريف", rating: "4.6 ★ (420 رحلة)",
        car: "بيجو 301 • ج د هـ ٣٣٤٤",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        addPrice: 5
    },
    {
        id: 108, name: "خالد منصور", rating: "4.9 ★ (1,850 رحلة)",
        car: "رينو لوجان • و ز ح ٥٥٦٦",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
        addPrice: 0
    },
    {
        id: 109, name: "حسن الصاوي", rating: "4.8 ★ (970 رحلة)",
        car: "سكودا أوكتافيا • ط ي ك ٧٧٨٨",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        addPrice: 25
    },
    {
        id: 110, name: "كابتن زياد", rating: "4.75 ★ (530 رحلة)",
        car: "فيات تيبو • ل م ن ٩٩٠٠",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        addPrice: 10
    }
];

// الحالة البرمجية التطبيق
let userPrice = 50;
let currentBids = [];

// عناصر الصفحة
const pickupSelect = document.getElementById('pickup-select');
const dropoffSelect = document.getElementById('dropoff-select');
const fareAmountEl = document.getElementById('fare-amount');

// تحميل قائمة المناطق عند البداية
function initLocations() {
    locations.forEach(loc => {
        const option1 = new Option(loc.name, loc.id);
        const option2 = new Option(loc.name, loc.id);
        pickupSelect.add(option1);
        dropoffSelect.add(option2);
    });

    // تعيين قيم افتراضية مختلفة
    pickupSelect.selectedIndex = 0; // محطة الرمل
    dropoffSelect.selectedIndex = 1; // سيدي بشر
    updateEstimatedFare();
}

// حساب سعر استرشادي أوتوماتيك عند تغيير العناوين
function updateEstimatedFare() {
    const pId = parseInt(pickupSelect.value);
    const dId = parseInt(dropoffSelect.value);
    
    const pLoc = locations.find(l => l.id === pId);
    const dLoc = locations.find(l => l.id === dId);

    // عملية حسابية بسيطة لحساب فرق الأجرة
    let calculatedFare = Math.abs(pLoc.baseFare + dLoc.baseFare) / 2 + 15;
    userPrice = Math.round(calculatedFare / 5) * 5; // التقريب لأقرب 5
    fareAmountEl.textContent = userPrice;
}

pickupSelect.addEventListener('change', updateEstimatedFare);
dropoffSelect.addEventListener('change', updateEstimatedFare);

// التحكم في الأجرة
document.getElementById('plus-btn').addEventListener('click', () => {
    userPrice += 5;
    fareAmountEl.textContent = userPrice;
});

document.getElementById('minus-btn').addEventListener('click', () => {
    if (userPrice > 15) {
        userPrice -= 5;
        fareAmountEl.textContent = userPrice;
    }
});

// الفئات
document.querySelectorAll('.vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// بدء الطلب
document.getElementById('search-btn').addEventListener('click', () => {
    switchStep(document.getElementById('step-searching'));
    document.getElementById('current-user-price').textContent = userPrice;
    
    setTimeout(() => {
        switchStep(document.getElementById('step-bids'));
        streamDriverBids();
    }, 1800);
});

// ضخ عروض السواقين الـ 10 ورا بعض بسرعة (Simulation)
function streamDriverBids() {
    const bidsListEl = document.getElementById('bids-list');
    bidsListEl.innerHTML = '';
    currentBids = [];

    mockDrivers.forEach((driver, index) => {
        setTimeout(() => {
            const finalPrice = Math.max(15, userPrice + driver.addPrice);
            currentBids.push({ ...driver, finalPrice });
            
            document.getElementById('bids-count').textContent = currentBids.length;

            const card = document.createElement('div');
            card.className = 'bid-card';
            card.innerHTML = `
                <div class="driver-info">
                    <img src="${driver.avatar}" class="driver-img">
                    <div class="driver-details">
                        <h5>${driver.name}</h5>
                        <div class="rating">${driver.rating}</div>
                        <div class="car-details">${driver.car}</div>
                    </div>
                    <div class="bid-price">
                        <span class="price-val">${finalPrice} ج.م</span>
                        ${driver.addPrice > 0 ? `<span class="counter-tag">+${driver.addPrice} ج.م</span>` : ''}
                        ${driver.addPrice < 0 ? `<span class="counter-tag" style="color:#10b981">خصم ${Math.abs(driver.addPrice)} ج.م</span>` : ''}
                    </div>
                </div>
                <div class="bid-actions">
                    <button class="btn-decline" onclick="declineBid(this)">رفض</button>
                    <button class="btn-accept" onclick="acceptBid(${driver.id})">قبول العرض</button>
                </div>
            `;
            bidsListEl.appendChild(card);
        }, (index + 1) * 600); // بينزل عرض جديد كل 0.6 ثانية
    });
}

function declineBid(button) {
    const card = button.closest('.bid-card');
    card.remove();
    const countEl = document.getElementById('bids-count');
    countEl.textContent = Math.max(0, parseInt(countEl.textContent) - 1);
}

function acceptBid(driverId) {
    const driver = currentBids.find(d => d.id === driverId);
    
    document.getElementById('accepted-driver-card').innerHTML = `
        <div class="driver-info">
            <img src="${driver.avatar}" class="driver-img">
            <div class="driver-details">
                <h5>${driver.name}</h5>
                <div class="rating">${driver.rating}</div>
                <div class="car-details">${driver.car}</div>
            </div>
            <div class="bid-price">
                <span class="price-val">${driver.finalPrice} ج.م</span>
            </div>
        </div>
    `;

    switchStep(document.getElementById('step-tracking'));
}

function switchStep(targetStep) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    targetStep.classList.remove('hidden');
}

document.getElementById('cancel-search-btn').addEventListener('click', () => switchStep(document.getElementById('step-request')));
document.getElementById('cancel-trip-btn').addEventListener('click', () => switchStep(document.getElementById('step-request')));

// تشغيل عند فتح الصفحة
initLocations();