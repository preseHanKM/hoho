/* 운동장 · 그네 흔들기 */
(function () {
  const { el, rng, josa } = HH;
  const PY = 84, GY = 470, GRAV = 3032, TH0 = 24, DUR = 10;
  const LENS = { short: { name: '짧은 줄', L: 120, color: '#2f8f86' }, mid: { name: '보통 줄', L: 220, color: '#d9822b' }, long: { name: '긴 줄', L: 330, color: '#7c62ad' } };
  const LK = ['short', 'mid', 'long'];
  const RIDERS = { rabbit: { name: '토끼', s: 52 }, bear: { name: '반달곰', s: 74 } };
  const period = L => 2 * Math.PI * Math.sqrt(L / GRAV);

  function swingSVG(px, L, th, rider, color) {
    const r = RIDERS[rider || 'rabbit'];
    return `<g transform="rotate(${th.toFixed(2)} ${px} ${PY})">
      <path d="M${px - 22} ${PY} L${px - 26} ${PY + L} M${px + 22} ${PY} L${px + 26} ${PY + L}" stroke="#6d6a64" stroke-width="1.3"/>
      ${color ? `<path d="M${px - 24} ${PY + L * .5} h4 M${px + 24} ${PY + L * .5} h-4" stroke="${color}" stroke-width="4"/>` : ''}
      <use href="#${rider || 'rabbit'}" x="${px - r.s / 2}" y="${PY + L - r.s + 4}" width="${r.s}" height="${r.s}"/>
      <rect x="${px - 32}" y="${PY + L}" width="64" height="8" rx="2" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".8"/></g>`;
  }
  function mini(L, color) {
    const k = .24, px = 80;
    return `<svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" fill="#dcebef"/><rect y="100" width="160" height="10" fill="#e6d3ab"/><path d="M20 12 H140" stroke="#c9952a" stroke-width="5"/>
      <path d="M${px - 6} 14 L${px - 6} ${14 + L * k} M${px + 6} 14 L${px + 6} ${14 + L * k}" stroke="#6d6a64" stroke-width="1"/><rect x="${px - 12}" y="${14 + L * k}" width="24" height="4" fill="#a8743f"/>
      <path d="M${px - 30} ${20 + L * k} q30 ${10} 60 0" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="2 3"/></svg>`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><path d="M10 10 H150" stroke="#c9952a" stroke-width="4"/>
      <path d="M44 12 V40 M116 12 V80" stroke="#6d6a64" stroke-width="1.2"/><rect x="34" y="40" width="20" height="4" fill="#a8743f"/><rect x="106" y="80" width="20" height="4" fill="#a8743f"/>
      <path d="M28 48 q16 8 32 0" fill="none" stroke="#2f8f86" stroke-width="2"/><path d="M24 54 q20 8 40 0" fill="none" stroke="#2f8f86" stroke-width="2"/><path d="M20 60 q24 8 48 0" fill="none" stroke="#2f8f86" stroke-width="2"/>
      <path d="M96 88 q20 6 40 0" fill="none" stroke="#7c62ad" stroke-width="2"/>
      <text x="44" y="76" text-anchor="middle" font-size="9" fill="#2f8f86">휙휙휙</text><text x="116" y="58" text-anchor="middle" font-size="9" fill="#7c62ad">휘~익</text></svg>`;
  }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#dcebef"/><path d="M10 10 H150" stroke="#c9952a" stroke-width="4"/>
      <g transform="rotate(14 50 12)"><path d="M44 12 V66 M56 12 V66" stroke="#6d6a64" stroke-width="1"/><use href="#rabbit" x="38" y="46" width="24" height="24"/><rect x="38" y="66" width="24" height="4" fill="#a8743f"/></g>
      <g transform="rotate(14 110 12)"><path d="M104 12 V66 M116 12 V66" stroke="#6d6a64" stroke-width="1"/><use href="#bear" x="96" y="38" width="30" height="30"/><rect x="98" y="66" width="24" height="4" fill="#a8743f"/></g>
      <text x="80" y="90" text-anchor="middle" font-size="9" fill="#3b3226">줄 길이가 같으면 나란히</text></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="놀이터 그네에 동물 친구가 타고 흔들리는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="140" cy="60" r="80" fill="url(#sunGlow)"/>
    <path d="M0 300 C140 270 260 286 380 290 C520 294 640 262 780 270 C880 276 950 262 1000 266 L1000 360 L0 360 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="swTrees"></g>
    <rect y="350" width="1000" height="210" fill="#a9c98a"/>
    <ellipse cx="500" cy="${GY + 10}" rx="420" ry="40" fill="url(#sandE)"/>
    <path d="M110 ${GY + 30} L150 ${PY - 6} L190 ${GY + 30} M810 ${GY + 30} L850 ${PY - 6} L890 ${GY + 30}" fill="none" stroke="#c9952a" stroke-width="9" stroke-linejoin="round"/>
    <rect x="140" y="${PY - 12}" width="720" height="14" rx="7" fill="#d9a23a" stroke="#9b7a22" stroke-width=".9"/>
    <g id="swShadows"></g>
    <g id="swSwings"></g>
    <g id="swCounts"></g>
    <g transform="translate(940 140)">
      <circle r="44" fill="#fbfaf6" stroke="#5a5f64" stroke-width="3"/><g id="swTicks"></g>
      <path id="swHand2" d="M0 4 V-36" stroke="#c45f33" stroke-width="3" stroke-linecap="round"/><circle r="3.4" fill="#3b3226"/>
      <text id="swClock" y="24" text-anchor="middle" font-size="15" font-family="Jua, sans-serif" fill="#3b3226">0초</text>
      <text y="64" text-anchor="middle" font-size="12" font-family="Jua, sans-serif" fill="#3b3226">초시계</text>
    </g>
    <g id="swFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>그네(진자)가 한 번 왔다 갔다 하는 시간은 줄 길이로 정해집니다. 줄이 짧을수록 빨리 왔다 갔다 하고, 타는 사람의 무게가 달라도 줄 길이가 같으면 같은 빠르기로 흔들립니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 짧은 줄과 긴 줄 중 어느 그네가 더 자주 왔다 갔다 할까? 도토리는 “긴 그네가 크게 움직이니까 더 빠르다”고 말합니다.</li><li>실험: 10초 동안 왕복한 횟수를 세어 비교합니다. 화면 위 숫자가 저절로 올라갑니다.</li><li>발견: 줄 길이와 왕복 횟수를 막대그래프로 봅니다.</li><li>놀이: 토끼와 반달곰을 두 그네에 태우고 줄 길이를 골라 나란히 흔들리게 만듭니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>엄마와 내가 같은 그네를 타면 누가 더 빨리 흔들릴까?</li><li>괘종시계의 추는 왜 길까?</li><li>실에 지우개를 매달아 흔들어 볼까?</li></ul></div>
    <div><h3>교과 연계</h3><p>1~2학년 통합교과 놀이 활동, 2학년 수학 「시각과 시간」(초 세기)과 「표와 그래프」. 고학년 과학의 진자 개념 맛보기입니다.</p></div>
    <div><h3>참고</h3><p>그네를 아주 크게 흔들 때나 사람이 앉았다 일어설 때는 조금 달라질 수 있습니다. 화면은 작게 흔드는 경우를 나타냈습니다.</p></div>`;

  HH.register({
    id: 'swing',
    cards: [
      { id: 'swing-length', no: 1, text: '그네 줄이 짧을수록 더 빨리 왔다 갔다 해요.', art: art1 },
      { id: 'swing-weight', no: 2, text: '타는 친구가 무거워도 줄 길이가 같으면 똑같이 흔들려요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'swing', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6 q7 8 14 0" fill="none" stroke="#8a6e48" stroke-width="2"/></svg>그네가 한 번 앞으로 갔다가 제자리로 돌아오면 왕복 1번이에요. 10초 동안 세어 봐요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;
      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, len: 'short', results: {}, running: false, play: [{ len: 'mid', rider: 'rabbit' }, { len: 'mid', rider: 'bear' }] }); }
      fresh();

      (function () {
        const R = rng(29);
        const t = $('#swTrees'); [30, 90, 950, 980].forEach(x => HH.tree(t, x, 348, .8 + R() * .4));
        const tk = $('#swTicks');
        for (let s = 0; s < 10; s++) { const a = s / 10 * Math.PI * 2; el('path', { d: `M${(Math.sin(a) * 34).toFixed(1)} ${(-Math.cos(a) * 34).toFixed(1)} L${(Math.sin(a) * 41).toFixed(1)} ${(-Math.cos(a) * 41).toFixed(1)}`, stroke: '#3b3226', 'stroke-width': s % 5 ? 1 : 2 }, tk); }
      })();

      function swingsNow() { return st.phase === 'play' ? st.play.map((p, i) => ({ px: i ? 650 : 350, L: LENS[p.len].L, rider: p.rider, color: LENS[p.len].color })) : [{ px: 500, L: LENS[st.len].L, rider: 'rabbit', color: LENS[st.len].color }]; }
      function draw(t, counts) {
        let g = '', sh = '', cn = '';
        swingsNow().forEach((s, i) => {
          const T = period(s.L), th = t == null ? TH0 : TH0 * Math.cos(2 * Math.PI * t / T);
          g += swingSVG(s.px, s.L, th, s.rider, s.color);
          const sx = s.px - Math.sin(th * Math.PI / 180) * s.L;
          sh += `<ellipse cx="${sx.toFixed(1)}" cy="${GY + 6}" rx="30" ry="6" fill="#7d6744" opacity=".2"/>`;
          if (counts) cn += `<g transform="translate(${s.px} ${PY - 34})"><rect x="-58" y="-18" width="116" height="28" rx="8" fill="#fffdf6" stroke="${s.color}" stroke-width="1.4"/><text y="2" text-anchor="middle" font-size="16" font-family="Jua, sans-serif" fill="#3b3226">왕복 ${counts[i]}번</text></g>`;
        });
        $('#swSwings').innerHTML = g; $('#swShadows').innerHTML = sh; $('#swCounts').innerHTML = cn;
      }
      function clock(t) { $('#swHand2').setAttribute('transform', `rotate(${(t / 10 * 360).toFixed(1)})`); $('#swClock').textContent = `${Math.min(DUR, Math.floor(t))}초`; }
      function run() {
        if (st.running) return; st.running = true; renderControls();
        const sw = swingsNow(), t0 = performance.now();
        (function f(n) {
          if (!alive()) return;
          const t = (n - t0) / 1000, counts = sw.map(s => Math.floor(Math.min(t, DUR) / period(s.L)));
          draw(Math.min(t, DUR), counts); clock(Math.min(t, DUR));
          if (t < DUR) requestAnimationFrame(f); else finished(counts);
        })(t0);
      }
      function finished(counts) {
        st.running = false;
        if (st.phase === 'test') {
          st.results[st.len] = counts[0];
          const done = LK.every(k => st.results[k] != null);
          say('owl', `<b>${LENS[st.len].name}</b> 그네는 10초 동안 <b>${counts[0]}번</b> 왔다 갔다 했어.` + (done ? ' 세 가지를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ' 다른 줄 길이도 해 볼까?'), st.len === 'short');
        } else {
          const [a, b] = st.play;
          if (counts[0] === counts[1] && a.len === b.len) {
            HH.stars($('#swFx'), 500, 200);
            say('owl', `두 그네가 <b>나란히</b> ${counts[0]}번씩 흔들렸어!` + (a.rider !== b.rider ? ' 토끼와 반달곰은 무게가 다른데도 말이야!' : ''), true);
            if (a.rider !== b.rider && !HH.hasCard('swing-weight')) setTimeout(() => { if (alive()) weightCard(); }, 900);
          } else say('squirrel', `왼쪽은 ${counts[0]}번, 오른쪽은 ${counts[1]}번이야. 두 그네가 나란히 흔들리려면 무엇을 똑같이 해야 할까?`);
        }
        renderControls();
      }
      function chart() {
        const base = 120, max = 10, hMax = 92;
        let s = `<svg class="chart" viewBox="0 0 300 180" role="img" aria-label="줄 길이별 10초 동안 왕복한 횟수"><text x="4" y="13" class="ax">10초 동안 왕복 횟수</text>`;
        for (let k = 0; k <= 10; k += 5) { const y = base - k / max * hMax; s += `<line x1="34" x2="292" y1="${y}" y2="${y}" stroke="#d8ccb2" stroke-width="${k ? .7 : 1.2}"/><text x="28" y="${y + 4}" text-anchor="end" class="ax">${k}</text>`; }
        LK.forEach((k, i) => {
          const cx = 82 + i * 84, r = st.results[k], c = LENS[k];
          s += r == null ? `<rect x="${cx - 24}" y="${base - 40}" width="48" height="40" rx="4" fill="none" stroke="#b8ab90" stroke-dasharray="4 4"/><text x="${cx}" y="${base - 14}" text-anchor="middle" class="q">?</text>`
            : `<rect x="${cx - 24}" y="${(base - r / max * hMax).toFixed(1)}" width="48" height="${(r / max * hMax).toFixed(1)}" rx="4" fill="${c.color}" fill-opacity=".85"/><text x="${cx}" y="${(base - r / max * hMax - 6).toFixed(1)}" text-anchor="middle" class="val">${r}</text>`;
          s += `<path d="M${cx} ${base + 6} V${base + 6 + c.L / 14}" stroke="#6d6a64" stroke-width="1.4"/><rect x="${cx - 8}" y="${base + 6 + c.L / 14}" width="16" height="3" fill="#a8743f"/><text x="${cx}" y="${base + 48}" text-anchor="middle" class="nm">${c.name}</text>`;
          if (st.pred === k) s += `<text x="${cx}" y="${base + 62}" text-anchor="middle" class="pred">★ 내 예상</text>`;
        });
        return s + '</svg>';
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">그네 줄 길이를 골라 봐</p><div class="angles">${LK.map(k => `<button type="button" class="ang ${st.len === k ? 'on' : ''}" data-len="${k}" style="--c:${LENS[k].color}" ${st.running ? 'disabled' : ''} aria-pressed="${st.len === k}">${mini(LENS[k].L, LENS[k].color)}<span>${LENS[k].name}</span>${st.results[k] != null ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="2" fill="#c9b48a" stroke="#7a6a4a" stroke-width=".8"/><path d="M4.5 8 V5.5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="#7a6a4a" stroke-width="1.4"/></svg>미는 힘은 똑같이</span><button type="button" class="throw" id="runBtn" ${st.running ? 'disabled' : ''}>밀어 주기!</button></div>`;
          side.innerHTML = `<p class="lab">몇 번 왔다 갔다 했을까?</p>${chart()}${LK.every(k => st.results[k] != null) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          const col = (i, label) => `<div><p class="lab">${label}</p><div class="angles" style="grid-template-columns:1fr 1fr">${Object.keys(RIDERS).map(r => `<button type="button" class="ang ${st.play[i].rider === r ? 'on' : ''}" data-side="${i}" data-rider="${r}" style="--c:#7c62ad" ${st.running ? 'disabled' : ''}><svg viewBox="0 0 100 100" style="max-width:40px" aria-hidden="true"><use href="#${r}" width="100" height="100"/></svg><span style="font-size:13px">${RIDERS[r].name}</span></button>`).join('')}</div>
            <div class="angles" style="margin-top:6px">${LK.map(k => `<button type="button" class="ang ${st.play[i].len === k ? 'on' : ''}" data-side="${i}" data-plen="${k}" style="--c:${LENS[k].color};padding:6px 2px" ${st.running ? 'disabled' : ''}><span style="font-size:13px">${LENS[k].name}</span></button>`).join('')}</div></div>`;
          c.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${col(0, '왼쪽 그네')}${col(1, '오른쪽 그네')}</div><div class="row"><span></span><button type="button" class="throw" id="runBtn" ${st.running ? 'disabled' : ''}>같이 밀어 주기!</button></div>`;
          side.innerHTML = `<p class="lab">짝꿍 그네 미션</p><p style="margin:0;font-size:15px">두 그네가 10초 동안 <b style="font-family:var(--display);font-weight:400">나란히</b> 흔들리게 만들어 봐. 토끼와 반달곰을 따로 태워 보면 신기한 걸 발견할 수 있어!</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 어느 그네가 더 자주 왔다 갔다 할지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">몇 번 왔다 갔다 했을까?</p>${chart()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); draw(null); clock(0); renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center"><div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 110" aria-hidden="true">${mini(220, '#d9822b').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">운동장 · 힘과 움직임</p><h2>그네 흔들기</h2><p class="lead">그네 줄이 길면 빨리 흔들릴까, 천천히 흔들릴까?<br>10초 동안 몇 번 왔다 갔다 하는지 세어 보자.</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const eq = `<svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" fill="#dcebef"/><text x="80" y="64" text-anchor="middle" font-size="26" font-family="Jua, sans-serif" fill="#3b3226">짧은 = 긴</text></svg>`;
        ui.show(`<div class="ov-card">${HH.talk('owl', '<b>짧은 줄</b> 그네와 <b>긴 줄</b> 그네를 똑같이 밀어 주면, 10초 동안 <b>더 자주</b> 왔다 갔다 하는 건 어느 쪽일까?')}
          ${HH.talk('squirrel', '긴 그네가 크게 움직이니까 더 빨리 왔다 갔다 할 거야!')}
          <div class="picks"><button type="button" class="pick" data-pick="short">${mini(120, '#2f8f86')}<span>짧은 줄</span></button><button type="button" class="pick" data-pick="long">${mini(330, '#7c62ad')}<span>긴 줄</span></button><button type="button" class="pick" data-pick="same">${eq}<span>똑같아요</span></button></div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('swing-length');
        const msg = { short: '예상이 딱 맞았어! <b>짧은 줄</b> 그네가 가장 자주 왔다 갔다 했지.', long: '도토리랑 같은 생각이었구나! 그런데 <b>짧은 줄</b> 그네가 더 자주 왔다 갔다 했어.', same: '횟수가 달랐어. <b>짧은 줄</b> 그네가 가장 자주 왔다 갔다 했지.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2><div class="ov-chart">${chart()}</div>
          ${HH.talk('owl', msg + ' 줄이 길면 한 번 다녀오는 길이 길어서 <b>천천히</b> 왔다 갔다 한단다.')}
          ${HH.talk('squirrel', '그럼 괘종시계 추가 길쭉한 것도 천천히 똑딱이려고 그런 거구나!')}
          ${HH.dcard(1, art1(), '그네 줄이 짧을수록 더 빨리 왔다 갔다 해요.', `10초 동안 짧은 줄은 ${st.results.short}번, 긴 줄은 ${st.results.long}번 왕복했어요.`)}
          <button type="button" class="btn primary" data-act="play">짝꿍 그네 놀이 하기</button></div>`);
      }
      function weightCard() {
        HH.addCard('swing-weight');
        ui.show(`<div class="ov-card">${HH.talk('owl', '반달곰이 토끼보다 훨씬 무거운데도, 줄 길이가 같으니 <b>똑같이</b> 흔들렸어. 그네가 흔들리는 빠르기는 타는 사람의 무게가 아니라 <b>줄 길이</b>로 정해진단다.')}
          ${HH.dcard(2, art2(), '타는 친구가 무거워도 줄 길이가 같으면 똑같이 흔들려요.', '그래서 엄마와 내가 같은 그네를 타도 흔들리는 빠르기는 같아요.')}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }
      function reset() { if (st.running) return; fresh(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>그네</b>를 흔들어 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'runBtn') { run(); return; }
        if (st.running) return;
        if (b.dataset.len) { st.len = b.dataset.len; draw(null); clock(0); renderControls(); return; }
        if (b.dataset.rider) { st.play[+b.dataset.side].rider = b.dataset.rider; draw(null); clock(0); renderControls(); return; }
        if (b.dataset.plen) { st.play[+b.dataset.side].len = b.dataset.plen; draw(null); clock(0); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '줄 길이를 고르고 <b>밀어 주기!</b>를 눌러 봐. 10초 동안 몇 번 왔다 갔다 하는지 저절로 세어 줄게.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); setPhase('play'); say('owl', '두 그네에 친구를 태우고 줄 길이를 골라 봐. <b>나란히</b> 흔들리게 할 수 있을까?', true); }
        else if (act === 'close') ui.hide();
      });

      setPhase('intro'); say('owl', '안녕! 오늘은 <b>그네</b>를 흔들어 볼 거야.'); intro();
    }
  });
})();
