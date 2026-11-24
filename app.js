/* 굿바이마켓 회원 앱 — 발표 시연용 (예시 데이터, 결제는 흉내만) */
(function () {
  'use strict';

  var KEY = 'goodbye-app-v1';
  var DOW = '일월화수목금토';
  var OPEN_H = 10, CLOSE_H = 22;

  /* ---------- 예시 데이터 (소비기한은 오늘 기준 남은 일수) ---------- */
  var PRODUCTS = [
    { id: 'g5', name: '오리온 촉촉한 황치즈칩 320g', cat: '식품 · 상온', group: 'food', reg: 7980, price: 3990, stock: 48, days: 70, week: 1, queue: 152, reason: '포장 훼손',
      brand: '오리온', size: '320g (20g × 16봉)', keep: '실온 보관 · 직사광선 피하기',
      desc: '구하기 어렵다는 2026 한정판 황치즈칩이에요. 겉은 바삭, 속은 촉촉한 쿠키에 황치즈 청크가 콕콕 박혀 있어요.',
      why: '물류 이동 중 겉 상자가 눌리고 찢겨(포장 훼손) 매대에 못 올라간 상품이에요. 안의 낱개 봉지는 뜯기지 않은 새것이에요.' },
    { id: 'g4', name: '코코이찌방야 카레우동 347g', cat: '식품 · 냉동', group: 'food', reg: 8990, price: 4900, stock: 32, days: 58, week: 2, queue: 63,
      brand: '테이블마크', size: '347g (1인분)', keep: '냉동 보관 (-18℃ 이하)',
      desc: '일본 카레 전문점 코코이찌방야 감수 카레우동이에요. 쫄깃한 냉동 우동에 카레 수프가 함께 들어 있어 데우기만 하면 돼요.',
      why: '점포 냉동 매대를 정리하며 모은 상품이에요. 소비기한이 두 달 가까이 남아 있어요.' },
    { id: 'g1', name: '뉴 슈퍼마리오브라더스 U 디럭스', cat: '게임', group: 'life', reg: 64800, price: 34900, stock: 12, days: null, week: 3, queue: 41,
      brand: '닌텐도 스위치', size: '닌텐도 스위치용 게임 칩 1개 (한국어판)', keep: '실온 보관 · 전체 이용가',
      desc: '마리오와 친구들이 함께 달리는 횡스크롤 게임이에요. 최대 4명이 함께 할 수 있어 가족 게임으로 좋아요.',
      why: '새 시리즈가 나오면서 점포 진열에서 빠진 예전 타이틀이에요. 포장을 뜯지 않은 새 상품이에요.' },
    { id: 'g3', name: '스카프 6장 9,900원', cat: '패션잡화', group: 'life', reg: 29400, price: 9900, stock: 40, days: null, week: 4, queue: 124,
      brand: '남대문 스카프 아저씨', size: '스카프 6장 한 묶음 (색·무늬 랜덤)', keep: '손세탁 권장 · 그늘에서 말리기',
      desc: '남대문 시장에서 입소문 난 스카프를 6장 한 묶음으로 담았어요. 목에 두르고, 가방에 묶고, 머리띠로도 써요. 색과 무늬는 랜덤이에요.',
      why: '남대문 스카프 아저씨와 함께하는 이번 주 특별 기획이에요. 한 장에 1,650원꼴이에요.' },
    { id: 'g2', name: '포켓몬스터 태그스타 박스', cat: '완구', group: 'life', reg: 17900, price: 7900, stock: 24, days: null, week: 5, queue: 87,
      brand: '포켓몬스터', size: '박스 1개 (6세 이상)', keep: '실온 보관 · 6세 이상',
      desc: '몬스터볼 무늬가 들어간 빨간 수납 박스예요. 포켓몬을 좋아하는 아이 선물로 인기가 많아요.',
      why: '행사 매대에서 빠진 뒤 점포마다 몇 개씩 남은 상품을 모았어요.' },
    { id: 'n1', name: '신라면 120g×20 (라면 박스)', cat: '식품 · 상온', group: 'food', reg: 16600, price: 9900, stock: 14, days: 45,
      brand: '농심', size: '2.4kg (120g × 20봉)', keep: '실온 보관 · 직사광선 피하기',
      desc: '한 박스 20봉 그대로예요. 봉지당 495원꼴이라 쟁여 두기 좋아요.',
      why: '박스 행사가 끝나고 점포마다 몇 박스씩 남은 물량이에요.' },
    { id: 'n2', name: '햇반 210g×12', cat: '식품 · 상온', group: 'food', reg: 14980, price: 8990, stock: 22, days: 55,
      brand: 'CJ', size: '2.52kg (210g × 12개)', keep: '실온 보관',
      desc: '전자레인지에 2분이면 되는 즉석밥이에요. 한 개 749원꼴이에요.',
      why: '묶음 포장이 바뀌면서 예전 포장 상품을 모았어요.' },
    { id: 'n3', name: '동원 살코기참치 135g×4', cat: '식품 · 상온', group: 'food', reg: 12680, price: 6990, stock: 35, days: 75,
      brand: '동원', size: '540g (135g × 4캔)', keep: '실온 보관 · 개봉 후 냉장',
      desc: '찌개, 김치볶음밥, 샌드위치에 두루 쓰는 기본 참치예요.',
      why: '명절 선물세트를 풀고 남은 낱개 묶음이에요.' },
    { id: 'n4', name: '맥심 모카골드 마일드 220입', cat: '식품 · 상온', group: 'food', reg: 34710, price: 19900, stock: 8, days: 62,
      brand: '동서', size: '2.64kg (12g × 220개)', keep: '실온 보관 · 습기 피하기',
      desc: '사무실과 집에서 가장 많이 찾는 커피믹스 대용량이에요. 한 개 90원꼴이에요.',
      why: '기획 상자 디자인이 바뀌며 남은 예전 상자예요. 내용물은 같아요.' },
    { id: 'n5', name: '잘풀리는집 순수한 3겹 30롤', cat: '생활용품', group: 'life', reg: 29900, price: 13900, stock: 19, days: null,
      brand: '잘풀리는집', size: '33m × 30롤 (3겹)', keep: '습기 없는 곳에 보관',
      desc: '3겹 33m 롤 화장지 30롤이에요. 한 롤 463원꼴이에요.',
      why: '겉 포장 비닐이 조금 찢겨 매대에서 빠진 상품이에요. 안의 화장지는 새것이에요.' },
    { id: 'n6', name: '스팸 클래식 200g×3', cat: '식품 · 상온', group: 'food', reg: 9980, price: 5990, stock: 41, days: 80,
      brand: 'CJ', size: '600g (200g × 3캔)', keep: '실온 보관 · 개봉 후 냉장',
      desc: '구워서 밥반찬으로, 부대찌개에 넣어도 좋은 스팸 클래식 3캔이에요.',
      why: '선물세트에서 나온 낱개를 3캔씩 다시 묶었어요.' },
    { id: 'n7', name: '백설 식용유 1.8L', cat: '식품 · 상온', group: 'food', reg: 8480, price: 4990, stock: 26, days: 66,
      brand: '백설', size: '1.8L (콩기름 100%)', keep: '실온 보관 · 직사광선 피하기',
      desc: '부침, 볶음, 튀김에 두루 쓰는 콩기름이에요.',
      why: '점포마다 한두 병씩 남은 재고를 모았어요.' },
    { id: 'p1', name: '오뚜기 XO 물만두 378g×2', cat: '식품 · 냉동', group: 'food', reg: 8980, price: 3590, stock: 18, days: 48, week: 7, queue: 11,
      brand: '오뚜기', size: '756g (378g × 2봉)', keep: '냉동 보관 (-18℃ 이하)',
      desc: '얇은 피에 고기와 채소 소를 채운 물만두예요. 끓는 물에 삶아도, 라면이나 만둣국에 넣어도 좋아요.',
      why: '점포마다 몇 봉씩 남은 상품을 한곳에 모았어요. 소비기한이 한 달 반쯤 남아 있어요.' },
    { id: 'p2', name: '포스트 그래놀라 크랜베리아몬드 570g', cat: '식품 · 상온', group: 'food', reg: 9980, price: 3990, stock: 42, days: 41,
      brand: '포스트', size: '570g', keep: '실온 보관 · 개봉 후 밀봉',
      desc: '크랜베리와 아몬드가 들어간 그래놀라예요. 우유나 요거트에 곁들여 아침으로 먹기 좋아요.',
      why: '시즌 기획이 끝나 매대에서 빠진 상품이에요.' },
    { id: 'p3', name: '팔도 비빔면 130g×5', cat: '식품 · 상온', group: 'food', reg: 4680, price: 1890, stock: 9, days: 52,
      brand: '팔도', size: '650g (130g × 5개)', keep: '실온 보관',
      desc: '새콤달콤한 비빔장이 들어 있는 비빔면이에요. 삶아서 찬물에 헹군 뒤 비벼 드세요.',
      why: '여름 행사 뒤 점포에 남은 물량이에요.' },
    { id: 'p4', name: '이디야 핸드드립 에티오피아 8g×7', cat: '식품 · 상온', group: 'food', reg: 6490, price: 2590, stock: 56, days: 70,
      brand: '이디야', size: '56g (8g × 7개)', keep: '실온 보관 · 직사광선 피하기',
      desc: '컵에 걸어 뜨거운 물만 부으면 되는 드립백 커피예요. 사무실이나 캠핑에 챙기기 좋아요.',
      why: '포장이 바뀌어 예전 포장 상품을 모았어요.' },
    { id: 'p5', name: '퐁퐁 베이킹소다 리필 2L', cat: '생활용품', group: 'life', reg: 8900, price: 3500, stock: 27, days: null,
      brand: '퐁퐁', size: '2L 리필', keep: '실온 보관 · 어린이 손이 닿지 않는 곳',
      desc: '쓰던 용기에 옮겨 담아 쓰는 주방세제 리필이에요. 대용량이라 오래 써요.',
      why: '점포마다 한두 개씩 남은 재고를 모았어요. 생활용품이라 기한이 없어요.' },
    { id: 'p6', name: '옥스포드 블록생활 공룡친구들', cat: '완구', group: 'life', reg: 39900, price: 14900, stock: 6, days: null, week: 6, queue: 9,
      brand: '옥스포드', size: '블록 세트 1개 (38개월 이상)', keep: '작은 부품이 있어 36개월 미만 어린이는 사용 금지',
      desc: '공룡 친구들을 조립하며 노는 블록 세트예요. 선물용으로도 좋아요.',
      why: '시즌이 지나 점포 진열에서 빠진 완구예요. 상자 그대로 새 상품이에요.' }
  ];
  var INCOMING = [
    { id: 'i1', brand: 'CJ 비비고', name: '한입떡갈비 320g', cat: '식품 · 냉동', reg: 6980, from: 2990, days: 60, when: 1, canWish: true, fans: 214 },
    { id: 'i2', brand: '농심', name: '육개장 사발면 86g×6', cat: '식품 · 상온', reg: 6120, from: 2490, days: 50, when: 1, canWish: true, fans: 158 },
    { id: 'i3', brand: '레고', name: '스쿠데리아 페라리 HP 헬멧 (43022)', cat: '완구 · 14세 이상', reg: 139900, from: 69900, days: null, when: 1, canWish: false, fans: 0 },
    { id: 'i4', brand: '켈로그', name: '에너지바 크런치넛 160g', cat: '식품 · 상온', reg: 6190, from: 2490, days: 44, when: 3, canWish: false, fans: 0 },
    { id: 'i5', brand: '피죤', name: '섬유유연제 핑크로즈 2.9L', cat: '생활용품', reg: 10820, from: 4900, days: null, when: 3, canWish: true, fans: 0 }
  ];
  /* ---------- 카테고리 (마트식 대분류 > 중분류 · 매장은 상온·냉동·비식품만) ---------- */
  var CATS = [
    { id: 'frozen', name: '냉동식품', subs: ['만두', '면·간편식', '떡갈비·육가공', '튀김·너겟', '아이스크림'] },
    { id: 'noodle', name: '라면·즉석', subs: ['봉지라면', '컵라면', '즉석밥', '국·카레·짜장'] },
    { id: 'snack', name: '과자·시리얼', subs: ['스낵', '쿠키·비스킷', '초콜릿·사탕', '시리얼·그래놀라', '에너지바'] },
    { id: 'drink', name: '커피·음료', subs: ['커피믹스', '드립백·원두', '차', '생수·음료'] },
    { id: 'can', name: '통조림·양념', subs: ['참치·햄', '식용유', '장류·소스', '조미료'] },
    { id: 'paper', name: '화장지·위생', subs: ['화장지', '키친타월', '물티슈', '생리대·기저귀'] },
    { id: 'wash', name: '세제·세탁', subs: ['주방세제', '세탁세제', '섬유유연제', '청소용품'] },
    { id: 'kitchen', name: '주방·수납', subs: ['밀폐용기', '주방소품', '수납정리'] },
    { id: 'toy', name: '완구·게임', subs: ['게임', '블록', '캐릭터 완구', '보드게임'] },
    { id: 'fashion', name: '패션잡화', subs: ['스카프·소품', '양말·속옷', '가방'] },
    { id: 'stat', name: '문구·팬시', subs: ['필기구', '노트·다이어리', '팬시'] }
  ];
  var CAT_OF = {
    g5: ['snack', '쿠키·비스킷'], g4: ['frozen', '면·간편식'], g1: ['toy', '게임'], g3: ['fashion', '스카프·소품'], g2: ['toy', '캐릭터 완구'],
    n1: ['noodle', '봉지라면'], n2: ['noodle', '즉석밥'], n3: ['can', '참치·햄'], n4: ['drink', '커피믹스'], n5: ['paper', '화장지'],
    n6: ['can', '참치·햄'], n7: ['can', '식용유'], p1: ['frozen', '만두'], p2: ['snack', '시리얼·그래놀라'], p3: ['noodle', '봉지라면'],
    p4: ['drink', '드립백·원두'], p5: ['wash', '주방세제'], p6: ['toy', '블록'],
    i1: ['frozen', '떡갈비·육가공'], i2: ['noodle', '컵라면'], i3: ['toy', '블록'], i4: ['snack', '에너지바'], i5: ['wash', '섬유유연제']
  };
  function catName(id) { for (var k = 0; k < CATS.length; k++) if (CATS[k].id === id) return CATS[k].name; return ''; }
  function catPath(id) { var c = CAT_OF[id]; return c ? catName(c[0]) + ' · ' + c[1] : ''; }

  /* 기부: 판매 금액의 0.1% (1,000원당 1원) */
  var DONATE = 0.001;
  function donation(n) { return Math.max(1, Math.round(n * DONATE)); }


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
      orders: [], queue: {}, donated: 20,
      treasure: { date: '', tries: 3, opened: {}, found: false },
      demo: null
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
  if (!S.queue) S.queue = {};
  if (S.donated == null) S.donated = 20;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* 화면 상태 (저장 안 함) */
  var V = { slide: 0, tab: 'home', screen: 'landing', cat: 'all', sub: null, low: false, q: '', detail: null, pickIdx: 0, agree: false, lastOrder: null };

  function isNight() {
    if (S.demo === 'night') return true;
    if (S.demo === 'day') return false;
    var h = new Date().getHours();
    return h >= CLOSE_H || h < OPEN_H;
  }
  function treasure() {
    var t = ymd(today0());
    if (S.treasure.date !== t || !S.treasure.v3) { S.treasure = { date: t, v3: true, tries: window.GBHunt ? GBHunt.TRIES : 5, opened: {}, found: false }; save(); }
    return S.treasure;
  }

  var STEPS = 5, STEP_PCT = 5, DISPOSE_BEFORE = 1;
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
      raw: p, id: p.id, name: p.name, c1: CAT_OF[p.id][0], c2: CAT_OF[p.id][1], path: catPath(p.id), give: donation(p.price), img: 'img/' + p.id + '.webp', imgL: 'img/' + p.id + '-l.webp', cat: p.cat, group: p.group, price: p.price, reg: p.reg,
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
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5E5852" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
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
      h += '<section class="sbar day"><div class="row"><span class="onoff"><b class="on">매장 ON</b><i>·</i><b class="off">온라인 OFF</b></span>' +
        '<button class="demo" data-a="demo">시연: 밤 10시</button></div>' +
        '<p>지금은 매장 고객님들이 담고 있어서 남은 수량이 정확하지 않아요. 밤 10시에 주문 가능한 재고를 확인할 수 있어요.</p></section>';
    } else {
      h += '<section class="sbar night"><div class="row"><span class="onoff"><b class="off">매장 OFF</b><i>·</i><b class="on">온라인 ON</b></span>' +
        '<button class="demo" data-a="demo">' + (S.demo ? '시연: 낮으로' : '시연: 낮 화면') + '</button></div>' +
        '<p>밤 10시 이후부터 온라인 주문 가능해요</p></section>';
    }

    h += '<div class="search">' + I.search + '<input id="q" type="search" placeholder="상품·브랜드 검색 (예: 라면, 커피, 레고)" value="' + esc(V.q) + '" autocomplete="off" enterkeyhint="search" aria-label="상품 검색">' +
      '<button class="clr" data-a="clearQ" aria-label="검색어 지우기">' + I.x + '</button></div>';
    h += '<div id="plist" style="display:flex;flex-direction:column;gap:14px">' + listHtml() + '</div>';
    h += '<div class="note">시연용 예시 상품 · 가격·수량·기한은 설명을 위한 값이에요</div>';
    return h;
  }

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function norm(t) { return String(t).toLowerCase().replace(/\s+/g, ''); }
  function hit(q, parts) { return norm(parts.join(' ')).indexOf(q) >= 0; }
  function listHtml() {
    var night = isNight(), items = all(), h = '';
    var q = norm(V.q);
    if (q) {
      var found = items.filter(function (p) { return hit(q, [p.name, p.raw.brand, catName(p.c1), p.c2, p.raw.cat]); });
      var inc = INCOMING.filter(function (it) { return hit(q, [it.name, it.brand, catPath(it.id), it.cat]); });
      h += '<div class="row" style="align-items:baseline"><div class="h2">\u2018' + esc(V.q) + '\u2019 검색 결과 ' + found.length + '개</div>' + (inc.length ? '<button class="muted" data-a="tab" data-id="incoming" style="color:#A33D06;font-weight:700">입고 예정 ' + inc.length + '개 \u203a</button>' : '') + '</div>';
      if (!found.length) h += '<div class="card" style="display:block;text-align:center;font-size:14px;line-height:1.6;padding:22px">지금 진열된 상품 중에는 없어요.' + (inc.length ? '<br><b style="color:#A33D06">입고 예정</b>에 ' + inc.length + '개가 있어요.' : '<br>매일 새 재고가 들어와요. 다시 찾아 주세요.') + '</div>';
      h += found.map(card).join('');
      if (inc.length) h += '<div class="h2" style="margin-top:4px">입고 예정에도 있어요</div>' + inc.map(function (it) {
        return '<button class="card" data-a="tab" data-id="incoming" style="flex-direction:row;align-items:center;gap:10px;padding:12px 14px;border:1px dashed #9A928A;box-shadow:none;width:100%"><img class="thumb sm" src="img/' + it.id + '.webp" alt="">' +
          '<div style="flex:1"><div style="font-size:14px;font-weight:700">' + it.brand + ' ' + it.name + '</div><div class="muted">' + catPath(it.id) + ' · ' + mdw(addDays(today0(), it.when)) + ' 입고 예정</div></div>' +
          '<div style="font-size:14px;font-weight:900;color:#C84B08">' + won(it.from) + '~</div></button>';
      }).join('');
      return h;
    }
    var cnt = function (c1, c2) { return items.filter(function (p) { return p.c1 === c1 && (!c2 || p.c2 === c2); }).length; };
    h += '<div class="cats" role="group" aria-label="카테고리">' +
      '<button class="ctile" data-a="cat" data-id="all" aria-pressed="' + (V.cat === 'all') + '"><b>전체</b><small>' + items.length + '개</small></button>' +
      CATS.map(function (c) {
        var n = cnt(c.id);
        return '<button class="ctile' + (n ? '' : ' empty') + '" data-a="cat" data-id="' + c.id + '" aria-pressed="' + (V.cat === c.id) + '"><b>' + c.name + '</b><small>' + (n ? n + '개' : '입고 준비') + '</small></button>';
      }).join('') + '</div>';
    var C = CATS.filter(function (c) { return c.id === V.cat; })[0];
    h += '<div class="subs" role="group" aria-label="세부 분류">' +
      (C ? '<button class="pill" data-a="sub" data-id="" aria-pressed="' + !V.sub + '">' + C.name + ' 전체</button>' + C.subs.map(function (sb) {
        var n = cnt(C.id, sb);
        return '<button class="pill' + (n ? '' : ' zero') + '" data-a="sub" data-id="' + sb + '" aria-pressed="' + (V.sub === sb) + '">' + sb + ' <span>' + n + '</span></button>';
      }).join('') : '') +
      '<button class="pill o" data-a="low" aria-pressed="' + V.low + '">임박만</button></div>';
    var list = items.filter(function (p) {
      if (C && p.c1 !== C.id) return false;
      if (C && V.sub && p.c2 !== V.sub) return false;
      if (V.low) return night && p.low;
      return true;
    });
    if (!list.length) {
      h += '<div class="card" style="display:block;text-align:center;font-size:14px;line-height:1.6;padding:22px">' +
        (V.low && !night ? '임박 상품은 남은 수량이 공개되는<br><b style="color:#A33D06">밤 10시</b>에 보여 드려요'
          : V.low ? '이 분류에는 지금 임박 상품이 없어요'
            : '지금 진열된 상품이 없어요.<br>재고가 모이면 바로 채워져요.<br><button data-a="tab" data-id="incoming" style="color:#A33D06;font-weight:700;min-height:36px">입고 예정 보기 \u203a</button>') + '</div>';
    }
    return h + list.map(card).join('');
  }

  function card(p) {
    var badge = !p.night ? '<span class="tag hidden">남은 수량 ??개</span>'
      : p.low ? '<span class="tag low">임박 · ' + p.stock + '개 남음</span>'
        : '<span class="muted">남은 수량 ' + p.stock + '개</span>';
    return '<article class="card">' +
      '<div class="row"><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="tag cat">' + p.path + '</span>' + badge + '</div>' +
      '<button class="icon-btn heart" data-a="wish" data-id="' + p.id + '" aria-label="' + p.name + (p.wished ? ' 찜 해제' : ' 찜하기') + '" aria-pressed="' + p.wished + '">' + I.heart(p.wished) + '</button></div>' +
      '<button class="p-main" data-a="open" data-id="' + p.id + '"><img class="thumb" src="' + p.img + '" alt="" loading="lazy"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">' +
      '<div class="p-name">' + p.name + '</div>' +
      '<div class="price"><s>' + won(p.reg) + '</s><span class="pct">' + p.pct + '%</span><span class="now">' + won(p.price) + '</span></div></div>' +
      '<div class="exp"><small>' + p.expLabel + '</small><strong>' + p.expBig + '</strong><em>' + p.dday + '</em></div></button>' +
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
        : '<span class="tag cat">입고 준비 중</span>';
      return '<article class="card" style="gap:8px"><div class="row"><div style="display:flex;gap:6px">' + tags + '</div>' + right + '</div>' +
        '<div style="display:flex;gap:12px;align-items:center">' + '<img class="thumb" src="img/' + it.id + '.webp" alt="">' +
        '<div class="inc-body" style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px"><div class="muted" style="font-weight:700">' + it.brand + ' · ' + catPath(it.id) + '</div><div class="p-name">' + it.name + '</div>' +
        '<div class="row" style="align-items:baseline"><div style="font-size:13px;color:#5E5852">' + (it.days != null ? '소비기한 <b style="color:#2B2B2B;font-size:15px">' + exp + '</b>' : '<b style="color:#2B2B2B;font-size:15px">기한 없는 상품</b>') + '</div>' +
        '<div class="from"><s>' + won(it.reg) + '</s> ' + won(it.from) + '<span>부터 시작</span></div></div></div></div></article>';
    };
    var h = '<section class="truck"><div class="row"><div style="display:flex;gap:8px;align-items:center;font-size:15px;font-weight:900;white-space:nowrap">' + I.truck('#FFB27A') + '우리 매장으로 이동 중</div>' +
      '<div style="font-size:13px;font-weight:700;color:#FFB27A;white-space:nowrap">' + md(addDays(T, 1)) + ' 오전 진열</div></div></section>';
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
    return { items: items, sel: sel, total: total, earn: Math.floor(total * 0.01), give: total ? donation(total) : 0, dl: dl };
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
      h += '<div class="sum"><div><small>선택 ' + x.sel.length + '개' + (x.give ? ' · 기부 ' + won(x.give) + ' 적립' : '') + '</small><strong>' + won(x.total) + '</strong></div>' +
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
    var t = treasure(), n = window.GBHunt ? GBHunt.TRIES : 5;
    var msg = t.found ? '오늘 골드 태그를 찾았어요! 500P 적립 완료' : t.tries <= 0 ? '동기찬스로 기회 3회를 더 받아요' : '오늘 남은 기회 ' + t.tries + '번';
    return '<section class="gold"><div class="k">오늘의 보물찾기 이벤트</div><div style="font-size:19px;font-weight:900">매장 어딘가에 골드 태그가 숨어 있어요</div>' +
      '<div style="font-size:13px;line-height:1.6">앱 속 김포점을 내 캐릭터로 걸어 다니며 매대를 뒤져 보세요. 찾으면 500P! 실제 매장 같은 자리의 골드 태그 상품은 그 자리에서 초특가예요.</div></section>' +
      (t.tries === 0 && !t.found ? '<button class="btn" data-a="huntBonus">' + GBHunt.BONUS_LABEL + '</button>' : '') +
      '<button class="hentry" data-a="hunt"><div class="hstore"><img src="img/hunt/store-s.webp" alt=""><img class="hwho" src="img/hunt/' + (S.avatar === 'm' ? 'm' : 'f') + '-back-1.webp" alt=""><i class="spark s1"></i><i class="spark s2"></i><i class="spark s3"></i></div>' +
      '<div class="htxt"><b>매장 안으로 들어가기</b><span>' + msg + '</span></div></button>' +
      '<section class="card" style="gap:6px"><div class="h2">이렇게 찾아요</div><div style="font-size:13px;line-height:1.8">1. 입구에서 여자·남자 캐릭터를 골라요<br>2. 캐릭터 머리를 누르고 가고 싶은 쪽으로 밀어요<br>3. 코너 이름이나 바닥을 누르면 타닥타닥 걸어가요<br>4. 코너에 도착하면 매대 앞에서 반짝이는 <b>?</b> 를 눌러 뒤져 보세요<br>5. 꽝이면 뜨거운지 차가운지 힌트를 드려요</div></section>';
  }

  function memberView() {
    var h = '<section class="mcard"><div class="row" style="align-items:flex-start"><div><div class="k">MEMBERSHIP</div><div style="font-size:18px;font-weight:900">굿바이 회원님</div></div><span class="grade">보물 사냥꾼</span></div>' +
      '<div class="barcode">' + barcode('8801202611170042', 64) + '<div class="no">8801 2026 1117 0042</div></div>' +
      '<div style="font-size:12px;color:#D6D2CC;text-align:center">계산할 때 보여 주시면 포인트가 쌓여요</div></section>';
    h += '<section class="card" style="flex-direction:row;justify-content:space-between;align-items:center"><div><div class="muted" style="font-size:13px">사용 가능한 포인트</div><div style="font-size:24px;font-weight:900">' + S.points.toLocaleString('ko-KR') + 'P</div></div>' +
      '<div class="muted" style="text-align:right;line-height:1.6">구매 금액의 1% 적립<br>보물 발견 +500P</div></section>';
    var monthGive = Math.round(5500000000 / 12 * DONATE * today0().getDate() / 30 / 10) * 10;
    h += '<section class="give"><div class="row"><div class="h2">내가 함께 쌓은 기부금</div><b class="give-n">' + won(S.donated) + '</b></div>' +
      '<p>굿바이마켓은 판매 금액의 <b>0.1%</b>(1,000원당 1원)를 기부금으로 적립해요. 끝까지 남은 식품은 퇴비로 자원화하고, 생활용품·완구는 기부해요.</p>' +
      '<div class="kv" style="font-size:13px"><span>김포점 이번 달 기부 적립 (예시)</span><b>' + won(monthGive) + '</b></div></section>';
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
    h += '<section class="card" style="gap:8px"><div class="kv"><span>상품 금액</span><b>' + won(x.total) + '</b></div><div class="kv"><span>적립 예정 포인트 (1%)</span><b style="color:#C84B08">+' + x.earn.toLocaleString('ko-KR') + 'P</b></div><div class="kv"><span>기부 적립 (판매 금액의 0.1%)</span><b style="color:#2E7D4F">' + won(x.give) + '</b></div><div class="kv"><span>결제 수단</span><span>시연용 (실제 결제 안 됨)</span></div></section>';
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
      '<div class="kv"><span>적립 포인트</span><b style="color:#C84B08">+' + o.earn + '</b></div>' + (o.give ? '<div class="kv"><span>기부 적립</span><b style="color:#2E7D4F">' + o.give + '</b></div>' : '') + '</div></section>' +
      (o.give ? '<section class="give"><p>이번 결제로 <b>' + o.give + '</b>이 기부금으로 적립됐어요. 판매 금액의 0.1%는 늘 기부해요. 고맙습니다!</p></section>' : '') +
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
        '<div class="s-body"><div class="muted" style="font-weight:700">' + p.raw.brand + (p.raw.reason ? ' <span style="display:inline-block;margin-left:6px;padding:1px 8px;border-radius:999px;background:#2B2B2B;color:#fff;font-size:11px;vertical-align:1px">사유 · ' + p.raw.reason + '</span>' : '') + '</div>' +
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
    h += '<section style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;gap:6px;flex-wrap:wrap">' + (r.week ? '<span class="tag week">금주의 굿바이템</span>' : '') + '<span class="tag cat">' + p.path + '</span>' + (r.reason ? '<span class="tag cat" style="background:#2B2B2B;color:#fff">사유 · ' + r.reason + '</span>' : '') +
      (!p.night ? '<span class="tag hidden">남은 수량 ??개</span>' : p.low ? '<span class="tag low">임박 · ' + p.stock + '개 남음</span>' : '') + '</div>' +
      '<div class="muted" style="font-weight:700">' + r.brand + '</div><div style="font-size:21px;font-weight:900;line-height:1.3">' + p.name + '</div>' +
      '<div class="price big"><s>' + won(p.reg) + '</s><span class="pct">' + p.pct + '%</span><span class="now">' + won(p.price) + '</span></div></section>';
    h += '<div class="expbar"><div><small>' + p.expLabel + '</small><strong>' + p.expBig + '</strong></div><em>' + p.dday + '</em></div>';
    h += p.steps ? '<section class="steps"><div class="row" style="align-items:baseline"><div class="h2">가격 단계</div><div class="muted">소비기한 하루 전까지 5단계 · 5%씩</div></div>' +
      p.steps.map(function (st, i) {
        return '<div class="step' + (i === 0 ? ' now' : '') + (st.store ? ' store' : '') + '"><span class="n">' + (i === 0 ? '지금' : st.n + '단계') + '</span><span class="d">' + md(st.from) + ' ~ ' + md(st.to) + (st.store ? '<em>매장 현장 판매</em>' : '') + '</span><b>' + won(st.price) + '</b></div>';
      }).join('') + (p.steps.some(function (st) { return st.store; }) ? '<p class="steps-note">앱 결제는 픽업 마감(' + mdw(p.dl) + ')까지예요. 그 뒤 단계는 매장에서만 팔아요.</p>' : '') + '<p class="steps-note">소비기한 당일에도 남은 식품은 퇴비로 자원화해요.</p></section>'
      : '<section class="steps"><div class="h2">가격 안내</div><p style="margin:0;font-size:13px;line-height:1.7;color:#5E5852">기한이 없는 상품이라 가격이 내려가지 않아요. 끝까지 남으면 기부해요.</p></section>';
    h += '<div style="display:flex;flex-direction:column;gap:6px"><div class="row" style="font-size:13px"><b>남은 수량 ' + (p.night ? p.stock + '개' : '??개') + '</b><span style="color:#A33D06;font-weight:700">' + (!p.night ? '밤 10시 공개' : p.low ? '거의 다 나갔어요' : '오늘 들어온 수량의 절반 남짓') + '</span></div>' +
      (p.night ? '<div class="bar"><i style="width:' + pct + '%"></i></div>' : '') +
      '<div style="font-size:13px;font-weight:700;color:#A33D06">' + p.urgency + '</div></div>';
    h += queueBox(p);
    h += '<section class="give"><div class="row"><div class="h2">이 상품을 사면 기부가 쌓여요</div><b class="give-n">' + won(p.give) + '</b></div>' +
      '<p>판매 금액의 <b>0.1%</b>(1,000원당 1원)는 기부금으로 적립돼요. ' + won(p.price) + '짜리 이 상품 하나에 <b>' + won(p.give) + '</b>이 쌓여요.' + (p.raw.days == null ? ' 끝까지 팔리지 않은 생활용품·완구도 기부해요.' : '') + '</p></section>';
    h += '<section class="card" style="gap:8px"><div class="h2">상품 소개</div><p style="margin:0;font-size:14px;line-height:1.7">' + r.desc + '</p></section>';
    h += '<section class="card" style="gap:8px"><div class="h2">상품 정보</div>' +
      '<div class="kv"><span>브랜드</span><b>' + r.brand + '</b></div><div class="kv"><span>용량·구성</span><b>' + r.size + '</b></div>' +
      '<div class="kv"><span>보관 방법</span><b style="text-align:right;max-width:62%">' + r.keep + '</b></div>' +
      '<div class="kv"><span>소비기한</span><b>' + p.expFull + '</b></div><div class="kv"><span>정상가</span><b>' + won(p.reg) + '</b></div><div class="kv"><span>기부 적립 (판매가 0.1%)</span><b style="color:#2E7D4F">' + won(p.give) + '</b></div></section>';
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
    if (render.unhunt) { render.unhunt(); render.unhunt = null; }
    if (V.screen === 'hunt' && !V.detail) {
      app.innerHTML = GBHunt.html(treasure(), S.avatar || 'f', S.sound !== false); render.lastKey = 'hunt';
      render.unhunt = GBHunt.mount({
        st: treasure(), save: save, avatar: S.avatar || 'f', sound: S.sound !== false,
        setAvatar: function (a) { S.avatar = a; save(); }, setSound: function (on) { S.sound = on; save(); },
        onFind: function () { S.points += 500; S.history.unshift({ label: '보물찾기 골드 태그 발견', date: md(today0()), pts: 500 }); save(); }
      }, {
        pos: V.huntPos, skipGate: V.huntIn,
        savePos: function (p) { V.huntPos = p; },
        entered: function () { V.huntIn = true; }
      });
      return;
    }
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
    cat: function (id) { V.cat = id; V.sub = null; },
    sub: function (id) { V.sub = id || null; },
    low: function () { V.low = !V.low; },
    clearQ: function () { V.q = ''; },
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
      S.points += x.earn; S.donated += x.give;
      S.history.unshift({ label: '구매 적립 (' + x.sel.length + '개 상품)', date: md(T), pts: x.earn });
      var o = {
        no: 'GB-' + (T.getMonth() + 1) + T.getDate() + '-' + String(1000 + Math.floor(Math.random() * 9000)),
        count: x.sel.length, total: won(x.total), earn: x.earn.toLocaleString('ko-KR') + 'P',
        pickup: mdw(addDays(T, base + V.pickIdx)), deadline: mdw(x.dl),
        give: won(x.give),
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
    hunt: function () { V.screen = 'hunt'; V.huntIn = false; },
    huntBonus: function () { if (GBHunt.claimBonus(treasure())) save(); },
    huntExit: function () { V.screen = 'tabs'; V.tab = 'treasure'; },
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
  app.addEventListener('input', function (e) {
    if (e.target.id !== 'q') return;
    V.q = e.target.value;
    var pl = document.getElementById('plist'); if (pl) pl.innerHTML = listHtml();
  });
  app.addEventListener('keydown', function (e) { if (e.target.id === 'q' && e.key === 'Enter') e.target.blur(); });
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
