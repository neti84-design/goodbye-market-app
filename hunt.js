/* 굿바이마켓 — 골드 태그 찾기 (v28: three.js 3D 매장)
   실제 3D 엔진(three.js)으로 매장을 세움: 천장 조명·타일 바닥·벽·매대(코너 사진)·코너 간판.
   내 캐릭터는 매장 바닥에 서 있고, 카메라가 뒤에서 부드럽게 따라감.
   - 코너 이름/지도 → 길을 찾아 곡선으로 걸어감 (타닥 발소리)
   - 화면을 누른 채 끌면 직접 조종 (위: 앞으로, 옆: 방향)
   - 매대 앞에 서면 [살펴보기] → 매대 사진의 ? → 골드 태그 또는 꽝 */
(function () {
  var THREE_URL = 'vendor/three.min.js';
  var IW = 1672, IH = 941, CELL = 20, COLS = Math.ceil(IW / CELL), ROWS = Math.ceil(IH / CELL);
  var U = 0.018;                          // 배치도 1px = 1.8cm
  var TRIES = 5, SPEED = 2.4, TURN = 150; // 걷는 속도(m/초), 도는 속도(도/초)
  var START = { x: 835, z: 880 };

  var ZONES = [
    { id: 'frz', name: '냉동식품', ax: 790, az: 208, face: 0, ar: 1 },
    { id: 'dai', name: '유제품', ax: 290, az: 250, face: -90, keep: 1, ar: 1 },
    { id: 'chl', name: '냉장식품', ax: 290, az: 400, face: -90, keep: 1, ar: 1 },
    { id: 'sea', name: '조미식품', ax: 430, az: 400, face: 0, ar: 0.749 },
    { id: 'mea', name: '식사대용식품', ax: 563, az: 400, face: 0, ar: 0.749 },
    { id: 'liv', name: '생활용품', ax: 631, az: 500, face: 0, ar: 1 },
    { id: 'tis', name: '위생제지', ax: 763, az: 500, face: 0, ar: 1 },
    { id: 'per', name: '퍼스널케어', ax: 882, az: 500, face: 0, ar: 1 },
    { id: 'kit', name: '주방욕실', ax: 1006, az: 500, face: 0, ar: 1 },
    { id: 'hlt', name: '건강식품', ax: 1122, az: 500, face: 0, ar: 1 },
    { id: 'toy', name: '완구', ax: 1236, az: 500, face: 0, ar: 1 },
    { id: 'big', name: '대형가전', ax: 1268, az: 470, face: 90, keep: 1, ar: 1 },
    { id: 'sml', name: '소형가전', ax: 1285, az: 590, face: 90, keep: 1, ar: 1 },
    { id: 'frs', name: '신선식품', ax: 495, az: 590, face: -90, keep: 1, ar: 1 },
    { id: 'chk', name: '계산대', ax: 833, az: 610, face: -90, keep: 1, ar: 1 }
  ];
  var ZI = {}; ZONES.forEach(function (z, i) { ZI[z.id] = i; });
  // 사진에서 매대 부분만 (위 간판·아래 바닥 잘라냄): [위, 아래] 비율, 사진 가로/세로
  var CROP = { mea: [0.08, 1, 0.749], sea: [0.08, 1, 0.749], chk: [0.25, 0.85, 1], frs: [0.18, 0.95, 1], big: [0.1, 0.9, 1] };
  function crop(id) { return CROP[id] || [0.14, 0.93, 1]; }
  var SPOT_SETS = [[[28, 34], [70, 48], [34, 63]], [[66, 28], [30, 48], [72, 64]], [[48, 40], [24, 62], [76, 30]]];
  function spotsOf(zi) { return SPOT_SETS[zi % 3]; }
  function seedOf(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }

  // 매장 배치 (배치도 px): 막힌 곳 + 3D 물건
  var GON = ['sea', 'mea', 'liv', 'tis', 'per', 'kit', 'hlt', 'toy'];
  var GX = [365, 496, 631, 763, 882, 1006, 1122, 1236].map(function (c) { return [c - 26, c + 26]; }); // 매대를 얇게 해서 통로를 넓힘
  var BLOCK = [
    [0, 0, IW, 185], [0, 185, 240, 455], [30, 478, 462, 700], [0, 455, 30, 941],
    [0, 735, 680, IH], [990, 735, IW, IH], [680, 905, 990, IH], [1600, 700, IW, 735],
    [1295, 0, IW, 480], [1315, 480, IW, 700], [558, 495, 748, 672], [918, 495, 1108, 672]
  ];
  GX.forEach(function (g) { BLOCK.push([g[0], 232, g[1], 458]); });
  var FREE = [];
  for (var r = 0; r < ROWS; r++) {
    FREE[r] = [];
    for (var c = 0; c < COLS; c++) {
      var ok = clearance(c*CELL+CELL/2,r*CELL+CELL/2,19);
      FREE[r][c] = ok;
    }
  }
  function free(c, r) { return r >= 0 && r < ROWS && c >= 0 && c < COLS && FREE[r][c]; }
  function cellOf(x, z) { return [Math.floor(x / CELL), Math.floor(z / CELL)]; }
  var BODY_RADIUS = 19;
  function clearance(x,z,radius){
    if(x<radius||z<radius||x>IW-radius||z>IH-radius)return false;
    return !BLOCK.some(function(b){
      var dx=Math.max(b[0]-x,0,x-b[2]), dz=Math.max(b[1]-z,0,z-b[3]);
      return dx*dx+dz*dz < radius*radius;
    });
  }
  function freeAt(x,z){return clearance(x,z,BODY_RADIUS);}
  function nearestFree(c, r) {
    for (var d = 0; d < 15; d++) for (var dc = -d; dc <= d; dc++) for (var dr = -d; dr <= d; dr++)
      if (Math.max(Math.abs(dc), Math.abs(dr)) === d && free(c + dc, r + dr)) return [c + dc, r + dr];
    return null;
  }
  function clear(a, b) {
    var n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/3));
    for(var i=0;i<=n;i++) if(!freeAt(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;
    return true;
  }
  // 길 찾기 → 곧게 편 꺾은선 → 모퉁이를 둥글게 (곡선 점들)
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
    var poly = [{ x: from.x, z: from.z }], a = from, i = 0;
    while (i < pts.length - 1) {
      var j = pts.length - 1;
      while (j > i + 1 && !clear(a, pts[j])) j--;
      poly.push(pts[j]); a = pts[j]; i = j;
    }
    if (poly.length === 1 && pts.length) poly.push(pts[pts.length - 1]);
    var out=poly.slice(1);
    return out;
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
    tap(t, 1500 * p, 0.5); tap(t + 0.055, 2300 * p, 0.32);
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
  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    var s = document.createElement('script'); s.src = THREE_URL; s.onload = function () { cb(); };
    s.onerror = function () { cb(new Error('3D 엔진을 불러오지 못했어요')); };
    document.head.appendChild(s);
  }

  function html(st, av, sound) {
    var dots = ''; for (var i = 0; i < TRIES; i++) dots += '<i class="' + (i < st.tries ? 'on' : '') + '"></i>';
    var chips = ZONES.map(function (z, i) { return '<button class="hz" data-z="' + i + '">' + z.name + '</button>'; }).join('');
    var pins = ZONES.map(function (z, i) { return '<button class="mp" data-z="' + i + '" style="left:' + (z.ax / IW * 100) + '%;top:' + (z.az / IH * 100) + '%">' + z.name + '</button>'; }).join('');
    var pick = ['f', 'm'].map(function (g) {
      return '<button class="gpick' + (av === g ? ' on' : '') + '" data-g="' + g + '"><img src="' + sprite(g, 'back', 1) + '" alt=""><span>' + (g === 'f' ? '여자' : '남자') + '</span></button>';
    }).join('');
    return '<div class="hunt">' +
      '<div class="htop"><button class="hback" data-a="huntExit" aria-label="보물찾기로 돌아가기"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<div class="ht"><b id="hwhere">굿바이마켓 김포점</b><small>골드 태그 찾기</small></div>' +
      '<button class="hsnd" id="hsnd" aria-label="소리 켜고 끄기">' + (sound ? '소리 켬' : '소리 끔') + '</button>' +
      '<div class="hdots" aria-label="남은 기회 ' + st.tries + '번">' + dots + '</div></div>' +
      '<div class="hview v3" id="hview"><canvas id="hcv"></canvas>' +
      '<div class="hload" id="hload">매장 불을 켜는 중…</div>' +
      '<button class="hlook" id="hlook"></button>' +
      '<div class="hpad" id="hpad"><i></i></div>' +
      '<button class="hmini" id="hmini" aria-label="매장 지도 보고 목적지 고르기"><img src="img/hunt/store-s.webp" alt=""><i id="hdot"></i><span>지도</span></button>' +
      '<div class="hmsg" id="hmsg"></div>' +
      '<div class="hscene3" id="hscene"></div>' +
      '<div class="hmapov" id="hmapov"><div class="mpbox"><div class="mphd"><b>어디로 걸어갈까요?</b><button data-mx="1">닫기</button></div><div class="mpimg"><img src="img/hunt/store.webp" alt="매장 전체">' + pins + '<i class="mpme" id="mpme"></i></div><p>코너를 누르면 지금 자리에서 통로를 따라 걸어가요</p></div></div>' +
      '</div>' +
      '<div class="hbot"><div class="hguide">어디로 갈까요? <span>바닥 톡 · 왼쪽 드래그로 걷기 · 오른쪽 드래그로 둘러보기</span></div><div class="hzs">' + chips + '</div></div>' +
      '<div class="hmodal" id="hmodal"></div>' +
      '<div class="hgate" id="hgate"><div class="gtxt"><small>오늘의 보물찾기</small><b>매장 어딘가에<br>골드 태그가 숨어 있어요</b><p>기회는 하루 ' + TRIES + '번. 꽝이 나와도 힌트를 드려요.</p></div>' +
      '<div class="front"><div class="sign">GOOD-BUY</div><div class="wall"><div class="glass"><div class="dr l"></div><div class="dr r"></div></div></div></div>' +
      '<div class="gsel"><div class="gq">누구로 들어갈까요?</div><div class="gpicks">' + pick + '</div></div>' +
      '<button class="btn genter" id="genter">매장 들어가기</button></div>' +
      '</div>';
  }

  /* ---------- 3D 매장 짓기 ---------- */
  function W(x) { return (x - IW / 2) * U; }
  function Wz(z) { return (z - IH / 2) * U; }
  function build(T, scene) {
    var metal = new T.MeshStandardMaterial({ color: 0x3b3b3e, roughness: 0.5, metalness: 0.3 });
    var white = new T.MeshStandardMaterial({ color: 0xf1ece4, roughness: 0.95 });
    var orange = new T.MeshStandardMaterial({ color: 0xf26a1b, roughness: 0.7 });
    function box(x1, z1, x2, z2, h, mats, y0) {
      var w = (x2 - x1) * U, d = (z2 - z1) * U;
      var m = new T.Mesh(new T.BoxGeometry(w, h, d), mats);
      m.position.set(W((x1 + x2) / 2), (y0 || 0) + h / 2, Wz((z1 + z2) / 2));
      scene.add(m); return m;
    }
    // 바닥 타일
    var cv = document.createElement('canvas'); cv.width = cv.height = 256;
    var g = cv.getContext('2d'); g.fillStyle = '#efe6d8'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#e8dece'; g.fillRect(0, 0, 128, 128); g.fillRect(128, 128, 128, 128);
    g.strokeStyle = 'rgba(140,120,95,.35)'; g.lineWidth = 3; g.strokeRect(0, 0, 256, 256); g.beginPath(); g.moveTo(128, 0); g.lineTo(128, 256); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke();
    var ft = new T.CanvasTexture(cv); ft.wrapS = ft.wrapT = T.RepeatWrapping; ft.repeat.set(IW * U / 1.2, IH * U / 1.2); ft.encoding = T.sRGBEncoding; ft.anisotropy = 4;
    var floor = new T.Mesh(new T.PlaneGeometry(IW * U, IH * U + 4), new T.MeshStandardMaterial({ map: ft, roughness: 0.35, metalness: 0.05 }));
    floor.name = 'walkable-floor'; floor.rotation.x = -Math.PI / 2; floor.position.z = 2; scene.add(floor);
    // 천장 + 조명 줄
    var CEIL = 4.2;
    var ceil = new T.Mesh(new T.PlaneGeometry(IW * U, IH * U + 4), new T.MeshStandardMaterial({ color: 0xe9e6e0, roughness: 1 }));
    ceil.rotation.x = Math.PI / 2; ceil.position.set(0, CEIL, 2); scene.add(ceil);
    var lamp = new T.MeshBasicMaterial({ color: 0xfffbf0 });
    for (var lx = 260; lx < 1300; lx += 125) for (var lz = 230; lz < 720; lz += 170) {
      var lp = new T.Mesh(new T.PlaneGeometry(0.35, 1.8), lamp); lp.rotation.x = Math.PI / 2; lp.position.set(W(lx), CEIL - 0.01, Wz(lz)); scene.add(lp);
    }
    // 벽
    box(0, 0, IW, 20, CEIL, white).position.z = Wz(-10);
    box(0, 185, 20, 760, CEIL, white);
    box(IW - 20, 0, IW, 760, CEIL, white);
    box(0, 740, 680, 760, CEIL, orange); box(990, 740, IW, 760, CEIL, orange);
    box(680, 740, 990, 760, CEIL - 2.6, orange, 2.6);
    // 입구 유리문 (밖이 밝게)
    var glass = new T.Mesh(new T.PlaneGeometry(310 * U, 2.6), new T.MeshBasicMaterial({ color: 0xdcecf4 }));
    glass.position.set(W(835), 1.3, Wz(760)); glass.rotation.y = Math.PI; scene.add(glass);
    // Reuse geometry and materials across the stocked store. Coordinates below are in map units.
    var shapes = {
      cube: new T.BoxGeometry(1,1,1),
      round: new T.SphereGeometry(0.5,12,9),
      can: new T.CylinderGeometry(0.5,0.5,1,14),
      cone: new T.ConeGeometry(0.5,1,12)
    };
    var batches = {}, transform = new T.Object3D();
    function item(shape,color,x,y,z,w,h,d,tilt,spin) {
      var key=shape+'-'+color;
      if (!batches[key]) batches[key]={shape:shape,color:color,matrices:[]};
      transform.position.set(W(x),y,Wz(z));
      transform.scale.set(w,h,d);
      transform.rotation.set(0,spin||0,tilt||0);
      transform.updateMatrix();
      batches[key].matrices.push(transform.matrix.clone());
    }
    var ivory=0xece2cd, steel=0x59615d, wood=0xa77545;
    var colors=[0xcc3127,0xffab21,0x189d82,0xffcc48,0x367ac5,0xd55579];
    function product(id,x,y,z,n) {
      var c=colors[n % colors.length], w=0.24,h=0.30;
      if (id==='sea'||id==='per'||id==='liv'||id==='hlt') {
        var jar=id==='sea' && n%3===0;
        w=jar?0.30:0.18; h=jar?0.17:0.26;
        var body=jar?'cube':'can';
        item(body,jar?0xa33824:c,x,y+h/2,z,w,h,w);
        item(body,ivory,x,y+h*0.5,z,w*1.02,h*0.36,w*1.02);
        item(body,jar?0x882c1b:steel,x,y+h+0.025,z,w*(jar?1.02:0.58),0.05,w*(jar?1.02:0.58));
      } else if(id==='tis'||id==='dai'||(id==='mea'&&n%3===0)){
        item('can',id==='dai'?ivory:0xf6f1dd,x,y+0.10,z,0.23,0.20,0.23);
        item('can',id==='tis'?0xbca991:c,x,y+0.202,z,id==='tis'?0.06:0.24,0.012,id==='tis'?0.06:0.24);
      } else if(id==='kit'){
        item('can',steel,x,y+0.055,z,0.29,0.11,0.29);
        item('cube',0x534237,x,y+0.11,z+8,0.055,0.045,0.16);
      } else {
        item('cube',c,x,y+h/2,z,w,h,0.18,0,(n%3-1)*0.075);
        item('cube',ivory,x,y+0.11,z,w*1.015,0.075,0.185);
        if(id==='toy')item('round',0xe3a94c,x,y+0.32,z,0.17,0.15,0.15);
      }
    }
    function board(x,y,z,w,h,d,c){item('cube',c,x,y,z,w,h,d)}
    GX.forEach(function(gx,i){
      var x=(gx[0]+gx[1])/2;
      var accent = colors[i % colors.length];
      board(x,0.79,345,0.07,1.58,4.06,0xa77a51);
      for(var l=0;l<4;l++){
        var y=0.12+l*0.41;
        board(x,y,345,0.93,0.055,4.08,ivory);
        for(var side of [-1,1]){
          board(x+side*25,y,345,0.025,0.04,4.08,accent);
          for(var j=0;j<13;j++)product(GON[i],x+side*14,y+0.028,242+j*17,l*13+j);
        }
      }
    });
    // Back-wall cold cases have recessed shelves, divider posts and packages.
    board(655,1.05,145,22.9,2.1,0.12,steel);
    for(var bay=0;bay<15;bay++){
      var bx=65+bay*84;
      board(bx-40,1.03,164,0.045,2.06,0.66,steel);
      for(var l=0;l<4;l++){
        var y=0.13+l*0.47;
        board(bx,y,164,1.46,0.05,0.65,ivory);
        for(var j=0;j<5;j++) product('frz',bx-30+j*15,y+0.025,170,j+bay+l);
      }
    }
    for(var sideBay=0;sideBay<6;sideBay++){
      var z=210+sideBay*44;
      board(203,0.98,z,0.08,1.96,0.79,steel);
      for(var l=0;l<4;l++){
        var y=0.12+l*0.43;
        board(221,y,z,0.63,0.045,0.79,ivory);
        for(var j=0;j<3;j++)product(sideBay<3?'dai':'chl',226,y+0.023,z-13+j*13,sideBay+l+j);
      }
    }
    // Full-size appliances, inset doors and contrasting controls face the aisle.
    for(var j=0;j<8;j++){
      var z=55+j*54,washer=j%2===0,h=washer?1.05:1.93;
      board(1330,h/2,z,1.03,h,0.89,0xd2d6d4);
      if(washer){item('round',steel,1301,0.46,z,0.065,0.63,0.63);item('round',0x293f49,1299,0.46,z,0.06,0.49,0.49);}
      board(1301,h-0.19,z+13,0.055,0.15,0.20,steel);
    }
    board(1348,0.75,590,1.06,0.10,3.92,wood);
    for(var j=0;j<8;j++){var z=501+j*25;item('round',j%2?ivory:steel,1340,1.03,z,0.42,0.45,0.38);board(1340,1.26,z,0.17,0.05,0.12,steel);}
    // Shallow wooden bins with individual fruit, stems and overlapping leafy greens.
    for(var r=0;r<3;r++)for(var c=0;c<6;c++){
      var x=69+c*71,z=516+r*73;
      board(x,0.35,z,1.22,0.68,1.26,wood);
      for(var side of [-1,1]){
        board(x+side*33,0.76,z,0.06,0.18,1.25,0xbd905c);
        board(x,0.76,z+side*34,1.22,0.18,0.06,0xbd905c);
      }
      var kind=(r*2+c)%6, palette=[0xa93c30,0xe99123,0x8aac43,0xd9bc69,0x528345,0x386b40];
      for(var layer=0;layer<2;layer++){
        var count=4-layer;
        for(var u=0;u<count;u++)for(var v=0;v<count;v++){
          var px=x+(u-(count-1)/2)*15,pz=z+(v-(count-1)/2)*15;
          var py=0.82+layer*0.18, green=kind>=4;
          item('round',palette[kind],px,py,pz,0.255,green?0.32:0.25,0.25);
          if(green){for(var a=0;a<3;a++)item('round',a===1?0x77a34e:0x507e41,px+(a-1)*4,py+0.06,pz,0.12,0.29,0.19,(1-a)*0.5);}
          else if(kind===0||kind===2)item('can',0x654631,px,py+0.14,pz,0.019,0.06,0.019,0.13);
        }
      }
    }
    [[558,748],[918,1108]].forEach(function(cx){
      var x=(cx[0]+cx[1])/2;
      board(x,0.45,584,(cx[1]-cx[0])*U,0.90,3.12,steel);
      board(x,0.93,584,3.43,0.08,3.16,ivory);
      board(x,0.99,596,1.24,0.035,1.66,0x343837);
      board(x,1.22,533,0.10,0.49,0.12,steel);
      board(x,1.52,533,0.64,0.41,0.07,0x253537);
    });
    Object.keys(batches).forEach(function(key){
      var batch=batches[key], mesh=new T.InstancedMesh(shapes[batch.shape],
        new T.MeshStandardMaterial({color:batch.color,roughness:0.68}),batch.matrices.length);
      batch.matrices.forEach(function(matrix,i){mesh.setMatrixAt(i,matrix)});
      scene.add(mesh);
    });
    // 코너 간판 (주황 판에 이름)
    ZONES.forEach(function (z) {
      var c2 = document.createElement('canvas'); c2.width = 512; c2.height = 128;
      var q = c2.getContext('2d'); q.fillStyle = '#F26A1B'; q.fillRect(0, 0, 512, 128);
      q.fillStyle = '#fff'; q.font = '900 64px "Malgun Gothic","Apple SD Gothic Neo",sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(z.name, 256, 68);
      var tx = new T.CanvasTexture(c2); tx.encoding = T.sRGBEncoding;
      var sg = new T.Mesh(new T.PlaneGeometry(1.3, 0.33), new T.MeshBasicMaterial({ map: tx, side: T.DoubleSide }));
      var a = z.face * Math.PI / 180, dd = z.face === 0 ? 50 : 30;
      sg.position.set(W(z.ax + Math.sin(a) * dd), 2.55, Wz(z.az - Math.cos(a) * dd));
      sg.rotation.y = -a; scene.add(sg);
    });
    // 조명
    scene.add(new T.HemisphereLight(0xfff3dc, 0xb89e76, 0.85));
    var sun = new T.DirectionalLight(0xfff2dc, 0.78); sun.position.set(3, 10, 6); scene.add(sun);
    scene.add(new T.AmbientLight(0xffffff, 0.25));
    scene.fog = new T.Fog(0xf4e8d6, 23, 43);
    scene.background = new T.Color(0xe9e4dc);
  }

  // ctx: { st, save, onFind, avatar, setAvatar, sound, setSound }  opts: { pos {x,z,yaw}, skipGate, savePos, entered }
  function mount(ctx, opts) {
    var st = ctx.st, av = ctx.avatar || 'f', soundOn = ctx.sound !== false, alive = true;
    var $ = function (id) { return document.getElementById(id); };
    var view = $('hview'), cv = $('hcv'), look = $('hlook'), pad = $('hpad');
    var msgEl = $('hmsg'), modal = $('hmodal'), gate = $('hgate'), mapov = $('hmapov'), where = $('hwhere'), scn = $('hscene');
    var g = seedOf(st.date + 'gold'), goldZ = g % ZONES.length, goldK = Math.floor(g / ZONES.length) % 3;
    var P = opts.pos && opts.pos.z != null ? opts.pos : { x: START.x, z: START.z, yaw: 0 };
    var pos = { x: P.x, z: P.z }, yaw = P.yaw || 0, speed = 0;
    if(!freeAt(pos.x,pos.z)){var safe=nearestFree(Math.floor(pos.x/CELL),Math.floor(pos.z/CELL));pos=safe?{x:(safe[0]+0.5)*CELL,z:(safe[1]+0.5)*CELL}:{x:START.x,z:START.z};}
    var route = [], arrive = null, faceTo = null, busy = false, joy = null, nearZ = -1, sceneZ = -1;
    var T, renderer, scene, cam, me, meMat, shadow, frames = {}, frame = 1, stepAcc = 0, stepLeft = false, phase = 0, cameraDistance = 3.1, raf = 0, last = 0;

    function say(t) { msgEl.textContent = t; msgEl.classList.toggle('show', !!t); }
    function dots() { var d = document.querySelectorAll('.hdots i'); for (var i = 0; i < d.length; i++) d[i].className = i < st.tries ? 'on' : ''; }
    function angDiff(a, b) { var d = (b - a) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; }
    function minimap() {
      var l = (pos.x / IW * 100) + '%', t = (pos.z / IH * 100) + '%';
      var d = $('hdot'), m = $('mpme'); d.style.left = m.style.left = l; d.style.top = m.style.top = t;
    }
    function loadFrames() {
      var L = new T.TextureLoader();
      var d = 'back'; [1, 2].forEach(function (n) { var t = L.load(sprite(av, d, n)); t.encoding = T.sRGBEncoding; frames[d + n] = t; });
      if (meMat) meMat.map = frames.back1;
    }

    function init(err) {
      if (!alive) return;
      if (err || !window.THREE) { $('hload').textContent = '3D 매장을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'; return; }
      T = window.THREE;
      renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = T.sRGBEncoding;
      scene = new T.Scene();
      cam = new T.PerspectiveCamera(62, 1, 0.1, 60);
      build(T, scene);
      loadFrames();
      meMat = new T.SpriteMaterial({ map: frames.back1, transparent: true, alphaTest: 0.05, depthTest: true, depthWrite: false }); // 매대 뒤에서도 내 캐릭터가 보이게
      me = new T.Sprite(meMat); me.scale.set(1.33, 1.33, 1); me.center.set(0.5, 0.03); me.renderOrder = 10; scene.add(me);
      var sc = document.createElement('canvas'); sc.width = sc.height = 64;
      var q = sc.getContext('2d'), gr = q.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = gr; q.fillRect(0, 0, 64, 64);
      shadow = new T.Mesh(new T.PlaneGeometry(0.9, 0.5), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
      resize(); $('hload').style.display = 'none';
      raf = requestAnimationFrame(tick);
    }
    function resize() {
      if (!renderer) return;
      var w = view.clientWidth, h = view.clientHeight;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    }

    function nearestZone() {
      var best = -1, bd = 70;
      for (var i = 0; i < ZONES.length; i++) { var z = ZONES[i], d = Math.hypot(z.ax - pos.x, z.az - pos.z); if (d < bd) { bd = d; best = i; } }
      return best;
    }
    function updNear(moving) {
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
      var z = ZONES[zi];
      say(z.name + ' 코너로 걸어가는 중…');
      goTo(z.ax, z.az, function () { say(''); openScene(zi); }, z.keep ? null : z.face);
    }

    function tick(t) {
      if (!alive) return;
      var dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
      var want = 0, turnRate = 0, travel = yaw;
      var oldX = pos.x, oldZ = pos.z;
      if (!busy && sceneZ < 0) {
        if (joy && joy.mode === 'walk' && Math.hypot(joy.dx, joy.dy) > 5) {
          route = []; arrive = null; faceTo = null;
          travel = joy.angle + Math.atan2(joy.dx, -joy.dy) * 180 / Math.PI;
          turnRate = angDiff(yaw, travel) * 12;
          want = Math.min(1, Math.hypot(joy.dx, joy.dy) / 52);
        } else if (route.length) {
          var tg = route[0], dx = tg.x - pos.x, dz = tg.z - pos.z, d = Math.hypot(dx, dz);
          var wy = Math.atan2(dx, -dz) * 180 / Math.PI, ad = angDiff(yaw, wy);
          travel = wy; turnRate = ad * 10;
          want = Math.abs(ad) < 50 ? (route.length === 1 ? Math.min(1, d / 60 + 0.25) : 1) : 0.2;
          if (d < 0.01) route.shift();
        } else if (faceTo != null) {
          var ad2 = angDiff(yaw, faceTo);
          if (Math.abs(ad2) < 1.5) { yaw = faceTo; faceTo = null; } else turnRate = Math.max(-TURN, Math.min(TURN, ad2 * 4));
        } else if (arrive) { var f = arrive; arrive = null; f(); }
      }
      // 부드럽게 빨라지고 느려지기
      speed += (want - speed) * Math.min(1, dt * 5);
      yaw += turnRate * dt;
      if (Math.abs(speed) > 0.01) {
        var a = travel * Math.PI / 180, s = SPEED / U * speed * dt, nx = pos.x + Math.sin(a) * s, nz = pos.z - Math.cos(a) * s;
        if (tg && route.length && want > 0 && s>=d) {nx=tg.x;nz=tg.z;route.shift();if(!route.length)speed=0;}
        if (freeAt(nx, nz)) { pos.x = nx; pos.z = nz; }
        else if (freeAt(nx, pos.z)) pos.x = nx;
        else if (freeAt(pos.x, nz)) pos.z = nz;
        else speed = 0;
      }
      var distance = Math.hypot(pos.x - oldX, pos.z - oldZ) * U;
      var moving = distance > dt * 0.08;
      // 걸음: 속도에 맞춰 발 바꾸기 + 위아래 출렁 + 살짝 흔들림
      if (moving) {
        phase += distance * 4.8;
        var stepNow = Math.floor(phase / Math.PI);
        if (stepNow !== stepAcc) { stepAcc = stepNow; frame = frame === 1 ? 2 : 1; stepLeft = !stepLeft; if (soundOn) footstep(stepLeft); }
      } else { phase = 0; frame = 1; }
      meMat.map = frames['back' + frame];
      var bob = moving ? Math.abs(Math.sin(phase)) * 0.05 : 0;
      me.position.set(W(pos.x), bob, Wz(pos.z));
      meMat.rotation = moving ? Math.sin(phase) * 0.025 : 0;
      shadow.position.set(W(pos.x), 0.01, Wz(pos.z)); shadow.rotation.z = -yaw * Math.PI / 180;
      // 카메라: 방향은 천천히 따라 돌고, 벽에 막히면 당겨 옴
      var angle = yaw * Math.PI / 180, sx = Math.sin(angle), cz = Math.cos(angle);
      var desiredDistance = 3.1;
      for (var offset = 0.08; offset <= 3.2; offset += 0.08) {
        if (!clearance(pos.x - sx * offset / U, pos.z + cz * offset / U, 8)) {
          desiredDistance = Math.max(0.04, offset - 0.10);
          break;
        }
      }
      cameraDistance = Math.min(desiredDistance, cameraDistance + (desiredDistance - cameraDistance) * (1 - Math.exp(-dt * 5)));
      var tight = 1 - cameraDistance / 3.1, lead = 1.12 * (1 - tight);
      cam.position.set(W(pos.x) - sx * cameraDistance, 1.70 + tight * 1.28, Wz(pos.z) + cz * cameraDistance);
      cam.lookAt(W(pos.x) + sx * lead, 0.90, Wz(pos.z) - cz * lead);
      renderer.render(scene, cam);
      if (moving !== tick.wasMoving) { tick.wasMoving = moving; if (!moving) opts.savePos({ x: pos.x, z: pos.z, yaw: yaw }); }
      minimap(); updNear(moving);
      raf = requestAnimationFrame(tick);
    }

    /* 손가락 조종 */
    view.addEventListener('pointerdown', function (e) {
      if (soundOn) audio();
      if (e.target.closest('.hlook, .hmini, .hmapov, .hscene3') || sceneZ >= 0 || busy) return;
      if (!renderer || joy || !e.isPrimary) return;
      var bounds = view.getBoundingClientRect();
      joy = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, id: e.pointerId, dragged: false,
        mode: e.clientX < bounds.left + bounds.width / 2 ? 'walk' : 'look', angle: yaw };
      try { view.setPointerCapture(e.pointerId); } catch (er) {}
      var rc = view.getBoundingClientRect();
      pad.style.left = (e.clientX - rc.left) + 'px'; pad.style.top = (e.clientY - rc.top) + 'px'; pad.classList.toggle('show', joy.mode === 'walk');
      say('');
    });
    view.addEventListener('pointermove', function (e) {
      if (!joy || joy.id !== e.pointerId) return;
      joy.dx = e.clientX - joy.x; joy.dy = e.clientY - joy.y;
      if (Math.hypot(joy.dx, joy.dy) > 7) joy.dragged = true;
      if (joy.mode === 'look') { if (joy.dragged) { route = []; arrive = null; faceTo = null; speed = 0; yaw = joy.angle - joy.dx * 0.35; } return; }
      var m = Math.min(1, 46 / Math.max(1, Math.hypot(joy.dx, joy.dy)));
      pad.firstChild.style.transform = 'translate(' + joy.dx * m + 'px,' + joy.dy * m + 'px)';
    });
    function endJoy() { joy = null; pad.classList.remove('show'); pad.firstChild.style.transform = ''; }
    view.addEventListener('pointerup', function(e) {
      if (!joy || joy.id !== e.pointerId) return;
      if (!joy.dragged && renderer) {
        var rect = cv.getBoundingClientRect();
        var ray = new T.Raycaster();
        ray.setFromCamera(new T.Vector2((e.clientX - rect.left) / rect.width * 2 - 1,
          1 - (e.clientY - rect.top) / rect.height * 2), cam);
        var hit = ray.intersectObjects(scene.children, false).find(function(h) {
          return h.object.isMesh && h.object !== shadow;
        });
        if (hit && hit.object.name === 'walkable-floor') {
          var x = hit.point.x / U + IW / 2, z = hit.point.z / U + IH / 2;
          if (freeAt(x,z)) goTo(x,z);
        }
      }
      endJoy();
    });
    view.addEventListener('pointercancel', endJoy);
    look.addEventListener('click', function () { if (nearZ >= 0) { var zi = nearZ; route = []; faceTo = ZONES[zi].keep ? null : ZONES[zi].face; arrive = function () { openScene(zi); }; } });

    /* 매대 앞 장면 */
    function openScene(zi) {
      var z = ZONES[zi]; sceneZ = zi;
      var vw = view.clientWidth, vh = view.clientHeight, H = vh * 1.02, Wd = H * z.ar;
      if (Wd < vw) { Wd = vw; H = Wd / z.ar; }
      var spots = spotsOf(zi).map(function (p, k) {
        var o = st.opened[z.id + ':' + k], hit = o && zi === goldZ && k === goldK;
        return '<button class="ss' + (hit ? ' gold' : o ? ' miss' : '') + '" data-k="' + k + '" style="left:' + p[0] + '%;top:' + p[1] + '%" aria-label="' + z.name + ' ' + (k + 1) + '번 자리 살펴보기"><b>' + (hit ? '★' : o ? '꽝' : '?') + '</b></button>';
      }).join('');
      scn.innerHTML = '<div class="vbox" style="width:' + Wd + 'px;height:' + H + 'px;margin-left:' + (-Wd / 2) + 'px;margin-top:' + (-H / 2) + 'px"><img src="img/hunt/z-' + z.id + '.webp" alt="' + z.name + ' 매대" draggable="false"><div class="spots show">' + spots + '</div></div>' +
        '<div class="sctop"><b>' + z.name + '</b><span>' + (st.found ? '오늘 골드 태그는 이미 찾았어요' : st.tries > 0 ? '반짝이는 ? 를 눌러 뒤져 보세요' : '오늘 기회를 다 썼어요') + '</span></div>' +
        '<img class="sme" src="' + sprite(av, 'back', 1) + '" alt="">' +
        '<button class="sback" data-sb="1">← 통로로 돌아가기</button>';
      scn.classList.add('show'); where.textContent = z.name + ' 코너';
    }
    function closeScene() { if (sceneZ < 0) return; scn.classList.remove('show'); sceneZ = -1; nearZ = -2; }
    scn.addEventListener('click', function (e) {
      if (e.target.closest('[data-sb]')) { closeScene(); return; }
      var b = e.target.closest('.ss'); if (b) search(+b.getAttribute('data-k'), b);
    });
    function sceneMsg(t) { var s = scn.querySelector('.sctop span'); if (s) s.textContent = t; }
    function search(k, el) {
      var zi = sceneZ, z = ZONES[zi], key = z.id + ':' + k;
      if (st.opened[key] || busy) return;
      if (st.found) { sceneMsg('오늘 골드 태그는 이미 찾았어요! 내일 또 만나요'); return; }
      if (st.tries <= 0) { sceneMsg('오늘 기회를 다 썼어요. 내일 다시 도전!'); return; }
      busy = true; el.classList.add('shake'); scn.classList.add('dig'); sceneMsg('뒤적뒤적…');
      if (soundOn) { audio(); footstep(true); setTimeout(function () { footstep(false); }, 300); setTimeout(function () { footstep(true); }, 600); }
      setTimeout(function () {
        busy = false; el.classList.remove('shake'); scn.classList.remove('dig');
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
      var z = e.target.closest('.hz'); if (!z || !renderer) return;
      if (soundOn) audio(); walkZone(+z.getAttribute('data-z'));
    });
    $('hsnd').addEventListener('click', function () {
      soundOn = !soundOn; ctx.setSound(soundOn); this.textContent = soundOn ? '소리 켬' : '소리 끔';
      if (soundOn) { audio(); footstep(true); }
    });

    gate.addEventListener('click', function (e) {
      var b = e.target.closest('.gpick'); if (!b) return;
      av = b.getAttribute('data-g'); ctx.setAvatar(av);
      var all = gate.querySelectorAll('.gpick'); for (var i = 0; i < all.length; i++) all[i].classList.toggle('on', all[i] === b);
      if (T) loadFrames();
    });
    function enter() {
      if (soundOn) audio();
      gate.classList.add('open');
      setTimeout(function () { gate.classList.add('gone'); }, 900);
      setTimeout(function () {
        gate.style.display = 'none';
        say(st.found ? '오늘 골드 태그는 이미 찾았어요! 매장은 자유롭게 둘러보세요' : st.tries <= 0 ? '오늘 기회를 다 썼어요. 내일 다시 도전!' : '원하는 통로 바닥을 톡 눌러 걸어 보세요');
        if (!opts.pos || opts.pos.z == null) goTo(835, 700);
      }, 1300);
      opts.entered();
    }
    if (opts.skipGate) gate.style.display = 'none';
    else $('genter').addEventListener('click', enter);

    dots(); minimap();
    loadThree(init);
    var ro = new ResizeObserver(resize); ro.observe(view);
    return function unmount() {
      alive = false; cancelAnimationFrame(raf); ro.disconnect();
      if (renderer) { renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); }
      opts.savePos({ x: pos.x, z: pos.z, yaw: yaw });
    };
  }

  window.GBHunt = { html: html, mount: mount, TRIES: TRIES, ZONES: ZONES };
})();
