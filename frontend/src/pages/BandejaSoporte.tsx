import { useEffect, useState } from "react";
import { obtenerBandeja } from "../api/client";
import type { CasoResumen } from "../api/client";
import {
  colorEstado,
  colorPrioridad,
  formatearFecha,
} from "../components/badges";

function BandejaSoporte() {
  const [casos, setCasos] = useState<CasoResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    cargar();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Bandeja de Soporte</h2>

      <p className="mt-2 text-slate-500">
        Casos abiertos ordenados por prioridad (P1 primero).
      </p>

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
                  <th className="py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso) => (
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
                    <td className="py-3 text-slate-500">
                      {formatearFecha(caso.fecha_creacion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BandejaSoporte;
