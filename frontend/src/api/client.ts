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
