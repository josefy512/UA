import React, { useState, useEffect, useCallback } from 'react';
import './Cursos.css';
import {
  Search,
  MapPin,
  Clock,
  Users,
  BookOpen,
  Loader2,
  Upload,
  FileCheck,
  X,
  ExternalLink
} from 'lucide-react';

interface DelegadoCurso {
  nombre: string;
  avatar: string;
  email: string;
}

interface CursoDocente {
  id: string;
  codigo: string;
  grupo: string;
  nombre: string;
  ubicacion: string;
  horario: string;
  matriculados: number;
  semana: string;
  silaboUrl: string | null;
  silaboNombre?: string;
  delegado: DelegadoCurso;
}

const CURSOS_INICIALES: CursoDocente[] = [
  {
    id: 'cur-302',
    codigo: 'HAR-302',
    grupo: 'Grupo 4B · Turno Mañana',
    nombre: 'Historia del Arte Moderno',
    ubicacion: 'Aula 102 · Pabellón B',
    horario: 'Lun y Mié 10:00 – 11:30 AM',
    matriculados: 40,
    semana: 'Semana 12 de 16',
    silaboUrl: null,
    delegado: {
      nombre: 'Lucas Romero Quispe',
      avatar: 'LR',
      email: 'lromero@institucion.edu.pe'
    }
  },
  {
    id: 'cur-101',
    codigo: 'HAR-101',
    grupo: 'Grupo 1A · Turno Mañana',
    nombre: 'Fundamentos del Diseño Visual',
    ubicacion: 'Aula 204 · Pabellón A',
    horario: 'Lun y Mié 08:00 – 09:30 AM',
    matriculados: 38,
    semana: 'Sílabo Vigente',
    silaboUrl: null,
    delegado: {
      nombre: 'Ana García Méndez',
      avatar: 'AG',
      email: 'agarcia@institucion.edu.pe'
    }
  },
  {
    id: 'cur-205',
    codigo: 'DES-205',
    grupo: 'Grupo 2B · Turno Tarde',
    nombre: 'Taller de Expresión y Composición',
    ubicacion: 'Taller 108 · Pabellón de Artes',
    horario: 'Mar y Jue 02:00 – 03:30 PM',
    matriculados: 34,
    semana: 'Semana 8 de 16',
    silaboUrl: null,
    delegado: {
      nombre: 'Sofía Morales Benítez',
      avatar: 'SM',
      email: 'smorales@institucion.edu.pe'
    }
  },
  {
    id: 'cur-404',
    codigo: 'GES-404',
    grupo: 'Grupo 5A · Turno Tarde',
    nombre: 'Gestión Cultural y Proyectos',
    ubicacion: 'Aula 301 · Edificio Central',
    horario: 'Vie 09:00 AM – 12:15 PM',
    matriculados: 32,
    semana: 'Semana 4 de 16',
    silaboUrl: null,
    delegado: {
      nombre: 'Valeria Castro Silva',
      avatar: 'VC',
      email: 'vcastro@institucion.edu.pe'
    }
  }
];

export default function MisCursosPanel() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cursos, setCursos] = useState<CursoDocente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoDocente | null>(null);
  const [archivoPDF, setArchivoPDF] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState<boolean>(false);
  const [mensajeSubida, setMensajeSubida] = useState<string>('');

  const cargarCursos = useCallback(() => {
    setLoading(true);
    try {
      const guardados = localStorage.getItem('ua_cursos_docente');
      if (guardados) {
        const parsed = JSON.parse(guardados) as CursoDocente[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCursos(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Usar catálogo base si el almacenamiento local no tiene datos válidos
    }

    setCursos(CURSOS_INICIALES);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      cargarCursos();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [cargarCursos]);

  const cerrarModal = () => {
    if (subiendo) return;
    setCursoSeleccionado(null);
    setArchivoPDF(null);
    setMensajeSubida('');
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMensajeSubida('');

    if (!file) {
      setArchivoPDF(null);
      return;
    }

    const esPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!esPdf) {
      setArchivoPDF(null);
      setMensajeSubida('Selecciona un archivo en formato PDF (.pdf).');
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setArchivoPDF(null);
      setMensajeSubida('El archivo supera el límite máximo de 10 MB.');
      return;
    }

    setArchivoPDF(file);
  };

  const handleSubirSilabo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!archivoPDF || !cursoSeleccionado) return;

    setSubiendo(true);
    setMensajeSubida('');

    const objectUrl = URL.createObjectURL(archivoPDF);
    const actualizado: CursoDocente[] = cursos.map((c) =>
      c.id === cursoSeleccionado.id
        ? {
            ...c,
            silaboUrl: objectUrl,
            silaboNombre: archivoPDF.name,
            semana: 'Sílabo Publicado'
          }
        : c
    );

    setCursos(actualizado);
    try {
      const serializable = actualizado.map(({ silaboUrl: _blob, ...rest }) => ({
        ...rest,
        silaboUrl: null
      }));
      localStorage.setItem('ua_cursos_docente', JSON.stringify(serializable));
    } catch {
      // Ignorar errores de cuota local
    }

    setMensajeSubida('Sílabo adjuntado correctamente para esta sesión.');
    setSubiendo(false);

    window.setTimeout(() => {
      setCursoSeleccionado(null);
      setArchivoPDF(null);
      setMensajeSubida('');
    }, 1000);
  };

  const cursosFiltrados = cursos.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.codigo.toLowerCase().includes(q) ||
      c.grupo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="cur-root">
      <header className="cur-header">
        <div className="cur-header-info">
          <span className="cur-live-label">
            <span className="cur-live-dot" aria-hidden="true" />
            <span>PORTAL DOCENTE ACTIVO</span>
          </span>
          <h1 className="cur-title">Mis Cursos Asignados</h1>
          <p className="cur-subtitle">
            Ciclo Académico 2026-II ·{' '}
            <strong>{cursos.length} Asignatura(s) activa(s)</strong>
          </p>
        </div>

        <div className="cur-search-box">
          <Search className="cur-search-icon" />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cur-search-input"
          />
        </div>
      </header>

      {loading ? (
        <div className="cur-loading">
          <Loader2 className="cur-spinner" />
          <p>Cargando asignaturas del periodo...</p>
        </div>
      ) : cursosFiltrados.length === 0 ? (
        <div className="cur-empty-box">
          <p>No se encontraron asignaturas que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div className="cur-grid">
          {cursosFiltrados.map((curso) => (
            <article key={curso.id} className="cur-card">
              <div className="cur-card-top">
                <div className="cur-badges-row">
                  <span className="cur-code-badge">{curso.codigo}</span>
                  <span className="cur-group-badge">{curso.grupo}</span>
                </div>
                <h2 className="cur-course-title">{curso.nombre}</h2>
              </div>

              <div className="cur-details-list">
                <div className="cur-detail-item">
                  <MapPin className="cur-icon-xs cur-text-sky" />
                  <span>{curso.ubicacion}</span>
                </div>
                <div className="cur-detail-item">
                  <Clock className="cur-icon-xs cur-text-sky" />
                  <span>{curso.horario}</span>
                </div>
                <div className="cur-detail-row">
                  <span className="cur-detail-item">
                    <Users className="cur-icon-xs cur-text-sky" />
                    <span>{curso.matriculados} matriculados</span>
                  </span>
                  <span className="cur-week-tag">
                    <BookOpen className="cur-icon-xs" />
                    <span>{curso.semana}</span>
                  </span>
                </div>
              </div>

              <div className="cur-delegate-bar">
                <div className="cur-delegate-avatar">{curso.delegado.avatar}</div>
                <div className="cur-delegate-meta">
                  <p className="cur-delegate-name">{curso.delegado.nombre}</p>
                  <p className="cur-delegate-email">{curso.delegado.email}</p>
                </div>
              </div>

              <div className="cur-actions-grid">
                <button
                  type="button"
                  onClick={() => {
                    setCursoSeleccionado(curso);
                    setArchivoPDF(null);
                    setMensajeSubida('');
                  }}
                  className="cur-btn-upload"
                >
                  <Upload className="cur-icon-sm" />
                  <span>{curso.silaboUrl ? 'Actualizar Sílabo' : 'Subir Sílabo PDF'}</span>
                </button>

                {curso.silaboUrl ? (
                  <a
                    href={curso.silaboUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="cur-btn-view"
                  >
                    <FileCheck className="cur-icon-sm" />
                    <span>Ver Sílabo (PDF)</span>
                    <ExternalLink className="cur-icon-xs" />
                  </a>
                ) : (
                  <div className="cur-btn-disabled" aria-disabled="true">
                    <span>Sin Sílabo</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {cursoSeleccionado && (
        <div
          className="cur-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cur-modal-title"
        >
          <div className="cur-modal-card">
            <button
              type="button"
              onClick={cerrarModal}
              className="cur-modal-close"
              aria-label="Cerrar ventana"
            >
              <X className="cur-icon-md" />
            </button>

            <div className="cur-modal-head">
              <span className="cur-modal-code">{cursoSeleccionado.codigo}</span>
              <h3 id="cur-modal-title" className="cur-modal-title">
                Subir Sílabo de Asignatura
              </h3>
              <p className="cur-modal-sub">{cursoSeleccionado.nombre}</p>
            </div>

            <form onSubmit={handleSubirSilabo} className="cur-modal-form">
              <div className="cur-dropzone">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleArchivoChange}
                  className="cur-file-input"
                  id="silabo-input"
                />
                <label htmlFor="silabo-input" className="cur-dropzone-label">
                  <Upload className="cur-drop-icon" />
                  <span className="cur-drop-text">
                    {archivoPDF
                      ? archivoPDF.name
                      : 'Haz clic para seleccionar el archivo PDF'}
                  </span>
                  <span className="cur-drop-hint">
                    Solo formato .pdf (Máximo 10 MB)
                  </span>
                </label>
              </div>

              {mensajeSubida && (
                <p
                  className={`cur-feedback ${
                    mensajeSubida.includes('Selecciona') || mensajeSubida.includes('supera')
                      ? 'cur-feedback-error'
                      : 'cur-feedback-ok'
                  }`}
                >
                  {mensajeSubida}
                </p>
              )}

              <div className="cur-modal-footer">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="cur-btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!archivoPDF || subiendo}
                  className="cur-btn-save"
                >
                  {subiendo ? (
                    <>
                      <Loader2 className="cur-icon-xs cur-spin-inline" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar y Publicar</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}