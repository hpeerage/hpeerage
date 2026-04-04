// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- 0. Premium Cursor & Interaction System ---
const cursor = document.getElementById('cursor-dot');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Direct dot positioning
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0, ease: "none" });
});

// Smooth follower using GSAP ticker
gsap.ticker.add(() => {
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;
    gsap.set(follower, { x: posX, y: posY });
});

// Magnetic Elements Logic
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

// 3D Tilt for Bento Cards
function initBentoTilt() {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20; 
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power2.out"
            });

            // Move the reflection sheen
            const reflection = card.querySelector('.glass-reflection');
            if (reflection) {
                const moveX = (x / rect.width) * 100;
                const moveY = (y / rect.height) * 100;
                gsap.to(reflection, {
                    left: `${moveX}%`,
                    top: `${moveY}%`,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            const reflection = card.querySelector('.glass-reflection');
            if (reflection) {
                gsap.to(reflection, { left: '50%', top: '-50%', duration: 0.8 });
            }
        });
    });
}


// 1. Logo Scroll Interaction (15% to 40% scroll)
const logoCore = document.querySelector("#Logo_Core");
const mainLogo = document.querySelector("#Main_Logo");

if (logoCore && mainLogo) {
    const logoTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#Hero_Section",
            start: "top top",
            end: "bottom top", 
            scrub: 1.2,
            pin: false,
        }
    });

    logoTl.to("#Logo_Core", { fill: "#00F2FE", duration: 1 }, 0.15);
    logoTl.to("#Main_Logo", { scale: 0.35, top: "60px", left: "100px", xPercent: 0, duration: 1 }, 0.15);
    logoTl.to("#Logo_Core", { filter: "drop-shadow(0 0 15px rgba(0, 242, 254, 0.4))", duration: 1 }, 0.4);
}

// Logo color phases based on sections
const phases = [
    { trigger: "#Esteem_Section", color: "#FFD700", glow: "url(#gold-inner-glow) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))" },
    { trigger: "#Respect_Section", color: "#7CFC00", glow: "drop-shadow(0 0 30px rgba(124, 252, 0, 0.6))" },
    { trigger: "#Great_Section", color: "#8B5CF6", glow: "drop-shadow(0 0 45px rgba(139, 92, 246, 0.5))" },
    { trigger: "#Holy_Section", color: "#FFFFFF", glow: "drop-shadow(0 0 60px rgba(255, 255, 255, 0.8))" }
];

phases.forEach(phase => {
    if (document.querySelector(phase.trigger)) {
        gsap.to("#Logo_Core", {
            scrollTrigger: {
                trigger: phase.trigger,
                start: "top bottom",
                end: "top center",
                scrub: 1,
                onEnter: () => phase.trigger === "#Holy_Section" && document.querySelector("#Logo_Core")?.classList.add("holy-pulse"),
                onLeaveBack: () => phase.trigger === "#Holy_Section" && document.querySelector("#Logo_Core")?.classList.remove("holy-pulse")
            },
            fill: phase.color,
            filter: phase.glow,
            duration: 1
        });
    }
});

// 2. Section Fade-ins
["#Earn_Section", "#Esteem_Section", "#Respect_Section", "#Great_Section", "#Holy_Section"].forEach(id => {
    const el = document.querySelector(id);
    if (el) {
        gsap.to(id, {
            scrollTrigger: { trigger: id, start: "top bottom", end: "top 20%", scrub: 1 },
            opacity: 1,
            y: 0,
            duration: 1.2
        });

        // Special inner animations for Holy Section
        if (id === "#Holy_Section") {
            const holyTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#Holy_Section",
                    start: "top 60%",
                    toggleActions: "play none none reverse"
                }
            });

            holyTl.to(".spectrum-row", { opacity: 1, duration: 1, ease: "power2.out" })
                  .to(".spectrum-step", { 
                    opacity: 1, 
                    stagger: 0.2, 
                    duration: 0.8, 
                    scale: 1, 
                    ease: "back.out(1.7)" 
                  }, "-=0.5")
                  .to(".holy-mission-block", { opacity: 1, y: 0, duration: 1.5, ease: "slow(0.7, 0.7, false)" }, "-=0.8")
                  .to(".holy-formula", { opacity: 1, duration: 1, ease: "power1.inOut" }, "-=0.5");
            
            // Add complete class to spectrum-row for the glowing orb animation in CSS
            holyTl.call(() => document.querySelector(".spectrum-row")?.classList.add("complete"), null, "+=0.2");
        }
    }
});

// 3. Bento Cards Reveal (Earn Section)
function animateBentoCards() {
    if (document.querySelectorAll(".bento-card").length > 0) {
        gsap.from(".bento-card", {
            scrollTrigger: { trigger: "#Earn_Section", start: "top 85%" },
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power2.out",
            clearProps: "all"
        });
    }
}

// 4. Mouse Follow Effect
const earnSection = document.querySelector("#Earn_Section");
if (earnSection) {
    window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        earnSection.style.setProperty("--mouse-x", `${x}%`);
        earnSection.style.setProperty("--mouse-y", `${y}%`);
    });
}

// 5. Parallax Backgrounds
if (document.querySelector(".parallax-bg")) {
    gsap.to(".parallax-bg", {
        scrollTrigger: { trigger: "#Esteem_Section", start: "top bottom", end: "bottom top", scrub: 2 },
        y: 250, opacity: 0.03, ease: "none"
    });
}

// 6. Global Section Particles
function initSectionParticles(canvasId, particleColor = 'rgba(255, 255, 255, 0.3)') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 40;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 1.5;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.fillStyle = particleColor; ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// Initializing particles for specific sections
document.addEventListener('DOMContentLoaded', () => {
    initSectionParticles('esteem-particles', 'rgba(255, 215, 0, 0.2)');
    initSectionParticles('holy-particles', 'rgba(0, 242, 254, 0.2)');
});


// 7. Section 4: Respect (Horizontal Scroll)
const hContent = document.querySelector("#Respect_Scroll_Content");
if (hContent) {
    const respectTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#Respect_Section", start: "top top", end: () => `+=${hContent.scrollWidth}`,
            scrub: 1.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true
        }
    });
    respectTl.to(hContent, { x: () => -(hContent.scrollWidth - window.innerWidth), ease: "none" });
    respectTl.to("#Respect_Progress", { width: "100%", ease: "none" }, 0);
}

// 8. Dynamic Content Loading with GitHub Fallback
const REPO = { owner: 'hpeerage', repo: 'hpeerage' };
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO.owner}/${REPO.repo}/main/`;

const fallbackData = {
    earn: [
        { id: "playit", category: "Hospitality TECH", title: "Playit Platform", description: "All-in-one management for motels & PC areas.", image: "images/portfolio/portfolio_02_Playit-luncher.png", url: "https://playit.kr", size: "large" },
    ],
    great: [],
    system: { links: { email: "contact@hpeerage.com", github: "#", linkedin: "#" } }
};

function getImageUrl(path) {
    if(!path) return '';
    if(path.startsWith('http') || path.startsWith('data:')) return path;
    // Prefix with GitHub raw content if we are in local file mode or for relative paths
    if (window.location.protocol === 'file:') {
        return GITHUB_RAW_BASE + path;
    }
    return path;
}

async function loadDynamicContent() {
    let data = null;

    // Detect if running from local file protocol
    const isLocalFile = window.location.protocol === 'file:';

    if (!isLocalFile) {
        // Try local fetch first (works on servers/hosting)
        try {
            const response = await fetch('data/projects.json');
            if (response.ok) {
                data = await response.json();
                console.log('Loaded data from local source.');
            }
        } catch (err) {
            console.warn('Local data fetch failed.');
        }
    } else {
        console.info('Local File Protocol Detected: Skipping local fetch to avoid CORS console errors.');
    }

    // If data is still null (local fetch failed or was skipped on file://), try GitHub Raw fallback
    if (!data) {
        try {
            console.info('Attempting to fetch data from GitHub Raw Content...');
            const response = await fetch(`${GITHUB_RAW_BASE}data/projects.json`);
            if (response.ok) {
                data = await response.json();
                console.info('Successfully loaded live data from GitHub!');
            }
        } catch (err) {
            console.error('GitHub data fetch failed:', err);
        }
    }

    // Final fallback to hardcoded data if all else fails
    if (!data) {
        console.warn('Using hardcoded fallback data.');
        data = fallbackData;
    }

    renderAll(data);
}

function renderAll(data) {
    if(data.earn) renderEarnSection(data.earn);
    if(data.great) renderGreatSection(data.great);
    if(data.system && data.system.links) renderSystemLinks(data.system.links);
    animateBentoCards(); // Trigger GSAP after rendering
    initBentoTilt(); // Trigger 3D interactions
}

function renderEarnSection(projects) {
    const grid = document.querySelector('.bento-grid');
    if(!grid) return;
    grid.innerHTML = projects.map(p => `
        <div class="bento-card ${p.id}-card feature-card ${p.size}">
            <div class="glass-reflection"></div>
            <div class="card-visual" style="background-image: url('${getImageUrl(p.image)}');"></div>
            <div class="card-content">
                <span class="card-tag">${p.category}</span>
                <h3 class="card-title">${p.title}</h3>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">${p.description}</div>
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
    container.innerHTML = mastery.map(m => {
        if(m.type === 'slider') {
            return `
                <div class="great-card master-blueprint large">
                    <div class="card-glass-effect"></div>
                    <div class="comparison-slider">
                        <img src="${getImageUrl(m.after_img)}" class="comparison-img comparison-after">
                        <img src="${getImageUrl(m.before_img)}" class="comparison-img comparison-before">
                        <div class="comparison-handle"></div>
                    </div>
                    <div class="card-info">
                        <h3>${m.title}</h3>
                        <p>${m.description}</p>
                    </div>
                </div>`;
        } else if(m.type === 'icon') {
            return `
                <div class="great-card master-logic">
                    <div class="card-glass-effect"></div>
                    <div class="icon-visual" style="font-size: 40px; color: var(--great-purple); margin-bottom: 20px;">
                        <i class="${m.icon || 'fas fa-rocket'}"></i>
                    </div>
                    <div class="card-info">
                        <h3>${m.title}</h3>
                        <p>${m.description}</p>
                    </div>
                </div>`;
        } else {
            return `<div class="great-card master-logic"><div class="card-info"><h3>${m.title}</h3><p>${m.description}</p></div></div>`;
        }
    }).join('');
}

function renderSystemLinks(links) {
    if(links.email) document.getElementById('link-email').href = `mailto:${links.email}`;
    if(links.github) document.getElementById('link-github').href = links.github;
    if(links.linkedin) document.getElementById('link-linkedin').href = links.linkedin;
}

document.addEventListener('DOMContentLoaded', loadDynamicContent);
