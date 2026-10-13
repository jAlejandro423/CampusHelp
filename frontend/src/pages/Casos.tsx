import { useEffect, useState } from "react";
import {
  filtrarCasos,
  obtenerAreas,
  obtenerCategorias,
  ApiError,
} from "../api/client";
import type { Area, CasoResumen, Categoria } from "../api/client";
import {
  colorEstado,
  colorPrioridad,
  formatearFecha,
} from "../components/badges";
import HistorialTimeline from "../components/HistorialTimeline";

const ESTADOS = ["Pendiente", "En análisis", "En atención", "En validación", "Cerrada"];
const TIPOS = ["Incidente", "Solicitud"];
const PRIORIDADES = ["P1", "P2", "P3"];

function Casos() {
  const [casos, setCasos] = useState<CasoResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [detalles, setDetalles] = useState<string[]>([]);
  const [historialId, setHistorialId] = useState<number | null>(null);

  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [areaId, setAreaId] = useState<number | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [prioridad, setPrioridad] = useState("");

  const [areas, setAreas] = useState<Area[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    obtenerAreas().then(setAreas).catch(() => setAreas([]));
  }, []);

  useEffect(() => {
    if (areaId === "") {
      setCategorias([]);
      return;
    }
    obtenerCategorias(Number(areaId))
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, [areaId]);

  // R3: cada cambio vuelve a pedir la lista al backend (sin filtrar en memoria).
  useEffect(() => {
    async function buscar() {
      try {
        setCargando(true);
        setError("");
        setDetalles([]);
        const data = await filtrarCasos({
          ...(estado ? { estado } : {}),
          ...(tipo ? { tipo } : {}),
          ...(areaId !== "" ? { area_id: areaId } : {}),
          ...(categoriaId !== "" ? { categoria_id: categoriaId } : {}),
          ...(prioridad ? { prioridad } : {}),
        });
        setCasos(data);
      } catch (err) {
        console.error("Error filtrando casos:", err);
        if (err instanceof ApiError) {
          setError(err.message);
          setDetalles(err.detalles);
        } else {
          setError("No se pudieron cargar los casos.");
          setDetalles([]);
        }
        setCasos([]);
      } finally {
        setCargando(false);
      }
    }

    buscar();
  }, [estado, tipo, areaId, categoriaId, prioridad]);

  function handleLimpiar() {
    setEstado("");
    setTipo("");
    setAreaId("");
    setCategoriaId("");
    setPrioridad("");
  }

  const hayFiltros =
    estado !== "" ||
    tipo !== "" ||
    areaId !== "" ||
    categoriaId !== "" ||
    prioridad !== "";

  const selectClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60";

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Casos</h2>

      <p className="mt-2 text-slate-500">
        Filtra los casos por estado, tipo, área, categoría y prioridad.
      </p>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="f-estado" className="text-sm font-semibold text-slate-700">
              Estado
            </label>
            <select
              id="f-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={selectClass}
            >
              <option value="">Todos</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-tipo" className="text-sm font-semibold text-slate-700">
              Tipo
            </label>
            <select
              id="f-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={selectClass}
            >
              <option value="">Todos</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t === "Solicitud" ? "Solicitud de servicio" : t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-prioridad" className="text-sm font-semibold text-slate-700">
              Prioridad
            </label>
            <select
              id="f-prioridad"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              className={selectClass}
            >
              <option value="">Todas</option>
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-area" className="text-sm font-semibold text-slate-700">
              Área
            </label>
            <select
              id="f-area"
              value={areaId}
              onChange={(e) => {
                // La categoría depende del área: al cambiarla se reinicia.
                setAreaId(e.target.value === "" ? "" : Number(e.target.value));
                setCategoriaId("");
              }}
              className={selectClass}
            >
              <option value="">Todas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-categoria" className="text-sm font-semibold text-slate-700">
              Categoría
            </label>
            <select
              id="f-categoria"
              value={categoriaId}
              onChange={(e) =>
                setCategoriaId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              disabled={areaId === ""}
              className={selectClass}
            >
              <option value="">
                {areaId === "" ? "Elige primero un área" : "Todas"}
              </option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleLimpiar}
              disabled={!hayFiltros}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando casos…</p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">{error}</p>
            {detalles.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
                {detalles.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        ) : casos.length === 0 ? (
          <p className="text-sm text-slate-500">Sin resultados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Título</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Área</th>
                  <th className="py-2 pr-4">Categoría</th>
                  <th className="py-2 pr-4">Prioridad</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Solicitante</th>
                  <th className="py-2 pr-4">Agente</th>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2">Historial</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso) => (
                  <tr
                    key={caso.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-3 pr-4 font-semibold text-slate-800">
                      #{caso.id}
                    </td>
                    <td className="py-3 pr-4 text-slate-800">{caso.titulo}</td>
                    <td className="py-3 pr-4 text-slate-600">{caso.tipo}</td>
                    <td className="py-3 pr-4 text-slate-600">{caso.area}</td>
                    <td className="py-3 pr-4 text-slate-600">{caso.categoria}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${colorPrioridad(caso.prioridad)}`}
                      >
                        {caso.prioridad}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${colorEstado(caso.estado)}`}
                      >
                        {caso.estado}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {caso.solicitante}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {caso.agente ?? "Sin asignar"}
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {formatearFecha(caso.fecha_creacion)}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => setHistorialId(caso.id)}
                        className="font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Ver historial
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {historialId !== null && (
        <HistorialTimeline
          casoId={historialId}
          onClose={() => setHistorialId(null)}
        />
      )}
    </div>
  );
}

export default Casos;
