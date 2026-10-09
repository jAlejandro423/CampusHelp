import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerCasos } from "../api/client";
import type { CasoResumen } from "../api/client";

function DetalleCaso() {
  const { id } = useParams();
  const [caso, setCaso] = useState<CasoResumen | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setCargando(true);
        setError("");
        const casos = await obtenerCasos();
        const encontrado = casos.find((c) => c.id === Number(id));
        if (!encontrado) {
          setError("Caso no encontrado.");
          setCaso(null);
        } else {
          setCaso(encontrado);
        }
      } catch (err) {
        console.error("Error cargando detalle:", err);
        setError("No se pudo cargar el detalle del caso.");
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [id]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">
        Caso #{id}
      </h2>

      <p className="mt-2 text-slate-500">
        Detalle del caso (HU-03 · acceso desde la bandeja).
      </p>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando detalle…</p>
        ) : error || !caso ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error || "Caso no encontrado."}
          </div>
        ) : (
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-500">Título</dt>
              <dd className="mt-1 text-slate-900">{caso.titulo}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Tipo</dt>
              <dd className="mt-1 text-slate-900">{caso.tipo}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Área / Categoría</dt>
              <dd className="mt-1 text-slate-900">
                {caso.area} / {caso.categoria}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Prioridad</dt>
              <dd className="mt-1 text-slate-900">{caso.prioridad}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Estado</dt>
              <dd className="mt-1 text-slate-900">{caso.estado}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Agente</dt>
              <dd className="mt-1 text-slate-900">
                {caso.agente ?? "Sin asignar"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Solicitante</dt>
              <dd className="mt-1 text-slate-900">{caso.solicitante}</dd>
            </div>
          </dl>
        )}

        <p className="mt-6 text-xs text-slate-400">
          Acciones de asignar/atender/validar llegan con HU-04/HU-05 (#33).
        </p>

        <Link
          to="/bandeja-soporte"
          className="mt-4 inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Volver a la bandeja
        </Link>
      </div>
    </div>
  );
}

export default DetalleCaso;
