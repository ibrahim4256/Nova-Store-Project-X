'use strict';

const PRODUCTS = [
  {id:'design-pro',name:'باقة التصميم الإبداعي',category:'design',categoryLabel:'تصميم وقوالب',price:349,oldPrice:449,rating:'4.9',badge:'الأكثر طلبًا',description:'قوالب وأصول بصرية تساعدك تبدأ مشروعك بشكل احترافي.',art:'art-purple',object:'app',symbol:'✦',tag:'CREATIVE KIT',featured:1},
  {id:'ai-tools',name:'باقة أدوات الذكاء الاصطناعي',category:'subscriptions',categoryLabel:'اشتراكات',price:499,oldPrice:599,rating:'4.8',badge:'اختيار مميز',description:'مجموعة أدوات تساعدك تنظم أفكارك وتسرّع شغلك اليومي.',art:'art-blue',object:'app',symbol:'AI',tag:'SMART TOOLS',featured:2},
  {id:'creator-templates',name:'قوالب صانع المحتوى',category:'design',categoryLabel:'تصميم وقوالب',price:229,oldPrice:null,rating:'4.9',badge:'جديد',description:'قوالب جاهزة لمنشوراتك وعروضك ومحتواك الإبداعي.',art:'art-pink',object:'pack',symbol:'✧',tag:'CREATOR PACK',featured:3},
  {id:'digital-guide',name:'دليل البداية الرقمية',category:'learning',categoryLabel:'تعلم ومعرفة',price:149,oldPrice:199,rating:'4.7',badge:'قيمة رائعة',description:'دليل عملي مرتب يساعدك تخطط لمشروعك الرقمي من البداية.',art:'art-peach',object:'book',symbol:'N',tag:'DIGITAL GUIDE',featured:4},
  {id:'gaming-credit',name:'بطاقة رصيد الألعاب',category:'gaming',categoryLabel:'ألعاب وترفيه',price:299,oldPrice:null,rating:'4.8',badge:'محبوب',description:'هدية رقمية لعشاق الألعاب — تفاصيل الفئة والتوافق تُحدد قبل الإطلاق.',art:'art-gold',object:'game',symbol:'⌁',tag:'GAME CREDIT',featured:5},
  {id:'workspace-kit',name:'حزمة تنظيم مساحة العمل',category:'subscriptions',categoryLabel:'اشتراكات',price:189,oldPrice:249,rating:'4.6',badge:'وفّر 24%',description:'موارد رقمية لتنظيم مهامك وأفكارك ومتابعة أهدافك.',art:'art-mint',object:'cloud',symbol:'✓',tag:'WORKSPACE KIT',featured:6},
];

const state = {cart: loadCart(), category:'all', search:'', sort:'featured', lastOrder:null};
const byId = id => document.getElementById(id);
const fmt = value => `${new Intl.NumberFormat('ar-EG',{maximumFractionDigits:0}).format(value)} ج.م`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function loadCart(){
  try {
    const parsed = JSON.parse(localStorage.getItem('nova-cart') || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(line => PRODUCTS.some(p => p.id === line.id) && Number.isInteger(line.qty) && line.qty > 0 && line.qty <= 99);
  } catch { return []; }
}
function saveCart(){
  try { localStorage.setItem('nova-cart', JSON.stringify(state.cart)); }
  catch { toast('تعذر حفظ السلة في المتصفح. جرّب تفعيل مساحة التخزين.', ''); }
}
function cartQty(){return state.cart.reduce((sum,line)=>sum+line.qty,0)}
function cartSubtotal(){return state.cart.reduce((sum,line)=>{const p=PRODUCTS.find(p=>p.id===line.id);return sum+(p?p.price*line.qty:0)},0)}
function productVisual(product){
  let object='';
  if(product.object==='app') object=`<div class="app-tile ${product.id==='ai-tools'?'canva-tile':''}">${product.id==='ai-tools'?'AI':product.symbol}</div>`;
  if(product.object==='pack') object='<div class="pack-tile">✧</div>';
  if(product.object==='book') object='<div class="book-stack"><div class="book-cover back"><b>IDEA</b><small>YOUR PLAN</small></div><div class="book-cover"><b>START</b><small>GUIDE</small></div></div>';
  if(product.object==='game') object='<div class="game-tile">⌁</div>';
  if(product.object==='cloud') object='<div class="cloud-tile">✓</div>';
  return `<div class="product-art ${product.art}"><span class="product-badge">${escapeHtml(product.badge)}</span><button class="product-fav" type="button" data-fav="${product.id}" aria-label="إضافة ${escapeHtml(product.name)} للمفضلة" aria-pressed="false">♡</button><div class="art-object">${object}</div><span class="art-mini-tag">${escapeHtml(product.tag)}</span></div>`;
}
function getVisibleProducts(){
  let items=PRODUCTS.filter(p=>(state.category==='all'||p.category===state.category)&&(`${p.name} ${p.description} ${p.categoryLabel}`).toLowerCase().includes(state.search.toLowerCase()));
  if(state.sort==='price-low') items.sort((a,b)=>a.price-b.price);
  else if(state.sort==='price-high') items.sort((a,b)=>b.price-a.price);
  else items.sort((a,b)=>a.featured-b.featured);
  return items;
}
function renderProducts(){
  const products=getVisibleProducts();
  byId('productGrid').innerHTML=products.map(p=>`<article class="product-card" data-product="${p.id}">${productVisual(p)}<div class="product-body"><div class="product-meta"><span class="product-category">${escapeHtml(p.categoryLabel)}</span><span class="product-rating"><span>★</span>${p.rating} <span class="rating-count">(تقييم تجريبي)</span></span></div><h3 class="product-title">${escapeHtml(p.name)}</h3><p class="product-description">${escapeHtml(p.description)}</p><div class="product-bottom"><div class="product-price"><strong>${fmt(p.price)}</strong>${p.oldPrice?`<del>${fmt(p.oldPrice)}</del>`:''}</div><button class="add-button" type="button" data-add="${p.id}"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> أضف للسلة</button></div></div></article>`).join('');
  byId('emptyState').hidden=products.length!==0;
  byId('productGrid').hidden=products.length===0;
  byId('categoryTabs').querySelectorAll('[data-category]').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===state.category));
  byId('categoryTabs').querySelector('[data-category="all"]').innerHTML=`كل المنتجات <span>${String(PRODUCTS.length).padStart(2,'0')}</span>`;
}
function renderCart(){
  const totalItems=cartQty(), subtotal=cartSubtotal();
  byId('cartCount').textContent=totalItems;
  byId('drawerCount').textContent=`(${totalItems})`;
  byId('cartSubtotal').textContent=fmt(subtotal);
  byId('cartTotal').textContent=fmt(subtotal);
  byId('cartItems').innerHTML=state.cart.map(line=>{
    const p=PRODUCTS.find(item=>item.id===line.id); if(!p)return '';
    const mini=({ 'art-purple':'#6f53df','art-blue':'#277cb3','art-peach':'#d87976','art-mint':'#35a58a','art-gold':'#ae7a2d','art-pink':'#a967ce'})[p.art]||'#8061f4';
    const glyph=({'design-pro':'✦','ai-tools':'AI','creator-templates':'✧','digital-guide':'▤','gaming-credit':'⌁','workspace-kit':'✓'})[p.id]||'✦';
    return `<div class="cart-line"><div class="cart-thumb" style="background:${mini}">${glyph}</div><div class="cart-line-info"><strong>${escapeHtml(p.name)}</strong><small>${fmt(p.price)} للقطعة</small><div class="quantity-control"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="تقليل الكمية">−</button><span>${line.qty}</span><button type="button" data-qty="${p.id}" data-delta="1" aria-label="زيادة الكمية">+</button></div></div><div class="cart-line-end"><strong>${fmt(p.price*line.qty)}</strong><button class="remove-line" data-remove="${p.id}" type="button" aria-label="حذف ${escapeHtml(p.name)}">×</button></div></div>`;
  }).join('');
  const empty=totalItems===0;
  byId('cartEmpty').hidden=!empty;
  byId('cartItems').hidden=empty;
  byId('drawerFooter').hidden=empty;
  byId('checkoutItemCount').textContent=totalItems;
  byId('checkoutTotal').textContent=fmt(subtotal);
}
function toast(message,type='success'){
  const el=document.createElement('div');el.className=`toast ${type==='success'?'toast-success':''}`;
  el.innerHTML=`<span class="toast-icon">${type==='success'?'✓':'i'}</span><span>${escapeHtml(message)}</span>`;
  byId('toastRegion').appendChild(el);
  window.setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(6px)';window.setTimeout(()=>el.remove(),220)},2800);
}
function addToCart(id){
  const p=PRODUCTS.find(item=>item.id===id);if(!p)return;
  const existing=state.cart.find(line=>line.id===id);
  if(existing){if(existing.qty>=99){toast('وصلت للحد الأقصى للكمية.','info');return;}existing.qty++}else state.cart.push({id,qty:1});
  saveCart();renderCart();
  const button=document.querySelector(`[data-add="${CSS.escape(id)}"]`);
  if(button){const original=button.innerHTML;button.classList.add('added');button.innerHTML='✓ تمت الإضافة';button.disabled=true;window.setTimeout(()=>{if(button.isConnected){button.classList.remove('added');button.innerHTML=original;button.disabled=false}},950)}
  toast(`تمت إضافة «${p.name}» للسلة`);
}
function setQty(id,delta){
  const line=state.cart.find(item=>item.id===id);if(!line)return;
  line.qty+=delta;
  if(line.qty<=0)state.cart=state.cart.filter(item=>item.id!==id);
  if(line.qty>99){line.qty=99;toast('الحد الأقصى للكمية هو 99.','info')}
  saveCart();renderCart();
}
function openLayer(layer){
  byId('overlay').hidden=false;layer.hidden=false;document.body.classList.add('no-scroll');
}
function closeLayers(){
  byId('overlay').hidden=true;byId('cartDrawer').hidden=true;byId('checkoutModal').hidden=true;byId('successModal').hidden=true;document.body.classList.remove('no-scroll');
}
function openCart(){renderCart();openLayer(byId('cartDrawer'));byId('closeCart').focus()}
function openCheckout(){if(!state.cart.length){toast('ضيف منتج للسلة الأول.','info');return}renderCart();byId('cartDrawer').hidden=true;byId('checkoutModal').hidden=false;byId('checkoutTitle').focus?.()}
function makeOrderId(){return `NOVA-${Date.now().toString().slice(-6)}${Math.floor(Math.random()*90+10)}`}
function handleOrder(event){
  event.preventDefault();if(!state.cart.length){toast('السلة فاضية.','info');closeLayers();return}
  const form=event.currentTarget;if(!form.reportValidity())return;
  const data=new FormData(form);const order={id:makeOrderId(),createdAt:new Date().toISOString(),customer:{name:String(data.get('fullName')).trim(),email:String(data.get('email')).trim(),phone:String(data.get('phone')||'').trim(),paymentMethod:String(data.get('paymentMethod')),notes:String(data.get('notes')||'').trim()},items:state.cart.map(line=>{const p=PRODUCTS.find(item=>item.id===line.id);return{id:p.id,name:p.name,unitPrice:p.price,qty:line.qty,total:p.price*line.qty}}),total:cartSubtotal(),status:'demo_only'};
  try{
    const old=JSON.parse(localStorage.getItem('nova-orders')||'[]');const orders=Array.isArray(old)?old:[];orders.unshift(order);localStorage.setItem('nova-orders',JSON.stringify(orders.slice(0,50)));
  }catch{toast('تعذر حفظ الطلب محليًا، لكن هنعرض ملخصه دلوقتي.','info')}
  state.lastOrder=order;state.cart=[];saveCart();renderCart();form.reset();
  byId('checkoutModal').hidden=true;byId('successOrderId').textContent=order.id;byId('successTotal').textContent=fmt(order.total);byId('successEmail').textContent=order.customer.email;byId('successModal').hidden=false;byId('closeSuccess').focus();
}

byId('productGrid').addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return}
  const fav=event.target.closest('[data-fav]');if(fav){const liked=fav.classList.toggle('liked');fav.setAttribute('aria-pressed',String(liked));fav.textContent=liked?'♥':'♡';toast(liked?'تم تمييز المنتج كمفضل (على هذه الصفحة فقط).':'تمت إزالة المنتج من المفضلة.');}
});
byId('categoryTabs').addEventListener('click',event=>{const btn=event.target.closest('[data-category]');if(!btn)return;state.category=btn.dataset.category;renderProducts()});
byId('sortSelect').addEventListener('change',event=>{state.sort=event.target.value;renderProducts()});
byId('productSearch').addEventListener('input',event=>{state.search=event.target.value.trim();renderProducts()});
byId('clearSearch').addEventListener('click',()=>{byId('productSearch').value='';state.search='';renderProducts();byId('productSearch').focus()});
byId('resetFilters').addEventListener('click',()=>{state.category='all';state.search='';state.sort='featured';byId('productSearch').value='';byId('sortSelect').value='featured';renderProducts()});
byId('searchToggle').addEventListener('click',()=>{const row=byId('searchRow');row.hidden=!row.hidden;if(!row.hidden){byId('productSearch').focus();row.scrollIntoView({block:'nearest',behavior:'smooth'})}});
byId('openCart').addEventListener('click',openCart);
byId('closeCart').addEventListener('click',closeLayers);
byId('continueShopping').addEventListener('click',()=>{closeLayers();byId('products').scrollIntoView({behavior:'smooth'})});
byId('cartItems').addEventListener('click',event=>{const qty=event.target.closest('[data-qty]');if(qty){setQty(qty.dataset.qty,Number(qty.dataset.delta));return}const remove=event.target.closest('[data-remove]');if(remove){const p=PRODUCTS.find(item=>item.id===remove.dataset.remove);state.cart=state.cart.filter(line=>line.id!==remove.dataset.remove);saveCart();renderCart();if(p)toast(`تم حذف «${p.name}» من السلة`,'info')}});
byId('checkoutButton').addEventListener('click',openCheckout);
byId('closeCheckout').addEventListener('click',()=>{byId('checkoutModal').hidden=true;byId('cartDrawer').hidden=false;renderCart()});
byId('backToCart').addEventListener('click',()=>{byId('checkoutModal').hidden=true;byId('cartDrawer').hidden=false;renderCart()});
byId('checkoutForm').addEventListener('submit',handleOrder);
byId('closeSuccess').addEventListener('click',closeLayers);
byId('doneSuccess').addEventListener('click',()=>{closeLayers();byId('products').scrollIntoView({behavior:'smooth'})});
byId('copyOrderId').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(byId('successOrderId').textContent);toast('تم نسخ رقم الطلب.')}catch{toast(`رقم الطلب: ${byId('successOrderId').textContent}`,'info')}});
byId('overlay').addEventListener('click',closeLayers);
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeLayers()});
byId('mobileMenuButton').addEventListener('click',()=>{const nav=byId('mobileNav');nav.hidden=!nav.hidden;byId('mobileMenuButton').setAttribute('aria-expanded',String(!nav.hidden))});
byId('mobileNav').addEventListener('click',event=>{if(event.target.closest('a'))byId('mobileNav').hidden=true});
byId('newsletterForm').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;toast('شكرًا لاهتمامك! التسجيل هنا تجريبي فقط.');event.currentTarget.reset()});
byId('year').textContent=new Date().getFullYear();
renderProducts();renderCart();
