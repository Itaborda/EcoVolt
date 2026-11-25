/**
 * Interfaz del simulador (lee el formulario y pinta resultados).
 * Requiere data.js y calculator.js cargados antes.
 */
const el = (id) => document.getElementById(id);

const CAMPOS = ["tipo", "municipio", "estrato", "consumo", "precioPanel", "aniosAhorro"];
const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

let grafico = null;

/* ---------- Selects ---------- */

function agregarOpcion(select, valor, texto) {
  const option = document.createElement("option");
  option.value = valor;
  option.textContent = texto;
  select.appendChild(option);
}

function llenarTipos() {
  const select = el("tipo");
  for (const [clave, panel] of Object.entries(EFICIENCIA_PANEL)) {
    agregarOpcion(select, clave, `${panel.nombre} (${panel.porcentaje}%)`);
  }
}

function llenarMunicipios() {
  const select = el("municipio");
  for (const [clave, municipio] of Object.entries(MUNICIPIOS)) {
    const tarifaEstrato1 = municipio.estratos[1].tarifa;
    agregarOpcion(select, clave, `${municipio.nombre} (${tarifaEstrato1} COP/kWh)`);
  }
}

function llenarEstratos() {
  const select = el("estrato");
  select.innerHTML = '<option value="">Selecciona tu estrato</option>';

  const municipio = MUNICIPIOS[el("municipio").value];
  if (!municipio) return;

  for (const [estrato, datos] of Object.entries(municipio.estratos)) {
    agregarOpcion(select, estrato, `Estrato ${estrato} (${datos.tarifa} COP/kWh)`);
  }
}

/** Sugiere el consumo promedio del estrato como placeholder. */
function sugerirConsumo() {
  const municipio = MUNICIPIOS[el("municipio").value];
  const datos = municipio ? municipio.estratos[el("estrato").value] : null;
  el("consumo").placeholder = datos ? `Ej: ${datos.consumoPromedio}` : "Ej: 150";
}

/* ---------- Precio con puntos de miles ---------- */

function formatearPrecioMientrasEscribe(evento) {
  const soloNumeros = evento.target.value.replace(/[^\d]/g, "");
  evento.target.value = soloNumeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ---------- Lectura y errores ---------- */

function leerEntradas() {
  return {
    municipio: el("municipio").value,
    estrato: parseInt(el("estrato").value, 10),
    tipoPanel: el("tipo").value,
    consumo: parseFloat(el("consumo").value),
    precioPanel: parseFloat(el("precioPanel").value.replace(/\./g, "")),
    anios: parseInt(el("aniosAhorro").value, 10),
  };
}

function limpiarErrores() {
  for (const id of CAMPOS) {
    el(id).removeAttribute("aria-invalid");
  }
  const caja = el("mensajeError");
  caja.hidden = true;
  caja.replaceChildren();
}

function mostrarErrores(errores) {
  limpiarErrores();

  const lista = document.createElement("ul");
  for (const error of errores) {
    const item = document.createElement("li");
    item.textContent = error.mensaje;
    lista.appendChild(item);
    el(error.campo).setAttribute("aria-invalid", "true");
  }

  const caja = el("mensajeError");
  caja.appendChild(lista);
  caja.hidden = false;

  el("results").hidden = true;
  el("ahorroNetoContainer").hidden = true;
  el("chartContainer").hidden = true;
  el("estadoVacio").hidden = false;
  el(errores[0].campo).focus();
}

/* ---------- Resultados ---------- */

function claseSegunSigno(valor) {
  return "result-value " + (valor > 0 ? "savings-positive" : "savings-negative");
}

function mostrarResultados(r, anios) {
  el("pagoActual").textContent = formatoCOP.format(r.pagoActual);
  el("pagoConPanel").textContent = formatoCOP.format(r.pagoConPanel);
  el("energiaGenerada").textContent = r.energiaMensual.toFixed(1) + " kWh";

  el("ahorroMensual").textContent = formatoCOP.format(r.ahorroMensual);
  el("ahorroMensual").className = claseSegunSigno(r.ahorroMensual);

  el("ahorroAnual").textContent = formatoCOP.format(r.ahorroAnual);
  el("ahorroAnual").className = claseSegunSigno(r.ahorroAnual);

  el("porcentajeAhorro").textContent = r.porcentajeAhorro.toFixed(1) + "%";
  el("porcentajeAhorro").className = claseSegunSigno(r.porcentajeAhorro);

  el("aniosElegidos").textContent = anios;
  el("ahorroNeto").textContent = formatoCOP.format(r.ahorroNeto);
  el("ahorroNeto").className = claseSegunSigno(r.ahorroNeto);

  el("estadoVacio").hidden = true;
  el("results").hidden = false;
  el("ahorroNetoContainer").hidden = false;
  el("chartContainer").hidden = false;
}

function crearGrafico(costoActual, ahorro) {
  if (typeof Chart === "undefined") {
    el("chartContainer").hidden = true; // Chart.js no cargó (sin internet)
    return;
  }

  const ctx = el("ahorroChart").getContext("2d");
  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Sin Paneles Solares", "Con Paneles Solares"],
      datasets: [
        {
          label: "Pago mensual (COP)",
          data: [costoActual, costoActual - ahorro],
          backgroundColor: ["rgb(93, 130, 179)", "rgb(231, 243, 255)"],
          borderColor: ["rgb(93, 130, 179)", "rgb(231, 243, 255)"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Comparativa de Costos",
          font: { size: 16, weight: "bold" },
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Pago mensual (COP)" },
        },
      },
    },
  });
}

/* ---------- Acción principal ---------- */

function calcular() {
  const entradas = leerEntradas();
  const errores = validarEntradas(entradas);

  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }
  limpiarErrores();

  const municipio = MUNICIPIOS[entradas.municipio];
  const datos = municipio.estratos[entradas.estrato];

  const resultado = calcularSimulacion({
    horasSol: municipio.horasSol,
    eficiencia: EFICIENCIA_PANEL[entradas.tipoPanel].porcentaje / 100,
    tarifa: datos.tarifa,
    consumo: entradas.consumo,
    precioPanel: entradas.precioPanel,
    anios: entradas.anios,
  });

  mostrarResultados(resultado, entradas.anios);
  crearGrafico(resultado.pagoActual, resultado.ahorroMensual);
}

/* ---------- Inicio ---------- */

llenarTipos();
llenarMunicipios();
el("municipio").addEventListener("change", () => {
  llenarEstratos();
  sugerirConsumo();
});
el("estrato").addEventListener("change", sugerirConsumo);
el("precioPanel").addEventListener("input", formatearPrecioMientrasEscribe);
el("btnCalcular").addEventListener("click", calcular);
