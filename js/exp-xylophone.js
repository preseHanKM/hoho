/* 빛과 소리 극장 · 물병 실로폰 */
(function () {
  const { el, josa } = HH;
  const TABLE = 430;
  const NOTES = ['도', '레', '미', '파', '솔', '라', '시', '도'];
  const NCOL = ['#e0453a', '#ef8a2c', '#e8b80f', '#5aa64a', '#3fa9d4', '#3f6fc0', '#8a5bbf', '#e0453a'];
  const FREQ = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
  const MX = 880, MTOP = 110, MBOT = 410, STEP = (MBOT - MTOP) / 7;
  const TEST = [{ id: 'little', name: '조금', lvl: 3, x: 330 }, { id: 'half', name: '반쯤', lvl: 5, x: 480 }, { id: 'lots', name: '많이', lvl: 8, x: 630 }];
  const SONG = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0];   // 작은 별 (traditional melody)
  const noteOf = (lvl, mode) => mode === 'blow' ? lvl - 2 : 9 - lvl;   // tap: more water → lower; blow: more water → higher

  /* glass bottle, bottom centre at origin; lvl 1–9 tenths of the body */
  function bottleSVG(lvl, color, opts) {
    const o = opts || {}, top = -4 - lvl / 10 * 118;
    return `<path d="M-30 -2 V-110 Q-30 -122 -18 -128 L-11 -134 V-158 H11 V-134 L18 -128 Q30 -122 30 -110 V-2 Q30 0 28 0 H-28 Q-30 0 -30 -2 Z" fill="#e4f0f3" fill-opacity=".45"/>
      <path d="M-27 ${top.toFixed(1)} H27 V-4 Q27 -3 25 -3 H-25 Q-27 -3 -27 -4 Z" fill="${color}" fill-opacity=".72"/>
      <path d="M-27 ${top.toFixed(1)} H27" stroke="#fff" stroke-width="1.2" opacity=".8"/>
      <path d="M-30 -2 V-110 Q-30 -122 -18 -128 L-11 -134 V-158 H11 V-134 L18 -128 Q30 -122 30 -110 V-2 Q30 0 28 0 H-28 Q-30 0 -30 -2 Z" fill="none" stroke="#7fa3b2" stroke-width="1.1"/>
      <rect x="-13" y="-162" width="26" height="6" rx="2" fill="#e4f0f3" stroke="#7fa3b2" stroke-width=".9"/>
      <path d="M-22 -112 V-14" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/><path d="M-7 -150 V-136" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>
      ${o.glow ? `<ellipse cx="0" cy="-80" rx="44" ry="96" fill="none" stroke="${o.glow}" stroke-width="3" opacity=".8" stroke-dasharray="6 5"/>` : ''}`;
  }
  function art1() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#f3e9d6"/>
      ${[[34, 8, 0], [80, 5, 3], [126, 3, 6]].map(([x, l, n]) => `<g transform="translate(${x} 84) scale(.42)">${bottleSVG(l, NCOL[n])}</g><text x="${x}" y="94" text-anchor="middle" font-size="9" fill="${NCOL[n]}">${NOTES[n]}</text>`).join('')}
      <path d="M148 70 V18" stroke="#9c4524" stroke-width="1.6"/><path d="M144 24 L148 16 L152 24" fill="none" stroke="#9c4524" stroke-width="1.6"/><text x="146" y="12" text-anchor="end" font-size="8" fill="#9c4524">높은 소리</text></svg>`;
  }
  function art2() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true"><rect width="160" height="96" fill="#f3e9d6"/>
      <g transform="translate(52 88) scale(.42)">${bottleSVG(8, NCOL[6])}</g><g transform="translate(108 88) scale(.42)">${bottleSVG(3, NCOL[1])}</g>
      <g fill="none" stroke="#7fa3b2" stroke-width="1.2" stroke-linecap="round"><path d="M30 14 q8 -3 16 0 t16 0"/><path d="M86 14 q8 -3 16 0 t16 0"/></g>
      <text x="52" y="30" text-anchor="middle" font-size="10" fill="${NCOL[6]}">높은 소리</text><text x="108" y="30" text-anchor="middle" font-size="10" fill="${NCOL[1]}">낮은 소리</text>
      <text x="80" y="10" text-anchor="middle" font-size="8.5" fill="#6d604c">입으로 불면</text></svg>`;
  }
  const SPEAKER = on => `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor"/>${on ? '<path d="M16 9 q3 3 0 6 M18.5 6.5 q5.5 5.5 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' : '<path d="M16 9 l6 6 M22 9 l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'}</svg>`;

  const STAGE = `<svg class="stage" viewBox="0 0 1000 560" role="img" aria-label="극장 연습실 탁자 위 물병들을 두드려 소리를 내는 장면">
    <defs><linearGradient id="roomW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5ead3"/><stop offset="1" stop-color="#e9d9b8"/></linearGradient></defs>
    <rect width="1000" height="560" fill="url(#roomW)"/>
    <rect y="330" width="1000" height="40" fill="#d9c49a"/><path d="M0 330 H1000 M0 370 H1000" stroke="#b89a6a" stroke-width="1"/>
    <rect y="370" width="1000" height="190" fill="#c79a68"/><g id="floorLines"></g>
    <g id="staffDeco" opacity=".55"></g>
    <path d="M20 0 H120 C112 90 126 200 100 300 H20 Z" fill="#a8322b" opacity=".9"/><path d="M60 0 C52 100 66 200 50 300" stroke="#6e1d1a" stroke-width="2" fill="none" opacity=".6"/>
    <!-- table -->
    <rect x="200" y="${TABLE}" width="${640}" height="16" rx="3" fill="url(#wood)" stroke="#6e4a2b" stroke-width=".9"/>
    <rect x="222" y="${TABLE + 16}" width="12" height="90" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/><rect x="806" y="${TABLE + 16}" width="12" height="90" fill="url(#woodD)" stroke="#5e3f22" stroke-width=".8"/>
    <g id="rings"></g>
    <g id="bottles"></g>
    <g id="mallet" opacity="0"><path d="M0 0 L46 -40" stroke="#8a5a2e" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="0" r="9" fill="#d4574a" stroke="#7d2b23" stroke-width=".9"/></g>
    <!-- pitch ladder -->
    <rect x="${MX - 46}" y="${MTOP - 52}" width="104" height="${MBOT - MTOP + 96}" rx="10" fill="#fffaf0" stroke="#c9b48a" stroke-width="1"/>
    <text x="${MX + 6}" y="${MTOP - 30}" text-anchor="middle" font-size="13" font-family="Jua, sans-serif" fill="#9c4524">높은 소리 ↑</text>
    <text x="${MX + 6}" y="${MBOT + 34}" text-anchor="middle" font-size="13" font-family="Jua, sans-serif" fill="#3f6fc0">낮은 소리 ↓</text>
    <g id="ladder"></g>
    <circle id="mark" cx="${MX - 18}" cy="${MBOT}" r="14" fill="none" stroke="#3b3226" stroke-width="2.4" opacity="0"/>
    <g id="xyFx"></g>
  </svg>`;

  const TEACHER = `
    <div><h3>이 실험에서 발견하는 것</h3><p>물병을 두드리면 병과 물이 함께 떨려 소리가 납니다. 물이 많을수록 천천히 떨려 낮은 소리가 납니다. 병 입구를 입으로 불면 병 속 공기가 떨리는데, 이때는 물이 많을수록(공기 기둥이 짧을수록) 높은 소리가 나서 순서가 반대가 됩니다.</p></div>
    <div><h3>수업 흐름</h3><ul><li>예상: 물이 많은 병을 두드리면 높은 소리일까 낮은 소리일까? 도토리는 “꽉 차면 높은 소리가 난다”고 말합니다.</li><li>실험: 물이 조금, 반쯤, 많이 든 병을 두드리고 오른쪽 ‘소리 사다리’에서 높이를 봅니다. 높은 소리일수록 물결 무늬가 촘촘하게 퍼집니다.</li><li>발견: 물의 양과 소리 높이를 비교합니다.</li><li>놀이: 물병 8개의 물을 맞춰 도레미파솔라시도를 만들고 ‘작은 별’을 연주합니다. 입으로 불기로 바꾸면 순서가 뒤집히는 것을 발견합니다.</li></ul></div>
    <div><h3>소리 사용</h3><p>교실에서 여러 대가 함께 쓰는 것을 생각해 <b>소리는 처음에 꺼져 있습니다</b>. 화면만으로도 소리 높이를 볼 수 있게 만들었습니다. 전자칠판에서 함께 볼 때나 이어폰을 쓸 때 ‘소리 켜기’를 눌러 주세요.</p></div>
    <div><h3>교과 연계</h3><p>3학년 과학 「소리의 성질」(소리가 나는 물체는 떨린다, 소리의 높낮이) 준비 활동. 음악 시간의 계이름과도 이어집니다.</p></div>
    <div><h3>교실에서 실제로 해 보기</h3><p>같은 유리병 여러 개에 물을 다르게 담고 숟가락으로 살살 두드려 보세요. 물에 식용 색소를 넣으면 음 이름별로 구별하기 쉽습니다.</p></div>`;

  HH.register({
    id: 'xylophone',
    cards: [
      { id: 'xylo-tap', no: 1, text: '물병을 두드리면 물이 많을수록 낮은 소리가 나요.', art: art1 },
      { id: 'xylo-blow', no: 2, text: '병을 입으로 불면 반대로 물이 많을수록 높은 소리가 나요.', art: art2 }
    ],
    thumb() { return art1().replace('<svg', '<svg class="xart"'); },
    unmount() { this._alive = false; },
    mount(root) {
      const self = this; self._alive = true;
      const alive = () => self._alive;
      root.innerHTML = HH.expShell({ id: 'xylophone', stage: STAGE, teacher: TEACHER, legend: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4" fill="#e0453a"/><circle cx="10" cy="10" r="8" fill="none" stroke="#8a6e48"/></svg>소리는 처음에 꺼져 있어요. 오른쪽 소리 사다리와 퍼지는 물결로 소리 높이를 볼 수 있어요.' });
      const $ = s => root.querySelector(s);
      const ui = HH.ui(root), say = ui.say;

      const st = {};
      function fresh() { Object.assign(st, { phase: 'intro', pred: null, results: {}, sound: st.sound || false, levels: [], sel: 0, mode: 'tap', song: -1, tuned: false, blown: {}, busy: false }); }
      fresh();

      (function () {
        const fl = $('#floorLines'); for (let x = 0; x < 1000; x += 90) el('path', { d: `M${x} 370 V560`, stroke: '#a87a4c', 'stroke-width': .8, opacity: .6 }, fl);
        const sd = $('#staffDeco');
        for (let i = 0; i < 5; i++) el('path', { d: `M180 ${70 + i * 10} C380 ${60 + i * 10} 560 ${84 + i * 10} 780 ${70 + i * 10}`, fill: 'none', stroke: '#8a6e48', 'stroke-width': .8 }, sd);
        [[240, 96, 0], [320, 86, 2], [420, 80, 4], [520, 90, 5], [620, 84, 4], [710, 92, 3]].forEach(([x, y, n]) => { el('ellipse', { cx: x, cy: y, rx: 6, ry: 4.5, fill: NCOL[n], transform: `rotate(-20 ${x} ${y})` }, sd); el('path', { d: `M${x + 5} ${y} V${y - 26}`, stroke: NCOL[n], 'stroke-width': 1.4 }, sd); });
        const ld = $('#ladder');
        for (let n = 0; n < 8; n++) {
          const y = MBOT - n * STEP;
          el('rect', { x: MX - 34, y: y - 2, width: 80, height: 4, rx: 2, fill: '#efe2c4' }, ld);
          el('circle', { cx: MX - 18, cy: y, r: 9, fill: NCOL[n], stroke: '#fff', 'stroke-width': 1.4 }, ld);
          const t = el('text', { x: MX + 12, y: y + 5, 'font-size': 15, fill: '#3b3226', 'font-family': 'Jua, sans-serif' }, ld); t.textContent = NOTES[n] + (n === 7 ? '↑' : '');
        }
      })();

      /* ---------- sound (optional) ---------- */
      let ctx = null;
      function tone(n, mode) {
        if (!st.sound) return;
        try {
          ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
          if (ctx.state === 'suspended') ctx.resume();
          const t = ctx.currentTime, f = FREQ[n];
          if (mode === 'blow') {
            const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f / 2;
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22, t + .15); g.gain.linearRampToValueAtTime(.0001, t + .9);
            o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1);
            const len = Math.floor(ctx.sampleRate * .9), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * .3;
            const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g2 = ctx.createGain();
            src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = f / 2; bp.Q.value = 9;
            g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(.6, t + .15); g2.gain.linearRampToValueAtTime(.0001, t + .9);
            src.connect(bp); bp.connect(g2); g2.connect(ctx.destination); src.start(t);
          } else {
            [[1, .5], [2.76, .12], [5.4, .04]].forEach(([m, a]) => {
              const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f * m;
              g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a * .4, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + 1.3 / m);
              o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.4);
            });
          }
        } catch (e) { }
      }

      /* ---------- drawing ---------- */
      const bottles = () => st.phase === 'play' ? st.levels.map((lvl, i) => ({ i, x: 250 + i * 76, lvl })) : TEST.map((b, i) => ({ i, x: b.x, lvl: b.lvl, id: b.id, name: b.name }));
      let wob = {};
      function drawBottles() {
        const g = $('#bottles'); let s = '';
        bottles().forEach(b => {
          const n = noteOf(b.lvl, 'tap');
          const color = st.phase === 'play' ? NCOL[n] : '#5aa6dc';
          const glow = st.phase === 'play' && st.song >= 0 && SONG[st.song] === b.i ? '#d9822b' : st.phase === 'play' && st.sel === b.i ? '#3b3226' : null;
          const k = st.phase === 'play' ? .86 : 1.15, r = (wob[b.i] || 0);
          s += `<g class="btl" data-b="${b.i}" style="cursor:pointer" transform="translate(${b.x} ${TABLE}) rotate(${r.toFixed(2)}) scale(${k})">${bottleSVG(b.lvl, color, { glow })}<rect x="-34" y="-165" width="68" height="165" fill="#fff" fill-opacity="0"/></g>`;
          if (st.phase === 'play') {
            const tgt = b.i, ok = n === tgt && st.mode === 'tap';
            s += `<g transform="translate(${b.x} ${TABLE + 34})"><circle r="13" fill="${NCOL[tgt]}" stroke="#fff" stroke-width="1.4"/><text y="5" text-anchor="middle" font-size="13" fill="#fff" font-family="Jua, sans-serif">${NOTES[tgt]}</text>${ok ? '<path d="M8 -16 l4 4 l8 -9" fill="none" stroke="#3c5f30" stroke-width="2.6" stroke-linecap="round"/>' : ''}</g>`;
          } else s += `<text x="${b.x}" y="${TABLE + 40}" text-anchor="middle" font-size="17" font-family="Jua, sans-serif" fill="#3b3226">${b.name}</text>`;
        });
        g.innerHTML = s;
      }
      let rings = [], floats = [], looping = false, ringJobs = [];
      function hit(i) {
        const b = bottles()[i]; if (!b) return;
        const n = noteOf(b.lvl, st.mode), k = st.phase === 'play' ? .86 : 1.15;
        tone(n, st.mode);
        wob[i] = 0; const t0 = performance.now(); wobAnim(i, t0);
        // mallet tap or breath lines
        if (st.mode === 'tap') {
          const m = $('#mallet'); m.setAttribute('opacity', 1); m.setAttribute('transform', `translate(${b.x + 32 * k} ${TABLE - 60 * k}) rotate(-25)`);
          setTimeout(() => { if (alive()) m.setAttribute('transform', `translate(${b.x + 32 * k} ${TABLE - 60 * k})`); }, 70);
          setTimeout(() => { if (alive()) m.setAttribute('opacity', 0); }, 380);
        } else {
          const fx = $('#xyFx'), y = TABLE - 166 * k;
          const p = el('path', { d: `M${b.x - 60} ${y - 10} q10 -5 20 0 t20 0 t20 0`, fill: 'none', stroke: '#7fa3b2', 'stroke-width': 2, 'stroke-linecap': 'round' }, fx);
          setTimeout(() => p.remove(), 700);
        }
        // the ladder marker
        const mk = $('#mark'); mk.setAttribute('cy', MBOT - n * STEP); mk.setAttribute('stroke', NCOL[n]); mk.setAttribute('opacity', 1);
        // rings: more and tighter for higher notes
        const count = 3 + Math.floor(n / 2), gap = .34 - n * .03;
        for (let j = 0; j < count; j++) ringJobs.push({ at: performance.now() + j * gap * 1000, x: b.x, y: TABLE - 80 * k, c: NCOL[n] });
        floats.push({ e: el('text', { x: b.x, y: TABLE - 175 * k, 'text-anchor': 'middle', 'font-size': 26, fill: NCOL[n], 'font-family': 'Jua, sans-serif' }, $('#xyFx')), y: TABLE - 175 * k, t: 0 });
        floats[floats.length - 1].e.textContent = '♪';
        kick();
        return n;
      }
      function wobAnim(i, t0) {
        (function f(n) { if (!alive()) return; const t = (n - t0) / 1000; wob[i] = Math.sin(t * 40) * 2.2 * Math.exp(-t * 5); drawBottles(); if (t < .8) requestAnimationFrame(f); else { wob[i] = 0; drawBottles(); } })(t0);
      }
      function kick() {
        if (looping) return; looping = true; let last = null;
        (function f(n) {
          if (!alive()) { looping = false; return; }
          if (last === null) last = n; const dt = Math.min(.05, (n - last) / 1000); last = n;
          ringJobs = ringJobs.filter(j => { if (n >= j.at) { rings.push({ e: el('ellipse', { cx: j.x, cy: j.y, rx: 30, ry: 50, fill: 'none', stroke: j.c, 'stroke-width': 2 }, $('#rings')), t: 0 }); return false; } return true; });
          rings = rings.filter(r => { r.t += dt; const k = r.t / .9; r.e.setAttribute('rx', (30 + 90 * k).toFixed(1)); r.e.setAttribute('ry', (50 + 70 * k).toFixed(1)); r.e.setAttribute('opacity', Math.max(0, .8 - k).toFixed(2)); if (k >= 1) { r.e.remove(); return false; } return true; });
          floats = floats.filter(q => { q.t += dt; q.e.setAttribute('y', (q.y - q.t * 60).toFixed(1)); q.e.setAttribute('opacity', Math.max(0, 1 - q.t).toFixed(2)); if (q.t >= 1) { q.e.remove(); return false; } return true; });
          if (ringJobs.length || rings.length || floats.length) requestAnimationFrame(f); else looping = false;
        })(performance.now());
      }

      /* ---------- panels ---------- */
      function resultTable() {
        return `<table class="mtable"><thead><tr><th>물병</th><th>소리 높이</th></tr></thead><tbody>${TEST.map(b => {
          const n = st.results[b.id];
          return `<tr><td><svg viewBox="-36 -170 72 176" style="width:30px;height:70px;display:block" aria-hidden="true">${bottleSVG(b.lvl, '#5aa6dc')}</svg><span style="font-size:13px">물 ${b.name}</span></td><td>${n != null ? `<span class="seatno" style="color:${NCOL[n]}">${NOTES[n]}</span><div style="display:flex;gap:2px;margin-top:4px;align-items:flex-end">${NOTES.map((_, j) => `<span style="width:8px;height:${6 + j * 3}px;border-radius:2px;background:${j === n ? NCOL[n] : '#e7dcc4'}"></span>`).join('')}</div>` : '<span class="wait">?</span>'}</td></tr>`;
        }).join('')}</tbody></table>`;
      }
      const soundBtn = () => `<button type="button" class="btn small" data-act="sound" aria-pressed="${st.sound}" style="display:inline-flex;align-items:center;gap:6px">${SPEAKER(st.sound)}${st.sound ? '소리 끄기' : '소리 켜기'}</button>`;
      function renderControls() {
        const c = $('#controls'), side = $('#side');
        if (st.phase === 'test' || st.phase === 'discover') {
          c.innerHTML = `<p class="lab">물병을 두드려 봐</p><div class="angles">${TEST.map((b, i) => `<button type="button" class="ang" data-tap="${i}" style="--c:#5aa6dc"><svg viewBox="-40 -170 80 176" style="max-width:40px" aria-hidden="true">${bottleSVG(b.lvl, '#5aa6dc')}</svg><span>물 ${b.name}</span>${st.results[b.id] != null ? '<i class="done" aria-label="해 봤어요">✓</i>' : ''}</button>`).join('')}</div>
            <div class="row">${soundBtn()}<span style="font-size:13px;color:var(--ink-soft)">물병을 직접 눌러도 돼요</span></div>`;
          side.innerHTML = `<p class="lab">어떤 소리가 났을까?</p>${resultTable()}${TEST.every(b => st.results[b.id] != null) ? '<button type="button" class="btn primary wide glow" data-act="discover">발견하기</button>' : ''}`;
        } else if (st.phase === 'play') {
          const b = st.levels[st.sel];
          c.innerHTML = `<p class="lab">${st.sel + 1}번째 물병 (${NOTES[st.sel]} 자리)</p>
            <div class="row" style="margin-top:0"><button type="button" class="btn" data-act="less" ${b <= 2 ? 'disabled' : ''}>물 덜어내기</button><button type="button" class="btn primary" data-act="more" ${b >= 9 ? 'disabled' : ''}>물 더 붓기</button></div>
            <p class="lab" style="margin-top:12px">소리 내는 방법</p><div class="worlds"><button type="button" class="world ${st.mode === 'tap' ? 'on' : ''}" data-mode="tap" aria-pressed="${st.mode === 'tap'}"><svg viewBox="-10 -50 60 60" aria-hidden="true"><path d="M0 0 L46 -40" stroke="#8a5a2e" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="0" r="9" fill="#d4574a"/></svg><span>채로 두드리기</span></button><button type="button" class="world ${st.mode === 'blow' ? 'on' : ''}" data-mode="blow" aria-pressed="${st.mode === 'blow'}"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M4 18 q6 -4 12 0 t12 0 t12 0 M4 28 q6 -4 12 0 t12 0" fill="none" stroke="#7fa3b2" stroke-width="2.4" stroke-linecap="round"/></svg><span>입으로 불기</span></button></div>
            <div class="row">${soundBtn()}</div>`;
          side.innerHTML = `<p class="lab">물병 실로폰 만들기</p><p style="margin:0 0 8px;font-size:14px">물병을 눌러 소리를 듣고, 물을 더 붓거나 덜어서 아래 계이름과 <b style="font-family:var(--display);font-weight:400">같은 색</b>으로 맞춰 봐.</p>
            <p class="score" style="margin:0">맞춘 물병 <b>${st.levels.filter((l, i) => noteOf(l, 'tap') === i).length}</b>/8</p>
            ${st.tuned ? `<button type="button" class="btn primary wide" data-act="song">${st.song >= 0 ? `작은 별 연주 중 (${st.song + 1}/${SONG.length})` : '작은 별 연주하기'}</button>` : ''}`;
        } else {
          c.innerHTML = `<p class="lab">준비 중</p><p style="margin:0;color:var(--ink-soft)">먼저 어떤 소리가 날지 예상해 봐요.</p>`;
          side.innerHTML = `<p class="lab">어떤 소리가 났을까?</p>${resultTable()}`;
        }
      }
      function setPhase(p) { st.phase = p; HH.setSteps(root, p); drawBottles(); renderControls(); }

      function intro() {
        ui.show(`<div class="ov-card center">
          <div class="chars">${HH.OWL_SVG}<svg class="sq" viewBox="-110 -170 220 176" aria-hidden="true"><g transform="translate(-70 0) scale(.9)">${bottleSVG(3, NCOL[6])}</g><g transform="scale(.9)">${bottleSVG(5, NCOL[4])}</g><g transform="translate(70 0) scale(.9)">${bottleSVG(8, NCOL[1])}</g></svg></div>
          <p class="eyebrow">빛과 소리 극장 · 소리</p><h2>물병 실로폰</h2>
          <p class="lead">물을 다르게 담은 물병을 두드리면<br>어떤 소리가 날까?</p>
          <button type="button" class="btn primary" data-act="start">시작하기</button></div>`);
      }
      function predict() {
        setPhase('predict');
        const pic = (lvl, arrow) => `<svg viewBox="0 0 160 100" aria-hidden="true"><rect width="160" height="100" fill="#f3e9d6"/><g transform="translate(56 92) scale(.5)">${bottleSVG(lvl, '#5aa6dc')}</g>${arrow}</svg>`;
        const up = '<path d="M118 76 V24" stroke="#9c4524" stroke-width="3"/><path d="M110 34 L118 20 L126 34" fill="none" stroke="#9c4524" stroke-width="3"/>';
        const down = '<path d="M118 24 V76" stroke="#3f6fc0" stroke-width="3"/><path d="M110 66 L118 80 L126 66" fill="none" stroke="#3f6fc0" stroke-width="3"/>';
        const eq = '<path d="M106 44 H130 M106 56 H130" stroke="#6d604c" stroke-width="3"/>';
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '물을 <b>많이</b> 담은 병을 두드리면, 물이 <b>조금</b> 든 병보다 소리가 어떨까?')}
          ${HH.talk('squirrel', '물이 꽉 차 있으면 <b>높은 소리</b>가 날 거야!')}
          <div class="picks">
            <button type="button" class="pick" data-pick="high">${pic(8, up)}<span>더 높은 소리</span></button>
            <button type="button" class="pick" data-pick="low">${pic(8, down)}<span>더 낮은 소리</span></button>
            <button type="button" class="pick" data-pick="same">${pic(8, eq)}<span>똑같은 소리</span></button>
          </div></div>`);
      }
      function discover() {
        setPhase('discover'); HH.addCard('xylo-tap');
        const msg = { low: '예상이 딱 맞았어! 물이 많을수록 <b>낮은 소리</b>가 났지.', high: '도토리랑 같은 생각이었구나! 그런데 물이 많을수록 <b>낮은 소리</b>가 났어.', same: '소리 높이가 달랐어. 물이 많을수록 <b>낮은 소리</b>가 났지.' }[st.pred] || '';
        ui.show(`<div class="ov-card"><h2>무엇을 발견했니?</h2>
          ${resultTable()}
          ${HH.talk('owl', msg + ' 두드리면 병과 물이 함께 <b>떨려</b>. 물이 많으면 무거워서 <b>천천히</b> 떨리고, 천천히 떨리면 낮은 소리가 난단다. 물결 무늬도 덜 촘촘했지?')}
          ${HH.talk('squirrel', '소리가 나는 건 무언가가 떨리기 때문이구나!')}
          ${HH.dcard(1, art1(), '물병을 두드리면 물이 많을수록 낮은 소리가 나요.', '물이 조금 든 병은 높은 소리, 많이 든 병은 낮은 소리.')}
          <button type="button" class="btn primary" data-act="play">물병 실로폰 만들기</button></div>`);
      }
      function blowCard() {
        HH.addCard('xylo-blow');
        ui.show(`<div class="ov-card">
          ${HH.talk('owl', '입으로 불면 <b>병 속 공기</b>가 떨려. 물이 많으면 공기가 들어 있는 곳이 짧아서 <b>빨리</b> 떨리고, 그래서 높은 소리가 나. 두드릴 때와 <b>반대</b>지?')}
          ${HH.dcard(2, art2(), '병을 입으로 불면 반대로 물이 많을수록 높은 소리가 나요.', '두드리면 병과 물이 떨리고, 불면 병 속 공기가 떨려요.')}
          <button type="button" class="btn primary" data-act="close">계속 연주하기</button></div>`);
      }
      function startPlay() {
        ui.hide();
        const lv = [2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - .5);
        if (lv.every((l, i) => noteOf(l, 'tap') === i)) lv.reverse();
        st.levels = lv; st.sel = 0; st.mode = 'tap'; st.song = -1; st.tuned = false;
        setPhase('play');
        say('owl', '물병 8개가 있어. 물을 더 붓거나 덜어서 <b>도레미파솔라시도</b>를 만들어 보자! 물의 색이 아래 계이름 색과 같아지면 맞은 거야.', true);
      }
      function checkTuned() {
        const ok = st.levels.every((l, i) => noteOf(l, 'tap') === i);
        if (ok && !st.tuned) { st.tuned = true; HH.stars($('#xyFx'), 520, 220); say('owl', '<b>도레미파솔라시도</b> 완성! 물이 많은 병부터 적은 병 순서로 줄을 섰지? 이제 <b>작은 별</b>을 연주해 볼까?', true); }
      }
      function reset() { fresh(); ui.hide(); setPhase('intro'); say('owl', '안녕! 오늘은 <b>물병 실로폰</b>을 만들어 볼 거야.'); intro(); }

      function tapBottle(i) {
        if (st.phase === 'test' || st.phase === 'discover') {
          const b = TEST[i], n = hit(i); const first = st.results[b.id] == null;
          st.results[b.id] = n; renderControls();
          if (first) {
            const done = TEST.every(q => st.results[q.id] != null);
            say('owl', `물이 <b>${b.name}</b> 든 병은 <b style="color:${NCOL[n]}">${NOTES[n]}</b> 소리가 났어. 소리 사다리에서 ${n >= 5 ? '<b>높은 쪽</b>' : n <= 2 ? '<b>낮은 쪽</b>' : '<b>가운데쯤</b>'}이야.` + (done ? ' 세 병을 다 두드려 봤네. <b>발견하기</b>를 눌러 봐!' : ''), n >= 5);
          }
        } else if (st.phase === 'play') {
          st.sel = i; const n = hit(i);
          if (st.mode === 'blow') {
            st.blown[st.levels[i]] = true;
            if (Object.keys(st.blown).length === 1) say('owl', `입으로 불었더니 <b style="color:${NCOL[n]}">${NOTES[n]}</b> 소리가 났어. 물이 다른 병도 불어 볼래? 두드릴 때와 어떻게 다를까?`);
            if (Object.keys(st.blown).length >= 3 && !HH.hasCard('xylo-blow')) setTimeout(() => { if (alive()) blowCard(); }, 900);
          } else if (st.song >= 0) {
            if (SONG[st.song] === i) { st.song++; if (st.song >= SONG.length) { st.song = -1; HH.stars($('#xyFx'), 520, 200); say('owl', '<b>작은 별</b> 연주 끝! 짝짝짝! 정말 멋진 물병 실로폰이야.', true); } }
            else say('squirrel', '앗, 주황색 점선이 있는 물병을 눌러 봐!');
          }
          drawBottles(); renderControls();
        }
      }

      root.addEventListener('click', e => {
        const bt = e.target.closest('.btl');
        if (bt) { tapBottle(+bt.dataset.b); return; }
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'resetBtn') { reset(); return; }
        if (b.dataset.tap) { tapBottle(+b.dataset.tap); return; }
        if (b.dataset.mode) { st.mode = b.dataset.mode; st.song = -1; drawBottles(); renderControls(); say('owl', st.mode === 'blow' ? '이번엔 병 입구를 <b>입으로 불어</b> 보자. 물병을 눌러 봐!' : '다시 <b>채로 두드리기</b>야.'); return; }
        if (b.dataset.pick) { st.pred = b.dataset.pick; ui.hide(); setPhase('test'); say('owl', '세 물병을 하나씩 두드려 보자. 오른쪽 <b>소리 사다리</b>를 잘 봐! 높은 소리일수록 위로 올라가.', true); return; }
        const act = b.dataset.act;
        if (act === 'start') predict();
        else if (act === 'discover') discover();
        else if (act === 'play') startPlay();
        else if (act === 'sound') { st.sound = !st.sound; renderControls(); }
        else if (act === 'more' || act === 'less') { st.levels[st.sel] += act === 'more' ? 1 : -1; st.song = -1; drawBottles(); hit(st.sel); checkTuned(); renderControls(); }
        else if (act === 'song') { if (st.song < 0) { st.mode = 'tap'; st.song = 0; drawBottles(); renderControls(); say('owl', '<b>주황색 점선</b>이 생기는 물병을 차례로 눌러 봐. 작은 별 노래가 돼!'); } }
        else if (act === 'close') ui.hide();
      });

      setPhase('intro');
      say('owl', '안녕! 오늘은 <b>물병 실로폰</b>을 만들어 볼 거야.');
      intro();
    }
  });
})();
