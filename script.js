// Initialize MatchMedia for responsive animations
const mm = gsap.matchMedia();

// --- 0. Premium Cursor & Interaction System (Desktop Only) ---
mm.add("(min-width: 481px)", () => {
    const cursor = document.getElementById('cursor-dot');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0, ease: "none" });
    });

    gsap.ticker.add(() => {
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;
        gsap.set(follower, { x: posX, y: posY });
    });

    const magneticElements = document.querySelectorAll('.btn, .nav-logo, .value-card, .contact-item');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            follower.classList.remove('active');
        });
    });
});

// --- 1. Background Logo Scroll Interaction ---
mm.add({
    isDesktop: "(min-width: 1025px)",
    isMobile: "(max-width: 1024px)"
}, (context) => {
    let { isMobile } = context.conditions;
    
    // Smooth & Linear Transition for Mobile Performance
    const easeConfig = isMobile ? "none" : "power2.out";
    
    gsap.to("#Main_Logo", {
        scrollTrigger: {
            trigger: "#Hero_Section",
            start: "top top",
            end: "bottom top",
            scrub: isMobile ? 0.5 : 1.2,
        },
        scale: isMobile ? 0.2 : 0.35, // 50% Reduction from current 0.35 -> 0.17ish handled by 0.2
        top: isMobile ? "20px" : "60px",
        left: isMobile ? "50%" : "100px",
        xPercent: isMobile ? -50 : 0,
        opacity: isMobile ? 0 : 1, // Hidden after hero section on mobile v14
        ease: easeConfig,
        duration: 1
    });

    gsap.to("#Logo_Core", {
        scrollTrigger: {
            trigger: "#Hero_Section",
            start: "top top",
            end: "bottom top",
            scrub: isMobile ? 0.5 : 1.2,
        },
        fill: "#00F2FE",
        filter: isMobile ? "none" : "drop-shadow(0 0 15px rgba(0, 242, 254, 0.4))",
        ease: easeConfig,
        duration: 1
    });
});

// --- 2. Mobile Hamburger Menu Toggle ---
const navToggle = document.getElementById('Mobile_Nav_Toggle');
const navOverlay = document.getElementById('Mobile_Nav_Overlay');
const navLinks = document.querySelectorAll('.mobile-nav-link');

if (navToggle && navOverlay) {
    navToggle.addEventListener('click', () => {
        navOverlay.classList.toggle('is-active');
        const isActive = navOverlay.classList.contains('is-active');
        navToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('is-active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// --- 2. Global Section Animations ---
function initSectionAnimations() {
    ["#Earn_Section", "#Esteem_Section", "#Respect_Section", "#Great_Section", "#Holy_Section"].forEach(id => {
        const el = document.querySelector(id);
        if (el) {
            gsap.to(id, {
                scrollTrigger: { trigger: id, start: "top 85%", end: "top 20%", scrub: 1 },
                opacity: 1,
                y: 0,
                duration: 1.2
            });

            if (id === "#Holy_Section") {
                const holyTl = gsap.timeline({
                    scrollTrigger: { trigger: "#Holy_Section", start: "top 60%", toggleActions: "play none none reverse" }
                });
                holyTl.to(".spectrum-row", { opacity: 1, duration: 1, ease: "power2.out" })
                      .to(".spectrum-step", { opacity: 1, stagger: 0.15, duration: 0.6, scale: 1, ease: "back.out(1.7)" }, "-=0.5")
                      .to(".holy-mission-block", { opacity: 1, y: 0, duration: 1.2, ease: "slow(0.7, 0.7, false)" }, "-=0.6")
                      .to(".holy-inquiry-container", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.4")
                      .call(() => document.querySelector(".spectrum-row")?.classList.add("complete"), null, "+=0.2");
            }
        }
    });
}

function initMagnifier() {
    const container = document.getElementById('Philosophy_Magnifier');
    const lens = document.getElementById('Magnifier_Lens');

    if (!container || !lens) return;

    const zoom = 2; // 2x Zoom

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Lens movement
        const lensX = x - lens.offsetWidth / 2;
        const lensY = y - lens.offsetHeight / 2;
        
        gsap.to(lens, {
            left: lensX,
            top: lensY,
            duration: 0.1,
            ease: "none"
        });

        // Background zoom synchronization
        const posX = (x / rect.width) * 100;
        const posY = (y / rect.height) * 100;
        
        lens.style.backgroundPosition = `${posX}% ${posY}%`;
        lens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    });

    // Tracking cursor position for all Great cards (for CSS variables)
    document.querySelectorAll('.great-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

// 3. Bento Card Intersection Observer (Mobile Alternative to Hover)
function initMobileObserver() {
    if (window.innerWidth > 1024) return;
    const cards = document.querySelectorAll(".mobile-project-card, .mobile-great-card");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("mobile-active");
            } else {
                entry.target.classList.remove("mobile-active");
            }
        });
    }, { threshold: 0.4 });

    cards.forEach(card => observer.observe(card));
}

// 3D Tilt for Bento Cards (Desktop Only)
function initBentoTilt() {
    if (window.innerWidth <= 1024) return;
    const cards = document.querySelectorAll('.bento-card, .great-card, .slide-inner');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - (rect.height / 2)) / 35; 
            const rotateY = ((rect.width / 2) - x) / 35;
            gsap.to(card, { rotateX, rotateY, transformPerspective: 1200, duration: 0.4 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// --- 4. Respect Horizontal Scroll (Mobile Snapping & Parallax) ---
function initRespectScroll() {
    const hContent = document.querySelector("#Respect_Scroll_Content");
    if (!hContent) return;

    // Create master timeline linked to scroll trigger
    const respectTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#Respect_Section",
            start: "top top",
            end: () => `+=${hContent.scrollWidth}`,
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                const progress = document.getElementById("Respect_Progress");
                if (progress) {
                    progress.style.width = `${self.progress * 100}%`;
                }
            }
        }
    });

    // Horizontal Scroll translation (using dynamic function)
    respectTl.to(hContent, {
        x: () => -(hContent.scrollWidth - window.innerWidth),
        ease: "none"
    });

    // Slide internal elements horizontal parallax offsets
    const slides = gsap.utils.toArray(".respect-slide");
    slides.forEach((slide) => {
        const text = slide.querySelector("[data-parallax-text]");
        
        if (text) {
            respectTl.to(text, {
                x: 60, // 텍스트는 반대로 밀어줌
                ease: "none"
            }, 0);
        }
    });
}

// --- 5. Data Loading & Rendering ---
const REPO = { owner: 'hpeerage', repo: 'hpeerage' };
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO.owner}/${REPO.repo}/main/web/`;

async function loadDynamicContent() {
    try {
        // Use hConfig for dynamic path mapping with cache-busting
        const localPath = hConfig.BASE_URL + 'data/projects.json?t=' + Date.now();
        const response = await fetch(localPath).catch(() => null);
        let data = response && response.ok ? await response.json() : null;

        if (!data && window.hConfig) {
            const ghResponse = await fetch(`${hConfig.GITHUB.RAW_URL}data/projects.json?t=${Date.now()}`).catch(() => null);
            data = ghResponse && ghResponse.ok ? await ghResponse.json() : null;
        }

        if (data) renderAll(data);
    } catch (e) {
        console.error("Dynamic content load failed:", e);
    }
}

function renderAll(data) {
    if (!data) return;

    if (isMobile()) {
        renderMobileLayout(data);
    } else {
        renderDesktopLayout(data);
    }
    
    if (data.system && data.system.links) renderSystemLinks(data.system.links);
    
    initSectionAnimations();
    if (!isMobile()) {
        initBentoTilt();
        initMagnifier();
        initRespectScroll();
    }
    if (isMobile()) initMobileObserver();
}

// --- Adaptive Device Detection ---
const isMobile = () => window.innerWidth <= 1024; // Updated to 1024 to match tablet breakpoint in CSS

// --- Combined Render Management ---
function renderMobileLayout(data) {
    document.body.classList.add('mobile-adaptive');
    
    if (data.earn) renderMobileEarn(data.earn);
    if (data.great) renderMobileGreat(data.great);
    if (data.esteem) renderMobileEsteem(data.esteem);
    if (data.respect) renderMobileRespect(data.respect);
    if (data.system) renderSystemContent(data.system);
}

function renderDesktopLayout(data) {
    document.body.classList.remove('mobile-adaptive');
    if (data.earn) renderEarnSection(data.earn);
    if (data.great) renderGreatSection(data.great);
    if (data.esteem) renderEsteemSection(data.esteem);
    if (data.respect) renderRespectSection(data.respect);
    if (data.system) renderSystemContent(data.system);
}

// --- Mobile-Specific Rendering (Bulletproof Layout) ---
function renderMobileGreat(greatData) {
    const container = document.getElementById('Great_Cards_Container');
    if (!container || !greatData) return;

    container.innerHTML = greatData.map(m => `
        <div class="mobile-great-card">
            <div class="mobile-great-blueprint" style="background-image: url('${hConfig.getAssetPath(m.image)}')"></div>
            <div class="mobile-great-info">
                <span class="mobile-tag-gold">${m.tag || 'Mastery'}</span>
                <h3>${m.title}</h3>
                <p>${m.description}</p>
                <div class="mobile-progress-ui">
                    <div class="mobile-progress-bar" style="width: 90%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMobileEsteem(esteemData) {
    const container = document.getElementById('Esteem_Cards_Container');
    if (!container || !esteemData) return;

    container.innerHTML = esteemData.map(e => `
        <div class="mobile-project-card" style="border-left: 4px solid #FFD700 !important;">
            <div class="mobile-card-content">
                <span class="mobile-tag" style="background: rgba(255, 215, 0, 0.1) !important; color: #FFD700 !important; border-color: rgba(255, 215, 0, 0.3) !important;">
                    Value ${e.index}
                </span>
                <h3 class="mobile-card-title" style="color: #FFD700;">${e.title}</h3>
                <p class="mobile-card-desc">${e.description}</p>
            </div>
        </div>
    `).join('');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    container.querySelectorAll('.mobile-project-card').forEach(card => observer.observe(card));
}

function renderMobileRespect(respectData) {
    const content = document.getElementById('Respect_Scroll_Content');
    if (!content || !respectData) return;
    
    content.innerHTML = respectData.map(m => `
        <div class="respect-slide slide-${m.id}">
            <div class="slide-inner">
                <div class="slide-text-area" data-parallax-text>
                    <span class="slide-tag">${m.tag}</span>
                    <h3 class="slide-title">${m.title}</h3>
                    ${m.description ? `<p class="slide-desc">${m.description}</p>` : ''}
                </div>
                ${m.image ? `<div class="slide-visual" data-parallax-visual><div class="adventure-visual"><img src="${hConfig.getAssetPath(m.image)}" alt="${m.tag}"></div></div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderMobileEarn(earnProjects) {
    const container = document.getElementById('Earn_Cards_Container');
    if (!container || !earnProjects) return;

    container.innerHTML = earnProjects.map((p, index) => `
        <div class="mobile-project-card" onclick="window.open('${p.url || '#'}', '_blank')">
            <div class="mobile-card-img" style="background-image: url('${hConfig.getAssetPath(p.image)}')"></div>
            <div class="mobile-card-content">
                <span class="mobile-tag">${p.category || 'Project'}</span>
                <h3 class="mobile-card-title">${p.title}</h3>
                <p class="mobile-card-desc">${p.description}</p>
            </div>
        </div>
    `).join('');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.mobile-project-card').forEach(card => observer.observe(card));
}

function renderEarnSection(projects) {
    const grid = document.getElementById('Earn_Cards_Container');
    if(!grid) return;
    grid.innerHTML = projects.map(p => `
        <div class="bento-card ${p.id}-card feature-card ${p.size}">
            <div class="glass-reflection"></div>
            <div class="card-visual" style="background-image: url('${hConfig.getAssetPath(p.image)}');"></div>
            <div class="card-content">
                <span class="card-tag">${p.category}</span>
                <h3 class="card-title">${p.title}</h3>
                <p>${p.description}</p>
                <div class="card-actions">
                    <a href="${p.url}" target="_blank" class="live-btn ${p.id === 'playit' ? 'cyan-glow' : 'soft-border'}">Live Site →</a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderGreatSection(greatData) {
    const container = document.getElementById('Great_Cards_Container');
    if(!container) return;
    
    container.innerHTML = greatData.map(m => {
        if (m.id === 'philosophy') {
            return `
                <div class="great-card philosophy-card large">
                    <div class="magnifier-container" id="Philosophy_Magnifier">
                        <div class="magnifier-bg" style="background-image: url('${hConfig.getAssetPath(m.image)}')"></div>
                        <div class="magnifier-lens" id="Magnifier_Lens" style="background-image: url('${hConfig.getAssetPath(m.image)}')"></div>
                    </div>
                    <div class="card-info">
                        <span class="card-tag">${m.tag}</span>
                        <h3>${m.title}</h3>
                        <p>${m.description}</p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="great-card ${m.id}-card">
                    <div class="card-visual-bg ${m.id}-bg" style="background-image: url('${hConfig.getAssetPath(m.image)}')"></div>
                    <div class="card-info">
                        <span class="card-tag">${m.tag}</span>
                        <h3>${m.title}</h3>
                        <p>${m.description}</p>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function renderEsteemSection(esteemData) {
    const container = document.querySelector('.value-cards');
    if (!container || !esteemData) return;

    container.innerHTML = esteemData.map(e => `
        <div class="value-card">
            <span class="value-index">${e.index}</span>
            <div class="value-content">
                <h4>${e.title}</h4>
                <p>${e.description}</p>
            </div>
        </div>
    `).join('');
}

function renderRespectSection(respectData) {
    const content = document.getElementById('Respect_Scroll_Content');
    if (!content || !respectData) return;

    content.innerHTML = respectData.map(m => `
        <div class="respect-slide slide-${m.id}">
            <div class="slide-inner">
                <div class="slide-text-area" data-parallax-text>
                    <span class="slide-tag">${m.tag}</span>
                    <h3 class="slide-title">${m.title}</h3>
                    ${m.description ? `<p class="slide-desc">${m.description}</p>` : ''}
                </div>
                ${m.image ? `<div class="slide-visual" data-parallax-visual><div class="adventure-visual"><img src="${hConfig.getAssetPath(m.image)}" alt="${m.tag}"></div></div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderSystemContent(system) {
    if (!system) return;
    const titleEl = document.getElementById('Mission_Title');
    const tagEl = document.getElementById('Mission_Tag');
    if (titleEl && system.mission) titleEl.innerHTML = system.mission.replace('hpeerage', '<span class="brand-accent">hpeerage</span>');
    if (tagEl && system.mission_tag) tagEl.innerText = system.mission_tag;
    
    // Inquiry Form Texts
    if (system.inquiry) {
        const btnEl = document.getElementById('inqSubmitBtn');
        const sucTitleEl = document.getElementById('inqSuccessTitle');
        const sucDescEl = document.getElementById('inqSuccessDesc');
        
        if (btnEl && system.inquiry.btnText) btnEl.innerText = system.inquiry.btnText;
        if (sucTitleEl && system.inquiry.successTitle) sucTitleEl.innerText = system.inquiry.successTitle;
        if (sucDescEl && system.inquiry.successDesc) sucDescEl.innerHTML = system.inquiry.successDesc;
    }
}

function renderSystemLinks(links) {
    if(links.email) {
        const emailLink = document.getElementById('link-email');
        if (emailLink) emailLink.href = `mailto:${links.email}`;
    }
    if(links.github) {
        const githubLink = document.getElementById('link-github');
        if (githubLink) githubLink.href = links.github;
    }
    if(links.linkedin) {
        const linkedinLink = document.getElementById('link-linkedin');
        if (linkedinLink) linkedinLink.href = links.linkedin;
    }
}

// --- 6. Inquiry System (Holy Stage) ---
// --- 6. Inquiry System (Holy Stage) - Premium Multi-step Wizard ---
function initInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const successMsg = document.getElementById('inquirySuccess');
    if(!form) return;

    let currentStep = 1;
    const totalSteps = 5;

    const steps = form.querySelectorAll('.form-step');
    const dots = document.querySelectorAll('.step-dot');
    const progressFill = document.getElementById('Inq_Progress_Fill');
    
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('inqSubmitBtn');

    // 스텝 전환 함수
    function goToStep(step, direction = 'next') {
        if (step < 1 || step > totalSteps) return;

        const currentEl = form.querySelector(`.form-step[data-step="${currentStep}"]`);
        const targetEl = form.querySelector(`.form-step[data-step="${step}"]`);

        if (!currentEl || !targetEl) return;

        // GSAP 전환 애니메이션 적용
        const isNext = direction === 'next';
        
        // 현재 스텝 비활성화 및 페이드아웃
        gsap.to(currentEl, {
            opacity: 0,
            x: isNext ? -20 : 20,
            duration: 0.3,
            onComplete: () => {
                currentEl.classList.remove('active');
                currentEl.style.display = 'none';
                
                // 대상 스텝 활성화 및 페이드인
                targetEl.style.display = 'block';
                targetEl.classList.add('active');
                
                gsap.fromTo(targetEl, 
                    { opacity: 0, x: isNext ? 20 : -20 },
                    { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
                );
            }
        });

        // 상태 업데이트
        currentStep = step;
        updateUI();
    }

    // UI 상태(프로그램 바, 버튼 등) 업데이트
    function updateUI() {
        // 프로그레스 바 채우기 비율
        const progressPercent = (currentStep / totalSteps) * 100;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;

        // 상단 단계 도트(Step Indicator) 제어
        dots.forEach((dot, index) => {
            const stepNum = index + 1;
            dot.classList.remove('active', 'complete');
            if (stepNum < currentStep) {
                dot.classList.add('complete');
            } else if (stepNum === currentStep) {
                dot.classList.add('active');
            }
        });

        // 네비게이션 버튼 가시성
        if (currentStep === 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        } else if (currentStep === totalSteps) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    // 현재 활성화된 단계의 필수 입력값 확인
    function validateStep(step) {
        const stepEl = form.querySelector(`.form-step[data-step="${step}"]`);
        if (!stepEl) return true;

        const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity(); // 브라우저 고유 검증 말풍선 띄움
                isValid = false;
            }
        });

        return isValid;
    }

    // 이벤트 리스너 연결
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1, 'next');
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToStep(currentStep - 1, 'prev');
        });
    }

    // 최종 제출 처리
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        // 1. 16개 데이터 취합
        const formData = {
            id: 'inq_' + Date.now(),
            timestamp: new Date().toISOString(),
            name: document.getElementById('inqName').value.trim(),
            contact: document.getElementById('inqContact').value.trim(),
            projectName: document.getElementById('inqProjectName').value.trim(),
            target: form.querySelector('input[name="inqTarget"]:checked')?.value || 'B2C',
            platforms: Array.from(form.querySelectorAll('input[name="inqPlatform"]:checked')).map(el => el.value),
            features: Array.from(form.querySelectorAll('input[name="inqFeatures"]:checked')).map(el => el.value),
            phase: form.querySelector('input[name="inqPhase"]:checked')?.value || '기획/설계 단계',
            difficulty: form.querySelector('input[name="inqDifficulty"]:checked')?.value || '아이디어 구상 단계',
            adminTools: Array.from(form.querySelectorAll('input[name="inqAdminTools"]:checked')).map(el => el.value),
            bmPaid: form.querySelector('input[name="bmPaid"]:checked')?.value || '보통',
            bmAd: form.querySelector('input[name="bmAd"]:checked')?.value || '보통',
            bmSub: form.querySelector('input[name="bmSub"]:checked')?.value || '보통',
            bmBroker: form.querySelector('input[name="bmBroker"]:checked')?.value || '보통',
            schedule: form.querySelector('select[name="inqSchedule"]').value,
            budget: form.querySelector('select[name="inqBudget"]').value,
            scale: form.querySelector('select[name="inqScale"]').value,
            benchmark: document.getElementById('inqBenchmark').value.trim(),
            attachment: document.getElementById('inqAttachment').value.trim(),
            details: document.getElementById('inqDetails').value.trim()
        };

        // 2. 로컬 스토리지에 백업 (Local-First)
        let localInquiries = JSON.parse(localStorage.getItem('hpeerage_inquiries') || '[]');
        localInquiries.push(formData);
        localStorage.setItem('hpeerage_inquiries', JSON.stringify(localInquiries));
        
        console.log("=== Mission Delivered: 16-field Google Form Logic ===");
        console.log("Saved Inquiry:", formData);

        // 3. GAS 전송 처리
        const originalBtnText = submitBtn.innerText;
        
        if (window.hConfig && hConfig.GAS_URL && hConfig.GAS_URL.trim() !== '') {
            submitBtn.innerText = "전송 중...";
            submitBtn.disabled = true;

            fetch(hConfig.GAS_URL, {
                redirect: "follow",
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log("GAS Spreadsheet Sent Success:", data);
            })
            .catch(err => {
                console.error("GAS Spreadsheet Sent Failed:", err);
            })
            .finally(() => {
                // UI 피드백: 폼 사라지고 완료 메시지 출력
                gsap.to(form, {
                    opacity: 0,
                    duration: 0.4,
                    onComplete: () => {
                        form.style.display = 'none';
                        successMsg.style.display = 'block';
                        gsap.fromTo(successMsg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6 });
                    }
                });
            });
        } else {
            // GAS_URL 미설정 시에도 로컬에 저장하고 성공 화면 제공
            gsap.to(form, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    form.style.display = 'none';
                    successMsg.style.display = 'block';
                    gsap.fromTo(successMsg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6 });
                }
            });
        }
    });

    // 초기 UI 동기화
    updateUI();
}

/* --- 7. Hero Night Sky Animation --- */
function initNightSky() {
    const canvas = document.getElementById('Sky_Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, stars = [], shootingStars = [], milkyWayStars = [], nebulaClouds = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Star {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5;
            this.opacity = Math.random();
            this.twinkleSpeed = 0.003 + Math.random() * 0.007;
        }
        update() {
            this.opacity += this.twinkleSpeed;
            if (this.opacity > 1 || this.opacity < 0.2) this.twinkleSpeed *= -1;
            this.y -= 0.1;
            if (this.y < 0) this.y = height;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class MilkyWayStar {
        constructor() { this.reset(); }
        reset() {
            const spread = width > height ? width : height;
            const t = Math.random();
            const offset = (Math.random() - 0.5) * (spread * 0.3);
            this.x = t * width + offset;
            this.y = t * height + (Math.random() - 0.5) * (spread * 0.05);
            this.size = Math.random() * 0.7;
            this.opacity = Math.random() * 0.4;
        }
        update() {
            this.y -= 0.05;
            if (this.y < -20) this.y = height + 20;
        }
        draw() {
            ctx.fillStyle = `rgba(220, 230, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class NebulaCloud {
        constructor() { this.reset(); }
        reset() {
            const spread = width > height ? width : height;
            const t = Math.random();
            this.x = t * width + (Math.random() - 0.5) * (spread * 0.3);
            this.y = t * height + (Math.random() - 0.5) * (spread * 0.08);
            this.size = 150 + Math.random() * 300;
            const colors = [
                'rgba(139, 92, 246, 0.12)', // Purple
                'rgba(236, 72, 153, 0.08)', // Pink/Magenta
                'rgba(245, 158, 11, 0.06)', // Orange
                'rgba(30, 50, 150, 0.05)'   // Deep Blue
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        draw() {
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, this.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.globalCompositeOperation = 'screen';
            ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        }
    }

    class ShootingStar {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = -20;
            this.len = 60 + Math.random() * 120;
            this.speed = 12 + Math.random() * 10;
            this.opacity = 1;
            this.active = false;
        }
        update() {
            if (!this.active) {
                if (Math.random() < 0.0008) this.active = true;
                return;
            }
            this.x += this.speed;
            this.y += this.speed * 0.5;
            this.opacity -= 0.012;
            if (this.opacity <= 0) this.reset();
        }
        draw() {
            if (!this.active) return;
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.len, this.y - this.len * 0.5);
            ctx.stroke();
        }
    }

    function drawGalacticCore() {
        const coreX = width * 0.6;
        const coreY = height * 0.6;
        const grad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, width * 0.4);
        grad.addColorStop(0, 'rgba(255, 140, 60, 0.15)');
        grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.save();
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    function init() {
        resize();
        stars = Array.from({ length: 120 }, () => new Star());
        milkyWayStars = Array.from({ length: 1200 }, () => new MilkyWayStar());
        nebulaClouds = Array.from({ length: 25 }, () => new NebulaCloud());
        shootingStars = [new ShootingStar()];
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Background Glow
        drawGalacticCore();
        
        // Nebula Clouds (The gaseous background)
        ctx.save();
        nebulaClouds.forEach(n => n.draw());
        ctx.restore();

        // Stars
        ctx.save();
        milkyWayStars.forEach(s => { s.update(); s.draw(); });
        stars.forEach(s => { s.update(); s.draw(); });
        ctx.restore();

        // Foremost effects
        shootingStars.forEach(s => { s.update(); s.draw(); });
        
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
    initInquiryForm();
    initNightSky();
});

window.addEventListener('load', () => {
    // 모든 이미지와 리소스가 완전히 로드된 시점에 GSAP ScrollTrigger를 새로고침하여 가로 영역 너비가 꼬이지 않도록 합니다.
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 300);
});
