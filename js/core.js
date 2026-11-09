/* 호호박사의 과학 놀이터 — shared core: helpers, catalog, card store, guide UI, router */
window.HH = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* Korean particle by final consonant: josa('반달곰','은','는') → '반달곰은' */
  function josa(word, withBatchim, without) {
    const c = word.charCodeAt(word.length - 1);
    const has = c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
    return word + (has ? withBatchim : without);
  }
  const OWL_SVG ='<svg viewBox="0 0 120 150" aria-hidden="true"><use href="#owl" width="120" height="150"/></svg>';
  const SQ_SVG = '<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#squirrel" width="120" height="120"/></svg>';

  /* every experiment planned for the playground, by zone */
  const ZONES = [
    { id: 'field', name: '운동장', sub: '힘과 움직임', exps: ['balloon', 'seesaw', 'slide', 'swing', 'race'] },
    { id: 'build', name: '공사장', sub: '도구의 힘', exps: ['pulley', 'crane', 'lever'] },
    { id: 'sky', name: '하늘 정원', sub: '공기의 힘', exps: ['plane', 'parachute', 'rocket'] },
    { id: 'water', name: '물놀이장', sub: '뜨고 가라앉기', exps: ['float', 'clayboat'] },
    { id: 'magnet', name: '자석 낚시터', sub: '자석의 힘', exps: ['magnet'] },
    { id: 'theater', name: '빛과 소리 극장', sub: '빛과 소리', exps: ['shadow', 'xylophone', 'cupphone'] }
  ];
  const CATALOG = {
    balloon: { title: '물풍선 멀리 던지기', line: '어느 방향으로 던져야 가장 멀리 갈까?' },
    seesaw: { title: '동물 시소', line: '무거운 곰과 가벼운 토끼가 수평을 맞출 수 있을까?' },
    slide: { title: '미끄럼틀 바닥 바꾸기', line: '얼음, 잔디, 모래 미끄럼틀 중 어디가 가장 빠를까?' },
    swing: { title: '그네 흔들기', line: '줄이 길면 그네가 빨리 흔들릴까, 천천히 흔들릴까?' },
    race: { title: '어느 길이 가장 빠를까?', line: '출발점과 도착점이 같은 네 가지 길, 구슬은 어디로 가야 가장 먼저 도착할까?' },
    pulley: { title: '도르래 엘리베이터', line: '도르래를 쓰면 아기곰을 더 쉽게 올릴 수 있을까?' },
    crane: { title: '기중기 기사', line: '기중기 팔을 길게 뻗으면 무슨 일이 생길까?' },
    lever: { title: '지렛대로 바위 들기', line: '받침을 어디에 두어야 바위가 쉽게 들릴까?' },
    plane: { title: '종이비행기 공방', line: '날개 모양을 바꾸면 얼마나 멀리 날까?' },
    parachute: { title: '달걀 낙하산', line: '달걀이 깨지지 않게 내려오려면?' },
    rocket: { title: '풍선 로켓', line: '바람을 빼면 풍선은 어느 쪽으로 날아갈까?' },
    float: { title: '둥둥 퐁당', line: '크고 무거우면 무조건 가라앉을까?' },
    clayboat: { title: '찰흙 배 만들기', line: '가라앉는 찰흙을 물에 띄울 수 있을까?' },
    magnet: { title: '자석 낚시', line: '자석에 붙는 물건과 붙지 않는 물건을 찾아보자.' },
    shadow: { title: '그림자 인형극', line: '손전등을 가까이 대면 그림자는 어떻게 될까?' },
    xylophone: { title: '물병 실로폰', line: '물의 양을 바꾸면 소리가 어떻게 달라질까?' },
    cupphone: { title: '실 전화기', line: '실을 느슨하게 하면 소리가 잘 들릴까?' }
  };
  const TOTAL_EXPS = Object.keys(CATALOG).length;
  function zoneOf(expId) { return ZONES.find(z => z.exps.includes(expId)); }

  /* registry */
  const exps = {}, views = {};
  function register(e) { exps[e.id] = e; }
  function view(name, v) { views[name] = v; }

  /* discovery cards (kept per device; the page works without storage) */
  let got = new Set();
  try { const s = localStorage.getItem('hh-cards'); if (s) got = new Set(JSON.parse(s)); } catch (e) { }
  function save() { try { localStorage.setItem('hh-cards', JSON.stringify([...got])); } catch (e) { } }
  function hasCard(id) { return got.has(id); }
  function addCard(id) {
    if (got.has(id)) return false;
    got.add(id); save(); updateCount();
    const n = document.getElementById('cardsNav');
    if (n) { n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); }
    return true;
  }
  function clearAll() { got = new Set(); save(); updateCount(); }
  function updateCount() { const n = document.getElementById('cardN'); if (n) n.textContent = got.size; }
  function expCards(id) { return exps[id] ? exps[id].cards : []; }
  function expDone(id) { return expCards(id).some(c => got.has(c.id)); }
  function doneCount() { return Object.keys(CATALOG).filter(expDone).length; }

  /* guide + overlay inside a mounted view */
  function ui(root) {
    const ov = root.querySelector('.ov');
    return {
      say(who, text, cheer) {
        const p = root.querySelector('#portrait'), b = root.querySelector('#bubble');
        if (!p || !b) return;
        p.innerHTML = who === 'owl' ? OWL_SVG : SQ_SVG;
        b.innerHTML = `<span class="who">${who === 'owl' ? '호호박사' : '도토리'}</span>${text}`;
        if (cheer) { p.classList.remove('cheer'); void p.offsetWidth; p.classList.add('cheer'); }
      },
      show(html) { ov.innerHTML = html; ov.hidden = false; const b = ov.querySelector('button,a'); if (b) b.focus({ preventScroll: true }); },
      hide() { ov.hidden = true; ov.innerHTML = ''; }
    };
  }
  function talk(who, text) {
    return `<div class="talk"><div class="portrait">${who === 'owl' ? OWL_SVG : SQ_SVG}</div><div class="bubble"><span class="who">${who === 'owl' ? '호호박사' : '도토리'}</span>${text}</div></div>`;
  }
  function dcard(no, art, text, sub) {
    return `<div class="dcard">${art}<div><p class="dno">발견 카드 ${no}</p><p class="dtext">${text}</p>${sub ? `<p class="dsub">${sub}</p>` : ''}</div></div>`;
  }

  /* experiment page frame: header with steps, stage, guide/controls/side, teacher notes, overlay */
  function expShell(o) {
    const z = zoneOf(o.id);
    return `
    <header class="top">
      <div><p class="eyebrow">${z ? z.name + ' · ' + z.sub : ''}</p><h1>${CATALOG[o.id].title}</h1></div>
      <ol class="steps" id="steps"><li data-step="predict">예상</li><li data-step="test">실험</li><li data-step="discover">발견</li><li data-step="play">놀이</li></ol>
      <div class="tools"><a class="ghost" href="#map">← 실험 목록</a><button class="ghost" id="resetBtn" type="button">처음부터</button></div>
    </header>
    <div class="stage-wrap">${o.stage}</div>
    ${o.legend ? `<div class="legend">${o.legend}</div>` : ''}
    <section class="panel">
      <div class="box guide-box"><div class="guide"><div class="portrait" id="portrait"></div><div class="bubble" id="bubble" aria-live="polite"></div></div></div>
      <div class="box" id="controls"></div>
      <div class="box" id="side"></div>
    </section>
    <details class="teacher"><summary>선생님 안내</summary><div class="teacher-body">${o.teacher}</div></details>
    <div class="ov" role="dialog" aria-modal="true" hidden></div>`;
  }
  function setSteps(root, phase) {
    const order = ['predict', 'test', 'discover', 'play'], idx = order.indexOf(phase);
    root.querySelectorAll('#steps li').forEach((li, i) => { li.classList.toggle('now', i === idx); li.classList.toggle('done', idx > i); });
  }

  /* little scenery helpers shared by stages */
  function tree(parent, x, y, s) {
    const g = el('g', { transform: `translate(${x} ${y}) scale(${s.toFixed(2)})` }, parent);
    el('rect', { x: -2.5, y: -18, width: 5, height: 18, fill: '#7a5a3a', stroke: '#5e4428', 'stroke-width': .5 }, g);
    [[-9, -26, 12], [8, -28, 13], [0, -40, 14], [-4, -32, 11]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: 'url(#treeG)', stroke: '#557d40', 'stroke-width': .6 }, g));
    return g;
  }
  function stars(fxLayer, x, y) {
    const items = [];
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2;
      const p = el('path', { d: 'M0 -7 L2 -2 L7 -2 L3 1.5 L4.5 7 L0 3.8 L-4.5 7 L-3 1.5 L-7 -2 L-2 -2 Z', fill: i % 2 ? '#f2c230' : '#ffe08a', stroke: '#b8860b', 'stroke-width': .6 }, fxLayer);
      items.push({ p, a });
    }
    const t0 = performance.now();
    (function f(n) {
      const k = Math.min(1, (n - t0) / 800);
      items.forEach(({ p, a }) => { const r = 10 + 60 * k; p.setAttribute('transform', `translate(${(x + Math.cos(a) * r).toFixed(1)} ${(y - 20 + Math.sin(a) * r * 0.7).toFixed(1)}) scale(${(1.2 - k * 0.6).toFixed(2)})`); p.setAttribute('opacity', (1 - k * k).toFixed(2)); });
      if (k < 1) requestAnimationFrame(f); else items.forEach(i => i.p.remove());
    })(t0);
  }

  /* router: #map, #cards, or an experiment id */
  let current = null;
  function route() {
    const h = (location.hash || '#map').slice(1);
    if (current && current.unmount) { try { current.unmount(); } catch (e) { } }
    const host = document.getElementById('view');
    host.innerHTML = '';
    const root = document.createElement('div');
    host.appendChild(root);
    window.scrollTo(0, 0);
    if (exps[h]) current = exps[h];
    else if (views[h]) current = views[h];
    else current = views.map;
    current.mount(root);
    const navKey = h === 'cards' ? 'cards' : 'map';
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === navKey));
  }
  function start() { window.addEventListener('hashchange', route); updateCount(); route(); }

  return { NS, el, rng, josa, OWL_SVG, SQ_SVG, ZONES, CATALOG, TOTAL_EXPS, zoneOf, register, view, exps, hasCard, addCard, clearAll, expCards, expDone, doneCount, ui, talk, dcard, expShell, setSteps, tree, stars, start };
})();
