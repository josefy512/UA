import { useEffect, useState } from 'react';
import Login from './Componentes/Login/Login';
import Docentes from './Componentes/Docentes/Docentes';
import Tesoreria from './Componentes/Tesoreria/Tesoreria';
// @ts-ignore si el nombre con tilde en la carpeta da aviso de casing/resolución
import Direccion from './Componentes/Dirección/Dirección';
import PortalAlumnos from './Componentes/Alumnos/PortalAlumnos';
import { sincronizarCacheGeneral } from './lib/progresaApi';
import type { UsuarioSesion } from './types/progresa';
import './App.css';

function leerSesionGuardada(): UsuarioSesion | null {
  try {
    const raw = localStorage.getItem('usuarioLogueado');
    if (!raw) return null;
    return JSON.parse(raw) as UsuarioSesion;
  } catch {
    return null;
  }
}

export function App() {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => leerSesionGuardada());

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      void sincronizarCacheGeneral();
    }
  }, [usuario]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLogueado');
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLoginSuccess={(u) => setUsuario(u)} />;
  }

  const renderModuloPorRol = () => {
    switch (usuario.rol) {
      case 'docente':
        return <Docentes />;
      case 'tesoreria':
      case 'tesorero':
        return <Tesoreria />;
      case 'director':
        return <Direccion />;
      case 'alumno':
      default:
        return <PortalAlumnos usuario={usuario} onLogout={cerrarSesion} />;
    }
  };

  return <div className="app-shell">{renderModuloPorRol()}</div>;
}

export default App;