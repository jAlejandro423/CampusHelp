import { useEffect, useState } from "react";
import { obtenerIndicadores } from "../api/client";
import type { Indicadores } from "../api/client";

function Barra({ valor, maximo }: { valor: number; maximo: number }) {
  const ancho = maximo > 0 ? Math.round((valor / maximo) * 100) : 0;
  return (
    <div className="h-2 flex-1 rounded-full bg-slate-100">
      <div
        className="h-2 rounded-full bg-blue-500"
        style={{ width: `${ancho}%` }}
      />
    </div>
  );
}

function Grupo({
  titulo,
  filas,
}: {
  titulo: string;
  filas: { etiqueta: string; total: number }[];
}) {
  const maximo = Math.max(0, ...filas.map((f) => f.total));
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <h3 className="font-bold text-slate-900">{titulo}</h3>
      <ul className="mt-3 space-y-2">
        {filas.map((f) => (
          <li key={f.etiqueta} className="flex items-center gap-3 text-sm">
            <span className="w-36 shrink-0 text-slate-600">{f.etiqueta}</span>
            <Barra valor={f.total} maximo={maximo} />
            <span className="w-8 text-right font-semibold text-slate-800">
              {f.total}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tarjeta({
  titulo,
  valor,
  detalle,
}: {
  titulo: string;
  valor: string;
  detalle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">{titulo}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{valor}</p>
      <p className="mt-1 text-xs text-slate-500">{detalle}</p>
    </div>
  );
}

function Dashboard() {
  const [datos, setDatos] = useState<Indicadores | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    try {
      setCargando(true);
      setError("");
      setDatos(await obtenerIndicadores());
    } catch (err) {
      console.error("Error cargando indicadores:", err);
      setError("No se pudieron cargar los indicadores.");
      setDatos(null);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">
        Dashboard de Indicadores
      </h2>

      <p className="mt-2 text-slate-500">
        Totales y tiempos promedio calculados sobre los datos reales.
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={cargar}
          disabled={cargando}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          {cargando ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {cargando && !datos ? (
          <p className="text-sm text-slate-500">Cargando indicadores…</p>
        ) : error || !datos ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error || "No se pudieron cargar los indicadores."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Tarjeta
                titulo="Total de casos"
                valor={String(datos.total)}
                detalle="Casos registrados en el sistema"
              />
              <Tarjeta
                titulo="Creación → asignación"
                valor={
                  datos.tiempos.promedio_horas_asignacion === null
                    ? "Sin datos"
                    : `${datos.tiempos.promedio_horas_asignacion.toFixed(1)} h`
                }
                detalle={`Sobre ${datos.tiempos.casos_asignados} casos asignados`}
              />
              <Tarjeta
                titulo="Creación → cierre"
                valor={
                  datos.tiempos.promedio_horas_cierre === null
                    ? "Sin datos"
                    : `${datos.tiempos.promedio_horas_cierre.toFixed(1)} h`
                }
                detalle={`Sobre ${datos.tiempos.casos_cerrados} casos cerrados`}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Grupo
                titulo="Por estado"
                filas={datos.por_estado.map((f) => ({
                  etiqueta: f.estado,
                  total: f.total,
                }))}
              />
              <Grupo
                titulo="Por tipo"
                filas={datos.por_tipo.map((f) => ({
                  etiqueta: f.tipo,
                  total: f.total,
                }))}
              />
              <Grupo
                titulo="Por prioridad"
                filas={datos.por_prioridad.map((f) => ({
                  etiqueta: f.prioridad,
                  total: f.total,
                }))}
              />
              <Grupo
                titulo="Por área"
                filas={datos.por_area.map((f) => ({
                  etiqueta: f.area,
                  total: f.total,
                }))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
