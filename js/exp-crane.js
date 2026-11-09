/* 공사장 · 기중기 기사 */
(function () {
  const { el, rng, josa } = HH;
  const MX = 420, GY = 470, JY = 150, UNIT = 100, S = 4, CW = 3;   // mast x, ground, jib height, distance unit, base strength, block weight
  const LOADS = { box: { name: '상자', w: 1 }, brick: { name: '벽돌 묶음', w: 3 }, steel: { name: '철근 다발', w: 5 } };
  const POS = { 1: '가까이', 2: '중간', 3: '멀리' };

  function loadSVG(k) {
    if (k === 'box') return `<rect x="-20" y="-30" width="40" height="30" fill="#d6b07a" stroke="#8a6440" stroke-width=".9"/><path d="M-20 -22 H20 M0 -30 V-22" stroke="#8a6440" stroke-width=".8"/><path d="M-6 -14 h12" stroke="#5e3f22" stroke-width="1.4"/>`;
    if (k === 'brick') { let s = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += `<rect x="${-27 + c * 18 + (r % 2) * 4}" y="${-12 - r * 12}" width="16" height="10" fill="#c45f33" stroke="#7d2b23" stroke-width=".7"/>`; return s + '<path d="M-27 -38 H31" stroke="#5a5f64" stroke-width="1.4"/>'; }
    let s = ''; for (let i = 0; i < 6; i++) s += `<rect x="-40" y="${-6 - i * 5}" width="80" height="4" rx="2" fill="url(#steelG)" stroke="#4f5459" stroke-width=".5"/>`;
    return s + '<path d="M-20 -34 V0 M20 -34 V0" stroke="#d9a23a" stroke-width="2"/>';
  }
  function craneSVG(blocks, trolleyX, hookY, load, carried) {
    let s = '';
    // base and mast
    s += `<rect x="${MX - 60}" y="${GY - 16}" width="120" height="18" fill="#b9b5ad" stroke="#7d7a74" stroke-width=".9"/>`;
    s += `<g fill="none" stroke="#c9952a" stroke-width="2.2"><path d="M${MX - 10} ${GY - 16} V${JY + 16} M${MX + 10} ${GY - 16} V${JY + 16}"/>`;
    for (let y = GY - 16; y > JY + 16; y -= 22) s += `<path d="M${MX - 10} ${y} L${MX + 10} ${y - 22}"/>`;
    s += `</g>`;
    // jib and counter-jib trusses
    s += `<g fill="none" stroke="#c9952a" stroke-width="2"><path d="M${MX - 130} ${JY} H${MX + 440} M${MX - 130} ${JY + 14} H${MX + 430}"/>`;
    for (let x = MX - 130; x < MX + 430; x += 20) s += `<path d="M${x} ${JY + 14} L${x + 10} ${JY} L${x + 20} ${JY + 14}"/>`;
    s += `</g><path d="M${MX - 12} ${JY} L${MX} ${JY - 60} L${MX + 12} ${JY}" fill="none" stroke="#c9952a" stroke-width="2.4"/>`;
    s += `<path d="M${MX} ${JY - 60} L${MX + 420} ${JY} M${MX} ${JY - 60} L${MX - 128} ${JY}" stroke="#6d6a64" stroke-width="1.1"/>`;
    s += `<rect x="${MX + 12}" y="${JY + 16}" width="30" height="24" rx="3" fill="#e9eef0" stroke="#7a8a90" stroke-width=".9"/><rect x="${MX + 16}" y="${JY + 20}" width="22" height="10" fill="#9fc6dc"/>`;
    // counterweights
    for (let i = 0; i < blocks; i++) s += `<rect x="${MX - 128}" y="${JY + 16 + i * 20}" width="44" height="18" fill="#9a968e" stroke="#5f5c56" stroke-width=".8"/><path d="M${MX - 120} ${JY + 25 + i * 20} h28" stroke="#c3c0b8" stroke-width=".8"/>`;
    // trolley, rope, hook and load
    s += `<rect x="${trolleyX - 14}" y="${JY + 12}" width="28" height="10" fill="#5a5f64"/><path d="M${trolleyX} ${JY + 22} V${hookY}" stroke="#4f5459" stroke-width="1.2"/>`;
    s += `<path d="M${trolleyX} ${hookY} q8 2 6 10 q-2 6 -8 2" fill="none" stroke="#4f5459" stroke-width="2.4"/>`;
    if (carried) s += `<path d="M${trolleyX} ${hookY + 10} L${trolleyX - 22} ${hookY + 30} M${trolleyX} ${hookY + 10} L${trolleyX + 22} ${hookY + 30}" stroke="#6d6a64" stroke-width="1"/><g transform="translate(${trolleyX} ${hookY + 30 + (load === 'brick' ? 38 : load === 'steel' ? 34 : 30)})">${loadSVG(load)}</g>`;
    return s;
  }
  function mini(d, tilt) {
    const k = .2, x = 40, tx = x + d * UNIT * k;
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e3ecef"/><rect y="88" width="160" height="12" fill="#ddc9a0"/>
      <g transform="rotate(${tilt || 0} 52 88)"><path d="M40 88 V24 M44 88 V24" stroke="#c9952a" stroke-width="2"/><path d="M18 24 H${x + 4 * UNIT * k + 10}" stroke="#c9952a" stroke-width="4"/><rect x="18" y="26" width="10" height="10" fill="#9a968e"/>
      <path d="M${tx} 26 V60" stroke="#4f5459"/><rect x="${tx - 8}" y="60" width="16" height="12" fill="#c45f33" stroke="#7d2b23" stroke-width=".6"/></g></svg>`;
  }
  const art1 = () => `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#e3ecef"/><rect y="84" width="160" height="12" fill="#ddc9a0"/>
    <g><path d="M30 84 V24 M34 84 V24" stroke="#c9952a" stroke-width="2"/><path d="M14 24 H72" stroke="#c9952a" stroke-width="3"/><path d="M46 26 V56" stroke="#4f5459"/><rect x="38" y="56" width="16" height="12" fill="#c45f33"/></g>
    <g transform="rotate(18 124 84)"><path d="M108 84 V24 M112 84 V24" stroke="#c9952a" stroke-width="2"/><path d="M92 24 H152" stroke="#c9952a" stroke-width="3"/><path d="M146 26 V56" stroke="#4f5459"/><rect x="138" y="56" width="16" height="12" fill="#c45f33"/></g>
    <text x="40" y="94" text-anchor="middle" font-size="8.5" fill="#3c5f30">가까이 튼튼</text><text x="120" y="94" text-anchor="middle" font-size="8.5" fill="#9c4524">멀리 기우뚱</text></svg>`;
  const art2 = () => `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#e3ecef"/><rect y="84" width="160" height="12" fill="#ddc9a0"/>
    <path d="M60 84 V24 M64 84 V24" stroke="#c9952a" stroke-width="2"/><path d="M20 24 H150" stroke="#c9952a" stroke-width="3"/>
    ${[0, 1, 2].map(i => `<rect x="20" y="${26 + i * 11}" width="22" height="10" fill="#9a968e" stroke="#5f5c56" stroke-width=".5"/>`).join('')}
    <path d="M140 26 V54" stroke="#4f5459"/><g transform="translate(140 68) scale(.4)">${loadSVG('steel')}</g>
    <path d="M40 16 H140" stroke="#3c5f30" stroke-width="1.2" stroke-dasharray="3 3"/><text x="90" y="12" text-anchor="middle" font-size="8.5" fill="#3c5f30">균형</text></svg>`;

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="공사장에서 타워 기중기로 짐을 들어 올리는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="140" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#fff" stroke="#c8dae6" stroke-width=".8"><path d="M600 60 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".85"/></g>
    <path d="M0 330 C140 300 260 316 380 320 C520 324 640 292 780 300 C880 306 950 292 1000 296 L1000 390 L0 390 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <rect y="${GY - 90}" width="1000" height="${560 - GY + 90}" fill="#ddc9a0"/><g id="crSpeck"></g>
    <g id="crBuilding"></g>
    <g id="crGround"></g>
    <g id="crCrane"></g>
    <text id="crState" x="${MX}" y="${GY + 50}" text-anchor="middle" font-size="20" font-family="Jua, sans-serif" fill="#3b3226"></text>
    <g id="crFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>같은 짐이라도 기중기 기둥에서 멀리 들수록 기중기를 앞으로 넘어뜨리려는 힘이 커집니다. 반대쪽에 무게추를 달면 균형이 맞아 무거운 짐도 멀리 옮길 수 있습니다. 무게추가 너무 많으면 거꾸로 뒤로 넘어질 수 있습니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 짐을 기중기 팔 끝 쪽으로 옮겨서 들면 어떻게 될까? 도토리는 “기중기는 크니까 어디서 들어도 끄떡없다”고 말합니다.</li><li>실험: 무게추와 짐은 그대로 두고 짐 위치만 가까이, 중간, 멀리로 바꿔 들어 봅니다.</li><li>발견: 거리와 기중기의 상태(튼튼, 흔들흔들, 넘어짐)를 비교합니다.</li><li>놀이: 짐의 무게, 무게추 개수, 위치를 골라 배달 미션을 해결합니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>동물 시소 실험과 어떤 점이 닮았을까?</li><li>무게추를 너무 많이 달면 왜 뒤로 넘어질까?</li><li>팔을 쭉 뻗고 무거운 가방을 들면 왜 힘들까?</li></ul></div>
    <div><h3>교과 연계</h3><p>4학년 과학 「물체의 무게」(수평 잡기)와 동물 시소 실험의 연장. 고학년 과학의 지레와 균형 개념 맛보기입니다.</p></div>`;

  HH.register({
    id: 'crane',
    cards: [
      { id: 'crane-far', no: 1, text: '무거운 짐을 멀리 들수록 기중기가 넘어지기 쉬워요.', art: art1 },
      { id: 'crane-counter', no: 2, text: '반대쪽에 무게추를 알맞게 달면 무거운 짐도 멀리 옮길 수 있어요.', art: art2 }
    ],
    thumb() { return mini(2, 0).replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'crane', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="5" width="14" height="10" fill="#9a968e"/></svg>왼쪽 회색 블록이 무게추예요. 오른쪽 숫자는 기둥에서 짐까지의 거리(칸)예요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;
      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, pos: 1, load: 'brick', blocks: 1, results: {}, busy: false, missions: {} }); }
      fresh();

      (function () {
        const R = rng(43);
        const sp = $('#crSpeck'); for (let i = 0; i < 240; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (GY - 86 + R() * 170).toFixed(1), r: (.5 + R() * 1.3).toFixed(2), fill: '#9a8460', 'fill-opacity': (.2 + R() * .4).toFixed(2) }, sp);
        let b = '';
        for (let f = 0; f < 4; f++) b += `<rect x="860" y="${GY - 60 - f * 60}" width="120" height="60" fill="#e9e1d2" stroke="#a89470" stroke-width=".8"/><rect x="872" y="${GY - 48 - f * 60}" width="22" height="26" fill="#9fc6dc" stroke="#7a8a90" stroke-width=".6"/><rect x="930" y="${GY - 48 - f * 60}" width="22" height="26" fill="#9fc6dc" stroke="#7a8a90" stroke-width=".6"/>`;
        b += `<path d="M856 ${GY - 240} V${GY} M984 ${GY - 240} V${GY}" stroke="#8d8983" stroke-width="3"/>`;
        $('#crBuilding').innerHTML = b;
      })();

      const moment = () => LOADS[st.load].w * st.pos - st.blocks * CW;   // forward (+) or backward (−)
      function verdict() { const m = moment(); return m > S ? 'fwd' : -m > S ? 'back' : m > S / 2 ? 'wobble' : 'ok'; }
      let tilt = 0;
      function draw(trolley, hookY, carried, groundLoad) {
        const tx = MX + trolley * UNIT;
        const pivot = tilt >= 0 ? MX + 60 : MX - 60;
        $('#crCrane').innerHTML = `<g transform="rotate(${tilt.toFixed(2)} ${pivot} ${GY})">${craneSVG(st.blocks, tx, hookY, st.load, carried)}</g>`;
        $('#crGround').innerHTML = groundLoad ? `<g transform="translate(${tx} ${GY})">${loadSVG(st.load)}</g>` : '';
        let marks = '';
        for (let d = 1; d <= 4; d++) marks += `<g transform="translate(${MX + d * UNIT} ${GY + 18})"><path d="M0 -6 V0" stroke="#7a5a3a" stroke-width="2"/><text y="16" text-anchor="middle" font-size="13" font-family="Jua, sans-serif" fill="#5e4428">${d}칸</text></g>`;
        $('#crGround').innerHTML += marks;
      }
      function idle() { tilt = 0; $('#crState').textContent = ''; draw(st.pos, GY - 160, false, true); }
      function lift() {
        if (st.busy) return; st.busy = true; renderControls();
        const v = verdict(), t0 = performance.now();
        const off = st.load === 'brick' ? 38 : st.load === 'steel' ? 34 : 30;
        const grab = GY - off - 30;
        (function f(n) {
          if (!alive()) return;
          const t = (n - t0) / 1000;
          if (t < .35) { draw(st.pos, GY - 160 + (t / .35) * (grab - GY + 160), false, true); }
          else {
            const k = Math.min(1, (t - .35) / .9);
            const bottom = GY - k * 170;
            if (v === 'ok') tilt = 0;
            else if (v === 'wobble') tilt = Math.sin(t * 12) * 1.2 * k + k * 1.5;
            else if (v === 'fwd') tilt = Math.min(24, k * k * 24);
            else tilt = -Math.min(18, k * k * 18);
            draw(st.pos, bottom - off - 30, true, false);
          }
          if (t < 1.25) requestAnimationFrame(f); else done(v);
        })(t0);
      }
      function done(v) {
        const label = { ok: '튼튼해요', wobble: '흔들흔들', fwd: '앞으로 넘어졌어요!', back: '뒤로 넘어졌어요!' }[v];
        $('#crState').textContent = label; $('#crState').setAttribute('fill', v === 'ok' ? '#3c5f30' : v === 'wobble' ? '#a8700c' : '#9c4524');
        if (v === 'ok' || v === 'wobble') HH.stars($('#crFx'), MX + st.pos * UNIT, GY - 260);
        if (st.phase === 'test') {
          st.results[st.pos] = v;
          const doneAll = [1, 2, 3].every(p => st.results[p]);
          const msg = { ok: `<b>${st.pos}칸</b>에서는 기중기가 <b>끄떡없어</b>!`, wobble: `<b>${st.pos}칸</b>에서는 기중기가 <b>흔들흔들</b>해. 아슬아슬했어!`, fwd: `<b>쿵!</b> <b>${st.pos}칸</b>에서는 기중기가 <b>앞으로 넘어졌어</b>!` }[v];
          say(v === 'fwd' ? 'squirrel' : 'owl', msg + (doneAll ? ' 세 자리를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ''), v === 'ok');
        } else {
          const ok = v === 'ok' || v === 'wobble';
          if (ok) {
            const newly = [];
            const hit = (id, c) => { if (c && !st.missions[id]) { st.missions[id] = true; newly.push(id); } };
            hit('box4', st.load === 'box' && st.pos === 4); hit('brick4', st.load === 'brick' && st.pos === 4); hit('steel3', st.load === 'steel' && st.pos >= 3);
            say('owl', `${josa(LOADS[st.load].name, '을', '를')} <b>${st.pos}칸</b>까지 무사히 옮겼어!` + (newly.length ? ' 미션 성공!' : ''), true);
            if ((st.missions.brick4 || st.missions.steel3) && !HH.hasCard('crane-counter')) setTimeout(() => { if (alive()) counterCard(); }, 1100);
          } else say('squirrel', v === 'fwd' ? '앞으로 넘어졌어! 짐을 <b>가까이</b> 들거나 무게추를 <b>더 달아</b> 봐.' : '어? <b>뒤로</b> 넘어졌어! 무게추가 너무 많은가 봐. 무게추를 <b>줄여</b> 봐.');
        }
        setTimeout(() => { if (!alive()) return; st.busy = false; idle(); renderControls(); }, v === 'fwd' || v === 'back' ? 1800 : 1400);
        renderControls();
      }
      function table() {
        const lab = { ok: ['튼튼해요', '#3c5f30'], wobble: ['흔들흔들', '#a8700c'], fwd: ['넘어졌어요', '#9c4524'] };
        return `<table class="mtable"><thead><tr><th>짐 위치</th><th>기중기</th></tr></thead><tbody>${[1, 2, 3].map(p => { const r = st.results[p]; return `<tr><td><span style="display:block;width:64px">${mini(p, r === 'fwd' ? 14 : 0)}</span><span style="font-size:13px">${p}칸 (${POS[p]})</span></td><td>${r ? `<span style="font-family:var(--display);font-size:18px;color:${lab[r][1]}">${lab[r][0]}</span>` : '<span class="wait">?</span>'}</td></tr>`; }).join('')}</tbody></table>`;
      }
      const MISSIONS = [{ id: 'box4', text: '상자를 4칸까지 옮기기' }, { id: 'brick4', text: '벽돌 묶음을 4칸까지 옮기기' }, { id: 'steel3', text: '철근 다발을 3칸 넘게 옮기기' }];
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">짐을 어디에서 들까?</p><div class="angles">${[1, 2, 3].map(p => `<button type="button" class="ang ${st.pos === p ? 'on' : ''}" data-pos="${p}" style="--c:#a8700c" ${st.busy ? 'disabled' : ''} aria-pressed="${st.pos === p}">${mini(p)}<span>${p}칸 · ${POS[p]}</span>${st.results[p] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>짐과 무게추는 그대로</span><button type="button" class="throw" id="liftBtn" ${st.busy ? 'disabled' : ''}>들어 올리기!</button></div>`;
          side.innerHTML = `<p class="lab">기중기는 어떻게 됐을까?</p>${table()}${[1, 2, 3].every(p => st.results[p]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">옮길 짐</p><div class="angles">${Object.keys(LOADS).map(k => `<button type="button" class="ang ${st.load === k ? 'on' : ''}" data-load="${k}" style="--c:#a8700c" ${st.busy ? 'disabled' : ''}><svg viewBox="-44 -44 88 48" style="max-width:56px" aria-hidden="true">${loadSVG(k)}</svg><span style="font-size:13px">${LOADS[k].name}</span>${(() => { let w = '<span class="wts">'; for (let i = 0; i < LOADS[k].w; i++) w += '<svg viewBox="0 0 20 20"><use href="#weight" width="20" height="20"/></svg>'; return w + '</span>'; })()}</button>`).join('')}</div>
            <label class="lab" for="blkR" style="margin-top:10px">무게추 블록: ${st.blocks}개</label><div class="slide"><span>0</span><input type="range" id="blkR" min="0" max="4" value="${st.blocks}" ${st.busy ? 'disabled' : ''}><span>4</span></div>
            <label class="lab" for="posR">짐 위치: ${st.pos}칸</label><div class="slide"><span>가까이</span><input type="range" id="posR" min="1" max="4" value="${st.pos}" ${st.busy ? 'disabled' : ''}><span>멀리</span></div>
            <div class="row" style="margin-top:0"><span></span><button type="button" class="throw" id="liftBtn" ${st.busy ? 'disabled' : ''}>들어 올리기!</button></div>`;
          side.innerHTML = `<p class="lab">배달 미션</p><ul style="list-style:none;margin:0;padding:0;display:grid;gap:6px">${MISSIONS.map(m => `<li style="display:flex;gap:8px;align-items:center;font-size:15px"><span style="flex:none;width:22px;height:22px;border-radius:6px;border:1.5px solid ${st.missions[m.id] ? '#4f7a3f' : '#c9b48a'};background:${st.missions[m.id] ? '#4f7a3f' : '#fff'};color:#fff;display:grid;place-items:center;font-size:14px">${st.missions[m.id] ? '✓' : ''}</span>${m.text}</li>`).join('')}</ul><p style="margin:10px 0 0;font-size:13px;color:var(--ink-soft)">무게추가 너무 많으면 뒤로 넘어질 수도 있어요!</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 기중기가 어떻게 될지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">기중기는 어떻게 됐을까?</p>${table()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); idle(); renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center"><div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 100" aria-hidden="true">${mini(3).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">공사장 · 도구의 힘</p><h2>기중기 기사</h2><p class="lead">커다란 타워 기중기로 벽돌을 옮겨 볼까?<br>짐을 어디에서 들어야 안전할까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const light = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e3ecef"/><rect y="88" width="160" height="12" fill="#ddc9a0"/><text x="80" y="58" text-anchor="middle" font-size="16" font-family="Jua, sans-serif" fill="#3b3226">짐이 가벼워져요</text></svg>`;
        ui.show(`<div class="ov-card">${HH.talk('owl', '벽돌 묶음을 기중기 <b>팔 끝 쪽</b>으로 옮겨서 들면 어떻게 될까?')}
          ${HH.talk('squirrel', '기중기는 엄청 크니까 어디서 들어도 끄떡없을 거야!')}
          <div class="picks"><button type="button" class="pick" data-pick="fine">${mini(3)}<span>그대로 튼튼해요</span></button><button type="button" class="pick" data-pick="tip">${mini(3, 14)}<span>넘어질 수 있어요</span></button><button type="button" class="pick" data-pick="light">${light}<span>짐이 가벼워져요</span></button></div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('crane-far');
        const msg = { tip: '예상이 딱 맞았어! 멀리 들수록 기중기가 <b>기우뚱</b>하다가 넘어졌지.', fine: '도토리랑 같은 생각이었구나! 그런데 3칸에서는 기중기가 <b>넘어졌어</b>.', light: '짐 무게는 그대로야. 그런데 멀리 들수록 기중기가 <b>넘어지기 쉬웠어</b>.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>${table()}
          ${HH.talk('owl', msg + ' 짐이 기둥에서 멀어질수록 기중기를 <b>앞으로 끌어당기는 힘</b>이 커진단다. 동물 시소에서 끝에 앉으면 쿵 내려갔던 것과 같아.')}
          ${HH.talk('squirrel', '그럼 반대쪽에 무거운 걸 달면 버틸 수 있지 않을까?')}
          ${HH.dcard(1, art1(), '무거운 짐을 멀리 들수록 기중기가 넘어지기 쉬워요.', '1칸은 튼튼, 2칸은 흔들흔들, 3칸은 넘어졌어요.')}
          <button type="button" class="btn primary" data-act="play">배달 미션 하기</button></div>`);
      }
      function counterCard() {
        HH.addCard('crane-counter');
        ui.show(`<div class="ov-card">${HH.talk('owl', '반대쪽 무게추가 짐이 당기는 힘을 <b>버텨 줘서</b> 무거운 짐도 멀리 옮길 수 있었어. 하지만 너무 많이 달면 뒤로 넘어지니까 <b>알맞게</b> 달아야 해.')}
          ${HH.dcard(2, art2(), '반대쪽에 무게추를 알맞게 달면 무거운 짐도 멀리 옮길 수 있어요.', '진짜 타워 기중기도 뒤쪽에 무거운 콘크리트 무게추를 달아요.')}
          <button type="button" class="btn primary" data-act="close">계속 옮기기</button></div>`);
      }
      function reset() { if (st.busy) return; fresh(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>기중기 기사</b>가 되어 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'liftBtn') { lift(); return; }
        if (st.busy) return;
        if (b.dataset.pos) { st.pos = +b.dataset.pos; idle(); renderControls(); return; }
        if (b.dataset.load) { st.load = b.dataset.load; idle(); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '벽돌 묶음을 <b>1칸, 2칸, 3칸</b>에서 차례로 들어 보자. 무게추는 1개 그대로야.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); st.pos = 1; setPhase('play'); say('owl', '이제 <b>배달 미션</b>이야! 짐, 무게추 개수, 위치를 골라서 기중기가 넘어지지 않게 옮겨 봐.', true); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('input', e => {
        if (e.target.id === 'blkR') { st.blocks = +e.target.value; idle(); root.querySelector('label[for=blkR]').textContent = `무게추 블록: ${st.blocks}개`; }
        if (e.target.id === 'posR') { st.pos = +e.target.value; idle(); root.querySelector('label[for=posR]').textContent = `짐 위치: ${st.pos}칸`; }
      });

      setPhase('intro'); say('owl', '안녕! 오늘은 <b>기중기 기사</b>가 되어 볼 거야.'); intro();
    }
  });
})();
