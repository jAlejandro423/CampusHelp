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
