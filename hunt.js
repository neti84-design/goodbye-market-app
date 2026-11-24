/* 굿바이마켓 — 매장 지도 속 골드 태그 찾기
   매장 입구 → 지도 위를 손가락으로 끌어 둘러보고, 매대를 누르면 내 캐릭터가 길을 찾아 걸어가서 뒤져 봄 → 골드 태그 또는 꽝 */
(function () {
  var C = 22, COLS = 30, ROWS = 46, W = C * COLS, H = C * ROWS;
  var TRIES = 5, SEE = 7, SPEED = 9; // 볼 수 있는 거리(칸), 걷는 속도(칸/초)

  // 매대 배치 (칸 단위)
  var BLOCKS = [
    { id: 'frz', name: '냉동', c: 1, r: 1, w: 28, h: 2, color: '#CFE6F5', kind: 'frz' },
    { id: 'snk', name: '과자', c: 3, r: 6, w: 3, h: 11, color: '#FFD7A8' },
    { id: 'ram', name: '라면', c: 10, r: 6, w: 3, h: 11, color: '#F7B9A6' },
    { id: 'drk', name: '음료', c: 17, r: 6, w: 3, h: 11, color: '#BFE3C8' },
    { id: 'det', name: '세제', c: 24, r: 6, w: 3, h: 11, color: '#C9D6F2' },
    { id: 'kit', name: '주방', c: 3, r: 20, w: 3, h: 11, color: '#E5D7C4' },
    { id: 'toy', name: '완구', c: 10, r: 20, w: 3, h: 11, color: '#F6C6DF' },
    { id: 'stn', name: '문구', c: 17, r: 20, w: 3, h: 11, color: '#E9E3A6' },
    { id: 'fsh', name: '패션잡화', c: 24, r: 20, w: 3, h: 11, color: '#D9C9EE' },
    { id: 'co1', name: '계산대', c: 3, r: 35, w: 8, h: 2, color: '#3A3A3A', kind: 'co' },
    { id: 'co2', name: '계산대', c: 19, r: 35, w: 8, h: 2, color: '#3A3A3A', kind: 'co' }
  ];
  var BY = {}; BLOCKS.forEach(function (b) { BY[b.id] = b; });

  // 뒤져 볼 자리: 서는 칸(ac, ar) + 표시 위치(x, y)
  var SPOTS = [];
  function addSpot(b, side, ar, ac, label) {
    var x, y;
    if (side === 'L') { x = b.c * C; y = ar * C + C / 2; }
    else if (side === 'R') { x = (b.c + b.w) * C; y = ar * C + C / 2; }
    else if (side === 'B') { x = ac * C + C / 2; y = (b.r + b.h) * C; }
    else { x = ac * C + C / 2; y = b.r * C; }
    SPOTS.push({ id: b.id + SPOTS.length, zone: b.id, name: b.name, label: label, ac: ac, ar: ar, x: x, y: y });
  }
  addSpot(BY.frz, 'B', 3, 5, '냉동 왼쪽 맨 위 칸');
  addSpot(BY.frz, 'B', 3, 14, '냉동 가운데 맨 위 칸');
  addSpot(BY.frz, 'B', 3, 24, '냉동 오른쪽 맨 위 칸');
  ['snk', 'ram', 'drk', 'det', 'kit', 'toy', 'stn', 'fsh'].forEach(function (k, i) {
    var b = BY[k], top = i < 4;
    var r1 = b.r + (top ? 2 : 7), r2 = b.r + (top ? 8 : 2);
    addSpot(b, 'L', r1, b.c - 1, b.name + ' 매대 ' + (r1 - b.r < 5 ? '위쪽' : '아래쪽') + ' 왼편');
    addSpot(b, 'R', r2, b.c + b.w, b.name + ' 매대 ' + (r2 - b.r < 5 ? '위쪽' : '아래쪽') + ' 오른편');
  });
  addSpot(BY.co1, 'B', 37, 6, '왼쪽 계산대 앞');
  addSpot(BY.co2, 'B', 37, 23, '오른쪽 계산대 앞');
  addSpot(BY.co1, 'T', 34, 9, '왼쪽 계산대 뒤 매대');

  // 지나갈 수 있는 칸
  var FREE = [];
  for (var r = 0; r < ROWS; r++) { FREE[r] = []; for (var c = 0; c < COLS; c++) FREE[r][c] = !(r === 0 || c === 0 || c === COLS - 1 || (r === ROWS - 1 && (c < 13 || c > 16))); }
  BLOCKS.forEach(function (b) { for (var r = b.r; r < b.r + b.h; r++) for (var c = b.c; c < b.c + b.w; c++) FREE[r][c] = false; });
  function free(c, r) { return r >= 0 && r < ROWS && c >= 0 && c < COLS && FREE[r][c]; }

  function seedOf(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }

  // 길 찾기 (칸 BFS → 직선으로 펴기)
  function path(fx, fy, tc, tr) {
    var sc = Math.round(fx - 0.5), sr = Math.round(fy - 0.5);
    if (!free(sc, sr)) { sc = Math.floor(fx); sr = Math.floor(fy); }
    var prev = {}, q = [[sc, sr]], key = function (c, r) { return c + ',' + r; };
    prev[key(sc, sr)] = null;
    var found = false;
    while (q.length) {
      var cur = q.shift();
      if (cur[0] === tc && cur[1] === tr) { found = true; break; }
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nc = cur[0] + d[0], nr = cur[1] + d[1], k = key(nc, nr);
        if (free(nc, nr) && !(k in prev)) { prev[k] = cur; q.push([nc, nr]); }
      });
    }
    if (!found) return [];
    var pts = [], k = [tc, tr];
    while (k) { pts.unshift({ x: k[0] + 0.5, y: k[1] + 0.5 }); k = prev[key(k[0], k[1])]; }
    // 펴기
    var out = [], from = { x: fx, y: fy }, i = 0;
    while (i < pts.length - 1) {
      var j = pts.length - 1;
      while (j > i + 1 && !clear(from, pts[j])) j--;
      out.push(pts[j]); from = pts[j]; i = j;
    }
    if (!out.length) out.push(pts[pts.length - 1]);
    return out;
  }
  function clear(a, b) {
    var d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.ceil(d / 0.2);
    for (var i = 0; i <= n; i++) {
      var x = a.x + (b.x - a.x) * i / n, y = a.y + (b.y - a.y) * i / n;
      for (var ox = -0.3; ox <= 0.31; ox += 0.6) for (var oy = -0.3; oy <= 0.31; oy += 0.6)
        if (!free(Math.floor(x + ox), Math.floor(y + oy))) return false;
    }
    return true;
  }
  function nearestFree(c, r) {
    for (var d = 0; d < 12; d++) for (var dc = -d; dc <= d; dc++) for (var dr = -d; dr <= d; dr++)
      if (Math.max(Math.abs(dc), Math.abs(dr)) === d && free(c + dc, r + dr)) return [c + dc, r + dr];
    return null;
  }

  var ZONE_CHIPS = ['frz', 'snk', 'ram', 'drk', 'det', 'kit', 'toy', 'stn', 'fsh', 'co1'];

  function html(st) {
    var dots = ''; for (var i = 0; i < TRIES; i++) dots += '<i class="' + (i < st.tries ? 'on' : '') + '"></i>';
    var blocks = BLOCKS.map(function (b) {
      return '<div class="hb ' + (b.kind || 'gon') + '" style="left:' + b.c * C + 'px;top:' + b.r * C + 'px;width:' + b.w * C + 'px;height:' + b.h * C + 'px;--c:' + b.color + '"><span>' + b.name + '</span></div>';
    }).join('');
    var spots = SPOTS.map(function (s, i) {
      return '<button class="hs" data-s="' + i + '" style="left:' + s.x + 'px;top:' + s.y + 'px" aria-label="' + s.label + ' 살펴보기"><b>?</b></button>';
    }).join('');
    var mini = BLOCKS.map(function (b) {
      return '<i style="left:' + (b.c / COLS * 100) + '%;top:' + (b.r / ROWS * 100) + '%;width:' + (b.w / COLS * 100) + '%;height:' + (b.h / ROWS * 100) + '%;background:' + b.color + '"></i>';
    }).join('');
    var chips = ZONE_CHIPS.map(function (k) { return '<button class="hz" data-z="' + k + '">' + (k === 'co1' ? '계산대' : BY[k].name) + '</button>'; }).join('');
    return '<div class="hunt">' +
      '<div class="htop"><button class="hback" data-a="huntExit" aria-label="보물찾기로 돌아가기"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<div class="ht"><b>골드 태그 찾기</b><small>김포점 매장 지도</small></div><div class="hdots" aria-label="남은 기회 ' + st.tries + '번">' + dots + '</div></div>' +
      '<div class="hview" id="hview"><div class="hworld" id="hworld" style="width:' + W + 'px;height:' + H + 'px">' +
      '<div class="hdoor" style="left:' + 13 * C + 'px;top:' + (ROWS - 1) * C + 'px;width:' + 4 * C + 'px;height:' + C + 'px">입구</div>' +
      blocks + '<div class="hdest" id="hdest"></div>' + spots + '<div class="hme" id="hme"><div class="ring"></div><div class="bod">나</div><div class="bub" id="hbub">뒤적뒤적…</div></div></div>' +
      '<div class="hmini" aria-hidden="true">' + mini + '<i class="me" id="hmini"></i></div>' +
      '<div class="hmsg" id="hmsg"></div></div>' +
      '<div class="hbot"><div class="hguide">어디로 갈까요? <span>지도를 끌어서 둘러보고, <b>?</b> 자리를 누르면 걸어가서 뒤져 봐요</span></div><div class="hzs">' + chips + '</div></div>' +
      '<div class="hmodal" id="hmodal"></div>' +
      '<div class="hgate" id="hgate"><div class="gtxt"><small>오늘의 보물찾기</small><b>매장 어딘가에<br>골드 태그가 숨어 있어요</b><p>기회는 하루 ' + TRIES + '번. 꽝이 나와도 힌트를 드려요.</p></div>' +
      '<div class="front"><div class="sign">GOOD-BUY</div><div class="wall"><div class="glass"><div class="dr l"></div><div class="dr r"></div></div></div></div>' +
      '<button class="btn genter" id="genter">매장 들어가기</button></div>' +
      '</div>';
  }

  // ctx: { st, onFind(spot), onTry(), save() }
  function mount(ctx, opts) {
    var st = ctx.st, view = document.getElementById('hview'), world = document.getElementById('hworld');
    var me = document.getElementById('hme'), bub = document.getElementById('hbub'), dest = document.getElementById('hdest');
    var mini = document.getElementById('hmini'), msgEl = document.getElementById('hmsg'), modal = document.getElementById('hmodal');
    var gate = document.getElementById('hgate');
    var spotEls = world.querySelectorAll('.hs');
    var gold = seedOf(st.date + 'gold') % SPOTS.length;
    var pos = opts.pos || { x: 14.5, y: 43.5 }, route = [], arrive = null, busy = false;
    var cam = { x: 0, y: 0 }, follow = true, raf = 0, last = 0;

    function vw() { return view.clientWidth; } function vh() { return view.clientHeight; }
    function clampCam() {
      var m = 40;
      cam.x = Math.min(m, Math.max(vw() - W - m, cam.x));
      cam.y = Math.min(m, Math.max(vh() - H - m, cam.y));
    }
    function centerOn(x, y) { cam.x = vw() / 2 - x * C; cam.y = vh() * 0.55 - y * C; clampCam(); }
    function draw() {
      world.style.transform = 'translate3d(' + cam.x + 'px,' + cam.y + 'px,0)';
      me.style.transform = 'translate(' + (pos.x * C) + 'px,' + (pos.y * C) + 'px)';
      mini.style.left = (pos.x / COLS * 100) + '%'; mini.style.top = (pos.y / ROWS * 100) + '%';
    }
    function paintSpots() {
      for (var i = 0; i < spotEls.length; i++) {
        var s = SPOTS[i], el = spotEls[i], o = st.opened[s.id];
        var near = Math.hypot(s.ac + 0.5 - pos.x, s.ar + 0.5 - pos.y) <= SEE;
        el.className = 'hs' + (o ? (i === gold ? ' gold' : ' miss') : near ? ' near' : '');
        el.firstChild.textContent = o ? (i === gold ? '★' : '꽝') : '?';
      }
    }
    function say(t) { msgEl.textContent = t; msgEl.classList.toggle('show', !!t); }
    function dots() {
      var d = document.querySelectorAll('.hdots i');
      for (var i = 0; i < d.length; i++) d[i].className = i < st.tries ? 'on' : '';
    }

    function go(tc, tr, then) {
      if (busy) return;
      var p = path(pos.x, pos.y, tc, tr);
      if (!p.length && !(Math.floor(pos.x) === tc && Math.floor(pos.y) === tr)) { say('그쪽으로는 갈 수 없어요'); return; }
      route = p; arrive = then || null; follow = true;
      dest.style.left = (tc + 0.5) * C + 'px'; dest.style.top = (tr + 0.5) * C + 'px'; dest.className = 'hdest on';
      me.classList.add('walk');
      if (!route.length) done();
    }
    function done() {
      me.classList.remove('walk'); dest.className = 'hdest';
      opts.savePos(pos); paintSpots();
      var f = arrive; arrive = null; if (f) f();
    }
    function tick(t) {
      var dt = Math.min(0.12, (t - (last || t)) / 1000); last = t;
      if (route.length) {
        var tg = route[0], dx = tg.x - pos.x, dy = tg.y - pos.y, d = Math.hypot(dx, dy), step = SPEED * dt;
        if (d <= step) { pos.x = tg.x; pos.y = tg.y; route.shift(); if (!route.length) done(); }
        else { pos.x += dx / d * step; pos.y += dy / d * step; }
        if (dx < -0.01) me.classList.add('flip'); else if (dx > 0.01) me.classList.remove('flip');
        paintSpots();
      }
      if (follow) {
        var tx = vw() / 2 - pos.x * C, ty = vh() * 0.55 - pos.y * C, ox = cam.x, oy = cam.y;
        cam.x += (tx - cam.x) * Math.min(1, dt * 5); cam.y += (ty - cam.y) * Math.min(1, dt * 5); clampCam();
        if (!route.length && Math.abs(cam.x - ox) < 0.05 && Math.abs(cam.y - oy) < 0.05) follow = false;
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    function search(i) {
      var s = SPOTS[i];
      if (st.opened[s.id]) { say(s.label + '는 이미 살펴봤어요'); return; }
      if (st.found) { say('오늘 골드 태그는 이미 찾았어요! 내일 또 만나요'); return; }
      if (st.tries <= 0) { say('오늘 기회를 다 썼어요. 내일 다시 도전!'); return; }
      say('');
      go(s.ac, s.ar, function () {
        busy = true; me.classList.add('dig'); bub.classList.add('show');
        var el = spotEls[i]; el.classList.add('shake');
        setTimeout(function () {
          busy = false; me.classList.remove('dig'); bub.classList.remove('show'); el.classList.remove('shake');
          st.opened[s.id] = true; st.tries -= 1;
          var hit = i === gold;
          if (hit) { st.found = true; ctx.onFind(s); } else ctx.save();
          dots(); paintSpots(); reveal(hit, s);
        }, 1100);
      });
    }
    function hint(s) {
      var g = SPOTS[gold], d = Math.hypot(g.ac - s.ac, g.ar - s.ar);
      if (d <= 7) return ['hot', '아주 뜨거워요! 바로 근처 매대에 있어요'];
      if (d <= 15) return ['warm', '따뜻해요. 이 근처를 더 둘러보세요'];
      return ['cold', '차가워요. 매장 반대쪽으로 가 보세요'];
    }
    function reveal(hit, s) {
      var h;
      if (hit) {
        var conf = ''; for (var k = 0; k < 18; k++) conf += '<i style="--x:' + (Math.random() * 240 - 120) + 'px;--r:' + (Math.random() * 540) + 'deg;--d:' + (Math.random() * 0.4) + 's;background:' + ['#F26A1B', '#B8860B', '#FFD34D', '#2B2B2B'][k % 4] + '"></i>';
        h = '<div class="mcard2 win"><div class="conf">' + conf + '</div><div class="tag"><svg viewBox="0 0 120 70" width="150" height="88"><path d="M18 6h94a4 4 0 0 1 4 4v50a4 4 0 0 1-4 4H18L3 35z" fill="#D4A017" stroke="#7A5A00" stroke-width="3"/><circle cx="20" cy="35" r="6" fill="#FFF6DC" stroke="#7A5A00" stroke-width="2.5"/><text x="70" y="32" text-anchor="middle" font-size="15" font-weight="900" fill="#fff">GOLD</text><text x="70" y="50" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">TAG</text></svg></div>' +
          '<b class="big">골드 태그 발견!</b><div class="wpts">+500P 적립</div><p>실제 김포점 <b>' + s.label + '</b>에도 오늘의 골드 태그 상품이 있어요. 매장에서 찾으면 그 자리에서 초특가!</p>' +
          '<button class="btn" data-h="close">좋아요</button></div>';
      } else {
        var hi = hint(s);
        h = '<div class="mcard2 lose"><div class="stamp">꽝</div><b class="big">' + s.label + '엔 없었어요</b>' +
          (st.tries > 0 ? '<div class="hint ' + hi[0] + '">' + hi[1] + '</div><p>남은 기회 <b>' + st.tries + '번</b></p><button class="btn" data-h="close">다시 찾기</button>'
            : '<p>오늘 기회를 다 썼어요.<br>골드 태그는 <b>' + SPOTS[gold].label + '</b>에 있었어요. 내일 다시 도전!</p><button class="btn" data-h="close">확인</button>') + '</div>';
      }
      modal.innerHTML = h; modal.classList.add('show');
    }
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-h="close"]') || e.target === modal) modal.classList.remove('show'); });

    // 손가락: 끌면 둘러보기, 짧게 누르면 이동/살펴보기
    var drag = null;
    view.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.hmini')) return;
      drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, id: e.pointerId, t: e.target };
    });
    view.addEventListener('pointermove', function (e) {
      if (!drag || drag.id !== e.pointerId) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 8) { drag.moved = true; follow = false; try { view.setPointerCapture(e.pointerId); } catch (er) {} view.classList.add('grab'); }
      if (drag.moved) { cam.x = drag.cx + dx; cam.y = drag.cy + dy; clampCam(); }
    });
    function up(e) {
      if (!drag || drag.id !== e.pointerId) return;
      var d = drag; drag = null; view.classList.remove('grab');
      if (d.moved || busy) return;
      var sp = d.t.closest && d.t.closest('.hs');
      if (sp) { search(+sp.getAttribute('data-s')); return; }
      var rc = view.getBoundingClientRect();
      var wx = (e.clientX - rc.left - cam.x) / C, wy = (e.clientY - rc.top - cam.y) / C;
      var n = nearestFree(Math.floor(wx), Math.floor(wy));
      if (n) { say(''); go(n[0], n[1]); }
    }
    view.addEventListener('pointerup', up);
    view.addEventListener('pointercancel', function () { drag = null; view.classList.remove('grab'); });
    view.addEventListener('click', function (e) { e.preventDefault(); });

    document.querySelector('.hzs').addEventListener('click', function (e) {
      var z = e.target.closest('.hz'); if (!z || busy) return;
      var k = z.getAttribute('data-z'), list = SPOTS.filter(function (s) { return s.zone === k; });
      var s = list[0]; if (!s) return;
      say(BY[k].name + ' 코너로 가는 중…');
      go(s.ac, s.ar, function () { say(BY[k].name + ' 코너예요. 반짝이는 ? 자리를 눌러 뒤져 보세요'); });
    });

    function enter() {
      gate.classList.add('open');
      setTimeout(function () { gate.classList.add('gone'); }, 900);
      setTimeout(function () {
        gate.style.display = 'none';
        say(st.found ? '오늘 골드 태그는 이미 찾았어요! 지도는 자유롭게 둘러보세요' : st.tries <= 0 ? '오늘 기회를 다 썼어요. 내일 다시 도전!' : '반짝이는 ? 는 가까이 가야 보여요. 아래 코너 이름을 눌러도 이동해요');
      }, 1400);
      opts.entered();
    }
    if (opts.skipGate) gate.style.display = 'none';
    else document.getElementById('genter').addEventListener('click', enter);

    centerOn(pos.x, pos.y); draw(); paintSpots(); dots();
    if (opts.skipGate && st.found) say('오늘 골드 태그는 이미 찾았어요!');
    raf = requestAnimationFrame(tick);
    var ro = new ResizeObserver(function () { clampCam(); draw(); }); ro.observe(view);
    return function unmount() { cancelAnimationFrame(raf); ro.disconnect(); opts.savePos(pos); };
  }

  window.GBHunt = { html: html, mount: mount, TRIES: TRIES };
})();
