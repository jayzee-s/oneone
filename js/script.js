// ===== STATE =====
let state = {
  currentUser: null,
  isAdmin: false,
  cart: [],
  products: [],
  orders: [],
  users: [],
  currentCategory: null,
  currentFilter: 'all',
  editingProductId: null,
  productPage: 1,
  productsPerPage: 10,
};

const CATS = {
  wine:   {label:'红酒',en:'AUSTRALIAN RED WINE',icon:'🍷',sub:'慕易庄园原瓶进口 · 全程溯源'},
  health: {label:'大健康保健品',en:'HEALTH SUPPLEMENTS',icon:'💊',sub:'澳洲顶级品牌授权 · 功效保证'},
  beauty: {label:'美妆护肤',en:'BEAUTY & SKINCARE',icon:'✨',sub:'天然原料 · 科学配方'},
  food:   {label:'功能性食品',en:'FUNCTIONAL FOODS',icon:'🌿',sub:'营养均衡 · 健康生活'},
};

// ===== SAMPLE DATA =====
function initData(){
  if(!localStorage.getItem('oneprime_products')){
    const prods=[
      {id:1,name:'慕易庄园赤霞珠干红2021',nameEn:'Moui Estate Cabernet Sauvignon 2021',cat:'wine',price:298,origPrice:398,desc:'澳大利亚南澳地区精选赤霞珠葡萄，单宁丰厚，黑浆果与雪松香气交织，陈年12个月于法国橡木桶，适合搭配红肉料理。',stock:120,active:true,img:''},
      {id:2,name:'慕易庄园西拉礼盒装',nameEn:'Moui Estate Shiraz Gift Box',cat:'wine',price:688,origPrice:888,desc:'双瓶礼盒装，精选2019年份西拉，深紫色泽，黑胡椒与紫罗兰香气层次丰富，余味悠长，馈赠佳品。',stock:48,active:true,img:''},
      {id:3,name:'慕易庄园霞多丽干白',nameEn:'Moui Estate Chardonnay',cat:'wine',price:198,origPrice:258,desc:'清爽干白，绿苹果与柑橘香气，口感清新，略带矿物质风味，适合搭配海鲜及轻食料理。',stock:80,active:true,img:''},
      {id:13,name:'慕易庄园黑皮诺2020',nameEn:'Moui Estate Pinot Noir 2020',cat:'wine',price:328,origPrice:428,desc:'精选维多利亚州凉爽产区黑皮诺，红色樱桃与玫瑰花香，单宁柔顺，余味带一丝烟熏橡木气息。',stock:65,active:true,img:''},
      {id:14,name:'慕易庄园起泡酒礼盒',nameEn:'Moui Estate Sparkling Gift Box',cat:'wine',price:228,origPrice:298,desc:'传统法式工艺酿造起泡酒，气泡细腻持久，柑橘与白桃香气，适合庆典及节日聚餐场合。',stock:90,active:true,img:''},
      {id:15,name:'慕易庄园麝香甜白2022',nameEn:'Moui Estate Moscato 2022',cat:'wine',price:168,origPrice:218,desc:'低酒精度甜白葡萄酒，荔枝与白花香气浓郁，口感甜润清爽，适合搭配甜点或单独饮用。',stock:100,active:true,img:''},
      {id:4,name:'Swisse 护肝片 120粒',nameEn:'Swisse Liver Detox 120 Tabs',cat:'health',price:188,origPrice:248,desc:'澳洲Swisse明星产品，含水飞蓟素+朝鲜蓟提取物，帮助肝脏排毒修复，适合经常饮酒及熬夜人群。',stock:200,active:true,img:''},
      {id:5,name:'Blackmores 鱼油胶囊 400粒',nameEn:'Blackmores Omega-3 Fish Oil 400',cat:'health',price:298,origPrice:368,desc:'深海鱼油，富含EPA和DHA，支持心脑血管健康，改善关节灵活性，澳洲药房销量第一品牌。',stock:150,active:true,img:''},
      {id:6,name:'Swisse 胶原蛋白液 500ml',nameEn:'Swisse Beauty Collagen Liquid',cat:'health',price:228,origPrice:298,desc:'口服胶原蛋白，含10,000mg水解胶原蛋白+维生素C，助力肌肤弹性与光泽，草莓口味，口感宜人。',stock:90,active:true,img:''},
      {id:16,name:'Blackmores 综合维生素 200粒',nameEn:'Blackmores Multivitamin 200 Tabs',cat:'health',price:168,origPrice:218,desc:'全面补充日常所需维生素与矿物质，提升免疫力，缓解疲劳，适合工作繁忙人群长期服用。',stock:180,active:true,img:''},
      {id:17,name:'Swisse 钙片+维生素D 150粒',nameEn:'Swisse Calcium + Vitamin D3 150 Tabs',cat:'health',price:148,origPrice:188,desc:'高吸收率钙片配方，添加维生素D3促进钙质吸收，强健骨骼，适合中老年及术后恢复人群。',stock:130,active:true,img:''},
      {id:18,name:'Bioglan 蔓越莓精华胶囊 60粒',nameEn:'Bioglan Cranberry Extract 60 Caps',cat:'health',price:138,origPrice:178,desc:'浓缩蔓越莓精华，辅助维护泌尿系统健康，天然植物配方，女性日常保养首选。',stock:140,active:true,img:''},
      {id:7,name:'Aesop 玫瑰臀部护理霜',nameEn:'Aesop Resurrection Aromatique',cat:'beauty',price:368,origPrice:null,desc:'澳洲Aesop经典款，含乳木果油与玫瑰提取物，深度滋润干燥肌肤，香气优雅持久。',stock:60,active:true,img:''},
      {id:8,name:'Jurlique 玫瑰水面膜套装',nameEn:'Jurlique Rose Water Mask Set',cat:'beauty',price:488,origPrice:628,desc:'来自澳洲南澳有机玫瑰园，温和补水保湿面膜4片装，适合各种肤质，敏感肌友好配方。',stock:75,active:true,img:''},
      {id:9,name:'True Natural 美白精华液',nameEn:'True Natural Brightening Serum',cat:'beauty',price:288,origPrice:358,desc:'含烟酰胺+VC衍生物，提亮肤色，淡化色斑，澳洲有机认证原料，无防腐剂配方。',stock:110,active:true,img:''},
      {id:19,name:'Jurlique 玫瑰晚安修复精油',nameEn:'Jurlique Rose Night Repair Oil',cat:'beauty',price:528,origPrice:678,desc:'富含玫瑰果油及维生素E，夜间深层修复肌肤屏障，淡化细纹，唤醒晨间紧致光泽肌肤。',stock:55,active:true,img:''},
      {id:20,name:'Aesop 洁净舒缓洁面乳',nameEn:'Aesop Purifying Facial Cleanser',cat:'beauty',price:298,origPrice:null,desc:'温和洁面配方，含茶树及柳树皮萃取物，深层清洁同时舒缓肌肤，适合油性及混合性肌肤。',stock:85,active:true,img:''},
      {id:21,name:'True Natural 复合酸去角质精华',nameEn:'True Natural AHA/BHA Exfoliating Serum',cat:'beauty',price:258,origPrice:328,desc:'果酸+水杨酸温和配方，加速角质代谢，改善肌肤纹理及毛孔粗大问题，新手建议夜间使用。',stock:95,active:true,img:''},
      {id:10,name:'澳洲蜂蜜坚果燕麦棒 10支',nameEn:'Aussie Honey Nut Oat Bar 10pcs',cat:'food',price:88,origPrice:118,desc:'麦卢卡蜂蜜+澳洲坚果+整粒燕麦，低GI健康零食，无人工色素防腐剂，适合健身人群随身携带。',stock:300,active:true,img:''},
      {id:11,name:'胶原蛋白软糖 60粒',nameEn:'Collagen Beauty Gummies 60pcs',cat:'food',price:128,origPrice:158,desc:'每粒含500mg胶原蛋白+维E+葡萄籽提取物，草莓风味，边吃边美容，Z世代爆款。',stock:240,active:true,img:''},
      {id:12,name:'益生菌代餐奶昔 15包',nameEn:'Probiotic Meal Shake 15 Sachets',cat:'food',price:258,origPrice:318,desc:'高蛋白低卡路里，含20亿益生菌+膳食纤维，香草奶昔口味，健康代餐首选。',stock:160,active:true,img:''},
      {id:22,name:'麦卢卡蜂蜜 UMF15+ 500g',nameEn:'Manuka Honey UMF15+ 500g',cat:'food',price:368,origPrice:458,desc:'新西兰进口麦卢卡蜂蜜，UMF15+高活性认证，天然抗氧化，可直接食用或冲泡蜂蜜水。',stock:70,active:true,img:''},
      {id:23,name:'藜麦即食杯 6杯装',nameEn:'Quinoa Ready-to-Eat Cups 6pcs',cat:'food',price:108,origPrice:138,desc:'三色藜麦搭配杂蔬，即开即食，高纤低脂，办公室加餐或代餐的便捷健康选择。',stock:200,active:true,img:''},
      {id:24,name:'综合莫林果干坚果包 12袋',nameEn:'Mixed Berry & Nut Trail Mix 12 Packs',cat:'food',price:98,origPrice:128,desc:'蓝莓干、蔓越莓干与澳洲坚果混合装，无添加蔗糖，独立小包装方便携带，健康解馋零食。',stock:260,active:true,img:''},
    ];
    localStorage.setItem('oneprime_products',JSON.stringify(prods));
  }
  if(!localStorage.getItem('oneprime_users')){
    localStorage.setItem('oneprime_users',JSON.stringify([
      {id:1,name:'管理员',email:'admin@oneprime.com.au',provider:'email',role:'admin',createdAt:new Date().toISOString(),active:true},
    ]));
  }
  if(!localStorage.getItem('oneprime_orders')){
    const now=Date.now();
    const realOrders=[
      {id:'ORD2025001',userId:2,userName:'张小姐',items:[{name:'慕易庄园赤霞珠',qty:2,price:298}],total:596,status:'completed',createdAt:new Date(now-86400000*3).toISOString()},
      {id:'ORD2025002',userId:3,userName:'李先生',items:[{name:'Swisse 护肝片',qty:1,price:188}],total:188,status:'shipped',createdAt:new Date(now-86400000*1).toISOString()},
      {id:'ORD2025003',userId:4,userName:'王女士',items:[{name:'胶原蛋白软糖',qty:3,price:128}],total:384,status:'processing',createdAt:new Date(now-3600000).toISOString()},
    ];
    localStorage.setItem('oneprime_orders',JSON.stringify(realOrders.concat(generateDemoRevenueOrders(now))));
  }
  loadData();
}

// Generates ~2 years of fake "completed" orders purely so the 收入趋势
// (revenue trend) chart has enough spread to demonstrate day/month/year
// breakdowns before real order volume builds up. Every one of these is
// tagged isDemo:true and given a "DEMO" id prefix + a userName suffix of
// "（示例）" so it's unmistakable as sample data wherever it surfaces —
// the dashboard's 总订单数/本月收入/最近订单 all explicitly filter these
// out (see refreshAdminDashboard in admin.js), so they only ever appear
// inside the revenue chart itself.
function generateDemoRevenueOrders(now){
  const demo=[];
  const demoBuyers=['示例买家A','示例买家B','示例买家C','示例买家D'];
  const sampleItems=[
    {name:'慕易庄园赤霞珠干红2021',price:298},
    {name:'Blackmores 鱼油胶囊',price:298},
    {name:'Jurlique 玫瑰水面膜套装',price:488},
    {name:'胶原蛋白软糖',price:128},
    {name:'麦卢卡蜂蜜 UMF15+',price:368},
  ];
  let counter=1;
  // Spread roughly 2-5 orders per month across the past 24 months so
  // "按日/按月/按年" all have multiple buckets to render.
  for(let monthsAgo=23;monthsAgo>=0;monthsAgo--){
    const orderCount=2+Math.floor(Math.random()*4); // 2-5 per month
    for(let j=0;j<orderCount;j++){
      const d=new Date(now);
      d.setMonth(d.getMonth()-monthsAgo);
      d.setDate(1+Math.floor(Math.random()*27));
      d.setHours(Math.floor(Math.random()*23),Math.floor(Math.random()*59));
      const item=sampleItems[Math.floor(Math.random()*sampleItems.length)];
      const qty=1+Math.floor(Math.random()*3);
      demo.push({
        id:'DEMO'+String(counter++).padStart(4,'0'),
        userId:null,
        userName:demoBuyers[Math.floor(Math.random()*demoBuyers.length)]+'（示例）',
        items:[{name:item.name,qty:qty,price:item.price}],
        total:item.price*qty,
        status:'completed',
        createdAt:d.toISOString(),
        isDemo:true,
      });
    }
  }
  return demo;
}

function loadData(){
  state.products=JSON.parse(localStorage.getItem('oneprime_products')||'[]');
  state.users=JSON.parse(localStorage.getItem('oneprime_users')||'[]');
  state.orders=JSON.parse(localStorage.getItem('oneprime_orders')||'[]');
}

function saveProducts(){localStorage.setItem('oneprime_products',JSON.stringify(state.products));}
function saveUsers(){localStorage.setItem('oneprime_users',JSON.stringify(state.users));}
function saveOrders(){localStorage.setItem('oneprime_orders',JSON.stringify(state.orders));}

// ===== TOAST =====
function toast(msg,dur){
  dur = dur || 2800;
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');},dur);
}

// ===== AUTH =====
function socialLogin(provider){
  const name = provider==='Google'?'Google 用户':provider==='Apple'?'Apple 用户':'Facebook 用户';
  const email = 'user_' + Date.now() + '@' + provider.toLowerCase() + '.com';
  loginUser({name:name,email:email,provider:provider,role:'customer'});
}

function emailLogin(){
  const email=document.getElementById('loginEmail').value.trim();
  const pwd=document.getElementById('loginPwd').value;
  if(!email||!pwd){toast('请填写邮箱和密码');return;}
  const users=JSON.parse(localStorage.getItem('oneprime_users')||'[]');
  const u=users.find(function(x){return x.email===email;});
  if(!u){toast('账户不存在，请先注册');return;}
  loginUser(u);
}

function emailRegister(){
  const name=document.getElementById('regName').value.trim();
  const email=document.getElementById('regEmail').value.trim();
  const pwd=document.getElementById('regPwd').value;
  if(!name||!email||!pwd){toast('请填写所有字段');return;}
  if(pwd.length<6){toast('密码至少6位');return;}
  const users=JSON.parse(localStorage.getItem('oneprime_users')||'[]');
  if(users.find(function(x){return x.email===email;})){toast('该邮箱已注册');return;}
  const newUser={id:Date.now(),name:name,email:email,provider:'email',role:'customer',createdAt:new Date().toISOString(),active:true};
  users.push(newUser);
  localStorage.setItem('oneprime_users',JSON.stringify(users));
  loadData();
  loginUser(newUser);
}

function adminLogin(){
  loginUser({name:'管理员',email:'admin@oneprime.com.au',provider:'email',role:'admin'},true);
}

function loginUser(u,isAdmin){
  state.currentUser=u;
  state.isAdmin=isAdmin||u.role==='admin';
  closeAuthModal();
  if(state.isAdmin){
    // Redirect to admin page
    window.location.href = 'admin.html';
  } else {
    showShopScreen();
  }
}

function openAuthModal(){
  switchAuthMode('login');
  document.getElementById('authScreen').style.display='flex';
  document.getElementById('authScreen').classList.add('active');
}

function closeAuthModal(){
  document.getElementById('authScreen').style.display='none';
  document.getElementById('authScreen').classList.remove('active');
}

function toggleUserDropdown(){
  const dd=document.getElementById('userDropdown');
  dd.style.display=dd.style.display==='none'?'block':'none';
}

// close dropdown on outside click
document.addEventListener('click',function(e){
  const ud=document.getElementById('userDropdown');
  const hu=document.getElementById('headerUser');
  if(ud&&hu&&!hu.contains(e.target))ud.style.display='none';
});

function logout(){
  state.currentUser=null;state.isAdmin=false;state.cart=[];
  // headerGuest/headerUser/cart UI only exist on the shop page (index.html);
  // guard so this also runs safely if ever invoked from admin.html
  const shopScreen=document.getElementById('shopScreen');
  if(!shopScreen){
    // We're on a page without the shop UI (e.g. admin.html) — just leave.
    window.location.href='index.html';
    return;
  }
  updateCart();
  shopScreen.classList.add('active');
  document.getElementById('headerGuest').style.display='';
  document.getElementById('headerUser').style.display='none';
  const ml=document.getElementById('mobileLoginLink');
  const mlo=document.getElementById('mobileLogoutLink');
  if(ml)ml.style.display='';
  if(mlo)mlo.style.display='none';
  renderHomePage();
  showPage('home');
  closeAuthModal();
}

function switchAuthMode(mode){
  document.getElementById('authLogin').classList.toggle('hidden',mode!=='login');
  document.getElementById('authRegister').classList.toggle('hidden',mode!=='register');
}

// ===== SCREENS =====
function showShopScreen(){
  const shopScreen=document.getElementById('shopScreen');
  if(shopScreen)shopScreen.classList.add('active');
  const u=state.currentUser;
  if(u){
    document.getElementById('headerGuest').style.display='none';
    document.getElementById('headerUser').style.display='';
    document.getElementById('userNameDisplay').textContent=u.name;
    document.getElementById('userAvatar').textContent=u.name[0].toUpperCase();
    document.getElementById('dropUserEmail').textContent=u.email||u.name;
    const ml=document.getElementById('mobileLoginLink');
    const mlo=document.getElementById('mobileLogoutLink');
    if(ml)ml.style.display='none';
    if(mlo)mlo.style.display='';
  }
  renderHomePage();
  showPage('home');
  updateCategoryCounts();
}

// ===== PAGES =====
function showPage(page){
  ['home','category','checkout'].forEach(function(p){
    document.getElementById('page-'+p).classList.toggle('hidden',p!==page);
  });
  document.querySelectorAll('.sh-nav a').forEach(function(a){
    a.classList.toggle('active',a.dataset.page===page);
  });
}

function showCategory(catKey){
  state.currentCategory=catKey;
  const cat=CATS[catKey];
  document.getElementById('catLabel').textContent=cat.icon+' '+cat.en;
  document.getElementById('catTitle').innerHTML='<em style="color:var(--gold);font-style:normal;">'+cat.icon+'</em> '+cat.label;
  document.getElementById('catSub').textContent=cat.sub;
  document.getElementById('catProductTitle').textContent=cat.label+' · 全部商品';
  document.getElementById('catSort').value='default';
  renderCategoryProducts(catKey,'default');
  showPage('category');
  document.querySelectorAll('.sh-nav a').forEach(function(a){a.classList.toggle('active',a.dataset.page===catKey);});
}

function sortProducts(){
  renderCategoryProducts(state.currentCategory,document.getElementById('catSort').value);
}

function renderCategoryProducts(catKey,sort){
  let prods=state.products.filter(function(p){return p.cat===catKey&&p.active;});
  if(sort==='price-asc')prods.sort(function(a,b){return a.price-b.price;});
  if(sort==='price-desc')prods.sort(function(a,b){return b.price-a.price;});
  renderProductGrid(document.getElementById('catProductGrid'),prods);
}

// ===== HOME =====
function renderHomePage(){
  filterHome('all',document.querySelector('#homeFilter .active'));
}

function filterHome(cat,btn){
  state.currentFilter=cat;
  document.querySelectorAll('#homeFilter .filter-btn').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');
  var prods = cat==='all' ? state.products.filter(function(p){return p.active;}) : state.products.filter(function(p){return p.cat===cat&&p.active;});
  renderProductGrid(document.getElementById('homeProductGrid'),prods);
}

function updateCategoryCounts(){
  Object.keys(CATS).forEach(function(k){
    const c=state.products.filter(function(p){return p.cat===k&&p.active;}).length;
    const el=document.getElementById('cat-count-'+k);
    if(el)el.textContent=c+' 款';
  });
}

// ===== PRODUCT GRID =====
function renderProductGrid(container,prods){
  if(!prods.length){
    container.innerHTML='<div class="empty-state" style="grid-column:1/-1"><div class="ei">📦</div><h3>暂无商品</h3><p>该分类下暂无上架商品</p></div>';
    return;
  }
  container.innerHTML=prods.map(function(p){
    const qty=getCartQty(p.id);
    return '<div class="prod-card" onclick="openProduct('+p.id+')">'+
      (p.img ? '<img class="prod-img" src="'+p.img+'" alt="'+p.name+'">' : '<div class="prod-img-placeholder">'+(CATS[p.cat]?CATS[p.cat].icon:'📦')+'</div>')+
      '<div class="prod-body">'+
        '<div class="prod-cat">'+(CATS[p.cat]?CATS[p.cat].label:p.cat)+'</div>'+
        '<div class="prod-name">'+p.name+'</div>'+
        '<div class="prod-desc">'+p.desc+'</div>'+
        '<div class="prod-foot">'+
          '<div><span class="prod-price">¥'+p.price+'</span>'+(p.origPrice ? '<span class="prod-price-orig">¥'+p.origPrice+'</span>' : '')+'</div>'+
          '<div class="prod-qty-ctrl" onclick="event.stopPropagation()">'+
            '<button onclick="cardDecrement('+p.id+')">−</button>'+
            '<div class="prod-qty-num" id="card-qty-'+p.id+'">'+(qty||0)+'</div>'+
            '<button onclick="cardIncrement('+p.id+')">+</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

function getCartQty(id){
  const item=state.cart.find(function(x){return x.id===id;});
  return item?item.qty:0;
}

function cardIncrement(id){
  addToCart(id,true);
  document.querySelectorAll('#card-qty-'+id).forEach(function(el){el.textContent=getCartQty(id);});
}

function cardDecrement(id){
  const item=state.cart.find(function(x){return x.id===id;});
  if(!item)return;
  if(item.qty<=1)removeFromCart(id);
  else{item.qty--;updateCart();}
  document.querySelectorAll('#card-qty-'+id).forEach(function(el){el.textContent=getCartQty(id);});
}

// ===== PRODUCT MODAL =====
let modalQty=1;

function openProduct(id){
  const p=state.products.find(function(x){return x.id===id;});if(!p)return;
  modalQty=1;
  document.getElementById('modalContent').innerHTML=
    (p.img ? '<img class="modal-img" src="'+p.img+'" alt="'+p.name+'">' : '<div class="modal-img-ph">'+(CATS[p.cat]?CATS[p.cat].icon:'📦')+'</div>')+
    '<div class="modal-body">'+
      '<div class="modal-cat">'+(CATS[p.cat]?CATS[p.cat].icon:'')+' '+(CATS[p.cat]?CATS[p.cat].label:'')+' · '+(p.nameEn||'')+'</div>'+
      '<div class="modal-name">'+p.name+'</div>'+
      '<div class="modal-desc">'+p.desc+'</div>'+
      '<div class="modal-price-row">'+
        '<span class="modal-price">¥'+p.price+'</span>'+
        (p.origPrice ? '<span class="modal-orig">¥'+p.origPrice+'</span>' : '')+
        (p.origPrice ? '<span class="badge badge-gold">省¥'+(p.origPrice-p.price)+'</span>' : '')+
      '</div>'+
      '<div class="qty-row">'+
        '<div class="qty-ctrl">'+
          '<button onclick="changeModalQty(-1)">−</button>'+
          '<span id="modalQtyDisplay">1</span>'+
          '<button onclick="changeModalQty(1)">+</button>'+
        '</div>'+
        '<button class="modal-add-btn" onclick="addToCartFromModal('+p.id+')">加入购物车</button>'+
      '</div>'+
      '<div style="font-size:.72rem;color:var(--text-muted);">库存：'+p.stock+'件 · 假一赔千 · 官方授权</div>'+
    '</div>';
  const ov=document.getElementById('prodModal');
  ov.classList.add('open');
  document.body.style.overflow='hidden';
}

function changeModalQty(d){
  modalQty=Math.max(1,modalQty+d);
  document.getElementById('modalQtyDisplay').textContent=modalQty;
}

function addToCartFromModal(id){
  for(var i=0;i<modalQty;i++)addToCart(id,true);
  toast('已加入购物车 ×'+modalQty);
  closeProdModalDirect();
}

function closeProdModal(e){if(e.target===document.getElementById('prodModal'))closeProdModalDirect();}

function closeProdModalDirect(){
  document.getElementById('prodModal').classList.remove('open');
  document.body.style.overflow='';
}

// ===== CART =====
function addToCart(id,silent){
  const p=state.products.find(function(x){return x.id===id;});if(!p)return;
  const existing=state.cart.find(function(x){return x.id===id;});
  if(existing)existing.qty++;
  else state.cart.push({id:id,name:p.name,price:p.price,img:p.img,cat:p.cat,qty:1});
  updateCart();
  if(!silent)toast('✓ 已加入购物车');
}

function removeFromCart(id){
  state.cart=state.cart.filter(function(x){return x.id!==id;});
  updateCart();
}

function changeCartQty(id,d){
  const item=state.cart.find(function(x){return x.id===id;});
  if(!item)return;
  item.qty=Math.max(1,item.qty+d);
  if(item.qty<1)removeFromCart(id);
  updateCart();
}

function updateCart(){
  const total=state.cart.reduce(function(s,i){return s+i.price*i.qty;},0);
  const count=state.cart.reduce(function(s,i){return s+i.qty;},0);
  const countEl=document.getElementById('cartCount');
  if(countEl)countEl.textContent=count;
  const itemsEl=document.getElementById('cartItems');
  const footEl=document.getElementById('cartFoot');
  if(!itemsEl)return;
  if(!state.cart.length){
    itemsEl.innerHTML='<div class="cart-empty"><div style="font-size:2.5rem;margin-bottom:.75rem;">🛒</div><p>购物车是空的</p></div>';
    footEl.innerHTML='';return;
  }
  itemsEl.innerHTML=state.cart.map(function(i){
    return '<div class="cart-item">'+
      (i.img ? '<img class="cart-item-img" src="'+i.img+'" alt="'+i.name+'">' : '<div class="cart-item-img-ph">'+(CATS[i.cat]?CATS[i.cat].icon:'📦')+'</div>')+
      '<div class="cart-item-info">'+
        '<div class="cart-item-name">'+i.name+'</div>'+
        '<div class="cart-item-price">¥'+i.price+'</div>'+
        '<div class="cart-item-controls">'+
          '<div class="ci-qty">'+
            '<button onclick="changeCartQty('+i.id+',-1)">−</button>'+
            '<span>'+i.qty+'</span>'+
            '<button onclick="changeCartQty('+i.id+',1)">+</button>'+
          '</div>'+
          '<button class="ci-remove" onclick="removeFromCart('+i.id+')">删除</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
  footEl.innerHTML=
    '<div class="cart-total-row"><span class="cart-total-label">合计 ('+count+'件)</span><span class="cart-total-price">¥'+total.toFixed(2)+'</span></div>'+
    '<button class="checkout-btn" onclick="goCheckout()">去结算</button>';
}

function toggleCart(){
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function goCheckout(){
  toggleCart();
  renderCheckout();
  showPage('checkout');
}

function renderCheckout(){
  const ckItems=document.getElementById('ckItems');
  const ckTotal=document.getElementById('ckTotal');
  if(!ckItems)return;
  const total=state.cart.reduce(function(s,i){return s+i.price*i.qty;},0);
  ckItems.innerHTML=state.cart.map(function(i){
    return '<div class="os-item"><span class="os-item-name">'+i.name+' ×'+i.qty+'</span><span class="os-item-price">¥'+(i.price*i.qty).toFixed(2)+'</span></div>';
  }).join('');
  ckTotal.textContent='¥'+total.toFixed(2);
  const u=state.currentUser;
  if(u){
    const n=document.getElementById('ck-name');
    if(n&&!n.value)n.value=u.name||'';
  }
}

function placeOrder(){
  const name=document.getElementById('ck-name').value.trim();
  const phone=document.getElementById('ck-phone').value.trim();
  const city=document.getElementById('ck-city').value.trim();
  const addr=document.getElementById('ck-addr').value.trim();
  if(!name||!phone||!city||!addr){toast('请填写完整收货信息');return;}
  if(!state.cart.length){toast('购物车为空');return;}
  const total=state.cart.reduce(function(s,i){return s+i.price*i.qty;},0);
  const order={
    id:'ORD'+Date.now(),
    userId:state.currentUser?state.currentUser.id:null,
    userName:name,
    items:state.cart.map(function(i){return {name:i.name,qty:i.qty,price:i.price};}),
    total:total,
    status:'processing',
    address:city+' '+addr,
    phone:phone,
    createdAt:new Date().toISOString(),
  };
  state.orders.unshift(order);
  saveOrders();
  state.cart=[];
  updateCart();
  toast('🎉 订单提交成功！我们将尽快处理您的订单');
  showPage('home');
}

// ===== MOBILE NAV =====
function toggleMobileNav(){
  document.getElementById('mobileNav').classList.toggle('open');
}

// ===== INIT =====
initData();
// Start on shop screen — no login required to browse.
// Guarded because script.js is also loaded on admin.html, which has no
// shopScreen element (the admin panel lives on its own page).
if(document.getElementById('shopScreen')){
  document.getElementById('shopScreen').classList.add('active');
  renderHomePage();
  updateCategoryCounts();
}