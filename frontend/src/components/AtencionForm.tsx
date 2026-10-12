import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  obtenerAtenciones,
  registrarAtencion,
  ApiError,
} from "../api/client";
import type { Atencion, CasoResumen } from "../api/client";
import { useUsuario } from "../context/UsuarioContext";
import { formatearFecha } from "./badges";

const TEXTO_MINIMO = 10;

interface Props {
  caso: CasoResumen;
  onClose: () => void;
  onSaved: () => void;
}

function AtencionForm({ caso, onClose, onSaved }: Props) {
  const { usuario } = useUsuario();
  const [previas, setPrevias] = useState<Atencion[]>([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [diagnostico, setDiagnostico] = useState("");
  const [solucion, setSolucion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [detalles, setDetalles] = useState<string[]>([]);

  const esAsignado = usuario !== null && usuario.id === caso.agente_id;

  useEffect(() => {
    async function cargar() {
      if (!usuario) {
        setCargandoLista(false);
        return;
      }
      try {
        setCargandoLista(true);
        const data = await obtenerAtenciones(caso.id, usuario.id);
        setPrevias(data);
      } catch (err) {
        console.error(`Error cargando atenciones del caso ${caso.id}:`, err);
        setPrevias([]);
      } finally {
        setCargandoLista(false);
      }
    }

    cargar();
  }, [caso.id, usuario]);

  const diagnosticoLimpio = diagnostico.trim();
  const solucionLimpia = solucion.trim();
  const diagnosticoValido = diagnosticoLimpio.length >= TEXTO_MINIMO;
  const solucionValida =
    solucionLimpia === "" || solucionLimpia.length >= TEXTO_MINIMO;
  const puedeEnviar =
    esAsignado && diagnosticoValido && solucionValida && !enviando;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!puedeEnviar || !usuario) return;
    setEnviando(true);
    setError("");
    setDetalles([]);
    try {
      await registrarAtencion(caso.id, {
        usuario_id: usuario.id,
        diagnostico: diagnosticoLimpio,
        ...(solucionLimpia === "" ? {} : { solucion: solucionLimpia }),
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(`Error registrando atención del caso ${caso.id}:`, err);
      if (err instanceof ApiError) {
        setError(err.message);
        setDetalles(err.detalles);
      } else {
        setError("No se pudo registrar la atención. Intenta de nuevo.");
        setDetalles([]);
      }
    } finally {
      setEnviando(false);
    }
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Registrar atención · Caso #{caso.id}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{caso.titulo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>

        {!esAsignado && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Solo el agente asignado registra la atención.
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700">
            Atenciones previas ({previas.length})
          </h4>
          {cargandoLista ? (
            <p className="mt-2 text-sm text-slate-500">Cargando…</p>
          ) : previas.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">
              Aún no hay atenciones registradas.
            </p>
          ) : (
            <ul className="mt-2 space-y-3">
              {previas.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-slate-200 p-3 text-sm"
                >
                  <p className="font-semibold text-slate-800">
                    Diagnóstico
                  </p>
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
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">{error}</p>
            {detalles.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
                {detalles.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="diagnostico"
                className="text-sm font-semibold text-slate-700"
              >
                Diagnóstico (obligatorio)
              </label>
              <span
                className={`text-xs ${diagnosticoValido ? "text-slate-400" : "text-red-600"}`}
              >
                {diagnosticoLimpio.length} / mínimo {TEXTO_MINIMO}
              </span>
            </div>
            <textarea
              id="diagnostico"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              rows={3}
              disabled={!esAsignado}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="solucion"
                className="text-sm font-semibold text-slate-700"
              >
                Solución (opcional)
              </label>
              <span
                className={`text-xs ${solucionValida ? "text-slate-400" : "text-red-600"}`}
              >
                {solucionLimpia === ""
                  ? "vacía: se guarda solo diagnóstico"
                  : `${solucionLimpia.length} / mínimo ${TEXTO_MINIMO}`}
              </span>
            </div>
            <textarea
              id="solucion"
              value={solucion}
              onChange={(e) => setSolucion(e.target.value)}
              rows={3}
              disabled={!esAsignado}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={!puedeEnviar}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Guardando…" : "Guardar atención"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          No cambia el estado. Para enviar a validación usa “Pasar a En
          validación” (exige una atención con solución).
        </p>
      </div>
    </div>
  );
}

export default AtencionForm;
