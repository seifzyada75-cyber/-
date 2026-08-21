// قاموس الترجمة
const translations = {
    ar: {
        logoText: 'إنـدرايف <strong>مصر</strong>',
        cityName: 'الإسكندرية',
        pickupLabel: 'منين؟',
        dropoffLabel: 'على فين؟',
        vEconomy: 'اقتصادي',
        vEconomyPrice: 'من 35 ج.م',
        vComfort: 'كومفورت',
        vComfortPrice: 'من 60 ج.م',
        vBike: 'موتوسيكل',
        vBikePrice: 'من 18 ج.م',
        fareLabel: 'السعر المقترح للرحلة',
        currency: 'ج.م',
        searchBtn: 'ابحث عن سواقين',
        searchingTitle: 'جاري البحث عن كابتن قَرِيب...',
        searchingSub: 'بنبعت طلبك للسواقين في نطاق المنطقة',
        cancelBtn: 'إلغاء البحث',
        bidsTitle: 'عروض الكباتن المتاحة',
        yourOffer: 'عرضك:',
        offerAccepted: 'تم قبول العرض!',
        etaText: 'الكابتن يوصل خلال',
        mins: 'دقيقة',
        callBtn: 'اتصال',
        chatBtn: 'محادثة',
        cancelTripBtn: 'إلغاء الرحلة',
        acceptBtn: 'قبول العرض',
        declineBtn: 'رفض',
        counterTag: 'عرض مضاد',
        discountTag: 'خصم',
        tripsText: 'رحلة'
    },
    en: {
        logoText: 'inDrive <strong>Egypt</strong>',
        cityName: 'Alexandria',
        pickupLabel: 'Pickup location?',
        dropoffLabel: 'Where to?',
        vEconomy: 'Economy',
        vEconomyPrice: 'From 35 EGP',
        vComfort: 'Comfort',
        vComfortPrice: 'From 60 EGP',
        vBike: 'Moto',
        vBikePrice: 'From 18 EGP',
        fareLabel: 'Offer your fare',
        currency: 'EGP',
        searchBtn: 'Find Drivers',
        searchingTitle: 'Finding nearby drivers...',
        searchingSub: 'Sending your offer to drivers around',
        cancelBtn: 'Cancel Search',
        bidsTitle: 'Available Offers',
        yourOffer: 'Your offer:',
        offerAccepted: 'Offer Accepted!',
        etaText: 'Driver arrives in',
        mins: 'mins',
        callBtn: 'Call',
        chatBtn: 'Chat',
        cancelTripBtn: 'Cancel Trip',
        acceptBtn: 'Accept',
        declineBtn: 'Decline',
        counterTag: 'counter offer',
        discountTag: 'discount',
        tripsText: 'trips'
    }
};

// المناطق باللغتين
const locations = [
    { id: 1, name_ar: "محطة الرمل، الإسكندرية", name_en: "Mahatet El Raml, Alex", baseFare: 40 },
    { id: 2, name_ar: "سيدي بشر، الإسكندرية", name_en: "Sidi Bishr, Alex", baseFare: 65 },
    { id: 3, name_ar: "سموحة (ميدان الممر)، الإسكندرية", name_en: "Smouha, Alex", baseFare: 50 },
    { id: 4, name_ar: "المنتزه (البوابة)، الإسكندرية", name_en: "El Montaza, Alex", baseFare: 80 },
    { id: 5, name_ar: "العجمي (البيطاش)، الإسكندرية", name_en: "El Agami, Alex", baseFare: 90 },
    { id: 6, name_ar: "ميدان التحرير، القاهرة", name_en: "Tahrir Square, Cairo", baseFare: 70 },
    { id: 7, name_ar: "مدينة نصر (سيتي ستارز)، القاهرة", name_en: "Nasr City, Cairo", baseFare: 85 },
    { id: 8, name_ar: "المعادي (شارع 9)، القاهرة", name_en: "Maadi Street 9, Cairo", baseFare: 75 }
];

const mockDrivers = [
    { id: 101, name_ar: "أحمد علي", name_en: "Ahmed Ali", rating: "4.9 ★", trips: "1,420", car_ar: "تويوتا كورولا 2021 • أ ب ج ١٢٣٤", car_en: "Toyota Corolla • ABC 1234", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", addPrice: 0 },
    { id: 102, name_ar: "محمود حسن", name_en: "Mahmoud Hassan", rating: "4.8 ★", trips: "890", car_ar: "هيونداي إيلانترا • س ص ج ٥٦٧٨", car_en: "Hyundai Elantra • XYZ 5678", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", addPrice: 15 },
    { id: 103, name_ar: "سارة سيد", name_en: "Sara Sayed", rating: "4.95 ★", trips: "2,100", car_ar: "نيسان صني • م ن هـ ٩٠١٢", car_en: "Nissan Sunny • MNO 9012", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", addPrice: 10 },
    { id: 104, name_ar: "كابتن إبراهيم", name_en: "Capt. Ibrahim", rating: "4.7 ★", trips: "650", car_ar: "شيفروليه أفيو • ط ك ل ٣٤٥٦", car_en: "Chevrolet Aveo • TKL 3456", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", addPrice: 0 },
    { id: 105, name_ar: "مصطفى الجزار", name_en: "Mostafa Elgazzar", rating: "4.85 ★", trips: "1,110", car_ar: "حلاوة موتوسيكل • ر س ت ٧٨٩٠", car_en: "Halawa Moto • RST 7890", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80", addPrice: -10 }
];

let currentLang = 'ar';
let userPrice = 50;
let currentBids = [];

const pickupSelect = document.getElementById('pickup-select');
const dropoffSelect = document.getElementById('dropoff-select');
const fareAmountEl = document.getElementById('fare-amount');
const langBtn = document.getElementById('lang-btn');

// تبديل اللغة
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    langBtn.textContent = currentLang === 'ar' ? 'EN' : 'عربي';

    // تحديث كل النصوص في الصفحة
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    document.getElementById('logo-text').innerHTML = translations[currentLang].logoText;
    document.getElementById('current-city-name').textContent = translations[currentLang].cityName;

    initLocations();
}

function initLocations() {
    if (!pickupSelect || !dropoffSelect) return;
    
    const pVal = pickupSelect.value;
    const dVal = dropoffSelect.value;

    pickupSelect.innerHTML = '';
    dropoffSelect.innerHTML = '';

    locations.forEach(loc => {
        const name = currentLang === 'ar' ? loc.name_ar : loc.name_en;
        pickupSelect.add(new Option(name, loc.id));
        dropoffSelect.add(new Option(name, loc.id));
    });

    pickupSelect.value = pVal || 1;
    dropoffSelect.value = dVal || 2;
    updateEstimatedFare();
}

function updateEstimatedFare() {
    const pId = parseInt(pickupSelect.value);
    const dId = parseInt(dropoffSelect.value);
    
    const pLoc = locations.find(l => l.id === pId);
    const dLoc = locations.find(l => l.id === dId);

    if (pLoc && dLoc) {
        let calculatedFare = Math.abs(pLoc.baseFare + dLoc.baseFare) / 2 + 15;
        userPrice = Math.round(calculatedFare / 5) * 5;
        if (fareAmountEl) fareAmountEl.textContent = userPrice;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initLocations();

    if (langBtn) langBtn.addEventListener('click', toggleLanguage);
    if (pickupSelect) pickupSelect.addEventListener('change', updateEstimatedFare);
    if (dropoffSelect) dropoffSelect.addEventListener('change', updateEstimatedFare);

    document.getElementById('plus-btn')?.addEventListener('click', () => {
        userPrice += 5;
        if (fareAmountEl) fareAmountEl.textContent = userPrice;
    });

    document.getElementById('minus-btn')?.addEventListener('click', () => {
        if (userPrice > 15) {
            userPrice -= 5;
            if (fareAmountEl) fareAmountEl.textContent = userPrice;
        }
    });

    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    document.getElementById('search-btn')?.addEventListener('click', () => {
        switchStep(document.getElementById('step-searching'));
        const userPriceDisplay = document.getElementById('current-user-price');
        if (userPriceDisplay) userPriceDisplay.textContent = userPrice;
        
        setTimeout(() => {
            switchStep(document.getElementById('step-bids'));
            streamDriverBids();
        }, 1800);
    });

    document.getElementById('cancel-search-btn')?.addEventListener('click', () => switchStep(document.getElementById('step-request')));
    document.getElementById('cancel-trip-btn')?.addEventListener('click', () => switchStep(document.getElementById('step-request')));
});

function streamDriverBids() {
    const bidsListEl = document.getElementById('bids-list');
    if (!bidsListEl) return;

    bidsListEl.innerHTML = '';
    currentBids = [];

    mockDrivers.forEach((driver, index) => {
        setTimeout(() => {
            const finalPrice = Math.max(15, userPrice + driver.addPrice);
            currentBids.push({ ...driver, finalPrice });
            
            const countEl = document.getElementById('bids-count');
            if (countEl) countEl.textContent = currentBids.length;

            const name = currentLang === 'ar' ? driver.name_ar : driver.name_en;
            car = currentLang === 'ar' ? driver.car_ar : driver.car_en;
            const t = translations[currentLang];

            const card = document.createElement('div');
            card.className = 'bid-card';
            card.innerHTML = `
                <div class="driver-info">
                    <img src="${driver.avatar}" class="driver-img" alt="${name}">
                    <div class="driver-details">
                        <h5>${name}</h5>
                        <div class="rating">${driver.rating} (${driver.trips} ${t.tripsText})</div>
                        <div class="car-details">${car}</div>
                    </div>
                    <div class="bid-price">
                        <span class="price-val">${finalPrice} ${t.currency}</span>
                        ${driver.addPrice > 0 ? `<span class="counter-tag">+${driver.addPrice} ${t.currency} ${t.counterTag}</span>` : ''}
                        ${driver.addPrice < 0 ? `<span class="counter-tag" style="color:#10b981">${t.discountTag} ${Math.abs(driver.addPrice)} ${t.currency}</span>` : ''}
                    </div>
                </div>
                <div class="bid-actions">
                    <button class="btn-decline" onclick="declineBid(this)">${t.declineBtn}</button>
                    <button class="btn-accept" onclick="acceptBid(${driver.id})">${t.acceptBtn}</button>
                </div>
            `;
            bidsListEl.appendChild(card);
        }, (index + 1) * 500);
    });
}

function declineBid(button) {
    const card = button.closest('.bid-card');
    if (card) {
        card.remove();
        const countEl = document.getElementById('bids-count');
        if (countEl) countEl.textContent = Math.max(0, parseInt(countEl.textContent) - 1);
    }
}

function acceptBid(driverId) {
    const driver = currentBids.find(d => d.id === driverId);
    if (!driver) return;

    const name = currentLang === 'ar' ? driver.name_ar : driver.name_en;
    const car = currentLang === 'ar' ? driver.car_ar : driver.car_en;
    const t = translations[currentLang];
    
    const targetCard = document.getElementById('accepted-driver-card');
    if (targetCard) {
        targetCard.innerHTML = `
            <div class="driver-info">
                <img src="${driver.avatar}" class="driver-img" alt="${name}">
                <div class="driver-details">
                    <h5>${name}</h5>
                    <div class="rating">${driver.rating} (${driver.trips} ${t.tripsText})</div>
                    <div class="car-details">${car}</div>
                </div>
                <div class="bid-price">
                    <span class="price-val">${driver.finalPrice} ${t.currency}</span>
                </div>
            </div>
        `;
    }

    switchStep(document.getElementById('step-tracking'));
}

function switchStep(targetStep) {
    if (!targetStep) return;
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    targetStep.classList.remove('hidden');
}