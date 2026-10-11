---
title: 'Pitangus 0.13.1: una organización de demo completa, documentación para quien empieza y arreglos del panel'
description: 'Pitangus 0.13.1, publicado el 11 de octubre de 2026, trae una organización de demo sin conexión (make demo FULL=1), documentación nueva con capturas y arreglos en el panel. Sin migraciones ni cambios incompatibles.'
lang: es
translationKey: release-0-13-1
category: news
tags: ['versión', 'demo', 'documentación']
published: 2026-10-11
draft: false
---

Pitangus 0.13.1 se publicó el 11 de octubre de 2026. Es una versión de mantenimiento de la 0.13: sin migraciones de base de datos, sin cambios incompatibles y sin imágenes de motores nuevas.

## Una organización de demo para recorrer sin conexión

`make demo FULL=1` crea Lapis Labs, una empresa inventada, para que cada vista del panel tenga algo que enseñar: cinco repositorios con un mes de análisis (tendencias, hallazgos corregidos, tiempo de corrección, plazos), una revisión de pull request, una imagen de contenedor, un dominio de demo verificado con su alcance, programación, usuario de prueba y dos análisis web pasivos, dos miembros y algunas decisiones de triage.

Funciona sin conexión a internet. Los hallazgos son salidas de los motores grabadas sobre los ejemplos incluidos, que pasan por los mismos parsers, el mismo registro y el mismo triage que un análisis real. Los dominios de demo usan nombres reservados para ejemplos (`example.com`, `example.net`) y Pitangus nunca los verifica ni los analiza: si lo intentas, la API responde `409`.

La demo escribe junto a los datos reales del espacio de trabajo y nada la borra, así que úsala en una instalación de prueba.

## Documentación para quien empieza

[docs.pitangus.dev](https://docs.pitangus.dev/es/) se reescribió para quien nunca ha usado Pitangus, en español e inglés: qué es, conceptos clave, glosario y preguntas frecuentes, cómo analizar código, imágenes y sitios web o APIs, hallazgos, cumplimiento, modelado de amenazas y cómo actualizar. Cada guía muestra el panel en claro y oscuro con capturas de la organización de demo, y la página de arquitectura tiene un diagrama al día.

## Arreglos del panel

- Las fechas del eje de las gráficas ya no se montan.
- El título de cada paso de Nuevo análisis sigue recibiendo el foco para los lectores de pantalla, sin dibujar un recuadro.
- Un enlace en la misma pestaña, como Nuevo análisis desde un dominio, deja elegidos el dominio y el tipo de análisis.
- La pista de OSV dice que, si lo activas, los nombres y versiones de los paquetes también van a deps.dev, y que Trivy y OSV-Scanner revisan las dependencias sin conexión de todos modos.

## Actualizar

```bash
git fetch --tags && git checkout v0.13.1 && make update
```

La lista completa de cambios está en el [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
