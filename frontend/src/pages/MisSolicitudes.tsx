import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";
import { obtenerMisCasos } from "../api/client";
import type { CasoResumen } from "../api/client";
import {
  colorEstado,
  colorPrioridad,
  formatearFecha,
} from "../components/badges";
import HistorialTimeline from "../components/HistorialTimeline";

function MisSolicitudes() {
  const { usuario } = useUsuario();
  const [casos, setCasos] = useState<CasoResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [historialId, setHistorialId] = useState<number | null>(null);

  useEffect(() => {
    async function cargar() {
      if (!usuario) {
        setCasos([]);
        setCargando(false);
        return;
      }
      try {
        setCargando(true);
        setError("");
        const data = await obtenerMisCasos(usuario.id);
        setCasos(data);
      } catch (err) {
        console.error("Error cargando mis casos:", err);
        setError("No se pudieron cargar tus casos. Intenta de nuevo.");
        setCasos([]);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [usuario]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Mis Solicitudes</h2>

      <p className="mt-2 text-slate-500">
        Consulta y realiza seguimiento a tus solicitudes.
      </p>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {!usuario ? (
          <p className="text-sm text-slate-500">
            No hay usuario activo para mostrar casos.
          </p>
        ) : cargando ? (
          <p className="text-sm text-slate-500">Cargando tus casos…</p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : casos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-semibold text-slate-700">
              Aún no tienes casos registrados.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Registra tu primer incidente o solicitud para verlo aquí.
            </p>
            <Link
              to="/crear-caso"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Registrar caso
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Título</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Área / Categoría</th>
                  <th className="py-2 pr-4">Prioridad</th>
                  <th className="py-2 pr-4">Estado</th>
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
                    <td className="py-3 pr-4 text-slate-600">
                      {caso.area} / {caso.categoria}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${colorPrioridad(caso.prioridad)}`}
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

export default MisSolicitudes;
