import { type ChangeEvent, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

interface User {
  id: number;
  name: string;
  role: string;
  color: string;
}

interface MenuItem {
  name: string;
  code: string;
  path: string;
  icon: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Juan Pérez",
    role: "Solicitante",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "María Gómez",
    role: "Agente de Soporte",
    color: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    name: "Carlos López",
    role: "Validador de Soluciones",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    name: "Ana Torres",
    role: "Administradora",
    color: "bg-orange-100 text-orange-700",
  },
];

const menuItems = [
  {
    name: "Crear Caso",
    code: "HU-01",
    path: "/crear-caso",
    icon: "➕",
  },
  {
    name: "Mis Solicitudes",
    code: "HU-02",
    path: "/mis-solicitudes",
    icon: "📂",
  },
  {
    name: "Bandeja de Soporte",
    code: "HU-03",
    path: "/bandeja-soporte",
    icon: "📥",
  },
  {
    name: "Dashboard de Indicadores",
    code: "HU-10",
    path: "/dashboard",
    icon: "📊",
  },
];

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  const handleUserChange = (event) => {
    const user = users.find(
      (user) => user.id === Number(event.target.value)
    );

    if (user) {
      setSelectedUser(user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">

        <div className="h-full px-4 md:px-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">

            {/* Botón menú móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              ☰
            </button>

            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              CH
            </div>

            {/* Nombre */}
            <div className="hidden sm:block">
              <h1 className="font-bold text-slate-900">
                CampusHelp
              </h1>

              <p className="text-xs text-slate-500">
                Mesa de Servicios TI
              </p>
            </div>

          </div>

          {/* Selector de usuario */}
          <div className="flex items-center gap-3">

            {/* Usuario y rol */}
            <div className="hidden md:block text-right">

              <p className="text-sm font-semibold text-slate-800">
                {selectedUser.name}
              </p>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${selectedUser.color}`}
              >
                {selectedUser.role}
              </span>

            </div>

            {/* Select */}
            <select
              value={selectedUser.id}
              onChange={handleUserChange}
              className="max-w-[220px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} — {user.role}
                </option>
              ))}
            </select>

          </div>

        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-16 bottom-0 left-0 z-40
          w-72 bg-white border-r border-slate-200
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        <div className="h-full flex flex-col">

          {/* Usuario actual */}
          <div className="p-5 border-b border-slate-100">

            <p className="text-xs font-semibold uppercase text-slate-400 mb-3">
              Usuario actual
            </p>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                👤
              </div>

              <div>

                <p className="font-semibold text-slate-800">
                  {selectedUser.name}
                </p>

                <span
                  className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${selectedUser.color}`}
                >
                  {selectedUser.role}
                </span>

              </div>

            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4">

            <p className="px-3 mb-3 text-xs font-semibold uppercase text-slate-400">
              Navegación
            </p>

            <div className="space-y-1">

              {menuItems.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-3 py-3 rounded-xl
                    transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                    `
                  }
                >

                  {/* Icono */}
                  <span className="text-xl w-7 text-center">
                    {item.icon}
                  </span>

                  {/* Texto */}
                  <div>

                    <p className="text-sm font-semibold">
                      {item.name}
                    </p>

                    <p className="text-xs opacity-60">
                      {item.code}
                    </p>

                  </div>

                </NavLink>

              ))}

            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">

            <div className="p-3 rounded-xl bg-slate-50">

              <p className="text-xs font-semibold text-slate-700">
                CampusHelp
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Sistema de Mesa de Servicios Tecnológicos Universitarios
              </p>

            </div>

          </div>

        </div>
      </aside>

      {/* OVERLAY PARA MÓVIL */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="pt-16 lg:pl-72 min-h-screen">

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          <Outlet />

        </div>

      </main>

    </div>
  );
}

export default MainLayout;