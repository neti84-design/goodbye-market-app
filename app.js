/* 굿바이마켓 회원 앱 — 발표 시연용 (예시 데이터, 결제는 흉내만) */
(function () {
  'use strict';

  var KEY = 'goodbye-app-v1';
  var DOW = '일월화수목금토';
  var OPEN_H = 10, CLOSE_H = 22;

  /* ---------- 예시 데이터 (소비기한은 오늘 기준 남은 일수) ---------- */
  var PRODUCTS = [
    { id: 'g4', name: '코코이찌방야 카레우동 347g', cat: '식품 · 냉동', group: 'food', reg: 8990, price: 4900, stock: 32, days: 92, week: 1, queue: 63,
      brand: '테이블마크', size: '347g (1인분)', keep: '냉동 보관 (-18℃ 이하)',
      desc: '일본 카레 전문점 코코이찌방야 감수 카레우동이에요. 쫄깃한 냉동 우동에 카레 수프가 함께 들어 있어 데우기만 하면 돼요.',
      why: '점포 냉동 매대를 정리하며 모은 상품이에요. 소비기한이 석 달 넘게 남아 있어요.' },
    { id: 'g1', name: '뉴 슈퍼마리오브라더스 U 디럭스', cat: '게임', group: 'life', reg: 64800, price: 34900, stock: 12, days: null, week: 2, queue: 41,
      brand: '닌텐도 스위치', size: '닌텐도 스위치용 게임 칩 1개 (한국어판)', keep: '실온 보관 · 전체 이용가',
      desc: '마리오와 친구들이 함께 달리는 횡스크롤 게임이에요. 최대 4명이 함께 할 수 있어 가족 게임으로 좋아요.',
      why: '새 시리즈가 나오면서 점포 진열에서 빠진 예전 타이틀이에요. 포장을 뜯지 않은 새 상품이에요.' },
    { id: 'g3', name: '스카프 6장 9,900원', cat: '패션잡화', group: 'life', reg: 29400, price: 9900, stock: 40, days: null, week: 3, queue: 124,
      brand: '남대문 스카프 아저씨', size: '스카프 6장 한 묶음 (색·무늬 랜덤)', keep: '손세탁 권장 · 그늘에서 말리기',
      desc: '남대문 시장에서 입소문 난 스카프를 6장 한 묶음으로 담았어요. 목에 두르고, 가방에 묶고, 머리띠로도 써요. 색과 무늬는 랜덤이에요.',
      why: '남대문 스카프 아저씨와 함께하는 이번 주 특별 기획이에요. 한 장에 1,650원꼴이에요.' },
    { id: 'g2', name: '포켓몬스터 태그스타 박스', cat: '완구', group: 'life', reg: 17900, price: 7900, stock: 24, days: null, week: 4, queue: 87,
      brand: '포켓몬스터', size: '박스 1개 (6세 이상)', keep: '실온 보관 · 6세 이상',
      desc: '몬스터볼 무늬가 들어간 빨간 수납 박스예요. 포켓몬을 좋아하는 아이 선물로 인기가 많아요.',
      why: '행사 매대에서 빠진 뒤 점포마다 몇 개씩 남은 상품을 모았어요.' },
    { id: 'p1', name: '오뚜기 XO 물만두 378g×2', cat: '식품 · 냉동', group: 'food', reg: 8980, price: 3590, stock: 18, days: 64, week: 6, queue: 11,
      brand: '오뚜기', size: '756g (378g × 2봉)', keep: '냉동 보관 (-18℃ 이하)',
      desc: '얇은 피에 고기와 채소 소를 채운 물만두예요. 끓는 물에 삶아도, 라면이나 만둣국에 넣어도 좋아요.',
      why: '점포마다 몇 봉씩 남은 상품을 한곳에 모았어요. 소비기한이 두 달 남짓 남아 있어요.' },
    { id: 'p2', name: '포스트 그래놀라 크랜베리아몬드 570g', cat: '식품 · 상온', group: 'food', reg: 9980, price: 3990, stock: 42, days: 41,
      brand: '포스트', size: '570g', keep: '실온 보관 · 개봉 후 밀봉',
      desc: '크랜베리와 아몬드가 들어간 그래놀라예요. 우유나 요거트에 곁들여 아침으로 먹기 좋아요.',
      why: '시즌 기획이 끝나 매대에서 빠진 상품이에요.' },
    { id: 'p3', name: '팔도 비빔면 130g×5', cat: '식품 · 상온', group: 'food', reg: 4680, price: 1890, stock: 9, days: 89,
      brand: '팔도', size: '650g (130g × 5개)', keep: '실온 보관',
      desc: '새콤달콤한 비빔장이 들어 있는 비빔면이에요. 삶아서 찬물에 헹군 뒤 비벼 드세요.',
      why: '여름 행사 뒤 점포에 남은 물량이에요.' },
    { id: 'p4', name: '이디야 핸드드립 에티오피아 8g×7', cat: '식품 · 상온', group: 'food', reg: 6490, price: 2590, stock: 56, days: 164,
      brand: '이디야', size: '56g (8g × 7개)', keep: '실온 보관 · 직사광선 피하기',
      desc: '컵에 걸어 뜨거운 물만 부으면 되는 드립백 커피예요. 사무실이나 캠핑에 챙기기 좋아요.',
      why: '포장이 바뀌어 예전 포장 상품을 모았어요.' },
    { id: 'p5', name: '퐁퐁 베이킹소다 리필 2L', cat: '생활용품', group: 'life', reg: 8900, price: 3500, stock: 27, days: null,
      brand: '퐁퐁', size: '2L 리필', keep: '실온 보관 · 어린이 손이 닿지 않는 곳',
      desc: '쓰던 용기에 옮겨 담아 쓰는 주방세제 리필이에요. 대용량이라 오래 써요.',
      why: '점포마다 한두 개씩 남은 재고를 모았어요. 생활용품이라 기한이 없어요.' },
    { id: 'p6', name: '옥스포드 블록생활 공룡친구들', cat: '완구', group: 'life', reg: 39900, price: 14900, stock: 6, days: null, week: 5, queue: 9,
      brand: '옥스포드', size: '블록 세트 1개 (38개월 이상)', keep: '작은 부품이 있어 36개월 미만 어린이는 사용 금지',
      desc: '공룡 친구들을 조립하며 노는 블록 세트예요. 선물용으로도 좋아요.',
      why: '시즌이 지나 점포 진열에서 빠진 완구예요. 상자 그대로 새 상품이에요.' }
  ];
  var INCOMING = [
    { id: 'i1', brand: 'CJ 비비고', name: '한입떡갈비 320g', cat: '식품 · 냉동', reg: 6980, from: 2990, days: 103, when: 1, canWish: true, fans: 214 },
    { id: 'i2', brand: '농심', name: '육개장 사발면 86g×6', cat: '식품 · 상온', reg: 6120, from: 2490, days: 118, when: 1, canWish: true, fans: 158 },
    { id: 'i3', brand: '레고', name: '스쿠데리아 페라리 HP 헬멧 (43022)', cat: '완구 · 14세 이상', reg: 139900, from: 69900, days: null, when: 1, canWish: false, fans: 0 },
    { id: 'i4', brand: '켈로그', name: '에너지바 크런치넛 160g', cat: '식품 · 상온', reg: 6190, from: 2490, days: 54, when: 3, canWish: false, fans: 0 },
    { id: 'i5', brand: '피죤', name: '섬유유연제 핑크로즈 2.9L', cat: '생활용품', reg: 10820, from: 4900, days: null, when: 3, canWish: true, fans: 0 }
  ];
  var ZONES = ['냉동', '과자', '라면', '음료', '세제', '주방', '완구', '문구', '계산대 앞'];
  var PHOTOS = [['냉동 코너', '매대 3칸'], ['상온 식품', '박스 진열'], ['생활·완구', '뒤쪽 매대']];

  /* ---------- 날짜 도우미 ---------- */
  function today0() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function md(d) { return (d.getMonth() + 1) + '월 ' + d.getDate() + '일'; }
  function mdw(d) { return md(d) + '(' + DOW.charAt(d.getDay()) + ')'; }
  function ymd(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function won(n) { return n.toLocaleString('ko-KR') + '원'; }
  function r10(n) { return Math.round(n / 10) * 10; }
  function hm(d) {
    var h = d.getHours(), m = d.getMinutes();
    return (h < 12 ? '오전 ' : '오후 ') + (h % 12 === 0 ? 12 : h % 12) + ':' + (m < 10 ? '0' : '') + m;
  }

  /* ---------- 저장 상태 ---------- */
  function fresh() {
    return {
      wish: { p1: true, p3: true }, wishIn: { i1: true }, unsel: {}, sold: {},
      points: 3250,
      history: [
        { label: '구매 적립', date: md(addDays(today0(), -3)), pts: 112 },
        { label: '보물찾기 골드 태그 발견', date: md(addDays(today0(), -5)), pts: 500 },
        { label: '구매 적립', date: md(addDays(today0(), -8)), pts: 86 }
      ],
      orders: [], queue: {},
      treasure: { date: '', tries: 3, opened: {}, found: false },
      demo: null
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
  if (!S.queue) S.queue = {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* 화면 상태 (저장 안 함) */
  var V = { slide: 0, tab: 'home', screen: 'landing', filter: 'all', detail: null, pickIdx: 0, agree: false, lastOrder: null };

  function isNight() {
    if (S.demo === 'night') return true;
    if (S.demo === 'day') return false;
    var h = new Date().getHours();
    return h >= CLOSE_H || h < OPEN_H;
  }
  function treasure() {
    var t = ymd(today0());
    if (S.treasure.date !== t) { S.treasure = { date: t, tries: 3, opened: {}, found: false }; save(); }
    return S.treasure;
  }

  var STEPS = 5, STEP_PCT = 5, DISPOSE_BEFORE = 3;
  function priceSteps(p, T) {
    if (p.days == null) return null;
    var end = p.days - DISPOSE_BEFORE, len = end / STEPS, out = [];
    for (var k = 0; k < STEPS; k++) {
      var a = Math.round(k * len), b = k === STEPS - 1 ? end : Math.round((k + 1) * len) - 1;
      out.push({ n: k + 1, from: addDays(T, a), to: addDays(T, b), price: r10(p.price * (1 - STEP_PCT * k / 100)), store: a > p.days - 30 });
    }
    return out;
  }
  function prod(p) {
    var T = today0(), night = isNight();
    var stock = Math.max(0, p.stock - (S.sold[p.id] || 0));
    var exp = p.days != null ? addDays(T, p.days) : null;
    var dl = exp ? addDays(exp, -30) : addDays(T, 7);
    return {
      raw: p, id: p.id, name: p.name, img: 'img/' + p.id + '.webp', imgL: 'img/' + p.id + '-l.webp', cat: p.cat, group: p.group, price: p.price, reg: p.reg,
      stock: stock, low: stock < 30, night: night,
      wished: !!S.wish[p.id],
      pct: Math.round((1 - p.price / p.reg) * 100),
      steps: priceSteps(p, T), next: p.days != null ? priceSteps(p, T)[1] : null,
      exp: exp, dl: dl,
      expLabel: exp ? '소비기한' : '기한 없는 상품',
      expBig: exp ? md(exp) : (p.cat === '게임' || p.cat === '패션잡화' ? p.cat : '생활·완구'),
      expFull: exp ? exp.getFullYear() + '. ' + (exp.getMonth() + 1) + '. ' + exp.getDate() + '.까지' : '기한 없음',
      dday: exp ? 'D-' + p.days : '7일 내 픽업',
      pickupShort: mdw(dl) + '까지 픽업 · 이후 환불 불가',
      pickupRule: exp ? '소비기한 한 달 전인 ' + mdw(dl) + '까지 픽업' : '결제 후 7일, ' + mdw(dl) + '까지 픽업',
      stockTxt: night ? '남은 수량 ' + stock + '개' : '남은 수량 ??개',
      urgency: !night ? '지금 몇 개 남았을까요? 밤 10시에 공개돼요 — 그 전에 매장 손님이 담아 갈 수도 있어요'
        : (stock === 0 ? '오늘은 다 팔렸어요' : stock < 30 ? '딱 ' + stock + '개 남았어요 — 다음 인하 때까지 남아 있을지 몰라요' : (p.days != null ? '기다리면 5% 내려가지만, 그때도 남아 있을지는 아무도 몰라요' : '가격은 그대로예요 — 다 팔리면 끝나요'))
    };
  }
  function all() { return PRODUCTS.map(prod); }
  function byId(id) { return all().filter(function (p) { return p.id === id; })[0]; }

  /* ---------- 아이콘 ---------- */
  var I = {
    heart: function (on) { return '<svg width="24" height="24" viewBox="0 0 24 24" fill="' + (on ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>'; },
    store: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/></svg>',
    truck: function (c) { return '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M1 6h13v10H1zM14 10h4l3 3v3h-7"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg>'; },
    gift: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>',
    bars: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 5v14M7 5v14M10.5 5v14M14 5v14M17 5v14M20 5v14"/></svg>',
    lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    check: function (c, s) { return '<svg width="' + (s || 16) + '" height="' + (s || 16) + '" viewBox="0 0 24 24" fill="none" stroke="' + (c || '#fff') + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'; },
    back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    x: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  function barcode(seed, h) {
    var x = 0, rects = '';
    for (var k = 0; k < 44; k++) {
      var w = 1 + ((seed.charCodeAt(k % seed.length) * (k + 7)) % 5) % 3;
      if (k % 2 === 0) rects += '<rect x="' + x + '" y="0" width="' + w + '" height="' + h + '" fill="#2B2B2B"/>';
      x += w;
    }
    return '<svg role="img" aria-label="바코드" width="' + x * 2 + '" height="' + h + '" viewBox="0 0 ' + x + ' ' + h + '" preserveAspectRatio="none">' + rects + '</svg>';
  }

  /* ---------- 화면 조각 ---------- */
  function header() {
    return '<header class="hdr"><div>' +
      '<button class="logo" data-a="landing" aria-label="GOOD-BUY 굿바이마켓 첫 화면으로"><span class="g">GOOD</span><span class="b">-BUY</span></button>' +
      '<svg class="smile" width="40" height="9" viewBox="0 0 40 9" aria-hidden="true"><path d="M2 2 Q20 12 38 2" fill="none" stroke="#F26A1B" stroke-width="3" stroke-linecap="round"/></svg>' +
      '<div class="slogan">놓치면 BYE, 잡으면 <b>BUY!</b> · 김포점</div></div>' +
      '<div class="pts"><small>내 포인트</small><strong>' + S.points.toLocaleString('ko-KR') + 'P</strong></div></header><div class="band"></div>';
  }
  function nav() {
    var wc = all().filter(function (p) { return p.wished; }).length + INCOMING.filter(function (i) { return S.wishIn[i.id]; }).length;
    var t = [['home', I.store, '진열 상품'], ['incoming', I.truck(), '입고 예정'], ['wish', I.heart(false).replace('width="24" height="24"', 'width="23" height="23"'), '찜 ' + wc], ['treasure', I.gift, '보물찾기'], ['member', I.bars, '멤버십']];
    return '<nav class="nav" aria-label="메뉴">' + t.map(function (x) {
      return '<button data-a="tab" data-id="' + x[0] + '"' + (V.tab === x[0] ? ' aria-current="page"' : '') + '>' + x[1] + '<span>' + x[2] + '</span></button>';
    }).join('') + '</nav>';
  }

  function homeView() {
    var night = isNight(), now = new Date();
    var h = '';
    if (!night) {
      var close = new Date(); close.setHours(CLOSE_H, 0, 0, 0);
      var left = Math.max(0, Math.ceil((close - now) / 60000));
      var leftTxt = left >= 60 ? Math.floor(left / 60) + '시간 ' + (left % 60 ? left % 60 + '분' : '') : left + '분';
      h += '<section class="banner day"><div class="row"><span class="badge">지금은 영업 중 · ' + (S.demo ? '오후 2:00' : hm(now)) + '</span>' +
        '<span class="muted" style="color:#D6D2CC">재고 공개까지 ' + (S.demo ? '8시간' : leftTxt) + '</span></div>' +
        '<div class="big">오늘 남은 수량은 <span style="color:#FFB27A">??개</span></div>' +
        '<div class="txt">영업 중에는 매장 손님이 지금도 담아 가고 있어요. 밤 10시 영업이 끝나면 남은 재고와 매장 진열 사진을 공개해요.</div>' +
        '<button class="demo" data-a="demo">시연: 밤 10시로 바꿔 보기</button></section>';
    } else {
      var early = !S.demo && new Date().getHours() < OPEN_H;
      h += '<section class="banner night"><div class="row"><span class="badge">영업 종료 · 밤 10:00 이후</span>' +
        '<span style="font-size:12px;font-weight:700;color:#2A1405">' + (early ? '오늘' : '내일') + ' 오전 10시 개점</span></div>' +
        '<div class="big">오늘 남은 재고 공개!</div>' +
        '<div class="txt">마감 후 실제로 남은 수량이에요. 지금 찜하고 결제하면 ' + (early ? '오늘' : '내일') + '부터 픽업할 수 있어요. 소비기한이 가까워지면 5%씩 단계별로 내려가요.</div>' +
        '<button class="demo" data-a="demo">' + (S.demo ? '시연: 낮으로 돌아가기' : '시연: 낮 화면 보기') + '</button></section>';
    }
    h += '<section style="display:flex;flex-direction:column;gap:8px"><div class="row" style="align-items:baseline"><div class="h2">오늘 밤 매장 진열 사진</div><div class="muted">' + (night ? '22:05 촬영' : '밤 10시 공개') + '</div></div><div class="photos">' +
      PHOTOS.map(function (x) {
        return night ? '<div class="photo open"><b>' + x[0] + '</b><small>' + x[1] + '</small><small>(사진 자리)</small></div>'
          : '<div class="photo locked">' + I.lock + '<b>' + x[0] + '</b><small>22:00 공개</small></div>';
      }).join('') + '</div></section>';

    var F = [['all', '전체'], ['food', '식품'], ['life', '생활·완구'], ['low', '임박만']];
    h += '<div class="chips" role="group" aria-label="상품 분류">' + F.map(function (f) {
      return '<button class="pill" data-a="filter" data-id="' + f[0] + '" aria-pressed="' + (V.filter === f[0]) + '">' + f[1] + '</button>';
    }).join('') + '</div>';

    var list = all().filter(function (p) {
      if (V.filter === 'food') return p.group === 'food';
      if (V.filter === 'life') return p.group === 'life';
      if (V.filter === 'low') return night && p.low;
      return true;
    });
    if (V.filter === 'low' && !list.length) {
      h += '<div class="card" style="text-align:center;font-size:14px;line-height:1.6;padding:22px">' + (night ? '지금 임박 상품이 없어요' : '임박 상품은 남은 수량이 공개되는<br><b style="color:#A33D06">밤 10시</b>에 보여 드려요') + '</div>';
    }
    h += list.map(card).join('');
    h += '<div class="note">시연용 예시 상품 · 가격·수량·기한은 설명을 위한 값이에요</div>';
    return h;
  }

  function card(p) {
    var badge = !p.night ? '<span class="tag hidden">남은 수량 ??개</span>'
      : p.low ? '<span class="tag low">임박 · ' + p.stock + '개 남음</span>'
        : '<span class="muted">남은 수량 ' + p.stock + '개</span>';
    return '<article class="card">' +
      '<div class="row"><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="tag cat">' + p.cat + '</span>' + badge + '</div>' +
      '<button class="icon-btn heart" data-a="wish" data-id="' + p.id + '" aria-label="' + p.name + (p.wished ? ' 찜 해제' : ' 찜하기') + '" aria-pressed="' + p.wished + '">' + I.heart(p.wished) + '</button></div>' +
      '<button class="p-main" data-a="open" data-id="' + p.id + '"><img class="thumb" src="' + p.img + '" alt="" loading="lazy"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">' +
      '<div class="p-name">' + p.name + '</div>' +
      '<div class="price"><s>' + won(p.reg) + '</s><span class="pct">' + p.pct + '%</span><span class="now">' + won(p.price) + '</span></div></div>' +
      '<div class="exp"><small>' + p.expLabel + '</small><strong>' + p.expBig + '</strong><em>' + p.dday + '</em></div></button>' +
      '<div class="tmr"><b>' + (p.next ? md(p.next.from) + '부터 ' + won(p.next.price) + ' 예정 <span>(-5%' + (p.next.store ? ' · 매장 현장 판매만' : '') + ')</span>' : '기한 없는 상품 · 가격 그대로') + '</b><div>' + p.urgency + '</div></div>' +
      '</article>';
  }

  function incomingView() {
    var T = today0();
    var item = function (it) {
      var on = !!S.wishIn[it.id];
      var exp = it.days != null ? md(addDays(T, it.days)) + '까지' : '기한 없음';
      var right = it.canWish
        ? '<button class="pill o" data-a="wishIn" data-id="' + it.id + '" aria-pressed="' + on + '">' + (on ? '찜 완료' : '찜하기') + '</button>'
        : '<span class="nowish">현장 판매만 · 찜 불가</span>';
      var tags = it.when === 1 ? '<span class="tag move">이동 중</span>' + (it.fans ? '<span class="tag low">인기 · 찜 ' + (it.fans + (on ? 1 : 0)) + '명</span>' : '')
        : '<span class="tag cat">점포에서 모으는 중</span>';
      return '<article class="card" style="gap:8px"><div class="row"><div style="display:flex;gap:6px">' + tags + '</div>' + right + '</div>' +
        '<div style="display:flex;gap:12px;align-items:center">' + '<img class="thumb" src="img/' + it.id + '.webp" alt="">' +
        '<div class="inc-body" style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px"><div class="muted" style="font-weight:700">' + it.brand + ' · ' + it.cat + '</div><div class="p-name">' + it.name + '</div>' +
        '<div class="row" style="align-items:baseline"><div style="font-size:13px;color:#5E5852">' + (it.days != null ? '소비기한 <b style="color:#2B2B2B;font-size:15px">' + exp + '</b>' : '<b style="color:#2B2B2B;font-size:15px">기한 없는 상품</b>') + '</div>' +
        '<div class="from"><s>' + won(it.reg) + '</s> ' + won(it.from) + '<span>부터 시작</span></div></div></div></div></article>';
    };
    var h = '<section class="truck"><div class="row"><div style="display:flex;gap:8px;align-items:center;font-size:16px;font-weight:900">' + I.truck('#FFB27A') + '지금 이동 중</div>' +
      '<div style="font-size:12px;color:#D6D2CC">' + mdw(addDays(T, 1)) + ' 오전 진열</div></div>' +
      '<div class="route"><div class="stop"><div class="dot done"></div>마트·슈퍼 점포</div><div class="seg done"></div>' +
      '<div class="stop now"><div class="dot now"></div>오산센터 출발</div><div class="seg"></div>' +
      '<div class="stop"><div class="dot"></div>김포 매장</div></div></section>';
    h += '<div class="h2">내일 입고 · ' + mdw(addDays(T, 1)) + '</div>' + INCOMING.filter(function (i) { return i.when === 1; }).map(item).join('');
    h += '<div class="h2" style="margin-top:4px">이번 주 입고 · ' + mdw(addDays(T, 3)) + '</div>' + INCOMING.filter(function (i) { return i.when > 1; }).map(item).join('');
    h += '<div class="card" style="font-size:12px;color:#5E5852;line-height:1.6">찜한 입고 예정 상품은 진열되는 순간 알림을 보내 드려요. 수량이 적은 상품은 현장 판매만 해요.</div>';
    return h;
  }

  function selection() {
    var items = all().filter(function (p) { return p.wished; });
    var sel = items.filter(function (p) { return !S.unsel[p.id] && p.stock > 0; });
    var total = sel.reduce(function (a, p) { return a + p.price; }, 0);
    var dl = sel.length ? sel.reduce(function (a, p) { return p.dl < a ? p.dl : a; }, sel[0].dl) : null;
    return { items: items, sel: sel, total: total, earn: Math.floor(total * 0.01), dl: dl };
  }

  function wishView() {
    var night = isNight(), x = selection();
    var inc = INCOMING.filter(function (i) { return S.wishIn[i.id]; });
    var h = '<div class="h1">찜한 상품</div>';
    if (!x.items.length && !inc.length) h += '<div class="card" style="text-align:center;font-size:14px;color:#5E5852;line-height:1.6;padding:28px">아직 찜한 상품이 없어요.<br>진열 상품에서 하트를 눌러 보세요.</div>';
    h += x.items.map(function (p) {
      var on = !S.unsel[p.id];
      return '<article class="card" style="flex-direction:row;align-items:center;gap:12px;padding:12px 14px">' +
        '<button class="icon-btn" style="margin:-6px;flex-shrink:0" data-a="sel" data-id="' + p.id + '" aria-pressed="' + on + '" aria-label="' + p.name + ' 선택"><span class="check' + (on ? ' on' : '') + '">' + I.check() + '</span></button>' +
        '<button data-a="open" data-id="' + p.id + '" style="flex-shrink:0" aria-label="' + p.name + ' 상세 보기"><img class="thumb sm" src="' + p.img + '" alt=""></button>' +
        '<div style="flex:1;display:flex;flex-direction:column;gap:3px"><div style="font-size:15px;font-weight:700">' + p.name + '</div>' +
        '<div class="muted">소비기한 <b style="color:#2B2B2B">' + p.expFull + '</b> · ' + p.stockTxt + '</div>' +
        '<div style="font-size:12px;font-weight:700;color:#A33D06">' + p.pickupShort + '</div></div>' +
        '<div style="font-size:16px;font-weight:900">' + won(p.price) + '</div></article>';
    }).join('');
    if (x.items.length) {
      var ok = night && x.sel.length > 0;
      h += '<div class="sum"><div><small>선택 ' + x.sel.length + '개</small><strong>' + won(x.total) + '</strong></div>' +
        (ok ? '<button class="btn" data-a="checkout">픽업 결제하기</button>'
          : '<span class="btn off">' + (night ? '상품을 골라 주세요' : '결제는 밤 10시 재고 공개 후') + '</span>') + '</div>';
    }
    if (inc.length) {
      h += '<div class="h2" style="margin-top:8px">입고 알림 찜</div>' + inc.map(function (it) {
        return '<article class="card" style="flex-direction:row;align-items:center;gap:10px;padding:12px 14px;border:1px dashed #9A928A;box-shadow:none"><img class="thumb sm" src="img/' + it.id + '.webp" alt="">' +
          '<div style="flex:1"><div style="font-size:15px;font-weight:700">' + it.brand + ' ' + it.name + '</div><div class="muted">' + mdw(addDays(today0(), it.when)) + ' 입고 예정 · 진열되면 알림을 드려요</div></div>' +
          '<div style="font-size:14px;font-weight:900;color:#C84B08">' + won(it.from) + '~</div></article>';
      }).join('');
    }
    return h;
  }

  function treasureView() {
    var t = treasure();
    var GOLD = 6;
    var msg = t.found ? '찾았어요! 500P 적립 · 매장 골드 태그 상품도 찾아보세요'
      : t.tries <= 0 ? '오늘 기회를 다 썼어요. 내일 다시 도전!' : '구역을 눌러 골드 태그를 찾아보세요';
    return '<section class="gold"><div class="k">오늘의 보물찾기 이벤트</div><div style="font-size:19px;font-weight:900">매장에 골드 태그 5개를 숨겼어요</div>' +
      '<div style="font-size:13px;line-height:1.6">골드 태그가 붙은 상품을 찾으면 그 자리에서 초특가! 계산대에서 멤버십 바코드를 보여 주면 포인트도 함께 쌓여요.</div></section>' +
      '<section class="card" style="gap:12px"><div class="row"><div class="h2">앱 속 매장 지도에서 찾기</div><div style="font-size:12px;font-weight:700;color:#C84B08">오늘 남은 기회 ' + t.tries + '번</div></div>' +
      '<div class="zones">' + ZONES.map(function (z, i) {
        var o = !!t.opened[i], hit = o && i === GOLD;
        return '<button class="zone' + (hit ? ' hit' : o ? ' miss' : '') + '" data-a="zone" data-id="' + i + '" aria-label="' + z + ' 구역 살펴보기"><b>' + z + '</b><span>' + (o ? (hit ? '골드 태그!' : '없어요') : '?') + '</span></button>';
      }).join('') + '</div><div style="font-size:13px;font-weight:700;text-align:center;color:' + (t.found ? '#7A5A00' : '#5E5852') + '">' + msg + '</div></section>' +
      '<section class="card" style="gap:6px"><div class="h2">오늘의 매장 힌트</div><div style="font-size:13px;line-height:1.7">1. 차가운 곳, 맨 위 칸을 살펴보세요<br>2. 블록 상자들 사이에 숨어 있어요<br>3. 계산대에서 가장 가까운 매대</div></section>';
  }

  function memberView() {
    var h = '<section class="mcard"><div class="row" style="align-items:flex-start"><div><div class="k">MEMBERSHIP</div><div style="font-size:18px;font-weight:900">굿바이 회원님</div></div><span class="grade">보물 사냥꾼</span></div>' +
      '<div class="barcode">' + barcode('8801202611170042', 64) + '<div class="no">8801 2026 1117 0042</div></div>' +
      '<div style="font-size:12px;color:#D6D2CC;text-align:center">계산할 때 보여 주시면 포인트가 쌓여요</div></section>';
    h += '<section class="card" style="flex-direction:row;justify-content:space-between;align-items:center"><div><div class="muted" style="font-size:13px">사용 가능한 포인트</div><div style="font-size:24px;font-weight:900">' + S.points.toLocaleString('ko-KR') + 'P</div></div>' +
      '<div class="muted" style="text-align:right;line-height:1.6">구매 금액의 1% 적립<br>보물 발견 +500P</div></section>';
    if (S.orders.length) {
      h += '<section class="card" style="gap:4px"><div class="h2" style="margin-bottom:4px">내 픽업 주문</div>' + S.orders.map(function (o) {
        return '<div class="hist" style="align-items:flex-start"><div><div style="font-size:14px;font-weight:700">' + o.title + '</div><div class="muted">픽업 ' + o.pickup + ' · 마감 <b style="color:#A33D06">' + o.deadline + '</b></div></div><div style="font-size:14px;font-weight:900">' + o.total + '</div></div>';
      }).join('') + '</section>';
    }
    h += '<section class="card" style="gap:4px"><div class="h2" style="margin-bottom:4px">적립 내역</div>' + S.history.slice(0, 8).map(function (x) {
      return '<div class="hist"><div><div style="font-size:14px">' + x.label + '</div><div class="muted">' + x.date + '</div></div><b>+' + x.pts.toLocaleString('ko-KR') + 'P</b></div>';
    }).join('') + '</section>';
    if (S.demo) h += '<button class="pill o" style="align-self:center" data-a="realClock">시연 끄고 실제 시계로 보기</button>';
    h += '<button class="pill" style="align-self:center" data-a="reset">시연 데이터 처음으로 되돌리기</button>';
    return h;
  }

  function checkoutView() {
    var x = selection(), T = today0();
    var base = new Date().getHours() < OPEN_H && !S.demo ? 0 : 1;
    var names = base === 0 ? ['오늘', '내일', '모레'] : ['내일', '모레', '글피'];
    var days = [0, 1, 2].map(function (i) {
      return '<button class="pill" data-a="pick" data-id="' + i + '" aria-pressed="' + (V.pickIdx === i) + '"><span style="font-size:14px;font-weight:900">' + mdw(addDays(T, base + i)) + '</span><small>' + names[i] + '</small></button>';
    }).join('');
    var h = '<div class="topbar"><button class="icon-btn" data-a="backWish" aria-label="찜 목록으로 돌아가기">' + I.back + '</button><div style="font-size:17px;font-weight:900">픽업 결제</div></div>';
    h += '<div class="scroll"><div class="pad">';
    h += '<section class="card" style="gap:0;padding:6px 16px">' + x.sel.map(function (p) {
      return '<div style="padding:10px 0;border-bottom:1px solid #EEE9E1;display:flex;justify-content:space-between;gap:10px"><div><div style="font-size:15px;font-weight:700">' + p.name + '</div>' +
        '<div class="muted">소비기한 ' + p.expFull + '</div><div style="font-size:12px;font-weight:700;color:#A33D06">' + p.pickupShort + '</div></div>' +
        '<div style="font-size:15px;font-weight:900;white-space:nowrap">' + won(p.price) + '</div></div>';
    }).join('') + '</section>';
    h += '<section class="warn"><div class="k">꼭 확인해 주세요</div><div class="big">' + (x.dl ? mdw(x.dl) : '') + '까지 찾으러 오셔야 해요</div>' +
      '<p>소비기한이 임박한 상품이라, 소비기한 한 달 전까지 픽업하셔야 해요. 생활용품·완구는 결제 후 7일까지예요. <b style="color:#A33D06">픽업 마감이 지나면 환불이 안 돼요.</b></p></section>';
    h += '<section style="display:flex;flex-direction:column;gap:8px"><div class="h2">언제 찾으러 오실까요?</div><div class="days">' + days + '</div><div class="muted">김포점 픽업대 · 10:00~22:00 · 멤버십 바코드로 찾아가요</div></section>';
    h += '<section class="card" style="gap:8px"><div class="kv"><span>상품 금액</span><b>' + won(x.total) + '</b></div><div class="kv"><span>적립 예정 포인트 (1%)</span><b style="color:#C84B08">+' + x.earn.toLocaleString('ko-KR') + 'P</b></div><div class="kv"><span>결제 수단</span><span>시연용 (실제 결제 안 됨)</span></div></section>';
    h += '<button data-a="agree" aria-pressed="' + V.agree + '" style="display:flex;gap:10px;align-items:center;min-height:44px"><span class="check' + (V.agree ? ' on' : '') + '">' + I.check() + '</span><span style="font-size:14px">픽업 마감일과 환불 불가 안내를 확인했어요</span></button>';
    h += '</div></div><div class="bottom">' + (V.agree && x.sel.length ? '<button class="btn full" data-a="pay">' + won(x.total) + ' 결제하기</button>'
      : '<div class="btn full off">안내를 확인하면 결제할 수 있어요</div>') + '</div>';
    return h;
  }

  function doneView() {
    var o = V.lastOrder;
    return '<div class="scroll"><div class="pad" style="padding-top:calc(32px + var(--safe-t))">' +
      '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center"><div style="width:64px;height:64px;border-radius:32px;background:#C84B08;display:flex;align-items:center;justify-content:center">' + I.check('#fff', 34) + '</div>' +
      '<div style="font-size:22px;font-weight:900">결제 완료! 이제 찾으러만 오세요</div><div class="muted" style="font-size:13px">주문번호 ' + o.no + ' · ' + o.count + '개 상품</div></div>' +
      '<section class="card" style="align-items:center"><div class="muted" style="font-size:13px;font-weight:700">픽업 바코드</div>' + barcode(o.no + '0000000000', 56) +
      '<div style="width:100%;display:flex;flex-direction:column;gap:6px;margin-top:4px"><div class="kv"><span>픽업 예정일</span><b>' + o.pickup + '</b></div>' +
      '<div class="kv"><span>픽업 마감</span><b style="color:#A33D06">' + o.deadline + '</b></div><div class="kv"><span>결제 금액</span><b>' + o.total + '</b></div>' +
      '<div class="kv"><span>적립 포인트</span><b style="color:#C84B08">+' + o.earn + '</b></div></div></section>' +
      '<div class="warn" style="border-width:0"><p>픽업 마감(' + o.deadline + ')이 지나면 <b style="color:#A33D06">환불이 안 돼요.</b> 마감 3일 전에 알림을 한 번 더 보내 드릴게요. 주문은 멤버십 탭에서 다시 볼 수 있어요.</p></div>' +
      '<button class="btn full ink" data-a="home">진열 상품 더 보기</button></div></div>';
  }

  /* ---------- 줄서기 ---------- */
  function queueOf(p) {
    var base = p.raw.queue; if (!base) return null;
    var mine = S.queue[p.id] || 0;
    return { mine: mine, count: base + (mine ? 1 : 0) };
  }
  function queueBox(p) {
    var q = queueOf(p); if (!q) return '';
    var h = '<section class="qbox"><div class="row"><div class="h2">줄서기</div><div class="qcount">지금 <b>' + q.count + '명</b> 줄 서 있어요</div></div>';
    if (!q.mine) {
      h += '<p>밤 10시 재고가 공개되면 <b>줄 선 순서대로 30분 먼저</b> 결제할 수 있어요. 금주의 굿바이템만 줄을 설 수 있어요.</p>' +
        '<button class="btn full" data-a="queue" data-id="' + p.id + '">줄 서기 · ' + (q.count + 1) + '번째</button>';
    } else {
      var msg = !p.night ? '밤 10시에 내 차례가 되면 알림을 보내 드려요.'
        : q.mine <= p.stock ? '<b style="color:#A33D06">내 차례예요!</b> 밤 10시 30분까지 먼저 결제할 수 있어요.'
          : '남은 수량(' + p.stock + '개)보다 순번이 뒤예요. 앞사람이 결제를 포기하면 바로 알려 드려요.';
      h += '<div class="qmine"><small>내 순번</small><strong>' + q.mine + '번</strong></div><p>' + msg + '</p>' +
        '<button class="btn line full" data-a="unqueue" data-id="' + p.id + '">줄 빠지기</button>';
    }
    return h + '</section>';
  }
  function weekRange() {
    var T = today0(), mon = addDays(T, -((T.getDay() + 6) % 7));
    return md(mon) + ' ~ ' + md(addDays(mon, 6));
  }
  function landingView() {
    var items = all().filter(function (p) { return p.raw.week; }).sort(function (a, b) { return a.raw.week - b.raw.week; });
    var h = '<main class="scroll landing"><div class="l-head"><div class="l-top">' +
      '<div class="l-sign"><div><span class="g">GOOD</span><span class="b">-BUY</span></div><svg width="34" height="8" viewBox="0 0 40 9" aria-hidden="true"><path d="M2 2 Q20 12 38 2" fill="none" stroke="#F26A1B" stroke-width="3.5" stroke-linecap="round"/></svg></div>' +
      '<div class="l-week">' + weekRange() + '<br>김포점</div></div>' +
      '<h1 class="l-title">금주의 <em>굿바이템!</em></h1>' +
      '<div class="l-sub">이번 주에만 이 가격 · 다 팔리면 끝</div></div>';
    h += '<div class="slider" role="list" aria-label="금주의 굿바이템">' + items.map(function (p, i) {
      var q = queueOf(p);
      return '<article class="slide" role="listitem">' +
        '<button class="s-img" data-a="open" data-id="' + p.id + '" aria-label="' + p.name + ' 상세 보기"><img src="' + p.imgL + '" alt="' + p.name + '"' + (i > 0 ? ' loading="lazy"' : '') + '><span class="s-rank">' + ('0' + (i + 1)) + '</span>' +
        '<span class="s-pct">' + p.pct + '%</span></button>' +
        '<div class="s-body"><div class="muted" style="font-weight:700">' + p.raw.brand + '</div>' +
        '<button class="s-name" data-a="open" data-id="' + p.id + '">' + p.name + '</button>' +
        '<div class="price"><s>' + won(p.reg) + '</s><span class="now" style="font-size:24px">' + won(p.price) + '</span></div>' +
        '<div class="s-exp"><div><small>' + p.expLabel + '</small><strong>' + (p.exp ? p.expFull.replace('.까지', '') : p.expBig) + '</strong></div><em>' + p.dday + '</em></div>' +
        '<div class="row s-q"><span>' + (q.mine ? '<b style="color:#A33D06">내 순번 ' + q.mine + '번</b> · ' : '') + '줄 선 사람 <b>' + q.count + '명</b>' + (p.night ? ' · 남은 ' + p.stock + '개' : ' · 수량 ??개') + '</span>' +
        (q.mine ? '<button class="pill" data-a="open" data-id="' + p.id + '">내 줄 보기</button>' : '<button class="pill o" data-a="queue" data-id="' + p.id + '">줄 서기</button>') + '</div>' +
        '</div></article>';
    }).join('') + '</div>';
    h += '<div class="dots" aria-hidden="true">' + items.map(function (p, i) { return '<i' + (i === V.slide ? ' class="on"' : '') + '></i>'; }).join('') + '</div>';
    h += '<section class="card l-info"><div class="h2">줄서기가 뭐예요?</div><p>낮에는 매장 손님이 상품을 담아 가서 남은 수량을 몰라요. 미리 줄을 서 두면 밤 10시 재고가 공개될 때 <b>순서대로 30분 먼저</b> 결제할 수 있어요.</p></section>';
    h += '</main><div class="bottom"><button class="btn full" data-a="enter">들어가기</button></div>';
    return h;
  }

  function detailView() {
    var p = byId(V.detail); if (!p) return '';
    var r = p.raw;
    var pct = Math.max(6, Math.min(100, Math.round(p.stock / 60 * 100)));
    var h = '<div class="topbar"><button class="icon-btn" data-a="close" aria-label="목록으로 돌아가기">' + I.back + '</button><div style="font-size:17px;font-weight:900;flex:1">상품 상세</div>' +
      '<button class="icon-btn heart" data-a="wish" data-id="' + p.id + '" aria-label="' + (p.wished ? '찜 해제' : '찜하기') + '" aria-pressed="' + p.wished + '">' + I.heart(p.wished) + '</button></div>';
    h += '<main class="scroll"><div class="hero"><img src="' + p.imgL + '" alt="' + p.name + '"></div><div class="pad" style="padding-top:16px">';
    h += '<section style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;gap:6px;flex-wrap:wrap">' + (r.week ? '<span class="tag week">금주의 굿바이템</span>' : '') + '<span class="tag cat">' + p.cat + '</span>' +
      (!p.night ? '<span class="tag hidden">남은 수량 ??개</span>' : p.low ? '<span class="tag low">임박 · ' + p.stock + '개 남음</span>' : '') + '</div>' +
      '<div class="muted" style="font-weight:700">' + r.brand + '</div><div style="font-size:21px;font-weight:900;line-height:1.3">' + p.name + '</div>' +
      '<div class="price big"><s>' + won(p.reg) + '</s><span class="pct">' + p.pct + '%</span><span class="now">' + won(p.price) + '</span></div></section>';
    h += '<div class="expbar"><div><small>' + p.expLabel + '</small><strong>' + p.expBig + '</strong></div><em>' + p.dday + '</em></div>';
    h += p.steps ? '<section class="steps"><div class="row" style="align-items:baseline"><div class="h2">가격 단계</div><div class="muted">폐기 3일 전까지 5단계 · 5%씩</div></div>' +
      p.steps.map(function (st, i) {
        return '<div class="step' + (i === 0 ? ' now' : '') + (st.store ? ' store' : '') + '"><span class="n">' + (i === 0 ? '지금' : st.n + '단계') + '</span><span class="d">' + md(st.from) + ' ~ ' + md(st.to) + (st.store ? '<em>매장 현장 판매</em>' : '') + '</span><b>' + won(st.price) + '</b></div>';
      }).join('') + (p.steps.some(function (st) { return st.store; }) ? '<p class="steps-note">앱 결제는 픽업 마감(' + mdw(p.dl) + ')까지예요. 그 뒤 단계는 매장에서만 팔아요.</p>' : '') + '</section>'
      : '<section class="steps"><div class="h2">가격 안내</div><p style="margin:0;font-size:13px;line-height:1.7;color:#5E5852">기한이 없는 상품이라 가격이 내려가지 않아요. 다 팔리면 끝나요.</p></section>';
    h += '<div style="display:flex;flex-direction:column;gap:6px"><div class="row" style="font-size:13px"><b>남은 수량 ' + (p.night ? p.stock + '개' : '??개') + '</b><span style="color:#A33D06;font-weight:700">' + (!p.night ? '밤 10시 공개' : p.low ? '거의 다 나갔어요' : '오늘 들어온 수량의 절반 남짓') + '</span></div>' +
      (p.night ? '<div class="bar"><i style="width:' + pct + '%"></i></div>' : '') +
      '<div style="font-size:13px;font-weight:700;color:#A33D06">' + p.urgency + '</div></div>';
    h += queueBox(p);
    h += '<section class="card" style="gap:8px"><div class="h2">상품 소개</div><p style="margin:0;font-size:14px;line-height:1.7">' + r.desc + '</p></section>';
    h += '<section class="card" style="gap:8px"><div class="h2">상품 정보</div>' +
      '<div class="kv"><span>브랜드</span><b>' + r.brand + '</b></div><div class="kv"><span>용량·구성</span><b>' + r.size + '</b></div>' +
      '<div class="kv"><span>보관 방법</span><b style="text-align:right;max-width:62%">' + r.keep + '</b></div>' +
      '<div class="kv"><span>소비기한</span><b>' + p.expFull + '</b></div><div class="kv"><span>정상가</span><b>' + won(p.reg) + '</b></div></section>';
    h += '<section class="card" style="gap:8px;background:#FFF0E5;box-shadow:none"><div class="h2" style="color:#A33D06">왜 이 가격인가요?</div><p style="margin:0;font-size:14px;line-height:1.7">' + r.why + ' 품질에는 문제가 없는 새 상품이에요.</p></section>';
    h += '<section class="card" style="gap:6px"><div class="h2">픽업 안내</div><p style="margin:0;font-size:13px;line-height:1.7;color:#5E5852">' + p.pickupRule + '하셔야 해요. <b style="color:#A33D06">마감이 지나면 환불이 안 돼요.</b><br>김포점 픽업대 · 10:00~22:00 · 멤버십 바코드로 찾아가요.</p></section>';
    h += '</div></main><div class="bottom" style="display:flex;gap:8px"><button class="btn line" style="flex:1;min-height:52px" data-a="wish" data-id="' + p.id + '">' + (p.wished ? '찜 해제' : '찜하기') + '</button>' +
      (p.night && p.stock > 0 ? '<button class="btn" style="flex:1.4;min-height:52px" data-a="buyNow" data-id="' + p.id + '">바로 픽업 결제</button>'
        : '<div class="btn off" style="flex:1.4;min-height:52px">' + (p.night ? '오늘은 다 팔렸어요' : '결제는 밤 10시 재고 공개 후') + '</div>') + '</div>';
    return h;
  }

  /* ---------- 그리기 ---------- */
  var app = document.getElementById('app');
  var scrollMemo = {};
  function render() {
    var sc = app.querySelector('.scroll');
    var key = V.detail ? 'detail' : V.screen + ':' + V.tab;
    if (sc && render.lastKey) scrollMemo[render.lastKey] = sc.scrollTop;
    var h;
    if (V.detail) h = detailView();
    else if (V.screen === 'landing') h = landingView();
    else if (V.screen === 'checkout') h = checkoutView();
    else if (V.screen === 'done') h = doneView();
    else {
      var body = V.tab === 'incoming' ? incomingView() : V.tab === 'wish' ? wishView() : V.tab === 'treasure' ? treasureView() : V.tab === 'member' ? memberView() : homeView();
      h = header() + '<main class="scroll"><div class="pad">' + body + '</div></main>' + nav();
    }
    app.innerHTML = h;
    var nsc = app.querySelector('.scroll');
    if (nsc && scrollMemo[key] != null && (render.lastKey === key || render.lastKey === 'detail')) nsc.scrollTop = scrollMemo[key];
    render.lastKey = key;
    var sl = app.querySelector('.slider');
    if (sl && sl.children[V.slide]) sl.scrollLeft = sl.children[V.slide].offsetLeft - sl.children[0].offsetLeft;
  }
  var toastT;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 1700);
  }

  /* ---------- 동작 ---------- */
  var A = {
    tab: function (id) { V.tab = id; scrollMemo[V.screen + ':' + id] = 0; },
    filter: function (id) { V.filter = id; },
    open: function (id) { V.detail = id; scrollMemo.detail = 0; },
    close: function () { V.detail = null; },
    wish: function (id) {
      if (S.wish[id]) { delete S.wish[id]; toast('찜을 뺐어요'); } else { S.wish[id] = true; toast('찜했어요 · 찜 탭에서 픽업 결제할 수 있어요'); }
      save();
    },
    wishIn: function (id) {
      if (S.wishIn[id]) { delete S.wishIn[id]; toast('입고 알림을 껐어요'); } else { S.wishIn[id] = true; toast('입고되면 알림을 보내 드릴게요'); }
      save();
    },
    sel: function (id) { if (S.unsel[id]) delete S.unsel[id]; else S.unsel[id] = true; save(); },
    demo: function () {
      var night = isNight();
      S.demo = night ? 'day' : 'night';
      save();
      toast(night ? '낮 2시 화면이에요 (시연)' : '밤 10시, 오늘 남은 재고가 공개됐어요');
    },
    realClock: function () { S.demo = null; save(); toast('지금 시각 기준으로 보여 드려요'); },
    checkout: function () { V.screen = 'checkout'; V.pickIdx = 0; V.agree = false; },
    buyNow: function (id) { S.wish[id] = true; delete S.unsel[id]; save(); V.detail = null; A.checkout(); },
    backWish: function () { V.screen = 'tabs'; V.tab = 'wish'; },
    pick: function (id) { V.pickIdx = +id; },
    agree: function () { V.agree = !V.agree; },
    pay: function () {
      var x = selection(); if (!x.sel.length) return;
      var base = new Date().getHours() < OPEN_H && !S.demo ? 0 : 1;
      var T = today0();
      x.sel.forEach(function (p) { S.sold[p.id] = (S.sold[p.id] || 0) + 1; delete S.wish[p.id]; });
      S.points += x.earn;
      S.history.unshift({ label: '구매 적립 (' + x.sel.length + '개 상품)', date: md(T), pts: x.earn });
      var o = {
        no: 'GB-' + (T.getMonth() + 1) + T.getDate() + '-' + String(1000 + Math.floor(Math.random() * 9000)),
        count: x.sel.length, total: won(x.total), earn: x.earn.toLocaleString('ko-KR') + 'P',
        pickup: mdw(addDays(T, base + V.pickIdx)), deadline: mdw(x.dl),
        title: x.sel[0].name + (x.sel.length > 1 ? ' 외 ' + (x.sel.length - 1) + '개' : '')
      };
      S.orders.unshift(o); save();
      V.lastOrder = o; V.screen = 'done';
    },
    home: function () { V.screen = 'tabs'; V.tab = 'home'; },
    enter: function () { V.screen = 'tabs'; V.tab = 'home'; },
    landing: function () { V.screen = 'landing'; },
    queue: function (id) {
      var p = byId(id); if (!p || !p.raw.queue || S.queue[id]) return;
      S.queue[id] = p.raw.queue + 1; save();
      toast(S.queue[id] + '번째로 줄 섰어요 · 밤 10시에 알려 드려요');
    },
    unqueue: function (id) { delete S.queue[id]; save(); toast('줄에서 빠졌어요'); },
    zone: function (id) {
      var t = treasure(), i = +id;
      if (t.found || t.tries <= 0 || t.opened[i]) return;
      t.opened[i] = true; t.tries -= 1;
      if (i === 6) {
        t.found = true; S.points += 500;
        S.history.unshift({ label: '보물찾기 골드 태그 발견', date: md(today0()), pts: 500 });
        toast('골드 태그 발견! 500P 적립');
      }
      save();
    },
    reset: function () {
      if (!window.confirm('찜·포인트·주문 기록을 처음 상태로 되돌릴까요?')) return;
      S = fresh(); save(); V.tab = 'home'; toast('처음 상태로 되돌렸어요');
    }
  };

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-a]');
    if (!el || !app.contains(el)) return;
    var fn = A[el.getAttribute('data-a')];
    if (fn) { fn(el.getAttribute('data-id')); render(); }
  });
  app.addEventListener('scroll', function (e) {
    var sl = e.target; if (!sl.classList || !sl.classList.contains('slider')) return;
    var w = sl.children[0].offsetWidth + 12, i = Math.round(sl.scrollLeft / w);
    if (i === V.slide) return;
    V.slide = i;
    var dots = app.querySelectorAll('.dots i');
    for (var k = 0; k < dots.length; k++) dots[k].className = k === i ? 'on' : '';
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && V.detail) { V.detail = null; render(); } });
  // 시계: 1분마다 다시 그려 밤 10시가 되면 자동으로 공개
  setInterval(function () { if (!V.detail && V.screen === 'tabs') render(); }, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });

  render();
})();
