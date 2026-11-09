/* 운동장 · 어느 길이 가장 빠를까? (사이클로이드: 가장 빠른 길과 같은 시간 그릇) */
(function () {
  const { el, josa } = HH;
  const W = 360, H = 130, G = 600, V0 = 12;   // every track runs from A(0,0) to B(W,H); y grows downward
  const TRACKS = {
    line: { name: '곧은 길', color: '#2f8f86' },
    cyc: { name: '사이클로이드 길', color: '#d9822b' },
    hill: { name: '완만하다 급경사 길', color: '#3f6fc0' },
    loop: { name: '완만하다 한 바퀴 길', color: '#7c62ad' }
  };
  const TK = ['line', 'cyc', 'hill', 'loop'];
  const PANEL = { line: [20, 14], cyc: [510, 14], hill: [20, 290], loop: [510, 290] };
  const OX = 60, OY = 62;   // A inside each panel

  /* sample each track as a dense list of points */
  function trackPts(k) {
    const pts = [];
    if (k === 'line') for (let i = 0; i <= 200; i++) pts.push([W * i / 200, H * i / 200]);
    else if (k === 'cyc') {
      // solve for the cycloid through B: (θ − sinθ)/(1 − cosθ) = W/H
      let lo = .1, hi = 2 * Math.PI - .01;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; ((m - Math.sin(m)) / (1 - Math.cos(m)) < W / H) ? lo = m : hi = m; }
      const tb = (lo + hi) / 2, R = H / (1 - Math.cos(tb));
      for (let i = 0; i <= 300; i++) { const t = tb * i / 300; pts.push([R * (t - Math.sin(t)), R * (1 - Math.cos(t))]); }
    } else if (k === 'hill') {
      // nearly flat for most of the way, then a late steep plunge into the finish
      for (let i = 0; i <= 300; i++) { const x = W * i / 300, s = x / W; pts.push([x, H * (.14 * s + .86 * Math.pow(s, 5))]); }
    } else {
      const px = W * .5, py = H * .82, r = 30;
      for (let i = 0; i <= 160; i++) { const s = i / 160; pts.push([px * s, py * (3 * s * s - 2 * s * s * s)]); }
      for (let i = 1; i <= 160; i++) { const f = 2 * Math.PI * i / 160; pts.push([px + r * Math.sin(f) + 6 * i / 160, py - r + r * Math.cos(f)]); }
      for (let i = 1; i <= 120; i++) { const s = i / 120; pts.push([px + 6 + (W - px - 6) * s, py + (H - py) * (3 * s * s - 2 * s * s * s)]); }
    }
    return pts;
  }
  /* time to reach each point, from energy conservation (no friction) */
  function timeline(pts, g, h0) {
    const out = [{ x: pts[0][0], y: pts[0][1], t: 0 }]; let t = 0;
    const y0 = h0 == null ? pts[0][1] : h0;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1], [x2, y2] = pts[i], ds = Math.hypot(x2 - x1, y2 - y1);
      const v1 = Math.sqrt(V0 * V0 + 2 * g * Math.max(0, y1 - y0)), v2 = Math.sqrt(V0 * V0 + 2 * g * Math.max(0, y2 - y0));
      t += ds / ((v1 + v2) / 2); out.push({ x: x2, y: y2, t });
    }
    return out;
  }
  const RACE = {}; TK.forEach(k => { const p = trackPts(k); RACE[k] = { pts: p, tl: timeline(p, G), d: 'M' + p.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L') }; });
  const TIMES = {}; TK.forEach(k => TIMES[k] = RACE[k].tl[RACE[k].tl.length - 1].t);
  const RANK = TK.slice().sort((a, b) => TIMES[a] - TIMES[b]);
  function posAt(tl, t) { if (t >= tl[tl.length - 1].t) return tl[tl.length - 1]; let lo = 0, hi = tl.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; tl[m].t <= t ? lo = m : hi = m; } const a = tl[lo], b = tl[hi], k = (t - a.t) / ((b.t - a.t) || 1); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }; }

  function trackMini(k, small) {
    const s = small ? .3 : .36;
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#eef3e6"/>
      <g transform="translate(${small ? 26 : 16} 18) scale(${s})"><path d="${RACE[k].d}" fill="none" stroke="${TRACKS[k].color}" stroke-width="${small ? 10 : 8}" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="0" cy="0" r="12" fill="#3b3226"/><path d="M${W} ${H} v-34" stroke="#d4574a" stroke-width="5"/></g></svg>`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#eef3e6"/>
      <g transform="translate(18 14) scale(.34)"><path d="${RACE.line.d}" fill="none" stroke="#2f8f86" stroke-width="6"/><path d="${RACE.cyc.d}" fill="none" stroke="#d9822b" stroke-width="9"/></g>
      <circle cx="${18 + W * .34 * .55}" cy="${14 + 155 * .34}" r="4" fill="#d9822b"/><text x="104" y="30" font-size="8.5" fill="#d9822b">먼저 가파르게</text><text x="104" y="42" font-size="8.5" fill="#d9822b">= 가장 빨라요</text></svg>`;
  }
  function art2() {
    let d = ''; for (let i = 0; i <= 60; i++) { const t = -Math.PI + 2 * Math.PI * i / 60, R = 18; d += (i ? 'L' : 'M') + (80 + R * (t + Math.sin(t))).toFixed(1) + ' ' + (80 - R * (1 - Math.cos(t))).toFixed(1); }
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#eef3e6"/><path d="${d}" fill="none" stroke="#d9822b" stroke-width="3"/>
      <circle cx="30" cy="48" r="4.5" fill="#e0453a"/><circle cx="48" cy="69" r="4.5" fill="#3f86b8"/><circle cx="62" cy="77" r="4.5" fill="#5aa64a"/><circle cx="80" cy="76" r="5" fill="none" stroke="#3c5f30" stroke-width="1.4" stroke-dasharray="2 2"/>
      <text x="80" y="92" text-anchor="middle" font-size="8.5" fill="#3b3226">모두 동시에 바닥으로</text></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="출발점과 도착점이 같은 네 가지 길에서 구슬이 동시에 굴러 내려가는 경주">
    <rect width="1000" height="560" fill="#eef3e6"/>
    <g id="rcPanels"></g>
    <g id="rcMarbles"></g>
    <g id="rcFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>출발점과 도착점이 같아도, 가장 짧은 곧은 길이 가장 빠르지는 않습니다. 처음에 가파르게 떨어져 빨리 속도를 얻는 사이클로이드 길이 가장 빠릅니다(최단 시간 곡선). 사이클로이드 그릇에서는 어느 높이에서 출발해도 바닥에 동시에 도착합니다(등시 곡선).</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 곧은 길, 사이클로이드 길, 완만하다 급경사 길, 완만하다 한 바퀴 길 중 어디가 가장 빠를까? 도토리는 “가장 짧은 곧은 길이 가장 빠르다”고 말합니다.</li><li>실험: 네 개의 구슬을 동시에 출발시켜 순위와 걸린 시간을 봅니다. 느린 화면으로 다시 볼 수 있습니다.</li><li>발견: 처음 내려가는 기울기와 걸린 시간을 비교합니다.</li><li>놀이: 사이클로이드 그릇과 동그란 그릇에 서로 다른 높이로 구슬을 놓고 동시에 놓아 봅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>짧은 길인데 왜 늦게 도착했을까?</li><li>미끄럼틀이나 스키 점프대는 왜 처음이 가파를까?</li><li>독수리가 먹이를 잡으러 내려올 때는 어떤 길로 내려올까?</li></ul></div>
    <div><h3>교과 연계</h3><p>교과 내용을 넘어서는 심화 탐구입니다. 4~6학년 영재·과학 동아리 활동이나 수학 시간의 곡선 이야기로 쓰기 좋습니다. 저학년에게는 “처음에 쭉 내려가면 빨라진다”는 느낌으로 충분합니다.</p></div>
    <div><h3>참고</h3><p>화면은 마찰과 공기 저항이 없는 경우를 계산했습니다. 실제로 만들 때는 우드락이나 플라스틱 레일로 길을 만들고 같은 구슬을 동시에 놓아 보세요.</p></div>`;

  HH.register({
    id: 'race',
    cards: [
      { id: 'race-cycloid', no: 1, text: '가장 짧은 길보다 처음에 가파르게 내려가는 사이클로이드 길이 더 빨라요.', art: art1 },
      { id: 'race-same', no: 2, text: '사이클로이드 그릇에서는 어느 높이에서 출발해도 바닥에 동시에 도착해요.', art: art2 }
    ],
    thumb() { return trackMini('cyc').replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'race', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="#3b3226"/><path d="M16 18 V8" stroke="#d4574a" stroke-width="2"/></svg>네 길 모두 출발점과 도착점의 높이와 거리가 같아요. 마찰이 없다고 생각하고 계산했어요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;
      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, raced: false, running: false, slow: false, bowls: { cyc: [true, false, true], circ: [true, false, true] } }); }
      fresh();

      /* ---------- race panels ---------- */
      function drawPanels(done) {
        let s = '';
        TK.forEach(k => {
          const [px, py] = PANEL[k], c = TRACKS[k].color, rank = RANK.indexOf(k) + 1;
          s += `<g transform="translate(${px} ${py})"><rect width="470" height="258" rx="12" fill="#fbf8f0" stroke="#d8ccb2"/>
            <text x="18" y="28" font-size="17" font-family="Jua, sans-serif" fill="${c}">${TRACKS[k].name}</text>
            <g transform="translate(${OX} ${OY})">
              <path d="${RACE[k].d}" fill="none" stroke="#5a4a3c" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".25" transform="translate(0 4)"/>
              <path d="${RACE[k].d}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M-14 -10 V22 M-14 -10 L4 -4 L-14 2" fill="#3c5f30" stroke="#3c5f30" stroke-width="1.6"/>
              <path d="M${W} ${H + 4} V${H - 30}" stroke="#6e5a40" stroke-width="1.8"/><path d="M${W} ${H - 30} l10 5 l-10 5 l10 5 l-10 5" fill="none" stroke="#3b3226" stroke-width="1.4"/>
              <path d="M0 ${H} H${W}" stroke="#b8ab90" stroke-dasharray="4 4" stroke-width="1"/>
            </g>
            ${done ? `<g transform="translate(400 30)"><circle r="20" fill="${rank === 1 ? '#f2c230' : '#e7dcc4'}" stroke="${rank === 1 ? '#b8860b' : '#b8ab90'}"/><text y="6" text-anchor="middle" font-size="16" font-family="Jua, sans-serif" fill="#3b3226">${rank}등</text></g><text x="400" y="72" text-anchor="middle" font-size="15" font-family="Jua, sans-serif" fill="#3b3226">${TIMES[k].toFixed(2)}초</text>` : ''}</g>`;
        });
        $('#rcPanels').innerHTML = s;
      }
      function drawMarbles(t) {
        let s = '';
        TK.forEach(k => { const [px, py] = PANEL[k], p = posAt(RACE[k].tl, t); s += `<circle cx="${(px + OX + p.x).toFixed(1)}" cy="${(py + OY + p.y - 9).toFixed(1)}" r="9" fill="${TRACKS[k].color}" stroke="#3b3226" stroke-width="1"/><circle cx="${(px + OX + p.x - 3).toFixed(1)}" cy="${(py + OY + p.y - 12).toFixed(1)}" r="2.6" fill="#fff" opacity=".8"/>`; });
        $('#rcMarbles').innerHTML = s;
      }
      function race() {
        if (st.running) return; st.running = true; drawPanels(false); renderControls();
        const speed = st.slow ? .35 : 1, end = Math.max(...TK.map(k => TIMES[k])), t0 = performance.now();
        const finished = {};
        (function f(n) {
          if (!alive()) return;
          const t = (n - t0) / 1000 * speed; drawMarbles(t);
          TK.forEach(k => { if (!finished[k] && t >= TIMES[k]) { finished[k] = true; const [px, py] = PANEL[k]; HH.stars($('#rcFx'), px + OX + W, py + OY + H - 10); } });
          if (t < end + .05) requestAnimationFrame(f); else { st.running = false; st.raced = true; drawPanels(true); raceDone(); renderControls(); }
        })(t0);
      }
      function raceDone() {
        if (st.phase !== 'test') return;
        say('owl', `<b>${TRACKS[RANK[0]].name}</b>이 <b>1등</b>이야! 가장 짧은 곧은 길은 ${RANK.indexOf('line') + 1}등이었어. <b>발견하기</b>를 눌러 봐!`, true);
      }
      function table() {
        return `<table class="mtable"><thead><tr><th>길</th><th>걸린 시간</th><th>순위</th></tr></thead><tbody>${RANK.map(k => `<tr><td><span style="display:block;width:70px">${trackMini(k, true)}</span><span style="font-size:13px;color:${TRACKS[k].color}">${TRACKS[k].name}</span>${st.pred === k ? '<br><span style="font-size:12px;color:var(--clay-dark)">★ 내 예상</span>' : ''}</td><td>${st.raced ? `<span class="seatno" style="font-size:18px">${TIMES[k].toFixed(2)}</span>초` : '<span class="wait">?</span>'}</td><td>${st.raced ? `<span class="seatno">${RANK.indexOf(k) + 1}</span>등` : '<span class="wait">?</span>'}</td></tr>`).join('')}</tbody></table>`;
      }

      /* ---------- play: same-time bowls ---------- */
      const BG = 200, HEIGHTS = [95, 55, 18], MCOL = ['#e0453a', '#3f86b8', '#5aa64a'];
      const CR = 50, RC = 100;   // cycloid size, circle radius
      function cycPt(th) { return [CR * (th + Math.sin(th)), CR * (1 - Math.cos(th))]; }
      function circPt(ph) { return [RC * Math.sin(ph), RC * (1 - Math.cos(ph))]; }
      function bowlPts(type, h) {
        // from the release height on the left side down to the bottom
        const pts = [];
        if (type === 'cyc') { const th0 = -Math.acos(1 - h / CR); for (let i = 0; i <= 200; i++) { const t = th0 * (1 - i / 200); const [x, y] = cycPt(t); pts.push([x, -y]); } }
        else { const p0 = -Math.acos(1 - h / RC); for (let i = 0; i <= 200; i++) { const p = p0 * (1 - i / 200); const [x, y] = circPt(p); pts.push([x, -y]); } }
        return pts;
      }
      function bowlTimeline(type, h) { const pts = bowlPts(type, h).map(([x, y]) => [x, -y]); /* y down = −height */ const tl = []; let t = 0; for (let i = 0; i < pts.length; i++) { if (i) { const [x1, y1] = pts[i - 1], [x2, y2] = pts[i], ds = Math.hypot(x2 - x1, y2 - y1); const v1 = Math.sqrt(2 * BG * Math.max(.5, h - y1)), v2 = Math.sqrt(2 * BG * Math.max(.5, h - y2)); t += ds / ((v1 + v2) / 2); } tl.push({ x: pts[i][0], y: pts[i][1], t }); } return tl; }
      const BOWLS = { cyc: { name: '사이클로이드 그릇', cx: 260, cy: 420, color: '#d9822b' }, circ: { name: '동그란 그릇', cx: 740, cy: 420, color: '#3f6fc0' } };
      function bowlPath(type) {
        let d = '';
        if (type === 'cyc') for (let i = 0; i <= 120; i++) { const t = -Math.PI + 2 * Math.PI * i / 120; const [x, y] = cycPt(t); d += (i ? 'L' : 'M') + (x * 1.6).toFixed(1) + ' ' + (-y * 1.6).toFixed(1); }
        else for (let i = 0; i <= 120; i++) { const p = -Math.PI / 2 + Math.PI * i / 120; const [x, y] = circPt(p); d += (i ? 'L' : 'M') + (x * 1.6).toFixed(1) + ' ' + (-y * 1.6).toFixed(1); }
        return d;
      }
      let bowlTL = null;
      function drawBowls(t, results) {
        let s = '';
        Object.keys(BOWLS).forEach(type => {
          const b = BOWLS[type];
          s += `<g transform="translate(${b.cx} ${b.cy})"><text x="0" y="-${type === 'cyc' ? 188 : 188}" text-anchor="middle" font-size="18" font-family="Jua, sans-serif" fill="${b.color}">${b.name}</text>
            <path d="${bowlPath(type)}" fill="none" stroke="#5a4a3c" stroke-width="12" stroke-linecap="round" opacity=".18" transform="translate(0 5)"/>
            <path d="${bowlPath(type)}" fill="none" stroke="${b.color}" stroke-width="7" stroke-linecap="round"/>
            <circle cx="0" cy="0" r="16" fill="none" stroke="#3c5f30" stroke-width="1.6" stroke-dasharray="3 3"/><text x="0" y="34" text-anchor="middle" font-size="13" fill="#3c5f30">바닥</text>`;
          st.bowls[type].forEach((on, i) => {
            if (!on) return;
            let p;
            if (t == null) { const pts = bowlPts(type, HEIGHTS[i]); p = { x: pts[0][0], y: -pts[0][1] }; }
            else p = posAt(bowlTL[type][i], t);
            s += `<circle cx="${(p.x * 1.6).toFixed(1)}" cy="${(-p.y * 1.6 - 9).toFixed(1)}" r="9" fill="${MCOL[i]}" stroke="#3b3226" stroke-width="1"/>`;
          });
          if (results) s += `<text x="0" y="62" text-anchor="middle" font-size="15" font-family="Jua, sans-serif" fill="#3b3226">${results[type]}</text>`;
          s += `</g>`;
        });
        $('#rcPanels').innerHTML = s; $('#rcMarbles').innerHTML = '';
      }
      function releaseBowls() {
        if (st.running) return;
        const any = Object.keys(BOWLS).every(t => st.bowls[t].some(Boolean));
        if (!any) { say('squirrel', '그릇마다 구슬을 하나 이상 놓아 줘!'); return; }
        st.running = true; renderControls();
        bowlTL = {}; Object.keys(BOWLS).forEach(type => { bowlTL[type] = HEIGHTS.map(h => bowlTimeline(type, h)); });
        const ends = {}; Object.keys(BOWLS).forEach(type => ends[type] = HEIGHTS.map((h, i) => st.bowls[type][i] ? bowlTL[type][i][bowlTL[type][i].length - 1].t : null).filter(v => v != null));
        const end = Math.max(...ends.cyc, ...ends.circ), t0 = performance.now(), speed = .6;
        (function f(n) {
          if (!alive()) return;
          const t = (n - t0) / 1000 * speed; drawBowls(t);
          if (t < end + .05) requestAnimationFrame(f);
          else {
            st.running = false;
            const spread = type => { const v = ends[type]; return Math.max(...v) - Math.min(...v); };
            const res = { cyc: ends.cyc.length > 1 ? (spread('cyc') < .03 ? '모두 동시에 도착!' : '따로따로 도착') : '구슬 1개', circ: ends.circ.length > 1 ? (spread('circ') < .03 ? '모두 동시에 도착!' : '높은 구슬이 늦게 도착') : '구슬 1개' };
            drawBowls(end, res);
            Object.keys(BOWLS).forEach(type => HH.stars($('#rcFx'), BOWLS[type].cx, BOWLS[type].cy - 10));
            const cycMulti = ends.cyc.length > 1;
            say('owl', cycMulti ? `사이클로이드 그릇에서는 높이가 달라도 구슬이 <b>동시에</b> 바닥에 닿았어! 동그란 그릇은 ${ends.circ.length > 1 ? '높은 곳 구슬이 <b>조금 늦게</b> 도착했지.' : '구슬을 두 개 이상 놓아 비교해 봐.'}` : '사이클로이드 그릇에 구슬을 <b>두 개 이상</b> 다른 높이로 놓아 봐!', cycMulti);
            if (cycMulti && !HH.hasCard('race-same')) setTimeout(() => { if (alive()) sameCard(); }, 1300);
            renderControls();
          }
        })(t0);
      }

      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">네 구슬을 동시에 출발시켜 봐</p><label class="check"><input type="checkbox" id="slowChk" ${st.slow ? 'checked' : ''} ${st.running ? 'disabled' : ''}>느린 화면으로 보기</label>
            <div class="row"><span style="font-size:13px;color:var(--ink-soft)">모든 길은 출발점과 도착점이 같아요</span><button type="button" class="throw" id="raceBtn" ${st.running ? 'disabled' : ''}>${st.raced ? '다시 출발!' : '출발!'}</button></div>`;
          side.innerHTML = `<p class="lab">누가 먼저 도착했을까?</p>${table()}${st.raced ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          const row = type => `<div><p class="lab" style="color:${BOWLS[type].color}">${BOWLS[type].name}</p><div class="angles">${HEIGHTS.map((h, i) => `<button type="button" class="ang ${st.bowls[type][i] ? 'on' : ''}" data-bowl="${type}" data-i="${i}" style="--c:${MCOL[i]};padding:6px 2px" ${st.running ? 'disabled' : ''} aria-pressed="${st.bowls[type][i]}"><span style="width:14px;height:14px;border-radius:50%;background:${MCOL[i]};display:block"></span><span style="font-size:13px">${['높이', '중간', '낮게'][i]}</span></button>`).join('')}</div></div>`;
          c.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${row('cyc')}${row('circ')}</div><div class="row"><span style="font-size:13px;color:var(--ink-soft)">누르면 그 높이에 구슬을 놓거나 빼요</span><button type="button" class="throw" id="bowlBtn" ${st.running ? 'disabled' : ''}>동시에 놓기!</button></div>`;
          side.innerHTML = `<p class="lab">같은 시간 그릇 찾기</p><p style="margin:0;font-size:15px">두 그릇에 구슬을 <b style="font-family:var(--display);font-weight:400">서로 다른 높이</b>로 놓고 동시에 놓아 봐. 어느 그릇에서 구슬들이 바닥에 <b style="font-family:var(--display);font-weight:400">한꺼번에</b> 도착할까?</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 어느 길이 가장 빠를지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">누가 먼저 도착했을까?</p>${table()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); if (p === 'play') drawBowls(null); else { drawPanels(st.raced); drawMarbles(0); } renderControls(); }
      function intro() {
        ui.show(`<div class="ov-card center"><div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 160 100" aria-hidden="true">${trackMini('cyc').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></div>
          <p class="eyebrow">운동장 · 힘과 움직임</p><h2>어느 길이 가장 빠를까?</h2><p class="lead">출발점과 도착점이 똑같은 네 가지 길이 있어.<br>구슬을 동시에 굴리면 누가 먼저 도착할까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card" style="width:min(820px,100%)">${HH.talk('owl', '네 길 모두 <b>출발점과 도착점</b>이 같아. 구슬 네 개를 동시에 놓으면 <b>어느 길</b>의 구슬이 가장 먼저 도착할까?')}
          ${HH.talk('squirrel', '곧은 길이 가장 짧으니까 당연히 가장 빠를 거야!')}
          <div class="picks" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">${TK.map(k => `<button type="button" class="pick" data-pick="${k}" style="--c:${TRACKS[k].color}">${trackMini(k)}<span style="font-size:16px">${TRACKS[k].name}</span></button>`).join('')}</div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('race-cycloid');
        const first = RANK[0];
        const msg = st.pred === first ? '예상이 딱 맞았어! <b>사이클로이드 길</b>이 가장 빨랐지.' : st.pred === 'line' ? '도토리랑 같은 생각이었구나! 그런데 가장 짧은 곧은 길보다 <b>사이클로이드 길</b>이 더 빨랐어.' : `${TRACKS[st.pred].name}보다 <b>사이클로이드 길</b>이 더 빨랐어.`;
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>${table()}
          ${HH.talk('owl', msg + ' 사이클로이드 길은 처음에 <b>쭉 가파르게</b> 떨어져서 구슬이 금방 빨라져. 길은 조금 더 길어도 빠른 속도로 달리니까 먼저 도착한단다. 완만하게 시작한 길들은 처음에 너무 느렸지.')}
          ${HH.talk('squirrel', '짧은 길이 꼭 빠른 길은 아니구나! 그래서 독수리도 처음엔 가파르게 내려오나 봐.')}
          ${HH.dcard(1, art1(), '가장 짧은 길보다 처음에 가파르게 내려가는 사이클로이드 길이 더 빨라요.', `사이클로이드 ${TIMES.cyc.toFixed(2)}초, 곧은 길 ${TIMES.line.toFixed(2)}초.`)}
          <button type="button" class="btn primary" data-act="play">같은 시간 그릇 놀이 하기</button></div>`);
      }
      function sameCard() {
        HH.addCard('race-same');
        ui.show(`<div class="ov-card">${HH.talk('owl', '사이클로이드 모양 그릇은 신기하게도, 높은 곳에서 출발한 구슬은 그만큼 <b>더 빨라져서</b> 낮은 곳 구슬과 <b>똑같은 시간</b>에 바닥에 닿아. 옛날 과학자들은 이 성질로 정확한 시계를 만들려고 했단다.')}
          ${HH.dcard(2, art2(), '사이클로이드 그릇에서는 어느 높이에서 출발해도 바닥에 동시에 도착해요.', '동그란 그릇에서는 높은 곳에서 출발한 구슬이 조금 늦게 도착해요.')}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }
      function reset() { if (st.running) return; fresh(); ui.hide(); $('#rcFx').innerHTML = ''; setPhase('intro'); say('owl', '안녕! 오늘은 <b>가장 빠른 길</b>을 찾아볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.id === 'raceBtn') { race(); return; }
        if (b.id === 'bowlBtn') { releaseBowls(); return; }
        if (st.running) return;
        if (b.dataset.bowl) { const a = st.bowls[b.dataset.bowl]; a[+b.dataset.i] = !a[+b.dataset.i]; drawBowls(null); renderControls(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '<b>출발!</b>을 누르면 네 구슬이 동시에 굴러 내려가. 누가 먼저 깃발에 도착하는지 잘 봐!', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); setPhase('play'); say('owl', '이번엔 <b>그릇</b>이야. 두 그릇에 구슬을 서로 다른 높이로 놓고 동시에 놓아 볼까?', true); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('change', e => { if (e.target.id === 'slowChk') st.slow = e.target.checked; });

      setPhase('intro'); say('owl', '안녕! 오늘은 <b>가장 빠른 길</b>을 찾아볼 거야.'); intro();
    }
  });
})();
