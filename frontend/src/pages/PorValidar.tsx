import { useEffect, useState } from "react";
import {
  obtenerPorValidar,
  obtenerAtenciones,
  validarCaso,
  ApiError,
} from "../api/client";
import type { CasoResumen } from "../api/client";
import { useUsuario } from "../context/UsuarioContext";
import { colorPrioridad, formatearFecha } from "../components/badges";
import HistorialTimeline from "../components/HistorialTimeline";

const MOTIVO_MINIMO = 10;

function PorValidar() {
  const { usuario } = useUsuario();
  const [casos, setCasos] = useState<CasoResumen[]>([]);
  const [soluciones, setSoluciones] = useState<Record<number, string>>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [errorFila, setErrorFila] = useState<Record<number, string>>({});
  const [motivoId, setMotivoId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState("");
  const [historialId, setHistorialId] = useState<number | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      setError("");
      const data = await obtenerPorValidar();
      setCasos(data);
      // Última solución de cada caso para que el validador la revise (E5).
      if (usuario) {
        const pares = await Promise.all(
          data.map(async (c) => {
            try {
              const atenciones = await obtenerAtenciones(c.id, usuario.id);
              const conSolucion = atenciones.filter(
                (a) => a.solucion && a.solucion.trim() !== ""
              );
              const ultima = conSolucion[conSolucion.length - 1];
              return [c.id, ultima?.solucion ?? ""] as [number, string];
            } catch {
              return [c.id, ""] as [number, string];
            }
          })
        );
        setSoluciones(Object.fromEntries(pares));
      }
    } catch (err) {
      console.error("Error cargando por validar:", err);
      setError("No se pudieron cargar los casos por validar.");
      setCasos([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleValidar(
    caso: CasoResumen,
    accion: "aprobar" | "devolver"
  ) {
    if (!usuario) {
      setErrorFila((prev) => ({
        ...prev,
        [caso.id]: "No hay usuario activo para validar.",
      }));
      return;
    }
    if (accion === "devolver" && motivo.trim().length < MOTIVO_MINIMO) {
      setErrorFila((prev) => ({
        ...prev,
        [caso.id]: `El motivo mínimo es de ${MOTIVO_MINIMO} caracteres.`,
      }));
      return;
    }
    setProcesandoId(caso.id);
    setErrorFila((prev) => ({ ...prev, [caso.id]: "" }));
    try {
      await validarCaso(caso.id, {
        usuario_id: usuario.id,
        accion,
        ...(accion === "devolver" ? { motivo: motivo.trim() } : {}),
      });
      setMotivoId(null);
      setMotivo("");
      await cargar();
    } catch (err) {
      console.error(`Error validando caso ${caso.id}:`, err);
      const mensaje =
        err instanceof ApiError
          ? [err.message, ...err.detalles].filter(Boolean).join(" ")
          : "No se pudo validar el caso. Intenta de nuevo.";
      setErrorFila((prev) => ({ ...prev, [caso.id]: mensaje }));
      await cargar();
    } finally {
      setProcesandoId(null);
    }
  }

  const esValidador = usuario?.rol === "validador";

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Por Validar</h2>

      <p className="mt-2 text-slate-500">
        Casos En validación con su solución: aprueba o devuelve con motivo.
      </p>

      {usuario && !esValidador && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Solo un usuario con rol validador puede aprobar o devolver (el
          backend lo exige).
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando casos…</p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : casos.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay casos pendientes de validación
          </p>
        ) : (
          <div className="space-y-4">
            {casos.map((caso) => (
              <div
                key={caso.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">
                      #{caso.id} · {caso.titulo}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {caso.area} / {caso.categoria} · Agente:{" "}
                      {caso.agente ?? "Sin asignar"} ·{" "}
                      {formatearFecha(caso.fecha_creacion)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${colorPrioridad(caso.prioridad)}`}
                  >
                    {caso.prioridad}
                  </span>
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Solución del agente
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {soluciones[caso.id] || "Cargando solución…"}
                  </p>
                </div>

                {errorFila[caso.id] && (
                  <p className="mt-2 text-xs text-red-600">
                    {errorFila[caso.id]}
                  </p>
                )}

                {motivoId === caso.id ? (
                  <div className="mt-3">
                    <label
                      htmlFor={`motivo-${caso.id}`}
                      className="text-sm font-semibold text-slate-700"
                    >
                      Motivo de devolución (mínimo {MOTIVO_MINIMO} caracteres)
                    </label>
                    <textarea
                      id={`motivo-${caso.id}`}
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={procesandoId === caso.id}
                        onClick={() => handleValidar(caso, "devolver")}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {procesandoId === caso.id
                          ? "Devolviendo…"
                          : "Confirmar devolución"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMotivoId(null);
                          setMotivo("");
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={procesandoId === caso.id}
                      onClick={() => handleValidar(caso, "aprobar")}
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {procesandoId === caso.id ? "Aprobando…" : "Aprobar"}
                    </button>
                    <button
                      type="button"
                      disabled={procesandoId === caso.id}
                      onClick={() => {
                        setMotivoId(caso.id);
                        setMotivo("");
                        setErrorFila((prev) => ({ ...prev, [caso.id]: "" }));
                      }}
                      className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      Devolver
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistorialId(caso.id)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-slate-50"
                    >
                      Ver historial
                    </button>
                  </div>
                )}
              </div>
            ))}
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

export default PorValidar;
