import React, { useState } from 'react';
import './Pagos.css';
import {
  CreditCard,
  Upload,
  CheckCircle,
  Copy,
  Check,
  FileText,
  Building2,
  QrCode,
  X,
  Smartphone,
  Loader2,
  Lock
} from 'lucide-react';

type PagoHistorial = {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  numOperacion: string;
  estado: 'Aprobado' | 'Pendiente' | 'Rechazado';
};

export default function PagosView() {
  const [copiado, setCopiado] = useState<string | null>(null);
  const [archivoVoucher, setArchivoVoucher] = useState<File | null>(null);
  const [numOperacion, setNumOperacion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [cuotaPendiente, setCuotaPendiente] = useState({
    concepto: 'Pensión Cuota 2 - Octubre',
    monto: 250.0,
    vencimiento: '25 Octubre, 2026',
    pagada: false
  });

  const [showPayModal, setShowPayModal] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);

  const [tarjeta, setTarjeta] = useState({
    numero: '',
    expiracion: '',
    cvv: '',
    nombre: ''
  });

  const [historial, setHistorial] = useState<PagoHistorial[]>([
    {
      id: '1',
      concepto: 'Matrícula 2026-II',
      monto: 350.0,
      fecha: '15/08/2026',
      numOperacion: 'OP-882910',
      estado: 'Aprobado'
    },
    {
      id: '2',
      concepto: 'Pensión Cuota 1 - Septiembre',
      monto: 250.0,
      fecha: '10/09/2026',
      numOperacion: 'OP-901234',
      estado: 'Aprobado'
    }
  ]);

  const copiarTexto = (texto: string, campo: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(campo);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleSubirVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numOperacion || !archivoVoucher) {
      alert('Adjunta el comprobante e ingresa el número de operación.');
      return;
    }

    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setMensajeExito(true);
      setNumOperacion('');
      setArchivoVoucher(null);
    }, 1200);
  };

  const handleProcesarPagoLinea = (e: React.FormEvent) => {
    e.preventDefault();
    setProcesandoPago(true);

    setTimeout(() => {
      const numOpGenerado = `OP-${Math.floor(100000 + Math.random() * 900000)}`;
      const hoy = new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const nuevoPago: PagoHistorial = {
        id: String(Date.now()),
        concepto: cuotaPendiente.concepto,
        monto: cuotaPendiente.monto,
        fecha: hoy,
        numOperacion: numOpGenerado,
        estado: 'Aprobado'
      };

      setHistorial([nuevoPago, ...historial]);
      setCuotaPendiente({ ...cuotaPendiente, pagada: true });
      setProcesandoPago(false);
      setPagoCompletado(true);
    }, 1500);
  };

  return (
    <div className="pag-root">
      {/* 1. Resumen de cuota vigente */}
      <div
        className={`pag-card pag-summary-banner ${
          cuotaPendiente.pagada ? 'pag-summary-paid' : 'pag-summary-pending'
        }`}
      >
        <div className="pag-summary-row">
          <div className="pag-summary-info">
            <div className="pag-summary-meta">
              <span
                className={`pag-status-pill ${
                  cuotaPendiente.pagada ? 'pag-status-paid' : 'pag-status-pending'
                }`}
              >
                {cuotaPendiente.pagada ? 'Pagado' : 'Pendiente de pago'}
              </span>
              <span className="pag-due-date">Vence: {cuotaPendiente.vencimiento}</span>
            </div>
            <h2 className="pag-concept-title">{cuotaPendiente.concepto}</h2>
            <p className="pag-concept-desc">
              {cuotaPendiente.pagada
                ? 'La cuota ha sido registrada correctamente en el historial.'
                : 'Registra tu pago en línea o adjunta el comprobante de depósito o transferencia.'}
            </p>
          </div>

          <div className="pag-summary-actions">
            <div className="pag-amount-box">
              <span className="pag-amount-label">Monto:</span>
              <span
                className={`pag-amount-value ${
                  cuotaPendiente.pagada ? 'pag-amount-paid' : ''
                }`}
              >
                S/ {cuotaPendiente.monto.toFixed(2)}
              </span>
            </div>

            {!cuotaPendiente.pagada && (
              <button
                type="button"
                onClick={() => setShowPayModal(true)}
                className="pag-btn-primary"
              >
                <CreditCard className="pag-icon-md" />
                <span>Pagar en línea</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Cuentas institucionales y Validación de comprobante */}
      <div className="pag-two-col">
        <div className="pag-card pag-panel">
          <div className="pag-panel-head">
            <Building2 className="pag-icon-md pag-ico-sky" />
            <h3 className="pag-panel-title">Cuentas Institucionales</h3>
          </div>
          <p className="pag-panel-desc">
            Realiza abonos mediante transferencia, banca digital o recaudación autorizada.
          </p>

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="pag-qr-trigger"
          >
            <div className="pag-qr-icon-box">
              <QrCode className="pag-icon-lg" />
            </div>
            <div className="pag-truncate-wrap">
              <h4 className="pag-qr-title">Billetera Móvil (Yape / Plin)</h4>
              <p className="pag-qr-sub">
                Número: 987 654 321 · <span className="pag-qr-link">Ver código QR</span>
              </p>
            </div>
          </button>

          <div className="pag-accounts-list">
            <div className="pag-account-box">
              <div className="pag-account-top">
                <span className="pag-account-name">
                  Banco de la Nación (Cuenta Corriente)
                </span>
                <span className="pag-account-tag">Ventanilla / Agente</span>
              </div>
              <div className="pag-account-number-row">
                <span>00-011-123456</span>
                <button
                  type="button"
                  onClick={() => copiarTexto('00-011-123456', 'bn')}
                  className="pag-copy-btn"
                  aria-label="Copiar cuenta Banco de la Nación"
                >
                  {copiado === 'bn' ? (
                    <Check className="pag-icon-md pag-ico-emerald" />
                  ) : (
                    <Copy className="pag-icon-md" />
                  )}
                </button>
              </div>
            </div>

            <div className="pag-account-box">
              <div className="pag-account-top">
                <span className="pag-account-name">BCP · Código CCI Interbancario</span>
                <span className="pag-account-tag">Transferencia</span>
              </div>
              <div className="pag-account-number-row">
                <span className="pag-truncate-text">002-191-001234567890-54</span>
                <button
                  type="button"
                  onClick={() => copiarTexto('002-191-001234567890-54', 'cci')}
                  className="pag-copy-btn"
                  aria-label="Copiar CCI BCP"
                >
                  {copiado === 'cci' ? (
                    <Check className="pag-icon-md pag-ico-emerald" />
                  ) : (
                    <Copy className="pag-icon-md" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subir comprobante */}
        <div className="pag-card pag-panel">
          <div className="pag-panel-head">
            <Upload className="pag-icon-md pag-ico-sky" />
            <h3 className="pag-panel-title">Registro de Comprobante</h3>
          </div>
          <p className="pag-panel-desc">
            Ingresa el número de operación y adjunta la constancia para validación administrativa.
          </p>

          {mensajeExito ? (
            <div className="pag-success-box">
              <CheckCircle className="pag-icon-xl pag-ico-emerald pag-center-icon" />
              <h4 className="pag-success-title">Comprobante registrado</h4>
              <p className="pag-success-desc">
                El registro fue enviado para revisión del área correspondiente.
              </p>
              <button
                type="button"
                onClick={() => setMensajeExito(false)}
                className="pag-link-btn"
              >
                Registrar otro comprobante
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubirVoucher} className="pag-form">
              <div className="pag-field">
                <label className="pag-label">Número de Operación o Constancia</label>
                <input
                  type="text"
                  placeholder="Ej. 90128471"
                  value={numOperacion}
                  onChange={(e) => setNumOperacion(e.target.value)}
                  className="pag-input"
                />
              </div>

              <div className="pag-field">
                <label className="pag-label">Comprobante (Imagen o PDF)</label>
                <label className="pag-dropzone">
                  <Upload className="pag-icon-lg pag-ico-muted" />
                  <p className="pag-dropzone-text">
                    {archivoVoucher ? (
                      <span className="pag-file-name">{archivoVoucher.name}</span>
                    ) : (
                      'Seleccionar archivo de comprobante'
                    )}
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="pag-file-input"
                    onChange={(e) => setArchivoVoucher(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="pag-btn-secondary"
              >
                {enviando ? 'Enviando registro...' : 'Enviar comprobante'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Historial de Pagos */}
      <div className="pag-card pag-panel">
        <div className="pag-panel-head">
          <FileText className="pag-icon-md pag-ico-sky" />
          <h3 className="pag-panel-title">Historial de Pagos</h3>
        </div>

        <div className="pag-table-scroll">
          <table className="pag-table">
            <thead className="pag-thead">
              <tr>
                <th className="pag-th">Concepto</th>
                <th className="pag-th">Monto</th>
                <th className="pag-th">N.° Operación</th>
                <th className="pag-th">Fecha</th>
                <th className="pag-th">Estado</th>
              </tr>
            </thead>
            <tbody className="pag-tbody">
              {historial.map((pago) => (
                <tr key={pago.id} className="pag-tr">
                  <td className="pag-td pag-td-concept">{pago.concepto}</td>
                  <td className="pag-td pag-td-amount">S/ {pago.monto.toFixed(2)}</td>
                  <td className="pag-td pag-td-op">{pago.numOperacion}</td>
                  <td className="pag-td pag-td-date">{pago.fecha}</td>
                  <td className="pag-td">
                    <span className="pag-badge-approved">{pago.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Pago en Línea */}
      {showPayModal && (
        <div
          onClick={() => setShowPayModal(false)}
          className="pag-modal-backdrop"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pag-modal"
          >
            <div className="pag-modal-head">
              <div>
                <h3 className="pag-modal-title">Pago en Línea</h3>
                <p className="pag-modal-sub">Registro directo de cuota académica</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="pag-close-btn"
                aria-label="Cerrar ventana de pago"
              >
                <X className="pag-icon-md" />
              </button>
            </div>

            {pagoCompletado ? (
              <div className="pag-modal-done">
                <CheckCircle className="pag-icon-xl pag-ico-emerald pag-center-icon" />
                <h4 className="pag-done-title">Pago registrado</h4>
                <p className="pag-done-desc">
                  Se registró{' '}
                  <span className="pag-done-strong">{cuotaPendiente.concepto}</span> por{' '}
                  <span className="pag-done-strong">S/ {cuotaPendiente.monto.toFixed(2)}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowPayModal(false);
                    setPagoCompletado(false);
                  }}
                  className="pag-btn-primary pag-btn-full"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="pag-modal-summary">
                  <span className="pag-modal-summary-label">{cuotaPendiente.concepto}</span>
                  <span className="pag-modal-summary-amount">
                    S/ {cuotaPendiente.monto.toFixed(2)}
                  </span>
                </div>

                <form onSubmit={handleProcesarPagoLinea} className="pag-form">
                  <div className="pag-field">
                    <label className="pag-modal-label">Titular de la tarjeta</label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre como figura en la tarjeta"
                      value={tarjeta.nombre}
                      onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value })}
                      className="pag-input"
                    />
                  </div>

                  <div className="pag-field">
                    <label className="pag-modal-label">Número de tarjeta</label>
                    <div className="pag-input-wrap">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={tarjeta.numero}
                        onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                        className="pag-input pag-input-mono pag-input-padded"
                      />
                      <Lock className="pag-input-lock" />
                    </div>
                  </div>

                  <div className="pag-card-grid">
                    <div className="pag-field">
                      <label className="pag-modal-label">Vencimiento</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        maxLength={5}
                        value={tarjeta.expiracion}
                        onChange={(e) => setTarjeta({ ...tarjeta, expiracion: e.target.value })}
                        className="pag-input pag-input-mono"
                      />
                    </div>
                    <div className="pag-field">
                      <label className="pag-modal-label">Código de seguridad</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="CVV"
                        value={tarjeta.cvv}
                        onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                        className="pag-input pag-input-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={procesandoPago}
                    className="pag-btn-primary pag-btn-full pag-submit-mt"
                  >
                    {procesandoPago ? (
                      <>
                        <Loader2 className="pag-icon-md pag-spin" />
                        <span>Procesando pago...</span>
                      </>
                    ) : (
                      <span>Confirmar pago de S/ {cuotaPendiente.monto.toFixed(2)}</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Código QR */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="pag-modal-backdrop"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pag-modal pag-qr-modal"
          >
            <div className="pag-modal-head pag-qr-head">
              <div>
                <span className="pag-qr-kicker">Billetera Móvil</span>
                <h3 className="pag-modal-title">Código QR Institucional</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="pag-close-btn"
                aria-label="Cerrar código QR"
              >
                <X className="pag-icon-md" />
              </button>
            </div>

            <div className="pag-qr-frame">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://progresa.edu.pe/pagos/demo"
                alt="Código QR de pago institucional"
                className="pag-qr-img"
              />
            </div>

            <div className="pag-qr-footer-box">
              <div className="pag-qr-phone">
                <Smartphone className="pag-icon-md pag-ico-sky" />
                <span className="pag-qr-phone-num">987 654 321</span>
              </div>
              <span className="pag-qr-agency">Caja Institucional</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}