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
    isDesktop: "(min-width: 769px)",
    isMobile: "(max-width: 768px)"
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
    if (window.innerWidth > 768) return;
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
    if (window.innerWidth <= 768) return;
    const cards = document.querySelectorAll('.bento-card, .great-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - (rect.height / 2)) / 30; 
            const rotateY = ((rect.width / 2) - x) / 30;
            gsap.to(card, { rotateX, rotateY, transformPerspective: 1200, duration: 0.4 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// --- 4. Respect Horizontal Scroll (Mobile Snapping) ---
mm.add("(min-width: 769px)", () => {
    const hContent = document.querySelector("#Respect_Scroll_Content");
    if (hContent) {
        gsap.to(hContent, {
            x: () => -(hContent.scrollWidth - window.innerWidth),
            scrollTrigger: {
                trigger: "#Respect_Section", start: "top top", end: () => `+=${hContent.scrollWidth}`,
                scrub: 1.5, pin: true, anticipatePin: 1
            }
        });
    }
});

// --- 5. Data Loading & Rendering ---
const REPO = { owner: 'hpeerage', repo: 'hpeerage' };
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO.owner}/${REPO.repo}/main/web/`;

async function loadDynamicContent() {
    try {
        // Use hConfig for dynamic path mapping
        const localPath = hConfig.BASE_URL + 'data/projects.json';
        const response = await fetch(localPath).catch(() => null);
        let data = response && response.ok ? await response.json() : null;

        if (!data && window.hConfig) {
            const ghResponse = await fetch(`${hConfig.GITHUB.RAW_URL}data/projects.json`).catch(() => null);
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
            <div class="mobile-great-blueprint" style="background-image: url('${m.image}')"></div>
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
    
    // On mobile, we only show the first major slide (Adventure) as per current CSS design
    const m = respectData[0];
    content.innerHTML = `
        <div class="respect-slide slide-adventure">
            <div class="slide-inner">
                <span class="slide-tag">${m.tag}</span>
                <h3 class="slide-title">${m.title}</h3>
                <div class="adventure-visual">
                    <img src="${m.image}" alt="${m.tag}">
                </div>
            </div>
        </div>
    `;
}

function renderMobileEarn(earnProjects) {
    const container = document.getElementById('Earn_Cards_Container');
    if (!container || !earnProjects) return;

    container.innerHTML = earnProjects.map((p, index) => `
        <div class="mobile-project-card" onclick="window.open('${p.url || '#'}', '_blank')">
            <div class="mobile-card-img" style="background-image: url('${p.image}')"></div>
            <div class="mobile-card-content">
                <span class="mobile-tag">${p.tag || 'Project'}</span>
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
            <div class="card-visual" style="background-image: url('${p.image}');"></div>
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
                        <div class="magnifier-bg" style="background-image: url('${m.image}')"></div>
                        <div class="magnifier-lens" id="Magnifier_Lens" style="background-image: url('${m.image}')"></div>
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
                    <div class="card-visual-bg ${m.id}-bg" style="background-image: url('${m.image}')"></div>
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
                <span class="slide-tag">${m.tag}</span>
                <h3 class="slide-title">${m.title}</h3>
                ${m.image ? `<div class="adventure-visual"><img src="${m.image}" alt="${m.tag}"></div>` : ''}
                ${m.description ? `<p class="slide-desc">${m.description}</p>` : ''}
                ${m.list && m.list.length > 0 ? `
                    <ul class="${m.id === 'victory' ? 'victory' : 'respect'}-list">
                        ${m.list.map(li => `<li>${li}</li>`).join('')}
                    </ul>
                ` : ''}
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
function initInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const successMsg = document.getElementById('inquirySuccess');
    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Collect Data
        const formData = {
            id: 'inq_' + Date.now(),
            timestamp: new Date().toISOString(),
            name: document.getElementById('inqName').value.trim(),
            contact: document.getElementById('inqContact').value.trim(),
            category: document.getElementById('inqCategory').value,
            budget: document.getElementById('inqBudget').value,
            schedule: document.getElementById('inqSchedule').value.trim(),
            details: document.getElementById('inqDetails').value.trim()
        };

        // 2. Local-First Storage (Mocking DB)
        let localInquiries = JSON.parse(localStorage.getItem('hpeerage_inquiries') || '[]');
        localInquiries.push(formData);
        localStorage.setItem('hpeerage_inquiries', JSON.stringify(localInquiries));
        
        console.log("=== Mission Delivered: Local Mode ===");
        console.log("Saved Inquiry:", formData);
        
        // 3. Google Apps Script / EmailJS 연동 (배포 모드)
        const submitBtn = form.querySelector('button[type="submit"]');
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
                console.log("Email Notification Sent:", data);
            })
            .catch(err => {
                console.error("Email Notification Failed:", err);
            })
            .finally(() => {
                // UI Feedback
                form.style.opacity = '0';
                setTimeout(() => {
                    form.style.display = 'none';
                    successMsg.style.display = 'block';
                }, 500);
            });
        } else {
            // 로컬 전용 처리 (이메일 발송 미설정 시)
            form.style.opacity = '0';
            setTimeout(() => {
                form.style.display = 'none';
                successMsg.style.display = 'block';
            }, 500);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
    initInquiryForm();
});
