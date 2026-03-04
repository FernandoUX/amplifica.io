"use client";

import { useState } from "react";
import { Search, X, Plus, ChevronDown } from "lucide-react";

type Product = { sku: string; nombre: string; barcode: string; stock: number; qty: number };

const MOCK_PRODUCTS: Product[] = [
  { sku: "SKU-001", nombre: "Carpa Trek 2P Ultralight", barcode: "7891234560001", stock: 45, qty: 0 },
  { sku: "SKU-002", nombre: "Mochila 40L Montaña Pro", barcode: "7891234560002", stock: 12, qty: 0 },
  { sku: "SKU-003", nombre: "Saco de Dormir -10°C", barcode: "7891234560003", stock: 28, qty: 0 },
  { sku: "SKU-004", nombre: "Bastones Telescópicos Carbono", barcode: "7891234560004", stock: 60, qty: 0 },
  { sku: "SKU-005", nombre: "Linterna Frontal 500lm", barcode: "7891234560005", stock: 100, qty: 0 },
  { sku: "SKU-006", nombre: "Botella Térmica 1L", barcode: "7891234560006", stock: 75, qty: 0 },
];

type Props = { onClose: () => void; onAdd: (products: Product[]) => void };

export default function ProductsModal({ onClose, onAdd }: Props) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const filtered = products.filter(
    (p) =>
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search)
  );

  const updateQty = (sku: string, qty: number) => {
    setProducts((prev) => prev.map((p) => (p.sku === sku ? { ...p, qty: Math.max(0, qty) } : p)));
  };

  const selected = products.filter((p) => p.qty > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Agregar / Buscar Productos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca por SKU, nombre o código de barras"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              autoFocus
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Filtros <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código de barras</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock actual</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.sku} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-700">{product.sku}</td>
                  <td className="py-3 px-4 text-gray-700">{product.nombre}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{product.barcode}</td>
                  <td className="py-3 px-4 text-gray-600">{product.stock}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(product.sku, product.qty - 1)}
                        className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 font-medium"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={product.qty}
                        onChange={(e) => updateQty(product.sku, parseInt(e.target.value) || 0)}
                        className="w-14 border border-gray-200 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <button
                        onClick={() => updateQty(product.sku, product.qty + 1)}
                        className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 font-medium"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            {selected.length > 0
              ? `${selected.length} producto${selected.length > 1 ? "s" : ""} seleccionado${selected.length > 1 ? "s" : ""}`
              : "Sin productos seleccionados"}
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white">
              Cancelar
            </button>
            <button
              onClick={() => { onAdd(selected); onClose(); }}
              disabled={selected.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar {selected.length > 0 ? `(${selected.length})` : "productos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
