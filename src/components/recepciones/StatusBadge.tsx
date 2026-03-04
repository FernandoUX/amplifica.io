type Status =
  | "Creado"
  | "Programado"
  | "Recepción en bodega"
  | "En proceso de conteo"
  | "Parcialmente recepcionada"
  | "Cancelada"
  | "Completada";

const statusConfig: Record<Status, { label: string; className: string; icon?: string }> = {
  Creado: {
    label: "+ Creado",
    className: "text-gray-500",
  },
  Programado: {
    label: "Programado",
    className: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  },
  "Recepción en bodega": {
    label: "Recepción en bodega",
    className: "bg-slate-700 text-white",
  },
  "En proceso de conteo": {
    label: "En proceso de conteo",
    className: "bg-blue-50 text-blue-700 border border-blue-300",
  },
  "Parcialmente recepcionada": {
    label: "Parcialmente recepcionada",
    className: "text-orange-500 font-medium",
  },
  Cancelada: {
    label: "Cancelada",
    className: "text-gray-500",
  },
  Completada: {
    label: "Completada",
    className: "text-green-600 font-medium",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${config.className}`}>
      {status === "Cancelada" && <span className="mr-1">⊘</span>}
      {status === "Completada" && <span className="mr-1">✓</span>}
      {status === "Parcialmente recepcionada" && <span className="mr-1">↑</span>}
      {status === "Recepción en bodega" && <span className="mr-1">⬡</span>}
      {config.label}
    </span>
  );
}

export type { Status };
