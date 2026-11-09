/* 자석 낚시터 · 자석 낚시 */
(function () {
  const { el, rng, josa } = HH;
  const S = 292, BOTTOM = 500, IDLE = 236, ROD_Y = 158, R = 44;

  /* things on the pond floor; every drawing has its reference at the bottom centre */
  const T = {
    clip: { name: '클립', mag: true, w: 38, h: 20, stuff: '쇠', svg: () => `<g transform="translate(0 -10) rotate(90)"><use href="#obj-clip" x="-10" y="-19" width="20" height="38"/></g>` },
    nail: { name: '못', mag: true, w: 58, h: 11, stuff: '쇠', svg: () => `<path d="M-24 -8 H24 L30 -5.5 L24 -3 H-24 Z" fill="url(#steelG)" stroke="#4f5459" stroke-width=".7"/><rect x="-29" y="-11" width="5" height="11" rx="1" fill="url(#steelG)" stroke="#4f5459" stroke-width=".7"/><path d="M-20 -7 H20" stroke="#fff" stroke-width=".6" opacity=".6"/>` },
    cap: { name: '병뚜껑', mag: true, w: 32, h: 12, stuff: '쇠', svg: () => `<path d="M-15 0 L-14 -9 Q0 -13 14 -9 L15 0 L12 -3 L9 0 L6 -3 L3 0 L0 -3 L-3 0 L-6 -3 L-9 0 L-12 -3 Z" fill="#c9443a" stroke="#7d2b23" stroke-width=".7"/><path d="M-12 -9.5 Q0 -12 12 -9.5" stroke="#f2c230" stroke-width="1.4" fill="none"/>` },
    pin: { name: '옷핀', mag: true, w: 46, h: 16, stuff: '쇠', svg: () => `<g fill="none" stroke="#7f868d" stroke-width="1.8" stroke-linecap="round"><path d="M-20 -8 a6 6 0 1 0 0.1 0 M-20 -14 H18 M-20 -2 H12"/></g><path d="M12 -5 h8 a3 3 0 0 0 0 -6 h-4" fill="#c9ced2" stroke="#6b7178" stroke-width=".8"/>` },
    coin: { name: '동전', mag: false, w: 28, h: 22, stuff: '구리·니켈', svg: () => `<g transform="translate(0 -11) scale(1 .78)"><use href="#obj-coin" x="-14" y="-14" width="28" height="28"/></g>` },
    can: { name: '알루미늄 캔', mag: false, w: 60, h: 26, stuff: '알루미늄', svg: () => `<rect x="-28" y="-26" width="56" height="26" rx="6" fill="url(#canG)" stroke="#5a6a72" stroke-width=".8"/><rect x="-14" y="-26" width="18" height="26" fill="#3f7fb8" opacity=".85"/><ellipse cx="28" cy="-13" rx="4" ry="12" fill="#e6e9ec" stroke="#5a6a72" stroke-width=".7"/><path d="M-24 -21 H22" stroke="#fff" stroke-width="1.2" opacity=".6"/>` },
    eraser: { name: '지우개', mag: false, w: 36, h: 16, stuff: '고무', svg: () => `<rect x="-17" y="-16" width="34" height="16" rx="2" fill="#fbfaf6" stroke="#9a968c" stroke-width=".8"/><rect x="-4" y="-16.5" width="19" height="17" fill="#4f9fd8" stroke="#2f6f9f" stroke-width=".6"/>` },
    marble: { name: '유리구슬', mag: false, w: 20, h: 20, stuff: '유리', svg: () => `<circle cx="0" cy="-10" r="9.5" fill="#9fd8c9" fill-opacity=".8" stroke="#3f7a6a" stroke-width=".8"/><path d="M-5 -12 q4 -6 10 -2" stroke="#2f8f86" stroke-width="2" fill="none" opacity=".7"/><circle cx="-3" cy="-14" r="2.4" fill="#fff" opacity=".8"/>` },
    clips: { name: '클립 더미', mag: true, w: 46, h: 22, stuff: '쇠', svg: () => [[-12, 0, 20], [8, -2, -15], [-2, -10, 80], [12, -12, 60]].map(([x, y, r]) => `<g transform="translate(${x} ${y - 8}) rotate(${r}) scale(.8)"><use href="#obj-clip" x="-10" y="-19" width="20" height="38"/></g>`).join('') }
  };
  /* draw everything a little larger so small hands and eyes can find it */
  const SC = 1.35;
  Object.values(T).forEach(o => { const f = o.svg; o.w *= SC; o.h *= SC; o.svg = () => `<g transform="scale(${SC})">${f()}</g>`; });
  const TEST = ['clip', 'coin', 'nail', 'can', 'cap', 'eraser', 'pin', 'marble'];
  const TX = [384, 456, 528, 604, 680, 752, 826, 904];

  function magnetSVG() {
    return `<path d="M-17 0 V-17 A17 17 0 0 1 17 -17 V0 H8 V-17 A8 8 0 0 0 -8 -17 V0 Z" fill="url(#magG)" stroke="#7d2b23" stroke-width=".9"/>
      <rect x="-17" y="-7" width="9" height="7" fill="#d9dcdf" stroke="#6b7178" stroke-width=".7"/><rect x="8" y="-7" width="9" height="7" fill="#d9dcdf" stroke="#6b7178" stroke-width=".7"/>
      <text x="-12.5" y="-10" text-anchor="middle" font-size="7" fill="#fff" font-family="Jua, sans-serif">N</text><text x="12.5" y="-10" text-anchor="middle" font-size="7" fill="#fff" font-family="Jua, sans-serif">S</text>
      <path d="M-11 -24 A12 12 0 0 1 4 -31" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5"/>`;
  }
  function chainSVG(n) { let s = ''; for (let i = 0; i < n; i++) s += `<g transform="translate(${i % 2 ? 2 : -2} ${17 + i * 30}) rotate(${i % 2 ? 6 : -6})"><use href="#obj-clip" x="-10" y="-19" width="20" height="38"/></g>`; return s; }
  function icon(k) { const o = T[k]; const v = Math.max(o.w, o.h) + 6; return `<svg viewBox="${-v / 2} ${-v / 2 - o.h / 2} ${v} ${v}" aria-hidden="true">${o.svg()}</svg>`; }

  function miniMagnet(stuck, below, chain) {
    let s = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e6f0f2"/><rect y="70" width="160" height="30" fill="#9cc6dc" opacity=".6"/><rect y="94" width="160" height="6" fill="#d8c8a0"/>
      <path d="M80 0 V26" stroke="#7a6a52" stroke-width="1"/><g transform="translate(80 40) scale(.9)">${magnetSVG()}</g>`;
    let y = 40;
    if (chain) s += `<g transform="translate(80 40) scale(.62)">${chainSVG(3)}</g>`;
    stuck.forEach(k => { const o = T[k]; y += o.h * .55 + 1; s += `<g transform="translate(80 ${y.toFixed(1)}) scale(.55)">${o.svg()}</g>`; });
    below.forEach((k, i) => { s += `<g transform="translate(${32 + i * 96} 94) scale(.55)">${T[k].svg()}</g>`; if (!chain) s += `<path d="M${24 + i * 96} 60 l14 14 M${38 + i * 96} 60 l-14 14" stroke="#9c4524" stroke-width="2" stroke-linecap="round" opacity=".8"/>`; });
    return s + '</svg>';
  }
  const art1 = () => miniMagnet(['clip', 'nail'], ['coin', 'can']);
  const art2 = () => miniMagnet([], [], true);

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="연못 위 다리에서 자석 낚싯대로 물건을 건져 올리는 장면">
    <defs>
      <linearGradient id="pondDeep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc4dc" stop-opacity=".45"/><stop offset="1" stop-color="#3a7d9c" stop-opacity=".6"/></linearGradient>
    </defs>
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="120" cy="64" r="80" fill="url(#sunGlow)"/>
    <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8"><path d="M640 70 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".85"/></g>
    <path d="M0 250 C140 220 260 236 380 240 C520 244 640 212 780 220 C880 226 950 212 1000 216 L1000 300 L0 300 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g id="mgTrees"></g>
    <rect y="${S}" width="1000" height="${560 - S}" fill="#e8f2f4"/>
    <rect y="${BOTTOM}" width="1000" height="${560 - BOTTOM}" fill="#d3c39c"/>
    <g id="mgFloor"></g>
    <g id="mgObjs"></g>
    <g id="mgFish"></g>
    <rect y="${S}" width="1000" height="${BOTTOM + 8 - S}" fill="url(#pondDeep)"/>
    <path d="M0 ${S} C200 ${S - 2} 400 ${S + 2} 600 ${S} S900 ${S - 2} 1000 ${S}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".85"/>
    <g id="mgLily"></g>
    <!-- footbridge -->
    <g id="bridge">
      <rect x="0" y="226" width="1000" height="11" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
      <g id="planks"></g>
      <g id="posts"></g>
      <path d="M0 196 C125 202 125 202 250 196 C375 202 375 202 500 196 C625 202 625 202 750 196 C875 202 875 202 1000 196" fill="none" stroke="#a8875a" stroke-width="2"/>
    </g>
    <g id="mgRig"></g>
    <path d="M60 226 l-4 -30 h36 l-4 30 Z" fill="#7d909a" stroke="#4f5f66" stroke-width=".8"/><path d="M58 198 Q74 182 90 198" fill="none" stroke="#4f5f66" stroke-width="1.4"/>
    <g id="mgFx"></g>
    <rect id="tapZone" x="300" y="${S}" width="700" height="${BOTTOM - S + 20}" fill="#fff" fill-opacity="0" style="cursor:pointer"/>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>자석에는 철(쇠)로 만든 물체가 붙습니다. 반짝이는 금속이라고 모두 붙지는 않습니다. 동전(구리·니켈 합금)과 알루미늄 캔은 붙지 않습니다. 자석은 물속에서도, 닿기 전부터도 철을 끌어당깁니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 반짝이는 동전과 알루미늄 캔은 자석에 붙을까? 도토리는 “반짝이는 금속은 다 붙는다”는 흔한 생각을 말합니다.</li><li>실험: 물건 8개를 하나씩 골라 붙을지 먼저 정한 뒤 자석 낚싯대로 건져 봅니다.</li><li>발견: 붙는 것과 붙지 않는 것을 재료로 나눠 봅니다.</li><li>놀이: 연못 아무 곳이나 눌러 쇠붙이를 낚습니다. 클립 더미를 낚으면 클립이 줄줄이 매달리는 모습을 볼 수 있습니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>동전도 금속인데 왜 붙지 않았을까?</li><li>자석이 닿기 전에 클립이 먼저 움직인 까닭은?</li><li>교실에서 자석에 붙는 물건을 찾아볼까? (칠판, 사물함, 책상 다리)</li></ul></div>
    <div><h3>교과 연계</h3><p>3학년 과학 「자석의 이용」(자석에 붙는 물체, 자석의 극) 준비 활동. 자석에 N극과 S극 표시를 해 두었습니다.</p></div>
    <div><h3>교실에서 실제로 해 보기</h3><p>캔은 재료에 따라 다릅니다. 알루미늄 캔은 붙지 않지만 철로 만든 통조림 캔은 붙습니다. 동전도 나라와 종류에 따라 붙는 것이 있으니 미리 확인해 주세요.</p></div>`;

  HH.register({
    id: 'magnet',
    cards: [
      { id: 'magnet-iron', no: 1, text: '자석에는 쇠(철)로 만든 물건만 붙어요.', art: art1 },
      { id: 'magnet-chain', no: 2, text: '자석에 붙은 클립도 잠깐 자석이 되어 다른 클립을 끌어당겨요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'magnet', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="-20 -36 40 40" aria-hidden="true">' + magnetSVG() + '</svg>빨간 말굽자석을 연못에 내려서 물건을 건져 봐요. 놀이에서는 연못 아무 곳이나 눌러요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, sel: null, busy: false, guesses: {}, results: {}, score: 0, saidReach: false }); }
      fresh();

      (function () {
        const Rn = rng(61);
        const t = $('#mgTrees'); [40, 160, 280, 520, 700, 860, 960].forEach(x => HH.tree(t, x, 290, .75 + Rn() * .4));
        const fl = $('#mgFloor');
        for (let i = 0; i < 90; i++) el('ellipse', { cx: (Rn() * 1000).toFixed(1), cy: (BOTTOM + 4 + Rn() * 50).toFixed(1), rx: (1.5 + Rn() * 4).toFixed(1), ry: (1 + Rn() * 2).toFixed(1), fill: Rn() < .5 ? '#bfae86' : '#a99b78', stroke: '#8a7d5e', 'stroke-width': .4 }, fl);
        [[40, 0], [120, 1], [210, 0], [970, 1]].forEach(([x, k]) => { for (let j = 0; j < 4; j++) el('path', { d: `M${x + j * 6} ${BOTTOM + 2} q${k ? 6 : -6} -60 ${(j - 1.5) * 4} -${120 + j * 18}`, fill: 'none', stroke: '#5f8a46', 'stroke-width': 2, 'stroke-linecap': 'round' }, fl); });
        const fish = $('#mgFish');
        fish.innerHTML = `<g transform="translate(200 410)"><path d="M0 0 C10 -10 30 -10 38 0 C30 10 10 10 0 0 Z" fill="#e8913a" stroke="#9a5418" stroke-width=".8"/><path d="M0 0 L-12 -8 L-10 0 L-12 8 Z" fill="#e8913a" stroke="#9a5418" stroke-width=".8"/><circle cx="30" cy="-2" r="1.6" fill="#2a1d14"/></g>`;
        const li = $('#mgLily');
        [[120, 1], [330, .8], [940, .9]].forEach(([x, s]) => el('path', { d: `M${x} ${S} a${16 * s} ${4 * s} 0 1 0 ${12 * s} -3 l-${10 * s} 2 Z`, fill: '#79a85a', stroke: '#4f7a3f', 'stroke-width': .7 }, li));
        const pl = $('#planks'); for (let x = 20; x < 1000; x += 26) el('path', { d: `M${x} 226 V237`, stroke: '#6e4a2b', 'stroke-width': .6, opacity: .7 }, pl);
        const po = $('#posts'); for (let x = 0; x <= 1000; x += 250) { el('rect', { x: x - 3, y: 190, width: 6, height: 36, fill: 'url(#woodD)', stroke: '#5e3f22', 'stroke-width': .6 }, po); el('rect', { x: x - 4, y: 237, width: 8, height: 280, fill: 'url(#woodD)', stroke: '#5e3f22', 'stroke-width': .6, opacity: .8 }, po); }
      })();

      /* ---------- world ---------- */
      let objs = [];            // {k, x, state:'floor'|'fly'|'stuck', fx, fy, t}
      const rig = { mx: 560, my: IDLE, mode: 'idle', tx: 560, wait: 0, stuck: [], chain: 0, pause: 0 };
      let looping = false;
      function objTop(o) { return BOTTOM - T[o.k].h; }
      function render() {
        let g = '';
        objs.filter(o => o.state === 'floor' || o.state === 'fly').forEach(o => {
          if (o.state === 'floor') g += `<g transform="translate(${o.x} ${BOTTOM})">${T[o.k].svg()}</g>`;
          else g += `<g transform="translate(${o.fx.toFixed(1)} ${o.fy.toFixed(1)})">${T[o.k].svg()}</g>`;
        });
        $('#mgObjs').innerHTML = g;
        // rig: character on the bridge, rod, line, magnet with what it holds
        const cx = rig.mx - 56, who = st.phase === 'play' ? 'squirrel' : 'owl';
        let r = who === 'owl' ? `<use href="#owl" x="${cx - 30}" y="152" width="60" height="75"/>` : `<g transform="translate(${cx} 160)"><use href="#squirrel" x="-34" y="0" width="68" height="68"/></g>`;
        r += `<path d="M${cx + 10} 196 L${rig.mx} ${ROD_Y}" stroke="#6e4a2b" stroke-width="3" stroke-linecap="round"/><circle cx="${cx + 14}" cy="192" r="3" fill="#5a5f64"/>`;
        r += `<path d="M${rig.mx} ${ROD_Y} V${(rig.my - 34).toFixed(1)}" stroke="#7a6a52" stroke-width="1"/>`;
        // field lines toward nearby iron
        objs.filter(o => o.state === 'floor' && T[o.k].mag).forEach(o => {
          const oy = BOTTOM - T[o.k].h / 2, d = Math.hypot(o.x - rig.mx, oy - rig.my);
          if (d < 110) { const a = (1 - d / 110) * .8; r += `<path d="M${rig.mx - 12} ${rig.my} Q${(rig.mx + o.x) / 2 - 20} ${(rig.my + oy) / 2} ${o.x} ${oy} M${rig.mx + 12} ${rig.my} Q${(rig.mx + o.x) / 2 + 20} ${(rig.my + oy) / 2} ${o.x} ${oy}" fill="none" stroke="#d9822b" stroke-width="1" stroke-dasharray="3 4" opacity="${a.toFixed(2)}"/>`; }
        });
        let y = rig.my;
        r += `<g transform="translate(${rig.mx} ${rig.my})">${magnetSVG()}${rig.chain ? chainSVG(rig.chain) : ''}</g>`;
        if (rig.chain) y += 17 + rig.chain * 30;
        rig.stuck.forEach(k => { y += T[k].h + 1; r += `<g transform="translate(${rig.mx} ${y.toFixed(1)})">${T[k].svg()}</g>`; });
        $('#mgRig').innerHTML = r;
      }
      function stackBottom() { let y = rig.my + (rig.chain ? 17 + rig.chain * 30 : 0); rig.stuck.forEach(k => y += T[k].h + 1); return y; }
      function step(dt) {
        let busy = rig.mode !== 'idle';
        if (rig.mode === 'walk') { const d = rig.tx - rig.mx, s = 420 * dt; if (Math.abs(d) <= s) { rig.mx = rig.tx; rig.mode = 'down'; } else rig.mx += Math.sign(d) * s; }
        else if (rig.mode === 'down') {
          rig.my += 170 * dt;
          // stop on whatever is under the magnet, or on the floor
          let floor = BOTTOM - 2;
          objs.filter(o => o.state === 'floor' && Math.abs(o.x - rig.mx) < T[o.k].w / 2 + 10).forEach(o => { floor = Math.min(floor, objTop(o)); });
          const sb = stackBottom();
          if (sb >= floor) { rig.my -= sb - floor; rig.mode = 'pause'; rig.pause = .45; }
        } else if (rig.mode === 'pause') { rig.pause -= dt; if (rig.pause <= 0) rig.mode = 'up'; }
        else if (rig.mode === 'up') { rig.my -= 220 * dt; if (rig.my <= IDLE) { rig.my = IDLE; rig.mode = 'idle'; landed(); } }
        // attraction: iron within reach jumps to the magnet, even before touching
        if (rig.mode === 'down' || rig.mode === 'pause') {
          objs.filter(o => o.state === 'floor' && T[o.k].mag).forEach(o => {
            const oy = BOTTOM - T[o.k].h / 2, d = Math.hypot(o.x - rig.mx, oy - rig.my);
            if (d < R) { o.state = 'fly'; o.fx = o.x; o.fy = BOTTOM; o.t = 0; o.far = d > T[o.k].h / 2 + 8; }
          });
        }
        objs.filter(o => o.state === 'fly').forEach(o => {
          busy = true; o.t += dt * 4; const k = Math.min(1, o.t);
          const ty = o.k === 'clips' ? rig.my + 40 : stackBottom() + T[o.k].h;
          o.fx += (rig.mx - o.fx) * k; o.fy += (ty - o.fy) * k;
          if (k >= 1) { o.state = 'stuck'; if (o.k === 'clips') rig.chain = 3; else rig.stuck.push(o.k); if (o.far) reached(); }
        });
        render();
        return busy;
      }
      function kick() {
        if (looping) return; looping = true; let last = null;
        (function f(n) {
          if (!alive()) { looping = false; return; }
          if (last === null) last = n; const dt = Math.min(.033, (n - last) / 1000); last = n;
          if (step(dt)) requestAnimationFrame(f); else looping = false;
        })(performance.now());
      }
      function fishAt(x) { if (rig.mode !== 'idle') return; rig.tx = Math.max(330, Math.min(970, x)); rig.mode = 'walk'; st.busy = true; renderControls(); kick(); }
      function reached() { if (st.phase === 'play' && !st.saidReach) { st.saidReach = true; say('owl', '봤어? 자석이 <b>닿기도 전에</b> 쇠붙이가 끌려왔어! 자석은 조금 떨어져 있어도 끌어당긴단다.', true); } }

      /* the magnet is back up: sort what came with it */
      function landed() {
        const caught = rig.stuck.slice(), chain = rig.chain;
        st.busy = false;
        if (st.phase === 'test') {
          const k = st.sel, stuck = caught.includes(k);
          st.results[k] = stuck ? 'stick' : 'not';
          const ok = st.guesses[k] === st.results[k];
          let msg = ok ? `예상대로 ${josa(T[k].name, '은', '는')} <b>${stuck ? '자석에 붙었어' : '자석에 붙지 않았어'}</b>!` : `앗! ${josa(T[k].name, '은', '는')} 생각과 달리 <b>${stuck ? '자석에 붙었어' : '자석에 붙지 않았어'}</b>!`;
          msg += { coin: ' 반짝이는 금속인데도 안 붙었어.', can: ' 금속 캔인데도 안 붙었어.', nail: ' 쇠못은 착 달라붙었지.' }[k] || '';
          const done = TEST.every(q => st.results[q]);
          msg += done ? ' 모두 해 봤네. <b>발견하기</b>를 눌러 봐!' : ' 다음 물건을 골라 봐.';
          say('owl', msg, ok); st.sel = null;
          // the caught thing goes to the pail
          objs = objs.filter(o => o.state !== 'stuck');
          rig.stuck = []; rig.chain = 0;
          HH.stars($('#mgFx'), 74, 210);
        } else if (st.phase === 'play') {
          const n = caught.length + chain;
          if (n) {
            st.score += n; HH.stars($('#mgFx'), 74, 210);
            if (chain) { say('owl', '우와! 클립이 <b>줄줄이</b> 매달려 올라왔어! 자석에 붙은 클립이 다른 클립을 끌어당겼어.', true); if (!HH.hasCard('magnet-chain')) setTimeout(() => { if (alive()) chainCard(); }, 1100); }
            else if (!st.saidReach) say('owl', `쇠붙이 <b>${n}개</b>를 낚았어!`, true);
            setTimeout(() => { if (!alive()) return; objs = objs.filter(o => o.state !== 'stuck'); rig.stuck = []; rig.chain = 0; refill(); render(); }, chain ? 1600 : 700);
          } else say('squirrel', '아무것도 안 붙었어. 그 근처에는 쇠붙이가 없나 봐!');
        }
        renderControls(); render();
      }

      /* ---------- panels ---------- */
      function sortCols(big) {
        const col = (kind, title) => `<div class="scol"><h4>${title}</h4><div class="sicons">${TEST.filter(k => st.results[k] === kind).map(k => `<span class="sicon ${st.guesses[k] === kind ? 'ok' : 'miss'}" title="${T[k].name}">${icon(k)}</span>`).join('')}</div></div>`;
        const n = TEST.filter(k => st.results[k]).length, right = TEST.filter(k => st.results[k] && st.guesses[k] === st.results[k]).length;
        return `<div class="sortcols ${big ? 'big' : ''}">${col('stick', '자석에 붙어요')}${col('not', '붙지 않아요')}</div>
          <p style="margin:8px 0 0;font-size:14px;color:var(--ink-soft)">예상 맞힌 수 <b style="font-family:var(--display);font-weight:400;color:var(--ink);font-size:18px">${right}</b> / ${n} · 초록 테두리는 예상이 맞은 물건</p>`;
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          const sel = st.sel && T[st.sel];
          c.innerHTML = `<p class="lab">물건을 하나 골라 봐</p><div class="objs">${TEST.map(k => `<button type="button" class="obj ${st.sel === k ? 'on' : ''}" data-obj="${k}" ${st.results[k] || st.busy ? 'disabled' : ''} aria-pressed="${st.sel === k}">${icon(k)}<span style="font-size:13px">${T[k].name}</span></button>`).join('')}</div>
            ${sel ? `<p class="lab" style="margin-top:12px">${josa(sel.name, '은', '는')} 자석에 붙을까?</p><div class="guess"><button type="button" class="up" data-guess="stick" ${st.busy ? 'disabled' : ''} style="background:#c45f33;box-shadow:0 3px 0 #9c4524">착! 붙을 거야</button><button type="button" class="down" data-guess="not" ${st.busy ? 'disabled' : ''}>안 붙을 거야</button></div>` : ''}`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${sortCols()}${TEST.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">쇠붙이 보물 낚시</p><p style="margin:0 0 10px;font-size:15px">연못에서 <b style="font-family:var(--display);font-weight:400">자석을 내리고 싶은 곳</b>을 눌러 봐. 쇠붙이만 붙어 올라와!</p>
            <button type="button" class="btn small" data-act="shuffle" ${st.busy ? 'disabled' : ''}>연못 새로 채우기</button>`;
          side.innerHTML = `<p class="score" style="margin-top:0">낚은 쇠붙이 <b>${st.score}</b>개</p><p style="margin:8px 0 0;font-size:14px;color:var(--ink-soft)">클립 더미를 찾아 낚으면 신기한 일이 생겨요.</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 동전과 캔이 자석에 붙을지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">어떻게 됐을까?</p>${sortCols()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); render(); }

      function layTest() { objs = TEST.map((k, i) => ({ k, x: TX[i], state: 'floor' })); rig.stuck = []; rig.chain = 0; rig.mx = 560; rig.my = IDLE; rig.mode = 'idle'; render(); }
      function refill() {
        const kinds = ['clip', 'nail', 'cap', 'pin', 'coin', 'can', 'eraser', 'marble'];
        const slots = [360, 424, 488, 552, 616, 680, 744, 808, 872, 936];
        slots.forEach(x => {
          if (objs.some(o => o.state === 'floor' && Math.abs(o.x - x) < 30)) return;
          const hasPile = objs.some(o => o.k === 'clips' && o.state === 'floor');
          const k = !hasPile && Math.random() < .25 ? 'clips' : kinds[Math.floor(Math.random() * kinds.length)];
          objs.push({ k, x, state: 'floor' });
        });
        if (!objs.some(o => o.k === 'clips' && o.state === 'floor') && !HH.hasCard('magnet-chain')) { const o = objs.find(q => q.state === 'floor' && !T[q.k].mag); if (o) o.k = 'clips'; }
      }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="-24 -40 48 48" aria-hidden="true">${magnetSVG()}</svg></div>
          <p class="eyebrow">자석 낚시터 · 자석의 힘</p><h2>자석 낚시</h2>
          <p class="lead">연못 바닥에 여러 가지 물건이 떨어져 있어.<br>자석 낚싯대로 어떤 물건을 건질 수 있을까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '<b>반짝이는 동전</b>과 <b>알루미늄 캔</b>이 있어. 둘 다 금속이야. 자석에 붙을까?')}
          ${HH.talk('squirrel', '반짝반짝 금속은 다 자석에 붙어! 둘 다 붙을 거야!')}
          <div class="picks">
            <button type="button" class="pick" data-pick="both">${miniMagnet(['coin', 'can'], [])}<span>둘 다 붙어요</span></button>
            <button type="button" class="pick" data-pick="coin">${miniMagnet(['coin'], ['can'])}<span>동전만 붙어요</span></button>
            <button type="button" class="pick" data-pick="none">${miniMagnet([], ['coin', 'can'])}<span>둘 다 안 붙어요</span></button>
          </div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('magnet-iron');
        const msg = { none: '예상이 딱 맞았어! 동전도 캔도 자석에 붙지 않았지.', both: '도토리랑 같은 생각이었구나! 그런데 동전과 알루미늄 캔은 붙지 않았어.', coin: '동전도 붙지 않았어. 반짝이는 금속이라고 다 붙는 건 아니야.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${sortCols(true)}
          ${HH.talk('owl', msg + ' 붙은 클립, 못, 병뚜껑, 옷핀은 모두 <b>쇠(철)</b>로 만든 거야. 동전은 구리와 니켈, 캔은 알루미늄이라서 붙지 않아.')}
          ${HH.talk('squirrel', '반짝인다고 다 붙는 게 아니구나! 쇠로 만들었는지가 중요하네.')}
          ${HH.dcard(1, art1(), '자석에는 쇠(철)로 만든 물건만 붙어요.', '반짝이는 동전과 알루미늄 캔은 붙지 않았어요.')}
          <button type="button" class="btn primary" data-act="play">쇠붙이 보물 낚시 하기</button></div>`);
      }
      function chainCard() {
        HH.addCard('magnet-chain');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '자석에 붙은 클립은 잠깐 동안 <b>작은 자석</b>이 돼. 그래서 다른 클립을 끌어당겨 줄줄이 매달린 거야.')}
          ${HH.dcard(2, art2(), '자석에 붙은 클립도 잠깐 자석이 되어 다른 클립을 끌어당겨요.', '자석에서 떼어 내면 클립은 다시 힘을 잃어요.')}
          <button type="button" class="btn primary" data-act="close">계속 낚시하기</button></div>`);
      }
      function reset() { fresh(); ui.hide(); layTest(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>자석 낚싯대</b>로 연못 바닥의 물건을 건져 볼 거야.'); intro(); }

      function svgX(evt) { const svg = root.querySelector('svg.stage'), pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()).x; }
      root.addEventListener('click', e => {
        if (e.target.id === 'tapZone') {
          if (st.phase === 'play') fishAt(svgX(e));
          else if (st.phase === 'test' && !st.busy) { const x = svgX(e); const o = objs.filter(q => q.state === 'floor' && !st.results[q.k]).sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0]; if (o && Math.abs(o.x - x) < 40) { st.sel = o.k; renderControls(); say('owl', `${josa(T[o.k].name, '을', '를')} 골랐어. 자석에 <b>붙을까</b>, <b>안 붙을까</b>?`); } }
          return;
        }
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.obj) { if (st.busy) return; st.sel = b.dataset.obj; renderControls(); say('owl', `${josa(T[st.sel].name, '을', '를')} 골랐어. 자석에 <b>붙을까</b>, <b>안 붙을까</b>?`); return; }
        if (b.dataset.guess) { if (!st.sel || st.busy) return; st.guesses[st.sel] = b.dataset.guess; const o = objs.find(q => q.k === st.sel && q.state === 'floor'); fishAt(o.x); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '이제 하나씩 건져 보자. 물건을 고르고, 자석에 <b>붙을지</b> 먼저 정해 봐! 연못 속 물건을 눌러도 돼.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); objs = []; refill(); setPhase('play'); say('owl', '이번엔 <b>쇠붙이 보물 낚시</b>야! 연못 아무 곳이나 눌러서 자석을 내려 봐.', true); }
        else if (act === 'shuffle') { if (st.busy) return; objs = []; refill(); render(); }
        else if (act === 'close') ui.hide();
      });

      layTest(); setPhase('intro');
      say('owl', '안녕! 오늘은 <b>자석 낚싯대</b>로 연못 바닥의 물건을 건져 볼 거야.');
      intro();
    }
  });
})();
