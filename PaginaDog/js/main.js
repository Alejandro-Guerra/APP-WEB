const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
        const isOpen = mobileMenu.style.display === "block";
        mobileMenu.style.display = isOpen ? "none" : "block";
        burgerBtn.setAttribute("aria-expanded", String(!isOpen));
    });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const filtersForm = document.getElementById("filtersForm");
const filtersResult = document.getElementById("filtersResult");

if (filtersForm && filtersResult) {
    filtersForm.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const tipo = document.getElementById("tipo").value;
        const tamano = document.getElementById("tamano").value;
        const sexo = document.getElementById("sexo").value;
        const ubicacion = document.getElementById("ubicacion").value;
        const edad = document.getElementById("edad").value;

        filtersResult.textContent =
            `Filtro aplicado: ${tipo} • ${tamano} • ${sexo} • ${ubicacion} • ${edad}. ` +
            `(En "Adopta" verás la galería con resultados.)`;
    });
}

const pets = [
    {
        name: "Luna",
        meta: "Gata joven • Cancún",
        desc: "Tranquila, curiosa y experta en ronroneos terapéuticos.",
        img: "assets/img/placeholder-pet-1.jpg"
    },
    {
        name: "Patotas",
        meta: "Perro Joven • Mérida",
        desc: "Leal, juguetón y con energía para paseos largos.",
        img: "imagenes/LicPatas.jpeg"
    },
    {
        name: "Nala",
        meta: "Perra joven • Playa del Carmen",
        desc: "Cariñosa, sociable y lista para una familia responsable.",
        img: "assets/img/placeholder-pet-3.jpg"
    },
    {
        name: "Nalo",
        meta: "Perra joven • Playa del Carmen",
        desc: "Cariñosa, sociable y lista para una familia responsable.",
        img: "assets/img/placeholder-pet-3.jpg"
    }
];
const adoptGrid = document.getElementById("adoptGrid");

if (adoptGrid) {
  const adoptPets = [
    {
      name: "Luna",
      type: "Gato",
      status: "Disponible",
      meta: "Joven • Cancún",
      desc: "Tranquila y curiosa.",
      img: "../imagenes/Luna.jpeg"
    },
    {
      name: "Patotas",
      type: "Perro",
      status: "Disponible",
      meta: "Adulto • Mérida",
      desc: "Leal y juguetón.",
      img: "../imagenes/LicPatas.jpeg" 
    },
    {
      name: "Nala",
      type: "Perro",
      status: "Adoptado",
      meta: "Joven • Playa del Carmen",
      desc: "Ya encontró hogar 💜",
      img: "../imagenes/Nala.jpeg"
    },
    {
      name: "Michi",
      type: "Gato",
      status: "Disponible",
      meta: "Cachorro • Cancún",
      desc: "Pequeño pero con actitud.",
      img: "../imagenes/Michi.jpeg"
    },
    {
      name: "Toby",
      type: "Perro",
      status: "Adoptado",
      meta: "Adulto • Cancún",
      desc: "Misión cumplida 🏠",
      img: "../imagenes/Toby.jpeg"
    },
    {
      name: "Canela",
      type: "Gato",
      status: "Disponible",
      meta: "Joven • Mérida",
      desc: "Dulce y sociable.",
      img: "../imagenes/Canela.jpeg"
    }
  ];

  const form = document.getElementById("adoptFilters");
  const fTipo = document.getElementById("fTipo");
  const fEstado = document.getElementById("fEstado");
  const fBuscar = document.getElementById("fBuscar");
  const resetBtn = document.getElementById("resetBtn");
  const countResult = document.getElementById("countResult");

  function cardTemplate(pet) {
    const adopted = pet.status === "Adoptado";
    return `
      <article class="petCard ${adopted ? "is-adopted" : ""}">
        <div class="petCard__imgWrap">
          <img src="${pet.img}" alt="${pet.name}">
          <span class="badge badge--type">${pet.type}</span>
          <span class="badge ${adopted ? "badge--adopted" : "badge--status"}">
            ${adopted ? "ADOPTADO" : "DISPONIBLE"}
          </span>
        </div>

        <div class="petCard__body">
          <h3 class="petCard__name">${pet.name}</h3>
          <p class="petCard__meta">${pet.meta}</p>
          <p class="petCard__desc">${pet.desc}</p>

          <div class="petCard__actions">
            <a class="btn btn--secondary" href="donaciones.html">Apoyar</a>
            <a class="btn btn--primary" href="donaciones.html">Adoptar</a>
          </div>
        </div>
      </article>
    `;
  }

  function render(list) {
    adoptGrid.innerHTML = list.map(cardTemplate).join("");
    if (countResult) countResult.textContent = `Mostrando ${list.length} mascota(s).`;
  }

  function applyFilters() {
    const tipo = fTipo?.value ?? "Todos";
    const estado = fEstado?.value ?? "Todos";
    const buscar = (fBuscar?.value ?? "").trim().toLowerCase();

    const filtered = adoptPets.filter(p => {
      const okTipo = (tipo === "Todos") || (p.type === tipo);
      const okEstado = (estado === "Todos") || (p.status === estado);
      const okBuscar = !buscar || p.name.toLowerCase().includes(buscar);
      return okTipo && okEstado && okBuscar;
    });

    render(filtered);
  }

  render(adoptPets);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      fTipo.value = "Todos";
      fEstado.value = "Todos";
      fBuscar.value = "";
      render(adoptPets);
    });
  }
}


let idx = 0;

const imgEl = document.getElementById("spotlightImg");
const nameEl = document.getElementById("spotlightName");
const metaEl = document.getElementById("spotlightMeta");
const descEl = document.getElementById("spotlightDesc");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsEl = document.getElementById("dots");

function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = "";
    pets.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "dot" + (i === idx ? " is-active" : "");
        d.setAttribute("aria-label", `Ir a mascota ${i + 1}`);
        d.addEventListener("click", () => {
            idx = i;
            renderPet();
        });
        dotsEl.appendChild(d);
    });
}

function renderPet() {
    const p = pets[idx];
    if (imgEl) imgEl.src = p.img;
    if (nameEl) nameEl.textContent = p.name;
    if (metaEl) metaEl.textContent = p.meta;
    if (descEl) descEl.textContent = p.desc;
    renderDots();
}

if (prevBtn) prevBtn.addEventListener("click", () => {
    idx = (idx - 1 + pets.length) % pets.length;
    renderPet();
});

if (nextBtn) nextBtn.addEventListener("click", () => {
    idx = (idx + 1) % pets.length;
    renderPet();
});
const donForm = document.getElementById("donForm");

if (donForm) {
  const donNombre = document.getElementById("donNombre");
  const donCorreo = document.getElementById("donCorreo");
  const donMonto = document.getElementById("donMonto");
  const donTipo = document.getElementById("donTipo");
  const donMetodo = document.getElementById("donMetodo");
  const donResult = document.getElementById("donResult");

  donForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = (donNombre.value || "").trim();
    const correo = (donCorreo.value || "").trim();
    const monto = Number(donMonto.value);
    const tipo = donTipo.value;
    const metodo = donMetodo.value;

    if (!nombre || nombre.length < 3) {
      donResult.textContent = "Escribe tu nombre completo (mínimo 3 letras).";
      return;
    }
    if (!correo.includes("@") || !correo.includes(".")) {
      donResult.textContent = "Escribe un correo válido.";
      return;
    }
    if (!monto || monto < 10) {
      donResult.textContent = "El monto mínimo es $10 MXN (demo).";
      return;
    }
    if (!tipo) {
      donResult.textContent = "Selecciona el tipo de donación.";
      return;
    }
    if (!metodo) {
      donResult.textContent = "Selecciona un método.";
      return;
    }

    donResult.textContent =
      `¡Gracias, ${nombre}! Donación registrada (demo): $${monto} MXN • ${tipo} • ${metodo}. 💜`;

    donForm.reset();
  });
}

renderPet();
