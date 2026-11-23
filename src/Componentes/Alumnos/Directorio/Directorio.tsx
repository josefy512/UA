import { useState, useMemo } from 'react';
import './Directorio.css';
import {
  Search,
  Download,
  Calendar,
  Mail,
  Clock,
  MapPin,
  Copy,
  Building2,
  GraduationCap,
  CheckCircle2,
  User,
  Send
} from 'lucide-react';

interface DocenteContacto {
  id: string;
  iniciales: string;
  nombre: string;
  cargo: string;
  departamento: string;
  curso: string;
  grupo?: string;
  email: string;
  horario: string;
  ubicacion: string;
  disponibilidad: string;
}

interface AreaAdministrativa {
  id: string;
  sigla: string;
  nombre: string;
  responsable: string;
  email: string;
  horario: string;
  ubicacion: string;
  canal: string;
}

const DOCENTES: DocenteContacto[] = [
  {
    id: '1',
    iniciales: 'RV',
    nombre: 'Prof. Dr. Ramiro Valdivia',
    cargo: 'Docente Titular',
    departamento: 'Departamento de Ciencias Básicas',
    curso: 'Cálculo II (MAT-204)',
    grupo: 'Grupo A',
    email: 'r.valdivia@institucion.edu.pe',
    horario: 'Martes y Jueves · 15:00 - 17:00',
    ubicacion: 'Pabellón B · Cubículo 204',
    disponibilidad: 'Atención programada'
  },
  {
    id: '2',
    iniciales: 'MC',
    nombre: 'Ing. Martha Córdova, M.Sc.',
    cargo: 'Coordinadora de Cátedra',
    departamento: 'Departamento de Estructuras',
    curso: 'Resistencia de Materiales (CIV-301)',
    grupo: 'Mecánica de Sólidos',
    email: 'm.cordova@institucion.edu.pe',
    horario: 'Lunes y Miércoles · 10:00 - 12:30',
    ubicacion: 'Pabellón Tecnológico · Lab. 1',
    disponibilidad: 'Horario regular'
  },
  {
    id: '3',
    iniciales: 'JM',
    nombre: 'Lic. Javier Mendoza, Ph.D.',
    cargo: 'Docente Investigador',
    departamento: 'Departamento de Física Aplicada',
    curso: 'Física II - Electromagnetismo (FIS-102)',
    email: 'j.mendoza@institucion.edu.pe',
    horario: 'Viernes · 08:00 - 12:00',
    ubicacion: 'Pabellón A · Oficina 210',
    disponibilidad: 'Asesoría previa cita'
  },
  {
    id: '4',
    iniciales: 'DM',
    nombre: 'Ing. Daniel Morales',
    cargo: 'Docente Asociado',
    departamento: 'Departamento de Topografía',
    curso: 'Topografía Aplicada (CIV-205)',
    email: 'd.morales@institucion.edu.pe',
    horario: 'Jueves · 14:00 - 18:00',
    ubicacion: 'Área de Prácticas · Cubículo 102',
    disponibilidad: 'Atención programada'
  },
  {
    id: '5',
    iniciales: 'EV',
    nombre: 'Dra. Elena Vásquez',
    cargo: 'Coordinadora de Área',
    departamento: 'Departamento de Geotecnia',
    curso: 'Mecánica de Suelos I',
    email: 'e.vasquez@institucion.edu.pe',
    horario: 'Lunes · 14:00 - 16:00',
    ubicacion: 'Laboratorio Central · L-3',
    disponibilidad: 'Horario regular'
  },
  {
    id: '6',
    iniciales: 'CB',
    nombre: 'Arq. Carlos Benavides',
    cargo: 'Docente de Especialidad',
    departamento: 'Departamento de Edificaciones',
    curso: 'Diseño y Arquitectura II',
    email: 'c.benavides@institucion.edu.pe',
    horario: 'Miércoles · 16:00 - 19:00',
    ubicacion: 'Taller de Diseño 4',
    disponibilidad: 'Horario regular'
  }
];

const AREAS_ADMINISTRATIVAS: AreaAdministrativa[] = [
  {
    id: 'adm-1',
    sigla: 'SG',
    nombre: 'Secretaría Académica y Registros',
    responsable: 'Oficina de Matrícula y Constancias',
    email: 'secretaria@institucion.edu.pe',
    horario: 'Lun - Vie · 08:00 - 17:00',
    ubicacion: 'Primer Piso · Pabellón Central',
    canal: 'Presencial / Trámite FUT'
  },
  {
    id: 'adm-2',
    sigla: 'TS',
    nombre: 'Tesorería y Caja Institucional',
    responsable: 'Control de Pensiones y Comprobantes',
    email: 'tesoreria@institucion.edu.pe',
    horario: 'Lun - Vie · 08:30 - 17:30',
    ubicacion: 'Primer Piso · Ventanilla 2',
    canal: 'Presencial / Virtual'
  },
  {
    id: 'adm-3',
    sigla: 'BD',
    nombre: 'Bienestar y Soporte Estudiantil',
    responsable: 'Orientación y Seguimiento Académico',
    email: 'bienestar@institucion.edu.pe',
    horario: 'Lun - Vie · 09:00 - 17:00',
    ubicacion: 'Segundo Piso · Ala Norte',
    canal: 'Cita previa'
  },
  {
    id: 'adm-4',
    sigla: 'TI',
    nombre: 'Soporte de Sistemas y Plataforma',
    responsable: 'Administración de Cuentas y Accesos',
    email: 'sistemas@institucion.edu.pe',
    horario: 'Lun - Vie · 08:00 - 18:00',
    ubicacion: 'Centro de Cómputo · Piso 2',
    canal: 'Correo institucional'
  }
];

export default function DirectorioView() {
  const [activeTab, setActiveTab] = useState<'docentes' | 'direccion'>('docentes');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    window.setTimeout(() => setCopiedEmail(null), 2000);
  };

  const docentesFiltrados = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return DOCENTES;
    return DOCENTES.filter(
      (d) =>
        d.nombre.toLowerCase().includes(q) ||
        d.curso.toLowerCase().includes(q) ||
        d.departamento.toLowerCase().includes(q) ||
        d.cargo.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const areasFiltradas = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return AREAS_ADMINISTRATIVAS;
    return AREAS_ADMINISTRATIVAS.filter(
      (a) =>
        a.nombre.toLowerCase().includes(q) ||
        a.responsable.toLowerCase().includes(q) ||
        a.ubicacion.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  return (
    <div className="dir-root">
      {/* Encabezado del módulo y acciones */}
      <div className="dir-card dir-header">
        <div className="dir-truncate-wrap">
          <div className="dir-title-row">
            <h2 className="dir-title">Directorio Institucional</h2>
            <span className="dir-period-badge">Periodo 2026-II</span>
          </div>
          <p className="dir-subtitle">
            Correos institucionales, horarios de atención y ubicaciones de docentes y áreas administrativas.
          </p>
        </div>

        <div className="dir-header-actions">
          <button type="button" className="dir-btn-secondary">
            <Download className="dir-icon-md dir-ico-sky" />
            <span>Descargar directorio</span>
          </button>
          <button type="button" className="dir-btn-primary">
            <Calendar className="dir-icon-md" />
            <span>Solicitar atención</span>
          </button>
        </div>
      </div>

      {/* Indicadores numéricos sobrios */}
      <div className="dir-stats-grid">
        <div className="dir-card dir-stat-card">
          <div className="dir-stat-icon">
            <GraduationCap className="dir-icon-md" />
          </div>
          <div className="dir-truncate-wrap">
            <p className="dir-stat-label">Plana docente</p>
            <p className="dir-stat-value">{DOCENTES.length} contactos registrados</p>
          </div>
        </div>

        <div className="dir-card dir-stat-card">
          <div className="dir-stat-icon">
            <Building2 className="dir-icon-md" />
          </div>
          <div className="dir-truncate-wrap">
            <p className="dir-stat-label">Áreas administrativas</p>
            <p className="dir-stat-value">
              {AREAS_ADMINISTRATIVAS.length} oficinas activas
            </p>
          </div>
        </div>

        <div className="dir-card dir-stat-card">
          <div className="dir-stat-icon">
            <User className="dir-icon-md" />
          </div>
          <div className="dir-truncate-wrap">
            <p className="dir-stat-label">Canal de consultas</p>
            <p className="dir-stat-value">Correo institucional</p>
          </div>
        </div>

        <div className="dir-card dir-stat-card">
          <div className="dir-stat-icon">
            <Clock className="dir-icon-md" />
          </div>
          <div className="dir-truncate-wrap">
            <p className="dir-stat-label">Horario de atención</p>
            <p className="dir-stat-value">Lun - Vie · 08:00 - 18:00</p>
          </div>
        </div>
      </div>

      {/* Pestañas y buscador */}
      <div className="dir-card dir-toolbar">
        <div className="dir-tabs-box" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'docentes'}
            onClick={() => setActiveTab('docentes')}
            className={`dir-tab-btn ${activeTab === 'docentes' ? 'dir-tab-btn-active' : ''}`}
          >
            <GraduationCap className="dir-icon-sm dir-ico-sky" />
            <span>Plana docente ({DOCENTES.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'direccion'}
            onClick={() => setActiveTab('direccion')}
            className={`dir-tab-btn ${activeTab === 'direccion' ? 'dir-tab-btn-active' : ''}`}
          >
            <Building2 className="dir-icon-sm dir-ico-sky" />
            <span>Áreas y administración ({AREAS_ADMINISTRATIVAS.length})</span>
          </button>
        </div>

        <div className="dir-search-wrap">
          <Search className="dir-search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, curso o dependencia..."
            className="dir-search-input"
          />
        </div>
      </div>

      {/* Pestaña 1: Plana Docente */}
      {activeTab === 'docentes' && (
        <div className="dir-section-stack">
          <div className="dir-section-head">
            <h3 className="dir-section-title">Contactos Docentes</h3>
            <span>{docentesFiltrados.length} resultado(s)</span>
          </div>

          {docentesFiltrados.length === 0 ? (
            <div className="dir-card dir-empty-box">
              No se encontraron docentes con ese criterio de búsqueda.
            </div>
          ) : (
            <div className="dir-teachers-grid">
              {docentesFiltrados.map((doc) => (
                <div key={doc.id} className="dir-card dir-teacher-card">
                  <div className="dir-teacher-top">
                    <div className="dir-teacher-header">
                      <div className="dir-avatar-box">
                        <span className="dir-avatar-initials">{doc.iniciales}</span>
                        <User className="dir-avatar-subicon" />
                      </div>
                      <div className="dir-truncate-wrap">
                        <span className="dir-role-badge">{doc.cargo}</span>
                        <h4 className="dir-teacher-name">{doc.nombre}</h4>
                      </div>
                    </div>

                    <p className="dir-dept-text">{doc.departamento}</p>

                    <div className="dir-tags-row">
                      <span className="dir-course-chip">{doc.curso}</span>
                      {doc.grupo && <span className="dir-group-chip">{doc.grupo}</span>}
                    </div>
                  </div>

                  <div className="dir-contact-box">
                    <div className="dir-email-row">
                      <div className="dir-email-left">
                        <Mail className="dir-icon-sm dir-ico-sky" />
                        <span className="dir-truncate-text">{doc.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(doc.email)}
                        title="Copiar correo"
                        className="dir-copy-btn"
                      >
                        {copiedEmail === doc.email ? (
                          <CheckCircle2 className="dir-icon-sm dir-ico-emerald" />
                        ) : (
                          <Copy className="dir-icon-sm" />
                        )}
                      </button>
                    </div>

                    <div className="dir-meta-line">
                      <Clock className="dir-icon-sm dir-ico-muted" />
                      <span className="dir-truncate-text">{doc.horario}</span>
                    </div>

                    <div className="dir-meta-line">
                      <MapPin className="dir-icon-sm dir-ico-muted" />
                      <span className="dir-truncate-text">{doc.ubicacion}</span>
                    </div>
                  </div>

                  <div className="dir-card-actions">
                    <a href={`mailto:${doc.email}`} className="dir-btn-write">
                      <Send className="dir-icon-sm" />
                      <span>Escribir</span>
                    </a>

                    <button type="button" className="dir-btn-schedule">
                      <Calendar className="dir-icon-sm dir-ico-sky" />
                      <span>Agendar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pestaña 2: Dirección y Administración */}
      {activeTab === 'direccion' && (
        <div className="dir-section-stack">
          <div className="dir-section-head">
            <h3 className="dir-section-title">Dependencias Administrativas</h3>
            <span>{areasFiltradas.length} oficina(s)</span>
          </div>

          {areasFiltradas.length === 0 ? (
            <div className="dir-card dir-empty-box">
              No se encontraron áreas con ese criterio de búsqueda.
            </div>
          ) : (
            <div className="dir-areas-grid">
              {areasFiltradas.map((area) => (
                <div key={area.id} className="dir-card dir-area-card">
                  <div className="dir-area-top">
                    <div className="dir-area-left">
                      <div className="dir-sigla-box">{area.sigla}</div>
                      <div className="dir-truncate-wrap">
                        <h4 className="dir-area-name">{area.nombre}</h4>
                        <p className="dir-area-resp">{area.responsable}</p>
                      </div>
                    </div>
                    <span className="dir-channel-badge">{area.canal}</span>
                  </div>

                  <div className="dir-contact-box">
                    <div className="dir-email-row">
                      <div className="dir-email-left">
                        <Mail className="dir-icon-sm dir-ico-sky" />
                        <span className="dir-truncate-text">{area.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(area.email)}
                        title="Copiar correo"
                        className="dir-copy-btn"
                      >
                        {copiedEmail === area.email ? (
                          <CheckCircle2 className="dir-icon-sm dir-ico-emerald" />
                        ) : (
                          <Copy className="dir-icon-sm" />
                        )}
                      </button>
                    </div>

                    <div className="dir-meta-line">
                      <Clock className="dir-icon-sm dir-ico-muted" />
                      <span className="dir-truncate-text">{area.horario}</span>
                    </div>

                    <div className="dir-meta-line">
                      <MapPin className="dir-icon-sm dir-ico-muted" />
                      <span className="dir-truncate-text">{area.ubicacion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}