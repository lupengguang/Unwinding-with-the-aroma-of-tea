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
    member: $('#memberSheet')
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

  const state = {
    mode: 'takeout',
    cat: 'season',
    search: '',
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

  /* ---------------- 弹层 ---------------- */
  function openSheet(name) {
    const sheet = sheets[name];
    if (!sheet) return;
    Object.entries(sheets).forEach(([key, el]) => el.classList.toggle('is-open', key === name));
    backdrop.classList.add('is-open');
    if (name === 'cart') renderCart();
    if (name === 'member') syncMemberCode();
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
