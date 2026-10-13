# CampusHelp

Sistema web para gestionar los incidentes y las solicitudes de servicio tecnológico de una universidad.
Es el MVP del taller de Ingeniería de Software III (Universidad de Caldas), desarrollado con ScrumBan.

**Flujo principal:** Registrar → Clasificar → Priorizar → Asignar → Atender → Validar → Cerrar

**Stack:** React + Vite + TypeScript · Node.js + Express · MySQL 8

## 1. Requisitos

| Herramienta | Versión | Comprobar |
|---|---|---|
| Node.js | **20.19 o superior** (Vite 8 no arranca con versiones anteriores) | `node -v` |
| npm | La que trae Node | `npm -v` |
| MySQL Server | **8.x**, con el cliente `mysql` en el `PATH` | `mysql --version` |
| Git | Cualquiera reciente | `git --version` |

Los comandos de esta guía están probados en **Git Bash sobre Windows**. También funcionan en Linux y macOS.

> Si `mysql` no se reconoce en Git Bash, agrega su carpeta al `PATH` de la sesión (ajusta la versión):
> ```bash
> export PATH="$PATH:/c/Program Files/MySQL/MySQL Server 8.0/bin"
> ```

## 2. Obtener el código

```bash
git clone https://github.com/jAlejandro423/CampusHelp.git
cd CampusHelp
```

La rama `develop` tiene la versión integrada más reciente y `main`, la versión entregada.

## 3. Crear la base de datos

Desde la raíz del repo, con un usuario de MySQL que pueda crear bases de datos (por ejemplo `root`):

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seeds.sql
```

- `schema.sql` **borra y vuelve a crear** la base `campushelp` con sus 6 tablas. Ejecútalo de nuevo para empezar desde cero.
- `seeds.sql` carga las 5 áreas, las 16 categorías, los 6 usuarios de prueba y 6 casos de ejemplo en distintos estados.
- Los dos scripts fijan `SET NAMES utf8mb4`, así que las tildes se guardan bien también desde Git Bash ([DEF-01](docs/decisiones.md)).

Para comprobarlo:

```bash
mysql -u root -p -e "SELECT estado, COUNT(*) FROM campushelp.caso GROUP BY estado;"
```

Deben aparecer 6 casos: 1 Pendiente, 1 En análisis, 1 En atención, 1 En validación y 2 Cerrada.
Si la consola de Windows muestra `En an�lisis`, es solo la forma de mostrarlo: los datos están bien guardados y la aplicación los ve con tildes.

## 4. Configurar y arrancar el backend

```bash
cd backend
cp .env.example .env
npm install
```

Edita `backend/.env` con los datos de tu MySQL:

| Variable | Valor por defecto | Para qué sirve |
|---|---|---|
| `DB_HOST` | `localhost` | Servidor de MySQL |
| `DB_PORT` | `3306` | Puerto de MySQL |
| `DB_USER` | `root` | Usuario de MySQL |
| `DB_PASSWORD` | `changeme` | **Cámbiala** por la contraseña de ese usuario |
| `DB_NAME` | `campushelp` | Base creada por `schema.sql` |
| `PORT` | `3000` | Puerto de la API |

El archivo `.env` no se sube al repositorio. Solo se versiona `.env.example`.

Arranca la API:

```bash
npm run dev
```

`npm run dev` reinicia la API cuando cambia el código. Para la demo también sirve `npm start`.

La consola debe mostrar `CampusHelp API escuchando en puerto 3000`. Comprueba que responde y que llega a la base de datos:

```bash
curl http://localhost:3000/api/health
```

La respuesta correcta es `{"status":"ok","db":"up"}`.

## 5. Configurar y arrancar el frontend

En **otra terminal**, desde la raíz del repo:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` (en `frontend/.env`) apunta a la API, por defecto `http://localhost:3000`. Si cambiaste el `PORT` del backend, cámbialo aquí también y reinicia Vite.

Abre la URL que muestra Vite, normalmente **http://localhost:5173**.

Para generar la versión de producción: `npm run build` (queda en `frontend/dist/`).

## 6. Usuarios de prueba

No hay autenticación real ([D-02](docs/decisiones.md)). Se elige el usuario en el **selector de la barra superior** y el menú muestra solo las pantallas de su rol.

| ID | Usuario | Rol | Pantallas |
|---|---|---|---|
| 1 | Laura Gómez | Solicitante | Registrar Caso · Mis Casos (y el detalle de cada caso) |
| 2 | Carlos Ruiz | Solicitante | Registrar Caso · Mis Casos |
| 3 | Diego Torres | Agente de soporte | Bandeja |
| 4 | María Prieto | Agente de soporte | Bandeja |
| 5 | Pedro Validador | Validador | Por Validar |
| 6 | Ana Admin | Administrador | Casos (filtros) · Indicadores · Categorías |

## 7. Recorrido del flujo completo (demo)

Con el backend y el frontend en marcha y la base recién cargada:

1. **Registrar** · Laura Gómez → *Registrar Caso*. Elige tipo (Incidente o Solicitud), área, categoría de esa área y prioridad, y escribe un título y una descripción de al menos 10 caracteres. El caso queda **Pendiente**.
2. **Consultar** · En *Mis Casos* aparece el caso nuevo. Al abrirlo se ve su detalle e historial.
3. **Asignar** · Diego Torres → *Bandeja*. Los casos abiertos salen ordenados por prioridad. Al asignarse el caso pasa a **En análisis** ([D-14](docs/decisiones.md)).
4. **Atender** · Diego pulsa *Pasar a En atención* y después *Registrar atención* con el diagnóstico y la solución. Solo el agente asignado puede hacerlo.
5. **Enviar a validación** · Diego pulsa *Pasar a En validación*. Si el caso aún no tiene una atención con solución, la bandeja lo rechaza con un aviso.
6. **Validar** · Pedro Validador → *Por Validar*:
   - **Devolver** con un motivo de al menos 10 caracteres: el caso vuelve a **En atención** y el motivo queda en el historial. Diego registra otra atención y lo envía de nuevo a validación.
   - **Aprobar**: el caso pasa a **Cerrada** y se guarda la fecha de cierre. Un caso cerrado ya no cambia.
7. **Consultar la solución** · Laura abre el caso en *Mis Casos* y ve el diagnóstico, la solución y el historial completo.
8. **Administrar** · Ana Admin:
   - *Casos*: filtra por tipo, área, categoría, prioridad y estado.
   - *Indicadores*: total de casos, tiempos promedio de asignación y de cierre, y casos por estado, tipo, prioridad y área, con datos reales.
   - *Categorías*: crea, edita, activa y desactiva categorías. Las inactivas no se ofrecen al registrar.

**Persistencia:** detén la API (Ctrl+C) y vuelve a arrancarla. Los casos y el historial siguen ahí porque se leen de MySQL.

Las transiciones fuera del mapa se rechazan en el backend con `409`:

```
Pendiente → En análisis → En atención → En validación → Cerrada
                              ↑               │
                              └── devolución ─┘
```

## 8. API

Todas las rutas tienen el prefijo `/api`. Los errores siguen el formato `{ "error": "mensaje", "detalles": [...] }` con códigos 400, 404, 409 o 500.

| Método y ruta | Historia |
|---|---|
| `GET /api/health` | Setup |
| `GET /api/usuarios?rol=` · `GET /api/areas` · `GET /api/categorias?area_id=` | Catálogo |
| `POST /api/casos` | HU-01 |
| `GET /api/casos?usuario_id=&estado=&tipo=&area_id=&categoria_id=&prioridad=&bandeja=1` | HU-02, 03 y 09 |
| `GET /api/casos/:id` | HU-12 |
| `PATCH /api/casos/:id/estado` | HU-05 |
| `PATCH /api/casos/:id/asignar` | HU-04 |
| `POST /api/casos/:id/atenciones` | HU-06 |
| `POST /api/casos/:id/validacion` | HU-07 |
| `GET /api/casos/:id/historial` | HU-08 |
| `GET /api/indicadores` | HU-10 |
| `POST /api/categorias` · `PUT /api/categorias/:id` · `PATCH /api/categorias/:id` | HU-11 |

El detalle de cada endpoint y sus reglas está en [`docs/decisiones.md`](docs/decisiones.md).

## 9. Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `/api/health` responde `500` con `"Base de datos no disponible"` | La API arrancó, pero no llega a MySQL. Revisa que el servicio de MySQL esté en marcha, que `DB_HOST`, `DB_PORT`, `DB_USER` y `DB_PASSWORD` de `backend/.env` sean correctos y que ya ejecutaste `db/schema.sql` y `db/seeds.sql`. |
| `EADDRINUSE` | El puerto ya está en uso. Cambia `PORT` en `backend/.env` (y `VITE_API_URL` en `frontend/.env`). |
| Vite pide una versión de Node más nueva | Actualiza Node a 20.19 o superior. |
| La interfaz carga, pero no muestra usuarios ni casos | La API no está arrancada o `VITE_API_URL` no apunta a ella. Reinicia Vite después de cambiar `.env`. |
| Tildes rotas (`AnÃ¡lisis`) | Los datos se cargaron con otra versión de los scripts. Vuelve a ejecutar `schema.sql` y `seeds.sql`. |

## 10. Estructura

```
backend/   API REST (Express): routes · controllers · services · db · middlewares
frontend/  Interfaz (React + Vite + TypeScript): pages · layouts · components · context · api
db/        schema.sql · seeds.sql
docs/      Políticas, convenciones, decisiones, historias, pruebas, métricas, sprints y retrospectivas
```

## 11. Documentación del equipo

- [Políticas: Product Goal, DoR, DoD y tablero](docs/politicas.md)
- [Convenciones de ramas, commits y PR](docs/convenciones.md)
- [Decisiones técnicas](docs/decisiones.md)
- [Documento de requisitos](docs/requisitos.md)
- [Historias de usuario](docs/historias/)
- [Trazabilidad](docs/trazabilidad.md)
- [Casos de prueba y registro de defectos](docs/pruebas/casos_de_prueba.md)
- [Métricas](docs/metricas/)
- Sprints: [planning y review](docs/sprints/) · [retrospectivas](docs/retrospectivas/)

## Equipo

| GitHub | Rol |
|---|---|
| @jAlejandro423 | Scrum Master · QA · Documentación |
| @Jesusda11 | Backend · Base de datos |
| @sukanico | Frontend |
