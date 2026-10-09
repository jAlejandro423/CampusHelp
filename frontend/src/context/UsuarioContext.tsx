import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { obtenerUsuarios } from "../api/client";
import type { Usuario } from "../api/client";

const STORAGE_KEY = "campushelp_usuario_id";

interface UsuarioContextValue {
  usuario: Usuario | null;
  usuarios: Usuario[];
  setUsuario: (usuario: Usuario | null) => void;
  loading: boolean;
  error: string;
}

const UsuarioContext = createContext<UsuarioContextValue | null>(null);

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        setError("");
        const data = await obtenerUsuarios();
        setUsuarios(data);

        const guardado = Number(localStorage.getItem(STORAGE_KEY));
        const found = data.find((u) => u.id === guardado);
        setUsuarioState(found ?? data[0] ?? null);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError("No se pudieron cargar los usuarios");
        setUsuarioState(null);
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  const setUsuario = (next: Usuario | null) => {
    setUsuarioState(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, String(next.id));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({ usuario, usuarios, setUsuario, loading, error }),
    [usuario, usuarios, loading, error]
  );

  return <UsuarioContext.Provider value={value}>{children}</UsuarioContext.Provider>;
}

export function useUsuario(): UsuarioContextValue {
  const ctx = useContext(UsuarioContext);
  if (!ctx) {
    throw new Error("useUsuario debe usarse dentro de <UsuarioProvider>");
  }
  return ctx;
}
