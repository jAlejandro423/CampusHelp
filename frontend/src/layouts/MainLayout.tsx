import { type ChangeEvent, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";

interface MenuItem {
  name: string;
  code: string;
  path: string;
  icon: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    name: "Registrar Caso",
    code: "HU-01",
    path: "/crear-caso",
    icon: "➕",
    roles: ["solicitante"],
  },
  {
    name: "Mis Casos",
    code: "HU-02",
    path: "/mis-solicitudes",
    icon: "📂",
    roles: ["solicitante"],
  },
  {
    name: "Bandeja",
    code: "HU-03",
    path: "/bandeja-soporte",
    icon: "📥",
    roles: ["agente"],
  },
  {
    name: "Por Validar",
    code: "HU-07",
    path: "/por-validar",
    icon: "✅",
    roles: ["validador"],
  },
  {
    name: "Casos",
    code: "HU-09",
    path: "/casos",
    icon: "🔎",
    roles: ["administrador"],
  },
  {
    name: "Indicadores",
    code: "HU-10",
    path: "/indicadores",
    icon: "📊",
    roles: ["administrador"],
  },
  {
    name: "Categorías",
    code: "HU-11",
    path: "/categorias",
    icon: "🗂️",
    roles: ["administrador"],
  },
];

function obtenerColorRol(rol: string) {
  switch (rol) {
    case "solicitante":
      return "bg-blue-100 text-blue-700";

    case "agente":
      return "bg-green-100 text-green-700";

    case "validador":
      return "bg-purple-100 text-purple-700";

    case "administrador":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function obtenerNombreRol(rol: string) {
  switch (rol) {
    case "solicitante":
      return "Solicitante";

    case "agente":
      return "Agente de Soporte";

    case "validador":
      return "Validador de Soluciones";

    case "administrador":
      return "Administradora";

    default:
      return rol;
  }
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { usuario: selectedUser, usuarios: users, setUsuario, loading, error } =
    useUsuario();
  const location = useLocation();
  const navigate = useNavigate();

  const loadingUsers = loading;
  const errorUsers = error;

  const handleUserChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(event.target.value);

    const user = users.find((u) => u.id === userId);

    if (user) {
      setUsuario(user);
    }
  };

  /*
   * Si no hay usuario (cargando o error), no mostrar el menú
   * para no exponer rutas de otros roles.
   */
  const visibleMenuItems = selectedUser
    ? menuItems.filter((item) => item.roles.includes(selectedUser.rol))
    : [];

  /*
   * Al cambiar de usuario, si la ruta actual no pertenece al nuevo rol
   * (incluye subrutas como /mis-solicitudes/:id), redirigir a la primera
   * opción de su menú en lugar de dejarlo en una pantalla ajena.
   */
  useEffect(() => {
    if (!selectedUser || visibleMenuItems.length === 0) return;
    const permitida = visibleMenuItems.some(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    );
    if (!permitida) {
      navigate(visibleMenuItems[0].path, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?.id, location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              type="button"
            >
              ☰
            </button>

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              CH
            </div>

            <div className="hidden sm:block">
              <h1 className="font-bold text-slate-900">CampusHelp</h1>
              <p className="text-xs text-slate-500">
                Mesa de Servicios TI
              </p>
            </div>
          </div>

          {/* USUARIO */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              {loadingUsers ? (
                <p className="text-sm text-slate-400">
                  Cargando usuario...
                </p>
              ) : selectedUser ? (
                <>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedUser.nombre}
                  </p>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorRol(
                      selectedUser.rol
                    )}`}
                  >
                    {obtenerNombreRol(selectedUser.rol)}
                  </span>
                </>
              ) : (
                <p className="text-sm text-red-500">
                  {errorUsers || "Sin usuario"}
                </p>
              )}
            </div>

            <select
              value={selectedUser?.id ?? ""}
              onChange={handleUserChange}
              disabled={loadingUsers || users.length === 0}
              className="max-w-[260px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {loadingUsers ? (
                <option value="">Cargando usuarios...</option>
              ) : users.length === 0 ? (
                <option value="">No hay usuarios disponibles</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre} — {obtenerNombreRol(user.rol)}
                  </option>
                ))
              )}
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
          {/* USUARIO ACTUAL */}
          <div className="p-5 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-3">
              Usuario actual
            </p>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                👤
              </div>

              <div>
                {selectedUser ? (
                  <>
                    <p className="font-semibold text-slate-800">
                      {selectedUser.nombre}
                    </p>

                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${obtenerColorRol(
                        selectedUser.rol
                      )}`}
                    >
                      {obtenerNombreRol(selectedUser.rol)}
                    </span>
                  </>
                ) : (
                  <p className="text-sm text-slate-400">
                    {loadingUsers
                      ? "Cargando..."
                      : "Usuario no disponible"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <nav className="flex-1 p-4">
            <p className="px-3 mb-3 text-xs font-semibold uppercase text-slate-400">
              Navegación
            </p>

            <div className="space-y-1">
              {visibleMenuItems.map((item) => (
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
                  <span className="text-xl w-7 text-center">
                    {item.icon}
                  </span>

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

          {/* FOOTER */}
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

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* CONTENIDO */}
      <main className="pt-16 lg:pl-72 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
