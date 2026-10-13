import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  listarCategoriasTodas,
  crearCategoria,
  editarCategoria,
  cambiarActivaCategoria,
  obtenerAreas,
  ApiError,
} from "../api/client";
import type { Area, CategoriaAdmin } from "../api/client";
import { useUsuario } from "../context/UsuarioContext";

const NOMBRE_MINIMO = 3;

function Categorias() {
  const { usuario } = useUsuario();
  const [categorias, setCategorias] = useState<CategoriaAdmin[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [procesando, setProcesando] = useState(false);

  const [nuevaArea, setNuevaArea] = useState<number | "">("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  const esAdmin = usuario?.rol === "administrador";

  async function cargar() {
    try {
      setCargando(true);
      setError("");
      const [cats, listaAreas] = await Promise.all([
        listarCategoriasTodas(),
        obtenerAreas(),
      ]);
      setCategorias(cats);
      setAreas(listaAreas);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setError("No se pudieron cargar las categorías.");
      setCategorias([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function mostrarError(err: unknown, defecto: string) {
    const mensaje =
      err instanceof ApiError
        ? [err.message, ...err.detalles].filter(Boolean).join(" ")
        : defecto;
    // Lección del DEF-02: el error va encima de la lista, sin ocultarla.
    setAviso(mensaje);
  }

  async function handleCrear(event: FormEvent) {
    event.preventDefault();
    if (!usuario || nuevaArea === "") return;
    setProcesando(true);
    setAviso("");
    try {
      await crearCategoria({
        usuario_id: usuario.id,
        area_id: Number(nuevaArea),
        nombre: nuevoNombre.trim(),
        ...(nuevaDescripcion.trim() === ""
          ? {}
          : { descripcion: nuevaDescripcion.trim() }),
      });
      setNuevaArea("");
      setNuevoNombre("");
      setNuevaDescripcion("");
      await cargar();
    } catch (err) {
      console.error("Error creando categoría:", err);
      mostrarError(err, "No se pudo crear la categoría.");
    } finally {
      setProcesando(false);
    }
  }

  function empezarEdicion(cat: CategoriaAdmin) {
    // Auditoría #103: precargar nombre y descripción actuales, porque PUT
    // reemplaza ambas (sin descripcion quedaría en NULL).
    setEditandoId(cat.id);
    setEditNombre(cat.nombre);
    setEditDescripcion(cat.descripcion ?? "");
    setAviso("");
  }

  async function handleEditar(event: FormEvent, cat: CategoriaAdmin) {
    event.preventDefault();
    if (!usuario) return;
    setProcesando(true);
    setAviso("");
    try {
      await editarCategoria(cat.id, {
        usuario_id: usuario.id,
        nombre: editNombre.trim(),
        // Siempre se envía, aunque solo cambie el nombre.
        descripcion: editDescripcion.trim(),
      });
      setEditandoId(null);
      await cargar();
    } catch (err) {
      console.error(`Error editando categoría ${cat.id}:`, err);
      mostrarError(err, "No se pudo editar la categoría.");
    } finally {
      setProcesando(false);
    }
  }

  async function handleActiva(cat: CategoriaAdmin) {
    if (!usuario) return;
    setProcesando(true);
    setAviso("");
    try {
      await cambiarActivaCategoria(cat.id, {
        usuario_id: usuario.id,
        activa: !cat.activa,
      });
      await cargar();
    } catch (err) {
      console.error(`Error cambiando estado de ${cat.id}:`, err);
      mostrarError(err, "No se pudo cambiar el estado.");
    } finally {
      setProcesando(false);
    }
  }

  const porArea = areas.map((a) => ({
    area: a,
    items: categorias.filter((c) => c.area_id === a.id),
  }));
  const sinArea = categorias.filter(
    (c) => !areas.some((a) => a.id === c.area_id)
  );

  const nombreCrearValido = nuevoNombre.trim().length >= NOMBRE_MINIMO;

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Categorías</h2>

      <p className="mt-2 text-slate-500">
        Crea, edita y activa o desactiva las categorías de soporte por área.
      </p>

      {usuario && !esAdmin && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Solo un administrador activo gestiona categorías (el backend lo
          exige).
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900">Crear categoría</h3>
        <form
          onSubmit={handleCrear}
          className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div>
            <label
              htmlFor="nueva-area"
              className="text-sm font-semibold text-slate-700"
            >
              Área
            </label>
            <select
              id="nueva-area"
              value={nuevaArea}
              onChange={(e) =>
                setNuevaArea(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="nuevo-nombre"
              className="text-sm font-semibold text-slate-700"
            >
              Nombre (mínimo {NOMBRE_MINIMO})
            </label>
            <input
              id="nuevo-nombre"
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              maxLength={100}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="nueva-descripcion"
              className="text-sm font-semibold text-slate-700"
            >
              Descripción (opcional)
            </label>
            <input
              id="nueva-descripcion"
              type="text"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              maxLength={255}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={
                !esAdmin || nuevaArea === "" || !nombreCrearValido || procesando
              }
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {procesando ? "Guardando…" : "Crear categoría"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {aviso && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {aviso}
          </div>
        )}
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando categorías…</p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {porArea.map(({ area, items }) => (
              <div key={area.id}>
                <h3 className="font-bold text-slate-900">{area.nombre}</h3>
                {items.length === 0 ? (
                  <p className="mt-1 text-sm text-slate-400">
                    Sin categorías en esta área.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {items.map((cat) => (
                      <li
                        key={cat.id}
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        {editandoId === cat.id ? (
                          <form
                            onSubmit={(e) => handleEditar(e, cat)}
                            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                          >
                            <div>
                              <label
                                htmlFor={`edit-nombre-${cat.id}`}
                                className="text-sm font-semibold text-slate-700"
                              >
                                Nombre
                              </label>
                              <input
                                id={`edit-nombre-${cat.id}`}
                                type="text"
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                                maxLength={100}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`edit-desc-${cat.id}`}
                                className="text-sm font-semibold text-slate-700"
                              >
                                Descripción
                              </label>
                              <input
                                id={`edit-desc-${cat.id}`}
                                type="text"
                                value={editDescripcion}
                                onChange={(e) =>
                                  setEditDescripcion(e.target.value)
                                }
                                maxLength={255}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2 sm:col-span-2">
                              <button
                                type="submit"
                                disabled={
                                  !esAdmin ||
                                  editNombre.trim().length < NOMBRE_MINIMO ||
                                  procesando
                                }
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditandoId(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {cat.nombre}{" "}
                                <span
                                  className={`ml-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${cat.activa ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}
                                >
                                  {cat.activa ? "Activa" : "Inactiva"}
                                </span>
                              </p>
                              {cat.descripcion && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {cat.descripcion}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={!esAdmin || procesando}
                                onClick={() => empezarEdicion(cat)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                disabled={!esAdmin || procesando}
                                onClick={() => handleActiva(cat)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                              >
                                {cat.activa ? "Desactivar" : "Activar"}
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {sinArea.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900">Sin área</h3>
                <p className="text-sm text-slate-500">
                  {sinArea.length} categorías sin área conocida.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Categorias;
