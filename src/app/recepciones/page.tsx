"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, SlidersHorizontal, LayoutGrid, Search, MoreVertical, CalendarDays, CheckCircle, X } from "lucide-react";
import StatusBadge, { Status } from "@/components/recepciones/StatusBadge";

type Orden = {
  id: string;
  creacion: string;
  fechaAgendada: string;
  fechaExtra?: string;
  tienda: string;
  sucursal: string;
  estado: Status;
  skus: number;
  uTotales: string;
  estadoProductos?: string;
  estadoProductosClass?: string;
};

const ORDENES: Orden[] = [
  { id: "RO-BARRA-183", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Creado", skus: 320, uTotales: "2.550" },
  { id: "RO-BARRA-182", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", fechaExtra: "Expirado hace 4 horas", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Programado", skus: 320, uTotales: "2.550" },
  { id: "RO-BARRA-180", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", fechaExtra: "Expira en 28 minutos", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Recepción en bodega", skus: 2, uTotales: "200" },
  { id: "RO-BARRA-184", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "En proceso de conteo", skus: 320, uTotales: "2.550" },
  { id: "RO-BARRA-184", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "En proceso de conteo", skus: 320, uTotales: "2.550" },
  { id: "RO-BARRA-185", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Parcialmente recepcionada", skus: 320, uTotales: "2.550" },
  { id: "RO-BARRA-188", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Cancelada", skus: 320, uTotales: "2.550" },
  { id: "RO-BARRA-186", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Completada", skus: 320, uTotales: "2.550", estadoProductos: "20 con diferencias  20 no", estadoProductosClass: "text-orange-500" },
  { id: "RO-BARRA-187", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Completada", skus: 320, uTotales: "2.550", estadoProductos: "Pendiente de aprobación", estadoProductosClass: "text-orange-500" },
  { id: "RO-BARRA-189", creacion: "16/02/2026", fechaAgendada: "20/02/2026 16:30", tienda: "100 Aventuras", sucursal: "Quilicura", estado: "Completada", skus: 320, uTotales: "2.550", estadoProductos: "2.550 sin diferencias", estadoProductosClass: "text-green-600" },
];

const TABS = ["Todas", "Programado", "Recibido en bodega", "En proceso de conteo", "Parcialmente recepcionada", "Completada sin diferencias", "Cancelada"];

export default function OrdenesPage() {
  const [activeTab, setActiveTab] = useState("Todas");
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="p-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-green-200 rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Orden de recepción programada</p>
            <p className="text-xs text-gray-500 mt-0.5">La ordene recepción ha sido creada correctamente</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Recepción</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-base">ⓘ</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </button>
          <Link
            href="/recepciones/crear"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Crear OR
          </Link>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === tab
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <LayoutGrid className="w-4 h-4 text-gray-500" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en órdenes"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-52"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Creación ↓</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha agendada ↓</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tienda</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sucursal</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKUs</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">U. Totales</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado Productos</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ORDENES.map((orden, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-700">{orden.id}</td>
                <td className="py-3 px-4 text-gray-600">{orden.creacion}</td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">{orden.fechaAgendada}</p>
                  {orden.fechaExtra && (
                    <p className={`text-xs mt-0.5 ${orden.fechaExtra.includes("Expira") ? "text-orange-500" : "text-orange-400"}`}>
                      {orden.fechaExtra}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600">{orden.tienda}</td>
                <td className="py-3 px-4 text-gray-600">{orden.sucursal}</td>
                <td className="py-3 px-4"><StatusBadge status={orden.estado} /></td>
                <td className="py-3 px-4 text-gray-700">{orden.skus}</td>
                <td className="py-3 px-4 text-gray-700">{orden.uTotales}</td>
                <td className="py-3 px-4">
                  {orden.estadoProductos && (
                    <span className={`text-xs font-medium ${orden.estadoProductosClass}`}>
                      {orden.estadoProductos}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Mostras</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-sm text-gray-700">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">← Anterior</button>
            <span className="text-sm text-gray-500">10 - 160 Pedidos</span>
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">Siguiente →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
