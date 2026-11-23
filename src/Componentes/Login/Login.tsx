import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import './Login.css';
import {
  GraduationCap,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Loader2,
  Wifi,
  WifiOff,
  User,
  ShieldCheck,
  CloudOff,
  Cloud
} from 'lucide-react';

type Role = 'alumno' | 'docente' | 'personal';

const roles: { id: Role; label: string; icon: ReactNode }[] = [
  { id: 'alumno', label: 'Alumno', icon: <User className="login-icon-md" /> },
  { id: 'docente', label: 'Docente', icon: <GraduationCap className="login-icon-md" /> },
  { id: 'personal', label: 'Personal', icon: <ShieldCheck className="login-icon-md" /> }
];

export default function LoginForm() {
  const [role, setRole] = useState<Role>('alumno');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!codigo.trim()) {
      setError('Ingresa tu DNI.');
      return;
    }
    if (!password) {
      setError('Ingresa tu contraseña.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const rolGuardado = role === 'personal' ? 'director' : role;
      localStorage.setItem(
        'usuarioLogueado',
        JSON.stringify({
          nombres:
            role === 'alumno'
              ? 'Estudiante'
              : role === 'docente'
                ? 'Docente'
                : 'Dirección',
          apellidos: 'Institucional',
          codigo: codigo.trim(),
          institucionNombre: 'Institución Educativa',
          rol: rolGuardado
        })
      );
      localStorage.setItem(
        'progresa_student_section',
        role === 'docente' ? 'docentes' : 'panel'
      );
      setSubmitting(false);
      window.location.reload();
    }, 300);
  };

  return (
    <div className="login-page">
      <header className="login-topbar">
        <div className="login-topbar-inner">
          <div className="login-brand">
            <div className="login-brand-icon">
              <GraduationCap className="login-icon-lg" strokeWidth={2} />
            </div>
            <div className="login-brand-text">
              <span className="login-brand-title">Progresa</span>
              <span className="login-brand-subtitle">Portal Académico Institucional</span>
            </div>
          </div>

          <div
            className={`login-status-pill ${
              isOnline ? 'login-status-online' : 'login-status-offline'
            }`}
          >
            {isOnline ? (
              <>
                <Cloud className="login-icon-sm" />
                <span>En línea</span>
              </>
            ) : (
              <>
                <CloudOff className="login-icon-sm" />
                <span>Sin red</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="login-container">
        <section className="login-card" aria-label="Inicio de sesión">
          <div className="login-card-top">
            <div>
              <h1 className="login-heading-title">Iniciar sesión</h1>
              <p className="login-heading-desc">
                Selecciona tu rol e ingresa tus credenciales institucionales.
              </p>
            </div>
            <span className="login-mode-tag">
              {isOnline ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Wifi className="login-icon-sm" />
                  Red activa
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <WifiOff className="login-icon-sm" />
                  Offline
                </span>
              )}
            </span>
          </div>

          <div className="login-section">
            <span className="login-label">Tipo de usuario</span>
            <div className="login-roles-grid">
              {roles.map((r) => {
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`login-role-btn ${active ? 'login-role-btn-active' : ''}`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <label className="login-section">
              <span className="login-label">DNI</span>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <IdCard className="login-icon-md" />
                </span>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ingresa tu DNI"
                  autoComplete="username"
                  className="login-input"
                />
              </div>
            </label>

            <label className="login-section">
              <span className="login-label">Contraseña</span>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock className="login-icon-md" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  className="login-input login-input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="login-eye-btn"
                >
                  {showPassword ? (
                    <EyeOff className="login-icon-md" />
                  ) : (
                    <Eye className="login-icon-md" />
                  )}
                </button>
              </div>
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" disabled={submitting} className="login-submit-btn">
              {submitting ? (
                <>
                  <Loader2 className="login-icon-md login-spin" />
                  <span>Ingresando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>

          <p className="login-footer">
            ¿Problemas con tu acceso?{' '}
            <span className="login-footer-accent">
              Consulta con administración académica
            </span>
          </p>
        </section>
      </main>
    </div>
  );
}