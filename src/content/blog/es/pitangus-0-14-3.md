---
title: 'Pitangus 0.14.3: MITRE ATT&CK completo en los modelos de amenazas, etiquetas movibles y lockfiles corregidos'
description: 'Pitangus 0.14.3 trae todo el catálogo MITRE ATT&CK Enterprise a los modelos de amenazas, deja mover las etiquetas de los flujos en el diagrama y deja de dar por sin uso las dependencias de los lockfiles generados. Publicada el 16 de octubre de 2026.'
lang: es
translationKey: release-0-14-3
category: news
tags: ['versión', 'modelado-de-amenazas', 'dependencias']
published: 2026-10-16
draft: false
---

Pitangus 0.14.3 se publicó el 16 de octubre de 2026. Trae dos cambios en los modelos de amenazas y una corrección en la revisión de dependencias sin uso.

## El catálogo completo de MITRE ATT&CK en los modelos de amenazas

La lista de técnicas hecha a mano desaparece. Los modelos de amenazas usan ahora MITRE ATT&CK Enterprise v19.2, fijado por SHA-256: 697 técnicas vigentes (222 técnicas y 475 subtécnicas) con sus plataformas.

- **Mapear una técnica** abre el catálogo entero, filtrable por táctica y con búsqueda por ID o por nombre, en inglés o en español. El total y el origen quedan a la vista.
- **Las sugerencias salen de la plataforma del componente y dicen por qué.** Una tabla documentada relaciona cada tipo de componente con plataformas y tácticas de MITRE. Un componente expuesto a internet suma además Acceso inicial, y los contenedores suman la plataforma Containers. El selector agrupa las sugerencias bajo el componente, con las plataformas y tácticas que las justifican, y el panel de sugerencias muestra cada técnica una sola vez, con los componentes a los que aplica y un botón para añadirla a todos a la vez. Los actores y los tipos personalizados no reciben sugerencias, y el panel lo dice.
- **El nombre en español, debajo del de MITRE.** Cada técnica y cada táctica muestra el nombre oficial en inglés de MITRE y su traducción al español justo debajo, en el panel y en los informes.

## Etiquetas de flujo movibles en el diagrama

La etiqueta de un flujo ya no tiene que quedarse donde la deja el trazado automático. Arrástrala con el puntero o muévela con el teclado (flechas, Mayús para pasos grandes, Escape para cancelar). Doble clic, **Recolocar etiqueta** u **Ordenar** la devuelven a su sitio.

La posición se guarda relativa al centro de la curva del flujo, así que la etiqueta acompaña a su línea cuando mueves los nodos, y una línea fina las une si está lejos. El panel, el SVG, el PDF y el Markdown la colocan igual. También viaja en el JSON portable; Threat Dragon y pytm la ignoran, y un valor inválido o fuera de rango se descarta con un aviso.

## Dependencias sin uso: un lockfile no prueba que algo se use

La revisión de pull requests daba por sin uso los paquetes transitivos de los `requirements.txt` generados: 79 en el propio repositorio de Pitangus, ahora 0.

- Un `requirements*.txt` cuenta como lockfile si lleva comentarios `# via`, si todas sus entradas tienen hash o si su cabecera dice que lo hizo pip-compile, uv, pdm o poetry. Si hay un `.in` al lado, las dependencias declaradas se leen de ahí.
- Los lockfiles de npm, pnpm, yarn, bun, Poetry, uv, pdm y Pipenv ya no cuentan como prueba de que un paquete se usa. En los proyectos con pnpm, antes todas las dependencias parecían usadas.
- Una dependencia directa que de verdad no se usa se sigue reportando, en su propia línea.

## Actualizar

Haz una copia de seguridad antes de actualizar. No hay migraciones de datos nuevas.

```bash
make backup
git fetch --tags && git checkout v0.14.3 && make update
```

La lista completa de cambios está en el [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
