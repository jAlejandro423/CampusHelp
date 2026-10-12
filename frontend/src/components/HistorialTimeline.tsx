import { useEffect, useState } from "react";
import { obtenerHistorial } from "../api/client";
import type { HistorialEvento } from "../api/client";
import { useUsuario } from "../context/UsuarioContext";
import { colorEstado, formatearFecha } from "./badges";

function textoEvento(evento: HistorialEvento): string {
  switch (evento.evento) {
    case "creacion":
      return "Caso registrado";
    case "asignacion":
      return "Agente asignado";
    case "cambio_estado":
      return "Cambio de estado";
    case "atencion":
      return "Atención registrada";
    case "envio_validacion":
      return "Enviado a validación";
    case "devolucion":
      return `Devuelto${evento.detalle ? `: ${evento.detalle}` : ""}`;
    case "cierre":
      return "Caso cerrado";
    default:
      return evento.evento;
  }
}

interface Props {
  casoId: number;
  onClose: () => void;
}

function HistorialTimeline({ casoId, onClose }: Props) {
  const { usuario } = useUsuario();
  const [eventos, setEventos] = useState<HistorialEvento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      if (!usuario) {
        setError("No hay usuario activo para consultar el historial.");
        setCargando(false);
        return;
      }
      try {
        setCargando(true);
        setError("");
        const data = await obtenerHistorial(casoId, usuario.id);
        setEventos(data);
      } catch (err) {
        console.error(`Error cargando historial del caso ${casoId}:`, err);
        setError("No se pudo cargar el historial del caso.");
        setEventos([]);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [casoId, usuario]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            Historial del caso #{casoId}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>

        {cargando ? (
          <p className="mt-4 text-sm text-slate-500">Cargando historial…</p>
        ) : error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : eventos.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Este caso aún no tiene eventos.
          </p>
        ) : (
          <ol className="mt-4 space-y-4 border-l-2 border-slate-200 pl-4">
            {eventos.map((evento) => (
              <li key={evento.id}>
                <p className="text-sm font-semibold text-slate-900">
                  {textoEvento(evento)}
                </p>
                {(evento.estado_anterior || evento.estado_nuevo) && (
                  <p className="mt-1 flex flex-wrap items-center gap-1 text-xs">
                    {evento.estado_anterior && (
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold ${colorEstado(evento.estado_anterior)}`}
                      >
                        {evento.estado_anterior}
                      </span>
                    )}
                    {evento.estado_anterior && evento.estado_nuevo && (
                      <span className="text-slate-400">→</span>
                    )}
                    {evento.estado_nuevo && (
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold ${colorEstado(evento.estado_nuevo)}`}
                      >
                        {evento.estado_nuevo}
                      </span>
                    )}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {evento.usuario} · {formatearFecha(evento.fecha)}
                </p>
                {evento.detalle &&
                  evento.evento !== "devolucion" && (
                    <p className="mt-1 text-xs text-slate-600">
                      {evento.detalle}
                    </p>
                  )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default HistorialTimeline;
