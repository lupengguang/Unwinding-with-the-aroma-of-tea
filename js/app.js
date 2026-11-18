/* ============================================================
   解茶香 · 交互脚本
   ============================================================ */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const phone = $('#phone');
  const screenEl = {
    splash: $('#screen-splash'),
    home: $('#screen-home'),
    menu: $('#screen-menu'),
    orders: $('#screen-orders'),
    profile: $('#screen-profile')
  };
  const TAB_ORDER = ['home', 'menu', 'orders', 'profile'];
  const sheets = {
    action: $('#actionSheet'),
    cart: $('#cartSheet'),
    member: $('#memberSheet'),
    store: $('#storeSheet')
  };
  let current = 'splash';
  let splashTimer = null;
  let searchTimer = null;

  /* ---------------- 数据 ---------------- */
  const CATEGORIES = [
    {
      id: 'season', name: '四季茶香',
      banner: ['一壶清茶 · 慢茶时光', 'SEASONAL TEA COLLECTION'],
      products: [
        { id: 'white', name: '白茶系', desc: '雪梨陈皮白茶、寿眉纯茶套餐', price: 20 },
        { id: 'red', name: '红茶系', desc: '苹果热橙荒野红茶、红茶轻乳茶', price: 20 },
        { id: 'rock', name: '岩茶系', desc: '水仙岩茶、岩茶纯茶礼盒、寿眉纯茶套餐', price: 20 },
        { id: 'green', name: '绿茶系', desc: '龙井冷泡、云雾绿茶奶', price: 20 }
      ]
    },
    {
      id: 'fruit', name: '鲜果调茶',
      banner: ['鲜果入茶 · 夏日清欢', 'FRESH FRUIT TEA'],
      products: [
        { id: 'grapefruit', name: '满杯西柚茶', desc: '红心西柚、茉莉初雪、少糖清爽', price: 22 },
        { id: 'grape', name: '青提茉莉冷萃', desc: '阳光青提、冷萃茉莉、鲜果肉', price: 24 },
        { id: 'pear', name: '雪梨桂花乌龙', desc: '砀山雪梨、金桂、炭焙乌龙', price: 21 }
      ]
    },
    {
      id: 'milk', name: '轻乳奶茶',
      banner: ['轻乳一盏 · 温柔半日', 'LIGHT MILK TEA'],
      products: [
        { id: 'rockmilk', name: '岩茶厚乳茶', desc: '肉桂岩茶、轻乳顶、岩骨花香', price: 23 },
        { id: 'osmanthus', name: '桂花乌龙拿铁', desc: '桂花乌龙、鲜牛乳、三分糖', price: 24 },
        { id: 'whitemilk', name: '白茶轻乳', desc: '白牡丹、轻乳、清甜不腻', price: 22 }
      ]
    },
    {
      id: 'cold', name: '清润冷萃',
      banner: ['冷萃慢滴 · 清润回甘', 'COLD BREW TEA'],
      products: [
        { id: 'dancong', name: '冷萃单丛', desc: '凤凰单丛、八小时冷萃、蜜兰香', price: 26 },
        { id: 'lemon', name: '柠檬冷萃绿茶', desc: '香水柠檬、冷萃云雾绿', price: 22 },
        { id: 'peach', name: '蜜桃乌龙冷萃', desc: '水蜜桃、白桃乌龙、气泡感', price: 23 }
      ]
    },
    {
      id: 'snack', name: '茶點小食',
      banner: ['佐茶小点 · 闲情几许', 'TEA SNACKS'],
      products: [
        { id: 'bean', name: '绿豆糕', desc: '手作绿豆糕、清甜细腻、佐茶佳品', price: 12 },
        { id: 'jelly', name: '桂花茶冻', desc: '桂花蜜、白茶冻、入口即化', price: 15 },
        { id: 'cookie', name: '岩茶桃酥', desc: '岩茶粉、桃酥、酥松回甘', price: 16 }
      ]
    }
  ];

  const PRODUCT_INDEX = new Map();
  CATEGORIES.forEach(cat => cat.products.forEach(p => PRODUCT_INDEX.set(p.id, { ...p, cat: cat.name })));

  /* ---------------- 门店数据 ---------------- */
  const STORE_REGIONS = [
    { id: 'gucheng', name: '古城 & 八角', note: '距学院较近' },
    { id: 'lugu', name: '鲁谷 & 八宝山', note: '社区商业集中' },
    { id: 'pingguo', name: '苹果园 & 金顶街', note: '老字号分店' },
    { id: 'other', name: '其他区域', note: '品牌专营店' }
  ];

  const STORES = [
    { id: 'bama-gucheng', region: 'gucheng', name: '八马茶业（石景山古城店）', addr: '石景山区物资总公司底商一层107号', dist: '距学院 380m', tags: ['品牌直营', '距学院近'] },
    { id: 'bama-lvdi', region: 'gucheng', name: '八马茶业（石景山绿地金融城店）', addr: '古城南街9号院绿地环球文化金融城4号楼1层', dist: '620m', tags: ['品牌直营', '商场店'] },
    { id: 'xianpai', region: 'gucheng', name: '仙牌灵芝茶（古城大街店）', addr: '古城街道古城大街20号', dist: '760m', tags: ['特色灵芝茶', '社区店'] },
    { id: 'caomuren', region: 'gucheng', name: '草木人茶艺馆（八角西街店）', addr: '八角西街北口甲17号', dist: '1.1km', tags: ['茶艺馆', '可品茗'] },
    { id: 'zhiyun', region: 'gucheng', name: '芷韵香茗茶庄', addr: '古城北路8号22号楼', dist: '1.3km', tags: ['私房茶庄', '古城北路'] },
    { id: 'wuyutai-gubei', region: 'gucheng', name: '吴裕泰（古城北路店）', addr: '首钢古北居民区古城北路5号楼', dist: '1.5km', tags: ['老字号', '茉莉花茶'] },
    { id: 'wuyutai-bajiao', region: 'gucheng', name: '吴裕泰茶庄（八角店）', addr: '八角南路1号', dist: '1.7km', tags: ['老字号', '距学院较近'] },
    { id: 'boyunxuan', region: 'gucheng', name: '博韵轩茶庄', addr: '古城北路6号（门牌待核实）', dist: '1.9km', tags: ['茶庄', '门牌待核实'] },
    { id: 'junyixuan', region: 'gucheng', name: '君怡轩（中国国际出版大厦店）', addr: '石景山古城，新中式大店，主营六大茶类及私人订制', dist: '2.0km', tags: ['新中式茶空间', '私人订制'] },
    { id: 'xiaochayuan', region: 'gucheng', name: '小茶园', addr: '古城南路48号德义兴商场1层', dist: '2.2km', tags: ['商场店', '平价茶饮'] },

    { id: 'zhangyiyuan-lugu', region: 'lugu', name: '张一元（鲁谷社区店）', addr: '鲁谷南路26号', dist: '2.8km', tags: ['老字号', '社区店'] },
    { id: 'wuyutai-lugu', region: 'lugu', name: '吴裕泰（溢香雅舍茶庄）', addr: '鲁谷大街东侧永辉超市一层C0109122', dist: '3.1km', tags: ['老字号', '超市店'] },
    { id: 'qingshan', region: 'lugu', name: '青衫若素茶叶市集', addr: '永辉超市鲁谷店内', dist: '3.2km', tags: ['茶叶市集', '超市内'] },
    { id: 'dingming', region: 'lugu', name: '鼎茗茶坊（依翠园小区东区店）', addr: '鲁谷南路14号', dist: '2.9km', tags: ['社区茶坊', '依翠园'] },
    { id: 'banyueyuan', region: 'lugu', name: '伴月苑茶城', addr: '鲁谷街道新岚大厦南侧一层', dist: '3.4km', tags: ['茶城', '多品牌'] },

    { id: 'mingcha', region: 'pingguo', name: '茗茶超市', addr: '苹果园南路甲11号（天宇写字楼）', dist: '4.2km', tags: ['茗茶超市', '写字楼'] },
    { id: 'fengping', region: 'pingguo', name: '北京峰平剑毫茶叶销售中心', addr: '苹果园南路甲11号3幢4层B10号', dist: '4.3km', tags: ['茶叶批发', '写字楼'] },
    { id: 'wuyutai-pingguo', region: 'pingguo', name: '吴裕泰（苹果园店）', addr: '石景山区苹果园区域', dist: '4.5km', tags: ['老字号', '苹果园'] },
    { id: 'wuyutai-shijingshan', region: 'pingguo', name: '吴裕泰（石景山店）', addr: '金顶街街道金顶街第二小学院附近', dist: '4.8km', tags: ['老字号', '金顶街'] },
    { id: 'zhangyiyuan-jinding', region: 'pingguo', name: '北京金顶街张一元茶庄', addr: '金顶西街红光金鼎市场一层1M009至1A012号', dist: '5.0km', tags: ['老字号', '市场店'] },

    { id: 'dayi', region: 'other', name: '大益茶（石景山当代商城店）', addr: '阜石路165号院2号楼当代商城165-5-6号', dist: '3.6km', tags: ['普洱专营', '商场店'] },
    { id: 'wuyutai-rongjing', region: 'other', name: '吴裕泰（石景山融景城店）', addr: '京原路19号院2号楼（中储粮油脂大厦旁）', dist: '4.0km', tags: ['老字号', '社区店'] },
    { id: 'wuyutai-xilongduo', region: 'other', name: '吴裕泰（北京喜隆多新国际店）', addr: '阜石路300号喜隆多新国际购物中心2F西侧254商铺', dist: '4.4km', tags: ['老字号', '商场店'] },
    { id: 'zhangyiyuan-badachu', region: 'other', name: '张一元茶庄（八大处店）', addr: '香山南路168-61', dist: '5.6km', tags: ['老字号', '八大处'] },
    { id: 'wuyutai-yangzhuang', region: 'other', name: '吴裕泰茶庄（杨庄店）', addr: '时代花园南路28号院1号楼1层103号', dist: '5.2km', tags: ['老字号', '杨庄'] },
    { id: 'wuyutai-badachu', region: 'other', name: '北京吴裕泰八大处茶行', addr: '香山南路168号院87号', dist: '5.7km', tags: ['老字号', '八大处'] },
    { id: 'tenfu-carrefour', region: 'other', name: '天福茗茶（家乐福石景山店）', addr: '石景山路乙18号家乐福内', dist: '3.3km', tags: ['品牌连锁', '家乐福内'] },
    { id: 'xiaoguancha', region: 'other', name: '小罐茶（北京石景山山姆店）', addr: '阜石路158号山姆会员店内', dist: '3.8km', tags: ['品牌连锁', '山姆店内'] },
    { id: 'dahuangcha', region: 'other', name: '大荒茶（首钢店）', addr: '群明湖大街6号', dist: '6.1km', tags: ['首钢文创', '茶空间'] },
    { id: 'mingxiangge', region: 'other', name: '茗香阁茶馆（城通街26号院店）', addr: '城通街26号院4号楼', dist: '4.9km', tags: ['茶馆', '城通街'] },
    { id: 'charenfang', region: 'other', name: '茶人坊', addr: '古城金融街长安中心26号院附近', dist: '2.4km', tags: ['茶人空间', '长安中心'] },
    { id: 'yuanxintang', region: 'other', name: '缘心堂茶书院', addr: '古城南街9号院绿地环球文化金融城附近', dist: '2.1km', tags: ['茶书院', '绿地金融城'] },
    { id: 'chengzhitang', region: 'other', name: '乘之堂茶生活', addr: '石景山区（小红书推荐茶空间）', dist: '3.0km', tags: ['茶生活', '小红书推荐'] },
    { id: 'minxiongwei', region: 'other', name: '北京市闽雄伟茶叶店', addr: '古城南路36栋26号', dist: '2.6km', tags: ['社区茶店', '古城南路'] },
    { id: 'jingcheng-tenfu', region: 'other', name: '北京京城天福茶庄有限公司石景山第一分店', addr: '石景山区', dist: '4.6km', tags: ['品牌连锁', '石景山'] }
  ];

  const state = {
    mode: 'takeout',
    cat: 'season',
    search: '',
    storeId: 'bama-gucheng',
    storeRegion: 'gucheng',
    storeQuery: '',
    cart: new Map(),
    orders: [],
    orderTab: 'all',
    loggedIn: false
  };

  /* ---------------- 元素 ---------------- */
  const statusTime = $('#statusTime');
  const tabBadge = $('#tabBadge');
  const cartBar = $('#cartBar');
  const cartBarCount = $('#cartBarCount');
  const cartBarTotal = $('#cartBarTotal');
  const catList = $('#catList');
  const productList = $('#productList');
  const menuList = $('#menuList');
  const menuHead = $('#menuHead');
  const searchInput = $('#searchInput');
  const searchClear = $('#searchClear');
  const storeMode = $('#storeMode');
  const storeSwitchBtn = $('#storeSwitchBtn');
  const storeNameEl = $('#storeName');
  const storeDistanceEl = $('#storeDistance');
  const storeMoreBtn = $('#storeMoreBtn');
  const storeDetailBtn = $('#storeDetailBtn');
  const storeRegions = $('#storeRegions');
  const storeList = $('#storeList');
  const storeSearchInput = $('#storeSearchInput');
  const storeSearchClear = $('#storeSearchClear');
  const storeSheetSub = $('#storeSheetSub');
  const cartList = $('#cartList');
  const cartEmpty = $('#cartEmpty');
  const cartFoot = $('#cartFoot');
  const cartTotal = $('#cartTotal');
  const clearCartBtn = $('#clearCartBtn');
  const checkoutBtn = $('#checkoutBtn');
  const orderTabs = $('#orderTabs');
  const orderInk = $('#orderInk');
  const orderList = $('#orderList');
  const ordersEmpty = $('#ordersEmpty');
  const ordersEmptyText = $('#ordersEmptyText');
  const loginBtn = $('#loginBtn');
  const loginTip = $('#loginTip');
  const greetingLine = $('#greetingLine');
  const vipCard = $('#vipCard');
  const brewLayer = $('#brewLayer');
  const successLayer = $('#successLayer');
  const successNo = $('#successNo');
  const backdrop = $('#backdrop');
  const toastEl = $('#toast');
  const homeScroll = $('[data-scroll="home"]');
  const heroPhoto = $('.hero__photo');
  const heroBig = $('.hero__big');
  const promoCard = $('#promoCard');

  /* ---------------- 通用 ---------------- */
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 1900);
  }

  function nowParts() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return {
      d,
      hh: p(d.getHours()),
      mm: p(d.getMinutes()),
      y: d.getFullYear(),
      mo: p(d.getMonth() + 1),
      da: p(d.getDate())
    };
  }

  function tickClock() {
    const { hh, mm } = nowParts();
    statusTime.textContent = `${Number(hh)}:${mm}`;
  }

  /* ---------------- 路由 ---------------- */
  function go(name) {
    if (!screenEl[name] || name === current) return;
    const fromEl = screenEl[current];
    const toEl = screenEl[name];
    const fromIndex = TAB_ORDER.indexOf(current);
    const toIndex = TAB_ORDER.indexOf(name);
    const forward = toIndex > fromIndex;
    const fromSplash = current === 'splash';
    const toSplash = name === 'splash';

    const cancelRoute = el => {
      el.getAnimations()
        .filter(a => a.id === 'routeIn' || a.id === 'routeOut')
        .forEach(a => a.cancel());
    };

    // 清理其它屏残留
    Object.entries(screenEl).forEach(([key, el]) => {
      if (key !== name && key !== current) {
        cancelRoute(el);
        el.classList.remove('is-active');
        el.style.zIndex = '';
      }
    });

    toEl.classList.add('is-active');
    toEl.style.zIndex = '3';
    fromEl.style.zIndex = '2';

    cancelRoute(fromEl);
    cancelRoute(toEl);

    let inFrames, outFrames, duration = 540;
    if (fromSplash) {
      inFrames = [{ opacity: 0, transform: 'scale(1.025)' }, { opacity: 1, transform: 'none' }];
      outFrames = [
        { opacity: 1, transform: 'none', filter: 'blur(0px)' },
        { opacity: 0, transform: 'scale(1.045)', filter: 'blur(7px)' }
      ];
      duration = 760;
    } else if (toSplash) {
      inFrames = [{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'none' }];
      outFrames = [{ opacity: 1 }, { opacity: 0 }];
      duration = 620;
    } else {
      const dir = forward ? 1 : -1;
      inFrames = [
        { opacity: 0, transform: `translateX(${dir * 46}px) scale(.986)` },
        { opacity: 1, transform: 'none' }
      ];
      outFrames = [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: `translateX(${dir * -30}px) scale(.986)` }
      ];
    }

    const outAnim = fromEl.animate(outFrames, {
      id: 'routeOut', duration, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'
    });
    const inAnim = toEl.animate(inFrames, {
      id: 'routeIn', duration, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'
    });

    outAnim.onfinish = () => {
      fromEl.classList.remove('is-active');
      fromEl.style.zIndex = '';
      try { outAnim.cancel(); } catch (e) {}
    };
    inAnim.onfinish = () => {
      toEl.style.zIndex = '';
      try { inAnim.cancel(); } catch (e) {}
    };

    phone.dataset.view = name;
    current = name;
    updateTabs();
    updateCartUI();

    if (name === 'orders') {
      setTimeout(syncOrderTabs, 90);
      renderOrders();
    }
    if (name === 'menu') {
      setTimeout(updateCartUI, 60);
    }
  }

  function leaveSplash() {
    clearTimeout(splashTimer);
    splashTimer = null;
    go('home');
  }

  function scheduleSplash() {
    clearTimeout(splashTimer);
    splashTimer = setTimeout(() => {
      if (current === 'splash') go('home');
    }, 4300);
  }

  function replaySplash() {
    closeSheets();
    clearTimeout(splashTimer);
    if (current !== 'splash') go('splash');
    splashReset();
    scheduleSplash();
  }

  function splashReset() {
    screenEl.splash.classList.remove('is-playing');
    void screenEl.splash.offsetWidth;
    screenEl.splash.classList.add('is-playing');
  }

  function updateTabs() {
    $$('#tabbar .tab[data-nav]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.nav === current);
    });
  }

  /* ---------------- 茶饮列表 ---------------- */
  function renderCats() {
    catList.innerHTML = CATEGORIES.map(cat => `
      <button class="cat${cat.id === state.cat ? ' is-active' : ''}" data-cat="${cat.id}">${cat.name}</button>
    `).join('');
  }

  function currentProducts() {
    if (state.search) {
      const q = state.search.toLowerCase();
      return CATEGORIES.flatMap(cat => cat.products).filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }
    const cat = CATEGORIES.find(c => c.id === state.cat) || CATEGORIES[0];
    return cat.products;
  }

  function renderProducts() {
    const list = currentProducts();
    if (!list.length) {
      productList.innerHTML = `
        <div class="menu-empty">
          <b>未寻到此味</b>
          换一盏茶试试？
        </div>`;
      return;
    }
    productList.innerHTML = list.map((p, i) => `
      <article class="product" style="--d:${i * 55}ms">
        <div class="product__thumb">
          <svg viewBox="0 0 120 120" aria-hidden="true"><use href="#art-teapot"/></svg>
        </div>
        <div class="product__info">
          <h4>${p.name}</h4>
          <p>${p.desc}</p>
          <div class="product__price"><span>¥</span>${p.price}</div>
        </div>
        <button class="product__add" data-add="${p.id}" aria-label="将${p.name}加入茶篮">
          <svg class="ic"><use href="#i-plus"/></svg>
        </button>
      </article>
    `).join('');
  }

  function switchCat(id) {
    if (id === state.cat) return;
    state.cat = id;
    $$('.cat', catList).forEach(btn => btn.classList.toggle('is-active', btn.dataset.cat === id));
    const cat = CATEGORIES.find(c => c.id === id);
    const bannerTitle = $('.cat-banner__title');
    const bannerSub = $('.cat-banner__sub');
    if (cat && bannerTitle) {
      bannerTitle.textContent = cat.banner[0];
      bannerSub.textContent = cat.banner[1];
      bannerTitle.animate(
        [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
    }
    productList.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px)' }],
      { duration: 130, easing: 'ease-in' }
    ).onfinish = () => {
      renderProducts();
      productList.animate(
        [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
    };
    menuList.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- 茶篮 ---------------- */
  function getEntries() {
    return [...state.cart.entries()]
      .map(([id, qty]) => ({ ...PRODUCT_INDEX.get(id), qty }))
      .filter(item => item && item.id);
  }
  function cartCount() {
    return [...state.cart.values()].reduce((a, b) => a + b, 0);
  }
  function getCartTotal() {
    return getEntries().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function addToCart(id, btn) {
    const p = PRODUCT_INDEX.get(id);
    if (!p) return;
    state.cart.set(id, (state.cart.get(id) || 0) + 1);
    updateCartUI();
    if (btn) {
      btn.classList.add('is-added');
      setTimeout(() => btn.classList.remove('is-added'), 430);
      flyToCart(btn);
    }
    toast(`${p.name} 已加入茶篮`);
  }

  function setQty(id, delta) {
    const next = (state.cart.get(id) || 0) + delta;
    if (next <= 0) state.cart.delete(id);
    else state.cart.set(id, next);
    updateCartUI();
    if (sheets.cart.classList.contains('is-open')) renderCart();
  }

  function updateCartUI() {
    const count = cartCount();
    const total = getCartTotal();
    cartBarCount.textContent = count;
    cartBarTotal.textContent = `¥${total}`;
    tabBadge.hidden = count === 0;
    tabBadge.textContent = count > 99 ? '99+' : String(count);

    const showBar = count > 0 && current === 'menu';
    cartBar.classList.toggle('is-show', showBar);
    cartBar.setAttribute('aria-hidden', showBar ? 'false' : 'true');

    cartTotal.textContent = `¥${total}`;
    cartFoot.hidden = count === 0;
    cartEmpty.hidden = count > 0;
    clearCartBtn.hidden = count === 0;
  }

  function renderCart() {
    const entries = getEntries();
    cartList.innerHTML = entries.map(item => `
      <div class="cart-item">
        <div class="cart-item__thumb">
          <svg viewBox="0 0 120 120" aria-hidden="true"><use href="#art-teapot"/></svg>
        </div>
        <div class="cart-item__info">
          <h4>${item.name}</h4>
          <span>${item.desc}</span>
        </div>
        <div class="stepper">
          <button data-step="-1" data-id="${item.id}" aria-label="减少一份"><svg class="ic"><use href="#i-minus"/></svg></button>
          <span>${item.qty}</span>
          <button data-step="1" data-id="${item.id}" aria-label="增加一份"><svg class="ic"><use href="#i-plus"/></svg></button>
        </div>
        <div class="cart-item__price">¥${item.price * item.qty}</div>
      </div>
    `).join('');
    updateCartUI();
  }

  function flyToCart(btn) {
    if (!btn) return;
    const b = btn.getBoundingClientRect();
    const target = (cartBar.classList.contains('is-show')
      ? $('#openCart')
      : $('.tab__plus')) || phone;
    const t = target.getBoundingClientRect();
    const sx = b.left + b.width / 2 - 5.5;
    const sy = b.top + b.height / 2 - 5.5;
    const ex = t.left + t.width / 2 - 5.5;
    const ey = t.top + t.height / 2 - 5.5;
    const mx = (sx + ex) / 2 + 24;
    const my = Math.min(sy, ey) - 96;

    const dot = document.createElement('span');
    dot.className = 'fly-dot';
    dot.style.left = '0';
    dot.style.top = '0';
    document.body.appendChild(dot);

    const anim = dot.animate([
      { transform: `translate(${sx}px,${sy}px) scale(1)`, opacity: 1 },
      { transform: `translate(${mx}px,${my}px) scale(.72)`, opacity: .95, offset: .58 },
      { transform: `translate(${ex}px,${ey}px) scale(.24)`, opacity: 0 }
    ], { duration: 700, easing: 'cubic-bezier(.3,.7,.3,1)' });

    anim.onfinish = () => {
      dot.remove();
      const plus = $('.tab__plus');
      if (plus) {
        plus.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }],
          { duration: 430, easing: 'ease-out' }
        );
      }
    };
  }

  /* ---------------- 取餐方式 ---------------- */
  function updateModeUI() {
    $$('.mode').forEach(btn => btn.classList.toggle('is-active', btn.dataset.mode === state.mode));
    storeMode.dataset.mode = state.mode;
    $$('.segmented__btn', storeMode).forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.storeMode === state.mode);
    });
  }
  function setMode(mode, notify = true) {
    if (mode !== state.mode) {
      state.mode = mode;
      updateModeUI();
      if (notify) toast(mode === 'takeout' ? '已选择 · 门店自取' : '已选择 · 配送到家');
    }
  }

  /* ---------------- 门店切换 ---------------- */
  function selectedStore() {
    return STORES.find(s => s.id === state.storeId) || STORES[0];
  }

  function syncStoreHeader() {
    const s = selectedStore();
    storeNameEl.textContent = s.name;
    storeDistanceEl.textContent = s.dist.startsWith('距') ? s.dist : `距学院 ${s.dist}`;
    storeSwitchBtn.title = s.name;
  }

  function renderStoreRegions() {
    storeRegions.innerHTML = STORE_REGIONS.map(region => {
      const count = STORES.filter(s => s.region === region.id).length;
      const active = region.id === state.storeRegion;
      return `
        <button class="store-region${active ? ' is-active' : ''}" data-region="${region.id}" role="tab" aria-selected="${active}">
          <span>${region.name}</span><b>${count}</b>
        </button>`;
    }).join('');
    storeRegions.classList.toggle('is-searching', !!state.storeQuery.trim());
  }

  function regionName(id) {
    return (STORE_REGIONS.find(r => r.id === id) || STORE_REGIONS[0]).name;
  }

  const escapeHtml = str => String(str).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  function highlight(text, query) {
    const safe = escapeHtml(text);
    if (!query) return safe;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp(escaped, 'gi'), match => `<mark class="store-mark">${match}</mark>`);
  }

  function storeResults() {
    const q = state.storeQuery.trim().toLowerCase();
    if (!q) return STORES.filter(s => s.region === state.storeRegion);
    return STORES.filter(s => `${s.name} ${s.addr} ${s.tags.join(' ')}`.toLowerCase().includes(q));
  }

  function updateStoreMeta(count) {
    const q = state.storeQuery.trim();
    const notes = {
      gucheng: '品牌茶店与老字号集中，距学院相对较近，选择丰富。',
      lugu: '社区商业发达，连锁品牌与茶城分布密集。',
      pingguo: '多个老字号分店与社区茶铺沿街分布。',
      other: '品牌特色鲜明，含商场店与品牌专营店。'
    };
    if (q) {
      storeSheetSub.textContent = `搜索“${q}” · ${count} 家门店`;
      $('#storeRegionNote').textContent = `在全部 ${STORES.length} 家门店中搜索，点击区域可退出搜索`;
    } else {
      storeSheetSub.textContent = `北京市石景山区 · ${STORES.length} 家门店`;
      $('#storeRegionNote').textContent = notes[state.storeRegion] || '';
    }
  }

  function renderStoreList() {
    const q = state.storeQuery.trim();
    const list = storeResults();
    storeList.scrollTop = 0;
    updateStoreMeta(list.length);

    if (!list.length) {
      storeList.innerHTML = `
        <div class="store-empty">
          <span class="store-empty__icon"><svg class="ic"><use href="#i-search"/></svg></span>
          <p>没有找到相关门店</p>
          <span>换个关键词试试，如「吴裕泰」「古城」「老字号」</span>
        </div>`;
      return;
    }

    storeList.innerHTML = list.map((s, i) => `
      <button class="store-item${s.id === state.storeId ? ' is-selected' : ''}" data-store-id="${s.id}" style="--i:${i}">
        <span class="store-item__pin"><svg class="ic"><use href="#i-pin"/></svg></span>
        <span class="store-item__body">
          <span class="store-item__name">${highlight(s.name, q)}</span>
          <span class="store-item__addr">${highlight(s.addr, q)}</span>
          <span class="store-item__tags">
            ${q ? `<span class="store-item__tag store-item__tag--region">${regionName(s.region)}</span>` : ''}
            ${s.tags.map(t => `<span class="store-item__tag${t.includes('学院') ? ' store-item__tag--near' : ''}">${highlight(t, q)}</span>`).join('')}
          </span>
        </span>
        <span class="store-item__side">
          <span class="store-item__dist">${s.dist}</span>
          <span class="store-item__check"><svg class="ic"><use href="#i-check"/></svg></span>
        </span>
      </button>
    `).join('');
  }

  function renderStoreSheet() {
    renderStoreRegions();
    renderStoreList();
  }

  function setStoreQuery(value) {
    state.storeQuery = value;
    storeSearchClear.hidden = !value.trim();
    renderStoreList();
    storeRegions.classList.toggle('is-searching', !!value.trim());
  }

  function selectStore(id) {
    const store = STORES.find(s => s.id === id);
    if (!store) return;
    state.storeId = id;
    state.storeRegion = store.region;
    syncStoreHeader();

    storeSwitchBtn.classList.remove('is-switch');
    void storeSwitchBtn.offsetWidth;
    storeSwitchBtn.classList.add('is-switch');
    setTimeout(() => storeSwitchBtn.classList.remove('is-switch'), 620);

    const picked = storeList.querySelector(`[data-store-id="${id}"]`);
    if (picked) {
      $$('.store-item', storeList).forEach(el => el.classList.toggle('is-selected', el === picked));
    }

    toast(`已切换至 ${store.name}`);
    setTimeout(closeSheets, 360);
  }

  /* ---------------- 弹层 ---------------- */
  function openSheet(name) {
    const sheet = sheets[name];
    if (!sheet) return;
    Object.entries(sheets).forEach(([key, el]) => el.classList.toggle('is-open', key === name));
    backdrop.classList.add('is-open');
    if (name === 'cart') renderCart();
    if (name === 'member') syncMemberCode();
    if (name === 'store') {
      state.storeRegion = selectedStore().region;
      state.storeQuery = '';
      storeSearchInput.value = '';
      storeSearchClear.hidden = true;
      renderStoreSheet();
    }
    sheet.style.transform = '';
  }
  function closeSheets() {
    Object.values(sheets).forEach(el => {
      el.classList.remove('is-open');
      el.style.transform = '';
    });
    backdrop.classList.remove('is-open');
  }

  function openCart() {
    if (cartCount() === 0) {
      toast('茶篮还是空的，先挑一杯吧');
      return;
    }
    openSheet('cart');
  }

  /* ---------------- 订单 ---------------- */
  function modeLabel() {
    return state.mode === 'takeout' ? '门店自取' : '配送到家';
  }

  function createOrder(entries) {
    const { hh, mm, y, mo, da } = nowParts();
    const mins = String(Math.floor(Math.random() * 90));
    const order = {
      id: Date.now(),
      no: `QM ${y}${mo}${da} ${hh}${mm}${mins}`,
      items: entries.map(e => ({ id: e.id, name: e.name, price: e.price, qty: e.qty })),
      total: entries.reduce((s, e) => s + e.price * e.qty, 0),
      mode: modeLabel(),
      time: `今日 ${hh}:${mm}`,
      type: 'store',
      status: 'brewing'
    };
    state.orders.unshift(order);
    state.cart.clear();
    updateCartUI();

    setTimeout(() => {
      order.status = 'ready';
      renderOrders();
    }, 9000);

    return order;
  }

  function orderCardHTML(order) {
    const lines = order.items.map(item => `
      <div class="order-line">
        <span class="order-line__name">${item.name}<small>×${item.qty}</small></span>
        <span class="order-line__price">¥${item.price * item.qty}</span>
      </div>
    `).join('');
    const ready = order.status === 'ready';
    return `
      <article class="order-card">
        <div class="order-card__head">
          <span class="order-card__no">${order.no}</span>
          <span class="order-card__status ${ready ? 'is-ready' : ''}">${ready ? '待取茶' : '制作中'}</span>
        </div>
        <div class="order-card__items">${lines}</div>
        <div class="order-card__foot">
          <span class="order-card__meta">${order.mode} · ${order.time}</span>
          <span class="order-card__total">合计 ¥${order.total}</span>
        </div>
        <div class="order-card__again"><button data-again="${order.id}">再来一单</button></div>
      </article>
    `;
  }

  function renderOrders() {
    const tabName = {
      all: '订单', store: '门店订单', coupon: '券码订单', card: '权益卡订单'
    }[state.orderTab] || '订单';
    const list = state.orders.filter(order => state.orderTab === 'all' || order.type === state.orderTab);

    ordersEmpty.hidden = list.length > 0;
    orderList.hidden = list.length === 0;
    ordersEmptyText.textContent = list.length === 0
      ? `您暂时还没有${tabName}啦~`
      : '';
    orderList.innerHTML = list.map(orderCardHTML).join('');
  }

  function syncOrderTabs() {
    const active = $(`#orderTabs button[data-tab="${state.orderTab}"]`);
    if (!active || !orderInk) return;
    $$('#orderTabs button').forEach(btn => btn.classList.toggle('is-active', btn === active));
    const parent = orderTabs.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    if (!rect.width) return;
    orderInk.style.width = '22px';
    orderInk.style.left = `${rect.left - parent.left + rect.width / 2 - 11}px`;
  }

  /* ---------------- 结算流程 ---------------- */
  let busy = false;
  function checkout() {
    if (busy) return;
    const entries = getEntries();
    if (!entries.length) {
      toast('茶篮还是空的');
      return;
    }
    busy = true;
    closeSheets();
    brewLayer.classList.add('is-open');
    brewLayer.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      brewLayer.classList.remove('is-open');
      brewLayer.setAttribute('aria-hidden', 'true');
      const order = createOrder(entries);
      successNo.textContent = order.no;
      successLayer.classList.add('is-open');
      successLayer.setAttribute('aria-hidden', 'false');

      setTimeout(() => {
        successLayer.classList.remove('is-open');
        successLayer.setAttribute('aria-hidden', 'true');
        state.orderTab = 'all';
        go('orders');
        renderOrders();
        setTimeout(syncOrderTabs, 120);
        toast('茶已入壶，静候片刻');
        busy = false;
      }, 1350);
    }, 1900);
  }

  /* ---------------- 我的 ---------------- */
  function animateValue(el, target, formatter) {
    if (!el) return;
    const start = performance.now();
    const duration = 1050;
    function frame(t) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatter(target * eased);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = formatter(target);
    }
    requestAnimationFrame(frame);
  }

  function login() {
    if (state.loggedIn) {
      openSheet('member');
      return;
    }
    state.loggedIn = true;
    greetingLine.innerHTML = 'Hi，<em>青瓷会员</em>，歡迎你';
    loginTip.textContent = '本月已品 6 盏好茶 · 会员日每月 8 号';
    loginBtn.textContent = '会员码';
    loginBtn.classList.add('is-on');

    animateValue($('[data-stat="balance"]'), 128, v => v.toFixed(2));
    animateValue($('[data-stat="coupon"]'), 3, v => String(Math.round(v)));
    animateValue($('[data-stat="points"]'), 520, v => String(Math.round(v)));
    animateValue($('[data-home-stat="coupon"]'), 3, v => String(Math.round(v)));
    animateValue($('[data-home-stat="points"]'), 520, v => String(Math.round(v)));

    const footText = $('.vip-card__foot > span');
    if (footText) footText.textContent = '青瓷会员 · 有效期至 2027.12.31';

    toast('登录成功，欢迎回到解茶香');
  }

  function syncMemberCode() {
    const memberNo = $('#memberNo');
    if (state.loggedIn) {
      const { y, mo, da } = nowParts();
      memberNo.textContent = `JC · ${y} ${mo}${da} 0${Math.floor(Math.random() * 9) + 1}38`;
    } else {
      memberNo.textContent = '登录后生成专属会员码';
    }
  }

  function buildQR() {
    const box = $('#qrBox');
    if (!box || box.dataset.ready) return;
    let seed = 20261118;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    let cells = '';
    for (let y = 0; y < 21; y++) {
      for (let x = 0; x < 21; x++) {
        const inFinder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        if (inFinder) continue;
        if (rnd() > 0.5) {
          cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        }
      }
    }
    const finder = (x, y) => `
      <rect x="${x}" y="${y}" width="7" height="7" rx="1.4"/>
      <rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="1" fill="#FBFAF2"/>
      <rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".7"/>
    `;
    box.innerHTML = `
      <svg viewBox="0 0 21 21" shape-rendering="crispEdges" fill="#2F3A1C" aria-label="会员二维码">
        ${cells}
        <g>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</g>
      </svg>`;
    box.dataset.ready = '1';
  }

  /* ---------------- 动效与滚动 ---------------- */
  function initReveals() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));
  }

  function initParallax() {
    let raf = 0;
    homeScroll.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = homeScroll.scrollTop;
        if (heroPhoto) heroPhoto.style.transform = `translate3d(0,${y * 0.1}px,0)`;
        if (heroBig) heroBig.style.transform = `translateY(${y * -0.12}px) rotate(-4deg)`;
      });
    }, { passive: true });
  }

  function initTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (promoCard) {
      promoCard.addEventListener('pointermove', e => {
        const r = promoCard.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        promoCard.style.setProperty('--mx', `${px * 100}%`);
        promoCard.style.setProperty('--my', `${py * 100}%`);
        promoCard.style.transform =
          `perspective(760px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 6}deg)`;
      });
      promoCard.addEventListener('pointerleave', () => { promoCard.style.transform = ''; });
    }
    if (vipCard) {
      vipCard.addEventListener('pointermove', e => {
        const r = vipCard.getBoundingClientRect();
        const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const shine = $('.vip-card__shine', vipCard);
        if (shine) shine.style.transform = `rotate(18deg) translateX(${px * (r.width + 120) - 150}px)`;
      });
      vipCard.addEventListener('pointerleave', () => {
        const shine = $('.vip-card__shine', vipCard);
        if (shine) shine.style.transform = '';
      });
    }
  }

  function initRipple() {
    document.addEventListener('pointerdown', e => {
      const el = e.target.closest('.press');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.15;
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - r.left - size / 2}px`;
      span.style.top = `${e.clientY - r.top - size / 2}px`;
      el.appendChild(span);
      setTimeout(() => span.remove(), 700);
    }, { passive: true });
  }

  function initSheetDrag() {
    Object.values(sheets).forEach(sheet => {
      const grab = $('.sheet__grab', sheet);
      if (!grab) return;
      let startY = 0;
      let dy = 0;
      let dragging = false;

      grab.addEventListener('pointerdown', e => {
        dragging = true;
        startY = e.clientY;
        dy = 0;
        sheet.style.transition = 'none';
        try { grab.setPointerCapture(e.pointerId); } catch (err) {}
      });
      grab.addEventListener('pointermove', e => {
        if (!dragging) return;
        dy = Math.max(0, e.clientY - startY);
        sheet.style.transform = `translateY(${dy}px)`;
      });
      const end = () => {
        if (!dragging) return;
        dragging = false;
        sheet.style.transition = '';
        sheet.style.transform = '';
        if (dy > 84) closeSheets();
      };
      grab.addEventListener('pointerup', end);
      grab.addEventListener('pointercancel', end);
    });
  }

  /* ---------------- 事件绑定 ---------------- */
  function bindEvents() {
    // 启动页
    $('#skipBtn').addEventListener('click', leaveSplash);
    screenEl.splash.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      leaveSplash();
    });

    // 通用导航
    document.addEventListener('click', e => {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        go(nav.dataset.nav);
        return;
      }
      const capsule = e.target.closest('[data-capsule]');
      if (capsule) {
        toast('小程序菜单 · 转发 / 收藏 / 设置');
        return;
      }
      const toaster = e.target.closest('[data-toast]');
      if (toaster) {
        toast(toaster.dataset.toast);
      }
    });

    // 快捷面板
    $('[data-quick]').addEventListener('click', () => {
      if (cartCount() > 0) openCart();
      else openSheet('action');
    });
    backdrop.addEventListener('click', closeSheets);
    $$('[data-close-sheet]').forEach(btn => btn.addEventListener('click', closeSheets));

    $$('[data-quick-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.quickAction;
        if (action === 'replay') {
          replaySplash();
          return;
        }
        closeSheets();
        if (action === 'order') go('menu');
        if (action === 'scan') toast('请对准茶台上的取茶码');
        if (action === 'coupon') toast('您有 1 张 ¥2 新客券待领取');
        if (action === 'service') toast('茶艺师已收到您的呼唤');
      });
    });

    // 首页
    $$('.mode').forEach(btn => {
      btn.addEventListener('click', () => {
        setMode(btn.dataset.mode);
        setTimeout(() => go('menu'), 260);
      });
    });

    // 种类
    catList.addEventListener('click', e => {
      const btn = e.target.closest('[data-cat]');
      if (btn) switchCat(btn.dataset.cat);
    });
    productList.addEventListener('click', e => {
      const btn = e.target.closest('[data-add]');
      if (btn) addToCart(btn.dataset.add, btn);
    });
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.search = searchInput.value.trim();
        searchClear.hidden = !state.search;
        renderProducts();
      }, 130);
    });
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.search = '';
      searchClear.hidden = true;
      renderProducts();
      searchInput.focus();
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        state.search = '';
        searchClear.hidden = true;
        renderProducts();
        searchInput.blur();
      }
    });
    $$('.segmented__btn').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.storeMode));
    });

    // 门店切换
    storeSwitchBtn.addEventListener('click', () => openSheet('store'));
    storeMoreBtn.addEventListener('click', () => openSheet('store'));
    storeDetailBtn.addEventListener('click', () => {
      toast(`${selectedStore().name} · 09:00 - 22:00 · 营业中`);
    });
    storeRegions.addEventListener('click', e => {
      const chip = e.target.closest('[data-region]');
      if (!chip) return;
      const hadQuery = !!state.storeQuery.trim();
      if (hadQuery) {
        state.storeQuery = '';
        storeSearchInput.value = '';
        storeSearchClear.hidden = true;
      }
      if (chip.dataset.region === state.storeRegion && !hadQuery) return;
      state.storeRegion = chip.dataset.region;
      renderStoreRegions();
      renderStoreList();
    });
    storeSearchInput.addEventListener('input', e => setStoreQuery(e.target.value));
    storeSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.storeQuery) {
        storeSearchInput.value = '';
        setStoreQuery('');
      }
    });
    storeSearchClear.addEventListener('click', () => {
      storeSearchInput.value = '';
      setStoreQuery('');
      storeSearchInput.focus();
    });
    storeList.addEventListener('click', e => {
      const item = e.target.closest('[data-store-id]');
      if (item) selectStore(item.dataset.storeId);
    });
    menuList.addEventListener('scroll', () => {
      menuHead.classList.toggle('is-scrolled', menuList.scrollTop > 6);
    }, { passive: true });
    cartBar.addEventListener('click', e => {
      if (e.target.closest('#openCart')) return;
      openCart();
    });
    $('#openCart').addEventListener('click', openCart);

    // 茶篮
    cartList.addEventListener('click', e => {
      const btn = e.target.closest('[data-step]');
      if (!btn) return;
      setQty(btn.dataset.id, Number(btn.dataset.step));
    });
    clearCartBtn.addEventListener('click', () => {
      state.cart.clear();
      updateCartUI();
      renderCart();
      toast('茶篮已清空');
    });
    checkoutBtn.addEventListener('click', checkout);

    // 订单
    orderTabs.addEventListener('click', e => {
      const btn = e.target.closest('button[data-tab]');
      if (!btn) return;
      state.orderTab = btn.dataset.tab;
      syncOrderTabs();
      const scroll = $('#screen-orders .screen__scroll');
      scroll.animate(
        [{ opacity: 1 }, { opacity: .3 }, { opacity: 1 }],
        { duration: 360, easing: 'ease-out' }
      );
      renderOrders();
    });
    orderList.addEventListener('click', e => {
      const btn = e.target.closest('[data-again]');
      if (!btn) return;
      const order = state.orders.find(o => String(o.id) === btn.dataset.again);
      if (!order) return;
      order.items.forEach(item => {
        state.cart.set(item.id, (state.cart.get(item.id) || 0) + item.qty);
      });
      updateCartUI();
      go('menu');
      renderCart();
      setTimeout(openCart, 320);
      toast('已为您重新加入茶篮');
    });

    // 我的
    loginBtn.addEventListener('click', login);
    $('#memberCodeBtn').addEventListener('click', () => openSheet('member'));
    $$('.profile-row').forEach(row => {
      row.addEventListener('click', () => {
        const key = row.dataset.row;
        if (key === 'orders') {
          go('orders');
          return;
        }
        const messages = {
          info: '个人信息 · 即将开放',
          service: '茶艺师在线，请稍候',
          address: '暂未设置常用地址',
          rights: '青瓷会员权益：生日茶礼 · 双倍积分 · 优先取茶',
          account: '账号与安全 · 即将开放'
        };
        toast(messages[key] || '敬请期待');
      });
    });

    // 键盘
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSheets();
    });

    // 尺寸变化时重算下划线
    window.addEventListener('resize', () => {
      if (current === 'orders') syncOrderTabs();
    });
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    renderCats();
    renderProducts();
    renderOrders();
    updateModeUI();
    syncStoreHeader();
    updateTabs();
    updateCartUI();
    buildQR();
    bindEvents();
    initRipple();
    initReveals();
    initParallax();
    initTilt();
    initSheetDrag();
    tickClock();
    setInterval(tickClock, 20000);
    scheduleSplash();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (current === 'orders') syncOrderTabs();
      });
    }
    window.addEventListener('load', () => {
      if (current === 'orders') syncOrderTabs();
    });
  }

  init();
})();
