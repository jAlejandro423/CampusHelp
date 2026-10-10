export function colorEstado(estado: string) {
  switch (estado) {
    case "Pendiente":
      return "bg-amber-100 text-amber-800";
    case "En análisis":
      return "bg-blue-100 text-blue-700";
    case "En atención":
      return "bg-indigo-100 text-indigo-700";
    case "En validación":
      return "bg-purple-100 text-purple-700";
    case "Cerrada":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function colorPrioridad(prioridad: string) {
  switch (prioridad) {
    case "P1":
      return "bg-red-100 text-red-700";
    case "P2":
      return "bg-amber-100 text-amber-800";
    case "P3":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function formatearFecha(iso: string) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
