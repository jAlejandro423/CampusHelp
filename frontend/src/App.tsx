import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { UsuarioProvider } from "./context/UsuarioContext";
import MainLayout from "./layouts/MainLayout";
import CrearCaso from "./pages/CrearCaso";
import MisSolicitudes from "./pages/MisSolicitudes";
import DetalleMiCaso from "./pages/DetalleMiCaso";
import BandejaSoporte from "./pages/BandejaSoporte";
import Dashboard from "./pages/Dashboard";
import PorValidar from "./pages/PorValidar";
import Casos from "./pages/Casos";
import Categorias from "./pages/Categorias";

function App() {
  return (
    <UsuarioProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<MainLayout />}>

            <Route
              path="/"
              element={<Navigate to="/crear-caso" replace />}
            />

            <Route
              path="/crear-caso"
              element={<CrearCaso />}
            />

            <Route
              path="/mis-solicitudes"
              element={<MisSolicitudes />}
            />

            <Route
              path="/mis-solicitudes/:id"
              element={<DetalleMiCaso />}
            />

            <Route
              path="/bandeja-soporte"
              element={<BandejaSoporte />}
            />

            <Route
              path="/por-validar"
              element={<PorValidar />}
            />

            <Route
              path="/casos"
              element={<Casos />}
            />

            <Route
              path="/indicadores"
              element={<Dashboard />}
            />

            <Route
              path="/dashboard"
              element={<Navigate to="/indicadores" replace />}
            />

            <Route
              path="/categorias"
              element={<Categorias />}
            />

          </Route>

        </Routes>
      </BrowserRouter>
    </UsuarioProvider>
  );
}

export default App;
