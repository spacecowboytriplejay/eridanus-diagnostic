import './style.css';

// ── Asset URLs ──────────────────────────────────────────────────────────────
const COBUS_PORTRAIT = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663766167215/rhUIfCWTeaOjkWeM.jpg';
const LOGO_KYKNET = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663766167215/WWKlZfcTfPTrnvWl.png';
const LOGO_ONTBYT = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663766167215/UyOVDuntQbidIfCZ.png';
const LOGO_PRETORIA_FM = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663766167215/WUnIpufjtRKprHES.png';
const LOGO_EY = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663766167215/peICczlbTSWeWKgX.png';
const APPLY_URL = 'https://cobusnel.com/apply';

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

const HALO_PILLARS = [
  {
    letter: 'H',
    title: 'Hard to Fake',
    body: 'Physical land and agricultural infrastructure. You can stand on it. You can touch it. It exists in the real world, not on a spreadsheet.',
    color: '#8B7355',
  },
  {
    letter: 'A',
    title: 'Anchored to Real Value',
    body: 'Eridanus acquires assets at below-market value. Your capital is backed by assets worth more than the entry price from day one.',
    color: '#6B8E6B',
  },
  {
    letter: 'L',
    title: 'Low Obsolescence',
    body: 'Agricultural land does not become technologically stranded. It does not depreciate like a car or a server. It produces, season after season.',
    color: '#7A8B6B',
  },
  {
    letter: 'O',
    title: 'Operator-Grounded',
    body: 'Cobus Nel has farmed, traded commodities, and navigated business rescues. The person managing your capital has operated in the real world.',
    color: '#8B7A55',
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
const CHEVRON_DOWN = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNav()}
    ${renderHero()}
    ${renderLogos()}
    ${renderDiagnostic()}
    ${renderHALO()}
    ${renderCaseStudies()}
    ${renderOperator()}
    ${renderFinalCTA()}
    ${renderFooter()}
  `;

  observeFadeIns();
  initDiagnostic();
  initFloatingParticles();
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function renderNav() {
  return `
  <nav style="position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 0;transition:background 300ms,backdrop-filter 300ms;" id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;">
      <a href="https://cobusnel.com" target="_blank" rel="noopener" style="font-family:var(--serif);font-size:20px;font-weight:700;color:var(--text);text-decoration:none;letter-spacing:0.02em;">Cobus Nel</a>
      <div style="display:flex;align-items:center;gap:2rem;">
        <a href="https://cobusnel.com" target="_blank" rel="noopener" style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-2);text-decoration:none;transition:color 200ms;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-2)'">cobusnel.com</a>
        <a href="${APPLY_URL}" target="_blank" rel="noopener" class="btn-primary" style="font-size:12px;padding:10px 20px;">Apply Now ${ARROW_SVG}</a>
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
              Most South African investors with R1 million or more are unknowingly leaving capital on the table. The diagnostic below shows you exactly where. The Discovery Session shows you what to do about it.
            </p>
          </div>
          <div class="fade-in" style="transition-delay:240ms;display:flex;gap:1rem;flex-wrap:wrap;">
            <a href="#diagnostic" class="btn-primary">Run My Diagnostic ${ARROW_SVG}</a>
            <a href="https://cobusnel.com/for-investors" target="_blank" rel="noopener" class="btn-ghost">What is Eridanus?</a>
          </div>
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
          <div style="opacity:0.45;transition:opacity 250ms;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='0.45'">
            <img src="${l.src}" alt="${l.alt}" style="height:${l.h};width:auto;max-width:130px;object-fit:contain;filter:brightness(0) invert(1);" loading="lazy"/>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

// ── DIAGNOSTIC TOOL ──────────────────────────────────────────────────────────
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
            The Discovery Session capital floor is R1 million.
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
              To see what your capital could look like inside a HALO asset structure, apply for a Discovery Session.
            </h3>
            <p style="font-size:13px;margin-bottom:1.5rem;max-width:480px;margin-left:auto;margin-right:auto;">
              The diagnostic shows the gap. The Discovery Session shows you the structure. One session. Seven touchpoints. No obligation. Capital floor: R1 million.
            </p>
            <a href="${APPLY_URL}" target="_blank" rel="noopener" class="btn-primary" style="font-size:15px;padding:16px 36px;">
              Apply for a Discovery Session ${ARROW_SVG}
            </a>
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
          <div class="fade-in" style="transition-delay:${i * 80}ms;background:var(--bg);padding:2.5rem 2rem;position:relative;overflow:hidden;cursor:default;transition:background 300ms;" onmouseover="this.style.background='var(--bg-3)'" onmouseout="this.style.background='var(--bg)'">
            <div class="halo-letter" style="font-family:var(--serif);font-size:72px;font-weight:700;color:var(--gold);opacity:0.07;position:absolute;top:1rem;right:1.25rem;line-height:1;pointer-events:none;">${p.letter}</div>
            <div style="width:40px;height:40px;border:1px solid var(--gold-border);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;transition:background 300ms;">
              <span style="font-family:var(--serif);font-size:22px;font-weight:700;color:var(--gold);">${p.letter}</span>
            </div>
            <h3 style="font-family:var(--serif);font-size:20px;font-weight:700;margin-bottom:0.875rem;color:var(--text);">${p.title}</h3>
            <p style="font-size:13px;line-height:1.75;">${p.body}</p>
          </div>
        `).join('')}
      </div>

      <div class="fade-in" style="text-align:center;margin-top:3rem;">
        <a href="${APPLY_URL}" target="_blank" rel="noopener" class="btn-primary">
          Apply for a Discovery Session ${ARROW_SVG}
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
        <a href="${APPLY_URL}" target="_blank" rel="noopener" class="btn-primary">
          Apply for a Discovery Session ${ARROW_SVG}
        </a>
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
            <a href="https://cobusnel.com/about" target="_blank" rel="noopener" class="btn-ghost">
              Full biography ${ARROW_SVG}
            </a>
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

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function renderFinalCTA() {
  return `
  <section class="section" style="background:var(--bg);border-top:1px solid var(--border);position:relative;overflow:hidden;">
    <!-- Background grid -->
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(212,165,116,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,165,116,0.03) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;"></div>
    <div class="container" style="position:relative;z-index:2;text-align:center;max-width:660px;">
      <div class="fade-in">
        <div class="gold-line" style="margin:0 auto 1.5rem;"></div>
        <h2 class="headline" style="margin-bottom:1.5rem;">Your capital deserves a real conversation.</h2>
        <p style="font-size:16px;margin-bottom:2.5rem;max-width:480px;margin-left:auto;margin-right:auto;">
          The diagnostic shows the gap. The Discovery Session shows you the structure. Apply to qualify. Capital floor: R1 million.
        </p>
        <div style="display:flex;align-items:center;justify-content:center;gap:2rem;margin-bottom:2.5rem;flex-wrap:wrap;">
          ${[
            { src: LOGO_KYKNET, alt: 'kykNET', h: '22px' },
            { src: LOGO_ONTBYT, alt: 'Ontbyt Sake', h: '24px' },
            { src: LOGO_PRETORIA_FM, alt: 'Pretoria FM', h: '26px' },
            { src: LOGO_EY, alt: 'EY', h: '20px' },
          ].map(l => `<img src="${l.src}" alt="${l.alt}" style="height:${l.h};width:auto;object-fit:contain;opacity:0.3;filter:brightness(0) invert(1);" loading="lazy"/>`).join('')}
        </div>
        <a href="${APPLY_URL}" target="_blank" rel="noopener" class="btn-primary" style="font-size:15px;padding:18px 44px;">
          Apply for a Discovery Session ${ARROW_SVG}
        </a>
        <p style="font-size:11px;color:var(--text-3);margin-top:2rem;line-height:1.65;">
          Eridanus is an authorised Financial Services Provider (FSP 48947). Returns are not guaranteed. All investments carry risk. This is not financial advice.
        </p>
      </div>
    </div>
  </section>`;
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function renderFooter() {
  return `
  <footer style="background:var(--bg-2);border-top:1px solid var(--border);padding:48px 0 32px;">
    <div class="container">
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:3rem;" class="grid-3">
        <div>
          <div style="font-family:var(--serif);font-size:22px;font-weight:700;color:var(--text);margin-bottom:1rem;">Cobus Nel</div>
          <p style="font-size:13px;max-width:260px;margin-bottom:1rem;">South Africa's Capital Architect. CA(SA). Chief Investment Officer at Eridanus, an FSCA-authorised Financial Services Provider (FSP 48947).</p>
          <p style="font-size:11px;color:var(--text-3);">FSP 48947 | Operating since 2018</p>
        </div>
        <div>
          <p style="font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-3);margin-bottom:1.25rem;">Navigate</p>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${[
              { href: 'https://cobusnel.com', label: 'cobusnel.com' },
              { href: 'https://cobusnel.com/about', label: 'About Cobus' },
              { href: 'https://cobusnel.com/for-investors', label: 'For Investors' },
              { href: 'https://cobusnel.com/apply', label: 'Apply' },
            ].map(l => `<a href="${l.href}" target="_blank" rel="noopener" style="font-size:13px;color:var(--text-2);text-decoration:none;transition:color 200ms;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-2)'">${l.label}</a>`).join('')}
          </div>
        </div>
        <div>
          <p style="font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-3);margin-bottom:1.25rem;">Legal</p>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${[
              { href: 'https://cobusnel.com/privacy-policy', label: 'Privacy Policy' },
              { href: 'https://cobusnel.com/terms', label: 'Terms of Service' },
            ].map(l => `<a href="${l.href}" target="_blank" rel="noopener" style="font-size:13px;color:var(--text-2);text-decoration:none;transition:color 200ms;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-2)'">${l.label}</a>`).join('')}
          </div>
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
