/* 운동장 · 동물 시소 */
(function () {
  const { el, rng } = HH;
  const PIV = { x: 500, y: 392 }, SEAT = 88, TOP = 384;
  const ANIMALS = {
    rabbit: { name: '토끼', w: 1, size: 72 },
    raccoon: { name: '너구리', w: 2, size: 90 },
    bear: { name: '반달곰', w: 4, size: 124 }
  };
  const MISSIONS = [
    { right: { kind: 'rabbit', seat: 3 }, give: 'rabbit', say: '먼저 <b>몸무게가 같은 토끼</b>끼리 타 보자. 왼쪽 토끼는 몇 번 자리에 앉아야 할까?' },
    { right: { kind: 'rabbit', seat: 4 }, give: 'raccoon', say: '이번엔 <b>너구리</b>야. 너구리는 토끼보다 <b>두 배</b> 무거워. 어디에 앉아야 수평이 될까?' },
    { right: { kind: 'rabbit', seat: 4 }, give: 'bear', say: '마지막은 <b>반달곰</b>! 토끼보다 <b>네 배</b>나 무거워. 수평을 맞출 수 있을까?' }
  ];
  const PLAY_SHELF = ['rabbit', 'rabbit', 'raccoon', 'bear'];

  function anSVG(kind, cls) { return `<svg class="${cls || 'an'}" viewBox="0 0 100 100" aria-hidden="true"><use href="#${kind}" width="100" height="100"/></svg>`; }
  function weights(n) { let s = '<span class="wts" aria-label="무게 ' + n + '">'; for (let i = 0; i < n; i++) s += '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#weight" width="20" height="20"/></svg>'; return s + '</span>'; }

  /* small seesaw picture for cards, picks and thumbs. left/right: [[kind, seat], ...] */
  function miniSeesaw(left, right, tilt, extra) {
    const S = { rabbit: 22, raccoon: 27, bear: 36 };
    let riders = '';
    left.forEach(([k, d]) => { const x = 80 - d * 15.5, s = S[k]; riders += `<g transform="translate(${x} 61)"><use href="#${k}" x="${-s / 2}" y="${-s}" width="${s}" height="${s}"/></g>`; });
    right.forEach(([k, d]) => { const x = 80 + d * 15.5, s = S[k]; riders += `<g transform="translate(${x} 61) scale(-1 1)"><use href="#${k}" x="${-s / 2}" y="${-s}" width="${s}" height="${s}"/></g>`; });
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><rect y="78" width="160" height="18" fill="#e6d3ab"/><line x1="0" y1="78" x2="160" y2="78" stroke="#c9b48a"/>
      <path d="M72 80 L80 62 L88 80 Z" fill="url(#paintR)" stroke="#7d2b23" stroke-width=".7"/>
      <g transform="rotate(${tilt} 80 62)"><rect x="14" y="60" width="132" height="4" rx="1.5" fill="url(#paintY)" stroke="#9b7a22" stroke-width=".6"/>${riders}</g>
      <circle cx="80" cy="62" r="2" fill="url(#metal)" stroke="#555" stroke-width=".4"/>${extra || ''}</svg>`;
  }
  const art1 = () => miniSeesaw([['bear', 1]], [['rabbit', 4]], 0);
  const art2 = () => miniSeesaw([['rabbit', 4], ['raccoon', 2]], [['bear', 2]], 0);

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="놀이터 시소에 동물 친구들이 앉는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="110" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8">
      <path d="M300 90 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/>
      <path d="M720 64 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".85"/>
    </g>
    <path d="M0 290 C140 256 260 276 380 280 C520 284 600 246 740 256 C860 264 940 240 1000 252 L1000 340 L0 340 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="ssTrees"></g>
    <g id="slide" opacity=".9">
      <path d="M112 338 V236 M136 338 V236" stroke="#7d8a92" stroke-width="3"/>
      <path d="M112 250 H136 M112 270 H136 M112 290 H136 M112 310 H136 M112 330 H136" stroke="#7d8a92" stroke-width="2"/>
      <rect x="106" y="226" width="40" height="10" rx="2" fill="url(#paintR)" stroke="#7d2b23" stroke-width=".7"/>
      <path d="M146 228 C190 236 214 300 262 334 L262 342 C208 312 186 248 146 238 Z" fill="#7cb3d6" stroke="#3f7aa3" stroke-width=".8"/>
    </g>
    <g id="swing" opacity=".9">
      <path d="M770 340 L796 222 L822 340 M890 340 L864 222 L838 340" fill="none" stroke="#c9952a" stroke-width="4" stroke-linejoin="round"/>
      <path d="M790 224 H870" stroke="#c9952a" stroke-width="5" stroke-linecap="round"/>
      <path d="M812 226 V300 M832 226 V300 M842 226 V292 M860 226 V292" stroke="#6d6a64" stroke-width="1"/>
      <rect x="808" y="300" width="28" height="5" rx="1.5" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".6"/>
      <rect x="838" y="292" width="26" height="5" rx="1.5" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".6"/>
    </g>
    <rect y="330" width="1000" height="14" fill="#a2bd82"/>
    <rect y="340" width="1000" height="220" fill="url(#sandE)"/>
    <g id="ssSpeck"></g>
    <ellipse cx="500" cy="482" rx="400" ry="18" fill="#c8ad7c" opacity=".35"/>
    <g><ellipse cx="148" cy="474" rx="32" ry="11" fill="#3d3a36" stroke="#1f1d1b" stroke-width=".8"/><ellipse cx="148" cy="471" rx="18" ry="5" fill="#6d6a64"/>
       <ellipse cx="852" cy="474" rx="32" ry="11" fill="#3d3a36" stroke="#1f1d1b" stroke-width=".8"/><ellipse cx="852" cy="471" rx="18" ry="5" fill="#6d6a64"/></g>
    <path d="M462 480 L470 480 L504 396 L496 396 Z M538 480 L530 480 L496 396 L504 396 Z" fill="url(#paintR)" stroke="#7d2b23" stroke-width=".8"/>
    <rect x="452" y="476" width="96" height="8" rx="2" fill="#a83a30" stroke="#6e241d" stroke-width=".7"/>
    <text id="levelTxt" x="500" y="250" text-anchor="middle" font-size="34" font-family="Jua, sans-serif" fill="#3c5f30" stroke="#fffaf0" stroke-width="5" paint-order="stroke" opacity="0">수평!</text>
    <g id="plank" transform="rotate(0 500 392)">
      <rect x="130" y="384" width="740" height="15" rx="4" fill="url(#paintY)" stroke="#9b7a22" stroke-width=".9"/>
      <path d="M150 389 C300 387 420 392 860 389 M160 394 C320 395 520 391 850 395" fill="none" stroke="#b08a2a" stroke-width=".6" opacity=".6"/>
      <g id="plates"></g>
      <g id="riders"></g>
      <g transform="translate(500 376)">
        <rect x="-26" y="-6" width="52" height="12" rx="6" fill="#e3efe0" stroke="#5f6f58" stroke-width=".9"/>
        <path d="M-7 -6 V6 M7 -6 V6" stroke="#5f6f58" stroke-width=".7"/>
        <ellipse id="lvBubble" cx="0" cy="0" rx="6" ry="3.6" fill="#f6fbe9" stroke="#8aa070" stroke-width=".7"/>
      </g>
      <g id="hits"></g>
    </g>
    <circle cx="500" cy="392" r="6" fill="url(#metal)" stroke="#555" stroke-width=".8"/>
    <g id="fx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>무거운 쪽은 받침점 가까이, 가벼운 쪽은 멀리 앉으면 수평이 됩니다. (무게 × 받침점까지의 거리)가 양쪽에서 같을 때 수평이 되는 지레의 원리 기초입니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 토끼가 끝에 앉았을 때 곰은 어디에 앉아야 할까? 도토리는 “곰은 너무 무거워서 수평이 안 된다”고 말합니다.</li><li>실험: 토끼끼리, 너구리, 곰 순서로 수평을 맞춥니다. 한쪽으로 기울면 도토리가 옮길 방향을 알려 줍니다.</li><li>발견: 무게와 앉은 자리를 표로 비교합니다.</li><li>놀이: 여러 친구를 함께 태워 수평 문제를 풉니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>곰이 끝에 앉으면 어떻게 될까?</li><li>토끼 두 마리와 너구리 한 마리는 어떻게 비교할 수 있을까?</li><li>우리 반 친구와 시소를 탈 때는 어디에 앉으면 좋을까?</li></ul></div>
    <div><h3>교과 연계</h3><p>4학년 과학 「물체의 무게」(수평 잡기) 준비 활동. ‘곱셈으로 보기’를 켜면 2학년 수학 「곱셈구구」와 연결할 수 있습니다.</p></div>`;

  HH.register({
    id: 'seesaw',
    cards: [
      { id: 'seesaw-near', no: 1, text: '무거운 친구는 가운데 가까이 앉으면 수평이 돼요.', art: art1 },
      { id: 'seesaw-many', no: 2, text: '여러 친구가 함께 타도 수평을 맞출 수 있어요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'seesaw', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#weight"/></svg>추 1개가 토끼 한 마리 무게예요. 시소의 숫자는 가운데에서 몇 번째 자리인지 알려 줘요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, mission: 0, results: [null, null, null], tokens: [], sel: null, showMath: false, solved: 0, wasLevel: false }); }
      fresh();

      /* scenery */
      (function () {
        const R = rng(23), sp = $('#ssSpeck');
        for (let i = 0; i < 300; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (344 + R() * 214).toFixed(1), r: (0.5 + R() * 1.2).toFixed(2), fill: '#a98f62', 'fill-opacity': (0.22 + R() * 0.4).toFixed(2) }, sp);
        const t = $('#ssTrees');
        [30, 300, 360, 420, 600, 660, 720, 940, 990].forEach(x => HH.tree(t, x, 332, 0.8 + R() * 0.45));
        const pl = $('#plates');
        ['L', 'R'].forEach(side => { for (let d = 1; d <= 4; d++) { const x = PIV.x + (side === 'L' ? -1 : 1) * d * SEAT; el('circle', { cx: x, cy: 391.5, r: 8.5, fill: '#fbf3e0', stroke: '#9c7a4c', 'stroke-width': .8 }, pl); const tx = el('text', { x, y: 396, 'text-anchor': 'middle', 'font-size': 12, fill: '#6e4a2b', 'font-family': 'Jua, sans-serif' }, pl); tx.textContent = d; } });
        const h = $('#hits');
        for (let d = 1; d <= 4; d++) { const x = PIV.x - d * SEAT; const c = el('circle', { cx: x, cy: 344, r: 40, fill: '#fff', 'fill-opacity': 0, stroke: 'none', 'data-seat': d, class: 'seat-hit', style: 'cursor:pointer' }, h); c.setAttribute('role', 'button'); c.setAttribute('aria-label', `왼쪽 ${d}번 자리`); }
      })();

      /* tilt with a gentle spring */
      let theta = 0, vel = 0, goal = 0, looping = false;
      function applyTilt() {
        $('#plank').setAttribute('transform', `rotate(${theta.toFixed(2)} ${PIV.x} ${PIV.y})`);
        $('#lvBubble').setAttribute('cx', Math.max(-17, Math.min(17, -theta * 1.6)).toFixed(1));
      }
      function kick() {
        if (looping) return; looping = true; let last = null;
        (function f(n) {
          if (!alive()) { looping = false; return; }
          if (last === null) last = n; const dt = Math.min(.033, (n - last) / 1000); last = n;
          vel += ((goal - theta) * 38 - vel * 7) * dt; theta += vel * dt; applyTilt();
          if (Math.abs(goal - theta) < .02 && Math.abs(vel) < .02) { theta = goal; vel = 0; applyTilt(); looping = false; return; }
          requestAnimationFrame(f);
        })(performance.now());
      }

      const torque = side => st.tokens.filter(t => t.side === side).reduce((a, t) => a + ANIMALS[t.kind].w * t.seat, 0);
      const countSide = side => st.tokens.filter(t => t.side === side).length;
      function isLevel() { return countSide('L') > 0 && countSide('R') > 0 && torque('L') === torque('R'); }

      function drawRiders() {
        const g = $('#riders'); g.innerHTML = '';
        st.tokens.filter(t => t.side).forEach(t => {
          const a = ANIMALS[t.kind], x = PIV.x + (t.side === 'L' ? -1 : 1) * t.seat * SEAT, s = a.size;
          const wrap = el('g', { transform: `translate(${x} ${TOP + 2}) scale(${t.side === 'L' ? 1 : -1} 1)` }, g);
          el('use', { href: `#${t.kind}`, x: -s / 2, y: -s, width: s, height: s }, wrap);
        });
        root.querySelectorAll('.seat-hit').forEach(c => {
          const on = st.sel != null;
          c.setAttribute('stroke', on ? '#c45f33' : 'none'); c.setAttribute('stroke-width', on ? 2 : 0);
          c.setAttribute('stroke-dasharray', '6 5'); c.setAttribute('fill-opacity', on ? .18 : 0);
        });
      }
      function update(fromUser) {
        const d = torque('R') - torque('L');
        goal = (countSide('L') + countSide('R') === 0) ? 0 : Math.max(-12, Math.min(12, d * 3));
        kick(); drawRiders();
        const lv = isLevel();
        $('#levelTxt').setAttribute('opacity', lv ? 1 : 0);
        renderControls();
        if (!fromUser) return;
        if (lv && !st.wasLevel) { HH.stars($('#fx'), PIV.x, 330); onLevel(); }
        else if (!lv && countSide('L') > 0) {
          if (d < 0) say('squirrel', '앗, <b>왼쪽</b>이 쿵 내려갔어! 친구를 <b>가운데 쪽</b>으로 옮겨 볼까?');
          else say('squirrel', '<b>오른쪽</b>이 더 무거워! 친구를 <b>끝 쪽</b>으로 옮기거나 다른 친구를 더 태워 봐.');
        }
        st.wasLevel = lv;
      }

      function onLevel() {
        if (st.phase === 'test') {
          const t = st.tokens.find(k => k.side === 'L');
          st.results[st.mission] = { kind: t.kind, seat: t.seat };
          const last = st.mission === MISSIONS.length - 1;
          say('owl', `<b>수평!</b> ${HH.josa(ANIMALS[t.kind].name, '은', '는')} <b>${t.seat}번 자리</b>에서 수평이 됐어.` + (last ? ' 세 친구를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ' <b>다음 친구</b>를 불러 볼까?'), true);
          renderControls();
        } else if (st.phase === 'play') {
          st.solved++;
          const many = countSide('L') + countSide('R') >= 3;
          say('owl', many ? '<b>수평!</b> 여러 친구가 함께 타도 수평을 맞출 수 있구나!' : '<b>수평!</b> 잘했어. <b>새 문제</b>도 풀어 볼까?', true);
          renderControls();
          if (many && !HH.hasCard('seesaw-many')) setTimeout(() => { if (alive()) manyCard(); }, 900);
        }
      }

      function setMission(i) {
        st.mission = i; st.sel = null; st.wasLevel = false;
        const m = MISSIONS[i];
        st.tokens = [{ id: 'fix', kind: m.right.kind, side: 'R', seat: m.right.seat, locked: true }, { id: 'give', kind: m.give, side: null, seat: null }];
        update(false); say('owl', m.say + ' 친구를 누르고, 시소의 <b>빈 자리</b>를 눌러 봐.');
      }

      function genChallenge() {
        const kinds = ['rabbit', 'raccoon', 'bear'], W = PLAY_SHELF.map(k => ANIMALS[k].w);
        function canMake(T) {
          let ok = false;
          (function rec(seat, used, sum, cnt) {
            if (ok) return; if (sum === T && cnt > 0) { ok = true; return; } if (seat > 4 || sum > T) return;
            rec(seat + 1, used, sum, cnt);
            for (let j = 0; j < W.length; j++) if (!(used & 1 << j)) rec(seat + 1, used | 1 << j, sum + W[j] * seat, cnt + 1);
          })(1, 0, 0, 0);
          return ok;
        }
        for (let t = 0; t < 300; t++) {
          const n = Math.random() < .6 ? 2 : 1, seats = [1, 2, 3, 4].sort(() => Math.random() - .5).slice(0, n);
          const right = seats.map(s => ({ kind: kinds[Math.floor(Math.random() * 3)], seat: s }));
          const T = right.reduce((a, r) => a + ANIMALS[r.kind].w * r.seat, 0);
          if (T >= 3 && canMake(T)) return right;
        }
        return [{ kind: 'rabbit', seat: 4 }];
      }
      function newChallenge() {
        st.sel = null; st.wasLevel = false;
        const right = genChallenge();
        st.tokens = right.map((r, i) => ({ id: 'fix' + i, kind: r.kind, side: 'R', seat: r.seat, locked: true }))
          .concat(PLAY_SHELF.map((k, i) => ({ id: 'p' + i, kind: k, side: null, seat: null })));
        update(false);
        say('owl', '오른쪽 친구들은 그대로 있어. <b>왼쪽</b>에 친구들을 태워서 수평을 맞춰 봐! 여러 명을 태워도 돼.');
      }

      function mathBox() {
        const side = s => { const ts = st.tokens.filter(t => t.side === s); return ts.length ? ts.map(t => `${ANIMALS[t.kind].w}×${t.seat}`).join(' + ') + ` = <b>${torque(s)}</b>` : '<b>0</b>'; };
        const L = torque('L'), R = torque('R');
        return `<div class="mathbox">왼쪽: ${side('L')}<br>오른쪽: ${side('R')}<br>${L === R && L > 0 ? '<b style="color:var(--leaf-dark)">같아요! 수평</b>' : L > R ? '왼쪽이 더 커요' : R > L ? '오른쪽이 더 커요' : ''}</div><p style="margin:6px 0 0;font-size:13px;color:var(--ink-soft)">무게(추 개수) × 자리 번호</p>`;
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        const shelf = st.tokens.filter(t => !t.locked);
        const shelfHTML = shelf.length ? `<div class="shelf">${shelf.map(t => `<button type="button" class="token ${st.sel === t.id ? 'on' : ''} ${t.side ? 'used' : ''}" data-token="${t.id}" aria-pressed="${st.sel === t.id}">${anSVG(t.kind)}<span>${ANIMALS[t.kind].name}</span>${weights(ANIMALS[t.kind].w)}</button>`).join('')}</div>` : '';
        const mathToggle = `<label class="check"><input type="checkbox" id="mathChk" ${st.showMath ? 'checked' : ''}>곱셈으로 보기</label>${st.showMath ? mathBox() : ''}`;
        if (st.phase === 'test' || st.phase === 'discover') {
          const done = st.results[st.mission] != null, last = st.mission === MISSIONS.length - 1;
          c.innerHTML = `<p class="lab">시소에 태울 친구 (${st.mission + 1}/3)</p>${shelfHTML}
            <p style="margin:10px 0 0;font-size:14px;color:var(--ink-soft)">친구를 누르고 시소의 빈 자리를 눌러요. 앉은 친구를 다시 누르면 내려와요.</p>
            ${done && !last ? '<button type="button" class="btn primary wide" data-act="next">다음 친구</button>' : ''}`;
          side.innerHTML = `<p class="lab">어디에서 수평이 됐을까?</p>${resultTable()}${mathToggle}${st.results.every(Boolean) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">왼쪽에 태울 친구</p>${shelfHTML}
            <div class="row"><button type="button" class="btn small" data-act="clear">모두 내리기</button><button type="button" class="btn small" data-act="newq">새 문제</button></div>`;
          side.innerHTML = `<p class="score" style="margin-top:0">수평 맞히기 <b>${st.solved}</b>번</p>${mathToggle}`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 곰이 어디에 앉아야 할지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">어디에서 수평이 됐을까?</p>${resultTable()}`;
        }
      }
      function resultTable() {
        return `<table class="mtable"><thead><tr><th>친구</th><th>무게</th><th>앉은 자리</th></tr></thead><tbody>${MISSIONS.map((m, i) => {
          const r = st.results[i];
          return `<tr><td>${anSVG(m.give)}</td><td>${weights(ANIMALS[m.give].w)}</td><td>${r ? `<span class="seatno">${r.seat}</span>번` : '<span class="wait">?</span>'}</td></tr>`;
        }).join('')}</tbody></table>`;
      }

      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}${anSVG('bear', 'sq')}${anSVG('raccoon', 'sq')}${anSVG('rabbit', 'sq')}</div>
          <p class="eyebrow">운동장 · 힘과 움직임</p><h2>동물 시소</h2>
          <p class="lead">반달곰, 너구리, 토끼가 시소를 타러 왔어.<br>무게가 다른 친구들이 시소를 수평으로 만들 수 있을까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const cross = '<g stroke="#9c4524" stroke-width="3" stroke-linecap="round"><path d="M64 14 l32 32 M96 14 l-32 32"/></g>';
        const picks = [
          ['end', miniSeesaw([['bear', 4]], [['rabbit', 4]], 0), '곰도 끝에'],
          ['near', miniSeesaw([['bear', 1]], [['rabbit', 4]], 0), '곰은 가운데 가까이'],
          ['never', miniSeesaw([['bear', 2]], [['rabbit', 4]], -10, cross), '수평이 안 돼요']
        ];
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '토끼가 오른쪽 <b>맨 끝(4번)</b>에 앉았어. 무거운 반달곰은 <b>어디에</b> 앉아야 수평이 될까?')}
          ${HH.talk('squirrel', '곰은 엄청 무거우니까 수평은 절대 안 될 거야!')}
          <div class="picks">${picks.map(([k, svg, label]) => `<button type="button" class="pick" data-pick="${k}">${svg}<span>${label}</span></button>`).join('')}</div>
          <p style="text-align:center;color:var(--ink-soft)">내 생각과 같은 그림을 골라 봐</p></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('seesaw-near');
        const msg = { near: '예상이 딱 맞았어! 무거운 곰은 <b>가운데 가까이</b> 앉아야 했지.', end: '곰이 끝에 앉으면 곰 쪽이 쿵 내려가 버렸을 거야. 곰은 <b>가운데 가까이</b> 앉아야 했어.', never: '도토리랑 같은 생각이었구나! 그런데 곰이 <b>가운데 가까이</b> 앉으니까 수평이 됐어.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${resultTable()}
          ${HH.talk('owl', msg + ' 무거운 친구일수록 가운데 가까이 앉았어.')}
          ${HH.talk('squirrel', '곰도 토끼랑 시소를 탈 수 있구나! 몰랐어!')}
          ${HH.dcard(1, art1(), '무거운 친구는 가운데 가까이 앉으면 수평이 돼요.', '오른쪽 끝(4번)에 앉은 토끼와 수평을 맞추려면 너구리는 2번, 반달곰은 1번 자리!')}
          <button type="button" class="btn primary" data-act="play">수평 맞히기 놀이 하기</button></div>`);
      }
      function manyCard() {
        HH.addCard('seesaw-many');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '양쪽 친구들의 <b>무게와 자리</b>를 잘 맞추면 여러 명이 타도 수평이 된단다.')}
          ${HH.dcard(2, art2(), '여러 친구가 함께 타도 수평을 맞출 수 있어요.', '토끼(4번)와 너구리(2번)를 함께 태우면 2번 자리의 반달곰과 수평!')}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }
      function reset() {
        fresh(); ui.hide(); setPhase('intro'); theta = 0; vel = 0; goal = 0; applyTilt(); drawRiders(); $('#levelTxt').setAttribute('opacity', 0);
        say('owl', '안녕! 오늘은 <b>시소</b>로 무게 실험을 해 볼 거야.'); intro();
      }

      function seatClick(d) {
        const here = st.tokens.find(t => t.side === 'L' && t.seat === d);
        if (st.sel) {
          const t = st.tokens.find(k => k.id === st.sel);
          if (here && here !== t) { here.side = null; here.seat = null; }
          t.side = 'L'; t.seat = d; st.sel = null; update(true);
        } else if (here) { here.side = null; here.seat = null; update(true); }
        else say('owl', '먼저 아래에서 <b>태울 친구</b>를 골라 줘.');
      }

      root.addEventListener('click', e => {
        const hit = e.target.closest('.seat-hit');
        if (hit) { seatClick(+hit.getAttribute('data-seat')); return; }
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.token) {
          const t = st.tokens.find(k => k.id === b.dataset.token);
          if (t.side) { t.side = null; t.seat = null; st.sel = null; update(true); return; }
          st.sel = st.sel === t.id ? null : t.id; drawRiders(); renderControls();
          if (st.sel) say('owl', `${HH.josa(ANIMALS[t.kind].name, '을', '를')} 골랐어. 이제 시소의 <b>빈 자리</b>를 눌러 봐.`);
          return;
        }
        if (b.dataset.pick) {
          st.pred = b.dataset.pick; ui.hide(); setPhase('test'); setMission(0); return;
        }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'next') setMission(st.mission + 1);
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); setPhase('play'); newChallenge(); }
        else if (act === 'newq') newChallenge();
        else if (act === 'clear') { st.tokens.forEach(t => { if (!t.locked) { t.side = null; t.seat = null; } }); st.sel = null; st.wasLevel = false; update(false); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('change', e => { if (e.target.id === 'mathChk') { st.showMath = e.target.checked; renderControls(); } });

      applyTilt(); setPhase('intro');
      say('owl', '안녕! 오늘은 <b>시소</b>로 무게 실험을 해 볼 거야.');
      intro();
    }
  });
})();
