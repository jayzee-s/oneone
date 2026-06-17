// ===== ADMIN STATE =====
let fmActive = true;

// NOTE: CATS is already defined in script.js, which is loaded before this
// file on admin.html. Re-declaring it here with `const` would throw a
// SyntaxError ("Identifier 'CATS' has already been declared") and prevent
// this entire script from running at all — which previously broke the
// whole admin dashboard silently. We reuse the shared definition instead.

// NOTE: toast(), loadData(), saveProducts(), saveUsers(), and saveOrders()
// are already defined in script.js, which is loaded before this file on
// admin.html. They're intentionally not redefined here to avoid the two
// copies silently drifting out of sync with each other over time.

// ===== UTILITY FUNCTIONS =====
function statusLabel(s) {
  var labels = {pending:'待付款', processing:'处理中', shipped:'已发货', completed:'已完成', cancelled:'已取消'};
  return labels[s] || s;
}

function fmtDate(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  return d.toLocaleDateString('zh-CN', {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'});
}

// ===== ADMIN PANEL =====
function showAdminPanel(name) {
  document.querySelectorAll('.admin-panel').forEach(function(p) {
    p.classList.remove('active');
  });
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelectorAll('.admin-nav-item').forEach(function(i) {
    i.classList.remove('active');
  });
  var titles = {dashboard:'数据概览', products:'商品管理', orders:'订单管理', users:'用户管理', categories:'分类管理'};
  document.getElementById('adminPageTitle').textContent = titles[name] || name;
  var navItems = document.querySelectorAll('.admin-nav-item');
  var idx = {dashboard:0, products:1, orders:2, users:3, categories:4};
  if (navItems[idx[name]]) navItems[idx[name]].classList.add('active');
  if (name === 'dashboard') refreshAdminDashboard();
  if (name === 'products') renderAdminProducts();
  if (name === 'orders') renderOrders();
  if (name === 'users') renderUsers();
  if (name === 'categories') renderCatManage();
}

// ===== DASHBOARD =====
function refreshAdminDashboard() {
  loadData();
  document.getElementById('statProducts').textContent = state.products.length;
  var activeCount = state.products.filter(function(p) { return p.active; }).length;
  document.getElementById('statProductsChange').textContent = '↑ ' + activeCount + ' 款已上架';
  document.getElementById('statOrders').textContent = state.orders.length;
  document.getElementById('statUsers').textContent = state.users.length;
  var rev = state.orders.filter(function(o) { return o.status === 'completed'; }).reduce(function(s, o) { return s + o.total; }, 0);
  document.getElementById('statRevenue').textContent = '¥' + rev.toFixed(0);
  
  var cg = document.getElementById('catStatsGrid');
  if (cg) {
    cg.innerHTML = Object.keys(CATS).map(function(k) {
      var v = CATS[k];
      var cnt = state.products.filter(function(p) { return p.cat === k; }).length;
      var active = state.products.filter(function(p) { return p.cat === k && p.active; }).length;
      return '<div style="text-align:center;padding:1.25rem;border:1px solid rgba(0,0,0,.06);border-radius:8px;">' +
        '<div style="font-size:2rem;margin-bottom:.5rem;">' + v.icon + '</div>' +
        '<div style="font-weight:700;font-size:1.4rem;color:#C9A84C;">' + cnt + '</div>' +
        '<div style="font-size:.75rem;color:#7A6850;margin-bottom:.25rem;">' + v.label + '</div>' +
        '<div style="font-size:.7rem;color:#2D8C5F;">' + active + ' 已上架</div>' +
        '</div>';
    }).join('');
  }
  
  var rb = document.getElementById('recentOrdersBody');
  if (rb) {
    rb.innerHTML = state.orders.slice(0, 5).map(function(o) {
      return '<tr>' +
        '<td style="font-family:monospace;font-size:.75rem;">' + o.id + '</td>' +
        '<td>' + o.userName + '</td>' +
        '<td class="text-gold" style="font-weight:600;">¥' + o.total + '</td>' +
        '<td><span class="order-status os-' + o.status + '">' + statusLabel(o.status) + '</span></td>' +
        '<td style="font-size:.75rem;color:#7A6850;">' + fmtDate(o.createdAt) + '</td>' +
        '</tr>';
    }).join('');
  }
}

// ===== PRODUCT MANAGEMENT =====
function renderAdminProducts() {
  loadData();
  var search = document.getElementById('prodSearch') ? document.getElementById('prodSearch').value.toLowerCase() : '';
  var cat = document.getElementById('prodCatFilter') ? document.getElementById('prodCatFilter').value : 'all';
  var prods = state.products.filter(function(p) {
    var matchSearch = !search || p.name.toLowerCase().indexOf(search) !== -1 || (p.nameEn || '').toLowerCase().indexOf(search) !== -1;
    var matchCat = cat === 'all' || p.cat === cat;
    return matchSearch && matchCat;
  });
  
  var total = prods.length;
  var pp = 10;
  var pages = Math.ceil(total / pp);
  if (state.productPage > pages) state.productPage = 1;
  var start = (state.productPage - 1) * pp;
  var paged = prods.slice(start, start + pp);
  
  var tbody = document.getElementById('adminProductsBody');
  if (!tbody) return;
  tbody.innerHTML = paged.map(function(p) {
    var imgHtml = p.img ? '<img class="td-img" src="' + p.img + '" alt="">' : '<div class="td-img-ph">' + (CATS[p.cat] ? CATS[p.cat].icon : '📦') + '</div>';
    return '<tr>' +
      '<td>' + imgHtml + '</td>' +
      '<td><div style="font-weight:600;font-size:.85rem;">' + p.name + '</div><div style="font-size:.72rem;color:#7A6850;">' + (p.nameEn || '') + '</div></td>' +
      '<td><span class="badge badge-gold">' + (CATS[p.cat] ? CATS[p.cat].icon : '') + ' ' + (CATS[p.cat] ? CATS[p.cat].label : '') + '</span></td>' +
      '<td style="font-weight:700;color:#C9A84C;">¥' + p.price + '</td>' +
      '<td style="color:#7A6850;">' + (p.origPrice ? '¥' + p.origPrice : '—') + '</td>' +
      '<td>' + p.stock + '</td>' +
      '<td><span class="badge ' + (p.active ? 'badge-green' : 'badge-red') + '">' + (p.active ? '上架中' : '已下架') + '</span></td>' +
      '<td><div class="td-actions">' +
      '<button class="td-btn td-edit" onclick="editProduct(' + p.id + ')">编辑</button>' +
      '<button class="td-btn td-del" onclick="deleteProduct(' + p.id + ')">删除</button>' +
      '</div></td>' +
      '</tr>';
  }).join('');
  
  var pg = document.getElementById('prodPagination');
  if (pg) {
    var btns = '';
    for (var i = 1; i <= pages; i++) {
      btns += '<button class="page-btn ' + (i === state.productPage ? 'active' : '') + '" onclick="goPage(' + i + ')">' + i + '</button>';
    }
    pg.innerHTML = '<span class="page-info">共 ' + total + ' 件商品</span><div class="page-btns">' + btns + '</div>';
  }
}

function goPage(n) {
  state.productPage = n;
  renderAdminProducts();
}

// ===== ORDERS =====
function renderOrders() {
  var filter = document.getElementById('orderStatusFilter') ? document.getElementById('orderStatusFilter').value : 'all';
  var orders = filter === 'all' ? state.orders : state.orders.filter(function(o) { return o.status === filter; });
  var tbody = document.getElementById('ordersBody');
  if (!tbody) return;
  tbody.innerHTML = orders.map(function(o) {
    return '<tr>' +
      '<td style="font-family:monospace;font-size:.75rem;">' + o.id + '</td>' +
      '<td>' + o.userName + '</td>' +
      '<td style="font-size:.78rem;max-width:200px;">' + o.items.map(function(i) { return i.name + '×' + i.qty; }).join('、') + '</td>' +
      '<td style="font-weight:700;color:#C9A84C;">¥' + o.total + '</td>' +
      '<td><span class="order-status os-' + o.status + '">' + statusLabel(o.status) + '</span></td>' +
      '<td style="font-size:.75rem;color:#7A6850;">' + fmtDate(o.createdAt) + '</td>' +
      '<td>' +
      '<select class="filter-select" style="font-size:.72rem;padding:4px 8px;" onchange="updateOrderStatus(\'' + o.id + '\',this.value)">' +
      ['pending','processing','shipped','completed','cancelled'].map(function(s) { return '<option value="' + s + '" ' + (s === o.status ? 'selected' : '') + '>' + statusLabel(s) + '</option>'; }).join('') +
      '</select>' +
      '</td>' +
      '</tr>';
  }).join('');
}

function updateOrderStatus(id, status) {
  var o = state.orders.find(function(x) { return x.id === id; });
  if (o) {
    o.status = status;
    saveOrders();
    toast('订单状态已更新');
  }
}

// ===== USERS =====
function renderUsers() {
  var tbody = document.getElementById('usersBody');
  if (!tbody) return;
  tbody.innerHTML = state.users.map(function(u) {
    return '<tr>' +
      '<td style="font-weight:600;">' + u.name + '</td>' +
      '<td style="font-size:.82rem;color:#7A6850;">' + u.email + '</td>' +
      '<td><span class="badge badge-gold">' + u.provider + '</span></td>' +
      '<td style="font-size:.75rem;color:#7A6850;">' + fmtDate(u.createdAt) + '</td>' +
      '<td><span class="badge ' + (u.active ? 'badge-green' : 'badge-red') + '">' + (u.role === 'admin' ? '管理员' : '会员') + '</span></td>' +
      '</tr>';
  }).join('');
}

// ===== CATEGORIES =====
function renderCatManage() {
  var g = document.getElementById('catManageGrid');
  if (!g) return;
  g.innerHTML = Object.keys(CATS).map(function(k) {
    var v = CATS[k];
    var total = state.products.filter(function(p) { return p.cat === k; }).length;
    var active = state.products.filter(function(p) { return p.cat === k && p.active; }).length;
    return '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,.06);border-radius:8px;padding:1.5rem;display:flex;gap:1rem;align-items:center;">' +
      '<div style="font-size:2.5rem;">' + v.icon + '</div>' +
      '<div style="flex:1;">' +
      '<div style="font-weight:700;margin-bottom:.2rem;">' + v.label + '</div>' +
      '<div style="font-size:.72rem;letter-spacing:.1em;color:#7A6850;margin-bottom:.5rem;">' + v.en + '</div>' +
      '<div style="font-size:.78rem;color:#7A6850;">共 <strong style="color:#2B2218;">' + total + '</strong> 件 · 上架 <strong style="color:#2D8C5F;">' + active + '</strong> 件</div>' +
      '</div>' +
      '<button class="admin-btn admin-btn-outline" onclick="showAdminPanel(\'products\');setTimeout(function(){document.getElementById(\'prodCatFilter\').value=\'' + k + '\';renderAdminProducts();},100)">查看商品</button>' +
      '</div>';
  }).join('');
}

// ===== PRODUCT FORM =====
function openProductForm() {
  fmActive = true;
  document.getElementById('fmId').value = '';
  document.getElementById('fmName').value = '';
  document.getElementById('fmNameEn').value = '';
  document.getElementById('fmDesc').value = '';
  document.getElementById('fmCat').value = 'wine';
  document.getElementById('fmPrice').value = '';
  document.getElementById('fmOrigPrice').value = '';
  document.getElementById('fmStock').value = '100';
  document.getElementById('fmImgData').value = '';
  document.getElementById('imgPreview').classList.add('hidden');
  document.getElementById('imgPreview').src = '';
  document.getElementById('fmActiveToggle').className = 'toggle on';
  document.getElementById('fmActiveLabel').textContent = '已上架';
  document.getElementById('fmTitle').textContent = '添加商品';
  document.getElementById('productFormModal').classList.remove('hidden');
}

function editProduct(id) {
  var p = state.products.find(function(x) { return x.id === id; });
  if (!p) return;
  fmActive = p.active;
  document.getElementById('fmId').value = p.id;
  document.getElementById('fmName').value = p.name;
  document.getElementById('fmNameEn').value = p.nameEn || '';
  document.getElementById('fmDesc').value = p.desc;
  document.getElementById('fmCat').value = p.cat;
  document.getElementById('fmPrice').value = p.price;
  document.getElementById('fmOrigPrice').value = p.origPrice || '';
  document.getElementById('fmStock').value = p.stock || 0;
  document.getElementById('fmImgData').value = p.img || '';
  if (p.img) {
    document.getElementById('imgPreview').src = p.img;
    document.getElementById('imgPreview').classList.remove('hidden');
  } else {
    document.getElementById('imgPreview').classList.add('hidden');
  }
  document.getElementById('fmActiveToggle').className = 'toggle ' + (p.active ? 'on' : '');
  document.getElementById('fmActiveLabel').textContent = p.active ? '已上架' : '已下架';
  document.getElementById('fmTitle').textContent = '编辑商品';
  document.getElementById('productFormModal').classList.remove('hidden');
}

function closeProductForm() {
  document.getElementById('productFormModal').classList.add('hidden');
}

function toggleActive() {
  fmActive = !fmActive;
  document.getElementById('fmActiveToggle').className = 'toggle ' + (fmActive ? 'on' : '');
  document.getElementById('fmActiveLabel').textContent = fmActive ? '已上架' : '已下架';
}

function handleImgUpload(e) {
  var file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    toast('图片不能超过5MB');
    return;
  }
  var reader = new FileReader();
  reader.onload = function(ev) {
    var data = ev.target.result;
    document.getElementById('fmImgData').value = data;
    document.getElementById('imgPreview').src = data;
    document.getElementById('imgPreview').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function saveProduct() {
  var name = document.getElementById('fmName').value.trim();
  var price = parseFloat(document.getElementById('fmPrice').value);
  var desc = document.getElementById('fmDesc').value.trim();
  var cat = document.getElementById('fmCat').value;
  if (!name || !price || !desc) {
    toast('请填写商品名称、价格和描述');
    return;
  }
  var id = document.getElementById('fmId').value;
  var origPriceVal = document.getElementById('fmOrigPrice').value;
  var prod = {
    id: id ? parseInt(id) : Date.now(),
    name: name,
    nameEn: document.getElementById('fmNameEn').value.trim(),
    desc: desc,
    cat: cat,
    price: price,
    origPrice: origPriceVal ? parseFloat(origPriceVal) : null,
    stock: parseInt(document.getElementById('fmStock').value) || 0,
    img: document.getElementById('fmImgData').value || '',
    active: fmActive
  };
  if (id) {
    var idx = state.products.findIndex(function(x) { return x.id === prod.id; });
    if (idx > -1) state.products[idx] = prod;
  } else {
    state.products.unshift(prod);
  }
  saveProducts();
  renderAdminProducts();
  closeProductForm();
  toast(id ? '商品已更新 ✓' : '商品已添加 ✓');
}

function deleteProduct(id) {
  if (!confirm('确定要删除该商品吗？')) return;
  state.products = state.products.filter(function(x) { return x.id !== id; });
  saveProducts();
  renderAdminProducts();
  toast('商品已删除');
}

// ===== LOGOUT =====
function logout() {
  if (confirm('确定要退出后台吗？')) {
    window.location.href = 'index.html';
  }
}

// ===== INIT =====
loadData();
// Set default state
window.state = window.state || {};
state.productPage = state.productPage || 1;
refreshAdminDashboard();
renderAdminProducts();
renderOrders();
renderUsers();
renderCatManage();
