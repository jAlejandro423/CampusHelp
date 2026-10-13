export type RolUsuario = "solicitante" | "agente" | "validador" | "administrador";

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

export interface Area {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Categoria {
  id: number;
  area_id: number;
  nombre: string;
  descripcion: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`GET ${path} falló con estado ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function obtenerUsuarios(rol?: RolUsuario | string): Promise<Usuario[]> {
  const params = new URLSearchParams();

  if (rol) {
    params.set("rol", rol);
  }

  const query = params.toString();
  return getJson<Usuario[]>(`/api/usuarios${query ? `?${query}` : ""}`);
}

export function obtenerAreas(): Promise<Area[]> {
  return getJson<Area[]>("/api/areas");
}

export function obtenerCategorias(areaId?: number): Promise<Categoria[]> {
  const params = new URLSearchParams();

  if (areaId !== undefined) {
    params.set("area_id", String(areaId));
  }

  const query = params.toString();
  return getJson<Categoria[]>(`/api/categorias${query ? `?${query}` : ""}`);
}

export type TipoCaso = "Incidente" | "Solicitud";
export type PrioridadCaso = "P1" | "P2" | "P3";

export interface CrearCasoPayload {
  tipo: TipoCaso;
  titulo: string;
  descripcion: string;
  prioridad: PrioridadCaso;
  usuario_id: number;
  categoria_id: number;
  area_id: number;
}

export interface CasoCreado {
  id: number;
  tipo: TipoCaso;
  titulo: string;
  descripcion: string;
  prioridad: PrioridadCaso;
  estado: string;
  usuario_id: number;
  categoria_id: number;
  agente_id: number | null;
  fecha_creacion: string;
  fecha_asignacion: string | null;
  fecha_cierre: string | null;
}

export class ApiError extends Error {
  status: number;
  detalles: string[];

  constructor(status: number, message: string, detalles: string[] = []) {
    super(message);
    this.status = status;
    this.detalles = detalles;
  }
}

export async function crearCaso(payload: CrearCasoPayload): Promise<CasoCreado> {
  const response = await fetch(`${API_URL}/api/casos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let error = "No se pudo registrar el caso";
    let detalles: string[] = [];
    try {
      const data = (await response.json()) as {
        error?: string;
        detalles?: string[];
      };
      if (data.error) error = data.error;
      if (Array.isArray(data.detalles)) detalles = data.detalles;
    } catch {
      // Respuesta no JSON: se usa el mensaje genérico.
    }
    throw new ApiError(response.status, error, detalles);
  }

  return response.json() as Promise<CasoCreado>;
}

export interface CasoResumen {
  id: number;
  tipo: TipoCaso;
  titulo: string;
  prioridad: PrioridadCaso;
  estado: string;
  fecha_creacion: string;
  area_id: number;
  area: string;
  categoria_id: number;
  categoria: string;
  usuario_id: number;
  solicitante: string;
  agente_id: number | null;
  agente: string | null;
}

export function obtenerMisCasos(usuarioId: number): Promise<CasoResumen[]> {
  const params = new URLSearchParams();
  params.set("usuario_id", String(usuarioId));
  return getJson<CasoResumen[]>(`/api/casos?${params.toString()}`);
}

export function obtenerCasos(): Promise<CasoResumen[]> {
  return getJson<CasoResumen[]>("/api/casos");
}

// HU-09 · Filtros combinables con AND en el backend (R1). Vacío no restringe.
export interface FiltrosCasos {
  estado?: string;
  tipo?: string;
  area_id?: number | "";
  categoria_id?: number | "";
  prioridad?: string;
}

export async function filtrarCasos(
  filtros: FiltrosCasos
): Promise<CasoResumen[]> {
  const params = new URLSearchParams();
  if (filtros.estado) params.set("estado", filtros.estado);
  if (filtros.tipo) params.set("tipo", filtros.tipo);
  if (filtros.area_id !== undefined && filtros.area_id !== "") {
    params.set("area_id", String(filtros.area_id));
  }
  if (filtros.categoria_id !== undefined && filtros.categoria_id !== "") {
    params.set("categoria_id", String(filtros.categoria_id));
  }
  if (filtros.prioridad) params.set("prioridad", filtros.prioridad);
  const query = params.toString();

  const response = await fetch(
    `${API_URL}/api/casos${query ? `?${query}` : ""}`
  );
  if (!response.ok) {
    let error = "No se pudieron filtrar los casos";
    let detalles: string[] = [];
    try {
      const data = (await response.json()) as {
        error?: string;
        detalles?: string[];
      };
      if (data.error) error = data.error;
      if (Array.isArray(data.detalles)) detalles = data.detalles;
    } catch {
      // Respuesta no JSON: se usa el mensaje genérico.
    }
    throw new ApiError(response.status, error, detalles);
  }
  return response.json() as Promise<CasoResumen[]>;
}

// HU-03 · Bandeja del agente: usa el BACK #29.
// GET /api/casos?bandeja=1 excluye Cerrada y ordena por prioridad
// (P1→P3) y antigüedad (más antiguo primero). Las reglas viven en el backend.
export function obtenerBandeja(): Promise<CasoResumen[]> {
  return getJson<CasoResumen[]>("/api/casos?bandeja=1");
}

// HU-05 · Copia del mapa de transiciones SOLO para decidir qué botones
// mostrar. Quien decide de verdad es el backend (services/estados.js).
export const TRANSICIONES: Record<string, string[]> = {
  Pendiente: ["En análisis"],
  "En análisis": ["En atención"],
  "En atención": ["En validación"],
  "En validación": [],
  Cerrada: [],
};

export function transicionesValidas(estado: string): string[] {
  return TRANSICIONES[estado] ?? [];
}

export async function cambiarEstadoCaso(
  casoId: number,
  estado: string,
  usuarioId: number
): Promise<CasoCreado> {
  const response = await fetch(`${API_URL}/api/casos/${casoId}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado, usuario_id: usuarioId }),
  });

  if (!response.ok) {
    let error = "No se pudo cambiar el estado";
    let detalles: string[] = [];
    try {
      const data = (await response.json()) as {
        error?: string;
        detalles?: string[];
      };
      if (data.error) error = data.error;
      if (Array.isArray(data.detalles)) detalles = data.detalles;
    } catch {
      // Respuesta no JSON: se usa el mensaje genérico.
    }
    throw new ApiError(response.status, error, detalles);
  }

  return response.json() as Promise<CasoCreado>;
}

// HU-04 · El agente se asigna a sí mismo. Solo casos sin agente en
// Pendiente o En análisis (el backend decide; 409 si ya tiene agente).
export async function asignarCaso(
  casoId: number,
  usuarioId: number
): Promise<CasoCreado> {
  const response = await fetch(`${API_URL}/api/casos/${casoId}/asignar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId }),
  });

  if (!response.ok) {
    let error = "No se pudo asignar el caso";
    let detalles: string[] = [];
    try {
      const data = (await response.json()) as {
        error?: string;
        detalles?: string[];
      };
      if (data.error) error = data.error;
      if (Array.isArray(data.detalles)) detalles = data.detalles;
    } catch {
      // Respuesta no JSON: se usa el mensaje genérico.
    }
    throw new ApiError(response.status, error, detalles);
  }

  return response.json() as Promise<CasoCreado>;
}

// HU-08 · Historial de solo lectura, orden cronológico (lo ordena el BACK).
// El solicitante solo ve sus casos (404 si es ajeno); los demás roles ven todo.
export interface HistorialEvento {
  id: number;
  caso_id: number;
  evento: string;
  estado_anterior: string | null;
  estado_nuevo: string | null;
  usuario_id: number;
  usuario: string;
  fecha: string;
  detalle: string | null;
}

export function obtenerHistorial(
  casoId: number,
  usuarioId: number
): Promise<HistorialEvento[]> {
  const params = new URLSearchParams();
  params.set("usuario_id", String(usuarioId));
  return getJson<HistorialEvento[]>(
    `/api/casos/${casoId}/historial?${params.toString()}`
  );
}

// HU-06 · Diagnóstico obligatorio (≥10), solución opcional (si va, ≥10).
// Solo el agente asignado en un caso En atención (el backend decide).
export interface Atencion {
  id: number;
  caso_id: number;
  diagnostico: string;
  solucion: string | null;
  fecha: string;
  agente_id: number;
  agente: string;
}

export function obtenerAtenciones(
  casoId: number,
  usuarioId: number
): Promise<Atencion[]> {
  const params = new URLSearchParams();
  params.set("usuario_id", String(usuarioId));
  return getJson<Atencion[]>(
    `/api/casos/${casoId}/atenciones?${params.toString()}`
  );
}

export async function registrarAtencion(
  casoId: number,
  payload: { usuario_id: number; diagnostico: string; solucion?: string }
): Promise<Atencion> {
  const response = await fetch(`${API_URL}/api/casos/${casoId}/atenciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let error = "No se pudo registrar la atención";
    let detalles: string[] = [];
    try {
      const data = (await response.json()) as {
        error?: string;
        detalles?: string[];
      };
      if (data.error) error = data.error;
      if (Array.isArray(data.detalles)) detalles = data.detalles;
    } catch {
      // Respuesta no JSON: se usa el mensaje genérico.
    }
    throw new ApiError(response.status, error, detalles);
  }

  return response.json() as Promise<Atencion>;
}

// HU-07 · Solo En validación (filtro estado=, adelantado de HU-09).
// Aprobar → Cerrada + fecha_cierre; devolver (motivo ≥10) → En atención.
export function obtenerPorValidar(): Promise<CasoResumen[]> {
  const params = new URLSearchParams();
  params.set("estado", "En validación");
  return getJson<CasoResumen[]>(`/api/casos?${params.toString()}`);
}

export type AccionValidacion = "aprobar" | "devolver";

export async function validarCaso(
  casoId: number,
  payload: { usuario_id: number; accion: AccionValidacion; motivo?: string }
): Promise<CasoCreado> {
  const response = await fetch(`${API_URL}/api/casos/${casoId}/validacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let error = "No se pudo validar el caso";
    let detalles: string[] = [];
    try {
      const data = (await response.json()) as {
        error?: string;
        detalles?: string[];
      };
      if (data.error) error = data.error;
      if (Array.isArray(data.detalles)) detalles = data.detalles;
    } catch {
      // Respuesta no JSON: se usa el mensaje genérico.
    }
    throw new ApiError(response.status, error, detalles);
  }

  return response.json() as Promise<CasoCreado>;
}

// HU-10 · Todo calculado en SQL sobre datos reales (regla 1). Promedios en
// horas con un decimal; null sin datos (regla 4 → "Sin datos").
export interface Indicadores {
  total: number;
  por_estado: { estado: string; total: number }[];
  por_tipo: { tipo: string; total: number }[];
  por_prioridad: { prioridad: string; total: number }[];
  por_area: { area_id: number; area: string; total: number }[];
  tiempos: {
    promedio_horas_asignacion: number | null;
    casos_asignados: number;
    promedio_horas_cierre: number | null;
    casos_cerrados: number;
  };
}

export function obtenerIndicadores(): Promise<Indicadores> {
  return getJson<Indicadores>("/api/indicadores");
}

// HU-11 · Gestión de categorías (solo administrador activo). PUT reemplaza
// nombre y descripción: si no se envía descripcion queda en NULL, así que el
// formulario de edición siempre envía ambas aunque solo cambie el nombre.
export interface CategoriaAdmin {
  id: number;
  area_id: number;
  area: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
}

export function listarCategoriasTodas(): Promise<CategoriaAdmin[]> {
  return getJson<CategoriaAdmin[]>("/api/categorias?todas=1");
}

async function mutarCategoria<T>(
  metodo: string,
  path: string,
  payload: object,
  mensaje: string
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let error = mensaje;
    let detalles: string[] = [];
    try {
      const data = (await response.json()) as {
        error?: string;
        detalles?: string[];
      };
      if (data.error) error = data.error;
      if (Array.isArray(data.detalles)) detalles = data.detalles;
    } catch {
      // Respuesta no JSON: se usa el mensaje genérico.
    }
    throw new ApiError(response.status, error, detalles);
  }
  return response.json() as Promise<T>;
}

export function crearCategoria(payload: {
  usuario_id: number;
  area_id: number;
  nombre: string;
  descripcion?: string;
}): Promise<CategoriaAdmin> {
  return mutarCategoria<CategoriaAdmin>(
    "POST",
    "/api/categorias",
    payload,
    "No se pudo crear la categoría"
  );
}

export function editarCategoria(
  id: number,
  payload: { usuario_id: number; nombre: string; descripcion: string }
): Promise<CategoriaAdmin> {
  return mutarCategoria<CategoriaAdmin>(
    "PUT",
    `/api/categorias/${id}`,
    payload,
    "No se pudo editar la categoría"
  );
}

export function cambiarActivaCategoria(
  id: number,
  payload: { usuario_id: number; activa: boolean }
): Promise<CategoriaAdmin> {
  return mutarCategoria<CategoriaAdmin>(
    "PATCH",
    `/api/categorias/${id}`,
    payload,
    "No se pudo cambiar el estado de la categoría"
  );
}
