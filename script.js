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
        opacity: isMobile ? 1 : 1, // Restored visibility for mobile v13
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
        const isVisible = navOverlay.style.display === 'flex';
        navOverlay.style.display = isVisible ? 'none' : 'flex';
        navToggle.innerHTML = isVisible ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.style.display = 'none';
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
                      .call(() => document.querySelector(".spectrum-row")?.classList.add("complete"), null, "+=0.2");
            }
        }
    });
}

// --- 3. Bento Card Intersection Observer (Mobile Alternative to Hover) ---
function initMobileObserver() {
    if (window.innerWidth > 480) return;
    const cards = document.querySelectorAll(".bento-card");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("mobile-active");
            } else {
                entry.target.classList.remove("mobile-active");
            }
        });
    }, { threshold: 0.6 });

    cards.forEach(card => observer.observe(card));
}

// 3D Tilt for Bento Cards (Desktop Only)
function initBentoTilt() {
    if (window.innerWidth <= 480) return;
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - (rect.height / 2)) / 20; 
            const rotateY = ((rect.width / 2) - x) / 20;
            gsap.to(card, { rotateX, rotateY, transformPerspective: 1000, duration: 0.5 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// --- 4. Respect Horizontal Scroll (Mobile Snapping) ---
mm.add("(min-width: 481px)", () => {
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
    const response = await fetch('data/projects.json').catch(() => null);
    let data = response && response.ok ? await response.json() : null;

    if (!data) {
        const ghResponse = await fetch(`${GITHUB_RAW_BASE}data/projects.json`).catch(() => null);
        data = ghResponse && ghResponse.ok ? await ghResponse.json() : null;
    }

    if (data) renderAll(data);
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
    if (!isMobile()) initBentoTilt();
    if (isMobile()) initMobileObserver();
}

// --- Adaptive Device Detection ---
const isMobile = () => window.innerWidth <= 768;

// --- Combined Render Management ---
function renderMobileLayout(data) {
    document.body.classList.add('mobile-adaptive');
    
    // Inject Ghost Text for Depth
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-bg-text';
        ghost.innerText = 'HPEERAGE';
        ghost.style.top = '10%';
        hero.appendChild(ghost);
    }

    renderMobileEarn(data.earn);
    renderMobileGreat(data.great);
    renderMobileEsteem(data.esteem);
}

function renderDesktopLayout(data) {
    document.body.classList.remove('mobile-adaptive');
    if (data.earn) renderEarnSection(data.earn);
    if (data.great) renderGreatSection(data.great);
}

// --- Mobile-Specific Rendering (Bulletproof Layout) ---
function renderMobileGreat(greatProjects) {
    const container = document.getElementById('Great_Cards_Container');
    if (!container || !greatProjects) return;

    container.innerHTML = greatProjects.map(p => `
        <div class="mobile-project-card reveal" style="grid-column: span 2;">
            <div class="mobile-card-img" style="background-image: url('${p.image}')"></div>
            <div class="mobile-card-content">
                <span class="mobile-tag">${p.tag || 'Project'}</span>
                <h3 class="mobile-card-title">${p.title}</h3>
                <p class="mobile-card-desc">${p.description}</p>
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
                    ${e.tag || 'Value'}
                </span>
                <h3 class="mobile-card-title" style="color: #FFD700;">${e.title}</h3>
                <p class="mobile-card-desc">${e.description}</p>
            </div>
        </div>
    `).join('');

    // Apply Intersection Observer to Esteem cards too
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    container.querySelectorAll('.mobile-project-card').forEach(card => observer.observe(card));
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

    // --- Premium Reveal Animation Trigger ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.mobile-project-card').forEach(card => observer.observe(card));
}

function renderMobileGreat(greatProjects) {
    const container = document.getElementById('Great_Cards_Container');
    if (!container || !greatProjects) return;

    container.innerHTML = greatProjects.map(m => `
        <div class="mobile-great-card" onclick="window.open('${m.url || '#'}', '_blank')">
            <div class="mobile-great-blueprint" style="background-image: url('${m.image}')"></div>
            <div class="mobile-great-info">
                <span class="mobile-tag-gold">${m.category || 'Expert Mastery'}</span>
                <h3>${m.title}</h3>
                <p>${m.description}</p>
                <div class="mobile-progress-ui">
                    <div class="mobile-progress-bar" style="width: 85%"></div>
                </div>
            </div>
        </div>
    `).join('');
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

function renderGreatSection(mastery) {
    const container = document.getElementById('Great_Cards_Container');
    if(!container) return;
    container.innerHTML = mastery.map(m => `
        <div class="great-card master-logic large">
            <div class="card-glass-effect"></div>
            <div class="blueprint-bg">
                <img src="${m.image}" alt="Expert Mastery Blueprint">
            </div>
            <div class="card-info">
                 <span class="card-tag">Architecture</span>
                <h3>${m.title}</h3>
                <p>${m.description}</p>
                <div class="optimization-graphic">
                    <div class="bar-logic"><div class="bar-fill fill-purple" style="width: 95%"></div></div>
                    <div class="bar-logic"><div class="bar-fill fill-purple" style="width: 98%"></div></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSystemLinks(links) {
    if(links.email) document.getElementById('link-email').href = `mailto:${links.email}`;
    if(links.github) document.getElementById('link-github').href = links.github;
    if(links.linkedin) document.getElementById('link-linkedin').href = links.linkedin;
}

document.addEventListener('DOMContentLoaded', loadDynamicContent);
;
