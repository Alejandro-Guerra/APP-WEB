/* ============================================================
   PetHogar — main.js
   Cubre: navbar, año, index (filtros + spotlight),
          adopta (grid + filtros), donaciones (form)
   ============================================================ */

/* ── 1. AÑO EN FOOTER ───────────────────────────────────── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── 2. NAVBAR BURGER (móvil) ───────────────────────────── */
const burgerBtn  = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.style.display === "block";
    mobileMenu.style.display = isOpen ? "none" : "block";
    burgerBtn.setAttribute("aria-expanded", String(!isOpen));
  });
}


/* ── 3. DATA CENTRAL ────────────────────────────────────── */

// Spotlight (index.html) — rutas desde /PaginaDog/
const PETS_SPOTLIGHT = [
  { name: "Luna",    meta: "Perra joven • Cancún",           desc: "Tranquila, curiosa y experta en ronroneos terapéuticos.", img: "Imagenes/bonie.jpeg"    },
  { name: "Patotas", meta: "Perro adulto • Mérida",           desc: "Leal, juguetón y con energía para paseos largos.",         img: "Imagenes/LicPatas.jpeg" },
  { name: "Nala",    meta: "Perra joven • Playa del Carmen",  desc: "Cariñosa, sociable y lista para una familia responsable.", img: "Imagenes/canela.jpeg"   },
  { name: "Pato",    meta: "Pato joven • Playa del Carmen",   desc: "Cariñoso, sociable y listo para su nueva familia.",        img: "Imagenes/pato.jpeg"     },
];

// Grid adopta (pages/adopta.html) — rutas relativas desde /pages/
const ADOPT_PETS = [
  { name: "Luna",    type: "Perro", status: "Disponible", meta: "Joven • Cancún",           desc: "Tranquila y curiosa, excelente con niños.",        img: "../Imagenes/bonie.jpeg"    },
  { name: "Patotas", type: "Perro", status: "Disponible", meta: "Adulto • Mérida",           desc: "Leal, juguetón y lleno de energía.",               img: "../Imagenes/LicPatas.jpeg" },
  { name: "Nala",    type: "Perro", status: "Adoptado",   meta: "Joven • Playa del Carmen",  desc: "¡Ya encontró hogar! 💜",                           img: "../Imagenes/canela.jpeg"   },
  { name: "Michi",   type: "Gato",  status: "Disponible", meta: "Cachorro • Cancún",         desc: "Pequeño pero con mucha actitud.",                  img: "../Imagenes/michi.jpeg"    },
  { name: "Lalo",    type: "Perro", status: "Adoptado",   meta: "Adulto • Cancún",            desc: "Misión cumplida, tiene un hogar 🏠",               img: "../Imagenes/lalo.jpeg"     },
  { name: "Andrix",  type: "Perro", status: "Disponible", meta: "Joven • Mérida",             desc: "Dulce, sociable y muy cariñoso.",                  img: "../Imagenes/andrix.jpeg"   },
];


/* ── 4. INDEX — FILTROS HERO ────────────────────────────── */
const filtersForm   = document.getElementById("filtersForm");
const filtersResult = document.getElementById("filtersResult");

if (filtersForm && filtersResult) {
  filtersForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const vals = ["tipo","tamano","sexo","ubicacion","edad"]
      .map(id => document.getElementById(id)?.value)
      .filter(v => v && v !== "Todos");

    filtersResult.textContent = vals.length
      ? `Filtros: ${vals.join(" • ")} — ve a "Adopta" para ver los resultados.`
      : 'Mostrando todas las mascotas. Ve a "Adopta" para verlas.';
  });
}


/* ── 5. INDEX — SPOTLIGHT ───────────────────────────────── */
let spotIdx = 0;
const spotImg  = document.getElementById("spotlightImg");
const spotName = document.getElementById("spotlightName");
const spotMeta = document.getElementById("spotlightMeta");
const spotDesc = document.getElementById("spotlightDesc");
const prevBtn  = document.getElementById("prevBtn");
const nextBtn  = document.getElementById("nextBtn");
const dotsEl   = document.getElementById("dots");

function buildDots() {
  if (!dotsEl) return;
  dotsEl.innerHTML = "";
  PETS_SPOTLIGHT.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "dot" + (i === spotIdx ? " is-active" : "");
    btn.setAttribute("aria-label", `Ir a mascota ${i + 1}`);
    btn.addEventListener("click", () => { spotIdx = i; renderSpotlight(); });
    dotsEl.appendChild(btn);
  });
}

function renderSpotlight() {
  const p = PETS_SPOTLIGHT[spotIdx];
  if (spotImg) {
    spotImg.style.opacity = "0";
    setTimeout(() => { spotImg.src = p.img; spotImg.style.opacity = "1"; }, 140);
  }
  if (spotName) spotName.textContent = p.name;
  if (spotMeta) spotMeta.textContent = p.meta;
  if (spotDesc) spotDesc.textContent = p.desc;
  buildDots();
}

if (spotImg) {
  spotImg.style.transition = "opacity .14s ease";
  renderSpotlight();

  // Auto-avance 5 s; pausa si el usuario toca los botones
  let autoSlide = setInterval(() => {
    spotIdx = (spotIdx + 1) % PETS_SPOTLIGHT.length;
    renderSpotlight();
  }, 5000);

  const pauseAuto = () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      spotIdx = (spotIdx + 1) % PETS_SPOTLIGHT.length;
      renderSpotlight();
    }, 5000);
  };

  if (prevBtn) prevBtn.addEventListener("click", () => { spotIdx = (spotIdx - 1 + PETS_SPOTLIGHT.length) % PETS_SPOTLIGHT.length; renderSpotlight(); pauseAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { spotIdx = (spotIdx + 1) % PETS_SPOTLIGHT.length; renderSpotlight(); pauseAuto(); });
}


/* ── 6. ADOPTA — GRID + FILTROS ─────────────────────────── */
const adoptGrid = document.getElementById("adoptGrid");

if (adoptGrid) {
  const adoptForm = document.getElementById("adoptFilters");
  const fTipo     = document.getElementById("fTipo");
  const fEstado   = document.getElementById("fEstado");
  const fBuscar   = document.getElementById("fBuscar");
  const resetBtn  = document.getElementById("resetBtn");
  const countEl   = document.getElementById("countResult");

  function petCard(p) {
    const adopted = p.status === "Adoptado";
    return `
      <article class="petCard${adopted ? " is-adopted" : ""}">
        <div class="petCard__imgWrap">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <span class="badge badge--type">${p.type === "Gato" ? "🐱" : "🐶"} ${p.type}</span>
          <span class="badge ${adopted ? "badge--adopted" : "badge--status"}">
            ${adopted ? "✓ ADOPTADO" : "● DISPONIBLE"}
          </span>
        </div>
        <div class="petCard__body">
          <h3 class="petCard__name">${p.name}</h3>
          <p class="petCard__meta">${p.meta}</p>
          <p class="petCard__desc">${p.desc}</p>
          <div class="petCard__actions">
            <a class="btn btn--secondary" href="donaciones.html">💜 Apoyar</a>
            <a class="btn btn--primary"   href="donaciones.html">🐾 Adoptar</a>
          </div>
        </div>
      </article>`;
  }

  function renderGrid(list) {
    adoptGrid.innerHTML = list.length
      ? list.map(petCard).join("")
      : `<div class="noResults"><span>🔍</span>Ninguna mascota coincide.<br>Prueba cambiando los filtros.</div>`;

    if (countEl) {
      const disp = list.filter(p => p.status === "Disponible").length;
      countEl.textContent = `${list.length} mascota(s) — ${disp} disponible(s)`;
    }
  }

  function applyFilters() {
    const tipo   = fTipo?.value   ?? "Todos";
    const estado = fEstado?.value ?? "Todos";
    const buscar = (fBuscar?.value ?? "").trim().toLowerCase();

    renderGrid(ADOPT_PETS.filter(p =>
      (tipo   === "Todos" || p.type   === tipo)   &&
      (estado === "Todos" || p.status === estado) &&
      (!buscar || p.name.toLowerCase().includes(buscar))
    ));
  }

  // Render inicial
  renderGrid(ADOPT_PETS);

  // Filtro en tiempo real al escribir el nombre
  if (fBuscar) fBuscar.addEventListener("input", applyFilters);

  if (adoptForm) adoptForm.addEventListener("submit", (e) => { e.preventDefault(); applyFilters(); });

  if (resetBtn) resetBtn.addEventListener("click", () => {
    if (fTipo)   fTipo.value   = "Todos";
    if (fEstado) fEstado.value = "Todos";
    if (fBuscar) fBuscar.value = "";
    renderGrid(ADOPT_PETS);
  });
}


/* ── 7. DONACIONES — FORM ───────────────────────────────── */
const donForm = document.getElementById("donForm");

if (donForm) {
  const donNombre = document.getElementById("donNombre");
  const donCorreo = document.getElementById("donCorreo");
  const donMonto  = document.getElementById("donMonto");
  const donTipo   = document.getElementById("donTipo");
  const donMetodo = document.getElementById("donMetodo");
  const donResult = document.getElementById("donResult");

  function setMsg(text, type = "error") {
    if (!donResult) return;
    donResult.textContent = text;
    donResult.className   = text ? `donResult ${type}` : "donResult";
  }

  donForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setMsg("");

    const nombre = (donNombre?.value || "").trim();
    const correo  = (donCorreo?.value  || "").trim();
    const monto   = Number(donMonto?.value);
    const tipo    = donTipo?.value   || "";
    const metodo  = donMetodo?.value || "";

    if (nombre.length < 3)   { setMsg("⚠ Escribe tu nombre completo (mín. 3 letras)."); return; }
    if (!correo.includes("@")){ setMsg("⚠ Escribe un correo válido.");                   return; }
    if (!monto || monto < 10) { setMsg("⚠ El monto mínimo es $10 MXN.");                 return; }
    if (!tipo)                { setMsg("⚠ Selecciona el tipo de donación.");              return; }
    if (!metodo)              { setMsg("⚠ Selecciona un método de pago.");                return; }

    setMsg(`✅ ¡Gracias, ${nombre}! Donación (demo): $${monto} MXN • ${tipo} • ${metodo}. 💜`, "ok");
    donForm.reset();

    // Resetear botones de monto rápido
    document.querySelectorAll(".amountBtn").forEach(b => b.classList.remove("active"));
  });

  // Limpia el mensaje de error al empezar a escribir
  [donNombre, donCorreo, donMonto, donTipo, donMetodo].forEach(f => {
    if (f) f.addEventListener("input", () => setMsg(""));
  });
}