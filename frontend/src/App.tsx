import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import CrearCaso from "./pages/CrearCaso";
import MisSolicitudes from "./pages/MisSolicitudes";
import BandejaSoporte from "./pages/BandejaSoporte";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
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
            path="/bandeja-soporte"
            element={<BandejaSoporte />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;