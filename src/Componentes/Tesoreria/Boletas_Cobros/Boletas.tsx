import { useState, useMemo } from 'react';
import './Boletas.css';
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Building,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';

export type OrigenCobro = 'Alumno (Foto)' | 'Otra Entidad';
export type EstadoCobro = 'Pendiente' | 'Validado' | 'Observado';

export interface BoletaCobroItem {
  id: string;
  numeroComprobante: string;
  origen: OrigenCobro;
  entidadOAlumno: string;
  codigoReferencia: string;
  concepto: string;
  monto: number;
  fecha: string;
  estado: EstadoCobro;
  fotoUrl: string | null;
  nombreArchivo?: string;
  detalleEntidad?: string;
}

interface BoletasCobrosProps {
  registros: BoletaCobroItem[];
  onValidar: (id: string) => void;
  onObservar: (id: string) => void;
  onAdjuntarFoto?: (id: string, file: File) => void;
}

type FiltroOrigen = 'Todos' | OrigenCobro;

export default function BoletasCobrosPanel({
  registros,
  onValidar,
  onObservar,
  onAdjuntarFoto
}: BoletasCobrosProps) {
  const [filtroOrigen, setFiltroOrigen] = useState<FiltroOrigen>('Todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [registroInspeccion, setRegistroInspeccion] = useState<BoletaCobroItem | null>(null);
  const [mensajeArchivo, setMensajeArchivo] = useState<string>('');

  const registrosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return registros.filter((item) => {
      const coincideOrigen = filtroOrigen === 'Todos' || item.origen === filtroOrigen;
      const coincideTexto =
        !q ||
        item.numeroComprobante.toLowerCase().includes(q) ||
        item.entidadOAlumno.toLowerCase().includes(q) ||
        item.codigoReferencia.toLowerCase().includes(q) ||
        item.concepto.toLowerCase().includes(q) ||
        (item.detalleEntidad && item.detalleEntidad.toLowerCase().includes(q));
      return coincideOrigen && coincideTexto;
    });
  }, [registros, filtroOrigen, busqueda]);

  const conteos = useMemo(() => {
    return {
      todos: registros.length,
      alumnos: registros.filter((r) => r.origen === 'Alumno (Foto)').length,
      entidades: registros.filter((r) => r.origen === 'Otra Entidad').length
    };
  }, [registros]);

  const handleSeleccionArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMensajeArchivo('');
    if (!file || !registroInspeccion || !onAdjuntarFoto) return;

    const esImagenOPdf =
      file.type.startsWith('image/') ||
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!esImagenOPdf) {
      setMensajeArchivo('Selecciona una imagen (JPG, PNG, WEBP) o PDF válido.');
      return;
    }

    onAdjuntarFoto(registroInspeccion.id, file);
    const urlTemporal = URL.createObjectURL(file);
    setRegistroInspeccion({
      ...registroInspeccion,
      fotoUrl: urlTemporal,
      nombreArchivo: file.name
    });
    setMensajeArchivo(`Archivo "${file.name}" cargado para revisión.`);
  };

  return (
    <section className="bol-root">
      <header className="bol-head">
        <div>
          <h2 className="bol-title">Boletas y Cobros por Revisar</h2>
          <p className="bol-subtitle">
            Revisión de fotos de boletas enviadas por alumnos y cobros recibidos de otras entidades
          </p>
        </div>

        <div className="bol-summary-pills">
          <span className="bol-pill">Fotos Alumnos: {conteos.alumnos}</span>
          <span className="bol-pill bol-pill-alt">Otras Entidades: {conteos.entidades}</span>
        </div>
      </header>

      <div className="bol-toolbar">
        <div className="bol-tabs" role="tablist" aria-label="Filtrar por origen de cobro">
          {(
            [
              { id: 'Todos', label: 'Todos', total: conteos.todos },
              { id: 'Alumno (Foto)', label: 'Boletas de Alumnos', total: conteos.alumnos },
              { id: 'Otra Entidad', label: 'Cobros de Entidades', total: conteos.entidades }
            ] as const
          ).map((tab) => {
            const activo = filtroOrigen === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setFiltroOrigen(tab.id)}
                className={`bol-tab-btn ${activo ? 'bol-tab-active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="bol-tab-count">{tab.total}</span>
              </button>
            );
          })}
        </div>

        <div className="bol-search-box">
          <Search className="bol-search-icon" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar alumno, boleta o entidad..."
            className="bol-search-input"
          />
        </div>
      </div>

      {registrosFiltrados.length === 0 ? (
        <div className="bol-empty">
          No se encontraron boletas ni cobros con el filtro actual.
        </div>
      ) : (
        <div className="bol-grid">
          {registrosFiltrados.map((item) => {
            const esAlumno = item.origen === 'Alumno (Foto)';
            const estadoClase =
              item.estado === 'Validado'
                ? 'bol-status-ok'
                : item.estado === 'Pendiente'
                ? 'bol-status-warn'
                : 'bol-status-obs';

            return (
              <article key={item.id} className="bol-card">
                <div className="bol-card-top">
                  <div className="bol-badges">
                    <span className="bol-code">{item.numeroComprobante}</span>
                    <span
                      className={`bol-origin-badge ${
                        esAlumno ? 'bol-origin-student' : 'bol-origin-entity'
                      }`}
                    >
                      {esAlumno ? (
                        <ImageIcon className="bol-icon-xs" />
                      ) : (
                        <Building className="bol-icon-xs" />
                      )}
                      <span>{item.origen}</span>
                    </span>
                  </div>

                  <span className={`bol-status-pill ${estadoClase}`}>{item.estado}</span>
                </div>

                <div className="bol-card-body">
                  <h3 className="bol-party-name">{item.entidadOAlumno}</h3>
                  <p className="bol-ref-line">
                    Ref: <strong>{item.codigoReferencia}</strong> · {item.fecha}
                  </p>
                  <p className="bol-concept">{item.concepto}</p>
                  {item.detalleEntidad && (
                    <p className="bol-entity-note">Entidad / Canal: {item.detalleEntidad}</p>
                  )}
                </div>

                <div className="bol-card-foot">
                  <div className="bol-amount-box">
                    <span className="bol-amount-label">Monto</span>
                    <strong className="bol-amount-val">S/ {item.monto.toFixed(2)}</strong>
                  </div>

                  <div className="bol-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setMensajeArchivo('');
                        setRegistroInspeccion(item);
                      }}
                      className="bol-btn-inspect"
                    >
                      <Eye className="bol-icon-xs" />
                      <span>{esAlumno ? 'Ver Foto / Boleta' : 'Ver Detalle'}</span>
                    </button>

                    {item.estado === 'Pendiente' && (
                      <>
                        <button
                          type="button"
                          onClick={() => onObservar(item.id)}
                          className="bol-btn-obs"
                          title="Observar registro"
                        >
                          <XCircle className="bol-icon-xs" />
                          <span>Observar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onValidar(item.id)}
                          className="bol-btn-approve"
                          title="Validar cobro"
                        >
                          <CheckCircle2 className="bol-icon-xs" />
                          <span>Validar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Visor de foto de boleta o detalle de cobro de entidad */}
      {registroInspeccion && (
        <div
          className="bol-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bol-modal-title"
        >
          <div className="bol-modal-card">
            <button
              type="button"
              onClick={() => {
                setRegistroInspeccion(null);
                setMensajeArchivo('');
              }}
              className="bol-modal-close"
              aria-label="Cerrar visor"
            >
              <X className="bol-icon-md" />
            </button>

            <div className="bol-modal-head">
              <span className="bol-code">{registroInspeccion.numeroComprobante}</span>
              <h3 id="bol-modal-title" className="bol-modal-title">
                {registroInspeccion.entidadOAlumno}
              </h3>
              <p className="bol-subtitle">
                {registroInspeccion.origen} · {registroInspeccion.concepto} · S/{' '}
                {registroInspeccion.monto.toFixed(2)}
              </p>
            </div>

            <div className="bol-preview-box">
              {registroInspeccion.fotoUrl ? (
                <img
                  src={registroInspeccion.fotoUrl}
                  alt={`Comprobante de ${registroInspeccion.entidadOAlumno}`}
                  className="bol-preview-img"
                />
              ) : (
                <div className="bol-preview-placeholder">
                  <ImageIcon className="bol-preview-icon" />
                  <p className="bol-preview-text">
                    {registroInspeccion.origen === 'Alumno (Foto)'
                      ? 'Aún no hay una foto cargada en esta sesión para este envío.'
                      : `Cobro reportado por ${
                          registroInspeccion.detalleEntidad || 'entidad externa'
                        } bajo referencia ${registroInspeccion.codigoReferencia}.`}
                  </p>
                </div>
              )}
            </div>

            {onAdjuntarFoto && (
              <div className="bol-upload-row">
                <label htmlFor="bol-file-input" className="bol-upload-label">
                  <Upload className="bol-icon-xs" />
                  <span>
                    {registroInspeccion.nombreArchivo
                      ? `Archivo: ${registroInspeccion.nombreArchivo}`
                      : 'Cargar foto o comprobante para inspeccionar'}
                  </span>
                </label>
                <input
                  id="bol-file-input"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleSeleccionArchivo}
                  className="bol-file-hidden"
                />
              </div>
            )}

            {mensajeArchivo && <p className="bol-file-msg">{mensajeArchivo}</p>}

            <div className="bol-modal-actions">
              {registroInspeccion.estado === 'Pendiente' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onObservar(registroInspeccion.id);
                      setRegistroInspeccion(null);
                    }}
                    className="bol-btn-obs"
                  >
                    <XCircle className="bol-icon-xs" />
                    <span>Observar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onValidar(registroInspeccion.id);
                      setRegistroInspeccion(null);
                    }}
                    className="bol-btn-approve"
                  >
                    <CheckCircle2 className="bol-icon-xs" />
                    <span>Validar Cobro</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setRegistroInspeccion(null);
                  setMensajeArchivo('');
                }}
                className="bol-btn-close-modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}