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
    product: $('#screen-product'),
    orders: $('#screen-orders'),
    orderDetail: $('#screen-order-detail'),
    payment: $('#screen-payment'),
    coupons: $('#screen-coupons'),
    rights: $('#screen-rights'),
    profile: $('#screen-profile'),
    login: $('#screen-login'),
    register: $('#screen-register'),
    about: $('#screen-about'),
    delivery: $('#screen-delivery')
  };
  const TAB_ORDER = ['home', 'menu', 'orders', 'profile'];
  const sheets = {
    action: $('#actionSheet'),
    cart: $('#cartSheet'),
    member: $('#memberSheet'),
    store: $('#storeSheet'),
    address: $('#addressSheet'),
    delivery: $('#deliverySheet'),
    coupon: $('#couponSheet'),
    refund: $('#refundSheet')
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
        { id: 'white', name: '白茶系', desc: '雪梨陈皮白茶、寿眉纯茶套餐', price: 20, img: 'assets/白茶系.png' },
        { id: 'red', name: '红茶系', desc: '苹果热橙荒野红茶、红茶轻乳茶', price: 20, img: 'assets/红茶系.png' },
        { id: 'rock', name: '岩茶系', desc: '水仙岩茶、岩茶纯茶礼盒、寿眉纯茶套餐', price: 20, img: 'assets/岩茶系.png' },
        { id: 'green', name: '绿茶系', desc: '龙井冷泡、云雾绿茶奶', price: 20, img: 'assets/绿茶系.png' },
        { id: 'snowpear-white', name: '雪梨陈皮白茶', desc: '雪梨、陈皮、寿眉白茶，清润回甘', price: 20, img: 'assets/雪梨陈皮白茶.png' },
        { id: 'apple-red', name: '苹果热橙红茶', desc: '苹果、热橙、荒野红茶，暖香果韵', price: 20, img: 'assets/苹果热橙红茶.png' },
        { id: 'zhengrock-rougui', name: '正岩肉桂', desc: '武夷正岩、肉桂品种、岩骨花香', price: 28, img: 'assets/正岩肉桂.png' },
        { id: 'mingqian-longjing', name: '明前龙井', desc: '明前嫩芽、豆香清高、鲜爽回甘', price: 22, img: 'assets/明前龙井.png' }
      ]
    },
    {
      id: 'fruit', name: '鲜果调茶',
      banner: ['鲜果入茶 · 夏日清欢', 'FRESH FRUIT TEA'],
      products: [
        { id: 'grapefruit', name: '满杯西柚茶', desc: '红心西柚、茉莉初雪、少糖清爽', price: 22, img: 'assets/满杯西柚茶.png' },
        { id: 'grape', name: '青提茉莉冷萃', desc: '阳光青提、冷萃茉莉、鲜果肉', price: 24, img: 'assets/青提茉莉冷萃.png' },
        { id: 'pear', name: '雪梨桂花乌龙', desc: '砀山雪梨、金桂、炭焙乌龙', price: 21, img: 'assets/雪梨桂花乌龙.png' },
        { id: 'ducklemon', name: '鸭屎香柠檬茶', desc: '凤凰单丛鸭屎香、香水柠檬、手打去涩', price: 20, img: 'assets/鸭屎香柠檬茶.png' },
        { id: 'whitepeach-cold', name: '白桃乌龙冷萃', desc: '水蜜桃果肉、白桃乌龙、冷萃八小时', price: 23, img: 'assets/白桃乌龙冷萃.png' },
        { id: 'lychee-rose', name: '荔枝玫瑰红茶', desc: '岭南荔枝、干玫瑰、祁门红茶', price: 24, img: 'assets/荔枝玫瑰红茶.png' },
        { id: 'pineapple-passion', name: '凤梨百香果茶', desc: '金钻凤梨、百香果、茉莉初雪', price: 22, img: 'assets/凤梨百香果茶.png' },
        { id: 'watermelon-jasmine', name: '西瓜茉莉冰茶', desc: '麒麟西瓜、茉莉初雪、少糖', price: 21, img: 'assets/西瓜茉莉冰茶.png' },
        { id: 'cherry-oolong', name: '车厘子乌龙', desc: '智利车厘子、炭焙乌龙、气泡感', price: 26, img: 'assets/车厘子乌龙.png' }
      ]
    },
    {
      id: 'milk', name: '轻乳奶茶',
      banner: ['轻乳一盏 · 温柔半日', 'LIGHT MILK TEA'],
      products: [
        { id: 'rockmilk', name: '岩茶厚乳茶', desc: '肉桂岩茶、轻乳顶、岩骨花香', price: 23, img: 'assets/岩茶厚乳茶.png' },
        { id: 'osmanthus', name: '桂花乌龙拿铁', desc: '桂花乌龙、鲜牛乳、三分糖', price: 24, img: 'assets/桂花乌龙拿铁.png' },
        { id: 'whitemilk', name: '白茶轻乳', desc: '白牡丹、轻乳、清甜不腻', price: 22, img: 'assets/白茶轻乳.png' },
        { id: 'coconut-white', name: '生椰白茶', desc: '冷压生椰乳、贡眉白茶、清甜带椰香', price: 24, img: 'assets/生椰白茶.png' },
        { id: 'matcha-milk', name: '抹茶轻乳', desc: '宇治抹茶、轻乳顶、微苦回甘', price: 25, img: 'assets/抹茶轻乳.png' },
        { id: 'brownsugar-pearl', name: '黑糖珍珠鲜奶茶', desc: '手炒黑糖、木薯珍珠、鲜牛乳+锡兰红茶', price: 22, img: 'assets/黑糖珍珠鲜奶茶.png' },
        { id: 'mint-green', name: '薄荷奶绿', desc: '新鲜薄荷、茉莉绿茶、轻乳', price: 23, img: 'assets/薄荷奶绿.png' },
        { id: 'taro-white', name: '芋泥白茶鲜奶', desc: '荔浦芋泥、福鼎白茶、鲜牛乳', price: 26, img: 'assets/芋泥白茶鲜奶.png' },
        { id: 'gardenia-milk', name: '栀子花轻乳', desc: '栀子花绿茶、轻乳、花香收尾', price: 24, img: 'assets/栀子花轻乳.png' }
      ]
    },
    {
      id: 'cold', name: '清润冷萃',
      banner: ['冷萃慢滴 · 清润回甘', 'COLD BREW TEA'],
      products: [
        { id: 'dancong', name: '冷萃单丛', desc: '凤凰单丛、八小时冷萃、蜜兰香', price: 26, img: 'assets/冷萃单丛.png' },
        { id: 'lemon', name: '柠檬冷萃绿茶', desc: '香水柠檬、冷萃云雾绿', price: 22, img: 'assets/柠檬冷萃绿茶.png' },
        { id: 'peach', name: '蜜桃乌龙冷萃', desc: '水蜜桃、白桃乌龙、气泡感', price: 23, img: 'assets/蜜桃乌龙冷萃.png' },
        { id: 'jasmine-silver', name: '冷萃茉莉银针', desc: '茉莉花窨白毫银针、冷萃八小时、毫香清甜', price: 22, img: 'assets/冷萃茉莉银针.png' },
        { id: 'earl-grey', name: '冷萃伯爵红茶', desc: '佛手柑伯爵、冷萃、柑橘香气', price: 21, img: 'assets/冷萃伯爵红茶.png' },
        { id: 'osmanthus-longjing', name: '冷萃桂花龙井', desc: '金桂、明前龙井、冷萃一夜、豆香带桂', price: 22, img: 'assets/冷萃桂花龙井.png' },
        { id: 'oolong-sparkling', name: '冷萃乌龙气泡', desc: '炭焙乌龙、气泡水、微苦回甘', price: 24, img: 'assets/冷萃乌龙气泡.png' },
        { id: 'roselle-rose', name: '冷萃洛神玫瑰', desc: '洛神花、重瓣玫瑰、微酸生津', price: 20, img: 'assets/冷萃洛神玫瑰.png' },
        { id: 'hawthorn-peel', name: '冷萃山楂陈皮', desc: '山楂、新会陈皮、饭后消食', price: 23, img: 'assets/冷萃山楂陈皮.png' }
      ]
    },
    {
      id: 'snack', name: '茶點小食',
      banner: ['佐茶小点 · 闲情几许', 'TEA SNACKS'],
      products: [
        { id: 'bean', name: '绿豆糕', desc: '手作绿豆糕、清甜细腻、佐茶佳品', price: 12, img: 'assets/绿豆糕.png' },
        { id: 'jelly', name: '桂花茶冻', desc: '桂花蜜、白茶冻、入口即化', price: 15, img: 'assets/桂花茶冻.png' },
        { id: 'cookie', name: '岩茶桃酥', desc: '岩茶粉、桃酥、酥松回甘', price: 16, img: 'assets/岩茶桃酥.png' },
        { id: 'silverneedle-pastry', name: '白毫银针酥', desc: '白茶粉入酥皮、豆沙内馅、层层起酥', price: 16, img: 'assets/白毫银针酥.png' },
        { id: 'peel-beancake', name: '陈皮红豆糕', desc: '新会陈皮、手打红豆沙、清甜不腻', price: 14, img: 'assets/陈皮红豆糕.png' },
        { id: 'osmanthus-ricecake', name: '桂花米糕', desc: '糯米现蒸、桂花蜜、软糯带花香', price: 13, img: 'assets/桂花米糕.png' },
        { id: 'tieguanyin-nougat', name: '铁观音牛轧糖', desc: '铁观音茶粉、大颗杏仁、手工切块', price: 18, img: 'assets/铁观音牛轧糖.png' },
        { id: 'matcha-daifuku', name: '抹茶红豆大福', desc: '宇治抹茶、蜜红豆、麻薯皮软糯', price: 16, img: 'assets/抹茶红豆大福.png' },
        { id: 'spiced-seeds', name: '五香茶瓜子', desc: '五香微咸、颗颗饱满、佐茶解腻', price: 10, img: 'assets/五香茶瓜子.png' }
      ]
    }
  ];

  const CAT_TEMPS = {
    season: ['热饮'],
    fruit: ['热饮', '冰饮', '少冰', '去冰'],
    milk: ['热饮', '冰饮', '少冰', '去冰'],
    cold: ['冰饮', '少冰', '去冰'],
    snack: []
  };
  const CAT_SUGARS = {
    season: [],
    fruit: ['多糖', '正常糖', '少糖', '无糖'],
    milk: ['多糖', '正常糖', '少糖', '无糖'],
    cold: ['多糖', '正常糖', '少糖', '无糖'],
    snack: []
  };
  const CAT_SIZES = {
    season: ['中杯 500ml', '大杯 700ml'],
    fruit: ['中杯 500ml', '大杯 700ml'],
    milk: ['中杯 500ml', '大杯 700ml'],
    cold: ['中杯 500ml', '大杯 700ml'],
    snack: []
  };
  const SIZE_PRICES = { '中杯 500ml': 0, '大杯 700ml': 2 };
  const CAT_ADDONS = {
    season: [],
    fruit: ['珍珠 +3', '奶盖 +4', '椰果 +3'],
    milk: ['珍珠 +3', '奶盖 +4', '椰果 +3'],
    cold: ['椰果 +3'],
    snack: []
  };
  const ADDON_PRICES = { '珍珠': 3, '奶盖': 4, '椰果': 3 };
  const CAT_INFO = {
    season: { origin: '武夷山 / 白毫银针 / 西湖龙井', taste: '原叶纯茶 · 清香回甘', allergen: '无', kcal: 5 },
    fruit: { origin: '产地直采鲜果 · 当季鲜榨', taste: '果香饱满 · 微酸回甘', allergen: '含果肉，鲜果过敏者慎饮', kcal: 85 },
    milk: { origin: '轻乳基底 · 现萃茶底', taste: '茶香在前 · 奶香在后', allergen: '含乳制品，乳糖不耐者慎饮', kcal: 120 },
    cold:  { origin: '低温冷萃 8 小时', taste: '冰爽清冽 · 茶味集中', allergen: '无', kcal: 45 },
    snack: { origin: '中式手工茶点', taste: '现制现售 · 茶佐佳品', allergen: '含面粉、乳制品、坚果', kcal: 180 }
  };
  const CAT_KICKER = {
    season: 'SEASONAL TEA COLLECTION',
    fruit: 'FRESH FRUIT TEA',
    milk: 'LIGHT MILK TEA',
    cold: 'COLD BREW TEA',
    snack: 'TEA SNACKS'
  };

  const PRODUCT_INDEX = new Map();
  CATEGORIES.forEach(cat => cat.products.forEach(p => {
    const info = CAT_INFO[cat.id] || {};
    PRODUCT_INDEX.set(p.id, {
      ...p, cat: cat.name, catId: cat.id,
      temps: CAT_TEMPS[cat.id] || [],
      sugars: CAT_SUGARS[cat.id] || [],
      sizes: CAT_SIZES[cat.id] || [],
      addons: CAT_ADDONS[cat.id] || [],
      origin: p.origin || info.origin || '',
      taste: p.taste || info.taste || '',
      allergen: p.allergen || info.allergen || '',
      kcal: p.kcal != null ? p.kcal : (info.kcal != null ? info.kcal : 0)
    });
  }));

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

  const COUPON_SEED = [
    { id: 'welcome-2', name: '新客见面礼', kind: 'cash', value: 200, minSubtotal: 0, scope: 'all', status: 'available', expiry: '2026.12.31', note: '全场茶饮无门槛使用' },
    { id: 'tea-20-5', name: '清茶满减券', kind: 'cash', value: 500, minSubtotal: 2000, scope: 'all', status: 'available', expiry: '2026.12.31', note: '一杯清茶，一份小确幸' },
    { id: 'afternoon-85', name: '午后 85 折券', kind: 'discount', value: 85, minSubtotal: 3000, scope: 'all', status: 'available', expiry: '2026.12.31', note: '午后茶时光专享折扣' },
    { id: 'delivery-3', name: '外卖配送券', kind: 'delivery', value: 300, minSubtotal: 0, scope: 'delivery', status: 'available', expiry: '2026.12.31', note: '仅抵扣订单实际配送费' },
    { id: 'share-50-10', name: '好茶分享券', kind: 'cash', value: 1000, minSubtotal: 5000, scope: 'all', status: 'claimable', expiry: '2027.01.31', note: '领取后与好友共享好茶' },
    { id: 'mellow-90', name: '醇香 9 折券', kind: 'discount', value: 90, minSubtotal: 4000, scope: 'all', status: 'claimable', expiry: '2027.01.31', note: '醇香茶品会员礼遇' }
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
    selectedOrderId: null,
    refundReason: '不想要了',
    paymentMethod: 'wechat',
    paymentDraft: null,
    coupons: COUPON_SEED.map(coupon => ({ ...coupon })),
    couponTab: 'all',
    couponFrom: 'profile',
    rightsAsset: 'balance',
    memberName: '清茶茶友',
    loggedIn: false,
    deliveryCat: 'all',
    deliveryEta: 'asap',
    deliveryFrom: 'home',
    addressId: 'home',
    productId: null,
    productTemp: '',
    productSugar: '',
    productSize: '',
    productAddons: [],
    productQty: 1,
    productFrom: 'menu'
  };
  const PAYMENT_METHODS = {
    wechat: '微信支付',
    alipay: '支付宝',
    unionpay: '云闪付'
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
  const orderDetailContent = $('#orderDetailContent');
  const refundBtn = $('#refundBtn');
  const refundApplyView = $('#refundApplyView');
  const refundStatusView = $('#refundStatusView');
  const refundNote = $('#refundNote');
  const paymentAmount = $('#paymentAmount');
  const paymentMode = $('#paymentMode');
  const paymentCount = $('#paymentCount');
  const paymentItems = $('#paymentItems');
  const paymentPriceDetails = $('#paymentPriceDetails');
  const paymentCouponBtn = $('#paymentCouponBtn');
  const paymentCouponHint = $('#paymentCouponHint');
  const paymentCouponValue = $('#paymentCouponValue');
  const paymentCouponList = $('#paymentCouponList');
  const paymentMethods = $('#paymentMethods');
  const confirmPaymentBtn = $('#confirmPaymentBtn');
  const couponList = $('#couponList');
  const couponTabs = $('#couponTabs');
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

  const deliveryCats = $('#deliveryCats');
  const deliveryGrid = $('#deliveryGrid');
  const deliveryBar = $('#deliveryBar');
  const deliveryCount = $('#deliveryCount');
  const deliveryTotal = $('#deliveryTotal');
  const addrTag = $('#addrTag');
  const addrText = $('#addrText');
  const addrMeta = $('#addrMeta');
  const etaText = $('#etaText');
  const etaChips = $('#etaChips');
  const deliveryPromoText = $('#deliveryPromoText');
  const deliveryProgress = $('#deliveryProgress');
  const deliveryItems = $('#deliveryItems');
  const deliverySheetAddr = $('#deliverySheetAddr');
  const deliverySheetSub = $('#deliverySheetSub');
  const deliverySheetTotal = $('#deliverySheetTotal');
  const feeSubtotal = $('#feeSubtotal');
  const feeDelivery = $('#feeDelivery');
  const feeOff = $('#feeOff');
  const addrList = $('#addrList');
  const addrListView = $('#addrListView');
  const addrFormView = $('#addrFormView');
  const addrForm = $('#addrForm');
  const addrFormTags = $('#addrFormTags');
  const addrInputAddr = $('#addrInputAddr');
  const addrInputName = $('#addrInputName');
  const addrInputPhone = $('#addrInputPhone');
  const addrFormError = $('#addrFormError');

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
    const routeRank = n => {
      if (n === 'login') return TAB_ORDER.length;
      if (n === 'register') return TAB_ORDER.length + 1;
      if (n === 'delivery') return TAB_ORDER.length + 2;
      if (n === 'about') return TAB_ORDER.length + 3;
      if (n === 'rights') return TAB_ORDER.length + 4;
      if (n === 'coupons') return TAB_ORDER.length + 5;
      if (n === 'product') return TAB_ORDER.length + 6;
      if (n === 'orderDetail') return TAB_ORDER.length + 7;
      if (n === 'payment') return TAB_ORDER.length + 8;
      const i = TAB_ORDER.indexOf(n);
      return i === -1 ? 0 : i;
    };
    const forward = routeRank(name) > routeRank(current);
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

    if (name === 'login' || name === 'register' || name === 'delivery' || name === 'about' || name === 'product' || name === 'orderDetail' || name === 'payment' || name === 'coupons' || name === 'rights') {
      const sc = $(`[data-scroll="${name}"]`);
      if (sc) sc.scrollTop = 0;
      if (name === 'login' || name === 'register') {
        const err = name === 'login' ? $('#loginError') : $('#registerError');
        if (err) err.classList.remove('is-show');
      }
    }

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
    if (name === 'rights') renderRightsAsset();
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
      const activeView = current === 'orderDetail' ? 'orders' : current === 'payment' ? 'menu' : ['coupons', 'rights'].includes(current) ? 'profile' : current;
      btn.classList.toggle('is-active', btn.dataset.nav === activeView);
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
      <article class="product" data-pid="${p.id}" style="--d:${i * 55}ms" tabindex="0" role="button" aria-label="选购${p.name}">
        <div class="product__thumb">
          ${p.img
            ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
            : '<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#art-teapot"/></svg>'}
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
  const cartKey = (id, temp, sugar, size, addons) => {
    const a = (addons && addons.length) ? addons.slice().sort().join('+') : '';
    return `${id}|${temp || ''}|${sugar || ''}|${size || ''}|${a}`;
  };
  function formatAddonName(raw) { return (raw || '').replace(/\s*\+\d+$/, '').trim(); }
  function addonPrice(raw) {
    const m = (raw || '').match(/\+(\d+)\s*$/); return m ? Number(m[1]) : 0;
  }
  function priceOfItem(id, temp, sugar, size, addons) {
    const p = PRODUCT_INDEX.get(id); if (!p) return 0;
    const base = p.price;
    const sizeUp = SIZE_PRICES[size] || 0;
    const addUp = (addons || []).reduce((s, a) => s + addonPrice(a), 0);
    return base + sizeUp + addUp;
  }

  function getEntries() {
    return [...state.cart.entries()]
      .map(([key, item]) => {
        const p = PRODUCT_INDEX.get(item.id);
        if (!p) return null;
        const price = priceOfItem(item.id, item.temp, item.sugar, item.size, item.addons);
        return { ...p, qty: item.qty, temp: item.temp, sugar: item.sugar || '',
                 size: item.size || '', addons: item.addons || [], price, key };
      })
      .filter(Boolean);
  }
  function cartCount() {
    return [...state.cart.values()].reduce((a, b) => a + b.qty, 0);
  }
  function qtyOf(id) {
    return [...state.cart.values()]
      .filter(v => v.id === id)
      .reduce((a, b) => a + b.qty, 0);
  }
  function getCartTotal() {
    return getEntries().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function addToCart(id, temp, qty, btn, flyTarget, sugar, size, addons) {
    const p = PRODUCT_INDEX.get(id);
    if (!p) return;
    const t = temp || (p.temps && p.temps[0]) || '';
    const s = sugar || (p.sugars && p.sugars.includes('正常糖') ? '正常糖' : (p.sugars && p.sugars[0])) || '';
    const sz = size || (p.sizes && p.sizes[0]) || '';
    const ad = addons && addons.length ? addons.slice() : [];
    const key = cartKey(id, t, s, sz, ad);
    const cur = state.cart.get(key);
    const amount = Math.max(1, Number(qty) || 1);
    state.cart.set(key, { id, temp: t, sugar: s, size: sz, addons: ad, qty: (cur ? cur.qty : 0) + amount });
    updateCartUI();
    if (btn) {
      btn.classList.add('is-added');
      setTimeout(() => btn.classList.remove('is-added'), 430);
      flyToCart(btn, flyTarget);
    }
    const tag = [t, s, sz, ad.length ? ad.map(formatAddonName).join('+') : ''].filter(Boolean).join(' · ');
    toast(`${p.name}${tag ? `（${tag}）` : ''} 已加入茶篮`);
  }

  function setQty(key, delta) {
    const item = state.cart.get(key);
    if (!item) return;
    const next = item.qty + delta;
    if (next <= 0) state.cart.delete(key);
    else state.cart.set(key, { ...item, qty: next });
    updateCartUI();
    if (sheets.cart.classList.contains('is-open')) renderCart();
  }

  /* ---------------- 选购页 ---------------- */
  const productArt = $('#productArt');
  const productCat = $('#productCat');
  const productKicker = $('#productKicker');
  const productName = $('#productName');
  const productDesc = $('#productDesc');
  const productPrice = $('#productPrice');
  const productTempBox = $('#productTempBox');
  const productTempsEl = $('#productTemps');
  const productSugarBox = $('#productSugarBox');
  const productSugarsEl = $('#productSugars');
  const productSizeBox = $('#productSizeBox');
  const productSizesEl = $('#productSizes');
  const productAddonsBox = $('#productAddonsBox');
  const productAddonsEl = $('#productAddons');
  const productInfoBox = $('#productInfoBox');
  const productOriginEl = $('#productOrigin');
  const productTasteEl = $('#productTaste');
  const productAllergenEl = $('#productAllergen');
  const productKcalEl = $('#productKcal');
  const productQtyEl = $('#productQty');
  const productTotalEl = $('#productTotal');

  function productArtMarkup(p) {
    if (p.img) return `<img src="${p.img}" alt="${p.name}">`;
    const art = p.catId === 'fruit' || p.catId === 'cold' ? 'art-top-cup' : 'art-teapot';
    return `<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#${art}"/></svg>`;
  }

  function renderProduct() {
    const p = PRODUCT_INDEX.get(state.productId);
    if (!p) return;
    productArt.innerHTML = productArtMarkup(p);
    productCat.textContent = p.cat;
    productKicker.textContent = CAT_KICKER[p.catId] || '';
    productName.textContent = p.name;
    productDesc.textContent = p.desc;
    productPrice.textContent = p.price;

    const temps = p.temps || [];
    productTempBox.hidden = temps.length === 0;
    productTempsEl.innerHTML = temps.map(t => `
      <button class="prod-chip${t === state.productTemp ? ' is-active' : ''}"
              data-temp="${t}" aria-pressed="${t === state.productTemp}">${t}</button>
    `).join('');

    const sugars = p.sugars || [];
    productSugarBox.hidden = sugars.length === 0;
    productSugarsEl.innerHTML = sugars.map(s => `
      <button class="prod-chip${s === state.productSugar ? ' is-active' : ''}"
              data-sugar="${s}" aria-pressed="${s === state.productSugar}">${s}</button>
    `).join('');

    const sizes = p.sizes || [];
    productSizeBox.hidden = sizes.length === 0;
    productSizesEl.innerHTML = sizes.map(sz => {
      const up = SIZE_PRICES[sz] || 0;
      const label = up ? `${sz} +¥${up}` : sz;
      return `<button class="prod-chip${sz === state.productSize ? ' is-active' : ''}"
              data-size="${sz}" aria-pressed="${sz === state.productSize}">${label}</button>`;
    }).join('');

    const addons = p.addons || [];
    productAddonsBox.hidden = addons.length === 0;
    productAddonsEl.innerHTML = addons.map(a => {
      const selected = state.productAddons.includes(a);
      return `<button class="prod-chip${selected ? ' is-active' : ''}"
              data-addon="${a}" aria-pressed="${selected}">${a}</button>`;
    }).join('');

    // 产品信息
    productOriginEl.textContent = p.origin || '—';
    productTasteEl.textContent = p.taste || '—';
    productAllergenEl.textContent = p.allergen || '—';
    productKcalEl.textContent = p.kcal || '—';

    syncProductTotal();
  }

  function syncProductTotal() {
    const p = PRODUCT_INDEX.get(state.productId);
    if (!p) return;
    const sizeUp = SIZE_PRICES[state.productSize] || 0;
    const addUp = (state.productAddons || []).reduce((s, a) => s + addonPrice(a), 0);
    const unit = p.price + sizeUp + addUp;
    productQtyEl.textContent = state.productQty;
    productTotalEl.textContent = `¥${unit * state.productQty}`;
  }

  function openProduct(id, from) {
    const p = PRODUCT_INDEX.get(id);
    if (!p) return;
    state.productId = id;
    state.productTemp = (p.temps && p.temps[0]) || '';
    state.productSugar = (p.sugars && p.sugars.includes('正常糖')) ? '正常糖' : ((p.sugars && p.sugars[0]) || '');
    state.productSize = (p.sizes && p.sizes[0]) || '';
    state.productAddons = [];
    state.productQty = 1;
    state.productFrom = from || (current === 'delivery' ? 'delivery' : 'menu');
    renderProduct();
    go('product');
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

    renderDeliveryBar();
  }

  function renderCart() {
    const entries = getEntries();
    cartList.innerHTML = entries.map(item => {
      const tags = [item.temp, item.sugar, item.size,
                    ...(item.addons && item.addons.length
                      ? item.addons.map(formatAddonName) : [])]
        .filter(Boolean).map(t => `<em class="cart-item__temp">${escapeHtml(t)}</em>`).join('');
      return `
      <div class="cart-item">
        <div class="cart-item__thumb">
          ${item.img
            ? `<img src="${item.img}" alt="${escapeHtml(item.name)}">`
            : '<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#art-teapot"/></svg>'}
        </div>
        <div class="cart-item__info">
          <h4>${escapeHtml(item.name)}${tags}</h4>
          <span>${escapeHtml(item.desc)}</span>
        </div>
        <div class="stepper">
          <button data-step="-1" data-key="${item.key}" aria-label="减少一份"><svg class="ic"><use href="#i-minus"/></svg></button>
          <span>${item.qty}</span>
          <button data-step="1" data-key="${item.key}" aria-label="增加一份"><svg class="ic"><use href="#i-plus"/></svg></button>
        </div>
        <div class="cart-item__price">¥${item.price * item.qty}</div>
      </div>`;
    }).join('');
    updateCartUI();
  }

  function flyToCart(btn, targetEl) {
    if (!btn) return;
    const b = btn.getBoundingClientRect();
    const target = targetEl || ((cartBar.classList.contains('is-show')
      ? $('#openCart')
      : $('.tab__plus')) || phone);
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

  /* ---------------- 外卖 ---------------- */
  const ADDRESSES = [
    { id: 'home', tag: '家', addr: '北京市石景山区古城南街 9 号院 3 号楼 502', contact: '清茶茶友 138****8866', dist: '距门店 1.8km' },
    { id: 'office', tag: '公司', addr: '北京市石景山区鲁谷路 74 号院 2 号楼 1106', contact: '清茶茶友 138****8866', dist: '距门店 2.6km' }
  ];
  const ETA_MINUTES = { asap: 32, '45': 45, '60': 60 };
  const FREE_DELIVERY_LIMIT = 39;
  const DELIVERY_FEE = 3;
  const PACK_FEE = 1;
  const NEW_USER_OFF = 3;

  function selectedAddress() {
    return ADDRESSES.find(a => a.id === state.addressId) || ADDRESSES[0];
  }

  function deliveryFee() {
    const sub = getCartTotal();
    return sub === 0 || sub >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  }
  function deliveryPack() {
    return getEntries().length ? PACK_FEE : 0;
  }
  function deliveryOff() {
    return getEntries().length ? NEW_USER_OFF : 0;
  }
  function deliveryPayable() {
    return Math.max(0, getCartTotal() + deliveryFee() + deliveryPack() - deliveryOff());
  }

  function deliveryProducts() {
    const list = [];
    CATEGORIES.forEach(cat => {
      if (state.deliveryCat !== 'all' && state.deliveryCat !== cat.id) return;
      cat.products.forEach(p => list.push({ ...p, cat: cat.name }));
    });
    return list;
  }

  function updateDeliveryBadges() {
    $$('[data-dadd]', deliveryGrid).forEach(btn => {
      btn.dataset.qty = String(qtyOf(btn.dataset.dadd));
    });
  }

  function renderDeliveryCats() {
    const items = [{ id: 'all', name: '全部' }, ...CATEGORIES.map(c => ({ id: c.id, name: c.name }))];
    deliveryCats.innerHTML = items.map(c => `
      <button class="dcat${c.id === state.deliveryCat ? ' is-active' : ''}" data-dcat="${c.id}" role="tab" aria-selected="${c.id === state.deliveryCat}">${c.name}</button>
    `).join('');
  }

  function renderDeliveryGrid() {
    const badges = ['热销', '', '新品', '', '推荐', '', '人气', ''];
    const list = deliveryProducts();
    deliveryGrid.innerHTML = list.map((p, i) => {
      const badge = badges[i % badges.length];
      const art = p.cat === '清润冷萃' || p.cat === '鲜果调茶' ? 'art-top-cup' : 'art-teapot';
      return `
        <article class="d-card" data-pid="${p.id}" style="--d:${Math.min(i, 10) * 45}ms" tabindex="0" role="button" aria-label="选购${p.name}">
          <div class="d-card__art">
            ${p.img
              ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
              : `<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#${art}"/></svg>`}
            ${badge ? `<span class="d-card__badge">${badge}</span>` : ''}
          </div>
          <h4>${p.name}</h4>
          <p>${p.desc}</p>
          <div class="d-card__foot">
            <span class="d-card__price">${p.price}</span>
            <button class="d-card__add press" data-dadd="${p.id}" data-qty="${qtyOf(p.id)}" aria-label="将 ${p.name} 加入茶篮">
              <svg class="ic"><use href="#i-plus"/></svg>
            </button>
          </div>
        </article>`;
    }).join('');
    updateDeliveryBadges();
  }

  function updateDeliveryPromo() {
    const sub = getCartTotal();
    const remain = Math.max(0, FREE_DELIVERY_LIMIT - sub);
    deliveryPromoText.textContent = remain > 0
      ? `再买 ¥${remain} 免配送费 · 新客立减 ¥3`
      : '已享免配送费 · 新客立减 ¥3';
    deliveryProgress.style.width = `${Math.min(100, (sub / FREE_DELIVERY_LIMIT) * 100)}%`;
  }

  function renderDeliveryBar() {
    const count = cartCount();
    deliveryCount.textContent = count > 99 ? '99+' : String(count);
    deliveryTotal.textContent = `¥${deliveryPayable()}`;
    const show = count > 0 && current === 'delivery';
    deliveryBar.classList.toggle('is-show', show);
    deliveryBar.setAttribute('aria-hidden', show ? 'false' : 'true');
    updateDeliveryBadges();
    updateDeliveryPromo();
  }

  function syncDeliveryAddress() {
    const a = selectedAddress();
    addrTag.textContent = a.tag;
    addrText.textContent = a.addr;
    addrMeta.textContent = `${a.contact} · ${a.dist}`;
  }

  function syncEta() {
    const minutes = ETA_MINUTES[state.deliveryEta] || 32;
    etaText.textContent = `${minutes} 分钟`;
    $$('button', etaChips).forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.eta === state.deliveryEta);
    });
    deliverySheetSub.textContent = `配送到${selectedAddress().tag} · 预计 ${minutes} 分钟`;
  }

  function renderAddressSheet() {
    addrList.innerHTML = ADDRESSES.map(a => `
      <button class="addr-item${a.id === state.addressId ? ' is-active' : ''}" data-addr="${a.id}">
        <span class="addr-item__tag">${escapeHtml(a.tag)}</span>
        <span class="addr-item__body"><b>${escapeHtml(a.addr)}</b><small>${escapeHtml(a.contact)} · ${escapeHtml(a.dist)}</small></span>
        <span class="addr-item__check"><svg class="ic"><use href="#i-check"/></svg></span>
      </button>
    `).join('');
  }

  /* 地址弹层：列表视图 / 新增表单视图 */
  function showAddrView(view) {
    const isForm = view === 'form';
    addrListView.hidden = isForm;
    addrFormView.hidden = !isForm;
    if (isForm) {
      addrForm.reset();
      addrFormError.hidden = true;
      $$('.addr-tag', addrFormTags).forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.tag === '家');
      });
    }
  }

  function addrFormTag() {
    const active = $('.addr-tag.is-active', addrFormTags);
    return active ? active.dataset.tag : '家';
  }

  function submitAddress() {
    const addr = addrInputAddr.value.trim();
    const name = addrInputName.value.trim();
    const phoneNo = addrInputPhone.value.trim();
    let error = '';
    if (!addr) error = '请填写收货地址';
    else if (!name) error = '请填写联系人姓名';
    else if (!/^1\d{10}$/.test(phoneNo)) error = '请填写 11 位手机号码';
    if (error) {
      addrFormError.textContent = error;
      addrFormError.hidden = false;
      return;
    }
    const id = `addr-${Date.now()}`;
    ADDRESSES.push({
      id,
      tag: addrFormTag(),
      addr,
      contact: `${name} ${phoneNo}`,
      dist: `距门店 ${(0.8 + Math.random() * 2).toFixed(1)}km`
    });
    state.addressId = id;
    renderAddressSheet();
    syncDeliveryAddress();
    showAddrView('list');
    toast('新地址已保存并使用');
  }

  function renderDeliverySheet() {
    const entries = getEntries();
    const sub = getCartTotal();
    const fee = deliveryFee();
    const pack = deliveryPack();
    const off = deliveryOff();
    const a = selectedAddress();

    deliverySheetAddr.innerHTML = `
      <svg class="ic"><use href="#i-pin"/></svg>
      <div><b>配送到${escapeHtml(a.tag)}</b><p>${escapeHtml(a.addr)}<br>${escapeHtml(a.contact)}</p></div>
    `;
    deliveryItems.innerHTML = entries.map(item => {
      const tgs = [item.temp, item.sugar, item.size,
                   ...(item.addons && item.addons.length
                     ? item.addons.map(formatAddonName) : [])]
        .filter(Boolean).map(t => `<i class="d-item__temp">${escapeHtml(t)}</i>`).join('');
      return `
      <div class="d-item">
        <span>${escapeHtml(item.name)}${tgs}<small>×${item.qty}</small></span>
        <b>¥${item.price * item.qty}</b>
      </div>`;
    }).join('');
    feeSubtotal.textContent = `¥${sub}`;
    feeDelivery.textContent = fee === 0 ? '免配送费' : `¥${fee}`;
    feeOff.textContent = off ? `-¥${off}` : '¥0';
    deliverySheetTotal.textContent = `¥${Math.max(0, sub + fee + pack - off)}`;
    deliverySheetSub.textContent = `配送到${a.tag} · 预计 ${ETA_MINUTES[state.deliveryEta]} 分钟`;
  }

  function openDelivery(from) {
    state.mode = 'delivery';
    updateModeUI();
    state.deliveryFrom = from || (current === 'delivery' ? state.deliveryFrom : current);
    state.deliveryCat = 'all';
    state.deliveryEta = 'asap';
    renderDeliveryCats();
    renderDeliveryGrid();
    syncDeliveryAddress();
    syncEta();
    updateDeliveryPromo();
    go('delivery');
    renderDeliveryBar();
  }

  function closeDelivery() {
    go(screenEl[state.deliveryFrom] && state.deliveryFrom !== 'delivery' ? state.deliveryFrom : 'home');
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
    Object.entries(sheets).forEach(([key, el]) => {
      if (key === name) {
        el.classList.add('is-open');
        return;
      }
      if (!el.classList.contains('is-open')) return;
      /* 其他弹层立即收起，避免切换过程中两个弹层同时可见 */
      el.style.transition = 'none';
      el.classList.remove('is-open');
      void el.offsetWidth;
      el.style.transition = '';
      el.style.transform = '';
    });
    backdrop.classList.add('is-open');
    if (name === 'cart') renderCart();
    if (name === 'member') syncMemberCode();
    if (name === 'address') {
      renderAddressSheet();
      showAddrView('list');
    }
    if (name === 'delivery') renderDeliverySheet();
    if (name === 'coupon') renderPaymentCouponList();
    if (name === 'refund') renderRefundSheet();
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

  function createOrder(entries, totalOverride = null, payment = '未记录', coupon = null) {
    const { hh, mm, y, mo, da } = nowParts();
    const mins = String(Math.floor(Math.random() * 90)).padStart(2, '0');
    const store = selectedStore();
    const order = {
      id: Date.now(),
      no: `QM ${y}${mo}${da} ${hh}${mm}${mins}`,
      pickupCode: String(Math.floor(100000 + Math.random() * 900000)),
      items: entries.map(e => ({
        id: e.id, name: e.name, price: e.price, qty: e.qty,
        temp: e.temp || '', sugar: e.sugar || '',
        size: e.size || '', addons: (e.addons || []).slice()
      })),
      total: totalOverride == null ? entries.reduce((s, e) => s + e.price * e.qty, 0) : totalOverride,
      mode: modeLabel(),
      payment,
      couponId: coupon ? coupon.id : '',
      couponName: coupon ? coupon.name : '',
      couponDiscount: coupon ? coupon.discount : 0,
      time: `今日 ${hh}:${mm}`,
      type: 'store',
      status: 'brewing',
      refund: null,
      store: {
        id: store.id,
        name: store.name,
        addr: store.addr,
        dist: store.dist
      }
    };
    state.orders.unshift(order);
    state.cart.clear();
    updateCartUI();

    setTimeout(() => {
      if (order.status !== 'brewing') return;
      order.status = 'ready';
      renderOrders();
      if (current === 'orderDetail' && state.selectedOrderId === order.id) renderOrderDetail();
    }, 9000);

    return order;
  }

  function orderStatusInfo(order) {
    const isDelivery = order.mode === '配送到家';
    if (order.status === 'refunding') return {
      text: '退款审核中', title: '退款审核中',
      sub: '门店正在处理您的退款申请，结果会及时更新',
      className: 'is-refunding', icon: 'i-clock', step: 1
    };
    if (order.status === 'refunded') return {
      text: '已退款', title: '退款成功',
      sub: `¥${order.total} 已原路退回，请注意查收`,
      className: 'is-refunded', icon: 'i-check', step: 1
    };
    if (order.status === 'ready') return {
      text: isDelivery ? '配送中' : '待取茶',
      title: isDelivery ? '茶饮已出杯' : '茶香已备好',
      sub: isDelivery ? '骑手正在送往您的收货地址，请保持电话畅通' : '请凭取茶码到店取茶，新鲜现泡，建议尽快饮用',
      className: 'is-ready', icon: 'i-check', step: 2
    };
    return {
      text: isDelivery ? '备茶中' : '制作中',
      title: isDelivery ? '正在备茶' : '正在制作',
      sub: '茶艺师正在为您现泡，预计还需 6 分钟',
      className: '', icon: 'i-teapot', step: 1
    };
  }

  function orderCardHTML(order) {
    const lines = order.items.map(item => {
      const tgs = [item.temp, item.sugar, item.size,
                   ...(item.addons && item.addons.length
                     ? item.addons.map(formatAddonName) : [])]
        .filter(Boolean).map(t => `<small class="order-line__temp">${escapeHtml(t)}</small>`).join('');
      return `
      <div class="order-line">
        <span class="order-line__name">${escapeHtml(item.name)}${tgs}<small>×${item.qty}</small></span>
        <span class="order-line__price">¥${item.price * item.qty}</span>
      </div>`;
    }).join('');
    const info = orderStatusInfo(order);
    return `
      <article class="order-card">
        <button class="order-card__main" data-detail="${order.id}" aria-label="查看订单 ${escapeHtml(order.no)} 的详情">
          <div class="order-card__head">
            <span class="order-card__no">${escapeHtml(order.no)}</span>
            <span class="order-card__status ${info.className}">${info.text}</span>
          </div>
          <div class="order-card__items">${lines}</div>
          <div class="order-card__foot">
            <span class="order-card__meta">${order.mode} · ${order.time}</span>
            <span class="order-card__total">合计 ¥${order.total}</span>
          </div>
        </button>
        <div class="order-card__actions">
          <button data-detail="${order.id}">订单详情</button>
          <button data-again="${order.id}">再来一单</button>
        </div>
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

  function selectedOrder() {
    return state.orders.find(order => order.id === state.selectedOrderId) || null;
  }

  function openOrderDetail(id) {
    const order = state.orders.find(item => String(item.id) === String(id));
    if (!order) return;
    state.selectedOrderId = order.id;
    renderOrderDetail();
    go('orderDetail');
  }

  function orderProgressHTML(order) {
    const currentStep = orderStatusInfo(order).step;
    const labels = order.mode === '配送到家'
      ? ['已下单', '备茶中', '配送中', '已送达']
      : ['已下单', '制作中', '待取茶', '已完成'];
    return labels.map((label, index) => {
      const done = index < currentStep;
      const active = index === currentStep;
      return `
        <li class="order-progress__step${done ? ' is-done' : ''}${active ? ' is-current' : ''}">
          <span class="order-progress__dot">${done ? '✓' : index + 1}</span>
          <b>${label}</b>
          <small>${done ? '已完成' : active ? '进行中' : '待更新'}</small>
        </li>`;
    }).join('');
  }

  function renderOrderDetail() {
    const order = selectedOrder();
    if (!order) return;
    const info = orderStatusInfo(order);
    const store = order.store || selectedStore();
    const isRefund = order.status === 'refunding' || order.status === 'refunded';
    const isTakeout = order.mode === '门店自取';
    const pickupCode = order.pickupCode || String(order.id).slice(-6).padStart(6, '0');

    const goods = order.items.map(item => {
      const product = PRODUCT_INDEX.get(item.id);
      const tags = [item.temp, item.sugar, item.size,
        ...(item.addons || []).map(formatAddonName)].filter(Boolean).join(' · ');
      return `
        <div class="order-good">
          <div class="order-good__thumb">
            ${product && product.img
              ? `<img src="${escapeHtml(product.img)}" alt="${escapeHtml(item.name)}">`
              : '<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#art-teapot"/></svg>'}
          </div>
          <div class="order-good__body">
            <h4>${escapeHtml(item.name)}</h4>
            <p>${escapeHtml(tags || '标准规格')}</p>
          </div>
          <div class="order-good__price"><b>¥${item.price * item.qty}</b><small>×${item.qty}</small></div>
        </div>`;
    }).join('');

    orderDetailContent.innerHTML = `
      <section class="order-status-card ${info.className}">
        <span class="order-status-card__icon"><svg class="ic"><use href="#${info.icon}"/></svg></span>
        <div class="order-status-card__body">
          <small>JIE CHA XIANG · ORDER</small>
          <h2>${info.title}</h2>
          <p>${info.sub}</p>
        </div>
      </section>

      ${isTakeout && !isRefund ? `
        <section class="order-detail-card pickup-card">
          <div class="detail-card-head"><h3>取茶码</h3><small>${order.status === 'ready' ? '已出杯 · 请尽快取茶' : '取茶时请出示'}</small></div>
          <button class="pickup-code" data-copy-code="${pickupCode}" aria-label="复制取茶码 ${pickupCode}">
            <span>${pickupCode.slice(0, 3)}</span><span>${pickupCode.slice(3)}</span><small>点击复制</small>
          </button>
          <p class="pickup-card__tip"><i></i>到店向店员出示此码，核销后即可取茶</p>
        </section>` : ''}

      ${isRefund ? `
        <section class="order-detail-card order-refund-note">
          <span class="order-refund-note__icon"><svg class="ic"><use href="#${order.status === 'refunded' ? 'i-check' : 'i-clock'}"/></svg></span>
          <div>
            <h3>${order.status === 'refunded' ? '退款已完成' : '退款申请已提交'}</h3>
            <p>${order.status === 'refunded' ? `¥${order.total} 已原路退回，请注意查收` : '门店正在审核，退款状态会自动更新'}</p>
          </div>
          <button data-refund-open>查看</button>
        </section>` : `
        <section class="order-detail-card">
          <div class="detail-card-head"><h3>制作进度</h3><small>状态自动更新</small></div>
          <ol class="order-progress">${orderProgressHTML(order)}</ol>
        </section>`}

      <section class="order-detail-card">
        <div class="detail-card-head"><h3>${isTakeout ? '取茶门店' : '出品门店'}</h3><small>营业中</small></div>
        <div class="order-store__top">
          <span class="order-store__icon"><svg class="ic"><use href="#i-pin"/></svg></span>
          <div class="order-store__body">
            <h3>${escapeHtml(store.name)}</h3>
            <p>${escapeHtml(store.addr)}</p>
            <div class="order-store__meta"><b>09:00 - 22:00</b><span>·</span><span>${escapeHtml(store.dist)}</span></div>
          </div>
          <button class="order-store__copy" data-copy-address="${escapeHtml(store.addr)}">复制地址</button>
        </div>
      </section>

      <section class="order-detail-card">
        <div class="detail-card-head"><h3>商品明细</h3><small>共 ${order.items.reduce((sum, item) => sum + item.qty, 0)} 件</small></div>
        <div class="order-goods">${goods}</div>
      </section>

      <section class="order-detail-card">
        <div class="detail-card-head"><h3>订单信息</h3><small>电子小票</small></div>
        <dl class="order-meta">
          <div><dt>订单编号</dt><dd>${escapeHtml(order.no)}</dd></div>
          <div><dt>下单时间</dt><dd>${escapeHtml(order.time)}</dd></div>
          <div><dt>取餐方式</dt><dd>${escapeHtml(order.mode)}</dd></div>
          <div><dt>支付方式</dt><dd>${escapeHtml(order.payment || '未记录')}</dd></div>
          ${order.couponName ? `
            <div><dt>优惠券</dt><dd>${escapeHtml(order.couponName)}</dd></div>
            <div><dt>券优惠</dt><dd class="is-discount">-¥${formatMoney(order.couponDiscount)}</dd></div>` : ''}
          <div class="is-total"><dt>实付金额</dt><dd>¥${formatMoney(order.total)}</dd></div>
        </dl>
      </section>`;

    refundBtn.textContent = order.status === 'refunding'
      ? '退款进度'
      : order.status === 'refunded' ? '退款详情' : '申请退款';
  }

  function renderRefundSheet() {
    const order = selectedOrder();
    if (!order) return;
    const hasRefund = Boolean(order.refund);
    refundApplyView.hidden = hasRefund;
    refundStatusView.hidden = !hasRefund;
    $('#refundSheetTitle').textContent = hasRefund ? '退款详情' : '申请退款';

    if (!hasRefund) {
      $('#refundAmount').textContent = `¥${order.total}`;
      $$('[data-refund-reason]', $('#refundReasons')).forEach(btn => {
        const active = btn.dataset.refundReason === state.refundReason;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      return;
    }

    const refunded = order.status === 'refunded';
    $('#refundStatusTitle').textContent = refunded ? '退款成功' : '退款审核中';
    $('#refundStatusDesc').textContent = refunded
      ? '退款已原路退回，到账时间以支付机构为准'
      : '门店正在处理您的退款申请，请稍候';
    $('#refundStatusAmount').textContent = `¥${order.total}`;
    $('#refundStatusReason').textContent = order.refund.reason;
    $('.refund-status__icon use').setAttribute('href', refunded ? '#i-check' : '#i-clock');
  }

  function openRefundSheet() {
    const order = selectedOrder();
    if (!order) return;
    if (!order.refund) {
      state.refundReason = '不想要了';
      refundNote.value = '';
    }
    openSheet('refund');
  }

  function applyRefund() {
    const order = selectedOrder();
    if (!order || order.refund) return;
    const { hh, mm } = nowParts();
    order.status = 'refunding';
    order.refund = {
      reason: state.refundReason,
      note: refundNote.value.trim(),
      appliedAt: `今日 ${hh}:${mm}`
    };
    closeSheets();
    renderOrders();
    renderOrderDetail();
    toast('退款申请已提交，门店正在审核');

    setTimeout(() => {
      order.status = 'refunded';
      order.refund.completedAt = '刚刚';
      renderOrders();
      if (state.selectedOrderId !== order.id) return;
      if (current === 'orderDetail') renderOrderDetail();
      if (sheets.refund.classList.contains('is-open')) renderRefundSheet();
      toast('退款已原路退回');
    }, 4500);
  }

  function reorder(order) {
    if (!order) return;
    order.items.forEach(item => {
      const addons = item.addons && item.addons.length ? item.addons.slice() : [];
      const key = cartKey(item.id, item.temp, item.sugar, item.size, addons);
      const currentItem = state.cart.get(key);
      state.cart.set(key, {
        id: item.id, temp: item.temp || '', sugar: item.sugar || '',
        size: item.size || '', addons,
        qty: (currentItem ? currentItem.qty : 0) + item.qty
      });
    });
    updateCartUI();
    go('menu');
    renderCart();
    setTimeout(openCart, 320);
    toast('已为您重新加入茶篮');
  }

  async function copyText(text, message) {
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
      toast(message);
    } catch (error) {
      toast(`请手动复制：${text}`);
    }
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

  /* ---------------- 券中心与结算流程 ---------------- */
  let busy = false;

  function formatMoney(value) {
    return Number(value || 0).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  }
  function toCents(value) {
    return Math.round(Number(value || 0) * 100);
  }
  function fromCents(value) {
    return value / 100;
  }
  function couponScopeLabel(coupon) {
    return coupon.scope === 'delivery' ? '仅外卖可用' : '自取 / 外卖可用';
  }
  function couponTypeLabel(coupon) {
    return coupon.kind === 'discount' ? '折扣券' : coupon.kind === 'delivery' ? '配送券' : '满减券';
  }
  function couponRuleText(coupon) {
    return coupon.minSubtotal ? `满 ${formatMoney(fromCents(coupon.minSubtotal))} 元可用` : '无门槛使用';
  }
  function couponFaceHTML(coupon) {
    const value = coupon.kind === 'discount'
      ? formatMoney(coupon.value / 10)
      : formatMoney(fromCents(coupon.value));
    return `
      <div class="coupon-face">
        <div class="coupon-face__value">${coupon.kind === 'discount'
          ? `<strong>${value}</strong><span>折</span>`
          : `<span>¥</span><strong>${value}</strong>`}</div>
        <small>${couponTypeLabel(coupon)}</small>
      </div>`;
  }
  function syncCouponStats() {
    const count = state.coupons.filter(coupon => coupon.status === 'available').length;
    $('#couponAvailableCount').textContent = count;
    $('#profileCouponCount').textContent = `${count} 张可用`;
    $('#rightsCouponCount').textContent = count;
    $$('[data-stat="coupon"], [data-home-stat="coupon"]').forEach(el => {
      el.textContent = count;
    });
  }
  function renderCoupons() {
    syncCouponStats();
    $$('[data-coupon-tab]', couponTabs).forEach(btn => {
      const active = btn.dataset.couponTab === state.couponTab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    const list = state.coupons.filter(coupon => state.couponTab === 'all' || coupon.status === state.couponTab);
    if (!list.length) {
      couponList.innerHTML = `
        <div class="coupon-empty">
          <svg class="ic" aria-hidden="true"><use href="#i-ticket"/></svg>
          <h3>这里还没有优惠券</h3><p>看看其他分类，或领取一张好茶礼券</p>
        </div>`;
      return;
    }
    couponList.innerHTML = list.map(coupon => {
      const statusText = { available: '可使用', claimable: '待领取', used: '已使用' }[coupon.status];
      const action = coupon.status === 'claimable'
        ? `<button class="coupon-card__action coupon-card__action--claim press" data-claim-coupon="${coupon.id}">立即领取</button>`
        : coupon.status === 'available'
          ? `<button class="coupon-card__action press" data-use-coupon="${coupon.id}">去使用</button>`
          : '<button class="coupon-card__action" disabled>已使用</button>';
      return `
        <article class="coupon-card coupon-card--${coupon.kind} is-${coupon.status}">
          <div class="coupon-card__content">
            ${couponFaceHTML(coupon)}
            <div class="coupon-card__body">
              <div class="coupon-card__title"><h3>${escapeHtml(coupon.name)}</h3><span>${statusText}</span></div>
              <p>${couponRuleText(coupon)}</p>
              <small>${couponScopeLabel(coupon)}</small>
              <small>有效期至 ${coupon.expiry}</small>
            </div>
          </div>
          <div class="coupon-card__footer"><span>${escapeHtml(coupon.note)}</span>${action}</div>
        </article>`;
    }).join('');
  }
  function openCoupons(from) {
    const source = from || current;
    state.couponFrom = screenEl[source] && source !== 'coupons' && source !== 'splash' ? source : 'profile';
    closeSheets();
    renderCoupons();
    go('coupons');
  }
  function renderRightsAsset(type = state.rightsAsset) {
    const assetTypes = ['balance', 'coupons', 'points'];
    state.rightsAsset = assetTypes.includes(type) ? type : 'balance';
    $('#rightsNickname').textContent = state.memberName;
    $$('[data-rights-asset]', $('#rightsAssets')).forEach(btn => {
      const active = btn.dataset.rightsAsset === state.rightsAsset;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const titles = { balance: '余额明细', coupons: '可用优惠券', points: '积分明细' };
    $('#rightsAssetTitle').textContent = titles[state.rightsAsset];
    $('#rightsOpenCoupons').hidden = state.rightsAsset !== 'coupons';
    const list = $('#rightsAssetList');

    if (state.rightsAsset === 'coupons') {
      const available = state.coupons.filter(coupon => coupon.status === 'available');
      list.innerHTML = available.length ? available.map(coupon => {
        const value = coupon.kind === 'discount'
          ? `${formatMoney(coupon.value / 10)} 折`
          : `¥${formatMoney(fromCents(coupon.value))}`;
        return `
          <article class="rights-asset-record rights-coupon-record">
            <span class="rights-coupon-record__value">${value}</span>
            <div><h4>${escapeHtml(coupon.name)}</h4><p>${couponRuleText(coupon)} · ${couponScopeLabel(coupon)}</p><small>有效期至 ${coupon.expiry}</small></div>
          </article>`;
      }).join('') : '<div class="rights-asset-empty"><svg class="ic"><use href="#i-ticket"/></svg><p>暂无可用优惠券，去券中心领取好茶礼券</p></div>';
      return;
    }

    const records = {
      balance: [
        { title: '账户充值', meta: '2026.11.18 · 微信支付', amount: '+¥100.00', icon: 'i-card' },
        { title: '会员储值赠额', meta: '2026.11.18 · 开卡礼遇', amount: '+¥28.00', icon: 'i-gift' },
        { title: '秋日茶单支付', meta: '2026.11.08 · 门店消费', amount: '-¥20.00', icon: 'i-receipt' }
      ],
      points: [
        { title: '订单消费奖励', meta: '2026.11.18 · 清茶订单', amount: '+26', icon: 'i-receipt' },
        { title: '完成订单评价', meta: '2026.11.16 · 有效评价', amount: '+20', icon: 'i-star' },
        { title: '每日签到', meta: '2026.11.15 · 连续签到', amount: '+5', icon: 'i-check' },
        { title: '积分抵现', meta: '2026.11.12 · 订单抵扣', amount: '-100', icon: 'i-ticket' }
      ]
    };
    list.innerHTML = records[state.rightsAsset].map(record => `
      <article class="rights-asset-record">
        <span class="rights-asset-record__icon"><svg class="ic"><use href="#${record.icon}"/></svg></span>
        <div><h4>${record.title}</h4><p>${record.meta}</p></div>
        <strong class="${record.amount.startsWith('+') ? 'is-plus' : ''}">${record.amount}</strong>
      </article>`).join('');
  }
  function openRights() {
    closeSheets();
    renderRightsAsset();
    go('rights');
  }

  function claimCoupon(id) {
    const coupon = state.coupons.find(item => item.id === id);
    if (!coupon || coupon.status !== 'claimable') return;
    coupon.status = 'available';
    renderCoupons();
    toast(`已领取「${coupon.name}」`);
  }
  function useCoupon(id) {
    const coupon = state.coupons.find(item => item.id === id);
    if (!coupon || coupon.status !== 'available') return;
    if (coupon.scope === 'delivery') {
      openDelivery('coupons');
    } else {
      setMode('takeout', false);
      go('menu');
    }
    toast('点单结算时可使用此券');
  }

  function couponUnavailableReason(coupon, draft) {
    if (!draft) return '订单信息已失效';
    if (coupon.status === 'used') return '此券已使用';
    if (coupon.status === 'claimable') return '请先到券中心领取';
    if (coupon.status !== 'available') return '此券暂不可用';
    if (coupon.scope === 'delivery' && draft.modeKey !== 'delivery') return '仅外卖订单可用';
    const subtotal = toCents(draft.subtotal);
    if (subtotal < coupon.minSubtotal) {
      return `满 ${formatMoney(fromCents(coupon.minSubtotal))} 元可用，还差 ${formatMoney(fromCents(coupon.minSubtotal - subtotal))} 元`;
    }
    if (coupon.kind === 'delivery' && toCents(draft.deliveryFee) <= 0) return '当前订单已免配送费';
    if (coupon.kind !== 'delivery' && subtotal - toCents(draft.activityDiscount) <= 0) return '当前订单无需用券';
    return '';
  }
  function couponDiscount(coupon, draft) {
    if (!coupon || couponUnavailableReason(coupon, draft)) return 0;
    if (coupon.kind === 'delivery') {
      return Math.min(coupon.value, toCents(draft.deliveryFee));
    }
    const subtotal = toCents(draft.subtotal);
    const productAfterActivity = Math.max(0, subtotal - toCents(draft.activityDiscount));
    const discount = coupon.kind === 'discount'
      ? Math.floor(subtotal * (100 - coupon.value) / 100)
      : coupon.value;
    return Math.min(discount, productAfterActivity);
  }
  function bestCoupon(draft) {
    let best = null;
    let maxDiscount = 0;
    state.coupons.forEach(coupon => {
      const discount = couponDiscount(coupon, draft);
      if (discount > maxDiscount) {
        best = coupon;
        maxDiscount = discount;
      }
    });
    return best;
  }
  function recalculateDraft() {
    const draft = state.paymentDraft;
    if (!draft) return;
    const coupon = state.coupons.find(item => item.id === draft.couponId);
    const discount = couponDiscount(coupon, draft);
    draft.couponDiscount = fromCents(discount);
    draft.total = fromCents(Math.max(0,
      toCents(draft.subtotal) + toCents(draft.deliveryFee) + toCents(draft.packFee)
      - toCents(draft.activityDiscount) - discount
    ));
  }
  function renderPaymentCouponList() {
    const draft = state.paymentDraft;
    if (!draft) {
      paymentCouponList.innerHTML = '';
      return;
    }
    const noneOption = `
      <button class="payment-coupon-option payment-coupon-option--none${draft.couponId ? '' : ' is-active'}" data-select-coupon="" role="radio" aria-checked="${!draft.couponId}">
        <span class="payment-coupon-option__none-icon"><svg class="ic"><use href="#i-close"/></svg></span>
        <span class="payment-coupon-option__body"><b>不使用优惠券</b><small>保留优惠券，下次结算再用</small></span>
        <span class="payment-coupon-option__check"><svg class="ic"><use href="#i-check"/></svg></span>
      </button>`;
    const options = state.coupons.filter(coupon => coupon.status !== 'claimable').map(coupon => {
      const reason = couponUnavailableReason(coupon, draft);
      const discount = couponDiscount(coupon, draft);
      const active = draft.couponId === coupon.id && !reason;
      return `
        <button class="payment-coupon-option coupon-card--${coupon.kind}${active ? ' is-active' : ''}${reason ? ' is-disabled' : ''}"
          data-select-coupon="${coupon.id}" role="radio" aria-checked="${active}" ${reason ? 'disabled' : ''}>
          ${couponFaceHTML(coupon)}
          <span class="payment-coupon-option__body">
            <b>${escapeHtml(coupon.name)}</b>
            <small>${couponRuleText(coupon)} · ${couponScopeLabel(coupon)}</small>
            <em>${reason || `本单可减 ¥${formatMoney(fromCents(discount))}`}</em>
          </span>
          <span class="payment-coupon-option__check"><svg class="ic"><use href="#i-check"/></svg></span>
        </button>`;
    }).join('');
    paymentCouponList.innerHTML = noneOption + options;
  }
  function selectCoupon(id) {
    if (busy || !state.paymentDraft) return;
    const coupon = id ? state.coupons.find(item => item.id === id) : null;
    if (id) {
      if (!coupon) return;
      const reason = couponUnavailableReason(coupon, state.paymentDraft);
      if (reason) {
        toast(reason);
        return;
      }
    }
    state.paymentDraft.couponId = coupon ? coupon.id : null;
    recalculateDraft();
    renderPayment();
    renderPaymentCouponList();
    closeSheets();
    toast(coupon ? `已选择「${coupon.name}」` : '本单不使用优惠券');
  }

  function selectPayment(method) {
    if (!PAYMENT_METHODS[method]) return;
    state.paymentMethod = method;
    $$('input[name="paymentMethod"]', paymentMethods).forEach(input => {
      const active = input.value === method;
      input.checked = active;
      input.closest('.payment-method').classList.toggle('is-active', active);
    });
    const total = state.paymentDraft ? state.paymentDraft.total : 0;
    confirmPaymentBtn.textContent = `${PAYMENT_METHODS[method]} ¥${formatMoney(total)}`;
  }

  function renderPayment() {
    const draft = state.paymentDraft;
    if (!draft) return;
    recalculateDraft();
    const qty = draft.entries.reduce((sum, item) => sum + item.qty, 0);
    const selectedCoupon = state.coupons.find(coupon => coupon.id === draft.couponId);
    const availableCount = state.coupons.filter(coupon => couponDiscount(coupon, draft) > 0).length;
    paymentAmount.textContent = formatMoney(draft.total);
    paymentMode.textContent = `${draft.mode} · 共 ${qty} 件商品`;
    paymentCount.textContent = `共 ${qty} 件`;
    paymentItems.innerHTML = draft.entries.map(item => {
      const product = PRODUCT_INDEX.get(item.id);
      const specs = [item.temp, item.sugar, item.size,
                     ...(item.addons || []).map(formatAddonName)]
        .filter(Boolean).join(' · ');
      return `
        <div class="order-good">
          <div class="order-good__thumb"><img src="${escapeHtml(product?.img || '')}" alt="${escapeHtml(item.name)}"></div>
          <div class="order-good__body"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(specs)}</p></div>
          <div class="order-good__price"><b>¥${formatMoney(item.price * item.qty)}</b><small>×${item.qty}</small></div>
        </div>`;
    }).join('');

    const priceRows = [
      `<p><span>商品小计</span><b>¥${formatMoney(draft.subtotal)}</b></p>`
    ];
    if (draft.modeKey === 'delivery') {
      priceRows.push(`<p><span>配送费</span><b>${draft.deliveryFee ? `¥${formatMoney(draft.deliveryFee)}` : '免配送费'}</b></p>`);
      priceRows.push(`<p><span>打包费</span><b>¥${formatMoney(draft.packFee)}</b></p>`);
    }
    if (draft.activityDiscount) {
      priceRows.push(`<p class="is-discount"><span>新客立减</span><b>-¥${formatMoney(draft.activityDiscount)}</b></p>`);
    }
    priceRows.push(`<p class="is-discount"><span>券优惠</span><b>${selectedCoupon ? `-¥${formatMoney(draft.couponDiscount)}` : '未使用'}</b></p>`);
    priceRows.push(`<div class="payment-price-total"><span>券后实付</span><b>¥${formatMoney(draft.total)}</b></div>`);
    paymentPriceDetails.innerHTML = priceRows.join('');

    paymentCouponHint.textContent = selectedCoupon
      ? selectedCoupon.name
      : availableCount ? `${availableCount} 张券可用，点击选择` : '暂无满足本单条件的券';
    paymentCouponValue.textContent = selectedCoupon
      ? `-¥${formatMoney(draft.couponDiscount)}`
      : availableCount ? `${availableCount} 张可用` : '不使用券';
    confirmPaymentBtn.disabled = false;
    selectPayment(state.paymentMethod);
  }

  function checkout() {
    if (busy) return;
    const entries = getEntries();
    if (!entries.length) {
      toast('茶篮还是空的');
      return;
    }
    const isDelivery = state.mode === 'delivery';
    state.paymentMethod = 'wechat';
    state.paymentDraft = {
      entries: entries.map(item => ({ ...item, addons: (item.addons || []).slice() })),
      subtotal: getCartTotal(),
      deliveryFee: isDelivery ? deliveryFee() : 0,
      packFee: isDelivery ? deliveryPack() : 0,
      activityDiscount: isDelivery ? deliveryOff() : 0,
      couponId: null,
      couponDiscount: 0,
      total: 0,
      mode: modeLabel(),
      modeKey: state.mode,
      from: current === 'delivery' ? 'delivery' : 'menu'
    };
    const best = bestCoupon(state.paymentDraft);
    state.paymentDraft.couponId = best ? best.id : null;
    recalculateDraft();
    closeSheets();
    renderPayment();
    go('payment');
  }

  function confirmPayment() {
    if (busy) return;
    const draft = state.paymentDraft;
    if (!draft || !draft.entries.length) {
      toast('订单信息已失效，请重新结算');
      go('menu');
      return;
    }
    const selectedCoupon = draft.couponId
      ? state.coupons.find(coupon => coupon.id === draft.couponId)
      : null;
    if (draft.couponId) {
      const reason = selectedCoupon ? couponUnavailableReason(selectedCoupon, draft) : '优惠券不存在或已失效';
      if (reason) {
        draft.couponId = null;
        recalculateDraft();
        renderPayment();
        toast(`${reason}，请重新确认`);
        return;
      }
    }
    recalculateDraft();
    renderPayment();
    busy = true;
    confirmPaymentBtn.disabled = true;
    paymentCouponBtn.disabled = true;
    confirmPaymentBtn.textContent = '正在支付…';
    brewLayer.classList.add('is-open');
    brewLayer.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      brewLayer.classList.remove('is-open');
      brewLayer.setAttribute('aria-hidden', 'true');
      const couponMeta = selectedCoupon
        ? { id: selectedCoupon.id, name: selectedCoupon.name, discount: draft.couponDiscount }
        : null;
      const order = createOrder(draft.entries, draft.total, PAYMENT_METHODS[state.paymentMethod], couponMeta);
      if (selectedCoupon) {
        selectedCoupon.status = 'used';
        selectedCoupon.usedOrderId = order.id;
      }
      syncCouponStats();
      renderCoupons();
      state.paymentDraft = null;
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
        toast(selectedCoupon ? `支付成功，已核销「${selectedCoupon.name}」` : '支付成功，茶已入壶');
        busy = false;
        confirmPaymentBtn.disabled = false;
        paymentCouponBtn.disabled = false;
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
    go('login');
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function applyLoginState(name) {
    state.loggedIn = true;
    const displayName = (name || '').trim() || '青瓷会员';
    state.memberName = displayName;
    $('#rightsNickname').textContent = displayName;
    greetingLine.innerHTML = `Hi，<em>${escapeHtml(displayName)}</em>，歡迎你`;
    loginTip.textContent = '本月已品 6 盏好茶 · 会员日每月 8 号';
    loginBtn.textContent = '会员码';
    loginBtn.classList.add('is-on');

    animateValue($('[data-stat="balance"]'), 128, v => v.toFixed(2));
    syncCouponStats();
    animateValue($('[data-stat="points"]'), 520, v => String(Math.round(v)));
    animateValue($('[data-home-stat="points"]'), 520, v => String(Math.round(v)));

    const footText = $('.vip-card__foot > span');
    if (footText) footText.textContent = '青瓷会员 · 有效期至 2027.12.31';

    go('home');
    toast('登录成功，欢迎回到解茶香');
  }

  function setAuthError(errorEl, msg, inputEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('is-show');
    if (inputEl) {
      inputEl.classList.add('is-error');
      inputEl.focus();
    }
  }

  function clearAuthError(errorEl, form) {
    errorEl.classList.remove('is-show');
    if (!form) return;
    $$('.auth-input.is-error', form).forEach(input => input.classList.remove('is-error'));
  }

  function submitLogin() {
    const form = $('#loginForm');
    const errorEl = $('#loginError');
    const btn = $('.auth-submit', form);
    if (btn.classList.contains('is-busy')) return;
    clearAuthError(errorEl, form);

    const email = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value;
    if (!email) return setAuthError(errorEl, '请输入 E-mail 帐号', $('#loginEmail'));
    if (!EMAIL_RE.test(email)) return setAuthError(errorEl, 'E-mail 格式好像不太对', $('#loginEmail'));
    if (!password) return setAuthError(errorEl, '请输入登录密码', $('#loginPassword'));
    if (password.length < 6) return setAuthError(errorEl, '密码至少 6 位字符', $('#loginPassword'));

    btn.classList.add('is-busy');
    btn.textContent = '登录中';
    setTimeout(() => {
      btn.classList.remove('is-busy');
      btn.textContent = '登录';
      $('#loginPassword').value = '';
      if (current === 'login') applyLoginState('青瓷会员');
    }, 520);
  }

  function submitRegister() {
    const form = $('#registerForm');
    const errorEl = $('#registerError');
    const btn = $('.auth-submit', form);
    if (btn.classList.contains('is-busy')) return;
    clearAuthError(errorEl, form);

    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim();
    const password = $('#regPassword').value;
    const confirm = $('#regConfirm').value;
    if (!name) return setAuthError(errorEl, '请先取一个茶名', $('#regName'));
    if (!email) return setAuthError(errorEl, '请输入 E-mail 帐号', $('#regEmail'));
    if (!EMAIL_RE.test(email)) return setAuthError(errorEl, 'E-mail 格式好像不太对', $('#regEmail'));
    if (password.length < 6) return setAuthError(errorEl, '密码至少 6 位字符', $('#regPassword'));
    if (confirm !== password) return setAuthError(errorEl, '两次输入的密码不一致', $('#regConfirm'));
    if (!$('#regAgree').checked) return setAuthError(errorEl, '请先阅读并同意用户协议', null);

    btn.classList.add('is-busy');
    btn.textContent = '注册中';
    setTimeout(() => {
      btn.classList.remove('is-busy');
      btn.textContent = '注册并登录';
      form.reset();
      if (current === 'register') applyLoginState(name);
    }, 620);
  }

  let thirdBusy = false;
  function thirdPartyLogin(kind) {
    if (thirdBusy) return;
    thirdBusy = true;
    toast(`正在唤起${kind}授权…`);
    setTimeout(() => {
      thirdBusy = false;
      if (current === 'login') applyLoginState(kind === '微信' ? '微信茶友' : '手机茶友');
    }, 900);
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
      const couponEntry = e.target.closest('[data-open-coupons]');
      if (couponEntry) {
        openCoupons(couponEntry.dataset.openCoupons);
        return;
      }
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
        if (action === 'coupon') openCoupons(current);
        if (action === 'service') toast('茶艺师已收到您的呼唤');
      });
    });

    // 首页
    $$('.mode').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.mode === 'delivery') {
          openDelivery('home');
          return;
        }
        setMode(btn.dataset.mode);
        setTimeout(() => go('menu'), 260);
      });
    });

    // 外卖
    $('#deliveryBack').addEventListener('click', closeDelivery);
    deliveryCats.addEventListener('click', e => {
      const btn = e.target.closest('[data-dcat]');
      if (!btn || btn.dataset.dcat === state.deliveryCat) return;
      state.deliveryCat = btn.dataset.dcat;
      renderDeliveryCats();
      renderDeliveryGrid();
      deliveryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    deliveryGrid.addEventListener('click', e => {
      const addBtn = e.target.closest('[data-dadd]');
      if (addBtn) { openProduct(addBtn.dataset.dadd, 'delivery'); return; }
      const card = e.target.closest('.d-card');
      if (card && card.dataset.pid) openProduct(card.dataset.pid, 'delivery');
    });
    deliveryGrid.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.d-card');
      if (!card || !card.dataset.pid) return;
      e.preventDefault();
      openProduct(card.dataset.pid, 'delivery');
    });
    etaChips.addEventListener('click', e => {
      const btn = e.target.closest('[data-eta]');
      if (!btn || btn.dataset.eta === state.deliveryEta) return;
      state.deliveryEta = btn.dataset.eta;
      syncEta();
    });
    $('#addrCard').addEventListener('click', () => openSheet('address'));
    $('#addrAddBtn').addEventListener('click', () => showAddrView('form'));
    $('#addrFormBack').addEventListener('click', () => showAddrView('list'));
    addrFormTags.addEventListener('click', e => {
      const btn = e.target.closest('[data-tag]');
      if (!btn) return;
      $$('.addr-tag', addrFormTags).forEach(el => el.classList.toggle('is-active', el === btn));
    });
    addrForm.addEventListener('submit', e => {
      e.preventDefault();
      submitAddress();
    });
    addrForm.addEventListener('input', () => { addrFormError.hidden = true; });
    addrList.addEventListener('click', e => {
      const btn = e.target.closest('[data-addr]');
      if (!btn) return;
      state.addressId = btn.dataset.addr;
      renderAddressSheet();
      syncDeliveryAddress();
      closeSheets();
      toast(`已切换至${selectedAddress().tag} · ${selectedAddress().dist}`);
    });
    $('#deliveryCheckout').addEventListener('click', () => {
      if (cartCount() === 0) return;
      openSheet('delivery');
    });
    $('#deliveryCartBtn').addEventListener('click', () => {
      if (cartCount() === 0) {
        toast('先挑一杯喜欢的茶');
        return;
      }
      openSheet('delivery');
    });
    $('#deliverySubmit').addEventListener('click', () => {
      if (cartCount() === 0) {
        closeSheets();
        return;
      }
      checkout();
    });

    // 种类
    catList.addEventListener('click', e => {
      const btn = e.target.closest('[data-cat]');
      if (btn) switchCat(btn.dataset.cat);
    });
    productList.addEventListener('click', e => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) { openProduct(addBtn.dataset.add, 'menu'); return; }
      const card = e.target.closest('.product');
      if (card && card.dataset.pid) openProduct(card.dataset.pid, 'menu');
    });
    productList.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.product');
      if (!card || !card.dataset.pid) return;
      e.preventDefault();
      openProduct(card.dataset.pid, 'menu');
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
      btn.addEventListener('click', () => {
        if (btn.dataset.storeMode === 'delivery') {
          openDelivery('menu');
          return;
        }
        setMode(btn.dataset.storeMode);
      });
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
      setQty(btn.dataset.key, Number(btn.dataset.step));
    });
    clearCartBtn.addEventListener('click', () => {
      state.cart.clear();
      updateCartUI();
      renderCart();
      toast('茶篮已清空');
    });
    checkoutBtn.addEventListener('click', () => checkout());

    // 券中心
    $('#couponBack').addEventListener('click', () => go(state.couponFrom));
    couponTabs.addEventListener('click', e => {
      const btn = e.target.closest('[data-coupon-tab]');
      if (!btn) return;
      state.couponTab = btn.dataset.couponTab;
      renderCoupons();
    });
    couponList.addEventListener('click', e => {
      const claimBtn = e.target.closest('[data-claim-coupon]');
      if (claimBtn) {
        claimCoupon(claimBtn.dataset.claimCoupon);
        return;
      }
      const useBtn = e.target.closest('[data-use-coupon]');
      if (useBtn) useCoupon(useBtn.dataset.useCoupon);
    });

    // 支付
    paymentCouponBtn.addEventListener('click', () => {
      if (!busy && state.paymentDraft) openSheet('coupon');
    });
    paymentCouponList.addEventListener('click', e => {
      const btn = e.target.closest('[data-select-coupon]');
      if (btn && !btn.disabled) selectCoupon(btn.dataset.selectCoupon);
    });
    paymentMethods.addEventListener('change', e => {
      const input = e.target.closest('input[name="paymentMethod"]');
      if (input && !busy) selectPayment(input.value);
    });
    confirmPaymentBtn.addEventListener('click', confirmPayment);
    $('#paymentBack').addEventListener('click', () => {
      if (busy) return;
      const target = state.paymentDraft ? state.paymentDraft.from : 'menu';
      state.paymentDraft = null;
      go(target);
    });

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
      const againBtn = e.target.closest('[data-again]');
      if (againBtn) {
        const order = state.orders.find(o => String(o.id) === againBtn.dataset.again);
        reorder(order);
        return;
      }
      const detailBtn = e.target.closest('[data-detail]');
      if (detailBtn) openOrderDetail(detailBtn.dataset.detail);
    });

    // 订单详情、取茶码与退款
    $('#orderDetailBack').addEventListener('click', () => go('orders'));
    $('#detailAgainBtn').addEventListener('click', () => reorder(selectedOrder()));
    refundBtn.addEventListener('click', openRefundSheet);
    orderDetailContent.addEventListener('click', e => {
      const codeBtn = e.target.closest('[data-copy-code]');
      if (codeBtn) {
        copyText(codeBtn.dataset.copyCode, '取茶码已复制');
        return;
      }
      const addressBtn = e.target.closest('[data-copy-address]');
      if (addressBtn) {
        copyText(addressBtn.dataset.copyAddress, '门店地址已复制');
        return;
      }
      if (e.target.closest('[data-refund-open]')) openRefundSheet();
    });
    $('#refundReasons').addEventListener('click', e => {
      const btn = e.target.closest('[data-refund-reason]');
      if (!btn) return;
      state.refundReason = btn.dataset.refundReason;
      $$('[data-refund-reason]', $('#refundReasons')).forEach(item => {
        const active = item === btn;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
    $('#refundSubmit').addEventListener('click', applyRefund);

    // 用户权益
    $('#rightsBack').addEventListener('click', () => go('profile'));
    $('#vipRightsEntry').addEventListener('click', openRights);
    $('#rightsAssets').addEventListener('click', e => {
      const btn = e.target.closest('[data-rights-asset]');
      if (btn) renderRightsAsset(btn.dataset.rightsAsset);
    });
    $('#rightsOpenCoupons').addEventListener('click', () => openCoupons('rights'));

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
        if (key === 'coupons') {
          openCoupons('profile');
          return;
        }
        if (key === 'rights') {
          openRights();
          return;
        }
        const messages = {
          info: '个人信息 · 即将开放',
          service: '茶艺师在线，请稍候',
          address: '暂未设置常用地址',
          account: '账号与安全 · 即将开放'
        };
        toast(messages[key] || '敬请期待');
      });
    });

    // 登录 / 注册
    $('#loginBack').addEventListener('click', () => go('profile'));
    $('#registerBack').addEventListener('click', () => go('login'));

    // 品牌故事
    $('#brandEntry').addEventListener('click', () => go('about'));
    $('#aboutBack').addEventListener('click', () => go('home'));

    // 选购页
    $('#productBack').addEventListener('click', () => go(state.productFrom));
    productTempsEl.addEventListener('click', e => {
      const chip = e.target.closest('[data-temp]');
      if (!chip) return;
      state.productTemp = chip.dataset.temp;
      $$('[data-temp]', productTempsEl).forEach(el => {
        const on = el.dataset.temp === state.productTemp;
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-pressed', String(on));
      });
    });
    productSugarsEl.addEventListener('click', e => {
      const chip = e.target.closest('[data-sugar]');
      if (!chip) return;
      state.productSugar = chip.dataset.sugar;
      $$('[data-sugar]', productSugarsEl).forEach(el => {
        const on = el.dataset.sugar === state.productSugar;
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-pressed', String(on));
      });
    });
    productSizesEl.addEventListener('click', e => {
      const chip = e.target.closest('[data-size]');
      if (!chip) return;
      state.productSize = chip.dataset.size;
      $$('[data-size]', productSizesEl).forEach(el => {
        const on = el.dataset.size === state.productSize;
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-pressed', String(on));
      });
      syncProductTotal();
    });
    productAddonsEl.addEventListener('click', e => {
      const chip = e.target.closest('[data-addon]');
      if (!chip) return;
      const a = chip.dataset.addon;
      const idx = state.productAddons.indexOf(a);
      if (idx >= 0) state.productAddons.splice(idx, 1); else state.productAddons.push(a);
      chip.classList.toggle('is-active', idx < 0);
      chip.setAttribute('aria-pressed', String(idx < 0));
      syncProductTotal();
    });
    $('.prod-qty').addEventListener('click', e => {
      const btn = e.target.closest('[data-pqty]');
      if (!btn) return;
      const next = state.productQty + Number(btn.dataset.pqty);
      if (next < 1 || next > 20) return;
      state.productQty = next;
      syncProductTotal();
    });
    $('#productAdd').addEventListener('click', () => {
      const btn = $('#productAdd');
      if (btn.classList.contains('is-busy')) return;
      const p = PRODUCT_INDEX.get(state.productId);
      if (!p) return;
      btn.classList.add('is-busy');
      btn.textContent = '已加入茶篮';
      addToCart(state.productId, state.productTemp, state.productQty, null, null,
                state.productSugar, state.productSize, state.productAddons);
      setTimeout(() => {
        btn.classList.remove('is-busy');
        btn.textContent = '加入茶篮';
        if (current === 'product') go(state.productFrom);
      }, 380);
    });
    $('#toRegister').addEventListener('click', () => go('register'));
    $('#toLogin').addEventListener('click', () => go('login'));
    $('#loginForm').addEventListener('submit', e => {
      e.preventDefault();
      submitLogin();
    });
    $('#registerForm').addEventListener('submit', e => {
      e.preventDefault();
      submitRegister();
    });
    $('#forgotBtn').addEventListener('click', () => {
      const email = $('#loginEmail').value.trim();
      if (!EMAIL_RE.test(email)) {
        setAuthError($('#loginError'), '请先填写有效的 E-mail，再获取重置链接', $('#loginEmail'));
        return;
      }
      clearAuthError($('#loginError'), $('#loginForm'));
      toast('重置链接已发送至您的邮箱');
    });
    $('#wechatLogin').addEventListener('click', () => thirdPartyLogin('微信'));
    $('#phoneLogin').addEventListener('click', () => thirdPartyLogin('手机号'));
    $$('.auth-eye').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = $(`#${btn.dataset.eye}`);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.classList.toggle('is-on', show);
        btn.setAttribute('aria-pressed', String(show));
        btn.setAttribute('aria-label', show ? '隐藏密码' : '显示密码');
        $('use', btn).setAttribute('href', show ? '#i-eye-off' : '#i-eye');
      });
    });
    $$('.auth-input').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-error');
        const form = input.closest('form');
        const err = form && $('.auth-error', form);
        if (err) err.classList.remove('is-show');
      });
    });
    $('#regAgree').addEventListener('change', () => $('#registerError').classList.remove('is-show'));

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
    renderCoupons();
    renderRightsAsset();
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
