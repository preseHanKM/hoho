/* 공사장 · 도르래 엘리베이터 */
(function () {
  const { el, rng } = HH;
  const B = 420, GROUND = 480, U = 77, LEVELS = 3, MAXH = U * LEVELS, BOTTOM0 = 476;
  const FIX_Y = 118, FR = 18, MR = 16, ANCHOR_X = 404, BEAM_Y = 100;
  const SETUPS = {
    fixed: { name: '고정도르래', by: '고정도르래로', ratio: 1, up: false, ropeX: 456, px: 438, color: '#2f8f86' },
    movable: { name: '움직도르래', by: '움직도르래로', ratio: 2, up: true, ropeX: 436, color: '#d9822b' },
    combo: { name: '두 도르래 함께', by: '두 도르래를 함께 써서', ratio: 2, up: false, ropeX: 472, px: 454, color: '#7c62ad' }
  };
  const KEYS = ['fixed', 'movable', 'combo'];
  const LOADS = [
    { id: 'rabbit', name: '토끼', w: 1, kinds: ['rabbit'] },
    { id: 'raccoon', name: '너구리', w: 2, kinds: ['raccoon'] },
    { id: 'bear', name: '반달곰', w: 4, kinds: ['bear'] },
    { id: 'both', name: '반달곰과 너구리', w: 6, kinds: ['bear', 'raccoon'] }
  ];
  const STRENGTH = 3, SPEED = 105;

  function weights(n) { let s = '<span class="wts" aria-label="추 ' + n + '개">'; for (let i = 0; i < n; i++) s += '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#weight" width="20" height="20"/></svg>'; return s + '</span>'; }

  /* small rig drawings: 160x100 */
  function rigInner(kind, color) {
    const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#cfd4d8" stroke="#5a5f64" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${r * .35}" fill="#8a9096"/>`;
    const box = (x, y) => `<rect x="${x - 14}" y="${y}" width="28" height="20" rx="2" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".8"/><path d="M${x - 14} ${y + 7} H${x + 14} M${x - 14} ${y + 14} H${x + 14}" stroke="#7a5230" stroke-width=".5"/>`;
    const down = (x, y) => `<path d="M${x} ${y} v10" stroke="${color}" stroke-width="2.2"/><path d="M${x - 5} ${y + 7} L${x} ${y + 14} L${x + 5} ${y + 7}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>`;
    const up = (x, y) => `<path d="M${x} ${y} v-8" stroke="${color}" stroke-width="2.2"/><path d="M${x - 5} ${y - 5} L${x} ${y - 12} L${x + 5} ${y - 5}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>`;
    const beam = '<rect x="20" y="12" width="120" height="7" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".7"/>';
    const rope = d => `<path d="${d}" fill="none" stroke="#a8875a" stroke-width="1.8"/>`;
    if (kind === 'fixed') return beam + `<path d="M78 19 V30" stroke="#5a5f64" stroke-width="1.4"/>` + rope('M69 62 V30 A9 9 0 0 1 87 30 V80') + wheel(78, 30, 9) + box(69, 62) + down(87, 80);
    if (kind === 'movable') return beam + rope('M62 19 V54 A8 8 0 0 0 78 54 V26') + wheel(70, 54, 8) + `<path d="M70 54 V64" stroke="#5a5f64" stroke-width="1.4"/>` + box(70, 64) + up(78, 26) + `<rect x="74" y="12" width="8" height="7" fill="#e9dcc0"/>`;
    return beam + `<path d="M87 19 V30" stroke="#5a5f64" stroke-width="1.4"/>` + rope('M62 19 V54 A8 8 0 0 0 78 54 V30 A9 9 0 0 1 96 30 V80') + wheel(70, 54, 8) + wheel(87, 30, 9) + `<path d="M70 54 V64" stroke="#5a5f64" stroke-width="1.4"/>` + box(70, 64) + down(96, 80);
  }
  function rigArt(kind, cls) { return `<svg ${cls ? `class="${cls}"` : ''} viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e3ecef"/><rect y="88" width="160" height="12" fill="#ddc9a0"/>${rigInner(kind, SETUPS[kind].color)}</svg>`; }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#e3ecef"/><rect y="84" width="160" height="12" fill="#ddc9a0"/>
      <g transform="translate(-30 -4)">${rigInner('movable', '#d9822b')}</g>
      <g transform="translate(96 30)">${weights2svg(2)}</g>
      <text x="118" y="20" text-anchor="middle" font-size="11" fill="#6d604c">힘 ½</text>
      <text x="118" y="78" text-anchor="middle" font-size="11" fill="#6d604c">줄 ×2</text></svg>`;
  }
  function weights2svg(n) { let s = ''; for (let i = 0; i < n; i++) s += `<use href="#weight" x="${i * 18}" y="0" width="18" height="18"/>`; return s; }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#e3ecef"/><rect y="84" width="160" height="12" fill="#ddc9a0"/>
      <g transform="translate(-34 -6)">${rigInner('combo', '#7c62ad')}</g>
      <use href="#bear" x="26" y="34" width="22" height="22"/>
      <g transform="translate(104 58) scale(-1 1)"><use href="#squirrel" x="-14" y="0" width="28" height="28"/></g>
      <path d="M118 22 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1 Z" fill="#f2c230" stroke="#b8860b" stroke-width=".6"/></svg>`;
  }

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="공사장 비계에서 도르래로 바구니를 끌어 올리는 장면">
    <rect width="1000" height="560" fill="url(#skyE)"/>
    <circle cx="140" cy="80" r="80" fill="url(#sunGlow)"/>
    <g fill="#ffffff" stroke="#c8dae6" stroke-width=".8"><path d="M560 70 c2 -12 18 -16 26 -8 c8 -12 28 -10 32 4 c12 0 18 12 10 18 h-62 c-8 0 -10 -10 -6 -14 Z" opacity=".85"/><path d="M170 150 c0 -10 14 -14 20 -6 c6 -10 22 -8 26 2 c10 0 14 10 8 14 h-48 c-6 0 -8 -6 -6 -10 Z" opacity=".8"/></g>
    <path d="M0 300 C140 270 260 286 380 290 C520 294 640 262 780 270 C880 276 950 262 1000 266 L1000 350 L0 350 Z" fill="url(#hillG)" stroke="#9db695" stroke-width=".8"/>
    <g opacity=".45" stroke="#8a8f94" fill="none" stroke-width="1.2"><path d="M760 300 V140 M772 300 V140 M760 140 H880 M700 140 H772 M760 160 L772 150 M760 180 L772 170 M760 200 L772 190 M760 220 L772 210 M760 240 L772 230 M760 260 L772 250 M760 280 L772 270"/><path d="M850 140 V170"/></g>
    <g id="pyTrees"></g>
    <rect y="340" width="1000" height="220" fill="#ddc9a0"/>
    <g id="pySpeck"></g>
    <path d="M640 480 Q700 410 770 480 Z" fill="#d9bf8a" stroke="#b89a62" stroke-width=".8"/>
    <path d="M702 482 L710 458 L718 482 Z M738 484 L746 460 L754 484 Z" fill="#e67a2e" stroke="#a04f17" stroke-width=".7"/>
    <path d="M704 474 H716 M740 476 H752" stroke="#fff" stroke-width="2"/>
    <!-- scaffold -->
    <g stroke="#6e5a40" stroke-width=".8">
      <rect x="336" y="${BEAM_Y}" width="8" height="${GROUND - BEAM_Y}" fill="#8d8983"/><rect x="380" y="${BEAM_Y}" width="6" height="${GROUND - BEAM_Y}" fill="#8d8983"/>
      <rect x="596" y="${BEAM_Y}" width="8" height="${GROUND - BEAM_Y}" fill="#8d8983"/>
      <path d="M344 ${BOTTOM0 - U} L380 ${BOTTOM0} M344 ${BOTTOM0 - 2 * U} L380 ${BOTTOM0 - U} M344 ${BOTTOM0 - 3 * U} L380 ${BOTTOM0 - 2 * U}" stroke="#8d8983" stroke-width="2.5" fill="none"/>
      <path d="M604 ${BOTTOM0 - 40} L630 ${BOTTOM0} M604 200 L640 260" stroke="#8d8983" stroke-width="2.5" fill="none"/>
    </g>
    <g id="floors"></g>
    <path d="M318 ${BOTTOM0 - 3 * U - 2} V${BOTTOM0 - 3 * U - 40}" stroke="#6e5a40" stroke-width="1.4"/>
    <path d="M318 ${BOTTOM0 - 3 * U - 40} L344 ${BOTTOM0 - 3 * U - 33} L318 ${BOTTOM0 - 3 * U - 26} Z" fill="#d9483b" stroke="#8a2c22" stroke-width=".7"/>
    <rect x="326" y="${BEAM_Y - 14}" width="102" height="14" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/>
    <rect x="446" y="${BEAM_Y - 14}" width="196" height="14" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/>
    <path d="M336 ${BEAM_Y - 7} H420 M456 ${BEAM_Y - 7} H632" stroke="#5e3f22" stroke-width=".5" opacity=".6"/>
    <!-- spring scale -->
    <g id="scale" transform="translate(890 0)">
      <path d="M-40 92 H40 M0 92 V122" stroke="#6d6a64" stroke-width="3" stroke-linecap="round"/>
      <path d="M0 122 q-6 6 0 12 q6 -6 0 -12" fill="none" stroke="#5a5f64" stroke-width="2"/>
      <rect x="-24" y="132" width="48" height="292" rx="7" fill="#dfe6ea" stroke="#5a6a72" stroke-width=".9"/>
      <rect x="-14" y="142" width="28" height="272" rx="3" fill="#fbfdfd" stroke="#9aaab2" stroke-width=".6"/>
      <g id="ticks"></g>
      <path id="spring" fill="none" stroke="#7f8a90" stroke-width="1.2"/>
      <rect id="needle" x="-16" y="148" width="32" height="5" rx="1.5" fill="#d4574a" stroke="#8a2c22" stroke-width=".6"/>
      <path d="M0 424 V440" stroke="#5a5f64" stroke-width="2"/>
      <path d="M0 440 q8 6 0 12 q-6 0 -6 -5" fill="none" stroke="#5a5f64" stroke-width="2"/>
      <rect x="-46" y="462" width="92" height="22" rx="5" fill="#fbf3e0" stroke="#9c7a4c" stroke-width=".8"/>
      <text x="0" y="477" text-anchor="middle" font-size="13" font-family="Jua, sans-serif" fill="#3b3226">용수철저울</text>
      <text id="scaleTxt" x="0" y="510" text-anchor="middle" font-size="16" font-family="Jua, sans-serif" fill="#9c4524"></text>
    </g>
    <g id="rig"></g>
    <g id="fx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>고정도르래는 힘의 방향만 바꿔 주고 드는 힘은 그대로입니다. 움직도르래는 드는 힘이 절반으로 줄지만 줄은 두 배로 당겨야 합니다. 두 도르래를 함께 쓰면 힘도 줄고 아래로 당길 수 있습니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 고정도르래와 움직도르래 중 힘이 덜 드는 것 고르기. 도토리는 “도르래는 다 똑같다”고 말합니다.</li><li>실험: 세 가지 방법으로 아기곰 바구니를 3칸 높이까지 올립니다. 용수철저울로 힘을, 줄의 색 테이프로 당긴 길이를 셉니다.</li><li>발견: 힘과 줄 길이를 표로 비교합니다.</li><li>놀이: 추 3개만큼만 당길 수 있는 도토리가 더 무거운 짐을 올리도록 도르래를 고릅니다.</li></ul></div>
    <div><h3>함께 던지기 좋은 질문</h3><ul><li>고정도르래는 힘이 그대로인데 왜 쓸까?</li><li>힘이 덜 드는 대신 무엇을 더 해야 했을까?</li><li>우리 주변에서 도르래는 어디에 있을까? (국기 게양대, 블라인드, 기중기)</li></ul></div>
    <div><h3>교과 연계</h3><p>4학년 과학 「물체의 무게」의 용수철저울 사용 경험, 고학년 과학의 도구 원리(도르래)를 미리 맛보는 활동. 2학년 수학 「곱셈구구」의 2배 개념과도 이어집니다.</p></div>
    <div><h3>참고</h3><p>이 놀이터는 도르래 무게와 마찰을 뺀 모습입니다. 실제로는 움직도르래도 힘이 정확히 절반보다 조금 더 듭니다.</p></div>`;

  HH.register({
    id: 'pulley',
    cards: [
      { id: 'pulley-half', no: 1, text: '움직도르래를 쓰면 힘은 반만 들지만, 줄은 두 배로 당겨야 해요.', art: art1 },
      { id: 'pulley-heavy', no: 2, text: '힘이 약해도 움직도르래를 쓰면 무거운 짐을 올릴 수 있어요.', art: art2 }
    ],
    thumb() { return rigArt('combo', 'xart'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'pulley', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#weight"/></svg>용수철저울의 눈금은 줄을 당기는 힘이에요. 추 1개가 토끼 한 마리 무게예요. 줄의 색 테이프 사이가 1칸이에요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, setup: 'fixed', load: LOADS[2], results: {}, p: 0, pulling: false, lowering: false, strained: false, strainSaid: false, arrived: false, needle: 0, lifted: {}, hits: 0 }); }
      fresh();

      /* scenery */
      (function () {
        const R = rng(31), sp = $('#pySpeck');
        for (let i = 0; i < 300; i++) el('circle', { cx: (R() * 1000).toFixed(1), cy: (344 + R() * 214).toFixed(1), r: (0.5 + R() * 1.3).toFixed(2), fill: '#9a8460', 'fill-opacity': (0.2 + R() * 0.4).toFixed(2) }, sp);
        const t = $('#pyTrees');
        [40, 100, 170, 240, 660, 980].forEach(x => HH.tree(t, x, 342, 0.8 + R() * 0.4));
        const f = $('#floors');
        for (let k = 1; k <= LEVELS; k++) {
          const y = BOTTOM0 - k * U;
          el('rect', { x: 330, y: y, width: 56, height: 7, fill: 'url(#wood)', stroke: '#6e4a2b', 'stroke-width': .7 }, f);
          const tx = el('text', { x: 322, y: y + 6, 'text-anchor': 'end', 'font-size': 14, fill: '#5e4428', 'font-family': 'Jua, sans-serif' }, f); tx.textContent = k + '칸';
        }
        const tk = $('#ticks');
        for (let n = 0; n <= 6; n++) {
          const y = 150 + n * 40;
          el('line', { x1: -14, x2: -4, y1: y, y2: y, stroke: '#5a6a72', 'stroke-width': .9 }, tk);
          const tx = el('text', { x: 34, y: y + 5, 'font-size': 14, fill: '#3b3226', 'font-family': 'Jua, sans-serif' }, tk); tx.textContent = n;
          if (n < 6) el('line', { x1: -14, x2: -9, y1: y + 20, y2: y + 20, stroke: '#9aaab2', 'stroke-width': .6 }, tk);
        }
        el('use', { href: '#weight', x: 26, y: 120, width: 16, height: 16 }, tk);
        el('line', { id: 'limitLine', x1: -24, x2: 24, y1: 150 + STRENGTH * 40, y2: 150 + STRENGTH * 40, stroke: '#d4574a', 'stroke-width': 1.4, 'stroke-dasharray': '4 3', opacity: 0 }, tk);
      })();

      const setup = () => SETUPS[st.setup];
      const force = () => st.load.w / setup().ratio;
      const lift = () => st.p / setup().ratio;
      const maxP = () => MAXH * setup().ratio;

      /* draw the whole rig from the current rope length */
      function drawRig() {
        const s = setup(), h = Math.min(MAXH, lift()), yb = BOTTOM0 - h, yA = yb - 66, My = yA - MR - 2;
        const handY = s.up ? 52 : 425;
        const puller = st.phase === 'play' ? 'squirrel' : 'owl';
        let g = '';
        // puller behind the rope
        const jit = st.strained ? (Math.random() * 3 - 1.5).toFixed(1) : 0;
        if (s.up) {
          g += puller === 'owl' ? `<use href="#owl" x="${448 + +jit}" y="16" width="56" height="70"/>` : `<g transform="translate(${478 + +jit} 18) scale(-1 1)"><use href="#squirrel" x="-34" y="0" width="68" height="68"/></g>`;
        } else {
          const px = s.ropeX + 6;
          g += puller === 'owl' ? `<use href="#owl" x="${px + +jit}" y="376" width="84" height="105"/>` : `<g transform="translate(${px + 44 + +jit} 392) scale(-1 1)"><use href="#squirrel" x="-44" y="0" width="88" height="88"/></g>`;
        }
        // pulleys and rope
        const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#cfd4d8" stroke="#5a5f64" stroke-width=".9"/><circle cx="${x}" cy="${y}" r="${r - 4}" fill="none" stroke="#9aa1a7" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="3.4" fill="url(#metal)" stroke="#5a5f64" stroke-width=".6"/>`;
        let rope, marksTop, marksBottom;
        if (st.setup === 'fixed') rope = `M${B} ${yA} V${FIX_Y} A${FR} ${FR} 0 0 1 ${s.ropeX} ${FIX_Y} V${handY}`;
        else if (st.setup === 'movable') rope = `M${ANCHOR_X} ${BEAM_Y} V${My} A${MR} ${MR} 0 0 0 ${s.ropeX} ${My} V${handY}`;
        else rope = `M${ANCHOR_X} ${BEAM_Y} V${My} A${MR} ${MR} 0 0 0 ${B + MR} ${My} V${FIX_Y} A${FR} ${FR} 0 0 1 ${s.ropeX} ${FIX_Y} V${handY}`;
        g += `<path d="${rope}" fill="none" stroke="#7a6240" stroke-width="3.6" stroke-linejoin="round"/><path d="${rope}" fill="none" stroke="#c9a874" stroke-width="2.2" stroke-linejoin="round"/>`;
        if (st.setup !== 'fixed') g += `<rect x="${ANCHOR_X - 4}" y="${BEAM_Y - 2}" width="8" height="6" fill="#5a5f64"/>`;
        if (s.px) g += `<path d="M${s.px} ${BEAM_Y} V${FIX_Y}" stroke="#5a5f64" stroke-width="3"/>` + wheel(s.px, FIX_Y, FR);
        // basket (with its riders)
        g += `<g transform="translate(${B} ${yb})">
          <rect x="-36" y="-56" width="72" height="56" rx="3" fill="#8a6440" stroke="#5e3f22" stroke-width=".9"/>`;
        const kinds = st.load.kinds;
        if (kinds.length === 1) g += `<use href="#${kinds[0]}" x="-27" y="-74" width="54" height="54"/>`;
        else g += `<use href="#${kinds[0]}" x="-38" y="-78" width="52" height="52"/><g transform="scale(-1 1)"><use href="#${kinds[1]}" x="-34" y="-64" width="40" height="40"/></g>`;
        g += `<rect x="-36" y="-34" width="72" height="34" rx="2" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
          <path d="M-36 -22 H36 M-36 -11 H36" stroke="#7a5230" stroke-width=".6" opacity=".7"/>
          <path d="M-36 -56 L0 -66 L36 -56" fill="none" stroke="#5a5f64" stroke-width="1.6"/></g>`;
        if (st.setup !== 'fixed') g += `<path d="M${B} ${My} V${yA}" stroke="#5a5f64" stroke-width="3"/>` + wheel(B, My, MR);
        // tape marks every 1칸 of rope, moving through the hands
        const marks = [];
        for (let m = 1; m <= 20; m++) {
          const d = m * U - st.p; if (d <= 0) continue;
          const y = s.up ? handY + d : handY - d;
          if (s.up ? y <= My : y >= FIX_Y) marks.push(y);
        }
        marks.forEach((y, i) => { g += `<rect x="${s.ropeX - 3.5}" y="${(y - 4).toFixed(1)}" width="7" height="8" rx="1" fill="${i % 2 ? '#f2c230' : '#d4574a'}" stroke="#6e3a20" stroke-width=".5"/>`; });
        // hands and the pulled rope coil
        const handC = puller === 'owl' ? '#f2f0e8' : '#a85a26';
        g += `<circle cx="${s.ropeX - 4}" cy="${handY}" r="4.5" fill="${handC}" stroke="#7a6a52" stroke-width=".7"/><circle cx="${s.ropeX + 4}" cy="${handY + (s.up ? 6 : -6)}" r="4.5" fill="${handC}" stroke="#7a6a52" stroke-width=".7"/>`;
        const coils = Math.min(7, Math.floor(st.p / 45));
        const cx = s.up ? 520 : s.ropeX + 96, cy = s.up ? BEAM_Y - 16 : 474;
        if (st.p > 2) g += `<path d="M${s.ropeX} ${handY} Q${s.ropeX + 30} ${s.up ? handY - 6 : handY + 40} ${cx - 10} ${cy}" fill="none" stroke="#c9a874" stroke-width="2.2"/>`;
        for (let i = 0; i < coils; i++) g += `<ellipse cx="${cx}" cy="${cy - i * 2.2}" rx="${15 - i * .6}" ry="4.5" fill="none" stroke="#a8875a" stroke-width="1.8"/>`;
        // rope counter
        const k = st.p / U;
        g += `<g transform="translate(${s.up ? 560 : s.ropeX + 150} ${s.up ? 40 : 444})"><rect x="-44" y="-16" width="88" height="26" rx="6" fill="#fffdf6" stroke="#9c7a4c" stroke-width=".8"/><text x="0" y="3" text-anchor="middle" font-size="15" font-family="Jua, sans-serif" fill="#3b3226">당긴 줄 ${k >= maxP() / U - .01 ? Math.round(k) : Math.floor(k)}칸</text></g>`;
        $('#rig').innerHTML = g;
      }
      function drawScale() {
        const y = 148 + st.needle * 40;
        $('#needle').setAttribute('y', y.toFixed(1));
        let d = 'M0 142', n = 12, top = 142, bot = y;
        for (let i = 1; i <= n; i++) d += ` L${i % 2 ? -8 : 8} ${(top + (bot - top) * i / n).toFixed(1)}`;
        $('#spring').setAttribute('d', d + ` L0 ${bot}`);
        $('#scaleTxt').textContent = st.pulling && st.needle > 0.25 ? `추 ${Math.round(st.needle * 2) / 2}개` : '';
        $('#limitLine').setAttribute('opacity', st.phase === 'play' ? 1 : 0);
      }

      /* main loop: pulling, lowering, needle */
      let looping = false;
      function kick() {
        if (looping) return; looping = true; let last = null;
        (function f(n) {
          if (!alive()) { looping = false; return; }
          if (last === null) last = n; const dt = Math.min(.05, (n - last) / 1000); last = n;
          const need = force(), weak = st.phase === 'play' && need > STRENGTH;
          let target = 0;
          st.strained = false;
          if (st.pulling) {
            if (weak) { target = STRENGTH + Math.sin(n / 60) * .12; st.strained = true; if (!st.strainSaid) { st.strainSaid = true; say('squirrel', `으으윽… <b>너무 무거워!</b> 나는 추 ${STRENGTH}개만큼만 당길 수 있어. <b>다른 도르래</b>를 써 볼까?`); } }
            else { target = need; st.p = Math.min(maxP(), st.p + SPEED * dt); if (st.p >= maxP()) { st.pulling = false; arrive(); } }
          }
          if (st.lowering) { st.p = Math.max(0, st.p - 360 * dt); if (st.p === 0) st.lowering = false; }
          st.needle += (target - st.needle) * Math.min(1, dt * 9);
          drawRig(); drawScale();
          if (st.pulling || st.lowering || Math.abs(st.needle - target) > .01) requestAnimationFrame(f);
          else { st.needle = target; drawRig(); drawScale(); looping = false; }
        })(performance.now());
      }

      function arrive() {
        st.arrived = true;
        HH.stars($('#fx'), B, BOTTOM0 - MAXH - 70);
        const s = setup(), rope = LEVELS * s.ratio, f = force();
        if (st.phase === 'test') {
          st.results[st.setup] = { force: f, rope };
          const done = KEYS.every(k => st.results[k]);
          say('owl', `<b>도착!</b> ${s.by} 올렸더니 힘은 <b>추 ${f}개</b>, 줄은 <b>${rope}칸</b> 당겼어.` + (done ? ' 세 가지를 다 해 봤네. <b>발견하기</b>를 눌러 봐!' : ' 다른 도르래로도 올려 볼까?'), true);
        } else {
          st.hits++; st.lifted[st.load.id] = true;
          say('owl', `<b>도착!</b> 도토리가 ${HH.josa(st.load.name, '을', '를')} 올렸어! 힘은 추 ${f}개만 들었어.`, true);
          if (st.load.w > STRENGTH && !HH.hasCard('pulley-heavy')) setTimeout(() => { if (alive()) heavyCard(); }, 900);
        }
        renderControls();
      }

      function chooseSetup(k) { st.setup = k; st.p = 0; st.pulling = false; st.lowering = false; st.arrived = false; st.strainSaid = false; drawRig(); drawScale(); renderControls(); }
      function chooseLoad(id) { st.load = LOADS.find(l => l.id === id); st.p = 0; st.arrived = false; st.strainSaid = false; drawRig(); renderControls(); }

      function resultTable() {
        return `<table class="mtable"><thead><tr><th>도르래</th><th>힘</th><th>당긴 줄</th></tr></thead><tbody>${KEYS.map(k => {
          const r = st.results[k];
          return `<tr><td>${rigArt(k, 'rigmini')}<span style="font-size:13px">${SETUPS[k].name}</span>${st.pred === k ? '<br><span style="font-size:12px;color:var(--clay-dark)">★ 내 예상</span>' : ''}</td><td>${r ? weights(r.force) : '<span class="wait">?</span>'}</td><td>${r ? `<span class="seatno">${r.rope}</span>칸` : '<span class="wait">?</span>'}</td></tr>`;
        }).join('')}</tbody></table>`;
      }
      function setupButtons() {
        return `<div class="angles">${KEYS.map(k => `<button type="button" class="ang ${st.setup === k ? 'on' : ''}" data-setup="${k}" style="--c:${SETUPS[k].color}" aria-pressed="${st.setup === k}">${rigArt(k)}<span style="font-size:14px">${SETUPS[k].name}</span>${st.phase === 'test' && st.results[k] ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>`;
      }
      function pullRow() {
        const atTop = st.p >= maxP() - .5;
        return `<div class="row"><button type="button" class="btn small" data-act="lower" ${st.p > 0 ? '' : 'disabled'}>바구니 내리기</button>
          <button type="button" class="throw" id="pullBtn" ${atTop ? 'disabled' : ''} style="touch-action:none">꾹 눌러 당기기</button></div>`;
      }
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">도르래를 골라 봐</p>${setupButtons()}${pullRow()}`;
          side.innerHTML = `<p class="lab">아기곰 바구니 (추 4개)</p>${resultTable()}${KEYS.every(k => st.results[k]) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          c.innerHTML = `<p class="lab">도르래를 골라 봐</p>${setupButtons()}${pullRow()}`;
          side.innerHTML = `<p class="lab">무엇을 올릴까?</p><div class="shelf">${LOADS.map(l => `<button type="button" class="token ${st.load.id === l.id ? 'on' : ''}" data-load="${l.id}" aria-pressed="${st.load.id === l.id}" style="min-width:0;flex:1 1 40%"><span>${l.name}${st.lifted[l.id] ? ' ✓' : ''}</span>${weights(l.w)}</button>`).join('')}</div>
            <p style="margin:10px 0 0;font-size:14px;color:var(--ink-soft)">도토리 힘: ${weights(STRENGTH)} 까지</p><p class="score">올린 짐 <b>${st.hits}</b>번</p>`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 어느 도르래가 힘이 덜 들지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">아기곰 바구니 (추 4개)</p>${resultTable()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); renderControls(); drawRig(); drawScale(); }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="0 0 100 100" aria-hidden="true"><use href="#bear" width="100" height="100"/></svg></div>
          <p class="eyebrow">공사장 · 도구의 힘</p><h2>도르래 엘리베이터</h2>
          <p class="lead">아기곰이 공사장 3칸 높이로 올라가고 싶대.<br>도르래를 쓰면 힘이 덜 들까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const same = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#e3ecef"/><rect y="88" width="160" height="12" fill="#ddc9a0"/><g transform="translate(-22 14) scale(.62)">${rigInner('fixed', '#2f8f86')}</g><g transform="translate(66 14) scale(.62)">${rigInner('movable', '#d9822b')}</g><text x="80" y="58" text-anchor="middle" font-size="26" font-family="Jua, sans-serif" fill="#3b3226">=</text></svg>`;
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '아기곰 바구니는 <b>추 4개</b> 무게야. 두 가지 도르래 중에 <b>힘이 덜 드는 건</b> 어느 쪽일까?')}
          ${HH.talk('squirrel', '도르래는 다 똑같은 바퀴잖아. 힘도 <b>똑같을</b> 거야!')}
          <div class="picks">
            <button type="button" class="pick" data-pick="fixed" style="--c:#2f8f86">${rigArt('fixed')}<span>고정도르래</span></button>
            <button type="button" class="pick" data-pick="movable" style="--c:#d9822b">${rigArt('movable')}<span>움직도르래</span></button>
            <button type="button" class="pick" data-pick="same">${same}<span>둘 다 똑같아</span></button>
          </div>
          <p style="text-align:center;color:var(--ink-soft)">고정도르래는 천장에 붙어 있고, 움직도르래는 바구니와 함께 올라가요</p></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('pulley-half');
        const msg = { movable: '예상이 딱 맞았어! 움직도르래는 힘이 <b>반만</b> 들었지.', fixed: '고정도르래는 힘이 그대로 <b>추 4개</b>였어. 대신 줄을 아래로 당길 수 있어서 편했지? 힘을 줄여 준 건 <b>움직도르래</b>였어.', same: '도토리랑 같은 생각이었구나! 그런데 움직도르래는 힘이 <b>반만</b> 들었어.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${resultTable()}
          ${HH.talk('owl', msg)}
          ${HH.talk('squirrel', '그런데 움직도르래는 줄을 <b>두 배</b>나 당겨야 했어! 힘이 덜 드는 대신 더 많이 당기는구나.')}
          ${HH.dcard(1, art1(), '움직도르래를 쓰면 힘은 반만 들지만, 줄은 두 배로 당겨야 해요.', '고정도르래는 힘은 같지만 줄을 아래로 당길 수 있어서 편해요.')}
          <button type="button" class="btn primary" data-act="play">도토리와 짐 올리기 놀이 하기</button></div>`);
      }
      function heavyCard() {
        HH.addCard('pulley-heavy');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', `도토리는 추 ${STRENGTH}개만큼만 당길 수 있는데, 그보다 무거운 짐을 올렸어! 움직도르래가 힘을 반으로 나눠 준 덕분이야.`)}
          ${HH.dcard(2, art2(), '힘이 약해도 움직도르래를 쓰면 무거운 짐을 올릴 수 있어요.', '건물을 짓는 기중기에도 움직도르래가 들어 있어요.')}
          <button type="button" class="btn primary" data-act="close">계속 놀기</button></div>`);
      }
      function reset() {
        fresh(); ui.hide(); setPhase('intro');
        say('owl', '안녕! 오늘은 <b>도르래</b>로 아기곰을 높이 올려 볼 거야.'); intro();
      }

      root.addEventListener('pointerdown', e => {
        const b = e.target.closest('#pullBtn'); if (!b || b.disabled) return;
        e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (x) { }
        st.pulling = true; st.lowering = false; kick();
      });
      const stop = e => { if (e.target.closest && e.target.closest('#pullBtn') && st.pulling) { st.pulling = false; kick(); } };
      root.addEventListener('pointerup', stop); root.addEventListener('pointercancel', stop); root.addEventListener('lostpointercapture', stop, true);
      root.addEventListener('keydown', e => { if (e.target.id === 'pullBtn' && (e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); st.pulling = true; kick(); } });
      root.addEventListener('keyup', e => { if (e.target.id === 'pullBtn' && (e.key === ' ' || e.key === 'Enter')) { st.pulling = false; kick(); } });
      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.setup) { chooseSetup(b.dataset.setup); say('owl', `<b>${SETUPS[b.dataset.setup].name}</b>${SETUPS[b.dataset.setup].up ? '야. 이번엔 위에서 <b>위로</b> 당겨야 해.' : '야. 아래에서 <b>아래로</b> 당기면 돼.'} <b>꾹 눌러 당기기</b>를 길게 눌러 봐.`); return; }
        if (b.dataset.load) { chooseLoad(b.dataset.load); say('owl', `${HH.josa(st.load.name, '을', '를')} 바구니에 태웠어. 추 ${st.load.w}개 무게야.`); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); chooseSetup('fixed'); say('owl', '먼저 <b>고정도르래</b>로 올려 보자. <b>꾹 눌러 당기기</b>를 길게 누르고 있으면 줄이 당겨져. 용수철저울도 잘 봐!', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'lower') { st.lowering = true; st.pulling = false; st.arrived = false; st.strainSaid = false; kick(); setTimeout(() => { if (alive()) renderControls(); }, 800); }
        else if (act === 'discover') discover();
        else if (act === 'play') { ui.hide(); setPhase('play'); st.load = LOADS[2]; chooseSetup('fixed'); say('owl', `이번엔 <b>도토리</b>가 당길 거야. 도토리는 <b>추 ${STRENGTH}개</b>만큼만 당길 수 있어. 어떤 짐을 어떤 도르래로 올릴 수 있을까?`, true); }
        else if (act === 'close') ui.hide();
      });

      setPhase('intro');
      say('owl', '안녕! 오늘은 <b>도르래</b>로 아기곰을 높이 올려 볼 거야.');
      intro();
    }
  });
})();
