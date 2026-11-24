/* 굿바이마켓 — 골드 태그 찾기 (v27: 3D 매장 통로를 걸어가기)
   매장 배치도대로 매대·냉동고·벽을 3D로 세우고(면마다 매대 사진), 내 캐릭터 바로 뒤 카메라로 통로를 따라 걸어감.
   - 코너 이름/지도로 목적지를 고르면 길을 찾아 통로를 돌아 걸어감 (타닥 발소리)
   - 화면을 누른 채 끌면 직접 조종: 위로 끌면 앞으로, 옆으로 끌면 방향 돌리기
   - 매대 앞에 서면 [살펴보기] → 매대 사진에서 반짝이는 ? 를 누르면 골드 태그 또는 꽝 */
(function () {
  var IW = 1672, IH = 941, CELL = 20, COLS = Math.ceil(IW / CELL), ROWS = Math.ceil(IH / CELL);
  var TRIES = 5, SPEED = 150, TURN = 200, STEP_T = 0.26;      // 걷는 속도(단위/초), 도는 속도(도/초), 한 걸음(초)
  var EYE = 120, BACK = 260, PITCH = 12, PERSP = 520, CHAR_H = 64;  // 카메라 높이·뒤 거리·숙임, 캐릭터 키
  var START = { x: 835, z: 880 };

  // 코너: 서는 자리(ax, az)와 바라볼 방향(face: 0 북쪽/안쪽, -90 왼쪽, 90 오른쪽), 사진 비율
  var ZONES = [
    { id: 'frz', name: '냉동식품', ax: 790, az: 215, face: 0, ar: 1 },
    { id: 'dai', name: '유제품', ax: 316, az: 250, face: -90, ar: 1 },
    { id: 'chl', name: '냉장식품', ax: 316, az: 400, face: -90, ar: 1 },
    { id: 'sea', name: '조미식품', ax: 365, az: 492, face: 0, ar: 0.749 },
    { id: 'mea', name: '식사대용식품', ax: 496, az: 492, face: 0, ar: 0.749 },
    { id: 'liv', name: '생활용품', ax: 631, az: 492, face: 0, ar: 1 },
    { id: 'tis', name: '위생제지', ax: 763, az: 492, face: 0, ar: 1 },
    { id: 'per', name: '퍼스널케어', ax: 882, az: 492, face: 0, ar: 1 },
    { id: 'kit', name: '주방욕실', ax: 1006, az: 492, face: 0, ar: 1 },
    { id: 'hlt', name: '건강식품', ax: 1122, az: 492, face: 0, ar: 1 },
    { id: 'toy', name: '완구', ax: 1236, az: 492, face: 0, ar: 1 },
    { id: 'big', name: '대형가전', ax: 1275, az: 470, face: 90, ar: 1 },
    { id: 'sml', name: '소형가전', ax: 1290, az: 590, face: 90, ar: 1 },
    { id: 'frs', name: '신선식품', ax: 490, az: 590, face: -90, ar: 1 },
    { id: 'chk', name: '계산대', ax: 833, az: 610, face: -90, ar: 1 }
  ];
  var SPOT_SETS = [[[28, 34], [70, 48], [34, 63]], [[66, 28], [30, 48], [72, 64]], [[48, 40], [24, 62], [76, 30]]];
  function spotsOf(zi) { return SPOT_SETS[zi % 3]; }
  function seedOf(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }

  // 3D 매장 (배치도 좌표 x, z / 높이 h / 면 텍스처)
  var GON = ['sea', 'mea', 'liv', 'tis', 'per', 'kit', 'hlt', 'toy'];
  var GX = [[318, 412], [448, 544], [588, 674], [726, 800], [843, 922], [963, 1050], [1073, 1172], [1183, 1290]];
  var BOXES = [];
  GX.forEach(function (g, i) { BOXES.push({ x1: g[0], z1: 200, x2: g[1], z2: 458, h: 170, tex: GON[i], top: '#3A3A3A' }); });
  BOXES.push({ x1: 0, z1: 0, x2: IW, z2: 185, h: 190, tex: 'frz', only: 's' });                         // 냉동고 벽
  BOXES.push({ x1: 0, z1: 185, x2: 296, z2: 320, h: 180, tex: 'dai', only: 'e' });                        // 유제품 냉장고
  BOXES.push({ x1: 0, z1: 320, x2: 296, z2: 455, h: 180, tex: 'chl', only: 'e' });                        // 냉장식품
  BOXES.push({ x1: 30, z1: 478, x2: 462, z2: 700, h: 55, tex: 'frs', topTex: 'frs', side: '#A0703F' });  // 신선 매대 (낮음)
  BOXES.push({ x1: 1295, z1: 0, x2: IW, z2: 480, h: 190, tex: 'big', only: 'ws' });                       // 대형가전 유리방
  BOXES.push({ x1: 1315, z1: 480, x2: IW, z2: 700, h: 120, tex: 'sml', only: 'w' });                      // 소형가전 선반
  BOXES.push({ x1: 558, z1: 495, x2: 748, z2: 672, h: 75, tex: 'chk', side: '#2F2F2F', top: '#555' });    // 계산대
  BOXES.push({ x1: 918, z1: 495, x2: 1108, z2: 672, h: 75, tex: 'chk', side: '#2F2F2F', top: '#555' });
  // 바깥벽
  var WALLS3D = [
    { x1: 0, z1: 455, x2: 30, z2: 735, h: 220, color: '#EDE6DA', only: 'e' },
    { x1: 1600, z1: 700, x2: IW, z2: 735, h: 220, color: '#EDE6DA', only: 'w' },
    { x1: 0, z1: 735, x2: 680, z2: 760, h: 220, color: '#F26A1B', only: 'n' },
    { x1: 990, z1: 735, x2: IW, z2: 760, h: 220, color: '#F26A1B', only: 'n' }
  ];

  // 걸을 수 있는 칸
  var BLOCK = [
    [0, 0, IW, 185], [0, 185, 296, 455], [30, 478, 462, 700], [0, 455, 30, 941],
    [0, 735, 680, IH], [990, 735, IW, IH], [680, 905, 990, IH], [1600, 700, IW, 735],
    [1295, 0, IW, 480], [1315, 480, IW, 700], [558, 495, 748, 672], [918, 495, 1108, 672]
  ];
  GX.forEach(function (g) { BLOCK.push([g[0], 200, g[1], 458]); });
  var FREE = [];
  for (var r = 0; r < ROWS; r++) {
    FREE[r] = [];
    for (var c = 0; c < COLS; c++) {
      var x = c * CELL + CELL / 2, y = r * CELL + CELL / 2, ok = true;
      for (var i = 0; i < BLOCK.length; i++) { var w = BLOCK[i]; if (x >= w[0] - 6 && x < w[2] + 6 && y >= w[1] - 6 && y < w[3] + 6) { ok = false; break; } }
      FREE[r][c] = ok;
    }
  }
  function free(c, r) { return r >= 0 && r < ROWS && c >= 0 && c < COLS && FREE[r][c]; }
  function cellOf(x, z) { return [Math.floor(x / CELL), Math.floor(z / CELL)]; }
  function freeAt(x, z) { var c = cellOf(x, z); return free(c[0], c[1]); }
  function nearestFree(c, r) {
    for (var d = 0; d < 15; d++) for (var dc = -d; dc <= d; dc++) for (var dr = -d; dr <= d; dr++)
      if (Math.max(Math.abs(dc), Math.abs(dr)) === d && free(c + dc, r + dr)) return [c + dc, r + dr];
    return null;
  }
  function path(from, tx, tz) {
    var s = cellOf(from.x, from.z); if (!free(s[0], s[1])) s = nearestFree(s[0], s[1]) || s;
    var t = cellOf(tx, tz); if (!free(t[0], t[1])) t = nearestFree(t[0], t[1]);
    if (!t) return null;
    var key = function (c, r) { return r * COLS + c; }, prev = {}, q = [s], head = 0, found = false;
    prev[key(s[0], s[1])] = -1;
    var D = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    while (head < q.length) {
      var cur = q[head++];
      if (cur[0] === t[0] && cur[1] === t[1]) { found = true; break; }
      for (var i = 0; i < 8; i++) {
        var nc = cur[0] + D[i][0], nr = cur[1] + D[i][1], k = key(nc, nr);
        if (!free(nc, nr) || k in prev) continue;
        if (i > 3 && (!free(cur[0] + D[i][0], cur[1]) || !free(cur[0], cur[1] + D[i][1]))) continue;
        prev[k] = key(cur[0], cur[1]); q.push([nc, nr]);
      }
    }
    if (!found) return null;
    var pts = [], k = key(t[0], t[1]);
    while (k !== -1) { pts.unshift({ x: (k % COLS) * CELL + CELL / 2, z: Math.floor(k / COLS) * CELL + CELL / 2 }); k = prev[k]; }
    var out = [], a = from, i = 0;
    while (i < pts.length - 1) {
      var j = pts.length - 1;
      while (j > i + 1 && !clear(a, pts[j])) j--;
      out.push(pts[j]); a = pts[j]; i = j;
    }
    if (!out.length && pts.length) out.push(pts[pts.length - 1]);
    return out;
  }
  function clear(a, b) {
    var d = Math.hypot(b.x - a.x, b.z - a.z), n = Math.ceil(d / 5);
    for (var i = 0; i <= n; i++) {
      var x = a.x + (b.x - a.x) * i / n, z = a.z + (b.z - a.z) * i / n;
      for (var o = 0; o < 4; o++) if (!freeAt(x + (o & 1 ? 7 : -7), z + (o & 2 ? 7 : -7))) return false;
    }
    return true;
  }

  /* 소리 */
  var AC = null, noiseBuf = null;
  function audio() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
    if (AC && AC.state === 'suspended') AC.resume();
    return AC;
  }
  function tap(t, freq, vol) {
    var n = AC.createBufferSource(); n.buffer = noiseBuf;
    var f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.4;
    var g = AC.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    n.connect(f); f.connect(g); g.connect(AC.destination); n.start(t); n.stop(t + 0.08);
  }
  function footstep(left) {
    if (!AC || AC.state !== 'running') return;
    if (!noiseBuf) {
      noiseBuf = AC.createBuffer(1, Math.floor(AC.sampleRate * 0.1), AC.sampleRate);
      var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var t = AC.currentTime, p = left ? 1 : 1.12;
    tap(t, 1500 * p, 0.55); tap(t + 0.055, 2300 * p, 0.35);
  }
  function chime(win) {
    if (!AC || AC.state !== 'running') return;
    var notes = win ? [784, 988, 1175, 1568] : [392, 330];
    notes.forEach(function (fq, i) {
      var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * (win ? 0.1 : 0.16);
      o.type = win ? 'triangle' : 'sine'; o.frequency.value = fq;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 0.4);
    });
  }

  function sprite(av, dir, n) { return 'img/hunt/' + (av === 'm' ? 'm' : 'f') + '-' + dir + '-' + n + '.webp'; }

  /* 3D 면 만들기 */
  function face(x, y, z, w, h, rot, bg) {
    return '<i class="f3" style="width:' + w + 'px;height:' + h + 'px;transform:translate3d(' + x + 'px,' + y + 'px,' + z + 'px) ' + rot + ';' + bg + '"></i>';
  }
  function texBg(tex, len, h, shade) {
    var img = 'url(img/hunt/z-' + tex + '.webp)';
    var size = len / h > 1.25 ? 'auto 100%' : 'cover';
    return 'background-image:' + (shade ? 'linear-gradient(rgba(0,0,0,' + shade + '),rgba(0,0,0,' + shade + ')),' : '') + img + ';background-size:' + (shade ? '100% 100%,' : '') + size + ';background-position:center;background-repeat:' + (shade ? 'no-repeat,' : '') + 'repeat-x';
  }
  function boxHtml(b) {
    var h = b.h, wx = b.x2 - b.x1, wz = b.z2 - b.z1, out = '', want = b.only || 'nsewt';
    var col = function (c) { return 'background:' + c; };
    var side = function (len, shade) { return b.tex && !b.side ? texBg(b.tex, len, h, shade) : col(b.side || b.color || '#ddd'); };
    if (want.indexOf('s') >= 0) out += face(b.x1, -h, b.z2, wx, h, '', b.tex ? texBg(b.tex, wx, h, 0) : col(b.color));
    if (want.indexOf('n') >= 0) out += face(b.x2, -h, b.z1, wx, h, 'rotateY(180deg)', b.tex ? texBg(b.tex, wx, h, 0.12) : col(b.color));
    if (want.indexOf('w') >= 0) out += face(b.x1, -h, b.z1, wz, h, 'rotateY(-90deg)', b.only ? texBg(b.tex, wz, h, 0.05) : side(wz, 0.12));
    if (want.indexOf('e') >= 0) out += face(b.x2, -h, b.z2, wz, h, 'rotateY(90deg)', b.only ? (b.tex ? texBg(b.tex, wz, h, 0.05) : col(b.color)) : side(wz, 0.18));
    if (want.indexOf('t') >= 0 && !b.only) out += face(b.x1, -h, b.z1, wx, wz, 'rotateX(90deg)', b.topTex ? texBg(b.topTex, wx, wz, 0) : col(b.top || '#444'));
    return out;
  }
  function worldHtml() {
    var h = '';
    // 바닥 타일 (여러 장으로 나눠 카메라 근처에서도 깨지지 않게)
    var TW = 280, TD = 190;
    for (var x = 0; x < IW; x += TW) for (var z = 150; z < 940; z += TD) h += face(x, 0, z, TW, TD, 'rotateX(90deg)', '') .replace('class="f3"', 'class="f3 fl"');
    BOXES.forEach(function (b) { h += boxHtml(b); });
    WALLS3D.forEach(function (b) { h += boxHtml(b); });
    // 매장 간판 (입구 위, 안쪽에서 보이게)
    h += '<i class="f3 sign3" style="width:310px;height:44px;transform:translate3d(990px,-250px,736px) rotateY(180deg)">GOOD-BUY</i>';
    // 코너 이름표 (매대 위)
    ZONES.forEach(function (z) {
      var a = z.face * Math.PI / 180, lx = z.ax + Math.sin(a) * 40, lz = z.az - Math.cos(a) * 40;
      h += '<i class="f3 lab3" data-lz="' + z.id + '" style="transform:translate3d(' + (lx - 60) + 'px,-215px,' + lz + 'px) rotateY(' + (-z.face) + 'deg)"><b>' + z.name + '</b></i>';
    });
    return h;
  }

  function html(st, av, sound) {
    var dots = ''; for (var i = 0; i < TRIES; i++) dots += '<i class="' + (i < st.tries ? 'on' : '') + '"></i>';
    var chips = ZONES.map(function (z, i) { return '<button class="hz" data-z="' + i + '">' + z.name + '</button>'; }).join('');
    var pins = ZONES.map(function (z, i) { return '<button class="mp" data-z="' + i + '" style="left:' + (z.ax / IW * 100) + '%;top:' + (z.az / IH * 100) + '%">' + z.name + '</button>'; }).join('');
    var pick = ['f', 'm'].map(function (g) {
      return '<button class="gpick' + (av === g ? ' on' : '') + '" data-g="' + g + '"><img src="' + sprite(g, 'right', 1) + '" alt=""><span>' + (g === 'f' ? '여자' : '남자') + '</span></button>';
    }).join('');
    return '<div class="hunt">' +
      '<div class="htop"><button class="hback" data-a="huntExit" aria-label="보물찾기로 돌아가기"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<div class="ht"><b id="hwhere">굿바이마켓 김포점</b><small>골드 태그 찾기</small></div>' +
      '<button class="hsnd" id="hsnd" aria-label="소리 켜고 끄기">' + (sound ? '소리 켬' : '소리 끔') + '</button>' +
      '<div class="hdots" aria-label="남은 기회 ' + st.tries + '번">' + dots + '</div></div>' +
      '<div class="hview v3d" id="hview">' +
      '<div class="cam3" id="cam3" style="perspective:' + PERSP + 'px"><div class="w3" id="w3">' + worldHtml() + '</div></div>' +
      '<div class="hme" id="hme" role="img" aria-label="내 캐릭터"></div>' +
      '<button class="hlook" id="hlook"></button>' +
      '<div class="hpad" id="hpad"><i></i></div>' +
      '<button class="hmini" id="hmini" aria-label="매장 지도 보고 목적지 고르기"><img src="img/hunt/store-s.webp" alt=""><i id="hdot"></i><span>지도</span></button>' +
      '<div class="hmsg" id="hmsg"></div>' +
      '<div class="hscene3" id="hscene"></div>' +
      '<div class="hmapov" id="hmapov"><div class="mpbox"><div class="mphd"><b>어디로 걸어갈까요?</b><button data-mx="1">닫기</button></div><div class="mpimg"><img src="img/hunt/store.webp" alt="매장 전체">' + pins + '<i class="mpme" id="mpme"></i></div><p>코너를 누르면 지금 자리에서 통로를 따라 걸어가요</p></div></div>' +
      '</div>' +
      '<div class="hbot"><div class="hguide">어디로 갈까요? <span>코너 이름을 누르면 길을 따라 걸어가요 · 화면을 누른 채 끌면 직접 걸어요</span></div><div class="hzs">' + chips + '</div></div>' +
      '<div class="hmodal" id="hmodal"></div>' +
      '<div class="hgate" id="hgate"><div class="gtxt"><small>오늘의 보물찾기</small><b>매장 어딘가에<br>골드 태그가 숨어 있어요</b><p>기회는 하루 ' + TRIES + '번. 꽝이 나와도 힌트를 드려요.</p></div>' +
      '<div class="front"><div class="sign">GOOD-BUY</div><div class="wall"><div class="glass"><div class="dr l"></div><div class="dr r"></div></div></div></div>' +
      '<div class="gsel"><div class="gq">누구로 들어갈까요?</div><div class="gpicks">' + pick + '</div></div>' +
      '<button class="btn genter" id="genter">매장 들어가기</button></div>' +
      '</div>';
  }

  // ctx: { st, save, onFind, avatar, setAvatar, sound, setSound }  opts: { pos {x,z,yaw}, skipGate, savePos, entered }
  function mount(ctx, opts) {
    var st = ctx.st, av = ctx.avatar || 'f', soundOn = ctx.sound !== false;
    var $ = function (id) { return document.getElementById(id); };
    var view = $('hview'), w3 = $('w3'), me = $('hme'), look = $('hlook'), pad = $('hpad');
    var msgEl = $('hmsg'), modal = $('hmodal'), gate = $('hgate'), mapov = $('hmapov'), where = $('hwhere'), scene = $('hscene');
    var g = seedOf(st.date + 'gold'), goldZ = g % ZONES.length, goldK = Math.floor(g / ZONES.length) % 3;
    var P = opts.pos && opts.pos.z != null ? opts.pos : { x: START.x, z: START.z, yaw: 0 };
    var pos = { x: P.x, z: P.z }, yaw = P.yaw || 0, camB = BACK;
    var route = [], arrive = null, faceTo = null, busy = false, joy = null, shown = '', stepAcc = 0, frame = 1, stepLeft = false;
    var nearZ = -1, raf = 0, last = 0, moving = false, turning = 0, sceneZ = -1, destName = '';

    function preload() {
      var h = '';
      ['back', 'left', 'right'].forEach(function (d) { [1, 2].forEach(function (n) { h += '<img data-k="' + d + n + '" src="' + sprite(av, d, n) + '" alt="" draggable="false">'; }); });
      me.innerHTML = h; shown = '';
    }
    preload();
    function setSprite(k) {
      if (shown === k) return;
      var o = me.querySelector('img.on'); if (o) o.classList.remove('on');
      var m = me.querySelector('img[data-k="' + k + '"]'); if (m) m.classList.add('on');
      shown = k;
    }
    function say(t) { msgEl.textContent = t; msgEl.classList.toggle('show', !!t); }
    function dots() { var d = document.querySelectorAll('.hdots i'); for (var i = 0; i < d.length; i++) d[i].className = i < st.tries ? 'on' : ''; }
    function angDiff(a, b) { var d = (b - a) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; }

    // 카메라: 캐릭터 뒤 BACK 만큼, 벽에 막히면 당겨 옴
    function camera(dt) {
      var a = yaw * Math.PI / 180, sx = Math.sin(a), cz = Math.cos(a), want = BACK;
      for (var b = 30; b <= BACK; b += 10) {
        var x = pos.x - sx * b, z = pos.z + cz * b;
        if (x < 0 || x > IW || z < 0 || inBox(x, z)) { want = Math.max(110, b - 30); break; }
      }
      camB += (want - camB) * Math.min(1, dt * 6);
      var cx = pos.x - sx * camB, czp = pos.z + cz * camB;
      w3.style.transform = 'translateZ(' + PERSP + 'px) rotateX(' + (-PITCH) + 'deg) rotateY(' + yaw + 'deg) translate3d(' + (-cx) + 'px,' + EYE + 'px,' + (-czp) + 'px)';
      // 캐릭터 그림 위치·크기 (카메라 거리에 맞춰)
      var ph = PITCH * Math.PI / 180, yv = EYE * Math.cos(ph) - camB * Math.sin(ph), zv = EYE * Math.sin(ph) + camB * Math.cos(ph);
      var k = PERSP / zv, H = Math.min(view.clientHeight * 0.42, CHAR_H * 1.75 * k);
      me.style.width = me.style.height = H + 'px';
      me.style.marginLeft = (-H / 2) + 'px';
      me.style.top = (view.clientHeight / 2 + yv * k - H * 0.97) + 'px';
    }
    function inBox(x, z) {
      for (var i = 0; i < BLOCK.length; i++) { var w = BLOCK[i]; if (x >= w[0] && x < w[2] && z >= w[1] && z < w[3]) return true; }
      return false;
    }
    function minimap() {
      var l = (pos.x / IW * 100) + '%', t = (pos.z / IH * 100) + '%';
      var d = $('hdot'), m = $('mpme'); d.style.left = m.style.left = l; d.style.top = m.style.top = t;
    }
    function nearestZone() {
      var best = -1, bd = 75;
      for (var i = 0; i < ZONES.length; i++) { var z = ZONES[i], d = Math.hypot(z.ax - pos.x, z.az - pos.z); if (d < bd) { bd = d; best = i; } }
      return best;
    }
    function updNear() {
      var n = moving ? -1 : nearestZone();
      if (n === nearZ) return;
      nearZ = n;
      if (n >= 0) { look.innerHTML = '<b>?</b>' + ZONES[n].name + ' 매대 살펴보기'; look.classList.add('show'); where.textContent = ZONES[n].name + ' 코너'; }
      else { look.classList.remove('show'); where.textContent = '굿바이마켓 김포점'; }
    }

    function goTo(x, z, then, face) {
      var p = path(pos, x, z);
      if (!p) { say('그쪽으로는 갈 수 없어요'); return; }
      route = p; arrive = then || null; faceTo = face == null ? null : face;
    }
    function walkZone(zi) {
      if (busy) return;
      closeScene(); mapov.classList.remove('show');
      var z = ZONES[zi]; destName = z.name;
      say(z.name + ' 코너로 걸어가는 중…');
      goTo(z.ax, z.az, function () { say(''); destName = ''; openScene(zi); }, z.face);
    }

    function tick(t) {
      var dt = Math.min(0.1, (t - (last || t)) / 1000); last = t;
      var fwd = 0, turnRate = 0;
      if (!busy && sceneZ < 0) {
        if (joy && (Math.abs(joy.dx) > 6 || Math.abs(joy.dy) > 6)) {
          route = []; arrive = null; faceTo = null;
          turnRate = Math.max(-1, Math.min(1, joy.dx / 70)) * TURN * 0.6;
          fwd = Math.max(-0.5, Math.min(1, -joy.dy / 70));
        } else if (route.length) {
          var tg = route[0], dx = tg.x - pos.x, dz = tg.z - pos.z, d = Math.hypot(dx, dz);
          var want = Math.atan2(dx, -dz) * 180 / Math.PI, ad = angDiff(yaw, want);
          turnRate = Math.max(-TURN, Math.min(TURN, ad * 5));
          fwd = Math.abs(ad) < 35 ? 1 : 0.15;
          if (d < 6) { route.shift(); if (!route.length) fwd = 0; }
        } else if (faceTo != null) {
          var ad2 = angDiff(yaw, faceTo);
          if (Math.abs(ad2) < 2) { yaw = faceTo; faceTo = null; } else turnRate = Math.max(-TURN, Math.min(TURN, ad2 * 6));
        } else if (arrive) { var f = arrive; arrive = null; f(); }
      }
      yaw += turnRate * dt;
      if (fwd) {
        var a = yaw * Math.PI / 180, s = SPEED * fwd * dt, nx = pos.x + Math.sin(a) * s, nz = pos.z - Math.cos(a) * s;
        if (freeAt(nx, nz)) { pos.x = nx; pos.z = nz; }
        else if (freeAt(nx, pos.z)) pos.x = nx;
        else if (freeAt(pos.x, nz)) pos.z = nz;
      }
      var wasMoving = moving;
      moving = Math.abs(fwd) > 0.05 || Math.abs(turnRate) > 25;
      if (moving) {
        stepAcc += dt;
        if (stepAcc >= STEP_T) { stepAcc = 0; frame = frame === 1 ? 2 : 1; stepLeft = !stepLeft; if (soundOn) footstep(stepLeft); }
        var dir = turnRate < -60 ? 'left' : turnRate > 60 ? 'right' : 'back';
        setSprite(dir + frame); me.classList.add('walk');
      } else if (wasMoving) { setSprite('back1'); me.classList.remove('walk'); opts.savePos({ x: pos.x, z: pos.z, yaw: yaw }); }
      camera(dt); minimap(); updNear();
      raf = requestAnimationFrame(tick);
    }

    /* 손가락 조종 (누른 채 끌기) */
    view.addEventListener('pointerdown', function (e) {
      if (soundOn) audio();
      if (e.target.closest('.hlook, .hmini, .hmapov, .hscene3') || sceneZ >= 0 || busy) return;
      joy = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, id: e.pointerId };
      try { view.setPointerCapture(e.pointerId); } catch (er) {}
      var rc = view.getBoundingClientRect();
      pad.style.left = (e.clientX - rc.left) + 'px'; pad.style.top = (e.clientY - rc.top) + 'px'; pad.classList.add('show');
      say('');
    });
    view.addEventListener('pointermove', function (e) {
      if (!joy || joy.id !== e.pointerId) return;
      joy.dx = e.clientX - joy.x; joy.dy = e.clientY - joy.y;
      var m = Math.min(1, 46 / Math.max(1, Math.hypot(joy.dx, joy.dy)));
      pad.firstChild.style.transform = 'translate(' + joy.dx * m + 'px,' + joy.dy * m + 'px)';
    });
    function endJoy() { joy = null; pad.classList.remove('show'); pad.firstChild.style.transform = ''; }
    view.addEventListener('pointerup', endJoy);
    view.addEventListener('pointercancel', endJoy);
    look.addEventListener('click', function () { if (nearZ >= 0) { var z = ZONES[nearZ]; route = []; faceTo = z.face; arrive = function () { openScene(nearZ); }; } });

    /* 매대 앞 장면 */
    function openScene(zi) {
      var z = ZONES[zi]; sceneZ = zi;
      var vw = view.clientWidth, vh = view.clientHeight, H = vh * 1.02, W = H * z.ar;
      if (W < vw) { W = vw; H = W / z.ar; }
      var spots = spotsOf(zi).map(function (p, k) {
        var o = st.opened[z.id + ':' + k], hit = o && zi === goldZ && k === goldK;
        return '<button class="ss' + (hit ? ' gold' : o ? ' miss' : '') + '" data-k="' + k + '" style="left:' + p[0] + '%;top:' + p[1] + '%" aria-label="' + z.name + ' ' + (k + 1) + '번 자리 살펴보기"><b>' + (hit ? '★' : o ? '꽝' : '?') + '</b></button>';
      }).join('');
      scene.innerHTML = '<div class="vbox" style="width:' + W + 'px;height:' + H + 'px;margin-left:' + (-W / 2) + 'px;margin-top:' + (-H / 2) + 'px"><img src="img/hunt/z-' + z.id + '.webp" alt="' + z.name + ' 매대" draggable="false"><div class="spots show">' + spots + '</div></div>' +
        '<div class="sctop"><b>' + z.name + '</b><span>' + (st.found ? '오늘 골드 태그는 이미 찾았어요' : st.tries > 0 ? '반짝이는 ? 를 눌러 뒤져 보세요' : '오늘 기회를 다 썼어요') + '</span></div>' +
        '<img class="sme" src="' + sprite(av, 'back', 1) + '" alt="">' +
        '<button class="sback" data-sb="1">← 통로로 돌아가기</button>';
      scene.classList.add('show'); where.textContent = z.name + ' 코너';
    }
    function closeScene() { if (sceneZ < 0) return; scene.classList.remove('show'); sceneZ = -1; nearZ = -2; }
    scene.addEventListener('click', function (e) {
      if (e.target.closest('[data-sb]')) { closeScene(); return; }
      var b = e.target.closest('.ss'); if (b) search(+b.getAttribute('data-k'), b);
    });
    function sceneMsg(t) { var s = scene.querySelector('.sctop span'); if (s) s.textContent = t; }
    function search(k, el) {
      var zi = sceneZ, z = ZONES[zi], key = z.id + ':' + k;
      if (st.opened[key] || busy) return;
      if (st.found) { sceneMsg('오늘 골드 태그는 이미 찾았어요! 내일 또 만나요'); return; }
      if (st.tries <= 0) { sceneMsg('오늘 기회를 다 썼어요. 내일 다시 도전!'); return; }
      busy = true; el.classList.add('shake'); scene.classList.add('dig'); sceneMsg('뒤적뒤적…');
      if (soundOn) { audio(); footstep(true); setTimeout(function () { footstep(false); }, 300); setTimeout(function () { footstep(true); }, 600); }
      setTimeout(function () {
        busy = false; el.classList.remove('shake'); scene.classList.remove('dig');
        st.opened[key] = true; st.tries -= 1;
        var hit = zi === goldZ && k === goldK;
        if (hit) { st.found = true; ctx.onFind(); } else ctx.save();
        if (soundOn) chime(hit);
        el.className = 'ss' + (hit ? ' gold' : ' miss'); el.firstChild.textContent = hit ? '★' : '꽝';
        sceneMsg(hit ? '골드 태그를 찾았어요!' : '여긴 없었어요');
        dots(); reveal(hit, zi, k);
      }, 1000);
    }
    function hint(zi) {
      if (zi === goldZ) return ['hot', '아주 뜨거워요! 바로 이 매대에 있어요'];
      var a = ZONES[zi], b = ZONES[goldZ], d = Math.hypot(a.ax - b.ax, a.az - b.az);
      if (d <= 280) return ['hot', '뜨거워요! 바로 옆 코너를 살펴보세요'];
      if (d <= 600) return ['warm', '따뜻해요. 이 근처를 더 둘러보세요'];
      return ['cold', '차가워요. 매장 반대쪽으로 가 보세요'];
    }
    function reveal(hit, zi, k) {
      var z = ZONES[zi], h;
      if (hit) {
        var conf = ''; for (var i = 0; i < 18; i++) conf += '<i style="--x:' + (Math.random() * 240 - 120) + 'px;--r:' + (Math.random() * 540) + 'deg;--d:' + (Math.random() * 0.4) + 's;background:' + ['#F26A1B', '#B8860B', '#FFD34D', '#2B2B2B'][i % 4] + '"></i>';
        h = '<div class="mcard2 win"><div class="conf">' + conf + '</div><div class="tag"><svg viewBox="0 0 120 70" width="150" height="88"><path d="M18 6h94a4 4 0 0 1 4 4v50a4 4 0 0 1-4 4H18L3 35z" fill="#D4A017" stroke="#7A5A00" stroke-width="3"/><circle cx="20" cy="35" r="6" fill="#FFF6DC" stroke="#7A5A00" stroke-width="2.5"/><text x="70" y="32" text-anchor="middle" font-size="15" font-weight="900" fill="#fff">GOLD</text><text x="70" y="50" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">TAG</text></svg></div>' +
          '<b class="big">골드 태그 발견!</b><div class="wpts">+500P 적립</div><p>실제 김포점 <b>' + z.name + '</b> 코너에도 오늘의 골드 태그 상품이 있어요. 매장에서 찾으면 그 자리에서 초특가!</p>' +
          '<button class="btn" data-h="close">좋아요</button></div>';
      } else {
        var hi = hint(zi);
        h = '<div class="mcard2 lose"><div class="stamp">꽝</div><b class="big">' + z.name + ' ' + (k + 1) + '번 자리엔 없었어요</b>' +
          (st.tries > 0 ? '<div class="hint ' + hi[0] + '">' + hi[1] + '</div><p>남은 기회 <b>' + st.tries + '번</b></p><button class="btn" data-h="close">다시 찾기</button>'
            : '<p>오늘 기회를 다 썼어요.<br>골드 태그는 <b>' + ZONES[goldZ].name + '</b> 코너에 있었어요. 내일 다시 도전!</p><button class="btn" data-h="close">확인</button>') + '</div>';
      }
      modal.innerHTML = h; modal.classList.add('show');
    }
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-h="close"]') || e.target === modal) modal.classList.remove('show'); });

    view.addEventListener('click', function (e) {
      if (e.target.closest('#hmini')) { mapov.classList.add('show'); return; }
      if (e.target.closest('[data-mx]') || e.target === mapov) { mapov.classList.remove('show'); return; }
      var mp = e.target.closest('.mp'); if (mp) { if (soundOn) audio(); walkZone(+mp.getAttribute('data-z')); }
    });
    document.querySelector('.hzs').addEventListener('click', function (e) {
      var z = e.target.closest('.hz'); if (!z) return;
      if (soundOn) audio(); walkZone(+z.getAttribute('data-z'));
    });
    $('hsnd').addEventListener('click', function () {
      soundOn = !soundOn; ctx.setSound(soundOn); this.textContent = soundOn ? '소리 켬' : '소리 끔';
      if (soundOn) { audio(); footstep(true); }
    });

    // 입구: 캐릭터 고르기 → 문 열림 → 걸어 들어감
    gate.addEventListener('click', function (e) {
      var b = e.target.closest('.gpick'); if (!b) return;
      av = b.getAttribute('data-g'); ctx.setAvatar(av);
      var all = gate.querySelectorAll('.gpick'); for (var i = 0; i < all.length; i++) all[i].classList.toggle('on', all[i] === b);
      preload(); setSprite('back1');
    });
    function enter() {
      if (soundOn) audio();
      gate.classList.add('open');
      setTimeout(function () { gate.classList.add('gone'); }, 900);
      setTimeout(function () {
        gate.style.display = 'none';
        say(st.found ? '오늘 골드 태그는 이미 찾았어요! 매장은 자유롭게 둘러보세요' : st.tries <= 0 ? '오늘 기회를 다 썼어요. 내일 다시 도전!' : '아래 코너 이름을 누르거나, 화면을 누른 채 끌어서 걸어 보세요');
        if (!opts.pos) goTo(835, 715);
      }, 1300);
      opts.entered();
    }
    if (opts.skipGate) gate.style.display = 'none';
    else $('genter').addEventListener('click', enter);

    setSprite('back1'); dots(); camera(1); minimap();
    raf = requestAnimationFrame(tick);
    return function unmount() { cancelAnimationFrame(raf); opts.savePos({ x: pos.x, z: pos.z, yaw: yaw }); };
  }

  window.GBHunt = { html: html, mount: mount, TRIES: TRIES, ZONES: ZONES };
})();
