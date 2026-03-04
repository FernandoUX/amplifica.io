"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, RotateCcw, Package, PackageOpen,
  ChevronDown, ChevronRight, Search, CalendarDays,
  Settings, Layers, ChevronLeft, ChevronUp
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Pedidos", icon: ShoppingCart, href: "/pedidos", hasChildren: true },
  { label: "Devoluciones", icon: RotateCcw, href: "/devoluciones", hasChildren: true },
  { label: "Inventario", icon: Package, href: "/inventario", hasChildren: true },
  {
    label: "Recepciones", icon: PackageOpen, href: "/recepciones", hasChildren: true, badge: "BETA",
    children: [
      { label: "Órdenes de recepción", href: "/recepciones" },
      { label: "Crear Recepción", href: "/recepciones/crear" },
    ],
  },
  { label: "Productos", icon: Layers, href: "/productos", hasChildren: true },
  { label: "Conjunto de reglas", icon: Layers, href: "/reglas", hasChildren: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(["Recepciones"]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-56"} bg-[#111111] text-white flex flex-col flex-shrink-0 transition-all duration-200 relative`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-[#F5A623] rounded w-6 h-6 flex items-center justify-center text-black font-bold text-xs">A</div>
            <span className="font-semibold text-sm tracking-wide">amplifica</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/50 hover:text-white p-1 rounded ml-auto"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Store selectors */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2 space-y-1.5 border-b border-white/10">
          <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded px-3 py-1.5 text-xs">
            <div>
              <p className="text-white/40 text-[10px] leading-none mb-0.5">Sucursal</p>
              <p className="text-white font-medium">Quilicura</p>
            </div>
            <ChevronUp className="w-3 h-3 text-white/40" />
          </button>
          <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded px-3 py-1.5 text-xs">
            <div>
              <p className="text-white/40 text-[10px] leading-none mb-0.5">Tienda</p>
              <p className="text-white font-medium">100 Aventuras</p>
            </div>
            <ChevronUp className="w-3 h-3 text-white/40" />
          </button>
        </div>
      )}

      {/* Search + date */}
      {!collapsed && (
        <div className="px-3 py-2 space-y-1 border-b border-white/10">
          <button className="w-full flex items-center gap-2 text-white/50 hover:text-white text-xs px-2 py-1.5 rounded hover:bg-white/5">
            <Search className="w-3.5 h-3.5" />
            <span>Buscar</span>
          </button>
          <button className="w-full flex items-center gap-2 text-white/50 hover:text-white text-xs px-2 py-1.5 rounded hover:bg-white/5">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Filtrar por fecha</span>
          </button>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {!collapsed && (
          <p className="text-white/30 text-[10px] px-2 mb-2 uppercase tracking-wider">Menú</p>
        )}
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openMenus.includes(item.label);
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.label}>
                {item.hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-xs transition-colors
                        ${isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className="bg-[#F5A623] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                          {isOpen ? (
                            <ChevronDown className="w-3 h-3 text-white/40" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-white/40" />
                          )}
                        </>
                      )}
                    </button>
                    {isOpen && !collapsed && item.children && (
                      <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`block px-2 py-1.5 rounded text-xs transition-colors
                                ${pathname === child.href
                                  ? "text-white bg-white/10 font-medium"
                                  : "text-white/50 hover:text-white hover:bg-white/5"
                                }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded text-xs transition-colors
                      ${pathname === item.href
                        ? "text-white bg-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings + User */}
      <div className="border-t border-white/10 px-2 py-2 space-y-0.5">
        <Link
          href="/configuracion"
          className="flex items-center gap-2.5 px-2 py-2 rounded text-xs text-white/60 hover:text-white hover:bg-white/5"
        >
          <Settings className="w-4 h-4" />
          {!collapsed && <span>Configuración</span>}
        </Link>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              F
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Fernando Roblero</p>
              <p className="text-white/40 text-[10px] truncate">Super Admin</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
