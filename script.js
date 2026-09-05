/* Navid Gardizi Perfume — V3
   Product photos: edit ONLY the image field in products[].
*/
const products=[
{id:1,name:"Imagination",cat:"daily",desc:"مرکبات · چوب · مشک",price:1850,image:"assets/products/imagination.webp"},
{id:2,name:"Noir Oud",cat:"oriental",desc:"عود · عنبر · زعفران",price:2200,image:"assets/products/noir-oud.webp"},
{id:3,name:"Élan",cat:"luxury",desc:"رز · زنبق · صندل",price:2450,image:"assets/products/elan.webp"},
{id:4,name:"Velour",cat:"luxury",desc:"وانیل · تنباکو · کهربا",price:2350,image:"assets/products/velour.webp"},
{id:5,name:"Sahar",cat:"oriental",desc:"مشک · عود · ادویه",price:1950,image:"assets/products/sahar.webp"},
{id:6,name:"Pure",cat:"daily",desc:"برگاموت · گل سفید · مشک",price:1650,image:"assets/products/pure.webp"},
{id:7,name:"Majestic",cat:"luxury",desc:"چرم · زعفران · چوب",price:2800,image:"assets/products/majestic.webp"},
{id:8,name:"Oud Mist",cat:"oriental",desc:"عود · رز · بخور",price:2100,image:"assets/products/oud-mist.webp"}];

const translations={
fa:{dir:"rtl",nav:{home:"خانه",products:"عطرها",story:"داستان ما",journal:"مجله",contact:"تماس"},add:"افزودن به سبد",empty:"سبد خرید خالی است.",cart:"سبد خرید",total:"مجموع",remove:"حذف",order:"ثبت سفارش",added:"به سبد خرید اضافه شد ✓",placeholder:"اینجا باید عکس گذاشته شود",categories:{luxury:"لوکس",daily:"روزانه",oriental:"شرقی"}},
ps:{dir:"rtl",nav:{home:"کور",products:"عطرونه",story:"زموږ کیسه",journal:"مجله",contact:"اړیکه"},add:"سبد ته اضافه کړئ",empty:"د پېرلو ټوکرۍ خالي ده.",cart:"د پېرلو ټوکرۍ",total:"ټول",remove:"حذف",order:"سفارش ثبت کړئ",added:"سبد ته اضافه شو ✓",placeholder:"دلته باید عکس واچول شي",categories:{luxury:"لوکس",daily:"ورځنی",oriental:"ختیځ"}},
en:{dir:"ltr",nav:{home:"Home",products:"Perfumes",story:"Our Story",journal:"Journal",contact:"Contact"},add:"Add to cart",empty:"Your cart is empty.",cart:"Shopping cart",total:"Total",remove:"Remove",order:"Place order",added:"Added to cart ✓",placeholder:"Product photo goes here",categories:{luxury:"Luxury",daily:"Daily",oriental:"Oriental"}}};

let language=localStorage.getItem("ng-language")||"fa";
let cart=[];
try{cart=JSON.parse(localStorage.getItem("ng-v3-cart")||"[]")}catch{cart=[]}
const fmt=n=>new Intl.NumberFormat(language==="en"?"en-US":"fa-AF").format(n);
const grid=document.querySelector("#products");
const t=()=>translations[language];

function productCard(p){
 const cat=t().categories[p.cat]||p.cat;
 return `<article class="product reveal-card">
   <div class="visual product-photo">
     <img src="${p.image}" alt="${p.name}" loading="lazy"
       onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
     <div class="photo-placeholder" hidden><span>${t().placeholder}</span></div>
   </div>
   <div class="p-info"><small>COLLECTION · ${cat.toUpperCase()}</small>
     <h3>${p.name}</h3><p>${p.desc}</p>
     <div class="p-foot"><b>${fmt(p.price)} ${language==="en"?"AFN":"افغانی"}</b>
     <button class="add" data-id="${p.id}" aria-label="${t().add}">+</button></div>
   </div>
 </article>`;
}
function draw(filter="all"){
 grid.innerHTML=products.filter(p=>filter==="all"||p.cat===filter).map(productCard).join("");
 requestAnimationFrame(()=>document.querySelectorAll(".reveal-card").forEach((el,i)=>setTimeout(()=>el.classList.add("visible"),i*45)));
}
function saveCart(){localStorage.setItem("ng-v3-cart",JSON.stringify(cart))}
function drawCart(){
 const count=cart.reduce((s,p)=>s+p.qty,0);
 document.querySelector("#count").textContent=count;
 document.querySelector("#items").innerHTML=cart.length?cart.map(p=>`
   <div class="cart-row">
    <div class="cart-product"><span>${p.name}</span><small>${fmt(p.price)} ${language==="en"?"AFN":"افغانی"}</small></div>
    <div class="qty"><button data-action="minus" data-id="${p.id}" aria-label="minus">−</button><b>${p.qty}</b><button data-action="plus" data-id="${p.id}" aria-label="plus">+</button></div>
    <button class="remove-item" data-action="remove" data-id="${p.id}" aria-label="${t().remove}">×</button>
   </div>`).join(""):`<p class="empty-cart">${t().empty}</p>`;
 document.querySelector("#total").textContent=fmt(cart.reduce((s,p)=>s+p.price*p.qty,0))+" "+(language==="en"?"AFN":"افغانی");
 document.querySelector(".drawer-head h3").textContent=t().cart;
 document.querySelector("#order").textContent=t().order;
 saveCart();
}
function toast(text){const x=document.querySelector("#toast");x.textContent=text;x.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove("show"),2200)}
function changeLanguage(next){
 if(!translations[next])return;
 language=next;localStorage.setItem("ng-language",next);
 document.documentElement.lang=next;document.documentElement.dir=translations[next].dir;
 document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===next));
 document.querySelectorAll("[data-i18n]").forEach(el=>{
   const path=el.dataset.i18n.split(".");
   let v=translations[next]; for(const k of path)v=v?.[k];
   if(v)el.textContent=v;
 });
 const active=document.querySelector(".filters button.active");
 draw(active?.dataset.filter||"all"); drawCart();
}
document.querySelector(".filters").addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");draw(b.dataset.filter);
});
grid.addEventListener("click",e=>{
 const b=e.target.closest(".add");if(!b)return;
 const p=products.find(x=>x.id===Number(b.dataset.id));if(!p)return;
 const old=cart.find(x=>x.id===p.id);old?old.qty++:cart.push({...p,qty:1});
 drawCart();toast(t().added);
});
document.querySelector("#items").addEventListener("click",e=>{
 const b=e.target.closest("[data-action]");if(!b)return;
 const id=Number(b.dataset.id),item=cart.find(x=>x.id===id);if(!item)return;
 if(b.dataset.action==="plus")item.qty++;
 if(b.dataset.action==="minus"){item.qty--;if(item.qty<=0)cart=cart.filter(x=>x.id!==id)}
 if(b.dataset.action==="remove")cart=cart.filter(x=>x.id!==id);
 drawCart();
});
document.querySelector(".cart-btn").onclick=()=>document.querySelector("#drawer").classList.add("open");
document.querySelector("#close").onclick=()=>document.querySelector("#drawer").classList.remove("open");
document.querySelector("#order").onclick=()=>toast(cart.length?"برای سفارش واقعی، پرداخت امن و تأیید سفارش باید به بک‌اند فروشگاه وصل شود.":"سبد خرید خالی است.");
document.querySelector("#form").onsubmit=e=>{e.preventDefault();e.target.reset();toast("عضویت با موفقیت ثبت شد ✓")};
document.querySelector("#menu").onclick=()=>document.querySelector("#mobileNav").classList.toggle("show");
document.querySelectorAll("#mobileNav a").forEach(a=>a.onclick=()=>document.querySelector("#mobileNav").classList.remove("show"));
document.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>changeLanguage(b.dataset.lang));
document.addEventListener("mousemove",e=>{const c=document.querySelector(".cursor");if(c){c.style.left=e.clientX+"px";c.style.top=e.clientY+"px"}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelector("#drawer").classList.remove("open")});
changeLanguage(language);
