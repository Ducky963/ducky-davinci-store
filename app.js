// EDIT THIS NUMBER before publishing. Use country code, without +, spaces or leading zero.
// Egypt example: 2010XXXXXXX
const WHATSAPP_NUMBER = "201229101276";
const PALETTE = ["#ffd5e2","#d9edff","#fff0b3","#d9f1dc","#e5dcff","#ffe0c2"];
let cart = JSON.parse(localStorage.getItem("dd-cart") || "[]");
let lang = "en";
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat(lang==="ar"?"ar-EG":"en-EG",{style:"currency",currency:"EGP",maximumFractionDigits:0}).format(n);
const productName = p => lang==="ar"?p.name_ar:p.name_en;
function renderProducts(){
 const grid=$("#productGrid"); grid.innerHTML="";
 window.PRODUCTS.forEach((p,i)=>{
  const card=document.createElement("article");card.className="product-card";
  const bg=PALETTE[i%PALETTE.length];
  card.innerHTML=`<div class="product-image" style="background:${bg}">${p.image?`<img src="${p.image}" alt="${productName(p)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`:""}<div class="placeholder-art" style="background:${bg};display:${p.image?"none":"grid"}">${productName(p)}</div></div><div class="product-info"><h3>${productName(p)}</h3><p>${lang==="ar"?p.description_ar:p.description_en}</p><div class="product-bottom"><span class="price">${p.price==null?"Price to be confirmed":money(p.price)}</span><button class="add-btn" aria-label="Add to cart">+</button></div></div>`;
  card.querySelector(".add-btn").addEventListener("click",()=>addToCart(p.id));grid.appendChild(card);
 });
}
function save(){localStorage.setItem("dd-cart",JSON.stringify(cart));renderCart();$("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function addToCart(id){let item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});save();openCart()}
function changeQty(id,d){let item=cart.find(x=>x.id===id);if(!item)return;item.qty+=d;if(item.qty<1)cart=cart.filter(x=>x.id!==id);save()}
function renderCart(){
 const box=$("#cartItems");box.innerHTML="";
 if(!cart.length){box.innerHTML=`<p class="empty">${lang==="ar"?"السلة مستنية شوية ألوان.":"Your bag is waiting for some colour."}</p>`;$("#subtotal").textContent=lang==="ar"?"لم يتم تحديد السعر":"To be confirmed";return}
 let total=0,known=true;
 cart.forEach(x=>{let p=PRODUCTS.find(p=>p.id===x.id);if(p.price==null)known=false;else total+=p.price*x.qty;
 const row=document.createElement("div");row.className="cart-row";row.innerHTML=`<div class="cart-thumb" style="background:${PALETTE[(p.id-1)%PALETTE.length]}">${p.name_en.slice(0,1)}</div><div><h4>${productName(p)}</h4><small>${p.price==null?(lang==="ar"?"السعر يحدد لاحقاً":"Price to be confirmed"):money(p.price)}</small><div class="qty"><button data-d="-1">−</button><span>${x.qty}</span><button data-d="1">+</button></div></div><button class="remove">${lang==="ar"?"حذف":"Remove"}</button>`;
 row.querySelectorAll(".qty button").forEach(b=>b.onclick=()=>changeQty(x.id,Number(b.dataset.d)));row.querySelector(".remove").onclick=()=>{cart=cart.filter(y=>y.id!==x.id);save()};box.appendChild(row);
 });
 $("#subtotal").textContent=known?money(total):(lang==="ar"?"يتم التأكيد على واتساب":"Confirmed on WhatsApp");
}
function openCart(){$("#overlay").classList.add("show");$("#cartDrawer").classList.add("open")}
function closeCart(){$("#overlay").classList.remove("show");$("#cartDrawer").classList.remove("open")}
function setLang(next){lang=next;document.documentElement.lang=lang;document.body.dir=lang==="ar"?"rtl":"ltr";$("#langBtn").textContent=lang==="ar"?"English":"عربي";document.querySelectorAll("[data-en][data-ar]").forEach(el=>el.innerHTML=el.dataset[lang]);renderProducts();renderCart()}
$("#langBtn").onclick=()=>setLang(lang==="en"?"ar":"en");$("#cartOpen").onclick=openCart;$("#cartClose").onclick=closeCart;$("#overlay").onclick=closeCart;
$("#checkoutBtn").onclick=()=>{if(!cart.length){alert(lang==="ar"?"السلة فارغة":"Your cart is empty");return}closeCart();$("#checkoutModal").classList.add("show")};
$("#modalClose").onclick=()=>$("#checkoutModal").classList.remove("show");
$("#orderForm").onsubmit=e=>{
 e.preventDefault();
 if(WHATSAPP_NUMBER.includes("X")){alert(lang==="ar"?"لازم تضيف رقم واتساب الخاص بالمتجر في ملف app.js أولاً.":"Please add your store WhatsApp number in app.js first.");return}
 const f=new FormData(e.target),v=k=>f.get(k)||"-";
 const lines=cart.map(x=>{let p=PRODUCTS.find(p=>p.id===x.id);return `• ${productName(p)} x ${x.qty} — ${p.price==null?"Price TBC":money(p.price*x.qty)}`});
 const totalKnown=cart.every(x=>PRODUCTS.find(p=>p.id===x.id).price!=null);
 const total=cart.reduce((s,x)=>s+(PRODUCTS.find(p=>p.id===x.id).price||0)*x.qty,0);
 const msg=`New Ducky DaVinci Order\n\n${lines.join("\n")}\n\nSubtotal: ${totalKnown?money(total):"To be confirmed"}\n\nCustomer: ${v("name")}\nPhone: ${v("phone")}\nGovernorate: ${v("governorate")}\nArea: ${v("area")}\nAddress: ${v("address")}\nNotes: ${v("notes")}`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
};
$("#year").textContent=new Date().getFullYear();renderProducts();save();
