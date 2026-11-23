import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import './Fut.css';
import {
  FileText,
  Send,
  Download,
  Save,
  CheckCircle2,
  Clock,
  User,
  Upload,
  File,
  X
} from 'lucide-react';

interface FutFormData {
  sumilla: string;
  dirigidoA: string;
  nombresApellidos: string;
  condicion: string;
  dni: string;
  telefono: string;
  domicilio: string;
  fundamento: string;
  documentosAdjuntos: string;
  lugarFecha: string;
}

export const FutPage: FC = () => {
  const [formData, setFormData] = useState<FutFormData>({
    sumilla: '',
    dirigidoA:
      'SEÑOR DIRECTOR DEL INSTITUTO DE EDUCACIÓN SUPERIOR TECNOLÓGICO PÚBLICO "ARTURO SABROSO MONTOYA"',
    nombresApellidos: '',
    condicion: '',
    dni: '',
    telefono: '',
    domicilio: '',
    fundamento: '',
    documentosAdjuntos: '',
    lugarFecha: `Lima, ${new Date().toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cargoData, setCargoData] = useState<{ ticket: string; fechaHora: string } | null>(null);
  const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null);

  useEffect(() => {
    const rawSession =
      localStorage.getItem('usuarioLogueado') || localStorage.getItem('usuario_progresa');

    if (rawSession) {
      try {
        const user = JSON.parse(rawSession);
        const nombreCompleto =
          user.nombreCompleto ||
          `${user.nombres || ''} ${user.apellidos || ''}`.trim();

        setFormData((prev) => ({
          ...prev,
          nombresApellidos: nombreCompleto || prev.nombresApellidos,
          dni: user.dni || prev.dni,
          condicion:
            user.condicion ||
            (user.carrera
              ? `ESTUDIANTE - ${user.carrera.toUpperCase()} - PERIODO 2026-II`
              : prev.condicion),
          telefono: user.telefono || prev.telefono,
          domicilio: user.direccion || user.domicilio || prev.domicilio
        }));
      } catch (e) {
        console.error('Error al cargar datos del usuario para el FUT:', e);
      }
    }

    const rawDraft = localStorage.getItem('progresa_fut_borrador');
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft) as Partial<FutFormData>;
        setFormData((prev) => ({ ...prev, ...draft }));
      } catch {
        // Ignorar borrador corrupto
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('progresa_fut_borrador', JSON.stringify(formData));
    } catch (e) {
      console.error('Error al guardar borrador del FUT:', e);
    }
    window.setTimeout(() => {
      setIsSaving(false);
      window.alert('Borrador guardado en el dispositivo.');
    }, 400);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.sumilla.trim() || !formData.fundamento.trim()) {
      window.alert('Completa la sumilla y el fundamento del pedido.');
      return;
    }

    setIsSaving(true);

    window.setTimeout(() => {
      const now = new Date();
      const ticket = `FUT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fechaHora = `${now.toLocaleDateString('es-PE')} a las ${now.toLocaleTimeString('es-PE')}`;

      const nuevoFUT = {
        codigo: ticket,
        nombres_apellidos: formData.nombresApellidos.trim() || 'Estudiante',
        dni: formData.dni.trim() || '00000000',
        telefono: formData.telefono.trim() || 'No registrado',
        carrera: formData.condicion.trim() || 'Programa Académico',
        sumilla: formData.sumilla.trim(),
        fundamento: formData.fundamento.trim(),
        archivo: archivoAdjunto ? archivoAdjunto.name : null,
        fechaHora,
        estado: 'pendiente'
      };

      try {
        const previos = JSON.parse(localStorage.getItem('ua_futs_enviados') || '[]');
        localStorage.setItem('ua_futs_enviados', JSON.stringify([nuevoFUT, ...previos]));
        localStorage.removeItem('progresa_fut_borrador');
      } catch (err) {
        console.error('Error al guardar FUT local:', err);
      }

      setCargoData({ ticket, fechaHora });
      setIsSaving(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="fut-root">
      <div className="fut-container">
        {/* Encabezado del FUT */}
        <div className="fut-card fut-header">
          <div className="fut-header-left">
            <div className="fut-header-icon">
              <FileText className="fut-icon-lg" />
            </div>
            <div className="fut-truncate-wrap">
              <h2 className="fut-title">Formulario Único de Trámite (FUT)</h2>
              <p className="fut-subtitle">
                Registro digital de solicitudes y trámites administrativos.
              </p>
            </div>
          </div>

          <span className="fut-format-badge">Formato Oficial</span>
        </div>

        {/* Constancia de envío */}
        {isSubmitted && cargoData && (
          <div className="fut-card fut-receipt">
            <div className="fut-receipt-main">
              <CheckCircle2 className="fut-icon-lg fut-ico-emerald fut-receipt-icon" />
              <div className="fut-truncate-wrap">
                <h3 className="fut-receipt-title">Trámite registrado</h3>
                <p className="fut-receipt-code">
                  Código de cargo:{' '}
                  <span className="fut-ticket-mono">{cargoData.ticket}</span>
                </p>
                <p className="fut-receipt-time">
                  <Clock className="fut-icon-xs" />
                  <span>Registrado el {cargoData.fechaHora}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="fut-btn-primary fut-receipt-btn"
            >
              <Download className="fut-icon-md" />
              <span>Descargar cargo</span>
            </button>
          </div>
        )}

        {/* Cuerpo del formulario */}
        <form onSubmit={handleSubmit} className="fut-card fut-form">
          {/* Membrete institucional */}
          <div className="fut-membrete">
            <p className="fut-membrete-kicker">
              Instituto de Educación Superior Tecnológico Público
            </p>
            <h3 className="fut-membrete-title">&quot;ARTURO SABROSO MONTOYA&quot;</h3>
            <p className="fut-membrete-addr">
              Prolg. Antonio Raymondi N.° 1020 - La Victoria · Telf.: 473-0440
            </p>
            <p className="fut-membrete-legal">
              R.M. N.° 447-90-ED / R.M. Revalidado R.D. N.° 0815-2006-ED
            </p>
          </div>

          {/* Sumilla */}
          <div className="fut-field">
            <label className="fut-label fut-label-bold">
              Sumilla (Solicitud corta) <span className="fut-req">*</span>
            </label>
            <input
              type="text"
              name="sumilla"
              required
              disabled={isSubmitted}
              placeholder="Ej. Solicito constancia de matrícula o reserva de turno"
              value={formData.sumilla}
              onChange={handleChange}
              className="fut-input"
            />
          </div>

          {/* 1. Destinatario */}
          <div className="fut-field">
            <label className="fut-label">1.- Destinatario</label>
            <div className="fut-destinatario-box">{formData.dirigidoA}</div>
          </div>

          {/* 2. Datos del usuario */}
          <div className="fut-field">
            <label className="fut-label">
              2.- Datos del Usuario (Nombres y Apellidos) <span className="fut-req">*</span>
            </label>
            <div className="fut-input-icon-wrap">
              <User className="fut-input-left-icon" />
              <input
                type="text"
                name="nombresApellidos"
                required
                disabled={isSubmitted}
                placeholder="Nombres y apellidos completos"
                value={formData.nombresApellidos}
                onChange={handleChange}
                className="fut-input fut-input-with-icon"
              />
            </div>
          </div>

          {/* 3. Condición */}
          <div className="fut-field">
            <label className="fut-label">
              3.- Condición y Situación Actual (Programa de estudios, ciclo, matrícula)
            </label>
            <input
              type="text"
              name="condicion"
              required
              disabled={isSubmitted}
              placeholder="Ej. Estudiante - Programa de Estudios - Ciclo"
              value={formData.condicion}
              onChange={handleChange}
              className="fut-input"
            />
          </div>

          {/* 4 y 5. DNI y Teléfono */}
          <div className="fut-two-col">
            <div className="fut-field fut-col-item">
              <label className="fut-label">
                4.- D.N.I. / Documento de Identidad <span className="fut-req">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="dni"
                required
                disabled={isSubmitted}
                placeholder="Número de DNI"
                value={formData.dni}
                onChange={handleChange}
                className="fut-input"
              />
            </div>

            <div className="fut-field fut-col-item">
              <label className="fut-label">
                5.- Teléfono / Celular <span className="fut-req">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                required
                disabled={isSubmitted}
                placeholder="Número de contacto"
                value={formData.telefono}
                onChange={handleChange}
                className="fut-input"
              />
            </div>
          </div>

          {/* 6. Domicilio */}
          <div className="fut-field">
            <label className="fut-label">6.- Domicilio del Usuario</label>
            <input
              type="text"
              name="domicilio"
              required
              disabled={isSubmitted}
              placeholder="Dirección actual"
              value={formData.domicilio}
              onChange={handleChange}
              className="fut-input"
            />
          </div>

          {/* 7. Fundamento */}
          <div className="fut-field">
            <label className="fut-label fut-label-bold">
              7.- Fundamento del Pedido <span className="fut-req">*</span>
            </label>
            <textarea
              name="fundamento"
              rows={4}
              required
              disabled={isSubmitted}
              placeholder="Detalle el motivo y sustento de su solicitud..."
              value={formData.fundamento}
              onChange={handleChange}
              className="fut-textarea"
            />
          </div>

          {/* 8. Documentos adjuntos */}
          <div className="fut-field">
            <label className="fut-label">
              8.- Documentos Adjuntos (Comprobante de pago, constancias u otros)
            </label>

            {!archivoAdjunto ? (
              <label className="fut-dropzone">
                <Upload className="fut-icon-lg fut-ico-sky" />
                <p className="fut-dropzone-title">Seleccionar archivo para adjuntar</p>
                <p className="fut-dropzone-sub">PDF, PNG, JPG (Máx. 10 MB)</p>
                <input
                  type="file"
                  className="fut-file-input"
                  accept=".pdf,.png,.jpg,.jpeg"
                  disabled={isSubmitted}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setArchivoAdjunto(e.target.files[0]);
                    }
                  }}
                />
              </label>
            ) : (
              <div className="fut-file-attached">
                <div className="fut-file-info">
                  <div className="fut-file-icon-box">
                    <File className="fut-icon-md" />
                  </div>
                  <div className="fut-truncate-wrap">
                    <p className="fut-file-name">{archivoAdjunto.name}</p>
                    <p className="fut-file-size">
                      {(archivoAdjunto.size / (1024 * 1024)).toFixed(2)} MB · Archivo listo
                    </p>
                  </div>
                </div>
                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={() => setArchivoAdjunto(null)}
                    className="fut-remove-file-btn"
                    title="Quitar archivo"
                    aria-label="Quitar archivo"
                  >
                    <X className="fut-icon-md" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 9 y 10. Lugar/Fecha y Declaración */}
          <div className="fut-two-col fut-footer-meta">
            <div className="fut-field fut-col-item">
              <label className="fut-label">9.- Lugar y Fecha</label>
              <input
                type="text"
                name="lugarFecha"
                readOnly
                value={formData.lugarFecha}
                className="fut-input fut-input-readonly"
              />
            </div>

            <div className="fut-field fut-col-item">
              <label className="fut-label">10.- Declaración del Solicitante</label>
              <div className="fut-declaration-box">
                <input
                  type="checkbox"
                  id="firmaCheck"
                  defaultChecked
                  disabled={isSubmitted}
                  className="fut-checkbox"
                />
                <label htmlFor="firmaCheck" className="fut-declaration-text">
                  Declaro que la información consignada en este formulario es verídica.
                </label>
              </div>
            </div>
          </div>

          {/* Acciones inferiores */}
          <div className="fut-actions-bar">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving || isSubmitted}
              className="fut-btn-secondary fut-btn-responsive"
            >
              <Save className="fut-icon-md" />
              <span>{isSaving ? 'Guardando...' : 'Guardar borrador'}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="submit"
                disabled={isSaving}
                className="fut-btn-primary fut-btn-responsive"
              >
                <Send className="fut-icon-md" />
                <span>Enviar FUT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="fut-btn-navy fut-btn-responsive"
              >
                <Download className="fut-icon-md" />
                <span>Imprimir / Guardar cargo</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FutPage;