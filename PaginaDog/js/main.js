// ── Burger menu ──────────────────────────────────────────────
const burgerBtn  = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.style.display === "block";
    mobileMenu.style.display = isOpen ? "none" : "block";
    burgerBtn.setAttribute("aria-expanded", String(!isOpen));
  });
}

// ── Año en footer ─────────────────────────────────────────────
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Nav: mostrar usuario / login ──────────────────────────────
(function initNav() {
  const menu = document.querySelector(".menu");
  if (!menu) return;

  const usuario = JSON.parse(localStorage.getItem("ph_usuario") || "null");

  // Detectar si estamos en /pages/ o en raíz
  const enPages = window.location.pathname.includes("/pages/");
  const base    = enPages ? "" : "pages/";

  if (usuario) {
    // Link admin solo si es administrador y no está ya en el nav (admin.html lo tiene fijo)
    if (usuario.rol === "admin" && !document.getElementById("adminNavLink")) {
      const aAdmin = document.createElement("a");
      aAdmin.className = "menu__link";
      aAdmin.href = `${base}admin.html`;
      aAdmin.textContent = "⚙ Admin";
      menu.appendChild(aAdmin);
    }
    const wrap = document.createElement("div");
    wrap.className = "nav__user";
    wrap.innerHTML = `
      <span>Hola, ${usuario.nombre.split(" ")[0]}</span>
      <button id="logoutBtn">Cerrar sesión</button>
    `;
    menu.after(wrap);
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("ph_usuario");
      location.reload();
    });
  } else {
    const a = document.createElement("a");
    a.className = "menu__link";
    a.href = `${base}login.html`;
    a.textContent = "Iniciar sesión";
    menu.appendChild(a);
  }
})();

// ── Filtros hero (índice) ─────────────────────────────────────
const filtersForm   = document.getElementById("filtersForm");
const filtersResult = document.getElementById("filtersResult");

if (filtersForm && filtersResult) {
  filtersForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo      = document.getElementById("tipo").value;
    const tamano    = document.getElementById("tamano").value;
    const sexo      = document.getElementById("sexo").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const edad      = document.getElementById("edad").value;

    filtersResult.textContent =
      `Filtro: ${tipo} • ${tamano} • ${sexo} • ${ubicacion} • ${edad}. ` +
      `(En "Adopta" verás los resultados.)`;
  });
}

// ── Página Adopta: cargar mascotas desde la API ───────────────
const adoptGrid = document.getElementById("adoptGrid");

if (adoptGrid) {
  const form      = document.getElementById("adoptFilters");
  const fTipo     = document.getElementById("fTipo");
  const fEstado   = document.getElementById("fEstado");
  const fBuscar   = document.getElementById("fBuscar");
  const resetBtn  = document.getElementById("resetBtn");
  const countResult = document.getElementById("countResult");

  function cardTemplate(pet) {
    const adopted = pet.estado === "Adoptado";
    return `
      <article class="petCard ${adopted ? "is-adopted" : ""}">
        <div class="petCard__imgWrap">
          <img src="${pet.imagen || '../imagenes/bonie.jpeg'}" alt="${pet.nombre}">
          <span class="badge badge--type">${pet.tipo}</span>
          <span class="badge ${adopted ? "badge--adopted" : "badge--status"}">
            ${adopted ? "ADOPTADO" : "DISPONIBLE"}
          </span>
        </div>
        <div class="petCard__body">
          <h3 class="petCard__name">${pet.nombre}</h3>
          <p class="petCard__meta">${pet.edad} • ${pet.ubicacion}</p>
          <p class="petCard__desc">${pet.descripcion}</p>
          <div class="petCard__actions">
            <a class="btn btn--secondary" href="donaciones.html">Apoyar</a>
            <a class="btn btn--primary"   href="donaciones.html">Adoptar</a>
          </div>
        </div>
      </article>`;
  }

  function showSkeletons(n = 6) {
    adoptGrid.innerHTML = Array(n).fill('<div class="skeleton"></div>').join("");
  }

  async function loadMascotas() {
    showSkeletons();

    const params = new URLSearchParams();
    if (fTipo?.value   && fTipo.value   !== "Todos") params.set("tipo",   fTipo.value);
    if (fEstado?.value && fEstado.value !== "Todos") params.set("estado", fEstado.value);
    if (fBuscar?.value.trim()) params.set("buscar", fBuscar.value.trim());

    try {
      const res  = await fetch(`../api/mascotas.php?${params}`);
      const list = await res.json();

      if (!list.length) {
        adoptGrid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">No se encontraron mascotas con esos filtros.</p>';
        if (countResult) countResult.textContent = "Sin resultados.";
        return;
      }

      adoptGrid.innerHTML = list.map(cardTemplate).join("");
      if (countResult) countResult.textContent = `Mostrando ${list.length} mascota(s).`;
    } catch {
      adoptGrid.innerHTML = '<p style="color:var(--primary);grid-column:1/-1">Error al cargar mascotas. Verifica que XAMPP esté corriendo.</p>';
    }
  }

  loadMascotas();

  if (form)     form.addEventListener("submit", (e) => { e.preventDefault(); loadMascotas(); });
  if (resetBtn) resetBtn.addEventListener("click", () => {
    fTipo.value = "Todos"; fEstado.value = "Todos"; fBuscar.value = "";
    loadMascotas();
  });
}

// ── Formulario de donación → API ──────────────────────────────
const donForm = document.getElementById("donForm");

if (donForm) {
  const donResult = document.getElementById("donResult");

  donForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    donResult.textContent = "Enviando...";
    donResult.style.color = "var(--muted)";

    const payload = {
      nombre:  document.getElementById("donNombre")?.value.trim() ?? "",
      correo:  document.getElementById("donCorreo")?.value.trim() ?? "",
      monto:   Number(document.getElementById("donMonto")?.value ?? 0),
      tipo:    document.getElementById("donTipo")?.value    ?? "",
      metodo:  document.getElementById("donMetodo")?.value  ?? "",
      mensaje: document.getElementById("donMsg")?.value.trim() ?? ""
    };

    try {
      const res  = await fetch("../api/donaciones.php", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.error) {
        donResult.textContent = data.error;
        donResult.style.color = "var(--primary)";
        return;
      }

      donResult.textContent = `¡Gracias, ${payload.nombre}! Donación registrada: $${payload.monto} MXN • ${payload.tipo} • ${payload.metodo}. 💜`;
      donResult.style.color = "var(--accent)";
      donForm.reset();
    } catch {
      donResult.textContent = "Error de conexión. Verifica que XAMPP esté corriendo.";
      donResult.style.color = "var(--primary)";
    }
  });
}

// ── Slider "Mascota destacada" (índice) ──────────────────────
const pets = [
  { name: "Luna",     meta: "Perra joven • Cancún",           desc: "Tranquila, curiosa y lista para un hogar.",  img: "imagenes/bonie.jpeg"    },
  { name: "Patotas",  meta: "Perro adulto • Mérida",          desc: "Leal, juguetón, energía para paseos largos.",img: "imagenes/LicPatas.jpeg" },
  { name: "Nala",     meta: "Perra joven • Playa del Carmen", desc: "Cariñosa, sociable y responsable.",          img: "imagenes/canela.jpeg"   },
  { name: "Michi",    meta: "Gato cachorro • Cancún",         desc: "Pequeño pero con mucha actitud.",            img: "imagenes/michi.jpeg"    }
];

let idx = 0;
const imgEl   = document.getElementById("spotlightImg");
const nameEl  = document.getElementById("spotlightName");
const metaEl  = document.getElementById("spotlightMeta");
const descEl  = document.getElementById("spotlightDesc");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsEl  = document.getElementById("dots");

function renderDots() {
  if (!dotsEl) return;
  dotsEl.innerHTML = "";
  pets.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === idx ? " is-active" : "");
    d.setAttribute("aria-label", `Ir a mascota ${i + 1}`);
    d.addEventListener("click", () => { idx = i; renderPet(); });
    dotsEl.appendChild(d);
  });
}

function renderPet() {
  const p = pets[idx];
  if (imgEl)  imgEl.src          = p.img;
  if (nameEl) nameEl.textContent = p.name;
  if (metaEl) metaEl.textContent = p.meta;
  if (descEl) descEl.textContent = p.desc;
  renderDots();
}

if (prevBtn) prevBtn.addEventListener("click", () => { idx = (idx - 1 + pets.length) % pets.length; renderPet(); });
if (nextBtn) nextBtn.addEventListener("click", () => { idx = (idx + 1) % pets.length; renderPet(); });

renderPet();
