import { useState, useEffect } from 'react';
import './App.css';
import Inicio from './Componentes/Alumnos/Inicio/Inicio';
import DocentesLayout from './Componentes/Docentes/Docentes';
import DirectoresLayout from './Componentes/Dirección/Dirección';
import TesoreriaPanel from './Componentes/Tesoreria/Tesoreria';
import LoginForm from './Componentes/Login/Login';

export interface UsuarioSesion {
  rol: 'alumno' | 'docente' | 'director' | 'tesoreria' | 'tesorero';
  nombres: string;
  apellidos: string;
  codigo: string;
  institucionNombre: string;
  email?: string;
  especialidad?: string;
}

export default function App() {
  const [sesion, setSesion] = useState<UsuarioSesion | null>(null);

  useEffect(() => {
    try {
      const rawUsuario = localStorage.getItem('usuarioLogueado');
      if (rawUsuario) {
        const parsed = JSON.parse(rawUsuario) as UsuarioSesion;
        setSesion(parsed);
      }
    } catch {
      setSesion(null);
    }
  }, []);

  if (!sesion) {
    return <LoginForm />;
  }

  if (sesion.rol === 'alumno') {
    return <Inicio />;
  }

  if (sesion.rol === 'docente') {
    return <DocentesLayout />;
  }

  if (sesion.rol === 'director') {
    return <DirectoresLayout />;
  }

  if (sesion.rol === 'tesoreria' || sesion.rol === 'tesorero') {
    return <TesoreriaPanel />;
  }

  return <LoginForm />;
}