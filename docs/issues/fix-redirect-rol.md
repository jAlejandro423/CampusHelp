# Fix · Redirección automática al cambiar de rol

Rama: `fix/redirect-rol-sin-acceso` (desde `develop`).
Sin issue asociada: agregar el número cuando se cree.

## Problema

Al cambiar de usuario a otro rol desde el selector, la app se quedaba en la
ruta anterior aunque el nuevo rol no tuviera acceso a ella (menú distinto,
misma pantalla).

## Corrección

`src/layouts/MainLayout.tsx`: efecto que, al cambiar el usuario o la ruta,
comprueba si `location.pathname` pertenece al menú del rol (con coincidencia
de prefijo para subrutas como `/mis-solicitudes/:id`). Si no, navega con
`replace` a la primera opción de su menú.

## Verificación

- `npm run build` y `lint` ok (0 errores, solo advertencias previas).
- Casos: solicitante en `/bandeja-soporte` → cambia a agente → va a
  `/bandeja-soporte`; agente en `/bandeja-soporte` → cambia a solicitante →
  va a `/crear-caso`; detalle `/mis-solicitudes/5` no redirige al solicitante.
