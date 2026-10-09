import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";
import {
  obtenerAreas,
  obtenerCategorias,
  crearCaso,
  ApiError,
} from "../api/client";
import type {
  Area,
  Categoria,
  TipoCaso,
  PrioridadCaso,
} from "../api/client";

const DESCRIPCION_MINIMA = 10;

function CrearCaso() {
  const { usuario } = useUsuario();

  const [tipo, setTipo] = useState<TipoCaso>("Incidente");
  const [areaId, setAreaId] = useState<number | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [prioridad, setPrioridad] = useState<PrioridadCaso>("P2");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [areas, setAreas] = useState<Area[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [errorCatalogos, setErrorCatalogos] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [detallesEnvio, setDetallesEnvio] = useState<string[]>([]);
  const [casoCreadoId, setCasoCreadoId] = useState<number | null>(null);

  // Cargar áreas al montar.
  useEffect(() => {
    async function cargarAreas() {
      try {
        setCargandoCatalogos(true);
        setErrorCatalogos("");
        const data = await obtenerAreas();
        setAreas(data);
      } catch (err) {
        console.error("Error cargando áreas:", err);
        setErrorCatalogos("No se pudieron cargar las áreas y categorías.");
      } finally {
        setCargandoCatalogos(false);
      }
    }

    cargarAreas();
  }, []);

  // Selects dependientes: al cambiar el área, recargar sus categorías.
  useEffect(() => {
    async function cargarCategorias() {
      if (areaId === "") {
        setCategorias([]);
        setCategoriaId("");
        return;
      }
      try {
        setErrorCatalogos("");
        const data = await obtenerCategorias(Number(areaId));
        setCategorias(data);
        // Si la categoría elegida ya no pertenece al área, limpiarla.
        setCategoriaId((prev) =>
          data.some((c) => c.id === prev) ? prev : ""
        );
      } catch (err) {
        console.error("Error cargando categorías:", err);
        setErrorCatalogos("No se pudieron cargar las categorías del área.");
        setCategorias([]);
      }
    }

    cargarCategorias();
  }, [areaId]);

  const descripcionLimpia = descripcion.trim();
  const descripcionValida = descripcionLimpia.length >= DESCRIPCION_MINIMA;
  const tituloValido = titulo.trim() !== "";
  const esSolicitante = usuario?.rol === "solicitante";

  const formularioValido =
    tituloValido &&
    descripcionValida &&
    areaId !== "" &&
    categoriaId !== "" &&
    usuario !== null &&
    esSolicitante &&
    !enviando;

  function resetFormulario() {
    setTipo("Incidente");
    setAreaId("");
    setCategoriaId("");
    setPrioridad("P2");
    setTitulo("");
    setDescripcion("");
    setErrorEnvio("");
    setDetallesEnvio([]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!formularioValido || usuario === null) return;

    setEnviando(true);
    setErrorEnvio("");
    setDetallesEnvio([]);
    setCasoCreadoId(null);

    try {
      const caso = await crearCaso({
        tipo,
        titulo: titulo.trim(),
        descripcion: descripcionLimpia,
        prioridad,
        usuario_id: usuario.id,
        categoria_id: Number(categoriaId),
        area_id: Number(areaId),
      });
      setCasoCreadoId(caso.id);
      resetFormularioCampos();
    } catch (err) {
      console.error("Error registrando caso:", err);
      if (err instanceof ApiError) {
        setErrorEnvio(err.message);
        setDetallesEnvio(err.detalles);
      } else {
        setErrorEnvio("No se pudo registrar el caso. Intenta de nuevo.");
        setDetallesEnvio([]);
      }
    } finally {
      setEnviando(false);
    }
  }

  function resetFormularioCampos() {
    setTipo("Incidente");
    setAreaId("");
    setCategoriaId("");
    setPrioridad("P2");
    setTitulo("");
    setDescripcion("");
  }

  function handleRegistrarOtro() {
    setCasoCreadoId(null);
    setErrorEnvio("");
    setDetallesEnvio([]);
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Crear Caso</h2>

      <p className="mt-2 text-slate-500">
        Registra una nueva solicitud de soporte tecnológico.
      </p>

      {usuario && !esSolicitante && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Solo un usuario con rol solicitante puede registrar casos. Cambia el
          usuario activo a un solicitante para continuar.
        </div>
      )}

      {errorCatalogos && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorCatalogos}
        </div>
      )}

      {errorEnvio && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">{errorEnvio}</p>
          {detallesEnvio.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
              {detallesEnvio.map((detalle) => (
                <li key={detalle}>{detalle}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {casoCreadoId !== null && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
          <p className="text-lg font-bold text-green-800">
            ¡Caso #{casoCreadoId} registrado con éxito!
          </p>
          <p className="mt-1 text-sm text-green-700">
            Quedó en estado Pendiente y ya aparece en la bandeja.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/mis-solicitudes"
              className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Ir a Mis Solicitudes
            </Link>
            <button
              type="button"
              onClick={handleRegistrarOtro}
              className="rounded-xl border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
            >
              Registrar otro caso
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
      >
        {/* Tipo */}
        <fieldset>
          <legend className="text-sm font-semibold text-slate-700">
            Tipo
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                { value: "Incidente", desc: "Falla o degradación del servicio" },
                { value: "Solicitud", desc: "Petición de un servicio" },
              ] as { value: TipoCaso; desc: string }[]
            ).map((opcion) => (
              <label
                key={opcion.value}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  tipo === opcion.value
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={opcion.value}
                  checked={tipo === opcion.value}
                  onChange={() => setTipo(opcion.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-bold text-slate-900">
                  {opcion.value === "Solicitud"
                    ? "Solicitud de servicio"
                    : opcion.value}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {opcion.desc}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Área y categoría */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="area"
              className="text-sm font-semibold text-slate-700"
            >
              Área
            </label>
            <select
              id="area"
              value={areaId}
              onChange={(e) =>
                setAreaId(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={cargandoCatalogos}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value="">
                {cargandoCatalogos
                  ? "Cargando áreas..."
                  : "Selecciona un área"}
              </option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="text-sm font-semibold text-slate-700"
            >
              Categoría
            </label>
            <select
              id="categoria"
              value={categoriaId}
              onChange={(e) =>
                setCategoriaId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              disabled={areaId === "" || categorias.length === 0}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value="">
                {areaId === ""
                  ? "Primero elige un área"
                  : categorias.length === 0
                    ? "Sin categorías para esta área"
                    : "Selecciona una categoría"}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prioridad */}
        <div>
          <label
            htmlFor="prioridad"
            className="text-sm font-semibold text-slate-700"
          >
            Prioridad
          </label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value as PrioridadCaso)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-xs"
          >
            <option value="P1">P1 - Alta</option>
            <option value="P2">P2 - Media</option>
            <option value="P3">P3 - Baja</option>
          </select>
        </div>

        {/* Título */}
        <div>
          <label
            htmlFor="titulo"
            className="text-sm font-semibold text-slate-700"
          >
            Título
          </label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={150}
            placeholder="Ej: No puedo conectarme al Wi-Fi institucional"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {!tituloValido && titulo.length > 0 && (
            <p className="mt-1 text-xs text-red-600">
              El título es obligatorio.
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="descripcion"
              className="text-sm font-semibold text-slate-700"
            >
              Descripción
            </label>
            <span
              className={`text-xs ${
                descripcionValida ? "text-slate-400" : "text-red-600"
              }`}
            >
              {descripcionLimpia.length} / mínimo {DESCRIPCION_MINIMA}
            </span>
          </div>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Describe el problema con al menos 10 caracteres…"
            className={`mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 ${
              descripcion.length > 0 && !descripcionValida
                ? "border-red-300 focus:ring-red-500"
                : "border-slate-200 focus:ring-blue-500"
            }`}
          />
          {descripcion.length > 0 && !descripcionValida && (
            <p className="mt-1 text-xs text-red-600">
              La descripción debe tener al menos {DESCRIPCION_MINIMA}{" "}
              caracteres.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!formularioValido}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registrando…
              </span>
            ) : (
              "Registrar caso"
            )}
          </button>
          <button
            type="button"
            onClick={resetFormulario}
            disabled={enviando}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Limpiar
          </button>
          {!usuario && (
            <p className="text-xs text-red-600">
              No hay usuario activo para registrar el caso.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default CrearCaso;
