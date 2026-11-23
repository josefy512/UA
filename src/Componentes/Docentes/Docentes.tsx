import { useState, useEffect, type ComponentType, type KeyboardEvent } from 'react';
import './Docentes.css';
import Asistencias from './Asistencias/Asistencias';
import Calificaciones from './Calificaciones/Calificaciones';
import Horarios from './Horarios/Horarios';
import Cursos from './Cursos/Cursos';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BookOpen,
  Award,
  LogOut,
  Search,
  Bell,
  AlertCircle,
  Clock,
  TrendingUp,
  Wifi,
  WifiOff,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  FileCheck2,
  Eye
} from 'lucide-react';

type DocenteSectionId =
  | 'panel'
  | 'calificaciones'
  | 'asistencias'
  | 'horarios'
  | 'cursos'
  | 'futs';

type DocenteMenuItem = {
  id: DocenteSectionId;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type DocenteMenuGroup = {
  title?: string;
  items: DocenteMenuItem[];
};

interface FutAprobado {
  id: string | number;
  nombres_apellidos?: string;
  sumilla?: string;
  fundamento?: string;
  fecha_solicitud?: string;
}

const FUTS_APROBADOS_DEMO: FutAprobado[] = [
  {
    id: 'fut-ap-1',
    nombres_apellidos: 'Diego Alejandro Quispe Huamán',
    sumilla: 'Justificación de inasistencia por evaluación médica',
    fundamento: 'Certificado médico presentado y validado en secretaría.',
    fecha_solicitud: '2026-11-18T10:30:00Z'
  },
  {
    id: 'fut-ap-2',
    nombres_apellidos: 'Valeria Sofía Rojas Paredes',
    sumilla: 'Solicitud de reprogramación de práctica de laboratorio',
    fundamento: 'Cruce de actividades institucionales programadas.',
    fecha_solicitud: '2026-11-20T15:15:00Z'
  }
];

const docenteMenuGroups: DocenteMenuGroup[] = [
  {
    items: [{ id: 'panel', label: 'Panel Principal', icon: LayoutDashboard }]
  },
  {
    title: 'GESTIÓN DOCENTE',
    items: [
      { id: 'calificaciones', label: 'Calificaciones', icon: Award },
      { id: 'asistencias', label: 'Asistencias', icon: CheckSquare },
      { id: 'horarios', label: 'Horarios', icon: Calendar },
      { id: 'cursos', label: 'Mis Cursos', icon: BookOpen }
    ]
  },
  {
    title: 'TRÁMITES Y SEGUIMIENTO',
    items: [{ id: 'futs', label: 'FUTs Aprobados', icon: FileCheck2 }]
  }
];

function SubpanelDocente({ seccion }: { seccion: Exclude<DocenteSectionId, 'panel' | 'futs'> }) {
  const info: Record<
    Exclude<DocenteSectionId, 'panel' | 'futs'>,
    { titulo: string; subtitulo: string }
  > = {
    calificaciones: {
      titulo: 'Registro de Calificaciones',
      subtitulo: 'Evaluaciones, promedios y actas del periodo 2026-II.'
    },
    asistencias: {
      titulo: 'Control de Asistencias',
      subtitulo: 'Registro diario de asistencia y tardanzas por grupo.'
    },
    horarios: {
      titulo: 'Horarios Docentes',
      subtitulo: 'Cronograma de sesiones teóricas, prácticas y aulas asignadas.'
    },
    cursos: {
      titulo: 'Mis Cursos',
      subtitulo: 'Asignaturas a cargo, grupos y recursos académicos.'
    }
  };

  return (
    <div className="doc-panel-card">
      <div className="doc-panel-card-head">
        <div>
          <h3 className="doc-panel-card-title">{info[seccion].titulo}</h3>
          <p className="doc-panel-card-sub">{info[seccion].subtitulo}</p>
        </div>
        <span className="doc-panel-card-badge">Módulo Docente</span>
      </div>
      <p className="doc-subpanel-note">
        Listo para conectar con tu subcomponente en <code>src/Componentes/Docentes/</code>.
      </p>
    </div>
  );
}

function PanelDocenteHome({
  onNavigate,
  futsAprobados,
  cargandoFuts
}: {
  onNavigate: (sec: DocenteSectionId) => void;
  futsAprobados: FutAprobado[];
  cargandoFuts: boolean;
}) {
  return (
    <div className="doc-section-stack">
      <div>
        <h2 className="doc-group-heading">Situación Docente Actual</h2>
        <div className="doc-kpi-grid">
          <div
            onClick={() => onNavigate('calificaciones')}
            className="doc-kpi-card doc-kpi-amber"
          >
            <div className="doc-kpi-top">
              <span className="doc-kpi-label">Entregas por Revisar</span>
              <span className="doc-tag doc-tag-amber">
                <AlertCircle className="doc-icon-xs" />
                <span>Pendientes</span>
              </span>
            </div>
            <div className="doc-kpi-value-row">
              <span className="doc-kpi-number">14</span>
              <span className="doc-kpi-subtext doc-text-amber">Asignaturas activas</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('asistencias')}
            className="doc-kpi-card doc-kpi-blue"
          >
            <div className="doc-kpi-top">
              <span className="doc-kpi-label">Próxima Sesión</span>
              <span className="doc-tag doc-tag-blue">
                <Clock className="doc-icon-xs" />
                <span>Hoy · 10:00</span>
              </span>
            </div>
            <h3 className="doc-kpi-course">Grupo 4B</h3>
            <p className="doc-kpi-desc">Aula 102 · Pabellón B</p>
          </div>

          <div
            onClick={() => onNavigate('horarios')}
            className="doc-kpi-card doc-kpi-emerald"
          >
            <div className="doc-kpi-top">
              <span className="doc-kpi-label">Asistencia Promedio</span>
              <span className="doc-tag doc-tag-emerald">
                <TrendingUp className="doc-icon-xs" />
                <span>Consolidado</span>
              </span>
            </div>
            <div className="doc-kpi-value-row">
              <span className="doc-kpi-number">92%</span>
              <span className="doc-kpi-subtext doc-text-emerald">Periodo vigente</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="doc-shortcuts-header">
          <h2 className="doc-group-heading" style={{ marginBottom: 0 }}>
            Accesos Frecuentes
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('futs')}
            className="doc-link-btn"
          >
            Ver FUTs aprobados ({futsAprobados.length})
          </button>
        </div>

        <div className="doc-shortcuts-grid">
          <div
            onClick={() => onNavigate('asistencias')}
            className="doc-shortcut-card"
          >
            <div className="doc-shortcut-left">
              <div className="doc-shortcut-icon doc-shortcut-icon-navy">
                <CheckSquare className="doc-icon-lg" />
              </div>
              <div className="doc-truncate-wrap">
                <h4 className="doc-shortcut-title">Registrar Asistencia</h4>
                <p className="doc-shortcut-desc">Control de sesiones por grupo</p>
              </div>
            </div>
            <ChevronRight className="doc-chevron" />
          </div>

          <div
            onClick={() => onNavigate('calificaciones')}
            className="doc-shortcut-card"
          >
            <div className="doc-shortcut-left">
              <div className="doc-shortcut-icon doc-shortcut-icon-sky">
                <Award className="doc-icon-lg" />
              </div>
              <div className="doc-truncate-wrap">
                <h4 className="doc-shortcut-title">Calificaciones y Actas</h4>
                <p className="doc-shortcut-desc">Evaluaciones y registro de notas</p>
              </div>
            </div>
            <ChevronRight className="doc-chevron" />
          </div>

          <div
            onClick={() => onNavigate('cursos')}
            className="doc-shortcut-card"
          >
            <div className="doc-shortcut-left">
              <div className="doc-shortcut-icon doc-shortcut-icon-navy">
                <BookOpen className="doc-icon-lg" />
              </div>
              <div className="doc-truncate-wrap">
                <h4 className="doc-shortcut-title">Mis Cursos y Material</h4>
                <p className="doc-shortcut-desc">Sílabos, guías y grupos a cargo</p>
              </div>
            </div>
            <ChevronRight className="doc-chevron" />
          </div>
        </div>
      </div>

      <div className="doc-panel-card">
        <div className="doc-panel-card-head">
          <div>
            <h3 className="doc-panel-card-title">
              <FileCheck2 className="doc-icon-sm doc-ico-sky" />
              <span>FUTs y Justificaciones Aprobadas</span>
            </h3>
            <p className="doc-panel-card-sub">
              Solicitudes validadas por dirección vinculadas a tus estudiantes
            </p>
          </div>
          <span className="doc-panel-card-badge">
            {cargandoFuts ? 'Cargando...' : `${futsAprobados.length} registro(s)`}
          </span>
        </div>

        <div className="doc-table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Asunto / Sumilla</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="doc-th-right">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {futsAprobados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="doc-td-empty">
                    {cargandoFuts
                      ? 'Cargando trámites aprobados...'
                      : 'No hay FUTs aprobados registrados por el momento.'}
                  </td>
                </tr>
              ) : (
                futsAprobados.map((fut) => {
                  const siglas = fut.nombres_apellidos
                    ? fut.nombres_apellidos.substring(0, 2).toUpperCase()
                    : 'AL';
                  return (
                    <tr key={fut.id}>
                      <td className="doc-td-bold">
                        <div className="doc-student-row">
                          <span className="doc-student-sigla">{siglas}</span>
                          <span className="doc-truncate-text">
                            {fut.nombres_apellidos || 'Estudiante'}
                          </span>
                        </div>
                      </td>
                      <td>{fut.sumilla || 'Solicitud registrada'}</td>
                      <td className="doc-td-muted">
                        {new Date(fut.fecha_solicitud || Date.now()).toLocaleDateString('es-PE')}
                      </td>
                      <td>
                        <span className="doc-badge-aprobado">Aprobado</span>
                      </td>
                      <td className="doc-td-right">
                        <button
                          type="button"
                          onClick={() =>
                            window.alert(
                              `Fundamento registrado: ${
                                fut.fundamento || 'Sin detalle adicional.'
                              }`
                            )
                          }
                          className="doc-eye-btn"
                          title="Ver fundamento"
                          aria-label="Ver fundamento"
                        >
                          <Eye className="doc-icon-sm" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DocentesLayout() {
  const [teacherUser, setTeacherUser] = useState<{
    nombres?: string;
    apellidos?: string;
    codigo?: string;
    especialidad?: string;
    institucionNombre?: string;
  } | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('usuarioLogueado');
    if (sessionData) {
      try {
        setTeacherUser(JSON.parse(sessionData));
      } catch (e) {
        console.error('Error al parsear usuario docente:', e);
      }
    }
  }, []);

  const nombreInstitucion = teacherUser?.institucionNombre || 'Institución Educativa';
  const fullName = teacherUser
    ? `${teacherUser.nombres || ''} ${teacherUser.apellidos || ''}`.trim() ||
      'Docente Institucional'
    : 'Docente Institucional';
  const especialidad = teacherUser?.especialidad || 'Gestión Académica Docente';
  const codigoDocente = teacherUser?.codigo || 'DOC-2026';

  const getInitials = (name: string) => {
    if (!name) return 'DC';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const [active, setActive] = useState<DocenteSectionId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('progresa_docente_section') as DocenteSectionId | null;
      const validIds: DocenteSectionId[] = [
        'panel',
        'calificaciones',
        'asistencias',
        'horarios',
        'cursos',
        'futs'
      ];
      if (saved && validIds.includes(saved)) {
        return saved;
      }
    }
    return 'panel';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [futsAprobados, setFutsAprobados] = useState<FutAprobado[]>([]);
  const [cargandoFuts, setCargandoFuts] = useState<boolean>(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const guardados = localStorage.getItem('ua_futs_aprobados');
        if (guardados) {
          const parsed = JSON.parse(guardados);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFutsAprobados(parsed);
            setCargandoFuts(false);
            return;
          }
        }
      } catch {
        // Usar respaldo inicial
      }
      setFutsAprobados(FUTS_APROBADOS_DEMO);
      setCargandoFuts(false);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const handleNavigate = (sec: DocenteSectionId) => {
    setActive(sec);
    localStorage.setItem('progresa_docente_section', sec);
    setMobileOpen(false);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      for (const group of docenteMenuGroups) {
        const match = group.items.find((item) => item.label.toLowerCase().includes(q));
        if (match) {
          handleNavigate(match.id);
          setSearchQuery('');
          break;
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('progresa_student_section');
    localStorage.removeItem('progresa_docente_section');
    window.location.reload();
  };

  const renderView = () => {
    switch (active) {
      case 'panel':
        return (
          <PanelDocenteHome
            onNavigate={handleNavigate}
            futsAprobados={futsAprobados}
            cargandoFuts={cargandoFuts}
          />
        );
      case 'calificaciones':
        return <Calificaciones />
      case 'asistencias':
        return <Asistencias/>
      case 'horarios':
        return <Horarios/>
      case 'cursos':
        return <Cursos />;
      case 'futs':
        return (
          <div className="doc-panel-card">
            <div className="doc-panel-card-head">
              <div>
                <h3 className="doc-panel-card-title">
                  <FileCheck2 className="doc-icon-sm doc-ico-sky" />
                  <span>FUTs y Justificaciones Aprobadas</span>
                </h3>
                <p className="doc-panel-card-sub">
                  Registro completo de trámites validados para tus grupos
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate('panel')}
                className="doc-link-btn"
              >
                Volver al panel
              </button>
            </div>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Asunto / Sumilla</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="doc-th-right">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {futsAprobados.map((fut) => (
                    <tr key={fut.id}>
                      <td className="doc-td-bold">{fut.nombres_apellidos || 'Estudiante'}</td>
                      <td>{fut.sumilla || 'Solicitud registrada'}</td>
                      <td className="doc-td-muted">
                        {new Date(fut.fecha_solicitud || Date.now()).toLocaleDateString('es-PE')}
                      </td>
                      <td>
                        <span className="doc-badge-aprobado">Aprobado</span>
                      </td>
                      <td className="doc-td-right">
                        <button
                          type="button"
                          onClick={() =>
                            window.alert(
                              `Fundamento registrado: ${
                                fut.fundamento || 'Sin detalle adicional.'
                              }`
                            )
                          }
                          className="doc-eye-btn"
                          title="Ver fundamento"
                        >
                          <Eye className="doc-icon-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="doc-shell">
      {mobileOpen && (
        <div
          className="doc-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`doc-sidebar ${mobileOpen ? 'doc-sidebar-open' : ''}`}>
        <div className="doc-sidebar-header">
          <div className="doc-brand-box">
            <div className="doc-brand-icon">
              <GraduationCap className="doc-icon-lg" />
            </div>
            <div className="doc-truncate-wrap">
              <span className="doc-brand-name" title={nombreInstitucion}>
                {nombreInstitucion}
              </span>
              <span className="doc-brand-sub">Sistema Académico</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="doc-close-btn"
            aria-label="Cerrar menú"
          >
            <X className="doc-icon-md" />
          </button>
        </div>

        <nav className="doc-nav">
          {docenteMenuGroups.map((group, idx) => (
            <div key={idx} className="doc-nav-group">
              {group.title && <h4 className="doc-nav-title">{group.title}</h4>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`doc-nav-btn ${isActive ? 'doc-nav-btn-active' : ''}`}
                  >
                    <span className={isActive ? 'doc-nav-icon-active' : 'doc-nav-icon'}>
                      <Icon className="doc-icon-md" />
                    </span>
                    <span className="doc-truncate-text">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="doc-sidebar-footer">
          <div className="doc-user-box">
            <div className="doc-user-info">
              <div className="doc-avatar">{getInitials(fullName)}</div>
              <div className="doc-truncate-wrap">
                <p className="doc-user-name">{fullName}</p>
                <p className="doc-user-code">Cód: {codigoDocente}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="doc-logout-btn"
            >
              <LogOut className="doc-icon-md" />
            </button>
          </div>
        </div>
      </aside>

      <main className="doc-main">
        <header className="doc-topbar">
          <div className="doc-topbar-left">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="doc-menu-btn"
              aria-label="Abrir menú"
            >
              <Menu className="doc-icon-lg" />
            </button>

            <div className="doc-search-wrap">
              <Search className="doc-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Ir a módulo (ej. asistencias, cursos)..."
                className="doc-search-input"
              />
            </div>
          </div>

          <div className="doc-topbar-right">
            <div
              className={`doc-net-badge ${
                isOnline ? 'doc-net-online' : 'doc-net-offline'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="doc-icon-sm" />
                  <span>Conectado</span>
                </>
              ) : (
                <>
                  <WifiOff className="doc-icon-sm" />
                  <span>Modo sin conexión</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavigate('futs')}
              title="FUTs aprobados"
              aria-label="FUTs aprobados"
              className="doc-bell-btn"
            >
              <Bell className="doc-icon-md" />
              <span className="doc-bell-dot" />
            </button>
          </div>
        </header>

        <div className="doc-content">
          {active === 'panel' && (
            <div className="doc-hero">
              <span className="doc-hero-kicker">
                Portal del Docente · Periodo Académico 2026
              </span>
              <h1 className="doc-hero-title">
                Bienvenido(a), {teacherUser?.nombres ? teacherUser.nombres : 'Docente'}
              </h1>
              <p className="doc-hero-subtitle">
                {especialidad} — {nombreInstitucion}
              </p>
            </div>
          )}

          {renderView()}
        </div>

        <footer className="doc-footer">
          <span className="doc-footer-brand">
            Progresa App — Sistema de Gestión Académica
          </span>
          <span>Soporte institucional · Sincronización automática activa</span>
        </footer>
      </main>
    </div>
  );
}