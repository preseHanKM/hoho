/* 빛과 소리 극장 · 그림자 인형극 */
(function () {
  const { el } = HH;
  /* side-view geometry: lamp lens, screen, track */
  const LX = 140, SX = 880, LY = 474, PMIN = 280, PMAX = 850, PH = 24;   // PH: puppet height in the side view
  /* front-view screen */
  const FX0 = 300, FX1 = 700, FY0 = 48, FY1 = 352, FCX = 500, FCY = 200, BASE = 40, CELL = 40;
  const STATIONS = { near: { name: '손전등 가까이', p: 290 }, mid: { name: '가운데', p: 520 }, far: { name: '스크린 가까이', p: 840 } };
  const SKEYS = ['near', 'mid', 'far'];
  const PUPPETS = {
    rabbit: { name: '토끼', d: 'M-6 18 C-14 18 -17 9 -12 2 C-14 -4 -10 -8 -4 -8 L-7 -20 C-7 -24 -3 -24 -2 -20 L0 -9 L2 -21 C3 -25 7 -24 6 -20 L3 -7 C9 -6 12 -1 10 4 C15 8 14 16 8 18 Z M-15 10 a3.5 3.5 0 1 0 0.1 0 Z' },
    dino: { name: '공룡', d: 'M-21 18 L-16 6 C-19 -2 -11 -8 -3 -6 L5 -16 C9 -20 18 -19 20 -14 C22 -10 16 -8 12 -9 L10 -4 C16 0 16 10 10 14 L12 18 L6 18 L4 13 L-6 13 L-8 18 L-14 18 L-12 10 Z M-12 -4 L-9 -11 L-6 -6 L-3 -13 L0 -7 L3 -14 L5 -12 Z' },
    butterfly: { name: '나비', d: 'M0 -2 C-8 -20 -22 -18 -20 -6 C-18 2 -8 2 0 0 C-8 4 -18 8 -14 16 C-10 22 -2 14 0 4 C2 14 10 22 14 16 C18 8 8 4 0 0 C8 2 18 2 20 -6 C22 -18 8 -20 0 -2 Z M-1 -3 L-6 -14 L-5 -14 L0 -4 Z M1 -3 L6 -14 L5 -14 L0 -4 Z' }
  };
  const MATS = {
    paper: { name: '두꺼운 종이', fill: '#231d29', op: .92, look: '#3b3226' },
    cello: { name: '빨간 셀로판', fill: '#c0392b', op: .38, look: '#d4574a' },
    vinyl: { name: '투명 비닐', fill: '#231d29', op: .07, look: '#cfe3ec' }
  };
  const mag = p => (SX - LX) / (p - LX);
  const PH_REAL = { rabbit: 43, dino: 38, butterfly: 42 };   // silhouette heights in puppet units
  const cells = (p, pup) => Math.max(1, Math.round((PH_REAL[pup || 'rabbit'] || BASE) * mag(p) / CELL));

  /* small pictures */
  function sideMini(p, label) {
    const k = 160 / 1000, M = mag(p), top = LY - 12 + (-12) * ((SX - LX) / (p - LX) - 1), bot = LY + 12 + 12 * (M - 1);
    return `<svg viewBox="0 0 160 70" aria-hidden="true"><rect width="160" height="70" rx="6" fill="#efe7d8"/>
      <polygon points="${LX * k + 6},35 ${SX * k},${(35 - 12 * M * .45).toFixed(1)} ${SX * k},${(35 + 12 * M * .45).toFixed(1)}" fill="#3a3040" opacity=".55"/>
      <rect x="6" y="30" width="14" height="10" rx="2" fill="#6d7a80"/><path d="M20 28 h4 v14 h-4 Z" fill="#f2c230"/>
      <rect x="${(SX * k).toFixed(1)}" y="6" width="4" height="58" fill="#fbf8f0" stroke="#9c8a6a" stroke-width=".6"/>
      <path d="M${(p * k).toFixed(1)} 29 v12" stroke="#3b3226" stroke-width="3" stroke-linecap="round"/><path d="M${(p * k).toFixed(1)} 41 v20" stroke="#8a6440" stroke-width="1.2"/>
      ${label ? `<text x="80" y="66" text-anchor="middle" font-size="9" fill="#6d604c">${label}</text>` : ''}</svg>`;
  }
  function screenMini(scale, mat, puppet) {
    const m = MATS[mat || 'paper'];
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#2e2733"/><rect x="24" y="8" width="112" height="80" fill="#fff6dc" stroke="#8a6440" stroke-width="1.4"/>
      <g transform="translate(80 46) scale(${scale})"><path d="${PUPPETS[puppet || 'rabbit'].d}" fill="${m.fill}" fill-opacity="${m.op}" fill-rule="evenodd"/><path d="M0 18 V60" stroke="${m.fill}" stroke-opacity="${m.op}" stroke-width="2"/></g></svg>`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#2e2733"/>
      <rect x="8" y="10" width="68" height="62" fill="#fff6dc" stroke="#8a6440"/><g transform="translate(42 40) scale(1.25)"><path d="${PUPPETS.rabbit.d}" fill="#231d29" fill-rule="evenodd"/></g>
      <rect x="84" y="10" width="68" height="62" fill="#fff6dc" stroke="#8a6440"/><g transform="translate(118 42) scale(.5)"><path d="${PUPPETS.rabbit.d}" fill="#231d29" fill-rule="evenodd"/></g>
      <text x="42" y="86" text-anchor="middle" font-size="9" fill="#efe7d8">손전등 가까이</text><text x="118" y="86" text-anchor="middle" font-size="9" fill="#efe7d8">스크린 가까이</text></svg>`;
  }
  function art2() {
    let s = `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#2e2733"/>`;
    ['paper', 'cello', 'vinyl'].forEach((k, i) => {
      const m = MATS[k], x = 8 + i * 50;
      s += `<rect x="${x}" y="12" width="44" height="58" fill="#fff6dc" stroke="#8a6440"/><g transform="translate(${x + 22} 40) scale(.8)"><path d="${PUPPETS.butterfly.d}" fill="${m.fill}" fill-opacity="${m.op}" fill-rule="evenodd"/></g>
        <text x="${x + 22}" y="84" text-anchor="middle" font-size="8.5" fill="#efe7d8">${['종이', '셀로판', '비닐'][i]}</text>`;
    });
    return s + '</svg>';
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="극장 스크린에 손전등으로 그림자 인형극을 비추는 장면과, 옆에서 본 모습">
    <defs>
      <radialGradient id="hallG" cx=".5" cy=".3" r=".9"><stop offset="0" stop-color="#4a3f52"/><stop offset="1" stop-color="#1f1a24"/></radialGradient>
      <linearGradient id="velvet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e1d1a"/><stop offset=".5" stop-color="#a8322b"/><stop offset="1" stop-color="#6e1d1a"/></linearGradient>
      <radialGradient id="spotG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe9"/><stop offset=".7" stop-color="#fff1c4"/><stop offset="1" stop-color="#e8d9b0" stop-opacity="0"/></radialGradient>
      <clipPath id="scrClip"><rect x="${FX0}" y="${FY0}" width="${FX1 - FX0}" height="${FY1 - FY0}"/></clipPath>
      <filter id="shBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur id="shBlurAmt" stdDeviation="1"/></filter>
    </defs>
    <rect width="1000" height="560" fill="url(#hallG)"/>
    <!-- curtains -->
    <path d="M0 0 H200 C190 120 210 260 180 400 H0 Z" fill="url(#velvet)"/>
    <path d="M40 0 C30 140 50 280 30 400 M90 0 C80 140 100 280 80 400 M140 0 C130 140 150 280 130 400" stroke="#5a1714" stroke-width="2" fill="none" opacity=".6"/>
    <path d="M1000 0 H800 C810 120 790 260 820 400 H1000 Z" fill="url(#velvet)"/>
    <path d="M960 0 C970 140 950 280 970 400 M910 0 C920 140 900 280 920 400 M860 0 C870 140 850 280 870 400" stroke="#5a1714" stroke-width="2" fill="none" opacity=".6"/>
    <path d="M0 0 H1000 V26 Q975 44 950 26 Q925 44 900 26 Q875 44 850 26 Q825 44 800 26 Q775 44 750 26 Q725 44 700 26 Q675 44 650 26 Q625 44 600 26 Q575 44 550 26 Q525 44 500 26 Q475 44 450 26 Q425 44 400 26 Q375 44 350 26 Q325 44 300 26 Q275 44 250 26 Q225 44 200 26 Q175 44 150 26 Q125 44 100 26 Q75 44 50 26 Q25 44 0 26 Z" fill="#8f2a24" stroke="#d9a23a" stroke-width="1.4"/>
    <!-- screen (front view) -->
    <rect x="${FX0 - 10}" y="${FY0 - 10}" width="${FX1 - FX0 + 20}" height="${FY1 - FY0 + 20}" rx="3" fill="url(#woodD)" stroke="#4e3420" stroke-width="1"/>
    <rect id="scrBack" x="${FX0}" y="${FY0}" width="${FX1 - FX0}" height="${FY1 - FY0}" fill="#d9ceb4"/>
    <g clip-path="url(#scrClip)">
      <circle id="spot" cx="${FCX}" cy="${FCY}" r="300" fill="url(#spotG)"/>
      <g id="grid"></g>
      <g id="shadow" filter="url(#shBlur)"></g>
    </g>
    <g id="scaleMarks"></g>
    <rect x="${FX0 - 18}" y="${FY1 + 8}" width="${FX1 - FX0 + 36}" height="10" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".8"/>
    <text id="shTxt" x="${FX1 + 26}" y="${FY0 + 20}" font-size="16" font-family="Jua, sans-serif" fill="#ffe7a8"></text>
    <!-- audience -->
    <g opacity=".95"><use href="#owl" x="210" y="300" width="64" height="80"/><use href="#rabbit" x="740" y="318" width="56" height="56"/><use href="#raccoon" x="790" y="322" width="56" height="56"/></g>
    <!-- side view -->
    <rect x="20" y="398" width="960" height="152" rx="10" fill="#efe7d8" stroke="#9c8a6a" stroke-width=".9"/>
    <text x="36" y="420" font-size="14" font-family="Jua, sans-serif" fill="#6d604c">옆에서 본 모습</text>
    <g id="cone"></g>
    <rect x="${SX}" y="410" width="8" height="130" fill="#fbf8f0" stroke="#9c8a6a" stroke-width=".8"/>
    <text x="${SX - 6}" y="420" text-anchor="end" font-size="12" fill="#6d604c">스크린</text>
    <g id="sideView"></g>
    <rect x="${PMIN - 10}" y="520" width="${PMAX - PMIN + 20}" height="5" rx="2.5" fill="#c9b48a"/>
    <g id="stationMarks"></g>
    <g transform="translate(70 ${LY})">
      <rect x="0" y="-11" width="60" height="22" rx="4" fill="#6d7a80" stroke="#3f4a50" stroke-width=".8"/>
      <path d="M60 -11 L76 -17 V17 L60 11 Z" fill="#8d9aa0" stroke="#3f4a50" stroke-width=".8"/>
      <rect id="lens" x="74" y="-15" width="4" height="30" fill="#ffe08a"/>
      <rect x="18" y="-14" width="10" height="4" rx="1" fill="#d4574a"/>
      <text x="30" y="30" text-anchor="middle" font-size="12" fill="#6d604c">손전등</text>
    </g>
    <g id="shFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>그림자는 빛이 물체에 가려질 때 물체 뒤쪽에 생깁니다. 물체가 손전등에 가까울수록 그림자가 커지고, 스크린에 가까울수록 작고 또렷해집니다. 빛이 잘 통과하는 물체일수록 그림자가 흐립니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 인형을 손전등에 가까이 가져가면 그림자는? 도토리는 “스크린에 가까워야 커진다”는 흔한 생각을 말합니다.</li><li>실험: 인형을 세 자리에 놓고 스크린의 모눈으로 그림자 키를 잽니다. 아래 ‘옆에서 본 모습’에서 빛이 퍼져 나가는 선을 함께 봅니다.</li><li>발견: 거리와 그림자 크기를 표로 비교합니다.</li><li>놀이: 인형, 재료(종이·셀로판·투명 비닐), 손전등 켜고 끄기로 그림자 미션을 해결합니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>손전등을 끄면 그림자는 어떻게 될까?</li><li>그림자를 크게 만들려면 인형과 손전등 중 무엇을 움직이면 될까?</li><li>창문 유리는 왜 그림자가 거의 생기지 않을까?</li></ul></div>
    <div><h3>교과 연계</h3><p>4학년 과학 「그림자와 거울」(그림자가 생기는 조건, 투명한 물체와 불투명한 물체, 그림자 크기 바꾸기)의 준비 활동. 통합교과의 인형극 놀이와 함께 쓰기 좋습니다.</p></div>
    <div><h3>교실에서 실제로 해 보기</h3><p>교실을 어둡게 하고 손전등과 흰 벽(또는 전지)만 있으면 됩니다. 실제 손전등은 빛이 나오는 부분에 크기가 있어서, 인형이 손전등에 가까울수록 그림자 가장자리가 흐려집니다. 화면에도 이 모습을 넣었습니다.</p></div>`;

  HH.register({
    id: 'shadow',
    cards: [
      { id: 'shadow-size', no: 1, text: '물체가 손전등에 가까울수록 그림자가 커져요.', art: art1 },
      { id: 'shadow-clear', no: 2, text: '빛이 잘 통과하는 물체일수록 그림자가 흐려요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'shadow', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" fill="none" stroke="#8a6e48"/><path d="M2 10 H18 M10 2 V18" stroke="#8a6e48"/></svg>스크린의 모눈 한 칸으로 그림자 키를 재요. 아래쪽은 극장을 옆에서 본 모습이에요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, p: 520, station: null, results: {}, puppet: 'rabbit', mat: 'paper', light: true, missions: {}, matsTried: {}, moving: false }); }
      fresh();

      (function () {
        const g = $('#grid');
        for (let x = FCX - CELL * 5; x <= FX1; x += CELL) el('path', { d: `M${x} ${FY0} V${FY1}`, stroke: '#c4b48c', 'stroke-width': .6, opacity: .7 }, g);
        for (let y = FCY - CELL * 4; y <= FY1; y += CELL) el('path', { d: `M${FX0} ${y} H${FX1}`, stroke: '#c4b48c', 'stroke-width': .6, opacity: .7 }, g);
        const sm = $('#scaleMarks');
        for (let i = 0; i <= 7; i++) { const y = FY1 - i * CELL; if (y < FY0) break; el('path', { d: `M${FX0 - 10} ${y} h-8`, stroke: '#ffe7a8', 'stroke-width': 1 }, sm); const t = el('text', { x: FX0 - 22, y: y + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#ffe7a8' }, sm); t.textContent = i; }
        const t = el('text', { x: FX0 - 22, y: FY0 - 16, 'text-anchor': 'end', 'font-size': 12, fill: '#ffe7a8' }, sm); t.textContent = '칸';
        const s = $('#stationMarks');
        SKEYS.forEach(k => { const x = STATIONS[k].p; el('path', { d: `M${x} 514 l-6 -8 h12 Z`, fill: '#d9822b' }, s); const tx = el('text', { x, y: 542, 'text-anchor': 'middle', 'font-size': 11, fill: '#6d604c' }, s); tx.textContent = STATIONS[k].name; });
      })();

      function render() {
        const p = st.p, M = mag(p), m = MATS[st.mat];
        // side view: puppet on its stick, rays from the lens past the puppet to the screen
        const top = LY - PH / 2, bot = LY + PH / 2;
        const yTop = LY + (top - LY) * M, yBot = LY + (bot - LY) * M;
        let cone = '';
        if (st.light) {
          cone += `<polygon points="${LX},${LY} ${SX},${LY - 66} ${SX},${LY + 66}" fill="#ffe8a0" opacity=".35"/>`;
          cone += `<polygon points="${p},${top} ${SX},${Math.max(410, yTop).toFixed(1)} ${SX},${Math.min(540, yBot).toFixed(1)} ${p},${bot}" fill="#3a3040" opacity="${(m.op * .75).toFixed(2)}"/>`;
          cone += `<path d="M${LX} ${LY} L${SX} ${yTop.toFixed(1)} M${LX} ${LY} L${SX} ${yBot.toFixed(1)}" stroke="#d9a23a" stroke-width="1" stroke-dasharray="4 4"/>`;
          cone += `<path d="M${SX + 10} ${Math.max(410, yTop).toFixed(1)} V${Math.min(540, yBot).toFixed(1)}" stroke="#9c4524" stroke-width="3"/>`;
        }
        $('#cone').innerHTML = cone;
        $('#sideView').innerHTML = `<g transform="translate(${p} ${LY}) scale(${PH / 40})"><path d="${PUPPETS[st.puppet].d}" fill="${m.look}" fill-opacity="${st.mat === 'vinyl' ? .5 : .95}" stroke="#3b3226" stroke-width="1" fill-rule="evenodd"/></g><path d="M${p} ${bot} V520" stroke="#8a6440" stroke-width="2"/>`;
        $('#lens').setAttribute('fill', st.light ? '#ffe08a' : '#7f868d');
        // front view: magnified silhouette, softer edges when far from the screen
        $('#spot').setAttribute('opacity', st.light ? 1 : 0);
        $('#scrBack').setAttribute('fill', st.light ? '#d9ceb4' : '#4a4350');
        const blur = (.4 + 2.6 * (SX - p) / (SX - LX)) / M;
        $('#shBlurAmt').setAttribute('stdDeviation', blur.toFixed(2));
        $('#shadow').innerHTML = st.light ? `<g transform="translate(${FCX} ${FCY}) scale(${M.toFixed(3)})"><path d="${PUPPETS[st.puppet].d}" fill="${m.fill}" fill-opacity="${m.op}" fill-rule="evenodd"/><path d="M0 18 V${((FY1 - FCY) / M + 2).toFixed(1)}" stroke="${m.fill}" stroke-opacity="${m.op}" stroke-width="2.2"/></g>` : '';
        $('#shTxt').textContent = st.light && m.op > .2 ? `그림자 키 ${cells(p, st.puppet)}칸` : '';
      }
      function moveTo(p, done) {
        st.moving = true; renderControls();
        const from = st.p, t0 = performance.now();
        (function f(n) {
          if (!alive()) return;
          const k = Math.min(1, (n - t0) / 700), e = 1 - Math.pow(1 - k, 3);
          st.p = from + (p - from) * e; render();
          if (k < 1) requestAnimationFrame(f); else { st.moving = false; done && done(); renderControls(); }
        })(t0);
      }

      /* ---------- panels ---------- */
      function resultTable() {
        return `<table class="mtable"><thead><tr><th>인형 자리</th><th>그림자 키</th></tr></thead><tbody>${SKEYS.map(k => {
          const r = st.results[k];
          return `<tr><td><span style="display:block;width:110px">${sideMini(STATIONS[k].p)}</span><span style="font-size:13px">${STATIONS[k].name}</span></td><td>${r ? `<span class="seatno">${r}</span>칸<div style="height:8px;width:${r * 18}px;background:#3a3040;border-radius:4px;margin-top:4px"></div>` : '<span class="wait">?</span>'}</td></tr>`;
        }).join('')}</tbody></table>`;
      }
      const MISSIONS = [
        { id: 'big', text: '그림자를 아주 크게 (5칸 이상)' },
        { id: 'small', text: '그림자를 아주 작게 (1칸)' },
        { id: 'color', text: '색깔 있는 그림자 만들기' },
        { id: 'faint', text: '그림자가 거의 안 보이게 하기' },
        { id: 'none', text: '그림자 없애기 (빛 끄기)' }
      ];
      function checkMissions() {
        if (st.phase !== 'play') return;
        const c = cells(st.p, st.puppet), done = [];
        const hit = (id, cond) => { if (cond && !st.missions[id]) { st.missions[id] = true; done.push(id); } };
        hit('big', st.light && st.mat !== 'vinyl' && c >= 5);
        hit('small', st.light && st.mat !== 'vinyl' && c <= 1);
        hit('color', st.light && st.mat === 'cello');
        hit('faint', st.light && st.mat === 'vinyl');
        hit('none', !st.light);
        if (st.light) st.matsTried[st.mat] = true;
        if (done.length) {
          HH.stars($('#shFx'), FCX, FCY);
          const msg = { big: '우와, <b>괴물처럼 커다란</b> 그림자야!', small: '<b>꼬마</b> 그림자가 됐어!', color: '빨간 셀로판은 <b>빨간 그림자</b>가 생겼어!', faint: '투명 비닐은 빛이 지나가서 그림자가 <b>거의 안 보여</b>!', none: '빛을 끄니까 그림자도 <b>사라졌어</b>. 그림자는 빛이 있어야 생기는구나!' }[done[0]];
          say('owl', msg + ` (미션 ${Object.keys(st.missions).length}/${MISSIONS.length})`, true);
        }
        if (st.matsTried.paper && st.matsTried.cello && st.matsTried.vinyl && !HH.hasCard('shadow-clear')) setTimeout(() => { if (alive()) clearCard(); }, 1100);
      }
      function renderControls() {
        const c = $('#controls'), sidebox = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">인형을 어디에 놓을까?</p><div class="angles">${SKEYS.map(k => `<button type="button" class="ang ${st.station === k ? 'on' : ''}" data-station="${k}" style="--c:#d9822b" ${st.moving ? 'disabled' : ''} aria-pressed="${st.station === k}">${sideMini(STATIONS[k].p)}<span style="font-size:14px">${STATIONS[k].name}</span>${st.results[k] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <p style="margin:10px 0 0;font-size:14px;color:var(--ink-soft)">자리를 고르면 인형이 움직이고, 스크린의 모눈으로 그림자 키를 재요.</p>`;
          sidebox.innerHTML = `<p class="lab">그림자는 몇 칸일까?</p>${resultTable()}${SKEYS.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<label class="lab" for="posR">인형 위치</label><div class="slide"><span>손전등 쪽</span><input type="range" id="posR" min="${PMIN}" max="${PMAX}" step="2" value="${Math.round(st.p)}"><span>스크린 쪽</span></div>
            <p class="lab">인형</p><div class="angles">${Object.keys(PUPPETS).map(k => `<button type="button" class="ang ${st.puppet === k ? 'on' : ''}" data-puppet="${k}" style="--c:#7c62ad" aria-pressed="${st.puppet === k}"><svg viewBox="-24 -26 48 48" style="max-width:44px" aria-hidden="true"><path d="${PUPPETS[k].d}" fill="#3b3226" fill-rule="evenodd"/></svg><span>${PUPPETS[k].name}</span></button>`).join('')}</div>
            <p class="lab" style="margin-top:10px">인형 재료</p><div class="angles">${Object.keys(MATS).map(k => `<button type="button" class="ang ${st.mat === k ? 'on' : ''}" data-mat="${k}" style="--c:#7c62ad" aria-pressed="${st.mat === k}"><span style="display:block;width:30px;height:22px;border-radius:4px;background:${MATS[k].look};opacity:${k === 'vinyl' ? .6 : 1};border:1px solid #9c8a6a"></span><span style="font-size:14px">${MATS[k].name}</span></button>`).join('')}</div>
            <div class="row"><button type="button" class="btn small" data-act="light">${st.light ? '손전등 끄기' : '손전등 켜기'}</button></div>`;
          sidebox.innerHTML = `<p class="lab">그림자 미션</p><ul style="list-style:none;margin:0;padding:0;display:grid;gap:6px">${MISSIONS.map(m => `<li style="display:flex;gap:8px;align-items:center;font-size:15px"><span style="width:22px;height:22px;border-radius:6px;border:1.5px solid ${st.missions[m.id] ? '#4f7a3f' : '#c9b48a'};background:${st.missions[m.id] ? '#4f7a3f' : '#fff'};color:#fff;display:grid;place-items:center;font-size:14px">${st.missions[m.id] ? '✓' : ''}</span>${m.text}</li>`).join('')}</ul>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 그림자가 어떻게 될지 예상해 봐요.</p>`;
          sidebox.innerHTML = `<p class="lab">그림자는 몇 칸일까?</p>${resultTable()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); render(); }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 96" aria-hidden="true">${screenMini(1.4, 'paper', 'dino').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">빛과 소리 극장 · 빛</p><h2>그림자 인형극</h2>
          <p class="lead">오늘 밤은 그림자 인형극 공연이야!<br>손전등과 인형으로 멋진 그림자를 만들어 볼까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '토끼 인형을 <b>손전등 가까이</b> 가져가면 스크린의 그림자는 어떻게 될까?')}
          ${HH.talk('squirrel', '스크린에서 멀어지니까 그림자가 작아질 거야!')}
          <div class="picks">
            <button type="button" class="pick" data-pick="bigger">${screenMini(1.7)}<span>커져요</span></button>
            <button type="button" class="pick" data-pick="smaller">${screenMini(.6)}<span>작아져요</span></button>
            <button type="button" class="pick" data-pick="same">${screenMini(1)}<span>그대로예요</span></button>
          </div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('shadow-size');
        const msg = { bigger: '예상이 딱 맞았어! 손전등에 가까울수록 그림자가 <b>커졌지</b>.', smaller: '도토리랑 같은 생각이었구나! 그런데 손전등에 가까이 가니까 그림자가 <b>커졌어</b>.', same: '그림자 크기는 달라졌어. 손전등에 가까울수록 <b>커졌지</b>.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${resultTable()}
          ${HH.talk('owl', msg + ' 빛은 손전등에서 <b>퍼져 나가</b>. 그래서 손전등 가까이에서 빛을 가리면 스크린에서 넓게 가려진단다. 아래 옆에서 본 모습의 점선을 봐.')}
          ${HH.talk('squirrel', '스크린에 가까이 두면 작고 또렷하고, 손전등에 가까이 두면 크고 흐릿하구나!')}
          ${HH.dcard(1, art1(), '물체가 손전등에 가까울수록 그림자가 커져요.', '스크린에 가까우면 그림자가 작고 또렷해져요.')}
          <button type="button" class="btn primary" data-act="play">그림자 인형극 하기</button></div>`);
      }
      function clearCard() {
        HH.addCard('shadow-clear');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '두꺼운 종이는 빛을 다 막아서 <b>진한</b> 그림자, 빨간 셀로판은 빛을 조금 통과시켜서 <b>빨간</b> 그림자, 투명 비닐은 빛이 거의 다 지나가서 그림자가 <b>거의 안 보여</b>.')}
          ${HH.dcard(2, art2(), '빛이 잘 통과하는 물체일수록 그림자가 흐려요.', '종이는 진한 그림자, 셀로판은 색깔 그림자, 투명 비닐은 아주 흐린 그림자.')}
          <button type="button" class="btn primary" data-act="close">계속 공연하기</button></div>`);
      }
      function reset() { if (st.moving) return; fresh(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>그림자 인형극</b>을 해 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.station) {
          if (st.moving) return; const k = b.dataset.station; st.station = k;
          moveTo(STATIONS[k].p, () => {
            st.results[k] = cells(STATIONS[k].p);
            const done = SKEYS.every(q => st.results[q]);
            say('owl', `<b>${STATIONS[k].name}</b>에 두었더니 그림자 키가 <b>${st.results[k]}칸</b>이야.` + (k === 'near' ? ' 가장자리가 조금 흐릿하지?' : k === 'far' ? ' 작고 또렷해!' : '') + (done ? ' 세 자리를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ' 다른 자리에도 놓아 볼까?'), k === 'near');
          });
          return;
        }
        if (b.dataset.puppet) { st.puppet = b.dataset.puppet; render(); renderControls(); return; }
        if (b.dataset.mat) { st.mat = b.dataset.mat; render(); renderControls(); checkMissions(); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '인형을 세 자리에 차례로 놓아 보자. 스크린의 <b>모눈 칸</b>으로 그림자 키를 잴 거야.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); setPhase('play'); say('owl', '이제 공연 시간이야! 인형 위치, 인형, 재료를 바꿔서 <b>그림자 미션</b>을 해결해 봐.', true); }
        else if (act === 'light') { st.light = !st.light; render(); renderControls(); checkMissions(); renderControls(); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('input', e => { if (e.target.id === 'posR') { st.p = +e.target.value; render(); } });
      root.addEventListener('change', e => { if (e.target.id === 'posR') { checkMissions(); renderControls(); } });

      setPhase('intro');
      say('owl', '안녕! 오늘은 <b>그림자 인형극</b>을 해 볼 거야.');
      intro();
    }
  });
})();
