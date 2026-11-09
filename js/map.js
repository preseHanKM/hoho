/* 홈 (호호박사 과학관 + 실험 메뉴) and 발견 카드 도감 */
(function () {
  const { el, rng, ZONES, CATALOG, TOTAL_EXPS } = HH;
  const ZCOL = { field: '#d9692e', build: '#a8700c', sky: '#2b8fc4', water: '#23867d', magnet: '#c0392b', theater: '#7457a8' };

  /* 호호박사 과학관: a future-city science museum at dusk. Its 16 halo lights glow as experiments are finished. */
  function heroSVG(done) {
    const R = rng(97);
    let stars = '', city = '', lights = '';
    for (let i = 0; i < 70; i++) stars += `<circle cx="${(R() * 1000).toFixed(1)}" cy="${(R() * 150).toFixed(1)}" r="${(.4 + R() * .9).toFixed(2)}" fill="#fffbe8" opacity="${(.3 + R() * .6).toFixed(2)}"/>`;
    [[20, 70, 120], [80, 50, 170], [140, 60, 140], [600, 46, 160], [656, 60, 120], [870, 54, 180], [930, 66, 130]].forEach(([x, w, h]) => {
      city += `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}" fill="#3a4a6b" opacity=".75"/>`;
      for (let yy = 300 - h + 10; yy < 292; yy += 14) for (let xx = x + 6; xx < x + w - 6; xx += 12) if (R() < .45) city += `<rect x="${xx}" y="${yy}" width="5" height="6" fill="#ffd98a" opacity="${(.4 + R() * .5).toFixed(2)}"/>`;
    });
    // halo ring lights: one per experiment
    for (let i = 0; i < TOTAL_EXPS; i++) {
      const a = Math.PI * (1.08 + .84 * i / (TOTAL_EXPS - 1)), x = 500 + Math.cos(a) * 318, y = 214 + Math.sin(a) * 44;
      lights += i < done ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#ffd56b" opacity=".35"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="#fff3c4" stroke="#e8a92a" stroke-width="1"/>`
        : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#5b6b86" stroke="#8a9ab3" stroke-width=".7"/>`;
    }
    let mer = '';
    for (let k = -4; k <= 4; k++) { const rx = Math.abs(k) / 4 * 196; mer += `<path d="M500 152 ${k < 0 ? `A${rx.toFixed(1)} 148 0 0 0 500 300` : k > 0 ? `A${rx.toFixed(1)} 148 0 0 1 500 300` : 'V300'}" fill="none" stroke="#e8f4fa" stroke-width=".7" opacity=".55"/>`; }
    for (let j = 1; j <= 4; j++) { const y = 300 - j * 30, rx = 200 * Math.sqrt(1 - Math.pow((300 - y) / 150, 2)); mer += `<path d="M${(500 - rx).toFixed(1)} ${y} A${rx.toFixed(1)} 14 0 0 0 ${(500 + rx).toFixed(1)} ${y}" fill="none" stroke="#e8f4fa" stroke-width=".7" opacity=".5"/>`; }
    return `<svg class="stage" viewBox="0 0 1000 420" role="img" aria-label="미래 도시의 과학관처럼 생긴 호호박사 실험실. 둥근 유리 돔과 떠 있는 고리, 전망 탑이 있고, 실험을 마칠 때마다 고리에 불이 하나씩 켜진다.">
      <defs>
        <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a4e"/><stop offset=".55" stop-color="#5b5f8c"/><stop offset=".85" stop-color="#e3a985"/><stop offset="1" stop-color="#f3c99a"/></linearGradient>
        <linearGradient id="domeG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe9f5"/><stop offset=".45" stop-color="#7fb4d6"/><stop offset="1" stop-color="#2f5c86"/></linearGradient>
        <linearGradient id="haloG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d2db"/></linearGradient>
        <linearGradient id="plazaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d4cb"/><stop offset="1" stop-color="#b9b2a6"/></linearGradient>
        <linearGradient id="poolG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e7fa8"/><stop offset="1" stop-color="#2f4a72"/></linearGradient>
        <radialGradient id="doorGlow" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
        <clipPath id="poolClip"><rect x="250" y="332" width="500" height="44" rx="6"/></clipPath>
      </defs>
      <rect width="1000" height="420" fill="url(#duskSky)"/>${stars}
      <circle cx="830" cy="70" r="20" fill="#fff6dc" opacity=".9"/><circle cx="822" cy="64" r="20" fill="#2a3760" opacity=".9"/>
      ${city}
      <!-- monorail -->
      <path d="M0 236 C220 214 380 268 520 250 S820 210 1000 232" fill="none" stroke="#c9d2db" stroke-width="5"/>
      <path d="M0 236 C220 214 380 268 520 250 S820 210 1000 232" fill="none" stroke="#8a97a8" stroke-width="1" transform="translate(0 4)"/>
      <g transform="translate(150 224) rotate(-4)"><rect x="-44" y="-14" width="88" height="16" rx="8" fill="#eef3f7" stroke="#7d8a9a" stroke-width=".8"/><path d="M-34 -9 H34" stroke="#7fb4d6" stroke-width="5" stroke-linecap="round"/><path d="M-30 -9 H-14 M-6 -9 H10 M18 -9 H30" stroke="#ffe7a0" stroke-width="3" opacity=".9"/></g>
      <!-- ground and plaza -->
      <path d="M0 300 H1000 V420 H0 Z" fill="#6f8a63"/>
      <path d="M120 300 H880 L960 420 H40 Z" fill="url(#plazaG)"/>
      <path d="M300 300 L250 420 M400 300 L380 420 M500 300 V420 M600 300 L620 420 M700 300 L750 420 M150 340 H850 M110 384 H890" stroke="#a8a196" stroke-width=".7" opacity=".7"/>
      <!-- left wing -->
      <path d="M190 300 V246 Q190 236 200 236 H330 L330 300 Z" fill="#e9eef2" stroke="#7d8a9a" stroke-width=".9"/>
      <g fill="#8fc1dc" stroke="#5f86a3" stroke-width=".5">${[0, 1, 2, 3, 4].map(i => `<rect x="${200 + i * 25}" y="250" width="20" height="44"/>`).join('')}</g>
      <path d="M200 262 H320" stroke="#e8f4fa" stroke-width=".6" opacity=".7"/>
      <!-- tower -->
      <path d="M712 300 L724 88 H736 L748 300 Z" fill="#e9eef2" stroke="#7d8a9a" stroke-width=".9"/>
      <path d="M726 120 V290 M734 120 V290" stroke="#8fc1dc" stroke-width="1.6" opacity=".8"/>
      <ellipse cx="730" cy="86" rx="34" ry="16" fill="url(#domeG)" stroke="#5f86a3" stroke-width=".9"/>
      <path d="M696 86 H764" stroke="#e8f4fa" stroke-width=".8"/>
      <path d="M730 70 V30" stroke="#9aa5b2" stroke-width="2"/><circle cx="730" cy="28" r="4" fill="#ff7a5c"/><circle cx="730" cy="28" r="9" fill="#ff7a5c" opacity=".25"/>
      <use href="#owl" x="716" y="68" width="28" height="35"/>
      <!-- halo ring behind dome -->
      <path d="M182 214 A318 44 0 0 1 818 214" fill="none" stroke="url(#haloG)" stroke-width="14"/>
      <!-- dome -->
      <path d="M300 300 A200 150 0 0 1 700 300 Z" fill="url(#domeG)" stroke="#4f7896" stroke-width="1"/>
      ${mer}
      <path d="M352 268 Q380 200 440 172" fill="none" stroke="#fff" stroke-width="6" opacity=".35" stroke-linecap="round"/>
      <!-- halo ring front + pillars -->
      <path d="M182 214 A318 44 0 0 0 818 214" fill="none" stroke="url(#haloG)" stroke-width="14"/>
      <path d="M182 214 A318 44 0 0 0 818 214" fill="none" stroke="#7d8a9a" stroke-width=".8" transform="translate(0 7)"/>
      <path d="M232 244 V300 M768 244 V300 M380 254 V300 M620 254 V300" stroke="#c9d2db" stroke-width="4"/>
      ${lights}
      <!-- entrance -->
      <ellipse cx="500" cy="292" rx="70" ry="22" fill="url(#doorGlow)"/>
      <path d="M462 300 V270 Q500 246 538 270 V300 Z" fill="#ffe7a8" stroke="#c9963a" stroke-width=".9"/>
      <path d="M500 254 V300 M481 262 V300 M519 262 V300" stroke="#c9963a" stroke-width=".7"/>
      <rect x="402" y="302" width="196" height="22" rx="4" fill="#2f3b52" stroke="#c9d2db" stroke-width=".8"/>
      <text x="500" y="318" text-anchor="middle" font-size="14" font-family="Jua, sans-serif" fill="#fff3c4" letter-spacing="2">호호박사 과학관</text>
      <!-- reflecting pool -->
      <rect x="250" y="332" width="500" height="44" rx="6" fill="url(#poolG)" stroke="#8a97a8" stroke-width=".8"/>
      <g clip-path="url(#poolClip)" opacity=".35"><path d="M300 332 A200 60 0 0 0 700 332 Z" fill="#9fd0e8"/><path d="M182 340 A318 14 0 0 0 818 340" fill="none" stroke="#fff" stroke-width="5"/></g>
      <path d="M290 348 h60 M420 360 h80 M580 350 h70" stroke="#c8dcef" stroke-width="1" opacity=".6"/>
      <!-- lamps and trees -->
      ${[160, 840].map(x => `<path d="M${x} 386 V336" stroke="#7d8a9a" stroke-width="2.4"/><circle cx="${x}" cy="332" r="6" fill="#fff3c4"/><circle cx="${x}" cy="332" r="16" fill="#ffd56b" opacity=".25"/>`).join('')}
      <g id="heroTrees"></g>
    </svg>`;
  }

  HH.view('map', {
    mount(root) {
      const done = HH.doneCount();
      root.innerHTML = `
        <div class="map-top">
          <div><p class="eyebrow">초등 저학년 과학 체험</p><h1>호호박사의 과학 놀이터</h1></div>
          <div class="prog" style="min-width:min(320px,100%)"><p>과학관 불 밝히기 <b>${done}</b> / ${TOTAL_EXPS}</p><div class="prog-bar"><i style="width:${(done / TOTAL_EXPS * 100).toFixed(1)}%"></i></div></div>
        </div>
        <div class="stage-wrap" style="background:#1c2a4e">${heroSVG(done)}</div>
        <div class="box guide-box"><div class="guide"><div class="portrait" id="portrait"></div><div class="bubble" id="bubble" aria-live="polite"></div></div></div>
        <div class="menu">${ZONES.map(z => `
          <section class="zone-sec" style="--z:${ZCOL[z.id]}">
            <h2 class="zone-h"><span class="zdot" aria-hidden="true"></span>${z.name}<small>${z.sub}</small></h2>
            <div class="xbtns">${z.exps.map(eid => {
              const c = CATALOG[eid], built = !!HH.exps[eid];
              if (!built) return `<div class="xbtn soon"><strong>${c.title}</strong><span>${c.line}</span><em>준비 중</em></div>`;
              const cards = HH.expCards(eid), n = cards.filter(k => HH.hasCard(k.id)).length;
              return `<a class="xbtn" href="#${eid}"><strong>${c.title}</strong><span>${c.line}</span><em>${cards.map(k => `<i class="${HH.hasCard(k.id) ? 'on' : ''}"></i>`).join('')}발견 카드 ${n}/${cards.length}</em></a>`;
            }).join('')}</div>
          </section>`).join('')}</div>`;
      const t = root.querySelector('#heroTrees'), R = rng(12);
      [[40, 400], [96, 410], [900, 404], [960, 412], [250, 300], [780, 300]].forEach(([x, y]) => HH.tree(t, x, y, .9 + R() * .4));
      const ui = HH.ui(root);
      if (done === 0) ui.say('owl', '어서 와! 여기는 <b>호호박사 과학관</b>이야. 실험을 마칠 때마다 과학관 고리에 <b>불이 하나씩</b> 켜진단다. 아래에서 하고 싶은 실험을 골라 봐!');
      else if (done < TOTAL_EXPS) ui.say('owl', `과학관에 불이 <b>${done}개</b> 켜졌어! 아직 켜지지 않은 실험도 해 볼까?`, true);
      else ui.say('owl', '과학관의 불이 모두 켜졌어! 너는 정말 훌륭한 과학자야!', true);
    }
  });

  HH.view('cards', {
    mount(root) {
      const render = () => {
        let total = 0, have = 0, items = '';
        ZONES.forEach(z => z.exps.forEach(eid => {
          const c = CATALOG[eid];
          if (!HH.exps[eid]) {
            items += `<div class="ccard locked"><div class="qart">?</div><p class="dno">${z.name} · ${c.title}</p><p class="dtext">준비 중인 실험이에요</p></div>`;
            return;
          }
          HH.expCards(eid).forEach(k => {
            total++;
            if (HH.hasCard(k.id)) { have++; items += `<div class="ccard">${k.art()}<p class="dno">${c.title} · 카드 ${k.no}</p><p class="dtext">${k.text}</p></div>`; }
            else items += `<a class="ccard locked" href="#${eid}" style="text-decoration:none"><div class="qart">?</div><p class="dno">${c.title} · 카드 ${k.no}</p><p class="dtext">실험을 하면 받을 수 있어요</p></a>`;
          });
        }));
        root.innerHTML = `
          <div class="map-top"><div><p class="eyebrow">내가 모은 발견</p><h1>발견 카드 도감</h1></div>
            <div class="prog" style="min-width:min(320px,100%)"><p>모은 카드 <b>${have}</b> / ${total}</p><div class="prog-bar"><i style="width:${total ? (have / total * 100).toFixed(1) : 0}%"></i></div></div></div>
          <div class="cards-grid">${items}</div>
          <details class="teacher"><summary>선생님 도구</summary><div class="teacher-body">
            <p>발견 카드는 이 기기의 브라우저에만 저장돼요. 다음 학생이 쓰기 전에 지울 수 있어요.</p>
            <div class="confirm" id="confirmRow"><button type="button" class="btn small" data-act="ask">카드 모두 지우기</button></div>
          </div></details>`;
      };
      render();
      root.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const row = root.querySelector('#confirmRow');
        if (b.dataset.act === 'ask') row.innerHTML = `<span>모든 발견 카드를 지울까요? 되돌릴 수 없어요.</span><button type="button" class="btn small" data-act="wipe" style="border-color:#9c4524;color:#9c4524">지우기</button><button type="button" class="btn small" data-act="keep">그만두기</button>`;
        else if (b.dataset.act === 'keep') row.innerHTML = `<button type="button" class="btn small" data-act="ask">카드 모두 지우기</button>`;
        else if (b.dataset.act === 'wipe') { HH.clearAll(); render(); root.querySelector('details.teacher').open = true; root.querySelector('#confirmRow').insertAdjacentHTML('afterbegin', '<span>모두 지웠어요.</span>'); }
      });
    }
  });
})();
