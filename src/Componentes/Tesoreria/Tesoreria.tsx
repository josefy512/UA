import React, { useEffect, useState } from 'react';
import {
  actualizarEstadoBoletaCobro,
  obtenerBoletasCobros,
  obtenerPensionesCuotas,
  registrarBoletaFotoAlumno,
  registrarCobroOtraEntidad,
} from '../../lib/progresaApi';
import type {
  BoletaCobroDB,
  PensionCuotaDB,
  UsuarioSesion,
} from '../../types/progresa';
import './Tesoreria.css';

interface TesoreriaProps {
  usuario?: UsuarioSesion | null;
  onLogout?: () => void;
}

export const Tesoreria: React.FC<TesoreriaProps> = ({ usuario, onLogout }) => {
  const [pensiones, setPensiones] = useState<PensionCuotaDB[]>([]);
  const [boletasCobros, setBoletasCobros] = useState<BoletaCobroDB[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  // Formulario 1: Foto de boleta de alumno
  const [numComprobanteFoto, setNumComprobanteFoto] = useState('');
  const [alumnoNombreFoto, setAlumnoNombreFoto] = useState('');
  const [codigoAlumnoFoto, setCodigoAlumnoFoto] = useState('');
  const [conceptoFoto, setConceptoFoto] = useState('Pensión Ciclo 2026-II');
  const [montoFoto, setMontoFoto] = useState('');
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [guardandoFoto, setGuardandoFoto] = useState(false);

  // Formulario 2: Cobro de otra entidad
  const [numComprobanteEntidad, setNumComprobanteEntidad] = useState('');
  const [nombreEntidad, setNombreEntidad] = useState('');
  const [codigoRefEntidad, setCodigoRefEntidad] = useState('');
  const [conceptoEntidad, setConceptoEntidad] = useState('');
  const [detalleEntidad, setDetalleEntidad] = useState('');
  const [montoEntidad, setMontoEntidad] = useState('');
  const [guardandoEntidad, setGuardandoEntidad] = useState(false);

  const cargarDatosTesoreria = async () => {
    setCargando(true);
    setErrorMsg(null);
    try {
      const [pensionesData, comprobantesData] = await Promise.all([
        obtenerPensionesCuotas(),
        obtenerBoletasCobros(),
      ]);
      setPensiones(pensionesData);
      setBoletasCobros(comprobantesData);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error cargando datos de tesorería.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosTesoreria();
  }, []);

  const handleRegistrarFotoAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMensajeOk(null);

    const montoNum = Number(montoFoto);
    if (!numComprobanteFoto.trim() || !alumnoNombreFoto.trim() || !codigoAlumnoFoto.trim() || !conceptoFoto.trim() || Number.isNaN(montoNum) || montoNum <= 0) {
      setErrorMsg('Completa todos los campos de la boleta del alumno con un monto válido.');
      return;
    }

    setGuardandoFoto(true);
    try {
      const nuevo = await registrarBoletaFotoAlumno({
        institucionId: usuario?.institucion_id ?? null,
        numeroComprobante: numComprobanteFoto,
        entidadOAlumno: alumnoNombreFoto,
        codigoReferencia: codigoAlumnoFoto,
        concepto: conceptoFoto,
        monto: montoNum,
        fotoArchivo: archivoFoto,
      });

      setBoletasCobros((prev) => [nuevo, ...prev]);
      setNumComprobanteFoto('');
      setAlumnoNombreFoto('');
      setCodigoAlumnoFoto('');
      setMontoFoto('');
      setArchivoFoto(null);
      setMensajeOk(`Boleta ${nuevo.numero_comprobante} registrada.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar boleta de alumno.');
    } finally {
      setGuardandoFoto(false);
    }
  };

  const handleRegistrarOtraEntidad = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMensajeOk(null);

    const montoNum = Number(montoEntidad);
    if (!numComprobanteEntidad.trim() || !nombreEntidad.trim() || !codigoRefEntidad.trim() || !conceptoEntidad.trim() || Number.isNaN(montoNum) || montoNum <= 0) {
      setErrorMsg('Completa todos los campos del cobro de otra entidad con un monto válido.');
      return;
    }

    setGuardandoEntidad(true);
    try {
      const nuevo = await registrarCobroOtraEntidad({
        institucionId: usuario?.institucion_id ?? null,
        numeroComprobante: numComprobanteEntidad,
        entidadNombre: nombreEntidad,
        codigoReferencia: codigoRefEntidad,
        concepto: conceptoEntidad,
        detalleEntidad,
        monto: montoNum,
      });

      setBoletasCobros((prev) => [nuevo, ...prev]);
      setNumComprobanteEntidad('');
      setNombreEntidad('');
      setCodigoRefEntidad('');
      setConceptoEntidad('');
      setDetalleEntidad('');
      setMontoEntidad('');
      setMensajeOk(`Cobro de otra entidad ${nuevo.numero_comprobante} registrado.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar cobro de otra entidad.');
    } finally {
      setGuardandoEntidad(false);
    }
  };

  const handleCambioEstado = async (
    id: number,
    estado: 'Pendiente' | 'Validado' | 'Observado'
  ) => {
    setErrorMsg(null);
    try {
      const actualizado = await actualizarEstadoBoletaCobro(id, estado);
      setBoletasCobros((prev) =>
        prev.map((item) => (item.id === id ? actualizado : item))
      );
      setMensajeOk(`Comprobante ${actualizado.numero_comprobante} marcado como ${estado}.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al actualizar estado.');
    }
  };

  return (
    <div className="tesoreria-container" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1>Módulo de Tesorería</h1>
          <p>
            {usuario
              ? `${usuario.nombres} ${usuario.apellidos} (${usuario.codigo})`
              : 'Pensiones, fotos de boletas y cobros de otras entidades'}
          </p>
        </div>
        {onLogout && (
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        )}
      </div>

      {cargando && <p>Cargando pensiones y comprobantes desde Supabase...</p>}
      {errorMsg && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{errorMsg}</div>}
      {mensajeOk && <div style={{ color: '#15803d', marginBottom: 12 }}>{mensajeOk}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 28 }}>
        <form onSubmit={handleRegistrarFotoAlumno} style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h2>Registrar Boleta con Foto de Alumno</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            <input
              type="text"
              placeholder="N° Comprobante (Ej: FOT-2026-093)"
              value={numComprobanteFoto}
              onChange={(e) => setNumComprobanteFoto(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nombres y apellidos del alumno"
              value={alumnoNombreFoto}
              onChange={(e) => setAlumnoNombreFoto(e.target.value)}
            />
            <input
              type="text"
              placeholder="Código de alumno (Ej: 20241089)"
              value={codigoAlumnoFoto}
              onChange={(e) => setCodigoAlumnoFoto(e.target.value)}
            />
            <input
              type="text"
              placeholder="Concepto de pago"
              value={conceptoFoto}
              onChange={(e) => setConceptoFoto(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Monto (S/)"
              value={montoFoto}
              onChange={(e) => setMontoFoto(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setArchivoFoto(e.target.files?.[0] ?? null)}
            />
            <button type="submit" disabled={guardandoFoto}>
              {guardandoFoto ? 'Guardando...' : 'Guardar Boleta (Foto)'}
            </button>
          </div>
        </form>

        <form onSubmit={handleRegistrarOtraEntidad} style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h2>Registrar Cobro de Otra Entidad</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            <input
              type="text"
              placeholder="N° Comprobante / Lote (Ej: ENT-2026-306)"
              value={numComprobanteEntidad}
              onChange={(e) => setNumComprobanteEntidad(e.target.value)}
            />
            <input
              type="text"
              placeholder="Entidad o Convenio (Ej: Banco / Pasarela / Caja)"
              value={nombreEntidad}
              onChange={(e) => setNombreEntidad(e.target.value)}
            />
            <input
              type="text"
              placeholder="Código de referencia / Operación"
              value={codigoRefEntidad}
              onChange={(e) => setCodigoRefEntidad(e.target.value)}
            />
            <input
              type="text"
              placeholder="Concepto del cobro"
              value={conceptoEntidad}
              onChange={(e) => setConceptoEntidad(e.target.value)}
            />
            <input
              type="text"
              placeholder="Detalle adicional (opcional)"
              value={detalleEntidad}
              onChange={(e) => setDetalleEntidad(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Monto (S/)"
              value={montoEntidad}
              onChange={(e) => setMontoEntidad(e.target.value)}
            />
            <button type="submit" disabled={guardandoEntidad}>
              {guardandoEntidad ? 'Registrando...' : 'Registrar Cobro de Entidad'}
            </button>
          </div>
        </form>
      </div>

      <section style={{ marginBottom: 28 }}>
        <h2>Boletas y Cobros ({boletasCobros.length})</h2>
        <ul>
          {boletasCobros.map((item) => (
            <li key={item.id} style={{ marginBottom: 10 }}>
              <strong>{item.numero_comprobante}</strong> · [{item.origen}] ·{' '}
              {item.entidad_o_alumno} ({item.codigo_referencia}) — {item.concepto} —{' '}
              <strong>S/ {Number(item.monto).toFixed(2)}</strong> — Estado:{' '}
              <strong>{item.estado}</strong>
              {item.foto_url && (
                <>
                  {' '}
                  ·{' '}
                  <a href={item.foto_url} target="_blank" rel="noreferrer">
                    Ver foto ({item.foto_nombre_archivo || 'comprobante'})
                  </a>
                </>
              )}
              <div style={{ display: 'inline-flex', gap: 6, marginLeft: 10 }}>
                <button type="button" onClick={() => handleCambioEstado(item.id, 'Validado')}>
                  Validar
                </button>
                <button type="button" onClick={() => handleCambioEstado(item.id, 'Observado')}>
                  Observar
                </button>
                <button type="button" onClick={() => handleCambioEstado(item.id, 'Pendiente')}>
                  Pendiente
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Pensiones y Cuotas ({pensiones.length})</h2>
        <ul>
          {pensiones.map((p) => (
            <li key={p.id}>
              {p.boleta} — {p.estudiante_nombre} ({p.codigo_estudiante}) · {p.concepto} ·{' '}
              {p.medio} · <strong>S/ {Number(p.monto).toFixed(2)}</strong> · {p.estado}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Tesoreria;