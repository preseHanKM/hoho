/* 하늘 정원 · 풍선 로켓 */
(function () {
  const { el, rng, josa } = HH;
  const SY = 200, SL = 80, SR = 940, PAW = 50, THR = 600, DRAG = 1.2, FRIC = 160;
  const TESTS = { left: { name: '입구가 왼쪽', dir: -1, color: '#2f8f86' }, right: { name: '입구가 오른쪽', dir: 1, color: '#d9822b' }, down: { name: '입구가 아래쪽', dir: 0, color: '#7c62ad' } };
  const TK = ['left', 'right', 'down'];
  const COLORS = ['#e0453a', '#3fa9d4', '#e8b80f', '#5aa64a', '#8a5bbf'];

  /* how far a balloon with n pumps travels along the string (same steps as the animation) */
  function simulate(n) {
    let v = 0, x = 0, t = 0; const dt = 1 / 120, T = n * .3;
    while (t < 6) { if (t < T) v += (THR - DRAG * v) * dt; else v = Math.max(0, v - (FRIC + DRAG * v) * dt); x += v * dt; t += dt; if (t > T && v === 0) break; }
    return x;
  }
  /* balloon on its straw; nozzle points left (-1), right (1) or down (0) */
  function balloonSVG(size, noz, color) {
    const rx = 18 + size * 6, ry = 14 + size * 4.5, c = color || '#e0453a';
    const rot = noz === 1 ? 0 : noz === -1 ? 180 : 90;
    return `<rect x="-24" y="-5" width="48" height="8" rx="4" fill="#f3f0e6" stroke="#a89f8e" stroke-width=".8"/>
      <path d="M-14 0 V12 M14 0 V12" stroke="#d9cfb8" stroke-width="5" opacity=".9"/>
      <g transform="translate(0 ${12 + ry}) rotate(${rot})">
        <ellipse cx="0" cy="0" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${c}" stroke="#5a2a20" stroke-width=".9" opacity=".95"/>
        <ellipse cx="${(-rx * .3).toFixed(1)}" cy="${(-ry * .4).toFixed(1)}" rx="${(rx * .25).toFixed(1)}" ry="${(ry * .2).toFixed(1)}" fill="#fff" opacity=".45"/>
        <path d="M${(rx - 1).toFixed(1)} -4 L${(rx + 8).toFixed(1)} -6 L${(rx + 8).toFixed(1)} 6 L${(rx - 1).toFixed(1)} 4 Z" fill="${c}" stroke="#5a2a20" stroke-width=".8"/>
      </g>`;
  }
  function mini(noz, n) {
    const arrow = noz === 0 ? '' : `<path d="M${80 - noz * 46} 70 H${80 - noz * 66}" stroke="#7fa3b2" stroke-width="2" stroke-dasharray="3 3"/>`;
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#dcebef"/><path d="M6 30 H154" stroke="#7a6a52" stroke-width="1.2"/>
      <g transform="translate(80 30) scale(.8)">${balloonSVG(n || 2, noz, '#e0453a')}</g>${noz === 0 ? '<path d="M80 86 v10" stroke="#7fa3b2" stroke-width="2" stroke-dasharray="3 3"/>' : ''}</svg>`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><path d="M6 26 H154" stroke="#7a6a52" stroke-width="1.2"/>
      <g transform="translate(96 26) scale(.7)">${balloonSVG(2, -1, '#e0453a')}</g>
      <path d="M58 58 q-8 -4 -16 0 q-8 4 -16 0" fill="none" stroke="#7fa3b2" stroke-width="2"/><text x="40" y="76" text-anchor="middle" font-size="8.5" fill="#3b3226">공기는 왼쪽</text>
      <path d="M118 52 H148" stroke="#c45f33" stroke-width="2.4"/><path d="M142 46 L150 52 L142 58" fill="none" stroke="#c45f33" stroke-width="2.4"/><text x="132" y="76" text-anchor="middle" font-size="8.5" fill="#c45f33">풍선은 오른쪽</text></svg>`;
  }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><path d="M6 20 H154 M6 60 H154" stroke="#7a6a52" stroke-width="1"/>
      <g transform="translate(30 20) scale(.45)">${balloonSVG(1, -1, '#3fa9d4')}</g><path d="M46 40 H70" stroke="#3fa9d4" stroke-width="2" stroke-dasharray="2 3"/>
      <g transform="translate(30 60) scale(.45)">${balloonSVG(5, -1, '#e0453a')}</g><path d="M50 82 H150" stroke="#e0453a" stroke-width="2.4" stroke-dasharray="2 3"/></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="하늘 정원에서 줄에 매단 빨대와 풍선으로 풍선 로켓을 날리는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="140" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#fff" stroke="#c8dae6" stroke-width=".8"><path d="M560 90 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/></g>
    <path d="M0 330 C140 300 260 316 380 320 C520 324 640 292 780 300 C880 306 950 292 1000 296 L1000 400 L0 400 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <rect y="390" width="1000" height="170" fill="#a9c98a"/><g id="rkFlowers"></g>
    <g id="rkTrees"></g>
    <!-- string between a tree and a pole -->
    <g transform="translate(50 400)"><rect x="-8" y="-230" width="16" height="230" fill="url(#barkG)" stroke="#4e3420" stroke-width=".8"/>${[[-20, -246, 30], [16, -252, 32], [0, -280, 34], [-10, -264, 26]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#treeG)" stroke="#557d40" stroke-width=".6"/>`).join('')}</g>
    <path d="M950 400 V${SY - 20}" stroke="#7d8a92" stroke-width="6"/><circle cx="950" cy="${SY - 22}" r="6" fill="#d9a23a"/>
    <path d="M${SL - 20} ${SY} H950" stroke="#7a6a52" stroke-width="1.4"/>
    <g id="rkRuler"></g>
    <g id="rkTarget"></g>
    <g id="rkMarks"></g>
    <g id="rkPuffs"></g>
    <g id="rkBalloon"></g>
    <g id="rkFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>풍선 입구로 공기가 한쪽으로 빠져나가면 풍선은 반대쪽으로 밀려 나갑니다(작용과 반작용). 바람을 많이 넣을수록 공기가 오래, 세게 나가서 더 멀리 날아갑니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 입구가 왼쪽을 보면 풍선은 어느 쪽으로 갈까? 도토리는 “바람이 나가는 쪽으로 따라간다”고 말합니다.</li><li>실험: 바람 양은 같게 하고 입구 방향만 왼쪽, 오른쪽, 아래쪽으로 바꿔 봅니다.</li><li>발견: 공기가 나가는 방향과 풍선이 가는 방향을 비교합니다.</li><li>놀이: 풍선에 바람을 1~5번 넣어 줄 위의 깃발까지 보냅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>입구가 아래쪽일 때는 왜 옆으로 가지 않았을까?</li><li>로켓은 왜 불꽃을 아래로 뿜을까?</li><li>수영할 때 물을 뒤로 밀면 몸은 어디로 갈까?</li></ul></div>
    <div><h3>교과 연계</h3><p>1~2학년 통합교과 놀이 활동, 고학년 과학의 힘과 운동 맛보기. 실제로는 실, 빨대, 테이프, 풍선만 있으면 교실에서 바로 해 볼 수 있습니다.</p></div>`;

  HH.register({
    id: 'rocket',
    cards: [
      { id: 'rocket-dir', no: 1, text: '풍선은 공기가 나가는 쪽과 반대쪽으로 날아가요.', art: art1 },
      { id: 'rocket-air', no: 2, text: '바람을 많이 넣을수록 풍선 로켓이 더 멀리 날아가요.', art: art2 }
    ],
    thumb() { return mini(-1, 3).replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'rocket', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#paw"/></svg>줄 아래 숫자는 출발한 곳에서부터의 발자국 수예요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;
      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, test: 'left', pumps: 3, results: {}, flying: false, target: null, hits: 0, tried: {} }); }
      fresh();

      (function () {
        const R = rng(59);
        const f = $('#rkFlowers'); for (let i = 0; i < 160; i++) { const x = R() * 1000, y = 396 + R() * 160; el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)} l${(R() * 2 - 1).toFixed(1)} -${(3 + R() * 4).toFixed(1)}`, stroke: '#7aa25e', 'stroke-width': .8 }, f); if (R() < .3) el('circle', { cx: x.toFixed(1), cy: (y - 6).toFixed(1), r: 1.8, fill: ['#f2c230', '#f3b6c6', '#fffaf0'][Math.floor(R() * 3)] }, f); }
        const t = $('#rkTrees'); [380, 460, 720, 820].forEach(x => HH.tree(t, x, 396, .7 + R() * .3));
      })();
      const startX = () => st.phase === 'play' ? 130 : 510;
      function ruler() {
        const g = $('#rkRuler'), x0 = startX(); let s = '';
        for (let k = -9; k <= 17; k++) { const x = x0 + k * PAW; if (x < SL || x > SR) continue; s += `<path d="M${x} ${SY + 2} v${k % 2 ? 4 : 8}" stroke="#7a6a52" stroke-width="1"/>`; if (k % 2 === 0) s += `<text x="${x}" y="${SY + 22}" text-anchor="middle" font-size="12" fill="#5e4428">${Math.abs(k)}</text>`; }
        s += `<path d="M${x0} ${SY - 34} V${SY + 30}" stroke="#d9822b" stroke-width="1.4" stroke-dasharray="3 3"/><text x="${x0}" y="${SY - 40}" text-anchor="middle" font-size="12" font-family="Jua, sans-serif" fill="#d9822b">출발</text>`;
        g.innerHTML = s;
      }
      function nozzle() { return st.phase === 'play' ? -1 : TESTS[st.test].dir; }
      function color() { return st.phase === 'play' ? COLORS[st.pumps - 1] : '#e0453a'; }
      function place(x, size, lift) { $('#rkBalloon').innerHTML = `<g transform="translate(${x.toFixed(1)} ${(SY - 1 - (lift || 0)).toFixed(1)})">${balloonSVG(size, nozzle(), color())}</g>`; }
      function idle() { ruler(); place(startX(), st.phase === 'play' ? st.pumps : 3); }

      function launch() {
        if (st.flying) return; st.flying = true; renderControls();
        const n = st.phase === 'play' ? st.pumps : 3, noz = nozzle(), dir = -noz, T = n * .3, x0 = startX();
        let v = 0, x = 0, t = 0, last = null, puffT = 0;
        const puffs = $('#rkPuffs'); puffs.innerHTML = '';
        (function f(now) {
          if (!alive()) return;
          if (last === null) last = now; const dt = Math.min(.033, (now - last) / 1000); last = now; t += dt;
          if (noz !== 0) {
            if (t < T) v += (THR - DRAG * v) * dt; else v = Math.max(0, v - (FRIC + DRAG * v) * dt);
            x += v * dt;
          }
          const size = Math.max(.4, n * (1 - Math.min(1, t / T)));
          const lift = noz === 0 && t < T ? Math.sin(t * 30) * 2 + 6 : 0;
          const bx = Math.max(SL + 30, Math.min(SR - 30, x0 + dir * x));
          place(bx, size, lift);
          // little air puffs out of the nozzle
          puffT += dt;
          if (t < T && puffT > .05) {
            puffT = 0; const ry = 14 + size * 4.5, rx = 18 + size * 6;
            const px = noz === 0 ? bx : bx + noz * (rx + 12), py = noz === 0 ? SY + 12 + ry * 2 + 10 : SY + 12 + ry;
            const c = el('circle', { cx: px, cy: py, r: 3, fill: '#e9f6fd', stroke: '#9fc6dc', 'stroke-width': .8 }, puffs);
            const vx = noz * 80, vy = noz === 0 ? 80 : (Math.random() - .5) * 20, t1 = performance.now();
            (function p(nn) { if (!alive()) return; const k = (nn - t1) / 600; c.setAttribute('cx', (px + vx * k).toFixed(1)); c.setAttribute('cy', (py + vy * k).toFixed(1)); c.setAttribute('r', (3 + 6 * k).toFixed(1)); c.setAttribute('opacity', Math.max(0, 1 - k).toFixed(2)); if (k < 1) requestAnimationFrame(p); else c.remove(); })(t1);
          }
          if (t < T || (noz !== 0 && v > 0)) requestAnimationFrame(f); else done(noz === 0 ? 0 : x, dir, bx);
        })(performance.now());
      }
      function marker(x, paws, col) {
        const g = el('g', { transform: `translate(${x.toFixed(1)} ${SY})` }, $('#rkMarks'));
        el('line', { x1: 0, y1: 26, x2: 0, y2: 58, stroke: '#7a5a3a', 'stroke-width': 1.4 }, g);
        el('rect', { x: -24, y: 58, width: 48, height: 22, rx: 5, fill: '#fffdf6', stroke: col, 'stroke-width': 1.4 }, g);
        const u = el('use', { href: '#paw', x: -20, y: 62, width: 14, height: 14 }, g); u.style.color = col;
        const t = el('text', { x: 6, y: 75, 'text-anchor': 'middle', 'font-size': 14, fill: '#3b3226', 'font-family': 'Jua, sans-serif' }, g); t.textContent = paws;
      }
      function done(x, dir, bx) {
        st.flying = false;
        const paws = Math.round(x / PAW);
        if (st.phase === 'test') {
          st.results[st.test] = { dir, paws };
          if (dir !== 0) marker(bx, paws, TESTS[st.test].color);
          const doneAll = TK.every(k => st.results[k]);
          const msg = st.test === 'down' ? '입구가 <b>아래쪽</b>이니까 풍선이 <b>위로</b> 들썩였을 뿐, 옆으로는 가지 않았어!' : `입구가 <b>${st.test === 'left' ? '왼쪽' : '오른쪽'}</b>이었는데 풍선은 <b>${dir > 0 ? '오른쪽' : '왼쪽'}</b>으로 <b>발자국 ${paws}개</b>만큼 날아갔어!`;
          say('owl', msg + (doneAll ? ' 세 가지를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ''), true);
          setTimeout(() => { if (alive() && !st.flying) idle(); }, 1400);
        } else {
          st.tried[st.pumps] = true;
          marker(bx, paws, COLORS[st.pumps - 1]);
          if (Math.abs(x - st.target) <= 25) { st.hits++; HH.stars($('#rkFx'), bx, SY - 40); say('owl', '<b>골인!</b> 깃발에 딱 멈췄어! 다음 깃발도 맞혀 볼까?', true); setTimeout(() => { if (alive()) { newTarget(); $('#rkMarks').innerHTML = ''; idle(); } }, 1300); }
          else { say('squirrel', x < st.target ? '조금 모자라! 바람을 <b>더 많이</b> 넣어 볼까?' : '너무 멀리 갔어! 바람을 <b>조금 덜</b> 넣어 볼까?'); setTimeout(() => { if (alive() && !st.flying) idle(); }, 1400); }
          if (Object.keys(st.tried).length >= 3 && !HH.hasCard('rocket-air')) setTimeout(() => { if (alive()) airCard(); }, 1500);
        }
        renderControls();
      }
      function newTarget() {
        const ds = [1, 2, 3, 4, 5].map(simulate).filter(d => d > 40);
        st.target = ds[Math.floor(Math.random() * ds.length)];
        const x = startX() + st.target;
        $('#rkTarget').innerHTML = `<g transform="translate(${x.toFixed(1)} ${SY})"><path d="M0 0 V-46" stroke="#6e5a40" stroke-width="1.6"/><path d="M0 -46 L26 -38 L0 -30 Z" fill="#d9483b" stroke="#8a2c22" stroke-width=".7"/><path d="M-25 -4 V4 M25 -4 V4" stroke="#d9483b" stroke-width="2"/></g>`;
      }
      function table() {
        return `<table class="mtable"><thead><tr><th>풍선 입구</th><th>풍선이 간 쪽</th></tr></thead><tbody>${TK.map(k => { const r = st.results[k]; return `<tr><td><span style="display:block;width:70px">${mini(TESTS[k].dir)}</span><span style="font-size:13px">${TESTS[k].name}</span>${st.pred && k === 'left' ? '' : ''}</td><td>${r ? (r.dir === 0 ? '<span style="font-family:var(--display);font-size:18px">제자리 (위로 들썩)</span>' : `<span style="font-family:var(--display);font-size:22px;color:${TESTS[k].color}">${r.dir > 0 ? '오른쪽 →' : '← 왼쪽'}</span><br><span style="font-size:13px">발자국 ${r.paws}개</span>`) : '<span class="wait">?</span>'}</td></tr>`; }).join('')}</tbody></table>`;
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">풍선 입구를 어느 쪽으로 할까?</p><div class="angles">${TK.map(k => `<button type="button" class="ang ${st.test === k ? 'on' : ''}" data-test="${k}" style="--c:${TESTS[k].color}" ${st.flying ? 'disabled' : ''} aria-pressed="${st.test === k}">${mini(TESTS[k].dir)}<span style="font-size:14px">${TESTS[k].name}</span>${st.results[k] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>바람은 3번씩 똑같이</span><button type="button" class="throw" id="goBtn" ${st.flying ? 'disabled' : ''}>손 놓기!</button></div>`;
          side.innerHTML = `<p class="lab">풍선은 어디로 갔을까?</p>${table()}${TK.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">바람을 몇 번 넣을까?</p><div class="angles" style="grid-template-columns:repeat(5,1fr)">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="ang ${st.pumps === n ? 'on' : ''}" data-pumps="${n}" style="--c:${COLORS[n - 1]};padding:6px 2px" ${st.flying ? 'disabled' : ''} aria-pressed="${st.pumps === n}"><svg viewBox="-50 -10 100 70" style="max-width:52px" aria-hidden="true"><g transform="scale(.8)">${balloonSVG(n, -1, COLORS[n - 1])}</g></svg><span>${n}번</span></button>`).join('')}</div>
            <div class="row"><span></span><button type="button" class="throw" id="goBtn" ${st.flying ? 'disabled' : ''}>손 놓기!</button></div>`;
          side.innerHTML = `<p class="score" style="margin-top:0">깃발 맞히기 <b>${st.hits}</b>번</p><p style="margin:8px 0 0;font-size:14px;color:var(--ink-soft)">풍선 로켓을 빨간 깃발 사이에 멈추게 해 봐요. 바람 양을 여러 가지로 바꿔 보면 발견이 있어요.</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 풍선이 어느 쪽으로 갈지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">풍선은 어디로 갔을까?</p>${table()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); idle(); renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center"><div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 100" aria-hidden="true">${mini(-1, 4).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">하늘 정원 · 공기의 힘</p><h2>풍선 로켓</h2><p class="lead">줄에 빨대를 끼우고 풍선을 붙였어.<br>손을 놓으면 풍선 로켓은 어디로 날아갈까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const pic = (lbl, arrow) => `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#dcebef"/><path d="M6 30 H154" stroke="#7a6a52" stroke-width="1.2"/><g transform="translate(80 30) scale(.8)">${balloonSVG(2, -1, '#e0453a')}</g>${arrow}</svg>`;
        ui.show(`<div class="ov-card">${HH.talk('owl', '풍선 입구가 <b>왼쪽</b>을 보고 있어. 손을 놓으면 풍선은 <b>어느 쪽</b>으로 갈까?')}
          ${HH.talk('squirrel', '바람이 나가는 쪽으로 따라갈 거야! 왼쪽!')}
          <div class="picks">
            <button type="button" class="pick" data-pick="left">${pic('', '<path d="M60 90 H20" stroke="#2f8f86" stroke-width="3"/><path d="M28 84 L18 90 L28 96" fill="none" stroke="#2f8f86" stroke-width="3"/>')}<span>왼쪽으로</span></button>
            <button type="button" class="pick" data-pick="right">${pic('', '<path d="M100 90 H140" stroke="#d9822b" stroke-width="3"/><path d="M132 84 L142 90 L132 96" fill="none" stroke="#d9822b" stroke-width="3"/>')}<span>오른쪽으로</span></button>
            <button type="button" class="pick" data-pick="stay">${pic('', '<circle cx="80" cy="92" r="5" fill="#7c62ad"/>')}<span>제자리에</span></button>
          </div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('rocket-dir');
        const msg = { right: '예상이 딱 맞았어! 입구가 왼쪽이면 풍선은 <b>오른쪽</b>으로 갔지.', left: '도토리랑 같은 생각이었구나! 그런데 풍선은 공기와 <b>반대쪽</b>으로 날아갔어.', stay: '풍선은 제자리에 있지 않고 공기와 <b>반대쪽</b>으로 날아갔어.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>${table()}
          ${HH.talk('owl', msg + ' 풍선이 공기를 한쪽으로 <b>밀어내면</b>, 공기도 풍선을 반대쪽으로 <b>밀어내</b>. 입구가 아래쪽일 때 위로 들썩인 것도 그래서야.')}
          ${HH.talk('squirrel', '진짜 로켓이 불꽃을 아래로 뿜으면서 위로 올라가는 것도 같은 원리구나!')}
          ${HH.dcard(1, art1(), '풍선은 공기가 나가는 쪽과 반대쪽으로 날아가요.', '입구가 왼쪽이면 오른쪽으로, 오른쪽이면 왼쪽으로!')}
          <button type="button" class="btn primary" data-act="play">깃발 맞히기 놀이 하기</button></div>`);
      }
      function airCard() {
        HH.addCard('rocket-air');
        ui.show(`<div class="ov-card">${HH.talk('owl', '바람을 많이 넣으면 공기가 <b>더 오래, 더 세게</b>빠져나가서 풍선을 더 오래 밀어 줘. 그래서 더 멀리 날아간단다.')}
          ${HH.dcard(2, art2(), '바람을 많이 넣을수록 풍선 로켓이 더 멀리 날아가요.', '바람 1번은 조금, 5번은 아주 멀리 날아갔어요.')}
          <button type="button" class="btn primary" data-act="close">계속 날리기</button></div>`);
      }
      function reset() { if (st.flying) return; fresh(); ui.hide(); $('#rkMarks').innerHTML = ''; $('#rkTarget').innerHTML = ''; setPhase('intro'); say('owl', '안녕! 오늘은 <b>풍선 로켓</b>을 날려 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'goBtn') { launch(); return; }
        if (st.flying) return;
        if (b.dataset.test) { st.test = b.dataset.test; idle(); renderControls(); return; }
        if (b.dataset.pumps) { st.pumps = +b.dataset.pumps; idle(); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '입구 방향을 고르고 <b>손 놓기!</b>를 눌러 봐. 바람은 모두 3번씩 넣었어.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); $('#rkMarks').innerHTML = ''; setPhase('play'); newTarget(); say('owl', '이번엔 왼쪽 끝에서 출발해. 바람을 몇 번 넣어야 <b>빨간 깃발</b>까지 갈까?', true); }
        else if (act === 'close') ui.hide();
      });

      setPhase('intro'); say('owl', '안녕! 오늘은 <b>풍선 로켓</b>을 날려 볼 거야.'); intro();
    }
  });
})();
