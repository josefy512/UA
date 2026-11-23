import React, { useState, useEffect } from 'react';
import './Inicio.css';
import Tareas from '../Tareas/Tareas';
import Calendario from '../Calendario/Calendario';
import Biblioteca from '../Biblioteca/Biblioteca';
import Pagos from '../Pagos/Pagos';
import Documentos from '../Documentos/Documentos';
import Directorio from '../Directorio/Directorio';
import {
  Calendar,
  CheckSquare,
  BookOpen,
  MessageSquare,
  Users,
  TrendingUp,
  Briefcase,
  FileText,
  Search,
  Bell,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  Menu,
  X,
  LogOut,
  CreditCard,
  Home,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

type SectionId =
  | 'panel'
  | 'calendario'
  | 'tareas'
  | 'recursos'
  | 'foros'
  | 'directorio'
  | 'progreso'
  | 'bolsa'
  | 'documentos'
  | 'pagos';

type MenuItem = {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
};

type MenuGroup = {
  title?: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    items: [
      { id: 'panel', label: 'Panel Principal', icon: <Home className="inicio-icon-md" /> }
    ]
  },
  {
    title: 'GESTIÓN ACADÉMICA',
    items: [
      { id: 'calendario', label: 'Calendario', icon: <Calendar className="inicio-icon-md" /> },
      { id: 'tareas', label: 'Tareas', icon: <CheckSquare className="inicio-icon-md" /> },
      { id: 'recursos', label: 'Biblioteca y Recursos', icon: <BookOpen className="inicio-icon-md" /> },
      { id: 'progreso', label: 'Promedios', icon: <TrendingUp className="inicio-icon-md" /> }
    ]
  },
  {
    title: 'TRÁMITES Y TESORERÍA',
    items: [
      { id: 'pagos', label: 'Estado de Pagos', icon: <CreditCard className="inicio-icon-md" /> },
      { id: 'documentos', label: 'Documentos y Constancias', icon: <FileText className="inicio-icon-md" /> }
    ]
  },
  {
    title: 'COMUNIDAD Y CARRERA',
    items: [
      { id: 'foros', label: 'Comunicados Oficiales', icon: <MessageSquare className="inicio-icon-md" /> },
      { id: 'directorio', label: 'Directorio Institucional', icon: <Users className="inicio-icon-md" /> },
      { id: 'bolsa', label: 'Bolsa Laboral', icon: <Briefcase className="inicio-icon-md" /> }
    ]
  }
];

const PanelControlView = ({ onNavigate }: { onNavigate: (sec: SectionId) => void }) => (
  <div className="inicio-section-stack">
    <div>
      <h2 className="inicio-group-heading">Situación Académica Actual</h2>
      <div className="inicio-kpi-grid">
        <div
          onClick={() => onNavigate('tareas')}
          className="inicio-kpi-card inicio-kpi-amber"
        >
          <div className="inicio-kpi-top">
            <span className="inicio-kpi-label">Actividades Pendientes</span>
            <span className="inicio-tag inicio-tag-amber">
              <AlertTriangle className="inicio-icon-xs" />
              Por entregar
            </span>
          </div>
          <div className="inicio-kpi-value-row">
            <span className="inicio-kpi-number">5</span>
            <span className="inicio-kpi-subtext inicio-text-amber">2 próximas a vencer</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('calendario')}
          className="inicio-kpi-card inicio-kpi-blue"
        >
          <div className="inicio-kpi-top">
            <span className="inicio-kpi-label">Próxima Evaluación</span>
            <span className="inicio-tag inicio-tag-blue">
              <Clock className="inicio-icon-xs" />
              En 2 días
            </span>
          </div>
          <h3 className="inicio-kpi-course">Cálculo II</h3>
          <p className="inicio-kpi-desc">Evaluación parcial programada</p>
        </div>

        <div
          onClick={() => onNavigate('progreso')}
          className="inicio-kpi-card inicio-kpi-emerald"
        >
          <div className="inicio-kpi-top">
            <span className="inicio-kpi-label">Promedio Ponderado</span>
            <span className="inicio-tag inicio-tag-emerald">
              <TrendingUp className="inicio-icon-xs" />
              Aprobado
            </span>
          </div>
          <div className="inicio-kpi-value-row">
            <span className="inicio-kpi-number">16.8</span>
            <span className="inicio-kpi-subtext inicio-text-emerald">Periodo vigente</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div className="inicio-shortcuts-header">
        <h2 className="inicio-group-heading" style={{ marginBottom: 0 }}>
          Accesos Frecuentes
        </h2>
        <button
          type="button"
          onClick={() => onNavigate('documentos')}
          className="inicio-link-btn"
        >
          Ver trámites y documentos
        </button>
      </div>

      <div className="inicio-shortcuts-grid">
        <div
          onClick={() => onNavigate('tareas')}
          className="inicio-shortcut-card"
        >
          <div className="inicio-shortcut-left">
            <div className="inicio-shortcut-icon inicio-shortcut-icon-navy">
              <CheckSquare className="inicio-icon-lg" />
            </div>
            <div className="inicio-truncate-wrap">
              <h4 className="inicio-shortcut-title">Entrega de Tareas</h4>
              <p className="inicio-shortcut-desc">Subir proyectos y prácticas</p>
            </div>
          </div>
          <ChevronRight className="inicio-chevron" />
        </div>

        <div
          onClick={() => onNavigate('pagos')}
          className="inicio-shortcut-card"
        >
          <div className="inicio-shortcut-left">
            <div className="inicio-shortcut-icon inicio-shortcut-icon-sky">
              <CreditCard className="inicio-icon-lg" />
            </div>
            <div className="inicio-truncate-wrap">
              <h4 className="inicio-shortcut-title">Pagos y Pensiones</h4>
              <p className="inicio-shortcut-desc">Consultar cuotas y recibos</p>
            </div>
          </div>
          <ChevronRight className="inicio-chevron" />
        </div>

        <div
          onClick={() => onNavigate('recursos')}
          className="inicio-shortcut-card"
        >
          <div className="inicio-shortcut-left">
            <div className="inicio-shortcut-icon inicio-shortcut-icon-navy">
              <BookOpen className="inicio-icon-lg" />
            </div>
            <div className="inicio-truncate-wrap">
              <h4 className="inicio-shortcut-title">Material de Estudio</h4>
              <p className="inicio-shortcut-desc">Sílabos, guías y bibliografía</p>
            </div>
          </div>
          <ChevronRight className="inicio-chevron" />
        </div>
      </div>
    </div>
  </div>
);

const ModuloPendienteView = ({ title }: { title: string }) => (
  <div className="inicio-placeholder-card">
    <h2 className="inicio-placeholder-title">{title}</h2>
    <p className="inicio-placeholder-desc">
      Módulo listo para conectar en la estructura de <code>Componentes/Alumnos</code>.
    </p>
  </div>
);

export default function Inicio() {
  const [studentUser, setStudentUser] = useState<{
    nombres: string;
    apellidos: string;
    codigo: string;
    carrera?: string;
    institucionNombre?: string;
  } | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('usuarioLogueado');
    if (sessionData) {
      try {
        setStudentUser(JSON.parse(sessionData));
      } catch (e) {
        console.error('Error al parsear el usuario logueado:', e);
      }
    }
  }, []);

  const nombreInstitucion = studentUser?.institucionNombre || 'Institución Educativa';
  const fullName = studentUser
    ? `${studentUser.nombres} ${studentUser.apellidos}`
    : 'Alumno Registrado';
  const carrera = studentUser?.carrera || 'Programa de Estudios';
  const codigoAlumno = studentUser?.codigo || 'EST-2026';

  const getInitials = (name: string) => {
    if (!name) return 'ER';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const [active, setActive] = useState<SectionId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('progresa_student_section') as SectionId | null;
      const validIds: SectionId[] = [
        'panel',
        'calendario',
        'tareas',
        'recursos',
        'foros',
        'directorio',
        'progreso',
        'bolsa',
        'documentos',
        'pagos'
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

  const handleNavigate = (sec: SectionId) => {
    setActive(sec);
    localStorage.setItem('progresa_student_section', sec);
    setMobileOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      for (const group of menuGroups) {
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
    window.location.reload();
  };

  const renderView = () => {
    switch (active) {
      case 'panel':
        return <PanelControlView onNavigate={handleNavigate} />;
      case 'calendario':
        return <Calendario />;
      case 'tareas':
        return <Tareas />;
      case 'recursos':
        return <Biblioteca />;
      case 'foros':
        return <ModuloPendienteView title="Comunicados Oficiales" />;
      case 'directorio':
        return <Directorio />;
      case 'progreso':
        return <ModuloPendienteView title="Promedios" />;
      case 'bolsa':
        return <ModuloPendienteView title="Bolsa Laboral" />;
      case 'documentos':
        return <Documentos />;
      case 'pagos':
        return <Pagos />;
    }
  };

  return (
    <div className="inicio-shell">
      {mobileOpen && (
        <div
          className="inicio-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`inicio-sidebar ${mobileOpen ? 'inicio-sidebar-open' : ''}`}>
        <div className="inicio-sidebar-header">
          <div className="inicio-brand-box">
            <div className="inicio-brand-icon">
              <GraduationCap className="inicio-icon-lg" />
            </div>
            <div className="inicio-truncate-wrap">
              <span className="inicio-brand-name" title={nombreInstitucion}>
                {nombreInstitucion}
              </span>
              <span className="inicio-brand-sub">Sistema Académico</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inicio-close-btn"
            aria-label="Cerrar menú"
          >
            <X className="inicio-icon-md" />
          </button>
        </div>

        <nav className="inicio-nav">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="inicio-nav-group">
              {group.title && <h4 className="inicio-nav-title">{group.title}</h4>}
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`inicio-nav-btn ${isActive ? 'inicio-nav-btn-active' : ''}`}
                  >
                    <span className={isActive ? 'inicio-nav-icon-active' : 'inicio-nav-icon'}>
                      {item.icon}
                    </span>
                    <span className="inicio-truncate-text">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="inicio-sidebar-footer">
          <div className="inicio-user-box">
            <div className="inicio-user-info">
              <div className="inicio-avatar">{getInitials(fullName)}</div>
              <div className="inicio-truncate-wrap">
                <p className="inicio-user-name">{fullName}</p>
                <p className="inicio-user-code">Cód: {codigoAlumno}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="inicio-logout-btn"
            >
              <LogOut className="inicio-icon-md" />
            </button>
          </div>
        </div>
      </aside>

      <main className="inicio-main">
        <header className="inicio-topbar">
          <div className="inicio-topbar-left">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inicio-menu-btn"
              aria-label="Abrir menú"
            >
              <Menu className="inicio-icon-lg" />
            </button>

            <div className="inicio-search-wrap">
              <Search className="inicio-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Ir a módulo (ej. pagos, tareas)..."
                className="inicio-search-input"
              />
            </div>
          </div>

          <div className="inicio-topbar-right">
            <div
              className={`inicio-net-badge ${
                isOnline ? 'inicio-net-online' : 'inicio-net-offline'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="inicio-icon-sm" />
                  <span>Conectado</span>
                </>
              ) : (
                <>
                  <WifiOff className="inicio-icon-sm" />
                  <span>Modo sin conexión</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavigate('foros')}
              title="Comunicados oficiales"
              aria-label="Comunicados oficiales"
              className="inicio-bell-btn"
            >
              <Bell className="inicio-icon-md" />
              <span className="inicio-bell-dot" />
            </button>
          </div>
        </header>

        <div className="inicio-content">
          {active === 'panel' && (
            <div className="inicio-hero">
              <span className="inicio-hero-kicker">
                Portal del Estudiante · Periodo Académico 2026
              </span>
              <h1 className="inicio-hero-title">
                Bienvenido(a), {studentUser ? studentUser.nombres : 'Estudiante'}
              </h1>
              <p className="inicio-hero-subtitle">
                {carrera} — {nombreInstitucion}
              </p>
            </div>
          )}

          {renderView()}
        </div>

        <footer className="inicio-footer">
          <span className="inicio-footer-brand">
            Progresa App — Sistema de Gestión Académica
          </span>
          <span>Soporte institucional · Sincronización automática activa</span>
        </footer>
      </main>
    </div>
  );
}