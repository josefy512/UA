import React, { useEffect, useState } from 'react';
import {
  obtenerCursosConSilabo,
  obtenerEstudiantes,
  obtenerHorarios,
  subirSilaboPdf,
} from '../../lib/progresaApi';
import type {
  CursoSilaboDB,
  EstudianteDB,
  HorarioDB,
  UsuarioSesion,
} from '../../types/progresa';
import './Docentes.css';

interface DocentesProps {
  usuario?: UsuarioSesion | null;
  onLogout?: () => void;
}

export const Docentes: React.FC<DocentesProps> = ({ usuario, onLogout }) => {
  const [cursos, setCursos] = useState<CursoSilaboDB[]>([]);
  const [horarios, setHorarios] = useState<HorarioDB[]>([]);
  const [estudiantes, setEstudiantes] = useState<EstudianteDB[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estado para subida de sílabo en PDF
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState<number | ''>('');
  const [silaboTitulo, setSilaboTitulo] = useState('');
  const [archivoPdf, setArchivoPdf] = useState<File | null>(null);
  const [subiendoPdf, setSubiendoPdf] = useState(false);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  const cargarDatosDocente = async () => {
    setCargando(true);
    setErrorMsg(null);
    try {
      const [cursosData, horariosData, estudiantesData] = await Promise.all([
        obtenerCursosConSilabo(),
        obtenerHorarios(),
        obtenerEstudiantes(),
      ]);
      setCursos(cursosData);
      setHorarios(horariosData);
      setEstudiantes(estudiantesData);

      if (cursosData.length > 0 && cursoSeleccionadoId === '') {
        setCursoSeleccionadoId(cursosData[0].id);
        setSilaboTitulo(cursosData[0].silabo_titulo ?? `Sílabo ${cursosData[0].codigo}`);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error cargando datos de docentes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosDocente();
  }, []);

  const handleSeleccionCurso = (idValor: string) => {
    const idNum = Number(idValor);
    setCursoSeleccionadoId(idNum);
    const encontrado = cursos.find((c) => c.id === idNum);
    if (encontrado) {
      setSilaboTitulo(encontrado.silabo_titulo ?? `Sílabo ${encontrado.codigo}`);
    }
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setArchivoPdf(null);
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Solo se permiten archivos en formato PDF para el sílabo.');
      setArchivoPdf(null);
      return;
    }
    setErrorMsg(null);
    setArchivoPdf(file);
  };

  const handleSubirSilabo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeOk(null);
    setErrorMsg(null);

    if (!cursoSeleccionadoId || !archivoPdf) {
      setErrorMsg('Selecciona un curso y adjunta un archivo PDF.');
      return;
    }

    const curso = cursos.find((c) => c.id === Number(cursoSeleccionadoId));
    if (!curso) {
      setErrorMsg('Curso no encontrado.');
      return;
    }

    setSubiendoPdf(true);
    try {
      const cursoActualizado = await subirSilaboPdf({
        cursoId: curso.id,
        cursoCodigo: curso.codigo,
        periodo: curso.periodo || '2026-II',
        silaboTitulo: silaboTitulo || `Sílabo ${curso.codigo}`,
        archivo: archivoPdf,
      });

      setCursos((prev) =>
        prev.map((item) => (item.id === cursoActualizado.id ? cursoActualizado : item))
      );
      setArchivoPdf(null);
      setMensajeOk(`Sílabo PDF subido y vinculado a ${curso.nombre}.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al subir el sílabo en PDF.');
    } finally {
      setSubiendoPdf(false);
    }
  };

  return (
    <div className="docentes-container" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1>Módulo de Docentes</h1>
          <p>
            {usuario
              ? `${usuario.nombres} ${usuario.apellidos} (${usuario.codigo})`
              : 'Gestión académica y sílabos'}
          </p>
        </div>
        {onLogout && (
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        )}
      </div>

      {cargando && <p>Cargando cursos, horarios y estudiantes desde Supabase...</p>}
      {errorMsg && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{errorMsg}</div>}
      {mensajeOk && <div style={{ color: '#15803d', marginBottom: 12 }}>{mensajeOk}</div>}

      <section style={{ marginBottom: 28, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <h2>Subir Sílabo en PDF (Bucket: silabos-pdf)</h2>
        <form onSubmit={handleSubirSilabo} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
          <div>
            <label htmlFor="curso-silabo">Curso</label>
            <select
              id="curso-silabo"
              value={cursoSeleccionadoId}
              onChange={(e) => handleSeleccionCurso(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            >
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.codigo} - {c.nombre} ({c.grupo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="titulo-silabo">Título del sílabo</label>
            <input
              id="titulo-silabo"
              type="text"
              value={silaboTitulo}
              onChange={(e) => setSilaboTitulo(e.target.value)}
              placeholder="Ej: Sílabo Bases de Datos 2026-II"
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div>
            <label htmlFor="archivo-silabo-pdf">Archivo PDF</label>
            <input
              id="archivo-silabo-pdf"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleArchivoChange}
              style={{ display: 'block', marginTop: 4 }}
            />
          </div>

          <button type="submit" disabled={subiendoPdf} style={{ padding: '10px 16px', width: 'fit-content' }}>
            {subiendoPdf ? 'Subiendo PDF...' : 'Guardar Sílabo PDF'}
          </button>
        </form>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Cursos y Sílabos ({cursos.length})</h2>
        <ul>
          {cursos.map((curso) => (
            <li key={curso.id} style={{ marginBottom: 8 }}>
              <strong>{curso.codigo}</strong> · {curso.nombre} ({curso.grupo}) —{' '}
              {curso.silabo_url ? (
                <a href={curso.silabo_url} target="_blank" rel="noreferrer">
                  Ver/Descargar PDF ({curso.silabo_nombre_archivo || 'Sílabo'})
                </a>
              ) : (
                <span>Sin PDF vinculado ({curso.silabo_nombre_archivo || 'Pendiente'})</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Horarios ({horarios.length})</h2>
        <ul>
          {horarios.map((h) => (
            <li key={h.id}>
              {h.dia_semana} · {h.hora_inicio} - {h.hora_fin} · {h.aula} ({h.grupo})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Estudiantes ({estudiantes.length})</h2>
        <ul>
          {estudiantes.map((est) => (
            <li key={est.id}>
              {est.codigo} — {est.apellidos}, {est.nombres} ({est.grupo})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Docentes;