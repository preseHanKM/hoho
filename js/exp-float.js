/* 물놀이장 · 둥둥 퐁당 */
(function () {
  const { el, rng, josa } = HH;
  const X0 = 200, X1 = 800, TOP = 180, S = 250, FLOOR = 448;
  const OBJ = {
    log: { name: '통나무', size: '아주 커요', w: 156, h: 50, float: true, f: .55, lane: 330, stuff: '나무' },
    coin: { name: '동전', size: '아주 작아요', w: 28, h: 28, float: false, vt: 95, flutter: true, lane: 560, stuff: '쇠' },
    melon: { name: '수박', size: '커요', w: 100, h: 102, float: true, f: .9, lane: 482, stuff: '과일' },
    clip: { name: '클립', size: '아주 작아요', w: 20, h: 38, float: false, vt: 80, lane: 672, stuff: '쇠' },
    apple: { name: '사과', size: '보통', w: 52, h: 58, float: true, f: .75, lane: 592, stuff: '과일' },
    stone: { name: '돌멩이', size: '보통', w: 64, h: 44, float: false, vt: 175, lane: 330, stuff: '돌' },
    pingpong: { name: '탁구공', size: '작아요', w: 30, h: 30, float: true, f: .12, lane: 680, stuff: '플라스틱' },
    key: { name: '열쇠', size: '작아요', w: 52, h: 22, float: false, vt: 150, lane: 450, stuff: '쇠' }
  };
  const IDS = Object.keys(OBJ);
  const EGG = 1.06, SALT_STEP = .02, MAX_SPOONS = 6;

  function icon(id) {
    const o = OBJ[id] || { w: 34, h: 44 }, v = Math.max(o.w, o.h) + 4;
    return `<svg viewBox="${-v / 2} ${-v / 2} ${v} ${v}" aria-hidden="true"><use href="#obj-${id}" x="${-o.w / 2}" y="${-o.h / 2}" width="${o.w}" height="${o.h}"/></svg>`;
  }
  function place(id, x, y, k, extra) {
    const o = OBJ[id] || { w: 34, h: 44 };
    return `<g transform="translate(${x} ${y}) scale(${k}) ${extra || ''}"><use href="#obj-${id}" x="${-o.w / 2}" y="${-o.h / 2}" width="${o.w}" height="${o.h}"/></g>`;
  }
  /* small tank picture: floats on the surface, sinks on the bottom */
  function miniTank(floats, sinks, cls) {
    const k = .42, s = 40, fl = 86;
    let objs = '';
    floats.forEach((id, i) => { const o = OBJ[id]; const y = s - o.h * k / 2 + o.f * o.h * k; objs += place(id, 48 + i * 52, y.toFixed(1), k); });
    sinks.forEach((id, i) => { const o = OBJ[id]; const r = id === 'coin' ? 'scale(1 .35)' : id === 'clip' ? 'rotate(90)' : ''; const hh = id === 'coin' ? 10 : id === 'clip' ? 20 : o.h; objs += place(id, 48 + i * 52, (fl - hh * k / 2).toFixed(1), k, r); });
    return `<svg ${cls ? `class="${cls}"` : ''} viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e6f0f2"/>
      <rect x="18" y="20" width="124" height="72" fill="#f4fafb" stroke="#8fb3c2" stroke-width="1"/><rect x="19" y="86" width="122" height="5" fill="#d8c8a0"/>
      ${objs}<rect x="19" y="${s}" width="122" height="${91 - s}" fill="url(#waterG)"/><path d="M19 ${s} H141" stroke="#ffffff" stroke-width="1" opacity=".8"/>
      <rect x="18" y="20" width="124" height="72" fill="none" stroke="#6f97a8" stroke-width="1.2"/></svg>`;
  }
  const art1 = () => miniTank(['log', 'melon'], ['coin', 'clip']);
  function art2() {
    const glass = (x, eggY, label, salty) => `<g transform="translate(${x} 0)"><path d="M0 24 L4 88 H44 L48 24" fill="#f4fafb" stroke="#8fb3c2" stroke-width="1"/>
      ${place('egg', 24, eggY, .55)}<path d="M1.6 40 L4 88 H44 L46.4 40 Z" fill="url(#waterG)"/>${salty ? '<path d="M1.6 40 L4 88 H44 L46.4 40 Z" fill="#fff" opacity=".12"/>' : ''}
      <path d="M0 24 L4 88 H44 L48 24" fill="none" stroke="#6f97a8" stroke-width="1.2"/><text x="24" y="98" text-anchor="middle" font-size="9" fill="#6d604c">${label}</text></g>`;
    return `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e6f0f2"/>${glass(14, 76, '맹물')}${glass(98, 44, '소금물', true)}
      <path d="M66 34 q14 -6 28 0" fill="none" stroke="#9aa1a7" stroke-width="1.4"/><ellipse cx="80" cy="30" rx="9" ry="4" fill="#fff" stroke="#9aa1a7" stroke-width=".8"/>
      <g fill="#fff" stroke="#b9bfc4" stroke-width=".4"><rect x="76" y="26" width="2.4" height="2.4"/><rect x="80" y="25" width="2.4" height="2.4"/><rect x="83" y="27" width="2" height="2"/></g>
      <path d="M78 42 l4 6 l4 -6" fill="none" stroke="#d9822b" stroke-width="1.6"/></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="물놀이장 옆 유리 수조에 물건을 넣어 보는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="860" cy="70" r="80" fill="url(#sunGlow)"/>
    <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8"><path d="M120 90 c0 -14 18 -20 28 -12 c6 -14 30 -14 36 2 c14 -4 24 8 18 18 c-2 4 -6 6 -12 6 h-62 c-10 0 -14 -8 -8 -14 Z" opacity=".9"/><path d="M540 60 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".85"/></g>
    <path d="M0 270 C140 240 260 256 380 260 C520 264 640 232 780 240 C880 246 950 232 1000 236 L1000 320 L0 320 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="flTrees"></g>
    <rect y="306" width="1000" height="40" fill="#79b9dc"/>
    <path d="M0 306 H1000" stroke="#e9f2f4" stroke-width="5"/>
    <g id="laneRope"></g>
    <path d="M0 316 q30 -3 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#fff" stroke-width=".8" opacity=".6"/>
    <rect y="344" width="1000" height="216" fill="#d9e4e6"/>
    <g id="tiles"></g>
    <path d="M140 300 V250 M140 250 L100 262 L180 262 Z" fill="#d4574a" stroke="#8a2c22" stroke-width=".8"/>
    <path d="M100 262 Q120 254 140 250 Q160 254 180 262" fill="#f7efe0" stroke="#8a2c22" stroke-width=".6" opacity=".9"/>
    <!-- table -->
    <rect x="180" y="470" width="640" height="14" rx="2" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
    <rect x="200" y="484" width="12" height="62" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/><rect x="788" y="484" width="12" height="62" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/>
    <!-- tank back -->
    <rect x="${X0}" y="${TOP}" width="${X1 - X0}" height="${470 - TOP}" fill="#eef6f8" fill-opacity=".93" stroke="#8fb3c2" stroke-width="1"/>
    <rect x="${X0 + 4}" y="${FLOOR}" width="${X1 - X0 - 8}" height="${466 - FLOOR}" fill="#d8c8a0"/>
    <g id="pebbles"></g>
    <g id="objs"></g>
    <rect id="water" x="${X0 + 4}" y="${S}" width="${X1 - X0 - 8}" height="${466 - S}" fill="url(#waterG)"/>
    <rect id="saltTint" x="${X0 + 4}" y="${S}" width="${X1 - X0 - 8}" height="${466 - S}" fill="#ffffff" opacity="0"/>
    <g id="under"></g>
    <path d="M${X0 + 4} ${S} C300 ${S - 2} 360 ${S + 2} 460 ${S} S620 ${S - 2} ${X1 - 4} ${S}" fill="none" stroke="#ffffff" stroke-width="1.6" opacity=".9"/>
    <g id="ripples"></g>
    <!-- tank front -->
    <rect x="${X0}" y="${TOP}" width="${X1 - X0}" height="${470 - TOP}" fill="none" stroke="#6f97a8" stroke-width="1.4"/>
    <path d="M${X0} ${TOP} h10 M${X1} ${TOP} h-10 M${X0} 470 h10 M${X1} 470 h-10" stroke="#4f6f7c" stroke-width="4"/>
    <path d="M${X0} ${TOP} v10 M${X1} ${TOP} v10 M${X0} 470 v-10 M${X1} 470 v-10" stroke="#4f6f7c" stroke-width="4"/>
    <g fill="#ffffff" opacity=".28"><path d="M240 200 L262 200 L222 440 L200 440 Z"/><path d="M276 200 L284 200 L244 440 L236 440 Z"/><path d="M700 210 L712 210 L680 400 L668 400 Z"/></g>
    <g font-size="13" font-family="Jua, sans-serif" fill="#4f6f7c">
      <text x="${X1 + 12}" y="${S - 8}">물 위</text><path d="M${X1 + 4} ${S} h6" stroke="#4f6f7c"/>
      <text x="${X1 + 12}" y="${(S + FLOOR) / 2 + 4}">물속</text>
      <text x="${X1 + 12}" y="${FLOOR + 4}">바닥</text>
    </g>
    <g id="spoon" transform="translate(735 132)" opacity="0">
      <path d="M0 0 L60 -14" stroke="#9aa1a7" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="-6" cy="2" rx="16" ry="7" fill="#eef1f3" stroke="#7f868d" stroke-width=".9"/>
      <g fill="#fff" stroke="#b9bfc4" stroke-width=".4"><rect x="-12" y="-3" width="4" height="4"/><rect x="-6" y="-5" width="4" height="4"/><rect x="0" y="-3" width="3.5" height="3.5"/></g>
    </g>
    <g id="fx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>물체가 뜨고 가라앉는 것은 크기나 무게만으로 정해지지 않습니다. 같은 크기일 때 얼마나 무거운지(밀도), 즉 무엇으로 만들었는지가 중요합니다. 저학년에게는 “나무·과일·플라스틱은 뜨고, 쇠·돌은 가라앉았다”처럼 재료로 정리해 줍니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 큰 통나무와 작은 클립 중 무엇이 가라앉을까? 도토리는 “크고 무거우면 가라앉는다”는 흔한 생각을 말합니다.</li><li>실험: 물건 8개를 하나씩 골라 뜰지 가라앉을지 먼저 고른 뒤 넣어 봅니다. 결과가 두 칸으로 저절로 분류되고, 예상이 맞으면 초록 테두리가 생깁니다.</li><li>발견: 크기가 아니라 재료로 다시 묶어 봅니다.</li><li>놀이: 맹물에서 가라앉는 달걀을 소금물로 띄웁니다. 소금 3숟가락에서는 물속 가운데에, 4숟가락부터는 물 위로 떠오릅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>큰 배는 쇠로 만들었는데 왜 뜰까? (찰흙 배 만들기 실험으로 이어집니다)</li><li>바닷물에서 수영할 때 몸이 더 잘 뜨는 까닭은?</li><li>사과를 반으로 자르면 뜰까, 가라앉을까?</li></ul></div>
    <div><h3>교과 연계</h3><p>3학년 과학 「물질의 성질」(물체와 물질, 재료에 따른 성질)의 준비 활동. 1~2학년 통합교과 여름 주제(물놀이)와 함께 쓰기 좋습니다.</p></div>
    <div><h3>교실에서 실제로 해 보기</h3><p>달걀 띄우기는 물 한 컵에 소금을 큰 숟가락으로 조금씩 녹이며 쉽게 해 볼 수 있습니다. 필요한 소금 양은 물의 양과 달걀에 따라 다릅니다.</p></div>`;

  HH.register({
    id: 'float',
    cards: [
      { id: 'float-stuff', no: 1, text: '크기가 아니라 무엇으로 만들었는지에 따라 뜨고 가라앉아요.', art: art1 },
      { id: 'float-salt', no: 2, text: '소금을 많이 녹인 물에서는 가라앉던 달걀도 떠올라요.', art: art2 }
    ],
    thumb() { return miniTank(['log', 'apple'], ['coin', 'stone'], 'xart'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'float', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 30 30" aria-hidden="true"><use href="#obj-apple" x="2" y="0" width="26" height="29"/></svg>물건을 고르고, 뜰지 가라앉을지 먼저 정한 다음 수조에 넣어 봐요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, sel: null, busy: false, guesses: {}, results: {}, spoons: 0, egg: null, pouring: false, eggState: null, eggSaid: null }); }
      fresh();

      /* scenery */
      (function () {
        const R = rng(41);
        const t = $('#flTrees'); [30, 90, 250, 330, 640, 720, 900, 970].forEach(x => HH.tree(t, x, 304, .75 + R() * .4));
        const lr = $('#laneRope'); for (let x = 6; x < 1000; x += 16) el('ellipse', { cx: x, cy: 326, rx: 7, ry: 4, fill: (x / 16 | 0) % 2 ? '#d4574a' : '#f7efe0', stroke: '#8a2c22', 'stroke-width': .5 }, lr);
        const tl = $('#tiles');
        for (let y = 344; y < 560; y += 24) el('path', { d: `M0 ${y} H1000`, stroke: '#c3d2d5', 'stroke-width': .8 }, tl);
        for (let x = 0; x < 1000; x += 40) el('path', { d: `M${x} 344 V560`, stroke: '#c3d2d5', 'stroke-width': .8 }, tl);
        const pb = $('#pebbles');
        for (let i = 0; i < 70; i++) el('ellipse', { cx: (X0 + 8 + R() * (X1 - X0 - 16)).toFixed(1), cy: (FLOOR + 3 + R() * 14).toFixed(1), rx: (1.5 + R() * 3).toFixed(1), ry: (1 + R() * 2).toFixed(1), fill: R() < .5 ? '#bfae86' : '#a99b78', stroke: '#8a7d5e', 'stroke-width': .4 }, pb);
      })();

      /* ---------- simulation ---------- */
      let bodies = [], bubbles = [], ripples = [], drops = [], grains = [];
      let looping = false;
      function restY(id) { const o = OBJ[id]; const hh = id === 'coin' ? 10 : id === 'clip' ? 20 : o.h; return FLOOR - hh / 2; }
      function eqY(id) { const o = OBJ[id]; return S - o.h / 2 + o.f * o.h; }
      function dropObj(id, x) {
        const b = { id, x: x, x0: x, y: 120, vy: 0, t: 0, mode: 'air', rot: 0, sx: 1, sy: 1, bt: 0 };
        b.g = el('g', {}, $('#objs'));
        const o = OBJ[id] || { w: 34, h: 44 };
        el('use', { href: `#obj-${id}`, x: -o.w / 2, y: -o.h / 2, width: o.w, height: o.h }, b.g);
        bodies.push(b); kick(); return b;
      }
      function splash(x) {
        const fx = $('#fx'), R = Math.random;
        for (let i = 0; i < 12; i++) { const a = Math.PI * (.15 + .7 * R()), sp = 80 + R() * 140; drops.push({ e: el('circle', { r: (1.2 + R() * 2).toFixed(1), fill: '#9fd3ef', stroke: '#2f73ad', 'stroke-width': .4 }, fx), x, y: S - 2, vx: Math.cos(a) * sp * (R() < .5 ? -1 : 1), vy: -Math.sin(a) * sp, t: 0 }); }
        ripples.push({ e: el('ellipse', { cx: x, cy: S, rx: 10, ry: 3, fill: 'none', stroke: '#fff', 'stroke-width': 1.4 }, $('#ripples')), t: 0 });
        ripples.push({ e: el('ellipse', { cx: x, cy: S, rx: 6, ry: 2, fill: 'none', stroke: '#fff', 'stroke-width': 1 }, $('#ripples')), t: -.2 });
      }
      function bubble(x, y) { bubbles.push({ e: el('circle', { r: (1.5 + Math.random() * 2.5).toFixed(1), fill: '#e9f6fd', 'fill-opacity': .5, stroke: '#ffffff', 'stroke-width': .7 }, $('#under')), x, y, ph: Math.random() * 6 }); }
      function puff(x) { for (let i = 0; i < 6; i++) { const e = el('circle', { cx: x, cy: FLOOR, r: 2, fill: '#cdbb92', opacity: .8 }, $('#under')); grains.push({ e, x: x + (Math.random() - .5) * 6, y: FLOOR, vx: (Math.random() - .5) * 60, vy: -20 - Math.random() * 20, t: 0, kind: 'puff' }); } }

      function eggTarget() {
        const D = 1 + st.spoons * SALT_STEP;
        if (D < EGG - 1e-9) return FLOOR - 22;
        if (Math.abs(D - EGG) < 1e-9) return (S + FLOOR) / 2;
        return S - 22 + 44 * (EGG / D);
      }

      function step(dt) {
        let busy = false;
        bodies.forEach(b => {
          const o = OBJ[b.id];
          b.t += dt;
          if (b.mode === 'air') {
            b.vy += 900 * dt; b.y += b.vy * dt; busy = true;
            if (b.y >= S) { splash(b.x); b.mode = 'water'; b.t = 0; b.vy *= b.id === 'egg' ? .3 : .45; }
          } else if (b.mode === 'water') {
            busy = true;
            if (b.id === 'egg') {
              const tg = eggTarget();
              b.vy += ((tg - b.y) * 2.6 - b.vy * 2.4) * dt; b.y += b.vy * dt; b.rot = Math.sin(b.t * 1.6) * 4;
              if (Math.abs(tg - b.y) < 1 && Math.abs(b.vy) < 2) { b.y = tg; b.vy = 0; b.mode = 'hold'; b.rot = 0; eggSettled(); }
            } else if (o.float) {
              const eq = eqY(b.id);
              b.vy += ((eq - b.y) * 28 - b.vy * 4.2) * dt; b.y += b.vy * dt; b.rot = Math.sin(b.t * 4) * 5 * Math.exp(-b.t * 1.4);
              if (b.t > 1 && Math.abs(eq - b.y) < .4 && Math.abs(b.vy) < 3) { b.y = eq; b.vy = 0; b.rot = 0; b.mode = 'rest'; rested(b); }
            } else {
              b.vy += (o.vt - b.vy) * Math.min(1, dt * 3); b.y += b.vy * dt;
              if (o.flutter) { b.x = b.x0 + Math.sin(b.t * 5) * 12; b.sx = Math.cos(b.t * 5); }
              if (b.id === 'clip') b.rot = Math.min(90, b.t * 90);
              b.bt += dt; if (b.bt > .12 && b.t < 1.4) { b.bt = 0; bubble(b.x + (Math.random() - .5) * o.w * .4, b.y - o.h * .3); }
              const ry = restY(b.id);
              if (b.y >= ry) { b.y = ry; b.mode = 'rest'; b.x = b.x0; if (b.id === 'coin') { b.sx = 1; b.sy = .35; } if (b.id === 'clip') b.rot = 90; puff(b.x); rested(b); }
            }
          } else if (b.mode === 'hold' && b.id === 'egg') {
            const tg = eggTarget();
            if (Math.abs(tg - b.y) > 1) { b.mode = 'water'; b.t = 0; busy = true; }
          }
          b.g.setAttribute('transform', `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.rot.toFixed(1)}) scale(${b.sx.toFixed(2)} ${b.sy.toFixed(2)})`);
        });
        bubbles = bubbles.filter(q => { q.y -= 70 * dt; q.ph += dt * 6; q.e.setAttribute('cx', (q.x + Math.sin(q.ph) * 2).toFixed(1)); q.e.setAttribute('cy', q.y.toFixed(1)); if (q.y <= S + 2) { q.e.remove(); return false; } return true; });
        ripples = ripples.filter(r => { r.t += dt; if (r.t < 0) return true; const k = r.t / 1; r.e.setAttribute('rx', (10 + 80 * k).toFixed(1)); r.e.setAttribute('ry', (3 + 6 * k).toFixed(1)); r.e.setAttribute('opacity', Math.max(0, 1 - k).toFixed(2)); if (k >= 1) { r.e.remove(); return false; } return true; });
        drops = drops.filter(d => { d.t += dt; d.vy += 600 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.e.setAttribute('cx', d.x.toFixed(1)); d.e.setAttribute('cy', d.y.toFixed(1)); if (d.y > S + 4 || d.t > 1) { d.e.remove(); return false; } return true; });
        grains = grains.filter(g => {
          g.t += dt;
          if (g.kind === 'puff') { g.x += g.vx * dt; g.y += g.vy * dt; g.vy += 40 * dt; g.e.setAttribute('cx', g.x.toFixed(1)); g.e.setAttribute('cy', g.y.toFixed(1)); g.e.setAttribute('opacity', Math.max(0, .8 - g.t).toFixed(2)); if (g.t > .8) { g.e.remove(); return false; } return true; }
          g.vy += (g.y < S ? 500 : -g.vy * 3 + 60) * dt; g.y += g.vy * dt; g.x += g.vx * dt;
          const fade = g.y > S ? Math.max(0, 1 - (g.y - S) / 90) : 1;
          g.e.setAttribute('x', g.x.toFixed(1)); g.e.setAttribute('y', g.y.toFixed(1)); g.e.setAttribute('opacity', fade.toFixed(2));
          if (fade <= 0) { g.e.remove(); return false; } return true;
        });
        return busy || bubbles.length || ripples.length || drops.length || grains.length;
      }
      function kick() {
        if (looping) return; looping = true; let last = null;
        (function f(n) {
          if (!alive()) { looping = false; return; }
          if (last === null) last = n; const dt = Math.min(.033, (n - last) / 1000); last = n;
          if (step(dt)) requestAnimationFrame(f); else looping = false;
        })(performance.now());
      }

      /* ---------- test: predict then drop ---------- */
      function rested(b) {
        if (st.phase !== 'test') return;
        const id = b.id, o = OBJ[id], actual = o.float ? 'float' : 'sink', ok = st.guesses[id] === actual;
        st.results[id] = actual; st.busy = false; st.sel = null;
        const n = josa(o.name, '은', '는');
        let msg = ok ? `예상대로 ${n} <b>${actual === 'float' ? '둥둥 떴어' : '퐁당 가라앉았어'}</b>!` : `앗! ${n} 생각과 달리 <b>${actual === 'float' ? '둥둥 떴어' : '퐁당 가라앉았어'}</b>!`;
        msg += { log: ' 이렇게 크고 무거운 통나무가 뜨다니!', melon: ' 커다란 수박도 물에 뜨는구나.', coin: ' 이렇게 작은데도 가라앉았어.', clip: ' 아주 가벼운데도 가라앉았어.' }[id] || '';
        const done = IDS.every(k => st.results[k]);
        msg += done ? ' 모두 넣어 봤네. <b>발견하기</b>를 눌러 봐!' : ' 다음 물건을 골라 봐.';
        say('owl', msg, ok);
        renderControls();
      }
      function sortCols(big) {
        const col = (kind, title) => `<div class="scol"><h4>${title}</h4><div class="sicons">${IDS.filter(k => st.results[k] === kind).map(k => `<span class="sicon ${st.guesses[k] === kind ? 'ok' : 'miss'}" title="${OBJ[k].name}">${icon(k)}</span>`).join('')}</div></div>`;
        const n = IDS.filter(k => st.results[k]).length, right = IDS.filter(k => st.results[k] && st.guesses[k] === st.results[k]).length;
        return `<div class="sortcols ${big ? 'big' : ''}">${col('float', '둥둥 떴어요')}${col('sink', '퐁당 가라앉았어요')}</div>
          <p style="margin:8px 0 0;font-size:14px;color:var(--ink-soft)">예상 맞힌 수 <b style="font-family:var(--display);font-weight:400;color:var(--ink);font-size:18px">${right}</b> / ${n} · 초록 테두리는 예상이 맞은 물건</p>`;
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          const sel = st.sel && OBJ[st.sel];
          c.innerHTML = `<p class="lab">물건을 하나 골라 봐</p><div class="objs">${IDS.map(k => `<button type="button" class="obj ${st.sel === k ? 'on' : ''}" data-obj="${k}" ${st.results[k] || st.busy ? 'disabled' : ''} aria-pressed="${st.sel === k}">${icon(k)}<span>${OBJ[k].name}</span><small>${OBJ[k].size}</small></button>`).join('')}</div>
            ${sel ? `<p class="lab" style="margin-top:12px">${josa(sel.name, '은', '는')} 어떻게 될까?</p><div class="guess"><button type="button" class="up" data-guess="float" ${st.busy ? 'disabled' : ''}>〰 둥둥 뜰 거야</button><button type="button" class="down" data-guess="sink" ${st.busy ? 'disabled' : ''}>↓ 퐁당 가라앉을 거야</button></div>` : ''}`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${sortCols()}${IDS.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          const D = 1 + st.spoons * SALT_STEP;
          const status = !st.egg ? '아직 달걀을 넣지 않았어요' : D < EGG - 1e-9 ? '달걀이 바닥에 있어요' : Math.abs(D - EGG) < 1e-9 ? '달걀이 물 가운데에 떠 있어요' : '달걀이 물 위로 떠올랐어요';
          c.innerHTML = `<p class="lab">달걀을 띄워라!</p><div class="btns">
            <button type="button" class="btn" data-act="egg" ${st.egg ? 'disabled' : ''}>달걀 넣기</button>
            <button type="button" class="btn primary" data-act="salt" ${st.spoons >= MAX_SPOONS || st.pouring ? 'disabled' : ''}>소금 한 숟가락 녹이기</button>
            <button type="button" class="btn small" data-act="fresh">새 물로 바꾸기</button></div>`;
          side.innerHTML = `<p class="lab">녹인 소금</p><div class="spoons" aria-label="소금 ${st.spoons}숟가락">${Array.from({ length: MAX_SPOONS }, (_, i) => `<span class="${i < st.spoons ? 'full' : ''}"></span>`).join('')}</div>
            <p style="margin:0;font-size:15px"><b style="font-family:var(--display);font-weight:400;font-size:20px">${st.spoons}</b>숟가락 · ${status}</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 통나무와 클립 중 무엇이 가라앉을지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${sortCols()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="-80 -52 160 104" aria-hidden="true"><use href="#obj-log" x="-78" y="-25" width="156" height="50"/></svg><svg class="sq" viewBox="-16 -20 32 40" style="height:50px" aria-hidden="true"><use href="#obj-clip" x="-10" y="-19" width="20" height="38"/></svg></div>
          <p class="eyebrow">물놀이장 · 뜨고 가라앉기</p><h2>둥둥 퐁당</h2>
          <p class="lead">통나무, 수박, 동전, 클립…<br>물에 넣으면 무엇이 뜨고 무엇이 가라앉을까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '<b>아주 큰 통나무</b>와 <b>아주 작은 클립</b>이 있어. 물에 넣으면 <b>무엇이 가라앉을까?</b>')}
          ${HH.talk('squirrel', '통나무는 엄청 크고 무거우니까 퐁당 가라앉을 거야!')}
          <div class="picks"></div></div>`);
        // build the three pictures explicitly (log sinking is drawn as the log on the bottom)
        const logBottom = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e6f0f2"/><rect x="18" y="20" width="124" height="72" fill="#f4fafb" stroke="#8fb3c2"/><rect x="19" y="86" width="122" height="5" fill="#d8c8a0"/>${place('log', 62, 75, .42)}${place('clip', 116, 40 - 38 * .42 / 2 + 2, .42)}<rect x="19" y="40" width="122" height="51" fill="url(#waterG)"/><path d="M19 40 H141" stroke="#fff" opacity=".8"/><rect x="18" y="20" width="124" height="72" fill="none" stroke="#6f97a8" stroke-width="1.2"/></svg>`;
        const clipBottom = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e6f0f2"/><rect x="18" y="20" width="124" height="72" fill="#f4fafb" stroke="#8fb3c2"/><rect x="19" y="86" width="122" height="5" fill="#d8c8a0"/>${place('log', 62, 40 - 25 * .42 + 27 * .42, .42)}${place('clip', 116, 82, .42, 'rotate(90)')}<rect x="19" y="40" width="122" height="51" fill="url(#waterG)"/><path d="M19 40 H141" stroke="#fff" opacity=".8"/><rect x="18" y="20" width="124" height="72" fill="none" stroke="#6f97a8" stroke-width="1.2"/></svg>`;
        const both = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e6f0f2"/><rect x="18" y="20" width="124" height="72" fill="#f4fafb" stroke="#8fb3c2"/><rect x="19" y="86" width="122" height="5" fill="#d8c8a0"/>${place('log', 62, 75, .42)}${place('clip', 116, 82, .42, 'rotate(90)')}<rect x="19" y="40" width="122" height="51" fill="url(#waterG)"/><path d="M19 40 H141" stroke="#fff" opacity=".8"/><rect x="18" y="20" width="124" height="72" fill="none" stroke="#6f97a8" stroke-width="1.2"/></svg>`;
        root.querySelector('.ov .picks').innerHTML = `
          <button type="button" class="pick" data-pick="log">${logBottom}<span>통나무가 퐁당</span></button>
          <button type="button" class="pick" data-pick="clip">${clipBottom}<span>클립이 퐁당</span></button>
          <button type="button" class="pick" data-pick="both">${both}<span>둘 다 퐁당</span></button>`;
        root.querySelector('.ov .ov-card').insertAdjacentHTML('beforeend', '<p style="text-align:center;color:var(--ink-soft)">가라앉은 물건은 수조 바닥에 그려져 있어요</p>');
      }
      function discover() {
        setPhase('discover'); HH.addCard('float-stuff');
        const msg = { clip: '예상이 맞았어! 작은 클립은 가라앉고, 커다란 통나무는 둥둥 떴지.', log: '도토리랑 같은 생각이었구나! 그런데 커다란 통나무는 둥둥 떴고, 작은 클립이 가라앉았어.', both: '통나무는 크지만 둥둥 떴어. 가라앉은 건 작은 클립이었지.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${sortCols(true)}
          ${HH.talk('owl', msg + ' 뜬 것은 <b>나무, 과일, 플라스틱</b>이고, 가라앉은 것은 <b>쇠와 돌</b>로 만든 거였어.')}
          ${HH.talk('squirrel', '크다고 다 가라앉는 게 아니구나! 무엇으로 만들었는지가 중요하네.')}
          ${HH.dcard(1, art1(), '크기가 아니라 무엇으로 만들었는지에 따라 뜨고 가라앉아요.', '큰 통나무와 수박은 뜨고, 작은 동전과 클립은 가라앉았어요.')}
          <button type="button" class="btn primary" data-act="play">달걀 띄우기 놀이 하기</button></div>`);
      }
      function saltCard() {
        HH.addCard('float-salt');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '소금을 녹이면 물이 달걀을 <b>더 세게 밀어 올려</b>. 그래서 바닷물에서는 몸이 더 잘 뜬단다.')}
          ${HH.dcard(2, art2(), '소금을 많이 녹인 물에서는 가라앉던 달걀도 떠올라요.', '3숟가락에서는 물속 가운데에, 4숟가락부터는 물 위로 떠올랐어요.')}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }

      /* ---------- play: salt and the egg ---------- */
      function clearTank() { bodies.forEach(b => b.g.remove()); bodies = []; st.egg = null; }
      function eggSettled() {
        if (st.phase !== 'play') return;
        const D = 1 + st.spoons * SALT_STEP;
        const state = D < EGG - 1e-9 ? 'bottom' : Math.abs(D - EGG) < 1e-9 ? 'middle' : 'top';
        renderControls();
        if (state === st.eggSaid) return; st.eggSaid = state;
        if (state === 'bottom') say(st.spoons ? 'squirrel' : 'owl', st.spoons ? '달걀은 아직 바닥에 있어. 한 숟가락 더 녹여 볼까?' : '맹물에서는 달걀이 <b>퐁당</b> 가라앉았어. 이제 <b>소금</b>을 한 숟가락씩 녹여 보자.');
        else if (state === 'middle') say('owl', '어? 달걀이 물 <b>가운데</b>로 둥실 올라왔어! 한 숟가락 더 넣으면 어떻게 될까?', true);
        else { say('owl', '달걀이 <b>물 위로</b> 떠올랐어!', true); if (!HH.hasCard('float-salt')) setTimeout(() => { if (alive()) saltCard(); }, 700); }
      }
      function pourSalt() {
        if (st.pouring || st.spoons >= MAX_SPOONS) return;
        st.pouring = true; renderControls();
        const sp = $('#spoon'); sp.setAttribute('opacity', 1);
        let t0 = performance.now();
        (function tilt(n) {
          if (!alive()) return;
          const k = Math.min(1, (n - t0) / 500);
          sp.setAttribute('transform', `translate(735 132) rotate(${(-k * 35).toFixed(1)})`);
          if (k < 1) requestAnimationFrame(tilt);
          else {
            for (let i = 0; i < 26; i++) { const e = el('rect', { width: 2.6, height: 2.6, fill: '#fff', stroke: '#b9bfc4', 'stroke-width': .4 }, $('#fx')); grains.push({ e, x: 722 + Math.random() * 14, y: 138 + Math.random() * 6, vx: (Math.random() - .6) * 50, vy: Math.random() * 40, t: 0, kind: 'salt' }); }
            kick();
            setTimeout(() => {
              if (!alive()) return;
              st.spoons++; st.pouring = false; sp.setAttribute('opacity', 0); sp.setAttribute('transform', 'translate(735 132)');
              $('#saltTint').setAttribute('opacity', (st.spoons * .03).toFixed(2));
              renderControls();
              if (st.egg) { st.eggSaid = null; st.egg.mode = st.egg.mode === 'air' ? 'air' : 'water'; st.egg.t = 0; kick(); }
              else say('owl', `소금 ${st.spoons}숟가락을 녹였어. 이제 <b>달걀</b>을 넣어 볼까?`);
            }, 900);
          }
        })(t0);
      }

      function reset() {
        fresh(); clearTank(); ui.hide(); $('#saltTint').setAttribute('opacity', 0);
        setPhase('intro'); say('owl', '안녕! 오늘은 물에 여러 가지 물건을 넣어 볼 거야.'); intro();
      }

      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.obj) { if (st.busy) return; st.sel = b.dataset.obj; renderControls(); say('owl', `${josa(OBJ[st.sel].name, '을', '를')} 골랐어. 물에 넣으면 <b>둥둥</b> 뜰까, <b>퐁당</b> 가라앉을까?`); return; }
        if (b.dataset.guess) {
          if (!st.sel || st.busy) return;
          st.guesses[st.sel] = b.dataset.guess; st.busy = true;
          dropObj(st.sel, OBJ[st.sel].lane); renderControls(); return;
        }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '이제 물건을 하나씩 넣어 보자. 물건을 고르고, <b>뜰지 가라앉을지</b> 먼저 정해 봐!', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); clearTank(); setPhase('play'); say('owl', '이번엔 <b>달걀</b>이야. 맹물에 넣으면 어떻게 될까? <b>달걀 넣기</b>를 눌러 봐.', true); }
        else if (act === 'egg') { if (!st.egg) { st.egg = dropObj('egg', 500); st.eggSaid = null; renderControls(); } }
        else if (act === 'salt') pourSalt();
        else if (act === 'fresh') { st.spoons = 0; st.eggSaid = null; $('#saltTint').setAttribute('opacity', 0); if (st.egg) { st.egg.mode = 'water'; st.egg.t = 0; kick(); } renderControls(); say('owl', '새 물로 바꿨어. 달걀은 어떻게 될까?'); }
        else if (act === 'close') ui.hide();
      });

      setPhase('intro');
      say('owl', '안녕! 오늘은 물에 여러 가지 물건을 넣어 볼 거야.');
      intro();
    }
  });
})();
