const foods = [
  {id:1,name:"Margherita Pizza",category:"Pizza",price:249,desc:"Classic cheese, basil & tomato.",emoji:"🍕",image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Crispy Veg Burger",category:"Burgers",price:149,desc:"Crunchy patty with fresh veggies.",emoji:"🍔",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Paneer Butter Masala",category:"Indian",price:229,desc:"Creamy tomato gravy & soft paneer.",emoji:"🍛",image:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Fresh Garden Salad",category:"Healthy",price:179,desc:"A fresh mix of greens and goodness.",emoji:"🥗",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Farmhouse Pizza",category:"Pizza",price:299,desc:"Loaded with colourful garden veggies.",emoji:"🍕",image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Classic Cheese Burger",category:"Burgers",price:189,desc:"Juicy, cheesy and always satisfying.",emoji:"🍔",image:"https://images.unsplash.com/photo-155 burger?auto=format&fit=crop&w=700&q=80".replace("155 burger","1550547660-d9450f859349")},
  {id:7,name:"Chocolate Cake",category:"Desserts",price:129,desc:"Rich, soft chocolate indulgence.",emoji:"🍰",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Gulab Jamun",category:"Desserts",price:99,desc:"Warm, soft and syrupy sweet bites.",emoji:"🍮",image:"https://images.unsplash.com/photo-1666190092159-3f2e9b3b1f3d?auto=format&fit=crop&w=700&q=80"}
];
let cart = [];
let activeCategory = "All";
const grid = document.getElementById("food-grid");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const money = n => "₹" + n.toLocaleString("en-IN");

function renderFoods(){
  const term = document.getElementById("search").value.toLowerCase().trim();
  const filtered = foods.filter(f => (activeCategory === "All" || f.category === activeCategory) && (f.name.toLowerCase().includes(term) || f.desc.toLowerCase().includes(term)));
  grid.innerHTML = filtered.map(f => `<article class="food-card"><img src="${f.image}" alt="${f.name}" loading="lazy"><div class="food-info"><h3>${f.emoji} ${f.name}</h3><p>${f.desc}</p><div class="food-bottom"><span class="price">${money(f.price)}</span><button class="add-button" data-add="${f.id}">+ Add</button></div></div></article>`).join("");
  document.getElementById("empty-state").hidden = filtered.length !== 0;
}
function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = money(total);
  document.getElementById("cart-items").innerHTML = cart.length ? cart.map(item=>`<div class="cart-item"><img src="${item.image}" alt=""><div><h4>${item.name}</h4><small>${money(item.price)} each</small><div class="quantity"><button data-qty="${item.id}" data-change="-1">−</button><b>${item.qty}</b><button data-qty="${item.id}" data-change="1">+</button></div></div><b>${money(item.price*item.qty)}</b></div>`).join("") : '<p class="cart-empty">Your cart is waiting for something delicious! 😋</p>';
}
function showToast(message){
  const toast=document.getElementById("toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2100);
}
function openCart(){cartPanel.classList.add("open");overlay.classList.add("open");cartPanel.setAttribute("aria-hidden","false");}
function closeCart(){cartPanel.classList.remove("open");overlay.classList.remove("open");cartPanel.setAttribute("aria-hidden","true");}

grid.addEventListener("click",e=>{
  const btn=e.target.closest("[data-add]"); if(!btn)return;
  const food=foods.find(f=>f.id===Number(btn.dataset.add));
  const existing=cart.find(i=>i.id===food.id);
  if(existing)existing.qty++;else cart.push({...food,qty:1});
  renderCart();showToast(`${food.name} added to cart`);
});
document.getElementById("cart-items").addEventListener("click",e=>{
  const btn=e.target.closest("[data-qty]");if(!btn)return;
  const item=cart.find(i=>i.id===Number(btn.dataset.qty));if(!item)return;
  item.qty+=Number(btn.dataset.change);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);
  renderCart();
});
document.getElementById("filters").addEventListener("click",e=>{
  const btn=e.target.closest("[data-category]");if(!btn)return;
  activeCategory=btn.dataset.category;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));renderFoods();
});
document.getElementById("search").addEventListener("input",renderFoods);
document.getElementById("cart-toggle").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){showToast("Your cart is empty — add a dish first!");return;}
  const orderId="QB"+Math.floor(10000+Math.random()*90000);
  cart=[];renderCart();closeCart();showToast(`Order ${orderId} placed! This is a demo checkout.`);
});
document.getElementById("year").textContent=new Date().getFullYear();
renderFoods();renderCart();
