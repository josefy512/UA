import { supabase, STORAGE_BUCKETS } from './supabase';
import type {
  AsistenciaDB,
  BoletaCobroDB,
  CalificacionDB,
  CursoSilaboDB,
  DocenteDB,
  EstudianteDB,
  FutDB,
  HorarioDB,
  PensionCuotaDB,
  RolUsuario,
  UsuarioSesion,
} from '../types/progresa';

export async function autenticarUsuario(
  identificador: string,
  password: string
): Promise<{ usuario: UsuarioSesion | null; error: string | null }> {
  const limpio = identificador.trim();
  if (!limpio || !password.trim()) {
    return { usuario: null, error: 'Ingresa tu código o correo y contraseña.' };
  }

  const { data: users, error } = await supabase
    .from('usuarios')
    .select('id, institucion_id, codigo, nombres, apellidos, email, password_hash, rol, especialidad, activo')
    .or(`codigo.eq.${limpio},email.ilike.${limpio}`)
    .limit(1);

  if (error) {
    return { usuario: null, error: error.message };
  }

  const user = users?.[0];
  if (user) {
    if (user.activo === false) {
      return { usuario: null, error: 'Tu usuario se encuentra inactivo.' };
    }
    if (user.password_hash !== password) {
      return { usuario: null, error: 'Contraseña incorrecta.' };
    }

    return {
      usuario: {
        id: user.id,
        institucion_id: user.institucion_id,
        codigo: user.codigo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol as RolUsuario,
        especialidad: user.especialidad,
        activo: user.activo,
      },
      error: null,
    };
  }

  // Respaldo para alumno registrado en estudiantes
  const { data: ests, error: estErr } = await supabase
    .from('estudiantes')
    .select('id, institucion_id, codigo, nombres, apellidos, gmail, carrera, contrasena')
    .or(`codigo.eq.${limpio},gmail.ilike.${limpio}`)
    .limit(1);

  if (estErr || !ests?.[0]) {
    return { usuario: null, error: 'Usuario no encontrado.' };
  }

  const est = ests[0];
  if (est.contrasena && est.contrasena !== password) {
    return { usuario: null, error: 'Contraseña incorrecta.' };
  }

  return {
    usuario: {
      id: est.id,
      institucion_id: est.institucion_id,
      codigo: est.codigo,
      nombres: est.nombres,
      apellidos: est.apellidos,
      email: est.gmail,
      rol: 'alumno',
      especialidad: est.carrera,
      activo: true,
    },
    error: null,
  };
}

export async function obtenerCursosConSilabo(): Promise<CursoSilaboDB[]> {
  const { data, error } = await supabase
    .from('cursos')
    .select('*')
    .order('codigo', { ascending: true });

  if (error) throw error;
  return (data ?? []) as CursoSilaboDB[];
}

export async function subirSilaboPdf(params: {
  cursoId: number;
  cursoCodigo: string;
  periodo: string;
  silaboTitulo: string;
  archivo: File;
}): Promise<CursoSilaboDB> {
  const { cursoId, cursoCodigo, periodo, silaboTitulo, archivo } = params;
  const nombreSanitizado = archivo.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${periodo}/${cursoCodigo}_${Date.now()}_${nombreSanitizado}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.SILABOS_PDF)
    .upload(storagePath, archivo, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: pubUrlData } = supabase.storage
    .from(STORAGE_BUCKETS.SILABOS_PDF)
    .getPublicUrl(storagePath);

  const { data, error: dbError } = await supabase
    .from('cursos')
    .update({
      silabo_titulo: silaboTitulo.trim() || `Sílabo ${cursoCodigo}`,
      silabo_nombre_archivo: archivo.name,
      silabo_storage_path: storagePath,
      silabo_url: pubUrlData.publicUrl,
      silabo_tamano_bytes: archivo.size,
      silabo_subido_en: new Date().toISOString(),
    })
    .eq('id', cursoId)
    .select('*')
    .single();

  if (dbError) throw dbError;
  return data as CursoSilaboDB;
}

export async function obtenerBoletasCobros(): Promise<BoletaCobroDB[]> {
  const { data, error } = await supabase
    .from('boletas_cobros')
    .select('*')
    .order('creado_en', { ascending: false });

  if (error) throw error;
  return (data ?? []) as BoletaCobroDB[];
}

export async function registrarBoletaFotoAlumno(params: {
  institucionId?: number | null;
  estudianteId?: number | null;
  numeroComprobante: string;
  entidadOAlumno: string;
  codigoReferencia: string;
  concepto: string;
  monto: number;
  fotoArchivo?: File | null;
}): Promise<BoletaCobroDB> {
  let fotoNombre: string | null = null;
  let fotoPath: string | null = null;
  let fotoUrl: string | null = null;
  let fotoMime: string | null = null;

  if (params.fotoArchivo) {
    const limpio = params.fotoArchivo.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    fotoPath = `alumnos/${params.codigoReferencia}_${Date.now()}_${limpio}`;
    fotoNombre = params.fotoArchivo.name;
    fotoMime = params.fotoArchivo.type || 'image/jpeg';

    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKETS.BOLETAS_FOTOS)
      .upload(fotoPath, params.fotoArchivo, {
        contentType: fotoMime,
        upsert: true,
      });

    if (upErr) throw upErr;

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS.BOLETAS_FOTOS)
      .getPublicUrl(fotoPath);
    fotoUrl = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from('boletas_cobros')
    .insert({
      institucion_id: params.institucionId ?? null,
      estudiante_id: params.estudianteId ?? null,
      numero_comprobante: params.numeroComprobante.trim(),
      origen: 'Alumno (Foto)',
      entidad_o_alumno: params.entidadOAlumno.trim(),
      codigo_referencia: params.codigoReferencia.trim(),
      concepto: params.concepto.trim(),
      detalle_entidad: 'Comprobante fotográfico subido por alumno',
      monto: params.monto,
      estado: 'Pendiente',
      foto_nombre_archivo: fotoNombre,
      foto_storage_path: fotoPath,
      foto_url: fotoUrl,
      foto_mime_type: fotoMime,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as BoletaCobroDB;
}

export async function registrarCobroOtraEntidad(params: {
  institucionId?: number | null;
  numeroComprobante: string;
  entidadNombre: string;
  codigoReferencia: string;
  concepto: string;
  detalleEntidad?: string;
  monto: number;
}): Promise<BoletaCobroDB> {
  const { data, error } = await supabase
    .from('boletas_cobros')
    .insert({
      institucion_id: params.institucionId ?? null,
      estudiante_id: null,
      numero_comprobante: params.numeroComprobante.trim(),
      origen: 'Otra Entidad',
      entidad_o_alumno: params.entidadNombre.trim(),
      codigo_referencia: params.codigoReferencia.trim(),
      concepto: params.concepto.trim(),
      detalle_entidad: params.detalleEntidad?.trim() || 'Entidad / Convenio Externo',
      monto: params.monto,
      estado: 'Validado',
      validado_en: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as BoletaCobroDB;
}

export async function actualizarEstadoBoletaCobro(
  id: number,
  estado: 'Pendiente' | 'Validado' | 'Observado'
): Promise<BoletaCobroDB> {
  const { data, error } = await supabase
    .from('boletas_cobros')
    .update({
      estado,
      validado_en: estado === 'Validado' ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as BoletaCobroDB;
}

export async function obtenerPensionesCuotas(): Promise<PensionCuotaDB[]> {
  const { data, error } = await supabase
    .from('pensiones_cuotas')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PensionCuotaDB[];
}

export async function obtenerFuts(): Promise<FutDB[]> {
  const { data, error } = await supabase
    .from('futs')
    .select('*')
    .order('fecha_solicitud', { ascending: false });

  if (error) throw error;
  return (data ?? []) as FutDB[];
}

export async function obtenerEstudiantes(): Promise<EstudianteDB[]> {
  const { data, error } = await supabase
    .from('estudiantes')
    .select('*')
    .order('codigo', { ascending: true });

  if (error) throw error;
  return (data ?? []) as EstudianteDB[];
}

export async function obtenerDocentes(): Promise<DocenteDB[]> {
  const { data, error } = await supabase
    .from('docentes')
    .select('*')
    .order('codigo', { ascending: true });

  if (error) throw error;
  return (data ?? []) as DocenteDB[];
}

export async function obtenerHorarios(): Promise<HorarioDB[]> {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return (data ?? []) as HorarioDB[];
}

export async function obtenerCalificaciones(): Promise<CalificacionDB[]> {
  const { data, error } = await supabase
    .from('calificaciones')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CalificacionDB[];
}

export async function obtenerAsistencias(): Promise<AsistenciaDB[]> {
  const { data, error } = await supabase
    .from('asistencias')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) throw error;
  return (data ?? []) as AsistenciaDB[];
}

export async function resolverFutDireccion(params: {
  id: number;
  estado: 'Pendiente' | 'Aprobado' | 'Observado' | 'Rechazado';
  observacionDireccion?: string;
}): Promise<FutDB> {
  const { data, error } = await supabase
    .from('futs')
    .update({
      estado: params.estado,
      observacion_direccion: params.observacionDireccion?.trim() || null,
      resuelto_en: params.estado === 'Pendiente' ? null : new Date().toISOString(),
    })
    .eq('id', params.id)
    .select('*')
    .single();

  if (error) throw error;
  return data as FutDB;
}

export async function crearFutAlumno(params: {
  institucionId?: number | null;
  estudianteId?: number | null;
  nombresApellidos: string;
  codigoEstudiante?: string | null;
  sumilla: string;
  fundamento: string;
  adjuntoNombre?: string | null;
  adjuntoUrl?: string | null;
}): Promise<FutDB> {
  const { data, error } = await supabase
    .from('futs')
    .insert({
      institucion_id: params.institucionId ?? null,
      estudiante_id: params.estudianteId ?? null,
      nombres_apellidos: params.nombresApellidos.trim(),
      codigo_estudiante: params.codigoEstudiante?.trim() || null,
      sumilla: params.sumilla.trim(),
      fundamento: params.fundamento.trim(),
      adjunto_nombre: params.adjuntoNombre?.trim() || null,
      adjunto_url: params.adjuntoUrl?.trim() || null,
      estado: 'Pendiente',
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as FutDB;
}

const CACHE_PREFIX = 'progresa_cache_v1_';

export function guardarCacheLocal<T>(clave: string, datos: T): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${clave}`, JSON.stringify(datos));
  } catch {
    // Ignorar si localStorage está lleno o restringido
  }
}

export function leerCacheLocal<T>(clave: string): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${clave}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function sincronizarCacheGeneral(): Promise<{
  cursos: CursoSilaboDB[];
  horarios: HorarioDB[];
  estudiantes: EstudianteDB[];
  docentes: DocenteDB[];
  calificaciones: CalificacionDB[];
  asistencias: AsistenciaDB[];
  futs: FutDB[];
  pensiones: PensionCuotaDB[];
  boletasCobros: BoletaCobroDB[];
}> {
  const cached = {
    cursos: leerCacheLocal<CursoSilaboDB[]>('cursos') ?? [],
    horarios: leerCacheLocal<HorarioDB[]>('horarios') ?? [],
    estudiantes: leerCacheLocal<EstudianteDB[]>('estudiantes') ?? [],
    docentes: leerCacheLocal<DocenteDB[]>('docentes') ?? [],
    calificaciones: leerCacheLocal<CalificacionDB[]>('calificaciones') ?? [],
    asistencias: leerCacheLocal<AsistenciaDB[]>('asistencias') ?? [],
    futs: leerCacheLocal<FutDB[]>('futs') ?? [],
    pensiones: leerCacheLocal<PensionCuotaDB[]>('pensiones') ?? [],
    boletasCobros: leerCacheLocal<BoletaCobroDB[]>('boletas_cobros') ?? [],
  };

  try {
    const [
      cursos,
      horarios,
      estudiantes,
      docentes,
      calificaciones,
      asistencias,
      futs,
      pensiones,
      boletasCobros,
    ] = await Promise.all([
      obtenerCursosConSilabo(),
      obtenerHorarios(),
      obtenerEstudiantes(),
      obtenerDocentes(),
      obtenerCalificaciones(),
      obtenerAsistencias(),
      obtenerFuts(),
      obtenerPensionesCuotas(),
      obtenerBoletasCobros(),
    ]);

    guardarCacheLocal('cursos', cursos);
    guardarCacheLocal('horarios', horarios);
    guardarCacheLocal('estudiantes', estudiantes);
    guardarCacheLocal('docentes', docentes);
    guardarCacheLocal('calificaciones', calificaciones);
    guardarCacheLocal('asistencias', asistencias);
    guardarCacheLocal('futs', futs);
    guardarCacheLocal('pensiones', pensiones);
    guardarCacheLocal('boletas_cobros', boletasCobros);

    return {
      cursos,
      horarios,
      estudiantes,
      docentes,
      calificaciones,
      asistencias,
      futs,
      pensiones,
      boletasCobros,
    };
  } catch {
    return cached;
  }
}