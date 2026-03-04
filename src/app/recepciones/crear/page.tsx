"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  AlertCircle, ChevronDown, Upload, Trash2, MoreVertical,
  Package, ArrowRight, ChevronLeft, ChevronRight, Check
} from "lucide-react";
import StepIndicator from "@/components/recepciones/StepIndicator";
import ProductsModal from "@/components/recepciones/ProductsModal";

// ─── Types ────────────────────────────────────────────────────────────────────
type Product = { sku: string; nombre: string; barcode: string; stock: number; qty: number };

type FormData = {
  sucursal: string;
  tienda: string;
  pallets: string;
  bultos: string;
  desconoceFormato: boolean;
  comentarios: string;
  guiaDespacho: File | null;
  products: Product[];
  // Step 3
  fechaReserva: string;
  horaReserva: string;
  anden: string;
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// ─── Calendar simple ──────────────────────────────────────────────────────────
function MiniCalendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const selected = value ? new Date(value + "T00:00:00") : null;

  const pick = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange(d.toISOString().split("T")[0]);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }}
          className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-medium text-sm text-gray-800">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }}
          className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Do","Lu","Ma","Mi","Ju","Vi","Sá"].map(d => (
          <span key={d} className="text-center text-xs text-gray-400 font-medium">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(viewYear, viewMonth, day);
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSel = selected && date.toDateString() === selected.toDateString();
          return (
            <button key={i} disabled={isPast}
              onClick={() => pick(day)}
              className={`w-8 h-8 text-xs rounded-full mx-auto flex items-center justify-center transition-colors
                ${isSel ? "bg-indigo-600 text-white font-semibold" : ""}
                ${!isSel && !isPast ? "hover:bg-indigo-50 text-gray-700" : ""}
                ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => setForm(f => ({ ...f, guiaDespacho: file }));

  return (
    <div className="space-y-5">
      {/* Warning */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Asegura tu mercancía</p>
          <p className="text-xs text-amber-600 mt-0.5">
            La Guía de Despacho es obligatoria para la cobertura del seguro. Evita pérdidas económicas subiendo un documento claro.
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-800">Seleccione sucursal y detalles de la orden</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Sucursal */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Sucursal de destino</label>
          <div className="relative">
            <select
              value={form.sucursal}
              onChange={e => setForm(f => ({ ...f, sucursal: e.target.value }))}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-10"
            >
              <option value="Quilicura">Quilicura — El juncal 901, Quilicura, Santiago, Chile</option>
              <option value="Pudahuel">Pudahuel</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tienda */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Tienda</label>
          <div className="relative">
            <select
              value={form.tienda}
              onChange={e => setForm(f => ({ ...f, tienda: e.target.value }))}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-10"
            >
              <option>100 Aventuras</option>
              <option>Outdoor Shop</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Pallets */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Cantidad de pallets</label>
          <div className="relative">
            <select
              value={form.pallets}
              onChange={e => setForm(f => ({ ...f, pallets: e.target.value }))}
              disabled={form.desconoceFormato}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-10 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Seleccione</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Bultos */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Cantidad de bultos</label>
          <div className="relative">
            <select
              value={form.bultos}
              onChange={e => setForm(f => ({ ...f, bultos: e.target.value }))}
              disabled={form.desconoceFormato}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-10 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Seleccione</option>
              {[5,10,15,20,25,30,40,50,100].map(n => <option key={n}>{n}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, desconoceFormato: !f.desconoceFormato }))}
          className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.desconoceFormato ? "bg-indigo-600" : "bg-gray-200"}`}
        >
          <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.desconoceFormato ? "translate-x-4" : "translate-x-0"}`} />
        </button>
        <span className="text-sm text-gray-700">Desconozco la cantidad de pallets y/o bultos</span>
      </label>

      {/* Comentarios */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Comentarios adicionales (opcional)</label>
        <textarea
          value={form.comentarios}
          onChange={e => setForm(f => ({ ...f, comentarios: e.target.value }))}
          placeholder="Ingrese detalles adicionales"
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
      </div>

      {/* File upload */}
      <div>
        <input ref={fileRef} type="file" className="hidden" accept=".xml,.pdf,.jpg,.png"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {form.guiaDespacho ? (
          <div className="flex items-center gap-3 border border-green-200 bg-green-50 rounded-xl p-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{form.guiaDespacho.name}</p>
              <p className="text-xs text-gray-500">{(form.guiaDespacho.size / 1024).toFixed(0)} KB</p>
            </div>
            <button onClick={() => setForm(f => ({ ...f, guiaDespacho: null }))}
              className="text-gray-400 hover:text-red-500 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
              ${dragging ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"}`}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="text-indigo-600 font-medium">Haz clic para subir guía de despacho</span>
              {" "}o arrastra y suelta
            </p>
            <p className="text-xs text-gray-400">XML, PDF, JPG o PNG (5MB máximo)</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const addProducts = (products: Product[]) => {
    setForm(f => {
      const existing = [...f.products];
      products.forEach(p => {
        const idx = existing.findIndex(e => e.sku === p.sku);
        if (idx >= 0) existing[idx] = { ...existing[idx], qty: existing[idx].qty + p.qty };
        else existing.push(p);
      });
      return { ...f, products: existing };
    });
  };

  const updateQty = (sku: string, qty: number) => {
    setForm(f => ({ ...f, products: f.products.map(p => p.sku === sku ? { ...p, qty: Math.max(1, qty) } : p) }));
  };

  const removeProduct = (sku: string) => {
    setForm(f => ({ ...f, products: f.products.filter(p => p.sku !== sku) }));
  };

  const filtered = form.products.filter(p =>
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {showModal && <ProductsModal onClose={() => setShowModal(false)} onAdd={addProducts} />}

      {/* Warning */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Declaración de inventario entrante</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Asegúrate de incluir todos los SKUs. Datos incompletos o incorrectos generan errores de stock y bloqueos en el muelle de descarga.
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-800">Ingresar productos</h3>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Busca por SKU, nombre o código de barras"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
          Descargar plantilla
        </button>
        <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Importar planilla
        </button>
      </div>

      {/* Empty or Table */}
      {form.products.length === 0 ? (
        <div className="border border-gray-200 rounded-xl p-12 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-800 text-sm">La recepción está vacía</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Comienza a agregar los SKUs de esta orden para habilitar el proceso de descarga. Puedes importar un archivo CSV o buscar productos manualmente.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Importar planilla
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
            >
              Agregar productos
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código de barras</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cantidad</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => (
                <tr key={product.sku} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-700">{product.sku}</td>
                  <td className="py-3 px-4 text-gray-700">{product.nombre}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{product.barcode}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(product.sku, product.qty - 1)}
                        className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 font-medium text-gray-600">−</button>
                      <input
                        type="number"
                        value={product.qty}
                        onChange={e => updateQty(product.sku, parseInt(e.target.value) || 1)}
                        className="w-14 border border-gray-200 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <button onClick={() => updateQty(product.sku, product.qty + 1)}
                        className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 font-medium text-gray-600">+</button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => removeProduct(product.sku)}
                      className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-500">{form.products.length} SKU(s) · {form.products.reduce((s, p) => s + p.qty, 0)} unidades</p>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              + Agregar más productos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  const ANDENES = ["Andén 1","Andén 2","Andén 3","Andén 4","Andén 5"];

  return (
    <div className="space-y-5">
      <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Reserva tu andén de descarga</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Selecciona el día, horario y andén disponible para que el operador esté preparado para la llegada de tu orden.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Fecha de llegada</label>
          <MiniCalendar value={form.fechaReserva} onChange={v => setForm(f => ({ ...f, fechaReserva: v }))} />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Hora estimada de llegada</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, horaReserva: t }))}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors
                    ${form.horaReserva === t ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Andén asignado</label>
            <div className="relative">
              <select
                value={form.anden}
                onChange={e => setForm(f => ({ ...f, anden: e.target.value }))}
                className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-10"
              >
                <option value="">Seleccione un andén</option>
                {ANDENES.map(a => <option key={a}>{a}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Resumen */}
          {form.fechaReserva && form.horaReserva && form.anden && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-green-700 mb-1">✓ Reserva confirmada</p>
              <p className="text-sm text-green-800">{form.anden}</p>
              <p className="text-xs text-green-600 mt-0.5">
                {new Date(form.fechaReserva + "T00:00:00").toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · {form.horaReserva} hrs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CrearORPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    sucursal: "Quilicura", tienda: "100 Aventuras",
    pallets: "", bultos: "", desconoceFormato: false,
    comentarios: "", guiaDespacho: null, products: [],
    fechaReserva: "", horaReserva: "", anden: "",
  });

  const canContinue = () => {
    if (step === 1) return form.sucursal && form.tienda && (form.desconoceFormato || (form.pallets && form.bultos));
    if (step === 2) return form.products.length > 0;
    if (step === 3) return form.fechaReserva && form.horaReserva && form.anden;
    return false;
  };

  const handleSubmit = () => {
    router.push("/recepciones");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/recepciones" className="hover:text-indigo-600">Recepciones</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">Nueva Orden de Recepción</span>
        </nav>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nueva Orden de Recepción</h1>
          <button className="text-gray-400 hover:text-gray-600 text-base">ⓘ</button>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <StepIndicator current={step} />
        </div>

        {/* Content card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {step === 1 && <Step1 form={form} setForm={setForm} />}
          {step === 2 && <Step2 form={form} setForm={setForm} />}
          {step === 3 && <Step3 form={form} setForm={setForm} />}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => step === 1 ? router.push("/recepciones") : setStep(s => s - 1)}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium transition-colors"
          >
            Volver
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canContinue()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canContinue()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" /> Crear Orden de Recepción
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
