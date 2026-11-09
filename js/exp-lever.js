/* 공사장 · 지렛대로 바위 들기 */
(function () {
  const { el, rng, josa } = HH;
  const X0 = 190, U = 70, LEN = 8, GY = 452, FY = GY - 32, LIFT = 40;   // lever starts at X0, 8 units long, rests on the fulcrum top FY
  const ROCKS = { small: { name: '작은 돌', w: 2, r: 26 }, big: { name: '큰 바위', w: 6, r: 44 }, huge: { name: '아주 큰 바위', w: 12, r: 58 } };
  const SPOTS = { near: { name: '바위 가까이', a: 2 }, mid: { name: '가운데', a: 4 }, far: { name: '내 쪽 가까이', a: 6 } };
  const SK = ['near', 'mid', 'far'];
  const need = (w, a) => w * a / (LEN - a);

  function rockSVG(r) {
    return `<path d="M${-r} 0 C${-r * 1.05} ${-r * .9} ${-r * .4} ${-r * 1.6} ${r * .2} ${-r * 1.45} C${r * .9} ${-r * 1.3} ${r * 1.1} ${-r * .5} ${r} 0 Z" fill="url(#stoneG)" stroke="#4f4d48" stroke-width=".9"/>
      <path d="M${-r * .5} ${-r * .9} C${-r * .2} ${-r * 1.2} ${r * .2} ${-r * 1.2} ${r * .4} ${-r * 1.05}" fill="none" stroke="#e2dfd8" stroke-width="1.4" opacity=".6"/><circle cx="${r * .3}" cy="${-r * .5}" r="1.4" fill="#55524d"/><circle cx="${-r * .3}" cy="${-r * .4}" r="1.1" fill="#55524d"/>`;
  }
  function fulcrumSVG(x) { return `<g transform="translate(${x} ${GY})"><path d="M-30 0 C-28 -34 28 -34 30 0 Z" fill="url(#barkG)" stroke="#4e3420" stroke-width=".9"/><ellipse cx="0" cy="-30" rx="8" ry="4" fill="#e3c38f" stroke="#8a6440" stroke-width=".7"/></g>`; }
  function mini(a, ang) {
    const k = .16, x0 = 16, fx = x0 + a * U * k;
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e3ecef"/><rect y="78" width="160" height="22" fill="#ddc9a0"/>
      <path d="M${fx - 8} 78 Q${fx} 62 ${fx + 8} 78 Z" fill="#7d5a3a"/>
      <g transform="rotate(${ang || 0} ${fx} 66)"><rect x="${x0}" y="64" width="${LEN * U * k}" height="4" rx="1" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".6"/><g transform="translate(${x0 + 10} 64)">${rockSVG(10)}</g></g>
      <path d="M${fx} 84 v6" stroke="#d9822b" stroke-width="2"/></svg>`;
  }
  const art1 = () => `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#e3ecef"/><rect y="78" width="160" height="18" fill="#ddc9a0"/>
    <path d="M42 78 Q50 62 58 78 Z" fill="#7d5a3a"/><g transform="rotate(10 50 66)"><rect x="18" y="64" width="128" height="4" fill="url(#wood)"/><g transform="translate(30 64)">${rockSVG(14)}</g></g>
    <use href="#squirrel" x="126" y="60" width="26" height="26"/><text x="50" y="92" text-anchor="middle" font-size="8.5" fill="#3b3226">받침은 바위 가까이</text></svg>`;
  const art2 = () => `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#e3ecef"/><rect y="80" width="160" height="16" fill="#ddc9a0"/>
    <path d="M30 80 Q36 68 42 80 Z" fill="#7d5a3a"/><g transform="rotate(14 36 70)"><rect x="18" y="68" width="130" height="4" fill="url(#wood)"/></g>
    <path d="M24 64 V52" stroke="#3c5f30" stroke-width="2"/><path d="M20 56 L24 50 L28 56" fill="none" stroke="#3c5f30" stroke-width="2"/>
    <path d="M140 46 V86" stroke="#9c4524" stroke-width="2"/><path d="M136 82 L140 88 L144 82" fill="none" stroke="#9c4524" stroke-width="2"/>
    <text x="24" y="44" text-anchor="middle" font-size="8" fill="#3c5f30">조금</text><text x="128" y="40" text-anchor="middle" font-size="8" fill="#9c4524">많이</text></svg>`;

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="통나무 받침과 긴 나무판으로 커다란 바위를 들어 올리는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="860" cy="70" r="80" fill="url(#sunGlow)"/>
    <path d="M0 330 C140 300 260 316 380 320 C520 324 640 292 780 300 C880 306 950 292 1000 296 L1000 400 L0 400 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="lvTrees"></g>
    <rect y="${GY - 60}" width="1000" height="${560 - GY + 60}" fill="#ddc9a0"/><g id="lvSpeck"></g>
    <path d="M0 ${GY} H1000" stroke="#b89a62" stroke-width="1"/>
    <g id="lvScene"></g>
    <g id="lvFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>지렛대는 받침점을 무거운 물체 가까이 둘수록 적은 힘으로 들 수 있습니다. 대신 힘을 주는 쪽은 더 많이 움직여야 합니다. (무게 × 받침점까지 거리)가 양쪽에서 맞으면 들립니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 통나무 받침을 어디에 두어야 가장 적은 친구로 바위를 들까? 도토리는 “받침이 내 쪽에 가까워야 힘을 꽉 준다”고 말합니다.</li><li>실험: 받침을 세 자리에 두고 바위가 들릴 때까지 친구들이 한 명씩 올라탑니다.</li><li>발견: 받침 위치와 필요한 친구 수를 비교합니다.</li><li>놀이: 친구 두 명만으로 작은 돌, 큰 바위, 아주 큰 바위를 들어 봅니다. 바위가 올라간 거리와 친구가 누른 거리를 화살표로 비교합니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>동물 시소, 기중기 기사와 어떤 점이 닮았을까?</li><li>병따개, 가위, 장도리는 어디가 받침일까?</li><li>힘이 덜 드는 대신 무엇을 더 해야 했을까?</li></ul></div>
    <div><h3>교과 연계</h3><p>4학년 과학 「물체의 무게」(수평 잡기)와 이어지며, 고학년 과학의 지레 원리를 미리 맛봅니다. 2학년 수학 곱셈과도 연결할 수 있습니다.</p></div>`;

  HH.register({
    id: 'lever',
    cards: [
      { id: 'lever-near', no: 1, text: '받침을 바위 가까이 두면 작은 힘으로 무거운 바위를 들 수 있어요.', art: art1 },
      { id: 'lever-dist', no: 2, text: '힘이 덜 드는 대신, 누르는 쪽은 더 많이 움직여야 해요.', art: art2 }
    ],
    thumb() { return mini(2, 8).replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'lever', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#weight"/></svg>큰 바위는 추 6개 무게, 친구 한 명은 추 1개 무게예요. 나무판 길이는 8칸이에요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;
      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, spot: 'near', a: 2, rock: 'big', friends: 0, lifted: false, results: {}, busy: false, missions: {} }); }
      fresh();

      (function () {
        const R = rng(47);
        const t = $('#lvTrees'); [40, 120, 760, 840, 940].forEach(x => HH.tree(t, x, 392, .8 + R() * .4));
        const sp = $('#lvSpeck'); for (let i = 0; i < 220; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (GY - 56 + R() * 160).toFixed(1), r: (.5 + R() * 1.3).toFixed(2), fill: '#9a8460', 'fill-opacity': (.2 + R() * .4).toFixed(2) }, sp);
      })();

      function draw(ang, arrows) {
        const a = st.a, fx = X0 + a * U, r = ROCKS[st.rock].r;
        let s = fulcrumSVG(fx);
        // lever rotates about the fulcrum top; negative angle lifts the rock end
        s += `<g transform="rotate(${ang.toFixed(2)} ${fx} ${FY})">`;
        s += `<rect x="${X0}" y="${FY - 8}" width="${LEN * U}" height="12" rx="3" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/><path d="M${X0 + 10} ${FY - 3} H${X0 + LEN * U - 10}" stroke="#7a5230" stroke-width=".6" opacity=".6"/>`;
        for (let k = 1; k < LEN; k++) s += `<path d="M${X0 + k * U} ${FY - 8} v4" stroke="#6e4a2b" stroke-width=".8"/>`;
        s += `<g transform="translate(${X0 + 36} ${FY - 8})">${rockSVG(r)}</g>`;
        for (let i = 0; i < Math.min(st.friends, 8); i++) { const col = i % 2, row = Math.floor(i / 2); s += `<use href="#${i % 3 === 2 ? 'rabbit' : 'squirrel'}" x="${X0 + LEN * U - 70 + col * 34}" y="${FY - 52 - row * 30}" width="46" height="46"/>`; }
        s += `</g>`;
        // fulcrum position ruler under the lever
        for (let k = 0; k <= LEN; k++) s += `<text x="${X0 + k * U}" y="${GY + 20}" text-anchor="middle" font-size="12" fill="#5e4428">${k}</text>`;
        s += `<path d="M${fx} ${GY + 26} l-6 8 h12 Z" fill="#d9822b"/>`;
        if (arrows) {
          const dS = Math.sin(liftAngle() * Math.PI / 180) - Math.sin(restAngle() * Math.PI / 180);
          const up = a * U * dS, down = (LEN - a) * U * dS;
          s += `<g stroke-width="3" fill="none"><path d="M${X0 - 26} ${FY - 10} V${FY - 10 - up}" stroke="#3c5f30"/><path d="M${X0 - 32} ${FY - 4 - up} L${X0 - 26} ${FY - 12 - up} L${X0 - 20} ${FY - 4 - up}" stroke="#3c5f30"/>
            <path d="M${X0 + LEN * U + 26} ${FY - 10} V${FY - 10 + down}" stroke="#9c4524"/><path d="M${X0 + LEN * U + 20} ${FY - 16 + down} L${X0 + LEN * U + 26} ${FY - 8 + down} L${X0 + LEN * U + 32} ${FY - 16 + down}" stroke="#9c4524"/></g>
            <text x="${X0 - 26}" y="${FY - 20 - up}" text-anchor="middle" font-size="12" font-family="Jua, sans-serif" fill="#3c5f30">바위</text><text x="${X0 + LEN * U + 26}" y="${FY + down + 6}" text-anchor="middle" font-size="12" font-family="Jua, sans-serif" fill="#9c4524">누른 만큼</text>`;
        }
        $('#lvScene').innerHTML = s;
      }
      // at rest the rock end lies on the ground; lifted, the friends' end touches the ground (clockwise = positive)
      const restAngle = () => -Math.asin((GY - 6 - FY) / (st.a * U)) * 180 / Math.PI;
      const liftAngle = () => Math.asin((GY - 6 - FY) / ((LEN - st.a) * U)) * 180 / Math.PI;
      function animateTo(target, ms, arrows, cb) {
        const from = st.ang == null ? restAngle() : st.ang, t0 = performance.now();
        (function f(n) { if (!alive()) return; const k = Math.min(1, (n - t0) / ms), e = 1 - Math.pow(1 - k, 3); st.ang = from + (target - from) * e; draw(st.ang, arrows && k >= 1); if (k < 1) requestAnimationFrame(f); else cb && cb(); })(t0);
      }
      function idle() { st.ang = restAngle(); st.lifted = false; draw(st.ang, false); }

      /* test: friends climb on one by one until the rock lifts (or there's no room) */
      function tryLift() {
        if (st.busy) return; st.busy = true; st.friends = 0; idle(); renderControls();
        const n = need(ROCKS.big.w, st.a), needN = Math.ceil(n - 1e-9);
        let i = 0;
        const step = () => {
          if (!alive()) return;
          st.friends++; i++;
          if (st.friends >= needN) { draw(st.ang, false); animateTo(liftAngle(), 700, true, () => { st.busy = false; st.results[st.spot] = needN; report(needN); renderControls(); }); return; }
          draw(st.ang, false);
          if (st.friends >= 8) { st.busy = false; st.results[st.spot] = needN; report(needN); renderControls(); return; }
          setTimeout(step, 380);
        };
        setTimeout(step, 300);
      }
      function report(n) {
        const done = SK.every(k => st.results[k]);
        const msg = n <= 8 ? `받침을 <b>${SPOTS[st.spot].name}</b>에 두었더니 친구 <b>${n}명</b>이 올라타자 바위가 <b>들렸어</b>!` : `받침을 <b>${SPOTS[st.spot].name}</b>에 두었더니 친구 8명이 올라가도 꿈쩍도 안 해! 계산해 보니 <b>${n}명</b>이나 필요해.`;
        say(n <= 2 ? 'owl' : 'squirrel', msg + (done ? ' 세 자리를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ''), n <= 2);
      }
      function table() {
        return `<table class="mtable"><thead><tr><th>받침 자리</th><th>필요한 친구</th></tr></thead><tbody>${SK.map(k => { const r = st.results[k]; return `<tr><td><span style="display:block;width:64px">${mini(SPOTS[k].a)}</span><span style="font-size:13px">${SPOTS[k].name}</span>${st.pred === k ? '<br><span style="font-size:12px;color:var(--clay-dark)">★ 내 예상</span>' : ''}</td><td>${r ? `<span class="seatno">${r}</span>명` : '<span class="wait">?</span>'}</td></tr>`; }).join('')}</tbody></table>`;
      }
      /* play: only two friends, choose rock and fulcrum */
      function playCheck() {
        const ok = st.friends * (LEN - st.a) >= ROCKS[st.rock].w * st.a - 1e-9 && st.friends > 0;
        if (ok && !st.lifted) {
          st.lifted = true; st.busy = true; renderControls();
          animateTo(liftAngle(), 700, true, () => {
            st.busy = false; HH.stars($('#lvFx'), X0 + 36, FY - 120);
            const was = st.missions[st.rock]; st.missions[st.rock] = true;
            say('owl', `${josa(ROCKS[st.rock].name, '을', '를')} 친구 <b>${st.friends}명</b>으로 들어 올렸어!` + (st.rock === 'huge' ? ' 그런데 바위가 조금 올라가는 동안 친구들은 <b>아주 많이</b> 내려갔지?' : ''), true);
            if (st.rock === 'huge' && !HH.hasCard('lever-dist')) setTimeout(() => { if (alive()) distCard(); }, 1000);
            renderControls();
          });
        } else if (!ok && st.friends > 0 && !st.lifted) say('squirrel', `으랏차! 친구 ${st.friends}명으로는 아직 안 들려. 받침을 옮겨 볼까?`);
      }
      const MISSIONS = [{ id: 'small', text: '작은 돌 들기' }, { id: 'big', text: '큰 바위 들기' }, { id: 'huge', text: '아주 큰 바위 들기' }];
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">통나무 받침을 어디에 둘까?</p><div class="angles">${SK.map(k => `<button type="button" class="ang ${st.spot === k ? 'on' : ''}" data-spot="${k}" style="--c:#a8700c" ${st.busy ? 'disabled' : ''} aria-pressed="${st.spot === k}">${mini(SPOTS[k].a)}<span style="font-size:14px">${SPOTS[k].name}</span>${st.results[k] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>바위는 똑같이</span><button type="button" class="throw" id="tryBtn" ${st.busy ? 'disabled' : ''}>친구들 올라타!</button></div>`;
          side.innerHTML = `<p class="lab">친구 몇 명이 필요할까?</p>${table()}${SK.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">어떤 바위를 들까?</p><div class="angles">${Object.keys(ROCKS).map(k => `<button type="button" class="ang ${st.rock === k ? 'on' : ''}" data-rock="${k}" style="--c:#a8700c" ${st.busy ? 'disabled' : ''}><svg viewBox="-64 -96 128 100" style="max-width:${30 + ROCKS[k].r * .5}px" aria-hidden="true">${rockSVG(ROCKS[k].r)}</svg><span style="font-size:13px">${ROCKS[k].name}</span><span style="font-size:12px;color:var(--ink-soft)">추 ${ROCKS[k].w}개</span></button>`).join('')}</div>
            <label class="lab" for="aR" style="margin-top:10px">받침 위치: ${st.a}칸</label><div class="slide"><span>바위 쪽</span><input type="range" id="aR" min="1" max="7" step="1" value="${st.a}" ${st.busy ? 'disabled' : ''}><span>내 쪽</span></div>
            <div class="row" style="margin-top:0"><button type="button" class="btn small" data-act="off" ${st.friends === 0 || st.busy ? 'disabled' : ''}>내려오기</button><button type="button" class="throw" data-act="on" ${st.friends >= 2 || st.busy ? 'disabled' : ''}>친구 올라타기 (${st.friends}/2)</button></div>`;
          side.innerHTML = `<p class="lab">친구 두 명으로 들기</p><ul style="list-style:none;margin:0;padding:0;display:grid;gap:6px">${MISSIONS.map(m => `<li style="display:flex;gap:8px;align-items:center;font-size:15px"><span style="flex:none;width:22px;height:22px;border-radius:6px;border:1.5px solid ${st.missions[m.id] ? '#4f7a3f' : '#c9b48a'};background:${st.missions[m.id] ? '#4f7a3f' : '#fff'};color:#fff;display:grid;place-items:center;font-size:14px">${st.missions[m.id] ? '✓' : ''}</span>${m.text}</li>`).join('')}</ul><p style="margin:10px 0 0;font-size:13px;color:var(--ink-soft)">받침 위치를 바꿀 때마다 친구들은 내려와요.</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 받침을 어디에 두면 좋을지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">친구 몇 명이 필요할까?</p>${table()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); st.friends = 0; idle(); renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center"><div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 100" aria-hidden="true">${mini(2, 8).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">공사장 · 도구의 힘</p><h2>지렛대로 바위 들기</h2><p class="lead">공사장 길을 커다란 바위가 막고 있어!<br>긴 나무판과 통나무로 바위를 들어 볼까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card">${HH.talk('owl', '나무판 아래 <b>통나무 받침</b>을 어디에 두어야 <b>가장 적은 친구</b>로 바위를 들 수 있을까?')}
          ${HH.talk('squirrel', '받침이 내 쪽에 가까워야 힘을 꽉 줄 수 있을 거야!')}
          <div class="picks">${SK.map(k => `<button type="button" class="pick" data-pick="${k}">${mini(SPOTS[k].a)}<span>${SPOTS[k].name}</span></button>`).join('')}</div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('lever-near');
        const msg = { near: '예상이 딱 맞았어! 받침이 <b>바위 가까이</b> 있을 때 친구 2명이면 충분했지.', far: '도토리랑 같은 생각이었구나! 그런데 받침이 내 쪽에 가까우면 친구가 <b>18명</b>이나 필요했어.', mid: '가운데에서는 친구 6명이 필요했어. <b>바위 가까이</b> 두니까 2명이면 됐지.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>${table()}
          ${HH.talk('owl', msg + ' 받침에서 <b>멀리</b> 누를수록 작은 힘으로도 무거운 걸 들 수 있단다. 이런 도구를 <b>지레</b>라고 해.')}
          ${HH.talk('squirrel', '병따개랑 장도리도 이런 원리구나!')}
          ${HH.dcard(1, art1(), '받침을 바위 가까이 두면 작은 힘으로 무거운 바위를 들 수 있어요.', '바위 가까이 2명, 가운데 6명, 내 쪽 가까이 18명이 필요했어요.')}
          <button type="button" class="btn primary" data-act="play">친구 두 명으로 들기 놀이</button></div>`);
      }
      function distCard() {
        HH.addCard('lever-dist');
        ui.show(`<div class="ov-card">${HH.talk('owl', '아주 큰 바위를 들 때 바위는 <b>조금</b> 올라갔는데, 친구들은 <b>아주 많이</b> 내려갔어. 힘이 덜 드는 대신 더 많이 움직여야 하는 거야. 도르래 엘리베이터에서 줄을 더 많이 당겼던 것과 같지?')}
          ${HH.dcard(2, art2(), '힘이 덜 드는 대신, 누르는 쪽은 더 많이 움직여야 해요.', '도구는 힘을 줄여 주지만, 그만큼 더 많이 움직여야 해요.')}
          <button type="button" class="btn primary" data-act="close">계속 들기</button></div>`);
      }
      function reset() { if (st.busy) return; fresh(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>지렛대</b>로 바위를 들어 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'tryBtn') { tryLift(); return; }
        if (st.busy) return;
        if (b.dataset.spot) { st.spot = b.dataset.spot; st.a = SPOTS[st.spot].a; st.friends = 0; idle(); renderControls(); return; }
        if (b.dataset.rock) { st.rock = b.dataset.rock; st.friends = 0; idle(); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); st.spot = 'near'; st.a = 2; setPhase('test'); say('owl', '받침 자리를 고르고 <b>친구들 올라타!</b>를 눌러 봐. 바위가 들릴 때까지 친구들이 한 명씩 올라갈 거야.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); st.a = 4; st.rock = 'big'; setPhase('play'); say('owl', '이번엔 친구가 <b>두 명</b>뿐이야. 받침을 옮겨서 세 가지 바위를 모두 들어 볼까?', true); }
        else if (act === 'on') { st.friends++; draw(st.ang, false); renderControls(); playCheck(); }
        else if (act === 'off') { st.friends = Math.max(0, st.friends - 1); idle(); renderControls(); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('input', e => { if (e.target.id === 'aR') { st.a = +e.target.value; st.friends = 0; idle(); root.querySelector('label[for=aR]').textContent = `받침 위치: ${st.a}칸`; } });
      root.addEventListener('change', e => { if (e.target.id === 'aR') renderControls(); });

      setPhase('intro'); say('owl', '안녕! 오늘은 <b>지렛대</b>로 바위를 들어 볼 거야.'); intro();
    }
  });
})();
