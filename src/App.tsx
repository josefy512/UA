import { useState, useEffect } from 'react';
import './App.css';
import Inicio from './Componentes/Alumnos/Inicio/Inicio';
import LoginForm from './Componentes/Login/Login';

export interface UsuarioSesion {
  rol: 'alumno' | 'docente' | 'director';
  nombres: string;
  apellidos: string;
  codigo: string;
  institucionNombre: string;
}

export default function App() {
  const [sesion, setSesion] = useState<UsuarioSesion | null>(null);
  const [seccionActiva, setSeccionActiva] = useState<string>('panel');

  useEffect(() => {
    try {
      const rawUsuario = localStorage.getItem('usuarioLogueado');
      if (rawUsuario) {
        const parsed = JSON.parse(rawUsuario) as UsuarioSesion;
        setSesion(parsed);
      }
      const rawSeccion = localStorage.getItem('progresa_student_section');
      if (rawSeccion) {
        setSeccionActiva(rawSeccion);
      }
    } catch {
      setSesion(null);
    }
  }, []);

  const cambiarSeccion = (nuevaSeccion: string) => {
    setSeccionActiva(nuevaSeccion);
    localStorage.setItem('progresa_student_section', nuevaSeccion);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('progresa_student_section');
    setSesion(null);
    setSeccionActiva('panel');
    window.location.reload();
  };

  if (!sesion) {
    return <LoginForm />;
  }

  if (sesion.rol === 'alumno') {
    return <Inicio />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-brand">
          <div>
            <strong style={{ color: '#ffffff', fontSize: '1rem' }}>
              {sesion.institucionNombre || 'Institución Educativa'}
            </strong>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              {sesion.nombres} {sesion.apellidos} · DNI/Código: {sesion.codigo}
            </div>
          </div>
          <span className="app-header-badge">Rol: {sesion.rol}</span>
        </div>

        <button type="button" onClick={cerrarSesion} className="app-btn-secondary">
          Cerrar sesión
        </button>
      </header>

      <main className="app-main">
        <div className="app-card">
          <h1 style={{ margin: '0 0 0.5rem', color: '#ffffff', fontSize: '1.25rem' }}>
            Vista principal ({seccionActiva})
          </h1>
          <p style={{ margin: '0 0 1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
            Sesión iniciada en modo local con <code>localStorage</code>. Lista para conectar las
            demás vistas de tu estructura.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => cambiarSeccion('panel')}
              className={seccionActiva === 'panel' ? 'app-btn-primary' : 'app-btn-secondary'}
            >
              Inicio / Panel
            </button>
            <button
              type="button"
              onClick={() => cambiarSeccion('tareas')}
              className={seccionActiva === 'tareas' ? 'app-btn-primary' : 'app-btn-secondary'}
            >
              Tareas
            </button>
            <button
              type="button"
              onClick={() => cambiarSeccion('promedios')}
              className={seccionActiva === 'promedios' ? 'app-btn-primary' : 'app-btn-secondary'}
            >
              Promedios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}