/* 하늘 정원 · 종이비행기 공방 */
(function () {
  const { el, rng, josa } = HH;
  const GROUND = 470, X0 = 165, Y0 = 205, RIGHT = 985, PAW = 50;
  const TYPES = {
    ball: { name: '종이 공', color: '#8a7a5c', kind: 'ball' },
    dart: { name: '날씬한 다트', color: '#2f8f86', kind: 'dart', s: 120, gv: 165, wing: .7 },
    wide: { name: '넓은 날개', color: '#d9822b', kind: 'wide', s: 56, gv: 115, wing: 1.3 }
  };
  const KEYS = ['ball', 'dart', 'wide'];
  const WINGS = { small: { name: '작게', s: 130, gv: 172, wing: .7 }, mid: { name: '보통', s: 85, gv: 143, wing: 1 }, big: { name: '크게', s: 56, gv: 115, wing: 1.3 } };

  /* a paper plane seen a little from above, nose pointing right */
  function planeSVG(kind, wing, clips) {
    if (kind === 'ball') {
      return `<path d="M-11 -3 L-6 -11 L3 -12 L10 -6 L12 3 L6 11 L-4 12 L-11 6 Z" fill="#fbfaf4" stroke="#9a968c" stroke-width=".8" stroke-linejoin="round"/>
        <path d="M-6 -11 L-1 -2 L10 -6 M-1 -2 L-4 12 M-1 -2 L12 3 M-11 -3 L-1 -2" fill="none" stroke="#c9c5ba" stroke-width=".7"/>`;
    }
    const w = wing || 1, L = 34, sp = 15 * w;
    let s = `<path d="M${L} 0 L${-L + 6} ${(-sp).toFixed(1)} L${-L + 12} -1.5 Z" fill="#fbfaf4" stroke="#9a968c" stroke-width=".8" stroke-linejoin="round"/>
      <path d="M${L} 0 L${-L + 12} 1.5 L${-L + 6} ${(sp * .75).toFixed(1)} Z" fill="#e9e6dc" stroke="#9a968c" stroke-width=".8" stroke-linejoin="round"/>
      <path d="M${L} 0 L${-L + 4} 3 L${-L + 10} 8 Z" fill="#dcd8cc" stroke="#9a968c" stroke-width=".7" stroke-linejoin="round"/>
      <path d="M${L - 2} -.3 L${-L + 10} ${(-sp * .45).toFixed(1)}" stroke="#c9c5ba" stroke-width=".6"/>`;
    for (let i = 0; i < (clips || 0); i++) s += `<g transform="translate(${L - 10 - i * 7} 3) rotate(90) scale(.42)"><use href="#obj-clip" x="-10" y="-19" width="20" height="38"/></g>`;
    return s;
  }
  function mini(type, color) {
    const t = TYPES[type];
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#dcebef"/><rect y="80" width="160" height="20" fill="#a9c98a"/>
      <g transform="translate(80 44) scale(${t.kind === 'ball' ? 1.6 : 1.5}) rotate(-6)">${planeSVG(t.kind, t.wing)}</g>
      <text x="80" y="94" text-anchor="middle" font-size="10" fill="#3b3226">A4 한 장</text></svg>`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><rect y="80" width="160" height="16" fill="#a9c98a"/>
      <path d="M14 20 Q22 30 30 80" fill="none" stroke="#8a7a5c" stroke-width="1.6" stroke-dasharray="1 4" stroke-linecap="round"/>
      <path d="M14 20 Q50 30 82 80" fill="none" stroke="#2f8f86" stroke-width="1.6" stroke-dasharray="1 4" stroke-linecap="round"/>
      <path d="M14 20 Q90 26 146 80" fill="none" stroke="#d9822b" stroke-width="2" stroke-dasharray="1 4" stroke-linecap="round"/>
      <g transform="translate(140 72) rotate(18) scale(.62)">${planeSVG('wide', 1.3)}</g><g transform="translate(78 74) rotate(30) scale(.5)">${planeSVG('dart', .7)}</g><g transform="translate(30 76) scale(.55)">${planeSVG('ball')}</g></svg>`;
  }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><rect y="80" width="160" height="16" fill="#a9c98a"/>
      <path d="M12 24 C30 10 40 50 56 30 S80 60 92 72" fill="none" stroke="#9c4524" stroke-width="1.4" stroke-dasharray="1 4" stroke-linecap="round" opacity=".7"/>
      <path d="M12 40 Q80 44 146 70" fill="none" stroke="#4f7a3f" stroke-width="2" stroke-dasharray="1 4" stroke-linecap="round"/>
      <g transform="translate(130 64) rotate(14) scale(.75)">${planeSVG('wide', 1, 1)}</g>
      <text x="40" y="16" font-size="9" fill="#9c4524">클립 없음</text><text x="96" y="40" font-size="9" fill="#3c5f30">클립 1개</text></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="하늘 정원 언덕 전망대에서 종이비행기를 날리는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="880" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8"><path d="M300 100 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/><path d="M620 70 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".85"/></g>
    <path d="M760 160 L776 182 L760 208 L744 182 Z" fill="#e8b23c" stroke="#a67a1c" stroke-width=".8"/><path d="M760 160 V208 M744 182 H776" stroke="#a67a1c" stroke-width=".6"/><path d="M760 208 q-8 12 0 22 q8 10 -2 22" fill="none" stroke="#7a6a52" stroke-width=".8"/>
    <path d="M0 330 C140 300 260 316 380 320 C520 324 640 292 780 300 C880 306 950 292 1000 296 L1000 400 L0 400 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="plTrees"></g>
    <rect y="${GROUND}" width="1000" height="${560 - GROUND}" fill="#a9c98a"/>
    <path d="M0 400 C120 400 200 420 300 440 C420 460 520 468 1000 470 L1000 ${GROUND} L0 ${GROUND} Z" fill="#b4d196"/>
    <path d="M0 ${GROUND} H1000" stroke="#86a96a" stroke-width="1"/>
    <g id="plFlowers"></g>
    <path d="M0 230 C60 226 140 240 210 290 C250 320 280 380 320 ${GROUND} L0 ${GROUND} Z" fill="#9cc27c" stroke="#7aa25e" stroke-width=".9"/>
    <!-- lookout -->
    <rect x="90" y="214" width="96" height="10" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".8"/>
    <path d="M98 224 V262 M178 224 V262" stroke="#7a5230" stroke-width="5"/>
    <path d="M90 214 V190 M186 214 V190 M90 192 H186" stroke="#7a5230" stroke-width="3" fill="none"/>
    <g id="plRuler"></g>
    <g id="plTarget"></g>
    <g id="plMarks"></g>
    <g id="plTrails"></g>
    <g transform="translate(118 148)"><use href="#squirrel" x="0" y="0" width="66" height="66"/></g>
    <g id="plane"></g>
    <g id="plFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>같은 종이 한 장이라도 날개를 넓게 접으면 공기가 비행기를 더 많이 받쳐 주어 천천히 내려오고 오래 날아갑니다. 날개가 없는 종이 공은 바로 떨어집니다. 앞쪽에 클립을 하나 달면 비행기가 위아래로 흔들리지 않고 안정되게 납니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 종이 공, 날씬한 다트, 넓은 날개 중 무엇이 가장 오래 날까? 도토리는 “뾰족한 다트가 가장 빠르니까 가장 오래 난다”고 말합니다.</li><li>실험: 던지는 힘은 똑같이 하고 세 가지를 날립니다. 떠 있던 시간(초)과 날아간 거리(발자국)를 잽니다.</li><li>발견: 날개 넓이와 떠 있던 시간을 비교합니다.</li><li>놀이: 날개 크기, 앞쪽 클립 수, 던지는 힘을 골라 꽃밭 돗자리에 착륙시킵니다. 클립 0개와 1개를 비교해 보게 합니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>종이 공과 종이비행기는 무게가 같은데 왜 다르게 떨어졌을까?</li><li>새는 왜 날개를 넓게 펼치고 날까?</li><li>클립을 너무 많이 달면 어떻게 됐을까?</li></ul></div>
    <div><h3>교과 연계</h3><p>1~2학년 통합교과 놀이 활동, 고학년 과학의 공기 저항 개념 맛보기. 실제 종이비행기 접기 활동과 함께 하면 좋습니다.</p></div>
    <div><h3>참고</h3><p>이 놀이터는 바람이 없는 날을 단순하게 나타냈습니다. 실제로는 다트형 비행기를 세게 던지면 더 멀리 가기도 합니다. 넓은 날개 비행기는 천천히, 오래 나는 쪽에 강합니다.</p></div>`;

  HH.register({
    id: 'plane',
    cards: [
      { id: 'plane-wing', no: 1, text: '같은 종이라도 날개가 넓으면 공기가 받쳐 주어 오래 날아요.', art: art1 },
      { id: 'plane-clip', no: 2, text: '비행기 앞쪽에 클립을 달면 흔들리지 않고 똑바로 날아요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'plane', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#paw"/></svg>꽃밭 말뚝의 숫자는 전망대에서부터의 발자국 수예요. 떠 있던 시간은 초로 재요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, type: 'ball', results: {}, flying: false, wing: 'mid', clips: 1, force: .8, target: null, hits: 0, flownClips: {}, testItems: {}, playItems: [] }); }
      fresh();

      (function () {
        const R = rng(71);
        const t = $('#plTrees'); [360, 430, 560, 640, 820, 900, 980].forEach(x => HH.tree(t, x, 398, .7 + R() * .35));
        const f = $('#plFlowers');
        for (let i = 0; i < 160; i++) { const x = 300 + R() * 700, y = GROUND + 6 + R() * 80; el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)} l${(R() * 2 - 1).toFixed(1)} -${(3 + R() * 4).toFixed(1)}`, stroke: '#7aa25e', 'stroke-width': .8 }, f); if (R() < .35) el('circle', { cx: x.toFixed(1), cy: (y - 6).toFixed(1), r: (1.5 + R()).toFixed(1), fill: ['#f2c230', '#f3b6c6', '#fffaf0', '#c9a7e8'][Math.floor(R() * 4)], stroke: '#a89470', 'stroke-width': .3 }, f); }
        const r = $('#plRuler');
        for (let k = 0; X0 + k * PAW <= RIGHT; k++) {
          const x = X0 + k * PAW;
          if (k % 2 === 0 && x > 300) { el('rect', { x: x - 2, y: GROUND - 16, width: 4, height: 18, fill: 'url(#woodD)', stroke: '#5e3f22', 'stroke-width': .5 }, r); const tx = el('text', { x, y: GROUND + 18, 'text-anchor': 'middle', 'font-size': 14, fill: '#3b3226', 'font-family': 'Jua, sans-serif' }, r); tx.textContent = k; }
          else if (x > 300) el('rect', { x: x - 1, y: GROUND - 6, width: 2, height: 8, fill: '#8a6440' }, r);
        }
      })();

      /* ---------- flight ---------- */
      function params() {
        if (st.phase === 'test' || st.phase === 'discover') { const t = TYPES[st.type]; return { kind: t.kind, wing: t.wing, s: t.s, gv: t.gv, v0: 180, clips: t.kind === 'ball' ? 0 : 1, color: t.color }; }
        const w = WINGS[st.wing]; let s = w.s, gv = w.gv;
        if (st.clips === 0) s *= 1.25; if (st.clips === 2) { s *= 1.6; gv *= 1.1; }
        return { kind: 'plane', wing: w.wing, s, gv: gv * (.8 + .25 * st.force), v0: 90 + 115 * st.force, clips: st.clips, color: '#3f7fb8' };
      }
      function fly() {
        if (st.flying) return; st.flying = true;
        const p = params();
        const btn = $('#flyBtn'); if (btn) btn.disabled = true;
        const trail = el('polyline', { fill: 'none', stroke: p.color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-dasharray': '1 6', opacity: .9 }, $('#plTrails'));
        let x = 0, h = GROUND - Y0, vx = p.v0, vy = -40, t = 0, last = null; const pts = [];
        const g = $('#plane');
        function frame(n) {
          if (!alive()) return;
          if (last === null) last = n; const dt = Math.min(.033, (n - last) / 1000); last = n; t += dt;
          if (p.kind === 'ball') { vy += 600 * dt; vx += (80 - vx) * dt * 1.5; }
          else { vx += (p.gv - vx) * dt * .6; vy += (p.s - vy) * dt * 2.2; }
          x += vx * dt; h -= vy * dt;
          let wob = 0, pitch = 0;
          if (p.kind !== 'ball' && p.clips === 0) { wob = Math.sin(t * 3.4) * 16 * Math.min(1, t); pitch = Math.cos(t * 3.4) * 22; }
          const sx = X0 + x, sy = GROUND - Math.max(0, h) - wob * (h > 20 ? 1 : h / 20);
          const ang = p.kind === 'ball' ? t * 240 : Math.atan2(vy, vx) * 180 / Math.PI * .8 - pitch;
          g.innerHTML = `<g transform="translate(${sx.toFixed(1)} ${(sy - (p.kind === 'ball' ? 10 : 4)).toFixed(1)}) rotate(${ang.toFixed(1)})">${planeSVG(p.kind === 'plane' ? 'wide' : p.kind, p.wing, p.clips)}</g>`;
          pts.push(sx.toFixed(1) + ',' + sy.toFixed(1)); trail.setAttribute('points', pts.join(' '));
          if (h > 0 && sx < RIGHT + 40) requestAnimationFrame(frame);
          else land(x, t, trail, p);
        }
        requestAnimationFrame(frame);
      }
      function marker(x, paws, secs, color, level) {
        const hgt = 30 + level * 34;
        const g = el('g', { transform: `translate(${Math.min(x, RIGHT - 42).toFixed(1)} ${GROUND})` }, $('#plMarks'));
        el('line', { x1: 0, y1: 2, x2: 0, y2: -hgt, stroke: '#7a5a3a', 'stroke-width': 1.6 }, g);
        el('rect', { x: -40, y: -hgt - 26, width: 80, height: 26, rx: 5, fill: '#fffdf6', stroke: color, 'stroke-width': 1.4 }, g);
        const u = el('use', { href: '#paw', x: -35, y: -hgt - 21, width: 15, height: 15 }, g); u.style.color = color;
        const tx = el('text', { x: 8, y: -hgt - 8, 'text-anchor': 'middle', 'font-size': 14, fill: '#3b3226', 'font-family': 'Jua, sans-serif' }, g);
        tx.textContent = `${paws} · ${secs}초`;
        return g;
      }
      function land(x, t, trail, p) {
        st.flying = false;
        const paws = Math.max(0, Math.round(x / PAW)), secs = Math.max(1, Math.round(t));
        if (st.phase === 'test') {
          const k = st.type, old = st.testItems[k]; if (old) old.forEach(e => e.remove());
          const m = marker(X0 + x, paws, secs, TYPES[k].color, k === 'dart' ? 1 : 0);
          st.testItems[k] = [trail, m]; st.results[k] = { paws, secs };
          const done = KEYS.every(q => st.results[q]);
          const extra = { ball: ' 날개가 없어서 바로 떨어졌어.', dart: ' 빠르게 날았지만 금방 내려왔어.', wide: ' 날개가 공기를 받쳐서 사뿐사뿐 오래 날았어!' }[k];
          say('owl', `<b>${josa(TYPES[k].name, '은', '는')}</b> <b>${secs}초</b> 동안 떠 있다가 <b>발자국 ${paws}개</b>만큼 날아갔어.${extra}` + (done ? ' 세 가지를 다 날려 봤네. <b>발견하기</b>를 눌러 봐!' : ''), k === 'wide');
        } else if (st.phase === 'play') {
          const m = marker(X0 + x, paws, secs, '#3f7fb8', 0);
          st.playItems.push([trail, m]); while (st.playItems.length > 3) st.playItems.shift().forEach(e => e.remove());
          st.playItems.slice(0, -1).forEach(a => a.forEach(e => e.setAttribute('opacity', .35)));
          st.flownClips[st.clips] = true;
          if (Math.abs(x - st.target) <= 32) {
            st.hits++; HH.stars($('#plFx'), X0 + x, GROUND - 10);
            say('owl', '<b>사뿐!</b> 돗자리에 딱 내려앉았어! 다음 돗자리도 맞혀 볼까?', true);
            setTimeout(() => { if (alive()) newTarget(); }, 900);
          } else say('squirrel', x < st.target ? '조금 모자라! 날개를 <b>크게</b> 하거나 힘을 <b>세게</b> 해 볼까?' : '너무 멀리 갔어! 날개를 <b>작게</b> 하거나 힘을 <b>약하게</b> 해 볼까?');
          if (st.clips === 0 && !st.saidWobble) { st.saidWobble = true; setTimeout(() => { if (alive()) say('owl', '방금 비행기가 <b>위아래로 출렁출렁</b> 흔들렸지? 앞쪽에 <b>클립</b>을 달아 보면 어떨까?'); }, 1300); }
          if (st.flownClips[0] && st.flownClips[1] && !HH.hasCard('plane-clip')) setTimeout(() => { if (alive()) clipCard(); }, 1500);
        }
        renderControls();
      }
      function newTarget() {
        st.target = (5 + Math.floor(Math.random() * 10)) * PAW;
        const g = $('#plTarget'), x = X0 + st.target;
        g.innerHTML = `<g transform="translate(${x} ${GROUND + 4})"><path d="M-34 0 L-26 -10 H26 L34 0 Z" fill="#e9c46a" stroke="#a67a1c" stroke-width=".8"/><path d="M-30 -5 H30 M-14 -10 L-18 0 M0 -10 V0 M14 -10 L18 0" stroke="#d4574a" stroke-width="1.2"/></g>`;
      }

      /* ---------- panels ---------- */
      function chartSVG() {
        const base = 130, maxP = 16, hMax = 100;
        let s = `<svg class="chart" viewBox="0 0 300 200" role="img" aria-label="비행기별 날아간 발자국 수와 떠 있던 시간"><use href="#paw" x="4" y="2" width="14" height="14" style="color:#8a7a5c"/><text x="22" y="13" class="ax">발자국 수</text>`;
        for (let k = 0; k <= 16; k += 4) { const y = base - k / maxP * hMax; s += `<line x1="34" x2="292" y1="${y}" y2="${y}" stroke="#d8ccb2" stroke-width="${k ? .7 : 1.2}"/><text x="28" y="${y + 4}" text-anchor="end" class="ax">${k}</text>`; }
        KEYS.forEach((k, i) => {
          const cx = 82 + i * 84, r = st.results[k], c = TYPES[k];
          if (!r) s += `<rect x="${cx - 24}" y="${base - 46}" width="48" height="46" rx="4" fill="none" stroke="#b8ab90" stroke-dasharray="4 4"/><text x="${cx}" y="${base - 16}" text-anchor="middle" class="q">?</text>`;
          else { const h = Math.max(2, Math.min(r.paws, maxP) / maxP * hMax); s += `<rect x="${cx - 24}" y="${(base - h).toFixed(1)}" width="48" height="${h.toFixed(1)}" rx="4" fill="${c.color}" fill-opacity=".85"/><text x="${cx}" y="${(base - h - 6).toFixed(1)}" text-anchor="middle" class="val">${r.paws}</text><text x="${cx}" y="${base + 52}" text-anchor="middle" class="ax">⏱ ${r.secs}초</text>`; }
          s += `<g transform="translate(${cx} ${base + 18}) scale(.7)">${planeSVG(c.kind, c.wing)}</g><text x="${cx}" y="${base + 38}" text-anchor="middle" class="nm" style="font-size:12px">${c.name}</text>`;
          if (st.pred === k) s += `<text x="${cx}" y="${base + 66}" text-anchor="middle" class="pred">★ 내 예상</text>`;
        });
        return s + '</svg>';
      }
      const clipIcon = n => n ? Array.from({ length: n }, () => '<svg viewBox="-10 -19 20 38" style="width:10px;height:20px" aria-hidden="true"><use href="#obj-clip" x="-10" y="-19" width="20" height="38"/></svg>').join('') : '<span style="font-size:13px">없음</span>';
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">어떤 모양으로 날릴까?</p><div class="angles">${KEYS.map(k => `<button type="button" class="ang ${st.type === k ? 'on' : ''}" data-type="${k}" style="--c:${TYPES[k].color}" aria-pressed="${st.type === k}" ${st.flying ? 'disabled' : ''}>${mini(k)}<span style="font-size:14px">${TYPES[k].name}</span>${st.results[k] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>던지는 힘은 똑같이</span><button type="button" class="throw" id="flyBtn" ${st.flying ? 'disabled' : ''}>날리기!</button></div>`;
          side.innerHTML = `<p class="lab">얼마나 날았을까?</p>${chartSVG()}${KEYS.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">날개 크기</p><div class="angles">${Object.keys(WINGS).map(k => `<button type="button" class="ang ${st.wing === k ? 'on' : ''}" data-wing="${k}" style="--c:#3f7fb8" aria-pressed="${st.wing === k}"><svg viewBox="-40 -24 80 40" aria-hidden="true">${planeSVG('wide', WINGS[k].wing, 0)}</svg><span>${WINGS[k].name}</span></button>`).join('')}</div>
            <p class="lab" style="margin-top:10px">앞쪽 클립</p><div class="angles">${[0, 1, 2].map(n => `<button type="button" class="ang ${st.clips === n ? 'on' : ''}" data-clips="${n}" style="--c:#3f7fb8;min-height:52px;align-content:center" aria-pressed="${st.clips === n}"><span style="display:flex;gap:2px;align-items:center;min-height:22px">${clipIcon(n)}</span><span>${n}개</span></button>`).join('')}</div>
            <label class="lab" for="forceR" style="margin-top:10px">던지는 힘</label><div class="slide"><span>약하게</span><input type="range" id="forceR" min="30" max="100" value="${Math.round(st.force * 100)}"><span>세게</span></div>
            <div class="row" style="margin-top:0;justify-content:flex-end"><button type="button" class="throw" id="flyBtn" ${st.flying ? 'disabled' : ''}>날리기!</button></div>`;
          side.innerHTML = `<p class="score" style="margin-top:0">돗자리 착륙 <b>${st.hits}</b>번</p><p style="margin:8px 0 0;font-size:14px;color:var(--ink-soft)">노란 돗자리 위에 비행기를 내려앉혀 봐요. 클립 0개와 1개를 모두 날려 보면 무언가 발견할 수 있어요.</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 무엇이 가장 오래 날지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">얼마나 날았을까?</p>${chartSVG()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="-40 -24 80 40" aria-hidden="true">${planeSVG('wide', 1.3)}</svg></div>
          <p class="eyebrow">하늘 정원 · 공기의 힘</p><h2>종이비행기 공방</h2>
          <p class="lead">똑같은 종이 한 장으로 모양을 다르게 접었어.<br>어떤 모양이 가장 오래 날까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '똑같은 종이 한 장으로 <b>종이 공</b>, <b>날씬한 다트</b>, <b>넓은 날개</b>를 만들었어. 같은 힘으로 던지면 <b>무엇이 가장 오래</b> 떠 있을까?')}
          ${HH.talk('squirrel', '뾰족한 다트가 제일 빠르니까 제일 오래 날 거야!')}
          <div class="picks">${KEYS.map(k => `<button type="button" class="pick" data-pick="${k}" style="--c:${TYPES[k].color}">${mini(k)}<span>${TYPES[k].name}</span></button>`).join('')}</div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('plane-wing');
        const msg = { wide: '예상이 딱 맞았어! <b>넓은 날개</b>가 가장 오래 떠 있었지.', dart: '도토리랑 같은 생각이었구나! 다트는 빨랐지만 <b>넓은 날개</b>가 더 오래 떠 있었어.', ball: '종이 공은 날개가 없어서 바로 떨어졌어. 가장 오래 난 건 <b>넓은 날개</b>였어.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          <div class="ov-chart">${chartSVG()}</div>
          ${HH.talk('owl', msg + ' 날개가 넓을수록 <b>공기가 비행기를 받쳐 주는 힘</b>이 커서 천천히 내려온단다.')}
          ${HH.talk('squirrel', '무게는 똑같은데 날개 모양만 달라도 이렇게 다르구나! 새가 날개를 넓게 펴는 것도 그래서구나.')}
          ${HH.dcard(1, art1(), '같은 종이라도 날개가 넓으면 공기가 받쳐 주어 오래 날아요.', '종이 공은 바로 떨어지고, 넓은 날개는 가장 오래 떠 있었어요.')}
          <button type="button" class="btn primary" data-act="play">돗자리 착륙 놀이 하기</button></div>`);
      }
      function clipCard() {
        HH.addCard('plane-clip');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '클립이 없으면 비행기가 <b>출렁출렁</b> 흔들렸지? 앞쪽에 클립을 하나 달면 무게가 앞으로 가서 <b>똑바로</b> 날아. 너무 많이 달면 고개를 숙이고 금방 떨어진단다.')}
          ${HH.dcard(2, art2(), '비행기 앞쪽에 클립을 달면 흔들리지 않고 똑바로 날아요.', '클립 0개는 출렁출렁, 1개는 똑바로, 2개는 빨리 내려왔어요.')}
          <button type="button" class="btn primary" data-act="close">계속 날리기</button></div>`);
      }
      function clearAll() { ['#plMarks', '#plTrails', '#plane', '#plTarget'].forEach(s => $(s).innerHTML = ''); st.testItems = {}; st.playItems = []; }
      function reset() { if (st.flying) return; fresh(); clearAll(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>종이비행기</b>를 날려 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'flyBtn') { fly(); return; }
        if (b.dataset.type && !st.flying) { st.type = b.dataset.type; renderControls(); return; }
        if (b.dataset.wing) { st.wing = b.dataset.wing; renderControls(); return; }
        if (b.dataset.clips) { st.clips = +b.dataset.clips; renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', `<b>${josa(TYPES[st.pred].name, '을', '를')}</b> 골랐구나! 세 가지를 모두 같은 힘으로 날려 보자. 모양을 고르고 <b>날리기!</b>를 눌러 봐.`, true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); clearAll(); setPhase('play'); newTarget(); say('owl', '이번엔 <b>돗자리 착륙</b> 놀이야! 날개 크기, 앞쪽 클립, 던지는 힘을 골라서 노란 돗자리에 내려앉혀 봐.', true); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('input', e => { if (e.target.id === 'forceR') st.force = +e.target.value / 100; });

      setPhase('intro');
      say('owl', '안녕! 오늘은 <b>종이비행기</b>를 날려 볼 거야.');
      intro();
    }
  });
})();
