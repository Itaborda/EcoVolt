/**
 * Lógica del simulador (sin tocar el DOM, así se puede probar sola).
 * Requiere data.js cargado antes.
 */
const DIAS_POR_MES = 30;

/**
 * Valida las entradas. Devuelve una lista de { campo, mensaje };
 * si la lista está vacía, todo está correcto.
 */
function validarEntradas({ municipio, estrato, tipoPanel, consumo, precioPanel, anios }) {
  const errores = [];

  if (!EFICIENCIA_PANEL[tipoPanel]) {
    errores.push({ campo: "tipo", mensaje: "Selecciona el tipo de panel." });
  }

  if (!MUNICIPIOS[municipio]) {
    errores.push({ campo: "municipio", mensaje: "Selecciona el municipio." });
  } else if (!MUNICIPIOS[municipio].estratos[estrato]) {
    errores.push({ campo: "estrato", mensaje: "Selecciona tu estrato." });
  }

  if (!Number.isFinite(consumo) || consumo <= 0) {
    errores.push({ campo: "consumo", mensaje: "Ingresa un consumo mensual mayor que 0." });
  }

  if (!Number.isFinite(precioPanel) || precioPanel < 0) {
    errores.push({ campo: "precioPanel", mensaje: "Ingresa el precio del panel (puede ser 0)." });
  }

  if (!Number.isInteger(anios) || anios < 1) {
    errores.push({ campo: "aniosAhorro", mensaje: "Los años de uso deben ser 1 o más." });
  }

  return errores;
}

/**
 * Misma fórmula de siempre:
 *   energía mensual = horas_sol × eficiencia × 30
 *   ahorro mensual  = min(energía × tarifa, consumo × tarifa)
 */
function calcularSimulacion({ horasSol, eficiencia, tarifa, consumo, precioPanel, anios }) {
  const energiaMensual = horasSol * eficiencia * DIAS_POR_MES;
  const pagoActual = consumo * tarifa;
  const valorEnergiaGenerada = energiaMensual * tarifa;

  const ahorroMensual = Math.min(valorEnergiaGenerada, pagoActual);
  const ahorroAnual = ahorroMensual * 12;

  return {
    energiaMensual,
    pagoActual,
    pagoConPanel: pagoActual - ahorroMensual,
    ahorroMensual,
    ahorroAnual,
    porcentajeAhorro: (ahorroMensual / pagoActual) * 100,
    ahorroNeto: ahorroAnual * anios - precioPanel,
  };
}
