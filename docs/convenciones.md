# Convenciones del repositorio – CampusHelp

> Issue #3 · `[SETUP] Estructura del repo, ramas y convenciones`

## 1. Estructura de carpetas

```
CampusHelp/
├── .github/
│   ├── pull_request_template.md     # Plantilla que se carga en cada PR
│   └── ISSUE_TEMPLATE/              # Plantillas: historia, tarea, defecto
├── backend/                         # API REST – Node.js + Express (scaffold #6)
│   ├── src/
│   │   ├── db/                      # Pool MySQL (pool.js con mysql2/promise)
│   │   ├── routes/                  # Definición de rutas (/api/health, /api/casos…)
│   │   ├── controllers/             # Reciben la petición y responden
│   │   ├── services/                # Reglas de negocio y consultas (casos.js, estados.js…)
│   │   ├── middlewares/             # notFound, errorHandler, httpError (formato { error, detalles })
│   │   ├── app.js                   # Configuración de Express
│   │   └── server.js                # Arranque (dotenv + listen)
│   ├── tests/                       # Pruebas del backend (opcional: Jest + Supertest)
│   ├── .env.example
│   └── package.json
├── frontend/                        # React + Vite
│   ├── src/
│   │   ├── api/                     # Cliente HTTP y funciones por recurso
│   │   ├── components/              # Componentes reutilizables (tablas, badges, formularios)
│   │   ├── context/                 # Usuario de prueba seleccionado y su rol
│   │   ├── pages/                   # Una carpeta por pantalla (RegistrarCaso, MisCasos, Bandeja…)
│   │   ├── routes/                  # Rutas y menú por rol
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── db/
│   ├── schema.sql                   # Estructura de la BD (se puede ejecutar desde cero)
│   └── seeds.sql                    # Áreas, categorías, usuarios y casos de prueba
├── docs/
│   ├── politicas.md                 # Product Goal, DoR, DoD, reglas del tablero (#2)
│   ├── convenciones.md              # Este documento (#3)
│   ├── decisiones.md                # Decisiones técnicas y su justificación
│   ├── historias/                   # Fichas HU-01.md … HU-12.md
│   ├── pruebas/                     # Casos de prueba, resultados y registro de defectos
│   ├── metricas/                    # Hoja de seguimiento y consolidado de métricas
│   ├── retrospectivas/              # Plantilla y una retrospectiva por sprint
│   ├── sprints/                     # Notas de Planning y Review por sprint
│   └── evidencias/
│       ├── tablero/                 # Captura diaria del tablero (AAAA-MM-DD.png)
│       └── reviews/                 # Capturas o videos de cada Sprint Review
├── .editorconfig
├── .gitattributes
├── .gitignore
└── README.md                        # Instalación, ejecución y usuarios de prueba
```

La estructura interna de `backend/src` y `frontend/src` es una guía: quien haga el scaffold (#6 y #8) puede ajustarla y debe actualizar este documento.

## 2. Ramas

| Rama | Para qué | Quién escribe |
|---|---|---|
| `main` | Versión estable entregable. Solo recibe merges desde `develop` al cierre de cada sprint (con tag `sprint-N`) y en la entrega final (`v1.0`). | Solo por PR |
| `develop` | Integración diaria. **Es la rama por defecto del repo.** | Solo por PR |
| `<tipo>/<n°issue>-<descripcion>` | **Una rama por issue**, creada desde `develop`. | Quien tiene asignada la issue |

**Formato de la rama de trabajo:** `tipo/numero-descripcion-corta`, en minúsculas, con guiones y sin tildes ni ñ.

| Tipo | Uso | Ejemplo |
|---|---|---|
| `feat` | Funcionalidad nueva | `feat/23-post-casos` |
| `fix` | Corrección de un defecto | `fix/51-validacion-descripcion` |
| `docs` | Solo documentación | `docs/2-politicas-equipo` |
| `test` | Casos o scripts de prueba | `test/25-cp01-cp03` |
| `refactor` | Cambio interno sin cambiar comportamiento | `refactor/40-servicio-estados` |
| `style` | Estilos o formato sin lógica | `style/30-badges-estado` |
| `chore` | Configuración, dependencias, estructura | `chore/3-estructura-repo` |

### Flujo de trabajo de una issue
```bash
git checkout develop
git pull origin develop
git checkout -b feat/23-post-casos          # rama de la issue #23
# … trabajar y hacer commits pequeños …
git push -u origin feat/23-post-casos
gh pr create --base develop --fill          # o desde la web
```
1. Antes de crear la rama, **mover la tarjeta** de la historia a la columna que corresponda.
2. Abrir el PR hacia `develop` apenas la tarea esté lista para revisión.
3. Otro integrante revisa y aprueba. **Nadie aprueba su propio PR.**
4. Merge con **Squash and merge**. La rama se borra después del merge.
5. Si `develop` avanzó mientras trabajabas: `git pull origin develop` en tu rama y resolver conflictos antes de pedir revisión.

## 3. Commits

Se usa **Conventional Commits** con el número de issue al final:

```
<tipo>(<alcance>): <descripción en imperativo y minúscula> (#<issue>)
```

- **tipo:** los mismos de las ramas (`feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`).
- **alcance:** módulo afectado: `casos`, `estados`, `atencion`, `validacion`, `historial`, `filtros`, `indicadores`, `categorias`, `db`, `ui`, `repo`.
- **descripción:** qué hace el cambio, máximo ~70 caracteres.

Ejemplos:
```
feat(casos): crear endpoint POST /api/casos con validaciones (#23)
fix(estados): impedir transición de Pendiente a Cerrada (#51)
feat(ui): formulario de registro con categorías por área (#24)
test(casos): registrar resultados de CP-01 a CP-03 (#25)
docs(repo): agregar convenciones de ramas y commits (#3)
chore(db): agregar seeds de áreas y categorías (#5)
```

## 4. Pull Requests

- Título igual al del commit principal: `feat(casos): crear endpoint POST /api/casos (#23)`.
- La descripción usa la plantilla (`.github/pull_request_template.md`) e incluye **`Closes #N`** para que la issue se cierre sola al fusionar.
- Para que `Closes #N` funcione, **`develop` debe ser la rama por defecto** del repo (GitHub solo cierra issues automáticamente con merges a la rama por defecto).
- PR pequeños: idealmente una sub-issue por PR.
- Checks mínimos antes de pedir revisión: la app arranca, no hay errores en consola y probaste el caso feliz y un caso de error.

## 5. Issues y labels

| Label | Uso |
|---|---|
| `historia` | Historia de usuario (tarjeta del flujo principal) |
| `tarea` + `backend` / `frontend` / `bd` / `qa` | Sub-issue técnica de una historia |
| `scrum`, `documentacion` | Proceso, ceremonias, documentos |
| `P1`, `P2`, `P3` | Prioridad del caso de negocio |
| `sp:N` | Story Points |
| `bloqueado` | Trabajo detenido: comentar motivo y fecha |
| `expedite` | Carril urgente (máx. 1) |
| `defecto` | Defecto encontrado en pruebas |

Los títulos de las tareas siguen el formato `[HU-XX][BACK|FRONT|BD|QA] descripción`.

## 6. Código

| Tema | Convención |
|---|---|
| Idioma | Dominio en español (`caso`, `agente`, `fecha_cierre`); palabras técnicas en inglés cuando es lo natural (`router`, `controller`). |
| JavaScript | `camelCase` para variables y funciones, `PascalCase` para componentes React, `UPPER_SNAKE_CASE` para constantes. |
| Archivos | Componentes React `PascalCase.jsx`; el resto `camelCase.js`. |
| BD | Tablas y columnas en `snake_case` y singular (`caso`, `categoria_id`). |
| API | Prefijo `/api`, recursos en plural (`/api/casos/:id/estado`), JSON, códigos 200/201/400/404/409/500. |
| Errores de la API | `{ "error": "mensaje", "detalles": [...] }` |
| SQL | Siempre consultas parametrizadas (`?`), nunca concatenar valores. |
| Secretos | Nunca se suben `.env`; solo `.env.example`. |
| Formato | 2 espacios, LF, UTF-8 (ver `.editorconfig` y `.gitattributes`). |

## 7. Configuración del repositorio en GitHub (una sola vez)

- [ ] Crear `develop` desde `main` y subirla.
- [ ] *Settings → General → Default branch* → `develop`.
- [ ] *Settings → Branches → Add rule* para `main` y `develop`: *Require a pull request before merging* con 1 aprobación.
- [ ] *Settings → General → Pull Requests*: activar **Allow squash merging** y **Automatically delete head branches**.
