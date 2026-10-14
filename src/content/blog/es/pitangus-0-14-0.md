---
title: 'Pitangus 0.14.0: nada se da por corregido sin prueba, Betterleaks y un comando para empezar'
description: 'Pitangus 0.14.0, publicado el 13 de octubre de 2026: un motor apagado o un cambio de configuración no da nada por corregido, el control de pull requests cuenta copias, los secretos pasan a Betterleaks y llegan la comprobación de exposición, reglas para código con IA y un comando para empezar.'
lang: es
translationKey: release-0-14-0
category: news
tags: ['versión', 'secretos', 'código con IA']
published: 2026-10-13
draft: false
---

Pitangus 0.14.0 se publicó el 13 de octubre de 2026. Pitangus es una herramienta autoalojada y de código abierto (AGPL-3.0) de seguridad de aplicaciones para equipos pequeños: analiza código, dependencias, secretos, infraestructura como código e imágenes de contenedor con motores abiertos en tu propia máquina, y solo da algo por corregido cuando un análisis posterior lo demuestra.

El foco de esta versión es poder confiar en los resultados. Un hallazgo ya no se da por corregido solo porque desapareció: un motor apagado o que no corrió, o un cambio de configuración, nunca corrige nada, y una pull request se juzga contando copias. La prueba por motor y una identidad que sobrevive al código que se mueve vienen activas por defecto. Además, los secretos pasan a Betterleaks, se revisan los archivos de credenciales, llegan la comprobación de exposición de dominios verificados y reglas para lo que el código escrito con IA suele hacer mal, y para empezar basta un `docker run`. Las notas para actualizar están al final.

## Nada se da por corregido sin prueba

Que un hallazgo desaparezca de un análisis no quiere decir que esté corregido: el motor pudo fallar, estar apagado, saltarse el archivo o toparse con un firewall. Ahora Pitangus pide una prueba antes de decir «corregido»:

- **Un motor apagado, o que no corrió, no corrige nada.** Su paso dice «no ejecutado (desactivado)», el análisis no se muestra como limpio y lo que ese motor había reportado sigue abierto hasta que un motor que vuelva a mirar demuestre que ya no está.
- **Cambiar la configuración nunca corrige.** Apagar una regla o un motor, cambiar una lista de excepciones o actualizar el conjunto de reglas deja esos hallazgos como no comprobados, con el motivo, en vez de corregidos. Ni Jira ni las notificaciones reciben nada por ellos.
- **Una herramienta que no terminó no abre ni cierra hallazgos**, y un SARIF de una ejecución fallida no corrige nada.
- **Solo donde el análisis miró.** Un hallazgo en un archivo que el motor se saltó (demasiado grande, sin tiempo) sigue abierto, y un hallazgo web solo se corrige si esta vez se llegó de verdad a su página. Un hallazgo de dependencias pertenece a su proyecto, el manifiesto junto con su lockfile: borrar o vaciar el lockfile deja el proyecto sin examinar, así que nunca corrige lo que se encontró ahí.

El contrato de cobertura, activo por defecto, hace que cada ejecución de un motor pase por un mismo contrato (código de salida, la salida que siempre escribe, una marca de que corrió) y declara qué archivos o páginas examinó y cuáles no, y por qué. Así, un hallazgo solo se corrige cuando el motor al que pertenece demostró que miró donde estaba; un hallazgo abierto que un análisis no pudo revisar aparece como sin verificar desde ese análisis, y un análisis que corregiría demasiado de golpe retiene esas correcciones hasta que el siguiente análisis completo las confirme.

## Una identidad por problema

La identidad de un hallazgo sale ahora de su contenido, nunca de su línea ni del orden en que lo lista un motor: el código sin comentarios ni formato, la dirección de un recurso, el aviso, el paquete y la versión normalizada de una dependencia, un hash con clave del secreto, la plantilla de ruta de una regla web. Añadir una línea encima de un problema no lo vuelve nuevo, y los problemas idénticos forman una familia con su conteo: una copia nueva reabre un hallazgo ya revisado, y una copia menos es una corrección parcial.

El triage sigue a la familia con prudencia. Si las copias tenían decisiones distintas, o alguna no tenía, la familia vuelve a quedar pendiente con el historial de todas, y se conservan las fechas de caducidad y los tickets.

El contrato de cobertura y la identidad nueva vienen **activos por defecto** (`PITANGUS_COVERAGE_MODE=on`, `PITANGUS_IDENTITY_MODE=v2`). Antes de publicarlos así analizamos dos veces el mismo commit en cinco repositorios reales: no se abrió ni se corrigió nada. En el primer análisis después de actualizar, el cambio de identidad no abre ni corrige nada por sí mismo, y un análisis que corregiría demasiado de golpe retiene esas correcciones hasta que un segundo análisis los confirma. Si prefieres comprobarlo antes, pon los dos en `shadow`: cada análisis registra entonces lo que cambiarían, y `pitangus identity-gate` te dice cuándo activarlos no cambia nada en tus repositorios. La guía para actualizar explica el primer análisis.

## Un control de pull requests que cuenta copias

El control de pull requests, en el servidor y en `pitangus scan --base`, usa la misma identidad que el registro. Pegar una segunda copia de un problema junto a otra idéntica lo introduce; mover una copia, no; añadir solo un comentario en una línea vulnerable no bloquea el merge. Revisar una pull request nunca cambia los conteos de la rama principal.

## Betterleaks para los secretos, y archivos de credenciales

Los secretos ahora los encuentra [Betterleaks](https://github.com/betterleaks/betterleaks) 1.9.0 (MIT, de los mantenedores de Gitleaks) en lugar de Gitleaks. Usa la misma configuración (tus detectores, las reglas apagadas y las excepciones) y trae 463 reglas incluidas en vez de 222. Un secreto conserva su identidad con el cambio, y lo que encontró Gitleaks le toca a Betterleaks demostrar que ya no está: el cambio de motor no corrige nada.

Un secreto es su valor. Dos valores distintos nunca son el mismo hallazgo, ni siquiera en el mismo sitio: cambiar un token donde estaba corrige el viejo y abre el nuevo, y una pull request que lo hace lo introduce. Si rotas la clave maestra, pon la anterior en `PITANGUS_PREVIOUS_MASTER_KEY` y los secretos conservan sus entradas.

Los archivos de credenciales (`.env*`, `.npmrc`, `.pypirc`, `.netrc`, claves SSH `id_*`, `credentials`, `.git-credentials`, `.dockercfg`, `.s3cfg`, `.boto`, `.htpasswd`) quedaban fuera de todos los análisis. Ahora los leen Betterleaks y el escáner de secretos de Trivy, desde una copia aparte que ningún otro motor ve y que se borra en cuanto terminan.

Los dos motores traen además listas de rutas que se saltan sin decirlo: carpetas `node_modules/` y `vendor/` versionadas, lockfiles, archivos minificados, pruebas, ejemplos. Pitangus apaga esas listas, así que una clave en un `node_modules/@acme/internal/index.js` versionado aparece, y no se fía de que ninguno lo haya leído todo: el registro de cada motor dice qué leyó, y un archivo versionado que no leyó figura como no analizado por ese motor, así que nada de lo que vio ahí antes se da por corregido. Un comentario `gitleaks:allow` es una decisión tuya y se respeta, pero nunca en silencio: cada coincidencia que permite aparece como excluida con su archivo y su línea. En un repositorio con un `node_modules/` versionado, el pase de secretos tarda más (unos 35 segundos más para 600 MB).

De tu código, Pitangus guarda, muestra y envía la estructura, nunca los valores. Un único renderizador recibe cada fragmento, el del prompt para tu IA, los fragmentos de SARIF y cada mensaje que escribió un motor, y sustituye todo literal y todo valor tras `=` o `:`, en cualquier formato, sin intentar adivinar cuáles son credenciales: `cur.execute("SELECT …" + q)` queda `cur.execute("***" + q)`. Los secretos y las contraseñas escritas en el código no conservan ningún fragmento. Un valor hecho solo de palabras comunes, números cortos y símbolos se lee como código y no se puede distinguir; cualquier otro nunca llega al hallazgo, al prompt para tu IA, al SARIF, a los informes, a una incidencia de Jira ni a los registros. Los hallazgos de versiones anteriores se renderizan igual al actualizar.

Comprobar si un secreto todavía funciona es opcional (`PITANGUS_SECRET_VALIDATION=1`): para preguntarlo, se envía cada secreto a su propio proveedor. Un secreto activo se atiende primero y uno revocado queda en seguimiento; ninguno se oculta.

## Comprobación de exposición para dominios verificados

Un dominio verificado tiene una **comprobación de exposición** incluida: la raíz de cada host y una lista de rutas conocidas (archivos expuestos como `.git` o `.env`, consolas de depuración y de estado, TLS, cabeceras de respuesta) con httpx, testssl.sh y las plantillas solo de detección de nuclei. No rastrea el sitio, y ninguna herramienta envía más de 10 peticiones por segundo. Las rutas donde estaban hallazgos anteriores se vuelven a pedir, así que un 404 o un 410 ahí demuestra que el archivo ya no está; un 401, 403, 429 o un error del servidor nunca cuenta como revisado, y un host que rechaza casi todo (un WAF) deja la comprobación incompleta.

## Reglas para lo que el código escrito con IA suele hacer mal

Reglas nuevas apuntan a los descuidos más comunes del código generado: una clave `service_role` de Supabase en el código (se reconoce por lo que dice la clave, no por el nombre de su variable) o leída en un archivo `"use client"`; un secreto en una variable que el bundler hace pública (`NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`, `EXPO_PUBLIC_`…); CORS abierto a cualquier origen con credenciales; una ruta sin la autenticación que tienen sus vecinas, y un JWT decodificado sin verificar la firma. Un lector pequeño, propio, señala las tablas de Supabase sin seguridad por filas y las reglas de Firebase abiertas o en modo de prueba, y avisa cuando no pudo leer un archivo.

Cada hallazgo también se puede copiar como prompt para Claude, Cursor o Copilot (**Copiar prompt para tu IA** en el panel, `pitangus scan --format prompt` en la terminal): la regla, el lugar, la estructura del código que coincide y la corrección, nunca un valor. Pitangus no llama a ninguna IA.

## Un comando para empezar, y un hook de pre-commit más rápido

A quien desarrolla le basta con Docker. Desde la carpeta del proyecto:

```bash
docker run --rm -v "$PWD":/src:ro -v pitangus-cache:/data \
  ghcr.io/pitangus-dev/pitangus-worker:0.14 \
  python -m pitangus --data-dir /data scan /src
```

Agrega `--base origin/main` para ver solo lo que añade tu cambio. La misma imagen corre como hook de pre-commit en pre-push (`id: pitangus`, `rev: v0.14.0`; se instala con `pre-commit install --hook-type pre-push`) y en la GitHub Action. El hook analiza el commit que subes, no tu carpeta de trabajo: un archivo que no confirmaste no puede bloquear el push. La [guía rápida para desarrolladores](https://docs.pitangus.dev/es/quickstart-developer/) tiene las tres opciones.

La primera vez descarga las bases de datos de avisos de los motores en el volumen `pitangus-cache`, y las siguientes las reutiliza. En un repositorio pequeño con el hook de pre-commit, una ejecución pasó de unos 35 segundos a unos 20. En la Action, las bases se guardan durante el día con `actions/cache`.

## Qué es experimental y qué viene apagado

- **El análisis web completo es experimental** y sigue apagado salvo con `PITANGUS_DAST_ENABLED=1`: ZAP, katana y subfinder rastreando el sitio. La comprobación de exposición no lo necesita. Apagar el análisis completo no corrige nada de lo que encontró antes.
- **Las sast-rules de GitLab siguen apagadas.** Las 259 reglas opcionales (`PITANGUS_THIRD_PARTY_RULES`) se midieron en un corpus público de repositorios vulnerables a propósito y de aplicaciones reales, y ninguna llegó al 85 % de precisión con al menos tres aciertos.
- **`generic-credential-uri` sigue apagada.** La regla genérica de Betterleaks para credenciales dentro de URLs marca documentación y ejemplos mucho más que secretos reales. `generic-password` viene encendida, detrás de un filtro que descarta archivos de pruebas, documentación y traducciones, plantillas y referencias, marcadores de posición y valores débiles. En 18 repositorios públicos conservó 23 de 1.525 coincidencias, entre ellas las 12 que una revisión independiente marcó como reales.
- **Checkov y Grype son opcionales y vienen apagados.** Trivy y zizmor ya cubren la infraestructura, los pipelines y las imágenes; vuelve a encenderlos con `PITANGUS_CHECKOV_ENABLED=1` y `PITANGUS_GRYPE_ENABLED=1`.

## Otros cambios

- Los paquetes maliciosos se reconocen por el tipo de aviso (un id `MAL-` o el tipo malware de una base de datos) o por dos señales que coinciden entre una CWE de código malicioso, el título y la descripción, nunca por una sola, en Trivy, OSV-Scanner y Grype: son críticos y se quitan en vez de actualizarse.
- La corrección de una dependencia transitiva dice qué paquete la trae y qué actualizar si se queda por debajo, en cada ecosistema que resuelve Trivy.
- Las incidencias de Jira dicen en el título qué hacer y dónde, y reciben una etiqueta cuando un análisis verifica la corrección.
- Un dominio puede tener una página de comprobación de sesión: un análisis con cabeceras guardadas cuya sesión venció queda incompleto, en vez de dar por corregido lo que había detrás del inicio de sesión.
- La importación de modelos de amenazas conserva cada campo, lo muestra y lo vuelve a exportar, y el catálogo completo de MITRE ATT&CK v19.2 viene incluido sin conexión.

## Actualizar

```sh
git fetch --tags
git checkout v0.14.0
make update
```

`make update` hace una copia de seguridad, descarga las imágenes nuevas (entre ellas Betterleaks) y al arrancar aplica las migraciones de base de datos (0015 y 0016) y las conversiones de datos. Es normal ver algunos hallazgos de secretos nuevos en el primer análisis, por las reglas adicionales de Betterleaks, los archivos de credenciales y las carpetas que los motores se saltaban, y ver como excluido lo que permite `gitleaks:allow`. Los secretos que guardó la 0.13 pasan a la identidad de su valor en el primer análisis que los lee, una sola vez: si cambiaste el valor de un secreto desde tu último análisis con la 0.13, revisa los secretos que habías aceptado o marcado como falsos positivos. Un proyecto de dependencias sin su lockfile aparece ahora como no examinado: versiona el lockfile. Si usas Checkov o Grype, vuelve a encenderlos en `.env`. Un hallazgo cuya regla cambió en la 0.14 y que desaparece en el primer análisis aparece como sin verificar (configuración) en vez de corregido: márcalo como corregido a mano si de verdad ya no está. Si subes SARIF al code scanning de GitHub, las alertas existentes aparecen una vez como nuevas, porque sus huellas ahora llevan la identidad. La [guía para actualizar](https://docs.pitangus.dev/es/upgrading/) explica el cambio de identidad y qué esperar del primer análisis. La lista completa de cambios está en el [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md), y la versión está en [GitHub](https://github.com/Pitangus-Dev/pitangus/releases/tag/v0.14.0).
