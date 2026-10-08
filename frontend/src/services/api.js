const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerUsuarios(rol) {
  const url = rol
    ? `${API_URL}/api/usuarios?rol=${rol}`
    : `${API_URL}/api/usuarios`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los usuarios");
  }

  return response.json();
}

export async function obtenerAreas() {
  const response = await fetch(`${API_URL}/api/areas`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las áreas");
  }

  return response.json();
}

export async function obtenerCategorias(areaId) {
  const url = areaId
    ? `${API_URL}/api/categorias?area_id=${areaId}`
    : `${API_URL}/api/categorias`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }

  return response.json();
}