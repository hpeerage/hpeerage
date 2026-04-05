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
    isDesktop: "(min-width: 481px)",
    isMobile: "(max-width: 480px)"
}, (context) => {
    let { isMobile } = context.conditions;
    
    // Adjust logo transition for mobile
    gsap.to("#Main_Logo", {
        scrollTrigger: {
            trigger: "#Hero_Section",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
        },
        scale: isMobile ? 0.35 : 0.35,
        top: isMobile ? "40px" : "60px",
        left: isMobile ? "50%" : "100px",
        xPercent: isMobile ? -50 : 0,
        opacity: isMobile ? 0.08 : 1, // Faded for readability on mobile
        duration: 1
    });

    gsap.to("#Logo_Core", {
        scrollTrigger: {
            trigger: "#Hero_Section",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
        },
        fill: "#00F2FE",
        filter: isMobile ? "none" : "drop-shadow(0 0 15px rgba(0, 242, 254, 0.4))",
        duration: 1
    });
});

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
    if(data.earn) renderEarnSection(data.earn);
    if(data.great) renderGreatSection(data.great);
    if(data.system && data.system.links) renderSystemLinks(data.system.links);
    
    initSectionAnimations();
    initBentoTilt();
    initMobileObserver();
}

function renderEarnSection(projects) {
    const grid = document.querySelector('.bento-grid');
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
