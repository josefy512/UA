import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en las variables de entorno.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export const STORAGE_BUCKETS = {
  BOLETAS_FOTOS: 'boletas-fotos',
  SILABOS_PDF: 'silabos-pdf',
} as const;