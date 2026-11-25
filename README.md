# ☀️ Energías del Futuro

Sitio web informativo sobre paneles solares con un **simulador de ahorro mensual** para cinco municipios de la Costa Caribe colombiana.

🌐 **Demo:** https://itaborda.github.io/EcoVolt/

## Funcionalidades

- Información sobre qué son los paneles solares, sus beneficios y precios estimados.
- Simulador: eliges tipo de panel, municipio, estrato, consumo mensual, precio del panel y años de uso.
- Resultados: pago actual vs. pago con panel, energía generada, ahorro mensual/anual y ahorro neto.
- Gráfico comparativo de costos (Chart.js).
- Responsive y accesible (navegación por teclado, lectores de pantalla, enlace "Saltar al contenido").

## Cómo se calcula

```
Energía mensual = Horas_sol × Eficiencia_panel × 30
Ahorro mensual  = mín(Energía × Tarifa, Consumo × Tarifa)
Ahorro neto     = Ahorro mensual × 12 × Años − Precio del panel
```

Las tarifas, estratos y horas de sol viven en `assets/scripts/data.js`.
Son **estimaciones con fines informativos**, no una cotización.

## Estructura del proyecto

```
EcoVolt/
├── index.html
├── README.md
├── .gitignore
├── .gitattributes
└── assets/
    ├── images/
    │   ├── logo.png
    │   └── hero-fallback.svg   # se usa si la foto externa del hero no carga
    ├── scripts/
    │   ├── data.js             # municipios, tarifas, eficiencia de paneles
    │   ├── calculator.js       # validación y fórmula (sin DOM)
    │   └── script.js           # formulario, resultados y gráfico
    └── styles/
        └── style.css           # paleta y estilos (variables CSS al inicio)
```

## Cómo ejecutarlo

No requiere instalación. Abre `index.html` en el navegador
(o usa la extensión *Live Server* de VS Code, o la vista previa de IntelliJ).

## Publicación en GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En *Build and deployment*, elige **Deploy from a branch**.
3. Rama **main**, carpeta **/ (root)**, y pulsa **Save**.
4. Tras uno o dos minutos el sitio queda en el enlace de la demo.

## Tecnologías

HTML5 · CSS3 · JavaScript (vanilla) · [Chart.js 3.9.1](https://www.chartjs.org/) por CDN · Fuente Inter (Google Fonts)

## Historial de etapas

Cada etapa tiene su commit y su tag (`etapa-1` … `etapa-5`).

| Etapa | Descripción |
|-------|-------------|
| 1 | Estructura del repositorio y código original |
| 2 | Corrección de errores (precio con separadores, gráfico, títulos) |
| 3 | Refactor del JavaScript: datos, lógica e interfaz separados |
| 4 | Mejora de diseño: paleta del logo, header, tarjetas, simulador |
| 5 | Accesibilidad, SEO, respaldo de imagen y publicación |
