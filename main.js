import './style.css';

const BASE = import.meta.env.BASE_URL;

// ── Asset URLs ──────────────────────────────────────────────────────────────
// The two architect photos are served from /public, not a third-party CDN.
// PORTRAIT = studio, black suit, boardroom. FIELD = Eridanus polo, boots,
// standing on the bakkie with the maize behind him. Two worlds, one operator.
// BASE_URL follows vite.config.js `base`, so these keep working whether the
// page is served at the root or under /calculator. A hardcoded leading slash
// would break the moment the base changes.
const COBUS_PORTRAIT = `${import.meta.env.BASE_URL}cobus-nel-portrait.jpg`;
const COBUS_FIELD = `${import.meta.env.BASE_URL}cobus-nel-field.jpg`;

// The four "As Seen On" logos, self-hosted. These previously pointed at
// files.manuscdn.com, a third-party session CDN. That CDN has since expired
// and took the whole trust row down on the live site with no alert. They are
// now real files in /public/logos, converted to white-on-transparent from the
// originals in the campaign folder, so nothing external can break them again.
const LOGO_KYKNET = BASE + 'logos/kyknet.png';
const LOGO_ONTBYT = BASE + 'logos/ontbytsake.png';
const LOGO_PRETORIA_FM = BASE + 'logos/pretoria-fm.png';
const LOGO_EY = BASE + 'logos/ey.png';
// ONE destination for every call to action on this page: the form below.
// This used to be https://cobusnel.com/apply, which sent the highest-intent
// traffic to a second form on a second domain while the form on this page
// went unused. One page, one action, one Lead event.
const APPLY_URL = '#lead-form-section';

// ── Data ────────────────────────────────────────────────────────────────────
const CAPITAL_STEPS = [
  { value: 1_000_000, label: 'R1M' },
  { value: 2_500_000, label: 'R2.5M' },
  { value: 5_000_000, label: 'R5M' },
  { value: 10_000_000, label: 'R10M' },
  { value: 20_000_000, label: 'R20M+' },
];

const STRUCTURES = [
  { value: 'bank', label: 'Bank savings / fixed deposit', rate: 0.085 },
  { value: 'ra', label: 'Retirement annuity (RA)', rate: 0.09 },
  { value: 'unit-trust', label: 'Unit trust / mutual fund', rate: 0.10 },
  { value: 'property', label: 'Property', rate: 0.07 },
  { value: 'business', label: 'Business / company', rate: 0.12 },
  { value: 'other', label: 'Other / not sure', rate: 0.075 },
];

// ── PARAMETRIC HALO PATTERNS ─────────────────────────────────────────────────
// One generator, four formations. Each pillar passes its own parameters
// (point count, radius, formation type, color); nothing here is hand-drawn
// per letter, it's the same math producing four distinct results.
function generateHaloPattern(formation, color, seed) {
  const cx = 60, cy = 60;
  const n = 5 + seed;

  if (formation === 'grid') {
    // H — Hard to Fake: a real lattice, connected by row and column adjacency
    const cols = 3, rows = 2;
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) row.push([30 + c * 30, 40 + r * 30]);
      grid.push(row);
    }
    const gridLines = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c < cols - 1) {
          const [x1, y1] = grid[r][c], [x2, y2] = grid[r][c + 1];
          gridLines.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" stroke-dasharray="3 5" opacity="0.35" class="halo-pattern-line"/>`);
        }
        if (r < rows - 1) {
          const [x1, y1] = grid[r][c], [x2, y2] = grid[r + 1][c];
          gridLines.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" stroke-dasharray="3 5" opacity="0.35" class="halo-pattern-line"/>`);
        }
      }
    }
    const gridDots = grid.flat().map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${color}" opacity="0.55" class="halo-pattern-dot"/>`).join('');
    return `
    <svg class="halo-pattern" viewBox="0 0 120 120" style="position:absolute;bottom:-10px;right:-10px;width:130px;height:130px;pointer-events:none;opacity:0.5;transition:opacity 400ms ease;">
      <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.15"/>
      ${gridLines.join('')}
      ${gridDots}
    </svg>`;
  }

  const pts = [];

  if (formation === 'converge') {
    // A — Anchored to Real Value: lines weighted downward to a single base
    const base = [cx, 105];
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI / (n - 1)) * i;
      pts.push([cx - 45 * Math.cos(angle), 25 + 55 * Math.sin(angle)]);
    }
    pts.push(base);
  } else if (formation === 'ring') {
    // L — Low Obsolescence: a stable, slow orbital ring
    const r = 34;
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI / n) * i;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
  } else {
    // O — Operator-Grounded: spokes radiating from one strong center
    const r = 40;
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI / n) * i;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
  }

  const lines = formation === 'spokes'
    ? pts.map(([x, y]) => `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="1" stroke-dasharray="3 5" opacity="0.35" class="halo-pattern-line"/>`).join('')
    : pts.map(([x, y], i) => {
        const [nx, ny] = pts[(i + 1) % pts.length];
        return `<line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="${color}" stroke-width="1" stroke-dasharray="3 5" opacity="0.35" class="halo-pattern-line"/>`;
      }).join('');

  const dots = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${color}" opacity="0.55" class="halo-pattern-dot"/>`).join('');

  return `
    <svg class="halo-pattern" viewBox="0 0 120 120" style="position:absolute;bottom:-10px;right:-10px;width:130px;height:130px;pointer-events:none;opacity:0.5;transition:opacity 400ms ease;">
      <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.15"/>
      ${lines}
      ${dots}
    </svg>`;
}

const HALO_PILLARS = [
  {
    letter: 'H',
    title: 'Hard to Fake',
    body: 'Physical land and agricultural infrastructure. You can stand on it. You can touch it. It exists in the real world, not on a spreadsheet.',
    color: '#8B7355',
    formation: 'grid',
    seed: 1,
  },
  {
    letter: 'A',
    title: 'Anchored to Real Value',
    body: 'Eridanus acquires assets at below-market value. Your capital is backed by assets worth more than the entry price from day one.',
    color: '#6B8E6B',
    formation: 'converge',
    seed: 2,
  },
  {
    letter: 'L',
    title: 'Low Obsolescence',
    body: 'Agricultural land does not become technologically stranded. It does not depreciate like a car or a server. It produces, season after season.',
    color: '#7A8B6B',
    formation: 'ring',
    seed: 3,
  },
  {
    letter: 'O',
    title: 'Operator-Grounded',
    body: 'Cobus Nel has farmed, traded commodities, and navigated business rescues. The person managing your capital has operated in the real world.',
    color: '#8B7A55',
    formation: 'spokes',
    seed: 1,
  },
];

const CASE_STUDIES = [
  {
    profile: 'Commercial Farmer, Limpopo',
    capital: 'R100M+ in assets',
    tag: 'Large Capital',
    challenge: 'Wealth entirely concentrated in land and farming operations. No structured capital allocation outside the primary business.',
    outcome: 'Restructured through Eridanus. Capital now working across secured agricultural assets independent of the primary farming cycle.',
  },
  {
    profile: 'Corporate Executive, Pretoria',
    capital: 'R2.5M to R5M',
    tag: 'Mid Tier',
    challenge: '30 years of corporate income. Pension fund underperforming inflation. Capital sitting in bank deposits above the R200,000 protection threshold.',
    outcome: 'Discovery Session completed. Capital restructured into a secured, asset-backed vehicle. Deal terms agreed before deployment.',
  },
  {
    profile: 'Family Office, Gauteng',
    capital: 'R10M+',
    tag: 'Priority',
    challenge: 'Seeking a secured, physical-asset-backed structure independent of equity markets and currency volatility.',
    outcome: 'Bespoke Eridanus structure. Capital secured against agricultural assets. Deal structure agreed before any capital was deployed.',
  },
];

// ── Utilities ───────────────────────────────────────────────────────────────
function formatRand(n) {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${Math.round(n)}`;
}

function countUp(el, target, duration = 1000) {
  const start = Date.now();
  const isRand = target >= 1000;
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(target * eased);
    el.textContent = isRand ? formatRand(val) : val;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Intersection Observer for fade-ins ──────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

function observeFadeIns() {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── SVG Arrow ───────────────────────────────────────────────────────────────
const ARROW_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
// Sits under every primary CTA. Three objections killed in one line:
// how long, what it costs, what it commits you to.
const REASSURE = (align = 'left') => `
  <p style="font-size:11px;color:var(--text-3);letter-spacing:0.04em;margin-top:0.875rem;text-align:${align};display:flex;gap:0.6rem;flex-wrap:wrap;${align === 'center' ? 'justify-content:center;' : ''}">
    <span>Under 60 seconds</span><span style="opacity:0.4;">/</span>
    <span>No cost</span><span style="opacity:0.4;">/</span>
    <span>No obligation</span>
  </p>`;

const CHEVRON_DOWN = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNav()}
    ${renderHero()}
    ${renderLogos()}
    ${renderVideoInterviews()}
    ${renderDiagnostic()}
    ${renderHALO()}
    ${renderCaseStudies()}
    ${renderComparison()}
    ${renderMeetTheArchitect()}
    ${renderOperator()}
    ${renderWhyHalo()}
    ${renderFinalCTA()}
    ${renderLeadForm()}
    ${renderFooter()}
    ${renderStickyCTA()}
  `;

  observeFadeIns();
  initStickyCTA();
  initDiagnostic();
  initFloatingParticles();
  initLeadForm();
  initVideoInterviews();
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function renderNav() {
  return `
  <nav style="position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 0;transition:background 300ms,backdrop-filter 300ms;" id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;">
      <span style="font-family:var(--serif);font-size:20px;font-weight:700;color:var(--text);letter-spacing:0.02em;">Cobus Nel</span>
      <div style="display:flex;align-items:center;gap:1.25rem;">
        <span class="figure hide-mobile" style="font-size:11px;border:1px solid var(--gold-border);border-radius:100px;padding:6px 14px;letter-spacing:0.06em;">FSP 48947</span>
        <a href="${APPLY_URL}" class="btn-primary" style="font-size:12px;padding:10px 20px;">Get My Free Projection ${ARROW_SVG}</a>
      </div>
    </div>
  </nav>`;
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function renderHero() {
  return `
  <section style="position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding-top:80px;">
    <!-- Animated background particles -->
    <div id="particles" style="position:absolute;inset:0;pointer-events:none;z-index:1;"></div>
    <!-- Dark gradient bg -->
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%, rgba(212,165,116,0.04) 0%, transparent 60%),radial-gradient(ellipse at 80% 20%, rgba(107,142,107,0.03) 0%, transparent 50%);z-index:0;"></div>
    <!-- Grid texture -->
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px);background-size:80px 80px;z-index:0;"></div>

    <div class="container" style="position:relative;z-index:2;padding-top:60px;padding-bottom:80px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center;" class="grid-2">
        <!-- Left: Copy -->
        <div>
          <div class="fade-in" style="transition-delay:0ms;">
            <span class="eyebrow">Eridanus Capital Diagnostic</span>
          </div>
          <div class="fade-in" style="transition-delay:80ms;">
            <h1 class="display" style="margin-bottom:1.75rem;">
              Your capital<br>is working.<br>
              <span style="color:var(--gold);">For whom?</span>
            </h1>
          </div>
          <div class="fade-in" style="transition-delay:160ms;">
            <p style="font-size:17px;max-width:460px;margin-bottom:2.5rem;line-height:1.8;">
              Most South African investors with R1 million or more are unknowingly leaving capital on the table. Get a free projection built against the position you actually hold, or run the diagnostic below first and see the gap for yourself.
            </p>
          </div>
          <div class="fade-in" style="transition-delay:240ms;display:flex;gap:1rem;flex-wrap:wrap;">
            <a href="${APPLY_URL}" class="btn-primary">Get My Free Projection ${ARROW_SVG}</a>
            <a href="#diagnostic" style="display:inline-flex;align-items:center;gap:6px;font-size:14px;color:var(--text-2);text-decoration:none;border-bottom:1px solid var(--border);padding-bottom:2px;align-self:center;transition:color 200ms,border-color 200ms;" onmouseover="this.style.color='var(--gold)';this.style.borderColor='var(--gold-border)'" onmouseout="this.style.color='var(--text-2)';this.style.borderColor='var(--border)'">Or see where it sits first &darr;</a>
          </div>
          ${REASSURE('left')}
          <div class="fade-in" style="transition-delay:320ms;margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border);display:flex;gap:2.5rem;flex-wrap:wrap;">
            ${[
              { fig: 'FSP 48947', label: 'FSCA Authorised' },
              { fig: 'CA(SA)', label: 'Qualified Management' },
              { fig: '2018', label: 'Operating Since' },
            ].map(item => `
              <div>
                <div class="figure" style="font-size:17px;">${item.fig}</div>
                <div style="font-size:10px;color:var(--text-3);letter-spacing:0.08em;margin-top:4px;">${item.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: HALO visual -->
        <div class="fade-in hide-mobile" style="transition-delay:200ms;position:relative;height:480px;">
          <!-- Central glowing orb -->
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(212,165,116,0.08) 0%,transparent 70%);animation:pulse 4s ease-in-out infinite;"></div>
          <!-- HALO letters floating -->
          ${['H','A','L','O'].map((letter, i) => {
            const positions = [
              { top: '8%', left: '50%', transform: 'translateX(-50%)' },
              { top: '50%', right: '5%', transform: 'translateY(-50%)' },
              { bottom: '8%', left: '50%', transform: 'translateX(-50%)' },
              { top: '50%', left: '5%', transform: 'translateY(-50%)' },
            ];
            const pos = positions[i];
            const posStr = Object.entries(pos).map(([k,v]) => `${k}:${v}`).join(';');
            return `
              <div style="position:absolute;${posStr};animation:float ${3 + i * 0.5}s ease-in-out infinite;animation-delay:${i * 0.4}s;">
                <div style="width:80px;height:80px;border:1px solid var(--gold-border);display:flex;align-items:center;justify-content:center;background:var(--gold-dim);backdrop-filter:blur(8px);">
                  <span style="font-family:var(--serif);font-size:36px;font-weight:700;color:var(--gold);">${letter}</span>
                </div>
              </div>
            `;
          }).join('')}
          <!-- Connecting lines (SVG) -->
          <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;" viewBox="0 0 400 480">
            <line x1="200" y1="40" x2="360" y2="240" stroke="rgba(212,165,116,0.08)" stroke-width="1" stroke-dasharray="4 6"/>
            <line x1="360" y1="240" x2="200" y2="440" stroke="rgba(212,165,116,0.08)" stroke-width="1" stroke-dasharray="4 6"/>
            <line x1="200" y1="440" x2="40" y2="240" stroke="rgba(212,165,116,0.08)" stroke-width="1" stroke-dasharray="4 6"/>
            <line x1="40" y1="240" x2="200" y2="40" stroke="rgba(212,165,116,0.08)" stroke-width="1" stroke-dasharray="4 6"/>
            <circle cx="200" cy="240" r="60" fill="none" stroke="rgba(212,165,116,0.06)" stroke-width="1"/>
            <circle cx="200" cy="240" r="110" fill="none" stroke="rgba(212,165,116,0.04)" stroke-width="1"/>
          </svg>
          <!-- Center label -->
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
            <div style="font-family:var(--serif);font-size:13px;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;opacity:0.7;">HALO</div>
            <div style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;margin-top:4px;">Asset Framework</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div style="position:absolute;bottom:2rem;left:50%;animation:bounce 2s ease-in-out infinite;z-index:2;">
      ${CHEVRON_DOWN}
    </div>
  </section>`;
}

// ── LOGOS ────────────────────────────────────────────────────────────────────
function renderLogos() {
  const logos = [
    { src: LOGO_KYKNET, alt: 'kykNET', h: '32px' },
    { src: LOGO_ONTBYT, alt: 'Ontbyt Sake', h: '34px' },
    { src: LOGO_PRETORIA_FM, alt: 'Pretoria FM', h: '36px' },
    { src: LOGO_EY, alt: 'Ernst & Young', h: '28px' },
  ];
  return `
  <div style="background:var(--bg-2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:36px 0;">
    <div class="container">
      <p style="font-size:10px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:var(--text-3);text-align:center;margin-bottom:28px;">As Seen On</p>
      <div style="display:flex;align-items:center;justify-content:center;gap:clamp(2rem,5vw,4rem);flex-wrap:wrap;">
        ${logos.map(l => `
          <div class="logo-accent" style="opacity:0.45;transition:opacity 250ms;position:relative;padding-bottom:8px;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='0.45'">
            <img src="${l.src}" alt="${l.alt}" style="height:${l.h};width:auto;max-width:130px;object-fit:contain;" loading="lazy"/>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

// ── VIDEO INTERVIEWS ─────────────────────────────────────────────────────────
// Same two Ontbytsake appearances already live on cobusnel.com, same titles
// and descriptions already approved there, reused here for consistency.
const VIDEOS = [
  {
    id: 'ROxZpJNAazM',
    title: 'Capital structures and agricultural investment in South Africa',
    desc: 'Cobus Nel explains how Eridanus acquires physical agricultural assets at below-market value and why the Venture Capital structure creates a compelling net-return case for serious investors.',
  },
  {
    id: 'pKEN61_0fMc',
    title: 'Investment architecture for the South African investor',
    desc: 'A second conversation on Ontbyt Sake covering the mechanics of tax-efficient investment structures, the Eridanus investment vehicle, and what separates a secured return from a speculative one.',
  },
];

function renderVideoInterviews() {
  return `
  <section class="section" style="background:var(--bg);border-top:1px solid var(--border);">
    <div class="container">
      <div class="fade-in" style="text-align:center;margin-bottom:3rem;">
        <span class="eyebrow">National TV, In Full</span>
        <h2 class="headline" style="margin-bottom:1rem;">Watch the actual conversations.</h2>
        <p style="max-width:520px;margin:0 auto;font-size:16px;">Not a clip. Not a highlight reel. The full Ontbytsake interviews, real operator, real questions, on the record.</p>
      </div>
      <div class="fade-in grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
        ${VIDEOS.map((v, i) => `
          <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;">
            <div class="video-slot" data-video-id="${v.id}" data-video-title="${v.title.replace(/"/g, '&quot;')}"
              style="position:relative;width:100%;aspect-ratio:16/9;cursor:pointer;overflow:hidden;background:#080c0a;">
              <img class="video-thumb" src="https://img.youtube.com/vi/${v.id}/maxresdefault.jpg" alt="${v.title}" loading="lazy"
                style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 400ms ease;"
                onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'"
                onerror="this.src='https://img.youtube.com/vi/${v.id}/hqdefault.jpg'"/>
              <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 60%, transparent 100%);pointer-events:none;"></div>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
                <div style="width:56px;height:56px;border-radius:50%;background:rgba(212,165,116,0.92);display:flex;align-items:center;justify-content:center;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
            <div style="padding:1.5rem;display:flex;flex-direction:column;gap:0.75rem;flex:1;">
              <h3 style="font-family:var(--serif);font-weight:600;font-size:18px;color:var(--text);line-height:1.3;margin:0;">${v.title}</h3>
              <p style="font-size:13px;color:var(--text-2);line-height:1.65;flex:1;margin:0;">${v.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function initVideoInterviews() {
  document.querySelectorAll('.video-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const id = slot.dataset.videoId;
      const title = slot.dataset.videoTitle;
      slot.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="${title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
        style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>`;
    }, { once: true });
  });
}
function renderDiagnostic() {
  return `
  <section id="diagnostic" class="section" style="background:var(--bg);">
    <div class="container" style="max-width:860px;">
      <div class="fade-in" style="text-align:center;margin-bottom:3.5rem;">
        <span class="eyebrow">The Diagnostic</span>
        <h2 class="headline" style="margin-bottom:1rem;">One slider. Your capital gap.</h2>
        <p style="max-width:480px;margin:0 auto;font-size:16px;">
          Move the slider to your capital position. Select how it is currently held. See your capital efficiency score instantly.
        </p>
      </div>

      <div class="fade-in" style="background:var(--bg-2);border:1px solid var(--border);padding:clamp(1.5rem,4vw,3rem);">
        <!-- Capital slider -->
        <div style="margin-bottom:2.5rem;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.25rem;">
            <label style="font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-3);">Capital available to work</label>
            <span id="capital-display" class="figure" style="font-size:clamp(28px,4vw,44px);line-height:1;transition:all 200ms var(--ease);">R2.5M</span>
          </div>
          <input type="range" id="capital-slider" min="0" max="4" value="1" style="margin-bottom:0.75rem;"/>
          <div style="display:flex;justify-content:space-between;">
            ${CAPITAL_STEPS.map((s, i) => `<span id="step-label-${i}" style="font-size:10px;color:var(--text-3);letter-spacing:0.06em;transition:color 200ms;">${s.label}</span>`).join('')}
          </div>
          <div id="below-floor-msg" style="display:none;font-size:12px;color:var(--red);margin-top:0.75rem;">
            Projections start at a R1 million capital position.
          </div>
        </div>

        <!-- Structure dropdown -->
        <div style="margin-bottom:2.5rem;">
          <label style="font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-3);display:block;margin-bottom:0.875rem;">How is it currently held?</label>
          <div class="select-wrap">
            <select id="structure-select">
              ${STRUCTURES.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
            </select>
            <span class="select-arrow">${CHEVRON_DOWN}</span>
          </div>
        </div>

        <!-- CTA Button -->
        <button id="calc-btn" class="btn-primary" style="width:100%;justify-content:center;font-size:18px;padding:18px;">
          Show Me My Capital Gap ${ARROW_SVG}
        </button>

        <!-- Result (hidden until calculated) -->
        <div id="result-section" style="display:none;margin-top:2rem;border-top:1px solid var(--border);padding-top:2rem;">
          <p style="font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);text-align:center;margin-bottom:1.5rem;">Your Capital Diagnostic</p>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);margin-bottom:1.5rem;" class="grid-3">
            <!-- Net return -->
            <div style="background:var(--bg);padding:1.5rem;text-align:center;">
              <p style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem;">Est. Net Return p.a.</p>
              <div id="result-net" class="figure" style="font-size:clamp(20px,3vw,30px);line-height:1;animation:count-up 400ms var(--ease);">R0</div>
              <p style="font-size:11px;color:var(--text-3);margin-top:6px;">After dividends tax</p>
            </div>
            <!-- Leakage -->
            <div style="background:var(--bg);padding:1.5rem;text-align:center;">
              <p style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem;">Est. Annual Leakage</p>
              <div id="result-leakage" class="figure" style="font-size:clamp(20px,3vw,30px);line-height:1;color:var(--red);animation:count-up 400ms var(--ease);">R0</div>
              <p style="font-size:11px;color:var(--text-3);margin-top:6px;">Inflation + tax drag</p>
            </div>
            <!-- Score -->
            <div style="background:var(--bg);padding:1.5rem;text-align:center;">
              <p style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem;">Capital Efficiency</p>
              <div id="result-score" class="figure" style="font-size:clamp(20px,3vw,30px);line-height:1;animation:count-up 400ms var(--ease);">0<span style="font-size:14px;color:var(--text-3);">/10</span></div>
              <p id="result-score-label" style="font-size:11px;color:var(--text-3);margin-top:6px;">Calculating...</p>
            </div>
          </div>

          <!-- Progress bar -->
          <div style="margin-bottom:1.5rem;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="font-size:11px;color:var(--text-3);">Capital working at full potential</span>
              <span id="efficiency-pct" style="font-size:11px;color:var(--gold);">0%</span>
            </div>
            <div style="height:3px;background:var(--border);border-radius:2px;overflow:hidden;">
              <div id="efficiency-bar" style="height:100%;background:var(--gold);border-radius:2px;width:0%;transition:width 800ms var(--ease);"></div>
            </div>
          </div>

          <!-- Disclaimer -->
          <p style="font-size:11px;color:var(--text-3);line-height:1.65;text-align:center;margin-bottom:1.5rem;">
            Estimates based on publicly available South African interest rates and tax rates. This is not financial advice. Individual circumstances vary. Returns are not guaranteed. All investments carry risk.
          </p>

          <!-- Gated CTA -->
          <div style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:2rem;text-align:center;">
            <h3 style="font-family:var(--serif);font-size:22px;font-weight:700;color:var(--text);margin-bottom:0.75rem;line-height:1.3;">
              That number is a generic estimate. Yours is not.
            </h3>
            <p style="font-size:13px;margin-bottom:1.5rem;max-width:480px;margin-left:auto;margin-right:auto;">
              The slider works off public rates and averages. A custom projection works off your actual position: what you hold, where it sits, and what a HALO structure would do with it. Takes 60 seconds to request. Capital floor: R1 million.
            </p>
            <a href="${APPLY_URL}" class="btn-primary" style="font-size:15px;padding:16px 36px;">
              Get My Free Projection ${ARROW_SVG}
            </a>
            ${REASSURE('center')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ── HALO FRAMEWORK ───────────────────────────────────────────────────────────
function renderHALO() {
  return `
  <section class="section" style="background:var(--bg-2);border-top:1px solid var(--border);">
    <div class="container">
      <div class="fade-in" style="text-align:center;margin-bottom:4rem;">
        <span class="eyebrow">The Framework</span>
        <h2 class="headline" style="margin-bottom:1rem;">The HALO Asset Framework.</h2>
        <p style="max-width:560px;margin:0 auto;font-size:16px;">
          Four principles that define what Eridanus acquires, and why physical South African agricultural assets are the foundation of the structure.
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);" class="grid-4">
        ${HALO_PILLARS.map((p, i) => `
          <div class="fade-in halo-tile" style="transition-delay:${i * 80}ms;background:var(--bg);padding:2.5rem 2rem;position:relative;overflow:hidden;cursor:default;transition:background 300ms;" onmouseover="this.style.background='var(--bg-3)'" onmouseout="this.style.background='var(--bg)'">
            <div class="halo-letter" style="font-family:var(--serif);font-size:72px;font-weight:700;color:var(--gold);opacity:0.07;position:absolute;top:1rem;right:1.25rem;line-height:1;pointer-events:none;">${p.letter}</div>
            ${generateHaloPattern(p.formation, p.color, p.seed)}
            <div style="width:40px;height:40px;border:1px solid var(--gold-border);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;transition:background 300ms;position:relative;z-index:2;">
              <span style="font-family:var(--serif);font-size:22px;font-weight:700;color:var(--gold);">${p.letter}</span>
            </div>
            <h3 style="font-family:var(--serif);font-size:20px;font-weight:700;margin-bottom:0.875rem;color:var(--text);position:relative;z-index:2;">${p.title}</h3>
            <p style="font-size:13px;line-height:1.75;position:relative;z-index:2;">${p.body}</p>
          </div>
        `).join('')}
      </div>

      <div class="fade-in" style="text-align:center;margin-top:3rem;">
        <a href="${APPLY_URL}" class="btn-primary">
          Get My Free Projection ${ARROW_SVG}
        </a>
      </div>
    </div>
  </section>`;
}

// ── CASE STUDIES ─────────────────────────────────────────────────────────────
function renderCaseStudies() {
  return `
  <section class="section" style="background:var(--bg);border-top:1px solid var(--border);">
    <div class="container">
      <div class="fade-in" style="text-align:center;margin-bottom:4rem;">
        <span class="eyebrow">Investors Who Have Seen the Number</span>
        <h2 class="headline" style="margin-bottom:1rem;">Who Eridanus is built for.</h2>
        <p style="max-width:520px;margin:0 auto;font-size:16px;">
          Representative profiles based on the investors Cobus works with. Names and identifying details are withheld by design.
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);" class="grid-3">
        ${CASE_STUDIES.map((cs, i) => `
          <div class="fade-in" style="transition-delay:${i * 100}ms;background:var(--bg-2);padding:2.5rem;display:flex;flex-direction:column;gap:1.25rem;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                <span style="font-size:9px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);background:var(--gold-dim);border:1px solid var(--gold-border);padding:3px 8px;">${cs.tag}</span>
              </div>
              <h3 style="font-family:var(--serif);font-size:20px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:4px;">${cs.profile}</h3>
              <div class="figure" style="font-size:15px;">${cs.capital}</div>
            </div>
            <div style="flex:1;">
              <p style="font-size:10px;color:var(--text-3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;">The Challenge</p>
              <p style="font-size:13px;line-height:1.75;">${cs.challenge}</p>
            </div>
            <div style="padding-top:1.25rem;border-top:1px solid var(--border);">
              <div style="display:flex;align-items:flex-start;gap:0.75rem;">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style="flex-shrink:0;margin-top:2px;"><circle cx="7.5" cy="7.5" r="7" stroke="var(--gold)" stroke-width="1"/><path d="M4.5 7.5L6.5 9.5L10.5 5.5" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <p style="font-size:13px;color:var(--text);line-height:1.65;">${cs.outcome}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="fade-in" style="text-align:center;margin-top:3rem;">
        <a href="${APPLY_URL}" class="btn-primary">
          Get My Free Projection ${ARROW_SVG}
        </a>
      </div>
    </div>
  </section>`;
}

// ── COMPARISON ────────────────────────────────────────────────────────────────
function renderComparison() {
  return `
  <section class="section" style="background:var(--bg-2);border-top:1px solid var(--border);">
    <div class="container">
      <div class="fade-in" style="text-align:center;margin-bottom:4rem;">
        <span class="eyebrow">The Difference</span>
        <h2 class="headline" style="margin-bottom:1rem;">Most portfolios are full of things that expire.</h2>
      </div>
      <div class="fade-in grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:12px;overflow:hidden;max-width:900px;margin:0 auto;">
        <div style="background:var(--bg);padding:2.75rem 2.25rem;">
          <p style="font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-3);margin-bottom:0.75rem;">The Old Way</p>
          <h3 style="font-family:var(--serif);font-size:22px;font-weight:600;color:var(--text);margin-bottom:1.5rem;">Paper &amp; trend assets</h3>
          ${['Value tied to sentiment and market cycles','Obsolescence built into the asset itself','Nothing physical backing the number on screen','Performs whether you understand it or not'].map(t => `
          <div class="compare-item" style="display:flex;gap:12px;padding:10px 0;font-size:14px;color:var(--text-2);line-height:1.5;">
            <span style="flex-shrink:0;color:var(--text-3);">✕</span>${t}
          </div>`).join('')}
        </div>
        <div style="background:linear-gradient(160deg, rgba(201,162,39,0.08), var(--bg) 60%);padding:2.75rem 2.25rem;">
          <p style="font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:0.75rem;">The HALO Standard</p>
          <h3 style="font-family:var(--serif);font-size:22px;font-weight:600;color:var(--text);margin-bottom:1.5rem;">Halo assets</h3>
          ${['Produces whether markets are up or down','Service life measured in decades','Value anchored in something real, tangible, essential','Structured plainly enough to actually understand'].map(t => `
          <div class="compare-item" style="display:flex;gap:12px;padding:10px 0;font-size:14px;color:var(--text);line-height:1.5;">
            <span style="flex-shrink:0;color:var(--gold);">✓</span>${t}
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

// ── WHY HALO ──────────────────────────────────────────────────────────────────
function renderWhyHalo() {
  const points = [
    { n: '01', t: 'Real, not paper', d: 'Every rand is structured against a physical, productive asset. Not a ticker, not a promise.' },
    { n: '02', t: 'Built to last', d: 'Halo assets carry a service life measured in decades. What you hold in year one still works in year twenty.' },
    { n: '03', t: 'Plainly understood', d: "If you can't explain it back in a sentence, it's not a halo asset. Structure over spin, always." },
  ];
  return `
  <section class="section" style="background:var(--bg);border-top:1px solid var(--border);">
    <div class="container">
      <div class="fade-in" style="text-align:center;margin-bottom:4rem;">
        <span class="eyebrow">Why "HALO"</span>
        <h2 class="headline" style="margin-bottom:1rem;">One idea, held plainly.</h2>
        <p style="font-size:15px;color:var(--text-2);max-width:480px;margin:0 auto;">No fractions to memorise. Just the mechanism, stated honestly.</p>
      </div>
      <div class="fade-in grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
        ${points.map(p => `
        <div style="background:var(--bg);padding:2.25rem 2rem;">
          <div style="font-family:var(--mono);font-size:12px;color:var(--gold);margin-bottom:1rem;">${p.n}</div>
          <h4 style="font-family:var(--serif);font-size:19px;font-weight:600;color:var(--text);margin-bottom:0.75rem;">${p.t}</h4>
          <p style="font-size:13.5px;color:var(--text-2);line-height:1.6;">${p.d}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>`;
}

// ── OPERATOR ─────────────────────────────────────────────────────────────────
function renderOperator() {
  return `
  <section class="section" style="background:var(--bg-2);border-top:1px solid var(--border);">
    <div class="container" style="max-width:900px;">
      <div class="fade-in">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;" class="grid-2">
          <div>
            <span class="eyebrow">The Operator</span>
            <h2 class="headline" style="margin-bottom:1.5rem;">Cobus Nel.<br>CA(SA). Operator. CIO.</h2>
            <p style="margin-bottom:1.25rem;font-size:15px;">
              Cobus Nel trained at Ernst and Young in Pretoria and Bermuda, passed all CA(SA) board exams first time, and traded commodities at Export Trading Group. He has hands-on farming experience and has navigated business rescues and liquidations.
            </p>
            <p style="margin-bottom:2rem;font-size:15px;">
              He co-founded Eridanus with Martin van Vuuren in 2018. The firm is an FSCA-authorised Financial Services Provider (FSP 48947) acquiring real South African agricultural assets at below-market value.
            </p>
          </div>
          <div style="display:flex;flex-direction:column;gap:1px;background:var(--border);">
            ${[
              { badge: 'CA(SA)', title: 'Chartered Accountant', detail: 'EY Pretoria and EY Bermuda. All board exams passed first time.' },
              { badge: 'FSP 48947', title: 'FSCA Authorised', detail: 'Licensed and regulated by the Financial Sector Conduct Authority of South Africa.' },
              { badge: 'VCC Active', title: 'Venture Capital Company', detail: 'SARS-approved VCC status. Active and registered with SARS.' },
              { badge: '2018', title: 'Eridanus Founded', detail: 'Acquiring South African agricultural assets at below-market value since 2018.' },
            ].map(item => `
              <div style="background:var(--bg);padding:1.25rem 1.5rem;display:flex;gap:1rem;align-items:flex-start;">
                <span class="figure" style="font-size:12px;min-width:64px;padding-top:2px;">${item.badge}</span>
                <div>
                  <p style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:3px;">${item.title}</p>
                  <p style="font-size:12px;line-height:1.6;">${item.detail}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ── MEET THE ARCHITECT ───────────────────────────────────────────────────────
// Narrative, humanizing section. Built from facts already established and
// used elsewhere on this page, told as a story rather than a bullet list.
// The two photo slots are now filled: a studio portrait and the field shot.
// They are deliberately presented as a diptych — the boardroom and the
// ground — because that duality IS the O in HALO (Operator-Grounded).
const ARCHITECT_PANELS = [
  {
    n: '01',
    tone: 'tone-studio',
    src: COBUS_PORTRAIT,
    alt: 'Cobus Nel, CA(SA), Chief Investment Officer of Eridanus',
    label: 'Where it gets structured',
    line: 'CA(SA). Trained at Ernst and Young in Pretoria and Bermuda. Every board exam passed first time. This is the room where the capital gets structured.',
  },
  {
    n: '02',
    tone: 'tone-field',
    src: COBUS_FIELD,
    alt: 'Cobus Nel standing on a vehicle in an Eridanus shirt, maize field behind him',
    label: 'Where it gets tested',
    line: 'Same man, same week. On the land, in the crop, next to the people working it. This is the room where the structure either holds or it does not.',
  },
];

function renderMeetTheArchitect() {
  return `
  <section class="section" style="background:var(--bg);border-top:1px solid var(--border);">
    <div class="container" style="max-width:1000px;">
      <div class="fade-in" style="text-align:center;margin-bottom:3.5rem;">
        <span class="eyebrow">Meet the Architect</span>
        <h2 class="headline" style="margin-bottom:1rem;">Who is Cobus Nel?</h2>
        <p style="max-width:560px;margin:0 auto;font-size:16px;">Not a fund manager who found farming interesting. An operator who priced real assets long before he structured capital around them.</p>
      </div>

      <div class="fade-in diptych">
        ${ARCHITECT_PANELS.map(p => `
          <figure class="diptych-panel ${p.tone}" style="margin:0;">
            <img src="${p.src}" alt="${p.alt}" width="900" height="1125" loading="lazy" decoding="async"/>
            <div class="diptych-scrim"></div>
            <span class="diptych-index">${p.n}</span>
            <figcaption class="diptych-caption">
              <span class="diptych-label">${p.label}</span>
              <p class="diptych-line">${p.line}</p>
            </figcaption>
          </figure>
        `).join('')}
      </div>

      <p class="fade-in diptych-pull" style="margin-bottom:3.25rem;">
        The suit is where the structure gets built.<br><em>The boots are where it gets tested.</em>
      </p>

      <div class="fade-in" style="max-width:680px;margin:0 auto;">
        <p style="font-size:16px;line-height:1.85;margin-bottom:1.25rem;">
          Cobus Nel trained as a chartered accountant at Ernst and Young, first in Pretoria, then in Bermuda, passing every CA(SA) board exam on the first attempt. That training put him inside the machinery of international financial structures at a level most South African investors never see directly.
        </p>
        <p style="font-size:16px;line-height:1.85;margin-bottom:1.25rem;">
          Then he stepped outside it. Commodity trading at Export Trading Group taught him how real assets get priced, mispriced, and corrected in real time. Hands-on farming, and navigating business rescues and liquidations, taught him what something is actually worth once the spreadsheet stops mattering and the asset has to stand on its own.
        </p>
        <p style="font-size:16px;line-height:1.85;">
          In 2018, he co-founded Eridanus with Martin van Vuuren, built specifically to put that judgment to work: acquiring real South African agricultural assets at below-market value, structured for investors who want their capital anchored in something they could, if they wanted to, actually go and stand on.
        </p>
      </div>
    </div>
  </section>`;
}
function renderFinalCTA() {
  return `
  <section class="section" style="background:var(--bg);border-top:1px solid var(--border);position:relative;overflow:hidden;">
    <!-- Background grid -->
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(212,165,116,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,165,116,0.03) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;"></div>
    <div class="container" style="position:relative;z-index:2;text-align:center;max-width:660px;">
      <div class="fade-in">
        <div class="gold-line" style="margin:0 auto 1.5rem;"></div>
        <h2 class="headline" style="margin-bottom:1.5rem;">See your number, not the average.</h2>
        <p style="font-size:16px;margin-bottom:2.5rem;max-width:480px;margin-left:auto;margin-right:auto;">
          The diagnostic shows you the gap in general terms. A custom projection shows you yours, built on the position you actually hold. Capital floor: R1 million.
        </p>
        <div style="display:flex;align-items:center;justify-content:center;gap:2rem;margin-bottom:2.5rem;flex-wrap:wrap;">
          ${[
            { src: LOGO_KYKNET, alt: 'kykNET', h: '22px' },
            { src: LOGO_ONTBYT, alt: 'Ontbyt Sake', h: '24px' },
            { src: LOGO_PRETORIA_FM, alt: 'Pretoria FM', h: '26px' },
            { src: LOGO_EY, alt: 'EY', h: '20px' },
          ].map(l => `<img src="${l.src}" alt="${l.alt}" style="height:${l.h};width:auto;object-fit:contain;opacity:0.3;" loading="lazy"/>`).join('')}
        </div>
        <a href="${APPLY_URL}" class="btn-primary" style="font-size:15px;padding:18px 44px;">
          Get My Free Projection ${ARROW_SVG}
        </a>
        <p style="font-size:11px;color:var(--text-3);margin-top:2rem;line-height:1.65;">
          Eridanus is an authorised Financial Services Provider (FSP 48947). Returns are not guaranteed. All investments carry risk. This is not financial advice.
        </p>
      </div>
    </div>
  </section>`;
}

// ── LEAD FORM ─────────────────────────────────────────────────────────────────
// PASTE THE SAME GOOGLE APPS SCRIPT WEB APP URL USED ON cobusnel.com/apply
// (see APPS_SCRIPT_for_Google_Sheet.gs from the earlier fix). Same sheet,
// two entry points, distinguished by the "source" field on each row.
const SHEET_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwzQqlrKSr-ULvmZCuS2_AEvabK_PhchIBjGXphR7ARPO_P4vca289Q-iKpRAGc66oJKg/exec';

// Capture ad attribution from the URL so each lead row shows which ad produced it.
const LEAD_ATTRIBUTION = (function () {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_content: p.get('utm_content') || '',
      utm_term: p.get('utm_term') || '',
      fbclid: p.get('fbclid') || '',
      landing_url: window.location.href,
    };
  } catch (e) { return {}; }
})();

function renderLeadForm() {
  return `
  <section id="lead-form-section" class="section" style="background:var(--bg-2);border-top:1px solid var(--border);">
    <div class="container" style="max-width:560px;">
      <div class="fade-in" style="text-align:center;margin-bottom:2.5rem;">
        <span class="eyebrow">Your Numbers, Not The Average</span>
        <h2 class="headline" style="margin-bottom:1rem;">Get your free projection.</h2>
        <p style="font-size:15px;">Cobus builds it against your actual position and comes back with a plain, personalised picture of what a HALO structure would mean for your capital. No obligation, no pressure.</p>
      </div>

      <div class="fade-in" style="background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:2.25rem;">
        <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-3);margin-bottom:1.5rem;">5 questions · Under 60 seconds · No cost</p>

        <form id="lead-form" novalidate>
          <div style="display:grid;gap:1rem;margin-bottom:1rem;">
            <div>
              <input type="text" id="lf-name" placeholder="Full name *" required
                style="width:100%;background:var(--bg-2);border:1px solid var(--border);color:var(--text);padding:12px 14px;font-size:14px;border-radius:6px;"/>
              <p id="lf-err-name" style="font-size:11px;color:var(--red);margin-top:4px;display:none;">Required</p>
            </div>
            <div>
              <input type="email" id="lf-email" placeholder="Email *" required
                style="width:100%;background:var(--bg-2);border:1px solid var(--border);color:var(--text);padding:12px 14px;font-size:14px;border-radius:6px;"/>
              <p id="lf-err-email" style="font-size:11px;color:var(--red);margin-top:4px;display:none;">Valid email required</p>
            </div>
            <div>
              <input type="tel" id="lf-phone" placeholder="Mobile *" required
                style="width:100%;background:var(--bg-2);border:1px solid var(--border);color:var(--text);padding:12px 14px;font-size:14px;border-radius:6px;"/>
              <p id="lf-err-phone" style="font-size:11px;color:var(--red);margin-top:4px;display:none;">Required</p>
            </div>
            <div>
              <select id="lf-capital" required
                style="width:100%;background:var(--bg-2);border:1px solid var(--border);color:var(--text);padding:12px 14px;font-size:14px;border-radius:6px;">
                <option value="">Investable capital *</option>
                <option value="below-1m">Below R1 million</option>
                <option value="1m-2.5m">R1 million - R2.5 million</option>
                <option value="2.5m-5m">R2.5 million - R5 million</option>
                <option value="5m-plus">R5 million+</option>
              </select>
              <p id="lf-err-capital" style="font-size:11px;color:var(--red);margin-top:4px;display:none;">Required</p>
            </div>
            <div>
              <select id="lf-province" required
                style="width:100%;background:var(--bg-2);border:1px solid var(--border);color:var(--text);padding:12px 14px;font-size:14px;border-radius:6px;">
                <option value="">Province *</option>
                ${['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Free State','Mpumalanga','Limpopo','North West','Northern Cape','Outside South Africa'].map(p => `<option value="${p}">${p}</option>`).join('')}
              </select>
              <p id="lf-err-province" style="font-size:11px;color:var(--red);margin-top:4px;display:none;">Required</p>
            </div>
          </div>

          <label style="display:flex;gap:10px;align-items:flex-start;font-size:12px;color:var(--text-2);line-height:1.5;margin-bottom:1.5rem;cursor:pointer;">
            <input type="checkbox" id="lf-consent" required style="margin-top:2px;"/>
            I agree that Cobus Nel may contact me about my projection and store my details for that purpose, in line with POPIA.
          </label>

          <button type="submit" id="lf-submit" class="btn-primary" style="width:100%;justify-content:center;">
            Get My Free Projection ${ARROW_SVG}
          </button>
          <p style="font-size:11px;color:var(--text-3);text-align:center;margin-top:1rem;">No spam. Your information stays with Cobus Nel.</p>
        </form>

        <div id="lf-success" style="display:none;text-align:center;padding:1rem 0;">
          <p style="font-family:var(--serif);font-size:20px;color:var(--gold);margin-bottom:0.5rem;">Request received. Your projection is being built.</p>
          <p style="font-size:14px;color:var(--text-2);">Cobus has your details and will come back with your custom projection shortly.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;
  const submitBtn = document.getElementById('lf-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = {
      name: document.getElementById('lf-name').value.trim(),
      email: document.getElementById('lf-email').value.trim(),
      phone: document.getElementById('lf-phone').value.trim(),
      capital: document.getElementById('lf-capital').value,
      province: document.getElementById('lf-province').value,
      consent: document.getElementById('lf-consent').checked,
    };

    let valid = true;
    const showErr = (id, show) => { document.getElementById(id).style.display = show ? 'block' : 'none'; };
    showErr('lf-err-name', !fields.name); if (!fields.name) valid = false;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);
    showErr('lf-err-email', !emailOk); if (!emailOk) valid = false;
    showErr('lf-err-phone', !fields.phone); if (!fields.phone) valid = false;
    showErr('lf-err-capital', !fields.capital); if (!fields.capital) valid = false;
    showErr('lf-err-province', !fields.province); if (!fields.province) valid = false;
    if (!fields.consent) valid = false;

    if (!valid) return;

    // ── HARD GATE ────────────────────────────────────────────────────────
    // Previously the page showed "You're in" whether or not the lead was
    // ever posted anywhere. With the endpoint unset, every single lead was
    // silently binned while the investor was told they had been captured.
    // Never show success for a lead that had nowhere to go.
    if (!SHEET_ENDPOINT_URL || SHEET_ENDPOINT_URL === 'PASTE_APPS_SCRIPT_URL_HERE') {
      console.error(
        '[LEAD FORM NOT WIRED] SHEET_ENDPOINT_URL is still the placeholder. ' +
        'Paste the Google Apps Script web app URL used on cobusnel.com/apply. ' +
        'Lead discarded:', fields
      );
      showFormError('Something went wrong on our side. Please email cobus directly, or try again shortly.');
      return;
    }

    const restore = () => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Get My Free Projection ${ARROW_SVG}`;
    };

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // no-cors means the response is opaque: a non-2xx from Apps Script is
      // indistinguishable from success here. Verify delivery in the sheet,
      // not in this promise.
      await fetch(SHEET_ENDPOINT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          firstName: fields.name,
          lastName: '',
          email: fields.email,
          phone: fields.phone,
          capitalRange: fields.capital,
          province: fields.province,
          source: 'eridanus-diagnostic (calculator form)',
          submittedAt: new Date().toISOString(),
          ...LEAD_ATTRIBUTION,
        }),
      });
    } catch (err) {
      console.error('Submission error:', err);
      restore();
      showFormError('That did not send. Check your connection and try once more.');
      return;
    }

    if (typeof fbq === 'function') {
      fbq('track', 'Lead', { content_name: 'Calculator Projection Request' });
    }

    form.style.display = 'none';
    document.getElementById('lf-success').style.display = 'block';
  });

  function showFormError(msg) {
    let el = document.getElementById('lf-form-error');
    if (!el) {
      el = document.createElement('p');
      el.id = 'lf-form-error';
      el.style.cssText = 'font-size:12px;color:var(--red);text-align:center;margin-top:1rem;line-height:1.6;';
      form.appendChild(el);
    }
    el.textContent = msg;
  }
}

// ── STICKY MOBILE CTA ─────────────────────────────────────────────────────────
// Phone-only. On a page this long every CTA is off-screen for most of the
// scroll, and paid social traffic is overwhelmingly mobile. Appears once the
// hero is behind you, hides again over the form so it never covers the fields.
function renderStickyCTA() {
  return `
  <div id="sticky-cta">
    <div>
      <p id="sticky-cta-label">Free projection</p>
      <p id="sticky-cta-sub">Under 60 seconds</p>
    </div>
    <a href="${APPLY_URL}" class="btn-primary" style="font-size:13px;padding:12px 20px;white-space:nowrap;">Get Mine ${ARROW_SVG}</a>
  </div>`;
}

function initStickyCTA() {
  const bar = document.getElementById('sticky-cta');
  const form = document.getElementById('lead-form-section');
  if (!bar || !form) return;
  const show = () => {
    const pastHero = window.scrollY > window.innerHeight * 0.9;
    const atForm = form.getBoundingClientRect().top < window.innerHeight * 0.9;
    bar.classList.toggle('visible', pastHero && !atForm);
  };
  window.addEventListener('scroll', show, { passive: true });
  show();
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function renderFooter() {
  return `
  <footer style="background:var(--bg-2);border-top:1px solid var(--border);padding:48px 0 32px;">
    <div class="container">
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:3rem;margin-bottom:3rem;" class="grid-2">
        <div>
          <div style="font-family:var(--serif);font-size:22px;font-weight:700;color:var(--text);margin-bottom:1rem;">Cobus Nel</div>
          <p style="font-size:13px;max-width:260px;margin-bottom:1rem;">South Africa's Capital Architect. CA(SA). Chief Investment Officer at Eridanus, an FSCA-authorised Financial Services Provider (FSP 48947).</p>
          <p style="font-size:11px;color:var(--text-3);">FSP 48947 | Operating since 2018</p>
        </div>
        <div>
          <p style="font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-3);margin-bottom:1.25rem;">Legal</p>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${[
              { href: 'https://cobusnel.com/privacy-policy', label: 'Privacy Policy' },
              { href: 'https://cobusnel.com/terms', label: 'Terms of Service' },
            ].map(l => `<a href="${l.href}" target="_blank" rel="noopener" style="font-size:13px;color:var(--text-2);text-decoration:none;transition:color 200ms;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-2)'">${l.label}</a>`).join('')}
          </div>
          <p style="font-size:10px;color:var(--text-3);margin-top:1rem;line-height:1.6;">Opens in a new tab.</p>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:1.5rem;">
        <p style="font-size:11px;color:var(--text-3);line-height:1.7;margin-bottom:0.75rem;">
          This website is for informational purposes only and does not constitute financial advice. Eridanus is an authorised Financial Services Provider, FSP No. 48947, registered with the Financial Sector Conduct Authority (FSCA) of South Africa. Returns are not guaranteed. Past performance is not indicative of future performance. All investments carry risk of loss. Consult a qualified financial and tax practitioner before investing.
        </p>
        <p style="font-size:11px;color:var(--text-3);">&copy; ${new Date().getFullYear()} Cobus Nel. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
}

// ── Diagnostic Logic ─────────────────────────────────────────────────────────
function initDiagnostic() {
  const slider = document.getElementById('capital-slider');
  const display = document.getElementById('capital-display');
  const select = document.getElementById('structure-select');
  const btn = document.getElementById('calc-btn');
  const resultSection = document.getElementById('result-section');
  const belowMsg = document.getElementById('below-floor-msg');

  function updateDisplay() {
    const idx = parseInt(slider.value);
    display.textContent = CAPITAL_STEPS[idx].label;
    // Update step labels
    CAPITAL_STEPS.forEach((_, i) => {
      const el = document.getElementById(`step-label-${i}`);
      if (el) el.style.color = i === idx ? 'var(--gold)' : 'var(--text-3)';
    });
    belowMsg.style.display = idx === 0 ? 'block' : 'none';
  }

  slider.addEventListener('input', () => {
    updateDisplay();
    if (resultSection.style.display !== 'none') calculate();
  });
  select.addEventListener('change', () => {
    if (resultSection.style.display !== 'none') calculate();
  });
  btn.addEventListener('click', () => {
    resultSection.style.display = 'block';
    calculate();
    setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  });

  updateDisplay();
}

function calculate() {
  const idx = parseInt(document.getElementById('capital-slider').value);
  const structureVal = document.getElementById('structure-select').value;
  const capital = CAPITAL_STEPS[idx].value;
  const structure = STRUCTURES.find(s => s.value === structureVal);

  const grossReturn = capital * structure.rate;
  const inflationLoss = capital * 0.055;
  const bankSpread = structureVal === 'bank' ? capital * 0.065 * 0.3 : 0;
  const taxDrag = grossReturn * 0.20;
  const netReturn = grossReturn - taxDrag;
  const totalLeakage = inflationLoss + bankSpread + taxDrag;
  const efficiency = Math.max(1, Math.min(10, Math.round(10 - (totalLeakage / capital) * 80)));
  const efficiencyPct = Math.round(efficiency * 10);

  // Animate values
  const netEl = document.getElementById('result-net');
  const leakageEl = document.getElementById('result-leakage');
  const scoreEl = document.getElementById('result-score');
  const scoreLabel = document.getElementById('result-score-label');
  const bar = document.getElementById('efficiency-bar');
  const pct = document.getElementById('efficiency-pct');

  countUp(netEl, netReturn, 900);
  countUp(leakageEl, totalLeakage, 900);

  // Score count up
  let scoreStart = Date.now();
  const scoreTick = () => {
    const elapsed = Date.now() - scoreStart;
    const progress = Math.min(elapsed / 800, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(efficiency * eased);
    scoreEl.innerHTML = `${val}<span style="font-size:14px;color:var(--text-3);">/10</span>`;
    if (progress < 1) requestAnimationFrame(scoreTick);
  };
  requestAnimationFrame(scoreTick);

  scoreEl.style.color = efficiency >= 7 ? 'var(--gold)' : efficiency >= 4 ? '#e67e22' : 'var(--red)';
  scoreLabel.textContent = efficiency >= 7 ? 'Working well' : efficiency >= 4 ? 'Room to improve' : 'Significant gap';

  setTimeout(() => {
    bar.style.width = `${efficiencyPct}%`;
    pct.textContent = `${efficiencyPct}%`;
  }, 200);
}

// ── Floating Particles ────────────────────────────────────────────────────────
function initFloatingParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 3 + 1;
    dot.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:var(--gold);
      opacity:${Math.random() * 0.15 + 0.05};
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      animation:float ${4 + Math.random() * 4}s ease-in-out infinite;
      animation-delay:${Math.random() * 4}s;
    `;
    container.appendChild(dot);
  }
}

// ── Sticky Nav ────────────────────────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(10,10,10,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.borderBottom = 'none';
    }
  }, { passive: true });
}

// ── Init ──────────────────────────────────────────────────────────────────────
render();
initNav();
