/* 하늘 정원 · 달걀 낙하산 */
(function () {
  const { el, rng } = HH;
  const DX = 330, Y0 = 118, GROUND = 470, G = 900, K = 220, SAFE = 150, VMAX_METER = 420;
  const TESTS = { none: { name: '낙하산 없음', A: .02, color: '#8a7a5c' }, small: { name: '작은 낙하산', A: 1, color: '#2f8f86' }, big: { name: '큰 낙하산', A: 4, color: '#d9822b' } };
  const TKEYS = ['none', 'small', 'big'];
  const SIZES = [1, 2, 3, 4, 6, 8];   // canopy areas for the 6 slider steps
  const vt = (A, m) => K * Math.sqrt(m / A);

  function canopy(A, color) {
    if (A < .5) return '';
    const w = 26 * Math.sqrt(A), h = w * .55, c = color || '#e8574a';
    return `<path d="M${-w} -64 C${-w} ${-64 - h * 1.35} ${w} ${-64 - h * 1.35} ${w} -64 Q${w * .5} ${-64 - h * .2} 0 -64 Q${-w * .5} ${-64 - h * .2} ${-w} -64 Z" fill="${c}" stroke="#5a2a20" stroke-width=".9"/>
      <path d="M${-w * .32} ${-64 - h * .1} C${-w * .3} ${-64 - h * .9} ${w * .3} ${-64 - h * .9} ${w * .32} ${-64 - h * .1} Q0 ${-64 - h * .2} ${-w * .32} ${-64 - h * .1} Z" fill="#fffaf0" opacity=".9"/>
      <path d="M${-w * .62} ${-64 - h * .12} Q${-w * .55} ${-64 - h * .8} ${-w * .1} ${-64 - h * 1}" fill="none" stroke="#5a2a20" stroke-width=".5" opacity=".5"/>
      <path d="M${-w} -64 L-15 -20 M${-w * .5} ${-64 - h * .12} L-8 -20 M${w * .5} ${-64 - h * .12} L8 -20 M${w} -64 L15 -20" stroke="#8a7a5c" stroke-width=".8"/>`;
  }
  function basket(eggs) {
    let e = '';
    for (let i = 0; i < eggs; i++) { const x = (i - (eggs - 1) / 2) * 11; e += `<g transform="translate(${x} -16) scale(.42)"><use href="#obj-egg" x="-17" y="-22" width="34" height="44"/></g>`; }
    return `${e}<path d="M-17 -20 H17 L13 0 H-13 Z" fill="#c9a06a" stroke="#6e4a2b" stroke-width=".9"/>
      <path d="M-15 -14 H15 M-14 -8 H14 M-13 -3 H13 M-9 -20 L-8 0 M0 -20 V0 M9 -20 L8 0" stroke="#8a6440" stroke-width=".6" opacity=".8"/>`;
  }
  /* a canopy lying deflated on the ground to the right of the basket */
  function deflated(A, color) {
    const w = 26 * Math.sqrt(A);
    return `<path d="M14 -16 Q${(20 + w * .3).toFixed(1)} -6 ${(22 + w * .4).toFixed(1)} 0" fill="none" stroke="#8a7a5c" stroke-width=".8"/>
      <path d="M${(20 + w * .3).toFixed(1)} 0 C${(20 + w * .6).toFixed(1)} ${(-w * .32).toFixed(1)} ${(20 + w * 1.6).toFixed(1)} ${(-w * .28).toFixed(1)} ${(20 + w * 1.9).toFixed(1)} 0 Q${(20 + w * 1.1).toFixed(1)} -4 ${(20 + w * .3).toFixed(1)} 0 Z" fill="${color}" stroke="#5a2a20" stroke-width=".8"/>
      <path d="M${(20 + w * .9).toFixed(1)} ${(-w * .22).toFixed(1)} Q${(20 + w * 1.1).toFixed(1)} -6 ${(20 + w * 1.05).toFixed(1)} -2" fill="none" stroke="#fffaf0" stroke-width="3" opacity=".8"/>`;
  }
  function rig(A, eggs, color) { return A < .5 ? `<g transform="translate(0 -11)"><use href="#obj-egg" x="-17" y="-22" width="34" height="44"/></g>` : canopy(A, color) + basket(eggs); }
  function splat() {
    return `<ellipse cx="0" cy="-2" rx="30" ry="7" fill="#fffaf0" stroke="#d9cfb8" stroke-width=".8"/><ellipse cx="2" cy="-4" rx="10" ry="5" fill="#f2b51f" stroke="#c98a0c" stroke-width=".8"/>
      <path d="M-26 -8 l6 -10 l5 9 Z M18 -6 l9 -8 l2 10 Z M-8 -12 l4 -9 l5 8 Z" fill="url(#eggG)" stroke="#9a7450" stroke-width=".6"/>`;
  }
  function mini(key) {
    const t = TESTS[key];
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#dcebef"/><rect y="88" width="160" height="12" fill="#a9c98a"/>
      <g transform="translate(80 ${key === 'none' ? 60 : 82}) scale(${key === 'none' ? 1.1 : .78})">${rig(t.A, 1, t.color)}</g></svg>`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><rect y="84" width="160" height="12" fill="#a9c98a"/>
      <g transform="translate(40 90) scale(.5)">${splat()}</g><text x="40" y="78" text-anchor="middle" font-size="9" fill="#9c4524">작은 낙하산</text>
      <g transform="translate(112 84) scale(.6)">${canopy(4, '#d9822b')}${basket(1)}</g><text x="112" y="16" text-anchor="middle" font-size="9" fill="#3c5f30">큰 낙하산</text>
      <path d="M40 22 V60" stroke="#9c4524" stroke-width="1.4" stroke-dasharray="2 3"/><path d="M36 54 L40 62 L44 54" fill="none" stroke="#9c4524" stroke-width="1.4"/></svg>`;
  }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><rect y="84" width="160" height="12" fill="#a9c98a"/>
      <g transform="translate(44 80) scale(.62)">${canopy(2, '#3fa9d4')}${basket(1)}</g><g transform="translate(116 80) scale(.62)">${canopy(8, '#7c62ad')}${basket(3)}</g>
      <text x="44" y="94" text-anchor="middle" font-size="8.5" fill="#3b3226">달걀 1개</text><text x="116" y="94" text-anchor="middle" font-size="8.5" fill="#3b3226">달걀 3개</text></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="하늘 정원 전망 탑에서 낙하산을 단 달걀을 떨어뜨리는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="560" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8"><path d="M640 120 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/><path d="M420 160 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".8"/></g>
    <path d="M0 350 C140 320 260 336 380 340 C520 344 640 312 780 320 C880 326 950 312 1000 316 L1000 420 L0 420 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="pcTrees"></g>
    <rect y="${GROUND}" width="1000" height="${560 - GROUND}" fill="#a9c98a"/><path d="M0 410 C200 430 400 456 1000 ${GROUND} H0 Z" fill="#b4d196"/>
    <path d="M0 ${GROUND} H1000" stroke="#86a96a"/>
    <g id="pcFlowers"></g>
    <!-- stone landing yard -->
    <path d="M${DX - 90} ${GROUND} L${DX - 70} ${GROUND - 8} H${DX + 70} L${DX + 90} ${GROUND} Z" fill="#c9c4b8" stroke="#8d8983" stroke-width=".8"/>
    <path d="M${DX - 50} ${GROUND - 8} L${DX - 54} ${GROUND} M${DX - 10} ${GROUND - 8} V${GROUND} M${DX + 30} ${GROUND - 8} L${DX + 34} ${GROUND}" stroke="#8d8983" stroke-width=".7"/>
    <!-- tower -->
    <g stroke="#6e4a2b" stroke-width=".9">
      <path d="M70 ${GROUND} L96 ${Y0 + 10} M210 ${GROUND} L184 ${Y0 + 10}" stroke="#7a5230" stroke-width="7" fill="none"/>
      <path d="M86 400 L196 340 M90 340 L192 280 M94 280 L188 220 M98 220 L184 160 M196 400 L86 340 M192 340 L90 280 M188 280 L94 220 M184 220 L98 160" stroke="#8a6440" stroke-width="3" fill="none"/>
      <rect x="80" y="${Y0 + 4}" width="${DX - 60}" height="10" fill="url(#wood)"/>
      <path d="M80 ${Y0 + 4} V${Y0 - 22} M200 ${Y0 + 4} V${Y0 - 22} M80 ${Y0 - 20} H200" stroke="#7a5230" stroke-width="3" fill="none"/>
      <path d="M${DX - 30} ${Y0 + 4} V${Y0 - 48} H${DX + 4}" stroke="#7a5230" stroke-width="4" fill="none"/>
    </g>
    <path d="M${DX} ${Y0 - 48} V${Y0 - 30}" stroke="#7a6a52" stroke-width="1"/>
    <use href="#squirrel" x="200" y="${Y0 - 62}" width="64" height="64"/>
    <g id="pcBody"></g>
    <g id="pcFx"></g>
    <!-- stopwatch -->
    <g transform="translate(870 112)">
      <rect x="-6" y="-66" width="12" height="10" rx="2" fill="#7f868d"/><circle r="56" fill="#fbfaf6" stroke="#5a5f64" stroke-width="3"/><g id="swTicks"></g>
      <path id="swHand" d="M0 6 V-46" stroke="#c45f33" stroke-width="3" stroke-linecap="round"/><circle r="4" fill="#3b3226"/>
      <text id="swTxt" y="28" text-anchor="middle" font-size="18" font-family="Jua, sans-serif" fill="#3b3226">0초</text>
      <text y="80" text-anchor="middle" font-size="13" font-family="Jua, sans-serif" fill="#3b3226">초시계</text>
    </g>
    <!-- speed meter -->
    <g transform="translate(830 220)">
      <text x="40" y="0" text-anchor="middle" font-size="13" font-family="Jua, sans-serif" fill="#3b3226">내려오는 빠르기</text>
      <rect x="0" y="12" width="80" height="200" rx="8" fill="#fbfaf6" stroke="#9c8a6a" stroke-width=".9"/>
      <rect x="2" y="12" width="76" height="${(200 * (1 - SAFE / VMAX_METER)).toFixed(1)}" rx="7" fill="#f7d9d2"/>
      <path d="M0 ${(12 + 200 * (1 - SAFE / VMAX_METER)).toFixed(1)} H80" stroke="#c45f33" stroke-width="1.6" stroke-dasharray="5 3"/>
      <text x="40" y="${(8 + 200 * (1 - SAFE / VMAX_METER)).toFixed(1)}" text-anchor="middle" font-size="10" fill="#9c4524">이보다 빠르면 깨져요</text>
      <rect id="spdBar" x="26" y="212" width="28" height="0" rx="4" fill="#3f86b8"/>
      <text x="40" y="30" text-anchor="middle" font-size="10" fill="#6d604c">빨라요</text><text x="40" y="206" text-anchor="middle" font-size="10" fill="#6d604c">느려요</text>
    </g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>낙하산이 클수록 공기가 더 많이 받쳐 주어(공기 저항) 천천히 내려오고, 달걀이 깨지지 않습니다. 짐이 무거워지면 더 큰 낙하산이 필요합니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 큰 낙하산과 작은 낙하산 중 무엇이 더 천천히 내려올까? 도토리는 “작은 낙하산이 가벼워서 더 천천히 내려온다”고 말합니다.</li><li>실험: 같은 높이에서 낙하산 없음, 작은 낙하산, 큰 낙하산으로 달걀을 떨어뜨리고 초시계로 시간을 잽니다. 오른쪽 막대로 내려오는 빠르기를 봅니다.</li><li>발견: 낙하산 크기, 걸린 시간, 달걀 상태를 비교합니다.</li><li>놀이: 낙하산 크기와 달걀 수를 바꿔 배달 미션을 해결합니다. 깨지지 않는 가장 작은 낙하산도 찾아봅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>낙하산 없이 떨어진 달걀은 왜 깨졌을까?</li><li>민들레 씨앗은 왜 천천히 날아갈까?</li><li>무거운 짐을 내릴 때는 어떤 낙하산이 필요할까?</li></ul></div>
    <div><h3>교과 연계</h3><p>1~2학년 통합교과 놀이 활동, 고학년 과학의 공기 저항 개념 맛보기. 종이비행기 공방 실험과 함께 “공기가 받쳐 준다”는 생각을 이어 갈 수 있습니다.</p></div>
    <div><h3>교실에서 실제로 해 보기</h3><p>비닐봉지와 실, 종이컵으로 낙하산을 만들어 날달걀 대신 삶은 달걀이나 지우개를 떨어뜨려 보세요. 높은 곳에서 하는 활동은 반드시 선생님이 함께해 주세요.</p></div>`;

  HH.register({
    id: 'parachute',
    cards: [
      { id: 'chute-size', no: 1, text: '낙하산이 클수록 천천히 내려와서 달걀이 깨지지 않아요.', art: art1 },
      { id: 'chute-load', no: 2, text: '짐이 무거울수록 더 큰 낙하산이 필요해요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'parachute', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="-17 -22 34 44" aria-hidden="true"><use href="#obj-egg" x="-17" y="-22" width="34" height="44"/></svg>모두 같은 높이에서 떨어뜨려요. 초시계로 걸린 시간을, 오른쪽 막대로 내려오는 빠르기를 봐요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, test: 'none', results: {}, falling: false, size: 2, eggs: 1, missions: {}, lastSafe: null }); }
      fresh();

      (function () {
        const R = rng(83);
        const t = $('#pcTrees'); [420, 500, 600, 700, 760, 960].forEach(x => HH.tree(t, x, 418, .7 + R() * .35));
        const f = $('#pcFlowers');
        for (let i = 0; i < 140; i++) { const x = R() * 1000, y = GROUND + 6 + R() * 80; if (Math.abs(x - DX) < 95 && y < GROUND + 10) continue; el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)} l${(R() * 2 - 1).toFixed(1)} -${(3 + R() * 4).toFixed(1)}`, stroke: '#7aa25e', 'stroke-width': .8 }, f); if (R() < .3) el('circle', { cx: x.toFixed(1), cy: (y - 6).toFixed(1), r: 1.8, fill: ['#f2c230', '#f3b6c6', '#fffaf0'][Math.floor(R() * 3)] }, f); }
        const tk = $('#swTicks');
        for (let s = 0; s < 6; s++) { const a = s / 6 * Math.PI * 2; el('path', { d: `M${(Math.sin(a) * 44).toFixed(1)} ${(-Math.cos(a) * 44).toFixed(1)} L${(Math.sin(a) * 52).toFixed(1)} ${(-Math.cos(a) * 52).toFixed(1)}`, stroke: '#3b3226', 'stroke-width': 2 }, tk); const tx = el('text', { x: (Math.sin(a) * 34).toFixed(1), y: (-Math.cos(a) * 34 + 4).toFixed(1), 'text-anchor': 'middle', 'font-size': 11, fill: '#6d604c' }, tk); tx.textContent = s; }
      })();

      function current() {
        if (st.phase === 'play') return { A: SIZES[st.size], m: st.eggs, color: ['#3fa9d4', '#3fa9d4', '#5aa64a', '#d9822b', '#e8574a', '#7c62ad'][st.size] };
        const t = TESTS[st.test]; return { A: t.A, m: 1, color: t.color };
      }
      function drawIdle() {
        const c = current();
        $('#pcBody').innerHTML = `<g transform="translate(${DX} ${Y0 + (c.A < .5 ? -18 : 0)})">${rig(c.A, c.m, c.color)}</g>`;
        $('#swHand').setAttribute('transform', 'rotate(0)'); $('#swTxt').textContent = '0초'; $('#spdBar').setAttribute('height', 0); $('#spdBar').setAttribute('y', 212);
      }
      function setSpeed(v) {
        const h = Math.min(1, v / VMAX_METER) * 200;
        const bar = $('#spdBar'); bar.setAttribute('height', h.toFixed(1)); bar.setAttribute('y', (212 - h).toFixed(1)); bar.setAttribute('fill', v > SAFE ? '#d4574a' : '#3f86b8');
      }
      function drop() {
        if (st.falling) return; st.falling = true; renderControls();
        $('#pcFx').innerHTML = '';
        const c = current(), term = vt(c.A, c.m), chute = c.A >= .5;
        let y = Y0, v = 0, t = 0, last = null;
        (function f(n) {
          if (!alive()) return;
          if (last === null) last = n; const dt = Math.min(.033, (n - last) / 1000); last = n; t += dt;
          v += (G - G * (v / term) * (v / term)) * dt; y += v * dt;
          const sway = chute ? Math.sin(t * 2.6) * 6 * Math.min(1, t) : 0, rot = chute ? Math.sin(t * 2.6) * 4 : t * 300;
          const yy = Math.min(y, GROUND - 8);
          $('#pcBody').innerHTML = `<g transform="translate(${(DX + sway).toFixed(1)} ${(yy - (chute ? 0 : 11)).toFixed(1)}) rotate(${rot.toFixed(1)})">${rig(c.A, c.m, c.color)}</g>`;
          $('#swHand').setAttribute('transform', `rotate(${(t / 6 * 360).toFixed(1)})`); $('#swTxt').textContent = `${Math.floor(t)}초`;
          setSpeed(v);
          if (y < GROUND - 8) requestAnimationFrame(f); else landed(t, v, c);
        })(performance.now());
      }
      function landed(t, v, c) {
        st.falling = false;
        const safe = v <= SAFE, secs = Math.max(1, Math.round(t));
        $('#swTxt').textContent = `약 ${secs}초`;
        if (safe) {
          $('#pcBody').innerHTML = `<g transform="translate(${DX} ${GROUND - 8})">${c.A >= .5 ? deflated(c.A, c.color) : ''}${basket(c.m)}</g>`;
          HH.stars($('#pcFx'), DX, GROUND - 30);
        } else {
          $('#pcBody').innerHTML = c.A >= .5 ? `<g transform="translate(${DX} ${GROUND - 8})">${deflated(c.A, c.color)}<path d="M-17 -20 H17 L13 0 H-13 Z" fill="#c9a06a" stroke="#6e4a2b" stroke-width=".9" transform="rotate(12)"/></g><g transform="translate(${DX + 4} ${GROUND - 6})">${splat()}</g>` : `<g transform="translate(${DX} ${GROUND - 6})">${splat()}</g>`;
        }
        if (st.phase === 'test') {
          st.results[st.test] = { secs, safe };
          const done = TKEYS.every(k => st.results[k]);
          const msg = safe ? `<b>${TESTS[st.test].name}</b>은 <b>약 ${secs}초</b> 동안 천천히 내려와서 달걀이 <b>무사해</b>!` : `<b>퍽!</b> ${TESTS[st.test].name}${st.test === 'none' ? '이면' : '은'} 너무 빨리 떨어져서 달걀이 <b>깨졌어</b>. 걸린 시간은 약 ${secs}초야.`;
          say(safe ? 'owl' : 'squirrel', msg + (done ? ' 세 가지를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ''), safe);
        } else if (st.phase === 'play') {
          st.lastSafe = safe;
          if (safe) {
            const newly = [];
            const hit = (id, cond) => { if (cond && !st.missions[id]) { st.missions[id] = true; newly.push(id); } };
            hit('e1', st.eggs === 1); hit('e2', st.eggs === 2); hit('e3', st.eggs === 3);
            const minIdx = SIZES.findIndex(A => vt(A, st.eggs) <= SAFE);
            hit('min', st.eggs === 1 && st.size === minIdx);
            say('owl', `달걀 <b>${st.eggs}개</b>를 무사히 배달했어!` + (newly.includes('min') ? ' 깨지지 않는 <b>가장 작은</b> 낙하산을 찾았구나!' : st.eggs === 1 && st.size > minIdx ? ' 낙하산을 더 작게 해도 괜찮을까?' : ''), true);
            if (st.eggs === 3 && !HH.hasCard('chute-load')) setTimeout(() => { if (alive()) loadCard(); }, 1000);
          } else say('squirrel', `퍽! 달걀 <b>${st.eggs}개</b>에는 낙하산이 너무 작았나 봐. 낙하산을 <b>더 크게</b> 해 볼까?`);
        }
        renderControls();
      }

      /* ---------- panels ---------- */
      function resultTable() {
        return `<table class="mtable"><thead><tr><th>낙하산</th><th>걸린 시간</th><th>달걀</th></tr></thead><tbody>${TKEYS.map(k => {
          const r = st.results[k];
          return `<tr><td><span style="display:block;width:64px">${mini(k)}</span><span style="font-size:13px">${TESTS[k].name}</span></td><td>${r ? `<span class="seatno">${r.secs}</span>초` : '<span class="wait">?</span>'}</td><td>${r ? (r.safe ? '<span style="color:#3c5f30;font-family:var(--display)">무사해요</span>' : '<span style="color:#9c4524;font-family:var(--display)">깨졌어요</span>') : '<span class="wait">?</span>'}</td></tr>`;
        }).join('')}</tbody></table>`;
      }
      const MISSIONS = [{ id: 'e1', text: '달걀 1개 무사히 배달하기' }, { id: 'e2', text: '달걀 2개 무사히 배달하기' }, { id: 'e3', text: '달걀 3개 무사히 배달하기' }, { id: 'min', text: '달걀 1개를 깨지지 않는 가장 작은 낙하산으로' }];
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">어떻게 떨어뜨릴까?</p><div class="angles">${TKEYS.map(k => `<button type="button" class="ang ${st.test === k ? 'on' : ''}" data-test="${k}" style="--c:${TESTS[k].color}" ${st.falling ? 'disabled' : ''} aria-pressed="${st.test === k}">${mini(k)}<span style="font-size:14px">${TESTS[k].name}</span>${st.results[k] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>높이와 달걀은 똑같이</span><button type="button" class="throw" id="dropBtn" ${st.falling ? 'disabled' : ''}>떨어뜨리기!</button></div>`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${resultTable()}${TKEYS.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<label class="lab" for="sizeR">낙하산 크기</label><div class="slide"><span>작게</span><input type="range" id="sizeR" min="0" max="5" step="1" value="${st.size}" ${st.falling ? 'disabled' : ''}><span>크게</span></div>
            <p class="lab">배달할 달걀</p><div class="angles">${[1, 2, 3].map(n => `<button type="button" class="ang ${st.eggs === n ? 'on' : ''}" data-eggs="${n}" style="--c:#d9822b" ${st.falling ? 'disabled' : ''} aria-pressed="${st.eggs === n}"><svg viewBox="-24 -26 48 30" style="max-width:56px" aria-hidden="true">${basket(n)}</svg><span>${n}개</span></button>`).join('')}</div>
            <div class="row"><span></span><button type="button" class="throw" id="dropBtn" ${st.falling ? 'disabled' : ''}>떨어뜨리기!</button></div>`;
          side.innerHTML = `<p class="lab">달걀 배달 미션</p><ul style="list-style:none;margin:0;padding:0;display:grid;gap:6px">${MISSIONS.map(m => `<li style="display:flex;gap:8px;align-items:center;font-size:15px"><span style="flex:none;width:22px;height:22px;border-radius:6px;border:1.5px solid ${st.missions[m.id] ? '#4f7a3f' : '#c9b48a'};background:${st.missions[m.id] ? '#4f7a3f' : '#fff'};color:#fff;display:grid;place-items:center;font-size:14px">${st.missions[m.id] ? '✓' : ''}</span>${m.text}</li>`).join('')}</ul>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 어느 낙하산이 천천히 내려올지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${resultTable()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); drawIdle(); }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="-70 -150 140 154" aria-hidden="true">${canopy(4, '#d9822b')}${basket(1)}</svg></div>
          <p class="eyebrow">하늘 정원 · 공기의 힘</p><h2>달걀 낙하산</h2>
          <p class="lead">높은 전망 탑에서 달걀을 떨어뜨리면 깨질까?<br>낙하산을 달면 어떻게 될까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const eq = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#dcebef"/><rect y="88" width="160" height="12" fill="#a9c98a"/><g transform="translate(46 80) scale(.5)">${canopy(1, '#2f8f86')}${basket(1)}</g><g transform="translate(114 80) scale(.5)">${canopy(4, '#d9822b')}${basket(1)}</g><text x="80" y="58" text-anchor="middle" font-size="22" font-family="Jua, sans-serif" fill="#3b3226">=</text></svg>`;
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '같은 높이에서 떨어뜨리면 <b>큰 낙하산</b>과 <b>작은 낙하산</b> 중 어느 쪽이 <b>더 천천히</b> 내려올까?')}
          ${HH.talk('squirrel', '작은 낙하산이 더 가벼우니까 더 천천히 내려올 거야!')}
          <div class="picks">
            <button type="button" class="pick" data-pick="big">${mini('big')}<span>큰 낙하산</span></button>
            <button type="button" class="pick" data-pick="small">${mini('small')}<span>작은 낙하산</span></button>
            <button type="button" class="pick" data-pick="same">${eq}<span>똑같아요</span></button>
          </div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('chute-size');
        const msg = { big: '예상이 딱 맞았어! <b>큰 낙하산</b>이 가장 천천히 내려왔지.', small: '도토리랑 같은 생각이었구나! 그런데 <b>큰 낙하산</b>이 더 천천히 내려왔어.', same: '내려오는 시간이 달랐어. <b>큰 낙하산</b>이 더 오래 걸렸지.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${resultTable()}
          ${HH.talk('owl', msg + ' 낙하산이 크면 <b>공기를 더 많이 받아서</b> 떨어지는 걸 붙잡아 준단다. 그래서 천천히 내려와 달걀이 무사했어.')}
          ${HH.talk('squirrel', '민들레 씨앗이 천천히 날아가는 것도 솜털이 공기를 받아서구나!')}
          ${HH.dcard(1, art1(), '낙하산이 클수록 천천히 내려와서 달걀이 깨지지 않아요.', '낙하산 없음 → 작은 낙하산 → 큰 낙하산 순서로 오래 걸렸어요.')}
          <button type="button" class="btn primary" data-act="play">달걀 배달 놀이 하기</button></div>`);
      }
      function loadCard() {
        HH.addCard('chute-load');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '달걀이 많아질수록 무거워져서 빨리 떨어지려고 해. 그래서 <b>더 큰 낙하산</b>으로 공기를 더 많이 받아야 무사히 내려올 수 있어.')}
          ${HH.dcard(2, art2(), '짐이 무거울수록 더 큰 낙하산이 필요해요.', '달걀 1개는 보통 낙하산, 달걀 3개는 가장 큰 낙하산이 필요했어요.')}
          <button type="button" class="btn primary" data-act="close">계속 배달하기</button></div>`);
      }
      function reset() { if (st.falling) return; fresh(); ui.hide(); $('#pcFx').innerHTML = ''; setPhase('intro'); say('owl', '안녕! 오늘은 <b>달걀 낙하산</b>을 만들어 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'dropBtn') { drop(); return; }
        if (b.dataset.test && !st.falling) { st.test = b.dataset.test; $('#pcFx').innerHTML = ''; drawIdle(); renderControls(); return; }
        if (b.dataset.eggs && !st.falling) { st.eggs = +b.dataset.eggs; $('#pcFx').innerHTML = ''; drawIdle(); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '세 가지 방법으로 같은 높이에서 떨어뜨려 보자. <b>초시계</b>와 오른쪽 <b>빠르기 막대</b>를 잘 봐!', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); $('#pcFx').innerHTML = ''; setPhase('play'); say('owl', '이번엔 <b>달걀 배달</b>이야! 낙하산 크기와 달걀 수를 골라서 깨지지 않게 내려 보내 봐.', true); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('input', e => { if (e.target.id === 'sizeR') { st.size = +e.target.value; $('#pcFx').innerHTML = ''; drawIdle(); } });

      setPhase('intro');
      say('owl', '안녕! 오늘은 <b>달걀 낙하산</b>을 만들어 볼 거야.');
      intro();
    }
  });
})();
