import React, { useState } from 'react';
import { autenticarUsuario } from '../../lib/progresaApi';
import type { UsuarioSesion } from '../../types/progresa';
import './Login.css';

interface LoginProps {
  onLoginSuccess: (usuario: UsuarioSesion) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setCargando(true);

    try {
      const { usuario, error } = await autenticarUsuario(identificador, password);
      if (error || !usuario) {
        setErrorMsg(error ?? 'No se pudo iniciar sesión.');
        return;
      }

      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      onLoginSuccess(usuario);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al conectar con Supabase.';
      setErrorMsg(mensaje);
    } finally {
      setCargando(false);
    }
  };

  const accesoRapidoDemo = (codigoDemo: string) => {
    setIdentificador(codigoDemo);
    setPassword('demo1234');
    setErrorMsg(null);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Portal Institucional Progresa</h1>
          <p>Ingresa con tu código o correo institucional y tu contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="identificador">Código o Correo Institucional</label>
            <input
              id="identificador"
              type="text"
              placeholder="Ej: 20241089, DOC-2026, tesoreria@institucion.edu.pe"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          {errorMsg && <div className="login-error">{errorMsg}</div>}

          <button type="submit" className="login-btn" disabled={cargando}>
            {cargando ? 'Validando acceso...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-demo-box">
          <span>Accesos rápidos de prueba (clave: demo1234):</span>
          <div className="login-demo-buttons">
            <button type="button" onClick={() => accesoRapidoDemo('20241089')}>
              Alumno
            </button>
            <button type="button" onClick={() => accesoRapidoDemo('DOC-2026')}>
              Docente
            </button>
            <button type="button" onClick={() => accesoRapidoDemo('TES-2026')}>
              Tesorería
            </button>
            <button type="button" onClick={() => accesoRapidoDemo('DIR-2026')}>
              Dirección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;