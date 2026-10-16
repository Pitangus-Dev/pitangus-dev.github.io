---
title: 'Pitangus 0.15.0: activa o desactiva cada motor de análisis desde el panel'
description: 'Pitangus 0.15.0 deja que los administradores activen o desactiven cada motor de análisis en Ajustes, con confirmación, historial de cambios e imágenes de motor preparadas por el worker. Publicada el 16 de octubre de 2026.'
lang: es
translationKey: release-0-15-0
category: news
tags: ['versión', 'motores', 'ajustes']
published: 2026-10-16
draft: false
---

Pitangus 0.15.0 se publicó el 16 de octubre de 2026. Cada motor de análisis se puede activar o desactivar ahora desde el panel, y el worker se encarga de tener sus imágenes listas.

## Motores de análisis, desde Ajustes

Los administradores encuentran los interruptores en **Ajustes → Motores de análisis**: Opengrep, Trivy, OSV-Scanner, Betterleaks, Checkov, zizmor, Grype, httpx, testssl.sh, nuclei, katana y el análisis web completo. Los valores por defecto no cambian: todos están activados salvo Checkov, Grype y el análisis web completo.

- **Agrupados por lo que revisan.** Código y dependencias, secretos, infraestructura y CI, imágenes y web. Cada motor dice qué aporta y si sus imágenes están en el servidor.
- **Desactivar uno pide confirmación.** El aviso explica qué se queda sin revisar. Si un tipo de revisión se queda sin ningún motor (todos los de secretos apagados, por ejemplo), el panel lo advierte y cada análisis lo dice.
- **Historial de cambios.** Cada cambio queda guardado con quién lo hizo y cuándo, y además se registra en el log.
- **Manda el entorno del servidor.** `PITANGUS_<MOTOR>_ENABLED`, definida en la API y en el worker, fija el interruptor y nombra la variable. `PITANGUS_CHECKOV_ENABLED`, `PITANGUS_GRYPE_ENABLED` y `PITANGUS_DAST_ENABLED` siguen funcionando como antes; si no la defines, decide el panel.

## Un motor que no se ejecutó lo dice

Desactivar un motor no esconde nada. Su paso en cada análisis dice **no ejecutado (desactivado)** e indica dónde volver a activarlo, y lo que había encontrado sigue abierto: nada de lo que halló se da por remediado.

## Imágenes de motor, preparadas aparte

Un análisis que ejecuta el servidor ya no descarga una imagen que falte a mitad de camino. El worker descarga, por digest, las imágenes de cada motor activado que no las tenga: cada 5 minutos y de inmediato al activar un motor, en un carril propio para que la cola de análisis siga avanzando. **Preparar motor** reintenta a mano.

Mientras una imagen no está lista, el motor se declara no ejecutado (en preparación) y nada de lo que encontró antes se da por remediado; el siguiente análisis ya lo ejecuta. Los análisis puntuales (`pitangus scan`, la GitHub Action y el hook de pre-commit) siguen descargando una imagen que falte al arrancar.

La Action y el hook de pre-commit apuntan ahora a la imagen 0.15 del worker.

## Actualizar

Haz una copia de seguridad antes de actualizar. No hay migraciones de base de datos: los interruptores se guardan como ajustes en la base existente, y se crean cuando un administrador cambia uno por primera vez.

```bash
make backup
git fetch --tags && git checkout v0.15.0 && make update
```

La lista completa de cambios está en el [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
