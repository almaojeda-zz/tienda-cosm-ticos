// GLOW BEAUTY - lógica de la tienda online

const products = [
  {id:1,name:"Labial Rose Nude",category:"maquillaje",price:8500,image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",description:"Color suave para todos los días."},
  {id:2,name:"Paleta Soft Glam",category:"maquillaje",price:14500,image:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",description:"Tonos cálidos y versátiles."},
  {id:3,name:"Máscara de pestañas",category:"maquillaje",price:9900,image:"https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=700&q=80",description:"Definición y volumen."},
  {id:4,name:"Base Natural Glow",category:"maquillaje",price:18000,image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",description:"Acabado natural y luminoso."},
  {id:5,name:"Crema Hidratante",category:"skincare",price:12500,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",description:"Hidratación para tu rutina."},
  {id:6,name:"Sérum Facial",category:"skincare",price:16900,image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",description:"Un mimo para tu piel."},
  {id:7,name:"Limpiador Facial",category:"skincare",price:11000,image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80",description:"Limpieza suave y diaria."},
  {id:8,name:"Rodillo Facial",category:"accesorios",price:7800,image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80",description:"Ideal para tu momento de relax."},
  {id:9,name:"Set de Brochas",category:"accesorios",price:13500,image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",description:"Tus herramientas de maquillaje."},
  {id:10,name:"Esponja de Maquillaje",category:"accesorios",price:4500,image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",description:"Para aplicar y difuminar."},
  {id:11,name:"Protector Solar",category:"skincare",price:15500,image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",description:"Un paso esencial de cuidado."},
  {id:12,name:"Gloss Brillo",category:"maquillaje",price:7200,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",description:"Un toque de brillo para tus labios."}
];

const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat("es-AR", {style:"currency",currency:"ARS",maximumFractionDigits:0}).format(amount);
let cart = JSON.parse(localStorage.getItem("glowCart") || "[]");
let favorites = JSON.parse(localStorage.getItem("glowFavorites") || "[]");
let activeCategory = "todos";
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function saveCart() {
  localStorage.setItem("glowCart", JSON.stringify(cart));
  updateCart();
}
function saveFavorites() {
  localStorage.setItem("glowFavorites", JSON.stringify(favorites));
}

function renderProducts() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const category = activeCategory;
  let filtered = products.filter(p =>
    (category === "todos" || p.category === category) &&
    (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
  );
  const sort = $("#sortFilter").value;
  if (sort === "low") filtered.sort((a,b) => a.price-b.price);
  if (sort === "high") filtered.sort((a,b) => b.price-a.price);
  if (sort === "name") filtered.sort((a,b) => a.name.localeCompare(b.name,"es"));

  $("#productGrid").innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x600/f3e1e5/9b6877?text=Glow+Beauty'">
        <button class="favorite-button ${favorites.includes(p.id) ? "active" : ""}" data-favorite="${p.id}" aria-label="Agregar ${p.name} a favoritos">${favorites.includes(p.id) ? "♥" : "♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-category">${categoryName(p.category)}</span>
        <h3>${p.name}</h3>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">+</button></div>
      </div>
    </article>`).join("");
  $("#emptyMessage").hidden = filtered.length !== 0;
}
function categoryName(category) {
  return ({maquillaje:"Maquillaje",skincare:"Skincare",accesorios:"Accesorios"})[category];
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.quantity++;
  else cart.push({id,quantity:1});
  saveCart();
  showToast("¡Producto agregado al carrito! ♡");
}
function updateCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity,0);
  $("#cartCount").textContent = count;
  $("#cartItems").innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    if (!p) return "";
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/100x100/f3e1e5/9b6877?text=Glow'">
      <div><h4>${p.name}</h4><small>${money(p.price)} c/u</small>
        <div class="quantity-controls"><button data-quantity="${p.id}" data-change="-1" aria-label="Restar">−</button><span>${item.quantity}</span><button data-quantity="${p.id}" data-change="1" aria-label="Sumar">+</button></div>
      </div>
      <button class="remove-item" data-remove="${p.id}" aria-label="Eliminar ${p.name}">×</button>
    </div>`;
  }).join("");
  const total = cart.reduce((sum,item) => {
    const p = products.find(product => product.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  },0);
  $("#cartTotal").textContent = money(total);
  $("#cartEmpty").style.display = cart.length ? "none" : "block";
  $("#cartSummary").style.display = cart.length ? "block" : "none";
}

function changeQuantity(id,change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  showToast("Producto eliminado del carrito.");
}
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    showToast("Quitaste el producto de favoritos.");
  } else {
    favorites.push(id);
    showToast("¡Agregado a tus favoritos! ♥");
  }
  saveFavorites();
  renderProducts();
}
function openCart() {
  $("#cartPanel").classList.add("open");
  $("#overlay").classList.add("show");
  $("#cartPanel").setAttribute("aria-hidden","false");
}
function closeCart() {
  $("#cartPanel").classList.remove("open");
  $("#overlay").classList.remove("show");
  $("#cartPanel").setAttribute("aria-hidden","true");
}

$("#productGrid").addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const favorite = event.target.closest("[data-favorite]");
  if (add) addToCart(Number(add.dataset.add));
  if (favorite) toggleFavorite(Number(favorite.dataset.favorite));
});
$("#cartItems").addEventListener("click", event => {
  const quantity = event.target.closest("[data-quantity]");
  const remove = event.target.closest("[data-remove]");
  if (quantity) changeQuantity(Number(quantity.dataset.quantity),Number(quantity.dataset.change));
  if (remove) removeFromCart(Number(remove.dataset.remove));
});
$("#searchInput").addEventListener("input",renderProducts);
$("#categoryFilter").addEventListener("change",event => {
  activeCategory = event.target.value;
  document.querySelectorAll(".chip").forEach(chip => chip.classList.toggle("active",chip.dataset.category === activeCategory));
  renderProducts();
});
$("#sortFilter").addEventListener("change",renderProducts);
$("#categoryChips").addEventListener("click",event => {
  const chip = event.target.closest("[data-category]");
  if (!chip) return;
  activeCategory = chip.dataset.category;
  $("#categoryFilter").value = activeCategory;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active",c === chip));
  renderProducts();
});
$("#openCart").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closeCart);
$("#overlay").addEventListener("click",closeCart);
$("#continueShopping").addEventListener("click",closeCart);
$("#themeToggle").addEventListener("click",() => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("glowDarkMode",dark ? "on" : "off");
  $("#themeToggle").textContent = dark ? "☀" : "☾";
});
$("#checkoutButton").addEventListener("click",() => {
  closeCart();
  $("#checkoutModal").classList.add("show");
  $("#checkoutModal").setAttribute("aria-hidden","false");
});
function closeModal() {
  $("#checkoutModal").classList.remove("show");
  $("#checkoutModal").setAttribute("aria-hidden","true");
}
$("#closeModal").addEventListener("click",closeModal);
$("#checkoutModal").addEventListener("click",event => {if(event.target === $("#checkoutModal")) closeModal();});
$("#checkoutForm").addEventListener("submit",event => {
  event.preventDefault();
  const name = new FormData(event.target).get("name").trim();
  const total = $("#cartTotal").textContent;
  alert(`¡Gracias, ${name}! Tu pedido de ${total} fue registrado como demostración. No se realizó ningún pago.`);
  cart = [];
  saveCart();
  event.target.reset();
  closeModal();
  showToast("¡Compra de prueba realizada con éxito! ✨");
});

if (localStorage.getItem("glowDarkMode") === "on") {
  document.body.classList.add("dark");
  $("#themeToggle").textContent = "☀";
}
renderProducts();
updateCart();
