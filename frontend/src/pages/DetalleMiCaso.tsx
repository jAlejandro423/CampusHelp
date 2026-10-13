import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerDetalle, ApiError } from "../api/client";
import type { DetalleCaso } from "../api/client";
import { useUsuario } from "../context/UsuarioContext";
import {
  colorEstado,
  colorPrioridad,
  formatearFecha,
} from "../components/badges";
import { HistorialContenido } from "../components/HistorialTimeline";

function fechaO(iso: string | null) {
  if (!iso) return "—";
  return formatearFecha(iso);
}

function DetalleMiCaso() {
  const { id } = useParams();
  const { usuario } = useUsuario();
  const [caso, setCaso] = useState<DetalleCaso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      if (!usuario) {
        setCargando(false);
        setError("No hay usuario activo para ver el detalle.");
        return;
      }
      // Un id no numérico (/mis-solicitudes/abc) no puede ser un caso.
      if (!/^[1-9]\d*$/.test(id ?? "")) {
        setCargando(false);
        setError("Caso no encontrado");
        setCaso(null);
        return;
      }
      try {
        setCargando(true);
        setError("");
        setCaso(await obtenerDetalle(Number(id), usuario.id));
      } catch (err) {
        console.error(`Error cargando detalle del caso ${id}:`, err);
        // DEF-03: "Caso no encontrado" solo ante 404; un 4xx muestra el
        // mensaje de la API, y un 5xx o un fallo de red, un texto genérico
        // (el 5xx trae el mensaje interno de la base de datos).
        if (err instanceof ApiError && err.status === 404) {
          setError("Caso no encontrado");
        } else if (err instanceof ApiError && err.status < 500) {
          setError(err.message);
        } else {
          setError("No se pudo cargar el caso. Intenta de nuevo.");
        }
        setCaso(null);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [id, usuario]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">
        Detalle del caso #{id}
      </h2>

      <div className="mt-4">
        <Link
          to="/mis-solicitudes"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          ← Volver
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando detalle…</p>
        ) : error || !caso ? (
          <p className="text-sm text-slate-500">
            {error || "Caso no encontrado"}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xl font-bold text-slate-900">{caso.titulo}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {caso.tipo} · {caso.area} / {caso.categoria}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-bold ${colorPrioridad(caso.prioridad)}`}
                >
                  {caso.prioridad}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${colorEstado(caso.estado)}`}
                >
                  {caso.estado}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-800">{caso.descripcion}</p>

            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-500">Solicitante</dt>
                <dd className="mt-1 text-slate-900">{caso.solicitante}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Agente</dt>
                <dd className="mt-1 text-slate-900">
                  {caso.agente ?? "Sin asignar"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Creado</dt>
                <dd className="mt-1 text-slate-900">
                  {fechaO(caso.fecha_creacion)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Asignado</dt>
                <dd className="mt-1 text-slate-900">
                  {fechaO(caso.fecha_asignacion)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Cierre</dt>
                <dd className="mt-1 text-slate-900">
                  {fechaO(caso.fecha_cierre)}
                </dd>
              </div>
            </dl>

            <h3 className="mt-6 font-bold text-slate-900">
              Atenciones ({caso.atenciones.length})
            </h3>
            {caso.atenciones.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                Aún no hay atenciones registradas
              </p>
            ) : (
              <ul className="mt-2 space-y-3">
                {caso.atenciones.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-slate-200 p-3 text-sm"
                  >
                    <p className="font-semibold text-slate-800">Diagnóstico</p>
                    <p className="mt-1 text-slate-700">{a.diagnostico}</p>
                    {a.solucion && (
                      <>
                        <p className="mt-2 font-semibold text-slate-800">
                          Solución
                        </p>
                        <p className="mt-1 text-slate-700">{a.solucion}</p>
                      </>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      {a.agente} · {formatearFecha(a.fecha)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mt-6 font-bold text-slate-900">Historial</h3>
            <HistorialContenido casoId={caso.id} />
          </>
        )}
      </div>
    </div>
  );
}

export default DetalleMiCaso;
