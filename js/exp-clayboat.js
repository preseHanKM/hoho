/* 물놀이장 · 찰흙 배 만들기 */
(function () {
  const { el, rng } = HH;
  const TX0 = 260, TX1 = 760, TOP = 180, S = 250, FLOOR = 448, CX = 510;
  const CLAY = 240, T = 11, BOAT_W = 6, K = 300;      // clay length budget, wall thickness, boat weight in marbles, water scale
  const SHAPES = {
    ball: { name: '공 모양', float: false, vt: 160 },
    plate: { name: '납작한 판', float: false, vt: 70 },
    boat: { name: '배 모양', float: true }
  };
  const SKEYS = ['ball', 'plate', 'boat'];
  const WIDTHS = [40, 60, 80, 100, 120, 140, 160, 180, 200];
  /* most marbles a boat with bottom W carries before water spills over the wall */
  function safeMax(W) { let m = 0; while ((BOAT_W + m + 1) * K / W < (CLAY - W) / 2 - 2) m++; return m; }
  const BEST = Math.max(...[40, 60, 80, 100, 120, 140, 160, 180, 200].map(safeMax));

  /* clay drawing: reference point is the bottom centre */
  const CLAY_FILL = 'url(#clayG)';
  /* cross-section of a boat: flat bottom W, walls of height H flaring outward */
  function hull(W, H) {
    const w = W / 2, f = H * .22, r = 8, t = T;
    const p = n => n.toFixed(1);
    return `M${p(-w - f)} ${p(-H)} L${p(-w)} ${-r} Q${p(-w)} 0 ${p(-w + r)} 0 H${p(w - r)} Q${p(w)} 0 ${p(w)} ${-r} L${p(w + f)} ${p(-H)}
      L${p(w + f - t)} ${p(-H)} L${p(w - t)} ${p(-t - 5)} Q${p(w - t)} ${-t} ${p(w - t - 5)} ${-t} H${p(-w + t + 5)} Q${p(-w + t)} ${-t} ${p(-w + t)} ${p(-t - 5)} L${p(-w - f + t)} ${p(-H)} Z`;
  }
  function boatSVG(W, H) {
    const w = W / 2, f = H * .22;
    return `<path d="${hull(W, H)}" fill="${CLAY_FILL}" stroke="#5a4a3c" stroke-width=".9" stroke-linejoin="round"/>
      <circle cx="${(-w - f + T / 2).toFixed(1)}" cy="${-H}" r="${T / 2}" fill="#b49e86" stroke="#5a4a3c" stroke-width=".7"/><circle cx="${(w + f - T / 2).toFixed(1)}" cy="${-H}" r="${T / 2}" fill="#b49e86" stroke="#5a4a3c" stroke-width=".7"/>
      <path d="M${(-w - f * .5 + 3).toFixed(1)} ${(-H * .55).toFixed(1)} q2 6 0 12 M${(w + f * .4 - 4).toFixed(1)} ${(-H * .4).toFixed(1)} q-2 6 0 12 M${(-W / 4).toFixed(1)} -4 q6 -2 12 0 M${(W / 6).toFixed(1)} -5 q5 -2 10 0" fill="none" stroke="#5f4e40" stroke-width=".8" opacity=".75"/>`;
  }
  function ballSVG() {
    return `<circle cx="0" cy="-26" r="26" fill="${CLAY_FILL}" stroke="#5a4a3c" stroke-width=".9"/>
      <path d="M-12 -38 q6 -4 12 -2 M4 -18 q6 2 10 -2 M-16 -20 q2 4 6 5" fill="none" stroke="#6f5d4c" stroke-width=".7" opacity=".7"/><ellipse cx="-9" cy="-36" rx="6" ry="9" transform="rotate(30 -9 -36)" fill="#fff" opacity=".18"/>`;
  }
  function plateSVG() {
    return `<rect x="-65" y="-12" width="130" height="12" rx="6" fill="${CLAY_FILL}" stroke="#5a4a3c" stroke-width=".9"/>
      <path d="M-50 -8 q8 -2 16 0 M10 -5 q8 2 16 0" fill="none" stroke="#6f5d4c" stroke-width=".7" opacity=".7"/>`;
  }
  const shapeSVG = k => k === 'ball' ? ballSVG() : k === 'plate' ? plateSVG() : boatSVG(120, 60);
  function marble(x, y, i) {
    const c = ['#4f9fd8', '#d9822b', '#4f7a3f', '#c45f33', '#7c62ad', '#d9a23a'][i % 6];
    return `<circle cx="${x}" cy="${y}" r="6.5" fill="${c}" fill-opacity=".85" stroke="#3b3226" stroke-width=".6"/><circle cx="${x - 2}" cy="${y - 2.2}" r="1.8" fill="#fff" opacity=".8"/>`;
  }
  function marbleSlots(W, n) {
    const Wi = W - 2 * T, per = Math.max(1, Math.floor(Wi / 14)), out = [];
    for (let i = 0; i < n; i++) { const row = Math.floor(i / per), col = i % per, off = (Wi - per * 14) / 2; out.push([-Wi / 2 + off + 7 + col * 14, -T - 7 - row * 12.5]); }
    return out;
  }

  function miniScene(items) {   // items: [{k, x, y, s}] y = bottom reference in mini space
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e6f0f2"/>
      <rect x="18" y="20" width="124" height="72" fill="#f4fafb" stroke="#8fb3c2"/><rect x="19" y="86" width="122" height="5" fill="#d8c8a0"/>
      ${items.filter(i => !i.front).map(i => `<g transform="translate(${i.x} ${i.y}) scale(${i.s})">${shapeSVG(i.k)}</g>`).join('')}
      <rect x="19" y="40" width="122" height="51" fill="url(#waterG)"/>
      ${items.filter(i => i.front).map(i => `<g transform="translate(${i.x} ${i.y}) scale(${i.s})">${shapeSVG(i.k)}${i.m ? marbleSlots(120, i.m).map(([x, y], j) => marble(x, y, j)).join('') : ''}</g>`).join('')}
      <path d="M19 40 H141" stroke="#fff" opacity=".8"/><rect x="18" y="20" width="124" height="72" fill="none" stroke="#6f97a8" stroke-width="1.2"/></svg>`;
  }
  const art1 = () => miniScene([{ k: 'ball', x: 46, y: 86, s: .42 }, { k: 'boat', x: 108, y: 43, s: .42, front: true }]);
  const art2 = () => miniScene([{ k: 'boat', x: 80, y: 52, s: .62, front: true, m: 12 }]);

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="찰흙으로 여러 모양을 만들어 수조에 띄워 보는 장면">
    <defs>
      <clipPath id="cbBelow"><rect x="${TX0 + 4}" y="${S}" width="${TX1 - TX0 - 8}" height="${466 - S}"/></clipPath>
    </defs>
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="880" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8"><path d="M420 84 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/></g>
    <path d="M0 270 C140 240 260 256 380 260 C520 264 640 232 780 240 C880 246 950 232 1000 236 L1000 320 L0 320 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="cbTrees"></g>
    <rect y="306" width="1000" height="40" fill="#79b9dc"/><path d="M0 306 H1000" stroke="#e9f2f4" stroke-width="5"/>
    <rect y="344" width="1000" height="216" fill="#d9e4e6"/>
    <g id="cbTiles"></g>
    <!-- work bench with clay and marbles -->
    <rect x="30" y="400" width="200" height="12" rx="2" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
    <rect x="44" y="412" width="10" height="120" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/><rect x="206" y="412" width="10" height="120" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/>
    <path d="M60 400 C58 386 72 378 88 380 C104 378 116 388 112 400 Z" fill="url(#clayG)" stroke="#5a4a3c" stroke-width=".8"/>
    <rect x="120" y="390" width="56" height="9" rx="4.5" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".7"/>
    <path d="M186 400 V364 Q186 356 194 356 H212 Q220 356 220 364 V400 Z" fill="#eef6f8" fill-opacity=".7" stroke="#8fb3c2" stroke-width=".9"/>
    <g id="jar"></g>
    <rect x="182" y="350" width="42" height="8" rx="2" fill="#c9d6dc" stroke="#7d909a" stroke-width=".7"/>
    <!-- table and tank -->
    <rect x="${TX0 - 20}" y="470" width="${TX1 - TX0 + 40}" height="14" rx="2" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
    <rect x="${TX0}" y="484" width="12" height="62" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/><rect x="${TX1 - 12}" y="484" width="12" height="62" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/>
    <rect x="${TX0}" y="${TOP}" width="${TX1 - TX0}" height="${470 - TOP}" fill="#eef6f8" fill-opacity=".93" stroke="#8fb3c2" stroke-width="1"/>
    <rect x="${TX0 + 4}" y="${FLOOR}" width="${TX1 - TX0 - 8}" height="${466 - FLOOR}" fill="#d8c8a0"/>
    <g id="cbPebbles"></g>
    <g id="behind"></g>
    <rect x="${TX0 + 4}" y="${S}" width="${TX1 - TX0 - 8}" height="${466 - S}" fill="url(#waterG)"/>
    <g id="front"></g>
    <g id="tint" clip-path="url(#cbBelow)"></g>
    <g id="cbUnder"></g>
    <path d="M${TX0 + 4} ${S} C360 ${S - 2} 420 ${S + 2} 520 ${S} S680 ${S - 2} ${TX1 - 4} ${S}" fill="none" stroke="#ffffff" stroke-width="1.6" opacity=".9"/>
    <g id="cbRipples"></g>
    <rect x="${TX0}" y="${TOP}" width="${TX1 - TX0}" height="${470 - TOP}" fill="none" stroke="#6f97a8" stroke-width="1.4"/>
    <path d="M${TX0} ${TOP} h10 v10 M${TX1} ${TOP} h-10 M${TX1} ${TOP} v10 M${TX0} 470 h10 M${TX0} 470 v-10 M${TX1} 470 h-10 M${TX1} 470 v-10" stroke="#4f6f7c" stroke-width="4" fill="none"/>
    <g fill="#ffffff" opacity=".26"><path d="M296 200 L316 200 L278 440 L258 440 Z"/><path d="M700 210 L712 210 L680 400 L668 400 Z"/></g>
    <g id="cbFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>같은 찰흙이라도 속이 빈 배 모양으로 만들면 물을 더 많이 밀어내어 뜹니다. 납작하게 펴기만 해서는 가라앉습니다. 쇠로 만든 큰 배가 뜨는 까닭과 같습니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 가라앉는 찰흙 공을 모양만 바꾸면 띄울 수 있을까? 도토리는 “찰흙은 어떤 모양이든 가라앉는다”고 말합니다.</li><li>실험: 무게가 같은 찰흙으로 공, 납작한 판, 배 모양을 만들어 넣어 봅니다.</li><li>발견: 배 모양만 떴다는 것을 확인합니다.</li><li>놀이: 찰흙 양은 그대로 두고 바닥 넓이와 벽 높이를 바꿔, 구슬을 가장 많이 싣는 배를 찾습니다. 그래프가 가운데에서 가장 높게 솟는 모양을 함께 살펴봅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>납작한 판은 왜 가라앉았을까? 배 모양과 무엇이 다를까?</li><li>벽을 아주 높게 만들면 왜 구슬을 적게 실었을까?</li><li>진짜 배에 짐을 너무 많이 실으면 어떻게 될까?</li></ul></div>
    <div><h3>교과 연계</h3><p>3학년 과학 「물질의 성질」과 이어지는 활동. 놀이 단계의 막대그래프는 2학년 수학 「표와 그래프」와 함께 쓸 수 있습니다.</p></div>
    <div><h3>교실에서 실제로 해 보기</h3><p>찰흙이나 지점토를 모둠마다 같은 양으로 나눠 주고 구슬(또는 동전) 싣기 대회를 하면 화면 속 결과를 직접 확인할 수 있습니다. 이 놀이터는 배를 단면으로 단순하게 계산한 모습입니다.</p></div>`;

  HH.register({
    id: 'clayboat',
    cards: [
      { id: 'clay-shape', no: 1, text: '가라앉는 찰흙도 속이 빈 배 모양으로 만들면 떠요.', art: art1 },
      { id: 'clay-best', no: 2, text: '같은 찰흙이라도 바닥 넓이와 벽 높이를 알맞게 만들면 짐을 가장 많이 실어요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'clayboat', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#weight"/></svg>모든 모양은 똑같은 찰흙 한 덩이로 만들었어요. 무게가 모두 같아요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, shape: 'ball', results: {}, busy: false, W: 120, m: 0, best: {}, record: 0, sinking: false, sunk: false }); }
      fresh();

      (function () {
        const R = rng(53);
        const t = $('#cbTrees'); [40, 120, 300, 620, 700, 880, 960].forEach(x => HH.tree(t, x, 304, .75 + R() * .4));
        const tl = $('#cbTiles');
        for (let y = 344; y < 560; y += 24) el('path', { d: `M0 ${y} H1000`, stroke: '#c3d2d5', 'stroke-width': .8 }, tl);
        for (let x = 0; x < 1000; x += 40) el('path', { d: `M${x} 344 V560`, stroke: '#c3d2d5', 'stroke-width': .8 }, tl);
        const pb = $('#cbPebbles');
        for (let i = 0; i < 60; i++) el('ellipse', { cx: (TX0 + 8 + R() * (TX1 - TX0 - 16)).toFixed(1), cy: (FLOOR + 3 + R() * 14).toFixed(1), rx: (1.5 + R() * 3).toFixed(1), ry: (1 + R() * 2).toFixed(1), fill: R() < .5 ? '#bfae86' : '#a99b78', stroke: '#8a7d5e', 'stroke-width': .4 }, pb);
        let j = ''; for (let i = 0; i < 9; i++) j += marble(194 + (i % 3) * 9, 394 - Math.floor(i / 3) * 9, i); $('#jar').innerHTML = j;
      })();

      /* ---------- the one body in the tank ---------- */
      let body = null, looping = false, ripples = [], drops = [], bubbles = [], dropping = [];
      function H() { return (CLAY - st.W) / 2; }
      function draft() { return (BOAT_W + st.m) * K / st.W; }
      function render() {
        const b = body; $('#behind').innerHTML = ''; $('#front').innerHTML = ''; $('#tint').innerHTML = '';
        if (!b) return;
        const tr = `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.rot.toFixed(1)})`;
        if (b.k !== 'boat') { $('#behind').innerHTML = `<g transform="${tr}">${shapeSVG(b.k)}</g>`; return; }
        const W = b.W, Hh = b.H;
        let marbles = marbleSlots(W, b.m).map(([x, y], i) => marble(x, y, i)).join('');
        dropping.forEach(d => { marbles += marble(d.x, d.y, d.i); });
        $('#front').innerHTML = `<g transform="${tr}">${boatSVG(W, Hh)}${marbles}</g>`;
        $('#tint').innerHTML = `<g transform="${tr}" opacity=".6"><path d="${hull(W, Hh)}" fill="url(#waterG)"/>${b.flooded ? `<rect x="${-W / 2 + T}" y="${-Hh}" width="${W - 2 * T}" height="${Hh - T}" fill="url(#waterG)"/>` : ''}</g>`;
      }
      function splash(x) {
        const fx = $('#cbFx'), R = Math.random;
        for (let i = 0; i < 12; i++) { const a = Math.PI * (.15 + .7 * R()), sp = 80 + R() * 140; drops.push({ e: el('circle', { r: (1.2 + R() * 2).toFixed(1), fill: '#9fd3ef', stroke: '#2f73ad', 'stroke-width': .4 }, fx), x, y: S - 2, vx: Math.cos(a) * sp * (R() < .5 ? -1 : 1), vy: -Math.sin(a) * sp, t: 0 }); }
        ripples.push({ e: el('ellipse', { cx: x, cy: S, rx: 10, ry: 3, fill: 'none', stroke: '#fff', 'stroke-width': 1.4 }, $('#cbRipples')), t: 0 });
      }
      function bubble(x, y) { bubbles.push({ e: el('circle', { r: (1.5 + Math.random() * 2.5).toFixed(1), fill: '#e9f6fd', 'fill-opacity': .5, stroke: '#fff', 'stroke-width': .7 }, $('#cbUnder')), x, y, ph: Math.random() * 6 }); }
      function step(dt) {
        let busy = false; const b = body;
        if (b) {
          b.t += dt;
          if (b.mode === 'air') { busy = true; b.vy += 900 * dt; b.y += b.vy * dt; if (b.y >= S) { splash(b.x); b.mode = 'water'; b.t = 0; b.vy *= .4; } }
          else if (b.mode === 'water') {
            busy = true;
            if (b.k === 'boat' && !b.sinking) {
              const tg = S + (b.d != null ? b.d : 15);
              b.vy += ((tg - b.y) * 26 - b.vy * 4.5) * dt; b.y += b.vy * dt; b.rot = Math.sin(b.t * 3.5) * 3 * Math.exp(-b.t * 1.5);
              if (b.t > .6 && Math.abs(tg - b.y) < .4 && Math.abs(b.vy) < 3) { b.y = tg; b.vy = 0; b.rot = 0; b.mode = 'rest'; settled(); }
            } else {
              const vt = b.k === 'boat' ? 55 : SHAPES[b.k].vt;
              b.vy += (vt - b.vy) * Math.min(1, dt * 3); b.y += b.vy * dt;
              if (b.k === 'plate') { b.rot = Math.sin(b.t * 3) * 10; b.x = CX + Math.sin(b.t * 3) * 14; }
              if (b.k === 'boat') b.rot = Math.min(8, b.t * 6);
              b.bt = (b.bt || 0) + dt; if (b.bt > .12 && b.t < 1.6) { b.bt = 0; bubble(b.x + (Math.random() - .5) * 40, b.y - 20); }
              if (b.y >= FLOOR) { b.y = FLOOR; b.mode = 'rest'; if (b.k === 'plate') { b.rot = 0; b.x = CX; } settled(); }
            }
          }
        }
        dropping = dropping.filter(d => { busy = true; d.vy += 900 * dt; d.y += d.vy * dt; if (d.y >= d.ty) { body.m++; return false; } return true; });
        bubbles = bubbles.filter(q => { q.y -= 70 * dt; q.ph += dt * 6; q.e.setAttribute('cx', (q.x + Math.sin(q.ph) * 2).toFixed(1)); q.e.setAttribute('cy', q.y.toFixed(1)); if (q.y <= S + 2) { q.e.remove(); return false; } return true; });
        ripples = ripples.filter(r => { r.t += dt; const k = r.t; r.e.setAttribute('rx', (10 + 80 * k).toFixed(1)); r.e.setAttribute('ry', (3 + 6 * k).toFixed(1)); r.e.setAttribute('opacity', Math.max(0, 1 - k).toFixed(2)); if (k >= 1) { r.e.remove(); return false; } return true; });
        drops = drops.filter(d => { d.t += dt; d.vy += 600 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.e.setAttribute('cx', d.x.toFixed(1)); d.e.setAttribute('cy', d.y.toFixed(1)); if (d.y > S + 4 || d.t > 1) { d.e.remove(); return false; } return true; });
        render();
        return busy || bubbles.length || ripples.length || drops.length;
      }
      function kick() {
        if (looping) return; looping = true; let last = null;
        (function f(n) {
          if (!alive()) { looping = false; return; }
          if (last === null) last = n; const dt = Math.min(.033, (n - last) / 1000); last = n;
          if (step(dt)) requestAnimationFrame(f); else looping = false;
        })(performance.now());
      }
      function newBody(k, opts) { body = Object.assign({ k, x: CX, y: 130, vy: 0, t: 0, mode: 'air', rot: 0, W: 120, H: 60, m: 0 }, opts || {}); dropping = []; kick(); }

      /* ---------- test ---------- */
      function settled() {
        if (st.phase === 'test') {
          const k = body.k, res = SHAPES[k].float ? 'float' : 'sink';
          st.results[k] = res; st.busy = false;
          const done = SKEYS.every(q => st.results[q]);
          const msg = { ball: '찰흙 공은 <b>퐁당</b> 가라앉았어.', plate: '납작하게 폈는데도 <b>퐁당</b> 가라앉았어!', boat: '배 모양은 <b>둥둥</b> 떴어! 똑같은 찰흙인데!' }[k];
          say('owl', msg + (done ? ' 세 가지를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ' 다른 모양도 만들어 볼까?'), k === 'boat');
          renderControls();
        } else if (st.phase === 'play') {
          if (body.sinking) {
            const n = st.m - 1; st.sinking = false; st.sunk = true;
            st.best[st.W] = Math.max(st.best[st.W] || 0, n); st.record = Math.max(st.record, n);
            const top = n >= BEST;
            say(top ? 'owl' : 'squirrel', top ? `구슬 <b>${n}개</b>까지 실었어! 이게 <b>최고 기록</b>이야!` : `앗, 가라앉았어! 이 배는 구슬 <b>${n}개</b>까지 실을 수 있었어. 배 모양을 바꿔 볼까?`, top);
            renderControls();
            if (top && !HH.hasCard('clay-best')) setTimeout(() => { if (alive()) bestCard(); }, 900);
          }
        }
      }
      function resultTable() {
        return `<table class="mtable"><thead><tr><th>모양</th><th>무게</th><th>결과</th></tr></thead><tbody>${SKEYS.map(k => {
          const r = st.results[k];
          return `<tr><td><svg viewBox="-70 -66 140 72" style="width:64px;height:34px;display:block" aria-hidden="true">${shapeSVG(k)}</svg><span style="font-size:13px">${SHAPES[k].name}</span></td><td><span class="wts"><svg viewBox="0 0 20 20"><use href="#weight"/></svg><svg viewBox="0 0 20 20"><use href="#weight"/></svg><svg viewBox="0 0 20 20"><use href="#weight"/></svg></span></td><td>${r ? `<span class="seatno" style="font-size:18px">${r === 'float' ? '둥둥' : '퐁당'}</span>` : '<span class="wait">?</span>'}</td></tr>`;
        }).join('')}</tbody></table>`;
      }
      function chartSVG() {
        const base = 150, maxN = 20, hMax = 120, bw = 22;
        let s = `<svg class="chart" viewBox="0 0 300 200" role="img" aria-label="바닥 넓이에 따라 실은 구슬 수 막대그래프"><text x="4" y="14" class="ax">실은 구슬 수</text>`;
        for (let v = 0; v <= 20; v += 5) { const y = base - v / maxN * hMax; s += `<line x1="30" x2="296" y1="${y}" y2="${y}" stroke="#d8ccb2" stroke-width="${v ? .7 : 1.2}"/><text x="24" y="${y + 4}" text-anchor="end" class="ax">${v}</text>`; }
        WIDTHS.forEach((W, i) => {
          const x = 44 + i * 29, v = st.best[W];
          if (v == null) s += `<rect x="${x - bw / 2}" y="${base - 18}" width="${bw}" height="18" rx="3" fill="none" stroke="#b8ab90" stroke-dasharray="3 3"/>`;
          else { const h = Math.max(2, v / maxN * hMax); s += `<rect x="${x - bw / 2}" y="${base - h}" width="${bw}" height="${h}" rx="3" fill="${W === st.W ? '#d9822b' : '#4f9fd8'}" fill-opacity=".85"/><text x="${x}" y="${base - h - 5}" text-anchor="middle" class="val" style="font-size:13px">${v}</text>`; }
          const w = W * .07, h = (CLAY - W) / 2 * .18;
          s += `<path d="M${(x - w).toFixed(1)} ${(base + 30 - h).toFixed(1)} V${base + 30} H${(x + w).toFixed(1)} V${(base + 30 - h).toFixed(1)}" fill="none" stroke="#8f7a66" stroke-width="2.4" stroke-linejoin="round"/>`;
        });
        s += `<text x="44" y="${base + 46}" class="ax">좁고 높게</text><text x="290" y="${base + 46}" text-anchor="end" class="ax">넓고 낮게</text></svg>`;
        return s;
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">찰흙으로 어떤 모양을 만들까?</p><div class="angles">${SKEYS.map(k => `<button type="button" class="ang ${st.shape === k ? 'on' : ''}" data-shape="${k}" style="--c:#8f7a66" ${st.busy ? 'disabled' : ''} aria-pressed="${st.shape === k}"><svg viewBox="-70 -70 140 76" aria-hidden="true">${shapeSVG(k)}</svg><span>${SHAPES[k].name}</span>${st.results[k] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row"><span class="lock"><svg viewBox="0 0 20 20" aria-hidden="true"><use href="#weight"/></svg>찰흙 양은 모두 똑같이</span><button type="button" class="throw" id="dropBtn" ${st.busy ? 'disabled' : ''}>물에 넣기</button></div>`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${resultTable()}${SKEYS.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          const cap = st.m;
          c.innerHTML = `<label class="lab" for="wR">배 모양 바꾸기</label><div class="slide"><span>벽을 높게</span><input type="range" id="wR" min="40" max="200" step="20" value="${st.W}" ${st.sinking ? 'disabled' : ''}><span>바닥을 넓게</span></div>
            <p style="margin:-4px 0 10px;font-size:14px;color:var(--ink-soft)">찰흙 양은 그대로예요. 바닥을 넓히면 벽이 낮아져요.</p>
            <div class="row" style="margin-top:0"><button type="button" class="btn small" data-act="rebuild">배 다시 띄우기</button><button type="button" class="throw" id="marbleBtn" ${st.sinking || st.sunk || dropping.length ? 'disabled' : ''}>구슬 싣기</button></div>
            <p class="score">${st.sunk ? `가라앉았어요! 구슬 <b>${cap - 1}</b>개까지 괜찮았어요` : `지금 실은 구슬 <b>${cap}</b>개`}</p>`;
          side.innerHTML = `<p class="lab">어떤 배가 구슬을 많이 실을까?</p>${chartSVG()}<p style="margin:6px 0 0;font-size:14px">최고 기록 <b style="font-family:var(--display);font-weight:400;font-size:20px;color:var(--clay)">${st.record}</b>개</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 찰흙 배가 뜰지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${resultTable()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="-70 -70 140 76" aria-hidden="true">${ballSVG()}</svg><svg class="sq" viewBox="-70 -70 140 76" aria-hidden="true">${boatSVG(120, 60)}</svg></div>
          <p class="eyebrow">물놀이장 · 뜨고 가라앉기</p><h2>찰흙 배 만들기</h2>
          <p class="lead">찰흙은 물에 넣으면 가라앉아.<br>모양을 바꾸면 물에 띄울 수 있을까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '찰흙 공은 물에 넣으면 <b>퐁당</b> 가라앉아. 똑같은 찰흙으로 <b>모양만 바꾸면</b> 어떻게 될까?')}
          ${HH.talk('squirrel', '찰흙은 무거우니까 어떤 모양이든 가라앉을 거야!')}
          <div class="picks">
            <button type="button" class="pick" data-pick="sinkAll">${miniScene([{ k: 'ball', x: 46, y: 86, s: .4 }, { k: 'boat', x: 108, y: 86, s: .4, front: true }])}<span>모양을 바꿔도 퐁당</span></button>
            <button type="button" class="pick" data-pick="flat">${miniScene([{ k: 'plate', x: 80, y: 44, s: .6, front: true }])}<span>납작하게 펴면 둥둥</span></button>
            <button type="button" class="pick" data-pick="boat">${miniScene([{ k: 'boat', x: 80, y: 46, s: .5, front: true }])}<span>배 모양이면 둥둥</span></button>
          </div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('clay-shape');
        const msg = { boat: '예상이 딱 맞았어! <b>배 모양</b>만 둥둥 떴지.', flat: '납작하게 펴기만 해서는 가라앉았어. 가운데가 <b>오목하게 빈</b> 배 모양이어야 떴지.', sinkAll: '도토리랑 같은 생각이었구나! 그런데 <b>배 모양</b>은 둥둥 떴어.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${resultTable()}
          ${HH.talk('owl', msg + ' 배 모양은 속이 비어 있어서 <b>물을 많이 밀어내</b>. 그러면 물이 배를 밀어 올려 준단다.')}
          ${HH.talk('squirrel', '무게는 똑같은데 모양만 바꿔서 떴어! 쇠로 만든 큰 배도 그래서 뜨는구나.')}
          ${HH.dcard(1, art1(), '가라앉는 찰흙도 속이 빈 배 모양으로 만들면 떠요.', '공 모양과 납작한 판은 가라앉고, 배 모양만 떴어요.')}
          <button type="button" class="btn primary" data-act="play">구슬 싣기 대회 하기</button></div>`);
      }
      function bestCard() {
        HH.addCard('clay-best');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '벽이 너무 높으면 바닥이 좁아지고, 바닥이 너무 넓으면 벽이 낮아져. <b>알맞게</b> 만든 배가 구슬을 가장 많이 실었어!')}
          ${HH.dcard(2, art2(), '같은 찰흙이라도 바닥 넓이와 벽 높이를 알맞게 만들면 짐을 가장 많이 실어요.', '그래프를 보면 가운데쯤에서 막대가 가장 높아요.')}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }

      /* ---------- play ---------- */
      function floatBoat(fromAir) {
        st.m = 0; st.sunk = false; st.sinking = false;
        const opts = { W: st.W, H: H(), d: draft() };
        if (fromAir) newBody('boat', opts);
        else { newBody('boat', Object.assign(opts, { y: S + draft(), mode: 'water', t: 1 })); }
        renderControls();
      }
      function addMarble() {
        if (!body || st.sinking || st.sunk || dropping.length) return;
        const slots = marbleSlots(st.W, st.m + 1), [x, y] = slots[st.m];
        dropping.push({ x, y: y - 140, ty: y, vy: 0, i: st.m });
        st.m++;
        body.m = st.m - 1;
        const d = draft();
        renderControls(); kick();
        const wait = setInterval(() => {
          if (!alive()) { clearInterval(wait); return; }
          if (dropping.length) return;
          clearInterval(wait);
          if (d >= H() - 2) {
            st.sinking = true; body.sinking = true; body.flooded = true; body.mode = 'water'; body.t = 0;
            say('squirrel', '앗! 물이 넘쳐 들어와!'); renderControls(); kick();
          } else { body.d = d; body.mode = 'water'; body.t = .6; kick(); renderControls(); }
        }, 50);
      }

      function reset() { fresh(); body = null; dropping = []; render(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>찰흙</b>으로 배를 만들어 볼 거야.'); intro(); }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.shape) { if (st.busy) return; st.shape = b.dataset.shape; body = null; render(); renderControls(); say('owl', `찰흙을 <b>${SHAPES[st.shape].name}</b>으로 만들었어. <b>물에 넣기</b>를 눌러 봐.`); return; }
        if (b.id === 'dropBtn') { if (st.busy) return; st.busy = true; newBody(st.shape); renderControls(); return; }
        if (b.id === 'marbleBtn') { addMarble(); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '똑같은 찰흙 한 덩이로 세 가지 모양을 만들어 넣어 보자. 먼저 <b>공 모양</b>부터!', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); setPhase('play'); st.W = 120; floatBoat(true); say('owl', '<b>구슬 싣기 대회</b>야! 구슬을 하나씩 실어 봐. 물이 넘치면 가라앉아! 배 모양을 바꿔서 최고 기록에 도전해 봐.', true); }
        else if (act === 'rebuild') { floatBoat(true); say('owl', '새 배를 띄웠어. 구슬을 실어 볼까?'); }
        else if (act === 'close') ui.hide();
      });
      root.addEventListener('input', e => {
        if (e.target.id === 'wR' && !st.sinking) { st.W = +e.target.value; floatBoat(false); }
      });
      root.addEventListener('change', e => { if (e.target.id === 'wR') say('owl', `바닥 넓이 ${st.W}, 벽 높이 ${H()}인 배야. 구슬을 실어 볼까?`); });

      setPhase('intro');
      say('owl', '안녕! 오늘은 <b>찰흙</b>으로 배를 만들어 볼 거야.');
      intro();
    }
  });
})();
