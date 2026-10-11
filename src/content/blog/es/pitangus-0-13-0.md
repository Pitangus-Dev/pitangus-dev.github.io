---
title: 'Pitangus 0.13.0: análisis web pasivos de dominios verificados, usuarios de prueba y guía de OWASP'
description: 'Pitangus 0.13.0, publicado el 10 de octubre de 2026, trae DAST pasivo de los dominios y APIs que verificas (apagado por defecto), usuarios de prueba, alcance guardado, programación, guía de OWASP en cada hallazgo y paleta de comandos. Dos cambios incompatibles.'
lang: es
translationKey: release-0-13-0
category: news
tags: ['versión', 'DAST', 'OWASP']
published: 2026-10-10
draft: false
---

Pitangus 0.13.0 se publicó el 10 de octubre de 2026. Pitangus es una herramienta autoalojada y de código abierto (AGPL-3.0) de seguridad de aplicaciones para equipos pequeños: analiza código, dependencias, secretos, infraestructura como código e imágenes de contenedor con motores abiertos, y solo da algo por corregido cuando un análisis posterior lo demuestra.

Esta versión añade análisis web pasivos de los dominios y APIs que demuestras que controlas, enlaza cada hallazgo con la guía de OWASP que le aplica y le da al panel y a los informes una identidad visual propia. Trae dos cambios incompatibles; están al final, con los pasos para actualizar.

## Análisis web pasivos de dominios y APIs verificados

Los análisis web vienen **apagados**. Un servidor solo los corre con `PITANGUS_DAST_ENABLED=1` y las imágenes de los motores descargadas con `make engines`.

- **Solo en dominios que demuestras que controlas.** La prueba es un registro TXT en el DNS, un archivo en `/.well-known/pitangus-verify.txt` o una etiqueta `<meta name="pitangus-verify">` en la página de inicio. Solo la prueba por DNS cubre los subdominios. Se vuelve a comprobar cada día y antes de cada análisis.
- **Pasivos.** Las herramientas recorren el sitio como un visitante y leen las respuestas: sin inyecciones, sin fuzzing y sin enviar formularios, salvo el inicio de sesión de un usuario de prueba. En modo API solo se importan las operaciones GET y HEAD de una definición OpenAPI 3.x o Swagger 2.0.
- **Las herramientas**, cada una fijada por versión y digest: ZAP 2.17 con sus reglas pasivas y un spider clásico y uno AJAX que solo siguen enlaces; katana 1.7.0; nuclei 3.11.1 con plantillas solo de detección; testssl.sh 3.2 sin sus pruebas de vulnerabilidades; httpx 1.12.0; y subfinder 2.16.0 para descubrir hosts relacionados.
- **Con límites.** Cada herramienta corre en un contenedor endurecido que solo llega a las direcciones públicas fijadas para el análisis, envía como mucho 10 peticiones por segundo y se detiene en un tiempo máximo estricto.
- **Honestos con lo que falta.** Si una herramienta falla o no llega a un host, su paso queda parcial y lo que había encontrado antes no se marca como corregido.
- **Un problema, un hallazgo.** Cuando ZAP, nuclei y testssl.sh reportan el mismo problema en la misma URL, es un solo hallazgo con la evidencia de cada herramienta.
- **Versiones que expone un sitio.** Las versiones de paquetes conocidos que lee httpx (Flask, Django, Express, jQuery y otros) se buscan sin conexión con OSV-Scanner. El hallazgo dice que la versión se leyó, no que se verificó.

Un análisis web de Pitangus no es un pentest: no ataca el sitio.

## Usuarios de prueba

Cada dominio puede guardar cuentas de prueba reutilizables (usuario y contraseña, con semilla TOTP si hace falta), cifradas en reposo y que la API nunca devuelve. Un análisis web o una programación elige hasta 3, y ZAP inicia sesión con ellas. Antes de recorrer el sitio se comprueba cada inicio de sesión por separado; si un usuario no logra entrar, no se recorre el sitio como él y el análisis queda con cobertura parcial, para que pocos hallazgos nunca se lean como un resultado limpio. Los secretos le llegan a ZAP solo por la entrada estándar: nunca en la línea de comandos, en el disco del servidor ni en los logs.

## Alcance y descubrimiento

Al añadir un dominio, subfinder busca hosts relacionados en fuentes pasivas y sin claves de API. Se descartan los nombres que resuelven a direcciones privadas, de loopback, link-local o de metadatos. Los hosts descubiertos empiezan fuera del alcance; tú eliges cuáles incluir en la pestaña **Alcance** del dominio, y los análisis y las programaciones usan ese alcance guardado.

## Programación

El análisis de un dominio puede seguir una programación: a diario, ciertos días de la semana o ciertos días del mes, a una hora en tu zona horaria, como mucho una vez al día. Un análisis programado puede iniciar sesión con usuarios de prueba y enviar las cabeceras guardadas del dominio. Si se borró un usuario o falta una cabecera, el análisis corre con lo demás y dice qué dejó fuera.

## Guía de OWASP en cada hallazgo

Cada hallazgo enlaza ahora las páginas de OWASP que le aplican: las de la Cheat Sheet Series, su categoría del OWASP Top 10:2025 y, en los hallazgos de código y web, el riesgo del API Security Top 10 2023 y la prueba de la WSTG v4.2. El mapeo está curado y versionado, por regla, framework, archivo, CWE (100) y escáner. Los enlaces van después de la guía de la propia herramienta, que sigue primero y tal cual: Pitangus no redacta correcciones propias. Los hallazgos de análisis anteriores también reciben los enlaces.

## Paleta de comandos y atajos

`⌘K` o `Ctrl+K` busca páginas, análisis, repositorios, imágenes y dominios, y lanza acciones como Nuevo análisis, Importar SARIF o Añadir dominio. `G` y una letra llevan a cada página, `N` inicia un análisis nuevo y `?` muestra los atajos.

## Una identidad nueva

El panel, los informes en PDF y Markdown y el diagrama de amenazas siguen un solo manual de identidad: neutros fríos, amarillo azufre solo para la marca y la acción principal, un significado por color (rojo crítico, naranja atención, verde correcto, pizarra información), tipografía IBM Plex y las mismas reglas en claro y en oscuro, con contraste WCAG AA comprobado. El flujo de Nuevo análisis es ahora una secuencia guiada de pasos, y las integraciones se agrupan por secciones.

## Otros cambios

- Quitar un dominio conserva su historia: análisis, hallazgos, triage e incidencias se quedan como evidencia.
- «Me afectan» en los CVE recientes ya no marca casi todos; ahora el CVE tiene que nombrar tu paquete como producto.
- La verificación de un dominio pregunta primero a los servidores de nombres de la zona, así que encuentra un registro recién publicado.
- Un lote de una organización usa todos los workers, y solo se da por terminado cuando acaba su último análisis.
- Un análisis programado se encola exactamente una vez, aunque haya una caída o dos rondas a la vez.

## Cambios incompatibles

- **API de dominios.** `DomainRow.schedule` es ahora un objeto (`frequency`, `weekdays`, `month_days`, `time`, `timezone`, `next_run_at`, `last_run_at`, `last_run_id`, `note`, `test_users`, `use_headers`); desaparecen los campos planos `schedule_next_at`, `schedule_last_at`, `schedule_last_run` y `schedule_note`. `POST /api/domains/remove` responde `runs_kept` en lugar de `runs_deleted`.
- **Imágenes de motores nuevas.** Con `PITANGUS_DAST_ENABLED=1`, corre `make engines` después de actualizar: subfinder, katana, nuclei, httpx y testssl.sh se suman a ZAP.

## Cómo actualizar

```sh
git fetch --tags
git checkout v0.13.0
make update
# solo con PITANGUS_DAST_ENABLED=1:
make engines
```

Las migraciones de la base de datos corren al arrancar. La lista completa de cambios está en el [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md) (en inglés), y la versión, en [GitHub](https://github.com/Pitangus-Dev/pitangus/releases/tag/v0.13.0).
