/* 운동장 · 물풍선 멀리 던지기 */
(function () {
  const { el, rng } = HH;
  const PIV = { x: 112, y: 438 }, CUP = { x: 186, y: 420 }, GROUND = 470, X0 = 150, RIGHT = 985, PAW = 50;
  const VMAX = 860, TEST_POWER = 0.8;
  const GRAV = { earth: 900, moon: 150 };
  const CATS = { low: { a: 20, name: '낮게', color: '#2f8f86' }, mid: { a: 45, name: '비스듬히', color: '#d9822b' }, high: { a: 70, name: '높게', color: '#7c62ad' } };
  const KEYS = ['low', 'mid', 'high'];

  function arcsArt() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><rect x="0" y="80" width="160" height="16" fill="#e6d3ab"/><line x1="0" y1="80" x2="160" y2="80" stroke="#c9b48a"/>
    <path d="M14 80 Q52 54 90 80" fill="none" stroke="#2f8f86" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>
    <path d="M14 80 Q52 -16 90 80" fill="none" stroke="#7c62ad" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>
    <path d="M14 80 Q77 12 140 80" fill="none" stroke="#d9822b" stroke-width="2.4" stroke-dasharray="1 5" stroke-linecap="round"/>
    <ellipse cx="90" cy="81" rx="9" ry="2.4" fill="#7d6744" opacity=".35"/><ellipse cx="140" cy="81" rx="10" ry="2.6" fill="#7d6744" opacity=".35"/>
    <g transform="translate(140 66)"><use href="#balloon" x="-8" y="-10" width="16" height="20"/></g></svg>`;
  }
  function moonArt() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#1c2546"/><circle cx="20" cy="14" r=".9" fill="#fff"/><circle cx="60" cy="10" r=".7" fill="#fff"/><circle cx="96" cy="20" r=".8" fill="#fff"/><circle cx="134" cy="18" r="9" fill="#4f8fcf" stroke="#24578c" stroke-width=".6"/>
    <rect x="0" y="78" width="160" height="18" fill="#a9a69f"/><line x1="0" y1="78" x2="160" y2="78" stroke="#86837c"/>
    <path d="M10 78 Q26 58 42 78" fill="none" stroke="#7fc0ea" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>
    <path d="M10 78 Q80 -10 150 78" fill="none" stroke="#fff3c8" stroke-width="2.4" stroke-dasharray="1 5" stroke-linecap="round"/>
    <g transform="translate(150 64)"><use href="#balloon" x="-8" y="-10" width="16" height="20"/></g></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="학교 운동장에서 나무 던지기 장치로 물풍선을 던지는 장면">
      <g id="earthBg">
        <rect width="1000" height="560" fill="url(#skyE)"/>
        <circle cx="900" cy="70" r="80" fill="url(#sunGlow)"/>
        <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8">
          <path d="M120 96 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/>
          <path d="M470 70 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".85"/>
          <path d="M700 130 c0 -10 14 -14 20 -6 c6 -10 22 -8 26 2 c10 0 14 10 8 14 h-48 c-6 0 -8 -6 -6 -10 Z" opacity=".8"/>
        </g>
        <path d="M0 300 C120 252 220 270 320 284 C420 298 520 250 640 262 C760 274 880 238 1000 266 L1000 340 L0 340 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
        <g opacity=".95">
          <rect x="560" y="262" width="230" height="72" fill="#efe4d0" stroke="#b5a487" stroke-width=".8"/>
          <rect x="556" y="255" width="238" height="9" fill="#c9b79a" stroke="#a8977b" stroke-width=".6"/>
          <rect x="655" y="232" width="40" height="30" fill="#efe4d0" stroke="#b5a487" stroke-width=".8"/>
          <path d="M650 233 L675 220 L700 233 Z" fill="#c9b79a" stroke="#a8977b" stroke-width=".6"/>
          <circle cx="675" cy="247" r="8" fill="#fffdf6" stroke="#8a7a5c" stroke-width=".8"/>
          <path d="M675 247 L675 242 M675 247 L679 249" stroke="#5a4a30" stroke-width=".8" stroke-linecap="round"/>
          <g id="windows"></g>
          <rect x="664" y="310" width="22" height="24" fill="#b9a383" stroke="#8a7656" stroke-width=".7"/>
        </g>
        <g id="trees"></g>
        <rect y="330" width="1000" height="16" fill="#a2bd82"/>
        <path d="M0 330 H1000" stroke="#86a668" stroke-width=".8"/>
        <rect y="342" width="1000" height="218" fill="url(#sandE)"/>
        <g id="speckles"></g>
      </g>
      <g id="moonBg" style="display:none">
        <rect width="1000" height="560" fill="url(#skyM)"/>
        <g id="starsBg"></g>
        <clipPath id="earthClip"><circle cx="830" cy="96" r="34"/></clipPath>
        <circle cx="830" cy="96" r="34" fill="url(#earthBall)"/>
        <g clip-path="url(#earthClip)" fill="#6fa767" opacity=".9">
          <path d="M806 80 c8 -10 22 -8 24 2 c2 8 -8 10 -6 18 c2 8 -10 12 -16 6 c-6 -6 -8 -18 -2 -26 Z"/>
          <path d="M840 104 c6 -6 18 -4 20 4 c2 8 -6 14 -14 12 c-6 -2 -10 -10 -6 -16 Z"/>
        </g>
        <circle cx="830" cy="96" r="34" fill="none" stroke="#24578c" stroke-width=".8"/>
        <path d="M0 318 C90 300 160 316 250 306 C360 292 430 318 540 304 C650 290 760 312 860 300 C930 292 970 302 1000 298 L1000 344 L0 344 Z" fill="#7d7a74" stroke="#66635d" stroke-width=".8"/>
        <rect y="342" width="1000" height="218" fill="url(#sandM)"/>
        <g id="craters"></g>
      </g>
      <g id="ruler"></g><g id="targetG"></g><g id="marks"></g><g id="trails"></g>
      <use href="#squirrel" x="-2" y="404" width="68" height="68"/>
      <g id="launcher">
        <path d="M112 438 L176 438 A64 64 0 0 0 112 374 Z" fill="#ffffff" fill-opacity=".38" stroke="#9b8a68" stroke-width=".8"/>
        <g id="prot"></g>
        <rect x="66" y="455" width="8" height="17" fill="url(#woodD)" stroke="#6e4a2b" stroke-width=".8"/>
        <rect x="152" y="455" width="8" height="17" fill="url(#woodD)" stroke="#6e4a2b" stroke-width=".8"/>
        <rect x="58" y="446" width="110" height="12" rx="2" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
        <path d="M64 450 C90 448 110 453 160 450 M70 454 C100 452 130 456 162 453" fill="none" stroke="#7a5230" stroke-width=".6" opacity=".55"/>
        <path d="M98 447 L112 430 L126 447 Z" fill="url(#woodD)" stroke="#6e4a2b" stroke-width=".9"/>
        <g id="arm" transform="rotate(-20 112 438)">
          <rect x="110" y="435" width="74" height="6" rx="3" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
          <path d="M120 438 H176" stroke="#7a5230" stroke-width=".5" opacity=".5"/>
          <path d="M173 431 Q186 448 199 431 Z" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".9"/>
          <use id="loaded" href="#balloon" x="170" y="400" width="32" height="40"/>
        </g>
        <circle cx="112" cy="438" r="5" fill="url(#metal)" stroke="#5a5a55" stroke-width=".8"/>
      </g>
      <g id="fly" style="display:none"><use href="#balloon" x="-16" y="-20" width="32" height="40"/></g>
      <g id="fx"></g>
    </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>같은 힘으로 던지면 비스듬히(45°쯤) 던질 때 가장 멀리 갑니다. 20°와 70°처럼 짝이 되는 각도는 날아간 거리가 같습니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 그림 카드에서 하나 고르기. 도토리가 “높이 던지면 멀리 간다”는 흔한 생각을 먼저 말합니다.</li><li>실험: 힘은 고정하고 방향만 세 가지로 바꿉니다. 공정한 실험(한 가지만 바꾸기)을 경험합니다.</li><li>발견: 막대그래프로 비교하고 발견 카드를 받습니다.</li><li>놀이: 방향과 힘을 함께 조절해 훌라후프 맞히기. 달 운동장에서 중력 차이를 느껴 봅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>왜 힘은 모두 똑같이 했을까?</li><li>발자국 말고 무엇으로 거리를 잴 수 있을까?</li><li>달에서는 왜 더 오래, 더 멀리 날아갈까?</li></ul></div>
    <div><h3>교과 연계</h3><p>2학년 수학 「길이 재기」(임의 단위), 「표와 그래프」. 3학년 이후 과학의 탐구 과정(예상, 변인 통제, 결과 비교) 준비 활동.</p></div>
    <div><h3>참고</h3><p>이 놀이터는 공기 저항을 뺀 모습입니다. 실제 물풍선은 공기 저항 때문에 45°보다 조금 낮게 던질 때 가장 멀리 갑니다.</p></div>`;

  const LOCK = '<svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>';
  const EARTH_ICON = '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="26" rx="4" fill="#cfe5f1"/><rect x="2" y="26" width="40" height="16" rx="3" fill="#e2cca2" stroke="#c4ad80" stroke-width=".8"/><circle cx="34" cy="10" r="4" fill="#ffe9a8"/><circle cx="12" cy="22" r="5" fill="#86b06a" stroke="#557d40" stroke-width=".6"/></svg>';
  const MOON_ICON = '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="26" rx="4" fill="#1c2546"/><circle cx="10" cy="8" r=".9" fill="#fff"/><circle cx="20" cy="14" r=".7" fill="#fff"/><circle cx="30" cy="11" r="5" fill="#4f8fcf" stroke="#24578c" stroke-width=".6"/><rect x="2" y="26" width="40" height="16" rx="3" fill="#a9a69f" stroke="#7f7c75" stroke-width=".8"/><ellipse cx="16" cy="34" rx="6" ry="1.8" fill="#86837c"/></svg>';

  function miniSVG(a, color) {
    const px = 46, py = 78, r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    const ex = px + 40 * c, ey = py - 40 * s, ax = px + 96 * c, ay = py - 96 * s * 0.75;
    const ux = ax - ex, uy = ay - ey, L = Math.hypot(ux, uy), nx = ux / L, ny = uy / L;
    const p1 = `${(ax - 9 * nx + 5 * ny).toFixed(1)},${(ay - 9 * ny - 5 * nx).toFixed(1)}`, p2 = `${(ax - 9 * nx - 5 * ny).toFixed(1)},${(ay - 9 * ny + 5 * nx).toFixed(1)}`;
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect x="0" y="80" width="160" height="20" fill="#e6d3ab"/><line x1="0" y1="80" x2="160" y2="80" stroke="#c9b48a" stroke-width="1"/>
    <rect x="22" y="80" width="48" height="6" rx="1.5" fill="#b9895a" stroke="#7a5432" stroke-width=".8"/>
    <line x1="${px}" y1="${py}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#94693c" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${px}" cy="${py}" r="2.6" fill="#ccc" stroke="#666" stroke-width=".6"/>
    <path d="M${ex.toFixed(1)} ${ey.toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)}" stroke="${color}" stroke-width="2.2" stroke-dasharray="4 4" fill="none"/>
    <polygon points="${ax.toFixed(1)},${ay.toFixed(1)} ${p1} ${p2}" fill="${color}"/>
    <g transform="translate(${ex.toFixed(1)} ${(ey - 8).toFixed(1)})"><use href="#balloon" x="-8" y="-10" width="16" height="20"/></g></svg>`;
  }

  HH.register({
    id: 'balloon',
    cards: [
      { id: 'balloon-angle', no: 1, text: '비스듬히 던지면 가장 멀리 날아가요.', art: arcsArt },
      { id: 'balloon-moon', no: 2, text: '달에서는 같은 힘으로 던져도 훨씬 멀리 날아가요.', art: moonArt }
    ],
    thumb() { return arcsArt().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'balloon', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#paw"/></svg>운동장 흰 선의 숫자는 발자국 수예요. 발자국 1개만큼씩 눈금이 있어요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root);
      const say = ui.say;

      const state = {};
      function freshState() { Object.assign(state, { phase: 'intro', pred: null, results: { low: null, mid: null, high: null }, cat: 'low', angle: 20, power: TEST_POWER, world: 'earth', flying: false, hits: 0, target: null, moonDone: false, testItems: {}, playItems: [] }); }
      freshState();

      /* scenery */
      (function scenery() {
        const R = rng(11);
        const sp = $('#speckles');
        for (let i = 0; i < 280; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (346 + R() * 212).toFixed(1), r: (0.5 + R() * 1.2).toFixed(2), fill: '#a98f62', 'fill-opacity': (0.22 + R() * 0.4).toFixed(2) }, sp);
        for (let i = 0; i < 16; i++) el('ellipse', { cx: (R() * 1000).toFixed(1), cy: (360 + R() * 190).toFixed(1), rx: (2 + R() * 3).toFixed(1), ry: (1.2 + R() * 1.6).toFixed(1), fill: '#d9c7a2', stroke: '#a58f68', 'stroke-width': .6 }, sp);
        const w = $('#windows');
        for (let r = 0; r < 2; r++) for (let c = 0; c < 9; c++) { const x = 570 + c * 24; if (x > 650 && x < 696 && r === 1) continue; el('rect', { x, y: 272 + r * 30, width: 14, height: 16, fill: '#c4d8e3', stroke: '#9db0bc', 'stroke-width': .6 }, w); el('path', { d: `M${x + 7} ${272 + r * 30} V${288 + r * 30}`, stroke: '#9db0bc', 'stroke-width': .5 }, w); }
        const tr = $('#trees');
        [20, 70, 128, 190, 250, 318, 380, 440, 505, 830, 880, 935, 985].forEach(x => HH.tree(tr, x, 332, 0.8 + R() * 0.45));
        const st = $('#starsBg');
        for (let i = 0; i < 110; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (R() * 300).toFixed(1), r: (0.4 + R() * 1.1).toFixed(2), fill: '#fffbe8', 'fill-opacity': (0.4 + R() * 0.6).toFixed(2) }, st);
        const cr = $('#craters');
        for (let i = 0; i < 11; i++) { const x = R() * 1000, y = 360 + R() * 190, rx = 8 + R() * 26; el('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: rx.toFixed(1), ry: (rx * 0.28).toFixed(1), fill: '#77746d', 'fill-opacity': .45, stroke: '#615e58', 'stroke-width': .6 }, cr); el('path', { d: `M${(x - rx * 0.8).toFixed(1)} ${(y + rx * 0.12).toFixed(1)} Q${x.toFixed(1)} ${(y + rx * 0.36).toFixed(1)} ${(x + rx * 0.8).toFixed(1)} ${(y + rx * 0.12).toFixed(1)}`, fill: 'none', stroke: '#d8d5ce', 'stroke-width': .8, opacity: .7 }, cr); }
        for (let i = 0; i < 220; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (346 + R() * 212).toFixed(1), r: (0.5 + R() * 1.1).toFixed(2), fill: '#6d6a64', 'fill-opacity': (0.2 + R() * 0.35).toFixed(2) }, cr);
        const pr = $('#prot');
        for (let d = 0; d <= 90; d += 10) { const r = d * Math.PI / 180; el('line', { x1: (PIV.x + 56 * Math.cos(r)).toFixed(1), y1: (PIV.y - 56 * Math.sin(r)).toFixed(1), x2: (PIV.x + 64 * Math.cos(r)).toFixed(1), y2: (PIV.y - 64 * Math.sin(r)).toFixed(1), stroke: '#9b8a68', 'stroke-width': .7 }, pr); }
        KEYS.forEach(k => { const r = CATS[k].a * Math.PI / 180; el('circle', { cx: (PIV.x + 60 * Math.cos(r)).toFixed(1), cy: (PIV.y - 60 * Math.sin(r)).toFixed(1), r: 3, fill: CATS[k].color, stroke: '#fff', 'stroke-width': .8 }, pr); });
      })();

      /* physics */
      function scale() { const R = VMAX * VMAX / GRAV[state.world]; return Math.min(1, (RIGHT - X0 - 10) / R); }
      function range(a, p, g) { const v = VMAX * p; return v * v * Math.sin(2 * a * Math.PI / 180) / g; }
      function toScreen(wx, wy, s) { return { x: X0 + wx * s, y: GROUND - wy * s }; }
      function cupPos(a) { const r = a * Math.PI / 180, dx = CUP.x - PIV.x, dy = CUP.y - PIV.y; return { x: PIV.x + dx * Math.cos(r) + dy * Math.sin(r), y: PIV.y - dx * Math.sin(r) + dy * Math.cos(r) }; }

      function drawRuler() {
        const g = $('#ruler'); g.innerHTML = ''; const s = scale(), pp = PAW * s;
        const step = [1, 5, 10, 20, 50].find(n => n * pp >= 36);
        el('line', { x1: X0, y1: GROUND + 4, x2: RIGHT, y2: GROUND + 4, stroke: '#fffaf0', 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: .92 }, g);
        for (let k = 0; X0 + k * pp <= RIGHT; k += step) {
          const x = X0 + k * pp;
          el('line', { x1: x.toFixed(1), y1: GROUND + 4, x2: x.toFixed(1), y2: GROUND + 13, stroke: '#fffaf0', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: .92 }, g);
          const t = el('text', { x: x.toFixed(1), y: GROUND + 32, 'text-anchor': 'middle', 'font-size': 15, fill: '#fffdf6', stroke: '#a88f60', 'stroke-width': 2.6, 'paint-order': 'stroke' }, g); t.textContent = k;
        }
        const u = el('use', { href: '#paw', x: X0 - 30, y: GROUND + 18, width: 16, height: 16 }, g); u.style.color = '#fffaf0';
      }

      let armA = 20;
      function applyArm(a) { $('#arm').setAttribute('transform', `rotate(${(-a).toFixed(2)} ${PIV.x} ${PIV.y})`); }
      function setArm(a, instant) {
        const from = armA; armA = a; if (instant) { applyArm(a); return; }
        const t0 = performance.now();
        (function step(n) { if (!alive()) return; const k = Math.min(1, (n - t0) / 280), e = 1 - Math.pow(1 - k, 3); applyArm(from + (a - from) * e); if (k < 1) requestAnimationFrame(step); })(t0);
      }

      function splash(x) {
        const wet = el('ellipse', { cx: x.toFixed(1), cy: GROUND + 2, rx: 24, ry: 5, fill: '#7d6744', 'fill-opacity': .32 }, $('#marks'));
        const fx = $('#fx'), drops = [], R = Math.random;
        for (let i = 0; i < 14; i++) { const a = Math.PI * (0.1 + 0.8 * R()), sp = 90 + R() * 170; drops.push({ e: el('circle', { r: (1.4 + R() * 2.2).toFixed(1), fill: '#6fb4e4', stroke: '#2f73ad', 'stroke-width': .5 }, fx), vx: Math.cos(a) * sp * (R() < .5 ? -1 : 1), vy: -Math.sin(a) * sp, x: x, y: GROUND - 2 }); }
        const t0 = performance.now(); let last = t0;
        (function f(n) {
          if (!alive()) return;
          const dt = (n - last) / 1000; last = n; const k = (n - t0) / 650;
          drops.forEach(d => { d.vy += 600 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.e.setAttribute('cx', d.x.toFixed(1)); d.e.setAttribute('cy', Math.min(d.y, GROUND + 2).toFixed(1)); d.e.setAttribute('opacity', Math.max(0, 1 - k).toFixed(2)); });
          if (k < 1) requestAnimationFrame(f); else drops.forEach(d => d.e.remove());
        })(t0);
        return wet;
      }
      function marker(x, paws, color, level) {
        const h = 30 + level * 30;
        const g = el('g', { transform: `translate(${x.toFixed(1)} ${GROUND})` }, $('#marks'));
        el('line', { x1: 0, y1: 2, x2: 0, y2: -h, stroke: '#7a5a3a', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g);
        el('rect', { x: -27, y: -h - 24, width: 54, height: 24, rx: 5, fill: '#fffdf6', stroke: color, 'stroke-width': 1.4 }, g);
        const u = el('use', { href: '#paw', x: -22, y: -h - 20, width: 16, height: 16 }, g); u.style.color = color;
        const t = el('text', { x: 8, y: -h - 6.5, 'text-anchor': 'middle', 'font-size': 16, fill: '#3b3226' }, g); t.textContent = paws;
        return g;
      }

      function newTarget() { const R = Math.random; state.target = state.world === 'earth' ? 240 + R() * 540 : 1300 + R() * 3200; drawTarget(); }
      function drawTarget() {
        const g = $('#targetG'); g.innerHTML = ''; if (state.target == null) return;
        const p = toScreen(state.target, 0, scale());
        const t = el('g', { transform: `translate(${p.x.toFixed(1)} ${GROUND})` }, g);
        el('path', { d: 'M30 0 V-42', stroke: '#6e5a40', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, t);
        el('path', { d: 'M30 -42 L52 -35 L30 -28 Z', fill: '#d9483b', stroke: '#8a2c22', 'stroke-width': .7 }, t);
        el('ellipse', { cx: 0, cy: 0, rx: 28, ry: 7, fill: '#fff6d8', 'fill-opacity': .35, stroke: '#d9483b', 'stroke-width': 3.2 }, t);
        el('ellipse', { cx: 0, cy: 0, rx: 28, ry: 7, fill: 'none', stroke: '#f2c230', 'stroke-width': 3.2, 'stroke-dasharray': '7 7' }, t);
        el('ellipse', { cx: 0, cy: 0, rx: 29.6, ry: 8.6, fill: 'none', stroke: '#8a2c22', 'stroke-width': .6, opacity: .6 }, t);
      }

      function throwBalloon() {
        if (state.flying) return; state.flying = true;
        const btn = $('#throwBtn'); if (btn) btn.disabled = true;
        const a = state.angle, p = state.power, g = GRAV[state.world], s = scale();
        const v = VMAX * p, r = a * Math.PI / 180, vx = v * Math.cos(r), vy = v * Math.sin(r), T = 2 * vy / g, R = vx * T;
        const start = cupPos(a), off = { x: start.x - X0, y: start.y - GROUND };
        $('#loaded').style.visibility = 'hidden';
        const fly = $('#fly'); fly.style.display = '';
        const color = state.phase === 'test' ? CATS[state.cat].color : '#3f7fb8';
        const trail = el('polyline', { fill: 'none', stroke: color, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-dasharray': '1 7', opacity: .9 }, $('#trails'));
        const pts = []; const speed = state.world === 'moon' ? 1.6 : 0.75;
        let t = 0, last = null;
        function frame(n) {
          if (!alive()) return;
          if (last === null) last = n; const dt = Math.min(.05, (n - last) / 1000); last = n; t = Math.min(T, t + dt * speed);
          const k = t / T, wx = vx * t, wy = vy * t - g * t * t / 2, sc = toScreen(wx, wy, s);
          const x = sc.x + off.x * (1 - k), y = sc.y + off.y * (1 - k);
          const vxs = vx * s - off.x / T, vys = -(vy - g * t) * s - off.y / T;
          const rot = Math.atan2(vys, vxs) * 180 / Math.PI + 90;
          fly.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`);
          pts.push(x.toFixed(1) + ',' + y.toFixed(1)); trail.setAttribute('points', pts.join(' '));
          if (t < T) requestAnimationFrame(frame); else land(R, x, trail);
        }
        requestAnimationFrame(frame);
      }
      function land(R, x, trail) {
        $('#fly').style.display = 'none';
        const wet = splash(x);
        const paws = Math.round(R / PAW);
        setTimeout(() => { if (alive()) $('#loaded').style.visibility = ''; }, 450);
        state.flying = false;
        if (state.phase === 'test') {
          const cat = state.cat, old = state.testItems[cat]; if (old) old.forEach(e => e.remove());
          const m = marker(x, paws, CATS[cat].color, cat === 'high' ? 1 : 0);
          state.testItems[cat] = [trail, wet, m]; state.results[cat] = paws;
          renderControls();
          const done = allDone();
          say('owl', `<b>${CATS[cat].name}</b> 던졌더니 <b>발자국 ${paws}개</b>만큼 날아갔어!` + (done ? ' 세 가지를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ' 다른 방향으로도 던져 볼까?'), true);
        } else if (state.phase === 'play') {
          const m = marker(x, paws, '#3f7fb8', 0);
          state.playItems.push([trail, wet, m]);
          while (state.playItems.length > 3) state.playItems.shift().forEach(e => e.remove());
          state.playItems.slice(0, -1).forEach(arr => { arr[0].setAttribute('opacity', .35); arr[2].setAttribute('opacity', .45); });
          const tol = 30 / scale();
          if (Math.abs(R - state.target) <= tol) {
            state.hits++; HH.stars($('#fx'), x, GROUND);
            say('owl', '<b>쏙!</b> 훌라후프에 딱 들어갔어! 다음 훌라후프도 맞혀 볼까?', true);
            setTimeout(() => { if (alive()) newTarget(); }, 900);
          } else if (R < state.target) say('squirrel', '조금 모자라! <b>힘을 더 세게</b> 하거나 <b>방향</b>을 바꿔 봐.');
          else say('squirrel', '너무 멀리 갔어! <b>힘을 조금 약하게</b> 해 볼까?');
          renderControls();
          if (state.world === 'moon' && !state.moonDone) { state.moonDone = true; setTimeout(() => { if (alive()) moonCard(paws); }, 1000); }
        } else renderControls();
      }
      function allDone() { return KEYS.every(k => state.results[k] != null); }

      function chartSVG() {
        const base = 132, maxP = 12, hMax = 100;
        let s = `<svg class="chart" viewBox="0 0 300 210" role="img" aria-label="방향별로 날아간 발자국 수 막대그래프">`;
        s += `<use href="#paw" x="4" y="2" width="14" height="14" style="color:#8a7a5c"/><text x="22" y="13" class="ax">발자국 수</text>`;
        for (let k = 0; k <= 12; k += 4) { const y = base - k / maxP * hMax; s += `<line x1="34" x2="292" y1="${y}" y2="${y}" stroke="#d8ccb2" stroke-width="${k === 0 ? 1.2 : .7}"/><text x="28" y="${y + 4}" text-anchor="end" class="ax">${k}</text>`; }
        KEYS.forEach((key, i) => {
          const cx = 82 + i * 84, c = CATS[key], r = state.results[key];
          if (r == null) s += `<rect x="${cx - 24}" y="${base - 50}" width="48" height="50" rx="4" fill="none" stroke="#b8ab90" stroke-dasharray="4 4"/><text x="${cx}" y="${base - 18}" text-anchor="middle" class="q">?</text>`;
          else { const h = Math.max(2, Math.min(r, maxP) / maxP * hMax); s += `<rect x="${cx - 24}" y="${(base - h).toFixed(1)}" width="48" height="${h.toFixed(1)}" rx="4" fill="${c.color}" fill-opacity=".85" stroke="${c.color}" stroke-width="1"/><text x="${cx}" y="${(base - h - 7).toFixed(1)}" text-anchor="middle" class="val">${r}</text>`; }
          const a = c.a * Math.PI / 180, gx = cx - 12, gy = base + 30;
          s += `<line x1="${cx - 18}" x2="${cx + 18}" y1="${gy}" y2="${gy}" stroke="#a89470" stroke-width="1"/><line x1="${gx}" y1="${gy}" x2="${(gx + 22 * Math.cos(a)).toFixed(1)}" y2="${(gy - 22 * Math.sin(a)).toFixed(1)}" stroke="${c.color}" stroke-width="2.6" stroke-linecap="round"/>`;
          s += `<text x="${cx}" y="${base + 50}" text-anchor="middle" class="nm">${c.name}</text>`;
          if (state.pred === key) s += `<text x="${cx}" y="${base + 68}" text-anchor="middle" class="pred">★ 내 예상</text>`;
        });
        return s + '</svg>';
      }

      function setPhase(p) { state.phase = p; HH.setSteps(root, p); renderControls(); }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (state.phase === 'test' || state.phase === 'discover') {
          c.innerHTML = `<p class="lab">던지는 방향을 골라 봐</p><div class="angles">${KEYS.map(k => `<button type="button" class="ang ${state.cat === k ? 'on' : ''}" data-cat="${k}" style="--c:${CATS[k].color}" aria-pressed="${state.cat === k}">${miniSVG(CATS[k].a, CATS[k].color)}<span>${CATS[k].name}</span>${state.results[k] != null ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
          <div class="row"><span class="lock">${LOCK}힘은 모두 똑같이</span><button type="button" class="throw" id="throwBtn" ${state.flying ? 'disabled' : ''}>던지기!</button></div>`;
          side.innerHTML = `<p class="lab">얼마나 멀리 갔을까?</p>${chartSVG()}${allDone() ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (state.phase === 'play') {
          c.innerHTML = `<label class="lab" for="angleR">던지는 방향</label><div class="slide"><span>낮게</span><input type="range" id="angleR" min="10" max="80" step="1" value="${Math.round(state.angle)}"><span>높게</span></div>
          <label class="lab" for="powerR">힘</label><div class="slide"><span>약하게</span><input type="range" id="powerR" min="30" max="100" step="1" value="${Math.round(state.power * 100)}"><span>세게</span></div>
          <div class="row" style="margin-top:0;justify-content:flex-end"><button type="button" class="throw" id="throwBtn" ${state.flying ? 'disabled' : ''}>던지기!</button></div>`;
          side.innerHTML = `<p class="lab">어디에서 던질까?</p><div class="worlds"><button type="button" class="world ${state.world === 'earth' ? 'on' : ''}" data-world="earth" aria-pressed="${state.world === 'earth'}">${EARTH_ICON}<span>지구 운동장</span></button><button type="button" class="world ${state.world === 'moon' ? 'on' : ''}" data-world="moon" aria-pressed="${state.world === 'moon'}">${MOON_ICON}<span>달 운동장</span></button></div><p class="score">훌라후프 맞히기 <b>${state.hits}</b>번</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 어느 쪽이 가장 멀리 갈지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">얼마나 멀리 갔을까?</p>${chartSVG()}`;
        }
      }

      function introOverlay() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 120 120" aria-hidden="true"><use href="#squirrel" width="120" height="120"/></svg></div>
          <p class="eyebrow">운동장 · 힘과 움직임</p><h2>물풍선 멀리 던지기</h2>
          <p class="lead">운동장에서 물풍선을 던져 보자.<br>어떻게 던져야 가장 멀리 갈까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predictOverlay() {
        setPhase('predict');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '힘은 똑같이 하고 방향만 바꿔서 던질 거야. <b>어느 쪽이 가장 멀리</b> 갈까?')}
          ${HH.talk('squirrel', '나는 높게! 높이 던져야 제일 멀리 가지!')}
          <div class="picks">${KEYS.map(k => `<button type="button" class="pick" data-pick="${k}" style="--c:${CATS[k].color}">${miniSVG(CATS[k].a, CATS[k].color)}<span>${CATS[k].name}</span></button>`).join('')}</div>
          <p style="text-align:center;color:var(--ink-soft)">내 생각에 가장 멀리 갈 것 같은 그림을 골라 봐</p></div>`);
      }
      function discoverOverlay() {
        setPhase('discover'); HH.addCard('balloon-angle');
        const msg = { mid: '예상이 딱 맞았어! 호오~ 훌륭한 과학자인걸?', high: '도토리랑 같은 생각이었구나! 높게 던지면 높이 올라가지만 멀리 가지는 못했어.', low: '낮게 던지면 금방 땅에 닿아 버렸지? 그래서 멀리 못 갔어.' }[state.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          <div class="ov-chart">${chartSVG()}</div>
          ${HH.talk('owl', msg)}
          ${HH.talk('squirrel', '앗, 높이 던진다고 멀리 가는 게 아니었네! 알려 줘서 고마워!')}
          ${HH.dcard(1, arcsArt(), '비스듬히 던지면 가장 멀리 날아가요.', '낮게 던진 것과 높게 던진 것은 거리가 똑같았어요!')}
          <button type="button" class="btn primary" data-act="play">훌라후프 맞히기 놀이 하기</button></div>`);
      }
      function moonCard(paws) {
        HH.addCard('balloon-moon');
        const earthP = Math.round(range(state.angle, state.power, GRAV.earth) / PAW);
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '달은 지구보다 <b>끌어당기는 힘이 약해</b>. 그래서 물풍선이 오래 떠 있다가 멀리 떨어진단다.')}
          ${HH.dcard(2, moonArt(), '달에서는 같은 힘으로 던져도 훨씬 멀리 날아가요.', `같은 방향, 같은 힘으로 지구에서는 발자국 ${earthP}개, 달에서는 발자국 ${paws}개!`)}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }

      function clearMarks() { ['#marks', '#trails', '#fx'].forEach(s => $(s).innerHTML = ''); state.testItems = {}; state.playItems = []; }
      function setWorld(w) {
        if (state.flying || state.world === w) return; state.world = w;
        $('#earthBg').style.display = w === 'earth' ? '' : 'none'; $('#moonBg').style.display = w === 'moon' ? '' : 'none';
        clearMarks(); drawRuler(); newTarget(); renderControls();
        if (w === 'moon') say('owl', '여기는 <b>달</b>이야! 지구에서와 똑같이 던지면 어떻게 될까? 눈금 숫자도 살펴봐.', true);
        else say('owl', '다시 <b>지구 운동장</b>으로 돌아왔어.');
      }
      function startPlay() {
        ui.hide(); clearMarks(); setPhase('play');
        state.angle = 45; state.power = .7; setArm(45); newTarget(); renderControls();
        say('owl', '이번엔 <b>훌라후프</b>를 맞혀 봐! 방향과 힘을 바꿔 가며 던져 보자.', true);
      }
      function reset() {
        if (state.flying) return;
        freshState(); ui.hide(); clearMarks();
        $('#earthBg').style.display = ''; $('#moonBg').style.display = 'none';
        state.target = null; drawTarget(); drawRuler(); setArm(20, true);
        setPhase('intro'); say('owl', '안녕! 나는 <b>호호박사</b>야. 오늘은 운동장에서 물풍선을 던져 볼 거야.'); introOverlay();
      }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'throwBtn') { throwBalloon(); return; }
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.cat && !state.flying) { state.cat = b.dataset.cat; state.angle = CATS[state.cat].a; setArm(state.angle); renderControls(); return; }
        if (b.dataset.pick) {
          state.pred = b.dataset.pick; ui.hide(); setPhase('test'); state.cat = 'low'; state.angle = 20; setArm(20); renderControls();
          say('owl', `<b>${CATS[state.pred].name} 던지기</b>를 골랐구나! 이제 세 방향으로 모두 던져 보자. 방향을 고르고 <b>던지기!</b>를 눌러 봐.`, true); return;
        }
        if (b.dataset.world) { setWorld(b.dataset.world); return; }
        const act = b.dataset.act;
        if (act === 'start') predictOverlay();
        else if (act === 'discover') discoverOverlay();
        else if (act === 'play') startPlay();
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('input', e => {
        if (e.target.id === 'angleR') { state.angle = +e.target.value; armA = state.angle; applyArm(state.angle); }
        if (e.target.id === 'powerR') state.power = +e.target.value / 100;
      });

      drawRuler(); applyArm(20); setPhase('intro');
      say('owl', '안녕! 나는 <b>호호박사</b>야. 오늘은 운동장에서 물풍선을 던져 볼 거야.');
      introOverlay();
    }
  });
})();
