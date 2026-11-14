const WHATSAPP_NUMBER="201229101276"; // international format, no + sign
const COLORS=["#ffd9e5","#dcefff","#fff0bd","#ddf1df","#e9e0ff","#ffe2c9"];
let lang="en",filter="all",cart=JSON.parse(localStorage.getItem("dd-cart")||"[]");
const $=s=>document.querySelector(s), tr=(en,ar)=>lang==="ar"?ar:en, pname=p=>tr(p.name_en,p.name_ar);
const money=n=>new Intl.NumberFormat(lang==="ar"?"ar-EG":"en-EG",{style:"currency",currency:"EGP",maximumFractionDigits:0}).format(n);

function categoryList(){return [...new Set(PRODUCTS.map(p=>p.category))]}

function drawCategories(){
  const el=$("#categories");
  el.innerHTML="";
  [{id:"all",en:"All 10 designs",ar:"كل التصميمات (10)"},...categoryList().map(c=>({id:c,en:c,ar:PRODUCTS.find(p=>p.category===c).category_ar||c}))].forEach(c=>{
    let b=document.createElement("button");
    b.className="category-chip"+(filter===c.id?" active":"");
    b.textContent=tr(c.en,c.ar);
    b.onclick=()=>{filter=c.id;drawCategories();drawProducts()};
    el.appendChild(b);
  });
}

function drawProducts(){
  const el=$("#products");
  el.innerHTML="";
  let list=PRODUCTS.filter(p=>filter==="all"||p.category===filter);
  $("#empty").hidden=!!list.length;
  list.forEach(p=>{
    let card=document.createElement("article");
    card.className="product";
    let bg=COLORS[(p.id-1)%COLORS.length];
    let sizeBadge = p.size ? `<span class="badge-pill">${p.size}</span>` : "";
    let colorBadge = p.colors ? `<span class="badge-pill yellow">${p.colors} ${tr("Colours","لون")}</span>` : "";
    card.innerHTML=`
      <div class="product-photo" style="background:${bg}">
        <div class="spec-badges">${sizeBadge}${colorBadge}</div>
        <img src="${p.image||""}" alt="${pname(p)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
        <div class="fallback-art" style="background:${bg};display:none">${pname(p)}</div>
      </div>
      <div class="product-info">
        <span class="product-category">${tr(p.category,p.category_ar||p.category)}</span>
        <h3>${pname(p)}</h3>
        <p>${tr(p.description_en,p.description_ar)}</p>
        <div class="product-bottom">
          <span class="price">${p.price==null?tr("Price on request","السعر عند الطلب"):money(p.price)}</span>
          <div class="product-buttons">
            <button class="detail-btn" aria-label="Details" title="${tr("View details","التفاصيل")}">↗</button>
            <button class="add-btn" aria-label="Add to bag" title="${tr("Add to bag","أضف للسلة")}">+</button>
          </div>
        </div>
      </div>`;
    card.querySelector(".detail-btn").onclick=()=>showDetails(p.id);
    card.querySelector(".add-btn").onclick=()=>add(p.id);
    el.appendChild(card);
  });
}

function showDetails(id){
  let p=PRODUCTS.find(x=>x.id===id), bg=COLORS[(p.id-1)%COLORS.length];
  let specsHtml = "";
  if(p.size || p.colors){
    specsHtml = `<div class="detail-specs">
      ${p.size ? `<span class="detail-spec-tag">📐 ${p.size}</span>` : ""}
      ${p.colors ? `<span class="detail-spec-tag">🎨 ${p.colors} ${tr("Acrylic Colours","لون أكريليك")}</span>` : ""}
    </div>`;
  }
  $("#detailsBody").innerHTML=`
    <div class="detail-layout">
      <div class="detail-image" style="background:${bg}">
        <img src="${p.image||""}" alt="${pname(p)}" onerror="this.style.display='none'">
      </div>
      <div class="detail-copy">
        <span class="eyebrow-text">${tr(p.category,p.category_ar||p.category)}</span>
        <h2>${pname(p)}</h2>
        ${specsHtml}
        <p><strong>${tr(p.description_en,p.description_ar)}</strong></p>
        <p>${tr(p.details_en||"",p.details_ar||"")}</p>
        <div class="detail-price">${p.price==null?tr("Price on request","السعر عند الطلب"):money(p.price)}</div>
        <button id="detailAdd" class="btn dark-btn">${tr("Add to bag +","أضف للسلة +")}</button>
      </div>
    </div>`;
  $("#detailAdd").onclick=()=>{add(id);$("#detailsModal").classList.remove("show")};
  $("#detailsModal").classList.add("show");
}

function persist(){
  localStorage.setItem("dd-cart",JSON.stringify(cart));
  drawCart();
  $("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
}

function add(id){
  let x=cart.find(i=>i.id===id);
  if(x)x.qty++;
  else cart.push({id,qty:1});
  persist();
  openCart();
}

function changeQty(id,delta){
  let x=cart.find(i=>i.id===id);
  if(!x)return;
  x.qty+=delta;
  if(x.qty<1)cart=cart.filter(i=>i.id!==id);
  persist();
}

function drawCart(){
  let el=$("#cartItems");
  el.innerHTML="";
  if(!cart.length){
    el.innerHTML=`<p class="empty-cart">${tr("Your bag is waiting for a little colour.","السلة مستنية شوية ألوان.")}</p>`;
    $("#subtotal").textContent="—";
    return;
  }
  let allPriced=true, total=0;
  cart.forEach(x=>{
    let p=PRODUCTS.find(p=>p.id===x.id);
    if(!p) return;
    if(p.price==null)allPriced=false;
    else total+=p.price*x.qty;
    let row=document.createElement("div");
    row.className="cart-row";
    row.innerHTML=`
      <div class="cart-thumb" style="background:${COLORS[(p.id-1)%COLORS.length]}">
        <img src="${p.image||""}" alt="${pname(p)}" onerror="this.style.display='none'">
      </div>
      <div>
        <h4>${pname(p)}</h4>
        <small>${p.size ? p.size + " · " : ""}${p.price==null?tr("Price on request","السعر عند الطلب"):money(p.price)}</small>
        <div class="qty">
          <button data-d="-1">−</button>
          <span>${x.qty}</span>
          <button data-d="1">+</button>
        </div>
      </div>
      <button class="remove">${tr("Remove","حذف")}</button>`;
    row.querySelectorAll(".qty button").forEach(b=>b.onclick=()=>changeQty(x.id,+b.dataset.d));
    row.querySelector(".remove").onclick=()=>{cart=cart.filter(i=>i.id!==x.id);persist()};
    el.appendChild(row);
  });
  $("#subtotal").textContent=allPriced?money(total):tr("Confirm on WhatsApp","يتم التأكيد على واتساب");
}

function openCart(){$("#shade").classList.add("show");$("#cartDrawer").classList.add("open")}
function closeCart(){$("#shade").classList.remove("show");$("#cartDrawer").classList.remove("open")}

function applyLanguage(){
  document.documentElement.lang=lang;
  document.body.dir=lang==="ar"?"rtl":"ltr";
  $("#language").textContent=lang==="ar"?"English":"عربي";
  document.querySelectorAll("[data-en][data-ar]").forEach(e=>e.innerHTML=e.dataset[lang]);
  drawCategories();
  drawProducts();
  drawCart();
}

$("#language").onclick=()=>{lang=lang==="en"?"ar":"en";applyLanguage()};
$("#openCart").onclick=openCart;
$("#closeCart").onclick=closeCart;
$("#shade").onclick=closeCart;
$("#closeDetails").onclick=()=>$("#detailsModal").classList.remove("show");
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("show");

$("#checkout").onclick=()=>{
  if(!cart.length)return alert(tr("Your bag is empty","السلة فاضية"));
  closeCart();
  $("#checkoutModal").classList.add("show");
};

$("#orderForm").onsubmit=e=>{
  e.preventDefault();
  const f=new FormData(e.target),v=k=>f.get(k)||"-";
  const lines=cart.map(x=>{
    let p=PRODUCTS.find(p=>p.id===x.id);
    return `- ${pname(p)} (${p.size||""}) x ${x.qty} — ${p.price==null?"Price to confirm":money(p.price*x.qty)}`;
  });
  let priced=cart.every(x=>PRODUCTS.find(p=>p.id===x.id).price!=null),
      sum=cart.reduce((s,x)=>s+(PRODUCTS.find(p=>p.id===x.id).price||0)*x.qty,0);
  let message=`Ducky DaVinci Order

${lines.join("
")}

Subtotal: ${priced?money(sum):"To be confirmed"}

Name: ${v("name")}
Phone: ${v("phone")}
Governorate: ${v("governorate")}
Area: ${v("area")}
Address: ${v("address")}
Notes: ${v("notes")}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
};

$("#year").textContent=new Date().getFullYear();
drawCategories();
drawProducts();
persist();
