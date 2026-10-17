---
title: 'Pitangus 0.15.1: versiones firmadas que puedes verificar y la Action en el Marketplace'
description: 'Pitangus 0.15.1 adjunta SBOM, procedencia SLSA y un manifiesto firmado con cosign a cada versión, suma OpenSSF Scorecard y CodeQL, y lleva la GitHub Action al Marketplace como Pitangus Security Scan. Publicada el 17 de octubre de 2026.'
lang: es
translationKey: release-0-15-1
category: news
tags: ['versión', 'seguridad', 'cadena-de-suministro']
published: 2026-10-17
draft: false
---

Pitangus 0.15.1 se publicó el 17 de octubre de 2026. Trata de confianza: lo que instalas ahora se puede comprobar, y el proyecto enseña su propio trabajo de seguridad a la vista de todos.

## Archivos firmados en cada versión

Cada release de GitHub lleva ahora el SBOM SPDX de cada imagen y plataforma, su procedencia SLSA y un manifiesto con los digests de las imágenes firmado con cosign, sin clave y con la misma identidad que las imágenes. Se adjuntan después de construir, firmar y verificar las imágenes, así que una release sin ellos es una que no pasó.

Antes de instalar puedes comprobar que las imágenes son las que el proyecto construyó, a partir del commit que esperas. Los comandos están en la página [Cadena de suministro](https://docs.pitangus.dev/es/supply-chain/), que también recoge qué está fijado por digest o por commit.

## El proyecto, revisado a la vista

- **OpenSSF Scorecard** se ejecuta en cada push a `main`, cada semana y cuando cambia la protección de rama. Solo lee el repositorio, y su insignia está en el README.
- **OpenSSF Best Practices**: el proyecto tiene ya la insignia *passing*.
- **CodeQL** analiza el Python, el TypeScript del panel y del sitio de documentación, y los workflows, en cada pull request y cada semana, con resultados en code scanning. Es una segunda opinión junto a Pitangus analizándose a sí mismo.
- **Una política de seguridad completa**: dónde reportar en privado, qué incluir, plazos de respuesta, divulgación coordinada, versiones con soporte y alcance.

## La Action ya está en el GitHub Marketplace

La GitHub Action figura ahora como [Pitangus Security Scan](https://github.com/marketplace/actions/pitangus-security-scan), de Arodium. Tus workflows no cambian: siguen con `uses: Pitangus-Dev/pitangus@<versión>`, y fijar el commit sigue siendo la mejor costumbre.

## Las preguntas, a Discussions

GitHub Discussions está abierto. Las preguntas y las ideas tienen allí su sitio, y el selector de issues apunta a él en lugar de abrir issues en blanco.

## Una demo de solo lectura, lista para desplegar

Con `PITANGUS_PUBLIC_DEMO=1`, una instalación se convierte en una demo que cualquiera puede abrir con credenciales publicadas, sobre una organización inventada. Lo impone el servidor: todo lo que no sea leer, iniciar o cerrar sesión y descargar los PDF de evidencia responde 403, no corre nada en segundo plano y no sale ninguna conexión de la API. La carpeta [deploy/demo](https://github.com/Pitangus-Dev/pitangus/blob/v0.15.1/deploy/demo/README.es.md) la levanta en cualquier VPS. En una instalación normal, déjala sin definir.

## Tres arreglos que encontraron las pruebas de propiedades

El panel tiene ahora pruebas de propiedades que revisan miles de casos generados. Encontraron tres cosas, ya arregladas:

- La vista previa del enrutado a Jira podía discrepar del servidor en algunos patrones (`[]a]`, `[a-cz-a]`, un emoji bajo `?`) y mostrar una regla distinta de la que se aplicaba.
- Un patrón lleno de asteriscos podía congelar esa vista previa. Ahora responde al instante.
- Un enlace a Hallazgos con un nombre de organización largo podía partir un emoji y hacer fallar la petición. El nombre se corta ahora por caracteres.

Además, un enlace de aviso mal formado ya no rompe el detalle de un hallazgo: se muestra como texto.

## Actualizar

Haz una copia de seguridad antes de actualizar. No hay migraciones de base de datos.

```bash
make backup
git fetch --tags && git checkout v0.15.1 && make update
```

La lista completa de cambios está en el [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
