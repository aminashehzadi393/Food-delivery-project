/* ============================================================
   FoodExpress — app.js
   Vanilla JS: menu rendering, search, category filter, cart,
   checkout and confirmation. No frameworks, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Menu data (single source of truth) ---------- */
  var MENU = [
    { id: 1,  name: "Chicken Biryani",      cat: "desi",     price: 350, badge: "Bestseller", grad: ["#e63946", "#f4a261"], desc: "Fragrant basmati rice layered with spiced chicken, served with raita & salad." },
    { id: 2,  name: "Chicken Karahi",        cat: "desi",     price: 650, badge: "",           grad: ["#9d0208", "#e63946"], desc: "Traditional wok-tossed chicken karahi with tomatoes, ginger & green chillies." },
    { id: 3,  name: "Chicken Handi",         cat: "desi",     price: 550, badge: "",           grad: ["#b5651d", "#e9c46a"], desc: "Creamy boneless chicken handi slow-cooked in a rich tomato-butter gravy." },
    { id: 4,  name: "Crispy Zinger Burger",  cat: "fastfood", price: 450, badge: "Popular",    grad: ["#f4a261", "#e76f51"], desc: "Crunchy fried chicken fillet with mayo & lettuce in a toasted sesame bun." },
    { id: 5,  name: "Margherita Pizza",      cat: "fastfood", price: 899, badge: "",           grad: ["#e76f51", "#c1121f"], desc: "Classic 12-inch pizza with mozzarella, tomato sauce & fresh basil." },
    { id: 6,  name: "Club Sandwich",         cat: "fastfood", price: 380, badge: "",           grad: ["#e9c46a", "#f4a261"], desc: "Triple-decker sandwich with grilled chicken, egg, cheese & fries." },
    { id: 7,  name: "French Fries",          cat: "fastfood", price: 220, badge: "",           grad: ["#ffb703", "#fb8500"], desc: "Golden crispy fries sprinkled with our signature masala salt." },
    { id: 8,  name: "Chicken Tikka",         cat: "bbq",      price: 320, badge: "Popular",    grad: ["#c1121f", "#780000"], desc: "Char-grilled chicken tikka marinated overnight in yogurt & spices." },
    { id: 9,  name: "Beef Seekh Kabab",      cat: "bbq",      price: 400, badge: "",           grad: ["#6d3b14", "#a05c2c"], desc: "Juicy beef seekh kababs grilled over open flame, served with naan." },
    { id: 10, name: "Chicken Shawarma",      cat: "bbq",      price: 250, badge: "",           grad: ["#d68c45", "#b5651d"], desc: "Flame-grilled chicken shawarma wrapped in soft pita with garlic sauce." },
    { id: 11, name: "Chicken Chow Mein",     cat: "chinese",  price: 450, badge: "",           grad: ["#e76f51", "#f4a261"], desc: "Wok-tossed noodles with chicken, crunchy vegetables & soy glaze." },
    { id: 12, name: "Chicken Fried Rice",    cat: "chinese",  price: 400, badge: "",           grad: ["#ca6702", "#ee9b00"], desc: "Smoky fried rice with chicken strips, egg & spring onions." },
    { id: 13, name: "Gulab Jamun (4 pcs)",   cat: "dessert",  price: 200, badge: "",           grad: ["#9d4edd", "#c77dff"], desc: "Soft, warm gulab jamuns soaked in rose-cardamom syrup." },
    { id: 14, name: "Mango Lassi",           cat: "dessert",  price: 180, badge: "",           grad: ["#ffb703", "#ffd60a"], desc: "Thick, creamy mango lassi churned fresh with real mango pulp." }
  ];

  var CAT_LABELS = {
    desi: "Desi", fastfood: "Fast Food", bbq: "BBQ & Grill",
    chinese: "Chinese", dessert: "Desserts & Drinks"
  };

  var DELIVERY_FEE = 150;
  var FREE_DELIVERY_MIN = 1500;

  /* ---------- State ---------- */
  var cart = {};          // { dishId: quantity }
  var activeCat = "all";
  var searchQuery = "";

  /* ---------- DOM refs ---------- */
  function $(id) { return document.getElementById(id); }
  var menuGrid = $("menuGrid"), noResults = $("noResults"),
      cartDrawer = $("cartDrawer"), overlay = $("overlay"),
      cartItems = $("cartItems"), cartEmpty = $("cartEmpty"),
      cartSummary = $("cartSummary"), cartCount = $("cartCount");

  /* ---------- Helpers ---------- */
  function fmt(n) { return "Rs " + n.toLocaleString("en-PK"); }
  function findDish(id) {
    for (var i = 0; i < MENU.length; i++) if (MENU[i].id === id) return MENU[i];
    return null;
  }
  function cartQty() {
    var n = 0;
    for (var k in cart) n += cart[k];
    return n;
  }
  function cartSubtotal() {
    var s = 0;
    for (var k in cart) { var d = findDish(+k); if (d) s += d.price * cart[k]; }
    return s;
  }
  function saveCart() { try { localStorage.setItem("fd_cart", JSON.stringify(cart)); } catch (e) {} }
  function loadCart() {
    try {
      var raw = localStorage.getItem("fd_cart");
      if (raw) { var c = JSON.parse(raw); for (var k in c) if (findDish(+k) && c[k] > 0) cart[k] = c[k]; }
    } catch (e) {}
  }

  /* ---------- Menu rendering ---------- */
  function renderMenu() {
    var html = "", shown = 0;
    for (var i = 0; i < MENU.length; i++) {
      var d = MENU[i];
      if (activeCat !== "all" && d.cat !== activeCat) continue;
      if (searchQuery && (d.name + " " + d.desc).toLowerCase().indexOf(searchQuery) === -1) continue;
      shown++;
      var badge = d.badge ? '<span class="dish-badge">' + d.badge + "</span>" : "";
      html +=
        '<article class="dish-card">' +
          '<div class="dish-visual" role="img" aria-label="Photo-style visual for ' + d.name + '"' +
          ' style="background: linear-gradient(135deg,' + d.grad[0] + "," + d.grad[1] + ')">' +
            badge +
            '<span class="dish-initial" aria-hidden="true">' + d.name.charAt(0) + "</span>" +
          "</div>" +
          '<div class="dish-body">' +
            '<p class="dish-cat">' + CAT_LABELS[d.cat] + "</p>" +
            "<h3>" + d.name + "</h3>" +
            '<p class="dish-desc">' + d.desc + "</p>" +
            '<div class="dish-foot">' +
              '<span class="price">' + fmt(d.price) + "</span>" +
              '<button class="add-btn" data-add="' + d.id + '" aria-label="Add ' + d.name + ' to cart">Add</button>' +
            "</div>" +
          "</div>" +
        "</article>";
    }
    menuGrid.innerHTML = html;
    noResults.classList.toggle("hidden", shown > 0);
  }

  /* ---------- Cart rendering ---------- */
  function renderCart() {
    var keys = Object.keys(cart), html = "";
    for (var i = 0; i < keys.length; i++) {
      var d = findDish(+keys[i]), q = cart[keys[i]];
      if (!d) continue;
      html +=
        '<li class="cart-item">' +
          '<span class="ci-name">' + d.name + "</span>" +
          '<button class="ci-remove" data-remove="' + d.id + '" aria-label="Remove ' + d.name + ' from cart">Remove</button>' +
          '<span class="ci-price">' + fmt(d.price) + " each</span>" +
          '<div class="qty-controls">' +
            '<button class="qty-btn" data-dec="' + d.id + '" aria-label="Decrease quantity of ' + d.name + '">−</button>' +
            '<span class="qty">' + q + "</span>" +
            '<button class="qty-btn" data-inc="' + d.id + '" aria-label="Increase quantity of ' + d.name + '">+</button>' +
          "</div>" +
          '<span class="ci-total">' + fmt(d.price * q) + "</span>" +
        "</li>";
    }
    cartItems.innerHTML = html;
    var empty = keys.length === 0;
    cartEmpty.classList.toggle("hidden", !empty);
    cartSummary.classList.toggle("hidden", empty);

    var sub = cartSubtotal();
    var fee = sub === 0 || sub >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
    $("subTotal").textContent = fmt(sub);
    $("delFee").textContent = fee === 0 ? "FREE" : fmt(fee);
    $("grandTotal").textContent = fmt(sub + fee);
    $("checkoutTotal").textContent = fmt(sub + fee);
    $("freeNote").textContent = (sub > 0 && sub < FREE_DELIVERY_MIN)
      ? "Add " + fmt(FREE_DELIVERY_MIN - sub) + " more for FREE delivery!"
      : (sub >= FREE_DELIVERY_MIN ? "You unlocked FREE delivery!" : "");
    cartCount.textContent = cartQty();
  }

  /* ---------- Cart actions ---------- */
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart(); renderCart();
  }
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = q;
    saveCart(); renderCart();
  }

  /* ---------- Drawer views ---------- */
  function showView(name) {
    ["cartView", "checkoutView", "confirmView"].forEach(function (v) {
      $(v).classList.toggle("hidden", v !== name);
    });
  }
  function openCart() {
    showView("cartView");
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  /* ---------- Events (delegation) ---------- */
  menuGrid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]");
    if (b) { addToCart(+b.getAttribute("data-add")); openCart(); }
  });
  cartItems.addEventListener("click", function (e) {
    var t = e.target;
    var inc = t.closest("[data-inc]"), dec = t.closest("[data-dec]"), rem = t.closest("[data-remove]");
    if (inc) { var id = +inc.getAttribute("data-inc"); setQty(id, (cart[id] || 0) + 1); }
    else if (dec) { var id2 = +dec.getAttribute("data-dec"); setQty(id2, (cart[id2] || 0) - 1); }
    else if (rem) { delete cart[+rem.getAttribute("data-remove")]; saveCart(); renderCart(); }
  });

  $("cartOpenBtn").addEventListener("click", openCart);
  $("cartCloseBtn").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
  });

  $("toCheckoutBtn").addEventListener("click", function () {
    if (cartQty() === 0) return;
    showView("checkoutView");
  });
  $("backToCartBtn").addEventListener("click", function () { showView("cartView"); });

  /* ---------- Category filter ---------- */
  $("catPills").addEventListener("click", function (e) {
    var p = e.target.closest(".pill");
    if (!p) return;
    var pills = this.querySelectorAll(".pill");
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove("active");
    p.classList.add("active");
    activeCat = p.getAttribute("data-cat");
    renderMenu();
  });

  /* ---------- Search ---------- */
  function doSearch() {
    searchQuery = $("searchInput").value.trim().toLowerCase();
    renderMenu();
    var r = $("menu").getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight) {
      $("menu").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  $("searchForm").addEventListener("submit", function (e) { e.preventDefault(); doSearch(); });
  $("searchInput").addEventListener("input", function () {
    searchQuery = this.value.trim().toLowerCase();
    renderMenu();
  });

  /* ---------- Checkout (demo submit) ---------- */
  $("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("custName").value.trim(),
        phone = $("custPhone").value.trim(),
        addr = $("custAddr").value.trim(),
        phoneOk = /^[0-9+\-\s]{7,15}$/.test(phone);
    var err = $("formError");
    if (!name || !phoneOk || !addr) {
      err.classList.remove("hidden");
      return;
    }
    err.classList.add("hidden");
    $("confName").textContent = name.split(" ")[0];
    $("orderId").textContent = "FE-" + Date.now().toString().slice(-6);
    cart = {}; saveCart(); renderCart();
    showView("confirmView");
  });
  $("doneBtn").addEventListener("click", closeCart);

  /* ---------- Mobile nav ---------- */
  var navToggle = $("navToggle"), navLinks = $("navLinks");
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Init ---------- */
  $("year").textContent = new Date().getFullYear();
  loadCart();
  renderMenu();
  renderCart();
})();
