import { useState, useEffect, useCallback } from 'react';
import ValFutsPanel from './Val_Futs/Val_Futs';
import './Dirección.css';
import {
  BarChart3,
  FileCheck2,
  Users,
  Search,
  FileText,
  Building2,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Download,
  Menu,
  X,
  UserCheck,
  Clock
} from 'lucide-react';

type Section = 'dashboard' | 'futs' | 'alumnos' | 'docentes' | 'resoluciones';

interface FUT {
  id: string;
  codigo: string;
  estudiante: string;
  carrera: string;
  asunto: string;
  fecha: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

interface UsuarioGuardado {
  nombres?: string;
  apellidos?: string;
  email?: string;
  institucionNombre?: string;
  institucion_nombre?: string;
}

const FUTS_INICIALES: FUT[] = [
  {
    id: 'fut-4105',
    codigo: 'FUT-2026-4105',
    estudiante: 'Elena Díaz Vargas',
    carrera: 'Computación e Informática',
    asunto: 'Justificación de inasistencia por atención médica',
    fecha: '10 Oct 2026',
    estado: 'pendiente'
  },
  {
    id: 'fut-4108',
    codigo: 'FUT-2026-4108',
    estudiante: 'Carlos Ruiz Dávila',
    carrera: 'Administración de Empresas',
    asunto: 'Solicitud de rectificación de evaluación continua',
    fecha: '12 Oct 2026',
    estado: 'pendiente'
  },
  {
    id: 'fut-4092',
    codigo: 'FUT-2026-4092',
    estudiante: 'Sofía Morales Benítez',
    carrera: 'Electrotecnia Industrial',
    asunto: 'Constancia de matrícula y rendimiento académico',
    fecha: '05 Oct 2026',
    estado: 'aprobado'
  }
];

const NAV_ITEMS: { id: Section; label: string; icon: typeof BarChart3 }[] = [
  { id: 'dashboard', label: 'Dashboard Ejecutivo', icon: BarChart3 },
  { id: 'futs', label: 'FUTs y Justificaciones', icon: FileCheck2 },
  { id: 'alumnos', label: 'Búsqueda de Alumnos', icon: Search },
  { id: 'docentes', label: 'Gestión de Personal', icon: Users },
  { id: 'resoluciones', label: 'Actas y Resoluciones', icon: FileText }
];

export default function DirectoresLayout() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [busquedaAlumno, setBusquedaAlumno] = useState<string>('');
  const [futs, setFuts] = useState<FUT[]>([]);
  const [cargandoFuts, setCargandoFuts] = useState<boolean>(false);
  const [avisoDireccion, setAvisoDireccion] = useState<string>('');

  let usuario: UsuarioGuardado = {};
  try {
    const raw = localStorage.getItem('usuarioLogueado');
    if (raw) {
      usuario = JSON.parse(raw) as UsuarioGuardado;
    }
  } catch {
    usuario = {};
  }

  const nombreDirector =
    usuario.nombres && usuario.apellidos
      ? `${usuario.nombres} ${usuario.apellidos}`
      : 'Director Institucional';
  const correoDirector = usuario.email || 'direccion@institucion.edu.pe';
  const institucionNombre =
    usuario.institucionNombre || usuario.institucion_nombre || 'Institución Educativa';
  const iniciales = usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : 'D';

  const cargarFuts = useCallback(() => {
    setCargandoFuts(true);
    try {
      const guardados = localStorage.getItem('ua_futs_direccion');
      if (guardados) {
        const parsed = JSON.parse(guardados) as FUT[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFuts(parsed);
          setCargandoFuts(false);
          return;
        }
      }
    } catch {
      // Usar lista base si no hay datos guardados
    }
    setFuts(FUTS_INICIALES);
    setCargandoFuts(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      cargarFuts();
    }, 100);

    return () => window.clearTimeout(timer);
  }, [activeSection, cargarFuts]);

  const guardarFutsLocal = (lista: FUT[]) => {
    try {
      localStorage.setItem('ua_futs_direccion', JSON.stringify(lista));
    } catch {
      // Ignorar errores de cuota local
    }
  };

  const handleAprobarFUT = (id: string) => {
    setFuts((prev) => {
      const next = prev.map((f) =>
        f.id === id ? { ...f, estado: 'aprobado' as const } : f
      );
      guardarFutsLocal(next);
      return next;
    });
    setAvisoDireccion('Solicitud FUT aprobada y registrada.');
  };

  const handleRechazarFUT = (id: string) => {
    setFuts((prev) => {
      const next = prev.map((f) =>
        f.id === id ? { ...f, estado: 'rechazado' as const } : f
      );
      guardarFutsLocal(next);
      return next;
    });
    setAvisoDireccion('Solicitud FUT marcada como observada.');
  };

 const handleCerrarSesion = () => {
    try {
      localStorage.removeItem('usuarioLogueado');
      localStorage.removeItem('progresa_student_section');
      localStorage.removeItem('progresa_docente_section');
    } catch {
      // Ignorar errores de almacenamiento
    }
    window.location.reload();
  };

  const pendientesCount = futs.filter((f) => f.estado === 'pendiente').length;
  const seccionActualLabel =
    NAV_ITEMS.find((i) => i.id === activeSection)?.label || 'Módulo';

  return (
    <div className="dir-shell">
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="dir-backdrop"
          aria-hidden="true"
        />
      )}

      {/* Barra lateral */}
      <aside className={`dir-sidebar ${mobileMenuOpen ? 'dir-sidebar-open' : ''}`}>
        <div className="dir-brand">
          <div className="dir-brand-left">
            <div className="dir-brand-icon">
              <ShieldCheck className="dir-icon-md" />
            </div>
            <div className="dir-brand-text">
              <span className="dir-brand-name">Progresa</span>
              <span className="dir-brand-role">Control Director</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="dir-close-btn"
            aria-label="Cerrar menú"
          >
            <X className="dir-icon-md" />
          </button>
        </div>

        <div className="dir-profile-box">
          <div className="dir-profile-avatar">{iniciales}</div>
          <div className="dir-profile-meta">
            <p className="dir-profile-name">{nombreDirector}</p>
            <p className="dir-profile-email">{correoDirector}</p>
          </div>
        </div>

        <div className="dir-nav-kicker">Gestión Principal</div>

        <nav className="dir-nav" aria-label="Navegación de dirección">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                  setAvisoDireccion('');
                }}
                className={`dir-nav-btn ${active ? 'dir-nav-active' : ''}`}
              >
                <Icon
                  className={`dir-icon-sm ${
                    active ? 'dir-text-sky' : 'dir-ico-muted'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="dir-logout-wrap">
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="dir-logout-btn"
          >
            <LogOut className="dir-icon-sm" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área principal */}
      <div className="dir-main-col">
        <header className="dir-topbar">
          <div className="dir-topbar-left">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="dir-menu-btn"
              aria-label="Abrir menú"
            >
              <Menu className="dir-icon-md" />
            </button>
            <div>
              <h1 className="dir-topbar-title">Gestión Académica de Dirección</h1>
              <p className="dir-topbar-sub">
                <Building2 className="dir-icon-xs dir-text-sky" />
                <span>{institucionNombre}</span>
              </p>
            </div>
          </div>

          <div className="dir-cycle-pill">
            <span className="dir-cycle-dot" aria-hidden="true" />
            <span>Ciclo Lectivo 2026 Activo</span>
          </div>
        </header>

        <main className="dir-content">
          {avisoDireccion && <div className="dir-notice">{avisoDireccion}</div>}

          {activeSection === 'dashboard' && (
            <div className="dir-stack">
              <div className="dir-kpi-grid">
                <div className="dir-card dir-kpi-box">
                  <div className="dir-kpi-top">
                    <span>Promedio General</span>
                    <TrendingUp className="dir-icon-sm dir-text-sky" />
                  </div>
                  <div className="dir-kpi-main">
                    <span className="dir-kpi-num">15.8</span>
                    <span className="dir-badge-sky">+0.3 vs bimestre</span>
                  </div>
                  <span className="dir-kpi-note">Rendimiento institucional consolidado</span>
                </div>

                <div className="dir-card dir-kpi-box">
                  <div className="dir-kpi-top">
                    <span>% Asistencia Total</span>
                    <UserCheck className="dir-icon-sm dir-text-emerald" />
                  </div>
                  <div className="dir-kpi-main">
                    <span className="dir-kpi-num">93.4%</span>
                    <span className="dir-kpi-stable">Estable</span>
                  </div>
                  <span className="dir-kpi-note">Asistencia diaria promedio global</span>
                </div>

                <div className="dir-card dir-kpi-box">
                  <div className="dir-kpi-top">
                    <span>FUTs Pendientes</span>
                    <Clock className="dir-icon-sm dir-text-rose" />
                  </div>
                  <div className="dir-kpi-main">
                    <span className="dir-kpi-num">{pendientesCount}</span>
                    <span className="dir-badge-rose">Requieren atención</span>
                  </div>
                  <span className="dir-kpi-note">Trámites de alumnos por revisar</span>
                </div>
              </div>

              <div className="dir-split-grid">
                <section className="dir-card dir-table-card">
                  <div className="dir-card-head">
                    <div>
                      <h2 className="dir-card-title">Rendimiento por Especialidad / Nivel</h2>
                      <p className="dir-card-sub">
                        Resumen de notas y asistencia consolidada
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setAvisoDireccion('Reporte consolidado preparado para exportación.')
                      }
                      className="dir-btn-export"
                    >
                      <Download className="dir-icon-xs" />
                      <span>Exportar PDF</span>
                    </button>
                  </div>

                  <div className="dir-table-scroll">
                    <table className="dir-table">
                      <thead>
                        <tr>
                          <th>Especialidad / Grado</th>
                          <th>Promedio</th>
                          <th>Asistencia</th>
                          <th>Estudiantes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="dir-td-bold">Computación e Informática</td>
                          <td className="dir-td-sky">16.2</td>
                          <td className="dir-td-muted">95.1%</td>
                          <td className="dir-td-muted">180</td>
                        </tr>
                        <tr>
                          <td className="dir-td-bold">Administración de Empresas</td>
                          <td className="dir-td-white">15.4</td>
                          <td className="dir-td-muted">92.8%</td>
                          <td className="dir-td-muted">210</td>
                        </tr>
                        <tr>
                          <td className="dir-td-bold">Electrotecnia Industrial</td>
                          <td className="dir-td-white">13.8</td>
                          <td className="dir-td-muted">89.4%</td>
                          <td className="dir-td-muted">145</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <aside className="dir-card dir-ficha-card">
                  <h2 className="dir-card-title">Ficha Rápida de Alumno</h2>
                  <p className="dir-card-sub">Búsqueda directa por DNI o Apellidos</p>

                  <div className="dir-search-box">
                    <Search className="dir-search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar por DNI o Apellido..."
                      value={busquedaAlumno}
                      onChange={(e) => setBusquedaAlumno(e.target.value)}
                      className="dir-search-input"
                    />
                  </div>

                  <div className="dir-ficha-panel">
                    <div className="dir-ficha-avatar">VS</div>
                    <h3 className="dir-ficha-name">Valentina Sosa Ortiz</h3>
                    <p className="dir-ficha-dni">DNI: 74839201 · 3er Semestre</p>

                    <div className="dir-ficha-stats">
                      <div className="dir-ficha-stat">
                        <span>Asistencia</span>
                        <strong className="dir-text-emerald">96.5%</strong>
                      </div>
                      <div className="dir-ficha-stat">
                        <span>Nota Promedio</span>
                        <strong>18.4</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setAvisoDireccion(
                          'Expediente consultado: Valentina Sosa Ortiz (DNI 74839201).'
                        )
                      }
                      className="dir-btn-primary"
                    >
                      Ver Expediente Completo
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          
            {activeSection === 'futs' && (
  <ValFutsPanel
    futs={futs}
    cargando={cargandoFuts}
    onAprobar={handleAprobarFUT}
    onObservar={handleRechazarFUT}
  />
)}

          {activeSection !== 'dashboard' && activeSection !== 'futs' && (
            <div className="dir-card dir-placeholder-box">
              <h2 className="dir-card-title">Módulo de {seccionActualLabel}</h2>
              <p className="dir-card-sub">
                Este panel está listo para consulta directa de {institucionNombre}.
              </p>
              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className="dir-btn-back"
              >
                Volver al Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}