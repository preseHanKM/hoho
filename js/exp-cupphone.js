/* 빛과 소리 극장 · 실 전화기 */
(function () {
  const { el, rng, josa } = HH;
  const SX = 196, SY = 262, FLOOR = 470;
  const TESTS = { taut: { name: '팽팽하게', color: '#2f8f86' }, slack: { name: '느슨하게', color: '#d9822b' }, pinch: { name: '가운데를 잡기', color: '#7c62ad' } };
  const TK = ['taut', 'slack', 'pinch'];
  const MATS = { yarn: { name: '털실', m: .45, col: '#d4574a', w: 3.2 }, cotton: { name: '면실', m: .75, col: '#efe6d2', w: 1.6 }, fishing: { name: '낚싯줄', m: .9, col: '#9fd3ef', w: 1.1 }, wire: { name: '철사', m: 1, col: '#9aa1a7', w: 1.4 } };
  const FRIENDS = { near: { name: '토끼', who: 'rabbit', x: 450, f: 1 }, mid: { name: '너구리', who: 'raccoon', x: 650, f: .8 }, far: { name: '반달곰', who: 'bear', x: 830, f: .62 } };
  const bars = (m, f) => Math.round(3 * m * f);

  function cup(x, y, dir) {
    return `<g transform="translate(${x} ${y}) rotate(${dir > 0 ? -90 : 90})"><path d="M-11 -14 L-8 10 H8 L11 -14 Z" fill="#fbfaf4" stroke="#9a968c" stroke-width=".9"/><path d="M-11 -14 H11" stroke="#d4574a" stroke-width="2"/><path d="M-6 -6 H6" stroke="#c9c5ba" stroke-width=".7"/></g>`;
  }
  /* point on the string at u (0..1) for each way of holding it */
  function stringPt(mode, x1, u) {
    const x = SX + (x1 - SX) * u;
    if (mode === 'slack') return { x, y: SY + 4 * 130 * u * (1 - u) };
    return { x, y: SY };
  }
  function stringPath(mode, x1) { return mode === 'slack' ? `M${SX} ${SY} Q${(SX + x1) / 2} ${SY + 260} ${x1} ${SY}` : `M${SX} ${SY} L${x1} ${SY}`; }
  function mini(mode) {
    const k = .16, x1 = 120;
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#f3e9d6"/>
      <use href="#squirrel" x="4" y="34" width="34" height="34"/><use href="#rabbit" x="122" y="36" width="32" height="32"/>
      <path d="${mode === 'slack' ? 'M36 46 Q80 96 124 46' : 'M36 46 L124 46'}" fill="none" stroke="#a8875a" stroke-width="1.4"/>
      ${mode === 'pinch' ? '<path d="M76 38 L80 46 L84 38" fill="#7c62ad" stroke="#4f3d75" stroke-width=".8"/><rect x="74" y="30" width="12" height="9" rx="2" fill="#7c62ad"/>' : ''}</svg>`;
  }
  function meter(n) { return `<span style="display:inline-flex;gap:3px;align-items:flex-end">${[0, 1, 2].map(i => `<span style="width:9px;height:${10 + i * 7}px;border-radius:2px;background:${i < n ? '#3c5f30' : '#e7dcc4'}"></span>`).join('')}</span>`; }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#f3e9d6"/><use href="#squirrel" x="4" y="22" width="30" height="30"/><use href="#rabbit" x="126" y="24" width="28" height="28"/>
      <path d="M32 32 H128" stroke="#a8875a" stroke-width="1.4"/><path d="M60 32 l3 -4 l3 8 l3 -8 l3 8 l3 -4" fill="none" stroke="#d9822b" stroke-width="1.4"/>
      <path d="M32 70 Q80 100 128 70" fill="none" stroke="#a8875a" stroke-width="1.2" opacity=".7"/><text x="80" y="62" text-anchor="middle" font-size="8.5" fill="#9c4524">느슨하면 안 들려요</text></svg>`;
  }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#f3e9d6"/>
      ${Object.keys(MATS).map((k, i) => `<path d="M14 ${18 + i * 20} H${40 + MATS[k].m * 100}" stroke="${MATS[k].col}" stroke-width="${MATS[k].w * 1.4}"/><text x="12" y="${14 + i * 20}" font-size="8" fill="#3b3226">${MATS[k].name}</text>`).join('')}
      <path d="M150 14 V86" stroke="#9c4524" stroke-width="1" stroke-dasharray="2 3"/></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="극장 무대 뒤에서 종이컵 실 전화기로 친구에게 말을 보내는 장면">
    <defs><linearGradient id="wallB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9d9bd"/><stop offset="1" stop-color="#dcc6a0"/></linearGradient></defs>
    <rect width="1000" height="560" fill="url(#wallB)"/>
    <path d="M0 0 H70 C60 120 80 260 60 ${FLOOR} H0 Z M1000 0 H930 C940 120 920 260 940 ${FLOOR} H1000 Z" fill="#a8322b"/>
    <g id="cpDeco" opacity=".7"></g>
    <rect y="${FLOOR}" width="1000" height="${560 - FLOOR}" fill="#c79a68"/><g id="cpFloor"></g>
    <g id="cpScene"></g>
    <g id="cpPulses"></g>
    <g id="cpBubbles"></g>
    <g id="cpFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>소리는 물체의 떨림으로 전해집니다. 실 전화기는 컵의 떨림이 실을 따라 전해져 반대쪽 컵을 떨게 합니다. 실이 팽팽해야 떨림이 잘 전해지고, 느슨하거나 중간을 잡으면 떨림이 멈춰 들리지 않습니다. 단단한 줄일수록 떨림이 멀리까지 잘 전해집니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 실을 느슨하게 하면 소리가 잘 들릴까? 도토리는 “늘어진 실로 소리가 편하게 간다”고 말합니다.</li><li>실험: 팽팽하게, 느슨하게, 가운데를 잡기로 바꿔 말을 보내고, 실을 따라 가는 떨림과 들리는 정도를 봅니다.</li><li>발견: 실의 상태와 들리는 정도를 비교합니다.</li><li>놀이: 털실, 면실, 낚싯줄, 철사로 가까이·조금 멀리·아주 멀리 있는 친구에게 말을 보냅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>말할 때 목에 손을 대 보면 무엇이 느껴질까?</li><li>실 전화기 두 개를 엇갈려 묶으면 네 명이 함께 통화할 수 있을까?</li><li>책상에 귀를 대고 톡톡 두드리면 어떻게 들릴까?</li></ul></div>
    <div><h3>교과 연계</h3><p>3학년 과학 「소리의 성질」(소리가 나는 물체는 떨린다, 소리는 여러 물질을 통해 전달된다) 준비 활동. 화면은 소리 없이 떨림을 그림으로 보여 줍니다.</p></div>
    <div><h3>교실에서 실제로 해 보기</h3><p>종이컵 두 개와 실, 이쑤시개만 있으면 됩니다. 실이 컵이나 다른 물건에 닿지 않게 팽팽하게 당기는 것이 중요합니다.</p></div>`;

  HH.register({
    id: 'cupphone',
    cards: [
      { id: 'phone-taut', no: 1, text: '실이 팽팽해야 떨림이 전해져서 소리가 잘 들려요.', art: art1 },
      { id: 'phone-mat', no: 2, text: '단단하고 팽팽한 줄일수록 떨림이 멀리까지 잘 전해져요.', art: art2 }
    ],
    thumb() { return mini('taut').replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'cupphone', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 10 l3 -4 l3 8 l3 -8 l3 8 l3 -4" fill="none" stroke="#d9822b" stroke-width="1.6"/></svg>주황색 물결은 실을 따라 전해지는 떨림이에요. 친구 옆 막대는 들리는 정도예요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;
      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, mode: 'taut', results: {}, busy: false, mat: 'cotton', friend: 'near', missions: {} }); }
      fresh();

      (function () {
        const R = rng(67);
        const d = $('#cpDeco');
        d.innerHTML = `<rect x="150" y="60" width="120" height="150" fill="#fffaf0" stroke="#a89470"/><text x="210" y="100" text-anchor="middle" font-size="18" font-family="Jua, sans-serif" fill="#a8322b">오늘의 공연</text><path d="M170 120 H250 M170 140 H240 M170 160 H250" stroke="#c9b48a" stroke-width="3"/>
          <rect x="740" y="70" width="110" height="140" fill="#fffaf0" stroke="#a89470"/><circle cx="795" cy="125" r="30" fill="#f2c230" opacity=".7"/><text x="795" y="190" text-anchor="middle" font-size="14" font-family="Jua, sans-serif" fill="#7457a8">소리 탐험</text>`;
        const f = $('#cpFloor'); for (let x = 0; x < 1000; x += 90) el('path', { d: `M${x} ${FLOOR} V560`, stroke: '#a87a4c', 'stroke-width': .8, opacity: .6 }, f);
      })();

      const listenerX = () => st.phase === 'play' ? FRIENDS[st.friend].x : 800;
      const mode = () => st.phase === 'play' ? 'taut' : st.mode;
      function drawScene() {
        const x1 = listenerX(), m = mode(), mat = st.phase === 'play' ? MATS[st.mat] : MATS.cotton;
        const who = st.phase === 'play' ? FRIENDS[st.friend].who : 'rabbit';
        let s = `<use href="#squirrel" x="${SX - 128}" y="${SY - 70}" width="120" height="120"/>`;
        s += `<use href="#${who}" x="${x1 + 8}" y="${SY - (who === 'bear' ? 96 : 70)}" width="${who === 'bear' ? 130 : 110}" height="${who === 'bear' ? 130 : 110}" transform="translate(${2 * x1 + 8 + (who === 'bear' ? 130 : 110)} 0) scale(-1 1)"/>`;
        s += `<path d="${stringPath(m, x1)}" fill="none" stroke="#8a7a5c" stroke-width="${mat.w + 1}" opacity=".5"/><path d="${stringPath(m, x1)}" fill="none" stroke="${mat.col}" stroke-width="${mat.w}"/>`;
        s += cup(SX - 4, SY, 1) + cup(x1 + 4, SY, -1);
        if (m === 'pinch') { const mx = (SX + x1) / 2; s += `<g transform="translate(${mx} ${SY})"><use href="#owl" x="-22" y="-18" width="44" height="55"/><rect x="-7" y="-12" width="14" height="12" rx="3" fill="#7c62ad" stroke="#4f3d75" stroke-width=".8"/><path d="M-5 0 L0 5 L5 0" fill="#7c62ad"/></g>`; }
        if (st.phase === 'play') Object.keys(FRIENDS).forEach(k => { if (k === st.friend) return; const f = FRIENDS[k]; s += `<g opacity=".35"><use href="#${f.who}" x="${f.x - 20}" y="${FLOOR - 70}" width="70" height="70"/></g>`; });
        $('#cpScene').innerHTML = s;
      }
      function bubble(x, y, text, faint, anchorRight) {
        const w = Math.max(90, text.length * 15 + 26);
        const bx = anchorRight ? x - w : x;
        return `<g opacity="${faint ? .55 : 1}"><rect x="${bx}" y="${y - 30}" width="${w}" height="34" rx="12" fill="#fffdf6" stroke="#a89470" stroke-width="1"/><path d="M${anchorRight ? x - 24 : x + 24} ${y + 4} l${anchorRight ? 10 : -10} 12 l2 -12 Z" fill="#fffdf6" stroke="#a89470" stroke-width="1"/>
          <text x="${bx + w / 2}" y="${y - 8}" text-anchor="middle" font-size="${faint ? 13 : 17}" font-family="Jua, sans-serif" fill="${faint ? '#a89878' : '#3b3226'}">${text}</text></g>`;
      }
      function send() {
        if (st.busy) return; st.busy = true; renderControls();
        const x1 = listenerX(), m = mode();
        const strength = st.phase === 'play' ? bars(MATS[st.mat].m, FRIENDS[st.friend].f) : m === 'taut' ? 3 : 0;
        const msg = st.phase === 'play' ? `${josa(FRIENDS[st.friend].name, '아', '야')}, 안녕!` : '안녕! 들리니?';
        $('#cpBubbles').innerHTML = bubble(SX - 120, SY - 86, msg, false, false);
        // pulses travel along the string; how far they get and how strong they stay depends on the string
        const stopU = m === 'pinch' ? .5 : 1, decay = m === 'slack' ? 4.5 : st.phase === 'play' ? (1 - MATS[st.mat].m * FRIENDS[st.friend].f) * 2.2 : .2;
        const pulses = [0, .28, .56], t0 = performance.now(), dur = 1.4;
        (function f(n) {
          if (!alive()) return;
          const t = (n - t0) / 1000; let g = '';
          pulses.forEach(p => {
            const u = (t - p) / dur; if (u < 0 || u > stopU) return;
            const amp = Math.exp(-decay * u); if (amp < .08) return;
            const a = stringPt(m, x1, u), b = stringPt(m, x1, Math.min(1, u + .01)), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
            g += `<g transform="translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})" opacity="${amp.toFixed(2)}"><path d="M-14 0 l3.5 -${(7 * amp).toFixed(1)} l3.5 ${(14 * amp).toFixed(1)} l3.5 -${(14 * amp).toFixed(1)} l3.5 ${(14 * amp).toFixed(1)} l3.5 -${(14 * amp).toFixed(1)} l3.5 ${(14 * amp).toFixed(1)} l3.5 -${(7 * amp).toFixed(1)}" fill="none" stroke="#d9822b" stroke-width="2.2" stroke-linejoin="round"/></g>`;
          });
          $('#cpPulses').innerHTML = g;
          if (t < pulses[2] + dur * stopU + .1) requestAnimationFrame(f); else arrive(strength, msg, x1);
        })(t0);
      }
      function arrive(strength, msg, x1) {
        $('#cpPulses').innerHTML = '';
        const heard = strength >= 2 ? msg : strength === 1 ? '…안…녕…?' : '?';
        $('#cpBubbles').innerHTML += bubble(x1 + 30, SY - 96, heard, strength < 2, true) + `<g transform="translate(${x1 + 40} ${SY + 70})">${[0, 1, 2].map(i => `<rect x="${i * 13}" y="${-10 - i * 8}" width="10" height="${10 + i * 8}" rx="2" fill="${i < strength ? '#3c5f30' : '#e7dcc4'}"/>`).join('')}</g>`;
        if (strength >= 2) HH.stars($('#cpFx'), x1 + 20, SY - 60);
        st.busy = false;
        if (st.phase === 'test') {
          st.results[st.mode] = strength;
          const done = TK.every(k => st.results[k] != null);
          const txt = { taut: '실이 <b>팽팽하니까</b> 떨림이 끝까지 전해져서 <b>또렷하게</b> 들렸어!', slack: '실이 <b>느슨하니까</b> 떨림이 가다가 사라져서 <b>들리지 않았어</b>.', pinch: '가운데를 잡았더니 떨림이 <b>거기서 멈춰서</b> 들리지 않았어.' }[st.mode];
          say(strength ? 'owl' : 'squirrel', txt + (done ? ' 세 가지를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ''), strength > 0);
        } else {
          const ok = strength >= 2, f = FRIENDS[st.friend];
          if (ok) { st.missions[st.friend] = true; say('owl', `<b>${MATS[st.mat].name}로</b> ${f.name}에게 말이 <b>또렷하게</b> 전해졌어!`, true); }
          else say('squirrel', `${josa(f.name, '이', '가')} 잘 못 들었대. <b>${josa(MATS[st.mat].name, '은', '는')}</b> 떨림이 ${st.friend === 'far' ? '그렇게 멀리까지' : '잘'} 안 전해지나 봐. 다른 줄은 어때?`);
          if (st.missions.far && !HH.hasCard('phone-mat')) setTimeout(() => { if (alive()) matCard(); }, 1000);
        }
        renderControls();
      }
      function table() {
        return `<table class="mtable"><thead><tr><th>실 잡는 법</th><th>들리는 정도</th></tr></thead><tbody>${TK.map(k => { const r = st.results[k]; return `<tr><td><span style="display:block;width:70px">${mini(k)}</span><span style="font-size:13px">${TESTS[k].name}</span></td><td>${r != null ? `${meter(r)} <span style="font-family:var(--display);font-size:16px;margin-left:6px">${r >= 2 ? '잘 들려요' : '안 들려요'}</span>` : '<span class="wait">?</span>'}</td></tr>`; }).join('')}</tbody></table>`;
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">실을 어떻게 할까?</p><div class="angles">${TK.map(k => `<button type="button" class="ang ${st.mode === k ? 'on' : ''}" data-mode="${k}" style="--c:${TESTS[k].color}" ${st.busy ? 'disabled' : ''} aria-pressed="${st.mode === k}">${mini(k)}<span style="font-size:14px">${TESTS[k].name}</span>${st.results[k] != null ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>실과 거리는 똑같이</span><button type="button" class="throw" id="sendBtn" ${st.busy ? 'disabled' : ''}>말하기!</button></div>`;
          side.innerHTML = `<p class="lab">토끼에게 들렸을까?</p>${table()}${TK.every(k => st.results[k] != null) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">어떤 줄로 만들까?</p><div class="angles" style="grid-template-columns:repeat(4,1fr)">${Object.keys(MATS).map(k => `<button type="button" class="ang ${st.mat === k ? 'on' : ''}" data-mat="${k}" style="--c:#7457a8;padding:8px 2px" ${st.busy ? 'disabled' : ''} aria-pressed="${st.mat === k}"><svg viewBox="0 0 60 20" style="max-width:56px" aria-hidden="true"><path d="M4 10 C20 4 40 16 56 10" fill="none" stroke="${MATS[k].col}" stroke-width="${MATS[k].w * 2}" stroke-linecap="round"/><path d="M4 10 C20 4 40 16 56 10" fill="none" stroke="#5a4a3c" stroke-width=".5"/></svg><span style="font-size:13px">${MATS[k].name}</span></button>`).join('')}</div>
            <p class="lab" style="margin-top:10px">누구에게 보낼까?</p><div class="angles">${Object.keys(FRIENDS).map(k => `<button type="button" class="ang ${st.friend === k ? 'on' : ''}" data-friend="${k}" style="--c:#7457a8" ${st.busy ? 'disabled' : ''}><svg viewBox="0 0 100 100" style="max-width:40px" aria-hidden="true"><use href="#${FRIENDS[k].who}" width="100" height="100"/></svg><span style="font-size:13px">${FRIENDS[k].name} · ${k === 'near' ? '가까이' : k === 'mid' ? '조금 멀리' : '아주 멀리'}</span></button>`).join('')}</div>
            <div class="row"><span></span><button type="button" class="throw" id="sendBtn" ${st.busy ? 'disabled' : ''}>말하기!</button></div>`;
          side.innerHTML = `<p class="lab">또렷하게 전하기 미션</p><ul style="list-style:none;margin:0;padding:0;display:grid;gap:6px">${Object.keys(FRIENDS).map(k => `<li style="display:flex;gap:8px;align-items:center;font-size:15px"><span style="flex:none;width:22px;height:22px;border-radius:6px;border:1.5px solid ${st.missions[k] ? '#4f7a3f' : '#c9b48a'};background:${st.missions[k] ? '#4f7a3f' : '#fff'};color:#fff;display:grid;place-items:center;font-size:14px">${st.missions[k] ? '✓' : ''}</span>${FRIENDS[k].name}에게 또렷하게 전하기</li>`).join('')}</ul><p style="margin:10px 0 0;font-size:13px;color:var(--ink-soft)">줄은 모두 팽팽하게 당겼어요. 줄의 재료에 따라 무엇이 달라질까요?</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 실을 느슨하게 하면 어떻게 될지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">토끼에게 들렸을까?</p>${table()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); $('#cpBubbles').innerHTML = ''; drawScene(); renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center"><div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 100" aria-hidden="true">${mini('taut').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">빛과 소리 극장 · 소리</p><h2>실 전화기</h2><p class="lead">종이컵 두 개를 실로 이었어.<br>도토리의 목소리가 토끼에게 들릴까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const eq = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#f3e9d6"/><text x="80" y="58" text-anchor="middle" font-size="18" font-family="Jua, sans-serif" fill="#3b3226">팽팽 = 느슨</text></svg>`;
        ui.show(`<div class="ov-card">${HH.talk('owl', '실 전화기의 실을 <b>느슨하게</b> 늘어뜨리면 토끼에게 소리가 어떻게 들릴까?')}
          ${HH.talk('squirrel', '실이 늘어지면 소리가 천천히 편하게 갈 거야. 더 잘 들릴걸!')}
          <div class="picks"><button type="button" class="pick" data-pick="better">${mini('slack')}<span>더 잘 들려요</span></button><button type="button" class="pick" data-pick="worse">${mini('slack')}<span>잘 안 들려요</span></button><button type="button" class="pick" data-pick="same">${eq}<span>똑같아요</span></button></div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('phone-taut');
        const msg = { worse: '예상이 딱 맞았어! 느슨한 실로는 <b>들리지 않았지</b>.', better: '도토리랑 같은 생각이었구나! 그런데 느슨한 실로는 <b>들리지 않았어</b>.', same: '들리는 정도가 달랐어. 팽팽할 때만 <b>또렷하게</b> 들렸지.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>${table()}
          ${HH.talk('owl', msg + ' 말을 하면 컵이 <b>떨리고</b>, 그 떨림이 실을 따라 반대쪽 컵까지 전해져. 실이 느슨하거나 중간을 잡으면 떨림이 <b>멈춰</b> 버린단다.')}
          ${HH.talk('squirrel', '목에 손을 대고 말해 보니까 정말 떨려! 소리는 떨림이구나!')}
          ${HH.dcard(1, art1(), '실이 팽팽해야 떨림이 전해져서 소리가 잘 들려요.', '느슨하게 하거나 가운데를 잡으면 들리지 않았어요.')}
          <button type="button" class="btn primary" data-act="play">멀리 있는 친구에게 전하기</button></div>`);
      }
      function matCard() {
        HH.addCard('phone-mat');
        ui.show(`<div class="ov-card">${HH.talk('owl', '보들보들한 털실은 떨림을 <b>삼켜</b> 버려서 가까운 친구에게도 잘 안 들렸어. 단단한 <b>낚싯줄과 철사</b>는 떨림을 멀리 있는 반달곰에게까지 전해 줬지.')}
          ${HH.dcard(2, art2(), '단단하고 팽팽한 줄일수록 떨림이 멀리까지 잘 전해져요.', '털실 → 면실 → 낚싯줄 → 철사 순서로 잘 전해졌어요.')}
          <button type="button" class="btn primary" data-act="close">계속 전화하기</button></div>`);
      }
      function reset() { if (st.busy) return; fresh(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>실 전화기</b>로 이야기를 보내 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'sendBtn') { send(); return; }
        if (st.busy) return;
        if (b.dataset.mode) { st.mode = b.dataset.mode; $('#cpBubbles').innerHTML = ''; drawScene(); renderControls(); return; }
        if (b.dataset.mat) { st.mat = b.dataset.mat; $('#cpBubbles').innerHTML = ''; drawScene(); renderControls(); return; }
        if (b.dataset.friend) { st.friend = b.dataset.friend; $('#cpBubbles').innerHTML = ''; drawScene(); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '실을 잡는 방법을 고르고 <b>말하기!</b>를 눌러 봐. 실을 따라 가는 <b>주황색 떨림</b>을 잘 봐!', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); setPhase('play'); say('owl', '이번엔 줄의 재료를 바꿔 볼 거야. <b>털실, 면실, 낚싯줄, 철사</b> 중 무엇으로 아주 멀리 있는 반달곰에게까지 말을 전할 수 있을까?', true); }
        else if (act === 'close') ui.hide();
      });

      setPhase('intro'); say('owl', '안녕! 오늘은 <b>실 전화기</b>로 이야기를 보내 볼 거야.'); intro();
    }
  });
})();
