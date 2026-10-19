# IncubationLab

Experiencia educativa interactiva para explorar el desarrollo embrionario de un huevo de gallina durante una incubación orientativa de 21 días. Toda la aplicación funciona en el navegador; no controla una incubadora ni necesita backend.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Experiencia

- La línea de tiempo permite seleccionar cualquiera de los 21 días, avanzar o retroceder y reproducir o pausar el recorrido.
- La ficha científica presenta para cada día una etapa, una descripción prudente, cambios, estructuras de interés y una curiosidad.
- El visor 3D permite rotar y acercar el modelo; también incluye una vista seccionada, controles para mostrar u ocultar capas, selección educativa de estructuras, restablecimiento de la vista y un modo de ovoscopia simulado.

## Estructura

- `app/components/IncubationPage.tsx`: estado compartido y composición de la experiencia.
- `app/components/EggViewer.tsx`: controles de cámara y capas de la escena de React Three Fiber, cargada solo en el cliente.
- `app/components/EggAnatomy.tsx`: cáscara de pared doble, membranas, clara translúcida, yema opaca, saco vitelino, vasos ramificados sobre la yema, chalazas y cámara de aire.
- `app/components/OrganicEmbryo.tsx`: malla corporal axial continua con cabeza y cuello perfilados en la misma superficie; ojos, pico, alas y extremidades generados de forma procedimental.
- `app/components/IncubationTimeline.tsx`: selección y reproducción de los días.
- `app/components/DevelopmentPanel.tsx`: ficha científica del día activo.
- `app/components/OvoscopyMode.tsx`: control y aviso del modo de ovoscopia.
- `app/data/development.ts`: contenido educativo de los 21 días.
- `app/data/laboratory.ts`: comparación funcional de parámetros con la referencia de incubación citada.
- `app/data/quiz.ts`: cuestionario formativo y explicaciones.
- `app/components/SiteNavigation.tsx`: navegación a las secciones educativas.

## Secciones educativas

La navegación incluye:

- **Comparador:** contraste textual entre dos fichas diarias.
- **Explorador anatómico:** selección de estructuras mencionadas en la ficha del día; la selección no resalta una malla 3D.
- **Laboratorio:** escenario local que compara algunos parámetros con una guía publicada. No controla equipos ni predice viabilidad o eclosión.
- **Cuestionario:** ocho preguntas formativas con retroalimentación y fuentes.
- **Metodología, glosario y Acerca de:** fuentes, límites de la información, definiciones y datos del proyecto pendientes de completar.

## Pruebas

```bash
npm test
npm run lint
npm exec tsc -- --noEmit
npm run build
```

Las pruebas automatizadas usan el ejecutor y el soporte de eliminación de tipos integrado en Node.js (se ha comprobado con Node 24). No se añadió una dependencia de pruebas.

## Alcance del modelo

No hay modelos GLB/glTF ni escaneos anatómicos locales. El huevo usa una superficie paramétrica ovoide con superficies interior y exterior y un borde de corte con espesor. El embrión usa una malla axial curvada continua cuyo perfil integra el tronco, el cuello y la región cefálica; ojos y pico se anclan a esa silueta, y las alas y patas son mallas barridas de sección variable, no cilindros. Los dedos aparecen de forma progresiva en etapas posteriores. Sus proporciones, postura plegada y plumón cambian mediante perfiles interpolados para seis intervalos (1–3, 4–7, 8–10, 11–14, 15–18 y 19–21). La red vascular se distribuye sobre la superficie elipsoidal de la yema, con ramas conectadas y grosores variables; la yema se reduce progresivamente y la clara conserva una transparencia tenue. Las membranas, el saco vitelino y la cámara de aire también cambian o aparecen de forma progresiva. Los controles permiten ocultar capas y seleccionar una estructura para consultar su función.

Los intervalos y rasgos son orientativos: ofrecen una guía didáctica, no una correspondencia exacta entre cada día de incubación y un estadio. La estadificación embrionaria estándar se basa en rasgos morfológicos y puede no coincidir exactamente con un día de incubación. Como referencia se consultaron la [serie de estadios de Hamburger y Hamilton](https://doi.org/10.1002/jmor.1050880104) y el resumen de [desarrollo del pollo de UNSW Embryology](https://embryology.med.unsw.edu.au/embryology/index.php/Chicken_Development). El modelo no es una reconstrucción anatómica validada: la forma superficial, los detalles de órganos, los vasos y las membranas están simplificados, y no representa histología ni tejidos escaneados. La ovoscopia es una simulación visual que no permite diagnosticar viabilidad. El día 21 es una referencia y el ritmo real varía con las condiciones de incubación.

El laboratorio utiliza como referencia de manejo la guía [Hatching Quality Chicks](https://extension.msstate.edu/publications/hatching-quality-chicks) de Mississippi State University Extension. Las lecturas de bulbo húmedo indicadas en dicha fuente dependen de las condiciones de medición; el simulador no las convierte de forma general en humedad relativa ni sustituye las instrucciones del fabricante. La guía cita temperaturas distintas para incubadoras de aire forzado y de aire quieto, y pautas de volteo y humedad para periodos de incubación concretos. Consulta la [sección de metodología](./app/metodologia/page.tsx) para los límites de interpretación.

## Presentación y evidencias

Antes de presentar el proyecto, completa en la sección «Acerca de» la autoría/equipo, institución, asignatura y fecha reales; añade una revisión experta únicamente si se ha realizado. No se atribuye aquí una validación científica que no consta.

Guion sugerido para una demostración breve:

1. Cambia entre varios días en la línea de tiempo y explica que las etapas diarias son orientativas.
2. Activa la sección del huevo, las capas y la ovoscopia simulada; recuerda que el modelo es procedural y no diagnóstico.
3. Compara dos días, consulta una estructura y modifica el escenario del laboratorio para observar cómo se compara con la fuente citada.
4. Resuelve una pregunta y termina mostrando metodología y fuentes.

Si se requiere evidencia, captura de forma manual las pantallas principales, una comparación entre dos días, un resultado del cuestionario y dos escenarios del laboratorio (dentro y fuera del intervalo citado). No se incluyen capturas ni resultados de evaluación de usuario en el repositorio.
