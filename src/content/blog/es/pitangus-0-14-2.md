---
title: 'Pitangus 0.14.1 y 0.14.2: tu código ya no se guarda y la guía de dependencias dice qué actualizar primero'
description: 'Pitangus 0.14.1 deja de guardar el texto de tu código y declara lo que el repositorio suprime en los motores; 0.14.2 dice qué dependencia directa limita un paquete vulnerable y en qué orden actualizar. Publicadas el 15 de octubre de 2026.'
lang: es
translationKey: release-0-14-2
category: news
tags: ['versión', 'dependencias', 'privacidad']
published: 2026-10-15
draft: false
---

Pitangus 0.14.1 y 0.14.2 se publicaron el 15 de octubre de 2026, el mismo día que la 0.14.0. Son versiones de mantenimiento: la primera cierra de raíz una clase de problemas y la segunda sale del feedback de un desarrollador que probó Pitangus en un proyecto real con FastAPI y Poetry.

## 0.14.1: Pitangus no guarda el texto de tu código

Pitangus guarda la ubicación de cada hallazgo (archivo, líneas, el commit analizado), su regla y hashes, pero no el código. Cuando abres un hallazgo, el fragmento se lee en ese momento del repositorio, en el commit del análisis, y no se guarda en caché ni en los logs.

- Los secretos salen siempre tapados. En los hallazgos de secretos, en los ficheros de credenciales, en los symlinks y en los hallazgos importados por SARIF solo se muestra la ubicación y un enlace.
- Jira, los comentarios de pull request, los avisos y los informes llevan la ubicación y un enlace a la línea, no el código.
- La migración `drop_stored_code` borra los fragmentos que guardaban las versiones anteriores, sin cambiar ninguna identidad ni ningún estado.

Además, lo que un repositorio les dice a los motores para que reporten menos se respeta, pero ya no en silencio: los `# zizmor: ignore`, `.trivyignore`, `trivy:ignore`, `.checkov.yaml`, `checkov:skip` y los filtros de OSV-Scanner aparecen en **Excluidos**, con la regla, el archivo y la línea, y nunca se dan por corregidos. El ajuste `PITANGUS_IGNORE_REPO_SUPPRESSIONS` los ignora todos.

El hook de pre-commit ejecuta ahora la imagen fijada por digest y, si tienes cosign, verifica su firma antes.

## 0.14.2: qué dependencia actualizar primero

El caso que la motivó: starlette 0.37.2 tenía avisos de severidad alta y llegaba como dependencia transitiva. Pitangus recomendaba `poetry update starlette`, y ese comando no cambiaba nada, porque fastapi solo aceptaba starlette por debajo de 0.38.

Ahora la guía usa el grafo de dependencias que resuelve Trivy y el rango que declara el lockfile para saber qué dependencia directa limita la versión:

1. «starlette 0.37.2 llega a través de fastapi 0.110.1, que solo acepta starlette >=0.37.2,<0.38.0: primero tiene que moverse fastapi.»
2. Los comandos, en orden: `poetry add fastapi@latest`, después `poetry update starlette` y, para comprobarlo, `poetry show starlette`.
3. Por último, **Reverificar** en Pitangus.

Cuando el rango sí acepta la versión corregida, basta con actualizar el paquete. Si el lockfile no guarda el rango (Cargo, pnpm, uv, Composer o Go), la guía lo dice en lugar de suponerlo.

También en la 0.14.2:

- **Exclusiones más claras.** Se puede excluir una sola regla dentro de una ruta (`tests/** generic-api-key`), el formulario explica cada opción con ejemplos y muestra qué cambia antes de guardar. Lo excluido sigue a la vista en Excluidos.
- **Recuentos que cuadran.** El filtro de estado de Hallazgos muestra cuántos hay en cada estado, igual que la cabecera.
- **Jira.** Las reglas automáticas dicen cuántas incidencias crearán y dónde antes de guardarse, y la descripción ya no pierde los espacios al formatearse.

## Actualizar

Haz una copia de seguridad antes de actualizar:

```bash
make backup
git fetch --tags && git checkout v0.14.2 && make update
```

La lista completa de cambios está en el [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
