/* 운동장 · 미끄럼틀 바닥 바꾸기 */
(function () {
  const { el, rng, josa } = HH;
  const BX = 330, GY = 440, L = 260, G = 500, PAW = 50, RIGHT = 975;
  const SURF = {
    ice: { name: '얼음', mu: .25, fill: '#d3ecf7', line: '#ffffff', edge: '#7fb4d6' },
    wood: { name: '나무', mu: .40, fill: '#c99c66', line: '#8f6438', edge: '#6e4a2b' },
    sand: { name: '모래', mu: .60, fill: '#e3ca92', line: '#b89a62', edge: '#a8875a' }
  };
  const SK = ['ice', 'wood', 'sand'];
  const ANG = { 25: '완만하게', 35: '보통', 45: '가파르게' };

  function pattern(k, x, y, w, h) {
    const s = SURF[k]; let p = '';
    if (k === 'ice') for (let i = 8; i < w; i += 26) p += `<path d="M${x + i} ${y + 2} l10 ${h - 4}" stroke="#fff" stroke-width="1.4" opacity=".9"/>`;
    else if (k === 'wood') for (let i = 30; i < w; i += 40) p += `<path d="M${x + i} ${y} V${y + h}" stroke="${s.line}" stroke-width=".7"/>`;
    else for (let i = 4; i < w; i += 7) p += `<circle cx="${x + i}" cy="${y + 2 + (i * 7 % (h - 3))}" r=".9" fill="${s.line}"/>`;
    return p;
  }
  function rider() {
    return `<rect x="-24" y="-7" width="48" height="7" rx="3" fill="#d4574a" stroke="#7d2b23" stroke-width=".8"/><path d="M-24 -3 q-6 0 -6 -6" fill="none" stroke="#7d2b23" stroke-width="1.6"/>
      <use href="#rabbit" x="-26" y="-55" width="50" height="50"/>`;
  }
  function slideMini(k, ang) {
    const t = (ang || 35) * Math.PI / 180, bx = 70, gy = 80, l = 70, tx = bx - l * Math.cos(t), ty = gy - l * Math.sin(t), s = SURF[k];
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#dcebef"/><rect y="${gy}" width="160" height="20" fill="#a9c98a"/>
      <path d="M${tx.toFixed(1)} ${ty.toFixed(1)} L${bx} ${gy} H150 V${gy + 6} H${bx - 2} L${(tx - 2).toFixed(1)} ${(ty + 6).toFixed(1)} Z" fill="${s.fill}" stroke="${s.edge}" stroke-width="1"/>
      <path d="M${(tx - 10).toFixed(1)} ${(ty).toFixed(1)} V${gy} M${(tx + 2).toFixed(1)} ${ty.toFixed(1)} V${gy}" stroke="#7d8a92" stroke-width="2"/></svg>`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/>
      ${SK.map((k, i) => { const y = 24 + i * 24, d = [110, 50, 12][i]; return `<rect x="10" y="${y}" width="140" height="10" rx="2" fill="${SURF[k].fill}" stroke="${SURF[k].edge}" stroke-width=".8"/><g transform="translate(${16 + d} ${y}) scale(.4)">${rider()}</g><text x="8" y="${y - 3}" font-size="8" fill="#3b3226">${SURF[k].name}</text>`; }).join('')}</svg>`;
  }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><rect y="80" width="160" height="16" fill="#a9c98a"/>
      <path d="M20 60 L60 80" stroke="#7fb4d6" stroke-width="5"/><path d="M20 22 L60 80" stroke="#2b8fc4" stroke-width="5"/>
      <path d="M64 86 H90" stroke="#7fb4d6" stroke-width="2" stroke-dasharray="2 3"/><path d="M64 90 H150" stroke="#2b8fc4" stroke-width="2.4" stroke-dasharray="2 3"/>
      <text x="96" y="76" font-size="9" fill="#3b3226">가파르면 더 멀리</text></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="놀이터 미끄럼틀에서 토끼가 썰매를 타고 내려와 미끄러지는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="860" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#fff" stroke="#c8dae6" stroke-width=".8"><path d="M520 90 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/></g>
    <path d="M0 300 C140 270 260 286 380 290 C520 294 640 262 780 270 C880 276 950 262 1000 266 L1000 360 L0 360 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="slTrees"></g>
    <rect y="340" width="1000" height="220" fill="url(#sandE)"/><g id="slSpeck"></g>
    <g id="slRuler"></g>
    <g id="slTarget"></g>
    <g id="slStruct"></g>
    <g id="slMarks"></g>
    <g id="slRider"></g>
    <g id="slFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>바닥이 매끄러우면 잘 미끄러지고, 거칠면 빨리 멈춥니다(마찰). 같은 바닥이라도 미끄럼틀이 가파를수록 더 빨리 내려와 더 멀리 미끄러집니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 얼음, 나무, 모래 미끄럼틀 중 어디에서 가장 멀리 미끄러져 나갈까? 도토리는 “까끌까끌한 모래가 더 잘 밀어 준다”고 말합니다.</li><li>실험: 같은 기울기에서 바닥만 바꿔 토끼 썰매를 내려보내고, 내려온 뒤 미끄러진 거리를 발자국으로 잽니다.</li><li>발견: 바닥의 매끄러움과 미끄러진 거리를 비교합니다.</li><li>놀이: 바닥과 기울기를 골라 꽃 매트 위에 멈추게 합니다. 완만한 모래 미끄럼틀에서는 아예 내려오지 못하는 것도 발견합니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>겨울에 빙판길이 위험한 까닭은?</li><li>운동화 바닥은 왜 울퉁불퉁할까?</li><li>미끄럼틀을 더 빨리 내려오고 싶으면 어떻게 할까?</li></ul></div>
    <div><h3>교과 연계</h3><p>1~2학년 통합교과 놀이 활동, 고학년 과학의 마찰력 맛보기. 실제 실험에서는 같은 장난감 차를 경사판 위에 수건, 종이, 비닐을 깔고 굴려 볼 수 있습니다.</p></div>
    <div><h3>참고</h3><p>화면은 차이가 잘 보이도록 미끄러지는 정도를 단순하게 정했습니다. 실제 얼음은 이보다 훨씬 더 미끄럽습니다.</p></div>`;

  HH.register({
    id: 'slide',
    cards: [
      { id: 'slide-surface', no: 1, text: '바닥이 매끄러울수록 잘 미끄러지고, 거칠수록 빨리 멈춰요.', art: art1 },
      { id: 'slide-angle', no: 2, text: '미끄럼틀이 가파를수록 더 빨리, 더 멀리 미끄러져요.', art: art2 }
    ],
    thumb() { return slideMini('ice').replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'slide', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#paw"/></svg>미끄럼틀 끝에서부터 미끄러져 나간 거리를 발자국으로 재요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;
      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, surf: 'ice', ang: 35, results: {}, moving: false, target: null, hits: 0, angTried: {} }); }
      fresh();

      (function () {
        const R = rng(19);
        const t = $('#slTrees'); [40, 110, 520, 600, 700, 900, 970].forEach(x => HH.tree(t, x, 338, .7 + R() * .4));
        const sp = $('#slSpeck'); for (let i = 0; i < 260; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (344 + R() * 212).toFixed(1), r: (.5 + R() * 1.2).toFixed(2), fill: '#a98f62', 'fill-opacity': (.2 + R() * .4).toFixed(2) }, sp);
        const r = $('#slRuler');
        for (let k = 0; BX + k * PAW <= RIGHT; k++) { const x = BX + k * PAW; el('path', { d: `M${x} ${GY + 12} v8`, stroke: '#fffaf0', 'stroke-width': 2 }, r); const tx = el('text', { x, y: GY + 36, 'text-anchor': 'middle', 'font-size': 14, fill: '#fffdf6', stroke: '#a88f60', 'stroke-width': 2.4, 'paint-order': 'stroke' }, r); tx.textContent = k; }
      })();

      const rad = () => st.ang * Math.PI / 180;
      const top = () => ({ x: BX - L * Math.cos(rad()), y: GY - L * Math.sin(rad()) });
      function step(c, v, dt) { const phi = c.ang; return Math.max(0, v + G * (Math.sin(phi) - c.mu * Math.cos(phi)) * dt); }
      function drawStruct() {
        const t = top(), s = SURF[st.surf], P = curve(st.ang);
        let g = `<rect x="${t.x - 54}" y="${t.y}" width="58" height="8" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".8"/>
          <path d="M${t.x - 50} ${t.y + 8} V${GY + 6} M${t.x - 6} ${t.y + 8} V${GY + 6}" stroke="#7d8a92" stroke-width="4"/>`;
        for (let y = t.y + 26; y < GY; y += 22) g += `<path d="M${t.x - 50} ${y} H${t.x - 6}" stroke="#7d8a92" stroke-width="2.4"/>`;
        g += `<path d="M${t.x - 50} ${t.y} V${t.y - 34} M${t.x - 6} ${t.y} V${t.y - 34} M${t.x - 50} ${t.y - 34} H${t.x - 6}" stroke="#d4574a" stroke-width="3" fill="none"/>`;
        // support posts from the curved chute to the ground
        [.38, .7].forEach(k => { const p = P.pts[Math.floor(k * (P.pts.length - 1))]; g += `<path d="M${p.x.toFixed(1)} ${(p.y + 6).toFixed(1)} V${GY + 6}" stroke="#7d8a92" stroke-width="3"/>`; });
        // smooth chute: a curve that leaves the platform along the slope and flattens into the floor run-out
        g += `<path d="${P.d} H${RIGHT + 20}" fill="none" stroke="${s.edge}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 5)"/>`;
        g += `<path d="${P.d} H${RIGHT + 20}" fill="none" stroke="${s.fill}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 5)"/>`;
        g += pattern(st.surf, BX, GY + 1, RIGHT + 20 - BX, 8);
        P.pts.forEach((p, i) => { if (i % 5 || i === 0) return; g += st.surf === 'ice' ? `<path d="M${p.x.toFixed(1)} ${(p.y + 2).toFixed(1)} l3 6" stroke="#fff" stroke-width="1.4"/>` : st.surf === 'wood' ? `<path d="M${p.x.toFixed(1)} ${(p.y).toFixed(1)} v9" stroke="${s.line}" stroke-width=".7" transform="rotate(${(p.ang * 180 / Math.PI).toFixed(1)} ${p.x.toFixed(1)} ${(p.y + 5).toFixed(1)})"/>` : `<circle cx="${(p.x + 2).toFixed(1)}" cy="${(p.y + 5).toFixed(1)}" r="1" fill="${s.line}"/>`; });
        g += `<path d="${P.d}" fill="none" stroke="#d4574a" stroke-width="3" stroke-linecap="round" transform="translate(0 -6)"/>`;
        $('#slStruct').innerHTML = g;
      }
      /* the chute: a cubic curve from the platform (leaving at the chosen angle) into the flat floor */
      const curveCache = {};
      function curve(ang) {
        if (curveCache[ang]) return curveCache[ang];
        const th = ang * Math.PI / 180, t = { x: BX - L * Math.cos(th), y: GY - L * Math.sin(th) };
        const p1 = { x: t.x + Math.cos(th) * L * .55, y: t.y + Math.sin(th) * L * .55 }, p2 = { x: BX - L * .3, y: GY }, p3 = { x: BX, y: GY };
        const pts = []; let len = 0, prev = null;
        for (let i = 0; i <= 80; i++) {
          const u = i / 80, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3;
          const p = { x: a * t.x + b * p1.x + c * p2.x + d * p3.x, y: a * t.y + b * p1.y + c * p2.y + d * p3.y };
          if (prev) { len += Math.hypot(p.x - prev.x, p.y - prev.y); p.ang = Math.atan2(p.y - prev.y, p.x - prev.x); } else p.ang = th;
          p.s = len; pts.push(p); prev = p;
        }
        pts[0].ang = pts[1].ang;
        return (curveCache[ang] = { pts, len, d: `M${t.x.toFixed(1)} ${t.y.toFixed(1)} C${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} ${p3.x} ${p3.y}` });
      }
      function at(P, s) { let i = 1; while (i < P.pts.length - 1 && P.pts[i].s < s) i++; const a = P.pts[i - 1], b = P.pts[i], k = Math.max(0, Math.min(1, (s - a.s) / ((b.s - a.s) || 1))); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ang: b.ang }; }
      /* where the rider ends up: run-out distance on the floor, or −1 if it gets stuck on the chute */
      function simulate(k, ang) {
        const P = curve(ang), mu = SURF[k].mu; let s = 16, v = 30, x = 0; const dt = 1 / 240;
        for (let n = 0; n < 240 * 20; n++) {
          if (s < P.len) { const p = at(P, s); v = step({ ang: p.ang, mu }, v, dt); s += v * dt; if (v === 0) return -1; }
          else { v = Math.max(0, v - mu * G * dt); x = s - P.len; s += v * dt; if (v === 0) return x; }
        }
        return x;
      }
      function placeRider(x, y, rot) { $('#slRider').innerHTML = `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">${rider()}</g>`; }
      function idle() { const p = at(curve(st.ang), 16); placeRider(p.x, p.y, p.ang * 180 / Math.PI); }

      function go() {
        if (st.moving) return; st.moving = true; renderControls(); $('#slMarks').innerHTML = st.phase === 'test' ? $('#slMarks').innerHTML : '';
        const mu = SURF[st.surf].mu, P = curve(st.ang);
        let s = 16, v = 30, last = null;
        (function f(n) {
          if (!alive()) return;
          if (last === null) last = n; let dt = Math.min(.033, (n - last) / 1000); last = n;
          // small sub-steps keep the ride smooth on the curve
          for (let i = 0; i < 4; i++) {
            const h = dt / 4;
            if (s < P.len) { const p = at(P, s); v = step({ ang: p.ang, mu }, v, h); s += v * h; if (v === 0) { placeRider(p.x, p.y, p.ang * 180 / Math.PI); return stopped(-1); } }
            else { v = Math.max(0, v - mu * G * h); s += v * h; if (v === 0) { placeRider(BX + (s - P.len), GY, 0); return stopped(s - P.len); } }
          }
          if (s < P.len) { const p = at(P, s); placeRider(p.x, p.y, p.ang * 180 / Math.PI); } else placeRider(BX + (s - P.len), GY, 0);
          requestAnimationFrame(f);
        })(performance.now());
      }
      function marker(x, paws, color) {
        const g = el('g', { transform: `translate(${(BX + x).toFixed(1)} ${GY})` }, $('#slMarks'));
        el('line', { x1: 0, y1: 0, x2: 0, y2: -70, stroke: '#7a5a3a', 'stroke-width': 1.6 }, g);
        el('rect', { x: -26, y: -94, width: 52, height: 24, rx: 5, fill: '#fffdf6', stroke: color, 'stroke-width': 1.4 }, g);
        const u = el('use', { href: '#paw', x: -21, y: -90, width: 15, height: 15 }, g); u.style.color = color;
        const tx = el('text', { x: 7, y: -76, 'text-anchor': 'middle', 'font-size': 15, fill: '#3b3226', 'font-family': 'Jua, sans-serif' }, g); tx.textContent = paws;
      }
      function stopped(x) {
        st.moving = false;
        const stuck = x < 0, paws = stuck ? 0 : Math.round(x / PAW);
        if (st.phase === 'test') {
          st.results[st.surf] = paws; if (!stuck) marker(x, paws, SURF[st.surf].edge);
          const done = SK.every(k => st.results[k] != null);
          const extra = { ice: ' 쌩~ 하고 멀리 미끄러져 나갔어!', wood: '', sand: ' 까끌까끌해서 금방 멈췄어.' }[st.surf];
          say('owl', `<b>${SURF[st.surf].name}</b> 미끄럼틀에서는 <b>발자국 ${paws}개</b>만큼 미끄러져 나갔어.${extra}` + (done ? ' 세 가지를 다 타 봤네. <b>발견하기</b>를 눌러 봐!' : ''), st.surf === 'ice');
        } else if (st.phase === 'play') {
          st.angTried[st.ang] = true;
          if (stuck) say('squirrel', `어? 토끼가 <b>${SURF[st.surf].name}</b> 미끄럼틀 중간에서 <b>꼼짝 안 해</b>! 너무 완만하고 거칠어서 그래.`);
          else {
            marker(x, paws, '#3f7fb8');
            if (Math.abs(x - st.target) <= 28) { st.hits++; HH.stars($('#slFx'), BX + x, GY - 30); say('owl', '<b>딱!</b> 꽃 매트 위에 멈췄어! 다음 매트도 맞혀 볼까?', true); setTimeout(() => { if (alive()) { newTarget(); $('#slMarks').innerHTML = ''; idle(); } }, 1200); }
            else say('squirrel', x < st.target ? '조금 모자라! 더 <b>매끄러운 바닥</b>이나 더 <b>가파른</b> 미끄럼틀은 어때?' : '너무 멀리 갔어! 더 <b>거친 바닥</b>이나 <b>완만한</b> 미끄럼틀은 어때?');
          }
          if (Object.keys(st.angTried).length >= 3 && !HH.hasCard('slide-angle')) setTimeout(() => { if (alive()) angleCard(); }, 1300);
        }
        renderControls();
      }
      function newTarget() {
        // only targets some surface + angle can actually reach
        const ok = [];
        SK.forEach(k => [25, 35, 45].forEach(a => { const d = simulate(k, a); if (d > 30 && d < RIGHT - BX - 30) ok.push(d); }));
        st.target = ok[Math.floor(Math.random() * ok.length)];
        const x = BX + st.target;
        $('#slTarget').innerHTML = `<g transform="translate(${x} ${GY + 2})"><ellipse rx="30" ry="7" fill="#f3b6c6" stroke="#c4778c" stroke-width=".9"/>${[-16, -6, 6, 16].map(d => `<circle cx="${d}" cy="${d % 2 ? -1 : 1}" r="2.6" fill="#fff" stroke="#e08aa0" stroke-width=".5"/>`).join('')}</g>`;
      }

      function resultChart() {
        const base = 120, max = 10, hMax = 92;
        let s = `<svg class="chart" viewBox="0 0 300 180" role="img" aria-label="바닥별 미끄러진 발자국 수"><use href="#paw" x="4" y="2" width="14" height="14" style="color:#8a7a5c"/><text x="22" y="13" class="ax">미끄러진 발자국</text>`;
        for (let k = 0; k <= 10; k += 5) { const y = base - k / max * hMax; s += `<line x1="34" x2="292" y1="${y}" y2="${y}" stroke="#d8ccb2" stroke-width="${k ? .7 : 1.2}"/><text x="28" y="${y + 4}" text-anchor="end" class="ax">${k}</text>`; }
        SK.forEach((k, i) => {
          const cx = 82 + i * 84, r = st.results[k];
          s += r == null ? `<rect x="${cx - 24}" y="${base - 40}" width="48" height="40" rx="4" fill="none" stroke="#b8ab90" stroke-dasharray="4 4"/><text x="${cx}" y="${base - 14}" text-anchor="middle" class="q">?</text>`
            : `<rect x="${cx - 24}" y="${(base - Math.max(2, r / max * hMax)).toFixed(1)}" width="48" height="${Math.max(2, r / max * hMax).toFixed(1)}" rx="4" fill="${SURF[k].fill}" stroke="${SURF[k].edge}"/><text x="${cx}" y="${(base - Math.max(2, r / max * hMax) - 6).toFixed(1)}" text-anchor="middle" class="val">${r}</text>`;
          s += `<rect x="${cx - 24}" y="${base + 10}" width="48" height="12" rx="3" fill="${SURF[k].fill}" stroke="${SURF[k].edge}"/><text x="${cx}" y="${base + 40}" text-anchor="middle" class="nm">${SURF[k].name}</text>`;
          if (st.pred === k) s += `<text x="${cx}" y="${base + 56}" text-anchor="middle" class="pred">★ 내 예상</text>`;
        });
        return s + '</svg>';
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        const surfBtns = SK.map(k => `<button type="button" class="ang ${st.surf === k ? 'on' : ''}" data-surf="${k}" style="--c:${SURF[k].edge}" ${st.moving ? 'disabled' : ''} aria-pressed="${st.surf === k}">${slideMini(k, st.ang)}<span>${SURF[k].name}</span>${st.phase === 'test' && st.results[k] != null ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">미끄럼틀 바닥을 골라 봐</p><div class="angles">${surfBtns}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>기울기는 똑같이</span><button type="button" class="throw" id="goBtn" ${st.moving ? 'disabled' : ''}>출발!</button></div>`;
          side.innerHTML = `<p class="lab">얼마나 미끄러졌을까?</p>${resultChart()}${SK.every(k => st.results[k] != null) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">바닥</p><div class="angles">${surfBtns}</div>
            <p class="lab" style="margin-top:10px">기울기</p><div class="angles">${[25, 35, 45].map(a => `<button type="button" class="ang ${st.ang === a ? 'on' : ''}" data-angle="${a}" style="--c:#3f7fb8" ${st.moving ? 'disabled' : ''} aria-pressed="${st.ang === a}"><svg viewBox="0 0 60 40" style="max-width:60px" aria-hidden="true"><path d="M6 ${(34 - 40 * Math.tan(a * Math.PI / 180) * .7).toFixed(1)} L46 34 H56" fill="none" stroke="#3f7fb8" stroke-width="3" stroke-linejoin="round"/></svg><span>${ANG[a]}</span></button>`).join('')}</div>
            <div class="row"><span></span><button type="button" class="throw" id="goBtn" ${st.moving ? 'disabled' : ''}>출발!</button></div>`;
          side.innerHTML = `<p class="score" style="margin-top:0">꽃 매트 맞히기 <b>${st.hits}</b>번</p><p style="margin:8px 0 0;font-size:14px;color:var(--ink-soft)">바닥과 기울기를 바꿔서 토끼를 분홍 꽃 매트 위에 멈추게 해 봐요. 세 가지 기울기를 모두 타 보면 발견이 있어요.</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 어떤 바닥에서 가장 멀리 갈지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">얼마나 미끄러졌을까?</p>${resultChart()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); drawStruct(); idle(); renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center"><div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 100" aria-hidden="true">${slideMini('ice').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">운동장 · 힘과 움직임</p><h2>미끄럼틀 바닥 바꾸기</h2>
          <p class="lead">미끄럼틀 바닥이 얼음, 나무, 모래라면<br>어디에서 가장 멀리 미끄러질까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card">${HH.talk('owl', '기울기는 똑같고 <b>바닥만</b> 달라. 토끼 썰매가 어느 미끄럼틀에서 <b>가장 멀리</b> 미끄러져 나갈까?')}
          ${HH.talk('squirrel', '까끌까끌한 모래가 썰매를 더 잘 밀어 줄 거야!')}
          <div class="picks">${SK.map(k => `<button type="button" class="pick" data-pick="${k}" style="--c:${SURF[k].edge}">${slideMini(k)}<span>${SURF[k].name}</span></button>`).join('')}</div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('slide-surface');
        const msg = { ice: '예상이 딱 맞았어! 매끄러운 <b>얼음</b>에서 가장 멀리 갔지.', sand: '도토리랑 같은 생각이었구나! 그런데 모래는 썰매를 <b>붙잡아서</b> 금방 멈췄어.', wood: '나무도 잘 미끄러졌지만, <b>얼음</b>이 가장 멀리 갔어.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2><div class="ov-chart">${resultChart()}</div>
          ${HH.talk('owl', msg + ' 바닥이 거칠수록 썰매를 <b>붙잡는 힘</b>이 커서 빨리 멈춘단다. 이 힘을 <b>마찰</b>이라고 해.')}
          ${HH.talk('squirrel', '그래서 겨울 빙판길에서 쭉 미끄러지는구나!')}
          ${HH.dcard(1, art1(), '바닥이 매끄러울수록 잘 미끄러지고, 거칠수록 빨리 멈춰요.', '얼음은 가장 멀리, 모래는 가장 짧게 미끄러졌어요.')}
          <button type="button" class="btn primary" data-act="play">꽃 매트 멈추기 놀이 하기</button></div>`);
      }
      function angleCard() {
        HH.addCard('slide-angle');
        ui.show(`<div class="ov-card">${HH.talk('owl', '미끄럼틀이 <b>가파를수록</b> 내려오면서 더 빨라져서 더 멀리 미끄러져. 너무 완만하면 거친 바닥에서는 아예 못 내려오기도 해.')}
          ${HH.dcard(2, art2(), '미끄럼틀이 가파를수록 더 빨리, 더 멀리 미끄러져요.', '완만한 모래 미끄럼틀에서는 꼼짝 못 하기도 해요.')}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }
      function reset() { if (st.moving) return; fresh(); ui.hide(); $('#slMarks').innerHTML = ''; $('#slTarget').innerHTML = ''; setPhase('intro'); say('owl', '안녕! 오늘은 <b>미끄럼틀</b> 바닥을 바꿔 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'goBtn') { go(); return; }
        if (b.dataset.surf && !st.moving) { st.surf = b.dataset.surf; drawStruct(); idle(); renderControls(); return; }
        if (b.dataset.angle && !st.moving) { st.ang = +b.dataset.angle; drawStruct(); idle(); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '바닥을 하나씩 바꿔 가며 토끼 썰매를 내려보내 보자. 바닥을 고르고 <b>출발!</b>을 눌러 봐.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); $('#slMarks').innerHTML = ''; setPhase('play'); newTarget(); say('owl', '이번엔 토끼를 <b>분홍 꽃 매트</b> 위에 멈추게 해 봐! 바닥과 기울기를 바꿀 수 있어.', true); }
        else if (act === 'close') ui.hide();
      });

      setPhase('intro'); say('owl', '안녕! 오늘은 <b>미끄럼틀</b> 바닥을 바꿔 볼 거야.'); intro();
    }
  });
})();
