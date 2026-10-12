import { useEffect, useState } from "react";
import {
  obtenerBandeja,
  cambiarEstadoCaso,
  asignarCaso,
  transicionesValidas,
  ApiError,
} from "../api/client";
import type { CasoResumen } from "../api/client";
import { useUsuario } from "../context/UsuarioContext";
import {
  colorEstado,
  colorPrioridad,
  formatearFecha,
} from "../components/badges";

function BandejaSoporte() {
  const { usuario } = useUsuario();
  const [casos, setCasos] = useState<CasoResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cambiandoId, setCambiandoId] = useState<number | null>(null);
  const [asignandoId, setAsignandoId] = useState<number | null>(null);
  const [errorFila, setErrorFila] = useState<Record<number, string>>({});

  async function cargar() {
    try {
      setCargando(true);
      setError("");
      const data = await obtenerBandeja();
      setCasos(data);
    } catch (err) {
      console.error("Error cargando bandeja:", err);
      setError("No se pudo cargar la bandeja. Intenta de nuevo.");
      setCasos([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleCambiarEstado(caso: CasoResumen, nuevoEstado: string) {
    if (!usuario) {
      setErrorFila((prev) => ({
        ...prev,
        [caso.id]: "No hay usuario activo para cambiar el estado.",
      }));
      return;
    }
    setCambiandoId(caso.id);
    setErrorFila((prev) => ({ ...prev, [caso.id]: "" }));
    try {
      const actualizado = await cambiarEstadoCaso(
        caso.id,
        nuevoEstado,
        usuario.id
      );
      // La bandeja excluye Cerrada y el BACK reordena; se recarga para
      // reflejar el orden real y el historial (HU-05 E1).
      if (actualizado.estado === "Cerrada") {
        setCasos((prev) => prev.filter((c) => c.id !== caso.id));
      } else {
        await cargar();
      }
    } catch (err) {
      console.error(`Error cambiando estado del caso ${caso.id}:`, err);
      const mensaje =
        err instanceof ApiError
          ? [err.message, ...err.detalles].filter(Boolean).join(" ")
          : "No se pudo cambiar el estado. Intenta de nuevo.";
      setErrorFila((prev) => ({ ...prev, [caso.id]: mensaje }));
      // Se recarga la fila para mostrar el estado real del servidor.
      await cargar();
    } finally {
      setCambiandoId(null);
    }
  }

  async function handleAsignarme(caso: CasoResumen) {
    if (!usuario) {
      setErrorFila((prev) => ({
        ...prev,
        [caso.id]: "No hay usuario activo para asignar el caso.",
      }));
      return;
    }
    setAsignandoId(caso.id);
    setErrorFila((prev) => ({ ...prev, [caso.id]: "" }));
    try {
      await asignarCaso(caso.id, usuario.id);
      // Pendiente pasa a En análisis; se recarga para reflejar agente,
      // estado y orden reales (HU-04 E1/E3).
      await cargar();
    } catch (err) {
      console.error(`Error asignando caso ${caso.id}:`, err);
      const mensaje =
        err instanceof ApiError
          ? [err.message, ...err.detalles].filter(Boolean).join(" ")
          : "No se pudo asignar el caso. Intenta de nuevo.";
      setErrorFila((prev) => ({ ...prev, [caso.id]: mensaje }));
      await cargar();
    } finally {
      setAsignandoId(null);
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Bandeja de Soporte</h2>

      <p className="mt-2 text-slate-500">
        Casos abiertos ordenados por prioridad (P1 primero).
      </p>

      {usuario && usuario.rol !== "agente" && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Solo un usuario con rol agente puede cambiar el estado o asignarse
          casos (el backend lo exige).
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando bandeja…</p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : casos.length === 0 ? (
          <p className="text-sm text-slate-500">No hay casos pendientes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Título</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Área / Categoría</th>
                  <th className="py-2 pr-4">Solicitante</th>
                  <th className="py-2 pr-4">Prioridad</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Agente</th>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso) => {
                  const acciones = transicionesValidas(caso.estado);
                  const puedeAsignarse =
                    caso.agente_id === null &&
                    (caso.estado === "Pendiente" ||
                      caso.estado === "En análisis");
                  const ocupado =
                    cambiandoId === caso.id || asignandoId === caso.id;
                  return (
                    <tr
                      key={caso.id}
                      className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${
                        caso.prioridad === "P1"
                          ? "border-l-4 border-l-red-500"
                          : ""
                      }`}
                    >
                      <td className="py-3 pr-4 font-semibold text-slate-800">
                        #{caso.id}
                      </td>
                      <td className="py-3 pr-4 text-slate-800">{caso.titulo}</td>
                      <td className="py-3 pr-4 text-slate-600">{caso.tipo}</td>
                      <td className="py-3 pr-4 text-slate-600">
                        {caso.area} / {caso.categoria}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {caso.solicitante}
                      </td>
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
                        {caso.agente ?? "Sin asignar"}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {formatearFecha(caso.fecha_creacion)}
                      </td>
                      <td className="py-3">
                        {!puedeAsignarse && acciones.length === 0 ? (
                          <span className="text-xs text-slate-400">
                            Sin acciones
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {puedeAsignarse && (
                              <button
                                type="button"
                                disabled={ocupado}
                                onClick={() => handleAsignarme(caso)}
                                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                              >
                                {asignandoId === caso.id
                                  ? "Asignando…"
                                  : "Asignarme"}
                              </button>
                            )}
                            {acciones.map((siguiente) => (
                              <button
                                key={siguiente}
                                type="button"
                                disabled={ocupado}
                                onClick={() =>
                                  handleCambiarEstado(caso, siguiente)
                                }
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                              >
                                {cambiandoId === caso.id
                                  ? "Cambiando…"
                                  : `Pasar a ${siguiente}`}
                              </button>
                            ))}
                            {errorFila[caso.id] && (
                              <p className="max-w-[220px] text-xs text-red-600">
                                {errorFila[caso.id]}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BandejaSoporte;
