/**
 * Datos del simulador (única fuente de verdad).
 *
 * MUNICIPIOS[clave]:
 *   nombre   -> texto que se muestra en el select
 *   horasSol -> horas de sol por día
 *   estratos[n]:
 *     tarifa          -> COP por kWh
 *     consumoPromedio -> kWh por mes (solo se usa como sugerencia)
 */
const MUNICIPIOS = {
  valledupar: {
    nombre: "Valledupar",
    horasSol: 12.4,
    estratos: {
      1: { tarifa: 380, consumoPromedio: 100 },
      2: { tarifa: 475, consumoPromedio: 130 },
      3: { tarifa: 949, consumoPromedio: 160 },
    },
  },
  "santa marta": {
    nombre: "Santa Marta",
    horasSol: 11.3,
    estratos: {
      1: { tarifa: 390, consumoPromedio: 100 },
      2: { tarifa: 490, consumoPromedio: 130 },
      3: { tarifa: 960, consumoPromedio: 160 },
    },
  },
  cartagena: {
    nombre: "Cartagena",
    horasSol: 11.45,
    estratos: {
      1: { tarifa: 410, consumoPromedio: 100 },
      2: { tarifa: 505, consumoPromedio: 130 },
      3: { tarifa: 995, consumoPromedio: 160 },
    },
  },
  sincelejo: {
    nombre: "Sincelejo",
    horasSol: 11,
    estratos: {
      1: { tarifa: 370, consumoPromedio: 100 },
      2: { tarifa: 465, consumoPromedio: 130 },
      3: { tarifa: 930, consumoPromedio: 160 },
    },
  },
  barranquilla: {
    nombre: "Barranquilla",
    horasSol: 12.36,
    estratos: {
      1: { tarifa: 400, consumoPromedio: 100 },
      2: { tarifa: 500, consumoPromedio: 130 },
      3: { tarifa: 980, consumoPromedio: 160 },
    },
  },
};

/** Eficiencia típica de conversión por tipo de panel (en %). */
const EFICIENCIA_PANEL = {
  mono: { nombre: "Monocristalino", porcentaje: 22 },
  poli: { nombre: "Policristalino", porcentaje: 18 },
  delgada: { nombre: "Película delgada", porcentaje: 12 },
};
