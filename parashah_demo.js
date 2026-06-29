// 📖 Parashah Simulator Interactive Logic

// State management
let appState = {
    completedAliyot: 0, // 0 to 7
    isDiaspora: true,
    bereishitBadgeUnlocked: false,
    activeTab: 'View_Home'
};

// Genesis Aliyah 1 (Rishon) Verses for Reader View
const aliyah1Verses = [
    { num: 1, ko: "태초에 하나님이 천지를 창조하시니라.", he: "בְּרֵאשִׁית, בָּרָא אֱלֹהִים, אֵת הַשָּׁמַיִם, וְאֵת הָאָרֶץ" },
    { num: 2, ko: "땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라.", he: "וְהָאָרֶץ, הָיְתָה תֹהוּ וָבֹהוּ, וְחֹשֶׁךְ, עַל-פְּנֵי תְהוֹם; וְרוּחַ אֱלֹהִים, מְרַחֶפֶת עַל-פְּנֵי הַמָּיִם" },
    { num: 3, ko: "하나님이 이르시되 빛이 있으라 하시니 빛이 있었고", he: "וַיֹּאמֶר אֱלֹהִים, יְהִי אוֹר; וַיְהִי-אוֹר" },
    { num: 4, ko: "빛이 하나님이 보시기에 좋았더라 하나님이 빛과 어둠을 나누사", he: "וַיַּרְא אֱלֹהִים אֶת-הָאוֹר, כִּי-טוֹב; וַיַּבְדֵּל אֱלֹהִים, בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ" },
    { num: 5, ko: "하나님이 빛을 낮이라 부르시고 어둠을 밤이라 부르시니라 저녁이 되고 아침이 되니 이는 첫째 날이니라.", he: "וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם, וְלַחֹשֶׁךְ קָרָא לָיְלָה; וַיְהִי-עֶרֶב וַיְהִי-בֹקֶר, יוֹם אֶחָד" },
    { num: 31, ko: "하나님이 지으신 그 모든 것을 보시니 보시기에 심히 좋았더라 저녁이 되고 아침이 되니 이는 여섯째 날이니라.", he: "וַיַּרְא אֱלֹהִים אֶת-כָּל-אֲשֶׁר עָשָׂה, וְהִנֵּה-טוֹב מְאֹד; וַיְהִי-עֶרֶב וַיְהִי-בֹקֶר, יוֹם הַשִּׁשִּׁי" },
    { num: 1, chapter: 2, ko: "천지와 만물이 다 이루어지니라.", he: "וַיְכֻלּוּ הַשָּׁמַיִם וְהָאָרֶץ, וְכָל-צְבָאָם" },
    { num: 2, chapter: 2, ko: "하나님이 그가 하시던 일을 일곱째 날에 마치시니 그가 하시던 모든 일을 그치고 일곱째 날에 안식하시니라.", he: "וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי,..." },
    { num: 3, chapter: 2, ko: "하나님이 그 일곱째 날을 복되게 하사 거룩하게 하셨으니 이는 하나님이 그 창조하시며 만드시던 모든 일을 마치시고 그 날에 안식하셨음이더라.", he: "וַיְבָרֶךְ אֱלֹהִים אֶת-יוֹם הַשּׁבִיעִי..." }
];

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSimulations();
    renderReaderVerses();
});

// Tab Switch Navigation
function initNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabViews = document.querySelectorAll('.tab-view');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            // Switch tabs active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabViews.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');
            const targetView = document.getElementById(target);
            targetView.classList.add('active');
            
            appState.activeTab = target;

            // Trigger scroll animation for reader View if active
            if (target === 'View_Reader') {
                const scrollContent = document.getElementById('ReaderTextContent');
                scrollContent.scrollTop = 0;
            }
        });
    });
}

// Simulated core features
function initSimulations() {
    // 1. [오늘의 Aliyah 읽기] button triggers reader tab
    const startReadingBtn = document.getElementById('StartReadingBtn');
    startReadingBtn.addEventListener('click', () => {
        const readerTabBtn = document.getElementById('NavReaderBtn');
        if (readerTabBtn) {
            readerTabBtn.click();
        }
    });

    // 2. Language Parallel Toggle (Korean-Hebrew 대조)
    const langToggleBtn = document.getElementById('LangToggleBtn');
    langToggleBtn.addEventListener('click', () => {
        langToggleBtn.classList.toggle('active');
        const hebrewTexts = document.querySelectorAll('.verse-he');
        hebrewTexts.forEach(t => {
            if (langToggleBtn.classList.contains('active')) {
                t.style.display = 'block';
            } else {
                t.style.display = 'none';
            }
        });
    });

    // 3. [오늘의 Aliyah 완독 완료!] Button logic (Updates progress)
    const completeReadingBtn = document.getElementById('CompleteReadingBtn');
    completeReadingBtn.addEventListener('click', () => {
        if (appState.completedAliyot < 7) {
            appState.completedAliyot += 1;
            updateProgressUI();
            
            // UI Switch back to Home Tab to check progress
            setTimeout(() => {
                const homeTabBtn = document.querySelector('[data-target="View_Home"]');
                if (homeTabBtn) homeTabBtn.click();
            }, 500);

            // If we hit 7/7, unlock Saturday Parashah Badge!
            if (appState.completedAliyot === 7) {
                unlockBereishitBadge();
            }
        } else {
            alert("이번 주 파라샤(7대 알리야)를 모두 완독하셨습니다! 안식일 뱃지가 활성화되었습니다.");
        }
    });

    // 4. Diaspora Schedule switcher simulation
    const diasporaToggle = document.getElementById('DiasporaToggle');
    diasporaToggle.addEventListener('change', () => {
        appState.isDiaspora = diasporaToggle.checked;
        const insightText = document.getElementById('InsightText');
        const saturday2Cell = document.querySelector('[data-badge-id="2"]');
        const badgeLabel2 = saturday2Cell.querySelector('.badge-label');
        const badgeItem2 = document.getElementById('BadgeItem_Noach').querySelector('span');

        if (appState.isDiaspora) {
            insightText.innerText = "디아스포라(Diaspora) 기준 연간 일정이 캐싱되어 인터넷 없이 동작 중입니다.";
            badgeLabel2.innerText = "노아";
            badgeItem2.innerText = "노아";
            console.log("[유대력 동기화] 디아스포라(해외) 기준 캘린더 매핑 갱신 완료");
        } else {
            insightText.innerText = "이스라엘 본토(Israel) 기준 절기 캘린더가 맵핑되어 동작 중입니다.";
            // Simulate Diaspora shift for April 18 Parashah
            badgeLabel2.innerText = "타즈리아";
            badgeItem2.innerText = "타즈리아";
            console.log("[유대력 동기화] 이스라엘 본토 기준 캘린더 매핑 갱신 완료 (유월절 편차 Tazria 보정 적용)");
        }
    });
}

// Render parallel verses dynamically
function renderReaderVerses() {
    const readerTextContent = document.getElementById('ReaderTextContent');
    let htmlContent = '';

    aliyah1Verses.forEach(v => {
        const verseLabel = v.chapter ? `${v.chapter}장 ${v.num}절` : `${v.num}절`;
        htmlContent += `
            <div class="verse-item">
                <span class="verse-num">${verseLabel}</span>
                <p class="verse-ko">${v.ko}</p>
                <p class="verse-he">${v.he}</p>
            </div>
        `;
    });

    readerTextContent.innerHTML = htmlContent;
}

// Update Dashboard progress UI
function updateProgressUI() {
    const indicator = document.getElementById('AliyahIndicator');
    const progressBar = document.getElementById('AliyahProgressBar');
    const aliyahDayName = document.getElementById('AliyahDayName');
    const aliyahRangeText = document.getElementById('AliyahRangeText');

    const percent = Math.round((appState.completedAliyot / 7) * 100);
    progressBar.style.width = `${percent}%`;
    indicator.innerText = `${appState.completedAliyot} / 7 완료`;

    // Simulate Aliyah text changes based on step
    const aliyotSteps = [
        { day: "Rishon (1일차 - 일요일)", range: "창세기 1:1 - 2:3" },
        { day: "Sheni (2일차 - 월요일)", range: "창세기 2:4 - 2:19" },
        { day: "Shlishi (3일차 - 화요일)", range: "창세기 2:20 - 3:21" },
        { day: "Revii (4일차 - 수요일)", range: "창세기 3:22 - 4:18" },
        { day: "Chamishi (5일차 - 목요일)", range: "창세기 4:19 - 4:26" },
        { day: "Shishi (6일차 - 금요일)", range: "창세기 5:1 - 5:24" },
        { day: "Shevii (7일차 - 토요일)", range: "창세기 5:25 - 6:8" },
        { day: "이번 주 완독 완료! 📜", range: "안식일 배지가 잠금 해제되었습니다." }
    ];

    const currentStep = aliyotSteps[appState.completedAliyot];
    if (currentStep) {
        aliyahDayName.innerText = currentStep.day;
        aliyahRangeText.innerText = currentStep.range;
    }
}

// Unlock Saturday Parashah Badge with Animation
function unlockBereishitBadge() {
    appState.bereishitBadgeUnlocked = true;
    
    // 1. Unlock Calendar Saturday cell badge
    const saturdayCell = document.querySelector('[data-badge-id="1"]');
    const badgeIcon = saturdayCell.querySelector('.badge-icon');
    badgeIcon.classList.remove('locked');
    badgeIcon.classList.add('unlocked');
    badgeIcon.innerHTML = `<i class="fas fa-certificate"></i>`; // Change to gold badge icon

    // 2. Unlock Achievement Grid Badge
    const itemBereishit = document.getElementById('BadgeItem_Bereishit');
    const statusIcon = itemBereishit.querySelector('.status-badge-icon');
    statusIcon.classList.remove('locked');
    statusIcon.classList.add('unlocked');
    statusIcon.style.color = '#fbbf24';

    console.log("🏆 [게이미피케이션] 베레시트(Bereishit) 안식일 독서 배지 잠금 해제 완료!");
}
